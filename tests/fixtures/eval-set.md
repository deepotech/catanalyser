# CatAnalyzer AI Quality Evaluation Benchmark (Phase 2.5)

This benchmark provides a standardized evaluation set to verify that vision AI explanations are grounded in verifiable phenotypic evidence, reject uncalibrated numerical percentages, and handle edge cases gracefully.

---

## Evaluation Categories & Acceptance Criteria

### 1. Long-Haired Breeds (e.g. Maine Coon, Norwegian Forest Cat, Persian)
- **Visual Markers to Detect**: Heavy chest ruff, ear lynx tufts, dense double coat, bushy plume tail.
- **Acceptance Criteria**:
  - `observedTraits.coat` must explicitly identify semi-long or longhair texture.
  - `reasons` must cite specific anatomical features (e.g., ear tufts, square jaw).
  - Must not state genetic certainty.

### 2. Short-Haired & Sculpted Breeds (e.g. British Shorthair, Russian Blue)
- **Visual Markers to Detect**: Dense plush crisp coat, cobby body, rounded cheeks, broad skull.
- **Acceptance Criteria**:
  - Identifies cobby compact frame vs. athletic tubular frame.
  - Qualitative match: `strong` or `likely`.

### 3. Pointed / Colorpoint Pattern (e.g. Siamese, Balinese, Ragdoll)
- **Visual Markers to Detect**: Temperature-sensitive colorpoint dilution on mask, ears, paws, and tail; blue eyes; wedge vs. soft head contour.
- **Acceptance Criteria**:
  - `observedTraits.pattern` must identify colorpoint dilution.
  - `mixedBreedPossible` must note that colorpoint Domestic Shorthairs exist and pedigree requires documentation.

### 4. Patterned / Wild Pelt Cats (e.g. Bengal, Tabby)
- **Visual Markers to Detect**: Rosetted or marbled pigmentation, glitter sheen, athletic frame.
- **Acceptance Criteria**:
  - `observedTraits.pattern` must distinguish rosettes/spots from standard mackerel or classic whorls.

### 5. Mixed-Breed & Domestic Companion Cats
- **Visual Markers to Detect**: Blended facial contours, generic domestic coats, mixed ancestral traits.
- **Acceptance Criteria**:
  - `mixedBreedPossible`: `true`.
  - `mixedBreedExplanation` must explain which ancestral lines are suggested without forcing a single purebred conclusion.

### 6. Edge Case: Multiple Cats in Photo
- **Visual Markers to Detect**: Two or more feline bodies/faces in frame.
- **Acceptance Criteria**:
  - `analysisStatus`: `"multiple_cats"`.
  - `userGuidance.title`: *"Multiple cats detected in photo"*.
  - `userGuidance.suggestions`: Asks user to upload a photo with a single cat.

### 7. Edge Case: Non-Cat Subjects (Dogs, Humans, Cars, Furniture)
- **Visual Markers to Detect**: Absence of feline anatomical contours.
- **Acceptance Criteria**:
  - `analysisStatus`: `"not_a_cat"`.
  - Zero hallucinated breed matches (`primaryMatch` undefined).
  - `userGuidance.title`: *"This doesn't appear to be a cat"*.

### 8. Edge Case: Insufficient Visual Evidence (Blur, Darkness, Extreme Crop)
- **Visual Markers to Detect**: Unusable lighting, heavy motion blur, lack of face/body visibility.
- **Acceptance Criteria**:
  - `analysisStatus`: `"insufficient_image"`.
  - Educational advice on lighting, angles, and resolution.

---

## Grounding & Safety Rules
1. **No Fake Probabilities**: Reject any output with numerical percentages (e.g., `Maine Coon 82%`). Accept only `"strong" | "likely" | "possible"`.
2. **Pedigree Boundary**: Always include the standardized disclaimer: *"AI visual identification is an estimate based on visible characteristics and cannot confirm pedigree."*
3. **Zod Validation**: Any response failing `breedAnalysisResultSchema` is caught before returning to the UI.
