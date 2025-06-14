import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light" | "dark";
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  size = "md",
  variant = "default",
  showTagline = true,
}) => {
  // Size mapping
  const sizeMap = {
    sm: {
      container: "h-6",
      icon: "h-4 w-4",
      text: "text-sm",
      tagline: "text-xs",
    },
    md: {
      container: "h-8",
      icon: "h-5 w-5",
      text: "text-lg",
      tagline: "text-xs",
    },
    lg: {
      container: "h-10",
      icon: "h-6 w-6",
      text: "text-xl",
      tagline: "text-sm",
    },
  };

  // Color mapping based on variant using Thrive Perinatal brand colors
  const colorMap = {
    default: {
      primary: "text-gray-900",
      secondary: "text-warm-grey",
      accent: "text-muted-teal",
      iconBg: "bg-muted-teal/10",
      iconColor: "text-muted-teal",
      badge: "bg-moss-green",
    },
    light: {
      primary: "text-white",
      secondary: "text-white/70",
      accent: "text-soft-lavender",
      iconBg: "bg-white/10",
      iconColor: "text-white",
      badge: "bg-moss-green",
    },
    dark: {
      primary: "text-gray-900",
      secondary: "text-warm-grey",
      accent: "text-muted-teal",
      iconBg: "bg-muted-teal/10",
      iconColor: "text-muted-teal",
      badge: "bg-moss-green",
    },
  };

  const colors = colorMap[variant];
  const sizes = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${sizes.container} font-sans`}>
      <div className="relative">
        <div
          className={`${colors.iconBg} ${colors.iconColor} flex items-center justify-center rounded-xl p-2 transition-colors`}
        >
          {/* Heart with care symbol representing perinatal care */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={sizes.icon}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <path d="M12 13v3" />
            <path d="M10.5 15.5L12 17l1.5-1.5" />
          </svg>
        </div>
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 ${colors.badge} rounded-full border-2 border-white shadow-sm`}
        ></div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-bold ${sizes.text} leading-none ${colors.primary}`}
          >
            Thrive
          </span>
          <span
            className={`font-semibold ${size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"} leading-none ${colors.accent}`}
          >
            Perinatal
          </span>
        </div>
        {showTagline && (
          <div
            className={`${sizes.tagline} font-medium ${colors.secondary} mt-0.5 leading-tight`}
          >
            Your Trusted Care Hub
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
