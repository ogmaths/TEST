import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string;
  organizationSlug?: string;
  organizationName?: string;
  organizationColor?: string;
  isImpersonating?: boolean;
  isOrgAdmin?: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  initialUser = null,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if there's a user in localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : initialUser;
  });

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const isLoggedIn = !!user;

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
