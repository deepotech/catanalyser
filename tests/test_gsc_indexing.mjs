/**
 * GSC INDEXING & CANONICAL VERIFICATION TEST SUITE
 *
 * Verifies:
 * 1. robots.txt serves valid directives pointing to https://catanalyzer.com/sitemap.xml
 * 2. sitemap.xml contains all 18 GSC URLs with https://catanalyzer.com (zero localhost:3000)
 * 3. All 10 affected breed pages:
 *    - Return HTTP 200
 *    - Have canonical tag matching https://catanalyzer.com/cat-breeds/<slug>
 *    - Have robots "index, follow"
 *    - Contain server-rendered FAQs and valid FAQPage JSON-LD schema
 *    - Contain key phenotypic markers
 * 4. All 8 affected comparison pages:
 *    - Return HTTP 200
 *    - Have canonical tag matching https://catanalyzer.com/compare/<slugA>-vs-<slugB>
 *    - Have robots "index, follow"
 *    - Contain curated summary and key differences
 *    - Contain comparison FAQs and FAQPage JSON-LD schema
 * 5. Soft-404 checks:
 *    - Non-existent breed returns HTTP 404
 *    - Non-existent comparison returns HTTP 404
 *    - Identical breed comparison (e.g., maine-coon-vs-maine-coon) returns HTTP 404
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const PRODUCTION_URL = 'https://catanalyzer.com';

const AFFECTED_BREED_SLUGS = [
  'abyssinian',
  'bengal',
  'birman',
  'exotic-shorthair',
  'maine-coon',
  'persian',
  'ragdoll',
  'scottish-fold',
  'sphynx',
  'turkish-angora',
];

const AFFECTED_COMPARISONS = [
  'bengal-vs-abyssinian',
  'british-shorthair-vs-persian',
  'maine-coon-vs-ragdoll',
  'persian-vs-exotic-shorthair',
  'ragdoll-vs-birman',
  'scottish-fold-vs-british-shorthair',
  'siamese-vs-ragdoll',
  'sphynx-vs-devon-rex',
];

async function runGscTestSuite() {
  console.log('==================================================================');
  console.log('🔍 STARTING GSC INDEXING & CANONICAL AUDIT TEST SUITE');
  console.log(`Targeting server: ${BASE_URL}`);
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

  // 1. Robots.txt Verification
  console.log('1. Testing robots.txt:');
  {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    const text = await res.text();
    assert(res.status === 200, 'robots.txt returns HTTP 200');
    assert(text.includes(`Sitemap: ${PRODUCTION_URL}/sitemap.xml`), `robots.txt references ${PRODUCTION_URL}/sitemap.xml`);
    assert(!text.includes('localhost:3000'), 'robots.txt contains ZERO localhost:3000 references');
    assert(text.includes('Allow: /'), 'robots.txt allows root path');
    assert(text.includes('Disallow: /api/'), 'robots.txt protects API routes');
  }

  // 2. Sitemap.xml Verification
  console.log('\n2. Testing sitemap.xml:');
  {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    const xml = await res.text();
    assert(res.status === 200, 'sitemap.xml returns HTTP 200');
    assert(!xml.includes('localhost:3000'), 'sitemap.xml contains ZERO localhost:3000 references');

    for (const slug of AFFECTED_BREED_SLUGS) {
      assert(
        xml.includes(`<loc>${PRODUCTION_URL}/cat-breeds/${slug}</loc>`),
        `sitemap.xml contains production URL for /cat-breeds/${slug}`
      );
    }

    for (const comp of AFFECTED_COMPARISONS) {
      assert(
        xml.includes(`<loc>${PRODUCTION_URL}/compare/${comp}</loc>`),
        `sitemap.xml contains production URL for /compare/${comp}`
      );
    }
  }

  // 3. Testing 10 Breed Pages
  console.log('\n3. Testing 10 Breed Pages:');
  for (const slug of AFFECTED_BREED_SLUGS) {
    const res = await fetch(`${BASE_URL}/cat-breeds/${slug}`);
    const html = await res.text();
    const expectedCanonical = `${PRODUCTION_URL}/cat-breeds/${slug}`;

    assert(res.status === 200, `/cat-breeds/${slug} returns HTTP 200`);
    assert(
      html.includes(`rel="canonical" href="${expectedCanonical}"`) ||
        html.includes(`rel="canonical" href="${PRODUCTION_URL}/cat-breeds/${slug}"`),
      `/cat-breeds/${slug} canonical tag points to ${expectedCanonical}`
    );
    assert(!html.includes(`href="http://localhost:3000/cat-breeds/${slug}"`), `/cat-breeds/${slug} canonical does not point to localhost`);
    assert(html.includes('name="robots" content="index, follow"'), `/cat-breeds/${slug} has index, follow robots meta`);
    assert(html.includes('"@type":"FAQPage"'), `/cat-breeds/${slug} has FAQPage JSON-LD schema`);
    assert(html.includes('Frequently Asked Questions'), `/cat-breeds/${slug} renders visible FAQ section`);
    assert(html.includes('How to Visually Identify'), `/cat-breeds/${slug} renders visible visual identification section`);
  }

  // 4. Testing 8 Comparison Pages
  console.log('\n4. Testing 8 Comparison Pages:');
  for (const comp of AFFECTED_COMPARISONS) {
    const res = await fetch(`${BASE_URL}/compare/${comp}`);
    const html = await res.text();
    const expectedCanonical = `${PRODUCTION_URL}/compare/${comp}`;

    assert(res.status === 200, `/compare/${comp} returns HTTP 200`);
    assert(
      html.includes(`rel="canonical" href="${expectedCanonical}"`) ||
        html.includes(`rel="canonical" href="${PRODUCTION_URL}/compare/${comp}"`),
      `/compare/${comp} canonical tag points to ${expectedCanonical}`
    );
    assert(!html.includes(`href="http://localhost:3000/compare/${comp}"`), `/compare/${comp} canonical does not point to localhost`);
    assert(html.includes('name="robots" content="index, follow"'), `/compare/${comp} has index, follow robots meta`);
    assert(html.includes('Side-by-Side Trait Matrix'), `/compare/${comp} renders trait matrix table`);
    assert(html.includes('Key Differences Explained'), `/compare/${comp} renders key differences section`);
    assert(html.includes('"@type":"FAQPage"'), `/compare/${comp} includes FAQPage schema for comparison questions`);
  }

  // 5. Soft-404 & Non-Existent Routes
  console.log('\n5. Testing Soft-404 Resilience:');
  {
    const badBreedRes = await fetch(`${BASE_URL}/cat-breeds/nonexistent-alien-cat`);
    assert(badBreedRes.status === 404, '/cat-breeds/nonexistent-alien-cat returns true HTTP 404');

    const badCompRes = await fetch(`${BASE_URL}/compare/maine-coon-vs-alien-breed`);
    assert(badCompRes.status === 404, '/compare/maine-coon-vs-alien-breed returns true HTTP 404');

    const sameBreedRes = await fetch(`${BASE_URL}/compare/maine-coon-vs-maine-coon`);
    assert(sameBreedRes.status === 404, '/compare/maine-coon-vs-maine-coon returns true HTTP 404');
  }

  console.log('\n==================================================================');
  console.log(`📊 TEST RESULTS: ${passed} / ${passed + failed} PASSED`);
  if (failed > 0) {
    console.error(`❌ ${failed} TESTS FAILED.`);
    process.exit(1);
  } else {
    console.log('🎉 ALL GSC INDEXING & CANONICAL TESTS PASSED CLEANLY.');
  }
  console.log('==================================================================\n');
}

runGscTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
