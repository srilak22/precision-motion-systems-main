import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RoboticProcessAutomationDashboard } from "@/components/rpa/RoboticProcessAutomationDashboard";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/robotic-process-automation")({
  head: () =>
    buildSeoMeta({
      title: "Robotic Process Automation (RPA) | INDUS Industrial Robotics",
      description:
        "High-precision Robotic Process Automation (RPA) workcells for industrial manufacturing. Explore turnkey cells, 5-stage deterministic pipeline simulation, and real-time ROI calculator.",
      path: "/robotic-process-automation",
    }),
  component: RoboticProcessAutomationPageRoute,
});

function RoboticProcessAutomationPageRoute() {
  return (
    <main className="w-full">
      <RoboticProcessAutomationDashboard />
    </main>
  );
}
