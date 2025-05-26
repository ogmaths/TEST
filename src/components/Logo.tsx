import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light" | "dark";
}

const Logo: React.FC<LogoProps> = ({ size = "md", variant = "default" }) => {
  // Size mapping
  const sizeMap = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  // Color mapping based on variant
  const colorMap = {
    default: {
      primary: "text-primary",
      secondary: "text-muted-foreground",
      accent: "text-blue-500",
    },
    light: {
      primary: "text-white",
      secondary: "text-white/70",
      accent: "text-blue-300",
    },
    dark: {
      primary: "text-slate-900",
      secondary: "text-slate-700",
      accent: "text-blue-700",
    },
  };

  const colors = colorMap[variant];

  return (
    <div className={`flex items-center gap-2 ${sizeMap[size]}`}>
      <div className="relative">
        <div
          className={`${colors.accent} font-bold flex items-center justify-center rounded-md p-1`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={sizeMap[size]}
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
      </div>
      <div>
        <div className="flex items-baseline">
          <span className={`font-bold text-lg leading-none ${colors.primary}`}>
            Impact
          </span>
          <span
            className={`font-semibold text-sm leading-none ml-1 ${colors.accent}`}
          >
            CRM
          </span>
        </div>
        <div className={`text-xs ${colors.secondary}`}>
          powered by ogstat.app
        </div>
      </div>
    </div>
  );
};

export default Logo;
