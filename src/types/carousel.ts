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

// Customization types
export type BackgroundStyle = "gradient" | "solid";
export type LogoPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface CustomColors {
  title: { from: string; to: string };
  content: { from: string; to: string };
  cta: { from: string; to: string };
  text: string;
}

export interface CustomizationState {
  isCustomizing: boolean;
  customColors: CustomColors | null;
  fontFamily: string;
  backgroundStyle: BackgroundStyle;
  logoUrl: string | null;
  logoPosition: LogoPosition;
  logoOpacity: number;
}

export interface CustomizationActions {
  setIsCustomizing: (isCustomizing: boolean) => void;
  setCustomColors: (colors: CustomColors | null) => void;
  updateCustomColor: (
    slideType: keyof Omit<CustomColors, "text">,
    colorType: "from" | "to",
    value: string
  ) => void;
  setTextColor: (color: string) => void;
  setFontFamily: (font: string) => void;
  setBackgroundStyle: (style: BackgroundStyle) => void;
  setLogoUrl: (url: string | null) => void;
  setLogoPosition: (position: LogoPosition) => void;
  setLogoOpacity: (opacity: number) => void;
  resetCustomization: () => void;
}

export type CustomizationStore = CustomizationState & CustomizationActions;
