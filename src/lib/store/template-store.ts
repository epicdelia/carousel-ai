import { create } from "zustand";
import type { TemplateStore, TemplateCategory } from "@/types/carousel";
import { templates } from "@/lib/templates/template-data";

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates,
  selectedTemplateId: null,
  filterCategory: "all",

  setSelectedTemplateId: (id: string | null) => set({ selectedTemplateId: id }),

  setFilterCategory: (category: TemplateCategory | "all") =>
    set({ filterCategory: category }),
}));
