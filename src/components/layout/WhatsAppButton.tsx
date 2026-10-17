import React from "react";
import { useRouterState } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { companyConfig } from "@/data/config";

export function WhatsAppButton() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const handleClick = () => {
    let type: "product" | "application" | "solution" | "general" = "general";
    let name: string | undefined;

    const parts = pathname.split("/").filter(Boolean);
    if (parts.length > 0 && parts[parts.length - 1]) {
      const last = parts[parts.length - 1]!.replace(/-/g, " ");
      if (pathname.startsWith("/products")) {
        type = "product";
        name = last;
      } else if (pathname.startsWith("/applications")) {
        type = "application";
        name = last;
      } else if (pathname.startsWith("/solutions")) {
        type = "solution";
        name = last;
      }
    }

    const url = companyConfig.getWhatsAppUrl({ type, name });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Chat on WhatsApp with an INDUS engineer"
      className="fixed bottom-20 left-4 z-40 flex h-11 items-center gap-2 rounded-md border border-slate-700 bg-[#101B2D]/95 px-3.5 text-xs font-bold uppercase tracking-wider text-slate-100 shadow-2xl backdrop-blur-md transition-all hover:border-emerald-500 hover:text-white md:bottom-6 md:left-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <MessageSquare size={16} className="text-emerald-400" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
      <span className="sm:hidden">WhatsApp</span>
    </button>
  );
}
