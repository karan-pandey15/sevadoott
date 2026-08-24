import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalStructuredData from "@/components/seo/GlobalStructuredData";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SEO_KEYWORDS,
  SITE_URL,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  themeColor: "#1898A5",
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Sevadoot",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Sevadoot Premium Services", url: SITE_URL }],
  creator: "Sevadoot",
  publisher: "Sevadoot Premium Services",
  applicationName: "Sevadoot",
  category: "Home Services",
  icons: {
    icon: "/favicon.ico",
    apple: "/image/sevadoot.png",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Sevadoot",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/image/sevadoot.png",
        width: 800,
        height: 600,
        alt: "Sevadoot - Trusted Home Service Marketplace",
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
  verification: {
    // Add tokens from Google Search Console when available:
    // google: "your-google-verification-code",
  },
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Surat",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href={SITE_URL} />
      </head>
      <body
        className={`${poppins.className} ${poppins.variable} ${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-[#F8F9FA]`}
      >
        <GlobalStructuredData />
        <ReduxProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
