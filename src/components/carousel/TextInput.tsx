"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCarouselStore } from "@/lib/store/carousel-store";

const MIN_CHARS = 50;
const MAX_CHARS = 5000;

export function TextInput() {
  const { inputText, setInputText, isGenerating, setIsGenerating, setSlides, setError } =
    useCarouselStore();

  const charCount = inputText.length;
  const isValidLength = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  const canGenerate = isValidLength && !isGenerating;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate carousel");
      }

      const data = await response.json();
      setSlides(data.slides);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="content-input" className="text-sm font-medium">
          Enter your content
        </label>
        <Textarea
          id="content-input"
          placeholder="Paste your blog post, article, or any text content here (minimum 50 characters)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[200px] resize-y"
          disabled={isGenerating}
        />
        <div className="flex justify-between text-sm">
          <span
            className={
              charCount < MIN_CHARS
                ? "text-amber-600"
                : charCount > MAX_CHARS
                  ? "text-red-600"
                  : "text-muted-foreground"
            }
          >
            {charCount} / {MAX_CHARS} characters
            {charCount < MIN_CHARS && ` (minimum ${MIN_CHARS})`}
          </span>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="w-full"
        size="lg"
      >
        {isGenerating ? "Generating..." : "Generate Carousel"}
      </Button>
    </div>
  );
}
