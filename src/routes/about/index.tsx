import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { AboutSecondaryNav } from "@/components/about/AboutSecondaryNav";
import { AboutHero } from "@/components/about/AboutHero";
import { WhoWeAre } from "@/components/about/WhoWeAre";
import { MissionVision } from "@/components/about/MissionVision";
import { EngineeringCapabilities } from "@/components/about/EngineeringCapabilities";
import { ManufacturingInfrastructure } from "@/components/about/ManufacturingInfrastructure";
import { EngineeringPhilosophy } from "@/components/about/EngineeringPhilosophy";
import { RoboticsSafety } from "@/components/about/RoboticsSafety";
import { CoEngineeringModel } from "@/components/about/CoEngineeringModel";
import { EngineeringRoadmap } from "@/components/about/EngineeringRoadmap";
import { RoboticsImpact } from "@/components/about/RoboticsImpact";
import { LeadershipTeams } from "@/components/about/LeadershipTeams";
import { InnovationSection } from "@/components/about/InnovationSection";
import { CaseStudies } from "@/components/about/CaseStudies";
import { GlobalPresence } from "@/components/about/GlobalPresence";
import { AboutCTA } from "@/components/about/AboutCTA";

export const Route = createFileRoute("/about/")({
  head: () =>
    buildSeoMeta({
      title: "About INDUS | Industrial Robotics, Physical AI & Precision Motion",
      description:
        "Meet the leadership, engineers, and vision behind INDUS Industrial Robotics. Explore our engineering philosophy, physical AI capabilities, co-engineering model, and full-stack robotics directory.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  const { openModal } = useModals();

  // Robust client-side hash scrolling listener ensuring direct navigation to sections
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      const target = document.getElementById(hash);
      if (target) {
        const navOffset = 135;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    };

    handleHashScroll();
    const timer1 = setTimeout(handleHashScroll, 120);
    const timer2 = setTimeout(handleHashScroll, 350);

    window.addEventListener("hashchange", handleHashScroll);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("hashchange", handleHashScroll);
    };
  }, []);

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  const handleConsultEngineer = () => {
    openModal("engineer");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Secondary Sticky Anchor Navigation Bar */}
      <AboutSecondaryNav />

      {/* 2. Hero Section: Purpose-Driven Robotics Engineering (#overview) */}
      <AboutHero onConsultEngineer={handleConsultEngineer} onWhatsApp={handleWhatsApp} />

      {/* 3. Who We Are: Precision Motion & Actuation Chain (#who-we-are) */}
      <WhoWeAre />

      {/* 4. Our Mission & Vision + 6 Foundational Engineering Pillars (#mission-vision) */}
      <MissionVision />

      {/* 5. Deep-Tech Specialization: 9-Card Capabilities Stack (#capabilities-stack) */}
      <EngineeringCapabilities />

      {/* 6. Manufacturing Infrastructure & Quality Metrology (#infrastructure) */}
      <ManufacturingInfrastructure />

      {/* 7. Engineering Philosophy: 6 Core Principles (#philosophy) */}
      <EngineeringPhilosophy />

      {/* 8. Robotics Safety & Reliability Architecture (#safety) */}
      <RoboticsSafety />

      {/* 9. Our Co-Engineering Model (#co-engineering) */}
      <CoEngineeringModel />

      {/* 10. Engineering Development Roadmap (5-Stage Progressive Milestones) */}
      <EngineeringRoadmap />

      {/* 11. Impact of Robotics & Physical AI (4 Major Industrial Areas) */}
      <RoboticsImpact />

      {/* 12. Leadership & Teams Showcase (All 7 Categories, 22 Named Members & 2 Open Roles) */}
      <LeadershipTeams />

      {/* 13. Engineering Culture, Innovation & R&D (#presence-innovation) */}
      <InnovationSection />

      {/* 14. Application Showcase & Case Studies (#case-studies) */}
      <CaseStudies />

      {/* 15. Global Presence & Engineering Network */}
      <GlobalPresence />

      {/* 16. Final Call to Action */}
      <AboutCTA onWhatsApp={handleWhatsApp} />
    </div>
  );
}
