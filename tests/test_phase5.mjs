import http from "http";

const BASE_URL = "http://localhost:3000";

function fetchUrl(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          text: data,
        });
      });
    });

    req.on("error", (err) => reject(err));

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

function buildMultipart(fields, files) {
  const boundary = "----WebKitFormBoundaryPhase5Test" + Math.random().toString(36).substring(2);
  const crlf = "\r\n";
  const parts = [];

  for (const [key, value] of Object.entries(fields)) {
    parts.push(
      `--${boundary}${crlf}Content-Disposition: form-data; name="${key}"${crlf}${crlf}${value}${crlf}`
    );
  }

  for (const [key, file] of Object.entries(files)) {
    parts.push(
      `--${boundary}${crlf}Content-Disposition: form-data; name="${key}"; filename="${file.name}"${crlf}Content-Type: ${file.type}${crlf}${crlf}`
    );
    parts.push(file.content);
    parts.push(crlf);
  }

  parts.push(`--${boundary}--${crlf}`);

  const totalLength = parts.reduce((acc, part) => {
    return acc + (Buffer.isBuffer(part) ? part.length : Buffer.byteLength(part));
  }, 0);

  const buffer = Buffer.alloc(totalLength);
  let offset = 0;
  for (const part of parts) {
    if (Buffer.isBuffer(part)) {
      part.copy(buffer, offset);
      offset += part.length;
    } else {
      offset += buffer.write(part, offset);
    }
  }

  return {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": totalLength.toString(),
    },
    body: buffer,
  };
}

async function runPhase5Tests() {
  console.log("==================================================================");
  console.log("🚀 STARTING PHASE 5 FULL PRODUCTION & LAUNCH READINESS TEST SUITE");
  console.log("==================================================================\n");

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

  // 1. Homepage
  console.log("1. Testing Homepage (/):");
  const homeRes = await fetchUrl("/");
  assert(homeRes.status === 200, "Homepage returns HTTP 200");
  assert(homeRes.text.includes("CatAnalyzer"), "Contains brand title CatAnalyzer");
  assert(homeRes.text.includes("Understand Your Cat"), "Contains tagline 'Understand Your Cat'");
  assert(homeRes.text.includes("application/ld+json"), "Includes JSON-LD structured data");

  // 2. Breed Identifier Tool Page
  console.log("\n2. Testing Breed Identifier Page (/cat-breed-identifier):");
  const breedIdRes = await fetchUrl("/cat-breed-identifier");
  assert(breedIdRes.status === 200, "Breed Identifier returns HTTP 200");
  assert(breedIdRes.text.includes("AI Cat Breed Identifier"), "Contains tool title");
  assert(breedIdRes.text.includes("pedigree"), "Includes clear non-pedigree disclaimer");

  // 3. Cat Translator Tool Page
  console.log("\n3. Testing Cat Translator Page (/cat-translator):");
  const transRes = await fetchUrl("/cat-translator");
  assert(transRes.status === 200, "Cat Translator returns HTTP 200");
  assert(transRes.text.includes("AI Cat Sound Interpreter"), "Contains interpreter title");
  assert(transRes.text.includes("possible interpretations") || transRes.text.includes("decoded language"), "Includes ethical non-literal translation notice");
  assert(transRes.text.includes("consult a licensed veterinarian"), "Includes medical safety advisory");

  // 4. Cat Breed Directory
  console.log("\n4. Testing Cat Breed Directory (/cat-breeds):");
  const directoryRes = await fetchUrl("/cat-breeds");
  assert(directoryRes.status === 200, "Directory page returns HTTP 200");
  assert(directoryRes.text.includes("Cat Breed Directory"), "Contains directory header");
  assert(directoryRes.text.includes("CollectionPage"), "Includes Schema.org CollectionPage");

  // 5. Individual Breed Pages
  console.log("\n5. Testing Sample Individual Breed Guides:");
  const sampleBreeds = ["maine-coon", "ragdoll", "persian", "sphynx"];
  for (const slug of sampleBreeds) {
    const bRes = await fetchUrl(`/cat-breeds/${slug}`);
    assert(bRes.status === 200, `/cat-breeds/${slug} returns HTTP 200`);
    assert(bRes.text.includes("FAQPage"), `/cat-breeds/${slug} contains FAQPage schema`);
    assert(bRes.text.includes("Visual Identification"), `/cat-breeds/${slug} contains visual markers checklist`);
  }

  // 6. Comparison Hub & Dynamic Matchups
  console.log("\n6. Testing Comparison Hub & Pages:");
  const compHubRes = await fetchUrl("/compare");
  assert(compHubRes.status === 200, "Comparison Hub returns HTTP 200");
  const compDetailRes = await fetchUrl("/compare/maine-coon-vs-norwegian-forest-cat");
  assert(compDetailRes.status === 200, "Curated comparison returns HTTP 200");
  assert(compDetailRes.text.includes("Side-by-Side Trait Matrix"), "Comparison contains side-by-side matrix");

  // 7. Sitemap.xml
  console.log("\n7. Testing /sitemap.xml:");
  const sitemapRes = await fetchUrl("/sitemap.xml");
  assert(sitemapRes.status === 200, "Sitemap returns HTTP 200");
  assert(sitemapRes.text.includes("<urlset"), "Sitemap contains valid XML urlset");
  assert(sitemapRes.text.includes("/cat-breeds"), "Sitemap includes directory path");
  assert(sitemapRes.text.includes("/compare"), "Sitemap includes comparison path");

  // 8. Robots.txt
  console.log("\n8. Testing /robots.txt:");
  const robotsRes = await fetchUrl("/robots.txt");
  assert(robotsRes.status === 200, "Robots.txt returns HTTP 200");
  assert(robotsRes.text.includes("Disallow: /api/"), "Robots.txt disallows /api/ routes");
  assert(robotsRes.text.includes("Sitemap:"), "Robots.txt specifies sitemap location");

  // 9. Metadata & Canonical URLs
  console.log("\n9. Testing Canonical URLs & Metadata:");
  assert(homeRes.text.includes('rel="canonical"') || homeRes.text.includes('canonical'), "Homepage includes canonical URL");
  assert(breedIdRes.text.includes("canonical"), "Breed Identifier includes canonical link");

  // 10. JSON-LD Structured Data Validation
  console.log("\n10. Testing JSON-LD Schemas across pages:");
  const schemaRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let jsonLdCount = 0;
  let match;
  while ((match = schemaRegex.exec(homeRes.text)) !== null) {
    try {
      JSON.parse(match[1]);
      jsonLdCount++;
    } catch {
      // ignore
    }
  }
  assert(jsonLdCount >= 1, "Homepage contains valid, parseable JSON-LD scripts");

  // 11. Invalid Routes & Custom 404 Page
  console.log("\n11. Testing 404 & Route Boundaries:");
  const fakeRouteRes = await fetchUrl("/this-is-a-completely-nonexistent-url");
  assert(fakeRouteRes.status === 404, "Invalid route returns HTTP 404");
  assert(fakeRouteRes.text.includes("Page Not Found"), "Custom 404 page rendered");

  const invalidBreedRes = await fetchUrl("/cat-breeds/alien-cat-breed");
  assert(invalidBreedRes.status === 404 || invalidBreedRes.text.includes("Page Not Found"), "Invalid breed slug triggers 404 not-found boundary");

  const invalidCompRes = await fetchUrl("/compare/maine-coon-vs-alien-breed");
  assert(invalidCompRes.status === 404 || invalidCompRes.text.includes("Page Not Found"), "Invalid comparison triggers 404 not-found boundary");

  const selfCompRes = await fetchUrl("/compare/maine-coon-vs-maine-coon");
  assert(selfCompRes.status === 404 || selfCompRes.text.includes("Page Not Found"), "Self-comparison triggers 404 not-found boundary");

  // 12. Invalid Uploads Handling
  console.log("\n12. Testing API Invalid Upload Handling:");
  const emptyReq = await fetchUrl("/api/identify-breed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  assert(emptyReq.status === 400, "Empty POST payload returns HTTP 400");

  // 13. Corrupt / Empty File Handling
  console.log("\n13. Testing Corrupt/Empty File Uploads:");
  const corruptPayload = buildMultipart(
    {},
    {
      file: {
        name: "corrupted.jpg",
        type: "image/jpeg",
        content: Buffer.from("NotAnImageAtAllCorruptedData"),
      },
    }
  );
  const corruptRes = await fetchUrl("/api/identify-breed", {
    method: "POST",
    headers: corruptPayload.headers,
    body: corruptPayload.body,
  });
  assert(corruptRes.status === 400, "Corrupt image with invalid magic bytes returns HTTP 400");

  // 14. Unsupported Formats
  console.log("\n14. Testing Unsupported File Types:");
  const unsupportedPayload = buildMultipart(
    {},
    {
      file: {
        name: "malicious.exe",
        type: "application/x-msdownload",
        content: Buffer.from("MZThisIsAnExecutable"),
      },
    }
  );
  const unsupportedRes = await fetchUrl("/api/identify-breed", {
    method: "POST",
    headers: unsupportedPayload.headers,
    body: unsupportedPayload.body,
  });
  assert(unsupportedRes.status === 415, "Unsupported MIME type returns HTTP 415");

  // 15. Security Headers (CSP, Nosniff, Frame Options)
  console.log("\n15. Testing Production Security Headers:");
  // In Next.js dev or prod server, check headers from homeRes
  const nosniff = homeRes.headers["x-content-type-options"];
  const frameOptions = homeRes.headers["x-frame-options"];
  const referrer = homeRes.headers["referrer-policy"];
  const permissions = homeRes.headers["permissions-policy"];
  const csp = homeRes.headers["content-security-policy"];

  assert(nosniff === "nosniff", "Header X-Content-Type-Options is nosniff");
  assert(frameOptions === "DENY", "Header X-Frame-Options is DENY");
  assert(referrer === "strict-origin-when-cross-origin", "Header Referrer-Policy is strict-origin-when-cross-origin");
  assert(permissions && permissions.includes("microphone=(self)"), "Permissions-Policy allows microphone=(self)");
  assert(csp && csp.includes("default-src 'self'"), "Content-Security-Policy is properly configured");

  console.log("\n==================================================================");
  console.log(`🎉 PHASE 5 TEST RESULTS: ${passed} / ${total} TESTS PASSED.`);
  console.log("==================================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase5Tests().catch((err) => {
  console.error("Phase 5 Test suite failed:", err);
  process.exit(1);
});
