export interface FieldBatch {
  id: string
  user_id: string
  name: string
  location: string
  latitude?: number
  longitude?: number
  soil_type: string
  season: string
  climate_zone: string
  size: number
  status: "active" | "planning" | "fallow" | "harvested"
  current_crop?: string
  planted_date?: string
  expected_harvest?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  location?: string
  farm_size?: number
  created_at: string
  updated_at: string
}