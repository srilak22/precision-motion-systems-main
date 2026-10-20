import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Wrench, MessageSquare, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoboticsIntelligenceExplorer } from "@/components/engineering/RoboticsIntelligenceExplorer";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/technology/intelligence-explorer")({
  head: () =>
    buildSeoMeta({
      title: "Robotics Intelligence Explorer (Level 0–5) | INDUS Robotics",
      description:
        "Educational framework detailing component and system intelligence from Level 0 Mechanical Transmission to Level 5 Adaptive Planning, with functional safety boundaries.",
      path: "/technology/intelligence-explorer",
    }),
  component: IntelligenceExplorerPage,
});

function IntelligenceExplorerPage() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-16 text-surface-foreground lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2">
            <Link
              to="/technology"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.2em] text-signal hover:underline"
            >
              <ArrowLeft size={13} /> Technology Stack
            </Link>
            <span className="text-surface-foreground/40">/</span>
            <span className="text-xs uppercase tracking-wider text-surface-foreground/60">
              Intelligence Hierarchy
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded bg-signal/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.22em] text-signal">
              INDUS Educational Framework
            </span>
            <span className="text-xs font-mono text-surface-foreground/50">
              Level 0 (Mechanics) to Level 5 (Autonomy)
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[.92] sm:text-5xl lg:text-6xl">
            Robotics Intelligence Explorer
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-surface-foreground/75 sm:text-base">
            Explore our educational framework for industrial robotics intelligence: from passive mechanical transmission (Level 0) and high-speed current loops (Level 1), through sensing (Level 2), deterministic kinematic control (Level 3), machine vision perception (Level 4), and adaptive planning (Level 5).
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              className="h-11 rounded-none bg-signal px-6 font-bold uppercase text-signal-foreground hover:bg-signal/90 text-xs"
              onClick={() => openModal("engineer", { categoryName: "Robotics Intelligence Architecture" })}
            >
              <Wrench size={14} className="mr-1.5" /> Consult System Architect
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal text-xs"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-signal" /> Quick Technical Chat
            </Button>
          </div>
        </div>
      </section>

      {/* Main Interactive Explorer */}
      <section className="px-5 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <RoboticsIntelligenceExplorer />
        </div>
      </section>
    </div>
  );
}
