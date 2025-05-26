import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Function to get tenant ID based on subdomain
const getTenantIdFromSubdomain = (): string | null => {
  // Get the current subdomain
  const hostname = window.location.hostname;

  // Skip for localhost or IP addresses
  if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    console.log("Development environment detected, using default tenant");
    // For development, set the super admin tenant for testing
    return "0"; // Using "0" as the super admin tenant ID
  }

  const parts = hostname.split(".");
  const subdomain = parts.length > 2 ? parts[0] : null;

  // Map subdomains to tenant IDs using import.meta.env
  if (subdomain) {
    switch (subdomain) {
      case "b3":
        console.log("supabaseClient: B3 tenant detected");
        return import.meta.env.VITE_B3_TENANT_ID || "1";
      case "parents1st":
        console.log("supabaseClient: Parents1st tenant detected");
        return import.meta.env.VITE_PARENTS1ST_TENANT_ID || "2";
      case "demo":
        console.log("supabaseClient: Demo tenant detected");
        return import.meta.env.VITE_DEMO_TENANT_ID || "3";
      case "admin":
        console.log("supabaseClient: Admin tenant detected");
        return "0"; // Using "0" as the super admin tenant ID
      default:
        console.error("supabaseClient: Unknown subdomain:", subdomain);
        // Default to super admin tenant if subdomain is unknown
        return "0";
    }
  }

  // No subdomain - main domain (ogstat.app)
  console.log("supabaseClient: Main domain detected, using super admin tenant");
  return "0";
};

// Get the tenant ID based on subdomain
const tenantId = getTenantIdFromSubdomain();

// Create Supabase client with global headers
export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    global: {
      headers: {
        // Set tenant_id in global headers if available
        ...(tenantId ? { "x-tenant-id": tenantId } : {}),
      },
    },
  },
);

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
      const { error } = await supabaseClient.rpc("set_tenant_and_org_id", {
        tenant_id: tenantId,
        org_id: organizationId,
      });
      if (error) {
        console.error("Error setting tenant and org IDs:", error);
      }
    } else {
      // Backward compatibility for just tenant ID
      const { error } = await supabaseClient.rpc("set_tenant_id", {
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
    const { error: error1 } = await supabaseClient.rpc("clear_tenant_id");
    if (error1) {
      console.error("Error clearing tenant ID:", error1);
    }

    const { error: error2 } = await supabaseClient.rpc("clear_organization_id");
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
    const { data, error } = await supabaseClient
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
