import React, { useEffect, useRef } from "react";
import { X, Building2, GraduationCap, MapPin, Sparkles, ShieldCheck } from "lucide-react";
import { TeamMember } from "@/data/leadershipData";

interface ProfileDetailModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export function ProfileDetailModal({ member, onClose }: ProfileDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!member) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Prevent body scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [member, onClose]);

  if (!member) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-member-name"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl border border-[#E5EAF1] bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Subtle accent bar on top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#155EEF] via-[#38BDF8] to-[#16A34A]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile details"
          className="absolute top-4 right-4 size-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#475467] hover:text-[#101B2D] flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
        >
          <X size={18} />
        </button>

        {/* Header: Avatar + Identity */}
        <div className="flex items-start gap-4 sm:gap-5 pr-8">
          <div
            className={`size-16 sm:size-20 rounded-2xl flex items-center justify-center font-bold text-white shadow-md text-xl sm:text-2xl shrink-0 bg-gradient-to-br ${
              member.avatarColor || "from-blue-600 to-slate-800"
            }`}
          >
            <span>{member.initials || member.name.slice(0, 2).toUpperCase()}</span>
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF] px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#D1E0FF] inline-block mb-1">
              {member.category.replace("-", " ").toUpperCase()}
            </span>

            <h3
              id="modal-member-name"
              className="text-xl sm:text-2xl font-bold text-[#101B2D] truncate"
            >
              {member.name}
            </h3>

            <p className="text-xs sm:text-sm font-semibold text-[#0284C7] mt-0.5">
              {member.designation}
            </p>
          </div>
        </div>

        {/* Affiliation / Qualification Badges */}
        {(member.affiliation || member.qualification || member.institution || member.location) && (
          <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-[#F2F4F7]">
            {member.affiliation && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
                <Building2 size={13} />
                <span>{member.affiliation}</span>
              </span>
            )}
            {member.qualification && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold text-[#475467] bg-[#F1F5F9] border border-[#E2E8F0]">
                <GraduationCap size={13} />
                <span>{member.qualification}</span>
              </span>
            )}
            {member.institution && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-[#475467] bg-[#F8FAFC] border border-[#E5EAF1]">
                <GraduationCap size={13} className="text-[#155EEF]" />
                <span>{member.institution}</span>
              </span>
            )}
            {member.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-[#667085] bg-[#F8FAFC] border border-[#E5EAF1]">
                <MapPin size={13} />
                <span>{member.location}</span>
              </span>
            )}
          </div>
        )}

        {/* Technical Specialization */}
        {member.specialization && (
          <div className="mt-5 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF1]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF] block mb-1">
              Technical Specialization &amp; Focus Area:
            </span>
            <p className="text-xs sm:text-sm text-[#101B2D] font-semibold leading-relaxed">
              {member.specialization}
            </p>
          </div>
        )}

        {/* Bio / Professional Scope */}
        {member.bio && (
          <div className="mt-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#98A2B3] block mb-1">
              Engineering Role &amp; Contribution:
            </span>
            <p className="text-xs sm:text-sm text-[#475467] leading-relaxed font-normal">
              {member.bio}
            </p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-[#F2F4F7] flex items-center justify-between text-xs text-[#98A2B3]">
          <span className="flex items-center gap-1.5 text-[#16A34A] font-semibold text-[11px] font-mono">
            <ShieldCheck size={14} />
            Verified INDUS Engineering Directory
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
