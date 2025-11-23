# RAG Document Processing Pipeline
## Crop Rotation Research Document Processor

This pipeline extracts and cleans agricultural research documents for use in a RAG (Retrieval-Augmented Generation) system.

## 📋 Overview

**Goal**: Process 30 PDF research papers about crop rotation into clean, structured text for RAG.

**Approach**: Two-phase pipeline
- **Phase 1**: Extract raw text locally (no API calls)
- **Phase 2**: Clean and structure with AI (batched API calls)

## 🚀 Quick Start

### 1. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 2. Set Up API Key
Edit `phase2_clean.py` and replace:
```python
API_KEY = "your-api-key-here"
```
with your DeepSeek API key.

### 3. Run the Pipeline

**Option A: Run Everything**
```powershell
python run_pipeline.py
```

**Option B: Run Phases Separately**
```powershell
# Phase 1: Extract raw text
python phase1_extract.py

# Phase 2: AI cleaning (after Phase 1)
python phase2_clean.py
```

## 📁 Folder Structure

```
ieee_papers/          ← Your 30 PDF files (input)
raw_extracted/        ← Raw text extracted from PDFs
cleaned/              ← Structured, cleaned documents (RAG-ready)
```

## 🤖 Recommended Models

| Task | Model | Why |
|------|-------|-----|
| Extract & Clean | `deepseek-v3.1-turbo` | Fast, cost-effective, 5 req/limit friendly |
| Smart Organization | `llama-3.3-70b` | Good instruction following |
| Fallback | `gemma-3-27b-it` | Lightweight, reliable |

**Avoid**: Thinking models (deepseek-r1, qwq) - overkill and slow for this task

## ⚙️ Configuration

Edit `config.py` to customize:
- API keys
- Model selection
- Batch size (default: 5 files per batch)
- Delay between batches (default: 60 seconds)

## 📊 What Gets Extracted

For each document, the AI extracts:
- ✅ Document info (title, type)
- ✅ Key concepts (crop rotations, crops, regions)
- ✅ Key findings (yield, soil health, economics)
- ✅ Numerical data and tables
- ✅ Conclusions and recommendations

**Removed**: Citations, references, page numbers, navigation text

## 🔄 Processing Flow

```
30 PDFs → Phase 1 → 30 raw .txt files → Phase 2 → 30 cleaned .txt files
                                           ↓
                                    6 batches of 5
                                    (60s delay between)
```

## 📝 Sample Output Structure

```markdown
### DOCUMENT INFO
- Title/Topic: AI-Enhanced Precision Crop Rotation
- Type: Research Paper

### KEY CONCEPTS
- Main crop rotations discussed: Rice-Wheat, Legume-based
- Crops mentioned: Rice, Wheat, Lentils, Chickpea
- Regions covered: Indo-Gangetic Plains, India

### KEY FINDINGS
- Yield improvements: 15-20% increase with optimal rotation
- Soil health benefits: Improved nitrogen fixation
...
```

## ⚠️ Important Notes

1. **Rate Limits**: Processes 5 files at a time with 60s delays
2. **Token Limits**: Truncates input to 15,000 characters per document
3. **API Costs**: ~30 API calls total (6 batches × 5 files)
4. **Time**: ~6 minutes for all batches (including delays)

## 🛠️ Troubleshooting

**"No .txt files found"** → Run Phase 1 first
**"API key error"** → Set your API key in phase2_clean.py
**"Rate limit exceeded"** → Increase DELAY_BETWEEN_BATCHES in config.py

## 📞 Support

For issues with:
- PDF extraction → Check PyMuPDF installation
- API calls → Verify API key and credits
- Output quality → Adjust temperature in config.py (default: 0.3)
