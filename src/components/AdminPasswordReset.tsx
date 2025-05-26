import React, { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCw, Mail, Check } from "lucide-react";

interface AdminPasswordResetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  userEmail?: string;
  userName?: string;
  userType: "client" | "staff";
}

const AdminPasswordReset: React.FC<AdminPasswordResetProps> = ({
  open,
  onOpenChange,
  userId,
  userEmail,
  userName,
  userType,
}) => {
  const { addNotification } = useNotifications();
  const [method, setMethod] = useState<"email" | "manual">("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSendResetLink = () => {
    setIsProcessing(true);

    // Simulate API call to send reset email
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);

      addNotification({
        type: "success",
        title: "Reset Link Sent",
        message: `Password reset link has been sent to ${userEmail}`,
        priority: "medium",
      });
    }, 1500);
  };

  const handleManualReset = () => {
    if (!newPassword || !confirmPassword) {
      addNotification({
        type: "error",
        title: "Missing Information",
        message: "Please enter and confirm the new password",
        priority: "high",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      addNotification({
        type: "error",
        title: "Password Mismatch",
        message: "New password and confirmation do not match",
        priority: "high",
      });
      return;
    }

    if (newPassword.length < 8) {
      addNotification({
        type: "error",
        title: "Password Too Short",
        message: "Password must be at least 8 characters long",
        priority: "high",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate API call to reset password
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);

      addNotification({
        type: "success",
        title: "Password Reset",
        message: `Password has been reset for ${userName}`,
        priority: "medium",
      });
    }, 1500);
  };

  const handleClose = () => {
    // Reset state when dialog closes
    setMethod("email");
    setNewPassword("");
    setConfirmPassword("");
    setIsProcessing(false);
    setIsComplete(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Reset Password for {userName || "User"}
            {userType === "client" ? (
              <Badge variant="outline" className="ml-2">
                Client
              </Badge>
            ) : (
              <Badge className="ml-2">Staff</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isComplete ? (
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-center">
              {method === "email"
                ? "Reset Link Sent Successfully"
                : "Password Reset Successfully"}
            </h3>
            <p className="text-center text-muted-foreground">
              {method === "email"
                ? `An email with password reset instructions has been sent to ${userEmail}`
                : `The password for ${userName} has been reset`}
            </p>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer ${method === "email" ? "border-primary ring-2 ring-primary/20" : ""}`}
                onClick={() => setMethod("email")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email Reset Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Send a password reset link to the user's email address
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer ${method === "manual" ? "border-primary ring-2 ring-primary/20" : ""}`}
                onClick={() => setMethod("manual")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <RotateCw className="h-4 w-4" /> Manual Reset
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Set a new password directly for this user
                </CardContent>
              </Card>
            </div>

            {method === "email" ? (
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <p className="text-sm">Email: {userEmail}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  A password reset link will be sent to this email address. The
                  link will expire after 24 hours.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={
                  method === "email" ? handleSendResetLink : handleManualReset
                }
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {method === "email" ? "Sending..." : "Resetting..."}
                  </>
                ) : method === "email" ? (
                  "Send Reset Link"
                ) : (
                  "Reset Password"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminPasswordReset;
