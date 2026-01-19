import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import type { Slide, Template, CustomColors, BackgroundStyle, LogoPosition } from "@/types/carousel";

// Platform dimensions for export
export const PLATFORM_DIMENSIONS = {
  instagram: { width: 1080, height: 1080, label: "Instagram (1080×1080)" },
  linkedin: { width: 1080, height: 1080, label: "LinkedIn (1080×1080)" },
  twitter: { width: 1200, height: 675, label: "Twitter/X (1200×675)" },
  facebook: { width: 1200, height: 630, label: "Facebook (1200×630)" },
} as const;

export type PlatformKey = keyof typeof PLATFORM_DIMENSIONS;

export interface ExportOptions {
  platform: PlatformKey;
  slides: Slide[];
  template: Template | undefined;
  customColors: CustomColors | null;
  backgroundStyle: BackgroundStyle;
  fontFamily: string;
  logoUrl: string | null;
  logoPosition: LogoPosition;
  logoOpacity: number;
}

function getSlideBackground(
  slideType: Slide["type"],
  template: Template | undefined,
  customColors: CustomColors | null,
  backgroundStyle: BackgroundStyle
): string {
  const defaultColors = {
    title: { from: "#9333ea", to: "#2563eb" },
    content: { from: "#334155", to: "#0f172a" },
    cta: { from: "#f97316", to: "#db2777" },
    text: "#ffffff",
  };

  const colors = customColors ?? template?.colors ?? defaultColors;
  const slideColors = colors[slideType];

  return backgroundStyle === "gradient"
    ? `linear-gradient(to bottom right, ${slideColors.from}, ${slideColors.to})`
    : slideColors.from;
}

function getTextColor(
  template: Template | undefined,
  customColors: CustomColors | null
): string {
  const defaultTextColor = "#ffffff";
  return customColors?.text ?? template?.colors.text ?? defaultTextColor;
}

function getLogoPositionStyles(position: LogoPosition): string {
  switch (position) {
    case "top-left":
      return "top: 40px; left: 40px;";
    case "top-right":
      return "top: 40px; right: 40px;";
    case "bottom-left":
      return "bottom: 40px; left: 40px;";
    case "bottom-right":
      return "bottom: 40px; right: 40px;";
  }
}

function createSlideHTML(
  slide: Slide,
  options: ExportOptions,
  dimensions: { width: number; height: number }
): string {
  const { template, customColors, backgroundStyle, fontFamily, logoUrl, logoPosition, logoOpacity } = options;
  const { width, height } = dimensions;

  const background = getSlideBackground(slide.type, template, customColors, backgroundStyle);
  const textColor = getTextColor(template, customColors);

  // Scale font sizes based on dimensions (base is 1080x1080)
  const scaleFactor = Math.min(width, height) / 1080;
  const emojiFontSize = Math.round(120 * scaleFactor);
  const headlineFontSize = Math.round(56 * scaleFactor);
  const bodyFontSize = Math.round(32 * scaleFactor);
  const logoSize = Math.round(80 * scaleFactor);

  const logoHTML = logoUrl
    ? `<img src="${logoUrl}" alt="Logo" style="position: absolute; ${getLogoPositionStyles(logoPosition)} width: ${logoSize}px; height: ${logoSize}px; object-fit: contain; opacity: ${logoOpacity / 100};" />`
    : "";

  return `
    <div style="
      width: ${width}px;
      height: ${height}px;
      background: ${background};
      color: ${textColor};
      font-family: ${fontFamily}, system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: ${Math.round(60 * scaleFactor)}px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    ">
      ${slide.emoji ? `<span style="font-size: ${emojiFontSize}px; margin-bottom: ${Math.round(24 * scaleFactor)}px;">${slide.emoji}</span>` : ""}
      <h1 style="font-size: ${headlineFontSize}px; font-weight: bold; margin: 0 0 ${Math.round(16 * scaleFactor)}px 0; line-height: 1.2; max-width: 90%;">${slide.headline}</h1>
      ${slide.body ? `<p style="font-size: ${bodyFontSize}px; margin: 0; opacity: 0.9; line-height: 1.4; max-width: 85%;">${slide.body}</p>` : ""}
      ${logoHTML}
    </div>
  `;
}

async function renderSlideToCanvas(
  slide: Slide,
  options: ExportOptions,
  dimensions: { width: number; height: number }
): Promise<HTMLCanvasElement> {
  // Create a temporary container
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.innerHTML = createSlideHTML(slide, options, dimensions);
  document.body.appendChild(container);

  // Wait for any images (like logo) to load
  const images = container.getElementsByTagName("img");
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        })
    )
  );

  try {
    const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
      width: dimensions.width,
      height: dimensions.height,
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });
    return canvas;
  } finally {
    document.body.removeChild(container);
  }
}

export async function exportSlidesToPNG(
  options: ExportOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const { slides, platform } = options;
  const dimensions = PLATFORM_DIMENSIONS[platform];
  const zip = new JSZip();

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const canvas = await renderSlideToCanvas(slide, options, dimensions);

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, "image/png", 1.0);
    });

    // Add to zip with padded index for proper sorting
    const filename = `slide-${String(i + 1).padStart(2, "0")}.png`;
    zip.file(filename, blob);

    onProgress?.(i + 1, slides.length);
  }

  return zip.generateAsync({ type: "blob" });
}

export async function exportSlidesToPDF(
  options: ExportOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const { slides, platform } = options;
  const dimensions = PLATFORM_DIMENSIONS[platform];

  // Create PDF with dimensions in mm (convert from px at 96 DPI)
  const pxToMm = 0.264583;
  const pdfWidth = dimensions.width * pxToMm;
  const pdfHeight = dimensions.height * pxToMm;

  const pdf = new jsPDF({
    orientation: dimensions.width > dimensions.height ? "landscape" : "portrait",
    unit: "mm",
    format: [pdfWidth, pdfHeight],
  });

  for (let i = 0; i < slides.length; i++) {
    if (i > 0) {
      pdf.addPage([pdfWidth, pdfHeight]);
    }

    const slide = slides[i];
    const canvas = await renderSlideToCanvas(slide, options, dimensions);
    const imageData = canvas.toDataURL("image/png", 1.0);

    pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);

    onProgress?.(i + 1, slides.length);
  }

  return pdf.output("blob");
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
