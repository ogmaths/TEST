CREATE TABLE IF NOT EXISTS form_sends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  client_email TEXT NOT NULL,
  form_type TEXT NOT NULL CHECK (form_type IN ('assessment', 'feedback')),
  worker_id TEXT NOT NULL,
  sent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_sends_client_id ON form_sends(client_id);
CREATE INDEX IF NOT EXISTS idx_form_sends_worker_id ON form_sends(worker_id);
CREATE INDEX IF NOT EXISTS idx_form_sends_form_type ON form_sends(form_type);
CREATE INDEX IF NOT EXISTS idx_form_sends_sent_timestamp ON form_sends(sent_timestamp);

alter publication supabase_realtime add table form_sends;
