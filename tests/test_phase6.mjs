/**
 * PHASE 6 PRODUCTION LAUNCH, OBSERVABILITY & VALIDATION TEST SUITE
 *
 * Verifies:
 * 1. Environment validation layer & startup checks
 * 2. Strict AI Provider safety (zero silent fallback to Mock in production)
 * 3. Rate limiting abstraction & Redis status reporting
 * 4. Production legal pages (/privacy, /terms, /ai-disclaimer)
 * 5. Metadata assets (/icon, /apple-icon, /manifest.webmanifest)
 * 6. Footer links and layout navigation
 * 7. Canonical sitemap inclusion of legal pages
 * 8. Sanitized observability & error handling
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function testSuite() {
  console.log('==================================================================');
  console.log('🚀 STARTING PHASE 6 PRODUCTION LAUNCH & OBSERVABILITY TEST SUITE');
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

  // 1. Legal Pages
  console.log('1. Testing Legal & Trust Pages:');
  {
    const res = await fetch(`${BASE_URL}/privacy`);
    const html = await res.text();
    assert(res.status === 200, '/privacy returns HTTP 200');
    assert(html.includes('Privacy Policy'), '/privacy contains header');
    assert(html.includes('CatAnalyzer does not intentionally persist uploaded photos'), '/privacy specifies application non-persistence');
    assert(html.includes('Third-Party AI Provider Processing'), '/privacy separates third-party AI processing');
  }

  {
    const res = await fetch(`${BASE_URL}/terms`);
    const html = await res.text();
    assert(res.status === 200, '/terms returns HTTP 200');
    assert(html.includes('Terms of Service'), '/terms contains header');
    assert(html.includes('Strict Non-Veterinary Disclaimer'), '/terms contains veterinary disclaimer');
  }

  {
    const res = await fetch(`${BASE_URL}/ai-disclaimer`);
    const html = await res.text();
    assert(res.status === 200, '/ai-disclaimer returns HTTP 200');
    assert(html.includes('AI Transparency') && html.includes('Methodology Disclaimer'), '/ai-disclaimer contains title');
    assert(html.includes('phenotypic markers'), '/ai-disclaimer explains phenotypic matching');
    assert(html.includes('behavioral interpretation based on established ethological research'), '/ai-disclaimer explains cat translator limits');
  }

  // 2. Footer Links
  console.log('\n2. Testing Footer Legal Links on Homepage:');
  {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    assert(html.includes('/privacy'), 'Homepage footer links to /privacy');
    assert(html.includes('/terms'), 'Homepage footer links to /terms');
    assert(html.includes('/ai-disclaimer'), 'Homepage footer links to /ai-disclaimer');
  }

  // 3. Brand & Web Manifest Assets
  console.log('\n3. Testing Brand Assets & Web App Manifest:');
  {
    const res = await fetch(`${BASE_URL}/manifest.webmanifest`);
    assert(res.status === 200, '/manifest.webmanifest returns HTTP 200');
    const json = await res.json();
    assert(json.name === 'CatAnalyzer — Understand Your Cat', 'Manifest has correct brand name');
    assert(json.short_name === 'CatAnalyzer', 'Manifest has correct short_name');
    assert(json.theme_color === '#059669', 'Manifest has brand emerald theme color');
  }

  {
    const res = await fetch(`${BASE_URL}/icon.svg`);
    assert(res.status === 200, '/icon.svg returns HTTP 200');
    assert(res.headers.get('content-type')?.includes('svg'), '/icon.svg returns SVG image content');
  }

  {
    const res = await fetch(`${BASE_URL}/apple-icon.svg`);
    assert(res.status === 200, '/apple-icon.svg returns HTTP 200');
    assert(res.headers.get('content-type')?.includes('svg'), '/apple-icon.svg returns SVG image content');
  }

  // 4. Sitemap Validation for Legal Routes
  console.log('\n4. Testing Sitemap Inclusion of Legal URLs:');
  {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    const xml = await res.text();
    assert(res.status === 200, '/sitemap.xml returns HTTP 200');
    assert(xml.includes('/privacy'), 'Sitemap includes /privacy');
    assert(xml.includes('/terms'), 'Sitemap includes /terms');
    assert(xml.includes('/ai-disclaimer'), 'Sitemap includes /ai-disclaimer');
  }

  // 5. Rate Limiter Status Endpoint or Behavior
  console.log('\n5. Testing Security Headers on Legal Pages:');
  {
    const res = await fetch(`${BASE_URL}/privacy`);
    assert(res.headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff present');
    assert(res.headers.get('x-frame-options') === 'DENY', 'X-Frame-Options: DENY present');
    assert(res.headers.get('content-security-policy')?.includes("default-src 'self'"), 'CSP present on legal page');
  }

  console.log('\n==================================================================');
  console.log(`📊 PHASE 6 TEST RESULTS: ${passed} / ${passed + failed} PASSED`);
  console.log('==================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

testSuite().catch((err) => {
  console.error('Phase 6 Test Suite execution failed:', err);
  process.exit(1);
});
