import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database - Supabase PostgreSQL (Cloud)
    # Pooler connection with project reference username
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres.hmkshtavvfnihydfmclh:kushalraj135@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
    )
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://hmkshtavvfnihydfmclh.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhta3NodGF2dmZuaWh5ZGZtY2xoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTMwNjg4OSwiZXhwIjoyMDc2ODgyODg5fQ.bv5bonpTgpQsO4C4pU86pjMdBdCQ9Vqc8q2S-L_VXvI")
    
    # Redis (Local Development - Optional for Supabase)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Celery (Local Development)
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # 🥇 PREMIUM RAG Combination - Best for Research & Complex Analysis
    EMBEDDING_MODEL: str = "provider-6/qwen3-embedding-4b"  # Best for agricultural document vectorization
    GENERATION_MODEL: str = "provider-3/gemini-2.5-flash-lite-preview-09-2025"  # Google Gemini for superior reasoning
    
    # API Configuration
    BASE_URL: str = "https://api.a4f.co/v1"
    API_KEY: str = ""  # Your unified API key from .env file

    # Bhuvan API
    # NOTE: It's recommended to set this via environment variable BHUVAN_TOKEN in production.
    # For local development, we default to the provided token.
    BHUVAN_TOKEN: str = os.getenv(
        "BHUVAN_TOKEN",
        "1b30533acbc2be3679b1f9cfadb2fe65058c64d2"
    )
    
    # RAG Settings
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    MAX_RETRIEVED_DOCS: int = 10
    SIMILARITY_THRESHOLD: float = 0.7
    
    # Cache settings
    CACHE_TTL: int = 86400  # 24 hours
    
    class Config:
        env_file = ".env"

settings = Settings()