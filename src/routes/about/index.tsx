import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Move3d, ShieldCheck, Gauge, CircuitBoard, Settings2, Wrench, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";

export const Route = createFileRoute("/about/")({
  head: () => ({
    meta: [
      { title: "About INDUS | Industrial Robotics & Motion Technologies" },
      {
        name: "description",
        content:
          "Learn about INDUS Industrial Robotics: our engineering mission, core values, precision manufacturing approach, and dedication to industrial automation.",
      },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
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
            Company Overview
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            Engineering Precision in Industrial Robotics
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            INDUS Industrial Robotics develops precision motion components, mechanical joint reducers, autonomous mobile drive units, and multi-axis controllers for machine builders, system integrators, and industrial manufacturers worldwide.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild className="h-12 rounded-none bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-signal/90">
              <Link to="/about/engineering">
                Explore Our Engineering Approach <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal"
              onClick={() => openModal("engineer")}
            >
              Consult an Engineer
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-signal" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Purpose */}
      <section className="px-5 py-20 lg:px-10 lg:py-28 bg-background">
        <div className="mx-auto max-w-[1360px]">
          <div className="grid gap-14 lg:grid-cols-2 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">Our Engineering Mandate</p>
              <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
                Precision Motion · Intelligent Control · Industrial Reliability
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                We believe that modern automation hinges on the deterministic harmony between mechanical stiffness, dynamic torque generation, and sub-millisecond digital feedback. Rather than viewing robotics as isolated black boxes, we approach robotic design from foundational physical first principles.
              </p>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                Our portfolio spans the entire actuation chain: from zero-backlash strain wave gears and high-power brushless servo actuators to autonomous mobile wheel modules and complete 6-axis articulated arms.
              </p>
            </div>

            <div className="border border-border bg-card p-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-signal">Who We Serve</span>
              <h3 className="mt-2 font-display text-2xl uppercase tracking-wide">
                Serving the Engineering Ecosystem
              </h3>
              <ul className="mt-6 space-y-3 text-xs sm:text-sm text-muted-foreground">
                {[
                  "Mechanical & Automation Engineers designing custom production equipment",
                  "System Integrators delivering complete turnkey automated cells",
                  "Original Equipment Manufacturers (OEMs) integrating specialized robotic joints",
                  "Procurement Teams seeking reliable, standard-compatible components",
                  "Manufacturing Decision-Makers upgrading line throughput and OEE",
                ].map((aud) => (
                  <li key={aud} className="flex items-start gap-3">
                    <span className="text-signal font-bold mt-0.5">•</span>
                    <span>{aud}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Pillars */}
      <section className="border-t border-border/40 bg-card px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">Design Principles</p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              Engineered for Industrial Performance
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Gauge,
                title: "Precision",
                desc: "Sub-micron encoder resolution, sub-arcminute lost motion, and stiff mechanical joint architectures that eliminate dynamic overshoot.",
              },
              {
                icon: ShieldCheck,
                title: "Reliability",
                desc: "Rigorous thermal testing, sealed IP67/IP69K housings, and fail-safe holding brakes designed for continuous 24/7 multi-shift factory duty.",
              },
              {
                icon: CircuitBoard,
                title: "Integration",
                desc: "Standardized mechanical ISO bolt patterns, open fieldbuses (EtherCAT, PROFINET), and modular connectors simplifying machine assembly.",
              },
              {
                icon: Settings2,
                title: "Scalability",
                desc: "Modular building blocks allowing machine builders to scale from single-axis slides to coordinated 64-axis synchronous lines.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-border bg-background p-8">
                <Icon className="text-signal mb-4" size={28} />
                <h3 className="font-display text-2xl uppercase tracking-wide text-foreground">{title}</h3>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
