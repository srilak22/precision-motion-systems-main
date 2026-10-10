import React from "react";
import { Link } from "@tanstack/react-router";
import { Move3d, ArrowRight, MessageSquare, Mail, Phone, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { navigationData } from "@/data/navigation";
import { useModals } from "@/components/modals/ModalContext";

export function Footer() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  const navProducts = navigationData["products"];
  const navSolutions = navigationData["solutions"];
  const navApplications = navigationData["applications"];
  const navTechnology = navigationData["technology"];
  const navResources = navigationData["resources"];
  const navAbout = navigationData["about"];

  return (
    <footer className="border-t border-border/30 bg-surface-dark text-surface-foreground">
      {/* Top Banner CTA */}
      <div className="border-b border-border/20 bg-surface-elevated/40 px-5 py-12 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              Engineering Co-Development
            </p>
            <h3 className="mt-1 font-display text-3xl uppercase tracking-tight text-surface-foreground sm:text-4xl">
              Tell Us What You're Building
            </h3>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-surface-foreground/60 sm:text-sm">
              From mechanical joint calculations to full automation cell integration, share your
              application requirements with our engineering team.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="h-12 rounded-none bg-signal px-6 font-display text-sm uppercase tracking-wider text-signal-foreground hover:bg-signal/90"
            >
              <Link to="/contact/engineering-enquiry">
                Tell Us What You're Building <ArrowRight size={16} className="ml-1.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleWhatsApp}
              className="h-12 rounded-none border-surface-foreground/25 bg-transparent px-5 font-display text-sm uppercase tracking-wider text-surface-foreground hover:bg-surface-elevated hover:text-signal"
            >
              <MessageSquare size={16} className="mr-2 text-signal" />
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          {/* PRODUCTS COLUMN */}
          <div>
            <h4 className="font-display text-base uppercase tracking-wider text-signal">
              Products
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              {navProducts?.groups?.map((group) => (
                <li key={group.slug}>
                  <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    to={group.href as any}
                    className="text-surface-foreground/65 transition-colors hover:text-surface-foreground"
                  >
                    {group.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/products" className="font-bold uppercase text-signal hover:underline">
                  All Products →
                </Link>
              </li>
            </ul>
          </div>

          {/* SOLUTIONS COLUMN */}
          <div>
            <h4 className="font-display text-base uppercase tracking-wider text-signal">
              Solutions
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              {navSolutions?.items?.map((item) => (
                <li key={item.href}>
                  <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    to={item.href as any}
                    className="text-surface-foreground/65 transition-colors hover:text-surface-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/solutions" className="font-bold uppercase text-signal hover:underline">
                  All Solutions →
                </Link>
              </li>
            </ul>
          </div>

          {/* APPLICATIONS COLUMN */}
          <div>
            <h4 className="font-display text-base uppercase tracking-wider text-signal">
              Applications
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              {navApplications?.items?.map((item) => (
                <li key={item.href}>
                  <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    to={item.href as any}
                    className="text-surface-foreground/65 transition-colors hover:text-surface-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/applications"
                  className="font-bold uppercase text-signal hover:underline"
                >
                  All Applications →
                </Link>
              </li>
            </ul>
          </div>

          {/* TECHNOLOGY COLUMN */}
          <div>
            <h4 className="font-display text-base uppercase tracking-wider text-signal">
              Technology
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              {navTechnology?.items?.map((item) => (
                <li key={item.href}>
                  <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    to={item.href as any}
                    className="text-surface-foreground/65 transition-colors hover:text-surface-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/technology" className="font-bold uppercase text-signal hover:underline">
                  All Technologies →
                </Link>
              </li>
            </ul>
          </div>

          {/* RESOURCES COLUMN */}
          <div>
            <h4 className="font-display text-base uppercase tracking-wider text-signal">
              Resources
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              {navResources?.items?.map((item) => (
                <li key={item.href}>
                  <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    to={item.href as any}
                    className="text-surface-foreground/65 transition-colors hover:text-surface-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/resources" className="font-bold uppercase text-signal hover:underline">
                  All Resources →
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY & CONTACT */}
          <div>
            <h4 className="font-display text-base uppercase tracking-wider text-signal">Company</h4>
            <ul className="mt-4 space-y-2 text-xs">
              {navAbout?.items?.map((item) => (
                <li key={item.href}>
                  <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    to={item.href as any}
                    className="text-surface-foreground/65 transition-colors hover:text-surface-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/careers"
                  className="text-surface-foreground/65 transition-colors hover:text-surface-foreground"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact/engineering-enquiry"
                  className="text-surface-foreground/65 transition-colors hover:text-surface-foreground"
                >
                  Engineering RFQ Form
                </Link>
              </li>
              <li>
                <button
                  onClick={() => openModal("engineer")}
                  className="text-left text-surface-foreground/65 transition-colors hover:text-surface-foreground"
                >
                  Consult an Engineer
                </button>
              </li>
            </ul>

            <div className="mt-6 border-t border-border/20 pt-4 text-xs text-surface-foreground/60 space-y-2">
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-signal" />
                <span>{companyConfig.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-signal" />
                <span>{companyConfig.phone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-surface-foreground/15 pt-8 text-[11px] uppercase tracking-wider text-surface-foreground/45 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="grid size-6 place-items-center border border-signal text-signal">
              <Move3d size={14} />
            </span>
            <span>© 2026 {companyConfig.fullName}. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-start">
            <span>Precision</span>
            <span>Motion</span>
            <span>Control</span>
            <span>Reliability</span>
            <span>Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
