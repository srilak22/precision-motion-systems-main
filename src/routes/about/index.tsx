import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Move3d,
  ShieldCheck,
  Gauge,
  CircuitBoard,
  Settings2,
  Wrench,
  MessageSquare,
  Award,
  Factory,
  Cpu,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/about/")({
  head: () =>
    buildSeoMeta({
      title: "About INDUS | Industrial Robotics & Motion Technologies",
      description:
        "Learn about INDUS Industrial Robotics: our engineering mission, core values, precision manufacturing approach, quality certifications, and global industrial integration.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({ type: "general" }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen">
      {/* 1. HERO / COMPANY OVERVIEW (#overview) */}
      <section
        id="overview"
        className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28 scroll-mt-20"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3">
            <Link to="/" className="text-signal hover:underline">
              Home
            </Link>
            <span>/</span>
            <span>About INDUS</span>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
            Company Overview
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            Engineering Precision in Industrial Robotics
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            INDUS Industrial Robotics develops precision motion components, mechanical joint
            reducers, autonomous mobile drive units, and multi-axis controllers for machine
            builders, system integrators, and industrial manufacturers worldwide.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              variant="default"
              className="shadow-[0_0_20px_rgba(149,204,0,0.25)]"
            >
              <Link to="/technology">
                Explore Technology Platform <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-surface-foreground/30 bg-transparent text-surface-foreground hover:bg-surface-elevated hover:text-signal"
              onClick={() => openModal("engineer")}
            >
              Consult an Engineer
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-surface-foreground/30 bg-transparent text-surface-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-signal" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* 2. MISSION & VISION (#mission) */}
      <section id="mission" className="px-5 py-20 lg:px-10 lg:py-28 bg-background scroll-mt-20">
        <div className="mx-auto max-w-[1360px]">
          <div className="grid gap-14 lg:grid-cols-2 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                Our Engineering Mission &amp; Vision
              </p>
              <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
                Precision Motion · Intelligent Control · Industrial Reliability
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                We believe that modern automation hinges on the deterministic harmony between
                mechanical stiffness, dynamic torque generation, and sub-millisecond digital
                feedback. Rather than viewing robotics as isolated black boxes, we approach robotic
                design from foundational physical first principles.
              </p>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                Our portfolio spans the entire actuation chain: from zero-backlash strain wave gears
                and high-power brushless servo actuators to autonomous mobile wheel modules and
                complete 6-axis articulated arms.
              </p>
            </div>

            <div className="border border-border bg-card p-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-signal">
                Who We Serve
              </span>
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

      {/* 3. CORE DESIGN PRINCIPLES */}
      <section className="border-t border-border/40 bg-card px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              Design Principles
            </p>
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
              <div key={title} className="border border-border bg-background p-8 rounded-md">
                <Icon className="text-signal mb-4" size={28} />
                <h3 className="font-display text-2xl uppercase tracking-wide text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ENGINEERING CAPABILITIES (#capabilities) */}
      <section
        id="capabilities"
        className="border-t border-border/40 bg-background px-5 py-20 lg:px-10 lg:py-24 scroll-mt-20"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              Technical Competencies
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              Core Engineering Capabilities
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
              From finite element stress simulations of flexspline tooth profiles to deterministic
              multi-axis trajectory planning on real-time fieldbuses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="border border-border bg-card p-6 rounded-lg flex flex-col justify-between">
              <div>
                <Cpu className="text-signal mb-3" size={24} />
                <h3 className="text-lg font-bold text-foreground">Mechatronics &amp; Joint Design</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Design of compact frameless BLDC motors, dual absolute optical feedback systems,
                  and sub-arcminute harmonic gearheads integrated directly into cast aluminum robotic links.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <Link
                  to="/technology/intelligent-actuators"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-signal hover:underline"
                >
                  <span>Explore Actuator Studio</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div className="border border-border bg-card p-6 rounded-lg flex flex-col justify-between">
              <div>
                <CircuitBoard className="text-signal mb-3" size={24} />
                <h3 className="text-lg font-bold text-foreground">Deterministic Motion Control</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  High-bandwidth EtherCAT (CoE) and PROFINET IRT slave nodes supporting cyclic
                  synchronous position (CSP) and torque (CST) modes with sub-microsecond synchronization.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <Link
                  to="/technology/motion-studio"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-signal hover:underline"
                >
                  <span>Open Motion Studio</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div className="border border-border bg-card p-6 rounded-lg flex flex-col justify-between">
              <div>
                <Wrench className="text-signal mb-3" size={24} />
                <h3 className="text-lg font-bold text-foreground">Turnkey Systems Engineering</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Full cell simulation, safety envelope calculation per ISO 13849-1, custom vacuum/magnetic
                  end-effector design, and automated transfer track commissioning.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <Link
                  to="/engineering-services"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-signal hover:underline"
                >
                  <span>Engineering Services</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. QUALITY & CERTIFICATIONS (#quality) */}
      <section
        id="quality"
        className="border-t border-border/40 bg-card px-5 py-20 lg:px-10 lg:py-24 scroll-mt-20"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                Traceable Compliance
              </p>
              <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
                Quality Systems &amp; International Standards
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground max-w-2xl">
                Every component shipped from INDUS manufacturing facilities is serialized and
                benchmarked against rigorous international mechanical and electrical directives.
                Our quality management system guarantees repeatable precision across prototype and
                high-volume OEM production runs.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="border border-border/80 bg-background p-4 rounded">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Award size={18} className="text-signal" />
                    <span>ISO 9001:2015</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Certified quality management system across mechanical design, component assembly, and testing.
                  </p>
                </div>

                <div className="border border-border/80 bg-background p-4 rounded">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <ShieldCheck size={18} className="text-signal" />
                    <span>DIN 3990 &amp; ISO 9283</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Calculation of load capacity on cylindrical gears and standard performance criteria for industrial robots.
                  </p>
                </div>

                <div className="border border-border/80 bg-background p-4 rounded">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <CircuitBoard size={18} className="text-signal" />
                    <span>IEC 61800-5-2 (STO / SLS)</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Adjustable speed electrical power drive systems functional safety certification (Safe Torque Off).
                  </p>
                </div>

                <div className="border border-border/80 bg-background p-4 rounded">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Factory size={18} className="text-signal" />
                    <span>ISO 13849-1 (Cat 4 / PL e)</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Safety of machinery safety-related parts of control systems architecture design.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border bg-background p-8 rounded-xl text-center space-y-4">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-signal/10 text-signal border border-signal">
                <ShieldCheck size={36} />
              </div>
              <h3 className="font-display text-2xl uppercase tracking-wider text-foreground">
                Metrology &amp; Inspection
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Coordinate Measuring Machines (CMM) with sub-micron volumetric precision,
                laser interferometers, and dyno test benches monitor 100% of critical gear tolerances.
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-signal/50 text-signal hover:bg-signal/10 text-xs font-bold"
                >
                  <Link to="/resources/faqs">View Technical Standards FAQ</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PARTNERS & INTEGRATION ECOSYSTEM (#partners) */}
      <section
        id="partners"
        className="border-t border-border/40 bg-background px-5 py-20 lg:px-10 lg:py-24 scroll-mt-20"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              Ecosystem
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              Integration &amp; Industry Partners
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              We collaborate with premier automation distributors, regional system integrators,
              fieldbus consortia, and university research labs across the robotics domain.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-border bg-card p-6 rounded-lg">
              <h4 className="text-base font-bold text-foreground">System Integrators</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Certified turnkey automation builders deploying INDUS precision reducers, articulated
                arms, and autonomous mobile bases into automotive, pharmaceutical, and electronic factories.
              </p>
            </div>

            <div className="border border-border bg-card p-6 rounded-lg">
              <h4 className="text-base font-bold text-foreground">Open Fieldbus Consortia</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Full conformance testing and interoperability verification with EtherCAT Technology Group
                (ETG), CiA (CAN in Automation), and PI (PROFIBUS &amp; PROFINET International).
              </p>
            </div>

            <div className="border border-border bg-card p-6 rounded-lg">
              <h4 className="text-base font-bold text-foreground">Research &amp; OEM Alliances</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Long-term joint development agreements with machine tool manufacturers and robotics
                laboratories prototyping next-generation humanoid and collaborative kinematics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT TECHNICAL DESK (#contact) */}
      <section
        id="contact"
        className="border-t border-border/40 bg-card px-5 py-20 lg:px-10 lg:py-24 scroll-mt-20"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="border border-border bg-background p-8 sm:p-12 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                Direct Engineering Desk
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl text-foreground">
                Connect with INDUS Engineering HQ
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Whether you need custom gearhead ratio validation, 3D CAD models, or on-site
                system integration consultation, our senior engineers are ready to assist.
              </p>

              <div className="mt-6 flex flex-wrap gap-6 text-xs text-muted-foreground font-mono">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-signal" />
                  <a href="tel:+919444024848" className="hover:text-foreground">
                    +91 94440 24848
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-signal" />
                  <a href={`mailto:${companyConfig.email}`} className="hover:text-foreground">
                    {companyConfig.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-signal" />
                  <span>{companyConfig.headquarters}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button asChild className="bg-signal text-signal-foreground font-bold uppercase text-xs h-11">
                <Link to="/contact">Contact Support Desk</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-border text-foreground hover:text-signal font-bold uppercase text-xs h-11"
              >
                <Link to="/contact/engineering-enquiry">Submit Engineering RFQ</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
