import React, { useRef } from "react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const LogoExport: React.FC = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!logoRef.current) return;

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const logoElement = logoRef.current;
    const { width, height } = logoElement.getBoundingClientRect();
    canvas.width = width * 2; // Higher resolution
    canvas.height = height * 2;

    // Draw SVG to canvas
    const svgData = new XMLSerializer().serializeToString(
      logoElement.querySelector("svg") as SVGElement,
    );
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert canvas to data URL and trigger download
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.download = "impact-crm-logo.jpg";
      link.href = dataUrl;
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="p-8 flex flex-col items-center gap-8 bg-white">
      <h1 className="text-2xl font-bold">Logo Export</h1>

      <div className="space-y-8">
        <div className="p-6 border rounded-lg">
          <h2 className="mb-4 text-lg font-medium">Small Logo</h2>
          <div ref={logoRef} className="bg-white p-4">
            <Logo size="sm" variant="default" />
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="mb-4 text-lg font-medium">Medium Logo</h2>
          <div className="bg-white p-4">
            <Logo size="md" variant="default" />
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="mb-4 text-lg font-medium">Large Logo</h2>
          <div className="bg-white p-4">
            <Logo size="lg" variant="default" />
          </div>
        </div>
      </div>

      <Button onClick={handleDownload} className="flex items-center gap-2 mt-4">
        <Download className="h-4 w-4" />
        Download Logo as JPEG
      </Button>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          Note: For higher quality images, you may want to use a dedicated
          graphics tool.
        </p>
      </div>
    </div>
  );
};

export default LogoExport;
