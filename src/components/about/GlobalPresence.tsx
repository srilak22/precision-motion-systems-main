import React from "react";
import { Globe, MapPin, Phone, Mail, Building, Clock } from "lucide-react";
import { companyConfig } from "@/data/config";

interface OfficeLocation {
  id: string;
  region: string;
  title: string;
  role: string;
  focus: string;
  location: string;
  phone?: string;
  email?: string;
  hours?: string;
}

const LOCATIONS: OfficeLocation[] = [
  {
    id: "india-hq",
    region: "India & Global Engineering HQ",
    title: "INDUS Robotics Engineering HQ & Metrology Lab",
    role: "Central R&D, Kinematics Engineering & Manufacturing Metrology",
    focus:
      "Harmonic reducer development, multi-axis arm staging, CMM inspection, and dyno test benches.",
    location: "Tech Corridor, Tamil Nadu & Karnataka Automation Hub, India",
    phone: "+91 94440 24848",
    email: companyConfig.email,
    hours: "Mon – Sat: 08:30 – 19:30 (IST)",
  },
  {
    id: "us-desk",
    region: "North American Markets",
    title: "US Industrial Automation Desk",
    role: "North American OEM Application Sizing & Systems Integration",
    focus:
      "Direct engineering sizing for automotive tier-1s, packaging machinery builders, and warehouse AMR fleets.",
    location: "North American Industrial Automation Coordination",
    phone: "+91 94440 24848",
    email: companyConfig.salesEmail,
    hours: "EST / PST Business Hours Alignment",
  },
  {
    id: "apjc-desk",
    region: "Asia-Pacific & Japan",
    title: "APJC Manufacturing Automation Desk",
    role: "Regional Integration Alliances & Factory Automation Support",
    focus:
      "Electronics manufacturing workcells, wafer transfer kinematics, and high-speed pick-and-place packaging lines.",
    location: "Asia-Pacific Regional Industrial Desk",
    phone: "+91 94440 24848",
    email: companyConfig.email,
    hours: "SGT / JST Regional Scheduling",
  },
];

export function GlobalPresence() {
  return (
    <section className="py-20 lg:py-24 bg-white border-b border-[#E5EAF1]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <Globe size={12} className="text-[#155EEF]" />
            ENGINEERING NETWORK &amp; REACH
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
            Engineering Connections. Industrial Impact.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475467] leading-relaxed">
            Collaborating across global manufacturing hubs. Whether designing a custom gearhead
            ratio for an OEM in the US or commissioning a 6-axis welding cell in India, our
            engineering network provides direct technical consultation.
          </p>
        </div>

        {/* 3 Regional Desk Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 sm:p-7 shadow-xs hover:border-[#155EEF]/50 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] block mb-2">
                  {loc.region}
                </span>

                <h3 className="text-lg font-bold text-[#101B2D] group-hover:text-[#155EEF] transition-colors">
                  {loc.title}
                </h3>

                <p className="mt-1 text-xs font-semibold text-[#0284C7]">{loc.role}</p>

                <p className="mt-3 text-xs text-[#475467] leading-relaxed">{loc.focus}</p>

                {/* Contact details */}
                <div className="mt-6 space-y-2 pt-4 border-t border-[#E5EAF1] text-xs text-[#344054]">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-[#155EEF] shrink-0 mt-0.5" />
                    <span className="font-medium text-[#475467]">{loc.location}</span>
                  </div>

                  {loc.phone && (
                    <div className="flex items-center gap-2 font-mono">
                      <Phone size={14} className="text-[#155EEF] shrink-0" />
                      <a href={`tel:${loc.phone}`} className="hover:text-[#155EEF] font-semibold">
                        {loc.phone}
                      </a>
                    </div>
                  )}

                  {loc.email && (
                    <div className="flex items-center gap-2 font-mono">
                      <Mail size={14} className="text-[#155EEF] shrink-0" />
                      <a href={`mailto:${loc.email}`} className="hover:text-[#155EEF]">
                        {loc.email}
                      </a>
                    </div>
                  )}

                  {loc.hours && (
                    <div className="flex items-center gap-2 text-[11px] text-[#667085]">
                      <Clock size={13} className="text-[#98A2B3] shrink-0" />
                      <span>{loc.hours}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-3.5 border-t border-[#E5EAF1]">
                <span className="text-[10.5px] font-mono text-[#16A34A] font-semibold flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  Active Technical Enquiry Desk
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
