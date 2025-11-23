"""
Crop Rotation Plan API with Bhuvan Integration
Handles AI-powered crop rotation planning with land use data
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import requests
import logging
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import re
import json

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/rotation", tags=["rotation"])


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class FieldInfo(BaseModel):
    """Field information for rotation planning"""
    id: str
    name: str
    location: str
    size: float
    soil_type: str
    climate_zone: str
    season: str
    current_crop: str
    user_id: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class GeneratePlanRequest(BaseModel):
    """Request for generating crop rotation plan"""
    field: FieldInfo
    planning_years: int = 3
    specific_requirements: Optional[str] = None


class CropRotationPlan(BaseModel):
    """Crop rotation plan response"""
    id: str
    field_id: str
    planning_years: int
    crops: List[Dict[str, Any]]
    overall_benefits: List[str]
    profit_estimate: str
    risk_assessment: str
    recommendations: List[str]
    created_at: str
    bhuvan_data: Optional[Dict[str, Any]] = None  # New field for Bhuvan data


# ============================================================================
# BHUVAN API INTEGRATION
# ============================================================================

def create_bounding_box_polygon(latitude: float, longitude: float, delta: float = 0.01) -> str:
    """
    Create a WKT polygon around a lat/lon point
    
    Args:
        latitude: Center latitude
        longitude: Center longitude
        delta: Half-width of the box in degrees (default 0.01 = ~1km)
    
    Returns:
        WKT polygon string
    """
    min_lon = longitude - delta
    max_lon = longitude + delta
    min_lat = latitude - delta
    max_lat = latitude + delta
    
    # WKT format: POLYGON((lon1 lat1, lon2 lat2, ...))
    wkt = f"POLYGON(({min_lon} {min_lat}, {max_lon} {min_lat}, {max_lon} {max_lat}, {min_lon} {max_lat}, {min_lon} {min_lat}))"
    return wkt


from app.config import settings


def fetch_bhuvan_lulc_stats(latitude: float, longitude: float) -> Optional[Dict[str, Any]]:
    """
    Fetch Land Use Land Cover statistics from Bhuvan API
    
    Args:
        latitude: Field latitude
        longitude: Field longitude
    
    Returns:
        Bhuvan API response data or None if failed
    """
    try:
        # Simulation mode per user request: Do NOT call the remote API.
        # Return realistic-looking AOI-wise LULC data immediately and print to console.
        simulate = True
        if simulate:
            polygon_wkt = create_bounding_box_polygon(latitude, longitude)
            # Build a small, believable AOI-wise summary; values are illustrative
            total_area = 3.12  # sqkm for the small bounding box
            simulated = {
                "status": "success",
                "service": "LULC 250K AOI Wise Statistics",
                "year": "2015-16",
                "aoi": {
                    "polygon": polygon_wkt,
                    "centroid": {"lat": latitude, "lon": longitude}
                },
                "summary": {
                    "total_area_sqkm": total_area,
                    "dominant_class": "Agriculture - Crop land"
                },
                "classes": [
                    {"code": 1, "name": "Agriculture - Crop land", "area_sqkm": 1.28, "percent": 41.0},
                    {"code": 2, "name": "Fallow", "area_sqkm": 0.35, "percent": 11.2},
                    {"code": 3, "name": "Forest", "area_sqkm": 0.92, "percent": 29.5},
                    {"code": 4, "name": "Built-up", "area_sqkm": 0.17, "percent": 5.4},
                    {"code": 5, "name": "Waterbodies", "area_sqkm": 0.11, "percent": 3.6},
                    {"code": 6, "name": "Others", "area_sqkm": 0.29, "percent": 9.3}
                ],
                "source": "Bhuvan_Isro"
            }
            # Print to console in the same format as the live call for continuity
            print("\n" + "="*70)
            print("--- BHUVAN API 250K STATS DATA ---")
            print("="*70)
            import json as _json
            print(_json.dumps(simulated, indent=2))
            print("="*70 + "\n")
            logger.info("✅ Using simulated Bhuvan AOI-wise data (no network call)")
            return simulated

        # ============ Real call path (currently disabled by simulate flag) ============
        # Bhuvan API configuration
        # Prefer correct env var name
        access_token = getattr(settings, 'BHUVAN_TOKEN', None)
        # Backward-compat fallback if someone misspelled the attribute elsewhere
        if not access_token:
            access_token = getattr(settings, 'BHUWAN_TOKEN', None)
        if not access_token:
            logger.warning("Bhuvan token not configured; set BHUVAN_TOKEN in environment")
            return None
        api_url = "https://bhuvan-app1.nrsc.gov.in/api/lulc250k/curl_lulc250k.php"
        
        # Create polygon around the coordinates
        polygon_wkt = create_bounding_box_polygon(latitude, longitude)
        
        # Prepare request
        # Note: Bhuvan LULC 250k expects the access token as a form field named 'token'.
        # Authorization header is ignored by this endpoint.
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "User-Agent": "KrishiChakra/1.0 (+https://example.com)"
        }
        
        # Prefer year with hyphen; this format is accepted by the API
        payload = {
            "token": access_token,
            "polygon": polygon_wkt,
            "year": "2015-16",
            "option": "json"
        }
        
        logger.info(f"🌍 Calling Bhuvan API for location: ({latitude}, {longitude})")
        logger.info(f"📍 Polygon: {polygon_wkt}")
        
        # Prepare a session with retries for robustness
        session = requests.Session()
        retries = Retry(
            total=3,
            backoff_factor=0.5,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET", "POST"]
        )
        adapter = HTTPAdapter(max_retries=retries)
        session.mount("http://", adapter)
        session.mount("https://", adapter)

        # Make API call (try GET first; API often responds JSON via GET)
        logger.info("🌐 Querying Bhuvan LULC AOI-wise (GET)...")
        response = session.get(
            api_url,
            params=payload,
            headers={k: v for k, v in headers.items() if k.lower() != "content-type"},
            timeout=(5, 10)
        )
        
        # Check response
        response.raise_for_status()
        
        # If the server complains about missing parameters, try POST fallback
        text_lower = (response.text or "").lower()
        if "all required parameters are not available" in text_lower:
            logger.info("🔁 Bhuvan GET complained about params; retrying with POST...")
            response = session.post(
                api_url,
                headers=headers,
                data=payload,
                timeout=(5, 10)  # (connect, read)
            )
            response.raise_for_status()
        
        # Parse JSON safely
        try:
            bhuvan_data = response.json()
        except ValueError:
            logger.error("❌ Bhuvan API returned non-JSON response")
            text = response.text or ""
            # Attempt to extract a JSON object embedded within HTML
            match = re.search(r"\{[\s\S]*\}", text)
            if match:
                try:
                    bhuvan_data = json.loads(match.group(0))
                    logger.info("ℹ️ Parsed JSON embedded in HTML response from Bhuvan")
                    # Log concise error if present
                    if isinstance(bhuvan_data, dict) and 'error' in bhuvan_data:
                        logger.warning(f"Bhuvan API error: {bhuvan_data.get('error')}: {bhuvan_data.get('error_description')}")
                    # Treat as valid parsed payload (could be error object)
                    return bhuvan_data
                except Exception:
                    pass
            # Fallback: print a small snippet and return None
            snippet = text[:500]
            print("\n" + "="*70)
            print("--- BHUVAN API 250K STATS DATA (non-JSON response) ---")
            print("="*70)
            print(f"Status Code: {response.status_code}")
            print("Response text (first 500 chars):")
            print(snippet)
            print("="*70 + "\n")
            return None
        
        # Print raw response to console
        print("\n" + "="*70)
        print("--- BHUVAN API 250K STATS DATA ---")
        print("="*70)
        print(f"Status Code: {response.status_code}")
        print(f"Raw JSON Response:")
        try:
            dumped = json.dumps(bhuvan_data, indent=2)
        except Exception:
            dumped = str(bhuvan_data)
        # Avoid flooding console if extremely large
        if len(dumped) > 4000:
            print(dumped[:4000] + "\n... [truncated]")
        else:
            print(dumped)
        print("="*70 + "\n")
        
        logger.info("✅ Bhuvan API call successful")
        return bhuvan_data
        
    except requests.exceptions.Timeout:
        logger.error("⏱️ Bhuvan API request timed out")
        print("ERROR: Bhuvan API request timed out after 10 seconds")
        return None
        
    except requests.exceptions.HTTPError as e:
        logger.error(f"❌ Bhuvan API HTTP error: {e}")
        print(f"ERROR: Bhuvan API HTTP error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            txt = e.response.text or ""
            print(f"Response text (first 500 chars): {txt[:500]}")
        else:
            print("Response text: N/A")
        return None
        
    except Exception as e:
        logger.error(f"❌ Bhuvan API call failed: {str(e)}")
        print(f"ERROR: Bhuvan API call failed: {str(e)}")
        return None


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/generate-ai-plan")
async def generate_ai_plan(request: GeneratePlanRequest) -> CropRotationPlan:
    """
    Generate AI-powered crop rotation plan with Bhuvan land use data integration
    
    This endpoint:
    1. Fetches land use data from Bhuvan API (if lat/lon provided)
    2. Calls the RAG API for AI-powered rotation planning
    3. Returns combined results
    """
    try:
        bhuvan_data = None
        
        # Step 1: Fetch Bhuvan data if coordinates are provided
        if (request.field.latitude is not None) and (request.field.longitude is not None):
            logger.info(f"📍 Coordinates provided: ({request.field.latitude}, {request.field.longitude})")
            bhuvan_data = fetch_bhuvan_lulc_stats(
                request.field.latitude,
                request.field.longitude
            )
        else:
            logger.info("⚠️ No coordinates provided, skipping Bhuvan API call")
        
        # Step 2: Call RAG API for crop rotation planning
        logger.info("🤖 Calling RAG API for crop rotation planning...")
        
        rag_api_url = "http://localhost:8001/api/v2/query"
        
        # Build query for RAG
        query_text = (
            f"Generate a detailed {request.planning_years}-year crop rotation plan for "
            f"{request.field.location} ({request.field.size} acres, {request.field.soil_type} soil, "
            f"{request.field.climate_zone} climate). Include: 1) Crop sequence with specific crops "
            f"for each year, 2) Expected yields, 3) Soil benefits, 4) Profit estimation, "
            f"5) Risk assessment, 6) Recommendations."
        )
        
        if request.specific_requirements:
            query_text += f" Additional requirements: {request.specific_requirements}"
        
        rag_payload = {
            "question": query_text,
            "user_id": request.field.user_id or "demo_user"
        }
        
        rag_response = requests.post(
            rag_api_url,
            json=rag_payload,
            timeout=30
        )
        
        rag_response.raise_for_status()
        rag_data = rag_response.json()
        
        logger.info("✅ RAG API call successful")
        
        # Step 3: Parse RAG response into structured format
        # Note: You'll need to implement proper parsing based on RAG response structure
        # For now, returning a basic structure
        
        from datetime import datetime
        
        plan = CropRotationPlan(
            id=f"plan_{int(datetime.now().timestamp())}",
            field_id=request.field.id,
            planning_years=request.planning_years,
            crops=[],  # TODO: Parse from RAG response
            overall_benefits=[],  # TODO: Parse from RAG response
            profit_estimate="",  # TODO: Parse from RAG response
            risk_assessment="",  # TODO: Parse from RAG response
            recommendations=[],  # TODO: Parse from RAG response
            created_at=datetime.now().isoformat(),
            bhuvan_data=bhuvan_data  # Include Bhuvan data in response
        )
        
        return plan
        
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="RAG API request timed out")
        
    except requests.exceptions.HTTPError as e:
        logger.error(f"RAG API error: {e}")
        raise HTTPException(
            status_code=e.response.status_code if hasattr(e, 'response') else 500,
            detail=f"RAG API error: {str(e)}"
        )
        
    except Exception as e:
        logger.error(f"Error generating plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating plan: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "OK",
        "service": "Rotation Planning API",
        "bhuvan_integration": "enabled",
        "rag_api": "http://localhost:8001"
    }
