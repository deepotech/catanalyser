# CATANALYZER.COM — PHASE 7 SEO AUDIT
## Data-Driven SEO Optimization, Search Console Baseline & Technical Audit

**Audit Date:** October 19, 2026  
**Auditor:** Lead SEO Engineer & Technical SEO Specialist  
**Production URL:** https://catanalyzer.com/  
**Repository:** https://github.com/deepotech/catanalyser  
**Framework:** Next.js 15.2.8 (App Router), React 19, TypeScript, Tailwind CSS  
**Target Search Engine:** Google (Web Search)

---

## 1. Executive Summary & Verification Context

- **Local Git Baseline:** Branch `main`, commit `8e4e5eade7cacfe974272e138005c9107647c450` ("Add Google Analytics (gtag.js) tracking tag"), working tree clean.
- **Production Server Verification:** Live inspection of `https://catanalyzer.com` confirmed active status (HTTP 200 via `railway-hikari` edge in `cdg1`), enforcing strict Content-Security-Policy, `X-Content-Type-Options: nosniff`, and canonical `https://catanalyzer.com`.
- **Pre-Implementation Test Baseline:**
  - `npm run build`: Successful (43 static/prerendered SSG pages generated cleanly).
  - Phase 5 Integration Test Suite: **52 / 52 PASSED** (100%).
  - Phase 6 Production Launch & Observability Suite: **29 / 29 PASSED** (100%).

---

## 2. Google Search Console Raw Baseline Analysis

Data sourced directly from the official GSC export for the 3-month reporting window (**September 23 – October 17, 2026**):

### 2.1 Overall Daily Chart Timeline (`Graphique.csv`)
- **Total Clicks:** 11
- **Total Impressions:** 444
- **Average CTR:** 2.48% (11 clicks / 444 impressions)
- **Traffic Trajectory:** Early indexing began September 24. Peaks observed on Sept 26 (83 impressions, 2 clicks), Sept 29 (56 impressions, 1 click), Oct 13 (13 impressions, 2 clicks, 15.38% CTR), and Oct 14 (7 impressions, 2 clicks, 28.57% CTR).

### 2.2 Device Performance Breakdown (`Appareils.csv`)
| Device | Clicks | Impressions | CTR | Average Position |
|---|---:|---:|---:|---:|
| **Mobile** | 10 | 158 | 6.33% | 20.08 |
| **Desktop (Ordinateur)** | 0 | 282 | 0.00% | 45.78 |
| **Tablet (Tablette)** | 1 | 4 | 25.00% | 14.00 |
| **Total** | **11** | **444** | **2.48%** | **35.4** |

> **Key Observation on Desktop vs. Mobile:**  
> Desktop generated 282 impressions (63.5% of total) but 0 clicks. However, this is largely explained by rank disparity: desktop average position is **45.78** (page 5 of Google results), whereas mobile average position is **20.08** (bottom of page 2). High-intent transactional queries like taking a cat photo are also inherently mobile-first. Improving desktop snippet attractiveness and above-the-fold CTA clarity will help capture desktop desktop searches.

### 2.3 Page Performance Breakdown (`Pages.csv`)
| Page URL | Clicks | Impressions | CTR | Average Position |
|---|---:|---:|---:|---:|
| `https://catanalyzer.com/` | 6 | 118 | 5.08% | 18.06 |
| `https://catanalyzer.com/cat-translator` | 3 | 58 | 5.17% | 6.45 |
| `https://catanalyzer.com/cat-breed-identifier` | 2 | 93 | 2.15% | 46.59 |
| `https://catanalyzer.com/cat-breeds/american-shorthair` | 0 | 65 | 0.00% | 51.78 |
| `https://catanalyzer.com/cat-breeds` | 0 | 54 | 0.00% | 55.63 |
| `https://catanalyzer.com/compare` | 0 | 46 | 0.00% | 7.26 |
| `https://catanalyzer.com/cat-breeds/british-shorthair` | 0 | 46 | 0.00% | 57.20 |
| `https://catanalyzer.com/cat-breeds/siamese` | 0 | 22 | 0.00% | 26.41 |
| `https://catanalyzer.com/cat-breeds/devon-rex` | 0 | 16 | 0.00% | 9.25 |
| `https://catanalyzer.com/privacy` | 0 | 15 | 0.00% | 3.00 |
| `https://catanalyzer.com/terms` | 0 | 15 | 0.00% | 4.00 |
| `https://catanalyzer.com/ai-disclaimer` | 0 | 15 | 0.00% | 7.00 |
| `https://catanalyzer.com/compare/maine-coon-vs-norwegian-forest-cat` | 0 | 13 | 0.00% | 12.23 |
| `https://catanalyzer.com/cat-breeds/norwegian-forest-cat` | 0 | 13 | 0.00% | 44.08 |
| `https://catanalyzer.com/compare/russian-blue-vs-british-shorthair` | 0 | 9 | 0.00% | 17.11 |
| `https://catanalyzer.com/cat-breeds/russian-blue` | 0 | 1 | 0.00% | 12.00 |
| **Sum Across Pages** | **11** | **586** | **1.88%** | — |

### 2.4 Explanation of Impression Discrepancy (444 vs. 586)
- The daily chart (`Graphique.csv`) reports **444 total impressions**.
- The page report (`Pages.csv`) reports **586 total impressions**.
- **Root Cause:** In Google Search Console, data aggregation differs between dimensions:
  1. *Site-level/Daily aggregation:* If multiple URLs from `catanalyzer.com` appear in a single SERP for a single user query, Search Console counts only **1 impression** for the site overall in the daily/device charts.
  2. *Page-level aggregation:* Each URL that appeared receives credit in the Pages report, counting as an impression for each respective URL. Additionally, different sampling and privacy filtering thresholds apply between the site-level and page-level exports.
  - The discrepancy (142 impressions) is preserved and standard across GSC exports.

### 2.5 High-Value Query Mapping & Search Intent
| Query | Page Match | Impressions | Clicks | CTR | Position | Search Intent & Opportunity |
|---|---|---:|---:|---:|---:|---|
| `cat breed identifier` | `/cat-breed-identifier`, `/` | 10 | 3 | 30.0% | 41.80 | Primary tool intent. High CTR when displayed. Ranking bottleneck. |
| `what breed is my cat ai` | `/cat-breed-identifier`, `/` | 3 | 1 | 33.3% | 7.67 | Page 1 ranking! Captures conversational AI breed question intent. |
| `american shorthair size` | `/cat-breeds/american-shorthair` | 8 | 0 | 0.0% | 6.12 | Page 1 ranking (#6)! Users need direct dimension & weight data. |
| `devon rex characteristics` | `/cat-breeds/devon-rex` | 2 | 0 | 0.0% | 4.50 | Top 5 ranking! Needs direct characteristic FAQ & phenotypic breakdown. |
| `maine coon vs norwegian forest cat size` | `/compare/maine-coon-vs-norwegian-forest-cat` | 4 | 0 | 0.0% | 4.25 | Top 5 ranking! Needs prominent size table & visual comparison. |
| `maine coon vs norwegian forest cat` | `/compare/maine-coon-vs-norwegian-forest-cat` | 5 | 0 | 0.0% | 10.00 | Position 10. Striking distance of top 5 with better snippet & H2s. |
| `cat sound identifier` | `/cat-translator` | 2 | 0 | 0.0% | 5.50 | Page 1 (#5.5). Validate snippet and preserve working tool. |
| `cat breed analyzer` | `/cat-breed-identifier` | 4 | 0 | 0.0% | 5.50 | Page 1 (#5.5). Direct brand and functional alignment. |
| `compare cat` | `/compare` | 2 | 0 | 0.0% | 7.50 | Page 1 (#7.5). Comparison hub ranks well; snippet needs click appeal. |
| `british shorthair breed guide` | `/cat-breeds/british-shorthair` | 3 | 0 | 0.0% | 9.00 | Page 1 (#9.0). Exact guide query matching our URL structure. |
| `russian blue vs british shorthair` | `/compare/russian-blue-vs-british-shorthair` | 1 | 0 | 0.0% | 8.00 | Page 1 (#8.0). Matchup comparison intent. |

---

## 3. Page-by-Page Audit & Priority Assessment

### Priority A: `/cat-breed-identifier` (Primary Strategic Asset)
- **Current Performance:** 93 impressions, 2 clicks, 2.15% CTR, avg position 46.59.
- **Issues Identified:**
  1. *Snippet Cannibalization:* Meta title (`AI Cat Breed Identifier — What Breed Is My Cat? | CatAnalyzer`) closely mirrors the homepage title (`What Breed Is My Cat? AI Cat Breed Identifier & Translator | CatAnalyzer`), causing Google to alternate impressions between the root and the landing page.
  2. *Missing FAQs:* Unlike `/cat-translator` and the homepage, `/cat-breed-identifier` lacks an FAQ section. Users querying `what breed is my cat ai`, `cat breed identifier by picture`, `cat scanner online`, and mixed-breed questions have no structured answers or FAQ schema here.
  3. *Broken / Misdirected Internal Link:* The bottom section links to `/#popular-breeds` instead of the full canonical `/cat-breeds` directory.
  4. *Workflow Explanation Gap:* While phenotypic indicators are listed, the page lacks a clear 3-step explanation of what happens *before* and *after* upload (e.g. photo intake -> vision model phenotypic analysis -> qualitative match breakdown with reasons and care guides).
  5. *Internal Links to High-Ranking Breeds:* Does not cross-link to the specific breed guides receiving search impressions (American Shorthair, British Shorthair, Devon Rex, Siamese).
- **Remediation Priority:** **CRITICAL / HIGH**.

### Priority B: `/cat-translator` (Protect & Enhance)
- **Current Performance:** 58 impressions, 3 clicks, 5.17% CTR, avg position 6.45.
- **Audit Findings:**
  1. Ranking in positions 5–7 for `cat sound identifier` and `cat sound analyzer`.
  2. Excellent UX, ethical non-literal disclaimer, and thorough FAQ section.
  3. *Action Required:* **PROTECT.** Do not rewrite the meta title or H1. Do not touch audio processing or API contracts.
  4. *Opportunity:* Add a clean, non-intrusive cross-link at the bottom pointing to the `/cat-breed-identifier` and `/cat-breeds` directory to channel engaged users into the breed funnel.
- **Remediation Priority:** **LOW (Protective Maintenance only)**.

### Priority C: Breed Directory & Target Breed Pages
- **Current Performance:**
  - `/cat-breeds`: 54 imp, pos 55.63.
  - `/cat-breeds/american-shorthair`: 65 imp, pos 51.78 (queries: `american shorthair size` pos 6.12, `american shorthair characteristics` pos 12.5, `american shorthair temperament` pos 15.5).
  - `/cat-breeds/british-shorthair`: 46 imp, pos 57.20 (queries: `british shorthair breed guide` pos 9.0, `british shorthair cats breed guide` pos 7.5).
  - `/cat-breeds/devon-rex`: 16 imp, pos 9.25 (queries: `devon rex characteristics` pos 4.5, `devonshire cat breed` pos 8.0).
  - `/cat-breeds/siamese`: 22 imp, pos 26.41 (queries: `siamese mix personality` pos 55.0).
- **Issues Identified in `lib/data/breeds.ts`:**
  1. *Thin FAQ Content:* Each of these breeds currently has only 1 basic FAQ in `lib/data/breeds.ts`.
  2. *Missing Direct Answers to High-Rank Queries:*
     - American Shorthair lacks FAQs answering exact queries for *size/weight range*, *temperament/behavior*, and *difference from tabby/domestic moggies*.
     - British Shorthair lacks FAQs on *growth & size*, *coat density/maintenance*, and *breed characteristics*.
     - Devon Rex lacks FAQs on *elfin characteristics/large ears*, *hypoallergenic/low-dander reality*, and *personality*.
     - Siamese lacks FAQs on *Siamese mix personality traits*, *color point temperature dependence*, and *vocalization*.
- **Remediation Priority:** **HIGH**.

### Priority D: Comparison Hub & Matchup Pages
- **Current Performance:**
  - `/compare`: 46 impressions, avg pos 7.26, 0 clicks.
  - `/compare/maine-coon-vs-norwegian-forest-cat`: 13 imp, pos 12.23 (query: `maine coon vs norwegian forest cat size` at pos 4.25!).
  - `/compare/russian-blue-vs-british-shorthair`: 9 imp, pos 17.11 (query: pos 8.0).
- **Audit Findings:**
  1. `/compare` hub has strong average position (7.26) for generic comparison queries (`compare cat`, `cat comparison`), but 0 clicks because searchers usually seek specific breed comparisons.
  2. The meta description should emphasize side-by-side comparison of size, coat, and temperament.
  3. The Maine Coon vs. Norwegian Forest Cat matchup needs explicit emphasis on the size/weight distinction to satisfy the #4 ranking query.
- **Remediation Priority:** **MEDIUM**.

---

## 4. Technical SEO Audit & Defect Catalog

### Finding 1: Global FAQPage Schema Injection Leak [SEVERITY: HIGH]
- **Location:** `components/seo/json-ld.tsx`, invoked inside `RootLayout` (`app/layout.tsx`).
- **Defect:** `JsonLdSchemas` unconditionally injects a Schema.org `FAQPage` containing `HOMEPAGE_FAQS` onto **every single route** across the site, including `/privacy`, `/terms`, `/ai-disclaimer`, breed guides, and comparisons.
- **Google Search Central Violation:** Google documentation strictly states: *"FAQPage structured data is for pages that contain a list of frequently asked questions and answers... The content of the question and answer must be visible to the user on the page."*
- **Impact:** Risk of manual action or silent algorithmic disqualification of rich snippets due to hidden FAQ structured data.
- **Remediation:** Remove `faqSchema` from `JsonLdSchemas` in `RootLayout`. Keep `faqSchema` exclusively on `app/page.tsx`, and add route-specific FAQ schema only to pages where those FAQs are visually rendered.

### Finding 2: Inaccurate Publisher Logo URL in Article Structured Data [SEVERITY: MEDIUM]
- **Location:** `app/cat-breeds/[slug]/page.tsx` line 121.
- **Defect:** References `${siteUrl}/favicon.ico`, but the actual production brand asset is SVG (`${siteUrl}/icon.svg`).
- **Remediation:** Update logo URL to valid site asset `${siteUrl}/icon.svg`.

### Finding 3: Breadcrumb Navigation Inconsistency on `/cat-breed-identifier` [SEVERITY: MEDIUM]
- **Location:** `app/cat-breed-identifier/page.tsx` line 169.
- **Defect:** "View All" link in the breed standards section points to `/#popular-breeds` (an anchor on the homepage) instead of the canonical directory `/cat-breeds`.
- **Remediation:** Update link target to `/cat-breeds`.

### Finding 4: Canonical & Metadata Verification [SEVERITY: LOW]
- All 34 sitemap URLs (8 static + 16 breeds + 10 comparisons) resolve correct canonical tags matching `https://catanalyzer.com`.
- No localhost or Railway URLs exist in canonical metadata.
- `robots.txt` correctly allows all crawlers and restricts only `/api/`.
- 404 boundaries correctly trigger `notFound()` for invalid breed slugs and comparisons.

---

## 5. Mobile & Desktop Conversion Audit

- **GSC Signal:** Desktop 282 impressions (0 clicks, pos 45.78), Mobile 158 impressions (10 clicks, pos 20.08).
- **Inspection of Tool UX:**
  - On Mobile: The camera button (`capture="environment"`) and photo picker are prominent and functional.
  - On Desktop: Drag-and-drop zone works smoothly; however, when users first land on `/cat-breed-identifier`, the upload zone needs clear guidance on what happens after uploading, and sample cat buttons need to be intuitive for desktop users without immediate access to a mobile camera.
- **Conversion Enhancements:**
  1. Add a clear, reassuring 3-step visual process ("1. Upload photo -> 2. AI visual scan -> 3. Trait & breed match breakdown").
  2. Clearly highlight desktop-friendly sample cat photos to allow desktop users to test the AI pipeline immediately.
  3. Ensure CTA contrast and touch/click targets exceed WCAG standards (minimum 44x44px).

---

## 6. Internal Linking Strategy Matrix

```
[ Homepage (/) ]
    ├──> [ Cat Breed Identifier (/cat-breed-identifier) ]
    │        ├──> [ Cat Breeds Directory (/cat-breeds) ]
    │        │        ├──> [ American Shorthair ] <──> [ Maine Coon vs. NFC ]
    │        │        ├──> [ British Shorthair ] <──> [ Russian Blue vs. BSH ]
    │        │        ├──> [ Devon Rex ]
    │        │        └──> [ Siamese ]
    │        └──> [ Popular Comparisons (/compare) ]
    ├──> [ Cat Translator (/cat-translator) ]
    │        └──> Cross-link to [ Breed Identifier ] & [ Breed Directory ]
    └──> [ Compare Hub (/compare) ]
             └──> [ Individual Matchups ] ──> [ Breed Identifier CTA ]
```

- **Rules Enforced:**
  - Natural, informative anchor text (no spammy exact-match repeats).
  - Every breed page links to its direct comparisons, similar breeds, and the breed identifier tool.
  - Every comparison links back to both breed guides and the breed identifier tool.
  - The translator includes a helpful footer link to the breed identifier for users wanting full physical and vocal cat understanding.

---

## 7. Action Plan Prioritization

| Action | Priority | Target Files |
|---|---|---|
| Fix global FAQPage schema injection leak | **CRITICAL** | `components/seo/json-ld.tsx`, `app/page.tsx` |
| Optimize `/cat-breed-identifier` metadata, FAQs & internal links | **HIGH** | `app/cat-breed-identifier/page.tsx` |
| Expand targeted FAQs for top GSC breeds (American Shorthair, British Shorthair, Devon Rex, Siamese) | **HIGH** | `lib/data/breeds.ts` |
| Strengthen Maine Coon vs Norwegian Forest Cat size comparison | **MEDIUM** | `lib/data/breeds.ts` |
| Fix `/cat-breed-identifier` link to `/cat-breeds` | **MEDIUM** | `app/cat-breed-identifier/page.tsx` |
| Fix publisher logo URL in breed JSON-LD | **MEDIUM** | `app/cat-breeds/[slug]/page.tsx` |
| Add subtle cross-link on `/cat-translator` to `/cat-breed-identifier` | **LOW** | `app/cat-translator/page.tsx` |
| Validate build, test suites (Phase 5, 6, 7), and commit | **HIGH** | All |

---

*End of Phase 7 SEO Audit. Implementation proceeding according to this validated plan.*
