import { createFileRoute } from "@tanstack/react-router";
import { WarehouseHero } from "@/components/solutions/warehouse-robot/WarehouseHero";
import { WarehouseProblems } from "@/components/solutions/warehouse-robot/WarehouseProblems";
import { WarehouseSolutionOverview } from "@/components/solutions/warehouse-robot/WarehouseSolutionOverview";
import { WarehouseHowItWorks } from "@/components/solutions/warehouse-robot/WarehouseHowItWorks";
import { WarehouseTechStack } from "@/components/solutions/warehouse-robot/WarehouseTechStack";
import { WarehouseKeyFeatures } from "@/components/solutions/warehouse-robot/WarehouseKeyFeatures";
import { WarehouseArchitectureDiagram } from "@/components/solutions/warehouse-robot/WarehouseArchitectureDiagram";
import { WarehouseProjectResults } from "@/components/solutions/warehouse-robot/WarehouseProjectResults";
import { WarehouseGallery } from "@/components/solutions/warehouse-robot/WarehouseGallery";
import { WarehouseFutureEnhancements } from "@/components/solutions/warehouse-robot/WarehouseFutureEnhancements";
import { SolutionInquiryForm } from "@/components/solutions/SolutionInquiryForm";
import { CtaBanner } from "@/components/common/CtaBanner";
import { images } from "@/lib/images";

export const Route = createFileRoute("/solutions/warehouse-inventory-robot")({
  component: WarehouseInventoryRobotPage,
  head: () => ({
    meta: [
      {
        title: "Warehouse Inventory Robot | Autonomous Intralogistics | INDUS Robotics",
      },
      {
        name: "description",
        content:
          "Autonomous warehouse inventory auditing robot with RFID scanning, multi-tier vertical mast, and live WMS database synchronization.",
      },
    ],
  }),
});

function WarehouseInventoryRobotPage() {
  const scrollToInquiry = () => {
    const el = document.getElementById("solution-inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      {/* 1. Hero */}
      <WarehouseHero
        robotImage={images.warehouseRobot}
        onProjectReport={scrollToInquiry}
      />

      {/* 2. Problem Statement */}
      <WarehouseProblems />

      {/* 3. Solution Overview */}
      <WarehouseSolutionOverview />

      {/* 4. How It Works Flowchart */}
      <WarehouseHowItWorks />

      {/* 5. Technology Stack */}
      <WarehouseTechStack />

      {/* 6. Key Features */}
      <WarehouseKeyFeatures />

      {/* 7. Architecture Diagram */}
      <WarehouseArchitectureDiagram />

      {/* 8. Project Results */}
      <WarehouseProjectResults />

      {/* 9. Gallery */}
      <WarehouseGallery />

      {/* 10. Future Enhancements */}
      <WarehouseFutureEnhancements />

      {/* Enterprise Inquiry Form */}
      <section id="solution-inquiry-section" className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <SolutionInquiryForm
            solutionName="Warehouse Inventory Robot"
            solutionCategory="Intralogistics & Inventory Automation"
          />
        </div>
      </section>

      {/* CTA Banner */}
      <CtaBanner
        headline="Automate Your Warehouse Stock Audits Today"
        description="Schedule a facility site assessment or integrate our AMR fleet with your SAP, Manhattan, or Oracle WMS system."
        ctaPrimary={{
          label: "Request Warehouse Trial",
          href: "/contact?topic=warehouse-demo",
        }}
        ctaSecondary={{
          label: "Download Tech Spec",
          href: "/contact?topic=warehouse-specs",
        }}
      />
    </div>
  );
}
