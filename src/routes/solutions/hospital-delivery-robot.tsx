import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { buildSeoMeta } from "@/lib/seo";
import { images } from "@/lib/images";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

// 12 Clinical Solution Components
import { SolutionHero } from "@/components/solutions/SolutionHero";
import { HospitalProblems } from "@/components/solutions/hospital-robot/HospitalProblems";
import { HospitalOverview } from "@/components/solutions/hospital-robot/HospitalOverview";
import { HospitalWorkflow } from "@/components/solutions/hospital-robot/HospitalWorkflow";
import { HospitalFeatures } from "@/components/solutions/hospital-robot/HospitalFeatures";
import { HospitalArchitecture } from "@/components/solutions/hospital-robot/HospitalArchitecture";
import { HospitalTechStack } from "@/components/solutions/hospital-robot/HospitalTechStack";
import { HospitalDashboard } from "@/components/solutions/hospital-robot/HospitalDashboard";
import { HospitalApplications } from "@/components/solutions/hospital-robot/HospitalApplications";
import { HospitalROICalculator } from "@/components/solutions/hospital-robot/HospitalROICalculator";
import { HospitalCaseStudy } from "@/components/solutions/hospital-robot/HospitalCaseStudy";
import { HospitalInquiryForm } from "@/components/solutions/hospital-robot/HospitalInquiryForm";
import { CtaBanner } from "@/components/common/CtaBanner";

export const Route = createFileRoute("/solutions/hospital-delivery-robot")({
  head: () =>
    buildSeoMeta({
      title: "Hospital Delivery Robot | Autonomous Internal Medical Logistics | INDUS Robotics",
      description:
        "An autonomous hospital delivery robot that transports medicines, medical supplies, pathology specimens, documents and reports between hospital departments safely and securely.",
      path: "/solutions/hospital-delivery-robot",
      ogType: "article",
    }),
  component: HospitalDeliverySolutionPage,
});

function HospitalDeliverySolutionPage() {
  const { openModal } = useModals();

  useEffect(() => {
    trackDigitalPresence(
      "solution_view",
      "Hospital Delivery Robot",
      "/solutions/hospital-delivery-robot"
    );
    trackClarityEvent("hospital_delivery_robot_view");
  }, []);

  const scrollToInquiry = () => {
    const el = document.getElementById("hospital-inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRequestDemo = () => {
    trackClarityEvent("hospital_request_demo_click");
    trackDigitalPresence(
      "demo_request",
      "Hospital Delivery Robot",
      "/solutions/hospital-delivery-robot"
    );
    openModal("demo", {
      productName: "Hospital Delivery Robot",
      categoryName: "Healthcare Robotics Solutions",
      initialMessage:
        "Requesting a clinical demonstration and elevator-integration feasibility review of the INDUS Hospital Delivery Robot.",
    });
  };

  const handleDownloadBrochure = () => {
    trackClarityEvent("hospital_download_brochure_click");
    trackDigitalPresence(
      "brochure_download",
      "Hospital Delivery Robot Datasheet",
      "/solutions/hospital-delivery-robot"
    );
    openModal("quote", {
      productName: "Hospital Delivery Robot - Clinical Whitepaper & Specs",
      categoryName: "Clinical Documentation",
      initialMessage:
        "Requesting clinical engineering datasheet, elevator interface specifications, and infection control compliance reports for the Hospital Delivery Robot.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* SECTION 1: HERO */}
      <SolutionHero
        badge="Intelligent Robotics Solution 02"
        standardsBadge="IEC 60601-1-2 · Cleanroom ISO Class 6 · HIPAA Aligned"
        headline="Autonomous Hospital Delivery Robot"
        headlineAccent="Internal Medical Logistics &amp; Pharmacy Transit"
        description="An autonomous indoor hospital delivery robot that transports medicines, medical supplies, pathology specimens, documents and reports between hospital departments safely and securely."
        robotImage={images.mobileRobotics}
        robotImageAlt="INDUS Autonomous Hospital Delivery Robot"
        onRequestDemo={handleRequestDemo}
        onDownloadBrochure={handleDownloadBrochure}
        onContactEngineer={scrollToInquiry}
        keySpecs={[
          { label: "Payload Capacity", value: "50 kg", unit: "multi-tier" },
          { label: "Corridor Speed", value: "1.2 m/s", unit: "governed" },
          { label: "Acoustic Noise", value: "<48 dB", unit: "silent" },
          { label: "Elevator Protocol", value: "BACnet / IoT", unit: "wireless" },
        ]}
      />

      {/* SECTION 2: HEALTHCARE LOGISTICS CHALLENGES */}
      <HospitalProblems />

      {/* SECTION 3: SUBSYSTEM OVERVIEW */}
      <HospitalOverview />

      {/* SECTION 4: HOW IT WORKS (8-STAGE CLINICAL PIPELINE) */}
      <HospitalWorkflow />

      {/* SECTION 5: KEY FEATURES */}
      <HospitalFeatures />

      {/* SECTION 6: TECHNICAL ARCHITECTURE (9 LAYERS) */}
      <HospitalArchitecture />

      {/* SECTION 7: CLINICAL TECHNOLOGY STACK */}
      <HospitalTechStack />

      {/* SECTION 8: HOSPITAL FLEET TELEMETRY DASHBOARD */}
      <HospitalDashboard />

      {/* SECTION 9: HEALTHCARE APPLICATIONS */}
      <HospitalApplications />

      {/* SECTION 10: STAFF TIME & ROI CALCULATOR */}
      <HospitalROICalculator />

      {/* SECTION 11: DEMONSTRATION HOSPITAL CASE STUDY */}
      <HospitalCaseStudy />

      {/* SECTION 12: CLINICAL INQUIRY FORM */}
      <HospitalInquiryForm />

      {/* GLOBAL ENTERPRISE CTA BANNER */}
      <CtaBanner
        headline="Ready to Return Hours to Bedside Nursing?"
        description="Connect directly with an INDUS healthcare robotics specialist to assess elevator telemetry, pharmacy workflow integration, and corridor feasibility for your hospital."
        primaryCtaText="Request Clinical Feasibility Study"
        secondaryCtaText="Download Technical Specs"
        onPrimaryClick={scrollToInquiry}
        onSecondaryClick={handleDownloadBrochure}
      />
    </div>
  );
}

export default HospitalDeliverySolutionPage;
