import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JsonLdSchemas } from "@/components/seo/json-ld";
import { getSiteUrl } from "@/lib/config/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "What Breed Is My Cat? AI Cat Breed Identifier & Translator | CatAnalyzer",
  description:
    "Upload a cat photo to discover likely breed matches with AI. Explore visual trait explanations, mixed-breed lineage insights, and experimental cat sound interpretations.",
  keywords: [
    "what breed is my cat",
    "cat breed identifier",
    "cat breed identifier by picture",
    "what type of cat is this",
    "cat scanner online",
    "cat translator",
    "cat sound interpreter",
    "understand your cat",
  ],
  authors: [{ name: "CatAnalyzer Team" }],
  creator: "CatAnalyzer",
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "What Breed Is My Cat? AI Cat Breed Identifier | CatAnalyzer",
    description:
      "Upload a photo to discover your cat's most likely breed matches with AI visual trait analysis.",
    url: "/",
    siteName: "CatAnalyzer",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Breed Is My Cat? AI Cat Breed Identifier | CatAnalyzer",
    description:
      "Discover your cat's likely breed matches, physical trait reasons, and sound interpretations with CatAnalyzer.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "hWLvtAuu3_Fw34M8oZ3d58t6Ib80zWDvfRWUen3TM90",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JBMCS7E43Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-JBMCS7E43Z');
          `}
        </Script>
        <JsonLdSchemas />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
