export interface BreedAppearance {
  coatLength: "Shorthair" | "Semi-Longhair" | "Longhair" | "Hairless";
  coatTexture: string;
  colors: string[];
  patterns: string[];
  earShape: string;
  faceShape: string;
  eyeCharacteristics: string;
  bodyType: "Cobby" | "Semi-Cobby" | "Medium" | "Semi-Foreign" | "Foreign / Tubular" | "Substantial / Large";
  tailCharacteristics: string;
}

export interface BreedTraits {
  personality: string[];
  activityLevel: "Calm" | "Moderate" | "High" | "Very High";
  sociability: "Independent" | "Friendly" | "Highly Affectionate" | "Social";
  groomingLevel: "Low" | "Moderate" | "High";
  vocalizationLevel: "Quiet" | "Moderate" | "Vocal" | "Very Vocal";
}

export interface BreedCare {
  groomingFrequency: string;
  exerciseNeeds: string;
  indoorSuitability: string;
}

export interface BreedFAQ {
  question: string;
  answer: string;
}

export interface BreedData {
  id: string;
  name: string;
  slug: string;
  aliases: string[];
  shortDescription: string;
  longDescription: string;
  origin: string;
  size: "Small" | "Medium" | "Large" | "Very Large";
  weightRange: string;
  lifespan: string;
  appearance: BreedAppearance;
  traits: BreedTraits;
  care: BreedCare;
  keyVisualIdentifiers: string[];
  similarBreeds: string[]; // slugs
  imageUrl: string;
  badge?: string;
  faq: BreedFAQ[];
  // Backwards compatibility shortcuts
  coatLength: "Shorthair" | "Semi-Longhair" | "Longhair" | "Hairless";
  groomingNeeds: "Low" | "Moderate" | "High";
  activityLevel: "Moderate" | "High" | "Calm";
  temperament: string[];
}

export const POPULAR_BREEDS: BreedData[] = [
  {
    id: "maine-coon",
    name: "Maine Coon",
    slug: "maine-coon",
    aliases: ["American Longhair", "Gentle Giant"],
    shortDescription:
      "One of the largest domestic cat breeds, characterized by a rugged shaggy coat, tufted ears, and a famously friendly temperament.",
    longDescription:
      "The Maine Coon is a majestic, rugged native North American cat breed renowned for its substantial physical scale and gentle demeanor. Adapted to survive harsh northeastern winters, it possesses a water-repellent double coat, large snowshoe paws with heavy tufting, and prominent lynx tips on its ears. Despite its imposing size, the Maine Coon is celebrated as a peaceful, dog-like companion that interacts warmly with families and other pets.",
    origin: "United States (Maine)",
    size: "Very Large",
    weightRange: "11 – 25 lbs (5 – 11.3 kg)",
    lifespan: "12 – 15 years",
    appearance: {
      coatLength: "Semi-Longhair",
      coatTexture: "Heavy, shaggy, uneven multi-layered coat with dense undercoat and glossy guard hairs",
      colors: ["Brown Tabby", "Black", "White", "Red Tabby", "Blue", "Silver Tabby"],
      patterns: ["Classic Tabby", "Mackerel Tabby", "Solid", "Bicolor", "Tortoiseshell"],
      earShape: "Large, tall, wide at base with pronounced lynx tipping and heavy inner furnishings",
      faceShape: "Medium-width head with square, boxy muzzle and high prominent cheekbones",
      eyeCharacteristics: "Large, slightly oval eyes with gentle oblique slant; shades of green, gold, or copper",
      bodyType: "Substantial / Large",
      tailCharacteristics: "Long, flowing plume-like tail as long as the torso, tapering to a bushy tip",
    },
    traits: {
      personality: ["Gentle", "Affectionate", "Intelligent", "Playful", "Sociable"],
      activityLevel: "Moderate",
      sociability: "Highly Affectionate",
      groomingLevel: "Moderate",
      vocalizationLevel: "Moderate",
    },
    care: {
      groomingFrequency: "2–3 times per week to prevent matting in the dense undercoat and belly ruff",
      exerciseNeeds: "Regular interactive play sessions with climbing trees suited for large frames",
      indoorSuitability: "Thrives indoors when provided with sturdy cat furniture and scratchers",
    },
    keyVisualIdentifiers: [
      "Tufted lynx tips on large ears with heavy inner furnishings",
      "Square, broad muzzle profile with distinct gentle nasal dip",
      "Heavy shaggy coat with prominent frontal chest ruff",
      "Long, bushy plume-like tail wrapped around body for warmth",
    ],
    similarBreeds: ["norwegian-forest-cat", "ragdoll", "american-shorthair"],
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80",
    badge: "Most Popular",
    faq: [
      {
        question: "How can I tell if my cat is a Maine Coon or a Domestic Longhair?",
        answer:
          "Look at muzzle shape and ear structure: true Maine Coons display a distinct square muzzle geometry and prominent lynx tufts. Random-bred Domestic Longhairs generally have rounded muzzles and less defined facial angles.",
      },
      {
        question: "Do Maine Coons require daily brushing?",
        answer:
          "While their coat is silky and less prone to matting than Persians, brushing two to three times weekly keeps their chest ruff and flank fur knot-free.",
      },
    ],
    coatLength: "Semi-Longhair",
    groomingNeeds: "Moderate",
    activityLevel: "Moderate",
    temperament: ["Gentle", "Affectionate", "Intelligent", "Playful"],
  },
  {
    id: "ragdoll",
    name: "Ragdoll",
    slug: "ragdoll",
    aliases: ["Puppy Cat", "Rag Doll"],
    shortDescription:
      "A docile, affectionate semi-longhair cat with striking blue eyes, plush rabbit-soft coat, and colorpoint markings.",
    longDescription:
      "Developed in California during the 1960s, the Ragdoll is legendary for its placid, trusting personality—frequently going limp in the arms of someone they love. Boasting a silky semi-longhair coat that lacks a dense woolly undercoat, Ragdolls produce minimal matting compared to other longhairs. Their striking sapphire-blue oval eyes and sweet expression make them an irresistible companion.",
    origin: "United States (California)",
    size: "Large",
    weightRange: "10 – 20 lbs (4.5 – 9 kg)",
    lifespan: "12 – 16 years",
    appearance: {
      coatLength: "Semi-Longhair",
      coatTexture: "Silky, plush, bunny-soft texture with minimal undercoat",
      colors: ["Seal", "Blue", "Chocolate", "Lilac", "Flame", "Cream"],
      patterns: ["Colorpoint", "Mitted", "Bicolor", "Lynx Point"],
      earShape: "Medium-sized with rounded tips, continuing the modified wedge line of the skull",
      faceShape: "Broad, modified wedge with flat plane between the ears",
      eyeCharacteristics: "Large, vivid oval eyes in deep expressive shades of blue",
      bodyType: "Substantial / Large",
      tailCharacteristics: "Long, bushy tail with moderate taper",
    },
    traits: {
      personality: ["Placid", "Affectionate", "Cuddly", "Trusting", "Quiet"],
      activityLevel: "Calm",
      sociability: "Highly Affectionate",
      groomingLevel: "Moderate",
      vocalizationLevel: "Quiet",
    },
    care: {
      groomingFrequency: "Gentle brushing once or twice a week due to low-matting coat structure",
      exerciseNeeds: "Enjoys low-impact floor play and gentle wand games; prefers staying close to ground",
      indoorSuitability: "Strictly indoor cats due to extremely trusting, non-defensive nature",
    },
    keyVisualIdentifiers: [
      "Vivid oval deep sapphire-blue eyes",
      "Silky coat without a dense woolly undercoat",
      "Colorpoint, mitted, or inverted 'V' bicolor mask pattern",
      "Substantial muscular build with soft, yielding body tone",
    ],
    similarBreeds: ["maine-coon", "birman", "siamese"],
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80",
    badge: "Gentle Giant",
    faq: [
      {
        question: "Why do Ragdolls go limp when picked up?",
        answer:
          "Ragdolls have an exceptionally relaxed muscle tone when they feel secure with their human caregivers, leading to their famous 'limp ragdoll' nickname.",
      },
      {
        question: "Do all Ragdolls have blue eyes?",
        answer:
          "Yes. According to official breed standards, purebred pointed Ragdolls must always display blue eyes.",
      },
    ],
    coatLength: "Semi-Longhair",
    groomingNeeds: "Moderate",
    activityLevel: "Calm",
    temperament: ["Placid", "Cuddly", "Affectionate", "Gentle"],
  },
  {
    id: "siamese",
    name: "Siamese",
    slug: "siamese",
    aliases: ["Meezer", "Traditional Siamese"],
    shortDescription:
      "A sleek, highly vocal and affectionate ancient breed featuring sharp color contrast points and brilliant blue almond eyes.",
    longDescription:
      "Originating from ancient Thailand (formerly Siam), the Siamese is one of the most recognizable and historic feline breeds. Renowned for their lean tubular body, distinctive dark extremities (points), and communicative nature, Siamese cats form profound social attachments with their owners and will vocalize their thoughts throughout the day.",
    origin: "Thailand",
    size: "Medium",
    weightRange: "6 – 14 lbs (2.7 – 6.4 kg)",
    lifespan: "15 – 20 years",
    appearance: {
      coatLength: "Shorthair",
      coatTexture: "Very short, fine, glossy, lying tight to the body",
      colors: ["Seal Point", "Chocolate Point", "Blue Point", "Lilac Point"],
      patterns: ["Colorpoint"],
      earShape: "Strikingly large, pointed, broad at the base continuing the wedge line",
      faceShape: "Fine wedge-shaped head with straight nose profile",
      eyeCharacteristics: "Almond-shaped with distinct oriental slant, brilliant deep blue",
      bodyType: "Foreign / Tubular",
      tailCharacteristics: "Long, thin, tapering to a fine point",
    },
    traits: {
      personality: ["Vocal", "Inquisitive", "Social", "Loyal", "Demanding"],
      activityLevel: "High",
      sociability: "Highly Affectionate",
      groomingLevel: "Low",
      vocalizationLevel: "Very Vocal",
    },
    care: {
      groomingFrequency: "Occasional brushing once a week; coat requires very little maintenance",
      exerciseNeeds: "High mental and physical stimulation; enjoys puzzle toys and interactive games",
      indoorSuitability: "Ideal for active indoor households where people are frequently present",
    },
    keyVisualIdentifiers: [
      "Dark color points on face, ears, tail, and paws",
      "Deep blue almond-shaped eyes with oriental slant",
      "Slender, tubular athletic body with fine boning",
      "Distinct wedge-shaped head with large flared ears",
    ],
    similarBreeds: ["oriental-shorthair", "balinese", "ragdoll"],
    imageUrl: "https://images.unsplash.com/photo-1513360309081-38f07627399e?auto=format&fit=crop&w=800&q=80",
    badge: "Most Vocal",
    faq: [
      {
        question: "Why are Siamese cats so vocal?",
        answer:
          "Siamese vocalization has been bred over centuries as a direct human-to-cat communication mechanism. Their raspy 'meow' closely mimics an infant's call to elicit response.",
      },
    ],
    coatLength: "Shorthair",
    groomingNeeds: "Low",
    activityLevel: "High",
    temperament: ["Vocal", "Social", "Inquisitive", "Loyal"],
  },
  {
    id: "persian",
    name: "Persian",
    slug: "persian",
    aliases: ["Persian Longhair", "Traditional Persian"],
    shortDescription:
      "A glamorous, quiet longhair cat recognized by its flat brachycephalic facial profile, round eyes, and opulent flowing coat.",
    longDescription:
      "The Persian is the aristocrat of cat breeds, celebrated globally for its quiet serenity, luxurious flowing double coat, and sweet pansy-like face. Originating in ancient Persia (modern-day Iran), this docile breed prefers calm, peaceful environments and enjoys long relaxing stretches on plush sofas.",
    origin: "Iran (Persia)",
    size: "Medium",
    weightRange: "7 – 12 lbs (3.2 – 5.5 kg)",
    lifespan: "12 – 17 years",
    appearance: {
      coatLength: "Longhair",
      coatTexture: "Extremely dense, flowing, full-length double coat with massive ruff",
      colors: ["White", "Black", "Blue", "Red", "Cream", "Silver", "Golden"],
      patterns: ["Solid", "Silver/Golden", "Smoke", "Tabby", "Particolor", "Bicolor"],
      earShape: "Small, rounded tips, set far apart and low on the skull",
      faceShape: "Round, broad skull with flattened brachycephalic muzzle and snub nose",
      eyeCharacteristics: "Large, round, wide-set with sweet open expression",
      bodyType: "Cobby",
      tailCharacteristics: "Short, bushy tail carried straight and low",
    },
    traits: {
      personality: ["Serene", "Sweet-tempered", "Quiet", "Gentle", "Placid"],
      activityLevel: "Calm",
      sociability: "Friendly",
      groomingLevel: "High",
      vocalizationLevel: "Quiet",
    },
    care: {
      groomingFrequency: "Daily 10–15 minute comb through to prevent severe matting, plus regular eye cleaning",
      exerciseNeeds: "Gentle daily play; prefers brief wand play followed by relaxation",
      indoorSuitability: "Strictly indoor breed requiring temperature-controlled environments",
    },
    keyVisualIdentifiers: [
      "Distinctive flat face profile (brachycephalic)",
      "Extremely dense, flowing full-length coat with thick undercoat",
      "Short, sturdy legs with compact rounded paws",
      "Small, rounded ears set low on skull",
    ],
    similarBreeds: ["exotic-shorthair", "british-shorthair", "birman"],
    imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
    badge: "Opulent Longhair",
    faq: [
      {
        question: "Do Persians require daily grooming?",
        answer:
          "Yes. Due to their long guard hairs and thick woolly undercoat, Persians must be combed daily with a stainless steel comb to prevent painful knots.",
      },
    ],
    coatLength: "Longhair",
    groomingNeeds: "High",
    activityLevel: "Calm",
    temperament: ["Serene", "Sweet-natured", "Quiet", "Gentle"],
  },
  {
    id: "bengal",
    name: "Bengal",
    slug: "bengal",
    aliases: ["Leopard Cat Hybrid", "Bengal Leopard"],
    shortDescription:
      "An athletic, high-energy breed notable for its wild leopard-like rosettes, glistening pelt, and muscular physique.",
    longDescription:
      "Created by crossing Asian Leopard Cats (Prionailurus bengalensis) with domestic cats, the Bengal offers the exotic appearance of a miniature jungle cat combined with the affectionate, reliable nature of a domestic feline. Highly athletic and famously fascinated by running water, Bengals love climbing to the highest vantage points in the home.",
    origin: "United States",
    size: "Medium",
    weightRange: "8 – 15 lbs (3.6 – 6.8 kg)",
    lifespan: "12 – 16 years",
    appearance: {
      coatLength: "Shorthair",
      coatTexture: "Dense, plush, silky-soft with distinctive iridescent 'glitter' sheen",
      colors: ["Brown Tabby", "Seal Lynx Point (Snow)", "Silver", "Charcoal"],
      patterns: ["Spotted Rosettes (Donut / Arrowhead)", "Marbled"],
      earShape: "Small to medium, rounded tips, wide base set back on head",
      faceShape: "Broad modified wedge with prominent whisker pads and broad nose",
      eyeCharacteristics: "Large, oval to round with black mascara markings",
      bodyType: "Medium",
      tailCharacteristics: "Medium length, thick, tapering to a rounded black tip",
    },
    traits: {
      personality: ["Energetic", "Curious", "Agile", "Water-loving", "Playful"],
      activityLevel: "Very High",
      sociability: "Social",
      groomingLevel: "Low",
      vocalizationLevel: "Moderate",
    },
    care: {
      groomingFrequency: "Weekly brushing; coat sheds very little and cleans easily",
      exerciseNeeds: "Requires extensive physical play, cat exercise wheels, and vertical climbing shelving",
      indoorSuitability: "Thrives indoors when provided with an enriched, stimulating environment",
    },
    keyVisualIdentifiers: [
      "High-contrast spotted rosettes or wild marbled swirl pattern",
      "Iridescent 'glitter' sheen on pelt reflecting light",
      "Athletic, muscular back legs slightly longer than front",
      "Broad modified wedge head with small rounded ears",
    ],
    similarBreeds: ["abyssinian", "siamese", "american-shorthair"],
    imageUrl: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=800&q=80",
    badge: "Exotic Rosettes",
    faq: [
      {
        question: "Do Bengal cats really like water?",
        answer:
          "Yes! Many Bengals inherit an affinity for water from their wild ancestors, frequently playing in sinks or stepping into showers.",
      },
    ],
    coatLength: "Shorthair",
    groomingNeeds: "Low",
    activityLevel: "High",
    temperament: ["Energetic", "Curious", "Agile", "Water-loving"],
  },
  {
    id: "british-shorthair",
    name: "British Shorthair",
    slug: "british-shorthair",
    aliases: ["British Blue", "English Shorthair"],
    shortDescription:
      "A stocky, easygoing feline famous for its round teddy-bear face, plush dense coat, and copper-colored eyes.",
    longDescription:
      "The British Shorthair is the pedigree version of the traditional British domestic cat. Recognized by its compact 'cobby' build, round cheeks, and thick, plush coat, this breed has a famously calm, quiet disposition. They are independent yet deeply loyal companions who prefer lounging beside you rather than being carried around.",
    origin: "United Kingdom",
    size: "Medium",
    weightRange: "7 – 17 lbs (3.2 – 7.7 kg)",
    lifespan: "12 – 17 years",
    appearance: {
      coatLength: "Shorthair",
      coatTexture: "Very dense, crisp, plush, like a thick wool rug",
      colors: ["Blue (Grey)", "Black", "White", "Red", "Cream", "Silver Tabby"],
      patterns: ["Solid", "Colorpoint", "Tabby", "Bicolor"],
      earShape: "Small, rounded at tips, set far apart to fit the round skull contour",
      faceShape: "Round, massive skull with chubby cheeks and sweet smiling muzzle",
      eyeCharacteristics: "Large, round, wide-open; iconic deep copper or amber",
      bodyType: "Cobby",
      tailCharacteristics: "Medium length, thick at base, slightly rounded at tip",
    },
    traits: {
      personality: ["Calm", "Independent", "Loyal", "Gentle", "Quiet"],
      activityLevel: "Calm",
      sociability: "Friendly",
      groomingLevel: "Low",
      vocalizationLevel: "Quiet",
    },
    care: {
      groomingFrequency: "Weekly brushing with a firm rubber or slicker brush to remove loose undercoat",
      exerciseNeeds: "Moderate play sessions; watch diet as their sedentary nature makes them prone to weight gain",
      indoorSuitability: "Exceptional indoor companion, well suited for apartments and working owners",
    },
    keyVisualIdentifiers: [
      "Compact, heavy 'cobby' body structure with short sturdy legs",
      "Chubby round cheeks and smiling muzzle profile",
      "Dense, crisp plush coat texture that parts over body curves",
      "Large, round expressive eyes (predominantly deep copper)",
    ],
    similarBreeds: ["scottish-fold", "russian-blue", "exotic-shorthair"],
    imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
    badge: "Teddy Bear",
    faq: [
      {
        question: "Are all British Shorthairs blue/grey?",
        answer:
          "While the 'British Blue' is the most iconic color, British Shorthairs come in dozens of colors and patterns, including black, white, cream, and silver tabby.",
      },
    ],
    coatLength: "Shorthair",
    groomingNeeds: "Low",
    activityLevel: "Calm",
    temperament: ["Calm", "Independent", "Loyal", "Quiet"],
  },
  {
    id: "scottish-fold",
    name: "Scottish Fold",
    slug: "scottish-fold",
    aliases: ["Fold", "Highland Fold (Longhair)"],
    shortDescription:
      "An owl-like sweet cat characterized by forward-folded ears, large round eyes, and a quiet, affectionate temperament.",
    longDescription:
      "First discovered in Perthshire, Scotland in 1961, the Scottish Fold is instantly recognizable by its unique folded ears, which cup forward against the head like an owl. Sweet-natured, quiet, and sociable, Folds often sit in human-like postures—such as the 'Buddha position' sitting up on their haunches.",
    origin: "Scotland",
    size: "Medium",
    weightRange: "6 – 13 lbs (2.7 – 5.9 kg)",
    lifespan: "11 – 15 years",
    appearance: {
      coatLength: "Shorthair",
      coatTexture: "Dense, plush, resilient coat standing slightly off the body",
      colors: ["All colors and shades"],
      patterns: ["Solid", "Tabby", "Bicolor", "Colorpoint"],
      earShape: "Tightly folded forward and downward against the head contour",
      faceShape: "Well-rounded skull with prominent whisker pads and sweet circular outline",
      eyeCharacteristics: "Large, very round, wide-open eyes separated by a broad nose",
      bodyType: "Medium",
      tailCharacteristics: "Medium to long, tapering, must be flexible",
    },
    traits: {
      personality: ["Sweet", "Calm", "Affectionate", "Inquisitive", "Quiet"],
      activityLevel: "Calm",
      sociability: "Friendly",
      groomingLevel: "Low",
      vocalizationLevel: "Quiet",
    },
    care: {
      groomingFrequency: "Brush 1–2 times weekly; inspect ear folds gently for cleanliness",
      exerciseNeeds: "Enjoys moderate puzzle toys and interactive wand chasing",
      indoorSuitability: "Excellent companion for indoor apartment and family life",
    },
    keyVisualIdentifiers: [
      "Forward-folded ears resting tight against skull",
      "Round owl-like head profile with large spherical eyes",
      "Plush dense coat texture",
      "Sitting up in comical 'Buddha' or prairie-dog stances",
    ],
    similarBreeds: ["british-shorthair", "american-shorthair", "devon-rex"],
    imageUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80",
    badge: "Owl Face",
    faq: [
      {
        question: "Are Scottish Fold kittens born with folded ears?",
        answer:
          "No. All Scottish Fold kittens are born with straight ears. The fold typically begins developing around 3 to 4 weeks of age in kittens carrying the gene.",
      },
    ],
    coatLength: "Shorthair",
    groomingNeeds: "Low",
    activityLevel: "Calm",
    temperament: ["Sweet", "Calm", "Affectionate", "Inquisitive"],
  },
  {
    id: "sphynx",
    name: "Sphynx",
    slug: "sphynx",
    aliases: ["Hairless Cat", "Canadian Hairless"],
    shortDescription:
      "A striking hairless cat known for its warm peach-fuzz skin, oversized bat-like ears, and extroverted, dog-like personality.",
    longDescription:
      "Originating in Toronto, Canada in 1966 from a natural genetic mutation, the Sphynx is famous for its lack of a traditional coat. Feeling like a warm chamois or fuzzy peach, Sphynx cats are surprisingly warm to the touch. They are extraordinarily extroverted, energetic, and heat-seeking companions that love sleeping under bed covers.",
    origin: "Canada",
    size: "Medium",
    weightRange: "6 – 12 lbs (2.7 – 5.4 kg)",
    lifespan: "12 – 16 years",
    appearance: {
      coatLength: "Hairless",
      coatTexture: "Fine downy peach-fuzz covering warm, wrinkled skin",
      colors: ["All color pigments (skin pigmentation mirrors coat color)"],
      patterns: ["Tabby", "Solid", "Bicolor", "Pointed"],
      earShape: "Extremely large, upright, bat-like, wide at base with rounded tips",
      faceShape: "Modified wedge with prominent cheekbones and distinct whisker break",
      eyeCharacteristics: "Large, lemon-shaped, wide-set with curious expressive gaze",
      bodyType: "Medium",
      tailCharacteristics: "Long, slender whiplike tail, sometimes with a tiny lion-like tuft at tip",
    },
    traits: {
      personality: ["Extroverted", "Cuddle-seeking", "Energetic", "Mischievous", "Loyal"],
      activityLevel: "High",
      sociability: "Highly Affectionate",
      groomingLevel: "High",
      vocalizationLevel: "Moderate",
    },
    care: {
      groomingFrequency: "Regular weekly sponge baths to remove natural skin oils, plus ear cleaning",
      exerciseNeeds: "High energy; loves heated cat beds, blankets, and active play",
      indoorSuitability: "Strictly indoor; must be protected from direct sunburn and winter drafts",
    },
    keyVisualIdentifiers: [
      "Apparent hairlessness with wrinkled chamois-like skin",
      "Oversized upright bat-like ears",
      "Lemon-shaped expressive eyes",
      "Potbellied round abdomen and athletic muscular limbs",
    ],
    similarBreeds: ["devon-rex", "siamese"],
    imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=800&q=80",
    badge: "Unique Hairless",
    faq: [
      {
        question: "Are Sphynx cats completely hairless?",
        answer:
          "Most Sphynx cats possess a very fine downy fuzz over their skin that feels similar to a ripe peach.",
      },
      {
        question: "Do Sphynx cats require baths?",
        answer:
          "Yes. Without fur to absorb natural body oils, Sphynx cats require gentle bathing every 1 to 2 weeks to keep their skin healthy.",
      },
    ],
    coatLength: "Hairless",
    groomingNeeds: "High",
    activityLevel: "High",
    temperament: ["Extroverted", "Cuddle-seeking", "Energetic", "Playful"],
  },
  {
    id: "norwegian-forest-cat",
    name: "Norwegian Forest Cat",
    slug: "norwegian-forest-cat",
    aliases: ["Wegie", "Norsk Skogkatt"],
    shortDescription:
      "A rugged, cold-adapted Scandinavian breed with an equilateral triangular head profile, tufted paws, and dense waterproof coat.",
    longDescription:
      "The Norwegian Forest Cat (or Skogkatt) is an ancient Scandinavian forest dweller steeped in Norse mythology. Built to endure harsh Nordic winters, it features a water-repellent topcoat over a dense woolly undercoat, heavy tufted paws, and an equilateral triangular head profile with a dead-straight nose line. Strong, independent, and gentle, they are legendary climbers.",
    origin: "Norway",
    size: "Large",
    weightRange: "9 – 18 lbs (4 – 8.2 kg)",
    lifespan: "12 – 16 years",
    appearance: {
      coatLength: "Semi-Longhair",
      coatTexture: "Dense, woolly undercoat with water-shedding glossy guard hairs",
      colors: ["All colors except pointed patterns"],
      patterns: ["Tabby", "Bicolor", "Solid", "Tortoiseshell"],
      earShape: "Medium to large, broad at base, lynx-tipped with long inner tufts",
      faceShape: "Equilateral triangular head profile with a perfectly straight nasal bridge (no stop)",
      eyeCharacteristics: "Large, almond-shaped, set at a slight oblique angle",
      bodyType: "Substantial / Large",
      tailCharacteristics: "Long, heavily bushy tail carried high, reaching at least to the neck",
    },
    traits: {
      personality: ["Independent", "Gentle", "Athletic", "Friendly", "Climber"],
      activityLevel: "Moderate",
      sociability: "Friendly",
      groomingLevel: "Moderate",
      vocalizationLevel: "Quiet",
    },
    care: {
      groomingFrequency: "Brush 2 times weekly; spring shedding requires daily attention",
      exerciseNeeds: "Enjoys tall scratching posts and sturdy vertical cat trees",
      indoorSuitability: "Adapts well indoors when provided with vertical territory to climb",
    },
    keyVisualIdentifiers: [
      "Equilateral triangular head profile with dead-straight nose bridge",
      "Almond eyes set at an oblique upward slant",
      "Thick double coat with distinct woolly undercoat and ruff",
      "Heavily tufted snowshoe paws and lynx-tipped ears",
    ],
    similarBreeds: ["maine-coon", "turkish-angora", "ragdoll"],
    imageUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80",
    badge: "Nordic Legend",
    faq: [
      {
        question: "How do I tell a Norwegian Forest Cat from a Maine Coon?",
        answer:
          "Look at the profile: Norwegian Forest Cats have an equilateral triangular head with a completely straight nose bridge. Maine Coons have a square boxy muzzle and a gentle dip in their nose curve.",
      },
    ],
    coatLength: "Semi-Longhair",
    groomingNeeds: "Moderate",
    activityLevel: "Moderate",
    temperament: ["Friendly", "Independent", "Athletic", "Curious"],
  },
  {
    id: "american-shorthair",
    name: "American Shorthair",
    slug: "american-shorthair",
    aliases: ["Domestic Shorthair Pedigree", "Silver Tabby"],
    shortDescription:
      "A versatile, robust working cat breed renowned for its hardy constitution, classic silver tabby coat, and adaptable nature.",
    longDescription:
      "Descended from mouser cats brought over on European ships (including the Mayflower) to protect cargo from rodents, the American Shorthair is a true working breed. Solidly built with a sweet expression and low-maintenance coat, this breed is adaptable, athletic, and famously healthy.",
    origin: "United States",
    size: "Medium",
    weightRange: "7 – 15 lbs (3.2 – 6.8 kg)",
    lifespan: "15 – 20 years",
    appearance: {
      coatLength: "Shorthair",
      coatTexture: "Short, thick, dense and hard in texture to resist weather and briars",
      colors: ["Silver Tabby (iconic)", "Brown Tabby", "Black", "White", "Blue", "Red"],
      patterns: ["Classic Tabby", "Mackerel Tabby", "Solid", "Bicolor", "Tortoiseshell"],
      earShape: "Medium size, slightly rounded tips, set not too wide apart",
      faceShape: "Slightly longer than broad with full cheeks and medium square muzzle",
      eyeCharacteristics: "Large, wide, upper lid shaped like half an almond, lower lid rounded",
      bodyType: "Medium",
      tailCharacteristics: "Medium length, heavy at base, tapering to an abrupt blunt tip",
    },
    traits: {
      personality: ["Adaptable", "Gentle", "Good mouser", "Calm", "Friendly"],
      activityLevel: "Moderate",
      sociability: "Friendly",
      groomingLevel: "Low",
      vocalizationLevel: "Quiet",
    },
    care: {
      groomingFrequency: "Weekly brushing removes loose hairs and maintains natural pelt shine",
      exerciseNeeds: "Regular interactive play; monitor portions to prevent sedentary weight gain",
      indoorSuitability: "Exceptionally suited for family life, children, and multi-pet homes",
    },
    keyVisualIdentifiers: [
      "Muscular, squarely proportioned athletic build",
      "Distinctive classic bullseye tabby pattern on flanks",
      "Full cheeks with sweet, open facial expression",
      "Crisp, hard-textured dense short coat",
    ],
    similarBreeds: ["british-shorthair", "bengal", "maine-coon"],
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    badge: "All-American",
    faq: [
      {
        question: "Is an American Shorthair just a domestic moggy?",
        answer:
          "No. While domestic shorthairs are mixed-breed cats without pedigrees, the American Shorthair is a registered purebred with standardized anatomical conformation and consistent temperament.",
      },
    ],
    coatLength: "Shorthair",
    groomingNeeds: "Low",
    activityLevel: "Moderate",
    temperament: ["Adaptable", "Gentle", "Calm", "Friendly"],
  },
  {
    id: "abyssinian",
    name: "Abyssinian",
    slug: "abyssinian",
    aliases: ["Aby", "Bunny Cat"],
    shortDescription:
      "A lithe, highly athletic feline with a ticked agouti coat resembling wild rabbits, large ears, and an insatiable curiosity.",
    longDescription:
      "The Abyssinian is one of the oldest known cat breeds, often compared to depictions of ancient Egyptian feline deities. Featuring a warm, ticked agouti coat where each individual hair contains multiple bands of pigmentation, the 'Aby' is an athlete that never sits still, perpetually exploring cupboards, perches, and doorframes.",
    origin: "Southeast Asia / Ethiopia",
    size: "Medium",
    weightRange: "6 – 10 lbs (2.7 – 4.5 kg)",
    lifespan: "12 – 15 years",
    appearance: {
      coatLength: "Shorthair",
      coatTexture: "Fine, silky, dense, lying close with distinctive agouti ticking",
      colors: ["Ruddy (Usual)", "Sorrel (Cinnamon)", "Blue", "Fawn"],
      patterns: ["Ticked Agouti (4–6 dark bands per hair shaft)"],
      earShape: "Large, alert, cupped forward at base as if constantly listening",
      faceShape: "Modified wedge head with soft contours and gentle brow dip",
      eyeCharacteristics: "Large, almond-shaped, circled by fine dark mascara line; green or gold",
      bodyType: "Semi-Foreign",
      tailCharacteristics: "Long, slender, tapering to a pointed dark tip",
    },
    traits: {
      personality: ["Curious", "Athletic", "Extroverted", "Playful", "Agile"],
      activityLevel: "Very High",
      sociability: "Social",
      groomingLevel: "Low",
      vocalizationLevel: "Quiet",
    },
    care: {
      groomingFrequency: "Occasional rubdown with a damp cloth or weekly soft brushing",
      exerciseNeeds: "Requires abundant vertical climbing towers and puzzle toys",
      indoorSuitability: "Best suited for households wanting a lively, acrobatic feline companion",
    },
    keyVisualIdentifiers: [
      "Ticked agouti coat with warm radiant undercoat tones",
      "Large alert cupped ears set wide on head",
      "Almond eyes with dark mascara eyeliner and pale surrounding fur",
      "Slender, athletic, arching neck and lithe body",
    ],
    similarBreeds: ["bengal", "siamese", "devon-rex"],
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80",
    badge: "Agouti Athlete",
    faq: [
      {
        question: "What is a 'ticked' coat?",
        answer:
          "A ticked coat means each individual hair strand has alternating bands of dark and light pigmentation, creating an iridescent shimmering effect like a wild hare.",
      },
    ],
    coatLength: "Shorthair",
    groomingNeeds: "Low",
    activityLevel: "High",
    temperament: ["Curious", "Athletic", "Extroverted", "Playful"],
  },
  {
    id: "birman",
    name: "Birman",
    slug: "birman",
    aliases: ["Sacred Cat of Burma"],
    shortDescription:
      "A mystical, semi-longhair pointed cat distinguished by pure white 'gloves' on all four paws and serene sapphire-blue eyes.",
    longDescription:
      "Steeped in temple folklore from Myanmar (Burma), the Sacred Cat of Burma is famous for its harmonious golden-mist coat, colorpoint extremities, and trademark pure white paws known as 'gloves' and 'laces'. With a soft chirping voice and sweet, devoted disposition, Birmans are adored for their tranquil companionship.",
    origin: "Myanmar (Burma) / France",
    size: "Medium",
    weightRange: "7 – 14 lbs (3.2 – 6.4 kg)",
    lifespan: "12 – 16 years",
    appearance: {
      coatLength: "Semi-Longhair",
      coatTexture: "Silky, single coat with heavy neck ruff that does not mat easily",
      colors: ["Seal Point", "Blue Point", "Chocolate Point", "Lilac Point"],
      patterns: ["Colorpoint with White Gloves"],
      earShape: "Medium size, set with good width between them",
      faceShape: "Broad, rounded skull with Roman arched nose and strong chin",
      eyeCharacteristics: "Deep, vivid sapphire blue, almost round in shape",
      bodyType: "Medium",
      tailCharacteristics: "Medium length, bushy, carried proudly over back",
    },
    traits: {
      personality: ["Gentle", "Quiet", "Devoted", "Patient", "Sweet"],
      activityLevel: "Moderate",
      sociability: "Highly Affectionate",
      groomingLevel: "Moderate",
      vocalizationLevel: "Quiet",
    },
    care: {
      groomingFrequency: "Brush 1–2 times weekly; lacking thick undercoat, coat resists tangling",
      exerciseNeeds: "Enjoys quiet interactive play and relaxing with family members",
      indoorSuitability: "Ideal indoor house cat, gentle with children and other pets",
    },
    keyVisualIdentifiers: [
      "Pure white symmetrical 'gloves' on all four front and back paws",
      "Deep sapphire-blue nearly round eyes",
      "Silky golden-toned body coat with darker point contrast",
      "Roman arched nose profile with strong jawline",
    ],
    similarBreeds: ["ragdoll", "siamese", "persian"],
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80",
    badge: "Sacred Gloves",
    faq: [
      {
        question: "How do Birmans differ from Ragdolls?",
        answer:
          "Birmans are generally smaller and more compact than Ragdolls, possess a Roman nose with no flat stop, and must strictly display pure white gloves on all paws.",
      },
    ],
    coatLength: "Semi-Longhair",
    groomingNeeds: "Moderate",
    activityLevel: "Moderate",
    temperament: ["Gentle", "Quiet", "Devoted", "Patient"],
  },
  {
    id: "russian-blue",
    name: "Russian Blue",
    slug: "russian-blue",
    aliases: ["Archangel Blue", "Foreign Blue"],
    shortDescription:
      "An aristocratic, shimmering silver-tipped blue cat with luminous emerald-green eyes and a quiet, shy-then-devoted nature.",
    longDescription:
      "Hailing from the port of Arkhangelsk in northern Russia, the Russian Blue is famous for its dense double coat of shimmering slate blue tipped with silver. Combined with vivid emerald-green eyes and a gentle upturned mouth that creates a perpetual smile, this breed is quiet, intelligent, and deeply devoted to its chosen people.",
    origin: "Russia (Arkhangelsk)",
    size: "Medium",
    weightRange: "7 – 12 lbs (3.2 – 5.4 kg)",
    lifespan: "15 – 20 years",
    appearance: {
      coatLength: "Shorthair",
      coatTexture: "Dense, plush double coat standing out from body; silver-tipped guard hairs",
      colors: ["Uniform solid slate blue with silver tipping"],
      patterns: ["Solid"],
      earShape: "Large, pointed, wide at base, set high on the skull with thin skin",
      faceShape: "Smooth modified wedge head with distinctive flat skull plane and smiling mouth",
      eyeCharacteristics: "Vivid, luminous emerald-green eyes, round and set wide apart",
      bodyType: "Semi-Foreign",
      tailCharacteristics: "Long, tapering, in proportion to body",
    },
    traits: {
      personality: ["Reserved", "Devoted", "Intelligent", "Gentle", "Quiet"],
      activityLevel: "Moderate",
      sociability: "Friendly",
      groomingLevel: "Low",
      vocalizationLevel: "Quiet",
    },
    care: {
      groomingFrequency: "Brush weekly to maintain plush double coat and remove loose hair",
      exerciseNeeds: "Enjoys quiet games of fetch, laser toys, and high perches",
      indoorSuitability: "Flourishes in tranquil, predictable indoor environments",
    },
    keyVisualIdentifiers: [
      "Shimmering silver tipping on uniform slate-blue double coat",
      "Vivid emerald-green eyes",
      "Slight upturned mouth corners giving a gentle 'Mona Lisa smile'",
      "Cobblestone-textured double coat that leaves track marks when stroked",
    ],
    similarBreeds: ["british-shorthair", "siamese"],
    imageUrl: "https://images.unsplash.com/photo-1513360309081-38f07627399e?auto=format&fit=crop&w=800&q=80",
    badge: "Silver Sheen",
    faq: [
      {
        question: "Do Russian Blues produce fewer allergens?",
        answer:
          "While no cat is 100% hypoallergenic, many owners report fewer reactions because Russian Blues naturally produce lower levels of the Fel d 1 protein.",
      },
    ],
    coatLength: "Shorthair",
    groomingNeeds: "Low",
    activityLevel: "Moderate",
    temperament: ["Reserved", "Devoted", "Intelligent", "Gentle"],
  },
  {
    id: "devon-rex",
    name: "Devon Rex",
    slug: "devon-rex",
    aliases: ["Pixie Cat", "Poodle Cat"],
    shortDescription:
      "A mischievous, elfin feline featuring rippling wavy fur, oversized butterfly ears, and an exuberant, clown-like personality.",
    longDescription:
      "Discovered in Devonshire, England in 1959, the Devon Rex is affectionately dubbed the 'pixie' or 'alien' cat due to its oversized ears, high cheekbones, and short, rippling wavy fur. Endlessly playful and affectionate, Devons perch on human shoulders and purr loudly into your ear.",
    origin: "United Kingdom (Devon)",
    size: "Small",
    weightRange: "5 – 10 lbs (2.3 – 4.5 kg)",
    lifespan: "12 – 15 years",
    appearance: {
      coatLength: "Shorthair",
      coatTexture: "Fine, soft, short wavy coat with ripples (rexing)",
      colors: ["All colors and patterns"],
      patterns: ["Solid", "Tabby", "Colorpoint", "Bicolor"],
      earShape: "Enormous, butterfly-like, set very low on skull with wide flared bases",
      faceShape: "Short modified wedge with prominent cheekbones and strong whisker break",
      eyeCharacteristics: "Large, oval, set wide with an inquisitive elfin expression",
      bodyType: "Semi-Foreign",
      tailCharacteristics: "Long, fine, tapering, covered in short wavelets",
    },
    traits: {
      personality: ["Mischievous", "Playful", "Shoulder-sitter", "Loving", "Clownish"],
      activityLevel: "Very High",
      sociability: "Highly Affectionate",
      groomingLevel: "Low",
      vocalizationLevel: "Moderate",
    },
    care: {
      groomingFrequency: "Very gentle grooming with a soft chamois; avoid harsh brushing that breaks delicate curls",
      exerciseNeeds: "Extremely high need for climbing, chasing, and interactive attention",
      indoorSuitability: "Indoor only; their light wavy coat makes them sensitive to cold drafts",
    },
    keyVisualIdentifiers: [
      "Rippled wavy coat texture ('rexing')",
      "Oversized butterfly ears set low on skull",
      "Elfin triangular facial profile with high cheekbones",
      "Short crinkled whiskers and delicate frame",
    ],
    similarBreeds: ["sphynx", "abyssinian", "scottish-fold"],
    imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=800&q=80",
    badge: "Elfin Wave",
    faq: [
      {
        question: "Is the Devon Rex coat the same as the Cornish Rex?",
        answer:
          "No. The Devon Rex mutation is genetically distinct from the Cornish Rex. Devons have guard hairs and a looser wave, whereas Cornish coats have no guard hairs.",
      },
    ],
    coatLength: "Shorthair",
    groomingNeeds: "Low",
    activityLevel: "High",
    temperament: ["Mischievous", "Playful", "Loving", "Clownish"],
  },
  {
    id: "exotic-shorthair",
    name: "Exotic Shorthair",
    slug: "exotic-shorthair",
    aliases: ["Lazy Man's Persian", "Shorthaired Persian"],
    shortDescription:
      "A cuddly, round teddy-bear breed that shares the sweet face and calm personality of a Persian with an easy-care short plush coat.",
    longDescription:
      "Developed to create a shorthaired version of the Persian, the Exotic Shorthair possesses the exact same brachycephalic flat muzzle, chubby cheeks, and calm personality, but in an easy-to-maintain plush short coat. Nicknamed 'the lazy man's Persian', it offers luxury looks without daily coat combing.",
    origin: "United States",
    size: "Medium",
    weightRange: "7 – 13 lbs (3.2 – 5.9 kg)",
    lifespan: "12 – 15 years",
    appearance: {
      coatLength: "Shorthair",
      coatTexture: "Thick, plush, dense, standing out from the body due to undercoat density",
      colors: ["All colors and patterns recognized in Persians"],
      patterns: ["Solid", "Tabby", "Colorpoint", "Bicolor", "Chinchilla"],
      earShape: "Small, rounded at tips, set far apart and low on the skull",
      faceShape: "Round, massive skull with flat brachycephalic muzzle and snub nose",
      eyeCharacteristics: "Large, round, wide-set with brilliant glowing color (copper/green/blue)",
      bodyType: "Cobby",
      tailCharacteristics: "Short, thick, carried low without a curve",
    },
    traits: {
      personality: ["Sweet", "Quiet", "Cuddly", "Easygoing", "Peaceful"],
      activityLevel: "Calm",
      sociability: "Highly Affectionate",
      groomingLevel: "Low",
      vocalizationLevel: "Quiet",
    },
    care: {
      groomingFrequency: "Brush 1–2 times weekly; wipe facial folds gently to keep skin clean",
      exerciseNeeds: "Brief play sessions with balls or feather wands; prefers lounging",
      indoorSuitability: "Outstanding apartment and indoor companion",
    },
    keyVisualIdentifiers: [
      "Flat brachycephalic face with snub nose set between round eyes",
      "Dense, plush short coat standing out like velvet",
      "Heavy cobby body with short stout legs",
      "Chubby rounded cheeks and sweet disposition",
    ],
    similarBreeds: ["persian", "british-shorthair"],
    imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
    badge: "Plush Teddy",
    faq: [
      {
        question: "Why is the Exotic Shorthair called 'the lazy man's Persian'?",
        answer:
          "Because they carry the same sweet flat-faced look and gentle personality of the Persian, but their short coat requires only weekly brushing rather than daily detangling.",
      },
    ],
    coatLength: "Shorthair",
    groomingNeeds: "Low",
    activityLevel: "Calm",
    temperament: ["Sweet", "Quiet", "Cuddly", "Easygoing"],
  },
  {
    id: "turkish-angora",
    name: "Turkish Angora",
    slug: "turkish-angora",
    aliases: ["Ankara Cat", "Angora"],
    shortDescription:
      "An ancient, ballerina-like semi-longhair cat with a shimmering silky coat, plumed tail, and playful, intelligent nature.",
    longDescription:
      "Hailing from the Ankara region of central Turkey, the Turkish Angora is an ancient natural breed considered a national treasure in its homeland. Built with the grace of a ballerina, it features a shimmering, silky semi-longhair coat that flows as it moves, along with large almond eyes that are often odd-colored (one blue, one amber).",
    origin: "Turkey (Ankara)",
    size: "Medium",
    weightRange: "5 – 10 lbs (2.3 – 4.5 kg)",
    lifespan: "12 – 18 years",
    appearance: {
      coatLength: "Semi-Longhair",
      coatTexture: "Silky, fine, single coat with no undercoat, shimmering in movement",
      colors: ["Pure White (traditional)", "Black", "Blue", "Red", "Cream", "Silver Tabby"],
      patterns: ["Solid", "Tabby", "Bicolor", "Smoke"],
      earShape: "Large, pointed, tufted, set high and close together on the skull",
      faceShape: "Small to medium modified wedge head with smooth lines",
      eyeCharacteristics: "Large, almond-shaped, slightly slanted upward; often odd-eyed",
      bodyType: "Semi-Foreign",
      tailCharacteristics: "Long, heavily plumed, tapering tail carried upright like a feather",
    },
    traits: {
      personality: ["Graceful", "Intelligent", "Playful", "Social", "Determined"],
      activityLevel: "High",
      sociability: "Highly Affectionate",
      groomingLevel: "Low",
      vocalizationLevel: "Moderate",
    },
    care: {
      groomingFrequency: "Brush 1–2 times weekly; single coat rarely mats",
      exerciseNeeds: "Enjoys vigorous jumping, fetching small toys, and climbing high",
      indoorSuitability: "Wonderful indoor companion that loves being involved in household activities",
    },
    keyVisualIdentifiers: [
      "Silky single coat with no undercoat that ripples with movement",
      "Full flowing plume-like tail carried high",
      "Large pointed ears set close and high on skull",
      "Slender, graceful ballerina-like bone structure",
    ],
    similarBreeds: ["norwegian-forest-cat", "maine-coon", "siamese"],
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80",
    badge: "Ballerina Cat",
    faq: [
      {
        question: "Are all Turkish Angoras white?",
        answer:
          "While the pure white Turkish Angora is the historic national symbol of Turkey, the breed now comes in many colors including black, blue, and tabby.",
      },
    ],
    coatLength: "Semi-Longhair",
    groomingNeeds: "Low",
    activityLevel: "High",
    temperament: ["Graceful", "Intelligent", "Playful", "Social"],
  },
];

// Curated Comparison Registry (Pairs of genuine high-interest matchups)
export interface CuratedComparison {
  slugA: string;
  slugB: string;
  title: string;
  highlightDifference: string;
}

export const CURATED_COMPARISONS: CuratedComparison[] = [
  {
    slugA: "maine-coon",
    slugB: "norwegian-forest-cat",
    title: "Maine Coon vs. Norwegian Forest Cat",
    highlightDifference: "Muzzle Shape (Square boxy vs. Equilateral triangular) & Ear size",
  },
  {
    slugA: "maine-coon",
    slugB: "ragdoll",
    title: "Maine Coon vs. Ragdoll",
    highlightDifference: "Eye Color & Conformation (Sapphire pointed vs. Shaggy tabby giant)",
  },
  {
    slugA: "siamese",
    slugB: "ragdoll",
    title: "Siamese vs. Ragdoll",
    highlightDifference: "Coat Length & Energy (Sleek vocal athlete vs. Placid cuddly semi-longhair)",
  },
  {
    slugA: "british-shorthair",
    slugB: "persian",
    title: "British Shorthair vs. Persian",
    highlightDifference: "Coat Care & Facial Structure (Low-maintenance teddy vs. Opulent longhair)",
  },
  {
    slugA: "bengal",
    slugB: "abyssinian",
    title: "Bengal vs. Abyssinian",
    highlightDifference: "Pelt Pattern (Wild spotted rosettes vs. Fine ticked agouti fur)",
  },
  {
    slugA: "ragdoll",
    slugB: "birman",
    title: "Ragdoll vs. Birman",
    highlightDifference: "White Mittens & Scale (Large floppy frame vs. Medium temple cat with strict gloves)",
  },
  {
    slugA: "sphynx",
    slugB: "devon-rex",
    title: "Sphynx vs. Devon Rex",
    highlightDifference: "Coat Presence (Warm chamois down vs. Rippled curly rexed fur)",
  },
  {
    slugA: "russian-blue",
    slugB: "british-shorthair",
    title: "Russian Blue vs. British Shorthair",
    highlightDifference: "Body Geometry & Eyes (Emerald lithe athlete vs. Heavy copper-eyed cobby build)",
  },
  {
    slugA: "persian",
    slugB: "exotic-shorthair",
    title: "Persian vs. Exotic Shorthair",
    highlightDifference: "Coat Length & Maintenance (Flowing longhair vs. Low-maintenance plush shorthair)",
  },
  {
    slugA: "scottish-fold",
    slugB: "british-shorthair",
    title: "Scottish Fold vs. British Shorthair",
    highlightDifference: "Ear Structure & Silhouette (Forward-folded owl ears vs. Open rounded upright ears)",
  },
];

// Helper Functions
export function getBreedById(id: string): BreedData | undefined {
  const normalized = id.toLowerCase().replace(/_/g, "-").trim();
  return POPULAR_BREEDS.find(
    (b) => b.id.toLowerCase() === normalized || b.slug.toLowerCase() === normalized
  );
}

export function getBreedBySlug(slug: string): BreedData | undefined {
  const normalized = slug.toLowerCase().trim();
  return POPULAR_BREEDS.find((b) => b.slug.toLowerCase() === normalized);
}

export function getBreedSlug(breedNameOrId: string): string {
  const match = getBreedById(breedNameOrId);
  if (match) return match.slug;
  return breedNameOrId.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function getAllBreedSlugs(): string[] {
  return POPULAR_BREEDS.map((b) => b.slug);
}

export function getSimilarBreeds(slug: string): BreedData[] {
  const breed = getBreedBySlug(slug);
  if (!breed) return [];
  return breed.similarBreeds
    .map((s) => getBreedBySlug(s))
    .filter((b): b is BreedData => b !== undefined);
}

export function isValidComparison(slugA: string, slugB: string): boolean {
  if (slugA === slugB) return false;
  const a = getBreedBySlug(slugA);
  const b = getBreedBySlug(slugB);
  return a !== undefined && b !== undefined;
}

export function getComparisonPair(comparisonParam: string): { breedA: BreedData; breedB: BreedData } | null {
  const parts = comparisonParam.split("-vs-");
  if (parts.length !== 2) return null;
  const [slugA, slugB] = parts;
  const breedA = getBreedBySlug(slugA);
  const breedB = getBreedBySlug(slugB);
  if (!breedA || !breedB || breedA.id === breedB.id) return null;
  return { breedA, breedB };
}
