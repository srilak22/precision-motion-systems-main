import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { buildSeoMeta } from "@/lib/seo";
import { images } from "@/lib/images";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

// 10 User-Specified Core Sections
import { WasteHero } from "@/components/solutions/smart-waste/WasteHero";
import { WasteProblemStatement } from "@/components/solutions/smart-waste/WasteProblemStatement";
import { WasteSolutionOverview } from "@/components/solutions/smart-waste/WasteSolutionOverview";
import { WasteHowItWorks } from "@/components/solutions/smart-waste/WasteHowItWorks";
import { WasteTechStack } from "@/components/solutions/smart-waste/WasteTechStack";
import { WasteKeyFeatures } from "@/components/solutions/smart-waste/WasteKeyFeatures";
import { WasteArchitectureDiagram } from "@/components/solutions/smart-waste/WasteArchitectureDiagram";
import { WasteProjectResults } from "@/components/solutions/smart-waste/WasteProjectResults";
import { WasteGallery } from "@/components/solutions/smart-waste/WasteGallery";
import { WasteFutureEnhancements } from "@/components/solutions/smart-waste/WasteFutureEnhancements";

// Supplementary ROI & Inquiry Forms
import { ROICalculator } from "@/components/solutions/ROICalculator";
import { SolutionInquiryForm } from "@/components/solutions/SolutionInquiryForm";
import { CtaBanner } from "@/components/common/CtaBanner";

export const Route = createFileRoute("/solutions/smart-waste-collection-robot")({
  head: () =>
    buildSeoMeta({
      title: "Smart Waste Collection Robot | Autonomous AI Sanitation | INDUS Robotics",
      description:
        "An Autonomous Robot for Intelligent Waste Detection, Collection, and Segregation.",
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

  const scrollToInquiry = () => {
    const el = document.getElementById("solution-inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWatchDemo = () => {
    trackClarityEvent("watch_demo_click");
    trackDigitalPresence(
      "demo_video_watch",
      "Smart Waste Collection Robot Video",
      "/solutions/smart-waste-collection-robot"
    );
    openModal("demo", {
      productName: "Smart Waste Collection Robot",
      categoryName: "Autonomous CleanTech Robotics",
      initialMessage:
        "Requesting full technical demonstration recording and field telemetry trial video.",
    });
  };

  const handleProjectReport = () => {
    trackClarityEvent("project_report_click");
    trackDigitalPresence(
      "report_download",
      "Smart Waste Collection Robot Project Report",
      "/solutions/smart-waste-collection-robot"
    );
    openModal("quote", {
      productName: "Smart Waste Collection Robot - Full Project Report & Architecture Specs",
      categoryName: "Technical Documentation",
      initialMessage:
        "Requesting full engineering project report, hardware BOM, and YOLOv8 accuracy validation logs.",
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      {/* 1. HERO SECTION (Top Banner with Particles, Title, Tagline, 3 Buttons & Robot Image) */}
      <WasteHero
        onWatchDemo={handleWatchDemo}
        onProjectReport={handleProjectReport}
        robotImage={images.smartWasteRobot}
      />

      {/* 2. PROBLEM STATEMENT SECTION (Why Do We Need It? 3 Cards) */}
      <WasteProblemStatement />

      {/* 3. SOLUTION OVERVIEW (Center Robot Image with 4 Surrounding Node Icons & Checklist) */}
      <WasteSolutionOverview robotImage={images.smartWasteRobot} />

      {/* 4. HOW IT WORKS (Color-Coded 6-Stage Flowchart) */}
      <WasteHowItWorks />

      {/* 5. TECHNOLOGY STACK (Hardware vs Software Cards with Tech Badges) */}
      <WasteTechStack />

      {/* 6. KEY FEATURES SECTION (6 Feature Cards with Hover Lift & Glow) */}
      <WasteKeyFeatures />

      {/* 7. ROBOT ARCHITECTURE DIAGRAM (Professional Layout with Colorful Arrows & Icons) */}
      <WasteArchitectureDiagram />

      {/* 8. PROJECT RESULTS (Animated Metric Counters: 95%, 90%, 40%, 30%) */}
      <WasteProjectResults />

      {/* 9. GALLERY SECTION (4 Grid Cards: Prototype, Mechanism, Assembly, Field Testing) */}
      <WasteGallery />

      {/* 10. FUTURE ENHANCEMENTS (Timeline Cards: Solar, Smart Bin, AI Route, Swarm, Mobile App) */}
      <WasteFutureEnhancements />

      {/* INTERACTIVE ROI & ECONOMIC CALCULATOR */}
      <ROICalculator />

      {/* LEAD CAPTURE & TECHNICAL PROPOSAL INQUIRY FORM */}
      <SolutionInquiryForm
        solutionId="smart-waste-collection-robot"
        solutionTitle="Smart Waste Collection Robot"
      />

      {/* ENTERPRISE CTA BANNER */}
      <CtaBanner
        headline="Ready to Deploy Autonomous Waste Robotics?"
        description="Connect directly with an INDUS robotics architect to evaluate your campus or facility and conduct an on-site feasibility survey."
        primaryCtaText="Request On-Site Survey"
        secondaryCtaText="Download Project Report"
        onPrimaryClick={scrollToInquiry}
        onSecondaryClick={handleProjectReport}
      />
    </div>
  );
}

export default SmartWasteSolutionPage;
