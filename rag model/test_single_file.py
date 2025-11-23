"""
Quick test: Process just ONE file to verify everything works
"""
import os
from openai import OpenAI

API_KEY = "ddc-a4f-af21ceb75c0a47d4afb3b4f5d0dd5804"
BASE_URL = "https://api.a4f.co/v1"
MODEL = "provider-3/deepseek-v3"  # Tested and working!

PROMPT = """You are an agricultural research document processor. 
Extract key information from this research document about crop rotation.

Raw extracted text:
{raw_text}

Please structure the output as:

### DOCUMENT INFO
- Title/Topic: 
- Type: (Research Paper / Article / Web Content)

### KEY CONCEPTS
- Main crop rotations discussed:
- Crops mentioned: 
- Regions covered:

### KEY FINDINGS
- Yield improvements:
- Soil health benefits:
- Disease reduction:
- Economic impact:

### NUMERICAL DATA/TABLES
- Any statistics or measurements mentioned

### CONCLUSIONS
- Main recommendations for farmers:
- Best practices for crop rotation:

Remove all: citations, references, page numbers, navigation text.
Output should be clean, structured, and extraction-ready for RAG."""

# Test with one file
print("🧪 Testing with ONE file...")
test_file = "AgroSense-An Integrated Deep Learning System.txt"
raw_path = os.path.join("raw_extracted", test_file)

print(f"📖 Reading: {test_file}")
with open(raw_path, 'r', encoding='utf-8') as f:
    raw_text = f.read()

print(f"   Length: {len(raw_text)} characters")
print(f"\n🤖 Calling {MODEL}...")

client = OpenAI(api_key=API_KEY, base_url=BASE_URL)

try:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are an expert agricultural research document processor."},
            {"role": "user", "content": PROMPT.format(raw_text=raw_text[:15000])}
        ],
        temperature=0.3,
        max_tokens=2000
    )
    
    result = response.choices[0].message.content
    print("\n✅ SUCCESS! Here's the cleaned output:\n")
    print("="*60)
    print(result)
    print("="*60)
    
    # Save it
    output_path = os.path.join("cleaned", test_file)
    os.makedirs("cleaned", exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(result)
    
    print(f"\n💾 Saved to: {output_path}")
    print("\n🎉 Test successful! API is working properly.")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
