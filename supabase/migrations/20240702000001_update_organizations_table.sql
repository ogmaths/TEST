-- Add new columns to organizations table for branding and additional details
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS primary_color TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS secondary_color TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subdomain TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS tenant_id TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'trial';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP WITH TIME ZONE;

-- Create index on subdomain for faster lookups
CREATE INDEX IF NOT EXISTS idx_organizations_subdomain ON organizations(subdomain);

-- Create index on tenant_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_organizations_tenant_id ON organizations(tenant_id);

-- Enable realtime for organizations table
alter publication supabase_realtime add table organizations;
