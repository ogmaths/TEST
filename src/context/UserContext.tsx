import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n";

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

    // Ensure user has language property if logged in
    if (parsedUser && !parsedUser.language) {
      parsedUser.language = getSavedLanguage();
    }

    return parsedUser;
  });

  const [currentLanguage, setCurrentLanguage] =
    useState<string>(getSavedLanguage());

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      // Ensure language is set in localStorage
      if (user.language) {
        localStorage.setItem("i18nextLng", user.language);
        setCurrentLanguage(user.language);
        // Explicitly change i18n language
        i18n.changeLanguage(user.language);
      }
    } else {
      localStorage.removeItem("user");
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
      value={{ user, setUser, isLoggedIn, changeLanguage, currentLanguage }}
    >
      {children}
    </UserContext.Provider>
  );
};

// useUser hook is now defined before the UserProvider component
// This makes it compatible with Vite's Fast Refresh
