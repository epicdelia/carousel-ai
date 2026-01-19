# Carousel AI - Text to Carousel Post Generator

## Overview
An AI-powered tool that transforms text content into beautiful carousel posts for Instagram, LinkedIn, and TikTok. Paste your content, pick a style, and get ready-to-post carousel slides.

## Problem Statement
Creating carousel posts is time-consuming:
- Requires design skills (Canva, Figma)
- Takes 30-60 minutes per carousel
- Maintaining consistent branding is hard
- Repurposing content (tweets, blogs) is tedious

## Target Users
- Content creators and influencers
- Social media managers
- Coaches and consultants
- Startups and founders
- Anyone who wants to post carousels without design skills

## Core Features

### MVP Features
1. **Text to Carousel**
   - Paste any text (tweet thread, blog excerpt, tips)
   - AI breaks it into slide-sized chunks
   - Auto-generates headlines and bullet points
   - Supports up to 10 slides

2. **Template Library**
   - 20+ professional templates
   - Categories: Educational, Quotes, Tips, Story, Data
   - Platform-specific sizes (IG square, LinkedIn, TikTok)

3. **Customization**
   - Brand colors (primary, secondary, accent)
   - Font selection (5-10 options)
   - Background styles (solid, gradient, pattern)
   - Add logo/watermark

4. **Export Options**
   - Download as PNG (individual slides)
   - Download as PDF
   - Direct post to Instagram (future)

### AI Features
- Smart text splitting (respects sentences)
- Headline generation
- Key point extraction
- Emoji suggestions
- Hashtag recommendations

### Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, shadcn/ui
- **Canvas**: html2canvas or Fabric.js for rendering
- **AI**: OpenAI GPT-4 for text processing
- **Backend**: Next.js API routes
- **Database**: Supabase
- **Storage**: Supabase Storage (exports)
- **Deployment**: Vercel

## User Stories

### US-1: Generate Carousel
**As a** content creator
**I want to** paste my text and get a carousel
**So that** I can create content quickly

**Acceptance Criteria:**
- [ ] Text input field (min 50 chars, max 5000)
- [ ] AI processes and splits into slides
- [ ] Shows preview of all slides
- [ ] User can edit text on each slide
- [ ] Generation takes < 10 seconds

### US-2: Choose Template
**As a** creator
**I want to** pick a template that matches my brand
**So that** my content looks professional

**Acceptance Criteria:**
- [ ] Template gallery with previews
- [ ] Filter by category/style
- [ ] See template applied to my content
- [ ] Switch templates without losing content

### US-3: Customize Design
**As a** creator
**I want to** adjust colors and fonts
**So that** the carousel matches my brand

**Acceptance Criteria:**
- [ ] Color picker for brand colors
- [ ] Font dropdown
- [ ] Background style options
- [ ] Logo upload
- [ ] Real-time preview

### US-4: Export Carousel
**As a** creator
**I want to** download my carousel
**So that** I can post it on social media

**Acceptance Criteria:**
- [ ] Download all slides as PNGs (zip)
- [ ] Download as single PDF
- [ ] Correct dimensions per platform
- [ ] High quality (1080x1080 for IG)

## Pages to Build
1. `/` - Landing page with demo
2. `/login` - Auth
3. `/create` - Main carousel creator
4. `/templates` - Browse templates
5. `/dashboard` - Saved carousels
6. `/dashboard/brand` - Brand settings

## Database Schema
```sql
-- users (Supabase Auth)

-- brands
id, user_id, name, primary_color, secondary_color,
accent_color, font, logo_url, created_at

-- carousels
id, user_id, title, original_text, slides_json,
template_id, brand_id, created_at

-- templates
id, name, category, preview_url, config_json,
is_premium, created_at
```

## Carousel Slide Structure
```json
{
  "slides": [
    {
      "type": "title",
      "headline": "5 Tips for...",
      "subheadline": "A thread"
    },
    {
      "type": "content",
      "headline": "Tip 1",
      "body": "The actual tip content...",
      "emoji": "💡"
    },
    {
      "type": "cta",
      "headline": "Follow for more",
      "handle": "@username"
    }
  ]
}
```

## AI Prompt Strategy
1. Analyze input text type (tips, story, quotes, data)
2. Extract key points (5-8 main ideas)
3. Generate compelling headlines
4. Split content for readability
5. Suggest CTA for final slide

## Success Metrics
- 100 carousels generated first week
- Average 6 slides per carousel
- 70%+ download rate after generation
- < 5 second generation time
