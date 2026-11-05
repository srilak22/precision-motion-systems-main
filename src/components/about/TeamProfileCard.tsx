import React from "react";
import { Building2, GraduationCap, MapPin, ArrowRight, ExternalLink } from "lucide-react";
import { TeamMember } from "@/data/leadershipData";

interface TeamProfileCardProps {
  member: TeamMember;
  isExecutive?: boolean;
  onSelect?: (member: TeamMember) => void;
}

export function TeamProfileCard({ member, isExecutive = false, onSelect }: TeamProfileCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(member);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View profile details for ${member.name}`}
      className={`group cursor-pointer rounded-2xl border transition-all duration-200 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] ${
        isExecutive
          ? "border-[#B2CCFF] bg-gradient-to-b from-white to-[#F8FAFC] p-6 shadow-sm hover:shadow-xl hover:border-[#155EEF] hover:-translate-y-1"
          : "border-[#E5EAF1] bg-white p-5 shadow-2xs hover:shadow-lg hover:border-[#155EEF]/60 hover:-translate-y-0.5"
      }`}
    >
      <div>
        {/* Top Header: Initials Avatar + Category/Affiliation Tag */}
        <div className="flex items-start justify-between gap-3">
          {/* Professional Initials Avatar */}
          <div
            className={`rounded-2xl flex items-center justify-center font-bold text-white shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105 ${
              isExecutive
                ? "size-15 sm:size-16 text-lg sm:text-xl"
                : "size-12 sm:size-13 text-sm sm:text-base"
            } bg-gradient-to-br ${member.avatarColor || "from-blue-600 to-slate-800"}`}
          >
            <span>{member.initials || member.name.slice(0, 2).toUpperCase()}</span>
          </div>

          {/* Affiliation / Status Badge */}
          <div className="flex flex-col items-end gap-1 min-w-0">
            {member.affiliation && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF] text-right truncate max-w-[160px]">
                <Building2 size={11} className="shrink-0" />
                <span className="truncate">{member.affiliation}</span>
              </span>
            )}
            {member.qualification && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold text-[#475467] bg-[#F1F5F9] border border-[#E2E8F0]">
                <GraduationCap size={11} className="shrink-0" />
                <span>{member.qualification}</span>
              </span>
            )}
            {member.employmentType === "Intern" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#0284C7] bg-[#E0F2FE]/70 border border-[#38BDF8]/40">
                <span>Intern Associate</span>
              </span>
            )}
          </div>
        </div>

        {/* Member Name */}
        <div className="mt-4">
          <h4
            className={`font-bold text-[#101B2D] group-hover:text-[#155EEF] transition-colors leading-snug ${
              isExecutive ? "text-lg sm:text-xl tracking-tight" : "text-base"
            }`}
          >
            {member.name}
          </h4>

          {/* Designation */}
          <p
            className={`font-semibold mt-0.5 leading-snug line-clamp-2 ${
              isExecutive ? "text-xs sm:text-sm text-[#155EEF]" : "text-xs text-[#0284C7]"
            }`}
          >
            {member.designation}
          </p>
        </div>

        {/* Institution or Location Details */}
        {(member.institution || member.location) && (
          <div className="mt-2.5 space-y-1">
            {member.institution && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#475467]">
                <GraduationCap size={13} className="text-[#155EEF] shrink-0" />
                <span className="truncate">{member.institution}</span>
              </div>
            )}
            {member.location && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#667085]">
                <MapPin size={13} className="text-[#667085] shrink-0" />
                <span className="truncate">{member.location}</span>
              </div>
            )}
          </div>
        )}

        {/* Technical Specialization */}
        {member.specialization && (
          <div className="mt-3.5 pt-3 border-t border-[#F2F4F7]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#98A2B3] block mb-1">
              Focus Area:
            </span>
            <p className="text-xs text-[#344054] font-medium leading-relaxed line-clamp-2">
              {member.specialization}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer Indicator with Hover Arrow */}
      <div className="mt-5 pt-3 border-t border-[#F2F4F7] flex items-center justify-between text-[11px] font-mono text-[#98A2B3]">
        <span className="text-[10px] font-semibold text-[#16A34A] flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-[#16A34A]" />
          Verified Profile
        </span>
        <span className="text-[#155EEF] font-bold inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">
          <span>Details</span>
          <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}
