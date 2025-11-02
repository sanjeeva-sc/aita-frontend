import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import {
  BarChart3,
  Brain,
  Clock,
  FileText,
  Puzzle,
  TrendingUp,
} from "lucide-react";

export function CoreFeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Creation",
      description:
        "Generate quizzes, tests, and practice sets instantly from your teaching content.",
    },
    {
      icon: Clock,
      title: "Time-Saving Automation",
      description:
        "Spend minutes, not hours, preparing assessments and grading.",
    },
    {
      icon: FileText,
      title: "Multi-Format Support",
      description:
        "Upload PDFs, videos, or notes — AITA understands and converts them all.",
    },
    {
      icon: BarChart3,
      title: "Instant Feedback & Insights",
      description:
        "View student performance analytics and identify key learning gaps.",
    },
    {
      icon: Puzzle,
      title: "University-Ready Integrations",
      description:
        "Works with major LMS platforms like Moodle, Blackboard, and Canvas.",
    },
    {
      icon: TrendingUp,
      title: "Continuous Improvement",
      description:
        "AITA learns from your usage — making each quiz smarter over time.",
    },
  ];

  return (
    <section className="bg-foreground section-padding-y " id="core-features">
      <div className="container-padding-x container max-w-7xl mx-auto flex flex-col gap-10 md:gap-12">
        <div className="section-title-gap-lg mx-auto flex max-w-2xl flex-col items-center text-center">
          <Tagline variant="white">WHY TEACHERS AND STUDENTS LOVE AITA</Tagline>
          <h2 className="heading-lg text-white">
            Everything you need to create, assess, and learn — all in one place.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex flex-col gap-4">
                <div className="bg-primary bg-opacity-0 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                  <IconComponent className="text-foreground h-6 w-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-semibold text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
