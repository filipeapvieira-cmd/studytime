import HeroSection from "@/components/landing-page/hero-section";
import FeaturesSection from "@/components/landing-page/features-sections";
import CallToActionSection from "@/components/landing-page/call-to-action-section";

export default async function HomePage() {
  return (
    <main className="max-w-6xl md:min-w-[1000px] w-4/5 mx-auto px-4 py-16 md:py-24 flex flex-col justify-center flex-1">
      <HeroSection />
      <FeaturesSection />
      <CallToActionSection />
    </main>
  );
}
