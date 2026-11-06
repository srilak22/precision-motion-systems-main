import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TrafficProfileContentAgentsDashboard } from "@/components/traffic-agents/TrafficProfileContentAgentsDashboard";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/solutions/traffic-profile-content-agents")({
  head: () =>
    buildSeoMeta({
      title: "Traffic Profile Content Agents Solution | INDUS Industrial Robotics",
      description:
        "Autonomous multi-agent content generation platform connecting Tier-1 Automotive, Semiconductor, and Aerospace traffic profiles with precision robotics.",
      path: "/solutions/traffic-profile-content-agents",
    }),
  component: SolutionsTrafficAgentsPageRoute,
});

function SolutionsTrafficAgentsPageRoute() {
  return (
    <main className="w-full px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <TrafficProfileContentAgentsDashboard />
      </div>
    </main>
  );
}
