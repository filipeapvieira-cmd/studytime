import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VIDEO_URL = "https://www.youtube.com/watch?v=65Ic3AZkqKI";

function CallToActionSection() {
  return (
    <div className="relative rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8 text-center">
      <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-white">
        Ready to elevate your study game?
      </h2>

      <p className="text-neutral-400 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
        Join thousands of students who have transformed their study habits
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          size="sm"
          className="bg-white text-black hover:bg-neutral-200 px-5 md:px-6 md:h-10 md:text-sm transition-all duration-300"
          asChild
        >
          <Link href="/auth/register">Start Free Trial</Link>
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white px-5 md:px-6 md:h-10 md:text-sm transition-all duration-300"
          asChild
        >
          <Link href={VIDEO_URL} target="_blank">
            Watch Demo
            <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default CallToActionSection;
