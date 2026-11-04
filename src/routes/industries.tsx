import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { buildSeoMeta } from "@/lib/seo";
import { IndustriesHero } from "@/components/industries/IndustriesHero";
import { IndustriesGrid } from "@/components/industries/IndustriesGrid";
import { TechPipeline } from "@/components/industries/TechPipeline";
import { IndustryCaseStudy } from "@/components/industries/IndustryCaseStudy";
import { IndustriesCta } from "@/components/industries/IndustriesCta";

export const Route = createFileRoute("/industries")({
  head: () =>
    buildSeoMeta({
      title: "Mission-Critical Industrial Robotics & Automation Sectors | INDUS",
      description:
        "Explore INDUS robotics architectures engineered for high-throughput manufacturing across Automotive, Electronics, Machinery, Logistics, Pharmaceutical, and Aerospace domains.",
      path: "/industries",
    }),
  component: IndustriesPage,
});

export function IndustriesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#155EEF] selection:text-white antialiased">
      {/* 1. Hero Section */}
      <IndustriesHero />

      {/* 2. Core Industries Grid (Matches Mega-Menu Style) */}
      <IndustriesGrid />

      {/* 3. Technical System Architecture (Data Pipeline Banner) */}
      <TechPipeline />

      {/* 4. Industry Project / Case Study Drawer */}
      <IndustryCaseStudy />

      {/* 5. Bottom Engineering CTA Banner */}
      <IndustriesCta />
    </div>
  );
}
