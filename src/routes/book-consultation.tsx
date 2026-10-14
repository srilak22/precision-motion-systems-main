import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ConsultationWizard } from "@/components/consultation/ConsultationWizard";
import { companyConfig } from "@/data/config";
import {
  ArrowLeft,
  CalendarCheck,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  Video,
  Building2,
  CheckCircle2,
  Wrench,
  Bot,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/book-consultation")({
  head: () =>
    buildSeoMeta({
      title: "Book a Robotics Consultation | INDUS Industrial Robotics",
      description:
        "Schedule a technical consultation with INDUS application engineers. Dynamic robot sizing, cycle time calculation, and Google Calendar appointment booking across automotive, electronics, food, pharma, and logistics industries.",
      path: "/book-consultation",
    }),
  component: BookRoboticsConsultationPage,
});

function BookRoboticsConsultationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-14 text-surface-foreground lg:px-10 lg:py-20 relative overflow-hidden">
        <div className="mx-auto max-w-[1440px]">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-surface-foreground/60 hover:text-signal"
            >
              <ArrowLeft size={13} />
              Home
            </Link>
            <span className="text-surface-foreground/40">/</span>
            <Link
              to="/contact"
              className="text-xs uppercase tracking-wider text-surface-foreground/60 hover:text-signal font-bold"
            >
              Contact Hub
            </Link>
            <span className="text-surface-foreground/40">/</span>
            <span className="text-xs uppercase tracking-wider text-signal font-bold">
              Book a Robotics Consultation
            </span>
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[.25em] text-signal">
            B2B Automation Architecture & Kinematic Sizing
          </p>

          <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[.94] sm:text-5xl lg:text-6xl">
            Book a Robotics Consultation
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-surface-foreground/80 sm:text-base">
            Select your target industry and required automation categories, outline your payload and cycle
            time targets, and schedule a live session with an INDUS robotics application architect via Google Calendar.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-surface-foreground/75">
            <div className="flex items-center gap-2">
              <CalendarCheck size={16} className="text-signal" />
              <span>Real-Time Google Calendar Synchronization</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-signal" />
              <span>30-Minute Sizing & Architecture Review</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-signal" />
              <span>Non-Disclosure & Data Protection Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Consultation Wizard + Sidebar */}
      <section className="px-5 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1440px] grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main Wizard Column */}
          <div>
            <ConsultationWizard />
          </div>

          {/* Right Sidebar Support & Info */}
          <div className="space-y-6">
            {/* Consultation Formats */}
            <div className="border border-border bg-card p-6 space-y-4">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground">
                Consultation Options
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 border border-border/60 bg-muted/20 p-3.5">
                  <Video size={17} className="text-signal shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase text-foreground">
                      Virtual Video (Google Meet)
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">
                      Live CAD screen share, robot reach envelope sizing, dynamic cycle time analysis, and proposal review.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 border border-border/60 bg-muted/20 p-3.5">
                  <Building2 size={17} className="text-signal shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase text-foreground">
                      On-Site Innovation Tour
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">
                      Visit the INDUS Industrial Robotics Facility to inspect operational robotic arms, cobots, and AMR cells.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sizing Preparation Checklist */}
            <div className="border border-border bg-card p-6 space-y-3">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground">
                Consultation Preparation
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Having the following parameters ready enables our engineers to provide immediate sizing:
              </p>

              <ul className="space-y-2 text-xs text-muted-foreground pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-signal shrink-0 mt-0.5" />
                  <span>Workpiece weight, geometry, and material</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-signal shrink-0 mt-0.5" />
                  <span>Line speed / required parts-per-hour</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-signal shrink-0 mt-0.5" />
                  <span>Reach radius & layout boundaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-signal shrink-0 mt-0.5" />
                  <span>Environment (dust, washdown, temperature)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-signal shrink-0 mt-0.5" />
                  <span>Preferred master PLC & fieldbus network</span>
                </li>
              </ul>
            </div>

            {/* Direct Engineering Contacts */}
            <div className="border border-border bg-card p-6 space-y-4">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-foreground">
                Urgent Line-Down or Tender?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If you have an immediate commercial bid deadline or line-down emergency, contact our engineering desk directly:
              </p>

              <div className="space-y-2.5 pt-1 text-xs">
                <a
                  href={`tel:${companyConfig.contact.phone.raw}`}
                  className="flex items-center gap-3 border border-border p-3 transition-colors hover:border-signal hover:bg-muted/40"
                >
                  <Phone size={15} className="text-signal" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-muted-foreground">
                      Direct Applications Line
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {companyConfig.contact.phone.display}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${companyConfig.contact.email.general}`}
                  className="flex items-center gap-3 border border-border p-3 transition-colors hover:border-signal hover:bg-muted/40"
                >
                  <Mail size={15} className="text-signal" />
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-muted-foreground">
                      Engineering Desk
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {companyConfig.contact.email.general}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
