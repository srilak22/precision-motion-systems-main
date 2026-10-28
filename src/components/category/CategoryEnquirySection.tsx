import React from "react";
import { ArrowRight, Wrench, Calendar, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import type { Category } from "@/data/robotics";

export interface CategoryEnquirySectionProps {
  category: Category;
}

export function CategoryEnquirySection({ category }: CategoryEnquirySectionProps) {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({ type: "product", name: category.title }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="border-t border-slate-200/90 bg-[#0F172A] px-4 py-14 text-white lg:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400">
            <ShieldCheck size={13} />
            <span>Application Engineering Support</span>
          </div>

          <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-snug">
            Need Assistance Sizing {category.title}?
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our application engineers can verify inertia ratios, motor torque curves, duty cycle
            thermals, and fieldbus synchronization parameters for your machinery before purchase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            onClick={() =>
              openModal("quote", {
                productName: category.title,
                categoryName: category.title,
              })
            }
            className="h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold uppercase text-xs tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <span>Request a Quote</span>
            <ArrowRight size={14} className="ml-1.5" />
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              openModal("engineer", { categoryName: category.title })
            }
            className="h-11 rounded-lg border-slate-600 bg-transparent text-slate-100 hover:bg-white/10 hover:border-white font-bold uppercase text-xs transition-all cursor-pointer"
          >
            <Wrench size={14} className="mr-1.5 text-sky-400" />
            <span>Talk to an Engineer</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleWhatsApp}
            className="h-11 rounded-lg border-emerald-600/60 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300 font-bold uppercase text-xs transition-all cursor-pointer"
          >
            <MessageSquare size={14} className="mr-1.5" />
            <span>WhatsApp Desk</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
