import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Sets the current_tenant_id and organization_id session variables for Row Level Security (RLS)
 * @param tenantId - The tenant ID to set in the session
 * @param organizationId - The organization ID to set in the session
 */
export const setTenantAndOrgId = async (
  tenantId: string,
  organizationId?: string,
): Promise<void> => {
  try {
    if (organizationId) {
      // If we have both tenant and org IDs
      const { error } = await supabase.rpc("set_tenant_and_org_id", {
        tenant_id: tenantId,
        org_id: organizationId,
      });
      if (error) {
        console.error("Error setting tenant and org IDs:", error);
      }
    } else {
      // Backward compatibility for just tenant ID
      const { error } = await supabase.rpc("set_tenant_id", {
        tenant_id: tenantId,
      });
      if (error) {
        console.error("Error setting tenant ID:", error);
      }
    }
  } catch (error) {
    console.error("Failed to set tenant/org IDs:", error);
  }
};

/**
 * Sets the current_tenant_id session variable for Row Level Security (RLS)
 * @param tenantId - The tenant ID to set in the session
 * @deprecated Use setTenantAndOrgId instead
 */
export const setTenantId = async (tenantId: string): Promise<void> => {
  return setTenantAndOrgId(tenantId);
};

/**
 * Clears the current_tenant_id and organization_id session variables
 */
export const clearTenantId = async (): Promise<void> => {
  try {
    const { error: error1 } = await supabase.rpc("clear_tenant_id");
    if (error1) {
      console.error("Error clearing tenant ID:", error1);
    }

    const { error: error2 } = await supabase.rpc("clear_organization_id");
    if (error2) {
      console.error("Error clearing organization ID:", error2);
    }
  } catch (error) {
    console.error("Failed to clear tenant/org IDs:", error);
  }
};

/**
 * Gets the organization data by slug
 * @param slug - The organization slug to look up
 */
export const getOrganizationBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from("organizations" as any)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching organization:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    return null;
  }
};
