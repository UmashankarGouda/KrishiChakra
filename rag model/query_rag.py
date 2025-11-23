"""
Simple RAG Query Interface
Use this to ask questions WITHOUT rebuilding the database
"""

from openai import OpenAI
import chromadb
from typing import List, Dict
import time

# Configuration
API_KEY = "ddc-a4f-af21ceb75c0a47d4afb3b4f5d0dd5804"
BASE_URL = "https://api.a4f.co/v1"
EMBEDDING_MODEL = "provider-6/qwen3-embedding-4b"

# LLM Models (with fallbacks)
LLM_MODELS = [
    "provider-3/gemini-2.5-flash-lite-preview-09-2025",  # Primary
    "provider-3/deepseek-v3",                             # Fallback 1
    "provider-3/qwen-2.5-72b"                            # Fallback 2
]

CHROMA_DB_PATH = "./chroma_db"
COLLECTION_NAME = "crop_rotation_knowledge"

def create_embedding(text: str) -> List[float]:
    """Create embedding using API"""
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text[:8000]
    )
    return response.data[0].embedding

def retrieve_context(query: str, collection, top_k: int = 5) -> List[Dict]:
    """Search for relevant chunks"""
    query_embedding = create_embedding(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    
    context_chunks = []
    for i in range(len(results['documents'][0])):
        context_chunks.append({
            'text': results['documents'][0][i],
            'source': results['metadatas'][0][i]['source']
        })
    return context_chunks

def generate_answer(query: str, context_chunks: List[Dict]) -> str:
    """Generate answer with LLM fallbacks"""
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
    
    context = "\n\n".join([
        f"[{chunk['source']}]\n{chunk['text']}" 
        for chunk in context_chunks
    ])
    
    prompt = f"""You are an expert agricultural advisor specializing in crop rotation.

Based ONLY on the research context below, answer the user's question.

RESEARCH CONTEXT:
{context}

USER QUESTION: {query}

ANSWER (be practical and cite specific findings):"""
    
    for model in LLM_MODELS:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are an agricultural expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=600
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"❌ {model} failed, trying next...")
            time.sleep(2)
    
    return "Error: All models failed"

def query_rag(question: str):
    """Main query function"""
    print("\n" + "="*70)
    print(f"❓ QUESTION: {question}")
    print("="*70 + "\n")
    
    # Load database
    chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    collection = chroma_client.get_collection(COLLECTION_NAME)
    
    # Retrieve context
    print("🔍 Searching knowledge base...")
    context_chunks = retrieve_context(question, collection, top_k=5)
    
    print(f"✅ Found {len(context_chunks)} relevant documents:\n")
    for i, chunk in enumerate(context_chunks, 1):
        print(f"  {i}. [{chunk['source']}]")
        print(f"     {chunk['text'][:100]}...\n")
    
    # Generate answer
    print("🤖 Generating answer...\n")
    answer = generate_answer(question, context_chunks)
    
    print("="*70)
    print("📝 ANSWER:")
    print("="*70)
    print(f"\n{answer}\n")
    print("="*70)
    print(f"📚 Sources: {', '.join(set([c['source'] for c in context_chunks]))}")
    print("="*70 + "\n")
    
    return answer

# Interactive mode
if __name__ == "__main__":
    print("\n🌾 CROP ROTATION RAG - INTERACTIVE MODE")
    print("="*70 + "\n")
    
    while True:
        question = input("💬 Your question (or 'quit' to exit): ").strip()
        
        if question.lower() in ['quit', 'exit', 'q']:
            print("\n👋 Goodbye!\n")
            break
        
        if not question:
            continue
        
        try:
            query_rag(question)
        except Exception as e:
            print(f"\n❌ Error: {e}\n")
