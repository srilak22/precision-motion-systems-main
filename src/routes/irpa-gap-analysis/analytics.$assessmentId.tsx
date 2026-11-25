import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { IrpaNavigationHeader } from "@/components/irpa/IrpaNavigationHeader";
import { IrpaAnalyticsDashboard } from "@/components/irpa/analytics/IrpaAnalyticsDashboard";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/irpa-gap-analysis/analytics/$assessmentId")({
  head: ({ params }) =>
    buildSeoMeta({
      title: `IRPA Phase 3 Intelligence & Gap Analytics [${params.assessmentId}] | INDUS`,
      description: "12-domain maturity scoring, OEE telemetry calculations, automated technology gap detection, and Ishikawa root causes.",
      path: `/irpa-gap-analysis/analytics/${params.assessmentId}`,
    }),
  component: IrpaAnalyticsPageRoute,
});

function IrpaAnalyticsPageRoute() {
  const { assessmentId } = Route.useParams();

  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col font-sans">
      <IrpaNavigationHeader currentModule="analytics" assessmentId={assessmentId} />
      <main className="flex-1">
        <IrpaAnalyticsDashboard assessmentId={assessmentId} />
      </main>
    </div>
  );
}
