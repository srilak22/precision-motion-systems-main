import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TrafficProfileContentAgentsDashboard } from "@/components/traffic-agents/TrafficProfileContentAgentsDashboard";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/intelligence/traffic-agents")({
  head: () =>
    buildSeoMeta({
      title: "Traffic Profile Content Agents | INDUS Industrial Intelligence",
      description:
        "Intelligence command center for autonomous content generation agents, ICP audience targeting, and inbound attribution waterfall.",
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
