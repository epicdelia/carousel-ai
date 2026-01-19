"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTemplateStore } from "@/lib/store/template-store";
import { useCarouselStore } from "@/lib/store/carousel-store";
import { getTemplatesByCategory } from "@/lib/templates/template-data";
import type { Template, TemplateCategory, Slide } from "@/types/carousel";
import { Check } from "lucide-react";
import type { CSSProperties } from "react";

const categories: { value: TemplateCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "professional", label: "Professional" },
  { value: "creative", label: "Creative" },
  { value: "minimal", label: "Minimal" },
  { value: "bold", label: "Bold" },
];

function getGradientStyle(template: Template, slideType: Slide["type"]): CSSProperties {
  const colors = template.colors[slideType];
  return {
    background: `linear-gradient(to bottom right, ${colors.from}, ${colors.to})`,
  };
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { slides } = useCarouselStore();
  const previewSlide = slides[0];

  return (
    <Card
      className={`cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      onClick={onSelect}
    >
      <div className="p-3 space-y-3">
        {/* Mini Preview */}
        <div className="grid grid-cols-3 gap-1">
          {(["title", "content", "cta"] as const).map((type) => (
            <div
              key={type}
              className="aspect-square rounded-sm flex items-center justify-center"
              style={{ ...getGradientStyle(template, type), color: template.colors.text }}
            >
              <span className="text-[8px] font-medium">
                {type === "title" ? "T" : type === "content" ? "C" : "CTA"}
              </span>
            </div>
          ))}
        </div>

        {/* Live Preview with User Content */}
        {previewSlide && (
          <div
            className="aspect-[4/3] rounded-md p-3 flex flex-col justify-center items-center text-center"
            style={{ ...getGradientStyle(template, previewSlide.type), color: template.colors.text }}
          >
            {previewSlide.emoji && (
              <span className="text-lg mb-1">{previewSlide.emoji}</span>
            )}
            <h4 className="font-bold text-[10px] leading-tight line-clamp-2">
              {previewSlide.headline}
            </h4>
          </div>
        )}

        {/* Template Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{template.name}</h3>
            {isSelected && <Check className="w-4 h-4 text-primary" />}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {template.description}
          </p>
          <span className="inline-block text-[10px] px-1.5 py-0.5 bg-muted rounded capitalize">
            {template.category}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function TemplateGallery() {
  const { selectedTemplateId, setSelectedTemplateId, filterCategory, setFilterCategory } =
    useTemplateStore();

  const filteredTemplates = getTemplatesByCategory(filterCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Choose Template</h2>
        {selectedTemplateId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTemplateId(null)}
          >
            Clear Selection
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={filterCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplateId === template.id}
            onSelect={() => setSelectedTemplateId(template.id)}
          />
        ))}
      </div>
    </div>
  );
}
