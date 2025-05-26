import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/context/UserContext";
import { X } from "lucide-react";

interface UserSettingsProps {
  onClose?: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ onClose }) => {
  const { user } = useUser();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">User Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={user?.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue={user?.email} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" defaultValue={user?.role} disabled />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="flex-1">
            Email Notifications
          </Label>
          <Switch id="notifications" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode" className="flex-1">
            Dark Mode
          </Label>
          <Switch id="darkMode" />
        </div>

        <div className="pt-4 flex justify-end space-x-2">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button className="w-full">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
