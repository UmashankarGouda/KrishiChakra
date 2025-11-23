"""
Test script to verify API connection and list available models
"""
from openai import OpenAI
import json

API_KEY = "ddc-a4f-af21ceb75c0a47d4afb3b4f5d0dd5804"
BASE_URL = "https://api.a4f.co/v1"

def test_api_connection():
    """Test basic API connectivity"""
    print("🔍 Testing API Connection...")
    print(f"   URL: {BASE_URL}")
    print(f"   Key: {API_KEY[:20]}...")
    
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
    
    # Try to list models
    print("\n📋 Attempting to list available models...")
    try:
        models = client.models.list()
        print("\n✅ Available models:")
        for model in models.data:
            print(f"   - {model.id}")
        return True
    except Exception as e:
        print(f"\n❌ Error listing models: {e}")
        
    # Try a simple completion
    print("\n🧪 Testing a simple completion...")
    test_models = [
        "provider-1/deepseek-v3.1-turbo",
        "deepseek-v3.1-turbo",
        "provider-1/qwen-3-235b",
        "provider-1/llama-3.3-70b",
        "gpt-3.5-turbo",
    ]
    
    for model in test_models:
        try:
            print(f"\n   Trying model: {model}")
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "user", "content": "Say 'API working' if you can read this."}
                ],
                max_tokens=10
            )
            print(f"   ✅ SUCCESS with {model}!")
            print(f"   Response: {response.choices[0].message.content}")
            return True
        except Exception as e:
            print(f"   ✗ Failed: {str(e)[:100]}")
    
    return False

if __name__ == "__main__":
    print("="*60)
    print("API CONNECTION TEST")
    print("="*60)
    success = test_api_connection()
    print("\n" + "="*60)
    if success:
        print("✅ API is working! You can proceed with Phase 2.")
    else:
        print("❌ API connection failed. Check:")
        print("   1. API key is correct")
        print("   2. API service is online")
        print("   3. Model names are correct")
    print("="*60)
