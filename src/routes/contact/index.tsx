import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, Phone, MapPin, MessageSquare, Wrench, Clock, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";

export const Route = createFileRoute("/contact/")({
  head: () => ({
    meta: [
      { title: "Contact Hub & Engineering Inquiries | INDUS Industrial Robotics" },
      {
        name: "description",
        content:
          "Connect with INDUS Industrial Robotics: technical consultations, quotation requests, application engineering, and direct WhatsApp communication.",
      },
    ],
  }),
  component: ContactIndexPage,
});

export function ContactIndexPage() {
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
            Engineering Consultation & Support
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            Contact INDUS Robotics
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            Connect directly with our application engineers. Whether you need component sizing verification, a formal commercial quotation, or custom OEM joint development, we are ready to assist.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild className="h-12 rounded-none bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-signal/90">
              <Link to="/contact/engineering-enquiry">
                Open Full Engineering Form <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-signal" />
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="px-5 py-20 lg:px-10 lg:py-28 bg-background">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Engineering Consultation */}
            <div className="flex flex-col justify-between border border-border bg-card p-8">
              <div>
                <Wrench className="text-signal mb-4" size={28} />
                <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
                  Technical Sizing Support
                </h2>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  Speak directly with an automation engineer to discuss dynamic inertia calculations, duty cycle thermals, or custom kinematic layouts.
                </p>

                <div className="mt-6 space-y-2 border-t border-border/40 pt-4 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-signal" />
                    <span>{companyConfig.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-signal" />
                    <span>{companyConfig.supportHours}</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Button
                  className="w-full rounded-none bg-signal text-xs font-bold uppercase text-signal-foreground hover:bg-signal/90"
                  onClick={() => openModal("engineer")}
                >
                  Consult an Engineer
                </Button>
              </div>
            </div>

            {/* Commercial RFQ */}
            <div className="flex flex-col justify-between border border-border bg-card p-8">
              <div>
                <FileSpreadsheet className="text-signal mb-4" size={28} />
                <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
                  Commercial Quotations
                </h2>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  Submit itemized BOMs, quantities, and delivery schedules for formal commercial pricing, volume discounts, and shipping estimates.
                </p>

                <div className="mt-6 space-y-2 border-t border-border/40 pt-4 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-signal" />
                    <span>{companyConfig.salesEmail}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-signal" />
                    <span>{companyConfig.phone}</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Button
                  variant="outline"
                  className="w-full rounded-none border-border text-xs font-bold uppercase"
                  onClick={() => openModal("quote")}
                >
                  Request a Quote
                </Button>
              </div>
            </div>

            {/* Direct WhatsApp Channel */}
            <div className="flex flex-col justify-between border border-border bg-card p-8">
              <div>
                <MessageSquare className="text-signal mb-4" size={28} />
                <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
                  WhatsApp Messaging
                </h2>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  Need quick technical confirmation or component lead times? Reach our engineering desk on WhatsApp with pre-filled inquiries.
                </p>

                <div className="mt-6 space-y-2 border-t border-border/40 pt-4 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-signal" />
                    <span>{companyConfig.displayWhatsApp}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-signal" />
                    <span>Fast Response (Business Hours)</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Button
                  variant="outline"
                  className="w-full rounded-none border-signal/50 text-xs font-bold uppercase text-foreground hover:bg-signal hover:text-signal-foreground"
                  onClick={handleWhatsApp}
                >
                  Chat on WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Long Form Banner */}
          <div className="mt-16 border border-signal/40 bg-surface-dark p-8 sm:p-12 text-surface-foreground">
            <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">Comprehensive RFQ</span>
                <h3 className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl">
                  Have a Detailed Engineering Requirement?
                </h3>
                <p className="mt-2 text-xs leading-6 text-surface-foreground/70 sm:text-sm">
                  Complete our 7-section engineering form to specify payload, torque, reach, operating environments, and upload CAD references.
                </p>
              </div>
              <Button asChild className="h-12 shrink-0 rounded-none bg-signal px-8 font-bold uppercase text-signal-foreground hover:bg-signal/90">
                <Link to="/contact/engineering-enquiry">
                  Open 7-Section Form <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
