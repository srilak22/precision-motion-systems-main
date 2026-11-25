import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Check,
  X,
  ExternalLink,
  Download,
  Building,
  Factory,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IRPA_DOMAINS } from "@/data/irpa/domains";

interface AssessmentSessionItem {
  id: string;
  referenceId: string;
  companyName: string;
  factoryName: string;
  industryName: string;
  status: "draft" | "submitted" | "under_review" | "verified" | "completed";
  overallCurrentScore: number | null;
  overallTargetScore: number | null;
  submittedAt: string | null;
  createdAt: string;
  evidenceCount?: number;
}

interface EvidenceFileDetail {
  id: string;
  questionId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  verificationStatus: "pending" | "verified" | "rejected";
  dataUrl?: string;
}

export function ConsultantPortal() {
  const [assessments, setAssessments] = useState<AssessmentSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [selectedAssessmentDetail, setSelectedAssessmentDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Comment state
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [auditSuccessMsg, setAuditSuccessMsg] = useState<string | null>(null);

  // Fetch all assessments
  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const storedToken = localStorage.getItem("indus_irpa_token");
      const res = await fetch("/api/assessments", {
        headers: {
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAssessments(data.sessions || []);
      }
    } catch (err) {
      console.error("Failed to load assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // Fetch single assessment details
  const loadAssessmentDetail = async (id: string) => {
    setSelectedAssessmentId(id);
    setDetailLoading(true);
    setAuditSuccessMsg(null);
    try {
      const storedToken = localStorage.getItem("indus_irpa_token");
      const res = await fetch(`/api/assessments/${id}`, {
        headers: {
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedAssessmentDetail(data.session);
      }
    } catch (err) {
      console.error("Failed to load assessment details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Verify / Reject evidence file
  const handleVerifyEvidence = async (
    evidenceId: string,
    status: "verified" | "rejected"
  ) => {
    if (!selectedAssessmentId) return;
    try {
      const storedToken = localStorage.getItem("indus_irpa_token");
      const res = await fetch(
        `/api/assessments/${selectedAssessmentId}/evidence/${evidenceId}/verify`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
          },
          body: JSON.stringify({
            verificationStatus: status,
            notes: `Verified by INDUS Consultant on ${new Date().toLocaleDateString()}`,
          }),
        }
      );
      if (res.ok) {
        // Update local state
        setSelectedAssessmentDetail((prev: any) => {
          if (!prev) return prev;
          const updatedFiles = (prev.evidenceFiles || []).map((f: any) =>
            f.id === evidenceId ? { ...f, verificationStatus: status } : f
          );
          return { ...prev, evidenceFiles: updatedFiles };
        });
      }
    } catch (err) {
      console.error("Failed to update evidence status:", err);
    }
  };

  // Submit consultant audit comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedAssessmentId) return;
    setSubmittingComment(true);
    try {
      const storedToken = localStorage.getItem("indus_irpa_token");
      const res = await fetch(`/api/assessments/${selectedAssessmentId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        body: JSON.stringify({
          comment: commentText.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedAssessmentDetail((prev: any) => ({
          ...prev,
          comments: [...(prev.comments || []), data.comment],
        }));
        setCommentText("");
        setAuditSuccessMsg("Consultant observation recorded successfully.");
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
      case "completed":
        return "bg-emerald-950/70 border-emerald-500/50 text-emerald-300";
      case "submitted":
      case "under_review":
        return "bg-cyan-950/70 border-cyan-500/50 text-cyan-300";
      default:
        return "bg-slate-800 border-slate-700 text-slate-400";
    }
  };

  const filtered = assessments.filter((a) => {
    const matchesSearch =
      (a.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.factoryName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.referenceId || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-blue-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Consultant Verification Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Factory Automation Assessment Review
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Inspect customer capability questionnaires, verify attached engineering evidence, audit domain gaps, and issue formal robotics automation recommendations.
          </p>
        </div>

        <Button
          type="button"
          onClick={fetchAssessments}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800 shrink-0 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          Refresh Pipeline
        </Button>
      </div>

      {/* Main Grid: Left = Assessment Queue; Right = Inspection Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assessment Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plant, company or ref ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              {["all", "submitted", "under_review", "verified", "draft"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                    statusFilter === st
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Cards List */}
          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading assessments pipeline...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
                No assessment submissions match the criteria.
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = selectedAssessmentId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => loadAssessmentDetail(item.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-950/60 to-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-950/30"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {item.referenceId || `IRPA-${item.id.slice(0, 8)}`}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white truncate">
                      {item.factoryName || "Plant Unit"}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{item.companyName || "Industrial Partner"}</span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        Baseline:{" "}
                        <strong className="text-cyan-300 font-mono">
                          {item.overallCurrentScore ? item.overallCurrentScore.toFixed(2) : "N/A"}
                        </strong>
                      </div>
                      <div>
                        Target:{" "}
                        <strong className="text-emerald-300 font-mono">
                          {item.overallTargetScore ? item.overallTargetScore.toFixed(2) : "N/A"}
                        </strong>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.submittedAt
                          ? new Date(item.submittedAt).toLocaleDateString()
                          : "Draft"}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Review Workspace (7 cols) */}
        <div className="lg:col-span-7">
          {!selectedAssessmentId ? (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-500 h-full flex flex-col items-center justify-center space-y-3">
              <Eye className="w-8 h-8 text-slate-600" />
              <div className="text-sm font-medium text-slate-400">
                Select an assessment from the queue to start consultant audit
              </div>
              <p className="text-xs max-w-sm">
                You can review factory parameters, verify uploaded SOP evidence, inspect question responses, and log consultant observations.
              </p>
            </div>
          ) : detailLoading ? (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading complete assessment workbook &amp; evidence files...
            </div>
          ) : selectedAssessmentDetail ? (
            <div className="space-y-6">
              {/* Target Assessment Overview Header */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                      Audit Case: {selectedAssessmentDetail.referenceId}
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">
                      {selectedAssessmentDetail.factoryName}
                    </h2>
                    <div className="text-xs text-slate-400">
                      Enterprise: {selectedAssessmentDetail.companyName} &bull; Sector:{" "}
                      {selectedAssessmentDetail.industryId}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getStatusBadge(
                      selectedAssessmentDetail.status
                    )}`}
                  >
                    {selectedAssessmentDetail.status.replace("_", " ")}
                  </span>
                </div>

                {auditSuccessMsg && (
                  <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{auditSuccessMsg}</span>
                  </div>
                )}

                {/* Score Pill Row */}
                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400">Baseline Score</div>
                    <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                      {selectedAssessmentDetail.overallCurrentScore?.toFixed(2) || "2.10"}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400">Target Score</div>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                      {selectedAssessmentDetail.overallTargetScore?.toFixed(2) || "3.80"}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400">Capability Gap</div>
                    <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">
                      +
                      {(
                        (selectedAssessmentDetail.overallTargetScore || 3.8) -
                        (selectedAssessmentDetail.overallCurrentScore || 2.1)
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence Verification Tray */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Attached Evidence Verification ({selectedAssessmentDetail.evidenceFiles?.length || 0})</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Audit documentation against capability criteria
                  </span>
                </div>

                {(!selectedAssessmentDetail.evidenceFiles ||
                  selectedAssessmentDetail.evidenceFiles.length === 0) ? (
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-500 text-center">
                    No evidence documents attached to this assessment.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedAssessmentDetail.evidenceFiles.map((file: EvidenceFileDetail) => (
                      <div
                        key={file.id}
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                              {file.fileName}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-cyan-300 uppercase">
                                {file.questionId}
                              </span>
                              <span>&bull;</span>
                              <span>{(file.fileSize / 1024).toFixed(1)} KB</span>
                            </div>
                          </div>
                        </div>

                        {/* Verification Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {file.verificationStatus === "verified" ? (
                            <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleVerifyEvidence(file.id, "verified")}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-7 px-2.5"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                          )}

                          {file.verificationStatus === "rejected" ? (
                            <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-rose-950 border border-rose-500/50 text-rose-400 flex items-center gap-1">
                              <X className="w-3.5 h-3.5" />
                              Rejected
                            </span>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerifyEvidence(file.id, "rejected")}
                              className="border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50 text-xs h-7 px-2.5"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Consultant Observations & Audit Comment Log */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Consultant Audit Log &amp; Engineering Recommendations</span>
                </h3>

                {/* Existing comments list */}
                {selectedAssessmentDetail.comments &&
                  selectedAssessmentDetail.comments.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {selectedAssessmentDetail.comments.map((c: any) => (
                        <div
                          key={c.id}
                          className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="font-semibold text-cyan-400">
                              {c.authorName || "INDUS Consultant"}
                            </span>
                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>{c.comment}</div>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Add new comment form */}
                <form onSubmit={handlePostComment} className="space-y-3">
                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Record formal technical observations, cell feasibility findings, or recommended turnkey workcells..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg"
                    >
                      {submittingComment ? "Saving observation..." : "Log Consultant Note"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
