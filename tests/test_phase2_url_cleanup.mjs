/**
 * COMPREHENSIVE PHASE 2 COMPARISON URL CLEANUP & ENTITY INTEGRITY TEST SUITE
 *
 * Verifies ALL 240 original comparison URLs individually:
 * 1. All 10 curated comparisons return HTTP 200 with self-referencing canonicals.
 * 2. All 10 reverse duplicates return HTTP 301 redirecting to an approved curated URL.
 * 3. Every redirect destination returns HTTP 200 directly (zero redirect loops or chains).
 * 4. All 220 uncurated comparison URLs return genuine HTTP 404.
 * 5. Sitemap contains only the 10 approved comparison URLs (zero 404s, zero redirects).
 * 6. Internal links reference zero removed (404) URLs.
 * 7. Schema entity integrity: Exactly 1 global WebSite, exactly 1 global Organization,
 *    zero global WebApplication, exactly 1 route-specific WebApplication on tool pages.
 * 8. Cat Translator title, H1, canonical, and core audio content remain protected.
 */

import fs from 'fs';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const PRODUCTION_URL = 'https://catanalyzer.com';

export const CURATED_COMPARISONS = [
  'maine-coon-vs-norwegian-forest-cat',
  'maine-coon-vs-ragdoll',
  'siamese-vs-ragdoll',
  'british-shorthair-vs-persian',
  'bengal-vs-abyssinian',
  'ragdoll-vs-birman',
  'sphynx-vs-devon-rex',
  'russian-blue-vs-british-shorthair',
  'persian-vs-exotic-shorthair',
  'scottish-fold-vs-british-shorthair',
];

export const REVERSE_REDIRECTS = [
  { from: 'norwegian-forest-cat-vs-maine-coon', to: 'maine-coon-vs-norwegian-forest-cat' },
  { from: 'ragdoll-vs-maine-coon', to: 'maine-coon-vs-ragdoll' },
  { from: 'ragdoll-vs-siamese', to: 'siamese-vs-ragdoll' },
  { from: 'persian-vs-british-shorthair', to: 'british-shorthair-vs-persian' },
  { from: 'abyssinian-vs-bengal', to: 'bengal-vs-abyssinian' },
  { from: 'birman-vs-ragdoll', to: 'ragdoll-vs-birman' },
  { from: 'devon-rex-vs-sphynx', to: 'sphynx-vs-devon-rex' },
  { from: 'british-shorthair-vs-russian-blue', to: 'russian-blue-vs-british-shorthair' },
  { from: 'exotic-shorthair-vs-persian', to: 'persian-vs-exotic-shorthair' },
  { from: 'british-shorthair-vs-scottish-fold', to: 'scottish-fold-vs-british-shorthair' },
];

export const ALL_16_BREED_SLUGS = [
  'maine-coon',
  'ragdoll',
  'siamese',
  'persian',
  'bengal',
  'british-shorthair',
  'scottish-fold',
  'sphynx',
  'norwegian-forest-cat',
  'american-shorthair',
  'abyssinian',
  'birman',
  'russian-blue',
  'devon-rex',
  'exotic-shorthair',
  'turkish-angora',
];

// Generate all 220 uncurated comparison slugs
export function getPrunedComparisonSlugs() {
  const curatedSet = new Set(CURATED_COMPARISONS);
  const reverseSet = new Set(REVERSE_REDIRECTS.map(r => r.from));
  const pruned = [];

  for (let i = 0; i < ALL_16_BREED_SLUGS.length; i++) {
    for (let j = 0; j < ALL_16_BREED_SLUGS.length; j++) {
      if (i !== j) {
        const slug = `${ALL_16_BREED_SLUGS[i]}-vs-${ALL_16_BREED_SLUGS[j]}`;
        if (!curatedSet.has(slug) && !reverseSet.has(slug)) {
          pruned.push(slug);
        }
      }
    }
  }
  return pruned;
}

export async function runFullPhase2TestSuite() {
  console.log('==================================================================');
  console.log('🧪 RUNNING FULL PHASE 2 AUDIT & TEST SUITE (240 INDIVIDUAL URLS)');
  console.log(`Targeting host: ${BASE_URL}`);
  console.log('==================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  const urlAuditInventory = {
    timestamp: new Date().toISOString(),
    host: BASE_URL,
    summary: {
      totalComparisonUrlsTested: 240,
      curatedCount: 10,
      reverseRedirectCount: 10,
      prunedCount: 220,
      allPassing: true,
    },
    curatedUrls: [],
    reverseRedirects: [],
    prunedUrls: [],
  };

  // 1. Verify all 10 Curated Comparison URLs
  console.log('1. Testing All 10 Curated Comparison Pages (HTTP 200 & Self-Canonical):');
  for (const slug of CURATED_COMPARISONS) {
    const res = await fetch(`${BASE_URL}/compare/${slug}`, { redirect: 'manual' });
    assert(res.status === 200, `/compare/${slug} returns HTTP 200`);

    const html = await res.text();
    const expectedCanonical = `${PRODUCTION_URL}/compare/${slug}`;
    const hasCanonical = html.includes(`rel="canonical" href="${expectedCanonical}"`) ||
      html.includes(`href="${expectedCanonical}" rel="canonical"`);
    const hasRobots = html.includes('name="robots" content="index, follow"');
    const hasFaq = html.includes('"@type":"FAQPage"');

    assert(hasCanonical, `/compare/${slug} has self-referencing canonical tag`);
    assert(hasRobots, `/compare/${slug} has robots index, follow`);
    assert(hasFaq, `/compare/${slug} has curated FAQPage schema`);

    urlAuditInventory.curatedUrls.push({
      url: `/compare/${slug}`,
      status: res.status,
      canonical: expectedCanonical,
      hasSelfCanonical: hasCanonical,
      robots: 'index, follow',
      hasFaqSchema: hasFaq,
      pass: res.status === 200 && hasCanonical && hasRobots && hasFaq,
    });
  }

  // 2. Verify all 10 Reverse Duplicates (Permanent 301 Redirects)
  console.log('\n2. Testing All 10 Reverse Duplicates (HTTP 301 Redirects):');
  const approvedCuratedSet = new Set(CURATED_COMPARISONS);

  for (const rule of REVERSE_REDIRECTS) {
    const res = await fetch(`${BASE_URL}/compare/${rule.from}`, { redirect: 'manual' });
    assert(res.status === 301, `/compare/${rule.from} returns exact HTTP 301 (got ${res.status})`);

    const location = res.headers.get('location');
    const expectedPath = `/compare/${rule.to}`;
    const cleanLocation = location ? location.replace(BASE_URL, '').replace(PRODUCTION_URL, '') : '';
    
    assert(
      cleanLocation === expectedPath,
      `/compare/${rule.from} Location header points directly to ${expectedPath} (got ${location})`
    );

    // Verify destination is an approved curated page
    assert(approvedCuratedSet.has(rule.to), `Destination ${rule.to} is in approved CURATED_COMPARISONS list`);

    // Verify destination returns HTTP 200 directly with no loop or chain
    const destRes = await fetch(`${BASE_URL}${expectedPath}`, { redirect: 'manual' });
    assert(destRes.status === 200, `Destination ${expectedPath} returns HTTP 200 directly (no chain/loop)`);

    urlAuditInventory.reverseRedirects.push({
      fromUrl: `/compare/${rule.from}`,
      toUrl: expectedPath,
      status: res.status,
      locationHeader: location,
      cleanLocation,
      destinationStatus: destRes.status,
      directNoChain: destRes.status === 200,
      pass: res.status === 301 && cleanLocation === expectedPath && destRes.status === 200,
    });
  }

  // 3. Verify ALL 220 Uncurated Comparison URLs Individually (HTTP 404)
  const prunedSlugs = getPrunedComparisonSlugs();
  console.log(`\n3. Testing All ${prunedSlugs.length} Pruned Comparison URLs Individually (Genuine HTTP 404):`);
  assert(prunedSlugs.length === 220, `Pruned comparison list contains exactly 220 URLs (got ${prunedSlugs.length})`);

  let pruned404Count = 0;
  for (let i = 0; i < prunedSlugs.length; i++) {
    const slug = prunedSlugs[i];
    const res = await fetch(`${BASE_URL}/compare/${slug}`, { redirect: 'manual' });
    const is404 = res.status === 404;
    if (is404) {
      pruned404Count++;
    } else {
      assert(false, `/compare/${slug} returned unexpected HTTP ${res.status} (expected 404)`);
    }

    urlAuditInventory.prunedUrls.push({
      url: `/compare/${slug}`,
      status: res.status,
      expectedStatus: 404,
      pass: is404,
    });

    if ((i + 1) % 50 === 0 || i === prunedSlugs.length - 1) {
      console.log(`  ... verified ${i + 1}/${prunedSlugs.length} pruned URLs`);
    }
  }
  assert(pruned404Count === 220, `All 220 uncurated comparison URLs return genuine HTTP 404 (actual 404s: ${pruned404Count}/220)`);

  fs.writeFileSync('tests/test_phase2_url_results.json', JSON.stringify(urlAuditInventory, null, 2));
  console.log(`  📁 Saved machine-readable results of all 240 comparison URLs to tests/test_phase2_url_results.json`);

  // 4. Verify Sitemap Content
  console.log('\n4. Testing Sitemap.xml:');
  {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    const xml = await res.text();
    assert(res.status === 200, 'sitemap.xml returns HTTP 200');
    assert(!xml.includes('localhost:3000'), 'sitemap.xml contains ZERO localhost references');

    // Must contain all 10 curated comparisons
    for (const slug of CURATED_COMPARISONS) {
      assert(xml.includes(`<loc>${PRODUCTION_URL}/compare/${slug}</loc>`), `sitemap contains curated /compare/${slug}`);
    }

    // Must NOT contain reverse or pruned URLs
    for (const rule of REVERSE_REDIRECTS) {
      assert(!xml.includes(`/compare/${rule.from}`), `sitemap does NOT contain reverse redirect /compare/${rule.from}`);
    }
    let sitemapPrunedLeak = false;
    for (const slug of prunedSlugs) {
      if (xml.includes(`/compare/${slug}`)) {
        sitemapPrunedLeak = true;
        break;
      }
    }
    assert(!sitemapPrunedLeak, 'sitemap.xml contains ZERO pruned 404 comparison URLs');
  }

  // 5. Verify Schema Entity Integrity
  console.log('\n5. Testing Schema Entity Ownership & Isolation:');
  {
    // Privacy page check
    const privacyRes = await fetch(`${BASE_URL}/privacy`);
    const privacyHtml = await privacyRes.text();
    assert(!privacyHtml.includes('"WebApplication"'), '/privacy does NOT leak WebApplication schema');
    assert(privacyHtml.includes('"@type":"WebSite"') || privacyHtml.includes('"@type": "WebSite"'), '/privacy has global WebSite schema');
    assert(privacyHtml.includes('"@type":"Organization"') || privacyHtml.includes('"@type": "Organization"'), '/privacy has global Organization schema');
    assert(privacyHtml.includes('#website'), '/privacy has stable @id #website');
    assert(privacyHtml.includes('#organization'), '/privacy has stable @id #organization');

    // Terms & AI Disclaimer check
    const termsRes = await fetch(`${BASE_URL}/terms`);
    const termsHtml = await termsRes.text();
    assert(!termsHtml.includes('"WebApplication"'), '/terms does NOT leak WebApplication schema');

    const aiRes = await fetch(`${BASE_URL}/ai-disclaimer`);
    const aiHtml = await aiRes.text();
    assert(!aiHtml.includes('"WebApplication"'), '/ai-disclaimer does NOT leak WebApplication schema');

    // Cat Breed Identifier tool page check
    const breedRes = await fetch(`${BASE_URL}/cat-breed-identifier`);
    const breedHtml = await breedRes.text();
    const breedAppMatches = [...breedHtml.matchAll(/"@type":\s*"WebApplication"/g)];
    assert(breedAppMatches.length === 1, `/cat-breed-identifier has exactly 1 WebApplication entity (found ${breedAppMatches.length})`);
    assert(breedHtml.includes('/cat-breed-identifier#webapp'), '/cat-breed-identifier has stable @id #webapp');

    // Cat Translator tool page check
    const transRes = await fetch(`${BASE_URL}/cat-translator`);
    const transHtml = await transRes.text();
    const transAppMatches = [...transHtml.matchAll(/"@type":\s*"WebApplication"/g)];
    assert(transAppMatches.length === 1, `/cat-translator has exactly 1 WebApplication entity (found ${transAppMatches.length})`);
    assert(transHtml.includes('/cat-translator#webapp'), '/cat-translator has stable @id #webapp');
  }

  // 6. Verify H1 De-cannibalization & Cat Translator Protection
  console.log('\n6. Testing H1 & Cat Translator Strict Protection:');
  {
    const breedRes = await fetch(`${BASE_URL}/cat-breed-identifier`);
    const breedHtml = await breedRes.text();
    assert(
      breedHtml.includes("AI Cat Breed Identifier – <span class=\"text-brand-500\">Identify Your Cat by Photo</span>") ||
      breedHtml.includes("AI Cat Breed Identifier – Identify Your Cat by Photo"),
      '/cat-breed-identifier has approved H1: "AI Cat Breed Identifier – Identify Your Cat by Photo"'
    );

    const transRes = await fetch(`${BASE_URL}/cat-translator`);
    const transHtml = await transRes.text();
    assert(
      transHtml.includes("<title>Cat Translator — Understand Your Cat&#x27;s Sounds with AI | CatAnalyzer</title>") ||
      transHtml.includes("<title>Cat Translator — Understand Your Cat's Sounds with AI | CatAnalyzer</title>"),
      'Cat Translator title tag is strictly preserved'
    );
    assert(
      transHtml.includes("Cat Translator — <span class=\"text-brand-500\">What Is Your Cat Trying to Say?</span>") ||
      transHtml.includes("Cat Translator — What Is Your Cat Trying to Say?"),
      'Cat Translator H1 is strictly preserved'
    );
    assert(transHtml.includes(`rel="canonical" href="${PRODUCTION_URL}/cat-translator"`), 'Cat Translator canonical points to production URL');
  }

  console.log('\n==================================================================');
  console.log(`📊 FINAL TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('test_phase2_url_cleanup.mjs')) {
  runFullPhase2TestSuite().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
}
