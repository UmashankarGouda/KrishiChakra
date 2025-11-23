from sqlalchemy import create_engine, Column, String, Text, DateTime, Float, Integer, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

# For development, use Text instead of Vector
VECTOR_AVAILABLE = False

from app.config import settings

# Convert postgresql:// to postgresql+psycopg:// for psycopg3
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

# Database connection with connection pool settings for Supabase
engine = create_engine(
    db_url,
    pool_size=10,  # Increase pool size
    max_overflow=20,  # Allow overflow connections
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,  # Recycle connections after 1 hour
    connect_args={
        "connect_timeout": 30,  # 30 second timeout
        "options": "-c statement_timeout=60000"  # 60 second statement timeout
    }
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ResearchDocument(Base):
    __tablename__ = "research_documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String)
    embedding = Column(Text)  # Text fallback for development
    doc_metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class CropYieldData(Base):
    __tablename__ = "crop_yield_data"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    crop_name = Column(String, nullable=False)
    region = Column(String)
    soil_type = Column(String)
    climate_zone = Column(String)
    season = Column(String)
    yield_per_hectare = Column(Float)
    year = Column(Integer)
    content = Column(Text)  # Structured description for embedding
    embedding = Column(Text)  # Text fallback for development
    doc_metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class RotationPattern(Base):
    __tablename__ = "rotation_patterns"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pattern_name = Column(String, nullable=False)
    description = Column(Text)
    crops_sequence = Column(JSON)  # List of crops in rotation
    duration_years = Column(Integer)
    soil_types = Column(JSON)  # Compatible soil types
    climate_zones = Column(JSON)  # Compatible climate zones
    benefits = Column(JSON)  # List of benefits
    embedding = Column(Text)  # Text fallback for development
    doc_metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class GeneratedPlan(Base):
    __tablename__ = "generated_plans"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, nullable=False)
    field_id = Column(String, nullable=False)
    input_params = Column(JSON)
    plan_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)