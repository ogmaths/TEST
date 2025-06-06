import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

const LogoExport = () => {
  const handleDownload = (format: string) => {
    // In a real implementation, this would trigger the actual download
    console.log(`Downloading logo in ${format} format`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Logo Export</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* PNG Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                PNG Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                High-quality raster format, perfect for web and digital use.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => handleDownload("PNG-Small")}
                  variant="outline"
                  className="w-full"
                >
                  Small (256x256)
                </Button>
                <Button
                  onClick={() => handleDownload("PNG-Medium")}
                  variant="outline"
                  className="w-full"
                >
                  Medium (512x512)
                </Button>
                <Button
                  onClick={() => handleDownload("PNG-Large")}
                  variant="outline"
                  className="w-full"
                >
                  Large (1024x1024)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SVG Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                SVG Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Scalable vector format, ideal for print and high-resolution
                displays.
              </p>
              <Button onClick={() => handleDownload("SVG")} className="w-full">
                Download SVG
              </Button>
            </CardContent>
          </Card>

          {/* PDF Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                PDF Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Professional format for documents and presentations.
              </p>
              <Button onClick={() => handleDownload("PDF")} className="w-full">
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Logo Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Logo Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  LOGO
                </div>
                <p className="text-gray-500">
                  Your organization logo will appear here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogoExport;
