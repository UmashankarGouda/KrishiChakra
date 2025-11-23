from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn

from app.config import settings
from app.models.database import create_tables, get_db
from app.api.voice import router as voice_router
from app.api.rotation import router as rotation_router

# Create FastAPI app
app = FastAPI(
    title="KrishiChakra API",
    description="API for Crop Management and Field Data",
    version="1.0.0"
)

# CORS middleware - MUST be added before routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(voice_router)
app.include_router(rotation_router)

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        print("Creating database tables...")
        create_tables()
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Database connection failed: {e}")
        print("Running in fallback mode without database...")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "KrishiChakra API",
        "version": "1.0.0",
        "status": "healthy",
        "info": "Crop management and field data API"
    }

@app.get("/health")
async def health_check():
    """Simple health check"""
    return {"status": "OK", "service": "KrishiChakra API"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )