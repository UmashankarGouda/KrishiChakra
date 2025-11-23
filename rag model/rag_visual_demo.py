"""
Visual RAG Example - See how it works step by step
"""

print("="*70)
print("🎓 RAG SYSTEM - VISUAL WALKTHROUGH")
print("="*70)

# ============================================================================
# STEP 1: CHUNKING
# ============================================================================
print("\n📄 STEP 1: CHUNKING")
print("-" * 70)

original_doc = """
Rice-wheat rotation in Punjab, India has shown significant improvements 
in soil health and crop yields. Farmers reported a 20% increase in wheat 
yields when rotating with rice. The system also improved soil nitrogen 
levels by 15% compared to continuous wheat cultivation. Additionally, 
this rotation reduced pest pressure and disease incidence.
"""

chunks = [
    "Rice-wheat rotation in Punjab, India has shown significant improvements in soil health and crop yields.",
    "Farmers reported a 20% increase in wheat yields when rotating with rice.",
    "The system also improved soil nitrogen levels by 15% compared to continuous wheat cultivation.",
    "Additionally, this rotation reduced pest pressure and disease incidence."
]

print(f"Original Document: {len(original_doc)} characters")
print(f"After Chunking: {len(chunks)} chunks\n")
for i, chunk in enumerate(chunks, 1):
    print(f"  Chunk {i}: {chunk[:60]}...")

# ============================================================================
# STEP 2: EMBEDDINGS
# ============================================================================
print("\n\n🧮 STEP 2: EMBEDDINGS (Converting Text to Numbers)")
print("-" * 70)

# Simplified representation (real embeddings have 384-1536 dimensions)
embeddings_example = {
    "wheat farming": [0.8, 0.6, 0.2, -0.3],
    "cultivating wheat": [0.75, 0.65, 0.18, -0.25],  # Similar!
    "rice cultivation": [0.7, 0.5, 0.3, -0.1],
    "cricket match": [-0.2, 0.1, 0.9, 0.7]  # Very different!
}

print("\nText → Vector (embedding):")
for text, embedding in embeddings_example.items():
    print(f"  '{text}' → {embedding}")

print("\n💡 Notice: Similar meanings have similar numbers!")

# ============================================================================
# STEP 3: VECTOR DATABASE
# ============================================================================
print("\n\n🗄️ STEP 3: VECTOR DATABASE")
print("-" * 70)

print("\nStored in ChromaDB:")
print("┌──────┬─────────────────────────────────────┬──────────────────────┐")
print("│ ID   │ Text Chunk                          │ Embedding (sample)   │")
print("├──────┼─────────────────────────────────────┼──────────────────────┤")
print("│ ch_1 │ Rice-wheat rotation in Punjab...    │ [0.8, 0.6, 0.2, ...] │")
print("│ ch_2 │ Farmers reported 20% increase...    │ [0.75, 0.65, 0.18...]│")
print("│ ch_3 │ Soil nitrogen levels by 15%...      │ [0.7, 0.5, 0.3, ...] │")
print("└──────┴─────────────────────────────────────┴──────────────────────┘")

# ============================================================================
# STEP 4: RETRIEVAL
# ============================================================================
print("\n\n🔍 STEP 4: RETRIEVAL (Finding Relevant Chunks)")
print("-" * 70)

user_question = "How to improve wheat yields?"
print(f"\n❓ User Question: '{user_question}'")

print("\n1️⃣ Convert question to embedding:")
question_embedding = [0.78, 0.62, 0.21, -0.28]
print(f"   Question Embedding: {question_embedding}")

print("\n2️⃣ Search database for similar embeddings:")
print("   Comparing with all chunks using cosine similarity...")

search_results = [
    ("ch_2", "Farmers reported 20% increase in wheat yields...", 0.92),
    ("ch_3", "Soil nitrogen levels by 15%...", 0.87),
    ("ch_1", "Rice-wheat rotation in Punjab...", 0.81),
]

print("\n3️⃣ Top 3 Results (most similar):")
for rank, (chunk_id, text, similarity) in enumerate(search_results, 1):
    print(f"   {rank}. [{chunk_id}] Similarity: {similarity:.2f}")
    print(f"      Text: {text[:50]}...")

# ============================================================================
# STEP 5: GENERATION
# ============================================================================
print("\n\n🤖 STEP 5: GENERATION (Creating Answer with LLM)")
print("-" * 70)

print("\n📝 Building Prompt for LLM:")
print("\n┌────────────────────────────────────────────────────────────────┐")
print("│ PROMPT SENT TO AI:                                            │")
print("├────────────────────────────────────────────────────────────────┤")
print("│ Context from your research papers:                            │")
print("│                                                                │")
print("│ 1. Farmers reported a 20% increase in wheat yields when       │")
print("│    rotating with rice.                                        │")
print("│                                                                │")
print("│ 2. The system improved soil nitrogen levels by 15% compared   │")
print("│    to continuous wheat cultivation.                           │")
print("│                                                                │")
print("│ 3. Rice-wheat rotation in Punjab, India has shown significant │")
print("│    improvements in soil health and crop yields.               │")
print("│                                                                │")
print("│ ─────────────────────────────────────────────────────────────│")
print("│                                                                │")
print("│ User Question: How to improve wheat yields?                   │")
print("│                                                                │")
print("│ Answer based ONLY on the context above:                       │")
print("└────────────────────────────────────────────────────────────────┘")

print("\n\n✅ AI RESPONSE:")
print("\n┌────────────────────────────────────────────────────────────────┐")
print("│ Based on the research papers, you can improve wheat yields    │")
print("│ through rice-wheat crop rotation. Studies in Punjab, India    │")
print("│ showed a 20% increase in wheat yields when rotating with rice.│")
print("│                                                                │")
print("│ This rotation system also:                                    │")
print("│ • Improves soil nitrogen levels by 15%                        │")
print("│ • Enhances overall soil health                                │")
print("│ • Reduces pest pressure                                       │")
print("│                                                                │")
print("│ The rice-wheat rotation is particularly effective in the      │")
print("│ Indo-Gangetic plains region.                                  │")
print("└────────────────────────────────────────────────────────────────┘")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n\n" + "="*70)
print("📊 COMPLETE RAG FLOW SUMMARY")
print("="*70)

print("""
┌─────────────┐
│ 30 Documents│  Your cleaned research papers
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Chunk     │  Split into ~500 word pieces
│  (~200)     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Embeddings │  Convert to vectors [0.23, -0.45, ...]
│             │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  ChromaDB   │  Store all chunks + embeddings
│  Database   │
└──────┬──────┘
       │
       │  ┌──────────────┐
       │  │ User Question│ "Best wheat rotation?"
       │  └──────┬───────┘
       │         │
       ▼         ▼
┌─────────────────┐
│   Search DB     │  Find top 3 similar chunks
│  (Similarity)   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Retrieved      │  "Rice-wheat increases yield 20%..."
│  Context        │  "Soil nitrogen +15%..."
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Send to LLM    │  Context + Question → DeepSeek
│  (DeepSeek)     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Final Answer   │  "Based on research, rice-wheat
│  to User        │   rotation increases yield by 20%..."
└─────────────────┘
""")

print("="*70)
print("🎯 KEY TAKEAWAY:")
print("="*70)
print("""
RAG = Search Engine + AI Chat

1. You ask a question
2. System finds relevant parts from YOUR documents (not internet)
3. AI generates answer using ONLY those specific parts
4. Result: Accurate, citation-backed answers from your research!

✅ No hallucinations
✅ Always references your documents
✅ Domain-specific knowledge (agriculture)
""")

print("\n" + "="*70)
print("Ready to build this? Let's start with Step 1! 🚀")
print("="*70)
