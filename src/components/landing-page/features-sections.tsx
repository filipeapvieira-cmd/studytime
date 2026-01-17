import FeatureCard from "./feature-card";
import { Clock, BookOpen, BarChart2 } from "lucide-react";

function FeaturesSection() {
  const features = [
    {
      icon: Clock,
      title: "Time Tracking",
      description:
        "Track your study sessions and analyze time allocation per subject",
    },
    {
      icon: BookOpen,
      title: "Smart Journaling",
      description:
        "Find notes and information without sifting through files",
    },
    {
      icon: BarChart2,
      title: "Insightful Analytics",
      description:
        "Gain valuable insights into your study patterns",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4 md:gap-5 mb-10 md:mb-12">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
}

export default FeaturesSection;
