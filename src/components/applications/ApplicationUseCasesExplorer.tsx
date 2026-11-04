import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  Filter,
  CheckCircle2,
  AlertOctagon,
  Cpu,
  Layers,
  ShieldCheck,
  Activity,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Zap,
  ChevronDown,
  ChevronUp,
  Wrench,
  Gauge,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { IndustrialUseCase, IntelligenceLevel } from "@/data/applications/types";

interface ApplicationUseCasesExplorerProps {
  applicationTitle: string;
  useCases: IndustrialUseCase[];
}

export function ApplicationUseCasesExplorer({
  applicationTitle,
  useCases,
}: ApplicationUseCasesExplorerProps) {
  const { openModal } = useModals();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTabPerCard, setActiveTabPerCard] = useState<Record<string, "task" | "benefit" | "safety">>({});

  const filteredUseCases = useMemo(() => {
    if (!useCases || !Array.isArray(useCases)) return [];
    return useCases.filter((uc) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = uc.title.toLowerCase().includes(q);
        const matchProblem = uc.industrialProblem.toLowerCase().includes(q);
        const matchArch = uc.robotOrArchitecture.toLowerCase().includes(q);
        const matchComp = uc.relevantComponents.some((c) => c.toLowerCase().includes(q));
        if (!matchTitle && !matchProblem && !matchArch && !matchComp) return false;
      }
      if (selectedLevel !== "all" && !uc.intelligenceLevel.startsWith(selectedLevel)) {
        return false;
      }
      return true;
    });
  }, [useCases, searchQuery, selectedLevel]);

  const setCardTab = (cardId: string, tab: "task" | "benefit" | "safety") => {
    setActiveTabPerCard((prev) => ({ ...prev, [cardId]: tab }));
  };

  return (
    <section className="border-b border-slate-200 bg-[#F9FBFC] px-5 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-primary">
              <BookOpen size={14} />
              Researched Engineering Profiles ({useCases.length} Use Cases)
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-[#111A30] sm:text-4xl">
              {applicationTitle} Automation Use Cases
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Every production task has specific mechanical shock profiles, positioning tolerances, sensing architectures, and functional safety constraints. Explore detailed engineering breakdowns for each verified operation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold uppercase rounded border-slate-300"
              onClick={() => openModal("engineer", { categoryName: `${applicationTitle} Use Case Design` })}
            >
              Discuss Custom Implementation
            </Button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="grid gap-4 md:grid-cols-12 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-7">
              <Search size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search use cases by process, component, or robot type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>

            {/* Intelligence Level Filter */}
            <div className="md:col-span-5 flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-500 whitespace-nowrap">
                Level:
              </span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-primary focus:outline-none"
              >
                <option value="all">All Autonomy Levels</option>
                <option value="Level 1">Level 1: Fixed Automation</option>
                <option value="Level 2">Level 2: Programmable Logic</option>
                <option value="Level 3">Level 3: Coordinated Motion</option>
                <option value="Level 4">Level 4: Vision &amp; Perception</option>
                <option value="Level 5">Level 5: Adaptive Autonomous</option>
              </select>
            </div>
          </div>
        </div>

        {/* Use Cases Cards Grid */}
        <div className="mt-8 space-y-6">
          {filteredUseCases.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-slate-600">No use cases matching criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLevel("all");
                }}
                className="mt-3 text-xs font-mono text-primary underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredUseCases.map((uc, idx) => {
              const isExpanded = expandedId === uc.id;
              const activeTab = activeTabPerCard[uc.id] || "task";

              return (
                <div
                  key={uc.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-xs transition-all hover:border-primary/50 overflow-hidden"
                >
                  {/* Card Header (Always Visible) */}
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold uppercase text-primary">
                          Use Case 0{idx + 1}
                        </span>
                        <span className="text-slate-300">·</span>
                        <Badge
                          variant="outline"
                          className="border-primary/30 bg-primary/5 text-primary text-[10px] font-mono font-semibold"
                        >
                          {uc.intelligenceLevel.split(":")[0]}
                        </Badge>
                      </div>

                      <span className="font-mono text-[10px] text-slate-400">
                        ID: {uc.id}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-[#111A30]">
                      {uc.title}
                    </h3>

                    {/* Industrial Problem & Architecture Side-by-Side */}
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                        <span className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-red-700 dark:text-red-400">
                          <AlertOctagon size={13} /> Industrial Bottleneck / Problem
                        </span>
                        <p className="mt-2 text-xs leading-relaxed text-slate-700">
                          {uc.industrialProblem}
                        </p>
                      </div>

                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <span className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-primary">
                          <Layers size={13} /> Robot &amp; Automation Architecture
                        </span>
                        <p className="mt-2 text-xs leading-relaxed text-slate-700">
                          {uc.robotOrArchitecture}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Accordion Tabs: Task, Benefit, Safety */}
                    <div className="mt-6 border border-slate-200/90 rounded-xl overflow-hidden bg-slate-50/50">
                      <div className="flex border-b border-slate-200 bg-white text-xs font-mono">
                        <button
                          type="button"
                          onClick={() => setCardTab(uc.id, "task")}
                          className={`flex-1 py-2.5 px-3 font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                            activeTab === "task"
                              ? "bg-blue-50 text-[#1D4ED8] border-b-2 border-[#1D4ED8]"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Wrench size={12} />
                          <span>Operating Task</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCardTab(uc.id, "benefit")}
                          className={`flex-1 py-2.5 px-3 font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                            activeTab === "benefit"
                              ? "bg-blue-50 text-[#1D4ED8] border-b-2 border-[#1D4ED8]"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Gauge size={12} />
                          <span>Primary Benefit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCardTab(uc.id, "safety")}
                          className={`flex-1 py-2.5 px-3 font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                            activeTab === "safety"
                              ? "bg-blue-50 text-[#1D4ED8] border-b-2 border-[#1D4ED8]"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <ShieldCheck size={12} />
                          <span>Safety Standard</span>
                        </button>
                      </div>

                      {/* Accordion Tab Content */}
                      <div className="p-4 text-xs font-mono">
                        {activeTab === "task" && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">
                              Operating Task &amp; Workcell Conditions:
                            </span>
                            <p className="text-slate-800 leading-relaxed font-sans">{uc.taskAndEnvironment}</p>
                          </div>
                        )}

                        {activeTab === "benefit" && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                              Expected Operational Value &amp; OEE Improvement:
                            </span>
                            <p className="text-slate-800 leading-relaxed font-sans">{uc.expectedOperationalBenefit}</p>
                          </div>
                        )}

                        {activeTab === "safety" && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-[#1D4ED8] block">
                              Functional Safety Compliance &amp; Sensor Layer:
                            </span>
                            <p className="text-slate-800 leading-relaxed font-sans">{uc.safetyAndIntegration}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Toggle Deep Dossier Specs Button */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {uc.suitablePerformanceMetrics.slice(0, 2).map((m) => (
                          <span key={m} className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[10px] font-mono font-bold text-[#1D4ED8]">
                            {m}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : uc.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold font-mono text-[#1D4ED8] hover:underline cursor-pointer"
                      >
                        <span>{isExpanded ? "Collapse Architecture" : "Full Kinematics Dossier"}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detailed Dossier */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50/70 p-6 sm:p-8 space-y-6 text-xs animate-in fade-in duration-200">
                      {/* Environment & Sensing */}
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <span className="font-bold uppercase text-[10px] text-slate-500 font-mono">
                            Task &amp; Operating Environment
                          </span>
                          <p className="mt-1.5 leading-relaxed text-slate-700 font-sans">
                            {uc.taskAndEnvironment}
                          </p>
                        </div>
                        <div>
                          <span className="font-bold uppercase text-[10px] text-slate-500 font-mono">
                            Required Sensing &amp; Real-Time Control
                          </span>
                          <p className="mt-1.5 leading-relaxed text-slate-700 font-sans">
                            {uc.sensingAndControl}
                          </p>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div>
                        <span className="font-bold uppercase text-[10px] text-slate-500 font-mono">
                          Suitable Performance Metrics
                        </span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {uc.suitablePerformanceMetrics.map((met) => (
                            <span
                              key={met}
                              className="rounded border border-slate-300 bg-white px-3 py-1 font-mono text-[11px] font-semibold text-slate-800 shadow-2xs"
                            >
                              {met}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Relevant Components & Links */}
                      <div>
                        <span className="font-bold uppercase text-[10px] text-slate-500 font-mono">
                          Critical Mechatronic Components &amp; Catalogue Links
                        </span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {uc.relevantComponents.map((comp) => (
                            <span
                              key={comp}
                              className="rounded border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary font-mono"
                            >
                              {comp}
                            </span>
                          ))}
                          {uc.relevantProductLinks.map((link) => (
                            <Link
                              key={link.name}
                              to={link.href}
                              className="inline-flex items-center gap-1 rounded bg-[#0F172A] px-3 py-1 text-xs font-bold uppercase text-white hover:bg-[#1D4ED8] transition-colors font-mono"
                            >
                              {link.name} <ArrowRight size={11} />
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Research Reference */}
                      {uc.researchReferences && (
                        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-500 font-mono text-[11px]">
                          <span>Source Reference: {uc.researchReferences}</span>
                          <Button
                            size="sm"
                            className="bg-[#1D4ED8] text-white hover:bg-[#155EEF] text-xs font-bold uppercase cursor-pointer"
                            onClick={() =>
                              openModal("engineer", {
                                categoryName: `${applicationTitle} - ${uc.title}`,
                              })
                            }
                          >
                            Inquire for this Use Case
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
