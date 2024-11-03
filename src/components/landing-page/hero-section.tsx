import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function HeroSection() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
        Unleash your study potential now
      </h1>
      <p className="text-xl md:text-2xl text-gray-400 mb-8">
        Transform the way you study and keep track of your notes with our
        intelligent journaling platform
      </p>
      <Link
        className={`text-lg px-8 ${buttonVariants({ size: "lg" })}`}
        href="/auth/register"
      >
        Get Started Free <ArrowRight className="ml-2" />
      </Link>
    </div>
  );
}

export default HeroSection;
