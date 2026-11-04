import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { buildSeoMeta } from "@/lib/seo";
import { images } from "@/lib/images";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

// 12 Modular Solution Components
import { SolutionHero } from "@/components/solutions/SolutionHero";
import { ProblemSection } from "@/components/solutions/ProblemSection";
import { SolutionOverview } from "@/components/solutions/SolutionOverview";
import { WorkflowDiagram } from "@/components/solutions/WorkflowDiagram";
import { FeatureGrid } from "@/components/solutions/FeatureGrid";
import { TechnicalArchitecture } from "@/components/solutions/TechnicalArchitecture";
import { TechnologyStack } from "@/components/solutions/TechnologyStack";
import { DashboardPreview } from "@/components/solutions/DashboardPreview";
import { IndustryApplications } from "@/components/solutions/IndustryApplications";
import { ROICalculator } from "@/components/solutions/ROICalculator";
import { CaseStudySection } from "@/components/solutions/CaseStudySection";
import { SolutionInquiryForm } from "@/components/solutions/SolutionInquiryForm";
import { CtaBanner } from "@/components/common/CtaBanner";

export const Route = createFileRoute("/solutions/smart-waste-collection-robot")({
  head: () =>
    buildSeoMeta({
      title: "Smart Waste Collection Robot | Autonomous AI Sanitation | INDUS Robotics",
      description:
        "An intelligent robotic waste collection system designed to identify, classify and collect garbage automatically using computer vision, smart sensing and autonomous navigation.",
      path: "/solutions/smart-waste-collection-robot",
      ogType: "article",
    }),
  component: SmartWasteSolutionPage,
});

function SmartWasteSolutionPage() {
  const { openModal } = useModals();

  useEffect(() => {
    trackDigitalPresence(
      "solution_view",
      "Smart Waste Collection Robot",
      "/solutions/smart-waste-collection-robot"
    );
    trackClarityEvent("smart_waste_robot_view");
  }, []);

  const scrollToEnquiry = () => {
    const el = document.getElementById("solution-inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRequestDemo = () => {
    trackClarityEvent("request_demo_click");
    trackDigitalPresence(
      "demo_request",
      "Smart Waste Collection Robot",
      "/solutions/smart-waste-collection-robot"
    );
    openModal("demo", {
      productName: "Smart Waste Collection Robot",
      categoryName: "Intelligent Robotics Solutions",
      initialMessage:
        "Requesting an on-site or virtual demonstration of the INDUS Smart Waste Collection Robot system.",
    });
  };

  const handleDownloadBrochure = () => {
    trackClarityEvent("download_brochure_click");
    trackDigitalPresence(
      "brochure_download",
      "Smart Waste Collection Robot Spec Sheet",
      "/solutions/smart-waste-collection-robot"
    );
    openModal("quote", {
      productName: "Smart Waste Collection Robot - Technical Whitepaper & CAD",
      categoryName: "Technical Documentation",
      initialMessage:
        "Requesting technical datasheet, CAD models, and architectural specifications for the Smart Waste Collection Robot.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* SECTION 1: HERO */}
      <SolutionHero
        badge="Intelligent Robotics Solution 01"
        standardsBadge="ISO 3691-4 · CE Functional Safety"
        headline="AI-Powered Smart Waste Management"
        headlineAccent="Autonomous Robotic System"
        description="An intelligent robotic waste collection system designed to identify, classify and collect garbage automatically using computer vision, smart sensing and autonomous navigation."
        robotImage={images.mobileModule}
        robotImageAlt="INDUS Autonomous Smart Waste Collection Robot"
        onRequestDemo={handleRequestDemo}
        onDownloadBrochure={handleDownloadBrochure}
        onContactEngineer={scrollToEnquiry}
        keySpecs={[
          { label: "AI Classification", value: "94.6%", unit: "accuracy" },
          { label: "Pick Cycle", value: "2.8", unit: "sec / item" },
          { label: "Chamber Volume", value: "120", unit: "liters" },
          { label: "Safety Level", value: "ISO 3691-4", unit: "compliant" },
        ]}
      />

      {/* SECTION 2: INDUSTRY CHALLENGES */}
      <ProblemSection />

      {/* SECTION 3: SOLUTION OVERVIEW */}
      <SolutionOverview />

      {/* SECTION 4: HOW IT WORKS (8-STAGE PIPELINE) */}
      <WorkflowDiagram />

      {/* SECTION 5: KEY FEATURES */}
      <FeatureGrid />

      {/* SECTION 6: TECHNICAL ARCHITECTURE (9 LAYERS) */}
      <TechnicalArchitecture />

      {/* SECTION 7: TECHNOLOGY STACK */}
      <TechnologyStack />

      {/* SECTION 8: DASHBOARD SHOWCASE (SIMULATED TELEMETRY) */}
      <DashboardPreview />

      {/* SECTION 9: INDUSTRY APPLICATIONS */}
      <IndustryApplications />

      {/* SECTION 10: ROI CALCULATOR */}
      <ROICalculator />

      {/* SECTION 11: CASE STUDY */}
      <CaseStudySection />

      {/* SECTION 12: INQUIRY FORM */}
      <SolutionInquiryForm
        solutionId="smart-waste-collection-robot"
        solutionTitle="Smart Waste Collection Robot"
      />

      {/* GLOBAL ENTERPRISE CTA BANNER */}
      <CtaBanner
        headline="Ready to Automate Facility Sanitation?"
        description="Connect directly with an INDUS robotics engineer to conduct a preliminary ground survey and receive custom CAD blueprints for your site."
        primaryCtaText="Schedule Site Survey"
        secondaryCtaText="Download Full Technical Spec"
        onPrimaryClick={scrollToEnquiry}
        onSecondaryClick={handleDownloadBrochure}
      />
    </div>
  );
}
export default SmartWasteSolutionPage;
