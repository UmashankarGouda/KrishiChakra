import { FieldBatch } from './types'
import { batchSimplify, cleanAIFormatting } from './farmer-friendly-ai'

export interface CustomPlanRequest {
  field: FieldBatch
  planningYears: number
  specificRequirements?: string
}

export interface CropRotationPlan {
  id: string
  fieldId: string
  planningYears: number
  crops: {
    year: number
    season: string
    crop: string
    reason: string
    expected_yield: string
    soil_benefits: string[]
  }[]
  overallBenefits: string[]
  profitEstimate: string
  riskAssessment: string
  recommendations: string[]
  createdAt: string
}

// RAG Backend API calls
export const generateCustomPlan = async (request: CustomPlanRequest): Promise<CropRotationPlan> => {
  try {
    // Call the new RAG API server on port 8001 (from "rag model" folder)
    const response = await fetch('http://localhost:8001/api/v2/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: `Generate a detailed ${request.planningYears}-year crop rotation plan for ${request.field.location} (${request.field.size} acres, ${request.field.soil_type} soil, ${request.field.climate_zone} climate). Include: 1) Crop sequence with specific crops for each year, 2) Expected yields, 3) Soil benefits, 4) Profit estimation, 5) Risk assessment, 6) Recommendations.${request.specificRequirements ? ' Additional requirements: ' + request.specificRequirements : ''}`,
        user_id: request.field.user_id || 'demo_user'
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Parse the RAG response into CropRotationPlan format
    console.log('RAG Response:', data)
    return parseRAGResponse(data, request)
  } catch (error) {
    console.error('Error calling RAG backend:', error)
    
    // Fallback to mock data for development/offline mode
    console.log('Using mock data as fallback')
    return generateMockPlan(request)
  }
}

// Parse RAG text response into structured CropRotationPlan
async function parseRAGResponse(ragData: any, request: CustomPlanRequest): Promise<CropRotationPlan> {
  const answer = ragData.answer || ''
  const sources = ragData.sources || []
  
  // Extract crops for each year from the answer
  const crops = extractCropsFromAnswer(answer, request.planningYears)
  
  // Extract profit estimate (raw)
  const rawProfitEstimate = extractSection(answer, ['profit', 'revenue', 'income', 'economic']) || 
    `Based on the rotation plan and current market rates, estimated annual profit ranges from ₹${(request.field.size * 25000).toLocaleString()} to ₹${(request.field.size * 45000).toLocaleString()} per acre, with total ${request.planningYears}-year profit of approximately ₹${(request.field.size * request.planningYears * 35000).toLocaleString()}.`
  
  // Extract risk assessment (raw)
  const rawRiskAssessment = extractSection(answer, ['risk', 'challenge', 'warning', 'concern', 'threat']) ||
    `Key risks include weather variability, market price fluctuations, and pest management. Legume crops may face challenges with pod borer infestations. Diversified rotation helps mitigate soil depletion and disease buildup. Regular monitoring and integrated pest management recommended.`
  
  // Extract overall benefits (raw)
  const rawBenefits = extractBenefits(answer) || [
    'Improved soil nitrogen through legume fixation',
    'Reduced dependency on chemical fertilizers',
    'Enhanced soil structure and organic matter',
    'Diversified income sources across seasons',
    'Natural pest and disease cycle disruption',
    'Sustainable long-term soil health improvement'
  ]
  
  // Extract recommendations (raw)
  const rawRecommendations = extractRecommendations(answer) || [
    'Use certified seeds with high germination rates',
    'Implement drip irrigation for water efficiency',
    'Apply biofertilizers to enhance legume nitrogen fixation',
    'Monitor soil health with periodic testing',
    'Adopt integrated pest management practices',
    'Maintain crop residue management for organic matter',
    'Plan harvest timing to optimize market prices'
  ]
  
  // 🌾 SIMPLIFY FOR FARMERS using AI
  console.log('Simplifying text for farmers...')
  const simplified = await batchSimplify({
    benefits: rawBenefits.join('\n'),
    risks: rawRiskAssessment,
    recommendations: rawRecommendations
  })
  
  return {
    id: `plan_${Date.now()}`,
    fieldId: request.field.id,
    planningYears: request.planningYears,
    crops,
    overallBenefits: simplified.benefits.split('\n').filter(b => b.trim()),
    profitEstimate: cleanAIFormatting(rawProfitEstimate),
    riskAssessment: simplified.risks,
    recommendations: simplified.recommendations,
    createdAt: new Date().toISOString()
  }
}

// Extract crop information from RAG answer
function extractCropsFromAnswer(answer: string, years: number): CropRotationPlan['crops'] {
  const crops: CropRotationPlan['crops'] = []
  
  // Try to find crop mentions in the answer
  const cropPatterns = [
    /year\s+(\d+)[:\s]+([\w\s]+?)(?:season|crop|plant|grow)/gi,
    /(\d+)[:\.\)]\s+([\w\s]+?)(?:in|during|for)\s+(kharif|rabi|summer)/gi,
    /(chickpea|wheat|rice|maize|mung|moong|soybean|cotton|sugarcane|potato|tomato|onion)[\s,]/gi
  ]
  
  const foundCrops = new Set<string>()
  const lowerAnswer = answer.toLowerCase()
  
  // Common crop mappings
  const cropKeywords = {
    'chickpea': { name: 'Chickpea', season: 'Rabi', yield: '12-15 quintals/acre' },
    'chana': { name: 'Chickpea', season: 'Rabi', yield: '12-15 quintals/acre' },
    'wheat': { name: 'Wheat', season: 'Rabi', yield: '18-22 quintals/acre' },
    'rice': { name: 'Rice', season: 'Kharif', yield: '25-30 quintals/acre' },
    'paddy': { name: 'Rice', season: 'Kharif', yield: '25-30 quintals/acre' },
    'mung': { name: 'Green Gram (Mung)', season: 'Kharif', yield: '8-10 quintals/acre' },
    'moong': { name: 'Green Gram (Mung)', season: 'Kharif', yield: '8-10 quintals/acre' },
    'soybean': { name: 'Soybean', season: 'Kharif', yield: '12-15 quintals/acre' },
    'maize': { name: 'Maize', season: 'Kharif', yield: '20-25 quintals/acre' },
    'corn': { name: 'Maize', season: 'Kharif', yield: '20-25 quintals/acre' },
    'cotton': { name: 'Cotton', season: 'Kharif', yield: '15-18 quintals/acre' },
    'sugarcane': { name: 'Sugarcane', season: 'Annual', yield: '300-350 quintals/acre' }
  }
  
  // Find mentioned crops
  Object.entries(cropKeywords).forEach(([keyword, info]) => {
    if (lowerAnswer.includes(keyword)) {
      foundCrops.add(info.name)
    }
  })
  
  // Convert to array and assign to years
  const cropArray = Array.from(foundCrops)
  
  // If we found crops, assign them to years
  if (cropArray.length > 0) {
    for (let i = 0; i < years; i++) {
      const cropName = cropArray[i % cropArray.length]
      const cropInfo = Object.values(cropKeywords).find(c => c.name === cropName)
      
      crops.push({
        year: i + 1,
        season: cropInfo?.season || 'Kharif',
        crop: cropName,
        reason: `Selected for soil health improvement and economic viability in ${cropInfo?.season} season`,
        expected_yield: cropInfo?.yield || '12-18 quintals/acre',
        soil_benefits: [
          'Improves soil nitrogen content',
          'Enhances soil organic matter',
          'Reduces soil-borne diseases',
          'Improves soil structure'
        ]
      })
    }
  } else {
    // Fallback: Use default legume rotation
    const defaultRotation = [
      { name: 'Chickpea', season: 'Rabi', yield: '12-15 quintals/acre' },
      { name: 'Rice', season: 'Kharif', yield: '25-30 quintals/acre' },
      { name: 'Wheat', season: 'Rabi', yield: '18-22 quintals/acre' }
    ]
    
    for (let i = 0; i < years; i++) {
      const crop = defaultRotation[i % defaultRotation.length]
      crops.push({
        year: i + 1,
        season: crop.season,
        crop: crop.name,
        reason: `Recommended based on soil type and climate zone`,
        expected_yield: crop.yield,
        soil_benefits: [
          'Nitrogen fixation through legume rotation',
          'Improved soil health',
          'Pest cycle disruption',
          'Enhanced organic matter'
        ]
      })
    }
  }
  
  return crops
}

// Extract specific section from answer
function extractSection(answer: string, keywords: string[]): string | null {
  const lines = answer.split('\n')
  let section = ''
  let capturing = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase()
    
    // Check if this line starts a relevant section
    if (keywords.some(kw => line.includes(kw))) {
      capturing = true
      section = lines[i]
      
      // Capture next few lines
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j].trim() && !lines[j].match(/^#{1,3}\s/)) {
          section += ' ' + lines[j].trim()
        } else if (lines[j].match(/^#{1,3}\s/)) {
          break
        }
      }
      break
    }
  }
  
  return section.trim() || null
}

// Extract benefits as bullet points
function extractBenefits(answer: string): string[] | null {
  const benefits: string[] = []
  const lines = answer.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.match(/^[-*•]\s+/) || line.match(/^\d+[\.)]\s+/)) {
      const benefit = line.replace(/^[-*•]\s+/, '').replace(/^\d+[\.)]\s+/, '').trim()
      if (benefit.length > 10) {
        benefits.push(benefit)
      }
    }
  }
  
  return benefits.length > 0 ? benefits.slice(0, 6) : null
}

// Extract recommendations
function extractRecommendations(answer: string): string[] | null {
  const recommendations: string[] = []
  const lines = answer.split('\n')
  let inRecommendations = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase()
    
    if (line.includes('recommend') || line.includes('suggest') || line.includes('should')) {
      inRecommendations = true
    }
    
    if (inRecommendations) {
      const trimmed = lines[i].trim()
      if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+[\.)]\s+/)) {
        const rec = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+[\.)]\s+/, '').trim()
        if (rec.length > 10) {
          recommendations.push(rec)
        }
      }
    }
    
    if (recommendations.length >= 7) break
  }
  
  return recommendations.length > 0 ? recommendations : null
}

// Mock plan generator for development (remove when RAG backend is ready)
const generateMockPlan = (request: CustomPlanRequest): CropRotationPlan => {
  const { field, planningYears } = request
  
  const mockCrops = [
    { year: 1, season: 'Kharif', crop: 'Rice', reason: 'Well-suited for clay loam soil', expected_yield: '+25%', soil_benefits: ['Nitrogen fixation', 'Organic matter increase'] },
    { year: 1, season: 'Rabi', crop: 'Wheat', reason: 'Good winter crop for this climate', expected_yield: '+20%', soil_benefits: ['Soil structure improvement'] },
    { year: 2, season: 'Kharif', crop: 'Legumes', reason: 'Nitrogen fixing properties', expected_yield: '+30%', soil_benefits: ['Nitrogen enrichment', 'Soil health boost'] },
    { year: 2, season: 'Rabi', crop: 'Mustard', reason: 'Break disease cycle', expected_yield: '+22%', soil_benefits: ['Pest control', 'Soil aeration'] },
    { year: 3, season: 'Kharif', crop: 'Maize', reason: 'High yield potential', expected_yield: '+28%', soil_benefits: ['Deep root system', 'Organic matter'] },
    { year: 3, season: 'Rabi', crop: 'Barley', reason: 'Drought tolerant option', expected_yield: '+18%', soil_benefits: ['Water conservation', 'Soil protection'] },
  ]

  return {
    id: `plan-${Date.now()}`,
    fieldId: field.id,
    planningYears,
    crops: mockCrops.slice(0, planningYears * 2),
    overallBenefits: [
      'Improved soil health through diverse crop rotation',
      'Reduced pest and disease pressure',
      'Enhanced water use efficiency',
      'Increased overall farm profitability'
    ],
    profitEstimate: `₹${(field.size * 50000 * planningYears).toLocaleString('en-IN')}`,
    riskAssessment: 'Low to Medium risk with diversified crop selection',
    recommendations: [
      'Implement organic farming practices',
      'Monitor soil health regularly',
      'Use precision farming techniques',
      'Consider crop insurance for risk mitigation'
    ],
    createdAt: new Date().toISOString()
  }
}

// Save generated plan to Supabase
export const savePlanToDatabase = async (plan: CropRotationPlan, userId: string) => {
  try {
    // TODO: Implement Supabase storage for rotation plans
    console.log('Saving plan to database:', plan)
    return { success: true, planId: plan.id }
  } catch (error) {
    console.error('Error saving plan:', error)
    return { success: false, error }
  }
}

// Backend API (with Bhuvan integration)
export const generateCustomPlanWithBhuvan = async (
  request: CustomPlanRequest & { latitude?: number; longitude?: number }
): Promise<CropRotationPlan & { rawBhuvan?: any }> => {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  try {
    const body = {
      field: {
        ...request.field,
        latitude: request.latitude ?? request.field.latitude,
        longitude: request.longitude ?? request.field.longitude,
      },
      planning_years: request.planningYears,
      specific_requirements: request.specificRequirements,
    }

    const res = await fetch(`${API}/api/rotation/generate-ai-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Backend error ${res.status}: ${text}`)
    }

    const data = await res.json()
    // Normalize backend snake_case into our frontend interface
    const plan: CropRotationPlan & { rawBhuvan?: any } = {
      id: data.id || `plan_${Date.now()}`,
      fieldId: data.field_id || request.field.id,
      planningYears: data.planning_years || request.planningYears,
      crops: (data.crops || []).map((c: any, i: number) => ({
        year: c.year ?? i + 1,
        season: c.season ?? 'Kharif',
        crop: c.crop ?? 'Crop',
        reason: c.reason ?? 'Recommended based on conditions',
        expected_yield: c.expected_yield ?? '—',
        soil_benefits: c.soil_benefits ?? [],
      })),
      overallBenefits: data.overall_benefits || [],
      profitEstimate: data.profit_estimate || '—',
      riskAssessment: data.risk_assessment || '—',
      recommendations: data.recommendations || [],
      createdAt: data.created_at || new Date().toISOString(),
      rawBhuvan: data.bhuvan_data,
    }
    return plan
  } catch (err) {
    console.error('Error calling backend rotation API:', err)
    // Fallback to RAG-only
    return generateCustomPlan(request)
  }
}