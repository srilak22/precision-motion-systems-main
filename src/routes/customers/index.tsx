import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  GraduationCap,
  Headphones,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { FloatingEngineerCta } from "@/components/solutions/FloatingEngineerCta";

import heroCustomerImg from "@/assets/solution-manufacturing-auto.jpg";

export const Route = createFileRoute("/customers/")({
  head: () =>
    buildSeoMeta({
      title: "Customer Success, Support & Consulting | INDUS Robotics",
      description:
        "Build long-term robotics ROI with INDUS Customer Success, Integration Services, Fleet Care, Operator Training, and Consulting.",
      path: "/customers",
    }),
  component: CustomersHubPage,
});

const CUSTOMER_PILLARS = [
  {
    title: "Customer Success",
    description:
      "End-to-end Integration Services, INDUS Fleet Care, and preventive Annual Maintenance (AMC) designed for 99.4%+ fleet uptime.",
    href: "/customers/customer-success",
    icon: Award,
    highlights: ["Integration Services", "INDUS Fleet Care", "24/7 AMC SLAs"],
  },
  {
    title: "Support & Training",
    description:
      "Certify your shop-floor operators and maintenance engineers with hands-on programming bootcamps and remote telemetry support.",
    href: "/customers/support-training",
    icon: GraduationCap,
    highlights: [
      "Operator & Safety Training",
      "Remote Diagnostics",
      "Rapid Spare Parts",
    ],
  },
  {
    title: "Consulting",
    description:
      "Validate cycle times, custom EOAT grippers, and payback periods with floor audits and 3D Digital Twin simulations before capex.",
    href: "/customers/consulting",
    icon: Compass,
    highlights: [
      "Floor Audit & Feasibility",
      "3D Digital Twin",
      "ROI Modeling",
    ],
  },
];

function CustomersHubPage() {
  const { openModal } = useModals();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/60 via-white to-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                <Users size={14} />
                <span>INDUS Customer Success</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.08]">
                Build long-term success with INDUS Robotics
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                From initial floor feasibility and custom cell integration to
                operator certification and 24/7 fleet care, our engineers stay
                with you across the entire robot lifecycle.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  size="lg"
                  onClick={() => openModal("quote")}
                  className="rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold px-7 h-12 cursor-pointer"
                >
                  <span>Schedule Success Review</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <Link
                  to="/resources/case-studies"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 px-6 h-12 text-sm font-semibold text-slate-800 transition-colors"
                >
                  <span>View Case Studies</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl aspect-[16/10] bg-slate-100">
                <img
                  src={heroCustomerImg}
                  alt="INDUS Robotics customer deployment on an automated factory line"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CUSTOMER_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="size-11 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {pillar.title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                    <ul className="space-y-2 pt-2 border-t border-slate-100">
                      {pillar.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                        >
                          <CheckCircle2
                            size={15}
                            className="text-[#155EEF] shrink-0"
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to={pillar.href as never}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#155EEF] hover:text-[#1047BF] mt-6 group"
                  >
                    <span>Explore {pillar.title}</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <FloatingEngineerCta />
    </div>
  );
}
