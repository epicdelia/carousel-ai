import { create } from "zustand";
import type { CarouselStore, Slide } from "@/types/carousel";

const initialState = {
  inputText: "",
  slides: [] as Slide[],
  isGenerating: false,
  error: null as string | null,
  selectedSlideIndex: 0,
};

export const useCarouselStore = create<CarouselStore>((set) => ({
  ...initialState,

  setInputText: (text: string) => set({ inputText: text }),

  setSlides: (slides: Slide[]) => set({ slides, selectedSlideIndex: 0 }),

  updateSlide: (index: number, updates: Partial<Slide>) =>
    set((state) => ({
      slides: state.slides.map((slide, i) =>
        i === index ? { ...slide, ...updates } : slide
      ),
    })),

  setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),

  setError: (error: string | null) => set({ error }),

  setSelectedSlideIndex: (index: number) => set({ selectedSlideIndex: index }),

  reset: () => set(initialState),
}));
