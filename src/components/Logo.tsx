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

  // Color mapping based on variant using Thrive Perinatal brand colors
  const colorMap = {
    default: {
      primary: "text-gray-900",
      secondary: "text-warm-grey",
      accent: "text-muted-teal",
      iconBg: "bg-muted-teal/10",
    },
    light: {
      primary: "text-white",
      secondary: "text-white/70",
      accent: "text-soft-lavender",
      iconBg: "bg-white/10",
    },
    dark: {
      primary: "text-gray-900",
      secondary: "text-warm-grey",
      accent: "text-muted-teal",
      iconBg: "bg-muted-teal/10",
    },
  };

  const colors = colorMap[variant];

  return (
    <div className={`flex items-center gap-3 ${sizeMap[size]} font-sans`}>
      <div className="relative">
        <div
          className={`${colors.iconBg} ${colors.accent} flex items-center justify-center rounded-xl p-2`}
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
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
            <path d="M12 14c2.5 0 4.5 1.5 4.5 3.5" />
            <path d="M7.5 17.5c0-2 2-3.5 4.5-3.5" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-moss-green rounded-full border-2 border-white shadow-sm"></div>
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className={`font-bold text-xl leading-none ${colors.primary}`}>
            Thrive
          </span>
          <span
            className={`font-semibold text-base leading-none ${colors.accent}`}
          >
            Perinatal
          </span>
        </div>
        <div className={`text-xs font-medium ${colors.secondary} mt-0.5`}>
          powered by thriveperinatal.com
        </div>
      </div>
    </div>
  );
};

export default Logo;
