"""
QUERY-ONLY INTERFACE - Use existing production RAG database
No rebuilding, just querying with proper rate limiting
"""

from production_rag_system import CropRotationRAG, logger
import time

def interactive_query():
    """Interactive query interface with rate limit protection"""
    
    logger.info("="*70)
    logger.info("🌾 CROP ROTATION RAG - INTERACTIVE QUERY")
    logger.info("="*70)
    
    # Initialize RAG system (loads existing database)
    rag = CropRotationRAG()
    rag.build_index(reset=False)  # Load existing, don't rebuild
    
    logger.info(f"\n✅ Database loaded: {rag.collection.count()} chunks available")
    logger.info("="*70)
    print("\n💡 Ask questions about crop rotation (type 'quit' to exit)")
    print("   Example: What are the benefits of rice-wheat rotation?\n")
    
    query_count = 0
    
    while True:
        try:
            # Get user question
            question = input("\n❓ Your question: ").strip()
            
            if question.lower() in ['quit', 'exit', 'q']:
                logger.info("👋 Goodbye!")
                break
            
            if not question:
                continue
            
            # Rate limiting for queries (each query = 1 embedding + 1 LLM call)
            if query_count > 0 and query_count % 3 == 0:
                logger.info("⏳ Rate limit protection: waiting 20 seconds...")
                time.sleep(20)
            
            # Execute query
            result = rag.query(question, verbose=True)
            
            # Display answer
            print("\n" + "="*70)
            print("✅ ANSWER:")
            print("="*70)
            print(result['answer'])
            print(f"\n📚 Sources: {', '.join(result['sources'])}")
            print("="*70)
            
            query_count += 1
            
        except KeyboardInterrupt:
            logger.info("\n👋 Interrupted by user. Goodbye!")
            break
        except Exception as e:
            logger.error(f"❌ Error: {str(e)}")
            print("\n⚠️  Query failed. Try again or type 'quit' to exit.")

if __name__ == "__main__":
    interactive_query()
