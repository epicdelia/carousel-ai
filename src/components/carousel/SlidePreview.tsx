"use client";

import { Card } from "@/components/ui/card";
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
      return { ...base, top: "4px", left: "4px" };
    case "top-right":
      return { ...base, top: "4px", right: "4px" };
    case "bottom-left":
      return { ...base, bottom: "4px", left: "4px" };
    case "bottom-right":
      return { ...base, bottom: "4px", right: "4px" };
  }
}

function SlideCard({
  slide,
  index,
  isSelected,
  onClick,
  template,
  customColors,
  backgroundStyle,
  fontFamily,
  logoUrl,
  logoPosition,
  logoOpacity,
}: {
  slide: Slide;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  template: Template | undefined;
  customColors: CustomColors | null;
  backgroundStyle: BackgroundStyle;
  fontFamily: string;
  logoUrl: string | null;
  logoPosition: LogoPosition;
  logoOpacity: number;
}) {
  const { style, textColor } = getSlideStyles(slide, template, customColors, backgroundStyle);

  return (
    <Card
      className={`cursor-pointer transition-all hover:scale-105 ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      onClick={onClick}
    >
      <div
        className="aspect-square p-4 flex flex-col justify-center items-center text-center rounded-lg relative overflow-hidden"
        style={{ ...style, color: textColor, fontFamily }}
      >
        {slide.emoji && <span className="text-3xl mb-2">{slide.emoji}</span>}
        <h3 className="font-bold text-sm leading-tight mb-1">{slide.headline}</h3>
        {slide.body && (
          <p className="text-xs opacity-90 line-clamp-3">{slide.body}</p>
        )}
        <span className="absolute bottom-2 right-2 text-xs opacity-60">
          {index + 1}
        </span>
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo"
            className="w-6 h-6 object-contain"
            style={{
              ...getLogoPositionStyles(logoPosition),
              opacity: logoOpacity / 100,
            }}
          />
        )}
      </div>
    </Card>
  );
}

export function SlidePreview() {
  const { slides, selectedSlideIndex, setSelectedSlideIndex } =
    useCarouselStore();
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Preview ({slides.length} slides)</h2>
        {template && !customColors && (
          <span className="text-sm text-muted-foreground">
            Template: {template.name}
          </span>
        )}
        {customColors && (
          <span className="text-sm text-muted-foreground">
            Custom Design
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {slides.map((slide, index) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            index={index}
            isSelected={selectedSlideIndex === index}
            onClick={() => setSelectedSlideIndex(index)}
            template={template}
            customColors={customColors}
            backgroundStyle={backgroundStyle}
            fontFamily={fontFamily}
            logoUrl={logoUrl}
            logoPosition={logoPosition}
            logoOpacity={logoOpacity}
          />
        ))}
      </div>
    </div>
  );
}
