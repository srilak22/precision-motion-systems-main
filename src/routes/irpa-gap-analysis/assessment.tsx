import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { IrpaNavigationHeader } from "@/components/irpa/IrpaNavigationHeader";
import { AssessmentWizard } from "@/components/irpa/AssessmentWizard";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/irpa-gap-analysis/assessment")({
  head: () =>
    buildSeoMeta({
      title: "12-Domain Automation Assessment Wizard | INDUS IRPA",
      description: "Interactive factory capability evaluation across 12 operational domains and 120 capability parameters.",
      path: "/irpa-gap-analysis/assessment",
    }),
  component: IrpaAssessmentRoute,
});

function IrpaAssessmentRoute() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col">
      <IrpaNavigationHeader currentModule="assessment" />
      <main className="flex-1">
        <AssessmentWizard
          onNavigateHome={() => navigate({ to: "/irpa-gap-analysis" })}
          onOpenConsultant={() => navigate({ to: "/irpa-gap-analysis/consultant" })}
        />
      </main>
    </div>
  );
}
