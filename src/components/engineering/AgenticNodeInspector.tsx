import React, { useState } from "react";
import { knowledgeGraph } from "@/data/knowledgeGraph/graphBuilder";
import { FUTURE_AGENT_CONTRACTS } from "@/data/knowledgeGraph/agenticNetwork";
import {
  Bot,
  Copy,
  Check,
  ShieldCheck,
  Network,
  Terminal,
  ExternalLink,
  Code,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  nodeId: string; // e.g. "range:ind-red-cup-strain-wave" or "line:precision-reducers"
}

export const AgenticNodeInspector: React.FC<Props> = ({ nodeId }) => {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent:product-research");

  // Attempt to find node directly or try range: or line: prefixes
  let node = knowledgeGraph.getNode(nodeId);
  if (!node && !nodeId.includes(":")) {
    node = knowledgeGraph.getNode(`range:${nodeId}`) || knowledgeGraph.getNode(`line:${nodeId}`);
  }

  if (!node) {
    return null;
  }

  const outboundEdges = knowledgeGraph.getEdgesForNode(node.id, "out");
  const inboundEdges = knowledgeGraph.getEdgesForNode(node.id, "in");
  const connectedAgents = FUTURE_AGENT_CONTRACTS.filter((a) =>
    node?.agentAccess.allowedAgents.includes(a.agentId)
  );

  const selectedAgent = FUTURE_AGENT_CONTRACTS.find((a) => a.agentId === selectedAgentId);

  const handleCopyJson = () => {
    const payload = {
      node,
      outboundEdges,
      inboundEdges,
      agentContract: selectedAgent,
      schemaVersion: "2026.1-agentic-ready",
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 border border-signal/40 bg-surface-elevated/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[.22em] text-signal mb-3">
              <Bot size={13} className="text-signal" />
              <span>Layer C: Future Agentic Network Readiness</span>
            </div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
              Knowledge Graph Node Inspector
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-surface-foreground/75 sm:text-sm max-w-3xl">
              Machine-readable semantic ontology prepared for future autonomous engineering agents. 
              Provides stable global identifiers, referential edge provenance, SI unit consistency, and strict human-in-the-loop permission boundaries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRawJson(!showRawJson)}
              className="rounded-none border-surface-foreground/30 text-xs font-bold uppercase text-surface-foreground hover:text-signal"
            >
              <Code size={14} className="mr-1.5" />
              {showRawJson ? "Hide Raw JSON" : "View Agent JSON"}
            </Button>
            <Button
              size="sm"
              onClick={handleCopyJson}
              className="rounded-none bg-signal text-xs font-bold uppercase text-signal-foreground hover:bg-signal/90"
            >
              {copied ? (
                <>
                  <Check size={14} className="mr-1.5" /> Copied Payload
                </>
              ) : (
                <>
                  <Copy size={14} className="mr-1.5" /> Copy Agent Node
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Raw JSON View */}
        {showRawJson && (
          <div className="mt-6 rounded-md border border-signal/40 bg-black/80 p-5 font-mono text-xs text-signal overflow-x-auto max-h-96">
            <pre>
              {JSON.stringify(
                {
                  knowledgeNode: node,
                  relationshipEdges: [...outboundEdges, ...inboundEdges],
                  agentPermissionPolicy: node.agentAccess,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}

        {/* Structured Node Attributes Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Node Metadata (Col 1-4) */}
          <div className="lg:col-span-4 rounded-lg border border-border/60 bg-surface-elevated/40 p-6 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
              Entity Provenance &amp; Verification
            </span>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="block text-[10px] uppercase font-sans text-surface-foreground/60">
                  Global Stable ID:
                </span>
                <span className="text-signal font-bold break-all">{node.id}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-sans text-surface-foreground/60">
                  Ontological Node Type:
                </span>
                <span className="text-white font-bold">{node.nodeType}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-sans text-surface-foreground/60">
                  Verification State:
                </span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold border border-signal/40 bg-signal/15 text-signal">
                  {node.verificationStatus}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-sans text-surface-foreground/60">
                  Audit Version:
                </span>
                <span className="text-surface-foreground/90">
                  {node.audit.version} (Reviewed: {node.audit.lastReviewed})
                </span>
              </div>

              <div className="border-t border-border/40 pt-3">
                <span className="block text-[10px] uppercase font-sans text-surface-foreground/60 mb-1">
                  Human-in-the-Loop Policy:
                </span>
                <span className="text-emerald-400 text-[11px] font-sans flex items-center gap-1.5">
                  <ShieldCheck size={14} className="shrink-0" />
                  Write operations strictly require human approval. Autonomous modification disabled.
                </span>
              </div>
            </div>
          </div>

          {/* Connected Edges & Relationships (Col 5-8) */}
          <div className="lg:col-span-4 rounded-lg border border-border/60 bg-surface-elevated/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                Semantic Graph Relationships ({outboundEdges.length + inboundEdges.length})
              </span>
              <Network size={15} className="text-signal" />
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs font-mono">
              {outboundEdges.map((edge) => (
                <div
                  key={edge.id}
                  className="rounded border border-border/40 bg-surface-dark/80 p-3 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-signal font-bold uppercase">
                      --[{edge.relationType}]--&gt;
                    </span>
                    <span className="text-surface-foreground/60 uppercase">
                      {edge.verificationStatus}
                    </span>
                  </div>
                  <div className="text-white text-[11px] truncate">
                    Target: <strong className="text-signal">{edge.targetNodeId}</strong>
                  </div>
                  <p className="text-[10px] font-sans text-surface-foreground/70">
                    {edge.description}
                  </p>
                </div>
              ))}

              {inboundEdges.map((edge) => (
                <div
                  key={edge.id}
                  className="rounded border border-border/40 bg-surface-dark/80 p-3 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-amber-400 font-bold uppercase">
                      &lt;--[{edge.relationType}]--
                    </span>
                    <span className="text-surface-foreground/60 uppercase">
                      {edge.verificationStatus}
                    </span>
                  </div>
                  <div className="text-white text-[11px] truncate">
                    Source: <strong className="text-amber-400">{edge.sourceNodeId}</strong>
                  </div>
                  <p className="text-[10px] font-sans text-surface-foreground/70">
                    {edge.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Future Agent Capability Contract (Col 9-12) */}
          <div className="lg:col-span-4 rounded-lg border border-border/60 bg-surface-elevated/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                Future Agent Capability Contract
              </span>
              <Terminal size={15} className="text-signal" />
            </div>

            {/* Agent Selector */}
            <div>
              <label className="text-[10px] uppercase font-mono text-surface-foreground/60 block mb-1.5">
                Inspect Agent Specification:
              </label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full h-9 rounded border border-border/60 bg-surface-dark px-3 text-xs font-mono text-signal focus:outline-none focus:border-signal"
              >
                {connectedAgents.map((agent) => (
                  <option key={agent.agentId} value={agent.agentId}>
                    {agent.agentName}
                  </option>
                ))}
              </select>
            </div>

            {selectedAgent && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-signal block uppercase">ROLE:</span>
                  <p className="text-white font-semibold text-[11px]">
                    {selectedAgent.role}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-signal block uppercase">CAPABILITY BOUNDARIES:</span>
                  <ul className="mt-1 space-y-1 text-[11px] text-surface-foreground/80">
                    {selectedAgent.scopeAndBoundaries.strictBoundaries.slice(0, 2).map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <ChevronRight size={12} className="text-signal mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border/40 pt-2 text-[10px] font-mono text-surface-foreground/60">
                  Status: <strong className="text-amber-400">READINESS PHASE</strong> (No unsupervised agents active)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
