import * as React from "react";
import { HOMEPAGE_FAQS } from "@/lib/data/faq";
import { getSiteUrl } from "@/lib/config/site";

export function JsonLdSchemas() {
  const siteUrl = getSiteUrl();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CatAnalyzer",
    url: siteUrl,
    description:
      "AI-powered cat breed identification and sound interpretation to help you understand your cat.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/cat-breeds?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CatAnalyzer AI Breed Identifier",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "AI visual cat breed identification",
      "Phenotypic trait explanation",
      "Mixed-breed lineage estimation",
      "Cat sound behavioral interpretation",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOMEPAGE_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
