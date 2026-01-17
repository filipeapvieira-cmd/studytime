import HeroSection from "@/components/landing-page/hero-section";
import FeaturesSection from "@/components/landing-page/features-sections";
import CallToActionSection from "@/components/landing-page/call-to-action-section";

export default async function HomePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-4 md:py-6 flex flex-col justify-center flex-1 overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <CallToActionSection />
    </main>
  );
}
