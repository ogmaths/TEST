CREATE TABLE IF NOT EXISTS form_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  worker_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('assessment', 'feedback')),
  data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_responses_client_id ON form_responses(client_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_worker_id ON form_responses(worker_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_type ON form_responses(type);
CREATE INDEX IF NOT EXISTS idx_form_responses_submitted_at ON form_responses(submitted_at);

alter publication supabase_realtime add table form_responses;