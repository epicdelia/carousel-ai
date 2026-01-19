"use client";

import { TextInput, SlidePreview, SlideEditor } from "@/components/carousel";
import { TemplateGallery } from "@/components/templates";
import { useCarouselStore } from "@/lib/store/carousel-store";

export default function Home() {
  const { slides, error, isGenerating } = useCarouselStore();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Carousel AI</h1>
          <p className="text-muted-foreground">
            Transform your content into engaging carousel slides
          </p>
        </header>

        <div className="space-y-8">
          {/* Text Input Section */}
          <section className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
            <TextInput />
          </section>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-muted-foreground">
                Generating your carousel...
              </p>
            </div>
          )}

          {/* Template Gallery Section */}
          {slides.length > 0 && (
            <section className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
              <TemplateGallery />
            </section>
          )}

          {/* Slide Preview Section */}
          {slides.length > 0 && (
            <section className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
              <SlidePreview />
            </section>
          )}

          {/* Slide Editor Section */}
          {slides.length > 0 && (
            <section className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Edit Selected Slide</h2>
              <SlideEditor />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
