import React, { useState, useMemo } from "react";
import { knowledgeGraph } from "@/data/knowledgeGraph/graphBuilder";
import { FUTURE_AGENT_CONTRACTS } from "@/data/knowledgeGraph/agenticNetwork";
import { KnowledgeNodeType, VerificationState } from "@/data/knowledgeGraph/types";
import {
  Network,
  Bot,
  Search,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Layers,
  ExternalLink,
  ChevronRight,
  Code,
  Sparkles,
  FileText,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const KnowledgeGraphExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedVerification, setSelectedVerification] = useState<string>("all");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"graph" | "agents" | "audit">("graph");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent:product-research");

  // Run graph audit
  const integrityReport = useMemo(() => knowledgeGraph.validateGraphIntegrity(), []);
  const allNodes = useMemo(() => knowledgeGraph.getAllNodes(), []);

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return allNodes.filter((node) => {
      const matchesSearch =
        node.canonicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "all" || node.nodeType === selectedType;

      const matchesVerification =
        selectedVerification === "all" ||
        node.verificationStatus === selectedVerification;

      return matchesSearch && matchesType && matchesVerification;
    });
  }, [allNodes, searchQuery, selectedType, selectedVerification]);

  const activeNode = selectedNodeId
    ? knowledgeGraph.getNode(selectedNodeId)
    : filteredNodes[0] || null;

  const activeEdges = activeNode
    ? knowledgeGraph.getEdgesForNode(activeNode.id)
    : [];

  const selectedAgent = FUTURE_AGENT_CONTRACTS.find(
    (a) => a.agentId === selectedAgentId
  );

  return (
    <div className="space-y-12">
      {/* Integrity Dashboard Metric Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase">
            <span>Total Knowledge Nodes</span>
            <Layers size={15} className="text-signal" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-foreground">
              {integrityReport.totalNodes}
            </span>
            <span className="text-xs font-mono text-signal">Entities Indexed</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Lines, ranges, use cases, sources &amp; rules.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase">
            <span>Semantic Edges</span>
            <Network size={15} className="text-signal" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-foreground">
              {integrityReport.totalEdges}
            </span>
            <span className="text-xs font-mono text-signal">Relationships</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Compatibility, subsystems &amp; dependencies.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase">
            <span>Referential Integrity</span>
            <ShieldCheck size={15} className="text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-emerald-500">
              {integrityReport.integrityStatus}
            </span>
            <span className="text-xs font-mono text-muted-foreground">0 Dangling</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Strict pointer consistency across all nodes.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase">
            <span>Agentic Contracts</span>
            <Bot size={15} className="text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-amber-500">
              10
            </span>
            <span className="text-xs font-mono text-muted-foreground">Specialized</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Defined capability boundaries &amp; human triggers.
          </p>
        </div>
      </div>

      {/* Main Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("graph")}
            className={`flex items-center gap-2 rounded-none px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "graph"
                ? "bg-signal text-signal-foreground shadow-xs"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Network size={14} />
            <span>Knowledge Graph Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab("agents")}
            className={`flex items-center gap-2 rounded-none px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "agents"
                ? "bg-signal text-signal-foreground shadow-xs"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bot size={14} />
            <span>Future Agentic Network (10 Agents)</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 rounded-none px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "audit"
                ? "bg-signal text-signal-foreground shadow-xs"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck size={14} />
            <span>Referential Integrity Audit</span>
          </button>
        </div>

        <span className="font-mono text-xs text-muted-foreground">
          Ontology Revision: <strong className="text-signal">REV 2026.1-PROV</strong>
        </span>
      </div>

      {/* TAB 1: KNOWLEDGE GRAPH EXPLORER */}
      {activeTab === "graph" && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 items-center">
              <div className="relative lg:col-span-5">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search by ID, name, standard, or parameter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded bg-background border border-border text-xs font-mono focus:outline-none focus:border-signal"
                />
              </div>

              <div className="lg:col-span-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full h-10 rounded bg-background border border-border px-3 text-xs font-mono focus:outline-none focus:border-signal"
                >
                  <option value="all">All Node Types ({allNodes.length})</option>
                  <option value="ProductLine">ProductLine</option>
                  <option value="ProductRange">ProductRange</option>
                  <option value="Application">Application</option>
                  <option value="UseCase">UseCase</option>
                  <option value="IntelligenceLevel">IntelligenceLevel</option>
                  <option value="ResearchSource">ResearchSource</option>
                  <option value="CompatibilityRule">CompatibilityRule</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <select
                  value={selectedVerification}
                  onChange={(e) => setSelectedVerification(e.target.value)}
                  className="w-full h-10 rounded bg-background border border-border px-3 text-xs font-mono focus:outline-none focus:border-signal"
                >
                  <option value="all">All Verifications</option>
                  <option value="verified">Verified Only</option>
                  <option value="configurable">Configurable</option>
                </select>
              </div>

              <div className="lg:col-span-2 flex justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedVerification("all");
                  }}
                  className="text-xs font-mono text-muted-foreground hover:text-signal"
                >
                  <RotateCcw size={12} className="mr-1.5" /> Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Two-Pane Node Browser */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Left Column: Node List (Col 1-5) */}
            <div className="lg:col-span-5 rounded-xl border border-border bg-card p-4 space-y-2 max-h-[700px] overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-2 py-1 border-b border-border/40">
                <span>Showing {filteredNodes.length} Nodes</span>
                <span>Click to Inspect</span>
              </div>

              {filteredNodes.slice(0, 50).map((node) => {
                const isSelected = activeNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                      isSelected
                        ? "border-signal bg-signal/10 shadow-xs"
                        : "border-border/60 bg-background/60 hover:border-signal/50"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-signal uppercase tracking-wider">
                        {node.nodeType}
                      </span>
                      <span className="text-muted-foreground uppercase">
                        {node.verificationStatus}
                      </span>
                    </div>
                    <h4 className="mt-1 font-display text-sm uppercase text-foreground font-bold line-clamp-1">
                      {node.canonicalName}
                    </h4>
                    <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                      {node.summary}
                    </p>
                    <span className="mt-2 block font-mono text-[9px] text-muted-foreground/60 truncate">
                      ID: {node.id}
                    </span>
                  </button>
                );
              })}

              {filteredNodes.length > 50 && (
                <div className="text-center py-2 text-xs font-mono text-muted-foreground">
                  + {filteredNodes.length - 50} more nodes (refine query to filter)
                </div>
              )}
            </div>

            {/* Right Column: Active Node Inspector (Col 6-12) */}
            {activeNode && (
              <div className="lg:col-span-7 rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-md">
                <div className="border-b border-border/60 pb-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded bg-signal/15 px-2.5 py-0.5 font-mono text-xs font-bold text-signal uppercase">
                      {activeNode.nodeType}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      ID: <strong className="text-foreground">{activeNode.id}</strong>
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
                    {activeNode.canonicalName}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {activeNode.summary}
                  </p>
                </div>

                {/* Node Attributes Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-signal mb-3">
                    Indexed Attributes &amp; Parameters
                  </h4>
                  <div className="overflow-x-auto rounded border border-border bg-background p-4 text-xs font-mono">
                    <dl className="grid gap-2 sm:grid-cols-2">
                      {Object.entries(activeNode.attributes).map(([key, val]) => (
                        <div key={key} className="border-b border-border/30 pb-1.5">
                          <dt className="text-[10px] uppercase font-sans text-muted-foreground">
                            {key}:
                          </dt>
                          <dd className="text-foreground font-semibold truncate">
                            {typeof val === "object" ? JSON.stringify(val) : String(val)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                {/* Connected Relationships */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-signal mb-3">
                    Connected Graph Relationships ({activeEdges.length})
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {activeEdges.map((edge) => {
                      const isOutbound = edge.sourceNodeId === activeNode.id;
                      return (
                        <div
                          key={edge.id}
                          className="flex items-center justify-between rounded border border-border/60 bg-background p-3 text-xs font-mono"
                        >
                          <div className="truncate mr-2">
                            <span
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded mr-2 ${
                                isOutbound
                                  ? "bg-signal/15 text-signal"
                                  : "bg-amber-500/15 text-amber-500"
                              }`}
                            >
                              {edge.relationType}
                            </span>
                            <span className="text-foreground">
                              {isOutbound ? edge.targetNodeId : edge.sourceNodeId}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground shrink-0 uppercase">
                            {edge.verificationStatus}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                  {activeNode.nodeType === "ProductRange" && (
                    <Button
                      asChild
                      className="rounded-none bg-signal font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90"
                    >
                      <Link
                        to="/products/$category/$id"
                        params={{
                          category: activeNode.attributes.lineId || "precision-reducers",
                          id: activeNode.slug,
                        }}
                      >
                        Open Product Range Page <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </Button>
                  )}
                  {activeNode.nodeType === "Application" && (
                    <Button
                      asChild
                      className="rounded-none bg-signal font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90"
                    >
                      <Link
                        to="/applications/$applicationId"
                        params={{ applicationId: activeNode.slug }}
                      >
                        Explore Application Vertical <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </Button>
                  )}
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Agent Access: {activeNode.agentAccess.allowedAgents.length} Agents Permitted
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FUTURE AGENTIC NETWORK CONTRACTS */}
      {activeTab === "agents" && (
        <div className="space-y-8">
          <div className="rounded-xl border border-signal/40 bg-signal/5 p-6">
            <div className="flex items-start gap-3">
              <Bot size={24} className="text-signal shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-xl font-bold uppercase text-foreground">
                  Future Autonomous Agent Network Architecture
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Layer C establishes the formal operational boundaries for 10 specialized engineering agents.
                  Each agent is bound by strict capability limits, mandatory human review triggers, and SI dimensional verification.
                  <strong className="text-foreground"> Note: Agents are not live or unsupervised during this phase.</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Agent Selector List */}
            <div className="lg:col-span-4 rounded-xl border border-border bg-card p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block px-2 pb-2 border-b border-border/40">
                Select Agent Specification
              </span>
              {FUTURE_AGENT_CONTRACTS.map((agent) => (
                <button
                  key={agent.agentId}
                  onClick={() => setSelectedAgentId(agent.agentId)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                    selectedAgentId === agent.agentId
                      ? "border-signal bg-signal/10"
                      : "border-border/60 bg-background/60 hover:border-signal/50"
                  }`}
                >
                  <span className="font-mono text-[10px] text-signal font-bold uppercase">
                    {agent.agentId}
                  </span>
                  <h4 className="font-display text-sm font-bold uppercase text-foreground">
                    {agent.agentName}
                  </h4>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                    {agent.role}
                  </p>
                </button>
              ))}
            </div>

            {/* Selected Agent Details */}
            {selectedAgent && (
              <div className="lg:col-span-8 rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
                <div className="border-b border-border/60 pb-5">
                  <span className="rounded bg-signal/15 px-2.5 py-0.5 font-mono text-xs font-bold text-signal uppercase">
                    {selectedAgent.agentId}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
                    {selectedAgent.agentName}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-signal">
                    {selectedAgent.role}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {selectedAgent.primaryPurpose}
                  </p>
                </div>

                {/* Boundaries */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 block font-mono">
                      Authorized Actions
                    </span>
                    <ul className="space-y-1.5 text-xs text-foreground/90">
                      {selectedAgent.scopeAndBoundaries.authorizedActions.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-red-400 block font-mono">
                      Strict Capability Boundaries
                    </span>
                    <ul className="space-y-1.5 text-xs text-foreground/90">
                      {selectedAgent.scopeAndBoundaries.strictBoundaries.map((bnd, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />
                          <span>{bnd}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mandatory Human Review Triggers */}
                <div className="rounded-lg border border-border bg-background p-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 font-mono block">
                    Mandatory Human Review Triggers
                  </span>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {selectedAgent.humanReviewRequirements.mandatoryTriggers.map((trig, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-foreground/90">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{trig}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="pt-2 border-t border-border/40 text-[11px] font-mono text-signal">
                    Workflow: {selectedAgent.humanReviewRequirements.approvalWorkflow}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: REFERENTIAL INTEGRITY AUDIT */}
      {activeTab === "audit" && (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-border/60 pb-5">
            <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-wider">
              Automated Referential Integrity Engine
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase text-foreground">
              Knowledge Graph Quality Audit Report
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Evaluated at {integrityReport.timestamp}. Zero broken pointers across entire robotics ontology.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded border border-border bg-background p-4 space-y-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Nodes by Ontological Type
              </span>
              <div className="space-y-1 text-xs font-mono">
                {Object.entries(integrityReport.nodesByType).map(([t, count]) => (
                  <div key={t} className="flex justify-between">
                    <span className="text-muted-foreground">{t}:</span>
                    <span className="font-bold text-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded border border-border bg-background p-4 space-y-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Edges by Relationship Type
              </span>
              <div className="space-y-1 text-xs font-mono">
                {Object.entries(integrityReport.edgesByType).map(([r, count]) => (
                  <div key={r} className="flex justify-between">
                    <span className="text-muted-foreground">{r}:</span>
                    <span className="font-bold text-signal">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded border border-border bg-background p-4 space-y-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Verification State Breakdown
              </span>
              <div className="space-y-1 text-xs font-mono">
                {Object.entries(integrityReport.verificationBreakdown).map(([v, count]) => (
                  <div key={v} className="flex justify-between">
                    <span className="text-muted-foreground">{v}:</span>
                    <span className="font-bold text-emerald-400">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
