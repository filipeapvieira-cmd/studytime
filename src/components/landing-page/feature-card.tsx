import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative p-5 md:p-6 rounded-xl border border-neutral-800 bg-neutral-900/50",
        "hover:border-neutral-600 transition-all duration-300",
      )}
    >
      <div
        className={cn(
          "w-9 h-9 md:w-11 md:h-11 rounded-lg flex items-center justify-center mb-3 md:mb-4",
          "bg-neutral-800 group-hover:bg-neutral-700 transition-colors duration-300",
        )}
      >
        <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
      </div>

      <h3 className="text-base md:text-lg font-semibold text-white mb-1.5 md:mb-2">
        {title}
      </h3>

      <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;
