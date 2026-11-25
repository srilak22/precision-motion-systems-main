import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExecutiveSummaryCard } from "./ExecutiveSummaryCard";
import { MaturityRadarChart } from "./MaturityRadarChart";
import { CurrentVsTargetBarChart } from "./CurrentVsTargetBarChart";
import { DomainGapBreakdownTable } from "./DomainGapBreakdownTable";
import { TechnologyGapsCard } from "./TechnologyGapsCard";
import { RootCauseAnalysisCard } from "./RootCauseAnalysisCard";
import { WorkforceSkillsCard } from "./WorkforceSkillsCard";
import { KpiPerformanceDashboard } from "./KpiPerformanceDashboard";
import { PriorityMatrixCard } from "./PriorityMatrixCard";
import { EvidenceQualityCard } from "./EvidenceQualityCard";
import { ConsultantValidationModal } from "./ConsultantValidationModal";

interface IrpaAnalyticsDashboardProps {
  assessmentId: string;
}

export function IrpaAnalyticsDashboard({ assessmentId }: IrpaAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("CUSTOMER");

  const fetchAnalytics = async (isRecalc = false) => {
    if (isRecalc) setRecalculating(true);
    else setLoading(true);
    setError(null);

    try {
      const storedToken = localStorage.getItem("indus_irpa_token");
      const url = isRecalc
        ? `/api/analytics/${assessmentId}/recalculate`
        : `/api/analytics/${assessmentId}/dashboard`;

      const method = isRecalc ? "POST" : "GET";

      const res = await fetch(url, {
        method,
        headers: {
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load IRPA analytics intelligence.");
      }

      setAnalytics(data.analytics || data.payload);

      // Check user role
      const storedUser = localStorage.getItem("indus_irpa_user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          setUserRole(u.role || "CUSTOMER");
        } catch {}
      }
    } catch (err: any) {
      setError(err.message || "Could not retrieve analytics.");
    } finally {
      setLoading(false);
      setRecalculating(false);
    }
  };

  useEffect(() => {
    if (assessmentId) {
      fetchAnalytics();
    }
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        <div className="text-sm font-semibold text-slate-300">
          Executing Phase 3 Intelligence Pipeline...
        </div>
        <p className="text-xs text-slate-500 max-w-sm text-center">
          Calculating 12-domain weighted maturity, OEE performance KPIs, automated technology gap detection, and Ishikawa root causes.
        </p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="p-6 rounded-3xl bg-red-950/40 border border-red-500/40 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Analytics Engine Notification</h2>
          <p className="text-xs text-red-200 max-w-md mx-auto">{error || "No data available."}</p>
          <Button
            type="button"
            onClick={() => fetchAnalytics(true)}
            className="bg-red-600 hover:bg-red-500 text-white text-xs px-6 py-2 rounded-lg"
          >
            Trigger Pipeline Recalculation
          </Button>
        </div>
      </div>
    );
  }

  const isConsultant = userRole === "CONSULTANT" || userRole === "ADMIN";

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Engine Version: <strong className="text-cyan-400">{analytics.methodologyVersion}</strong></span>
          <span>&bull;</span>
          <span>Calculated: <strong className="text-slate-300">{new Date(analytics.calculatedAt).toLocaleTimeString()}</strong></span>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={recalculating}
            onClick={() => fetchAnalytics(true)}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${recalculating ? "animate-spin text-cyan-400" : ""}`} />
            {recalculating ? "Recalculating..." : "Recalculate Insights"}
          </Button>

          {isConsultant && (
            <Button
              type="button"
              onClick={() => setValidationModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              Sign Off &amp; Validate
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print / Export PDF
          </Button>
        </div>
      </div>

      {/* Section A: Executive Summary */}
      <section id="executive-summary">
        <ExecutiveSummaryCard
          summary={analytics.sessionSummary}
          calculatedAt={analytics.calculatedAt}
        />
      </section>

      {/* Section B & C: Maturity Radar & Grouped Bar Charts */}
      <section id="maturity-charts" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaturityRadarChart
          domainScores={analytics.maturityResults.domainScores}
        />
        <CurrentVsTargetBarChart
          domainScores={analytics.maturityResults.domainScores}
        />
      </section>

      {/* Section D: Domain-wise Gap Analysis Table */}
      <section id="domain-gaps">
        <DomainGapBreakdownTable
          gaps={analytics.gapResults.analyzedGaps}
        />
      </section>

      {/* Section E: Technology Gap Detection */}
      <section id="technology-gaps">
        <TechnologyGapsCard
          techGaps={analytics.techGapResults.detectedGaps}
          isConsultant={isConsultant}
        />
      </section>

      {/* Section F: Root Cause Analysis (Ishikawa & 5-Whys) */}
      <section id="root-causes">
        <RootCauseAnalysisCard
          rootCauses={analytics.rootCauseResults.rootCauses}
        />
      </section>

      {/* Section G: Workforce Skills Gap */}
      <section id="workforce-skills">
        <WorkforceSkillsCard
          workforce={analytics.workforceResults}
        />
      </section>

      {/* Section H: Industrial KPI Performance */}
      <section id="industrial-kpis">
        <KpiPerformanceDashboard
          kpis={analytics.kpiResults.kpis}
        />
      </section>

      {/* Section I: Prioritization Matrix */}
      <section id="priority-matrix">
        <PriorityMatrixCard
          priorities={analytics.priorityResults.priorities}
        />
      </section>

      {/* Section J: Evidence Quality & Contradiction Alerts */}
      <section id="evidence-quality">
        <EvidenceQualityCard
          evidenceQuality={analytics.confidenceResults}
        />
      </section>

      {/* Consultant Validation Modal */}
      <ConsultantValidationModal
        isOpen={validationModalOpen}
        onClose={() => setValidationModalOpen(false)}
        assessmentId={assessmentId}
        techGaps={analytics.techGapResults.detectedGaps}
        rootCauses={analytics.rootCauseResults.rootCauses}
        onValidationSuccess={() => fetchAnalytics(false)}
      />
    </div>
  );
}
