import { createFileRoute } from "@tanstack/react-router";
import { RailwayHero } from "@/components/solutions/railway-robot/RailwayHero";
import { RailwayProblems } from "@/components/solutions/railway-robot/RailwayProblems";
import { RailwaySolutionOverview } from "@/components/solutions/railway-robot/RailwaySolutionOverview";
import { RailwayHowItWorks } from "@/components/solutions/railway-robot/RailwayHowItWorks";
import { RailwayTechStack } from "@/components/solutions/railway-robot/RailwayTechStack";
import { RailwayKeyFeatures } from "@/components/solutions/railway-robot/RailwayKeyFeatures";
import { RailwayArchitectureDiagram } from "@/components/solutions/railway-robot/RailwayArchitectureDiagram";
import { RailwayProjectResults } from "@/components/solutions/railway-robot/RailwayProjectResults";
import { RailwayGallery } from "@/components/solutions/railway-robot/RailwayGallery";
import { RailwayFutureEnhancements } from "@/components/solutions/railway-robot/RailwayFutureEnhancements";
import { SolutionInquiryForm } from "@/components/solutions/SolutionInquiryForm";
import { CtaBanner } from "@/components/common/CtaBanner";
import { images } from "@/lib/images";

export const Route = createFileRoute("/solutions/railway-track-inspection-robot")({
  component: RailwayTrackInspectionRobotPage,
  head: () => ({
    meta: [
      {
        title: "Railway Track Inspection Robot | INDUS Robotics",
      },
      {
        name: "description",
        content:
          "Autonomous railway track inspection robot with line-scan cameras, ultrasonic flaw detection, and real-time GIS defect mapping.",
      },
    ],
  }),
});

function RailwayTrackInspectionRobotPage() {
  const scrollToInquiry = () => {
    const el = document.getElementById("solution-inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      {/* 1. Hero */}
      <RailwayHero
        robotImage={images.railwayRobot}
        onProjectReport={scrollToInquiry}
      />

      {/* 2. Problem Statement */}
      <RailwayProblems />

      {/* 3. Solution Overview */}
      <RailwaySolutionOverview />

      {/* 4. How It Works Flowchart */}
      <RailwayHowItWorks />

      {/* 5. Technology Stack */}
      <RailwayTechStack />

      {/* 6. Key Features */}
      <RailwayKeyFeatures />

      {/* 7. Architecture Diagram */}
      <RailwayArchitectureDiagram />

      {/* 8. Project Results */}
      <RailwayProjectResults />

      {/* 9. Gallery */}
      <RailwayGallery />

      {/* 10. Future Enhancements */}
      <RailwayFutureEnhancements />

      {/* Enterprise Inquiry Form */}
      <section id="solution-inquiry-section" className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <SolutionInquiryForm
            solutionName="Railway Track Inspection Robot"
            solutionCategory="Infrastructure & Transit Safety Robotics"
          />
        </div>
      </section>

      {/* CTA Banner */}
      <CtaBanner
        headline="Deploy Autonomous Railway Safety Inspections Today"
        description="Schedule a trackside proof-of-concept or integrate with your rail network's existing enterprise asset management system."
        ctaPrimary={{
          label: "Request Trackside Demo",
          href: "/contact?topic=railway-demo",
        }}
        ctaSecondary={{
          label: "Download Rail Spec Sheet",
          href: "/contact?topic=railway-specs",
        }}
      />
    </div>
  );
}
