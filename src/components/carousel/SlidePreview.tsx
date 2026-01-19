"use client";

import { Card } from "@/components/ui/card";
import { useCarouselStore } from "@/lib/store/carousel-store";
import type { Slide } from "@/types/carousel";

function SlideCard({
  slide,
  index,
  isSelected,
  onClick,
}: {
  slide: Slide;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const bgColor =
    slide.type === "title"
      ? "bg-gradient-to-br from-purple-600 to-blue-600"
      : slide.type === "cta"
        ? "bg-gradient-to-br from-orange-500 to-pink-600"
        : "bg-gradient-to-br from-slate-700 to-slate-900";

  return (
    <Card
      className={`cursor-pointer transition-all hover:scale-105 ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`aspect-square p-4 flex flex-col justify-center items-center text-center text-white rounded-lg ${bgColor}`}
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

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Preview ({slides.length} slides)</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {slides.map((slide, index) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            index={index}
            isSelected={selectedSlideIndex === index}
            onClick={() => setSelectedSlideIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
