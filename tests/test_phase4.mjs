import http from "http";

const BASE_URL = "http://localhost:3000";

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http
      .get(`${BASE_URL}${path}`, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        });
      })
      .on("error", (err) => reject(err));
  });
}

const ALL_16_SLUGS = [
  "maine-coon",
  "ragdoll",
  "siamese",
  "persian",
  "bengal",
  "british-shorthair",
  "scottish-fold",
  "sphynx",
  "norwegian-forest-cat",
  "american-shorthair",
  "abyssinian",
  "birman",
  "russian-blue",
  "devon-rex",
  "exotic-shorthair",
  "turkish-angora",
];

const CURATED_COMPARISON_PATHS = [
  "maine-coon-vs-norwegian-forest-cat",
  "maine-coon-vs-ragdoll",
  "siamese-vs-ragdoll",
  "british-shorthair-vs-persian",
  "bengal-vs-abyssinian",
  "ragdoll-vs-birman",
  "sphynx-vs-devon-rex",
  "russian-blue-vs-british-shorthair",
  "persian-vs-exotic-shorthair",
  "scottish-fold-vs-british-shorthair",
];

async function runTests() {
  console.log("🧪 Starting Phase 4 Cat Breed Directory & SEO Ecosystem Integration Tests...\n");
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  // Test 1: Cat Breed Directory Page
  console.log("1. Testing /cat-breeds Directory Hub:");
  const directoryRes = await fetchUrl("/cat-breeds");
  assert(directoryRes.status === 200, "Directory page returns HTTP 200");
  assert(directoryRes.text.includes("Cat Breed Directory"), "Contains 'Cat Breed Directory' headline");
  assert(directoryRes.text.includes("CollectionPage"), "Includes Schema.org CollectionPage JSON-LD");
  assert(directoryRes.text.includes("Maine Coon"), "Renders Maine Coon in directory");
  assert(directoryRes.text.includes("Turkish Angora"), "Renders Turkish Angora in directory");

  // Test 2: Individual Breed Guides (sample 4 across different sizes and coats)
  console.log("\n2. Testing Sample /cat-breeds/[slug] Breed Detail Pages:");
  for (const slug of ["maine-coon", "siamese", "sphynx", "bengal"]) {
    const res = await fetchUrl(`/cat-breeds/${slug}`);
    assert(res.status === 200, `Breed page /cat-breeds/${slug} returns HTTP 200`);
    assert(res.text.includes("Physical Appearance &amp; Anatomy Matrix") || res.text.includes("Physical Appearance"), `Page /cat-breeds/${slug} includes Anatomy Matrix`);
    assert(res.text.includes("How to Visually Identify"), `Page /cat-breeds/${slug} includes Visual Phenotype section`);
    assert(res.text.includes("FAQPage"), `Page /cat-breeds/${slug} includes FAQPage schema`);
    assert(res.text.includes("Scan My Cat"), `Page /cat-breeds/${slug} includes high-converting CTA back to identifier`);
  }

  // Test 3: Invalid Breed Slug returns 404
  console.log("\n3. Testing 404 handling on nonexistent breed slug:");
  const notFoundBreed = await fetchUrl("/cat-breeds/nonexistent-alien-cat");
  assert(notFoundBreed.status === 404 || notFoundBreed.text.includes("Page Not Found"), "Invalid breed slug returns HTTP 404 or custom 404 page");

  // Test 4: Comparison Index Hub
  console.log("\n4. Testing /compare Index Hub:");
  const compareIndexRes = await fetchUrl("/compare");
  assert(compareIndexRes.status === 200, "Comparison hub returns HTTP 200");
  assert(compareIndexRes.text.includes("Compare Cat Breeds Side-by-Side"), "Contains comparison header");
  assert(compareIndexRes.text.includes("Maine Coon vs. Norwegian Forest Cat"), "Contains curated matchup title");

  // Test 5: Head-to-Head Comparison Detail Pages
  console.log("\n5. Testing /compare/[comparison] Pages:");
  for (const compPath of ["maine-coon-vs-norwegian-forest-cat", "persian-vs-exotic-shorthair"]) {
    const res = await fetchUrl(`/compare/${compPath}`);
    assert(res.status === 200, `Comparison /compare/${compPath} returns HTTP 200`);
    assert(res.text.includes("Side-by-Side Trait Matrix"), `Page /compare/${compPath} includes Trait Matrix`);
    assert(res.text.includes("Key Differences Explained"), `Page /compare/${compPath} includes Key Differences`);
    assert(res.text.includes("Which Breed Is Right For You?"), `Page /compare/${compPath} includes Decision Guide`);
    assert(res.text.includes("Scan My Cat Now"), `Page /compare/${compPath} includes CTA to AI Identifier`);
  }

  // Test 6: Invalid Comparison returns 404
  console.log("\n6. Testing 404 handling on invalid comparisons:");
  const notFoundComp1 = await fetchUrl("/compare/maine-coon-vs-fake-cat");
  assert(notFoundComp1.status === 404 || notFoundComp1.text.includes("Page Not Found"), "Invalid comparison with nonexistent breed returns HTTP 404 or custom 404 page");
  const notFoundComp2 = await fetchUrl("/compare/maine-coon-vs-maine-coon");
  assert(notFoundComp2.status === 404 || notFoundComp2.text.includes("Page Not Found"), "Self-comparison (same breed) returns HTTP 404 or custom 404 page");

  // Test 7: Sitemap.xml
  console.log("\n7. Testing /sitemap.xml:");
  const sitemapRes = await fetchUrl("/sitemap.xml");
  assert(sitemapRes.status === 200, "Sitemap returns HTTP 200");
  assert(sitemapRes.text.includes("/cat-breeds"), "Sitemap includes /cat-breeds");
  assert(sitemapRes.text.includes("/compare"), "Sitemap includes /compare");
  assert(sitemapRes.text.includes("/cat-breeds/maine-coon"), "Sitemap includes /cat-breeds/maine-coon");
  assert(sitemapRes.text.includes("/compare/maine-coon-vs-norwegian-forest-cat"), "Sitemap includes curated comparisons");

  console.log(`\n==========================================`);
  console.log(`Phase 4 Results: ${passed} / ${total} tests passed.`);
  console.log(`==========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
