import { SITE_URL, STATIC_SITEMAP_ROUTES } from "@/lib/seo";

export default function sitemap() {
  const lastModified = new Date();

  return STATIC_SITEMAP_ROUTES.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.includes("Mehndi") || path.includes("Attendant") ? 0.9 : 0.7,
  }));
}
