import React from "react";
import { useRouterState } from "@tanstack/react-router";
import { MessageSquare, Send, Wrench, FileSpreadsheet } from "lucide-react";
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
    if (parts.length > 0) {
      contextName = parts[parts.length - 1].replace(/-/g, " ");
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
      {/* MOBILE STICKY CONVERSION BAR (Section 41) */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-border/40 bg-surface-dark/95 backdrop-blur-md md:hidden">
        <button
          onClick={handleWhatsApp}
          className="flex flex-1 items-center justify-center gap-1.5 border-r border-border/20 text-xs font-bold uppercase tracking-wider text-surface-foreground hover:bg-surface-elevated hover:text-signal"
        >
          <MessageSquare size={15} className="text-signal" />
          WhatsApp
        </button>

        <button
          onClick={() => openModal("quick")}
          className="flex flex-1 items-center justify-center gap-1.5 border-r border-border/20 text-xs font-bold uppercase tracking-wider text-surface-foreground hover:bg-surface-elevated hover:text-signal"
        >
          <Send size={14} className="text-signal" />
          Enquiry
        </button>

        <button
          onClick={() => openModal("quote")}
          className="flex flex-1 items-center justify-center gap-1.5 bg-signal text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90"
        >
          <FileSpreadsheet size={15} />
          Quote
        </button>
      </div>

      {/* DESKTOP PAGE-LEVEL QUICK CONTACT STRIP (Rendered cleanly on catalog/solution pages without duplicating form pages) */}
      {pathname !== "/" &&
        !pathname.startsWith("/contact") &&
        !pathname.startsWith("/careers") &&
        !pathname.startsWith("/intelligence") && (
          <aside
            aria-label="Quick Technical Support Bar"
            className="w-full border-t border-border/40 bg-card py-5 px-5 lg:px-10 hidden md:block overflow-hidden box-border"
          >
            <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-signal animate-pulse" />
                <p className="font-display text-sm uppercase tracking-wide text-foreground">
                  Have a specific technical requirement for your machine?
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal("quick")}
                  className="h-8 rounded-none border-border font-bold uppercase text-xs"
                >
                  <Send size={13} className="mr-1.5 text-signal" />
                  Quick Enquiry
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWhatsApp}
                  className="h-8 rounded-none border-border font-bold uppercase text-xs"
                >
                  <MessageSquare size={13} className="mr-1.5 text-signal" />
                  WhatsApp
                </Button>

                <Button
                  size="sm"
                  onClick={() => openModal("engineer")}
                  className="h-8 rounded-none bg-signal font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90"
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
