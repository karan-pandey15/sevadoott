import { DEFAULT_DESCRIPTION, SITE_URL } from "@/lib/seo";

export const metadata = {
  title: "Search Local Services",
  description: `Search Sevadoot — your local service app for mehndi artist booking, elder care, senior citizen assistance, hospital visit helper, and more. ${DEFAULT_DESCRIPTION}`,
  alternates: { canonical: "/pages/SearchScreen" },
  openGraph: {
    url: `${SITE_URL}/pages/SearchScreen`,
    title: "Search Services | Sevadoot",
    description: DEFAULT_DESCRIPTION,
  },
};

export default function SearchLayout({ children }) {
  return children;
}
