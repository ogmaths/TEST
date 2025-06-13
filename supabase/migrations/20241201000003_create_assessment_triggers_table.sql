-- Set statement timeout to prevent connection timeout
set statement_timeout = '60s';

CREATE TABLE IF NOT EXISTS assessment_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_assessment_id TEXT NOT NULL,
  condition_type TEXT NOT NULL CHECK (condition_type IN ('score_gte', 'score_lte', 'question_value', 'question_contains')),
  condition_value TEXT NOT NULL,
  triggered_assessment_id TEXT NOT NULL,
  organization_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime
alter publication supabase_realtime add table assessment_triggers;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_triggers_source_id ON assessment_triggers(source_assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_triggers_org_id ON assessment_triggers(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessment_triggers_active ON assessment_triggers(is_active);
