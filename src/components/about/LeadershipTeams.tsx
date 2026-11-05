import React, { useState } from "react";
import { Users, ShieldCheck, Cpu, Sparkles, Compass } from "lucide-react";
import { TEAM_MEMBERS, TEAM_CATEGORIES, TeamCategory, TeamMember } from "@/data/leadershipData";
import { TeamProfileCard } from "./TeamProfileCard";
import { OpenPositionCard } from "./OpenPositionCard";
import { ProfileDetailModal } from "./ProfileDetailModal";

export function LeadershipTeams() {
  const [activeCategory, setActiveCategory] = useState<TeamCategory | "all">("all");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filteredMembers =
    activeCategory === "all"
      ? TEAM_MEMBERS
      : TEAM_MEMBERS.filter((m) => m.category === activeCategory);

  // Grouped members for complete structured directory
  const executiveMembers = TEAM_MEMBERS.filter((m) => m.category === "executive");
  const advisoryMembers = TEAM_MEMBERS.filter((m) => m.category === "advisory");
  const managementMembers = TEAM_MEMBERS.filter((m) => m.category === "management");
  const physicalAiMembers = TEAM_MEMBERS.filter((m) => m.category === "physical-ai");
  const motionMembers = TEAM_MEMBERS.filter((m) => m.category === "motion-control");
  const softwareMembers = TEAM_MEMBERS.filter((m) => m.category === "software");
  const internMembers = TEAM_MEMBERS.filter((m) => m.category === "interns");

  const renderCard = (member: TeamMember, isExecutive = false) => {
    if (member.isOpenRole) {
      return <OpenPositionCard key={member.id} member={member} />;
    }
    return (
      <TeamProfileCard
        key={member.id}
        member={member}
        isExecutive={isExecutive}
        onSelect={(m) => setSelectedMember(m)}
      />
    );
  };

  return (
    <section
      id="leadership-teams"
      className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-[#E5EAF1] scroll-mt-36"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* SECTION 1: LEADERSHIP HERO (TRUSTGRID.AI Inspired) */}
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Blueprint Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #94A3B8 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-[#38BDF8] bg-[#0284C7]/20 border border-[#38BDF8]/30">
              <Users size={13} className="text-[#38BDF8]" />
              THE PEOPLE BEHIND INDUS
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Leadership. Engineering. Innovation.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Meet the leaders, advisors and multidisciplinary engineering professionals driving
              robotics, precision motion and intelligent industrial automation at INDUS.
            </p>

            {/* 3 Visual Highlights */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold font-mono">
                  <ShieldCheck size={16} />
                  <span>Executive Leadership</span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                  Strategic governance, investor backing, and long-term hardware capitalization.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                <div className="flex items-center gap-2 text-[#60A5FA] text-xs font-bold font-mono">
                  <Cpu size={16} />
                  <span>Engineering Expertise</span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                  Kinematics modeling, sub-millisecond FOC firmware, and power electronics.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                <div className="flex items-center gap-2 text-[#4ADE80] text-xs font-bold font-mono">
                  <Sparkles size={16} />
                  <span>Robotics Innovation</span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                  Vision-Language-Action (VLA) physical AI, digital twins, and humanoid joints.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Filter Tabs */}
        <div className="mt-12 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            {TEAM_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const count =
                cat.id === "all"
                  ? TEAM_MEMBERS.length
                  : TEAM_MEMBERS.filter((m) => m.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-2 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] ${
                    isSelected
                      ? "bg-[#155EEF] border-[#155EEF] text-white shadow-sm font-bold"
                      : "bg-white border-[#E5EAF1] text-[#475467] hover:border-[#155EEF]/40 hover:text-[#101B2D]"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#667085]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Display: Filtered View OR Structured Category View */}
        {activeCategory !== "all" ? (
          <div className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member) => renderCard(member, member.category === "executive"))}
            </div>
          </div>
        ) : (
          <div className="mt-14 space-y-16">
            {/* SECTION 2: EXECUTIVE LEADERSHIP & BOARD OF DIRECTORS */}
            <div id="team-executive" className="scroll-mt-36">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E5EAF1]">
                <div className="size-2 rounded-full bg-[#155EEF]" />
                <h3 className="text-xl sm:text-2xl font-bold text-[#101B2D]">
                  Executive Leadership &amp; Board of Directors
                </h3>
                <span className="text-xs font-mono font-semibold text-[#667085]">
                  ({executiveMembers.length} Leaders)
                </span>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {executiveMembers.map((member) => renderCard(member, true))}
              </div>
            </div>

            {/* SECTION 3: ADVISORY BOARD */}
            <div id="team-advisory" className="scroll-mt-36">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E5EAF1]">
                <div className="size-2 rounded-full bg-[#0284C7]" />
                <h3 className="text-xl sm:text-2xl font-bold text-[#101B2D]">Advisory Board</h3>
                <span className="text-xs font-mono font-semibold text-[#667085]">
                  ({advisoryMembers.length} Advisors)
                </span>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
                {advisoryMembers.map((member) => renderCard(member))}
              </div>
            </div>

            {/* SECTION 4: EXECUTIVE MANAGEMENT & OPERATIONAL LEADERSHIP */}
            <div id="team-management" className="scroll-mt-36">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E5EAF1]">
                <div className="size-2 rounded-full bg-[#101B2D]" />
                <h3 className="text-xl sm:text-2xl font-bold text-[#101B2D]">
                  Executive Management &amp; Operational Leadership
                </h3>
                <span className="text-xs font-mono font-semibold text-[#667085]">
                  ({managementMembers.length} Leaders)
                </span>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {managementMembers.map((member) => renderCard(member))}
              </div>
            </div>

            {/* SECTION 5: PHYSICAL AI & HUMANOID ROBOTICS CORE */}
            <div id="team-physical-ai" className="scroll-mt-36">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E5EAF1]">
                <div className="size-2 rounded-full bg-[#9333EA]" />
                <h3 className="text-xl sm:text-2xl font-bold text-[#101B2D]">
                  Physical AI &amp; Humanoid Robotics Core
                </h3>
                <span className="text-xs font-mono font-semibold text-[#667085]">
                  ({physicalAiMembers.length} Roles)
                </span>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {physicalAiMembers.map((member) => renderCard(member))}
              </div>
            </div>

            {/* SECTION 6: MOTION CONTROL & MECHATRONICS ENGINEERING */}
            <div id="team-motion-control" className="scroll-mt-36">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E5EAF1]">
                <div className="size-2 rounded-full bg-[#0284C7]" />
                <h3 className="text-xl sm:text-2xl font-bold text-[#101B2D]">
                  Motion Control &amp; Mechatronics Engineering
                </h3>
                <span className="text-xs font-mono font-semibold text-[#667085]">
                  ({motionMembers.length} Specialists)
                </span>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {motionMembers.map((member) => renderCard(member))}
              </div>
            </div>

            {/* SECTION 7: SOFTWARE PLATFORM & INFRASTRUCTURE */}
            <div id="team-software" className="scroll-mt-36">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E5EAF1]">
                <div className="size-2 rounded-full bg-[#155EEF]" />
                <h3 className="text-xl sm:text-2xl font-bold text-[#101B2D]">
                  Software Platform &amp; Infrastructure
                </h3>
                <span className="text-xs font-mono font-semibold text-[#667085]">
                  ({softwareMembers.length} Roles)
                </span>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
                {softwareMembers.map((member) => renderCard(member))}
              </div>
            </div>

            {/* SECTION 8: ENGINEERING INTERNS & SPECIALIZED ASSOCIATES */}
            <div id="team-interns" className="scroll-mt-36">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E5EAF1]">
                <div className="size-2 rounded-full bg-[#16A34A]" />
                <h3 className="text-xl sm:text-2xl font-bold text-[#101B2D]">
                  Engineering Interns &amp; Specialized Associates
                </h3>
                <span className="text-xs font-mono font-semibold text-[#667085]">
                  ({internMembers.length} Associates)
                </span>
              </div>
              {/* Perfectly proportioned 3-column desktop grid preventing horizontal overflow */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {internMembers.map((member) => renderCard(member))}
              </div>
            </div>
          </div>
        )}

        {/* Level 3: Interactive Profile Detail Modal */}
        <ProfileDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      </div>
    </section>
  );
}
