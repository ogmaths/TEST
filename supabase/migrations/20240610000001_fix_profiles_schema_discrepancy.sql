-- Fix discrepancy between profiles table schemas

-- First, check if organization_id column exists and tenant_id doesn't
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'organization_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'tenant_id'
  ) THEN
    -- Rename organization_id to tenant_id
    ALTER TABLE profiles RENAME COLUMN organization_id TO tenant_id;
  END IF;

  -- Ensure tenant_id is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'tenant_id'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN tenant_id SET NOT NULL;
  END IF;

  -- Ensure email is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;
  END IF;

  -- Ensure role is NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN role SET NOT NULL;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
  END IF;
END$$;
