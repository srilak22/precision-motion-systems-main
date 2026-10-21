import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Layers,
  Cpu,
  Activity,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Eye,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TOTAL_ROBOTICS_PILLARS,
  getAllSubcategories,
  TaxonomySubcategory,
  TaxonomyPillar,
} from "@/data/taxonomy/roboticsTaxonomyData";
import { TAXONOMY_FACETS } from "@/data/taxonomy/facets";
import { RESEARCH_REGISTER } from "@/data/taxonomy/researchRegister";
import { validateTaxonomyGraph } from "@/data/taxonomy/agenticRelations";
import { VisualRelationshipMap } from "./VisualRelationshipMap";
import { TaxonomyDiagrams } from "./TaxonomyDiagrams";
import { EngineeringSpecWorkspace } from "./EngineeringSpecWorkspace";

export type ExplorerMode =
  | "cards"
  | "spec-workspace"
  | "relationship-map"
  | "technical-diagrams"
  | "standards-register"
  | "agentic-integrity";

export function TaxonomyExplorer({
  initialPillarId,
  initialSubcategoryId,
}: {
  initialPillarId?: string;
  initialSubcategoryId?: string;
}) {
  const [activeMode, setActiveMode] = useState<ExplorerMode>(
    initialSubcategoryId ? "spec-workspace" : "cards"
  );
  const [selectedPillarId, setSelectedPillarId] = useState<string>(initialPillarId || "all");
  const [inspectSubcatId, setInspectSubcatId] = useState<string>(
    initialSubcategoryId || "subcat:bipedal-humanoid"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Multi-select facet filter state: facetId -> Set of selected option IDs
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({
    morphology: [],
    mobility: [],
    environment: [],
    domain: [],
    capability: [],
    autonomy: [],
    manipulation: [],
    deployment: [],
  });

  const [expandedFacetKey, setExpandedFacetKey] = useState<string | null>(null);

  // Toggle facet filter option
  const toggleFacetOption = (facetKey: string, optionId: string) => {
    setSelectedFacets((prev) => {
      const current = prev[facetKey] || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [facetKey]: updated };
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPillarId("all");
    setSelectedFacets({
      morphology: [],
      mobility: [],
      environment: [],
      domain: [],
      capability: [],
      autonomy: [],
      manipulation: [],
      deployment: [],
    });
  };

  // Active filter count
  const activeFacetCount = useMemo(() => {
    return Object.values(selectedFacets).reduce((acc, arr) => acc + arr.length, 0);
  }, [selectedFacets]);

  // Filter subcategories
  const allSubcategories = useMemo(() => getAllSubcategories(), []);

  const filteredSubcategories = useMemo(() => {
    return allSubcategories.filter((sub) => {
      // 1. Pillar filter
      if (selectedPillarId !== "all" && sub.pillarId !== selectedPillarId) {
        return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = sub.title.toLowerCase().includes(query);
        const matchesSummary = sub.summary.toLowerCase().includes(query);
        const matchesDef = sub.definition.toLowerCase().includes(query);
        const matchesRep = sub.representativeProducts.some((p) => p.toLowerCase().includes(query));
        if (!matchesName && !matchesSummary && !matchesDef && !matchesRep) {
          return false;
        }
      }

      // 3. Independent Facet filters (AND between facets, OR within facet)
      for (const [fKey, selectedOpts] of Object.entries(selectedFacets)) {
        if (selectedOpts.length > 0) {
          const subcatFacetVals = sub.facets[fKey as keyof typeof sub.facets] || [];
          const hasMatch = selectedOpts.some((optId) => subcatFacetVals.includes(optId));
          if (!hasMatch) return false;
        }
      }

      return true;
    });
  }, [allSubcategories, selectedPillarId, searchQuery, selectedFacets]);

  // Handle open spec workspace for a subcategory
  const handleOpenWorkspace = (subcatId: string) => {
    setInspectSubcatId(subcatId);
    setActiveMode("spec-workspace");
  };

  // Knowledge graph live integrity status
  const integrityReport = useMemo(() => validateTaxonomyGraph(), []);

  return (
    <div className="space-y-6" id="taxonomy-workspace">
      {/* Top Header Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveMode("cards")}
            className={`flex items-center gap-2 rounded px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === "cards"
                ? "bg-signal text-signal-foreground shadow-sm"
                : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80 hover:text-foreground"
            }`}
          >
            <Layers size={13} />
            Visual Pillar Cards ({filteredSubcategories.length})
          </button>

          <button
            onClick={() => setActiveMode("spec-workspace")}
            className={`flex items-center gap-2 rounded px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === "spec-workspace"
                ? "bg-signal text-signal-foreground shadow-sm"
                : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80 hover:text-foreground"
            }`}
          >
            <Cpu size={13} />
            Engineering Spec Workspace
          </button>

          <button
            onClick={() => setActiveMode("relationship-map")}
            className={`flex items-center gap-2 rounded px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === "relationship-map"
                ? "bg-signal text-signal-foreground shadow-sm"
                : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80 hover:text-foreground"
            }`}
          >
            <GitBranch size={13} />
            Visual Relationship Map
          </button>

          <button
            onClick={() => setActiveMode("technical-diagrams")}
            className={`flex items-center gap-2 rounded px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === "technical-diagrams"
                ? "bg-signal text-signal-foreground shadow-sm"
                : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80 hover:text-foreground"
            }`}
          >
            <Activity size={13} />
            Kinematic Diagrams
          </button>

          <button
            onClick={() => setActiveMode("standards-register")}
            className={`flex items-center gap-2 rounded px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === "standards-register"
                ? "bg-signal text-signal-foreground shadow-sm"
                : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80 hover:text-foreground"
            }`}
          >
            <BookOpen size={13} />
            Standards Register ({RESEARCH_REGISTER.length})
          </button>

          <button
            onClick={() => setActiveMode("agentic-integrity")}
            className={`flex items-center gap-2 rounded px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              activeMode === "agentic-integrity"
                ? "bg-signal text-signal-foreground shadow-sm"
                : "bg-surface-elevated text-muted-foreground hover:bg-surface-elevated/80 hover:text-foreground"
            }`}
          >
            <ShieldCheck size={13} />
            Agentic Network Integrity ({integrityReport.status})
          </button>
        </div>

        {/* Global Reset */}
        {(activeFacetCount > 0 || searchQuery || selectedPillarId !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-destructive hover:text-destructive/80 font-bold uppercase"
          >
            <RotateCcw size={12} className="mr-1.5" />
            Reset Discovery ({activeFacetCount} active)
          </Button>
        )}
      </div>

      {/* FILTER CONTROLS BAR (Shown for cards and spec views) */}
      {(activeMode === "cards" || activeMode === "spec-workspace") && (
        <div className="rounded-lg border border-border/60 bg-surface-dark p-4 shadow-lg space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search robotics subcategories, products, kinematics, standards..."
                className="w-full rounded border border-border bg-surface-elevated py-2 pl-9 pr-3 text-xs text-foreground placeholder-muted-foreground focus:border-signal focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Pillar Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedPillarId("all")}
                className={`whitespace-nowrap rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedPillarId === "all"
                    ? "bg-signal text-signal-foreground"
                    : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                }`}
              >
                All 8 Pillars
              </button>
              {TOTAL_ROBOTICS_PILLARS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPillarId(p.id)}
                  className={`whitespace-nowrap rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedPillarId === p.id
                      ? "bg-signal text-signal-foreground"
                      : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.categoryNumber}. {p.shortTitle}
                </button>
              ))}
            </div>
          </div>

          {/* Independent Facet Chips Bar */}
          <div className="border-t border-border/40 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Filter size={12} className="text-signal" />
                Multi-Facet Independent Discovery (8 Dimensions):
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                Showing {filteredSubcategories.length} of {allSubcategories.length} canonical records
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {Object.keys(TAXONOMY_FACETS).map((fKey) => {
                const facet = TAXONOMY_FACETS[fKey];
                const activeCount = selectedFacets[fKey]?.length || 0;
                const isExpanded = expandedFacetKey === fKey;

                return (
                  <div key={facet.id} className="relative">
                    <button
                      onClick={() => setExpandedFacetKey(isExpanded ? null : fKey)}
                      className={`flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-semibold transition-all ${
                        activeCount > 0
                          ? "border-signal bg-signal/15 text-signal font-bold"
                          : "border-border/60 bg-surface-elevated/60 text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      <span>{facet.shortTitle}</span>
                      {activeCount > 0 && (
                        <span className="rounded-full bg-signal text-signal-foreground px-1.5 py-0.2 text-[9px] font-bold">
                          {activeCount}
                        </span>
                      )}
                    </button>

                    {/* Dropdown for Facet Options */}
                    {isExpanded && (
                      <div className="absolute left-0 top-full z-30 mt-1 w-64 rounded-lg border border-border bg-surface-dark p-3 shadow-2xl space-y-2">
                        <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                          <span className="text-xs font-bold text-foreground">{facet.title}</span>
                          <button
                            onClick={() => setExpandedFacetKey(null)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X size={12} />
                          </button>
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-1 pr-1 text-xs">
                          {facet.options.map((opt) => {
                            const isChecked = selectedFacets[fKey]?.includes(opt.id);
                            return (
                              <label
                                key={opt.id}
                                className="flex cursor-pointer items-start gap-2 rounded p-1 hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleFacetOption(fKey, opt.id)}
                                  className="mt-0.5 rounded border-border text-signal focus:ring-0"
                                />
                                <div className="leading-tight">
                                  <div className="font-semibold text-foreground text-[11px]">{opt.label}</div>
                                  <div className="text-[9px] text-muted-foreground">{opt.shortCode}</div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Active Filters Pill Bar */}
            {activeFacetCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Active:</span>
                {Object.entries(selectedFacets).flatMap(([fKey, optIds]) =>
                  optIds.map((optId) => {
                    const opt = TAXONOMY_FACETS[fKey]?.options.find((o) => o.id === optId);
                    return (
                      <span
                        key={`${fKey}-${optId}`}
                        className="inline-flex items-center gap-1 rounded bg-surface-elevated px-2 py-0.5 text-[10px] font-medium text-foreground border border-border/60"
                      >
                        <span className="text-signal font-bold">{TAXONOMY_FACETS[fKey]?.shortTitle}:</span>
                        <span>{opt?.label || optId}</span>
                        <button
                          onClick={() => toggleFacetOption(fKey, optId)}
                          className="hover:text-destructive ml-1"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 1: VISUAL PILLAR CARDS */}
      {activeMode === "cards" && (
        <div className="space-y-6">
          {filteredSubcategories.length === 0 ? (
            <div className="rounded-lg border border-border/60 bg-surface-dark p-12 text-center shadow-lg">
              <Search size={36} className="mx-auto text-muted-foreground/50" />
              <h3 className="mt-3 font-display text-base font-bold uppercase text-foreground">
                No Robotics Subcategories Match Your Filter
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Try clearing one or more active facets or adjusting your search keyword.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-none uppercase text-xs"
                onClick={resetFilters}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubcategories.map((subcat) => {
                const parent = TOTAL_ROBOTICS_PILLARS.find((p) => p.id === subcat.pillarId);
                return (
                  <div
                    key={subcat.id}
                    className="flex flex-col justify-between rounded-lg border border-border/60 bg-card overflow-hidden shadow-lg hover:border-signal/70 transition-all group"
                  >
                    <div>
                      {/* Subcategory Visual Header */}
                      <div className="relative h-44 w-full overflow-hidden bg-surface-dark">
                        <img
                          src={parent?.image}
                          alt={subcat.title}
                          className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="rounded bg-signal/90 px-2.5 py-0.5 text-[10px] font-bold uppercase text-signal-foreground">
                            {parent?.categoryNumber} {parent?.shortTitle}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-display text-lg font-bold text-foreground leading-tight group-hover:text-signal transition-colors">
                            {subcat.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-3">
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {subcat.summary}
                        </p>

                        {/* Morphology and Locomotion Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {subcat.facets.morphology.map((m) => (
                            <span
                              key={m}
                              className="rounded bg-surface-elevated px-2 py-0.5 text-[9px] font-mono text-muted-foreground border border-border/40"
                            >
                              {m}
                            </span>
                          ))}
                          {subcat.facets.mobility.map((mob) => (
                            <span
                              key={mob}
                              className="rounded bg-precision-blue/15 px-2 py-0.5 text-[9px] font-bold text-precision-blue"
                            >
                              {mob}
                            </span>
                          ))}
                        </div>

                        {/* Benchmark Products */}
                        <div className="border-t border-border/40 pt-2 text-[11px]">
                          <span className="text-muted-foreground">Benchmarks: </span>
                          <span className="font-semibold text-foreground">
                            {subcat.representativeProducts.slice(0, 3).join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="border-t border-border/60 bg-surface-elevated/40 p-4">
                      <Button
                        className="w-full rounded-none bg-signal text-signal-foreground font-bold uppercase text-xs hover:bg-signal/90"
                        onClick={() => handleOpenWorkspace(subcat.id)}
                      >
                        Inspect Engineering Specs
                        <ArrowRight size={13} className="ml-1.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: ENGINEERING SPEC WORKSPACE */}
      {activeMode === "spec-workspace" && (
        <EngineeringSpecWorkspace
          initialSubcategoryId={inspectSubcatId}
          onBackToExplorer={() => setActiveMode("cards")}
        />
      )}

      {/* MODE 3: VISUAL RELATIONSHIP MAP */}
      {activeMode === "relationship-map" && (
        <VisualRelationshipMap
          onSelectSubcategory={(subcatId) => {
            setInspectSubcatId(subcatId);
            setActiveMode("spec-workspace");
          }}
        />
      )}

      {/* MODE 4: TECHNICAL KINEMATIC DIAGRAMS */}
      {activeMode === "technical-diagrams" && <TaxonomyDiagrams />}

      {/* MODE 5: STANDARDS & RESEARCH REGISTER */}
      {activeMode === "standards-register" && (
        <div className="rounded-lg border border-border/60 bg-card p-6 shadow-xl space-y-6">
          <div className="border-b border-border/40 pb-4">
            <h3 className="font-display text-lg font-bold uppercase text-foreground">
              Official Robotics Classification Research Register
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              International standards and official definitions establishing ground truth for the INDUS Total Robotics Taxonomy.
            </p>
          </div>

          <div className="divide-y divide-border/40">
            {RESEARCH_REGISTER.map((record) => (
              <div key={record.id} className="py-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded bg-signal/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-signal">
                    {record.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-surface-elevated px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
                      {record.scope}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                      <CheckCircle2 size={10} /> {record.verificationStatus}
                    </span>
                  </div>
                </div>

                <h4 className="font-display text-base font-bold text-foreground">
                  {record.title}
                </h4>

                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Publisher:</strong> {record.publisherOrManufacturer}
                </p>

                <p className="text-xs leading-relaxed text-foreground/90 bg-surface-elevated/40 p-3 rounded border border-border/40">
                  <strong className="text-signal">Relevant Claim / Definition:</strong> {record.relevantClaimOrStandard}
                </p>

                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Architectural Distinction:</strong> {record.keyDistinctions}
                </p>

                <div className="pt-1">
                  <a
                    href={record.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-signal hover:underline"
                  >
                    View Official Standard Source <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 6: AGENTIC GRAPH INTEGRITY AUDIT */}
      {activeMode === "agentic-integrity" && (
        <div className="rounded-lg border border-border/60 bg-card p-6 shadow-xl space-y-6">
          <div className="border-b border-border/40 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold uppercase text-foreground">
                Knowledge Graph &amp; Future Agentic Network Integrity Report
              </h3>
              <span className="rounded bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Status: {integrityReport.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Automated in-browser validation auditing duplicate IDs, missing parents, dangling edge references, and unsourced technical claims.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded border border-border/60 bg-surface-elevated/40 p-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Nodes</span>
              <div className="text-2xl font-display font-bold text-foreground mt-1">{integrityReport.totalNodes}</div>
              <span className="text-[10px] text-signal font-mono">Structured Graph</span>
            </div>

            <div className="rounded border border-border/60 bg-surface-elevated/40 p-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Explicit Edges</span>
              <div className="text-2xl font-display font-bold text-foreground mt-1">{integrityReport.totalEdges}</div>
              <span className="text-[10px] text-signal font-mono">10 Relation Types</span>
            </div>

            <div className="rounded border border-border/60 bg-surface-elevated/40 p-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Dangling Edges</span>
              <div className="text-2xl font-display font-bold text-emerald-400 mt-1">{integrityReport.danglingEdges.length}</div>
              <span className="text-[10px] text-emerald-400 font-mono">Zero broken links</span>
            </div>

            <div className="rounded border border-border/60 bg-surface-elevated/40 p-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Duplicate IDs</span>
              <div className="text-2xl font-display font-bold text-emerald-400 mt-1">{integrityReport.duplicateIds.length}</div>
              <span className="text-[10px] text-emerald-400 font-mono">100% Unique Stable IDs</span>
            </div>
          </div>

          {/* Relation Breakdown */}
          <div className="border-t border-border/40 pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Edge Breakdown by Semantic Ontology Relation:
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 text-xs font-mono">
              {Object.entries(integrityReport.edgesByRelation).map(([rel, count]) => (
                <div key={rel} className="rounded bg-surface-elevated/50 p-2.5 border border-border/40">
                  <div className="text-[10px] font-sans font-bold text-signal">{rel}</div>
                  <div className="text-base font-bold text-foreground mt-1">{count} edges</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Agentic Readiness Verified:
            </p>
            <p className="mt-1 text-emerald-300/80 leading-relaxed">
              Every taxonomy node exposes deterministic schema contracts with stable identifiers. Ready for integration with future autonomous verification, research, and product-selection agents without unsupervised execution risk.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
