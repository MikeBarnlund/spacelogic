-- Add kit_overrides column to projects table
-- Stores per-scenario overrides for Kit of Parts space types
ALTER TABLE projects ADD COLUMN kit_overrides JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN projects.kit_overrides IS 'Per-scenario Kit of Parts overrides. Structure: { "traditional": { "space_type_key": { count?, sqft_per_unit?, capacity_per_unit? } }, ... }';
