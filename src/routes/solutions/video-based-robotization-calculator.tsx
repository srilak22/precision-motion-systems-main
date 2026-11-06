import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { VideoRobotizationCalculator } from "@/components/video-robotization/VideoRobotizationCalculator";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/solutions/video-based-robotization-calculator")({
  head: () =>
    buildSeoMeta({
      title: "Video-Based Robotization Calculation Tools | INDUS Industrial Robotics",
      description:
        "AI computer vision tools to analyze manual factory video footage, perform Methods-Time Measurement (MTM) deconstruction, and calculate robotic cell sizing, cycle speedup, and capital ROI.",
      path: "/solutions/video-based-robotization-calculator",
    }),
  component: SolutionsVideoRobotizationPageRoute,
});

function SolutionsVideoRobotizationPageRoute() {
  return (
    <main className="w-full">
      <VideoRobotizationCalculator />
    </main>
  );
}
