import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "fr" | "es" | "yo";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lang");
      return (stored as Language) || "en";
    }
    return "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  return useContext(LanguageContext);
};

export { LanguageProvider, useLanguage };
