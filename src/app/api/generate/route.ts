import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { Slide, GenerateCarouselRequest } from "@/types/carousel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert at creating engaging carousel content for social media.
Given a text input, you will split it into 3-7 slides that are perfect for a carousel post.

Rules:
1. First slide should be a "title" type with a catchy headline and optional emoji
2. Middle slides should be "content" type with key points, each with a headline and body text
3. Last slide should be a "cta" type with a call-to-action headline
4. Keep headlines short (under 60 characters)
5. Keep body text concise (under 200 characters)
6. Use emojis sparingly but effectively
7. Make content engaging and shareable

Return a JSON array of slides with this structure:
{
  "slides": [
    {
      "id": "unique-id",
      "type": "title" | "content" | "cta",
      "headline": "string",
      "body": "string (optional)",
      "emoji": "string (optional)"
    }
  ]
}`;

export async function POST(request: Request) {
  try {
    const body: GenerateCarouselRequest = await request.json();
    const { text } = body;

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "Text must be at least 50 characters" },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text must be less than 5000 characters" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // Return mock data for development when no API key is set
      const mockSlides = generateMockSlides(text);
      return NextResponse.json({ slides: mockSlides });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Create carousel slides from this text:\n\n${text}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(content);
    const slides: Slide[] = parsed.slides;

    return NextResponse.json({ slides });
  } catch (error) {
    console.error("Error generating carousel:", error);
    return NextResponse.json(
      { error: "Failed to generate carousel" },
      { status: 500 }
    );
  }
}

function generateMockSlides(text: string): Slide[] {
  const words = text.split(" ");
  const chunks = [];
  const chunkSize = Math.ceil(words.length / 4);

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  const slides: Slide[] = [
    {
      id: crypto.randomUUID(),
      type: "title",
      headline: chunks[0]?.slice(0, 50) + "..." || "Welcome",
      emoji: "🚀",
    },
  ];

  chunks.slice(1, -1).forEach((chunk, index) => {
    slides.push({
      id: crypto.randomUUID(),
      type: "content",
      headline: `Key Point ${index + 1}`,
      body: chunk.slice(0, 180),
    });
  });

  slides.push({
    id: crypto.randomUUID(),
    type: "cta",
    headline: "Ready to get started?",
    body: chunks[chunks.length - 1]?.slice(0, 100) || "Learn more today!",
    emoji: "👉",
  });

  return slides;
}
