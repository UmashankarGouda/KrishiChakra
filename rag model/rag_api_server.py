"""
FastAPI Server for Production RAG System
Exposes your production-grade RAG as REST API
Connects to your existing frontend!
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
import logging

# Import your production RAG system
from production_rag_system import CropRotationRAG, logger

# ============================================================================
# FASTAPI APP SETUP
# ============================================================================

app = FastAPI(
    title="KrishiChakra Production RAG API",
    description="Production-grade RAG for Crop Rotation with Legume Focus",
    version="2.0.0"
)

# CORS - Allow your frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:3001",  # Alternative port
        "http://localhost:5173",  # Vite dev server
        "*"  # Allow all for demo (remove in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class QueryRequest(BaseModel):
    """Request model for RAG query"""
    question: str
    user_id: Optional[str] = "demo_user"
    session_id: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "What are the benefits of including chickpea in crop rotation?",
                "user_id": "farmer123"
            }
        }

class QueryResponse(BaseModel):
    """Response model for RAG query"""
    question: str
    answer: str
    sources: List[str]
    confidence: str = "high"  # Based on source count
    timestamp: str
    
class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    message: str
    database_chunks: int
    model_primary: str
    model_fallback: str

# ============================================================================
# GLOBAL RAG INSTANCE (Load once on startup)
# ============================================================================

rag_system: Optional[CropRotationRAG] = None

@app.on_event("startup")
async def load_rag_system():
    """Initialize RAG system on server startup"""
    global rag_system
    
    try:
        logger.info("="*70)
        logger.info("🚀 STARTING PRODUCTION RAG API SERVER")
        logger.info("="*70)
        
        rag_system = CropRotationRAG()
        rag_system.build_index(reset=False)  # Load existing database
        
        logger.info(f"✅ RAG System loaded: {rag_system.collection.count()} chunks")
        logger.info("🌐 API Server ready to accept requests!")
        logger.info("="*70)
        
    except Exception as e:
        logger.error(f"❌ Failed to load RAG system: {str(e)}")
        raise

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/", response_model=Dict)
async def root():
    """Root endpoint with API info"""
    return {
        "service": "KrishiChakra Production RAG API",
        "version": "2.0.0",
        "status": "active",
        "specialization": "Legume-based Crop Rotation",
        "endpoints": {
            "query": "POST /api/v2/query",
            "health": "GET /api/v2/health",
            "docs": "GET /docs"
        },
        "demo_questions": [
            "What are the benefits of including chickpea in crop rotation?",
            "How does green gram improve soil nitrogen?",
            "Economic advantages of legume-based rotations?",
            "Best practices for vetch-wheat rotation?"
        ]
    }

@app.get("/api/v2/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    return HealthResponse(
        status="healthy",
        message="Production RAG system operational",
        database_chunks=rag_system.collection.count(),
        model_primary=rag_system.config.PRIMARY_LLM,
        model_fallback=rag_system.config.FALLBACK_LLM
    )

@app.post("/api/v2/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    """
    Main RAG query endpoint
    
    Accepts questions and returns AI-generated answers with sources
    """
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        logger.info(f"📥 Query received: {request.question}")
        
        # Execute RAG query
        result = rag_system.query(request.question, verbose=True)
        
        # Determine confidence based on source count
        confidence = "high" if len(result['sources']) >= 3 else "medium" if len(result['sources']) >= 1 else "low"
        
        response = QueryResponse(
            question=result['question'],
            answer=result['answer'],
            sources=result['sources'],
            confidence=confidence,
            timestamp=result['timestamp']
        )
        
        logger.info(f"✅ Query completed: {len(result['sources'])} sources used")
        
        return response
        
    except Exception as e:
        logger.error(f"❌ Query failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")

@app.post("/api/v2/batch-query")
async def batch_query(questions: List[str]):
    """
    Batch query endpoint - process multiple questions
    Rate limited to avoid API overload
    """
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    if len(questions) > 5:
        raise HTTPException(status_code=400, detail="Max 5 questions per batch")
    
    results = []
    for question in questions:
        try:
            result = rag_system.query(question, verbose=False)
            results.append({
                "question": question,
                "answer": result['answer'],
                "sources": result['sources'],
                "status": "success"
            })
        except Exception as e:
            results.append({
                "question": question,
                "answer": None,
                "sources": [],
                "status": "failed",
                "error": str(e)
            })
    
    return {"results": results, "total": len(questions)}

@app.get("/api/v2/coverage")
async def get_coverage():
    """
    Returns information about crop coverage in the knowledge base
    Useful for frontend to show capabilities
    """
    return {
        "specialization": "Legume-based Crop Rotation Systems",
        "excellent_coverage": [
            "Chickpea (चना)",
            "Green Gram / Mung Bean (मूंग)",
            "Vetch",
            "Peas",
            "Soybean",
            "Faba Bean",
            "Cowpea",
            "Rice-Wheat Rotation",
            "Soil Health",
            "Nitrogen Fixation"
        ],
        "good_coverage": [
            "Wheat",
            "Rice",
            "Barley",
            "Rapeseed",
            "Sunflower"
        ],
        "limited_coverage": [
            "Corn/Maize",
            "Potato",
            "Cotton"
        ],
        "total_documents": 25,
        "total_chunks": rag_system.collection.count() if rag_system else 0
    }

# ============================================================================
# DEMO/TEST ENDPOINTS
# ============================================================================

@app.get("/api/v2/demo/legume-questions")
async def get_demo_legume_questions():
    """Get curated demo questions focused on legumes"""
    return {
        "category": "Legume-Based Crop Rotation",
        "questions": [
            {
                "question": "What are the benefits of including chickpea in crop rotation?",
                "why": "Chickpea nitrogen fixation and soil health improvements"
            },
            {
                "question": "How much nitrogen does green gram fix in the soil?",
                "why": "Specific quantitative data on nitrogen contribution"
            },
            {
                "question": "Economic advantages of vetch-wheat rotation?",
                "why": "Cost-benefit analysis with specific numbers"
            },
            {
                "question": "How do legumes reduce fertilizer dependency?",
                "why": "Environmental and economic benefits combined"
            },
            {
                "question": "Best legume for short-term crop rotation in India?",
                "why": "Practical recommendation for farmers"
            }
        ]
    }

# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🚀 STARTING KRISHICHAKRA PRODUCTION RAG API SERVER")
    print("="*70)
    print("\n📍 API will be available at:")
    print("   - Local:   http://localhost:8001")
    print("   - Network: http://0.0.0.0:8001")
    print("\n📖 Documentation:")
    print("   - Swagger UI: http://localhost:8001/docs")
    print("   - ReDoc:      http://localhost:8001/redoc")
    print("\n🎯 Main endpoint:")
    print("   POST http://localhost:8001/api/v2/query")
    print("\n" + "="*70 + "\n")
    
    uvicorn.run(
        "rag_api_server:app",
        host="0.0.0.0",
        port=8001,  # Different port from your old backend (8000)
        reload=True,
        log_level="info"
    )
