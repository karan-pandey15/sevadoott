import { SITE_URL } from "@/lib/seo";

export const metadata = {
  title: "Mehndi Artist Booking",
  description:
    "Book professional mehndi artist booking on Sevadoot — bridal, Arabic, and party designs with verified artists at your doorstep.",
  keywords: [
    "mehndi artist booking",
    "mehndi artist near me",
    "bridal mehndi booking",
    "sevadoot mehndi",
  ],
  alternates: { canonical: "/pages/Mehndi" },
  openGraph: {
    url: `${SITE_URL}/pages/Mehndi`,
    title: "Mehndi Artist Booking | Sevadoot",
  },
};

export default function MehndiLayout({ children }) {
  return children;
}
