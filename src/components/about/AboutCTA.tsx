import React from "react";
import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, ArrowRight, MessageSquare, Calendar, Bot } from "lucide-react";
import { companyConfig } from "@/data/config";

interface AboutCTAProps {
  onWhatsApp: () => void;
}

export function AboutCTA({ onWhatsApp }: AboutCTAProps) {
  return (
    <section id="contact-cta" className="py-20 lg:py-24 bg-[#0F172A] text-white scroll-mt-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-[#38BDF8] bg-[#0284C7]/20 border border-[#38BDF8]/30">
              <Bot size={13} className="text-[#38BDF8]" />
              ENGINEERING COLLABORATION
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Let's Build the Next Generation of Intelligent Industry.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Connect with our engineering team to explore robotics, precision motion and automation
              opportunities for your application. We assist with kinematics sizing, 3D CAD modeling,
              and plant integration.
            </p>

            {/* 3 Main Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                to="/book-consultation"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(21,94,239,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar size={14} />
                <span>Discuss Your Application</span>
              </Link>

              <Link
                to="/solutions"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Our Solutions</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-transparent hover:bg-slate-800/60 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Contact Our Engineering Team</span>
              </Link>
            </div>

            {/* Direct Engineering Desk Details */}
            <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#38BDF8]" />
                <span>Direct Engineering: </span>
                <a
                  href="tel:+919444024848"
                  className="text-white hover:text-[#38BDF8] font-bold transition-colors"
                >
                  +91 94440 24848
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#38BDF8]" />
                <a
                  href={`mailto:${companyConfig.email}`}
                  className="text-white hover:text-[#38BDF8] transition-colors"
                >
                  {companyConfig.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#38BDF8]" />
                <span>{companyConfig.headquarters}</span>
              </div>

              <button
                type="button"
                onClick={onWhatsApp}
                className="flex items-center gap-1.5 text-[#4ADE80] hover:text-emerald-300 transition-colors font-bold cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>WhatsApp Active</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
