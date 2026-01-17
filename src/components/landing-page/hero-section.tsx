import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function HeroSection() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12 relative">
      {/* Subtle glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-5 tracking-tight text-white">
        Unlock Better{" "}
        <span className="text-blue-400">Study Habits</span>
      </h1>

      <p className="text-base md:text-lg lg:text-xl text-neutral-400 mb-6 md:mb-8 max-w-xl mx-auto leading-relaxed">
        Organize your notes, track your achievements, and stay motivated with
        our intelligent journaling platform.
      </p>

      <Link
        className={`${buttonVariants({ size: "default" })} px-6 md:px-8 md:py-6 md:text-base bg-white text-black hover:bg-neutral-200 transition-all duration-300`}
        href="/auth/register"
      >
        Get Started Free
        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
      </Link>
    </div>
  );
}

export default HeroSection;
