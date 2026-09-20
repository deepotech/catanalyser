# CatAnalyzer.com — AI Cat Platform ("Understand Your Cat")

CatAnalyzer is a production-ready AI pet platform built to help owners understand their cats through phenotypic breed identification and bioacoustic sound interpretation.

## Phase 1 Architecture Overview

This codebase implements **Phase 1** of the CatAnalyzer Master Roadmap:
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS with custom design system tokens
- **AI Abstraction Layer**: Decoupled interface (`lib/ai/breed/` and `lib/ai/translator/`) separating UI from AI models, featuring a realistic Development Mock Provider.
- **Data Layer**: Structured breed taxonomy (`lib/data/breeds.ts`) and verified FAQs (`lib/data/faq.ts`).
- **SEO & Structured Data**: Dynamic `sitemap.ts`, `robots.ts`, OpenGraph metadata, and JSON-LD (`WebSite`, `WebApplication`, `FAQPage`).

---

## Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
In Phase 1, `NEXT_PUBLIC_AI_MODE=mock` is active by default.

### 3. Run Development Server
```bash
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
pnpm build
pnpm start
```

---

## Directory Structure

```
├── app/
│   ├── globals.css              # Custom Tailwind styling & typography
│   ├── layout.tsx               # Root layout, metadata & JSON-LD schemas
│   ├── page.tsx                 # High-converting homepage
│   ├── robots.ts                # Dynamic robots.txt
│   └── sitemap.ts               # Dynamic sitemap.xml
├── components/
│   ├── features/
│   │   ├── breed-upload/        # Drag & drop upload, microcopy & results UI
│   │   └── translator-preview/  # Sound recording & contextual interpreter
│   ├── layout/
│   │   ├── navbar.tsx           # Responsive header & drawer navigation
│   │   └── footer.tsx           # Detailed footer with trust disclaimers
│   ├── seo/
│   │   └── json-ld.tsx          # Schema.org structured data
│   └── ui/                      # Reusable design system primitives
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   ├── ai/
│   │   ├── breed/               # Breed provider interface, mock & types
│   │   └── translator/          # Sound provider interface, mock & types
│   ├── data/
│   │   ├── breeds.ts            # Seeded breed taxonomy
│   │   └── faq.ts               # Verified feline FAQs
│   └── utils.ts                 # Classname merge helper
├── .env.example                 # Environment variable templates
└── package.json
```

---

## Definition of Done Verification (Phase 1)
- [x] Zero TypeScript errors (`pnpm run build` succeeds).
- [x] Fully responsive homepage on mobile and desktop viewports.
- [x] Interactive Breed Identifier upload flow with rotating loading microcopy.
- [x] Development Mock Provider returning structured matches, visual evidence, and mixed-breed notes.
- [x] Cat Translator interactive preview with behavioral context selector.
- [x] High-performance SEO metadata, JSON-LD, sitemap, and robots directives.
- [x] Modular architecture ready for Phase 2 vision model integration.
