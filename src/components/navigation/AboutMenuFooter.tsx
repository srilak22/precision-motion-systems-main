import React from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, Phone, MessageSquare } from "lucide-react";

interface AboutMenuFooterProps {
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick?: () => void;
}

export function AboutMenuFooter({ onLinkClick, onQuoteClick }: AboutMenuFooterProps) {
  return (
    <div className="mt-4 pt-3.5 border-t border-[#E5EAF1] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475467]">
      {/* Company positioning statement with professional icon */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-6 rounded-full bg-[#ECFDF3] border border-[#A6F4C5] text-[#16A34A] flex items-center justify-center shrink-0">
          <ShieldCheck size={14} />
        </div>
        <p className="text-[11.5px] text-[#475467] truncate">
          <span className="font-semibold text-[#101B2D]">Deterministic Robotics:</span> Sized,
          simulated, and validated for continuous 24/7 industrial duty.
        </p>
      </div>

      {/* Right-aligned CTAs */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          to="/contact"
          onClick={() => onLinkClick("Contact Engineering", "/contact")}
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded px-1.5 py-0.5"
        >
          <span>Contact Our Engineering Team</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}
