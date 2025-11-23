"""
Quick Voice API Demo
Shows how the voice processing works
"""
from app.services.voice_processor import VoiceProcessor

def demo():
    processor = VoiceProcessor()
    
    print("🎤 VOICE PROCESSOR DEMO")
    print("=" * 60)
    
    # Example 1: Parse field name
    print("\n1️⃣  Field Name (Text)")
    text = "My field name is North Farm A"
    result = processor.parse_answer(text, 0)
    print(f"   Input: '{text}'")
    print(f"   Output: '{result}'")
    
    # Example 2: Parse size
    print("\n2️⃣  Field Size (Number)")
    text = "The size is 2.5 hectares"
    result = processor.parse_answer(text, 1)
    print(f"   Input: '{text}'")
    print(f"   Output: {result}")
    
    # Example 3: Parse soil type (English)
    print("\n3️⃣  Soil Type (English)")
    text = "Clay soil"
    result = processor.parse_answer(text, 2)
    print(f"   Input: '{text}'")
    print(f"   Output: '{result}'")
    
    # Example 4: Parse soil type (Hindi)
    print("\n4️⃣  Soil Type (Hindi)")
    text = "चिकनी मिट्टी"
    result = processor.parse_answer(text, 2, "hi-IN")
    print(f"   Input: '{text}'")
    print(f"   Output: '{result}'")
    
    # Example 5: Parse season
    print("\n5️⃣  Season")
    text = "खरीफ मौसम"
    result = processor.parse_answer(text, 3, "hi-IN")
    print(f"   Input: '{text}'")
    print(f"   Output: '{result}'")
    
    # Example 6: Parse climate
    print("\n6️⃣  Climate Zone")
    text = "tropical climate"
    result = processor.parse_answer(text, 4)
    print(f"   Input: '{text}'")
    print(f"   Output: '{result}'")
    
    # Example 7: Parse crop (Hindi)
    print("\n7️⃣  Current Crop (Hindi)")
    text = "धान की फसल"
    result = processor.parse_answer(text, 5, "hi-IN")
    print(f"   Input: '{text}'")
    print(f"   Output: '{result}'")
    
    # Example 8: Complete session
    print("\n8️⃣  Complete Session")
    answers = [
        "North Farm A",
        "2.5 hectares",
        "Clay soil",
        "Kharif",
        "Tropical",
        "Rice"
    ]
    field_data = processor.process_complete_session(answers)
    print("   Answers:", answers)
    print("   Field Data:")
    for key, value in field_data.items():
        print(f"      {key}: {value}")
    
    print("\n" + "=" * 60)
    print("✅ Demo completed!")

if __name__ == "__main__":
    demo()
