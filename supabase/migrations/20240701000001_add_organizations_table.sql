-- Create organizations table to manage multiple tenants
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  logo_url TEXT,
  primary_color VARCHAR(7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample organizations
INSERT INTO organizations (name, slug, logo_url, primary_color)
VALUES 
  ('B3', 'b3', 'https://api.dicebear.com/7.x/initials/svg?seed=B3', '#3b82f6'),
  ('Parents1st', 'parents1st', 'https://api.dicebear.com/7.x/initials/svg?seed=P1', '#10b981'),
  ('Demo Organization', 'demo', 'https://api.dicebear.com/7.x/initials/svg?seed=DO', '#8b5cf6')
ON CONFLICT (slug) DO NOTHING;

-- Add organization_id to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Create a view to see profiles with organization names
CREATE OR REPLACE VIEW profiles_with_org AS
SELECT 
  p.*,
  o.name as organization_name,
  o.slug as organization_slug,
  o.logo_url as organization_logo,
  o.primary_color as organization_color
FROM profiles p
LEFT JOIN organizations o ON p.organization_id = o.id;

-- Enable row level security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their organization
DROP POLICY IF EXISTS "Users can view their own organization" ON organizations;
CREATE POLICY "Users can view their own organization"
ON organizations FOR SELECT
USING (id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Add organization_id to RLS function
CREATE OR REPLACE FUNCTION set_tenant_and_org_id(tenant_id UUID, org_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', tenant_id::text, false);
  PERFORM set_config('app.current_organization_id', org_id::text, false);
END;
$$ LANGUAGE plpgsql;

-- Function to get current organization ID
CREATE OR REPLACE FUNCTION get_current_organization_id()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_organization_id', true)::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to clear organization ID
CREATE OR REPLACE FUNCTION clear_organization_id()
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_organization_id', '', true);
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END;
$$ LANGUAGE plpgsql;

-- Update the RLS policies for profiles
DROP POLICY IF EXISTS "Tenant isolation for profiles" ON profiles;
CREATE POLICY "Tenant isolation for profiles"
ON profiles FOR ALL
USING (
  tenant_id = get_current_tenant_id() OR
  organization_id = get_current_organization_id() OR
  auth.uid() = id
);

alter publication supabase_realtime add table organizations;
