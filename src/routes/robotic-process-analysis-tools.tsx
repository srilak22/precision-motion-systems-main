import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RoboticProcessAnalysisTools } from "@/components/rpa/RoboticProcessAnalysisTools";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/robotic-process-analysis-tools")({
  head: () =>
    buildSeoMeta({
      title: "Robotic Process Analysis Tools | INDUS Industrial Robotics",
      description:
        "Industrial engineering analysis tools for robotic cycle time bottlenecks, wrist torque overhung moment margins, OEE root-cause diagnostics, and trajectory jerk optimization.",
      path: "/robotic-process-analysis-tools",
    }),
  component: RoboticProcessAnalysisPageRoute,
});

function RoboticProcessAnalysisPageRoute() {
  return (
    <main className="w-full">
      <RoboticProcessAnalysisTools />
    </main>
  );
}
