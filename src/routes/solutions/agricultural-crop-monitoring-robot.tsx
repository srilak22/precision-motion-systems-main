import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { buildSeoMeta } from "@/lib/seo";
import { images } from "@/lib/images";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

// 10 User-Specified Core Sections for Agricultural Crop Monitoring Robot
import { AgriHero } from "@/components/solutions/agri-robot/AgriHero";
import { AgriProblems } from "@/components/solutions/agri-robot/AgriProblems";
import { AgriSolutionOverview } from "@/components/solutions/agri-robot/AgriSolutionOverview";
import { AgriHowItWorks } from "@/components/solutions/agri-robot/AgriHowItWorks";
import { AgriTechStack } from "@/components/solutions/agri-robot/AgriTechStack";
import { AgriKeyFeatures } from "@/components/solutions/agri-robot/AgriKeyFeatures";
import { AgriArchitectureDiagram } from "@/components/solutions/agri-robot/AgriArchitectureDiagram";
import { AgriProjectResults } from "@/components/solutions/agri-robot/AgriProjectResults";
import { AgriGallery } from "@/components/solutions/agri-robot/AgriGallery";
import { AgriFutureEnhancements } from "@/components/solutions/agri-robot/AgriFutureEnhancements";

// Supplementary Lead Capture & Call-to-Action
import { SolutionInquiryForm } from "@/components/solutions/SolutionInquiryForm";
import { CtaBanner } from "@/components/common/CtaBanner";

export const Route = createFileRoute("/solutions/agricultural-crop-monitoring-robot")({
  head: () =>
    buildSeoMeta({
      title: "Agricultural Crop Monitoring Robot | AI Precision Farming | INDUS Robotics",
      description:
        "An AI-Powered Autonomous Field Robot for Crop Health, Disease Detection, and Precision Agriculture.",
      path: "/solutions/agricultural-crop-monitoring-robot",
      ogType: "article",
    }),
  component: AgriSolutionPage,
});

function AgriSolutionPage() {
  const { openModal } = useModals();

  useEffect(() => {
    trackDigitalPresence(
      "solution_view",
      "Agricultural Crop Monitoring Robot",
      "/solutions/agricultural-crop-monitoring-robot"
    );
    trackClarityEvent("agri_crop_robot_view");
  }, []);

  const scrollToInquiry = () => {
    const el = document.getElementById("solution-inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWatchDemo = () => {
    trackClarityEvent("agri_watch_demo_click");
    trackDigitalPresence(
      "demo_video_watch",
      "Agricultural Crop Monitoring Robot Demo",
      "/solutions/agricultural-crop-monitoring-robot"
    );
    openModal("demo", {
      productName: "Agricultural Crop Monitoring Robot",
      categoryName: "Precision Agriculture Robotics",
      initialMessage:
        "Requesting a recorded field demonstration and trial data on leaf disease detection accuracy.",
    });
  };

  const handleProjectReport = () => {
    trackClarityEvent("agri_report_click");
    trackDigitalPresence(
      "report_download",
      "Agricultural Crop Monitoring Agritech Report",
      "/solutions/agricultural-crop-monitoring-robot"
    );
    openModal("quote", {
      productName: "Agricultural Crop Monitoring Robot",
      categoryName: "Agritech Documentation",
      initialMessage:
        "Requesting comprehensive agritech project report, multispectral camera specs, and chemical reduction trial metrics.",
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      {/* 1. HERO SECTION */}
      <AgriHero
        onWatchDemo={handleWatchDemo}
        onProjectReport={handleProjectReport}
        robotImage={images.agriRobot}
      />

      {/* 2. PROBLEM STATEMENT SECTION (Why Do We Need It? 3 Cards) */}
      <AgriProblems />

      {/* 3. SOLUTION OVERVIEW (Center Robot Image with 4 Surrounding Nodes & Checklist) */}
      <AgriSolutionOverview robotImage={images.agriRobot} />

      {/* 4. HOW IT WORKS (Color-Coded 6-Stage Flowchart) */}
      <AgriHowItWorks />

      {/* 5. TECHNOLOGY STACK (Hardware vs Software Cards) */}
      <AgriTechStack />

      {/* 6. KEY FEATURES SECTION (6 Feature Cards with Hover Lift & Glow) */}
      <AgriKeyFeatures />

      {/* 7. ROBOT ARCHITECTURE DIAGRAM (Professional Layout with Colorful Arrows & Icons) */}
      <AgriArchitectureDiagram />

      {/* 8. PROJECT RESULTS (Animated Metric Counters: 96%, 45%, 60%, 3.5x) */}
      <AgriProjectResults />

      {/* 9. GALLERY SECTION (4 Grid Cards) */}
      <AgriGallery />

      {/* 10. FUTURE ENHANCEMENTS (Timeline Cards: Micro-Spraying, Solar Dock, Swarm, Drone, App) */}
      <AgriFutureEnhancements />

      {/* LEAD CAPTURE & FIELD TRIAL INQUIRY FORM */}
      <section id="solution-inquiry-section" className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <SolutionInquiryForm
            solutionName="Agricultural Crop Monitoring Robot"
            solutionCategory="Precision Agriculture Robotics"
          />
        </div>
      </section>

      {/* ENTERPRISE CTA BANNER */}
      <CtaBanner
        headline="Ready to Protect Your Crop Yield with Precision Robotics?"
        description="Connect directly with an INDUS agricultural robotics specialist to evaluate field trials, row-crop navigation, and chemical reduction ROI."
        ctaPrimary={{
          label: "Request Agritech Field Survey",
          href: "/contact?topic=agri-survey",
        }}
        ctaSecondary={{
          label: "Download Agritech Spec Sheet",
          href: "/contact?topic=agri-specs",
        }}
      />
    </div>
  );
}

export default AgriSolutionPage;
