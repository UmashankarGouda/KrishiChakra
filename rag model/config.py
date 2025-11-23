"""
Configuration file for the RAG document processing pipeline
Edit your settings here
"""

# API Configuration
API_KEYS = {
    "deepseek": "your-deepseek-api-key-here",
    "openrouter": "your-openrouter-api-key-here",  # Alternative if using OpenRouter
}

# Model Selection (choose based on your needs)
MODELS = {
    "extract_clean": "deepseek-v3.1-turbo",  # Fast, cost-effective
    "smart_organize": "llama-3.3-70b",        # Good instruction following
    "fallback": "gemma-3-27b-it",             # Lightweight, reliable
}

# Processing Settings
BATCH_SIZE = 5  # Files per batch (matches 5 req/limit)
DELAY_BETWEEN_BATCHES = 60  # Seconds to wait between batches
MAX_TEXT_LENGTH = 15000  # Characters to send to LLM (avoid token limits)

# Folder Structure
FOLDERS = {
    "pdfs": "ieee_papers",
    "raw_extracted": "raw_extracted",
    "cleaned": "cleaned",
    "structured": "structured",  # For future advanced organization
}

# LLM Parameters
LLM_PARAMS = {
    "temperature": 0.3,  # Low for consistent extraction
    "max_tokens": 2000,
}
