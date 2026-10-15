import React from "react";
import { Link } from "@tanstack/react-router";
import { Move3d, ArrowRight, MessageSquare, Mail, Phone, MapPin, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";

export function Footer() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="border-t border-border/30 bg-[#0b1329] text-slate-100">
      {/* Top Banner CTA */}
      <div className="border-b border-border/20 bg-slate-900/60 px-5 py-12 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
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
              className="h-11 rounded-md bg-signal text-signal-foreground hover:bg-[#86b800] font-bold uppercase text-xs shadow-[0_0_20px_rgba(149,204,0,0.25)]"
            >
              <Link to="/contact/engineering-enquiry">
                Request Engineering RFQ <ArrowRight size={15} className="ml-1.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-md border-surface-foreground/30 bg-transparent text-surface-foreground hover:bg-surface-elevated hover:text-signal font-bold uppercase text-xs"
            >
              <Link to="/book-consultation">
                <Calendar size={15} className="mr-1.5" />
                Book Consultation
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleWhatsApp}
              className="h-11 rounded-md border-surface-foreground/30 bg-transparent text-surface-foreground hover:border-signal hover:text-signal font-bold uppercase text-xs"
            >
              <MessageSquare size={15} className="mr-1.5 text-signal" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Main 4 Structured Groups */}
      <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info & Mission (Col 1 & 2 on desktop) */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded bg-amber-500 text-slate-950 font-bold shadow">
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
                <MapPin size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Chennai Robotics Corridor &amp; North America Engineering Center</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-amber-400 shrink-0" />
                <span>{companyConfig.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-amber-400 shrink-0" />
                <span>{companyConfig.phone}</span>
              </p>
            </div>
          </div>

          {/* GROUP 1: PRODUCTS */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-amber-400 font-bold">
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
                <Link to="/products" className="font-semibold uppercase tracking-wider text-amber-400 hover:underline flex items-center gap-1">
                  <span>Complete Product Catalogue</span>
                  <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* GROUP 2: SOLUTIONS & INDUSTRIES */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-amber-400 font-bold">
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
                <Link to="/solutions" className="font-semibold uppercase tracking-wider text-amber-400 hover:underline flex items-center gap-1">
                  <span>Explore All Solutions</span>
                  <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* GROUP 3: RESOURCES */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-amber-400 font-bold">
              Resources &amp; Tech
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/resources" className="text-slate-300 hover:text-white transition-colors">
                  Technical Datasheets &amp; CAD Files
                </Link>
              </li>
              <li>
                <Link to="/technology" className="text-slate-300 hover:text-white transition-colors">
                  Motion Technology Architectures
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-slate-300 hover:text-white transition-colors">
                  Robotics Engineering FAQs
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-slate-300 hover:text-white transition-colors">
                  Engineering Product Finder &amp; Search
                </Link>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => openModal("quote")}
                  className="font-semibold uppercase tracking-wider text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Request Quick Quotation</span>
                  <ArrowRight size={12} />
                </button>
              </li>
            </ul>
          </div>

          {/* GROUP 4: COMPANY & CONTACT */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-amber-400 font-bold">
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
                  className="font-bold text-amber-400 hover:underline flex items-center gap-1"
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
            <span className="grid size-6 place-items-center rounded border border-amber-500/40 text-amber-400">
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
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Consult an Application Engineer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
