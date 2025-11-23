// Mock crop rotation data and recommendations
export interface CropRotationPlan {
  id: string
  season: string
  crops: string[]
  duration: string
  expectedYield: string
  profitEstimate: string
  soilBenefits: string[]
  description: string
}

export interface FarmDetails {
  location: string
  cropType: string
  season: string
  soilType: string
  farmSize: string
}

export const mockRotationPlans: CropRotationPlan[] = [
  {
    id: "1",
    season: "Kharif (Monsoon)",
    crops: ["Rice", "Wheat", "Legumes"],
    duration: "4 months",
    expectedYield: "+25% increase",
    profitEstimate: "₹2.5L per hectare",
    soilBenefits: ["Nitrogen fixation", "Improved soil structure", "Pest control"],
    description: "Traditional rotation pattern optimized for monsoon season with high water availability.",
  },
  {
    id: "2",
    season: "Rabi (Winter)",
    crops: ["Wheat", "Mustard", "Fallow"],
    duration: "6 months",
    expectedYield: "+20% increase",
    profitEstimate: "₹1.8L per hectare",
    soilBenefits: ["Soil moisture retention", "Organic matter increase", "Weed suppression"],
    description: "Winter season rotation focusing on cash crops with soil restoration period.",
  },
  {
    id: "3",
    season: "Zaid (Summer)",
    crops: ["Maize", "Fodder", "Green Manure"],
    duration: "3 months",
    expectedYield: "+15% increase",
    profitEstimate: "₹1.2L per hectare",
    soilBenefits: ["Soil cover protection", "Nutrient cycling", "Water conservation"],
    description: "Summer rotation with focus on soil protection and livestock feed production.",
  },
]

export const cropVarieties = [
  "Rice",
  "Wheat",
  "Maize",
  "Sugarcane",
  "Cotton",
  "Soybean",
  "Mustard",
  "Groundnut",
  "Sunflower",
  "Jowar",
  "Bajra",
  "Barley",
  "Gram",
  "Arhar",
]

export const soilTypes = [
  "Alluvial Soil",
  "Black Soil (Regur)",
  "Red Soil",
  "Laterite Soil",
  "Desert Soil",
  "Mountain Soil",
  "Saline Soil",
]

export const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"]

export const states = [
  "Andhra Pradesh",
  "Bihar",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
]

export function generateRotationPlan(farmDetails: FarmDetails): CropRotationPlan[] {
  // Simple logic to return relevant plans based on season
  return mockRotationPlans.filter(
    (plan) =>
      plan.season.toLowerCase().includes(farmDetails.season.toLowerCase()) || farmDetails.season === "All Seasons",
  )
}
