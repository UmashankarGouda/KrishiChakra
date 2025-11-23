import redis
import json
import hashlib
from typing import Optional, Dict, Any
import asyncio
from app.config import settings

class CacheService:
    def __init__(self):
        self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    
    def _generate_cache_key(self, data: Dict[Any, Any], prefix: str = "plan") -> str:
        """Generate cache key from data"""
        data_str = json.dumps(data, sort_keys=True)
        hash_key = hashlib.md5(data_str.encode()).hexdigest()
        return f"{prefix}:{hash_key}"
    
    async def get_cached_plan(self, request_data: Dict[Any, Any]) -> Optional[Dict]:
        """Get cached rotation plan"""
        try:
            cache_key = self._generate_cache_key(request_data)
            cached_result = self.redis_client.get(cache_key)
            
            if cached_result:
                return json.loads(cached_result)
            return None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None
    
    async def cache_plan(self, request_data: Dict[Any, Any], plan_data: Dict) -> bool:
        """Cache rotation plan with TTL"""
        try:
            cache_key = self._generate_cache_key(request_data)
            cached_data = {
                "plan": plan_data,
                "cached_at": str(asyncio.get_event_loop().time())
            }
            
            self.redis_client.setex(
                cache_key,
                settings.CACHE_TTL,
                json.dumps(cached_data)
            )
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False
    
    async def get_cached_embedding(self, text: str) -> Optional[list]:
        """Get cached text embedding"""
        try:
            cache_key = self._generate_cache_key({"text": text}, "embed")
            cached_result = self.redis_client.get(cache_key)
            
            if cached_result:
                return json.loads(cached_result)
            return None
        except Exception as e:
            print(f"Embedding cache get error: {e}")
            return None
    
    async def cache_embedding(self, text: str, embedding: list) -> bool:
        """Cache text embedding"""
        try:
            cache_key = self._generate_cache_key({"text": text}, "embed")
            
            self.redis_client.setex(
                cache_key,
                settings.CACHE_TTL * 7,  # Embeddings cached longer
                json.dumps(embedding)
            )
            return True
        except Exception as e:
            print(f"Embedding cache set error: {e}")
            return False

# Global cache service instance
cache_service = CacheService()