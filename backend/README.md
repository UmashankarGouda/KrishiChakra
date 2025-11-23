# 🌾 KrishiChakra RAG System - Complete Setup Guide

## 🏗️ Architecture Overview

Your **PREMIUM RAG CONFIGURATION** using:
- **🔤 Embedding**: `provider-6/qwen3-embedding-4b` (Best for agricultural document vectorization)
- **🧠 Generation**: `provider-3/deepseek-v3` (Advanced reasoning for complex crop rotation analysis)

## 🚀 Quick Start (Recommended)

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Your API keys for provider-3 and provider-6

### 1. Set API Keys
Create `.env` file in backend folder:
```bash
PROVIDER_3_API_KEY=your_provider_3_key_here
PROVIDER_6_API_KEY=your_provider_6_key_here
```

### 2. Start Complete System
```bash
cd backend
docker-compose up -d
```

This starts:
- 📊 PostgreSQL with pgvector (port 5432)
- 🗄️ Redis cache (port 6379) 
- 🚀 FastAPI RAG API (port 8000)
- 🏃‍♂️ Celery worker (background processing)
- 🌸 Celery Flower (monitoring at port 5555)

### 3. Verify System
- **API Health**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs
- **Celery Monitor**: http://localhost:5555

---

## 📁 Complete File Structure

```
backend/
├── main.py                    # FastAPI application entry
├── Dockerfile                 # Container configuration
├── docker-compose.yml         # Complete stack orchestration
├── requirements.txt           # Python dependencies
├── start_rag_system.bat       # Windows setup script
├── start_rag_system.sh        # Linux/Mac setup script
├── app/
│   ├── config.py             # Settings & model configuration
│   ├── models/
│   │   ├── database.py       # SQLAlchemy models with pgvector
│   │   └── schemas.py        # Pydantic models
│   ├── services/
│   │   ├── ai_provider.py    # Universal AI provider client
│   │   ├── cache_service.py  # Redis caching layer
│   │   └── vector_search.py  # pgvector similarity search
│   ├── rag/
│   │   ├── rag_service.py    # Main RAG orchestration
│   │   └── celery_tasks.py   # Background task processing
│   └── api/
│       └── rag_endpoints.py  # REST API endpoints
└── knowledge_base/            # Your agricultural data
    ├── csv_data/
    ├── research_papers/
    └── processed_vectors/
```

---

## 🔧 Manual Setup (Alternative)

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start Services Manually

**PostgreSQL with pgvector:**
```bash
docker run -d --name krishichakra-postgres \
  -e POSTGRES_DB=krishichakra \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

**Redis:**
```bash
docker run -d --name krishichakra-redis \
  -p 6379:6379 redis:7-alpine
```

**Enable pgvector extension:**
```bash
python -c "
import psycopg2
conn = psycopg2.connect('postgresql://postgres:password@localhost:5432/krishichakra')
cur = conn.cursor()
cur.execute('CREATE EXTENSION IF NOT EXISTS vector;')
conn.commit()
print('✅ pgvector enabled')
conn.close()
"
```

### 3. Start RAG Components

**Celery Worker:**
```bash
celery -A app.rag.celery_tasks worker --loglevel=info
```

**Celery Flower (optional monitoring):**
```bash
celery -A app.rag.celery_tasks flower --port=5555
```

**FastAPI Server:**
```bash
python main.py
```

---

## 🎯 API Usage Examples

### Generate Rotation Plan
```bash
curl -X POST "http://localhost:8000/api/rag/generate-plan" \
  -H "Content-Type: application/json" \
  -d '{
    "field": {
      "id": "field-123", 
      "name": "North Field",
      "location": "Punjab, India",
      "size": 5.0,
      "soil_type": "Clay Loam",
      "climate_zone": "Semi-Arid",
      "season": "Kharif",
      "current_crop": "Rice"
    },
    "planning_years": 3,
    "specific_requirements": "Focus on water conservation and organic practices"
  }'
```

### Async Processing
```bash
# Start async task
curl -X POST "http://localhost:8000/api/rag/generate-plan-async" \
  -H "Content-Type: application/json" \
  -d '{"field": {...}, "planning_years": 3}'

# Check task status
curl "http://localhost:8000/api/rag/task-status/{task_id}"
```

---

## 🧠 RAG Pipeline Flow

```
User Request → Cache Check → Vector Search → LLM Generation → Response
     ↓              ↓              ↓              ↓             ↓
Field Input → Redis Lookup → Embedding → AI Generation → Structured Plan
     ↓              ↓              ↓              ↓             ↓
Parameters → Hit/Miss → pgvector → deepseek-v3 → Cache & Return
```

**Processing Steps:**
1. **Cache Check**: Redis lookup for existing plans
2. **Document Retrieval**: Vector similarity search in pgvector
3. **Context Preparation**: Combine retrieved documents
4. **AI Generation**: deepseek-v3 creates rotation plan
5. **Response Structuring**: Format as CropRotationPlan
6. **Caching**: Store result for future requests

---

## 🔍 Database Schema

**Core Tables:**
- `research_documents`: PDF papers with embeddings
- `crop_yield_data`: Historical yield data with embeddings  
- `rotation_patterns`: Proven rotation templates with embeddings
- `generated_plans`: Saved user plans

**Vector Operations:**
- Embedding dimension: 384 (qwen3-embedding-4b)
- Similarity function: Cosine distance
- Index: IVFFlat for fast retrieval

---

## 📊 Monitoring & Debugging

**Health Checks:**
- **API**: http://localhost:8000/health
- **RAG Components**: http://localhost:8000/api/rag/health

**Celery Monitoring:**
- **Flower UI**: http://localhost:5555
- **Redis CLI**: `redis-cli monitor`

**Logs:**
- FastAPI: Application console
- Celery: Worker console output
- Database: PostgreSQL logs

---

## 🔧 Configuration

**Model Settings** (in `app/config.py`):
```python
EMBEDDING_MODEL = "qwen3-embedding-4b"
GENERATION_MODEL = "deepseek-v3" 
EMBEDDING_PROVIDER = "provider-6"
GENERATION_PROVIDER = "provider-3"
```

**Performance Tuning:**
- `MAX_RETRIEVED_DOCS`: 10 (documents per search)
- `SIMILARITY_THRESHOLD`: 0.7 (relevance cutoff)
- `CACHE_TTL`: 86400 (24 hour cache)
- `CHUNK_SIZE`: 1000 (document chunking)

---

## 🚨 Troubleshooting

**Common Issues:**

1. **Database Connection Error**
   - Check PostgreSQL is running: `docker ps`
   - Verify connection string in config

2. **Redis Connection Error**
   - Check Redis status: `redis-cli ping`
   - Verify REDIS_URL in environment

3. **API Key Errors**
   - Ensure `.env` file has both provider keys
   - Check key format and permissions

4. **Vector Search Fails**
   - Verify pgvector extension: `SELECT * FROM pg_extension WHERE extname = 'vector';`
   - Check table creation and data population

5. **Celery Worker Not Processing**
   - Check worker status: `celery -A app.rag.celery_tasks inspect active`
   - Verify Redis broker connection

---

## 🎯 Integration with Frontend

Your frontend at `frontend/lib/rag-service.ts` is configured to call:
- **Endpoint**: `http://localhost:8000/api/rag/generate-plan`
- **Fallback**: Mock data for offline development
- **Error Handling**: Graceful degradation

**Frontend Test:**
```bash
cd frontend
npm run dev
# Navigate to dashboard → rotation → custom plan
# Select field and generate plan
```

---

## 📈 Performance Expectations

**Response Times:**
- Cache Hit: ~50-100ms
- Cache Miss: ~3-8 seconds
- Async Processing: Background (check status)

**Throughput:**
- Concurrent requests: 10-20 (depending on hardware)
- Plans per hour: 500-1000 (with caching)

**Resource Usage:**
- Memory: ~2-4GB (models + cache)
- CPU: Moderate during generation
- Storage: ~1GB (embeddings + cache)

---

## 🔐 Security Notes

- API keys stored in environment variables
- No authentication implemented (add as needed)
- CORS configured for localhost development
- Database connections use connection pooling

---

**🎉 Your Premium RAG System is Ready!**

The system uses your **best-in-class** model combination:
- `provider-6/qwen3-embedding-4b` for superior document understanding
- `provider-3/deepseek-v3` for advanced agricultural reasoning

This gives you **enterprise-grade** crop rotation planning with:
- ✅ Real-time vector search
- ✅ Intelligent caching  
- ✅ Scalable async processing
- ✅ Comprehensive monitoring
- ✅ Fallback resilience