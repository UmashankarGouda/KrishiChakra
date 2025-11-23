"""
Test script to verify API server works
Shows how frontend will call the API
"""

import requests
import json

# API Base URL
BASE_URL = "http://localhost:8001"

print("="*70)
print("🧪 TESTING PRODUCTION RAG API SERVER")
print("="*70)

# Test 1: Health Check
print("\n1️⃣  Testing Health Check...")
try:
    response = requests.get(f"{BASE_URL}/api/v2/health")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Status: {data['status']}")
        print(f"   📊 Database chunks: {data['database_chunks']}")
        print(f"   🤖 Primary model: {data['model_primary']}")
    else:
        print(f"   ❌ Failed: {response.status_code}")
except Exception as e:
    print(f"   ❌ Error: {e}")
    print("   ⚠️  Make sure server is running: python rag_api_server.py")
    exit(1)

# Test 2: Coverage Info
print("\n2️⃣  Testing Coverage Endpoint...")
try:
    response = requests.get(f"{BASE_URL}/api/v2/coverage")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Specialization: {data['specialization']}")
        print(f"   📚 Excellent crops: {', '.join(data['excellent_coverage'][:3])}...")
    else:
        print(f"   ❌ Failed: {response.status_code}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 3: Single Query (LEGUME FOCUS)
print("\n3️⃣  Testing RAG Query (Legume Question)...")
question = "What are the benefits of including chickpea in crop rotation?"

try:
    payload = {
        "question": question,
        "user_id": "test_user"
    }
    
    print(f"   ❓ Question: {question}")
    response = requests.post(f"{BASE_URL}/api/v2/query", json=payload)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n   ✅ ANSWER RECEIVED:")
        print(f"   {'-'*66}")
        print(f"   {data['answer'][:200]}...")
        print(f"   {'-'*66}")
        print(f"   📚 Sources: {len(data['sources'])} documents")
        print(f"   🎯 Confidence: {data['confidence']}")
    else:
        print(f"   ❌ Failed: {response.status_code}")
        print(f"   {response.text}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 4: Demo Questions
print("\n4️⃣  Testing Demo Questions Endpoint...")
try:
    response = requests.get(f"{BASE_URL}/api/v2/demo/legume-questions")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Category: {data['category']}")
        print(f"   📝 Sample questions:")
        for q in data['questions'][:2]:
            print(f"      - {q['question']}")
    else:
        print(f"   ❌ Failed: {response.status_code}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "="*70)
print("✅ API SERVER TESTING COMPLETE!")
print("="*70)

print("\n🔌 FRONTEND INTEGRATION CODE:")
print("""
// React/JavaScript example
const queryRAG = async (question) => {
    const response = await fetch('http://localhost:8001/api/v2/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question: question,
            user_id: 'farmer123'
        })
    });
    
    const data = await response.json();
    console.log('Answer:', data.answer);
    console.log('Sources:', data.sources);
    return data;
};

// Usage
queryRAG("What are the benefits of including chickpea in crop rotation?");
""")

print("\n📝 CURL TEST COMMAND:")
print(f"""
curl -X POST {BASE_URL}/api/v2/query \\
  -H "Content-Type: application/json" \\
  -d '{{"question": "How does green gram improve soil nitrogen?"}}'
""")

print("\n🌐 Try Swagger UI: http://localhost:8001/docs")
print("="*70 + "\n")
