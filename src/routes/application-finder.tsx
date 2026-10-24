import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, ShieldCheck, MessageSquare, Wrench, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationFinderWizard } from "@/components/forms/ApplicationFinderWizard";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/application-finder")({
  head: () =>
    buildSeoMeta({
      title: "Find the Right Solution | Industrial Robotics Application Finder | INDUS",
      description:
        "Guided multi-step engineering discovery for industrial robotics, intelligent actuators, precision gearboxes, and motion systems. Specify application requirements for validated sizing and engineering quotation.",
      path: "/application-finder",
    }),
  component: ApplicationFinderPage,
});

function ApplicationFinderPage() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* 1. HERO HEADER (Light Industrial Theme) */}
      <section className="border-b border-[#E5EAF1] bg-white px-5 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.15em] text-[#155EEF] hover:underline"
            >
              <ArrowLeft size={13} /> Product Portfolio
            </Link>
            <span className="text-[#667085]/40">/</span>
            <span className="text-xs uppercase tracking-wider text-[#667085]">
              Application Engineering
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[.2em] text-[#155EEF] border border-[#B2CCFF]">
              Guided System Selection
            </span>
            <span className="text-xs font-mono text-[#667085]">
              ISO 9001:2015 &amp; DIN 3990 Kinematic Methodology
            </span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#172033]">
            Find the Right Solution
          </h1>

          <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-[#475467]">
            Connect your automation process to qualified engineering hardware. Step through process classification,
            mechanical boundary conditions, environmental ingress, and fieldbus architecture to generate an engineering application brief.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="h-10 rounded-lg border-[#D0D5DD] bg-white text-[#172033] hover:bg-[#F8FAFC] font-bold text-xs uppercase px-4 shadow-2xs"
              onClick={() => openModal("engineer", { categoryName: "General Kinematics Consultation" })}
            >
              <Wrench size={14} className="mr-1.5 text-[#155EEF]" /> Request Engineering Consultation
            </Button>
            <Button
              variant="ghost"
              onClick={handleWhatsApp}
              className="h-10 text-xs text-[#16A34A] hover:bg-[#F0FDF4] font-semibold"
            >
              <MessageSquare size={14} className="mr-1.5" /> Direct WhatsApp Application Desk
            </Button>
          </div>
        </div>
      </section>

      {/* 2. MAIN APPLICATION FINDER WIZARD */}
      <section className="px-4 py-10 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-[1100px]">
          <ApplicationFinderWizard />
        </div>
      </section>

      {/* 3. TRUST & ENGINEERING VALIDATION FOOTER BANNER */}
      <section className="border-t border-[#E5EAF1] bg-white px-5 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1440px] grid sm:grid-cols-3 gap-6">
          <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5">
            <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-3">
              <CheckCircle2 size={16} />
            </div>
            <h4 className="text-sm font-bold text-[#172033]">Zero Guesswork Kinematics</h4>
            <p className="mt-1 text-xs text-[#667085] leading-relaxed">
              Every proposal is sized with calculated continuous torque, reflected inertia ratio (JL/JM ≤ 5:1), and thermal duty limits.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5">
            <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-3">
              <ShieldCheck size={16} />
            </div>
            <h4 className="text-sm font-bold text-[#172033]">Confidential DealFlow</h4>
            <p className="mt-1 text-xs text-[#667085] leading-relaxed">
              Proprietary tooling drawings and cycle requirements are treated under strict bilateral NDA protocols with zero public disclosure.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5">
            <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-3">
              <Compass size={16} />
            </div>
            <h4 className="text-sm font-bold text-[#172033]">Turnkey Motion Integration</h4>
            <p className="mt-1 text-xs text-[#667085] leading-relaxed">
              From EtherCAT drives and absolute multi-turn feedback to mechanical mounting flanges and emergency braking systems.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
