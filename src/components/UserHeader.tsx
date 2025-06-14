import React from "react";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserHeaderProps {}

const UserHeader: React.FC<UserHeaderProps> = () => {
  const { user, setUser, changeLanguage } = useUser();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  if (!user) return null;

  const handleSignOut = () => {
    setUser(null);
    navigate("/login");
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    changeLanguage(language);
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-muted/30 rounded-lg">
      <div className="flex-1 flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt={user.name}
          />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">{user.name}</p>
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">{user.role}</p>
            {user.organizationName && (
              <p className="text-xs font-medium text-muted-foreground/80">
                {user.organizationName}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title={t("language.selectLanguage")}
            >
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
              {t("language.english")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("es")}>
              {t("language.spanish")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>
              {t("language.french")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          title={t("common.signOut")}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
