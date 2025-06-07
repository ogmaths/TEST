import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n";
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string;
  organizationId?: string;
  organizationSlug?: string;
  organizationName?: string;
  organizationColor?: string;
  isImpersonating?: boolean;
  isOrgAdmin?: boolean;
  hasAcceptedConfidentiality?: boolean;
  language?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
  changeLanguage: (language: string) => void;
  currentLanguage: string;
  isLoadingRole: boolean;
  fetchUserRole: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Define useUser hook inside the file but before the component
// This ensures consistent component exports for Fast Refresh
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

interface UserProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  initialUser = null,
}) => {
  // Get saved language from localStorage or use browser default
  const getSavedLanguage = (): string => {
    return (
      localStorage.getItem("i18nextLng") ||
      navigator.language.split("-")[0] ||
      "en"
    );
  };

  const [user, setUser] = useState<User | null>(() => {
    // Check if there's a user in localStorage
    const savedUser = localStorage.getItem("user");
    const parsedUser = savedUser ? JSON.parse(savedUser) : initialUser;

    // Debug logging for user initialization
    console.log(
      "🔍 UserContext - Initializing user from localStorage:",
      parsedUser,
    );

    // Ensure user has language property if logged in
    if (parsedUser && !parsedUser.language) {
      parsedUser.language = getSavedLanguage();
    }

    return parsedUser;
  });

  const [currentLanguage, setCurrentLanguage] =
    useState<string>(getSavedLanguage());
  const [isLoadingRole, setIsLoadingRole] = useState(false);

  // Function to fetch user role from Supabase
  const fetchUserRole = async (): Promise<void> => {
    try {
      setIsLoadingRole(true);

      // Get current authenticated user
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("🔍 UserContext - Auth error:", authError);
        return;
      }

      if (!authUser) {
        console.log("🔍 UserContext - No authenticated user found");
        return;
      }

      console.log("🔍 UserContext - Fetching role for user:", authUser.id);

      // First try to get role from user metadata
      let userRole = authUser.user_metadata?.role;
      let tenantId = authUser.user_metadata?.tenant_id;
      let organizationId = authUser.user_metadata?.organization_id;
      let organizationSlug = authUser.user_metadata?.organization_slug;
      let organizationName = authUser.user_metadata?.organization_name;
      let organizationColor = authUser.user_metadata?.organization_color;

      // If no role in metadata, fetch from profiles table
      if (!userRole) {
        console.log(
          "🔍 UserContext - No role in metadata, fetching from profiles table",
        );

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            `
            role,
            tenant_id,
            organization_id,
            first_name,
            last_name,
            organizations (
              name,
              slug,
              primary_color
            )
          `,
          )
          .eq("id", authUser.id)
          .single();

        if (profileError) {
          console.error("🔍 UserContext - Profile fetch error:", profileError);
          return;
        }

        if (profile) {
          userRole = profile.role;
          tenantId = profile.tenant_id;
          organizationId = profile.organization_id;
          organizationSlug = profile.organizations?.slug;
          organizationName = profile.organizations?.name;
          organizationColor = profile.organizations?.primary_color;

          console.log("🔍 UserContext - Profile data:", profile);
        }
      }

      // Handle super admin case (tenant_id = "0" or null)
      if (tenantId === "0" || tenantId === null) {
        userRole = "super_admin";
        tenantId = "0";
      }

      // Update user context with role and organization info
      if (userRole) {
        const updatedUser: User = {
          id: authUser.id,
          name:
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            `${authUser.user_metadata?.first_name || ""} ${authUser.user_metadata?.last_name || ""}`.trim() ||
            authUser.email?.split("@")[0] ||
            "User",
          email: authUser.email || "",
          role: userRole,
          tenantId: tenantId,
          organizationId: organizationId,
          organizationSlug: organizationSlug,
          organizationName: organizationName,
          organizationColor: organizationColor,
          hasAcceptedConfidentiality:
            authUser.user_metadata?.hasAcceptedConfidentiality || false,
          language: getSavedLanguage(),
        };

        console.log("🔍 UserContext - Setting updated user:", updatedUser);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("🔍 UserContext - Error fetching user role:", error);
    } finally {
      setIsLoadingRole(false);
    }
  };

  // Update localStorage when user changes
  useEffect(() => {
    console.log("🔍 UserContext - User state changed:", user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      console.log("🔍 UserContext - User saved to localStorage");
      // Ensure language is set in localStorage
      if (user.language) {
        localStorage.setItem("i18nextLng", user.language);
        setCurrentLanguage(user.language);
        // Explicitly change i18n language
        i18n.changeLanguage(user.language);
      }
    } else {
      localStorage.removeItem("user");
      console.log("🔍 UserContext - User removed from localStorage");
    }
  }, [user]);

  // Initialize language from localStorage on mount
  useEffect(() => {
    const savedLanguage = getSavedLanguage();
    setCurrentLanguage(savedLanguage);
    // Explicitly set i18n language on mount
    i18n.changeLanguage(savedLanguage);

    // If user exists but has no language, update it
    if (user && !user.language) {
      setUser({ ...user, language: savedLanguage });
    }
  }, []);

  const isLoggedIn = !!user;

  const changeLanguage = (language: string) => {
    localStorage.setItem("i18nextLng", language);
    setCurrentLanguage(language);
    // Explicitly change i18n language when user changes language
    i18n.changeLanguage(language);

    if (user) {
      const updatedUser = { ...user, language };
      setUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        changeLanguage,
        currentLanguage,
        isLoadingRole,
        fetchUserRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// useUser hook is now defined before the UserProvider component
// This makes it compatible with Vite's Fast Refresh
