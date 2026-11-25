import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { IrpaNavigationHeader } from "@/components/irpa/IrpaNavigationHeader";
import { FactoryProfileForm } from "@/components/irpa/FactoryProfileForm";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/irpa-gap-analysis/factory-profile")({
  head: () =>
    buildSeoMeta({
      title: "Factory Profile Baseline | IRPA Automation Gap Analysis",
      description: "Characterize factory production parameters, installed equipment, and automation footprint.",
      path: "/irpa-gap-analysis/factory-profile",
    }),
  component: IrpaFactoryProfileRoute,
});

function IrpaFactoryProfileRoute() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col">
      <IrpaNavigationHeader currentModule="factory" />
      <main className="flex-1 py-6">
        <FactoryProfileForm
          onSuccess={(factoryId) => {
            navigate({ to: "/irpa-gap-analysis/assessment" });
          }}
          onBack={() => {
            navigate({ to: "/irpa-gap-analysis/register" });
          }}
        />
      </main>
    </div>
  );
}
