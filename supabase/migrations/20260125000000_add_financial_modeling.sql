-- Add financial_models column to projects
-- Stores financial modeling data for each scenario as JSONB
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS financial_models JSONB DEFAULT NULL;

-- Add column comment for documentation
COMMENT ON COLUMN projects.financial_models IS 'Financial modeling data for each scenario (traditional/moderate/progressive)';

-- Create base_rent_markets table for market data
CREATE TABLE IF NOT EXISTS base_rent_markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_key TEXT UNIQUE NOT NULL,
  market_name TEXT NOT NULL,
  class_a_rent DECIMAL(10,2) NOT NULL,
  class_b_rent DECIMAL(10,2) NOT NULL,
  class_c_rent DECIMAL(10,2) NOT NULL,
  operating_costs DECIMAL(10,2) NOT NULL,
  escalation_rate DECIMAL(5,4) NOT NULL DEFAULT 0.03,
  ti_credit_per_sqft DECIMAL(10,2) NOT NULL DEFAULT 0,
  rent_free_months INTEGER NOT NULL DEFAULT 0,
  brokerage_rate DECIMAL(5,4) NOT NULL DEFAULT 0.05,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add table comment
COMMENT ON TABLE base_rent_markets IS 'Market-specific rental rates and lease assumptions for financial modeling';

-- Seed Canadian market data
INSERT INTO base_rent_markets (market_key, market_name, class_a_rent, class_b_rent, class_c_rent, operating_costs, escalation_rate, ti_credit_per_sqft, rent_free_months, brokerage_rate)
VALUES
  ('toronto', 'Toronto', 65.00, 45.00, 32.00, 22.00, 0.03, 50.00, 6, 0.05),
  ('vancouver', 'Vancouver', 58.00, 42.00, 30.00, 20.00, 0.03, 45.00, 4, 0.05),
  ('calgary', 'Calgary', 38.00, 28.00, 20.00, 15.00, 0.025, 40.00, 6, 0.05),
  ('montreal', 'Montreal', 42.00, 32.00, 24.00, 18.00, 0.03, 35.00, 4, 0.05),
  ('ottawa', 'Ottawa', 35.00, 28.00, 22.00, 16.00, 0.025, 30.00, 3, 0.05)
ON CONFLICT (market_key) DO NOTHING;

-- Enable RLS on base_rent_markets (read-only for all authenticated users)
ALTER TABLE base_rent_markets ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to read market data
CREATE POLICY "Allow read access for authenticated users"
  ON base_rent_markets
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index on market_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_base_rent_markets_market_key ON base_rent_markets(market_key);
