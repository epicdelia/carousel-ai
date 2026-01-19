export interface Slide {
  id: string;
  type: "title" | "content" | "cta";
  headline: string;
  body?: string;
  emoji?: string;
}

export interface CarouselState {
  inputText: string;
  slides: Slide[];
  isGenerating: boolean;
  error: string | null;
  selectedSlideIndex: number;
}

export interface CarouselActions {
  setInputText: (text: string) => void;
  setSlides: (slides: Slide[]) => void;
  updateSlide: (index: number, updates: Partial<Slide>) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedSlideIndex: (index: number) => void;
  reset: () => void;
}

export type CarouselStore = CarouselState & CarouselActions;

export interface GenerateCarouselRequest {
  text: string;
}

export interface GenerateCarouselResponse {
  slides: Slide[];
}

// Template types
export type TemplateCategory = "professional" | "creative" | "minimal" | "bold";

export interface TemplateColors {
  title: {
    from: string;
    to: string;
  };
  content: {
    from: string;
    to: string;
  };
  cta: {
    from: string;
    to: string;
  };
  text: string;
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  colors: TemplateColors;
}

export interface TemplateState {
  templates: Template[];
  selectedTemplateId: string | null;
  filterCategory: TemplateCategory | "all";
}

export interface TemplateActions {
  setSelectedTemplateId: (id: string | null) => void;
  setFilterCategory: (category: TemplateCategory | "all") => void;
}

export type TemplateStore = TemplateState & TemplateActions;
