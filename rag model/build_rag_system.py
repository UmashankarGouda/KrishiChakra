"""
COMPLETE RAG SYSTEM - Crop Rotation Knowledge Base
- Processes all 30 cleaned documents
- Uses YOUR API for embeddings
- Stores locally in ChromaDB
- Multiple LLM fallbacks for safety
"""

from openai import OpenAI
import chromadb
import os
from typing import List, Dict
import time

# ============================================================================
# CONFIGURATION
# ============================================================================

API_KEY = "ddc-a4f-af21ceb75c0a47d4afb3b4f5d0dd5804"
BASE_URL = "https://api.a4f.co/v1"

# Embedding Model (for converting text to vectors)
EMBEDDING_MODEL = "provider-6/qwen3-embedding-4b"

# LLM Models for Answer Generation (with fallbacks)
LLM_MODELS = [
    "provider-3/gemini-2.5-flash-lite-preview-09-2025",  # Primary: Fast & good
    "provider-3/deepseek-v3",                             # Fallback 1: Reliable
    "provider-3/qwen-2.5-72b"                            # Fallback 2: Powerful
]

# Paths
CLEANED_DOCS_FOLDER = "cleaned"
CHROMA_DB_PATH = "./chroma_db"
COLLECTION_NAME = "crop_rotation_knowledge"

# Chunking settings
CHUNK_SIZE = 500  # words per chunk
CHUNK_OVERLAP = 50  # words overlap between chunks

# Rate limiting (5 requests per minute for embeddings)
EMBEDDING_BATCH_SIZE = 4  # Process 4 at a time
EMBEDDING_DELAY = 15  # Wait 15 seconds between batches

# ============================================================================
# STEP 1: TEXT CHUNKING
# ============================================================================

def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """Split text into overlapping chunks"""
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        if len(chunk.strip()) > 50:  # Skip very small chunks
            chunks.append(chunk)
    
    return chunks

# ============================================================================
# STEP 2: EMBEDDING CREATION
# ============================================================================

def create_embedding(text: str, max_retries: int = 3) -> List[float]:
    """Create embedding using YOUR API with retry logic"""
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
    
    for attempt in range(max_retries):
        try:
            response = client.embeddings.create(
                model=EMBEDDING_MODEL,
                input=text[:8000]  # Limit text length
            )
            return response.data[0].embedding
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 2
                print(f"    ⚠️  Retry in {wait_time}s... (Error: {str(e)[:50]})")
                time.sleep(wait_time)
            else:
                raise e

# ============================================================================
# STEP 3: PROCESS ALL DOCUMENTS
# ============================================================================

def process_all_documents():
    """Load all 30 cleaned documents, chunk them, and store in ChromaDB"""
    
    print("="*70)
    print("📚 PROCESSING ALL DOCUMENTS")
    print("="*70)
    
    # Initialize ChromaDB
    chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    
    # Delete existing collection if it exists (fresh start)
    try:
        chroma_client.delete_collection(COLLECTION_NAME)
        print("🗑️  Cleared existing database")
    except:
        pass
    
    collection = chroma_client.create_collection(name=COLLECTION_NAME)
    
    # Get all cleaned documents
    doc_files = [f for f in os.listdir(CLEANED_DOCS_FOLDER) if f.endswith('.txt')]
    total_files = len(doc_files)
    
    print(f"\n📂 Found {total_files} cleaned documents")
    print(f"🔧 Chunk size: {CHUNK_SIZE} words, Overlap: {CHUNK_OVERLAP} words")
    print(f"🤖 Embedding model: {EMBEDDING_MODEL}\n")
    
    total_chunks = 0
    request_count = 0
    
    for idx, filename in enumerate(doc_files, 1):
        try:
            print(f"[{idx}/{total_files}] Processing: {filename}")
            
            # Read document
            filepath = os.path.join(CLEANED_DOCS_FOLDER, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Chunk the document
            chunks = chunk_text(content)
            print(f"    📄 Created {len(chunks)} chunks")
            
            # Create embeddings and store
            for chunk_idx, chunk in enumerate(chunks):
                try:
                    # Rate limiting: wait after every EMBEDDING_BATCH_SIZE requests
                    if request_count > 0 and request_count % EMBEDDING_BATCH_SIZE == 0:
                        print(f"    ⏳ Rate limit: waiting {EMBEDDING_DELAY}s...")
                        time.sleep(EMBEDDING_DELAY)
                    
                    # Create embedding
                    embedding = create_embedding(chunk)
                    request_count += 1
                    
                    # Store in ChromaDB
                    chunk_id = f"{filename}_chunk_{chunk_idx}"
                    collection.add(
                        documents=[chunk],
                        embeddings=[embedding],
                        metadatas=[{
                            "source": filename,
                            "chunk_index": chunk_idx,
                            "total_chunks": len(chunks)
                        }],
                        ids=[chunk_id]
                    )
                    
                    total_chunks += 1
                    
                except Exception as e:
                    print(f"    ❌ Error on chunk {chunk_idx}: {e}")
            
            print(f"    ✅ Stored {len(chunks)} chunks")
            
        except Exception as e:
            print(f"    ❌ Error processing {filename}: {e}")
    
    print(f"\n{'='*70}")
    print(f"✅ INDEXING COMPLETE!")
    print(f"   Total documents: {total_files}")
    print(f"   Total chunks indexed: {total_chunks}")
    print(f"   Database location: {CHROMA_DB_PATH}/")
    print(f"{'='*70}\n")
    
    return collection

# ============================================================================
# STEP 4: RETRIEVAL (Search for Relevant Chunks)
# ============================================================================

def retrieve_context(query: str, collection, top_k: int = 5) -> List[Dict]:
    """Search ChromaDB for relevant chunks"""
    
    # Create embedding for query
    query_embedding = create_embedding(query)
    
    # Search database
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    
    # Format results
    context_chunks = []
    for i in range(len(results['documents'][0])):
        context_chunks.append({
            'text': results['documents'][0][i],
            'source': results['metadatas'][0][i]['source'],
            'chunk_index': results['metadatas'][0][i]['chunk_index']
        })
    
    return context_chunks

# ============================================================================
# STEP 5: AUGMENTATION (Generate Answer with LLM + Fallbacks)
# ============================================================================

def generate_answer(query: str, context_chunks: List[Dict]) -> str:
    """Generate answer using LLM with multiple fallbacks"""
    
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
    
    # Build context from retrieved chunks
    context = "\n\n".join([
        f"[Source: {chunk['source']}]\n{chunk['text']}" 
        for chunk in context_chunks
    ])
    
    # Create prompt
    prompt = f"""You are an expert agricultural advisor specializing in crop rotation systems.

Based ONLY on the following research documents, answer the user's question accurately and comprehensively.

RESEARCH CONTEXT:
{context}

USER QUESTION: {query}

INSTRUCTIONS:
- Answer based ONLY on the provided research context
- If the context doesn't contain enough information, say so
- Cite specific findings from the research
- Be practical and actionable for farmers
- Use clear, concise language

ANSWER:"""
    
    # Try each model with fallback
    for model_idx, model in enumerate(LLM_MODELS, 1):
        try:
            print(f"    🤖 Trying model {model_idx}/{len(LLM_MODELS)}: {model}")
            
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are an expert agricultural advisor."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=800
            )
            
            answer = response.choices[0].message.content
            print(f"    ✅ Success with {model}!")
            return answer
            
        except Exception as e:
            print(f"    ❌ Failed: {str(e)[:50]}")
            if model_idx < len(LLM_MODELS):
                print(f"    🔄 Falling back to next model...")
                time.sleep(2)
            else:
                return f"Error: All models failed. Last error: {str(e)}"
    
    return "Error: Could not generate answer"

# ============================================================================
# STEP 6: COMPLETE RAG QUERY FUNCTION
# ============================================================================

def query_rag(question: str, collection, verbose: bool = True) -> Dict:
    """Complete RAG pipeline: Retrieve + Augment + Generate"""
    
    if verbose:
        print("\n" + "="*70)
        print("🔍 RAG QUERY")
        print("="*70)
        print(f"\n❓ Question: {question}\n")
    
    # Step 1: Retrieve relevant chunks
    if verbose:
        print("📖 Step 1: Retrieving relevant documents...")
    context_chunks = retrieve_context(question, collection, top_k=5)
    
    if verbose:
        print(f"    ✅ Found {len(context_chunks)} relevant chunks\n")
        for i, chunk in enumerate(context_chunks, 1):
            print(f"    {i}. [{chunk['source']}] {chunk['text'][:80]}...")
    
    # Step 2: Generate answer
    if verbose:
        print(f"\n🤖 Step 2: Generating answer...")
    answer = generate_answer(question, context_chunks)
    
    return {
        'question': question,
        'answer': answer,
        'sources': [chunk['source'] for chunk in context_chunks],
        'context': context_chunks
    }

# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    
    print("\n" + "="*70)
    print("🌾 CROP ROTATION RAG SYSTEM - FULL BUILD")
    print("="*70)
    
    # Check if database already exists
    if os.path.exists(CHROMA_DB_PATH):
        response = input("\n⚠️  Database exists. Rebuild? (y/n): ").lower()
        if response == 'y':
            collection = process_all_documents()
        else:
            print("\n📂 Loading existing database...")
            chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
            collection = chroma_client.get_collection(COLLECTION_NAME)
            print(f"✅ Loaded collection: {collection.count()} chunks\n")
    else:
        collection = process_all_documents()
    
    # Test queries
    print("\n" + "="*70)
    print("🧪 TESTING RAG SYSTEM")
    print("="*70)
    
    test_questions = [
        "What are the benefits of rice-wheat crop rotation in India?",
        "How does crop rotation improve soil health?",
    ]
    
    for question in test_questions:
        result = query_rag(question, collection, verbose=True)
        print(f"\n✅ ANSWER:\n{result['answer']}\n")
        print(f"📚 Sources: {', '.join(set(result['sources']))}\n")
        print("="*70)
    
    print("\n✅ RAG System ready! Use query_rag() function to ask questions.")
