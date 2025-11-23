-- Initialize the database for KrishiChakra RAG system
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create database schema
CREATE SCHEMA IF NOT EXISTS krishichakra;

-- Research papers table for RAG
CREATE TABLE IF NOT EXISTS krishichakra.research_papers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content_chunk TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    embedding vector(384),
    source_url TEXT,
    publication_year INTEGER,
    authors TEXT[],
    keywords TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop yield data table
CREATE TABLE IF NOT EXISTS krishichakra.crop_yields (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    region TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT,
    crop_name TEXT NOT NULL,
    variety TEXT,
    yield_kg_per_hectare DECIMAL(10,2),
    production_tonnes DECIMAL(15,2),
    area_hectares DECIMAL(15,2),
    year INTEGER NOT NULL,
    season TEXT,
    soil_type TEXT,
    rainfall_mm DECIMAL(8,2),
    embedding vector(384),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rotation patterns table
CREATE TABLE IF NOT EXISTS krishichakra.rotation_patterns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pattern_name TEXT NOT NULL,
    crops_sequence TEXT[] NOT NULL,
    duration_years INTEGER NOT NULL,
    suitable_regions TEXT[],
    soil_types TEXT[],
    benefits TEXT[],
    challenges TEXT[],
    success_rate DECIMAL(3,2),
    roi_percentage DECIMAL(5,2),
    sustainability_score DECIMAL(3,2),
    embedding vector(384),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market prices table
CREATE TABLE IF NOT EXISTS krishichakra.market_prices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crop_name TEXT NOT NULL,
    variety TEXT,
    region TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT,
    market_name TEXT,
    price_per_quintal DECIMAL(10,2),
    price_date DATE NOT NULL,
    price_type TEXT, -- min, max, modal
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_research_papers_embedding ON krishichakra.research_papers USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_crop_yields_embedding ON krishichakra.crop_yields USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_rotation_patterns_embedding ON krishichakra.rotation_patterns USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_crop_yields_region_crop ON krishichakra.crop_yields(region, crop_name);
CREATE INDEX IF NOT EXISTS idx_market_prices_crop_region ON krishichakra.market_prices(crop_name, region);
CREATE INDEX IF NOT EXISTS idx_market_prices_date ON krishichakra.market_prices(price_date);

-- Insert sample data
INSERT INTO krishichakra.rotation_patterns (pattern_name, crops_sequence, duration_years, suitable_regions, soil_types, benefits, challenges, success_rate, roi_percentage, sustainability_score) VALUES
('Rice-Wheat-Sugarcane', ARRAY['Rice', 'Wheat', 'Sugarcane'], 3, ARRAY['Punjab', 'Haryana', 'Uttar Pradesh'], ARRAY['clay', 'loam'], ARRAY['High water efficiency', 'Nitrogen fixation', 'Pest control'], ARRAY['High water requirement', 'Labor intensive'], 0.85, 18.5, 0.75),
('Cotton-Wheat-Maize', ARRAY['Cotton', 'Wheat', 'Maize'], 3, ARRAY['Gujarat', 'Maharashtra', 'Punjab'], ARRAY['black', 'clay', 'loam'], ARRAY['Soil structure improvement', 'Diverse income streams'], ARRAY['Pest management', 'Market volatility'], 0.80, 22.3, 0.70),
('Soybean-Wheat-Rice', ARRAY['Soybean', 'Wheat', 'Rice'], 3, ARRAY['Madhya Pradesh', 'Rajasthan', 'Maharashtra'], ARRAY['clay', 'sandy loam'], ARRAY['Nitrogen fixation', 'Improved soil fertility'], ARRAY['Weather dependency', 'Storage issues'], 0.88, 20.1, 0.85);

COMMIT;