import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RoboticProcessAnalysisTools } from "@/components/rpa/RoboticProcessAnalysisTools";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/solutions/robotic-process-analysis-tools")({
  head: () =>
    buildSeoMeta({
      title: "Robotic Process Analysis Tools | INDUS Industrial Robotics",
      description:
        "Industrial engineering analysis tools for robotic cycle time bottlenecks, wrist torque overhung moment margins, OEE root-cause diagnostics, and trajectory jerk optimization.",
      path: "/solutions/robotic-process-analysis-tools",
    }),
  component: SolutionsRoboticProcessAnalysisPageRoute,
});

function SolutionsRoboticProcessAnalysisPageRoute() {
  return (
    <main className="w-full">
      <RoboticProcessAnalysisTools />
    </main>
  );
}
