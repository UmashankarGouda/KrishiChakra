"""
Voice Processing Service
Handles intelligent parsing of voice inputs for field data
"""
import re
from typing import Any, Dict, List, Optional


class VoiceProcessor:
    """Process voice inputs and convert to structured field data"""
    
    def __init__(self):
        self.questions = [
            {
                "en": "What is your field name?",
                "hi": "आपके खेत का नाम क्या है?",
                "field": "name",
                "type": "text"
            },
            {
                "en": "What is the size in hectares?",
                "hi": "हेक्टेयर में आकार क्या है?",
                "field": "size",
                "type": "number"
            },
            {
                "en": "What type of soil? Clay, Sandy, Black Soil, Red Soil, or Alluvial?",
                "hi": "मिट्टी का प्रकार क्या है? चिकनी, रेतीली, काली, लाल, या जलोढ़?",
                "field": "soil_type",
                "type": "enum"
            },
            {
                "en": "Which season? Kharif, Rabi, or Zaid?",
                "hi": "कौन सा मौसम? खरीफ, रबी, या जायद?",
                "field": "season",
                "type": "enum"
            },
            {
                "en": "What is your climate zone? Tropical, Sub-tropical, Semi-Arid, Arid, or Temperate?",
                "hi": "आपका जलवायु क्षेत्र क्या है? उष्णकटिबंधीय, उपोष्णकटिबंधीय, अर्ध शुष्क, शुष्क, या समशीतोष्ण?",
                "field": "climate_zone",
                "type": "enum"
            },
            {
                "en": "What crop are you currently growing? Say 'none' or 'fallow' if empty.",
                "hi": "आप वर्तमान में कौन सी फसल उगा रहे हैं? खाली हो तो 'कोई नहीं' कहें।",
                "field": "current_crop",
                "type": "enum"
            }
        ]
        
        # Mapping dictionaries for intelligent parsing
        self.soil_type_map = {
            'clay': 'Clay',
            'चिकनी': 'Clay',
            'sandy': 'Sandy',
            'रेतीली': 'Sandy',
            'black': 'Black Soil',
            'काली': 'Black Soil',
            'red': 'Red Soil',
            'लाल': 'Red Soil',
            'alluvial': 'Alluvial',
            'जलोढ़': 'Alluvial',
            'loam': 'Clay Loam',
            'दोमट': 'Clay Loam',
            'silt': 'Silt',
            'गाद': 'Silt'
        }
        
        self.season_map = {
            'kharif': 'Kharif',
            'खरीफ': 'Kharif',
            'monsoon': 'Kharif',
            'rabi': 'Rabi',
            'रबी': 'Rabi',
            'winter': 'Rabi',
            'zaid': 'Zaid',
            'जायद': 'Zaid',
            'summer': 'Zaid'
        }
        
        self.climate_zone_map = {
            'tropical': 'Tropical',
            'उष्णकटिबंधीय': 'Tropical',
            'sub-tropical': 'Sub-tropical',
            'subtropical': 'Sub-tropical',
            'उपोष्णकटिबंधीय': 'Sub-tropical',
            'semi-arid': 'Semi-Arid',
            'semi arid': 'Semi-Arid',
            'अर्ध शुष्क': 'Semi-Arid',
            'arid': 'Arid',
            'शुष्क': 'Arid',
            'temperate': 'Temperate',
            'समशीतोष्ण': 'Temperate'
        }
        
        self.crop_map = {
            'rice': 'Rice',
            'धान': 'Rice',
            'चावल': 'Rice',
            'wheat': 'Wheat',
            'गेहूं': 'Wheat',
            'chickpea': 'Chickpea',
            'चना': 'Chickpea',
            'green gram': 'Green Gram',
            'greengram': 'Green Gram',
            'मूंग': 'Green Gram',
            'moong': 'Green Gram',
            'peas': 'Peas',
            'मटर': 'Peas',
            'soybean': 'Soybean',
            'सोयाबीन': 'Soybean',
            'cowpea': 'Cowpea',
            'लोबिया': 'Cowpea',
            'sunflower': 'Sunflower',
            'सूरजमुखी': 'Sunflower',
            'mustard': 'Mustard',
            'सरसों': 'Mustard',
            'groundnut': 'Groundnut',
            'मूंगफली': 'Groundnut',
            'peanut': 'Groundnut',
            'lentil': 'Lentil',
            'मसूर': 'Lentil',
            'masoor': 'Lentil',
            'pigeon pea': 'Pigeon Pea',
            'अरहर': 'Pigeon Pea',
            'arhar': 'Pigeon Pea',
            'toor': 'Pigeon Pea',
            'sorghum': 'Sorghum',
            'ज्वार': 'Sorghum',
            'jowar': 'Sorghum',
            'pearl millet': 'Pearl Millet',
            'बाजरा': 'Pearl Millet',
            'bajra': 'Pearl Millet',
            'none': 'None',
            'कोई नहीं': 'None',
            'fallow': 'None',
            'खाली': 'None',
            'empty': 'None'
        }
    
    def get_questions(self) -> List[Dict[str, str]]:
        """Return all questions"""
        return self.questions
    
    def get_field_name(self, question_index: int) -> str:
        """Get field name for a question"""
        if 0 <= question_index < len(self.questions):
            return self.questions[question_index]["field"]
        return ""
    
    def parse_number(self, text: str) -> float:
        """Extract number from text"""
        # Remove common words
        text = text.lower()
        text = re.sub(r'\b(hectare|hectares|हेक्टेयर|acre|acres|एकड़)\b', '', text)
        
        # Extract first number (integer or decimal)
        match = re.search(r'(\d+\.?\d*)', text)
        if match:
            return float(match.group(1))
        return 0.0
    
    def parse_enum(self, text: str, mapping: Dict[str, str]) -> str:
        """Parse enum value using mapping dictionary"""
        text_lower = text.lower().strip()
        
        # Direct match
        if text_lower in mapping:
            return mapping[text_lower]
        
        # Partial match
        for key, value in mapping.items():
            if key in text_lower or text_lower in key:
                return value
        
        # Return original if no match
        return text.strip()
    
    def parse_answer(self, text: str, question_index: int, language: str = "en-IN") -> Any:
        """
        Parse answer based on question type
        """
        if question_index < 0 or question_index >= len(self.questions):
            raise ValueError(f"Invalid question index: {question_index}")
        
        question = self.questions[question_index]
        field_type = question["type"]
        
        if field_type == "text":
            return text.strip()
        
        elif field_type == "number":
            return self.parse_number(text)
        
        elif field_type == "enum":
            field_name = question["field"]
            
            if field_name == "soil_type":
                return self.parse_enum(text, self.soil_type_map)
            
            elif field_name == "season":
                return self.parse_enum(text, self.season_map)
            
            elif field_name == "climate_zone":
                return self.parse_enum(text, self.climate_zone_map)
            
            elif field_name == "current_crop":
                return self.parse_enum(text, self.crop_map)
        
        return text.strip()
    
    def process_complete_session(self, answers: List[str], language: str = "en-IN") -> Dict[str, Any]:
        """
        Process all answers and return structured field data
        """
        field_data = {}
        
        for i, answer in enumerate(answers):
            if i < len(self.questions):
                field_name = self.questions[i]["field"]
                parsed_value = self.parse_answer(answer, i, language)
                field_data[field_name] = parsed_value
        
        return field_data
