# 🚀 Supabase RAG Setup Guide

## ✅ Changes Made:
1. ✅ Switched to **Gemini 2.5 Flash Lite** model (`provider-3/gemini-2.5-flash-lite-preview-09-2025`)
2. ✅ Created **Supabase vector migration** (`supabase_rag_migration.sql`)
3. ✅ Updated config to support **Supabase connection**

---

## 📋 Setup Steps (5 minutes)

### Step 1: Run Supabase Migration
1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project (or create new one)
3. Click **SQL Editor** (left sidebar)
4. Copy the entire content of `supabase_rag_migration.sql`
5. Paste and click **Run** ▶️

**Expected Output:**
```
pgvector extension installed: 1.0.0
Total tables created: 5
```

---

### Step 2: Get Supabase Connection String
1. In Supabase Dashboard → **Settings** → **Database**
2. Scroll to **Connection String** section
3. Select **URI** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijk.supabase.co:5432/postgres
   ```

---

### Step 3: Update Backend Configuration

**Option A: Update `.env` file (Recommended)**
```bash
cd backend
echo "DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" >> .env
```

**Option B: Update `config.py` directly**
Replace in `backend/app/config.py`:
```python
DATABASE_URL: str = "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

---

### Step 4: Test Connection
```bash
cd backend
.\venv\Scripts\Activate.ps1
python -c "from app.models.database import SessionLocal; from sqlalchemy import text; db = SessionLocal(); print('✅ Connected!'); db.execute(text('SELECT 1')); db.close()"
```

---

### Step 5: Populate Knowledge Base (Optional)

**Quick Test Data:**
```bash
python setup_database.py  # If you have CSV ingestion ready
```

Or manually insert via Supabase SQL Editor:
```sql
SELECT insert_sample_rag_data();
```

---

## 🎯 What You Get:

### ✅ Real Vector Search
- **pgvector** enabled for similarity search
- **5 vector tables** for agricultural knowledge
- **Optimized indexes** (IVFFlat) for fast retrieval

### ✅ Knowledge Tables
1. **rotation_patterns** - Crop rotation sequences with success rates
2. **crop_yields** - Historical yield data by region/soil
3. **research_documents** - Agricultural research papers
4. **market_prices** - Commodity price trends
5. **crop_varieties** - Approved varieties and recommendations

### ✅ RAG Functions
- `search_rotation_patterns()` - Find similar rotations
- `search_crop_yields()` - Find yield data
- `search_research_documents()` - Semantic doc search

---

## 🧪 Test RAG System

After setup, restart your server:
```bash
cd backend
.\venv\Scripts\Activate.ps1
python main.py
```

Watch for:
```
🔍 SEARCHING AGRICULTURAL KNOWLEDGE BASE...
📊 RETRIEVAL RESULTS:
   ├─ 🌾 Rotation Patterns Found: X documents  ✅ (should be > 0)
   ├─ 📈 Crop Yield Records: X records         ✅ (should be > 0)
   └─ 📚 Research Papers: X                    ✅ (should be > 0)
```

---

## 🏆 Advantages Over Local PostgreSQL

| Feature | Local PostgreSQL | Supabase |
|---------|------------------|----------|
| **Setup Time** | 30+ mins (install, configure) | 2 mins (SQL script) |
| **Hosting** | Your machine | Cloud (always accessible) |
| **Vector Extension** | Manual pgvector install | Built-in ✅ |
| **Scalability** | Limited to local | Scales automatically |
| **Demo/Judge Access** | Port forwarding needed | Public URL ✅ |
| **Backup** | Manual | Automatic |
| **Cost** | Free (local) | Free tier 500MB |

---

## 🔧 Troubleshooting

### Connection Refused?
- ✅ Check Supabase project is **not paused** (Dashboard)
- ✅ Verify connection string has correct password
- ✅ Check firewall allows outbound 5432

### No Vectors Found?
- ✅ Run migration script again
- ✅ Check tables exist: `SELECT * FROM rotation_patterns LIMIT 1;`
- ✅ Populate knowledge base with CSV data

### pgvector Extension Error?
- ✅ Supabase enables it by default (PostgreSQL 15+)
- ✅ Try: `CREATE EXTENSION IF NOT EXISTS vector;` in SQL Editor

---

## 📊 Next Steps

1. **Populate Knowledge Base**: Load your CSV files from `knowledge_base/` folder
2. **Test Evidence System**: Generate a plan and watch terminal output
3. **Demonstrate to Judges**: Show real vector search results

---

## 🆘 Quick Recovery

If something breaks, revert to fallback mode:
```python
# In config.py
DATABASE_URL: str = "postgresql://postgres:2005@localhost:5432/krishichakra"  # Back to local
```

System will gracefully use fallback data until Supabase is ready! ✅
