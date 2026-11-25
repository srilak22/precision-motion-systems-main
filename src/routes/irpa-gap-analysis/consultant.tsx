import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { IrpaNavigationHeader } from "@/components/irpa/IrpaNavigationHeader";
import { ConsultantPortal } from "@/components/irpa/ConsultantPortal";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/irpa-gap-analysis/consultant")({
  head: () =>
    buildSeoMeta({
      title: "Consultant Verification Portal | INDUS IRPA",
      description: "Auditing, evidence verification, and recommendation console for INDUS Automation Consultants.",
      path: "/irpa-gap-analysis/consultant",
      noindex: true,
    }),
  component: IrpaConsultantRoute,
});

function IrpaConsultantRoute() {
  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col">
      <IrpaNavigationHeader currentModule="consultant" />
      <main className="flex-1">
        <ConsultantPortal />
      </main>
    </div>
  );
}
