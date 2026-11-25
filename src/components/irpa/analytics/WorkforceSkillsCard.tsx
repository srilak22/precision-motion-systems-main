import React from "react";
import { Users, GraduationCap, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from "lucide-react";

interface SkillItem {
  skillArea: string;
  currentProficiency: string;
  requiredProficiency: string;
  gapIdentified: boolean;
  trainingPriority: string;
  curriculumModule: string;
}

interface WorkforceSkillsData {
  domainId: string;
  currentScore: number;
  targetScore: number;
  gapScore: number;
  readinessTier: string;
  currentSkillDescription: string;
  skillsMatrix: SkillItem[];
  totalCriticalGaps: number;
  totalHighGaps: number;
  recommendedUpskillingRoadmap: string[];
}

interface WorkforceSkillsCardProps {
  workforce: WorkforceSkillsData;
}

export function WorkforceSkillsCard({ workforce }: WorkforceSkillsCardProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <span>Workforce Mechatronics Skills &amp; Digital Readiness</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Operator and technician readiness to program, operate, and maintain installed robotics workcells.
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 text-xs font-semibold shrink-0">
          {workforce.readinessTier}
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Current Mechatronics Literacy</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            Level {workforce.currentScore.toFixed(2)} / 5.0
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Required Digital Horizon</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            Level {workforce.targetScore.toFixed(2)} / 5.0
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/30 text-center bg-gradient-to-br from-slate-950 to-purple-950/30">
          <div className="text-[11px] text-purple-300 uppercase font-semibold">Critical Upskilling Modules</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {workforce.totalCriticalGaps + workforce.totalHighGaps} Modules
          </div>
        </div>
      </div>

      {/* Skills Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
              <th className="py-3 px-3">Competency Area</th>
              <th className="py-3 px-3 text-center">Current Status</th>
              <th className="py-3 px-3 text-center">Target Level</th>
              <th className="py-3 px-3 text-center">Priority</th>
              <th className="py-3 px-3">Curriculum Module</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {workforce.skillsMatrix.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-medium text-white">
                  {item.skillArea}
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.currentProficiency === "Proficient"
                        ? "bg-emerald-950 text-emerald-300"
                        : item.currentProficiency === "Basic"
                        ? "bg-amber-950 text-amber-300"
                        : "bg-rose-950 text-rose-300"
                    }`}
                  >
                    {item.currentProficiency}
                  </span>
                </td>
                <td className="py-3 px-3 text-center font-semibold text-slate-200">
                  {item.requiredProficiency}
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.trainingPriority === "CRITICAL"
                        ? "bg-rose-950/70 border-rose-500/50 text-rose-300"
                        : item.trainingPriority === "HIGH"
                        ? "bg-amber-950/70 border-amber-500/50 text-amber-300"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {item.trainingPriority}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-300 text-[11px]">
                  {item.curriculumModule}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phased Roadmap */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
        <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Recommended 3-Phase Upskilling Roadmap</span>
        </div>
        <div className="space-y-1.5 pt-1">
          {workforce.recommendedUpskillingRoadmap.map((step, sIdx) => (
            <div key={sIdx} className="text-xs text-slate-300 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
