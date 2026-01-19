"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export function SlideEditor() {
  const { slides, selectedSlideIndex, updateSlide } = useCarouselStore();
  const { selectedTemplateId } = useTemplateStore();

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

  const { style, textColor } = getSlideStyles(slide, template);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Live Preview */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Live Preview</h3>
        <Card className="overflow-hidden">
          <div
            className="aspect-square p-8 flex flex-col justify-center items-center text-center"
            style={{ ...style, color: textColor }}
          >
            {slide.emoji && <span className="text-6xl mb-4">{slide.emoji}</span>}
            <h3 className="font-bold text-2xl leading-tight mb-3">
              {slide.headline || "Add a headline"}
            </h3>
            {slide.body && (
              <p className="text-base opacity-90">{slide.body}</p>
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
