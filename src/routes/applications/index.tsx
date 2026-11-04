import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { buildSeoMeta } from "@/lib/seo";
import { IndustriesHero } from "@/components/industries/IndustriesHero";
import { IndustryFlipGrid } from "@/components/industries/IndustryFlipGrid";
import { TechPipeline } from "@/components/industries/TechPipeline";
import { IndustryCaseStudy } from "@/components/industries/IndustryCaseStudy";
import { IndustriesCta } from "@/components/industries/IndustriesCta";

export const Route = createFileRoute("/applications/")({
  head: () =>
    buildSeoMeta({
      title: "Mission-Critical Industrial Robotics & Automation Applications | INDUS",
      description:
        "Deploy end-to-end robotic systems, computer vision, and ROS2-driven automation built for high-throughput, zero-defect industrial environments across Automotive, Electronics, Machining, Logistics, Pharma, and Aerospace.",
      path: "/applications",
    }),
  component: ApplicationsIndexPage,
});

export function ApplicationsIndexPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#155EEF] selection:text-white antialiased">
      {/* 1. Hero Section */}
      <IndustriesHero />

      {/* 2. Interactive 3D Flip-Card Industries & Applications Grid */}
      <IndustryFlipGrid />

      {/* 3. Data & Control Architecture Diagram Banner */}
      <TechPipeline />

      {/* 4. Deep-Dive Case Study / Workcell Selector */}
      <IndustryCaseStudy />

      {/* 5. Engineering Conversion & Compliance Footer Banner */}
      <IndustriesCta />
    </div>
  );
}
