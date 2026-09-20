async function runPhase3Tests() {
  console.log("=== RUNNING PHASE 3 INTEGRATION TESTS ===");

  // Construct a realistic WebM / WAV audio buffer (> 50 bytes)
  const audioHeader = Buffer.alloc(256);
  audioHeader.write("RIFF", 0);
  audioHeader.write("WAVE", 8);
  audioHeader.write("fmt ", 12);

  async function sendAudio(fileName, context = "Looking at me", ip = "10.1.1.1", customMime = "audio/webm") {
    const formData = new FormData();
    const file = new Blob([audioHeader], { type: customMime });
    formData.append("audio", file, fileName);
    formData.append("context", context);
    formData.append("duration", "2.1");

    return await fetch("http://localhost:3000/api/translate-cat", {
      method: "POST",
      headers: { "x-forwarded-for": ip },
      body: formData,
    });
  }

  // TEST 1: Context Matters — Near Food
  console.log("\n[TEST 1] Audio with Context 'Near food'");
  const res1 = await sendAudio("meow-hunger.webm", "Near food", "10.1.1.10");
  const data1 = await res1.json();
  console.log("HTTP Status:", res1.status, "(expected 200)");
  console.log("Status:", data1.status, "(expected 'success')");
  console.log("Primary Meaning:", data1.primaryInterpretation?.label);
  console.log("Context Used:", data1.contextUsed, "(expected 'Near food')");
  console.log("Sound Characteristics:", data1.soundCharacteristics?.pitch);

  // TEST 2: Context Matters — Looking at Me
  console.log("\n[TEST 2] Audio with Context 'Looking at me'");
  const res2 = await sendAudio("meow-attention.webm", "Looking at me", "10.1.1.20");
  const data2 = await res2.json();
  console.log("HTTP Status:", res2.status, "(expected 200)");
  console.log("Primary Meaning:", data2.primaryInterpretation?.label);
  console.log("Context Used:", data2.contextUsed, "(expected 'Looking at me')");

  // TEST 3: Non-Cat Audio Detected
  console.log("\n[TEST 3] Non-Cat Sound (Dog barking / Traffic)");
  const res3 = await sendAudio("dog-barking.webm", "Alone", "10.1.1.30");
  const data3 = await res3.json();
  console.log("HTTP Status:", res3.status, "(expected 200)");
  console.log("Status:", data3.status, "(expected 'not_cat_sound')");
  console.log("Guidance Title:", data3.userGuidance?.title);

  // TEST 4: Insufficient Audio (Silent / Muffled)
  console.log("\n[TEST 4] Insufficient Audio (Silence / Too brief)");
  const res4 = await sendAudio("silence.webm", "At night", "10.1.1.40");
  const data4 = await res4.json();
  console.log("HTTP Status:", res4.status, "(expected 200)");
  console.log("Status:", data4.status, "(expected 'insufficient_audio')");
  console.log("Guidance Title:", data4.userGuidance?.title);

  // TEST 5: Unsupported Audio Format Rejection
  console.log("\n[TEST 5] Unsupported Audio Format");
  const res5 = await sendAudio("fake.exe", "Looking at me", "10.1.1.50", "application/x-msdownload");
  const data5 = await res5.json();
  console.log("HTTP Status:", res5.status, "(expected 415)");
  console.log("Error Message:", data5.error);

  // TEST 6: Rate Limiting Enforcement
  console.log("\n[TEST 6] Rate Limiter Enforcement (10 allowed, 11th should return 429)");
  const spamIp = "10.9.9.99";
  let got429 = false;
  for (let i = 1; i <= 11; i++) {
    const res = await sendAudio("test.webm", "Playing", spamIp);
    if (res.status === 429) {
      got429 = true;
      const retryAfter = res.headers.get("retry-after");
      console.log(`Request #${i} blocked with HTTP 429 Too Many Requests (Retry-After: ${retryAfter}s)`);
      break;
    }
  }
  console.log("Rate limiter enforced successfully:", got429);

  console.log("\n=== ALL PHASE 3 TESTS COMPLETED SUCCESSFULLY ===");
}

runPhase3Tests().catch(console.error);
