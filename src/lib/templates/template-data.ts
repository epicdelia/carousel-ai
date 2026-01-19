import type { Template } from "@/types/carousel";

// Using actual hex/rgb color values for inline styles
export const templates: Template[] = [
  // Professional Templates
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    category: "professional",
    description: "Clean and professional with blue tones",
    colors: {
      title: { from: "#1d4ed8", to: "#1e3a8a" },
      content: { from: "#475569", to: "#1e293b" },
      cta: { from: "#2563eb", to: "#4338ca" },
      text: "#ffffff",
    },
  },
  {
    id: "executive-gray",
    name: "Executive Gray",
    category: "professional",
    description: "Sophisticated grayscale palette",
    colors: {
      title: { from: "#374151", to: "#111827" },
      content: { from: "#6b7280", to: "#374151" },
      cta: { from: "#1f2937", to: "#000000" },
      text: "#ffffff",
    },
  },
  {
    id: "business-green",
    name: "Business Green",
    category: "professional",
    description: "Trust-inspiring green tones",
    colors: {
      title: { from: "#059669", to: "#0f766e" },
      content: { from: "#475569", to: "#1e293b" },
      cta: { from: "#10b981", to: "#15803d" },
      text: "#ffffff",
    },
  },

  // Creative Templates
  {
    id: "sunset-gradient",
    name: "Sunset Gradient",
    category: "creative",
    description: "Warm orange to pink gradient",
    colors: {
      title: { from: "#f97316", to: "#db2777" },
      content: { from: "#fb7185", to: "#f97316" },
      cta: { from: "#ef4444", to: "#db2777" },
      text: "#ffffff",
    },
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    category: "creative",
    description: "Refreshing cyan to blue tones",
    colors: {
      title: { from: "#22d3ee", to: "#3b82f6" },
      content: { from: "#38bdf8", to: "#2563eb" },
      cta: { from: "#2dd4bf", to: "#06b6d4" },
      text: "#ffffff",
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    category: "creative",
    description: "Magical purple to teal gradient",
    colors: {
      title: { from: "#9333ea", to: "#2563eb" },
      content: { from: "#8b5cf6", to: "#7c3aed" },
      cta: { from: "#d946ef", to: "#9333ea" },
      text: "#ffffff",
    },
  },

  // Minimal Templates
  {
    id: "clean-white",
    name: "Clean White",
    category: "minimal",
    description: "Simple white backgrounds with subtle accents",
    colors: {
      title: { from: "#f4f4f5", to: "#e4e4e7" },
      content: { from: "#fafafa", to: "#f4f4f5" },
      cta: { from: "#e4e4e7", to: "#d4d4d8" },
      text: "#18181b",
    },
  },
  {
    id: "soft-beige",
    name: "Soft Beige",
    category: "minimal",
    description: "Warm neutral tones",
    colors: {
      title: { from: "#fffbeb", to: "#ffedd5" },
      content: { from: "#f5f5f4", to: "#e7e5e4" },
      cta: { from: "#fef3c7", to: "#fde68a" },
      text: "#292524",
    },
  },
  {
    id: "light-slate",
    name: "Light Slate",
    category: "minimal",
    description: "Cool gray minimal design",
    colors: {
      title: { from: "#e2e8f0", to: "#cbd5e1" },
      content: { from: "#f1f5f9", to: "#e2e8f0" },
      cta: { from: "#cbd5e1", to: "#94a3b8" },
      text: "#0f172a",
    },
  },

  // Bold Templates
  {
    id: "neon-pink",
    name: "Neon Pink",
    category: "bold",
    description: "Eye-catching hot pink gradient",
    colors: {
      title: { from: "#ec4899", to: "#e11d48" },
      content: { from: "#c026d3", to: "#be185d" },
      cta: { from: "#db2777", to: "#dc2626" },
      text: "#ffffff",
    },
  },
  {
    id: "electric-purple",
    name: "Electric Purple",
    category: "bold",
    description: "Vibrant purple energy",
    colors: {
      title: { from: "#7c3aed", to: "#6b21a8" },
      content: { from: "#9333ea", to: "#5b21b6" },
      cta: { from: "#c026d3", to: "#6d28d9" },
      text: "#ffffff",
    },
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    category: "bold",
    description: "Sleek dark theme with accent colors",
    colors: {
      title: { from: "#27272a", to: "#09090b" },
      content: { from: "#18181b", to: "#000000" },
      cta: { from: "#4f46e5", to: "#6d28d9" },
      text: "#ffffff",
    },
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((t) => t.id === id);
};

export const getTemplatesByCategory = (
  category: string
): Template[] => {
  if (category === "all") return templates;
  return templates.filter((t) => t.category === category);
};
