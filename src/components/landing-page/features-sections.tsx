import FeatureCard from "./feature-card";
import { Clock, BookOpen, BarChart2 } from "lucide-react";

function FeaturesSection() {
  const features = [
    {
      icon: Clock,
      title: "Time Tracking",
      description:
        "Track your study sessions effortlessly and analyze your time allocation per subject",
      colorClasses: {
        shadow: "hover:shadow-blue-500/20",
        bgGradient: "bg-gradient-to-br from-blue-900/30 to-blue-600/30",
        hoverBgGradient:
          "bg-gradient-to-br from-blue-500/20 to-blue-300/20 group-hover:opacity-100",
        iconBase: "text-blue-400",
        iconHover: "group-hover:text-blue-300",
        titleHover: "group-hover:text-blue-200",
      },
    },
    {
      icon: BookOpen,
      title: "Smart Journaling",
      description:
        "Document your learning journey with our intuitive journaling system",
      colorClasses: {
        shadow: "hover:shadow-purple-500/20",
        bgGradient: "bg-gradient-to-br from-purple-900/30 to-purple-600/30",
        hoverBgGradient:
          "bg-gradient-to-br from-purple-500/20 to-purple-300/20 group-hover:opacity-100",
        iconBase: "text-purple-400",
        iconHover: "group-hover:text-purple-300",
        titleHover: "group-hover:text-purple-200",
      },
    },
    {
      icon: BarChart2,
      title: "Insightful Analytics",
      description:
        "Gain valuable insights into your study patterns and progress",
      colorClasses: {
        shadow: "hover:shadow-green-500/20",
        bgGradient: "bg-gradient-to-br from-green-900/30 to-green-600/30",
        hoverBgGradient:
          "bg-gradient-to-br from-green-500/20 to-green-300/20 group-hover:opacity-100",
        iconBase: "text-green-400",
        iconHover: "group-hover:text-green-300",
        titleHover: "group-hover:text-green-200",
      },
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
}

export default FeaturesSection;
