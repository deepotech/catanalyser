import * as React from "react";
import { getSiteUrl } from "@/lib/config/site";

export function JsonLdSchemas() {
  const siteUrl = getSiteUrl();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "CatAnalyzer",
    url: siteUrl,
    description:
      "AI-powered cat breed identification and sound interpretation to help you understand your cat.",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/cat-breeds?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "CatAnalyzer",
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description:
      "AI-assisted feline phenotype identification and bioacoustic analysis platform.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
