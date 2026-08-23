import HomePageClient from "./HomePageClient";
import JsonLd from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SEO_KEYWORDS,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";

export const metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Sevadoot Premium Services", url: SITE_URL }],
  creator: "Sevadoot",
  publisher: "Sevadoot Premium Services",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: "Sevadoot",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/image/sevadoot.png",
        width: 800,
        height: 600,
        alt: "Sevadoot - Home Service Booking App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/image/sevadoot.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Home Services",
  applicationName: "Sevadoot",
};

export default function Home() {
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl("/#webpage"),
    url: absoluteUrl("/"),
    name: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
  };

  return (
    <>
      <JsonLd data={homePageSchema} />
      <HomePageClient />
    </>
  );
}
