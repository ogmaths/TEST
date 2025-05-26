import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-md flex items-center gap-2 animate-in fade-in slide-in-from-top-5">
      <CheckCircle className="h-5 w-5 text-green-600" />
      <span>{message}</span>
    </div>
  );
};

export default SuccessMessage;
