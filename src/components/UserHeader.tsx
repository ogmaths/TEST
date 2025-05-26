import React from "react";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface UserHeaderProps {
  onSettingsClick?: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onSettingsClick }) => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-muted/30 rounded-lg">
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
      <Button
        variant="ghost"
        size="icon"
        onClick={onSettingsClick}
        type="button"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserHeader;
