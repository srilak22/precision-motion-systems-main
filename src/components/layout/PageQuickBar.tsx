import React from "react";
import { useRouterState, Link } from "@tanstack/react-router";
import { MessageSquare, Send, Wrench, FileSpreadsheet, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";

export function PageQuickBar() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { openModal } = useModals();

  // Handle WhatsApp click with context
  const handleWhatsApp = () => {
    let contextName: string | undefined;
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length > 0 && parts[parts.length - 1]) {
      contextName = parts[parts.length - 1]!.replace(/-/g, " ");
    }
    window.open(
      companyConfig.getWhatsAppUrl({
        type: pathname.includes("products")
          ? "product"
          : pathname.includes("applications")
            ? "application"
            : "general",
        name: contextName,
      }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      {/* MOBILE STICKY CONVERSION BAR (GAP-04) */}
      <nav
        aria-label="Mobile Persistent Conversion Bar"
        className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-stretch border-t border-slate-200/80 bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden"
      >
        <a
          href={`tel:${companyConfig.phone}`}
          className="flex flex-1 items-center justify-center gap-1.5 border-r border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:text-[#155EEF] transition-colors"
          aria-label="Call Robotics Specialist"
        >
          <Phone size={15} className="text-[#155EEF]" />
          <span>Call</span>
        </a>

        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex flex-1 items-center justify-center gap-1.5 border-r border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:text-[#16A34A] transition-colors cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare size={15} className="text-[#16A34A]" />
          <span>WhatsApp</span>
        </button>

        <Link
          to="/quote"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
              e.preventDefault();
              openModal("quote");
            }
          }}
          className="flex flex-1 items-center justify-center gap-1.5 bg-[#155EEF] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] transition-colors shadow-xs"
          aria-label="Request a formal quotation"
        >
          <FileSpreadsheet size={15} />
          <span>Request Quote</span>
        </Link>
      </nav>

      {/* DESKTOP PAGE-LEVEL QUICK CONTACT STRIP (Rendered above footer or on bottom of internal pages) */}
      {pathname !== "/" && (
        <aside
          aria-label="Quick Technical Support Bar"
          className="border-t border-border/40 bg-card py-6 px-5 lg:px-10 hidden md:block"
        >
          <div className="mx-auto flex max-w-[1440px] items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-signal animate-pulse" />
              <p className="font-display text-base uppercase text-foreground">
                Have a specific technical requirement for your machine?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openModal("quick")}
              >
                <Send size={13} className="mr-1.5 text-signal" />
                Quick Enquiry
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleWhatsApp}
              >
                <MessageSquare size={13} className="mr-1.5 text-signal" />
                WhatsApp
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => openModal("engineer")}
              >
                <Wrench size={13} className="mr-1.5" />
                Talk to an Engineer
              </Button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
