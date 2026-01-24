-- Migration: Add Kit of Parts columns to projects table
-- Description: Adds spatial_ratios and workstyle_preset columns for the Kit of Parts feature

-- Add spatial_ratios column (JSONB for storing custom space type ratios)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS spatial_ratios JSONB DEFAULT NULL;

-- Add workstyle_preset column (default to 'moderate')
ALTER TABLE projects ADD COLUMN IF NOT EXISTS workstyle_preset TEXT DEFAULT 'moderate';

-- Add check constraint for valid workstyle_preset values
ALTER TABLE projects ADD CONSTRAINT projects_workstyle_preset_check
  CHECK (workstyle_preset IN ('traditional', 'moderate', 'progressive'));

-- Add comment for documentation
COMMENT ON COLUMN projects.spatial_ratios IS 'Custom space type ratios configuration (JSON). If null, default ratios are used.';
COMMENT ON COLUMN projects.workstyle_preset IS 'Default workstyle preset for the project: traditional, moderate, or progressive';

-- Create index on workstyle_preset for filtering
CREATE INDEX IF NOT EXISTS idx_projects_workstyle_preset ON projects(workstyle_preset);
