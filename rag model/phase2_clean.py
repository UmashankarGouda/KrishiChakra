"""
Phase 2: AI-Powered Cleaning and Structuring
Processes files in batches of 5 to respect API rate limits
Uses DeepSeek-V3.1-Turbo for fast, cost-effective extraction
"""
import os
import time
from pathlib import Path
from openai import OpenAI

# Configuration
API_KEY = "ddc-a4f-af21ceb75c0a47d4afb3b4f5d0dd5804"
BASE_URL = "https://api.a4f.co/v1"
MODEL = "provider-3/deepseek-v3"  # Fast, reliable, and cost-effective (tested working!)
# Alternative models that work: provider-1/deepseek-v3-0324, provider-3/llama-3.3-70b, provider-3/qwen-2.5-72b
BATCH_SIZE = 5  # Process 5 files at a time (matches your rate limit)
DELAY_BETWEEN_BATCHES = 60  # Wait 60 seconds between batches

# Prompt template for structured extraction
EXTRACTION_PROMPT = """You are an agricultural research document processor. 
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

def initialize_client():
    """Initialize OpenAI client for API"""
    client = OpenAI(
        api_key=API_KEY,
        base_url=BASE_URL
    )
    return client

def clean_with_llm(client, raw_text, filename, max_retries=3):
    """Send raw text to LLM for cleaning and structuring with retry logic"""
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert agricultural research document processor."},
                    {"role": "user", "content": EXTRACTION_PROMPT.format(raw_text=raw_text[:15000])}  # Limit to ~15k chars to avoid token limits
                ],
                temperature=0.3,  # Low temperature for consistent extraction
                max_tokens=2000
            )
            
            cleaned_text = response.choices[0].message.content
            return cleaned_text
        
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 5  # 5, 10, 15 seconds
                print(f"    ⚠️  Attempt {attempt + 1} failed, retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"    ✗ Error calling LLM for {filename} after {max_retries} attempts: {e}")
                return None
    
    return None

def process_batch(client, files_batch, batch_num, total_batches):
    """Process a batch of 5 files"""
    print(f"\n{'='*60}")
    print(f"BATCH {batch_num}/{total_batches}")
    print(f"{'='*60}")
    
    raw_folder = "raw_extracted"
    cleaned_folder = "cleaned"
    
    # Create cleaned folder if it doesn't exist
    Path(cleaned_folder).mkdir(exist_ok=True)
    
    for idx, txt_file in enumerate(files_batch, 1):
        try:
            # Read raw text
            raw_path = os.path.join(raw_folder, txt_file)
            with open(raw_path, 'r', encoding='utf-8') as f:
                raw_text = f.read()
            
            print(f"\n[{idx}/5] Processing: {txt_file}")
            print(f"      Raw text length: {len(raw_text)} characters")
            
            # Clean with LLM
            print(f"      Calling {MODEL}...")
            cleaned_text = clean_with_llm(client, raw_text, txt_file)
            
            if cleaned_text:
                # Save cleaned output
                output_path = os.path.join(cleaned_folder, txt_file)
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(cleaned_text)
                
                print(f"      ✓ Saved to: {output_path}")
            else:
                print(f"      ✗ Failed to clean {txt_file}")
        
        except Exception as e:
            print(f"      ✗ Error: {e}")

def main():
    # Check if API key is set
    if API_KEY == "your-api-key-here":
        print("⚠️  ERROR: Please set your API key in the script!")
        print("   Edit phase2_clean.py and replace 'your-api-key-here' with your actual API key")
        return
    
    raw_folder = "raw_extracted"
    
    # Get all raw text files
    txt_files = [f for f in os.listdir(raw_folder) if f.endswith('.txt')]
    total_files = len(txt_files)
    
    if total_files == 0:
        print("⚠️  No .txt files found in raw_extracted/")
        print("   Run phase1_extract.py first!")
        return
    
    print(f"📚 Found {total_files} raw text files")
    print(f"🤖 Using model: {MODEL}")
    print(f"📦 Batch size: {BATCH_SIZE} files per batch")
    print(f"🔗 API URL: {BASE_URL}")
    
    # Initialize OpenAI client
    print("\n🔌 Connecting to API...")
    client = initialize_client()
    
    # Split files into batches
    batches = [txt_files[i:i+BATCH_SIZE] for i in range(0, len(txt_files), BATCH_SIZE)]
    total_batches = len(batches)
    
    print(f"📊 Total batches: {total_batches}")
    
    # Process each batch
    for batch_num, batch in enumerate(batches, 1):
        process_batch(client, batch, batch_num, total_batches)
        
        # Wait between batches (except for the last one)
        if batch_num < total_batches:
            print(f"\n⏳ Waiting {DELAY_BETWEEN_BATCHES} seconds before next batch...")
            print(f"   (Rate limit protection)")
            time.sleep(DELAY_BETWEEN_BATCHES)
    
    print(f"\n{'='*60}")
    print(f"✅ PHASE 2 COMPLETE!")
    print(f"   Processed {total_files} files across {total_batches} batches")
    print(f"   Cleaned documents saved to: cleaned/")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
