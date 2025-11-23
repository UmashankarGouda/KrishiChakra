"""
RAG System using YOUR API for embeddings
No need for sentence-transformers!
"""

from openai import OpenAI
import chromadb
import os

# ============================================================================
# CONFIGURATION
# ============================================================================
API_KEY = "ddc-a4f-af21ceb75c0a47d4afb3b4f5d0dd5804"
BASE_URL = "https://api.a4f.co/v1"
EMBEDDING_MODEL = "provider-6/qwen3-embedding-4b"  # Your embedding model!
CHAT_MODEL = "provider-3/deepseek-v3"

# ============================================================================
# STEP 1: CREATE EMBEDDINGS USING YOUR API
# ============================================================================

def create_embedding(text):
    """Create embedding using YOUR API (not local model!)"""
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
    
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text
    )
    
    return response.data[0].embedding

# Test it
print("="*70)
print("🧮 TESTING EMBEDDING CREATION WITH YOUR API")
print("="*70)

test_text = "Rice-wheat crop rotation improves soil health"
print(f"\n📝 Input: '{test_text}'")
print(f"🔗 Using API: {BASE_URL}")
print(f"🤖 Model: {EMBEDDING_MODEL}")

try:
    embedding = create_embedding(test_text)
    print(f"\n✅ SUCCESS!")
    print(f"📊 Embedding generated: {len(embedding)} dimensions")
    print(f"📈 Sample values: {embedding[:5]}...")
except Exception as e:
    print(f"\n❌ Error: {e}")

# ============================================================================
# STEP 2: CHROMADB - LOCAL STORAGE
# ============================================================================

print("\n\n" + "="*70)
print("🗄️ CHROMADB - LOCAL STORAGE LOCATION")
print("="*70)

# Initialize ChromaDB (stores locally)
chroma_client = chromadb.PersistentClient(path="./chroma_db")

print(f"\n📂 Database Location: ./chroma_db/")
print(f"   (This folder will be created in your project directory)")

# Create collection
collection = chroma_client.get_or_create_collection(
    name="crop_rotation_docs"
)

print(f"\n✅ Collection created: 'crop_rotation_docs'")
print(f"📊 Current documents in collection: {collection.count()}")

# ============================================================================
# STEP 3: DEMONSTRATE ADDING DOCUMENTS
# ============================================================================

print("\n\n" + "="*70)
print("📚 ADDING SAMPLE DOCUMENTS TO LOCAL DATABASE")
print("="*70)

sample_docs = [
    "Rice-wheat rotation increases yield by 20% in Punjab",
    "Legume crops improve soil nitrogen for subsequent wheat",
    "Crop rotation reduces pest pressure and disease"
]

print(f"\n📝 Adding {len(sample_docs)} sample documents...")

for i, doc in enumerate(sample_docs):
    try:
        # Create embedding using YOUR API
        embedding = create_embedding(doc)
        
        # Store in ChromaDB (locally)
        collection.add(
            documents=[doc],
            embeddings=[embedding],
            ids=[f"sample_doc_{i}"]
        )
        print(f"  ✅ Doc {i+1}: {doc[:50]}...")
    except Exception as e:
        print(f"  ❌ Error: {e}")

print(f"\n📊 Total documents now: {collection.count()}")

# ============================================================================
# STEP 4: QUERY THE DATABASE
# ============================================================================

print("\n\n" + "="*70)
print("🔍 QUERYING THE LOCAL DATABASE")
print("="*70)

query = "How to improve wheat yields?"
print(f"\n❓ Question: '{query}'")

try:
    # Create embedding for query
    query_embedding = create_embedding(query)
    
    # Search ChromaDB (local database)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=2
    )
    
    print(f"\n✅ Found {len(results['documents'][0])} relevant documents:\n")
    for i, doc in enumerate(results['documents'][0], 1):
        print(f"{i}. {doc}")

except Exception as e:
    print(f"\n❌ Error: {e}")

# ============================================================================
# STORAGE INFO
# ============================================================================

print("\n\n" + "="*70)
print("💾 WHERE IS EVERYTHING STORED?")
print("="*70)

print("""
📂 Your Project Folder
  │
  ├── 📁 cleaned/                  ← Your 30 cleaned documents
  │   ├── AgroSense...txt
  │   ├── AI-Enhanced...txt
  │   └── ...
  │
  ├── 📁 chroma_db/               ← LOCAL DATABASE (created automatically)
  │   ├── chroma.sqlite3          ← Metadata
  │   └── [UUID folders]          ← Embeddings & data
  │
  └── 📄 rag_system.py            ← Your RAG code

🔑 KEY POINTS:

1. ✅ Embeddings created via YOUR API (api.a4f.co)
   - Model: provider-6/qwen3-embedding-4b
   - No local model needed!

2. ✅ ChromaDB stores LOCALLY in ./chroma_db/
   - Free
   - Fast
   - Private
   - No internet needed after setup

3. ✅ Process:
   Step 1: Read cleaned document
   Step 2: Send to API → Get embedding (array of numbers)
   Step 3: Save to ChromaDB (local folder)
   Step 4: Repeat for all 30 documents
   
   Later when querying:
   Step 1: User asks question
   Step 2: Convert question to embedding (via API)
   Step 3: Search ChromaDB (local, instant)
   Step 4: Send results to LLM for answer

4. ✅ Database Size:
   - 30 documents × ~200 chunks = ~6,000 chunks
   - Each chunk = ~1KB text + 4KB embedding
   - Total: ~30MB local storage (tiny!)
""")

print("\n" + "="*70)
print("🎯 SUMMARY:")
print("="*70)
print("""
✅ Embeddings: YOUR API (provider-6/qwen3-embedding-4b)
✅ Storage: LOCAL ChromaDB (./chroma_db/ folder)
✅ Cost: FREE (local storage)
✅ Privacy: 100% (never leaves your computer after setup)

Ready to build the full system? 🚀
""")
