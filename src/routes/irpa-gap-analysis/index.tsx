import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { IrpaNavigationHeader } from "@/components/irpa/IrpaNavigationHeader";
import { IrpaLandingPage } from "@/components/irpa/IrpaLandingPage";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/irpa-gap-analysis/")({
  head: () =>
    buildSeoMeta({
      title: "Industrial Robotics Process Automation (IRPA) Gap Analysis | INDUS",
      description:
        "Comprehensive 12-domain automation maturity assessment and gap analysis framework across 15 manufacturing industries. Evaluate factory baseline, set target capabilities, and derive turnkey robotics ROI.",
      path: "/irpa-gap-analysis",
    }),
  component: IrpaLandingPageRoute,
});

function IrpaLandingPageRoute() {
  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col">
      <IrpaNavigationHeader currentModule="landing" />
      <main className="flex-1">
        <IrpaLandingPage />
      </main>
    </div>
  );
}
