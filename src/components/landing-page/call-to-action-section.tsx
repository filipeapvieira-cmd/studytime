import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";

function CallToActionSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl mt-7">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-30"></div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 backdrop-blur-sm">
        <div className="text-center md:text-left mb-8 md:mb-0 md:mr-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-gradient-x pb-1">
            Ready to elevate your study game?
          </h2>
          <p className="text-xl text-blue-100 max-w-xl">
            Join thousands of students who have transformed their study habits
            with StudyJournal
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <Link href="/auth/register">
              Start Free Trial
              <Rocket className="ml-2 h-5 w-5 animate-pulse" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-purple-400 text-purple-400 hover:bg-purple-400/10 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Watch Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
}

export default CallToActionSection;
