import React, { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface FaqAccordionProps {
  title?: string;
  description?: string;
  faqs: FaqItem[];
  showCategories?: boolean;
  className?: string;
}

export function FaqAccordion({
  title,
  description,
  faqs,
  showCategories = false,
  className,
}: FaqAccordionProps) {
  // Derive unique categories
  const categories = showCategories
    ? ["All", ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean) as string[]))]
    : [];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs =
    showCategories && activeCategory !== "All"
      ? faqs.filter((f) => f.category === activeCategory)
      : faqs;

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-8 max-w-2xl">
          {title && (
            <h2 className="mb-3 font-display text-2xl font-bold uppercase tracking-tight text-[#101B2D] lg:text-3xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base text-[#64748B] leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Category filter tabs */}
      {showCategories && categories.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
                activeCategory === cat
                  ? "bg-[#2388FF] text-white"
                  : "border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#2388FF]/40 hover:text-[#2388FF]",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Accordion */}
      <AccordionPrimitive.Root
        type="single"
        collapsible
        className="w-full divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]"
      >
        {filteredFaqs.map((faq, i) => (
          <AccordionPrimitive.Item
            key={i}
            value={`item-${i}`}
            className="group"
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger
                className={cn(
                  "flex w-full flex-1 cursor-pointer items-start justify-between gap-4 py-5 text-left transition-colors",
                  "text-sm font-semibold text-[#101B2D] hover:text-[#2388FF]",
                  "[&[data-state=open]]:text-[#2388FF]",
                  "[&[data-state=open]>span.chevron-icon]:rotate-180",
                )}
              >
                <span className="leading-snug">{faq.question}</span>
                <span className="chevron-icon mt-0.5 shrink-0 text-[#64748B] transition-transform duration-300">
                  <ChevronDown size={18} />
                </span>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>

            <AccordionPrimitive.Content
              className={cn(
                "overflow-hidden text-sm text-[#64748B] leading-relaxed",
                "data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
              )}
            >
              <div className="pb-5 pr-8">
                {faq.category && showCategories && (
                  <span className="engineering-badge mb-3 inline-block rounded-sm text-[10px]">
                    {faq.category}
                  </span>
                )}
                <p>{faq.answer}</p>
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>

      {filteredFaqs.length === 0 && (
        <p className="py-8 text-center text-sm text-[#64748B]">
          No FAQs found for this category.
        </p>
      )}
    </div>
  );
}

export default FaqAccordion;
