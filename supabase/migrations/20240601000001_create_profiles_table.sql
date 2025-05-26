-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  tenant_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Organization admins can view profiles in their organization" ON profiles;
CREATE POLICY "Organization admins can view profiles in their organization"
  ON profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role = 'admin' AND tenant_id = profiles.tenant_id
    )
  );

DROP POLICY IF EXISTS "Super admins can do everything" ON profiles;
CREATE POLICY "Super admins can do everything"
  ON profiles
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role = 'super_admin'
    )
  );

-- Add realtime
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
