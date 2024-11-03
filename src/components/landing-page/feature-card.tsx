import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClasses: ColorClasses;
};

type ColorClasses = {
  shadow: string;
  bgGradient: string;
  hoverBgGradient: string;
  iconBase: string;
  iconHover: string;
  titleHover: string;
};

function FeatureCard({
  icon: Icon,
  title,
  description,
  colorClasses,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "bg-black border-none overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col",
        colorClasses.shadow
      )}
    >
      <CardContent
        className={cn(
          "p-6 relative flex-grow flex flex-col",
          colorClasses.bgGradient
        )}
      >
        <div className="relative z-10 flex flex-col h-full">
          <Icon
            className={cn(
              "h-12 w-12 mb-4 relative z-10 transition-all duration-300 group-hover:scale-110",
              colorClasses.iconBase,
              colorClasses.iconHover
            )}
          />
          <h3
            className={cn(
              "text-xl font-bold mb-2 text-white relative z-10 transition-colors duration-300",
              colorClasses.titleHover
            )}
          >
            {title}
          </h3>
          <p className="text-gray-300 relative z-10 group-hover:text-gray-100 transition-colors duration-300 flex-grow">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default FeatureCard;
