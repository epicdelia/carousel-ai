"use client";

import { Card } from "@/components/ui/card";
import { useCarouselStore } from "@/lib/store/carousel-store";
import { useTemplateStore } from "@/lib/store/template-store";
import { getTemplateById } from "@/lib/templates/template-data";
import type { Slide, Template } from "@/types/carousel";
import type { CSSProperties } from "react";

// Default gradient colors (matching original design)
const defaultColors = {
  title: { from: "#9333ea", to: "#2563eb" },
  content: { from: "#334155", to: "#0f172a" },
  cta: { from: "#f97316", to: "#db2777" },
  text: "#ffffff",
};

function getSlideStyles(
  slide: Slide,
  template: Template | undefined
): { style: CSSProperties; textColor: string } {
  const colors = template?.colors ?? defaultColors;
  const slideColors = colors[slide.type];

  return {
    style: {
      background: `linear-gradient(to bottom right, ${slideColors.from}, ${slideColors.to})`,
    },
    textColor: colors.text,
  };
}

function SlideCard({
  slide,
  index,
  isSelected,
  onClick,
  template,
}: {
  slide: Slide;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  template: Template | undefined;
}) {
  const { style, textColor } = getSlideStyles(slide, template);

  return (
    <Card
      className={`cursor-pointer transition-all hover:scale-105 ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      onClick={onClick}
    >
      <div
        className="aspect-square p-4 flex flex-col justify-center items-center text-center rounded-lg"
        style={{ ...style, color: textColor }}
      >
        {slide.emoji && <span className="text-3xl mb-2">{slide.emoji}</span>}
        <h3 className="font-bold text-sm leading-tight mb-1">{slide.headline}</h3>
        {slide.body && (
          <p className="text-xs opacity-90 line-clamp-3">{slide.body}</p>
        )}
        <span className="absolute bottom-2 right-2 text-xs opacity-60">
          {index + 1}
        </span>
      </div>
    </Card>
  );
}

export function SlidePreview() {
  const { slides, selectedSlideIndex, setSelectedSlideIndex } =
    useCarouselStore();
  const { selectedTemplateId } = useTemplateStore();

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
        {template && (
          <span className="text-sm text-muted-foreground">
            Template: {template.name}
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
          />
        ))}
      </div>
    </div>
  );
}
