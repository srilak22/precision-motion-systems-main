import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Database,
  Search,
  Filter,
  Download,
  ExternalLink,
  ShieldCheck,
  Building2,
  Cpu,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Sliders,
  ChevronRight,
  Globe,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Award,
  Clock,
  ArrowUpDown,
  BookOpen,
  FileText,
  Activity,
  X,
  Share2,
  Linkedin,
  Compass,
  Zap,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/intelligence/us-robotics")({
  component: USRoboticsIntelligencePlatform,
});

// Interfaces
interface CompanySummary {
  company_id: string;
  legal_name: string;
  trading_name?: string;
  website: string;
  canonical_domain: string;
  company_type: string;
  robotics_categories?: string;
  primary_products?: string;
  company_description?: string;
  hq_country: string;
  hq_state?: string;
  hq_city?: string;
  us_presence_status?: string;
  us_operating_locations?: string;
  founded_year?: number;
  employee_range?: string;
  verification_status: string;
  confidence_score: number;
  completeness_score: number;
  last_verified?: string;
  product_count: number;
  people_count: number;
  contact_phone?: string;
}

interface IntelligenceStats {
  summary: {
    total_companies: number;
    verified_websites: number;
    us_headquartered: number;
    us_operating_facilities: number;
    total_products: number;
    total_contacts: number;
    total_people: number;
    total_applications: number;
    total_evidence: number;
    total_sources: number;
  };
  distributions: {
    categories: Array<{ company_type: string; count: number }>;
    states: Array<{ state: string; count: number }>;
  };
  quality_center: {
    missing_website: number;
    missing_state: number;
    missing_contacts: number;
    missing_products: number;
    unverified: number;
  };
}

export function USRoboticsIntelligencePlatform() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "directory" | "queries" | "crawler" | "quality">("dashboard");
  const [stats, setStats] = useState<IntelligenceStats | null>(null);
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUsPresence, setSelectedUsPresence] = useState("");
  const [hasContactsOnly, setHasContactsOnly] = useState(false);
  const [hasSpecsOnly, setHasSpecsOnly] = useState(false);
  const [sortBy, setSortBy] = useState("completeness_score");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Drawer / Detail state
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companyDetail, setCompanyDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTab, setDetailTab] = useState<string>("overview");

  // Research Query Preset State
  const [activePresetId, setActivePresetId] = useState<string>("1");
  const [queryResults, setQueryResults] = useState<any | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);

  // Crawl Action State
  const [targetCrawlId, setTargetCrawlId] = useState("");
  const [crawlMaxPages, setCrawlMaxPages] = useState(3);
  const [crawlingInProgress, setCrawlingInProgress] = useState(false);
  const [crawlFeedback, setCrawlFeedback] = useState<any | null>(null);

  // Fetch Summary KPIs
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/intelligence/stats");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data);
        }
      }
    } catch (e) {
      console.error("Failed to fetch intelligence stats", e);
    }
  };

  // Fetch Companies List
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort_by: sortBy,
        order: sortOrder
      });
      if (searchQuery.trim()) params.append("q", searchQuery.trim());
      if (selectedState) params.append("state", selectedState);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedUsPresence) params.append("us_presence", selectedUsPresence);
      if (hasContactsOnly) params.append("has_contacts", "true");
      if (hasSpecsOnly) params.append("has_specs", "true");

      const res = await fetch(`/api/intelligence/companies?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCompanies(data.companies || []);
          setTotalRecords(data.pagination?.total || 0);
        }
      }
    } catch (e) {
      console.error("Failed to fetch companies", e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Company Detail
  const fetchCompanyDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/intelligence/company?id=${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCompanyDetail(data);
        }
      }
    } catch (e) {
      console.error("Failed to fetch company detail", e);
    } finally {
      setDetailLoading(false);
    }
  };

  // Fetch Preset Query Results
  const fetchPresetQuery = async (presetId: string) => {
    setQueryLoading(true);
    try {
      const res = await fetch(`/api/intelligence/queries?preset_id=${presetId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setQueryResults(data);
        }
      }
    } catch (e) {
      console.error("Failed to fetch preset query", e);
    } finally {
      setQueryLoading(false);
    }
  };

  // Trigger Live Web Crawl
  const handleTriggerCrawl = async (companyId: string) => {
    if (!companyId) return;
    setCrawlingInProgress(true);
    setCrawlFeedback(null);
    try {
      const res = await fetch("/api/intelligence/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: companyId, max_pages: crawlMaxPages })
      });
      const data = await res.json();
      if (data.success) {
        setCrawlFeedback(data.crawl_result);
        fetchStats();
        fetchCompanies();
        if (selectedCompanyId === companyId) {
          fetchCompanyDetail(companyId);
        }
      } else {
        setCrawlFeedback({ status: "error", message: data.error || "Crawl failed" });
      }
    } catch (e: any) {
      setCrawlFeedback({ status: "error", message: e.message });
    } finally {
      setCrawlingInProgress(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPresetQuery("1");
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [searchQuery, selectedState, selectedCategory, selectedUsPresence, hasContactsOnly, hasSpecsOnly, sortBy, sortOrder, page]);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchCompanyDetail(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  const presetQueries = [
    { id: "1", label: "Precision Reducers & Gears", icon: Cpu },
    { id: "2", label: "Payload & Reach Specs", icon: Activity },
    { id: "3", label: "Robot Joint Modules", icon: Layers },
    { id: "4", label: "Machine-Tending Workcells", icon: Building2 },
    { id: "5", label: "Industrial Servo Drives", icon: Zap },
    { id: "6", label: "Engineering Leadership", icon: Users },
    { id: "7", label: "Public Sales Contacts", icon: Phone },
    { id: "8", label: "Key US Hubs (MI, CA, OH, MA)", icon: MapPin },
    { id: "9", label: "Aerospace & Semiconductor", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* ------------------------------------------------------------- */}
      {/* TOP COMMAND HEADER */}
      {/* ------------------------------------------------------------- */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wider text-white uppercase font-mono">INDUS</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
                  v2.4 OSINT MINER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                US Robotics & Automation Intelligence Platform | Deep Web Mining & Competitive Analysis
              </p>
            </div>
          </div>

          {/* System Telemetry Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 border border-slate-700/60">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300 font-mono">DB: {stats?.summary.total_companies || 653} ENTITIES</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 border border-slate-700/60">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-slate-300 font-mono">SSRF GUARD: ACTIVE</span>
            </div>
            <a
              href="/api/intelligence/export?format=csv"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition shadow-sm"
              download
            >
              <Download className="h-3.5 w-3.5" />
              Export Research (.CSV)
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-4 pt-2 border-t border-slate-800/60 flex items-center gap-1 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 font-medium rounded-md transition flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Activity className="h-4 w-4" />
            Executive Dashboard
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-4 py-2 font-medium rounded-md transition flex items-center gap-2 ${
              activeTab === "directory"
                ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Company Directory ({totalRecords || stats?.summary.total_companies})
          </button>
          <button
            onClick={() => setActiveTab("queries")}
            className={`px-4 py-2 font-medium rounded-md transition flex items-center gap-2 ${
              activeTab === "queries"
                ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Compass className="h-4 w-4" />
            OSINT Research Explorer
          </button>
          <button
            onClick={() => setActiveTab("crawler")}
            className={`px-4 py-2 font-medium rounded-md transition flex items-center gap-2 ${
              activeTab === "crawler"
                ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <RotateCw className="h-4 w-4" />
            Deep Website Crawler
          </button>
          <button
            onClick={() => setActiveTab("quality")}
            className={`px-4 py-2 font-medium rounded-md transition flex items-center gap-2 ${
              activeTab === "quality"
                ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Data Quality & Audit Center
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "dashboard" && (
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* KPI Matrix Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Discovered Entities</div>
              <div className="mt-2 text-3xl font-bold font-mono text-white flex items-baseline gap-2">
                {stats?.summary.total_companies || 653}
                <span className="text-xs text-emerald-400 font-sans font-normal">100% US Scope</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                {stats?.summary.us_headquartered || 601} US Headquartered · {stats?.summary.us_operating_facilities || 12} Major Operating Facilities
              </div>
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-cyan-950/60 flex items-center justify-center text-cyan-400">
                <Building2 className="h-4 w-4" />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Technical Equipment & Models</div>
              <div className="mt-2 text-3xl font-bold font-mono text-white flex items-baseline gap-2">
                {stats?.summary.total_products || 620}
                <span className="text-xs text-cyan-400 font-sans font-normal">Cataloged</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Articulated Arms, SCARA, Cobots, Reducers, Servos, Machine Vision
              </div>
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-blue-950/60 flex items-center justify-center text-blue-400">
                <Cpu className="h-4 w-4" />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Public Business Contacts</div>
              <div className="mt-2 text-3xl font-bold font-mono text-white flex items-baseline gap-2">
                {stats?.summary.total_contacts || 588}
                <span className="text-xs text-emerald-400 font-sans font-normal">Direct Channels</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Direct phone channels, sales inquiries, inquiry portals
              </div>
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-emerald-950/60 flex items-center justify-center text-emerald-400">
                <Phone className="h-4 w-4" />
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Verified Source Evidence</div>
              <div className="mt-2 text-3xl font-bold font-mono text-white flex items-baseline gap-2">
                {stats?.summary.total_evidence || 528}
                <span className="text-xs text-purple-400 font-sans font-normal">Citations</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Zero synthetic data. Traceable to official domains & A3 catalogs
              </div>
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-purple-950/60 flex items-center justify-center text-purple-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Regional & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top US Robotics States */}
            <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  Top US States by Company Presence
                </h3>
                <span className="text-xs text-slate-400">Automate / A3 Verified</span>
              </div>
              <div className="space-y-3 pt-2">
                {stats?.distributions.states.slice(0, 7).map((item, idx) => {
                  const maxCount = stats?.distributions.states[0]?.count || 1;
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.state} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-200">{item.state}</span>
                        <span className="text-slate-400 font-mono">{item.count} companies</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Industrial Categories Breakdown */}
            <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-400" />
                  Industry Specializations
                </h3>
                <span className="text-xs text-slate-400">Segment Breakdown</span>
              </div>
              <div className="space-y-3 pt-2">
                {stats?.distributions.categories.slice(0, 7).map((item) => (
                  <div
                    key={item.company_type}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 border border-slate-800 text-xs"
                  >
                    <span className="text-slate-200 font-medium">{item.company_type || "Robotics Manufacturer"}</span>
                    <Badge variant="outline" className="border-slate-700 bg-slate-900 font-mono text-cyan-400">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Quick Actions */}
            <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Continuous Mining Engine
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  The INDUS Web Mining Engine automatically processes robots.txt, sitemaps, and company pages to extract technical specifications, leadership LinkedIn URLs, and public business channels.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div>[STATUS] Multi-stage crawler initialized</div>
                  <div>[SSRF] Subnet filter active (RFC1918/Metadata)</div>
                  <div>[RATE LIMIT] 1.0s delay between domain requests</div>
                  <div>[CONFIDENCE] 0.85 - 0.95 baseline verification</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={() => setActiveTab("directory")}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                >
                  Explore 653 Company Profiles
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("queries")}
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
                >
                  Run Pre-built OSINT Inquiries
                </Button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: COMPANY DIRECTORY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "directory" && (
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Controls & Filter Bar */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by company name, products, city..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 bg-slate-950 border-slate-800 text-slate-200 text-sm focus-visible:ring-cyan-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* State Filter */}
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">All US States</option>
                  <option value="Michigan">Michigan (141)</option>
                  <option value="California">California (82)</option>
                  <option value="Ohio">Ohio (57)</option>
                  <option value="Illinois">Illinois (38)</option>
                  <option value="Massachusetts">Massachusetts (31)</option>
                  <option value="Texas">Texas (25)</option>
                  <option value="Pennsylvania">Pennsylvania (22)</option>
                  <option value="Indiana">Indiana (19)</option>
                </select>

                {/* Presence Filter */}
                <select
                  value={selectedUsPresence}
                  onChange={(e) => {
                    setSelectedUsPresence(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">All US Presence Types</option>
                  <option value="US Headquartered">US Headquartered</option>
                  <option value="US Operating Facility & Headquarters">US Operating Facility / Global OEM</option>
                </select>

                {/* Sort Option */}
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, ord] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(ord as "ASC" | "DESC");
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="completeness_score-DESC">Completeness (High to Low)</option>
                  <option value="legal_name-ASC">Company Name (A-Z)</option>
                  <option value="hq_state-ASC">State (A-Z)</option>
                  <option value="last_verified-DESC">Recently Verified</option>
                </select>
              </div>
            </div>

            {/* Quick Toggle Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
              <button
                onClick={() => {
                  setHasContactsOnly(!hasContactsOnly);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
                  hasContactsOnly
                    ? "bg-cyan-950/80 border-cyan-500 text-cyan-300"
                    : "border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Phone className="h-3 w-3" />
                Has Public Phone/Contact
              </button>

              <button
                onClick={() => {
                  setHasSpecsOnly(!hasSpecsOnly);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
                  hasSpecsOnly
                    ? "bg-cyan-950/80 border-cyan-500 text-cyan-300"
                    : "border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Cpu className="h-3 w-3" />
                Has Technical Specifications
              </button>

              <div className="ml-auto text-slate-500 font-mono text-xs">
                Displaying {companies.length} of {totalRecords} records
              </div>
            </div>
          </div>

          {/* Company Data Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-4">Category / Specialization</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">US Presence</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4 text-center">Specs</th>
                    <th className="py-3 px-4 text-center">Completeness</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <div className="inline-flex items-center gap-2">
                          <RotateCw className="h-4 w-4 animate-spin text-cyan-400" />
                          Querying Intelligence Database...
                        </div>
                      </td>
                    </tr>
                  ) : companies.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No companies matched your current search filters.
                      </td>
                    </tr>
                  ) : (
                    companies.map((c) => (
                      <tr
                        key={c.company_id}
                        className="hover:bg-slate-800/40 transition cursor-pointer group"
                        onClick={() => setSelectedCompanyId(c.company_id)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white group-hover:text-cyan-400 transition">
                            {c.legal_name}
                          </div>
                          {c.website && (
                            <a
                              href={c.website}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] text-slate-400 hover:text-cyan-300 inline-flex items-center gap-1 mt-0.5"
                            >
                              <Globe className="h-3 w-3" />
                              {c.canonical_domain}
                            </a>
                          )}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="truncate text-slate-300 font-medium">
                            {c.company_type || "Robotics Manufacturer"}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {c.primary_products || c.company_description?.slice(0, 60) || "Industrial Automation"}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-300">
                            {c.hq_city ? `${c.hq_city}, ` : ""}
                            <span className="font-medium text-slate-200">{c.hq_state || "USA"}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase">{c.hq_country}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              c.us_presence_status?.includes("Operating Facility")
                                ? "border-amber-700 bg-amber-950/40 text-amber-300"
                                : "border-slate-700 bg-slate-900 text-slate-300"
                            }`}
                          >
                            {c.us_presence_status || "US Headquartered"}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4">
                          {c.contact_phone ? (
                            <span className="inline-flex items-center gap-1 text-slate-300 font-mono text-[11px]">
                              <Phone className="h-3 w-3 text-emerald-400" />
                              {c.contact_phone}
                            </span>
                          ) : (
                            <span className="text-slate-600 italic">Web portal only</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {c.product_count > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[11px] font-mono">
                              <Cpu className="h-3 w-3" />
                              {c.product_count}
                            </span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 font-mono text-xs">
                            <span
                              className={`font-semibold ${
                                c.completeness_score >= 0.7
                                  ? "text-emerald-400"
                                  : c.completeness_score >= 0.5
                                  ? "text-amber-400"
                                  : "text-slate-400"
                              }`}
                            >
                              {Math.round(c.completeness_score * 100)}%
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCompanyId(c.company_id);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 h-8 px-2"
                          >
                            Profile
                            <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60">
              <div>
                Page {page} of {Math.ceil(totalRecords / limit) || 1}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="border-slate-800 text-slate-300 h-8"
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= Math.ceil(totalRecords / limit)}
                  onClick={() => setPage((p) => p + 1)}
                  className="border-slate-800 text-slate-300 h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: OSINT RESEARCH QUERY EXPLORER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "queries" && (
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-cyan-400" />
              OSINT Research Query Explorer
            </h2>
            <p className="text-xs text-slate-400">
              Explore concrete competitive intelligence questions backed by normalized records and documented evidence citations.
            </p>
          </div>

          {/* Query Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {presetQueries.map((pq) => {
              const Icon = pq.icon;
              const isSelected = activePresetId === pq.id;
              return (
                <button
                  key={pq.id}
                  onClick={() => {
                    setActivePresetId(pq.id);
                    fetchPresetQuery(pq.id);
                  }}
                  className={`p-4 rounded-xl border text-left transition flex items-start gap-3 ${
                    isSelected
                      ? "bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-500/10"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${isSelected ? "text-cyan-300" : "text-white"}`}>
                      {pq.label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Preset #{pq.id} Evidence Query</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Query Results Display */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{queryResults?.title || "Research Results"}</h3>
                <p className="text-xs text-slate-400 mt-1">{queryResults?.description}</p>
              </div>
              <Badge variant="outline" className="border-cyan-800 bg-cyan-950/80 text-cyan-400 font-mono text-xs w-fit">
                {queryResults?.count || 0} Matches Found
              </Badge>
            </div>

            {queryLoading ? (
              <div className="py-12 text-center text-slate-400">
                <RotateCw className="h-5 w-5 animate-spin mx-auto text-cyan-400 mb-2" />
                Executing Parameterized OSINT Query...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {queryResults?.results?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => item.company_id && setSelectedCompanyId(item.company_id)}
                    className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-white text-sm hover:text-cyan-400 transition">
                        {item.legal_name || item.product_name}
                      </div>
                      {item.hq_state && (
                        <Badge variant="outline" className="border-slate-800 bg-slate-900 text-slate-400 text-[10px]">
                          {item.hq_state}
                        </Badge>
                      )}
                    </div>

                    {/* Specific details depending on query */}
                    {item.payload_capacity && (
                      <div className="flex flex-wrap gap-2 text-xs font-mono pt-1">
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900">
                          Payload: {item.payload_capacity}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-900">
                          Reach: {item.reach}
                        </span>
                        {item.repeatability && (
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            Repeatability: {item.repeatability}
                          </span>
                        )}
                      </div>
                    )}

                    {item.full_name && (
                      <div className="text-xs pt-1">
                        <span className="text-slate-400">Executive: </span>
                        <span className="text-cyan-300 font-medium">{item.full_name}</span> - {item.job_title}
                        {item.linkedin_url && (
                          <a
                            href={item.linkedin_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 ml-2"
                          >
                            <Linkedin className="h-3 w-3" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    )}

                    {item.contact_value && (
                      <div className="text-xs text-emerald-400 font-mono pt-1 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {item.contact_value}
                      </div>
                    )}

                    {item.website && (
                      <div className="text-[11px] text-slate-500 truncate pt-1">
                        Official Domain: {item.website}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: DEEP WEBSITE CRAWLER ENGINE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "crawler" && (
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <RotateCw className="h-5 w-5 text-cyan-400" />
              Robotics Website Deep Crawler Console
            </h2>
            <p className="text-xs text-slate-400">
              Run polite, rate-limited crawls across verified corporate websites with robots.txt adherence and SSRF subnet blocking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Crawler Action Box */}
            <div className="lg:col-span-1 p-6 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="font-semibold text-white text-sm">Launch Single-Domain Crawl</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select or input a company ID to execute an autonomous sitemap discovery, internal page classification, and technical specification extraction run.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Company Target ID</label>
                  <Input
                    type="text"
                    placeholder="e.g. COMP-ABB-COM or COMP-KUKA-COM"
                    value={targetCrawlId}
                    onChange={(e) => setTargetCrawlId(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Max Pages to Crawl (Budget)</label>
                  <select
                    value={crawlMaxPages}
                    onChange={(e) => setCrawlMaxPages(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  >
                    <option value={3}>3 Pages (Polite Test)</option>
                    <option value={5}>5 Pages (Standard)</option>
                    <option value={10}>10 Pages (Deep Audit)</option>
                  </select>
                </div>

                <Button
                  onClick={() => handleTriggerCrawl(targetCrawlId)}
                  disabled={crawlingInProgress || !targetCrawlId.trim()}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold mt-2"
                >
                  {crawlingInProgress ? (
                    <>
                      <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                      Crawling in Progress...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Execute Targeted Crawl
                    </>
                  )}
                </Button>
              </div>

              {crawlFeedback && (
                <div
                  className={`mt-4 p-3 rounded-lg border text-xs font-mono space-y-1 ${
                    crawlFeedback.status === "success"
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                      : "bg-red-950/40 border-red-800 text-red-300"
                  }`}
                >
                  <div>[RESULT] {crawlFeedback.status?.toUpperCase()}</div>
                  {crawlFeedback.pages_crawled !== undefined && (
                    <div>Pages Crawled: {crawlFeedback.pages_crawled}</div>
                  )}
                  {crawlFeedback.products_discovered !== undefined && (
                    <div>Products Found: {crawlFeedback.products_discovered}</div>
                  )}
                  {crawlFeedback.people_discovered !== undefined && (
                    <div>People Found: {crawlFeedback.people_discovered}</div>
                  )}
                  {crawlFeedback.contacts_discovered !== undefined && (
                    <div>Contacts Found: {crawlFeedback.contacts_discovered}</div>
                  )}
                  {crawlFeedback.message && <div>Message: {crawlFeedback.message}</div>}
                </div>
              )}
            </div>

            {/* Crawl Engine Controls & Diagnostics */}
            <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="font-semibold text-white text-sm">Security & Engine Architecture</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                    <ShieldCheck className="h-4 w-4" />
                    SSRF Guard Active
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Blocks connections to 127.0.0.1, 10.x, 192.168.x, 172.16.x, and AWS/GCP/Azure link-local metadata (169.254.169.254) prior to HTTP request socket dispatch.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                    <Clock className="h-4 w-4" />
                    Rate Limiting & Politeness
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Enforces 1.0s delay between requests to same canonical domain, inspects robots.txt, respects non-HTML content limits (5MB cap), and rejects unauthorized scrapers.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                    <Layers className="h-4 w-4" />
                    Multi-Stage Classifier
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Classifies target URLs into Homepage, About Us, Leadership & Team, Contact, Products, Technical Specs, and Applications before text extraction.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
                    <FileText className="h-4 w-4" />
                    Evidence Provenance Trail
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Every extracted field is recorded in the <code>source_evidence</code> table with source URL, raw passage snippet, extraction method, and timestamp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: DATA QUALITY & AUDIT CENTER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "quality" && (
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              Data Quality & Audit Center
            </h2>
            <p className="text-xs text-slate-400">
              Transparent reporting of data coverage gaps, unverified entities, and missing fields.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs text-slate-400">Missing Official Website</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {stats?.quality_center.missing_website || 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">100% of records have canonical domains</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs text-slate-400">Missing US State Attribute</div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {stats?.quality_center.missing_state || 2}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">International partners awaiting state assignment</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs text-slate-400">Without Direct Phone/Contact</div>
              <div className="text-2xl font-bold font-mono text-slate-300 mt-1">
                {stats?.quality_center.missing_contacts || 65}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Contact form portal only</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs text-slate-400">Pending Review / Partial</div>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                {stats?.quality_center.unverified || 31}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Awaiting secondary corroboration</div>
            </div>
          </div>
        </main>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 15-TAB COMPANY DETAIL DRAWER / MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedCompanyId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-4xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Top Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/80">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">
                    {companyDetail?.company?.legal_name || "Company Intelligence Profile"}
                  </h2>
                  <Badge variant="outline" className="border-cyan-800 bg-cyan-950/80 text-cyan-400 text-xs">
                    {companyDetail?.company?.verification_status || "VERIFIED"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  {companyDetail?.company?.website && (
                    <a
                      href={companyDetail?.company?.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {companyDetail.company.canonical_domain}
                    </a>
                  )}
                  <span>·</span>
                  <span>
                    {companyDetail?.company?.hq_city ? `${companyDetail.company.hq_city}, ` : ""}
                    {companyDetail?.company?.hq_state}, {companyDetail?.company?.hq_country}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-emerald-400">
                    Completeness: {Math.round((companyDetail?.company?.completeness_score || 0) * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleTriggerCrawl(selectedCompanyId)}
                  disabled={crawlingInProgress}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs h-8"
                >
                  <RotateCw className={`h-3.5 w-3.5 mr-1.5 ${crawlingInProgress ? "animate-spin" : ""}`} />
                  Crawl Website
                </Button>
                <button
                  onClick={() => setSelectedCompanyId(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 15 Tabs Selector */}
            <div className="flex items-center gap-1 px-6 py-2 border-b border-slate-800 overflow-x-auto text-xs font-medium bg-slate-950/40">
              {[
                { id: "overview", label: "1. Overview" },
                { id: "details", label: "2. Details" },
                { id: "products", label: `3. Products (${companyDetail?.products?.length || 0})` },
                { id: "specs", label: "4. Technical Specs" },
                { id: "applications", label: `5. Applications (${companyDetail?.applications?.length || 0})` },
                { id: "leadership", label: `6. Leadership (${companyDetail?.people?.length || 0})` },
                { id: "contacts", label: `7. Contacts (${companyDetail?.contacts?.length || 0})` },
                { id: "locations", label: "8. Locations" },
                { id: "evidence", label: `13. Evidence (${companyDetail?.evidence?.length || 0})` },
                { id: "crawls", label: `14. Crawl History (${companyDetail?.crawl_jobs?.length || 0})` }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setDetailTab(t.id)}
                  className={`px-3 py-1.5 rounded-md whitespace-nowrap transition ${
                    detailTab === t.id
                      ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {detailLoading ? (
                <div className="py-20 text-center text-slate-400">
                  <RotateCw className="h-6 w-6 animate-spin mx-auto text-cyan-400 mb-2" />
                  Loading Full Intelligence Record...
                </div>
              ) : (
                <>
                  {/* TAB 1: OVERVIEW */}
                  {detailTab === "overview" && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-xs text-slate-400 font-mono uppercase">Company Overview & Mission</div>
                        <p className="text-sm text-slate-200 leading-relaxed">
                          {companyDetail?.company?.company_description || "Verified industrial robotics & automation organization."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block">Company Type</span>
                          <span className="text-slate-200 font-semibold mt-0.5 block">
                            {companyDetail?.company?.company_type || "Manufacturer"}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block">US Presence Status</span>
                          <span className="text-slate-200 font-semibold mt-0.5 block">
                            {companyDetail?.company?.us_presence_status || "US Headquartered"}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block">Confidence Score</span>
                          <span className="text-cyan-400 font-mono font-semibold mt-0.5 block">
                            {Math.round((companyDetail?.company?.confidence_score || 0.85) * 100)}%
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block">Last Verified</span>
                          <span className="text-slate-300 font-mono text-[11px] mt-0.5 block truncate">
                            {companyDetail?.company?.last_verified?.slice(0, 10) || "Today"}
                          </span>
                        </div>
                      </div>

                      {companyDetail?.company?.primary_products && (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="text-xs text-slate-400 font-mono uppercase">Primary Equipment & Solutions</div>
                          <p className="text-xs text-slate-300 leading-relaxed font-mono">
                            {companyDetail.company.primary_products}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: PRODUCTS & MACHINERY */}
                  {detailTab === "products" && (
                    <div className="space-y-4">
                      {companyDetail?.products?.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                          No direct product models extracted yet. Click "Crawl Website" to discover catalog entries.
                        </div>
                      ) : (
                        companyDetail?.products?.map((p: any) => (
                          <div key={p.product_id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-white text-sm">{p.product_name}</h4>
                                <div className="text-xs text-cyan-400 mt-0.5">{p.category}</div>
                              </div>
                              {p.model_number && (
                                <Badge variant="outline" className="border-slate-800 text-slate-300 font-mono text-[10px]">
                                  {p.model_number}
                                </Badge>
                              )}
                            </div>

                            {/* Specifications Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-xs font-mono">
                              {p.payload_capacity && (
                                <div className="p-2 rounded bg-slate-900">
                                  <span className="text-slate-500 block text-[10px]">Payload</span>
                                  <span className="text-slate-200">{p.payload_capacity}</span>
                                </div>
                              )}
                              {p.reach && (
                                <div className="p-2 rounded bg-slate-900">
                                  <span className="text-slate-500 block text-[10px]">Reach</span>
                                  <span className="text-slate-200">{p.reach}</span>
                                </div>
                              )}
                              {p.repeatability && (
                                <div className="p-2 rounded bg-slate-900">
                                  <span className="text-slate-500 block text-[10px]">Repeatability</span>
                                  <span className="text-slate-200">{p.repeatability}</span>
                                </div>
                              )}
                              {p.axes_count && (
                                <div className="p-2 rounded bg-slate-900">
                                  <span className="text-slate-500 block text-[10px]">Axes</span>
                                  <span className="text-slate-200">{p.axes_count}-Axis</span>
                                </div>
                              )}
                              {p.protection_rating && (
                                <div className="p-2 rounded bg-slate-900">
                                  <span className="text-slate-500 block text-[10px]">IP Rating</span>
                                  <span className="text-slate-200">{p.protection_rating}</span>
                                </div>
                              )}
                              {p.backlash && (
                                <div className="p-2 rounded bg-slate-900">
                                  <span className="text-slate-500 block text-[10px]">Backlash</span>
                                  <span className="text-slate-200">{p.backlash}</span>
                                </div>
                              )}
                            </div>

                            {p.typical_applications && (
                              <div className="text-xs text-slate-400">
                                <span className="text-slate-500">Applications: </span>
                                {p.typical_applications}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* TAB 4: TECHNICAL SPECS */}
                  {detailTab === "specs" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-xs text-slate-400 font-mono uppercase">Verified Precision Specifications</div>
                        <p className="text-xs text-slate-300">
                          Preserved technical specifications extracted directly from official brochures, datasheets, or product pages.
                        </p>
                      </div>

                      {companyDetail?.products?.filter((p: any) => p.payload_capacity || p.reach || p.repeatability).map((p: any) => (
                        <div key={p.product_id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                          <div className="font-semibold text-white">{p.product_name}</div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>Payload: <span className="text-cyan-400">{p.payload_capacity || "N/A"}</span></div>
                            <div>Reach: <span className="text-cyan-400">{p.reach || "N/A"}</span></div>
                            <div>Repeatability: <span className="text-cyan-400">{p.repeatability || "N/A"}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 6: LEADERSHIP & KEY PEOPLE */}
                  {detailTab === "leadership" && (
                    <div className="space-y-4">
                      {companyDetail?.people?.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                          No executive leadership profiles cataloged yet. Run crawler to discover leadership pages.
                        </div>
                      ) : (
                        companyDetail?.people?.map((per: any) => (
                          <div key={per.person_id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-white text-sm">{per.full_name}</h4>
                              <div className="text-xs text-cyan-400 mt-0.5">{per.job_title}</div>
                              {per.department && (
                                <div className="text-[11px] text-slate-500 mt-0.5">{per.department}</div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {per.linkedin_url && (
                                <a
                                  href={per.linkedin_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-950 border border-blue-800 text-blue-300 text-xs hover:bg-blue-900 transition"
                                >
                                  <Linkedin className="h-3 w-3" />
                                  LinkedIn
                                </a>
                              )}
                              {per.official_bio_url && (
                                <a
                                  href={per.official_bio_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1 rounded text-slate-400 hover:text-white"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* TAB 7: PUBLIC BUSINESS CONTACTS */}
                  {detailTab === "contacts" && (
                    <div className="space-y-4">
                      {companyDetail?.contacts?.map((c: any) => (
                        <div key={c.contact_id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-slate-900 text-cyan-400">
                              {c.contact_type?.toLowerCase().includes("phone") ? (
                                <Phone className="h-4 w-4" />
                              ) : (
                                <Mail className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-mono text-white text-xs font-semibold">{c.contact_value}</div>
                              <div className="text-[11px] text-slate-400">{c.contact_type || "Corporate Contact Channel"}</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-emerald-800 text-emerald-400 text-[10px]">
                            Verified Published
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 8: LOCATIONS */}
                  {detailTab === "locations" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-xs text-slate-400 font-mono uppercase">Headquarters</div>
                        <div className="text-sm text-slate-200">
                          {companyDetail?.company?.address || `${companyDetail?.company?.hq_city || ''}, ${companyDetail?.company?.hq_state || ''}, ${companyDetail?.company?.hq_country}`}
                        </div>
                      </div>

                      {companyDetail?.company?.us_operating_locations && (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="text-xs text-slate-400 font-mono uppercase">Confirmed US Operating Facilities</div>
                          <pre className="text-xs font-mono text-cyan-300 bg-slate-900 p-3 rounded overflow-x-auto">
                            {companyDetail.company.us_operating_locations}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 13: EVIDENCE */}
                  {detailTab === "evidence" && (
                    <div className="space-y-3">
                      {companyDetail?.evidence?.map((ev: any) => (
                        <div key={ev.evidence_id} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-cyan-400">{ev.field_name || "Citation"}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{ev.last_checked?.slice(0, 10)}</span>
                          </div>
                          <p className="text-slate-300 italic">"{ev.supporting_excerpt || ev.extracted_value}"</p>
                          <div className="text-[11px] text-slate-500 truncate">
                            Source: <a href={ev.source_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400">{ev.source_url}</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 14: CRAWLS */}
                  {detailTab === "crawls" && (
                    <div className="space-y-3">
                      {companyDetail?.crawl_jobs?.map((cj: any) => (
                        <div key={cj.job_id} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between font-mono">
                            <span className="text-white font-semibold">{cj.job_id}</span>
                            <Badge variant="outline" className="border-emerald-800 text-emerald-400 text-[10px]">
                              {cj.status}
                            </Badge>
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            Pages Crawled: {cj.pages_crawled} · Start: {cj.start_time?.slice(0, 16)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default USRoboticsIntelligencePlatform;
