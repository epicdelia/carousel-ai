"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCarouselStore } from "@/lib/store/carousel-store";
import { useTemplateStore } from "@/lib/store/template-store";
import { useCustomizationStore } from "@/lib/store/customization-store";
import { getTemplateById } from "@/lib/templates/template-data";
import {
  exportSlidesToPNG,
  exportSlidesToPDF,
  downloadBlob,
  PLATFORM_DIMENSIONS,
  type PlatformKey,
} from "@/lib/export/export-utils";
import { Download, FileImage, FileText, Check } from "lucide-react";

type ExportStatus = "idle" | "exporting" | "success" | "error";

export function ExportPanel() {
  const { slides } = useCarouselStore();
  const { selectedTemplateId } = useTemplateStore();
  const {
    customColors,
    backgroundStyle,
    fontFamily,
    logoUrl,
    logoPosition,
    logoOpacity,
  } = useCustomizationStore();

  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>("instagram");
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const template = selectedTemplateId ? getTemplateById(selectedTemplateId) : undefined;

  const exportOptions = {
    platform: selectedPlatform,
    slides,
    template,
    customColors,
    backgroundStyle,
    fontFamily,
    logoUrl,
    logoPosition,
    logoOpacity,
  };

  const handleExportPNG = async () => {
    setExportStatus("exporting");
    setErrorMessage(null);
    setProgress({ current: 0, total: slides.length });

    try {
      const blob = await exportSlidesToPNG(exportOptions, (current, total) => {
        setProgress({ current, total });
      });
      downloadBlob(blob, `carousel-slides-${selectedPlatform}.zip`);
      setExportStatus("success");
      setTimeout(() => setExportStatus("idle"), 2000);
    } catch (error) {
      setExportStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Export failed");
    }
  };

  const handleExportPDF = async () => {
    setExportStatus("exporting");
    setErrorMessage(null);
    setProgress({ current: 0, total: slides.length });

    try {
      const blob = await exportSlidesToPDF(exportOptions, (current, total) => {
        setProgress({ current, total });
      });
      downloadBlob(blob, `carousel-slides-${selectedPlatform}.pdf`);
      setExportStatus("success");
      setTimeout(() => setExportStatus("idle"), 2000);
    } catch (error) {
      setExportStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Export failed");
    }
  };

  const currentDimensions = PLATFORM_DIMENSIONS[selectedPlatform];
  const isExporting = exportStatus === "exporting";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Carousel
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Download your {slides.length} slides as PNG images or PDF
          </p>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Platform Dimensions</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(PLATFORM_DIMENSIONS) as PlatformKey[]).map((platform) => {
            const dims = PLATFORM_DIMENSIONS[platform];
            const isSelected = selectedPlatform === platform;
            return (
              <Card
                key={platform}
                className={`p-3 cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedPlatform(platform)}
              >
                <div className="text-sm font-medium capitalize">{platform}</div>
                <div className="text-xs text-muted-foreground">
                  {dims.width}×{dims.height}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Export Info */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="text-sm">
          <span className="font-medium">Output:</span>{" "}
          {currentDimensions.width}×{currentDimensions.height}px •{" "}
          {slides.length} slides
        </div>
      </div>

      {/* Progress Indicator */}
      {isExporting && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Exporting slides...</span>
            <span>
              {progress.current}/{progress.total}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Success Message */}
      {exportStatus === "success" && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          Export completed successfully!
        </div>
      )}

      {/* Export Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleExportPNG}
          disabled={isExporting || slides.length === 0}
          className="flex-1"
        >
          <FileImage className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Download as PNG (ZIP)"}
        </Button>
        <Button
          onClick={handleExportPDF}
          disabled={isExporting || slides.length === 0}
          variant="secondary"
          className="flex-1"
        >
          <FileText className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Download as PDF"}
        </Button>
      </div>
    </div>
  );
}
