"""
Monitor the progress of Phase 2 cleaning
"""
import os
import time

cleaned_folder = "cleaned"
raw_folder = "raw_extracted"

# Count files
raw_files = len([f for f in os.listdir(raw_folder) if f.endswith('.txt')])

print("="*60)
print("📊 PHASE 2 PROGRESS MONITOR")
print("="*60)

while True:
    if os.path.exists(cleaned_folder):
        cleaned_files = len([f for f in os.listdir(cleaned_folder) if f.endswith('.txt')])
    else:
        cleaned_files = 0
    
    progress = (cleaned_files / raw_files) * 100
    
    print(f"\r🔄 Progress: {cleaned_files}/{raw_files} files ({progress:.1f}%)    ", end='', flush=True)
    
    if cleaned_files >= raw_files:
        print("\n\n✅ COMPLETE! All files processed.")
        break
    
    time.sleep(5)  # Check every 5 seconds
