import React, { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Move3d, ArrowRight, MessageSquare, Mail, Phone, MapPin, Calendar, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Send, BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { toast } from "sonner";
import { trackDigitalPresence } from "@/trackDigitalPresence";

export function Footer() {
  const { openModal } = useModals();

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterHoneypot, setNewsletterHoneypot] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
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
          setNewsletterMessage("Welcome to INDUS Engineering Insights! A confirmation email and resource package has been dispatched.");
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
    <footer className="border-t border-slate-800/80 bg-[#101B2D] text-slate-100">
      {/* Top Banner CTA */}
      <div className="border-b border-slate-800/60 bg-slate-900/40 px-5 py-12 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              <ShieldCheck size={13} />
              <span>Engineering Co-Development & Sizing</span>
            </div>
            <h3 className="mt-2 font-display text-2xl uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
              Tell Us What You&apos;re Building
            </h3>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-300 sm:text-sm">
              From zero-backlash joint torque calculations to full cell kinematics, share your application requirements with our Senior Systems Architects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="default"
              size="lg"
              className="h-11 rounded-md bg-primary text-white hover:bg-[#1a74dc] font-bold uppercase text-xs shadow-[0_0_16px_rgba(35,136,255,0.35)]"
            >
              <Link to="/contact/engineering-enquiry">
                Request Engineering RFQ <ArrowRight size={15} className="ml-1.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-md border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800 hover:border-primary font-bold uppercase text-xs"
            >
              <Link to="/book-consultation">
                <Calendar size={15} className="mr-1.5 text-primary" />
                Book Consultation
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleWhatsApp}
              className="h-11 rounded-md border-slate-700 bg-slate-900/60 text-white hover:border-primary hover:text-white font-bold uppercase text-xs"
            >
              <MessageSquare size={15} className="mr-1.5 text-emerald-400" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Engineering Newsletter & Technical Insights Subscription */}
      <div className="border-b border-slate-800/60 bg-gradient-to-b from-slate-900/60 to-[#101B2D] px-5 py-10 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0c1424]/90 p-6 shadow-2xl backdrop-blur-md md:p-8 lg:p-10">
            {/* Subtle Industrial Accent Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-signal/10 blur-3xl" />

            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Context & Authority */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                  <BookOpen size={13} />
                  <span>Technical Bulletins &bull; Kinematics &bull; Motion Sizing</span>
                </div>
                <h3 className="mt-3 font-display text-xl uppercase tracking-tight text-white sm:text-2xl lg:text-3xl">
                  Engineering Insights from INDUS Robotics
                </h3>
                <p className="mt-2.5 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Subscribe to receive quarterly technical whitepapers, precision reducer sizing formulas, zero-backlash engineering analyses, and industrial robotics product updates.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-signal" />
                    Zero spam &bull; Pure engineering content
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-signal" />
                    Quarterly whitepapers &amp; sizing tools
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-signal" />
                    Instant 2026 Master Catalogue access
                  </span>
                </div>
              </div>

              {/* Right Column: Controlled Form */}
              <div className="lg:col-span-5">
                <form onSubmit={handleNewsletterSubmit} className="space-y-3" noValidate>
                  {/* Anti-spam honeypot */}
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

                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <div className="relative flex-1">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => {
                          setNewsletterEmail(e.target.value);
                          if (newsletterStatus !== "idle") setNewsletterStatus("idle");
                        }}
                        placeholder="engineer@enterprise.com"
                        aria-label="Corporate or engineering email"
                        disabled={newsletterStatus === "loading"}
                        className="h-11 w-full rounded-md border border-slate-700 bg-slate-950/80 pl-10 pr-4 text-xs text-white placeholder-slate-500 shadow-inner outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={newsletterStatus === "loading"}
                      className="h-11 shrink-0 rounded-md bg-primary px-6 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(35,136,255,0.35)] hover:bg-[#1a74dc] disabled:opacity-60"
                    >
                      {newsletterStatus === "loading" ? (
                        <>
                          <Loader2 size={14} className="mr-1.5 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe
                          <Send size={13} className="ml-1.5" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Status Messages */}
                  {newsletterStatus === "success" && (
                    <div className="flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/15 p-2.5 text-xs text-emerald-400">
                      <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                      <span>{newsletterMessage}</span>
                    </div>
                  )}

                  {newsletterStatus === "duplicate" && (
                    <div className="flex items-center gap-2 rounded-md border border-primary/40 bg-primary/15 p-2.5 text-xs text-blue-300">
                      <CheckCircle2 size={15} className="shrink-0 text-primary" />
                      <span>{newsletterMessage}</span>
                    </div>
                  )}

                  {newsletterStatus === "error" && (
                    <div className="flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/15 p-2.5 text-xs text-red-300">
                      <AlertCircle size={15} className="shrink-0 text-red-400" />
                      <span>{newsletterMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>By subscribing, you agree to receive technical communications.</span>
                    <button
                      type="button"
                      onClick={() => openModal("quote")}
                      className="inline-flex items-center gap-1 text-primary hover:text-signal hover:underline cursor-pointer font-medium"
                    >
                      <Download size={11} />
                      <span>Request Brochure</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4 Structured Groups */}
      <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info & Mission (Col 1 & 2 on desktop) */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded bg-primary text-white font-bold shadow">
                <Move3d size={18} />
              </span>
              <span className="font-display text-xl font-bold uppercase tracking-wider text-white">
                INDUS
              </span>
            </Link>

            <p className="text-xs leading-5 text-slate-300">
              High-precision industrial robotics components, zero-backlash reducers, guided actuators, and multi-axis kinematic motion controllers engineered for extreme duty cycles.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                <span>Chennai Robotics Corridor &amp; North America Engineering Center</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-primary shrink-0" />
                <span>{companyConfig.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-primary shrink-0" />
                <span>{companyConfig.phone}</span>
              </p>
            </div>
          </div>

          {/* GROUP 1: PRODUCTS */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-white font-bold">
              Products
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/products/$category" params={{ category: "robotic-arms" }} className="text-slate-300 hover:text-white transition-colors">
                  Robotic Arms &amp; Cobots
                </Link>
              </li>
              <li>
                <Link to="/products/$category" params={{ category: "precision-reducers" }} className="text-slate-300 hover:text-white transition-colors">
                  Precision Reducers (Harmonic / Planetary)
                </Link>
              </li>
              <li>
                <Link to="/products/$category" params={{ category: "actuators" }} className="text-slate-300 hover:text-white transition-colors">
                  Linear &amp; Rotary Actuators
                </Link>
              </li>
              <li>
                <Link to="/products/$category" params={{ category: "robotic-wheels" }} className="text-slate-300 hover:text-white transition-colors">
                  Mecanum &amp; AGV Drive Wheels
                </Link>
              </li>
              <li>
                <Link to="/products/$category" params={{ category: "control-systems" }} className="text-slate-300 hover:text-white transition-colors">
                  Multi-Axis Motion Controllers &amp; PLCs
                </Link>
              </li>
              <li className="pt-2">
                <Link to="/products" className="font-semibold uppercase tracking-wider text-primary hover:text-signal hover:underline flex items-center gap-1">
                  <span>Complete Product Catalogue</span>
                  <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* GROUP 2: SOLUTIONS & INDUSTRIES */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-white font-bold">
              Solutions &amp; Industries
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/solutions/$solutionId" params={{ solutionId: "welding-cells" }} className="text-slate-300 hover:text-white transition-colors">
                  Automated Robotic Welding Cells
                </Link>
              </li>
              <li>
                <Link to="/solutions/$solutionId" params={{ solutionId: "palletizing-systems" }} className="text-slate-300 hover:text-white transition-colors">
                  High-Speed Palletizing Systems
                </Link>
              </li>
              <li>
                <Link to="/solutions/$solutionId" params={{ solutionId: "assembly-automation" }} className="text-slate-300 hover:text-white transition-colors">
                  Precision Assembly &amp; Screwdriving
                </Link>
              </li>
              <li>
                <Link to="/applications/$applicationId" params={{ applicationId: "automotive" }} className="text-slate-300 hover:text-white transition-colors">
                  Automotive &amp; EV Battery Production
                </Link>
              </li>
              <li>
                <Link to="/applications/$applicationId" params={{ applicationId: "electronics" }} className="text-slate-300 hover:text-white transition-colors">
                  Electronics &amp; Semiconductor Cleanrooms
                </Link>
              </li>
              <li className="pt-2">
                <Link to="/solutions" className="font-semibold uppercase tracking-wider text-primary hover:text-signal hover:underline flex items-center gap-1">
                  <span>Explore All Solutions</span>
                  <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* GROUP 3: RESOURCES & ENGINEERING INTELLIGENCE */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-white font-bold">
              Engineering Intelligence
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/engineering-intelligence" className="text-slate-300 hover:text-white transition-colors flex items-center justify-between">
                  <span>Intelligence Center</span>
                  <span className="text-[9px] font-mono text-signal font-bold uppercase">Flagship</span>
                </Link>
              </li>
              <li>
                <Link to="/engineering-intelligence" search={{ section: "knowledge" } as any} className="text-slate-300 hover:text-white transition-colors flex items-center justify-between">
                  <span>Engineering Knowledge Hub</span>
                  <span className="text-[9px] font-mono text-signal font-bold uppercase">Papers</span>
                </Link>
              </li>
              <li>
                <Link to="/engineering-intelligence" search={{ section: "resources" } as any} className="text-slate-300 hover:text-white transition-colors flex items-center justify-between">
                  <span>Technical Resource Library</span>
                  <span className="text-[9px] font-mono text-signal font-bold uppercase">CAD/Docs</span>
                </Link>
              </li>
              <li>
                <Link to="/engineering-intelligence" search={{ section: "applications" } as any} className="text-slate-300 hover:text-white transition-colors">
                  Application Problem Library
                </Link>
              </li>
              <li>
                <Link to="/technology/architecture-explorer" className="text-slate-300 hover:text-white transition-colors flex items-center justify-between">
                  <span>Architecture Explorer</span>
                  <span className="text-[9px] font-mono text-signal font-bold uppercase">5-Tier</span>
                </Link>
              </li>
              <li>
                <Link to="/technology/calculators" className="text-slate-300 hover:text-white transition-colors flex items-center justify-between">
                  <span>Engineering Calculators</span>
                  <span className="text-[9px] font-mono text-signal font-bold uppercase">Physics</span>
                </Link>
              </li>
              <li>
                <Link to="/resources/faqs" className="text-slate-300 hover:text-white transition-colors">
                  Robotics Engineering FAQs
                </Link>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => openModal("quote")}
                  className="font-semibold uppercase tracking-wider text-primary hover:text-signal hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Request Engineering RFQ</span>
                  <ArrowRight size={12} />
                </button>
              </li>
            </ul>
          </div>

          {/* GROUP 4: COMPANY & CONTACT */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-white font-bold">
              Company &amp; Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About INDUS Robotics
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-slate-300 hover:text-white transition-colors">
                  Careers &amp; Engineering Openings
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact Sales &amp; Technical Support
                </Link>
              </li>
              <li>
                <Link to="/contact/engineering-enquiry" className="text-slate-300 hover:text-white transition-colors">
                  7-Section Engineering Enquiry
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/book-consultation"
                  className="font-bold text-primary hover:text-signal hover:underline flex items-center gap-1"
                >
                  <span>Book Robotics Consultation</span>
                  <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright and Legal Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-[11px] text-slate-400 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="grid size-6 place-items-center rounded border border-primary/40 text-primary">
              <Move3d size={13} />
            </span>
            <span>&copy; {new Date().getFullYear()} {companyConfig.fullName}. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/about" className="hover:text-white transition-colors">ISO 9001:2015 Certified</Link>
            <Link to="/resources" className="hover:text-white transition-colors">Compliance &amp; CE</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Global Support</Link>
            <button
              onClick={() => openModal("engineer")}
              className="text-primary hover:text-signal hover:underline cursor-pointer"
            >
              Consult an Application Engineer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
