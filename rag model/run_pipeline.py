"""
Complete RAG Pipeline Runner
Runs both Phase 1 and Phase 2 sequentially
"""
import subprocess
import sys
import os

def run_phase(phase_script, phase_name):
    """Run a phase script and handle errors"""
    print(f"\n{'='*70}")
    print(f"🚀 Starting {phase_name}")
    print(f"{'='*70}\n")
    
    try:
        result = subprocess.run(
            [sys.executable, phase_script],
            check=True,
            capture_output=False
        )
        print(f"\n✅ {phase_name} completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ {phase_name} failed with error code {e.returncode}")
        return False
    except Exception as e:
        print(f"\n❌ Error running {phase_name}: {e}")
        return False

def main():
    print("="*70)
    print("🌾 RAG DOCUMENT PROCESSING PIPELINE")
    print("    Crop Rotation Research Document Processor")
    print("="*70)
    
    # Phase 1: Extract raw text from PDFs
    phase1_success = run_phase("phase1_extract.py", "PHASE 1: Raw Text Extraction")
    
    if not phase1_success:
        print("\n⚠️  Phase 1 failed. Cannot proceed to Phase 2.")
        return
    
    # Ask user if they want to proceed to Phase 2
    print("\n" + "="*70)
    print("📋 Phase 1 complete. Ready for Phase 2 (AI Cleaning).")
    print("⚠️  Phase 2 will make API calls to DeepSeek.")
    print("   Make sure you've set your API key in phase2_clean.py!")
    print("="*70)
    
    response = input("\nProceed to Phase 2? (y/n): ").strip().lower()
    
    if response == 'y':
        # Phase 2: AI-powered cleaning
        phase2_success = run_phase("phase2_clean.py", "PHASE 2: AI-Powered Cleaning")
        
        if phase2_success:
            print("\n" + "="*70)
            print("🎉 COMPLETE PIPELINE FINISHED SUCCESSFULLY!")
            print("="*70)
            print("\n📂 Your processed documents are in:")
            print("   - raw_extracted/  → Raw PDF text")
            print("   - cleaned/        → Structured, cleaned documents")
        else:
            print("\n⚠️  Phase 2 encountered errors. Check the output above.")
    else:
        print("\n⏸️  Pipeline paused. Run phase2_clean.py manually when ready.")

if __name__ == "__main__":
    main()
