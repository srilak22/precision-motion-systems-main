import React from "react";
import { Link } from "@tanstack/react-router";
import { UserPlus, ArrowRight, Briefcase } from "lucide-react";
import { TeamMember } from "@/data/leadershipData";

interface OpenPositionCardProps {
  member: TeamMember;
}

export function OpenPositionCard({ member }: OpenPositionCardProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#B2CCFF] bg-[#F8FAFC] p-5 sm:p-6 transition-all duration-200 hover:border-[#155EEF] hover:bg-white flex flex-col justify-between group">
      <div>
        {/* Header: Open Icon + Recruitment Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="size-13 rounded-2xl bg-[#EFF6FF] border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center font-bold text-xl shrink-0 group-hover:bg-[#155EEF] group-hover:text-white transition-colors duration-200">
            <UserPlus size={22} />
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <span className="size-1.5 rounded-full bg-[#155EEF] animate-ping" />
            OPEN POSITION
          </span>
        </div>

        {/* Role Designation */}
        <div className="mt-4">
          <span className="text-[11px] font-mono font-bold text-[#0284C7] uppercase tracking-wider block">
            We are hiring
          </span>
          <h4 className="text-base sm:text-lg font-bold text-[#101B2D] mt-0.5 group-hover:text-[#155EEF] transition-colors">
            {member.designation}
          </h4>
        </div>

        {/* Specialization */}
        {member.specialization && (
          <div className="mt-3.5 pt-3 border-t border-[#E5EAF1]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#98A2B3] block mb-1">
              Required Focus:
            </span>
            <p className="text-xs text-[#344054] font-medium leading-relaxed">
              {member.specialization}
            </p>
          </div>
        )}

        {/* Bio / Description */}
        {member.bio && (
          <p className="mt-2.5 text-[11.5px] text-[#667085] leading-relaxed">{member.bio}</p>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-6 pt-3.5 border-t border-[#E5EAF1]">
        <Link
          to="/careers"
          className="inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D1E0FF] hover:bg-[#155EEF] hover:text-white text-[#155EEF] text-xs font-bold transition-all duration-150 group/btn"
        >
          <span className="flex items-center gap-1.5">
            <Briefcase size={13} />
            <span>Apply for this Role</span>
          </span>
          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
