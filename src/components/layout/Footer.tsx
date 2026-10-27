import React, { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Move3d,
  ArrowRight,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { toast } from "sonner";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

export function Footer() {
  const { openModal } = useModals();

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterHoneypot, setNewsletterHoneypot] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "loading" | "success" | "duplicate" | "error"
  >("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleWhatsApp = () => {
    trackDigitalPresence("contact", "Footer WhatsApp", "Opened WhatsApp from footer");
    trackClarityEvent("footer_whatsapp_click");
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  const handleQuoteClick = () => {
    trackDigitalPresence("cta_click", "Footer Request Quote", "Opened Quote Modal");
    trackClarityEvent("footer_quote_click");
    openModal("quote");
  };

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanEmail = newsletterEmail.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setNewsletterStatus("error");
      setNewsletterMessage("Please enter a valid engineering or corporate email address.");
      return;
    }

    setNewsletterStatus("loading");
    setNewsletterMessage("");

    try {
      trackDigitalPresence("newsletter_submit", "Footer", `Attempting subscription for ${cleanEmail.split("@")[1] || "user"}`);
      const res = await fetch("/api/email?action=subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          honeypot: newsletterHoneypot,
          source: "footer-newsletter",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        if (data.status === "already_subscribed") {
          setNewsletterStatus("duplicate");
          setNewsletterMessage("You are already subscribed to INDUS Engineering Insights.");
          toast.info("You're already subscribed to INDUS Engineering Insights.");
        } else {
          setNewsletterStatus("success");
          setNewsletterMessage("Welcome to INDUS Engineering Insights! A confirmation and resource package has been dispatched.");
          toast.success("Subscribed! Engineering welcome package sent.");
          setNewsletterEmail("");
        }
      } else {
        setNewsletterStatus("error");
        setNewsletterMessage(data.error || "Unable to complete subscription. Please try again.");
        toast.error(data.error || "Subscription failed.");
      }
    } catch {
      setNewsletterStatus("error");
      setNewsletterMessage("Network connectivity issue. Please try again later.");
      toast.error("Network issue. Please try again.");
    }
  };

  return (
    <footer className="border-t border-[#E2E8F0] bg-white text-[#1E293B]">
      {/* 1. TOP ENGINEERING CO-DEVELOPMENT CONVERSION BANNER */}
      <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-10 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0284C7]/30 bg-[#E0F2FE]/80 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#0284C7]">
              <ShieldCheck size={13} />
              <span>Engineering Co-Development &amp; Sizing</span>
            </div>
            <h3 className="mt-2.5 font-display text-2xl uppercase tracking-tight text-[#0F172A] sm:text-3xl">
              Tell Us What You&apos;re Building
            </h3>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-[#475467] leading-relaxed">
              From zero-backlash joint torque calculations to complete multi-axis kinematics, collaborate directly with our senior application architects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Primary Action: Get a Quote */}
            <Button
              type="button"
              onClick={handleQuoteClick}
              size="lg"
              className="h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold uppercase text-xs tracking-wider shadow-sm transition-all"
            >
              Get a Quote <ArrowRight size={14} className="ml-1.5" />
            </Button>

            {/* Secondary Action: Book a Consultation */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-lg border-[#0284C7]/40 bg-[#E0F2FE]/60 text-[#0284C7] hover:bg-[#BAE6FD] hover:text-[#0369A1] font-bold uppercase text-xs transition-all"
            >
              <Link to="/book-consultation">
                <Calendar size={14} className="mr-1.5 text-[#0284C7]" />
                Book a Consultation
              </Link>
            </Button>

            {/* WhatsApp Integration */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleWhatsApp}
              className="h-11 rounded-lg border-[#CBD5E1] bg-white text-[#15803D] hover:bg-[#F0FDF4] hover:border-[#86EFAC] font-bold uppercase text-xs transition-all"
            >
              <MessageSquare size={14} className="mr-1.5 text-[#16A34A]" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* 2. TECHNICAL NEWSLETTER SUBSCRIPTION STRIP */}
      <div className="border-b border-[#E2E8F0] bg-white px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Context & Bulletins */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#0284C7]/30 bg-[#E0F2FE]/60 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#0284C7]">
                  <BookOpen size={13} />
                  <span>Technical Bulletins &bull; Kinematics &bull; Motion Sizing</span>
                </div>
                <h4 className="mt-2.5 font-display text-lg uppercase tracking-tight text-[#0F172A] sm:text-xl">
                  Engineering Insights from INDUS Robotics
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-[#475467] leading-relaxed">
                  Subscribe to receive precision reducer sizing formulas, zero-backlash engineering analyses, and industrial robotics release notes.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#16A34A]" />
                    Zero spam &bull; Pure engineering content
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#16A34A]" />
                    Quarterly whitepapers &amp; sizing tools
                  </span>
                </div>
              </div>

              {/* Right Column: Controlled Form */}
              <div className="lg:col-span-5">
                <form onSubmit={handleNewsletterSubmit} className="space-y-2.5" noValidate>
                  <input
                    type="text"
                    name="_hp"
                    value={newsletterHoneypot}
                    onChange={(e) => setNewsletterHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => {
                          setNewsletterEmail(e.target.value);
                          if (newsletterStatus !== "idle") setNewsletterStatus("idle");
                        }}
                        placeholder="engineer@company.com"
                        aria-label="Corporate engineering email"
                        disabled={newsletterStatus === "loading"}
                        className="h-10 w-full rounded-lg border border-[#CBD5E1] bg-white pl-10 pr-4 text-xs text-[#0F172A] placeholder-[#94A3B8] shadow-2xs outline-none transition-colors focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF]"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={newsletterStatus === "loading"}
                      className="h-10 shrink-0 rounded-lg bg-[#155EEF] px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] shadow-2xs"
                    >
                      {newsletterStatus === "loading" ? (
                        <>
                          <Loader2 size={13} className="mr-1.5 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe
                          <Send size={12} className="ml-1.5" />
                        </>
                      )}
                    </Button>
                  </div>

                  {newsletterStatus === "success" && (
                    <div className="flex items-center gap-2 rounded-md border border-[#86EFAC] bg-[#F0FDF4] p-2 text-xs text-[#16A34A]">
                      <CheckCircle2 size={14} className="shrink-0 text-[#16A34A]" />
                      <span>{newsletterMessage}</span>
                    </div>
                  )}

                  {newsletterStatus === "duplicate" && (
                    <div className="flex items-center gap-2 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] p-2 text-xs text-[#1E40AF]">
                      <CheckCircle2 size={14} className="shrink-0 text-[#155EEF]" />
                      <span>{newsletterMessage}</span>
                    </div>
                  )}

                  {newsletterStatus === "error" && (
                    <div className="flex items-center gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] p-2 text-xs text-[#DC2626]">
                      <AlertCircle size={14} className="shrink-0 text-[#DC2626]" />
                      <span>{newsletterMessage}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN 5-COLUMN INDUSTRIAL ENGINEERING DIRECTORY */}
      <div className="mx-auto max-w-[1440px] px-4 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* COLUMN 1: INDUS (Logo, Description, Positioning, Contact) */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-[#155EEF] text-white font-bold shadow-xs">
                <Move3d size={18} />
              </span>
              <span className="font-sans text-xl font-black uppercase tracking-tight text-[#0F172A]">
                INDUS
              </span>
            </Link>

            <p className="text-xs leading-relaxed text-[#475467]">
              High-precision industrial robotics components, zero-backlash reducers, guided actuators, and multi-axis kinematic motion controllers engineered for extreme duty cycles.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#475467]">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-[#155EEF] shrink-0 mt-0.5" />
                <span>Chennai Robotics Corridor &amp; North America Engineering Center</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-[#155EEF] shrink-0" />
                <a href={`mailto:${companyConfig.email}`} className="hover:text-[#155EEF] transition-colors">
                  {companyConfig.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#155EEF] shrink-0" />
                <a href={`tel:${companyConfig.phone}`} className="hover:text-[#155EEF] transition-colors font-semibold">
                  {companyConfig.phone}
                </a>
              </p>
            </div>
          </div>

          {/* COLUMN 2: PRODUCTS */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#0F172A]">
              Products
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/products/$category" params={{ category: "precision-reducers" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Precision Reducers (RV / Harmonic)
                </Link>
              </li>
              <li>
                <Link to="/products/$category" params={{ category: "precision-reducers" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Planetary Gearboxes (PGL / Helical)
                </Link>
              </li>
              <li>
                <Link to="/products/$category" params={{ category: "precision-reducers" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Harmonic Strain-Wave Reducers
                </Link>
              </li>
              <li>
                <Link to="/products/$category" params={{ category: "actuators" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Servo Actuators &amp; Linear Stages
                </Link>
              </li>
              <li>
                <Link to="/products/$category" params={{ category: "robotic-arms" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Robotic Joints &amp; Articulated Arms
                </Link>
              </li>
              <li>
                <Link to="/products/$category" params={{ category: "robotic-wheels" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Motion Components &amp; AGV Wheels
                </Link>
              </li>
              <li className="pt-2">
                <Link to="/products" className="font-semibold text-xs text-[#155EEF] hover:underline inline-flex items-center gap-1">
                  <span>Complete Product Catalogue</span>
                  <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: SOLUTIONS */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#0F172A]">
              Solutions
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/solutions/$solutionId" params={{ solutionId: "motion-control" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Motion Control Synchronization
                </Link>
              </li>
              <li>
                <Link to="/solutions/$solutionId" params={{ solutionId: "robotic-automation" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Robotic Automation Cells
                </Link>
              </li>
              <li>
                <Link to="/solutions/$solutionId" params={{ solutionId: "factory-automation" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Machine Integration &amp; CNC Tending
                </Link>
              </li>
              <li>
                <Link to="/solutions/$solutionId" params={{ solutionId: "smart-manufacturing" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Precision Positioning Systems
                </Link>
              </li>
              <li>
                <Link to="/solutions/$solutionId" params={{ solutionId: "material-handling" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Material Handling &amp; Palletizing
                </Link>
              </li>
              <li>
                <Link to="/solutions/$solutionId" params={{ solutionId: "custom-robotics" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Custom Engineering &amp; Sizing
                </Link>
              </li>
              <li className="pt-2">
                <Link to="/solutions" className="font-semibold text-xs text-[#155EEF] hover:underline inline-flex items-center gap-1">
                  <span>Explore All Solutions</span>
                  <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: INDUSTRIES */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#0F172A]">
              Industries
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/applications/$applicationId" params={{ applicationId: "automotive" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Automotive &amp; EV Powertrain
                </Link>
              </li>
              <li>
                <Link to="/applications/$applicationId" params={{ applicationId: "aerospace" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Aerospace Kinematics &amp; Tooling
                </Link>
              </li>
              <li>
                <Link to="/applications/$applicationId" params={{ applicationId: "electronics" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Electronics &amp; Semiconductor
                </Link>
              </li>
              <li>
                <Link to="/applications/$applicationId" params={{ applicationId: "packaging" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  High-Speed Packaging &amp; Sorting
                </Link>
              </li>
              <li>
                <Link to="/applications/$applicationId" params={{ applicationId: "medical-automation" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Medical &amp; Lab Automation
                </Link>
              </li>
              <li>
                <Link to="/applications/$applicationId" params={{ applicationId: "general-manufacturing" }} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  General Manufacturing
                </Link>
              </li>
              <li className="pt-2">
                <Link to="/applications" className="font-semibold text-xs text-[#155EEF] hover:underline inline-flex items-center gap-1">
                  <span>Industry Application Universe</span>
                  <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: ENGINEERING & RESOURCES */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#0F172A]">
              Engineering &amp; Resources
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/technology" className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Engineering Services &amp; Sizing
                </Link>
              </li>
              <li>
                <Link to="/technology/calculators" className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Kinematics &amp; Sizing Calculators
                </Link>
              </li>
              <li>
                <Link to="/engineering-intelligence" className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Technical Documentation &amp; CAD
                </Link>
              </li>
              <li>
                <Link to="/engineering-intelligence" search={{ section: "applications" } as any} className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Application Engineering Guides
                </Link>
              </li>
              <li>
                <a href="#roi-calculator" className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  ROI &amp; Payback Calculator
                </a>
              </li>
              <li>
                <Link to="/contact/engineering-enquiry" className="text-[#475467] hover:text-[#155EEF] transition-colors">
                  Contact Engineering Direct
                </Link>
              </li>
              <li className="pt-2">
                <Link to="/book-consultation" className="font-semibold text-xs text-[#0284C7] hover:underline inline-flex items-center gap-1">
                  <span>Book a Consultation</span>
                  <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. BOTTOM COPYRIGHT, LEGAL & COMPLIANCE BAR */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] pt-8 text-[11px] text-[#64748B] sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="grid size-5 place-items-center rounded bg-[#EFF6FF] text-[#155EEF]">
              <Move3d size={12} />
            </span>
            <span>&copy; {new Date().getFullYear()} {companyConfig.fullName}. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span className="text-[#16A34A] font-semibold flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-[#16A34A]" />
              ISO 9001:2015 Verified
            </span>
            <Link to="/about" className="hover:text-[#0F172A] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-[#0F172A] transition-colors">
              Terms of Use
            </Link>
            <Link to="/resources" className="hover:text-[#0F172A] transition-colors">
              Cookie Preferences
            </Link>
            <button
              type="button"
              onClick={() => openModal("engineer")}
              className="text-[#155EEF] hover:underline font-semibold cursor-pointer"
            >
              Consult an Application Engineer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
