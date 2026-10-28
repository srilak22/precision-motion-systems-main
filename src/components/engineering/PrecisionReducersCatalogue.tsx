import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Wrench,
  MessageSquare,
  SlidersHorizontal,
  Layers,
  Cpu,
  Shield,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  LayoutGrid,
  List,
  Sparkles,
  Zap,
  Info,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import { images } from "@/lib/images";
import {
  PRECISION_REDUCER_RANGES,
  REDUCER_TECHNOLOGIES,
  COMPARISON_METRICS_EXPLANATION,
  APPLICATION_TO_REDUCER_MAPPING,
  REDUCER_FAQS,
  ReducerRangeItem,
  ReducerTechnologyType,
} from "@/data/precisionReducersData";

export function PrecisionReducersCatalogue() {
  const { openModal } = useModals();

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [selectedShaft, setSelectedShaft] = useState<string>("all");
  const [selectedBacklash, setSelectedBacklash] = useState<string>("all");
  const [selectedVerification, setSelectedVerification] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Selected technology for deep-dive (Section B)
  const [activeTechId, setActiveTechId] = useState<ReducerTechnologyType>("harmonic-strain-wave");

  // Comparison State (Section D)
  const [compareIds, setCompareIds] = useState<string[]>([
    "indus-shd-silk-hat",
    "indus-rv-e-flange",
    "indus-pl-inline-high-torque",
  ]);
  const [showComparisonGuide, setShowComparisonGuide] = useState(false);

  // Selection Assistant State (Section E)
  const [assistantStep, setAssistantStep] = useState(1);
  const [assistantAnswers, setAssistantAnswers] = useState({
    application: "wrist",
    torque: "medium",
    backlash: "ultra",
    hollowBore: "yes",
    shock: "medium",
  });
  const [assistantFinished, setAssistantFinished] = useState(false);

  // Active detail modal for a specific range
  const [inspectedRange, setInspectedRange] = useState<ReducerRangeItem | null>(null);

  // Filter Logic
  const filteredRanges = useMemo(() => {
    return PRECISION_REDUCER_RANGES.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchTag = item.tagline.toLowerCase().includes(q);
        const matchTech = item.technologyName.toLowerCase().includes(q);
        const matchPurpose = item.engineeringPurpose.toLowerCase().includes(q);
        const matchApp = item.typicalApplications.some((app) => app.toLowerCase().includes(q));
        if (!matchName && !matchTag && !matchTech && !matchPurpose && !matchApp) {
          return false;
        }
      }

      // Technology
      if (selectedTech !== "all" && item.technology !== selectedTech) {
        return false;
      }

      // Shaft
      if (selectedShaft !== "all" && item.specifications.shaftConfiguration !== selectedShaft) {
        return false;
      }

      // Verification
      if (selectedVerification !== "all" && item.verificationStatus !== selectedVerification) {
        return false;
      }

      // Backlash
      if (selectedBacklash !== "all") {
        const bl = item.specifications.backlashArcmin.toLowerCase();
        if (selectedBacklash === "sub-1" && !bl.includes("0.") && !bl.includes("< 0.5") && !bl.includes("< 1")) {
          return false;
        }
        if (selectedBacklash === "1-to-3" && !bl.includes("1") && !bl.includes("1.5") && !bl.includes("2") && !bl.includes("3")) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedTech, selectedShaft, selectedBacklash, selectedVerification]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTech("all");
    setSelectedShaft("all");
    setSelectedBacklash("all");
    setSelectedVerification("all");
  };

  // WhatsApp CTA
  const handleWhatsApp = (contextName: string) => {
    window.open(
      companyConfig.getWhatsAppUrl({ type: "product", name: `Precision Reducers - ${contextName}` }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Comparison toggle
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  // Preset Comparison loaders
  const loadPreset = (type: "wrist" | "base" | "mobile") => {
    if (type === "wrist") {
      setCompareIds(["indus-shd-silk-hat", "indus-csg-high-torque-harmonic", "indus-rv-n-compact"]);
    } else if (type === "base") {
      setCompareIds(["indus-rv-c-hollow", "indus-rv-e-flange", "indus-cyc-heavy-pinwheel"]);
    } else if (type === "mobile") {
      setCompareIds(["indus-pl-wheel-hub", "indus-hyp-right-angle-hollow", "indus-pl-inline-high-torque"]);
    }
  };

  // Selection Assistant Recommendation calculation
  const recommendation = useMemo(() => {
    let candidates = [...PRECISION_REDUCER_RANGES];

    if (assistantAnswers.application === "wrist") {
      candidates = candidates.filter(
        (c) => c.technology === "harmonic-strain-wave" || c.id === "indus-rv-n-compact"
      );
    } else if (assistantAnswers.application === "base") {
      candidates = candidates.filter(
        (c) => c.technology === "rv-cycloidal" || c.technology === "pure-cycloidal"
      );
    } else if (assistantAnswers.application === "mobile") {
      candidates = candidates.filter(
        (c) => c.id === "indus-pl-wheel-hub" || c.technology === "hypoid-right-angle" || c.technology === "precision-planetary"
      );
    } else if (assistantAnswers.application === "table") {
      candidates = candidates.filter(
        (c) => c.specifications.shaftConfiguration === "Hollow Bore" && (c.technology === "hypoid-right-angle" || c.technology === "rv-cycloidal")
      );
    }

    if (assistantAnswers.hollowBore === "yes") {
      const hollowMatches = candidates.filter((c) => c.specifications.shaftConfiguration === "Hollow Bore");
      if (hollowMatches.length > 0) candidates = hollowMatches;
    }

    return candidates.slice(0, 3);
  }, [assistantAnswers]);

  const activeTech = REDUCER_TECHNOLOGIES.find((t) => t.id === activeTechId) || REDUCER_TECHNOLOGIES[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ========================================================= */}
      {/* SECTION A: ENGINEERING HERO                                */}
      {/* ========================================================= */}
      <section className="relative technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28 overflow-hidden">
        {/* Subtle engineering line overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#16C7E8_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative mx-auto max-w-[1440px]">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-foreground/60 mb-6">
            <Link to="/" className="hover:text-signal transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-surface-foreground/30" />
            <Link to="/products" className="hover:text-signal transition-colors">
              Products
            </Link>
            <ChevronRight size={13} className="text-surface-foreground/30" />
            <span className="text-signal">Precision Reducers & Gearboxes</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 border border-signal/40 bg-surface-elevated/80 px-3.5 py-1.5 rounded-xs text-[11px] font-bold uppercase tracking-[.22em] text-signal mb-4">
                <span className="size-2 rounded-full bg-signal animate-pulse" />
                Deterministic Mechanical Transmission
              </div>

              <h1 className="font-display text-4xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
                Precision Reducers &amp; Gearboxes
              </h1>

              <p className="mt-4 font-display text-xl uppercase tracking-wide text-signal sm:text-2xl">
                Zero-Backlash Strain-Wave, RV Pin-Wheel &amp; High-Rigidity Planetary Drives
              </p>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-surface-foreground/80 sm:text-lg">
                Engineered for sub-arcminute repeatability, extreme dynamic torsional stiffness, and high shock overload resistance. Verified against ISO 9283 multi-axis robot positioning, DIN 3990 tooth load standards, and AGMA rating methodologies.
              </p>

              {/* Verified Standards Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-surface-foreground/70">
                <span className="border border-surface-foreground/20 bg-surface-dark/60 px-2.5 py-1">ISO 9283 Repeatability</span>
                <span className="border border-surface-foreground/20 bg-surface-dark/60 px-2.5 py-1">DIN 3990 Bending Fatigue</span>
                <span className="border border-surface-foreground/20 bg-surface-dark/60 px-2.5 py-1">AGMA 2001-D04 Sizing</span>
                <span className="border border-surface-foreground/20 bg-surface-dark/60 px-2.5 py-1">IP65 / IP67 Sealed Options</span>
              </div>

              {/* Primary Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#ranges-explorer"
                  className="inline-flex h-12 items-center justify-center rounded bg-signal px-7 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 transition-all shadow-md hover:shadow-signal/20"
                >
                  Explore 24 Reducer Ranges <ArrowRight size={15} className="ml-2" />
                </a>
                <Button
                  variant="outline"
                  className="h-12 rounded border-surface-foreground/30 bg-transparent px-6 text-xs font-bold uppercase tracking-wider text-surface-foreground hover:border-signal hover:text-signal"
                  onClick={() => openModal("engineer", { categoryName: "Precision Reducers Sizing" })}
                >
                  <Wrench size={15} className="mr-2 text-signal" />
                  Request Engineering Assistance
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded border-surface-foreground/30 bg-transparent px-5 text-xs font-bold uppercase tracking-wider text-surface-foreground hover:border-signal hover:text-signal"
                  onClick={() => handleWhatsApp("Hero Engineering Help")}
                >
                  <MessageSquare size={14} className="mr-1.5 text-signal" />
                  WhatsApp Engineering
                </Button>
              </div>
            </div>

            {/* Technical Visual Container */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl border border-surface-foreground/20 bg-surface-elevated/40 p-5 shadow-2xl backdrop-blur-xs">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-surface-dark flex items-center justify-center border border-surface-foreground/10">
                  <img
                    src={images.cycloidalReducer || images.harmonicReducer}
                    alt="INDUS Precision RV and Harmonic Reducer Cutaway"
                    className="h-full w-full object-contain p-4 transition-transform duration-500 hover:scale-105"
                  />
                  {/* Technical HUD Overlay Badges */}
                  <div className="absolute top-3 left-3 rounded-xs border border-signal/40 bg-surface-dark/90 px-2.5 py-1 font-mono text-[10px] text-signal">
                    LOST MOTION: &lt; 0.1 ARCMIN
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-xs border border-surface-foreground/20 bg-surface-dark/90 px-2.5 py-1 font-mono text-[10px] text-surface-foreground/90">
                    TORQUE DENSITY: &gt; 120 Nm/kg
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-xs border border-surface-foreground/20 bg-surface-dark/90 px-2.5 py-1 font-mono text-[10px] text-surface-foreground/90">
                    L10h: &gt; 20,000 HRS
                  </div>
                </div>

                {/* Quick Spec Matrix */}
                <div className="mt-4 grid grid-cols-4 gap-2 border-t border-surface-foreground/15 pt-3 text-center">
                  <div>
                    <span className="block font-mono text-base font-bold text-signal">24</span>
                    <span className="block text-[9px] uppercase tracking-wider text-surface-foreground/60">Ranges</span>
                  </div>
                  <div>
                    <span className="block font-mono text-base font-bold text-surface-foreground">5</span>
                    <span className="block text-[9px] uppercase tracking-wider text-surface-foreground/60">Technologies</span>
                  </div>
                  <div>
                    <span className="block font-mono text-base font-bold text-signal">&lt; 0.1&apos;</span>
                    <span className="block text-[9px] uppercase tracking-wider text-surface-foreground/60">Min Backlash</span>
                  </div>
                  <div>
                    <span className="block font-mono text-base font-bold text-surface-foreground">500%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-surface-foreground/60">Peak Shock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION B: REDUCER TECHNOLOGY SELECTOR                      */}
      {/* ========================================================= */}
      <section className="border-b border-border/60 bg-muted/40 px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[.22em] text-primary">
              Core Kinematic Architectures
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
              Reducer Technology Selector
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Selecting the appropriate transmission requires balancing torsional stiffness, shock absorption, backlash, and center bore space constraints. Compare the operating principles of our 5 verified technology families.
            </p>
          </div>

          {/* Technology Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-border/80 pb-4">
            {REDUCER_TECHNOLOGIES.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setActiveTechId(tech.id)}
                className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTechId === tech.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <span>{tech.name.split("/")[0].trim()}</span>
              </button>
            ))}
          </div>

          {/* Active Technology Deep Dive Card */}
          <div className="mt-8 rounded-xl border border-border bg-card p-6 lg:p-8 shadow-xs">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-2xl font-bold uppercase text-foreground">
                      {activeTech.name}
                    </h3>
                    <Badge variant="outline" className="border-primary/40 text-primary uppercase text-[10px]">
                      {activeTech.typicalBacklash}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {activeTech.shortDesc}
                  </p>
                </div>

                {/* Operating & Kinematic Principle */}
                <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                    Kinematic Operating Principle
                  </span>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {activeTech.kinematicPrinciple}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-primary font-medium">
                    Gear Engagement: {activeTech.gearEngagement}
                  </p>
                </div>

                {/* Advantages & Tradeoffs */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Engineering Advantages
                    </span>
                    <ul className="mt-2 space-y-1.5">
                      {activeTech.strengths.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-xs text-foreground/80">
                          <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-500" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Engineering Tradeoffs &amp; Limits
                    </span>
                    <ul className="mt-2 space-y-1.5">
                      {activeTech.tradeoffs.map((t) => (
                        <li key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <AlertCircle size={13} className="mt-0.5 shrink-0 text-amber-500" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Side Specs & Application Column */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-lg border border-border/80 bg-muted/20 p-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">
                    Technical Profile Benchmarks
                  </span>

                  <dl className="mt-4 space-y-3 text-xs border-b border-border/60 pb-4">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Typical Backlash:</dt>
                      <dd className="font-mono font-bold text-foreground">{activeTech.typicalBacklash}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Single-Stage Ratios:</dt>
                      <dd className="font-mono font-bold text-foreground">{activeTech.typicalRatioRange}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Full-Load Efficiency:</dt>
                      <dd className="font-mono font-bold text-foreground">{activeTech.peakEfficiency}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Shock Load Margin:</dt>
                      <dd className="font-mono font-bold text-foreground">{activeTech.shockLoadCapacity}</dd>
                    </div>
                  </dl>

                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Primary Robot Axes &amp; Kinematics
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {activeTech.primaryRobotAxes.map((axis) => (
                        <span key={axis} className="rounded border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground">
                          {axis}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <button
                    onClick={() => {
                      setSelectedTech(activeTech.id);
                      const el = document.getElementById("ranges-explorer");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded bg-foreground py-2.5 text-xs font-bold uppercase text-background hover:bg-foreground/90 transition-colors"
                  >
                    View All {activeTech.name.split("/")[0].trim()} Ranges <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION C: SEARCHABLE PRODUCT RANGE EXPLORER               */}
      {/* ========================================================= */}
      <section id="ranges-explorer" className="px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.22em] text-primary">
                Engineering Catalogue
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                Precision Reducer Product Ranges
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Showing {filteredRanges.length} of {PRECISION_REDUCER_RANGES.length} research-backed reducer families.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-1">Display:</span>
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className={`rounded p-2 transition-colors ${
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={`rounded p-2 transition-colors ${
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 items-center">
              {/* Search Input */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search series, ratio, app..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded border border-border bg-card pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Technology Filter */}
              <div>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="w-full rounded border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="all">All Technologies</option>
                  <option value="harmonic-strain-wave">Harmonic / Strain-Wave</option>
                  <option value="rv-cycloidal">RV Cycloidal</option>
                  <option value="precision-planetary">Precision Planetary</option>
                  <option value="pure-cycloidal">Pure Cycloidal</option>
                  <option value="hypoid-right-angle">Hypoid Right-Angle</option>
                </select>
              </div>

              {/* Shaft Configuration */}
              <div>
                <select
                  value={selectedShaft}
                  onChange={(e) => setSelectedShaft(e.target.value)}
                  className="w-full rounded border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="all">All Shaft Types</option>
                  <option value="Hollow Bore">Hollow Bore (Through-Hole)</option>
                  <option value="Solid Flange">Solid Flange (ISO 9409-1)</option>
                  <option value="Keyed Solid Shaft">Keyed Solid Shaft</option>
                  <option value="Component Set">Component Set (Frameless)</option>
                </select>
              </div>

              {/* Backlash Filter */}
              <div>
                <select
                  value={selectedBacklash}
                  onChange={(e) => setSelectedBacklash(e.target.value)}
                  className="w-full rounded border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="all">All Backlash Classes</option>
                  <option value="sub-1">Ultra-Precision (&lt; 1 arcmin)</option>
                  <option value="1-to-3">Standard Precision (1 - 3 arcmin)</option>
                </select>
              </div>

              {/* Reset Control */}
              <div className="flex items-center justify-end">
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  <RotateCcw size={12} />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Range Cards Display */}
          {filteredRanges.length === 0 ? (
            <div className="mt-12 rounded-xl border border-dashed border-border p-12 text-center">
              <AlertCircle size={32} className="mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="font-display text-lg font-bold uppercase text-foreground">
                No Matching Reducer Ranges Found
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                No catalogue entry matches your current search or filter combination. Reset filters or contact our application engineering team.
              </p>
              <Button
                variant="outline"
                className="mt-4 text-xs font-bold uppercase"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            /* GRID VIEW */
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRanges.map((range) => {
                const isCompared = compareIds.includes(range.id);
                return (
                  <div
                    key={range.id}
                    className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary hover:shadow-md"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between border-b border-border/40 pb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {range.technologyName.split("/")[0]}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground">
                            {range.specifications.shaftConfiguration}
                          </span>
                          <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                            {range.verificationStatus}
                          </span>
                        </div>
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {range.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-primary line-clamp-1">
                        {range.tagline}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {range.engineeringPurpose}
                      </p>

                      {/* Technical Specs Key Table */}
                      <div className="mt-4 rounded border border-border/60 bg-muted/30 p-3 text-xs">
                        <div className="grid grid-cols-2 gap-2 font-mono">
                          <div>
                            <span className="block text-[9px] uppercase font-sans text-muted-foreground">Rated Torque:</span>
                            <span className="font-bold text-foreground">{range.specifications.ratedTorqueNm}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase font-sans text-muted-foreground">Backlash:</span>
                            <span className="font-bold text-primary">{range.specifications.backlashArcmin}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase font-sans text-muted-foreground">Ratios:</span>
                            <span className="text-foreground">{range.specifications.gearRatios}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase font-sans text-muted-foreground">Torsional Stiffness:</span>
                            <span className="text-foreground">{range.specifications.torsionalStiffnessNmPerArcmin}</span>
                          </div>
                        </div>
                      </div>

                      {/* Standards & CAD Availability */}
                      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Standard: {range.sourceRecord.standard}</span>
                        {range.cadStepAvailable && (
                          <span className="inline-flex items-center gap-1 font-mono text-primary font-medium">
                            <Check size={11} /> 3D STEP
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-5 pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setInspectedRange(range)}
                          className="rounded border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          Specs Dossier
                        </button>
                        <button
                          onClick={() => toggleCompare(range.id)}
                          className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            isCompared
                              ? "bg-primary/10 border border-primary text-primary"
                              : "border border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {isCompared ? "In Compare ✓" : "+ Compare"}
                        </button>
                      </div>

                      <Button
                        size="sm"
                        className="rounded bg-signal text-signal-foreground hover:bg-signal/90 text-xs font-bold uppercase"
                        onClick={() => openModal("quote", { productName: range.name, categoryName: "Precision Reducers" })}
                      >
                        Quote
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-4">Series Name</th>
                    <th className="p-4">Technology</th>
                    <th className="p-4">Shaft Type</th>
                    <th className="p-4">Rated Torque</th>
                    <th className="p-4">Backlash</th>
                    <th className="p-4">Ratios</th>
                    <th className="p-4">Torsional Stiffness</th>
                    <th className="p-4">Life L10h</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRanges.map((range) => {
                    const isCompared = compareIds.includes(range.id);
                    return (
                      <tr key={range.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-bold text-foreground">
                          <button
                            onClick={() => setInspectedRange(range)}
                            className="text-left hover:text-primary underline-offset-2 hover:underline"
                          >
                            {range.name}
                          </button>
                          <span className="block text-[10px] font-normal text-muted-foreground">{range.tagline}</span>
                        </td>
                        <td className="p-4 text-muted-foreground">{range.technologyName.split("/")[0]}</td>
                        <td className="p-4 font-mono text-[11px]">{range.specifications.shaftConfiguration}</td>
                        <td className="p-4 font-mono font-bold text-foreground">{range.specifications.ratedTorqueNm}</td>
                        <td className="p-4 font-mono font-bold text-primary">{range.specifications.backlashArcmin}</td>
                        <td className="p-4 font-mono text-muted-foreground">{range.specifications.gearRatios}</td>
                        <td className="p-4 font-mono text-muted-foreground">{range.specifications.torsionalStiffnessNmPerArcmin}</td>
                        <td className="p-4 font-mono text-muted-foreground">{range.specifications.l10hLifeHours}</td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => toggleCompare(range.id)}
                              className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                                isCompared ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
                              }`}
                            >
                              {isCompared ? "Compared" : "+ Compare"}
                            </button>
                            <Button
                              size="sm"
                              className="h-7 px-2.5 rounded bg-signal text-signal-foreground text-[11px] font-bold uppercase"
                              onClick={() => openModal("quote", { productName: range.name })}
                            >
                              Quote
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION D: ENGINEERING COMPARISON TABLE                    */}
      {/* ========================================================= */}
      <section className="border-t border-b border-border/80 bg-muted/20 px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.22em] text-primary">
                Multi-Parameter Evaluation
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                Engineering Specification Comparison
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Compare verified mechanical attributes across selected series. Notice that backlash and rated torque must be evaluated under equivalent temperature and test duration conventions.
              </p>
            </div>

            {/* Comparison Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Load Presets:</span>
              <button
                onClick={() => loadPreset("wrist")}
                className="rounded border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                Wrist J4-J6
              </button>
              <button
                onClick={() => loadPreset("base")}
                className="rounded border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                Base Axes J1-J3
              </button>
              <button
                onClick={() => loadPreset("mobile")}
                className="rounded border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                AMR Wheel Drives
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4 w-1/5 min-w-[200px]">Parameter (Standard)</th>
                  {compareIds.map((id) => {
                    const item = PRECISION_REDUCER_RANGES.find((r) => r.id === id);
                    if (!item) return null;
                    return (
                      <th key={id} className="p-4 min-w-[220px]">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-bold text-foreground uppercase">{item.name}</span>
                          <button
                            onClick={() => toggleCompare(id)}
                            className="text-muted-foreground hover:text-destructive text-[11px]"
                            title="Remove from comparison"
                          >
                            ✕
                          </button>
                        </div>
                        <span className="block text-[10px] font-normal text-primary mt-0.5">{item.technologyName.split("/")[0]}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {/* Shaft Configuration */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 font-semibold text-muted-foreground">Shaft Configuration</td>
                  {compareIds.map((id) => {
                    const item = PRECISION_REDUCER_RANGES.find((r) => r.id === id);
                    return <td key={id} className="p-4 font-mono font-medium text-foreground">{item?.specifications.shaftConfiguration}</td>;
                  })}
                </tr>

                {/* Backlash / Lost Motion */}
                <tr className="bg-primary/5 hover:bg-primary/10">
                  <td className="p-4 font-bold text-foreground">
                    Backlash / Lost Motion
                    <span className="block text-[9px] font-normal text-muted-foreground">Under ±3% rated torque</span>
                  </td>
                  {compareIds.map((id) => {
                    const item = PRECISION_REDUCER_RANGES.find((r) => r.id === id);
                    return <td key={id} className="p-4 font-mono font-bold text-primary">{item?.specifications.backlashArcmin}</td>;
                  })}
                </tr>

                {/* Rated Output Torque */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 font-semibold text-muted-foreground">
                    Rated Output Torque
                    <span className="block text-[9px] font-normal text-muted-foreground">ISO 9283 / DIN 3990</span>
                  </td>
                  {compareIds.map((id) => {
                    const item = PRECISION_REDUCER_RANGES.find((r) => r.id === id);
                    return <td key={id} className="p-4 font-mono font-bold text-foreground">{item?.specifications.ratedTorqueNm}</td>;
                  })}
                </tr>

                {/* Acceleration Torque */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 font-semibold text-muted-foreground">Repeated Peak Accel Torque</td>
                  {compareIds.map((id) => {
                    const item = PRECISION_REDUCER_RANGES.find((r) => r.id === id);
                    return <td key={id} className="p-4 font-mono text-foreground">{item?.specifications.accelerationTorqueNm}</td>;
                  })}
                </tr>

                {/* Emergency Stop Torque */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 font-semibold text-muted-foreground">Emergency Stop Torque Margin</td>
                  {compareIds.map((id) => {
                    const item = PRECISION_REDUCER_RANGES.find((r) => r.id === id);
                    return <td key={id} className="p-4 font-mono font-semibold text-amber-600 dark:text-amber-400">{item?.specifications.emergencyStopTorqueNm}</td>;
                  })}
                </tr>

                {/* Torsional Stiffness */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 font-semibold text-muted-foreground">
                    Torsional Stiffness
                    <span className="block text-[9px] font-normal text-muted-foreground">Critical for servo loop bandwidth</span>
                  </td>
                  {compareIds.map((id) => {
                    const item = PRECISION_REDUCER_RANGES.find((r) => r.id === id);
                    return <td key={id} className="p-4 font-mono text-foreground">{item?.specifications.torsionalStiffnessNmPerArcmin}</td>;
                  })}
                </tr>

                {/* Available Ratios */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 font-semibold text-muted-foreground">Available Reduction Ratios</td>
                  {compareIds.map((id) => {
                    const item = PRECISION_REDUCER_RANGES.find((r) => r.id === id);
                    return <td key={id} className="p-4 font-mono text-muted-foreground">{item?.specifications.gearRatios}</td>;
                  })}
                </tr>

                {/* Efficiency */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 font-semibold text-muted-foreground">Full-Load Efficiency</td>
                  {compareIds.map((id) => {
                    const item = PRECISION_REDUCER_RANGES.find((r) => r.id === id);
                    return <td key={id} className="p-4 font-mono text-foreground">{item?.specifications.efficiencyPercent}</td>;
                  })}
                </tr>

                {/* L10h Service Life */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 font-semibold text-muted-foreground">L10h Bearing / Tooth Life</td>
                  {compareIds.map((id) => {
                    const item = PRECISION_REDUCER_RANGES.find((r) => r.id === id);
                    return <td key={id} className="p-4 font-mono text-foreground">{item?.specifications.l10hLifeHours}</td>;
                  })}
                </tr>

                {/* Standards Reference */}
                <tr className="hover:bg-muted/20">
                  <td className="p-4 font-semibold text-muted-foreground">Verification Standard</td>
                  {compareIds.map((id) => {
                    const item = PRECISION_REDUCER_RANGES.find((r) => r.id === id);
                    return <td key={id} className="p-4 font-mono text-[11px] text-muted-foreground">{item?.sourceRecord.standard}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Contextual Metric Explanation Accordion Toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowComparisonGuide(!showComparisonGuide)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
            >
              <Info size={14} />
              {showComparisonGuide ? "Hide Engineering Methodology Guide" : "Why Specifications Cannot Be Compared Naively (Methodology Guide)"}
            </button>

            {showComparisonGuide && (
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-4 text-xs leading-relaxed text-muted-foreground">
                <h4 className="font-display text-sm font-bold uppercase text-foreground">
                  Engineering Notes on Reducer Ratings &amp; Incompatible Metrics
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {COMPARISON_METRICS_EXPLANATION.slice(0, 4).map((metric) => (
                    <div key={metric.parameter} className="rounded-lg border border-border bg-card p-4">
                      <span className="font-bold text-foreground text-xs">{metric.parameter}</span>
                      <p className="mt-1 text-[11px] text-muted-foreground">{metric.definition}</p>
                      <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                        Caveat: {metric.whyNotDirectlyComparable}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION E: INTERACTIVE SELECTION ASSISTANT                 */}
      {/* ========================================================= */}
      <section className="px-5 py-20 lg:px-10 lg:py-24 bg-background">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Assistant Wizard Form */}
            <div className="lg:col-span-6 rounded-xl border border-border bg-card p-6 lg:p-8 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-[.22em] text-primary">
                Sizing &amp; Selection Wizard
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
                Reducer Selection Assistant
              </h2>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Answer 5 mechanical design criteria to receive indicative reducer technology recommendations matched to your kinematics.
              </p>

              <div className="mt-6 space-y-5">
                {/* Question 1: Application */}
                <div>
                  <label className="block text-xs font-bold uppercase text-foreground mb-1.5">
                    1. Kinematic Axis / Application
                  </label>
                  <select
                    value={assistantAnswers.application}
                    onChange={(e) => setAssistantAnswers({ ...assistantAnswers, application: e.target.value })}
                    className="w-full rounded border border-border bg-muted/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="wrist">Robot Wrist (Axes 4, 5, 6 - Roll/Pitch)</option>
                    <option value="base">Robot Base / Shoulder / Elbow (Axes 1, 2, 3)</option>
                    <option value="mobile">Autonomous Mobile Robot (AMR) Wheel Hub</option>
                    <option value="table">Rotary Indexing Table / CNC 4th-5th Axis</option>
                  </select>
                </div>

                {/* Question 2: Torque Requirement */}
                <div>
                  <label className="block text-xs font-bold uppercase text-foreground mb-1.5">
                    2. Nominal Output Torque Range
                  </label>
                  <select
                    value={assistantAnswers.torque}
                    onChange={(e) => setAssistantAnswers({ ...assistantAnswers, torque: e.target.value })}
                    className="w-full rounded border border-border bg-muted/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="low">Low Torque (&lt; 100 Nm) - Precision inspection / cobots</option>
                    <option value="medium">Medium Torque (100 - 800 Nm) - Standard 20-50 kg robots</option>
                    <option value="high">High Torque (800 - 3,000 Nm) - Heavy 100-300 kg handling</option>
                    <option value="heavy">Extreme Torque (&gt; 3,000 Nm) - Palletizers &amp; presses</option>
                  </select>
                </div>

                {/* Question 3: Precision / Backlash */}
                <div>
                  <label className="block text-xs font-bold uppercase text-foreground mb-1.5">
                    3. Required Backlash Class
                  </label>
                  <select
                    value={assistantAnswers.backlash}
                    onChange={(e) => setAssistantAnswers({ ...assistantAnswers, backlash: e.target.value })}
                    className="w-full rounded border border-border bg-muted/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="ultra">Ultra-Precision (&lt; 0.5 arcmin / Zero Backlash)</option>
                    <option value="precision">Precision (1 - 3 arcmin)</option>
                    <option value="standard">Standard Motion (3 - 5 arcmin)</option>
                  </select>
                </div>

                {/* Question 4: Hollow Bore */}
                <div>
                  <label className="block text-xs font-bold uppercase text-foreground mb-1.5">
                    4. Internal Cabling / Hollow Bore Required?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="hollowBore"
                        value="yes"
                        checked={assistantAnswers.hollowBore === "yes"}
                        onChange={() => setAssistantAnswers({ ...assistantAnswers, hollowBore: "yes" })}
                        className="text-primary"
                      />
                      Yes, through-hole center bore needed
                    </label>
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="hollowBore"
                        value="no"
                        checked={assistantAnswers.hollowBore === "no"}
                        onChange={() => setAssistantAnswers({ ...assistantAnswers, hollowBore: "no" })}
                        className="text-primary"
                      />
                      No, solid output flange or shaft is fine
                    </label>
                  </div>
                </div>

                {/* Question 5: Shock Overload */}
                <div>
                  <label className="block text-xs font-bold uppercase text-foreground mb-1.5">
                    5. Dynamic Shock &amp; Overload Margin
                  </label>
                  <select
                    value={assistantAnswers.shock}
                    onChange={(e) => setAssistantAnswers({ ...assistantAnswers, shock: e.target.value })}
                    className="w-full rounded border border-border bg-muted/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="low">Low Shock (Continuous smooth velocity, no hard stops)</option>
                    <option value="medium">Moderate (Frequent rapid start/stop cycles)</option>
                    <option value="high">Extreme Impact Shock (&gt; 400% momentary overload)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Recommendation Output Column */}
            <div className="lg:col-span-6 rounded-xl border border-primary/30 bg-card p-6 lg:p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-primary to-signal" />

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles size={14} />
                Indicative Recommended Matches ({recommendation.length})
              </div>

              <h3 className="mt-2 font-display text-2xl font-bold uppercase text-foreground">
                Optimized Reducer Configuration
              </h3>

              <div className="mt-6 space-y-4">
                {recommendation.map((rec, idx) => (
                  <div key={rec.id} className="rounded-lg border border-border bg-muted/30 p-4 transition-all hover:border-primary">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base font-bold text-foreground uppercase">
                        {idx + 1}. {rec.name}
                      </span>
                      <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                        {rec.specifications.backlashArcmin}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{rec.tagline}</p>
                    <div className="mt-3 flex flex-wrap gap-3 font-mono text-[11px] text-foreground">
                      <span>Rated: <strong>{rec.specifications.ratedTorqueNm}</strong></span>
                      <span>Stiffness: <strong>{rec.specifications.torsionalStiffnessNmPerArcmin}</strong></span>
                      <span>Type: <strong>{rec.specifications.shaftConfiguration}</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Engineering Sizing Equations Citation */}
              <div className="mt-6 rounded border border-border/80 bg-muted/20 p-3 font-mono text-[11px] text-muted-foreground">
                <span className="block font-sans font-bold uppercase text-[9px] tracking-wider text-foreground">
                  Applied Sizing Criteria:
                </span>
                T_acc = J_total · α &nbsp;|&nbsp; T_rms = √(Σ(T_i² · t_i) / t_total) ≤ T_rated
              </div>

              {/* Important Disclaimer */}
              <div className="mt-4 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] text-amber-800 dark:text-amber-300">
                <strong>Engineering Disclaimer:</strong> This wizard provides preliminary kinematic guidance. Final gearbox sizing requires validating acceleration torques, duty-cycle heat dissipation, and radial bearing life with our engineering team.
              </div>

              {/* CTA to Transfer Specs */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="rounded bg-signal text-signal-foreground hover:bg-signal/90 text-xs font-bold uppercase"
                  onClick={() =>
                    openModal("engineer", {
                      categoryName: `Precision Reducer Sizing: ${recommendation[0]?.name || "Custom"} (${assistantAnswers.application}, ${assistantAnswers.torque} torque)`,
                    })
                  }
                >
                  Transfer Parameters to Engineering
                </Button>
                <Button
                  variant="outline"
                  className="rounded border-border text-xs font-bold uppercase"
                  onClick={() => openModal("quote", { productName: recommendation[0]?.name || "Precision Reducer" })}
                >
                  Request Fast Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION F: APPLICATION MAPPING                            */}
      {/* ========================================================= */}
      <section className="border-t border-b border-border/80 bg-muted/40 px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[.22em] text-primary">
              System Integration
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
              Kinematic Axis &amp; Joint Mapping
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Every robotic joint experiences different dynamic inertia and moment loading. Explore where each transmission technology delivers optimal performance in 6-axis articulated arms, SCARAs, mobile robots, and machine tools.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {APPLICATION_TO_REDUCER_MAPPING.map((map) => (
              <div
                key={map.jointOrAxis}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <span className="font-mono text-xs font-bold uppercase text-primary">
                      {map.jointOrAxis}
                    </span>
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">
                      {map.typicalLoadEnvironment.split(",")[0]}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold uppercase text-foreground">
                    {map.recommendedTechnology}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {map.mechanicalRationale}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/50">
                  <span className="block text-[10px] font-bold uppercase text-muted-foreground">
                    Recommended INDUS Series:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {map.recommendedSeries.map((series) => (
                      <span key={series} className="rounded border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-[10px] text-primary font-semibold">
                        {series}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION G: ENGINEERING RESOURCES & FAQS                    */}
      {/* ========================================================= */}
      <section className="px-5 py-20 lg:px-10 lg:py-24 bg-background">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Resources Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[.22em] text-primary">
                  Engineering Library
                </span>
                <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                  Technical Resources &amp; Downloads
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Verified engineering documentation, CAD STEP neutral geometry, and bolt torquing standards.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start justify-between rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors">
                  <div>
                    <span className="block font-bold text-foreground text-xs uppercase">
                      Precision Reducers Technical Master Catalogue (Rev 4.2)
                    </span>
                    <span className="text-[11px] text-muted-foreground">Comprehensive torque ratings, life curves, and CAD envelopes</span>
                  </div>
                  <button
                    onClick={() => openModal("engineer", { categoryName: "PDF Catalogue Download" })}
                    className="rounded p-2 text-primary hover:bg-primary/10 transition-colors"
                    title="Download Catalogue"
                  >
                    <Download size={16} />
                  </button>
                </div>

                <div className="flex items-start justify-between rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors">
                  <div>
                    <span className="block font-bold text-foreground text-xs uppercase">
                      3D STEP CAD Model Library Request
                    </span>
                    <span className="text-[11px] text-muted-foreground">SolidWorks, Inventor, and STEP AP214/AP242 files</span>
                  </div>
                  <button
                    onClick={() => openModal("quote", { productName: "3D CAD STEP Archive" })}
                    className="rounded p-2 text-primary hover:bg-primary/10 transition-colors"
                    title="Request CAD Files"
                  >
                    <FileText size={16} />
                  </button>
                </div>

                <div className="flex items-start justify-between rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors">
                  <div>
                    <span className="block font-bold text-foreground text-xs uppercase">
                      Bolt Pre-Torquing &amp; Mounting Guidelines (DIN 912)
                    </span>
                    <span className="text-[11px] text-muted-foreground">Class 12.9 bolt torque values, cross-pattern tightening, and Loctite specs</span>
                  </div>
                  <button
                    onClick={() => openModal("engineer", { categoryName: "Mounting Guidelines" })}
                    className="rounded p-2 text-primary hover:bg-primary/10 transition-colors"
                    title="View Guidelines"
                  >
                    <Wrench size={16} />
                  </button>
                </div>

                <div className="flex items-start justify-between rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors">
                  <div>
                    <span className="block font-bold text-foreground text-xs uppercase">
                      Motor Flange Adaptation Standard Matrix
                    </span>
                    <span className="text-[11px] text-muted-foreground">Matches Mitsubishi, Yaskawa, Siemens, Beckhoff, and Delta motor shafts</span>
                  </div>
                  <button
                    onClick={() => openModal("engineer", { categoryName: "Motor Flange Matrix" })}
                    className="rounded p-2 text-primary hover:bg-primary/10 transition-colors"
                    title="View Compatibility"
                  >
                    <Cpu size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* FAQs Column */}
            <div className="lg:col-span-7">
              <span className="text-[10px] font-bold uppercase tracking-[.22em] text-primary">
                Technical FAQ
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
                Frequently Asked Engineering Questions
              </h2>

              <div className="mt-6 space-y-4">
                {REDUCER_FAQS.slice(0, 6).map((faq, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-display text-sm font-bold uppercase text-foreground">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION H: RELATED PRODUCTS                                */}
      {/* ========================================================= */}
      <section className="border-t border-border/80 bg-muted/20 px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <span className="text-[10px] font-bold uppercase tracking-[.22em] text-primary">
            Mechatronic Ecosystem
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
            Related Motion &amp; Control Components
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Integrate precision reducers with compatible direct-drive motors, feedback encoders, fail-safe brakes, and real-time motion controllers.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/products/$category"
              params={{ category: "motion-actuation" }}
              className="group rounded-xl border border-border bg-card p-6 shadow-xs hover:border-primary transition-all"
            >
              <Cpu size={24} className="text-primary group-hover:scale-110 transition-transform" />
              <h3 className="mt-4 font-display text-base font-bold uppercase text-foreground group-hover:text-primary">
                Servo &amp; Precision Motors
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Frameless torque motors and flanged AC brushless servos optimized for tight gearbox piloting.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Explore Motors <ArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/products/$category"
              params={{ category: "motion-actuation" }}
              className="group rounded-xl border border-border bg-card p-6 shadow-xs hover:border-primary transition-all"
            >
              <Layers size={24} className="text-primary group-hover:scale-110 transition-transform" />
              <h3 className="mt-4 font-display text-base font-bold uppercase text-foreground group-hover:text-primary">
                Integrated Joint Actuators
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                All-in-one robot joints combining harmonic reducers, frameless motors, dual encoders, and servo drives.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Explore Actuators <ArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/products/$category"
              params={{ category: "sensing-vision" }}
              className="group rounded-xl border border-border bg-card p-6 shadow-xs hover:border-primary transition-all"
            >
              <Zap size={24} className="text-primary group-hover:scale-110 transition-transform" />
              <h3 className="mt-4 font-display text-base font-bold uppercase text-foreground group-hover:text-primary">
                Absolute Hollow Encoders
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Optical and magnetic hollow-shaft encoders up to 23-bit resolution for direct gearbox output monitoring.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Explore Sensors <ArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/products/$category"
              params={{ category: "control-drives" }}
              className="group rounded-xl border border-border bg-card p-6 shadow-xs hover:border-primary transition-all"
            >
              <Shield size={24} className="text-primary group-hover:scale-110 transition-transform" />
              <h3 className="mt-4 font-display text-base font-bold uppercase text-foreground group-hover:text-primary">
                Coordinated Motion Controllers
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                EtherCAT and Profinet IRT controllers providing 1 ms trajectory interpolation and backlash compensation.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Explore Controllers <ArrowRight size={13} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION I: STRONG ENQUIRY JOURNEY                         */}
      {/* ========================================================= */}
      <section className="bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="rounded-2xl border border-signal/30 bg-surface-elevated/60 p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-8">
                <span className="text-[11px] font-bold uppercase tracking-[.22em] text-signal">
                  Application Engineering Support
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight sm:text-5xl">
                  Require Custom Ratios, Flange Machining, or CAD Models?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-surface-foreground/80 max-w-2xl">
                  Our mechatronic engineers validate torsional load profiles, calculate thermal dissipation under continuous duty, and provide customized motor adapter plates for non-standard servomotors.
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-surface-foreground/70">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-signal" /> 24-Hour Sizing Calculation</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-signal" /> Custom Flange Prototyping</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-signal" /> Non-Disclosure Agreement Protected</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <Button
                  className="h-12 rounded bg-signal px-7 text-xs font-bold uppercase text-signal-foreground hover:bg-signal/90"
                  onClick={() => openModal("quote", { categoryName: "Precision Reducers Project Quote" })}
                >
                  Request Formal Quotation <ArrowRight size={15} className="ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded border-surface-foreground/30 bg-transparent px-6 text-xs font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
                  onClick={() => openModal("engineer", { categoryName: "Precision Reducers Technical Review" })}
                >
                  <Wrench size={15} className="mr-2 text-signal" />
                  Talk with Application Engineer
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded border-surface-foreground/30 bg-transparent px-5 text-xs font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
                  onClick={() => handleWhatsApp("Enquiry Banner")}
                >
                  <MessageSquare size={14} className="mr-2 text-signal" />
                  Chat via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* TECHNICAL DOSSIER DETAIL MODAL                            */}
      {/* ========================================================= */}
      {inspectedRange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {inspectedRange.technologyName}
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-foreground">
                  {inspectedRange.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectedRange(null)}
                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <p className="text-sm font-medium text-foreground">{inspectedRange.tagline}</p>
              <p className="text-muted-foreground leading-relaxed">{inspectedRange.engineeringPurpose}</p>

              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <span className="block font-bold uppercase text-[10px] text-foreground mb-2">
                  Operating Principle &amp; Mechanism
                </span>
                <p className="text-muted-foreground leading-relaxed">{inspectedRange.operatingPrinciple}</p>
              </div>

              {/* Detailed Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border border-border rounded-lg p-4 font-mono text-[11px]">
                <div>
                  <span className="block font-sans text-[9px] uppercase text-muted-foreground">Rated Torque:</span>
                  <strong className="text-foreground">{inspectedRange.specifications.ratedTorqueNm}</strong>
                </div>
                <div>
                  <span className="block font-sans text-[9px] uppercase text-muted-foreground">Acceleration Torque:</span>
                  <strong className="text-foreground">{inspectedRange.specifications.accelerationTorqueNm}</strong>
                </div>
                <div>
                  <span className="block font-sans text-[9px] uppercase text-muted-foreground">Emergency Stop Torque:</span>
                  <strong className="text-amber-600">{inspectedRange.specifications.emergencyStopTorqueNm}</strong>
                </div>
                <div>
                  <span className="block font-sans text-[9px] uppercase text-muted-foreground">Backlash / Lost Motion:</span>
                  <strong className="text-primary">{inspectedRange.specifications.backlashArcmin}</strong>
                </div>
                <div>
                  <span className="block font-sans text-[9px] uppercase text-muted-foreground">Torsional Stiffness:</span>
                  <strong className="text-foreground">{inspectedRange.specifications.torsionalStiffnessNmPerArcmin}</strong>
                </div>
                <div>
                  <span className="block font-sans text-[9px] uppercase text-muted-foreground">Rated Speed:</span>
                  <strong className="text-foreground">{inspectedRange.specifications.ratedInputSpeedRpm}</strong>
                </div>
                <div>
                  <span className="block font-sans text-[9px] uppercase text-muted-foreground">Full-Load Efficiency:</span>
                  <strong className="text-foreground">{inspectedRange.specifications.efficiencyPercent}</strong>
                </div>
                <div>
                  <span className="block font-sans text-[9px] uppercase text-muted-foreground">L10h Bearing Life:</span>
                  <strong className="text-foreground">{inspectedRange.specifications.l10hLifeHours}</strong>
                </div>
                <div>
                  <span className="block font-sans text-[9px] uppercase text-muted-foreground">Shaft Configuration:</span>
                  <strong className="text-foreground">{inspectedRange.specifications.shaftConfiguration}</strong>
                </div>
              </div>

              {/* Compatibility & Standards */}
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded border border-border p-3">
                  <span className="block font-bold uppercase text-[10px] text-muted-foreground mb-1">
                    Motor Flange Compatibility
                  </span>
                  <p className="text-foreground">{inspectedRange.compatibility.motorFlanges.join(", ")}</p>
                </div>
                <div className="rounded border border-border p-3">
                  <span className="block font-bold uppercase text-[10px] text-muted-foreground mb-1">
                    Traceability &amp; Standard
                  </span>
                  <p className="text-foreground">{inspectedRange.sourceRecord.standard} - {inspectedRange.sourceRecord.reference}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap justify-end gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => openModal("engineer", { categoryName: `${inspectedRange.name} CAD / Sizing Review` })}
                >
                  Request 3D CAD STEP
                </Button>
                <Button
                  className="bg-signal text-signal-foreground hover:bg-signal/90 font-bold uppercase"
                  onClick={() => {
                    const name = inspectedRange.name;
                    setInspectedRange(null);
                    openModal("quote", { productName: name, categoryName: "Precision Reducers" });
                  }}
                >
                  Request Quote for this Series
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
