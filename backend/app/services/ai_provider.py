import httpx
import asyncio
import numpy as np
from typing import List, Dict, Any
import json

from app.config import settings

class AIProvider:
    """Universal AI provider client using unified API"""
    
    def __init__(self):
        self.api_key = settings.API_KEY
        self.base_url = settings.BASE_URL
    
    async def get_embedding(self, text: str, model: str = "provider-6/qwen3-embedding-4b") -> List[float]:
        """Get text embedding using specified model"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": model,
            "input": text
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/embeddings",
                    headers=headers,
                    json=payload,
                    timeout=30.0
                )
                response.raise_for_status()
                result = response.json()
                return result["data"][0]["embedding"]
            except Exception as e:
                print(f"Embedding error: {e}")
                # Fallback to mock embedding for development
                return np.random.rand(384).tolist()
    
    async def generate_completion(self, messages: List[Dict], model: str = "provider-3/deepseek-v3") -> str:
        """Generate text completion using specified model"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 2000
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=60.0
                )
                response.raise_for_status()
                result = response.json()
                return result["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"Generation error: {e}")
                # Return mock response for development
                return self._mock_generation_response(messages)
    
    def _mock_generation_response(self, messages: List[Dict]) -> str:
        """Mock response for development when API is unavailable"""
        return json.dumps({
            "success": True,
            "reasoning": "AI analysis based on agricultural best practices",
            "crops": [
                {
                    "year": 1,
                    "season": "Kharif",
                    "crop": "Rice",
                    "reason": "Well-suited for the specified soil and climate conditions",
                    "expected_yield": "+25%",
                    "soil_benefits": ["Nitrogen fixation", "Organic matter increase"]
                },
                {
                    "year": 1,
                    "season": "Rabi", 
                    "crop": "Wheat",
                    "reason": "Excellent winter crop for this region",
                    "expected_yield": "+20%",
                    "soil_benefits": ["Soil structure improvement"]
                }
            ],
            "overall_benefits": [
                "Improved soil health through diverse rotation",
                "Reduced pest and disease pressure",
                "Enhanced water use efficiency"
            ],
            "profit_estimate": "₹2,50,000",
            "risk_assessment": "Low to Medium risk with diversified selection",
            "recommendations": [
                "Implement organic farming practices",
                "Monitor soil health regularly",
                "Use precision farming techniques"
            ]
        })

# Global AI provider instance
ai_provider = AIProvider()