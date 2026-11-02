import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Cpu,
  MessageSquare,
  Wrench,
  BrainCircuit,
  Move3d,
  Bot,
  Radio,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { technologiesData } from "@/data/technologies";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { CtaBanner } from "@/components/common/CtaBanner";

export const Route = createFileRoute("/technology/")({
  head: () =>
    buildSeoMeta({
      title: "Technology Stack & Physical AI | INDUS Industrial Robotics",
      description:
        "Explore the core engineering technologies behind INDUS robotics: Physical AI, 7th-axis Motion Studio, 8-pillar Robotics Ecosystem, and Digital Twin telemetry.",
      path: "/technology",
    }),
  component: TechnologyIndexPage,
});

function TechnologyIndexPage() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
            Engineering Pillars &amp; Intelligent Architecture
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            Robotics Technology Stack
          </h1>
          <p className="mt-4 text-xl font-light text-signal font-display uppercase tracking-widest">
            Intelligent Motion. Autonomous Future.
          </p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            Mechanical kinematics, electrical power regulation, deterministic real-time trajectory
            generation, high-resolution sensing, and edge telemetry operating as one synchronized
            engineering architecture.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="h-12 rounded-none bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-signal/90"
              onClick={() => openModal("engineer")}
            >
              <Wrench size={15} className="mr-2" />
              Consult an Application Engineer
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={15} className="mr-2 text-signal" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </section>

      {/* Flagship Intelligent Systems Grid (4 Pillars) */}
      <section className="px-5 py-16 lg:px-10 bg-[#0F172A] text-white border-b border-white/10">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#16C7E8] block mb-1">
              NEXT-GENERATION CAPABILITIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              Flagship Robotics Intelligence Platforms
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Physical AI Platform */}
            <Link
              to="/technology/physical-ai"
              className="rounded-xl border border-white/10 bg-[#080D1A] p-6 hover:border-[#16C7E8] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-10 rounded-lg bg-[#16C7E8]/10 text-[#16C7E8] border border-[#16C7E8]/30 flex items-center justify-center">
                    <BrainCircuit size={20} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#16C7E8] bg-[#16C7E8]/10 px-2 py-0.5 rounded border border-[#16C7E8]/20">
                    Flagship
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-[#16C7E8] transition-colors">
                  Physical AI Platform
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  3D point clouds, vision-language-action (VLA) models, and sub-millisecond deterministic robot control.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-xs font-bold text-[#16C7E8] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Physical AI</span> &rarr;
              </div>
            </Link>

            {/* 2. Motion Studio */}
            <Link
              to="/technology/motion-studio"
              className="rounded-xl border border-white/10 bg-[#080D1A] p-6 hover:border-[#2388FF] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-10 rounded-lg bg-[#2388FF]/10 text-[#2388FF] border border-[#2388FF]/30 flex items-center justify-center">
                    <Move3d size={20} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#2388FF] bg-[#2388FF]/10 px-2 py-0.5 rounded border border-[#2388FF]/20">
                    Interactive
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-[#2388FF] transition-colors">
                  INDUS Motion Studio
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  7th-axis linear track simulation, dual-arm welding coordination, and dynamic inertia matching ($J_L/J_M$).
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-xs font-bold text-[#2388FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Launch Motion Studio</span> &rarr;
              </div>
            </Link>

            {/* 3. Robotics Ecosystem */}
            <Link
              to="/technology/robotics-ecosystem"
              className="rounded-xl border border-white/10 bg-[#080D1A] p-6 hover:border-emerald-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Taxonomy
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-emerald-400 transition-colors">
                  Robotics Ecosystem
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  8-pillar taxonomy: Humanoids, AMRs, Cobots, AI Vision, Delta, Cartesian, Soft Grippers, and Multi-Robot.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Taxonomy</span> &rarr;
              </div>
            </Link>

            {/* 4. Digital Twin */}
            <Link
              to="/technology/digital-twin"
              className="rounded-xl border border-white/10 bg-[#080D1A] p-6 hover:border-purple-400 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-10 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <Radio size={20} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    Live Twin
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-purple-400 transition-colors">
                  Digital Twin &amp; Telemetry
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Virtual workcell layout, ISO 10816 vibration FFT diagnostics, reducer wear indices, and AMR tracking.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-xs font-bold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Launch Digital Twin</span> &rarr;
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Layers Grid */}
      <section className="px-5 py-20 lg:px-10 lg:py-28 bg-background">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {technologiesData.map((tech, idx) => (
              <div
                key={tech.id}
                className="group flex flex-col justify-between border border-border bg-card p-8 transition-all hover:border-signal hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <span className="text-xs font-bold uppercase tracking-[.2em] text-signal">
                      Pillar 0{idx + 1}
                    </span>
                    <Cpu
                      size={18}
                      className="text-muted-foreground group-hover:text-signal transition-colors"
                    />
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-bold uppercase leading-tight text-foreground">
                    {tech.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {tech.shortDescription}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {tech.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border/80 bg-secondary/50 px-2.5 py-1 text-[11px] font-mono text-muted-foreground uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/40">
                  <Link
                    to="/technology/$techId"
                    params={{ techId: tech.id }}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
                  >
                    Explore Architecture <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connected CTA Banner */}
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10 pb-16">
        <CtaBanner
          variant="precision"
          badge="COLLABORATIVE MECHATRONICS CO-DEVELOPMENT"
          headline="Engineer Custom Motion &amp; Robotics Subsystems"
          description="From custom-wound frameless brushless stators to specialized multi-axis articulated wrist assemblies, our engineering laboratory in Chennai transforms custom specifications into certified field hardware."
          ctaPrimary={{
            label: "Consult an Application Engineer",
            href: "/book-consultation",
          }}
          ctaSecondary={{
            label: "Open Indus Bot 2.0",
            href: "/indus-bot",
          }}
        />
      </div>
    </div>
  );
}
