import React, { useState, useEffect, useMemo } from "react";
import type {
  TrafficProfile,
  ContentAgent,
  GeneratedContentAsset,
  PublishingQueueItem,
  ContentFormat,
  IndustrySector,
} from "@/types/trafficAgents";
import {
  TRAFFIC_PROFILES,
  CONTENT_AGENTS,
  INITIAL_CONTENT_ASSETS,
  INITIAL_PUBLISHING_QUEUE,
  ATTRIBUTION_FUNNEL_DATA,
  loadQueueFromStorage,
  saveQueueToStorage,
  loadAssetsFromStorage,
  saveAssetsToStorage,
  generateAutonomousContentAsset,
} from "@/data/mockTrafficAgentsData";
import {
  Bot,
  Cpu,
  Layers,
  Activity,
  TrendingUp,
  Send,
  RefreshCw,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  FileText,
  Sliders,
  Database,
  Filter,
  Search,
  ArrowRight,
  ExternalLink,
  Zap,
  Copy,
  Trash2,
  ShieldCheck,
  BarChart3,
  Sun,
  Moon,
  ChevronRight,
  Radio,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function TrafficProfileContentAgentsDashboard() {
  // Theme state
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<"fleet" | "profiles" | "studio" | "queue">("fleet");

  // Data states
  const [agents, setAgents] = useState<ContentAgent[]>(CONTENT_AGENTS);
  const [profiles] = useState<TrafficProfile[]>(TRAFFIC_PROFILES);
  const [assets, setAssets] = useState<GeneratedContentAsset[]>([]);
  const [queue, setQueue] = useState<PublishingQueueItem[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "warning" } | null>(null);

  // Studio generator interactive state
  const [selectedProfileId, setSelectedProfileId] = useState<string>(TRAFFIC_PROFILES[0].id);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(CONTENT_AGENTS[0].id);
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat>("LinkedIn Technical Teardown");
  const [productFocus, setProductFocus] = useState<string>("INDUS Strain Wave Reducers & 6-Axis Welding Cell");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [currentGeneratedAsset, setCurrentGeneratedAsset] = useState<GeneratedContentAsset | null>(null);

  // Inspector modal / drawer
  const [inspectAgent, setInspectAgent] = useState<ContentAgent | null>(null);
  const [inspectAsset, setInspectAsset] = useState<GeneratedContentAsset | null>(null);
  const [profileFilter, setProfileFilter] = useState<string>("all");

  const showToast = (message: string, type: "success" | "warning" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    setAssets(loadAssetsFromStorage());
    setQueue(loadQueueFromStorage());
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("indus_admin_theme") as "light" | "dark" | null;
      if (saved) setThemeMode(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = themeMode === "light" ? "dark" : "light";
    setThemeMode(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("indus_admin_theme", next);
    }
  };

  const isDark = themeMode === "dark";
  const bgClass = isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900";
  const cardClass = isDark
    ? "bg-slate-900/80 border-slate-800 text-slate-100 shadow-sm"
    : "bg-white border-slate-200 text-slate-900 shadow-xs";
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-500";
  const inputClass = isDark
    ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-blue-500"
    : "bg-white border-slate-200 text-slate-900 focus:border-blue-600";
  const tableHeadClass = isDark ? "bg-slate-800/80 text-slate-300" : "bg-slate-50 text-slate-600";
  const tableRowHoverClass = isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50/80";

  // Trigger manual agent run
  const handleTriggerAgent = (agent: ContentAgent) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agent.id ? { ...a, status: "generating" } : a))
    );
    showToast(`${agent.codename} triggered: Synthesizing real-time content assets...`);

    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agent.id
            ? {
                ...a,
                status: "active",
                metrics: {
                  ...a.metrics,
                  assetsGenerated: a.metrics.assetsGenerated + 1,
                  totalImpressions: a.metrics.totalImpressions + 12500,
                  inboundClicks: a.metrics.inboundClicks + 540,
                },
              }
            : a
        )
      );
      showToast(`${agent.codename} completed cycle. 1 new verified asset added to queue.`);
    }, 1800);
  };

  // Run autonomous content studio generator
  const handleGenerateAsset = () => {
    setIsGenerating(true);
    setGenerationStep(1);

    setTimeout(() => {
      setGenerationStep(2);
    }, 600);

    setTimeout(() => {
      setGenerationStep(3);
    }, 1200);

    setTimeout(() => {
      const newAsset = generateAutonomousContentAsset(
        selectedAgentId,
        selectedProfileId,
        selectedFormat,
        productFocus
      );
      setCurrentGeneratedAsset(newAsset);
      const updatedAssets = [newAsset, ...assets];
      setAssets(updatedAssets);
      saveAssetsToStorage(updatedAssets);
      setIsGenerating(false);
      setGenerationStep(0);
      showToast(`Asset "${newAsset.title.slice(0, 45)}..." generated with Quality Score ${newAsset.qualityScore}%!`);
    }, 1800);
  };

  // Push generated asset to publishing queue
  const handlePushToQueue = (asset: GeneratedContentAsset) => {
    const targetProfile = profiles.find((p) => p.id === asset.profileId);
    const targetAgent = agents.find((a) => a.id === asset.agentId);

    const now = new Date();
    const schedDate = new Date(now.getTime() + 86400000 * 2).toISOString().split("T")[0];

    const newQueueItem: PublishingQueueItem = {
      id: `QUEUE-${Math.floor(100 + Math.random() * 900)}`,
      assetId: asset.id,
      agentCodename: targetAgent?.codename || "Agent Alpha",
      profileName: targetProfile?.name || "Automotive Gigafactory",
      title: asset.title,
      channel: asset.format.includes("LinkedIn") ? "LinkedIn" : "Engineering Portal",
      scheduledDate: schedDate,
      scheduledTime: "09:30 IST",
      status: "SYNCED_TO_SHEETS",
      sheetsWebhookUrl:
        "https://script.google.com/macros/s/AKfycbw8NhfkPJGeYu4NAaisxN3FHaWmAVlZTmEO2x1CsBirRPvt5pQjI5zNv3qVXqEA2W1a/exec",
    };

    const updatedQueue = [newQueueItem, ...queue];
    setQueue(updatedQueue);
    saveQueueToStorage(updatedQueue);

    // Update asset status
    const updatedAssets = assets.map((a) => (a.id === asset.id ? { ...a, status: "queued" as const } : a));
    setAssets(updatedAssets);
    saveAssetsToStorage(updatedAssets);
    if (currentGeneratedAsset?.id === asset.id) {
      setCurrentGeneratedAsset({ ...currentGeneratedAsset, status: "queued" });
    }

    showToast(`Pushed to Google Sheets Auto-Publisher Queue (${newQueueItem.id})`);
  };

  const handleCopyMarkdown = (asset: GeneratedContentAsset) => {
    const md = `# ${asset.title}\n\n**Hook:** ${asset.hook}\n\n**Context:** ${asset.context}\n\n**Technical Proof:**\n${asset.technicalProof}\n\n### Key Specifications:\n${asset.specs
      .map((s) => `- **${s.label}:** ${s.value}`)
      .join("\n")}\n\n**Call to Action:** [${asset.callToAction.text}](https://precision-motion-systems-main.vercel.app${asset.callToAction.route}?${asset.callToAction.utmParams})\n\n${asset.hashtags.join(" ")}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(md);
      showToast("Content Asset copied to clipboard (Markdown)");
    }
  };

  const handleSyncAllToSheets = () => {
    showToast("Triggering Google Apps Script Auto-Publisher Webhook sync...");
    setTimeout(() => {
      const synced = queue.map((q) => ({ ...q, status: "SYNCED_TO_SHEETS" as const }));
      setQueue(synced);
      saveQueueToStorage(synced);
      showToast("All queued content assets synchronized with INDUS_LINKEDIN_AUTO_PUBLISHER sheet!");
    }, 1200);
  };

  const filteredProfiles = useMemo(() => {
    if (profileFilter === "all") return profiles;
    return profiles.filter((p) => p.sector === profileFilter);
  }, [profiles, profileFilter]);

  return (
    <div className={`w-full rounded-2xl border transition-colors ${bgClass} ${cardClass} p-4 sm:p-6 lg:p-8 space-y-6`}>
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-mono shadow-2xl backdrop-blur-md transition-all ${
            notification.type === "success"
              ? "bg-emerald-950 border-emerald-500/50 text-emerald-200"
              : "bg-amber-950 border-amber-500/50 text-amber-200"
          }`}
        >
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5 border-inherit">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Bot className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                Traffic Profile Content Agents
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  IN27-298 AUTONOMOUS FLEET
                </span>
              </h2>
              <p className={`text-xs ${mutedTextClass} font-mono mt-0.5`}>
                High-Intent ICP Personas &bull; 4 Specialized Content Agents &bull; Google Sheets Auto-Publisher Sync
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
              isDark
                ? "bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title="Toggle Dashboard Theme"
          >
            {isDark ? (
              <>
                <Sun size={14} className="text-amber-400" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <Moon size={14} className="text-blue-600" />
                <span>Dark Theme</span>
              </>
            )}
          </button>

          <Button
            onClick={handleSyncAllToSheets}
            variant="outline"
            size="sm"
            className={`font-mono text-xs uppercase border ${
              isDark
                ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Share2 size={13} className="mr-1.5 text-blue-500" />
            Sync Sheets Queue
          </Button>

          <Button
            onClick={() => setActiveTab("studio")}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs uppercase font-bold shadow-md shadow-blue-500/20"
          >
            <Sparkles size={13} className="mr-1.5" />
            Run Content Studio
          </Button>
        </div>
      </div>

      {/* KPI Overview Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Agents */}
        <div className={`border rounded-xl p-5 ${cardClass}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono text-xs uppercase tracking-wider ${mutedTextClass}`}>Active Fleet</span>
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Bot className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight">{agents.length} Agents</div>
          <div className="mt-2 text-xs flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Operational</span>
            <span className={mutedTextClass}>autonomous cadence</span>
          </div>
        </div>

        {/* Inbound Impressions */}
        <div className={`border rounded-xl p-5 ${cardClass}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono text-xs uppercase tracking-wider ${mutedTextClass}`}>Inbound Impressions</span>
            <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight">1.62M</div>
          <div className={`mt-2 text-xs text-cyan-600 dark:text-cyan-400 font-semibold`}>
            +28.4% month-over-month
          </div>
        </div>

        {/* Attributed RFQs */}
        <div className={`border rounded-xl p-5 ${cardClass}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono text-xs uppercase tracking-wider ${mutedTextClass}`}>Qualified RFQ Inquiries</span>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Target className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            904 Leads
          </div>
          <div className={`mt-2 text-xs ${mutedTextClass}`}>Direct UTM Attribution</div>
        </div>

        {/* Pipeline Value */}
        <div className={`border rounded-xl p-5 ${cardClass}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono text-xs uppercase tracking-wider ${mutedTextClass}`}>Pipeline Generated</span>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <BarChart3 className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            $74.2M
          </div>
          <div className={`mt-2 text-xs ${mutedTextClass}`}>142 Tier-1 Plant Contracts</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-inherit pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("fleet")}
          className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === "fleet"
              ? "bg-blue-600 text-white shadow-sm"
              : isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Bot size={14} />
          Agent Fleet Orchestration ({agents.length})
        </button>

        <button
          onClick={() => setActiveTab("profiles")}
          className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === "profiles"
              ? "bg-blue-600 text-white shadow-sm"
              : isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Target size={14} />
          ICP Traffic Profiles ({profiles.length})
        </button>

        <button
          onClick={() => setActiveTab("studio")}
          className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === "studio"
              ? "bg-blue-600 text-white shadow-sm"
              : isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Sparkles size={14} className={activeTab === "studio" ? "text-amber-300" : "text-amber-500"} />
          Autonomous Content Studio
        </button>

        <button
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === "queue"
              ? "bg-blue-600 text-white shadow-sm"
              : isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Clock size={14} />
          Publishing Queue & Attribution ({queue.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AGENT FLEET ORCHESTRATION */}
      {/* ========================================================================= */}
      {activeTab === "fleet" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Agent Fleet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${cardClass} hover:border-blue-500/50`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <Bot className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base tracking-tight">{agent.name}</h3>
                        <span className={`text-xs font-mono ${mutedTextClass}`}>{agent.role}</span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        agent.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                          : agent.status === "generating"
                          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                          : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          agent.status === "active"
                            ? "bg-emerald-500 animate-pulse"
                            : agent.status === "generating"
                            ? "bg-amber-500 animate-spin"
                            : "bg-slate-400"
                        }`}
                      ></span>
                      {agent.status}
                    </span>
                  </div>

                  <p className={`text-xs ${mutedTextClass} leading-relaxed mb-4`}>
                    {agent.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-500/5 border border-inherit text-xs font-mono mb-4">
                    <div>
                      <span className={`text-[10px] ${mutedTextClass} block`}>ASSETS SYNTHESIZED</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                        {agent.metrics.assetsGenerated}
                      </span>
                    </div>
                    <div>
                      <span className={`text-[10px] ${mutedTextClass} block`}>INBOUND CLICKS</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {agent.metrics.inboundClicks.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className={`text-[10px] ${mutedTextClass} block`}>AVG QUALITY</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                        {agent.metrics.avgQualityScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-inherit">
                  <div className={`text-[11px] font-mono ${mutedTextClass} flex items-center gap-1`}>
                    <Clock size={12} />
                    <span>{agent.executionCadence}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setInspectAgent(agent)}
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-mono"
                    >
                      Inspect Prompt
                    </Button>
                    <Button
                      onClick={() => handleTriggerAgent(agent)}
                      disabled={agent.status === "generating"}
                      size="sm"
                      className="h-8 text-xs font-mono bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Play size={11} className="mr-1" />
                      Trigger Run
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Telemetry Execution Stream */}
          <div className={`p-5 rounded-xl border ${cardClass}`}>
            <div className="flex items-center justify-between mb-3 border-b border-inherit pb-3">
              <h4 className="font-bold text-sm uppercase tracking-tight flex items-center gap-2">
                <Activity size={15} className="text-emerald-500" />
                Live Agent Execution & Telemetry Log
              </h4>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                STREAMING RESP3
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto">
              <div className="flex items-start gap-3 p-2 rounded bg-slate-500/5">
                <span className="text-blue-500 font-bold shrink-0">[09:30:14 UTC]</span>
                <span className="text-amber-500 shrink-0 font-bold">[Agent Beta]</span>
                <span className="text-inherit">
                  Pushed LinkedIn Carousel #042 to Google Sheets Auto-Publisher queue &bull; Sector: Semiconductor Cleanroom Wafer Handling &bull; Quality: 96%
                </span>
              </div>
              <div className="flex items-start gap-3 p-2 rounded bg-slate-500/5">
                <span className="text-blue-500 font-bold shrink-0">[08:45:22 UTC]</span>
                <span className="text-blue-400 shrink-0 font-bold">[Agent Alpha]</span>
                <span className="text-inherit">
                  Synthesized Kinematic Dynamic Torque Proof &bull; Formula: T = J*alpha + overhung inertia (1,850 N·m) &bull; Verified against DIN 3990 standard
                </span>
              </div>
              <div className="flex items-start gap-3 p-2 rounded bg-slate-500/5">
                <span className="text-blue-500 font-bold shrink-0">[07:12:05 UTC]</span>
                <span className="text-emerald-500 shrink-0 font-bold">[Agent Gamma]</span>
                <span className="text-inherit">
                  Attributed 3 RFQs to Video Robotization Calculator &bull; Referring Campaign: utm_campaign=semi_cleanroom_motion &bull; Value: $2.4M
                </span>
              </div>
              <div className="flex items-start gap-3 p-2 rounded bg-slate-500/5">
                <span className="text-blue-500 font-bold shrink-0">[06:00:00 UTC]</span>
                <span className="text-purple-400 shrink-0 font-bold">[Agent Delta]</span>
                <span className="text-inherit">
                  Audited 124 inbound lead records &bull; 89 verified as Gold Tier (Official Website + FIDO2 + Personal LinkedIn) &bull; Lead Validation Agent passed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ICP TRAFFIC PROFILES */}
      {/* ========================================================================= */}
      {activeTab === "profiles" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Sector Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-inherit">
            <div className="flex items-center gap-2">
              <Filter size={14} className={mutedTextClass} />
              <span className="text-xs font-mono font-bold uppercase">Sector Filter:</span>
              <div className="flex flex-wrap gap-1.5">
                {["all", "Automotive", "Semiconductor", "Aerospace & Defense", "Warehousing & Logistics", "Heavy Industrial Machining", "Electronics & SMT"].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setProfileFilter(sec)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      profileFilter === sec
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-slate-500/10 hover:bg-slate-500/20 text-inherit"
                    }`}
                  >
                    {sec === "all" ? "All Profiles" : sec}
                  </button>
                ))}
              </div>
            </div>
            <span className={`text-xs font-mono ${mutedTextClass}`}>
              Showing {filteredProfiles.length} of {profiles.length} Traffic Profiles
            </span>
          </div>

          {/* Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProfiles.map((p) => (
              <div key={p.id} className={`p-5 rounded-xl border ${cardClass} flex flex-col justify-between`}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-inherit pb-3">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-1">
                        {p.sector} &bull; {p.id}
                      </span>
                      <h3 className="font-bold text-base tracking-tight">{p.name}</h3>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-mono uppercase ${mutedTextClass} block`}>
                      PRIMARY TARGET PERSONA
                    </span>
                    <div className="font-semibold text-xs text-inherit mt-0.5 flex items-center gap-1.5">
                      <Users size={13} className="text-blue-500" />
                      <span>{p.targetRole}</span>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-mono uppercase ${mutedTextClass} block`}>
                      PRIMARY PAIN POINT
                    </span>
                    <p className={`text-xs ${mutedTextClass} mt-0.5 leading-relaxed`}>
                      {p.primaryPainPoint}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-500/5 border border-inherit text-xs font-mono">
                    <span className={`text-[10px] uppercase ${mutedTextClass} block mb-1.5`}>
                      HIGH-INTENT SEARCH KEYWORDS
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {p.searchIntentKeywords.map((kw) => (
                        <span key={kw} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px]">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-inherit flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className={`text-[10px] ${mutedTextClass} block`}>POTENTIAL / MO</span>
                    <span className="font-bold text-inherit">{p.monthlyTrafficPotential.toLocaleString()} visits</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-mono"
                    >
                      <Link to={p.conversionRoute}>
                        Landing Route
                        <ArrowRight size={11} className="ml-1" />
                      </Link>
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedProfileId(p.id);
                        setActiveTab("studio");
                      }}
                      size="sm"
                      className="h-8 text-xs font-mono bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Target ICP
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AUTONOMOUS CONTENT STUDIO & GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === "studio" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Generator Configuration Controls */}
          <div className={`p-5 rounded-xl border ${cardClass} space-y-4`}>
            <div className="border-b border-inherit pb-3">
              <h3 className="font-bold text-base uppercase tracking-tight flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                Autonomous Content Asset Synthesis Lab
              </h3>
              <p className={`text-xs ${mutedTextClass} font-mono mt-0.5`}>
                Select target ICP profile, executing content agent, and format to generate verified technical assets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Select Profile */}
              <div>
                <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1.5`}>
                  Target Traffic Profile
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sector}: {p.name.slice(0, 32)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Agent */}
              <div>
                <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1.5`}>
                  Executing Content Agent
                </label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.codename} ({a.role.slice(0, 24)}...)
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Format */}
              <div>
                <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1.5`}>
                  Content Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as ContentFormat)}
                  className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                >
                  <option value="LinkedIn Technical Teardown">LinkedIn Technical Teardown</option>
                  <option value="Kinematic Engineering Case Study">Kinematic Engineering Case Study</option>
                  <option value="Executive ROI Whitepaper">Executive ROI Whitepaper</option>
                  <option value="Multi-Slide Technical Carousel">Multi-Slide Technical Carousel</option>
                  <option value="Video Script & Motion Prompt">Video Script & Motion Prompt</option>
                </select>
              </div>

              {/* Focus Product */}
              <div>
                <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1.5`}>
                  Product Focus
                </label>
                <select
                  value={productFocus}
                  onChange={(e) => setProductFocus(e.target.value)}
                  className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                >
                  <option value="INDUS Strain Wave Reducers & 6-Axis Welding Cell">
                    Strain Wave Reducers & 6-Axis Cell
                  </option>
                  <option value="INDUS Heavy Cycloidal Reducer & Forging Manipulator">
                    Heavy Cycloidal Reducers (Forging)
                  </option>
                  <option value="INDUS Delta High-Speed Packaging Robot (120 CPM)">
                    Delta Parallel Robot (120 CPM)
                  </option>
                  <option value="INDUS 2,000kg Heavy Omni-Directional AMR Powertrain">
                    2,000kg Heavy AMR Powertrain
                  </option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className={`text-xs font-mono ${mutedTextClass}`}>
                AI Model: Deep Kinematic Reasoner &bull; Token Budget: 4,096 &bull; Truth Anchor: ISO 9283 / DIN 3990
              </div>

              <Button
                onClick={handleGenerateAsset}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs uppercase font-bold shadow-md shadow-blue-500/20"
              >
                <Sparkles size={14} className={`mr-1.5 ${isGenerating ? "animate-spin" : ""}`} />
                {isGenerating ? "Synthesizing Asset..." : "Generate Content Asset"}
              </Button>
            </div>

            {/* Generation Progress Bar */}
            {isGenerating && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 animate-in fade-in space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {generationStep === 1
                      ? "Phase 1: Ingesting ICP Buyer Persona & Search Query Archetypes..."
                      : generationStep === 2
                      ? "Phase 2: Computing Multi-Axis Kinematic Proofs & Torque Curves..."
                      : "Phase 3: Formatting High-Impact Hook, Specs Table & Verified UTM Call-to-Action..."}
                  </span>
                  <span className="font-bold">{generationStep * 33}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${generationStep * 33}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Generated Asset Live Preview */}
          {currentGeneratedAsset && (
            <div className={`p-6 rounded-xl border border-blue-500/40 ${cardClass} space-y-5 animate-in slide-in-from-bottom-2`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-inherit pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Generated Asset: {currentGeneratedAsset.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      Quality Score: {currentGeneratedAsset.qualityScore}%
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-inherit">
                    {currentGeneratedAsset.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleCopyMarkdown(currentGeneratedAsset)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono uppercase"
                  >
                    <Copy size={12} className="mr-1.5 text-blue-500" />
                    Copy Markdown
                  </Button>
                  <Button
                    onClick={() => handlePushToQueue(currentGeneratedAsset)}
                    disabled={currentGeneratedAsset.status === "queued"}
                    size="sm"
                    className="text-xs font-mono uppercase bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    <Send size={12} className="mr-1.5" />
                    {currentGeneratedAsset.status === "queued" ? "Pushed to Queue" : "Push to Publishing Queue"}
                  </Button>
                </div>
              </div>

              {/* Content Body Preview */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 rounded-lg bg-slate-500/5 border border-inherit font-sans">
                  <span className="font-mono font-bold uppercase text-[10px] text-amber-500 block mb-1">
                    [HOOK]
                  </span>
                  <p className="font-semibold text-inherit text-sm">{currentGeneratedAsset.hook}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-500/5 border border-inherit font-sans">
                  <span className="font-mono font-bold uppercase text-[10px] text-blue-500 block mb-1">
                    [TECHNICAL CONTEXT & PROOF]
                  </span>
                  <p className={`${mutedTextClass} mb-2`}>{currentGeneratedAsset.context}</p>
                  <p className="text-inherit font-medium">{currentGeneratedAsset.technicalProof}</p>
                </div>

                {/* Specs Table */}
                <div className="p-3.5 rounded-lg bg-slate-500/5 border border-inherit">
                  <span className="font-mono font-bold uppercase text-[10px] text-emerald-500 block mb-2">
                    [ENGINEERING SPECIFICATIONS]
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
                    {currentGeneratedAsset.specs.map((spec) => (
                      <div key={spec.label} className="p-2 rounded bg-inherit border border-inherit">
                        <span className={`text-[10px] ${mutedTextClass} block`}>{spec.label}</span>
                        <span className="font-bold text-inherit">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA & Hashtags */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-1">
                    {currentGeneratedAsset.hashtags.map((h) => (
                      <span key={h} className="text-blue-500 font-mono text-[11px]">
                        {h}
                      </span>
                    ))}
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs uppercase border-blue-500 text-blue-600 dark:text-blue-400"
                  >
                    <Link to={currentGeneratedAsset.callToAction.route}>
                      CTA: {currentGeneratedAsset.callToAction.text}
                      <ExternalLink size={12} className="ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Recently Generated Assets Library */}
          <div className={`p-5 rounded-xl border ${cardClass}`}>
            <h4 className="font-bold text-sm uppercase tracking-tight mb-3 flex items-center gap-2">
              <FileText size={15} className="text-blue-500" />
              Verified Autonomous Content Repository ({assets.length} Assets)
            </h4>

            <div className="divide-y divide-inherit">
              {assets.map((asset) => (
                <div key={asset.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {asset.id}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-500/10 text-inherit">
                        {asset.format}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        Score: {asset.qualityScore}%
                      </span>
                    </div>
                    <div className="font-bold text-xs text-inherit">{asset.title}</div>
                    <span className={`text-[11px] ${mutedTextClass}`}>{asset.hook.slice(0, 85)}...</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={() => handleCopyMarkdown(asset)}
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px] font-mono"
                    >
                      <Copy size={11} className="mr-1" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => handlePushToQueue(asset)}
                      disabled={asset.status === "queued"}
                      size="sm"
                      className="h-7 text-[11px] font-mono bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send size={11} className="mr-1" />
                      {asset.status === "queued" ? "Queued" : "Queue"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PUBLISHING QUEUE & ATTRIBUTION WATERFALL */}
      {/* ========================================================================= */}
      {activeTab === "queue" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Queue Actions Header */}
          <div className={`p-5 rounded-xl border ${cardClass}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-bold text-base uppercase tracking-tight flex items-center gap-2">
                  <Share2 size={16} className="text-blue-500" />
                  Google Sheets Auto-Publisher Queue Integration
                </h3>
                <p className={`text-xs ${mutedTextClass} font-mono mt-0.5`}>
                  Live webhook connection to <code className="text-blue-500">INDUS_LINKEDIN_AUTO_PUBLISHER</code> &bull; Spreadsheet ID: <code className="text-amber-500">1S-ApP83...XlH48</code>
                </p>
              </div>

              <Button
                onClick={handleSyncAllToSheets}
                className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs uppercase font-bold"
              >
                <RefreshCw size={13} className="mr-1.5" />
                Force Queue Sync
              </Button>
            </div>
          </div>

          {/* Scheduled Publishing Table */}
          <div className={`overflow-x-auto rounded-xl border ${cardClass}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${tableHeadClass}`}>
                  <th className="py-3.5 px-4">Queue ID</th>
                  <th className="py-3.5 px-4">Agent Codename</th>
                  <th className="py-3.5 px-4">Target Profile</th>
                  <th className="py-3.5 px-4">Content Asset Title</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4">Scheduled Slot</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit text-xs font-mono">
                {queue.map((item) => (
                  <tr key={item.id} className={`transition-colors border-b ${tableRowHoverClass}`}>
                    <td className="py-3.5 px-4 text-blue-600 dark:text-blue-400 font-bold">{item.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-inherit">{item.agentCodename}</td>
                    <td className="py-3.5 px-4 text-inherit">{item.profileName}</td>
                    <td className="py-3.5 px-4 font-sans font-medium text-inherit max-w-[240px] truncate" title={item.title}>
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                        {item.channel}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 ${mutedTextClass}`}>
                      {item.scheduledDate} &bull; {item.scheduledTime}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          item.status === "SYNCED_TO_SHEETS"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                        }`}
                      >
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inbound Attribution Funnel Waterfall */}
          <div className={`p-6 rounded-xl border ${cardClass} space-y-4`}>
            <div>
              <h4 className="font-bold text-base uppercase tracking-tight flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" />
                Traffic Profile Inbound Attribution Waterfall
              </h4>
              <p className={`text-xs ${mutedTextClass} font-mono mt-0.5`}>
                End-to-end attribution from autonomous content impressions to signed $74.2M robotics contracts.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {ATTRIBUTION_FUNNEL_DATA.map((stage, idx) => (
                <div key={stage.stage} className="p-3.5 rounded-lg bg-slate-500/5 border border-inherit space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-inherit">
                      {idx + 1}. {stage.stage}
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {stage.count.toLocaleString()} ({stage.conversionRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.max(6, 100 - idx * 20)}%` }}
                    ></div>
                  </div>
                  <p className={`text-[11px] ${mutedTextClass}`}>{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT AGENT SYSTEM PROMPT */}
      {inspectAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 ${cardClass}`}>
            <div className="flex items-center justify-between border-b pb-3 border-inherit">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">{inspectAgent.name}</h3>
                  <span className={`text-xs font-mono ${mutedTextClass}`}>{inspectAgent.codename} &bull; System Directive</span>
                </div>
              </div>
              <button
                onClick={() => setInspectAgent(null)}
                className={`p-1 rounded-lg ${mutedTextClass} hover:text-inherit`}
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className={`font-mono text-[10px] uppercase ${mutedTextClass} block mb-1`}>
                  System Prompt & Guardrails
                </span>
                <div className="p-3 rounded-lg bg-slate-500/10 font-mono text-[11px] leading-relaxed border border-inherit">
                  {inspectAgent.systemPrompt}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2.5 rounded bg-slate-500/5 border border-inherit">
                  <span className={mutedTextClass}>AUTONOMY LEVEL</span>
                  <div className="font-bold text-inherit mt-0.5">{inspectAgent.autonomyLevel}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-500/5 border border-inherit">
                  <span className={mutedTextClass}>PRIMARY CHANNEL</span>
                  <div className="font-bold text-inherit mt-0.5">{inspectAgent.primaryChannel}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-inherit">
              <Button
                onClick={() => setInspectAgent(null)}
                size="sm"
                className="font-mono text-xs uppercase"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
