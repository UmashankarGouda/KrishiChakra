"""
Test script for Voice Input API
Run this to test the backend voice processing
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/api/voice/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_get_questions():
    """Test get questions endpoint"""
    print("📋 Testing get questions endpoint...")
    response = requests.get(f"{BASE_URL}/api/voice/questions")
    data = response.json()
    print(f"Status: {response.status_code}")
    print(f"Total questions: {data['total']}")
    print("Questions:")
    for i, q in enumerate(data['questions']):
        print(f"  {i+1}. EN: {q['en']}")
        print(f"     HI: {q['hi']}")
        print(f"     Field: {q['field']}\n")

def test_parse_text():
    """Test text parsing endpoint"""
    print("🔤 Testing text parsing...")
    
    test_cases = [
        {"text": "My field name is North Farm A", "question_index": 0, "language": "en-IN"},
        {"text": "The size is 2.5 hectares", "question_index": 1, "language": "en-IN"},
        {"text": "Clay soil", "question_index": 2, "language": "en-IN"},
        {"text": "चिकनी मिट्टी", "question_index": 2, "language": "hi-IN"},
        {"text": "Kharif season", "question_index": 3, "language": "en-IN"},
        {"text": "खरीफ", "question_index": 3, "language": "hi-IN"},
        {"text": "Tropical climate", "question_index": 4, "language": "en-IN"},
        {"text": "Rice crop", "question_index": 5, "language": "en-IN"},
        {"text": "धान", "question_index": 5, "language": "hi-IN"},
    ]
    
    for test in test_cases:
        response = requests.post(
            f"{BASE_URL}/api/voice/parse-text",
            json=test
        )
        data = response.json()
        print(f"Input: '{test['text']}'")
        print(f"Parsed: {data['parsed_value']}")
        print(f"---")

def test_complete_session():
    """Test complete session endpoint"""
    print("\n✅ Testing complete session...")
    
    session_data = {
        "answers": [
            "North Farm A",
            "2.5 hectares",
            "Clay soil",
            "Kharif",
            "Tropical",
            "Rice"
        ],
        "current_question": 6,
        "language": "en-IN"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/voice/complete-session",
        json=session_data
    )
    
    data = response.json()
    print(f"Status: {response.status_code}")
    print("Field Data:")
    print(json.dumps(data['field_data'], indent=2))

if __name__ == "__main__":
    print("=" * 60)
    print("🎤 VOICE INPUT API TEST SUITE")
    print("=" * 60 + "\n")
    
    try:
        test_health()
        test_get_questions()
        test_parse_text()
        test_complete_session()
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS COMPLETED!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Make sure the backend is running: python main.py")
