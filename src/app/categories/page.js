import BannerComponent from "@/components/HeaderScreen/BannerComponent";
import CategoryScreen from "@/components/HeaderScreen/CategoryScreen";
import CategorySlider from "@/components/HeaderScreen/Categoryslider";

export const metadata = {
  title: "All Categories | Sevadoot",
  description: "Explore all Sevadoot service categories in one place.",
};

/** Only these categories navigate; others do nothing on click. */
const CLICKABLE_SLIDER_IDS = ["mehndi", "Attendant"]; // Elder Care Companion
const CLICKABLE_GRID_IDS = ["mehndi", "seniorCareCompanion"]; // Elder Care Companion

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="w-full md:hidden" aria-label="Service categories carousel">
        <CategorySlider clickableIds={CLICKABLE_SLIDER_IDS} />
      </section>

      <section className="w-full" aria-label="Promotional banners">
        <BannerComponent />
      </section>

      <section className="py-8 md:py-16" aria-label="Browse all service categories">
        <CategoryScreen mode="full" clickableIds={CLICKABLE_GRID_IDS} />
      </section>
    </main>
  );
}
