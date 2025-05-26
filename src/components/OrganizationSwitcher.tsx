import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { getOrganizationBySlug } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, ChevronDown } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  primary_color?: string;
}

const OrganizationSwitcher: React.FC = () => {
  const { user, setUser } = useUser();
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: "b3-org-id",
      name: "B3",
      slug: "b3",
      primary_color: "#3b82f6",
      logo_url: "https://api.dicebear.com/7.x/initials/svg?seed=B3",
    },
    {
      id: "parents1st-org-id",
      name: "Parents1st",
      slug: "parents1st",
      primary_color: "#10b981",
      logo_url: "https://api.dicebear.com/7.x/initials/svg?seed=P1",
    },
    {
      id: "demo-org-id",
      name: "Demo Organization",
      slug: "demo",
      primary_color: "#8b5cf6",
      logo_url: "https://api.dicebear.com/7.x/initials/svg?seed=DO",
    },
  ]);

  // In a real app, you would fetch organizations from the API
  // useEffect(() => {
  //   const fetchOrganizations = async () => {
  //     // This would be an API call in a real app
  //     const { data, error } = await supabase.from('organizations').select('*');
  //     if (data && !error) {
  //       setOrganizations(data);
  //     }
  //   };
  //   fetchOrganizations();
  // }, []);

  const handleSwitchOrganization = async (org: Organization) => {
    if (!user) return;

    // In a real app, you would fetch the user's role in the selected organization
    // For demo, we'll just update the user context
    setUser({
      ...user,
      tenantId: `${org.slug}-tenant`,
      organizationId: org.id,
      organizationSlug: org.slug,
      organizationName: org.name,
      organizationColor: org.primary_color,
    });
  };

  if (!user || !user.organizationSlug) return null;

  const currentOrg = organizations.find(
    (org) => org.slug === user.organizationSlug,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {currentOrg && (
            <Avatar
              className="h-5 w-5"
              style={{
                borderColor: currentOrg.primary_color,
                borderWidth: "1px",
              }}
            >
              <AvatarImage src={currentOrg.logo_url} alt={currentOrg.name} />
              <AvatarFallback>{currentOrg.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <span>{currentOrg?.name || "Organization"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitchOrganization(org)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Avatar
              className="h-5 w-5"
              style={{ borderColor: org.primary_color, borderWidth: "1px" }}
            >
              <AvatarImage src={org.logo_url} alt={org.name} />
              <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{org.name}</span>
            {org.slug === user.organizationSlug && (
              <span className="ml-auto text-xs text-muted-foreground">
                Current
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
