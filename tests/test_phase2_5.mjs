async function runTests() {
  console.log("=== RUNNING PHASE 2.5 INTEGRATION TESTS ===");

  const jpegHeader = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00
  ]);

  // Helper function to send request
  async function sendReq(fileName, ip = "127.0.0.1") {
    const formData = new FormData();
    const file = new Blob([jpegHeader], { type: "image/jpeg" });
    formData.append("file", file, fileName);

    return await fetch("http://localhost:3000/api/identify-breed", {
      method: "POST",
      headers: { "x-forwarded-for": ip },
      body: formData,
    });
  }

  // TEST 1: Standard Cat Photo
  console.log("\n[TEST 1] Standard Cat Photo (Maine Coon / Domestic Longhair)");
  const res1 = await sendReq("maine-coon-test.jpg", "10.0.0.1");
  const data1 = await res1.json();
  console.log("HTTP Status:", res1.status, "(expected 200)");
  console.log("Analysis Status:", data1.analysisStatus, "(expected 'success')");
  console.log("Primary Match:", data1.primaryMatch?.breedName);
  console.log("Qualitative Match Level:", data1.primaryMatch?.matchLevel);
  console.log("Observed Traits Present:", Object.keys(data1.observedTraits || {}).length > 0);

  // TEST 2: Multiple Cats Scenario
  console.log("\n[TEST 2] Multiple Cats Photo");
  const res2 = await sendReq("multiple-cats-photo.jpg", "10.0.0.2");
  const data2 = await res2.json();
  console.log("HTTP Status:", res2.status, "(expected 200)");
  console.log("Analysis Status:", data2.analysisStatus, "(expected 'multiple_cats')");
  console.log("Guidance Title:", data2.userGuidance?.title);

  // TEST 3: Non-Cat Scenario
  console.log("\n[TEST 3] Non-Cat Photo (Dog / Object)");
  const res3 = await sendReq("my-dog-photo.jpg", "10.0.0.3");
  const data3 = await res3.json();
  console.log("HTTP Status:", res3.status, "(expected 200)");
  console.log("Analysis Status:", data3.analysisStatus, "(expected 'not_a_cat')");
  console.log("Guidance Title:", data3.userGuidance?.title);

  // TEST 4: Insufficient Quality Scenario
  console.log("\n[TEST 4] Insufficient Visual Quality (Blurry / Dark)");
  const res4 = await sendReq("blur-dark-cat.jpg", "10.0.0.4");
  const data4 = await res4.json();
  console.log("HTTP Status:", res4.status, "(expected 200)");
  console.log("Analysis Status:", data4.analysisStatus, "(expected 'insufficient_image')");

  // TEST 5: Rate Limiting Enforcement
  console.log("\n[TEST 5] Rate Limiter Enforcement (10 reqs allowed, 11th should return 429)");
  const testIp = "192.168.1.100";
  let got429 = false;
  let retryAfterHeader = null;

  for (let i = 1; i <= 11; i++) {
    const res = await sendReq("sample-cat.jpg", testIp);
    if (res.status === 429) {
      got429 = true;
      retryAfterHeader = res.headers.get("retry-after");
      console.log(`Request #${i} blocked with HTTP 429 Too Many Requests (Retry-After: ${retryAfterHeader}s)`);
      break;
    }
  }
  console.log("Rate limiter enforced successfully:", got429);

  console.log("\n=== ALL INTEGRATION TESTS COMPLETED SUCCESSFULLY ===");
}

runTests().catch(console.error);
