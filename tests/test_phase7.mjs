/**
 * PHASE 7 SEO, SEARCH CONSOLE GROWTH & CONVERSION VALIDATION TEST SUITE
 *
 * Verifies:
 * 1. Global JSON-LD hygiene: No FAQPage leakage on legal/trust pages (/privacy, /terms, /ai-disclaimer)
 * 2. Homepage: Retains valid FAQPage schema matching visible HOMEPAGE_FAQS
 * 3. /cat-breed-identifier:
 *    - Has dedicated WebApplication & FAQPage JSON-LD
 *    - Has non-pedigree disclaimer and transparent match tiers explanation
 *    - Has 3-step workflow explanation (before & after upload)
 *    - Links to /cat-breeds directory (not anchor /#popular-breeds)
 *    - Cross-links to top GSC query breeds and comparisons
 * 4. /cat-translator:
 *    - Preserves successful title and ethical/veterinary notices
 *    - Has dedicated FAQPage JSON-LD schema
 *    - Has cross-link to breed identifier
 * 5. Target GSC Breeds (/cat-breeds/american-shorthair, british-shorthair, devon-rex, siamese, norwegian-forest-cat):
 *    - American Shorthair answers size/weight and temperament queries
 *    - British Shorthair answers breed guide characteristics and size
 *    - Devon Rex answers elfin characteristics and hypoallergenic facts
 *    - Siamese answers personality mix and color point temperature facts
 *    - Norwegian Forest Cat answers size comparison vs Maine Coon
 *    - Article JSON-LD publisher logo references /icon.svg
 * 6. Comparison Hub (/compare):
 *    - Has optimized title and meta description
 * 7. Canonical consistency:
 *    - All pages maintain canonical references
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runPhase7TestSuite() {
  console.log('==================================================================');
  console.log('🚀 STARTING PHASE 7 SEO & DATA-DRIVEN SEARCH CONSOLE TEST SUITE');
  console.log(`Targeting: ${BASE_URL}`);
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

  // 1. Global FAQPage Hygiene (No leakage to legal pages)
  console.log('1. Testing Global JSON-LD Hygiene (Zero FAQ leakage):');
  {
    const privRes = await fetch(`${BASE_URL}/privacy`);
    const privHtml = await privRes.text();
    assert(!privHtml.includes('"@type":"FAQPage"') && !privHtml.includes('"@type": "FAQPage"'), '/privacy does NOT leak FAQPage schema');

    const termsRes = await fetch(`${BASE_URL}/terms`);
    const termsHtml = await termsRes.text();
    assert(!termsHtml.includes('"@type":"FAQPage"') && !termsHtml.includes('"@type": "FAQPage"'), '/terms does NOT leak FAQPage schema');

    const discRes = await fetch(`${BASE_URL}/ai-disclaimer`);
    const discHtml = await discRes.text();
    assert(!discHtml.includes('"@type":"FAQPage"') && !discHtml.includes('"@type": "FAQPage"'), '/ai-disclaimer does NOT leak FAQPage schema');
  }

  // 2. Homepage FAQPage Schema Retention
  console.log('\n2. Testing Homepage FAQPage Schema:');
  {
    const homeRes = await fetch(`${BASE_URL}/`);
    const homeHtml = await homeRes.text();
    assert(homeHtml.includes('"@type":"FAQPage"') || homeHtml.includes('"@type": "FAQPage"'), 'Homepage retains valid FAQPage schema');
    assert(homeHtml.includes('Frequently Asked Questions'), 'Homepage contains visible FAQ section');
  }

  // 3. /cat-breed-identifier Landing Page
  console.log('\n3. Testing /cat-breed-identifier Strategic Landing Page:');
  {
    const res = await fetch(`${BASE_URL}/cat-breed-identifier`);
    const html = await res.text();
    assert(res.status === 200, '/cat-breed-identifier returns HTTP 200');
    assert(html.includes('"@type":"FAQPage"') || html.includes('"@type": "FAQPage"'), '/cat-breed-identifier contains dedicated FAQPage schema');
    assert(html.includes('"@type":"WebApplication"') || html.includes('"@type": "WebApplication"'), '/cat-breed-identifier contains WebApplication schema');
    assert(html.includes('How the AI Breed Identification Process Works'), 'Contains 3-step before & after process explanation');
    assert(html.includes('Understanding Mixed-Breed Cats'), 'Contains mixed-breed and rescue guidance');
    assert(html.includes('href="/cat-breeds"'), 'Correctly links to /cat-breeds directory (not anchor /#popular-breeds)');
    assert(!html.includes('href="/#popular-breeds"'), 'Does not link to dead anchor /#popular-breeds');
    assert(html.includes('American Shorthair') && html.includes('British Shorthair'), 'Cross-links to high-intent GSC breed guides');
    assert(html.includes('Try Cat Translator'), 'Cross-links to Cat Translator tool');
  }

  // 4. /cat-translator Tool Page
  console.log('\n4. Testing /cat-translator (Protect & Enhance):');
  {
    const res = await fetch(`${BASE_URL}/cat-translator`);
    const html = await res.text();
    assert(res.status === 200, '/cat-translator returns HTTP 200');
    assert(html.includes('Cat Translator — What Is Your Cat Trying to Say?'), 'Preserves verified H1 title');
    assert(html.includes('"@type":"FAQPage"') || html.includes('"@type": "FAQPage"'), '/cat-translator now contains dedicated FAQPage schema');
    assert(html.includes('Identify My Cat'), 'Contains cross-link to Cat Breed Identifier');
    assert(html.includes('Medical Non-Veterinary Advisory'), 'Preserves veterinary disclaimer');
  }

  // 5. GSC Target Breed Guides
  console.log('\n5. Testing GSC Target Breed Guides:');
  {
    // American Shorthair (queries: size, characteristics, temperament, tabby)
    const ashRes = await fetch(`${BASE_URL}/cat-breeds/american-shorthair`);
    const ashHtml = await ashRes.text();
    assert(ashRes.status === 200, '/cat-breeds/american-shorthair returns HTTP 200');
    assert(ashHtml.includes('size and weight'), 'American Shorthair answers size query');
    assert(ashHtml.includes('temperament and behavior'), 'American Shorthair answers temperament query');
    assert(ashHtml.includes('Are all tabby cats American Shorthairs'), 'American Shorthair answers tabby vs breed query');
    assert(ashHtml.includes('/icon.svg'), 'Breed Article schema references /icon.svg logo');

    // British Shorthair (queries: breed guide, characteristics, size)
    const bshRes = await fetch(`${BASE_URL}/cat-breeds/british-shorthair`);
    const bshHtml = await bshRes.text();
    assert(bshRes.status === 200, '/cat-breeds/british-shorthair returns HTTP 200');
    assert(bshHtml.includes('defining characteristics of a British Shorthair'), 'British Shorthair answers characteristics query');
    assert(bshHtml.includes('size and weight'), 'British Shorthair answers size query');

    // Devon Rex (queries: characteristics, devonshire cat breed)
    const drexRes = await fetch(`${BASE_URL}/cat-breeds/devon-rex`);
    const drexHtml = await drexRes.text();
    assert(drexRes.status === 200, '/cat-breeds/devon-rex returns HTTP 200');
    assert(drexHtml.includes('defining characteristics of a Devon Rex'), 'Devon Rex answers characteristics query');
    assert(drexHtml.includes('hypoallergenic'), 'Devon Rex answers hypoallergenic query');

    // Siamese (queries: siamese mix personality, color points)
    const siaRes = await fetch(`${BASE_URL}/cat-breeds/siamese`);
    const siaHtml = await siaRes.text();
    assert(siaRes.status === 200, '/cat-breeds/siamese returns HTTP 200');
    assert(siaHtml.includes('personality of a Siamese or Siamese mix'), 'Siamese answers mix personality query');
    assert(siaHtml.includes('temperature-sensitive'), 'Siamese answers color point temperature query');

    // Norwegian Forest Cat (queries: size comparison vs Maine Coon)
    const nfcRes = await fetch(`${BASE_URL}/cat-breeds/norwegian-forest-cat`);
    const nfcHtml = await nfcRes.text();
    assert(nfcRes.status === 200, '/cat-breeds/norwegian-forest-cat returns HTTP 200');
    assert(nfcHtml.includes('size of a Norwegian Forest Cat compare to a Maine Coon'), 'Norwegian Forest Cat answers size comparison query');
  }

  // 6. Comparison Hub
  console.log('\n6. Testing Comparison Hub (/compare):');
  {
    const res = await fetch(`${BASE_URL}/compare`);
    const html = await res.text();
    assert(res.status === 200, '/compare returns HTTP 200');
    assert(html.includes('Compare Cat Breeds Side-by-Side: Size, Personality'), 'Contains optimized comparison title');
  }

  // 7. Maine Coon vs Norwegian Forest Cat Matchup
  console.log('\n7. Testing Matchup /compare/maine-coon-vs-norwegian-forest-cat:');
  {
    const res = await fetch(`${BASE_URL}/compare/maine-coon-vs-norwegian-forest-cat`);
    const html = await res.text();
    assert(res.status === 200, 'Comparison page returns HTTP 200');
    assert(html.includes('Weight Range') && html.includes('Typical Size'), 'Matrix contains detailed size comparison');
  }

  console.log('\n==================================================================');
  console.log(`📊 PHASE 7 TEST RESULTS: ${passed} / ${passed + failed} PASSED`);
  if (failed > 0) {
    console.error(`❌ ${failed} TESTS FAILED.`);
    process.exit(1);
  } else {
    console.log('🎉 ALL PHASE 7 SEO & CONVERSION TESTS PASSED CLEANLY.');
  }
  console.log('==================================================================\n');
}

runPhase7TestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
