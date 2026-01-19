"use client";

import { useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomizationStore, defaultCustomColors } from "@/lib/store/customization-store";
import { useTemplateStore } from "@/lib/store/template-store";
import { getTemplateById } from "@/lib/templates/template-data";
import type { BackgroundStyle, LogoPosition, CustomColors } from "@/types/carousel";
import { Palette, Type, Image, RotateCcw, Upload, X } from "lucide-react";

const fontOptions = [
  { value: "Geist", label: "Geist (Default)" },
  { value: "Inter", label: "Inter" },
  { value: "Georgia", label: "Georgia (Serif)" },
  { value: "Arial", label: "Arial" },
  { value: "Verdana", label: "Verdana" },
];

const backgroundOptions: { value: BackgroundStyle; label: string }[] = [
  { value: "gradient", label: "Gradient" },
  { value: "solid", label: "Solid Color" },
];

const positionOptions: { value: LogoPosition; label: string }[] = [
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
];

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-muted-foreground w-12 shrink-0">{label}</label>
      <div className="relative">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-input"
        />
      </div>
      <Input
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-24 text-xs font-mono"
        maxLength={7}
      />
    </div>
  );
}

interface SlideColorSectionProps {
  label: string;
  colors: { from: string; to: string };
  backgroundStyle: BackgroundStyle;
  onColorChange: (colorType: "from" | "to", value: string) => void;
}

function SlideColorSection({
  label,
  colors,
  backgroundStyle,
  onColorChange,
}: SlideColorSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded"
          style={{
            background:
              backgroundStyle === "gradient"
                ? `linear-gradient(to right, ${colors.from}, ${colors.to})`
                : colors.from,
          }}
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="space-y-1 pl-6">
        <ColorPicker
          label={backgroundStyle === "gradient" ? "From" : "Color"}
          color={colors.from}
          onChange={(value) => onColorChange("from", value)}
        />
        {backgroundStyle === "gradient" && (
          <ColorPicker
            label="To"
            color={colors.to}
            onChange={(value) => onColorChange("to", value)}
          />
        )}
      </div>
    </div>
  );
}

export function CustomizationPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isCustomizing,
    setIsCustomizing,
    customColors,
    updateCustomColor,
    setTextColor,
    fontFamily,
    setFontFamily,
    backgroundStyle,
    setBackgroundStyle,
    logoUrl,
    setLogoUrl,
    logoPosition,
    setLogoPosition,
    logoOpacity,
    setLogoOpacity,
    resetCustomization,
  } = useCustomizationStore();

  const { selectedTemplateId } = useTemplateStore();

  // Get effective colors: custom colors > template colors > default colors
  const getEffectiveColors = useCallback((): CustomColors => {
    if (customColors) return customColors;
    if (selectedTemplateId) {
      const template = getTemplateById(selectedTemplateId);
      if (template) return template.colors;
    }
    return defaultCustomColors;
  }, [customColors, selectedTemplateId]);

  const effectiveColors = getEffectiveColors();

  const handleStartCustomizing = () => {
    setIsCustomizing(true);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    resetCustomization();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isCustomizing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Customize Design</h2>
        </div>
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <Palette className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Personalize your carousel with custom colors, fonts, and branding
            </p>
            <Button onClick={handleStartCustomizing}>
              <Palette className="w-4 h-4 mr-2" />
              Start Customizing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Customize Design</h2>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Color Customization */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Brand Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Background Style Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Style</label>
              <div className="flex gap-2">
                {backgroundOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={backgroundStyle === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBackgroundStyle(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Slide Type Colors */}
            <SlideColorSection
              label="Title Slides"
              colors={effectiveColors.title}
              backgroundStyle={backgroundStyle}
              onColorChange={(colorType, value) =>
                updateCustomColor("title", colorType, value)
              }
            />

            <SlideColorSection
              label="Content Slides"
              colors={effectiveColors.content}
              backgroundStyle={backgroundStyle}
              onColorChange={(colorType, value) =>
                updateCustomColor("content", colorType, value)
              }
            />

            <SlideColorSection
              label="CTA Slides"
              colors={effectiveColors.cta}
              backgroundStyle={backgroundStyle}
              onColorChange={(colorType, value) =>
                updateCustomColor("cta", colorType, value)
              }
            />

            {/* Text Color */}
            <div className="pt-2 border-t">
              <ColorPicker
                label="Text"
                color={effectiveColors.text}
                onChange={setTextColor}
              />
            </div>
          </CardContent>
        </Card>

        {/* Font Customization */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Type className="w-4 h-4" />
              Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Preview */}
            <div className="p-4 bg-muted rounded-lg">
              <p
                className="text-lg font-bold"
                style={{ fontFamily: fontFamily }}
              >
                Sample Headline
              </p>
              <p
                className="text-sm text-muted-foreground"
                style={{ fontFamily: fontFamily }}
              >
                Preview body text in {fontFamily}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Image className="w-4 h-4" />
              Logo / Watermark
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Button */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              {!logoUrl ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                      style={{ opacity: logoOpacity / 100 }}
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Position */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Position</label>
                    <select
                      value={logoPosition}
                      onChange={(e) => setLogoPosition(e.target.value as LogoPosition)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {positionOptions.map((pos) => (
                        <option key={pos.value} value={pos.value}>
                          {pos.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Opacity */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Opacity: {logoOpacity}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={logoOpacity}
                      onChange={(e) => setLogoOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Supported formats: PNG, JPG, SVG. Max size: 5MB
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
