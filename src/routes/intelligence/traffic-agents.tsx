import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TrafficProfileContentAgentsDashboard } from "@/components/traffic-agents/TrafficProfileContentAgentsDashboard";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/intelligence/traffic-agents")({
  head: () =>
    buildSeoMeta({
      title: "Traffic & AI Agent Analytics | INDUS Industrial Intelligence",
      description:
        "Monitor human visitors vs. AI agent and search crawler traffic, top robotics pages, traffic sources, and lead-generation conversions.",
      path: "/intelligence/traffic-agents",
    }),
  component: IntelligenceTrafficAgentsPageRoute,
});

function IntelligenceTrafficAgentsPageRoute() {
  return (
    <main className="w-full px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <TrafficProfileContentAgentsDashboard />
      </div>
    </main>
  );
}
