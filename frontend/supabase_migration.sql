-- Create field_batches table
CREATE TABLE IF NOT EXISTS field_batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  soil_type TEXT NOT NULL,
  season TEXT NOT NULL,  
  climate_zone TEXT,
  size DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('active', 'planning', 'fallow', 'harvested')),
  current_crop TEXT,
  planted_date DATE,
  expected_harvest DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE field_batches ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own field batches
CREATE POLICY "Users can view own field batches" ON field_batches
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own field batches
CREATE POLICY "Users can insert own field batches" ON field_batches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own field batches
CREATE POLICY "Users can update own field batches" ON field_batches
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own field batches
CREATE POLICY "Users can delete own field batches" ON field_batches
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_field_batches_updated_at
  BEFORE UPDATE ON field_batches
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();