"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCarouselStore } from "@/lib/store/carousel-store";
import { useTemplateStore } from "@/lib/store/template-store";
import { useCustomizationStore, defaultCustomColors } from "@/lib/store/customization-store";
import { getTemplateById } from "@/lib/templates/template-data";
import type { Slide, Template, CustomColors, BackgroundStyle, LogoPosition } from "@/types/carousel";
import type { CSSProperties } from "react";

function getSlideStyles(
  slide: Slide,
  template: Template | undefined,
  customColors: CustomColors | null,
  backgroundStyle: BackgroundStyle
): { style: CSSProperties; textColor: string } {
  const colors = customColors ?? template?.colors ?? defaultCustomColors;
  const slideColors = colors[slide.type];

  const background =
    backgroundStyle === "gradient"
      ? `linear-gradient(to bottom right, ${slideColors.from}, ${slideColors.to})`
      : slideColors.from;

  return {
    style: { background },
    textColor: colors.text,
  };
}

function getLogoPositionStyles(position: LogoPosition): CSSProperties {
  const base: CSSProperties = { position: "absolute" };
  switch (position) {
    case "top-left":
      return { ...base, top: "16px", left: "16px" };
    case "top-right":
      return { ...base, top: "16px", right: "16px" };
    case "bottom-left":
      return { ...base, bottom: "16px", left: "16px" };
    case "bottom-right":
      return { ...base, bottom: "16px", right: "16px" };
  }
}

export function SlideEditor() {
  const { slides, selectedSlideIndex, updateSlide } = useCarouselStore();
  const { selectedTemplateId } = useTemplateStore();
  const {
    customColors,
    backgroundStyle,
    fontFamily,
    logoUrl,
    logoPosition,
    logoOpacity,
  } = useCustomizationStore();

  const template = selectedTemplateId
    ? getTemplateById(selectedTemplateId)
    : undefined;

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[selectedSlideIndex];
  if (!slide) {
    return null;
  }

  const { style, textColor } = getSlideStyles(slide, template, customColors, backgroundStyle);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Live Preview */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Live Preview</h3>
        <Card className="overflow-hidden">
          <div
            className="aspect-square p-8 flex flex-col justify-center items-center text-center relative"
            style={{ ...style, color: textColor, fontFamily }}
          >
            {slide.emoji && <span className="text-6xl mb-4">{slide.emoji}</span>}
            <h3 className="font-bold text-2xl leading-tight mb-3">
              {slide.headline || "Add a headline"}
            </h3>
            {slide.body && (
              <p className="text-base opacity-90">{slide.body}</p>
            )}
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-12 h-12 object-contain"
                style={{
                  ...getLogoPositionStyles(logoPosition),
                  opacity: logoOpacity / 100,
                }}
              />
            )}
          </div>
        </Card>
      </div>

      {/* Editor Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Edit Slide {selectedSlideIndex + 1}{" "}
            <span className="text-muted-foreground font-normal capitalize">
              ({slide.type})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="emoji" className="text-sm font-medium">
              Emoji (optional)
            </label>
            <Input
              id="emoji"
              value={slide.emoji || ""}
              onChange={(e) =>
                updateSlide(selectedSlideIndex, { emoji: e.target.value })
              }
              placeholder="🚀"
              maxLength={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="headline" className="text-sm font-medium">
              Headline
            </label>
            <Input
              id="headline"
              value={slide.headline}
              onChange={(e) =>
                updateSlide(selectedSlideIndex, { headline: e.target.value })
              }
              placeholder="Enter headline..."
              maxLength={60}
            />
            <span className="text-xs text-muted-foreground">
              {slide.headline.length}/60 characters
            </span>
          </div>

          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">
              Body Text (optional)
            </label>
            <Textarea
              id="body"
              value={slide.body || ""}
              onChange={(e) =>
                updateSlide(selectedSlideIndex, { body: e.target.value })
              }
              placeholder="Enter body text..."
              maxLength={200}
              className="min-h-[100px]"
            />
            <span className="text-xs text-muted-foreground">
              {(slide.body || "").length}/200 characters
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
