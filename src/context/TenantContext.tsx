import React, { createContext, useContext, useState, useEffect } from "react";

interface TenantContextType {
  tenantId: string;
  tenantName: string;
  setTenantId: React.Dispatch<React.SetStateAction<string>>;
  setTenantName: React.Dispatch<React.SetStateAction<string>>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenantId, setTenantId] = useState<string>("0"); // Default to super admin tenant
  const [tenantName, setTenantName] = useState<string>("OG Control Panel");

  useEffect(() => {
    // Get the current subdomain
    const hostname = window.location.hostname;

    // Skip for localhost or IP addresses
    if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      console.log("Development environment detected, using default tenant");
      // For development, set the super admin tenant for testing
      setTenantId("0"); // Using "0" as the super admin tenant ID
      setTenantName("OG Control Panel (Dev)");
      return;
    }

    const parts = hostname.split(".");
    const subdomain = parts.length > 2 ? parts[0] : null;

    // Map subdomains to tenant IDs using import.meta.env
    if (subdomain) {
      switch (subdomain) {
        case "b3":
          setTenantId(import.meta.env.VITE_B3_TENANT_ID || "1");
          setTenantName("B3");
          console.log(
            "B3 tenant detected, setting tenant ID:",
            import.meta.env.VITE_B3_TENANT_ID || "1",
          );
          break;
        case "parents1st":
          setTenantId(import.meta.env.VITE_PARENTS1ST_TENANT_ID || "2");
          setTenantName("Parents1st");
          console.log(
            "Parents1st tenant detected, setting tenant ID:",
            import.meta.env.VITE_PARENTS1ST_TENANT_ID || "2",
          );
          break;
        case "demo":
          setTenantId(import.meta.env.VITE_DEMO_TENANT_ID || "3");
          setTenantName("Demo");
          console.log(
            "Demo tenant detected, setting tenant ID:",
            import.meta.env.VITE_DEMO_TENANT_ID || "3",
          );
          break;
        case "admin":
          setTenantId("0"); // Using "0" as the super admin tenant ID
          setTenantName("OG Control Panel");
          console.log("Admin tenant detected, setting tenant ID: 0");

          // Auto-redirect to super admin dashboard if on admin subdomain
          if (
            window.location.pathname === "/" ||
            window.location.pathname === "/login"
          ) {
            window.location.href = "/super-admin";
          }
          break;
        default:
          console.error("Unknown subdomain:", subdomain);
          // Default to super admin tenant if subdomain is unknown
          setTenantId("0");
          setTenantName("OG Control Panel (Unknown Subdomain)");
      }
    } else {
      // No subdomain - main domain (ogstat.app)
      console.log("Main domain detected, setting super admin tenant");
      setTenantId("0");
      setTenantName("OG Control Panel");
    }
  }, []);

  return (
    <TenantContext.Provider
      value={{ tenantId, tenantName, setTenantId, setTenantName }}
    >
      {children}
    </TenantContext.Provider>
  );
};
