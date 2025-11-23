"""
Phase 1: Extract raw text from PDFs
No API calls - just local extraction
"""
import fitz  # PyMuPDF
import os
from pathlib import Path

def extract_raw_text():
    pdf_folder = "ieee_papers"
    output_folder = "raw_extracted"
    
    # Create output folder if it doesn't exist
    Path(output_folder).mkdir(exist_ok=True)
    
    pdf_files = [f for f in os.listdir(pdf_folder) if f.endswith('.pdf')]
    total = len(pdf_files)
    
    print(f"Found {total} PDF files to process\n")
    
    for idx, pdf_file in enumerate(pdf_files, 1):
        try:
            pdf_path = os.path.join(pdf_folder, pdf_file)
            doc = fitz.open(pdf_path)
            
            text = ""
            for page in doc:
                text += page.get_text()
            
            doc.close()
            
            output_file = pdf_file.replace('.pdf', '.txt')
            output_path = os.path.join(output_folder, output_file)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(text)
            
            print(f"[{idx}/{total}] ✓ Extracted: {pdf_file}")
            print(f"          → {len(text)} characters extracted")
            
        except Exception as e:
            print(f"[{idx}/{total}] ✗ Error processing {pdf_file}: {e}")
    
    print(f"\n✅ Phase 1 Complete: {total} files extracted to '{output_folder}/'")

if __name__ == "__main__":
    extract_raw_text()
