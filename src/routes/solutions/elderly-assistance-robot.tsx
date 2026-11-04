import { createFileRoute } from "@tanstack/react-router";
import { ElderlyHero } from "@/components/solutions/elderly-robot/ElderlyHero";
import { ElderlyProblems } from "@/components/solutions/elderly-robot/ElderlyProblems";
import { ElderlySolutionOverview } from "@/components/solutions/elderly-robot/ElderlySolutionOverview";
import { ElderlyHowItWorks } from "@/components/solutions/elderly-robot/ElderlyHowItWorks";
import { ElderlyTechStack } from "@/components/solutions/elderly-robot/ElderlyTechStack";
import { ElderlyKeyFeatures } from "@/components/solutions/elderly-robot/ElderlyKeyFeatures";
import { ElderlyArchitectureDiagram } from "@/components/solutions/elderly-robot/ElderlyArchitectureDiagram";
import { ElderlyProjectResults } from "@/components/solutions/elderly-robot/ElderlyProjectResults";
import { ElderlyGallery } from "@/components/solutions/elderly-robot/ElderlyGallery";
import { ElderlyFutureEnhancements } from "@/components/solutions/elderly-robot/ElderlyFutureEnhancements";
import { SolutionInquiryForm } from "@/components/solutions/SolutionInquiryForm";
import { CtaBanner } from "@/components/common/CtaBanner";
import { images } from "@/lib/images";

export const Route = createFileRoute("/solutions/elderly-assistance-robot")({
  component: ElderlyAssistanceRobotPage,
  head: () => ({
    meta: [
      {
        title: "Elderly Assistance Robot | CareCompanion Robotics | INDUS",
      },
      {
        name: "description",
        content:
          "Autonomous elderly companion and assistance robot with fall detection, scheduled pill dispensing, and 24/7 family emergency telemetry.",
      },
    ],
  }),
});

function ElderlyAssistanceRobotPage() {
  const scrollToInquiry = () => {
    const el = document.getElementById("solution-inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      {/* 1. Hero */}
      <ElderlyHero
        robotImage={images.elderlyRobot}
        onProjectReport={scrollToInquiry}
      />

      {/* 2. Problem Statement */}
      <ElderlyProblems />

      {/* 3. Solution Overview */}
      <ElderlySolutionOverview />

      {/* 4. How It Works Flowchart */}
      <ElderlyHowItWorks />

      {/* 5. Technology Stack */}
      <ElderlyTechStack />

      {/* 6. Key Features */}
      <ElderlyKeyFeatures />

      {/* 7. Architecture Diagram */}
      <ElderlyArchitectureDiagram />

      {/* 8. Project Results */}
      <ElderlyProjectResults />

      {/* 9. Gallery */}
      <ElderlyGallery />

      {/* 10. Future Enhancements */}
      <ElderlyFutureEnhancements />

      {/* Enterprise Inquiry Form */}
      <section id="solution-inquiry-section" className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <SolutionInquiryForm
            solutionName="Elderly Assistance Robot"
            solutionCategory="Healthcare & Assistive Companion Robotics"
          />
        </div>
      </section>

      {/* CTA Banner */}
      <CtaBanner
        headline="Empower Senior Independence with Autonomous Care"
        description="Connect with our healthcare robotics team to schedule a live demonstration or pilot program for your care community."
        ctaPrimary={{
          label: "Request Care Pilot",
          href: "/contact?topic=elderly-robot-demo",
        }}
        ctaSecondary={{
          label: "Download Clinical Brochure",
          href: "/contact?topic=elderly-robot-specs",
        }}
      />
    </div>
  );
}
