import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/intelligence/analytics")({
  head: () =>
    buildSeoMeta({
      title: "Analytics & Conversion Intelligence | INDUS Industrial Robotics",
      description:
        "INDUS Phase 6 analytics dashboard — real conversion measurement across product discovery, Application Finder funnels, AI assistant effectiveness, and verified lead attribution without fabricated metrics.",
      path: "/intelligence/analytics",
      noindex: true,
    }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
