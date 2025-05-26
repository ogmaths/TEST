-- Create function to set tenant_id in the session
CREATE OR REPLACE FUNCTION set_tenant_id(tenant_id TEXT)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', tenant_id, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clear tenant_id from the session
CREATE OR REPLACE FUNCTION clear_tenant_id()
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', NULL, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get the current tenant_id
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', TRUE);
END;
$$ LANGUAGE plpgsql STABLE;

-- Example of how to use this in an RLS policy
-- This is commented out as it's just an example
/*
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy
ON your_table
USING (tenant_id = (SELECT get_current_tenant_id()));
*/
