# KrishiChakra
Multi-Agent RAG model for Crop Rotation Solutions using Satellite Data inputs from ISRO's Bhuvan
and AI-Powered Agricultural Management System with RAG-based Expert Recommendations

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

##  Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [RAG System](#-rag-system)
- [Contributing](#-contributing)
- [Team](#-team)

---

##  Overview

**KrishiChakra** is an intelligent agricultural management platform designed to help Indian farmers optimize crop rotation strategies using AI-powered recommendations based on ICAR research, IEEE papers, and agricultural handbooks.

### Key Capabilities:
-  **AI-Driven Crop Rotation Planning** - 3,944 document knowledge base
-  **Farm Management Dashboard** - Track fields, crops, yields
-  **Voice Input Support** - Multilingual support for farmers
-  **Profit Estimation** - Market-based revenue calculations
-  **Soil Health Monitoring** - Track benefits over rotation cycles
-  **Mobile-Friendly Interface** - Responsive design for field use
-  **Blockchain Integration** - GrainTrust certification system

---

##  Features

### 1. Intelligent Crop Rotation Planning
- Generate 1-5 year rotation plans based on:
  - Soil type (Clay, Loam, Sandy, etc.)
  - Climate zone (Tropical, Subtropical, Temperate)
  - Field size and location
  - Previous crop history
- AI recommendations backed by:
  - 13 ICAR agricultural handbooks
  - 30 IEEE research papers
  - Proven crop rotation principles

### 2. RAG-Powered Knowledge System
- **3,944 document chunks** indexed with FAISS
- **Local embeddings** (all-MiniLM-L6-v2) - No API limits
- **LLM generation** (GPT-4o-mini) - Research-based answers
- Sub-second query response time

### 3. Farm Management
- Multi-field management
- Crop tracking (Kharif, Rabi, Summer seasons)
- Yield monitoring
- Profit/loss analysis
- Historical data visualization

### 4. User Experience
- Clean, modern UI with Tailwind CSS
- Dark/Light theme support
- Mobile-responsive design
- Voice input for text fields
- Multilingual support (Hindi, English)

---

##  Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│                    Port: 3000/3001                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Dashboard │  │ Auth     │  │ Custom   │  │Knowledge │  │
│  │  Pages   │  │ System   │  │  Plans   │  │   Base   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────┬────────────────────────┬───────────────────┬──────┘
         │                        │                   │
         ▼                        ▼                   ▼
┌─────────────────┐    ┌──────────────────┐    ┌──────────────┐
│   Backend API   │    │   RAG AI Service │    │  Blockchain  │
│   Port: 8000    │    │   Port: 8001     │    │  GrainTrust  │
├─────────────────┤    ├──────────────────┤    ├──────────────┤
│ • Auth (JWT)    │    │ • FAISS Index    │    │ • NFT Certs  │
│ • Farm CRUD     │    │ • 3,944 Chunks   │    │ • QR Codes   │
│ • PostgreSQL    │    │ • Local Embed.   │    │ • Traceability│
│ • Voice Input   │    │ • LLM (GPT-4o)   │    │              │
│ • Analytics     │    │ • Knowledge Base │    │              │
└─────────────────┘    └──────────────────┘    └──────────────┘
```

### Component Breakdown:

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 14, TypeScript, Tailwind | User interface, routing, state management |
| **Backend** | FastAPI, SQLAlchemy, PostgreSQL | API, database, authentication |
| **RAG Service** | FastAPI, FAISS, Sentence Transformers | AI knowledge retrieval & generation |
| **Blockchain** | Ethereum, Hardhat, Solidity | Certification & traceability |

---

##  Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Auth**: JWT tokens, secure cookies

### Backend
- **Framework**: FastAPI 0.115
- **Language**: Python 3.11
- **Database**: PostgreSQL / SQLite
- **ORM**: SQLAlchemy 2.0
- **Auth**: JWT (python-jose)
- **Validation**: Pydantic v2

### RAG AI Service
- **Framework**: FastAPI 0.115
- **Embeddings**: Sentence Transformers (all-MiniLM-L6-v2)
- **Vector DB**: FAISS (IndexFlatIP)
- **LLM**: OpenAI GPT-4o-mini via api.a4f.co
- **Document Processing**: PyMuPDF, NumPy
- **Knowledge Base**: 43 documents (13 handbooks + 30 IEEE papers)

### Blockchain
- **Network**: Ethereum (Sepolia testnet)
- **Smart Contracts**: Solidity 0.8.x
- **Framework**: Hardhat
- **Library**: Ethers.js

---

##  Getting Started

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- **Python** 3.11+
- **PostgreSQL** 14+ (or SQLite for development)
- **Git**

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/Kushal-Raj-G-S/KrishiChakra.git
cd krishichakra
```

#### 2. Setup Frontend
```bash
cd frontend
npm install
# or
pnpm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
# Frontend runs on http://localhost:3000
```

#### 3. Setup Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
python setup_database.py

# Start server
uvicorn main:app --reload --port 8000
# Backend runs on http://localhost:8000
```

#### 4. Setup RAG AI Service
```bash
cd rag_model

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # On Linux/Mac: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start RAG API server
python api_server.py
# RAG service runs on http://localhost:8001

# Or use the batch file (Windows)
start_api.bat
```

### Environment Variables

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAG_API_URL=http://localhost:8001
```

#### Backend (`.env`)
```env
DATABASE_URL=postgresql://user:password@localhost/krishichakra
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### RAG Service (already configured in code)
```python
# config.py or local_rag.py
API_KEY = "your-api-key-here"
BASE_URL = "https://api.a4f.co/v1"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # Local, no API needed
PRIMARY_LLM = "provider-5/gpt-4o-mini"
```

---

##  Project Structure

```
krishichakra/
├── frontend/                    # Next.js Frontend
│   ├── app/                    # App Router pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── auth/              # Authentication
│   │   ├── knowledge/         # Knowledge base
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── dashboard-*.tsx   # Dashboard components
│   │   └── protected-route.tsx
│   ├── contexts/              # React contexts
│   │   ├── auth-context.tsx
│   │   └── app-context.tsx
│   ├── lib/                   # Utilities
│   │   ├── auth.ts
│   │   ├── rag-service.ts    # RAG API client
│   │   ├── supabase.ts
│   │   └── types.ts
│   └── package.json
│
├── backend/                     # FastAPI Backend
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth.py
│   │   │   ├── farms.py
│   │   │   └── voice.py
│   │   ├── models/           # Database models
│   │   │   └── database.py
│   │   ├── services/         # Business logic
│   │   └── config.py         # Configuration
│   ├── main.py               # FastAPI app entry
│   ├── requirements.txt
│   └── setup_database.py
│
├── rag_model/                   # RAG AI Service
│   ├── api_server.py          # FastAPI server (Port 8001)
│   ├── local_rag.py           # RAG system (FAISS + Local embeddings)
│   ├── extract_ieee.py        # PDF extraction script
│   ├── test_api_live.py       # API testing
│   ├── start_api.bat          # Windows startup script
│   ├── requirements.txt
│   ├── files/                 # Knowledge base documents
│   │   ├── ICAR-*.txt        # Agricultural handbooks (13)
│   │   └── *.txt             # IEEE papers (30)
│   ├── faiss_index_local/     # FAISS vector database
│   │   ├── index.faiss       # 3,944 document chunks
│   │   └── metadata.pkl      # Document metadata
│   └── ieee_papers/           # Original PDF papers
│
├── blockchain/                  # Smart Contracts (Optional)
│   ├── contracts/
│   │   └── GrainTrust.sol
│   ├── scripts/
│   └── hardhat.config.js
│
├── README.md                    # This file
├── QUICK_START.md              # Quick setup guide
├── RAG_MIGRATION_SUMMARY.md    # RAG system documentation
└── TEST_RAG_INTEGRATION.md     # RAG testing guide
```

---

##  API Documentation

### Backend API (Port 8000)

#### Authentication
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

#### Farm Management
```http
GET    /api/farms/              # List user's farms
POST   /api/farms/              # Create new farm
GET    /api/farms/{id}          # Get farm details
PUT    /api/farms/{id}          # Update farm
DELETE /api/farms/{id}          # Delete farm
```

#### Fields
```http
GET    /api/fields/             # List fields
POST   /api/fields/             # Create field
GET    /api/fields/{id}         # Field details
```

### RAG AI API (Port 8001)

#### Query Knowledge Base
```http
POST /api/v2/query
Content-Type: application/json

{
  "question": "What are the best crop rotation practices for wheat?",
  "user_id": "user123",
  "top_k": 5,
  "verbose": false
}

Response:
{
  "question": "...",
  "answer": "Based on ICAR guidelines...",
  "sources": ["ICAR-Kharif.txt", "wheat-rotation.txt"],
  "context_chunks": [...],
  "metadata": {
    "total_chunks_in_db": 3944,
    "chunks_used": 5,
    "embedding_model": "all-MiniLM-L6-v2 (local)",
    "llm_model": "provider-5/gpt-4o-mini"
  }
}
```

#### Health Check
```http
GET /health
GET /api/v2/stats
```

---

##  RAG System

### Knowledge Base Composition

| Category | Count | Size | Source |
|----------|-------|------|--------|
| **ICAR Handbooks** | 13 | 5.4 MB | Agricultural advisories, crop management |
| **IEEE Papers** | 30 | 1.6 MB | Research on crop rotation, ML agriculture |
| **Total Documents** | 43 | 7.0 MB | - |
| **Total Chunks** | 3,944 | - | 2000 chars/chunk, 200 overlap |

### RAG Pipeline

1. **Document Ingestion**
   - Extract text from PDFs (PyMuPDF)
   - Clean and normalize text
   - Chunk into 2000-character segments

2. **Embedding Generation**
   - Model: `all-MiniLM-L6-v2` (384 dimensions)
   - Batch processing for speed
   - **Local execution** - No API limits!

3. **Vector Storage**
   - FAISS IndexFlatIP (cosine similarity)
   - Persistent storage
   - Fast retrieval (<100ms)

4. **Query Processing**
   - Embed user query
   - Retrieve top-5 relevant chunks
   - Generate answer with LLM
   - Format for farmer-friendly display

### Performance Metrics

- **Build Time**: 80 seconds (3,944 chunks)
- **Query Time**: 2-5 seconds (including LLM generation)
- **Accuracy**: Based on peer-reviewed research
- **Coverage**: 28+ crop varieties, 3+ climate zones

### Supported Crops

**Cereals**: Wheat, Rice, Maize, Sorghum (Jowar), Pearl Millet (Bajra)  
**Legumes**: Chickpea, Green Gram (Mung), Pigeon Pea (Arhar), Lentil (Masoor), Pea, Cowpea, Soybean  
**Cash Crops**: Cotton, Sugarcane  
**Vegetables**: Tomato, Potato, Onion, Cabbage, Brinjal  
**Oilseeds**: Mustard  

---

##  Testing

### Frontend Testing
```bash
cd frontend
npm run test        # Unit tests
npm run test:e2e   # E2E tests (if configured)
```

### Backend Testing
```bash
cd backend
pytest              # Run all tests
pytest -v          # Verbose output
```

### RAG System Testing
```bash
cd rag_model
python test_api_live.py     # Test RAG API
python query_production_rag.py  # Interactive queries
```

---

## 🔧 Troubleshooting

### Common Issues

**Port 8001 already in use**
```bash
# Windows
netstat -ano | findstr :8001
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:8001 | xargs kill -9
```

**RAG API not loading documents**
```bash
# Rebuild FAISS index
cd rag_model
python local_rag.py  # Ensure reset=True in __main__
```

**Frontend can't connect to backend**
- Check `.env.local` has correct API URLs
- Verify backend is running on port 8000
- Check CORS settings in FastAPI

---

##  Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- **Frontend**: ESLint + Prettier
- **Backend**: Black formatter, PEP 8
- **Commits**: Conventional Commits format

---

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

##  Team

**BioBloom - BMSIT Hackathon Team**

- Frontend Development
- Backend Development
- RAG System Architecture
- Blockchain Integration
- UI/UX Design

---

##  Acknowledgments

- **ICAR** - Agricultural research and advisories
- **IEEE** - Research papers on precision agriculture
- **Hugging Face** - Sentence Transformers models
- **OpenAI** - LLM capabilities
- **shadcn/ui** - Beautiful UI components

---

##  Support

For issues or questions:
- 📧 Email: support@krishichakra.com
- 🐛 Issues: [GitHub Issues](https://github.com/UmashankarGouda/KrishiChakra/issues)
- 📖 Docs: [Documentation](https://docs.krishichakra.com)

---

<div align="center">


</div>
