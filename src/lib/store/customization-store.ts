import { create } from "zustand";
import type {
  CustomizationStore,
  CustomColors,
  BackgroundStyle,
  LogoPosition,
} from "@/types/carousel";

// Default colors matching the original design
const defaultCustomColors: CustomColors = {
  title: { from: "#9333ea", to: "#2563eb" },
  content: { from: "#334155", to: "#0f172a" },
  cta: { from: "#f97316", to: "#db2777" },
  text: "#ffffff",
};

const initialState = {
  isCustomizing: false,
  customColors: null as CustomColors | null,
  fontFamily: "Geist",
  backgroundStyle: "gradient" as BackgroundStyle,
  logoUrl: null as string | null,
  logoPosition: "bottom-right" as LogoPosition,
  logoOpacity: 100,
};

export const useCustomizationStore = create<CustomizationStore>((set) => ({
  ...initialState,

  setIsCustomizing: (isCustomizing: boolean) => set({ isCustomizing }),

  setCustomColors: (colors: CustomColors | null) => set({ customColors: colors }),

  updateCustomColor: (
    slideType: keyof Omit<CustomColors, "text">,
    colorType: "from" | "to",
    value: string
  ) =>
    set((state) => {
      const currentColors = state.customColors ?? defaultCustomColors;
      return {
        customColors: {
          ...currentColors,
          [slideType]: {
            ...currentColors[slideType],
            [colorType]: value,
          },
        },
      };
    }),

  setTextColor: (color: string) =>
    set((state) => {
      const currentColors = state.customColors ?? defaultCustomColors;
      return {
        customColors: {
          ...currentColors,
          text: color,
        },
      };
    }),

  setFontFamily: (font: string) => set({ fontFamily: font }),

  setBackgroundStyle: (style: BackgroundStyle) => set({ backgroundStyle: style }),

  setLogoUrl: (url: string | null) => set({ logoUrl: url }),

  setLogoPosition: (position: LogoPosition) => set({ logoPosition: position }),

  setLogoOpacity: (opacity: number) => set({ logoOpacity: opacity }),

  resetCustomization: () => set(initialState),
}));

export { defaultCustomColors };
