import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import type { NormalizedProductData } from "./types";

interface ProductFaqsProps {
  data: NormalizedProductData;
}

export function ProductFaqs({ data }: ProductFaqsProps) {
  if (data.faqs.length === 0) {
    return null;
  }

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faqs" className="border-b border-[#E5EAF1] bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            <HelpCircle size={14} />
            <span>11. Frequently Asked Questions</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Technical FAQs &amp; Integration Guidelines
          </h2>
          <p className="mt-2 text-sm text-[#475467] leading-relaxed">
            Direct answers to common engineering questions regarding sizing verification, mechanical tolerances, fieldbus integration, and documentation for {data.name}.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="mt-8 max-w-4xl space-y-3">
          {data.faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-[#E5EAF1] bg-white transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[#F8FAFC] cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-[#172033] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#667085] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#155EEF]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-[#E5EAF1] bg-[#F8FAFC] px-5 py-4 text-xs sm:text-sm text-[#475467] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
