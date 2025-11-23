"""
PRODUCTION-GRADE RAG SYSTEM - Crop Rotation Knowledge Base
Best practices: Clean architecture, error handling, logging, type hints, rate limiting
"""

from openai import OpenAI
import chromadb
from chromadb.config import Settings
import os
from typing import List, Dict, Optional, Tuple
from pathlib import Path
from dataclasses import dataclass
import logging
from datetime import datetime
import time

# ============================================================================
# CONFIGURATION & LOGGING
# ============================================================================

@dataclass
class RAGConfig:
    """Immutable configuration using dataclass"""
    API_KEY: str = "ddc-a4f-af21ceb75c0a47d4afb3b4f5d0dd5804"
    BASE_URL: str = "https://api.a4f.co/v1"
    
    # Models
    EMBEDDING_MODEL: str = "provider-6/qwen3-embedding-4b"
    PRIMARY_LLM: str = "provider-3/gemini-2.5-flash-lite-preview-09-2025"
    FALLBACK_LLM: str = "provider-3/deepseek-v3"
    
    # Paths
    DOCS_FOLDER: Path = Path("cleaned")
    DB_PATH: Path = Path("./chroma_db")
    COLLECTION_NAME: str = "crop_rotation_kb"
    
    # Hyperparameters
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    TOP_K_RESULTS: int = 5
    MAX_RETRIES: int = 3
    TEMPERATURE: float = 0.3
    MAX_TOKENS: int = 800
    
    # Rate Limiting (CRITICAL for 5 req/min API limit)
    EMBEDDING_BATCH_SIZE: int = 3  # Process 3 embeddings at a time (safer)
    EMBEDDING_DELAY: float = 20.0  # Wait 20 seconds between batches


def setup_logging() -> logging.Logger:
    """Configure structured logging"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s | %(levelname)8s | %(message)s',
        datefmt='%H:%M:%S'
    )
    return logging.getLogger(__name__)

logger = setup_logging()

# ============================================================================
# CUSTOM EXCEPTIONS
# ============================================================================

class RAGException(Exception):
    """Base exception for RAG system"""
    pass

class EmbeddingError(RAGException):
    """Embedding generation failed"""
    pass

class LLMError(RAGException):
    """LLM generation failed"""
    pass

class DocumentProcessingError(RAGException):
    """Document processing failed"""
    pass

# ============================================================================
# TEXT PROCESSING UTILITIES
# ============================================================================

class TextProcessor:
    """Handle all text chunking and preprocessing"""
    
    @staticmethod
    def chunk_text(text: str, chunk_size: int, overlap: int) -> List[str]:
        """
        Split text into overlapping chunks
        
        Args:
            text: Input text
            chunk_size: Words per chunk
            overlap: Overlapping words between chunks
            
        Returns:
            List of text chunks
        """
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            if len(chunk.strip()) > 50:  # Filter tiny chunks
                chunks.append(chunk)
        
        return chunks
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text"""
        # Remove excessive whitespace
        text = ' '.join(text.split())
        return text.strip()

# ============================================================================
# EMBEDDING SERVICE WITH RATE LIMITING
# ============================================================================

class EmbeddingService:
    """Handles all embedding operations with retry logic and rate limiting"""
    
    def __init__(self, client: OpenAI, model: str, max_retries: int, 
                 batch_size: int, delay: float):
        self.client = client
        self.model = model
        self.max_retries = max_retries
        self.batch_size = batch_size
        self.delay = delay
        self.request_count = 0
    
    def create_embedding(self, text: str) -> List[float]:
        """
        Create embedding with exponential backoff retry and rate limiting
        
        Args:
            text: Input text
            
        Returns:
            Embedding vector
            
        Raises:
            EmbeddingError: If all retries fail
        """
        text = text[:8000]  # Truncate to model limit
        
        # Rate limiting: pause after every batch_size requests
        if self.request_count > 0 and self.request_count % self.batch_size == 0:
            logger.info(f"⏳ Rate limit: waiting {self.delay}s (processed {self.request_count} embeddings)")
            time.sleep(self.delay)
        
        for attempt in range(self.max_retries):
            try:
                response = self.client.embeddings.create(
                    model=self.model,
                    input=text
                )
                self.request_count += 1
                return response.data[0].embedding
                
            except Exception as e:
                wait_time = (2 ** attempt)  # Exponential backoff: 1s, 2s, 4s
                
                if attempt < self.max_retries - 1:
                    logger.warning(f"Embedding attempt {attempt + 1} failed. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    raise EmbeddingError(f"Failed after {self.max_retries} attempts: {str(e)}")
        
        raise EmbeddingError("Unexpected error in embedding creation")

# ============================================================================
# VECTOR DATABASE MANAGER
# ============================================================================

class VectorDB:
    """Manages ChromaDB operations"""
    
    def __init__(self, db_path: Path, collection_name: str):
        self.db_path = db_path
        self.collection_name = collection_name
        self.client = chromadb.PersistentClient(
            path=str(db_path),
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = None
    
    def initialize_collection(self, reset: bool = False) -> chromadb.Collection:
        """
        Initialize or load collection
        
        Args:
            reset: If True, delete existing collection
            
        Returns:
            ChromaDB collection
        """
        if reset:
            try:
                self.client.delete_collection(self.collection_name)
                logger.info("🗑️  Deleted existing collection")
            except:
                pass
        
        try:
            self.collection = self.client.get_collection(self.collection_name)
            logger.info(f"📂 Loaded existing collection: {self.collection.count()} chunks")
        except:
            self.collection = self.client.create_collection(self.collection_name)
            logger.info(f"✨ Created new collection: {self.collection_name}")
        
        return self.collection
    
    def add_chunks(self, chunks: List[str], embeddings: List[List[float]], 
                   metadatas: List[Dict], ids: List[str]) -> None:
        """Batch add chunks to collection"""
        self.collection.add(
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
    
    def search(self, query_embedding: List[float], top_k: int) -> Dict:
        """Search for similar chunks"""
        return self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

# ============================================================================
# DOCUMENT INDEXER WITH RATE LIMITING
# ============================================================================

class DocumentIndexer:
    """Handles document processing and indexing with rate-limited embedding"""
    
    def __init__(self, config: RAGConfig, vector_db: VectorDB, 
                 embedding_service: EmbeddingService):
        self.config = config
        self.vector_db = vector_db
        self.embedding_service = embedding_service
        self.text_processor = TextProcessor()
    
    def index_documents(self) -> Tuple[int, int]:
        """
        Process and index all documents with rate limiting
        
        Returns:
            Tuple of (total_documents, total_chunks)
        """
        logger.info("="*70)
        logger.info("📚 INDEXING DOCUMENTS")
        logger.info("="*70)
        
        doc_files = list(self.config.DOCS_FOLDER.glob("*.txt"))
        total_files = len(doc_files)
        total_chunks = 0
        
        logger.info(f"📂 Found {total_files} documents")
        logger.info(f"🔧 Chunk size: {self.config.CHUNK_SIZE} words, Overlap: {self.config.CHUNK_OVERLAP}")
        logger.info(f"⏱️  Rate limit: {self.config.EMBEDDING_BATCH_SIZE} requests per {self.config.EMBEDDING_DELAY}s")
        
        for idx, filepath in enumerate(doc_files, 1):
            try:
                logger.info(f"[{idx}/{total_files}] Processing: {filepath.name}")
                
                # Read document
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Clean and chunk
                content = self.text_processor.clean_text(content)
                chunks = self.text_processor.chunk_text(
                    content, 
                    self.config.CHUNK_SIZE, 
                    self.config.CHUNK_OVERLAP
                )
                
                # Create embeddings with rate limiting (handled by EmbeddingService)
                chunk_ids = []
                chunk_embeddings = []
                metadatas = []
                
                for chunk_idx, chunk in enumerate(chunks):
                    embedding = self.embedding_service.create_embedding(chunk)
                    
                    chunk_ids.append(f"{filepath.stem}_chunk_{chunk_idx}")
                    chunk_embeddings.append(embedding)
                    metadatas.append({
                        "source": filepath.name,
                        "chunk_index": chunk_idx,
                        "total_chunks": len(chunks),
                        "indexed_at": datetime.now().isoformat()
                    })
                
                # Batch insert
                self.vector_db.add_chunks(chunks, chunk_embeddings, metadatas, chunk_ids)
                
                total_chunks += len(chunks)
                logger.info(f"    ✅ Indexed {len(chunks)} chunks")
                
            except Exception as e:
                logger.error(f"    ❌ Failed to process {filepath.name}: {str(e)}")
                # Continue with next document instead of failing completely
                continue
        
        logger.info("="*70)
        logger.info(f"✅ INDEXING COMPLETE: {total_files} docs, {total_chunks} chunks")
        logger.info("="*70)
        
        return total_files, total_chunks

# ============================================================================
# LLM SERVICE WITH MULTI-MODEL FALLBACK
# ============================================================================

class LLMService:
    """Handles LLM-based answer generation with fallback"""
    
    def __init__(self, client: OpenAI, primary_model: str, fallback_model: str, 
                 temperature: float, max_tokens: int):
        self.client = client
        self.models = [primary_model, fallback_model]
        self.temperature = temperature
        self.max_tokens = max_tokens
    
    def generate_answer(self, query: str, context_chunks: List[Dict]) -> str:
        """
        Generate answer using LLM with fallback
        
        Args:
            query: User question
            context_chunks: Retrieved context chunks
            
        Returns:
            Generated answer
            
        Raises:
            LLMError: If all models fail
        """
        # Build context
        context = "\n\n".join([
            f"[{chunk['source']}]\n{chunk['text']}" 
            for chunk in context_chunks
        ])
        
        # Create prompt
        prompt = self._create_prompt(query, context)
        
        # Try each model
        for idx, model_name in enumerate(self.models, 1):
            try:
                logger.info(f"🤖 Trying model {idx}/{len(self.models)}: {model_name}")
                
                response = self.client.chat.completions.create(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": "You are an expert agricultural advisor specializing in crop rotation systems."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=self.temperature,
                    max_tokens=self.max_tokens
                )
                
                answer = response.choices[0].message.content
                logger.info(f"✅ Successfully generated answer with {model_name}")
                return answer
                
            except Exception as e:
                logger.warning(f"❌ {model_name} failed: {str(e)[:100]}")
                if idx < len(self.models):
                    logger.info("🔄 Falling back to next model...")
                    time.sleep(2)  # Brief pause before fallback
        
        raise LLMError("All LLM models failed to generate answer")
    
    @staticmethod
    def _create_prompt(query: str, context: str) -> str:
        """Create structured prompt for LLM"""
        return f"""Based ONLY on the following research documents, answer the user's question accurately and comprehensively.

RESEARCH CONTEXT:
{context}

USER QUESTION: {query}

INSTRUCTIONS:
- Answer based ONLY on the provided research context
- If the context lacks sufficient information, acknowledge this
- Cite specific research findings
- Provide practical, actionable advice for farmers
- Use clear, concise language
- Structure your answer logically

ANSWER:"""

# ============================================================================
# MAIN RAG SYSTEM ORCHESTRATOR
# ============================================================================

class CropRotationRAG:
    """Complete RAG system orchestrator"""
    
    def __init__(self, config: RAGConfig = RAGConfig()):
        self.config = config
        
        # Initialize OpenAI client
        self.client = OpenAI(api_key=config.API_KEY, base_url=config.BASE_URL)
        
        # Initialize components
        self.vector_db = VectorDB(config.DB_PATH, config.COLLECTION_NAME)
        self.embedding_service = EmbeddingService(
            self.client, config.EMBEDDING_MODEL, config.MAX_RETRIES,
            config.EMBEDDING_BATCH_SIZE, config.EMBEDDING_DELAY
        )
        self.llm_service = LLMService(
            self.client, config.PRIMARY_LLM, config.FALLBACK_LLM,
            config.TEMPERATURE, config.MAX_TOKENS
        )
        self.indexer = DocumentIndexer(config, self.vector_db, self.embedding_service)
        
        self.collection = None
    
    def build_index(self, reset: bool = False) -> None:
        """Build or rebuild the vector database index"""
        self.collection = self.vector_db.initialize_collection(reset=reset)
        
        if reset or self.collection.count() == 0:
            self.indexer.index_documents()
    
    def query(self, question: str, verbose: bool = True) -> Dict:
        """
        Complete RAG query: Retrieve context and generate answer
        
        Args:
            question: User question
            verbose: Print detailed logs
            
        Returns:
            Dictionary with question, answer, sources, and context
        """
        if self.collection is None:
            raise RAGException("Index not built. Call build_index() first.")
        
        if verbose:
            logger.info("="*70)
            logger.info("🔍 RAG QUERY")
            logger.info("="*70)
            logger.info(f"❓ Question: {question}")
        
        # Step 1: Retrieve relevant chunks
        if verbose:
            logger.info("📖 Retrieving relevant documents...")
        
        query_embedding = self.embedding_service.create_embedding(question)
        results = self.vector_db.search(query_embedding, self.config.TOP_K_RESULTS)
        
        # Format context chunks
        context_chunks = []
        for i in range(len(results['documents'][0])):
            context_chunks.append({
                'text': results['documents'][0][i],
                'source': results['metadatas'][0][i]['source'],
                'chunk_index': results['metadatas'][0][i]['chunk_index']
            })
        
        if verbose:
            logger.info(f"✅ Found {len(context_chunks)} relevant chunks")
            for i, chunk in enumerate(context_chunks, 1):
                logger.info(f"  {i}. [{chunk['source']}] {chunk['text'][:80]}...")
        
        # Step 2: Generate answer
        if verbose:
            logger.info("🤖 Generating answer...")
        
        answer = self.llm_service.generate_answer(question, context_chunks)
        
        return {
            'question': question,
            'answer': answer,
            'sources': list(set(chunk['source'] for chunk in context_chunks)),
            'context': context_chunks,
            'timestamp': datetime.now().isoformat()
        }

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main execution flow"""
    logger.info("="*70)
    logger.info("🌾 PRODUCTION-GRADE CROP ROTATION RAG SYSTEM")
    logger.info("="*70)
    
    # Initialize RAG system
    rag = CropRotationRAG()
    
    # Build or load index
    if rag.config.DB_PATH.exists():
        rebuild = input("\n⚠️  Database exists. Rebuild? (y/n): ").lower()
        rag.build_index(reset=(rebuild == 'y'))
    else:
        rag.build_index(reset=True)
    
    # Test queries
    logger.info("\n" + "="*70)
    logger.info("🧪 RUNNING TEST QUERIES")
    logger.info("="*70)
    
    test_questions = [
        "What are the benefits of rice-wheat crop rotation in India?",
        "How does crop rotation improve soil health?",
    ]
    
    for question in test_questions:
        try:
            result = rag.query(question, verbose=True)
            
            logger.info("\n" + "="*70)
            logger.info("✅ ANSWER:")
            logger.info("="*70)
            print(result['answer'])
            logger.info(f"\n📚 Sources: {', '.join(result['sources'])}")
            logger.info("="*70 + "\n")
            
        except Exception as e:
            logger.error(f"❌ Query failed: {str(e)}")
    
    logger.info("✅ RAG System ready for production use!")
    
    return rag


if __name__ == "__main__":
    rag_system = main()
