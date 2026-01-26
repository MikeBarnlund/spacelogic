-- Add market_overrides column to projects
-- Stores per-project customizations to default market assumptions
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS market_overrides JSONB DEFAULT NULL;

-- Add column comment for documentation
COMMENT ON COLUMN projects.market_overrides IS 'Custom market rate overrides for financial modeling (overrides default rates per market)';
