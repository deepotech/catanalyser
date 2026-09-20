export interface FAQItem {
  question: string;
  answer: string;
}

export const HOMEPAGE_FAQS: FAQItem[] = [
  {
    question: "How accurate is AI cat breed identification from a single photo?",
    answer:
      "Our AI visual model analyzes distinctive phenotypic characteristics such as coat density, pattern, ear tufts, muzzle geometry, and eye shape. However, because over 90% of household cats are domestic random-bred cats (Domestic Shorthair or Longhair) sharing ancestry across multiple lineages, image-based identification serves as an educated morphological estimate rather than a DNA test.",
  },
  {
    question: "What if my cat is a mixed-breed or rescue cat?",
    answer:
      "Mixed-breed cats are the heart of CatAnalyzer! When analyzing a mixed-breed cat, our system identifies the predominant ancestral physical traits and explains which breeds likely influenced your cat's appearance, rather than falsely forcing a single purebred classification.",
  },
  {
    question: "How does the Cat Translator / Sound Interpreter work?",
    answer:
      "The Cat Translator examines acoustic parameters—such as pitch inflection, burst duration, cadence, and frequency contours—combined with observational context (e.g., waiting near food, asking for door access). It suggests likely contextual communication intents based on feline bioacoustic studies, avoiding false claims that cats possess human-like grammar.",
  },
  {
    question: "What photo provides the best breed identification result?",
    answer:
      "For highest accuracy, upload a well-lit, clear photo showing your cat's full face and torso from a front or 3/4 angle. Avoid heavy filters, extreme blur, or shots where critical features like ears and body profile are hidden.",
  },
  {
    question: "Are user-uploaded photos or audio files kept private?",
    answer:
      "Yes. Photos and audio files are analyzed securely on the server and are not shared with public feeds or sold to third-party data brokers. In development mode, mock analyses run locally within your session.",
  },
  {
    question: "Can CatAnalyzer diagnose illness or pain in my cat?",
    answer:
      "No. CatAnalyzer is strictly an informational and educational tool. It does not provide veterinary diagnosis. If your cat exhibits abnormal vocalizing, lethargy, sudden behavioral shifts, or distress, please consult a licensed veterinarian promptly.",
  },
];
