import { createFileRoute } from "@tanstack/react-router";
import { IndusMotionStudio } from "@/components/engineering/IndusMotionStudio";
import { InteractiveRobotAnatomy } from "@/components/engineering/InteractiveRobotAnatomy";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/technology/motion-studio")({
  head: () =>
    buildSeoMeta({
      title: "INDUS Motion Studio — Interactive Robotics Sizing & Architecture Platform",
      description:
        "Unified multi-axis motion sizing, component architecture selection, and specification verification platform. Calculate dynamic inertia matching, evaluate physics models, and generate certified engineering passports.",
      path: "/technology/motion-studio",
    }),
  component: MotionStudioPage,
});

function MotionStudioPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-10 lg:py-16 space-y-16">
        <IndusMotionStudio />
        <InteractiveRobotAnatomy />
      </div>
    </div>
  );
}
