import React, { useState } from "react";
import {
  HelpCircle,
  Paperclip,
  CheckCircle2,
  FileText,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EvidenceFileItem } from "./EvidenceUploaderModal";

export interface QuestionOption {
  id: string;
  level: number;
  label: string;
  criteria?: string;
}

export interface QuestionData {
  id: string;
  code: string;
  domainId: string;
  domainName?: string;
  title: string;
  description: string;
  helpText?: string;
  answerType: "single_choice" | "multi_choice" | "numeric" | "percentage" | "boolean" | "text" | string;
  options: QuestionOption[];
  evidenceRequired?: string;
  kpiCode?: string;
  isMandatory?: boolean;
}

export interface UserResponse {
  questionId: string;
  selectedOptionId?: string;
  score: number | null; // 0-5 or null
  numericValue?: number;
  textValue?: string;
  isNotApplicable?: boolean;
  notes?: string;
  evidenceFiles?: EvidenceFileItem[];
}

interface AssessmentQuestionCardProps {
  question: QuestionData;
  index: number;
  totalQuestions: number;
  response?: UserResponse;
  evidenceFiles: EvidenceFileItem[];
  onChange: (updated: UserResponse) => void;
  onOpenEvidenceModal: (questionId: string, questionTitle: string) => void;
}

export function AssessmentQuestionCard({
  question,
  index,
  totalQuestions,
  response,
  evidenceFiles,
  onChange,
  onOpenEvidenceModal,
}: AssessmentQuestionCardProps) {
  const [showNotes, setShowNotes] = useState(Boolean(response?.notes));
  const [showHelp, setShowHelp] = useState(false);

  const isNA = Boolean(response?.isNotApplicable);
  const currentScore = response?.score;
  const questionEvidence = evidenceFiles.filter((f) => f.questionId === question.id);

  const handleSelectOption = (option: QuestionOption) => {
    onChange({
      questionId: question.id,
      selectedOptionId: option.id,
      score: option.level,
      isNotApplicable: false,
      numericValue: response?.numericValue,
      textValue: response?.textValue,
      notes: response?.notes,
    });
  };

  const handleToggleNA = () => {
    if (isNA) {
      onChange({
        questionId: question.id,
        isNotApplicable: false,
        score: null,
        selectedOptionId: undefined,
        notes: response?.notes,
      });
    } else {
      onChange({
        questionId: question.id,
        isNotApplicable: true,
        score: null,
        selectedOptionId: undefined,
        notes: response?.notes || "Marked as Not Applicable for this facility archetype.",
      });
    }
  };

  const handleNotesChange = (text: string) => {
    onChange({
      questionId: question.id,
      selectedOptionId: response?.selectedOptionId,
      score: response?.score ?? null,
      isNotApplicable: response?.isNotApplicable,
      numericValue: response?.numericValue,
      textValue: response?.textValue,
      notes: text,
    });
  };

  const handleNumericChange = (val: string) => {
    const num = parseFloat(val);
    const validNum = isNaN(num) ? undefined : num;
    // Map percentage or numeric to 0-5 maturity scale if standard
    let calculatedScore: number | null = null;
    if (validNum !== undefined) {
      if (question.answerType === "percentage") {
        if (validNum < 15) calculatedScore = 1;
        else if (validNum < 40) calculatedScore = 2;
        else if (validNum < 70) calculatedScore = 3;
        else if (validNum < 90) calculatedScore = 4;
        else calculatedScore = 5;
      }
    }

    onChange({
      questionId: question.id,
      selectedOptionId: response?.selectedOptionId,
      score: calculatedScore ?? response?.score ?? null,
      numericValue: validNum,
      isNotApplicable: false,
      textValue: response?.textValue,
      notes: response?.notes,
    });
  };

  const getScoreBadgeColor = (level: number | null | undefined) => {
    if (level === null || level === undefined) return "bg-slate-800 text-slate-400 border-slate-700";
    if (level === 0) return "bg-rose-950/60 text-rose-300 border-rose-500/50";
    if (level === 1) return "bg-amber-950/60 text-amber-300 border-amber-500/50";
    if (level === 2) return "bg-yellow-950/60 text-yellow-300 border-yellow-500/50";
    if (level === 3) return "bg-blue-950/60 text-blue-300 border-blue-500/50";
    if (level === 4) return "bg-cyan-950/60 text-cyan-300 border-cyan-500/50";
    return "bg-emerald-950/60 text-emerald-300 border-emerald-500/50";
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        isNA
          ? "bg-slate-950/40 border-slate-800/80 opacity-75"
          : currentScore !== null && currentScore !== undefined
          ? "bg-slate-900/80 border-cyan-500/30 shadow-lg shadow-cyan-950/20"
          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Question Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              {question.code}
            </span>
            {question.domainName && (
              <span className="text-xs font-medium text-slate-400 hidden sm:inline">
                &bull; {question.domainName}
              </span>
            )}
            {question.kpiCode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                KPI: {question.kpiCode}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Question {index + 1} of {totalQuestions}
            </span>

            {/* Score Status Badge */}
            {isNA ? (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                N/A (Excluded)
              </span>
            ) : currentScore !== null && currentScore !== undefined ? (
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${getScoreBadgeColor(
                  currentScore
                )}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Level {currentScore} / 5</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800/80 text-amber-400 border border-amber-500/30">
                Unanswered
              </span>
            )}
          </div>
        </div>

        {/* Question Title & Description */}
        <h4 className="text-base sm:text-lg font-semibold text-white tracking-tight leading-snug">
          {question.title}
        </h4>
        <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
          {question.description}
        </p>

        {/* Collapsible Help / Evidence Note */}
        {question.helpText && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHelp ? "Hide assessment guidance" : "View assessment criteria & evidence requirements"}</span>
            </button>
            {showHelp && (
              <div className="mt-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2 animate-in fade-in">
                <div>
                  <span className="font-semibold text-cyan-300">Guidance: </span>
                  {question.helpText}
                </div>
                {question.evidenceRequired && (
                  <div>
                    <span className="font-semibold text-emerald-300">Verified Evidence Required: </span>
                    {question.evidenceRequired}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Answer Options Container */}
      {!isNA && (
        <div className="p-5 sm:p-6 space-y-3">
          {/* If numeric or percentage question */}
          {question.answerType === "percentage" || question.answerType === "numeric" ? (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Enter Measured Metric Value ({question.answerType === "percentage" ? "%" : "units"}):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={question.answerType === "percentage" ? 100 : undefined}
                  value={response?.numericValue ?? ""}
                  onChange={(e) => handleNumericChange(e.target.value)}
                  placeholder={question.answerType === "percentage" ? "e.g. 68.5" : "e.g. 120"}
                  className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono w-48 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-sm text-slate-400">
                  {question.answerType === "percentage" ? "% of automated operations" : "units"}
                </span>
              </div>
            </div>
          ) : null}

          {/* Standard 0–5 Maturity Level Options */}
          <div className="space-y-2">
            {question.options.map((opt) => {
              const isSelected =
                response?.selectedOptionId === opt.id || response?.score === opt.level;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3.5 ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-950/60 to-cyan-950/40 border-cyan-400 text-white shadow-md shadow-cyan-950/30"
                      : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950/80"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border transition-colors ${
                      isSelected
                        ? "bg-cyan-500 border-cyan-400 text-slate-950"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {opt.level}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-100 flex items-center justify-between gap-2">
                      <span>{opt.label}</span>
                      {isSelected && (
                        <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Selected
                        </span>
                      )}
                    </div>
                    {opt.criteria && (
                      <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {opt.criteria}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Card Actions & Footer */}
      <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Evidence Attachment Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenEvidenceModal(question.id, question.title)}
            className={`border-slate-700 text-xs h-8 ${
              questionEvidence.length > 0
                ? "bg-blue-950/50 text-cyan-300 border-cyan-500/50 hover:bg-blue-900/50"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Paperclip className="w-3.5 h-3.5 mr-1.5" />
            <span>
              {questionEvidence.length > 0
                ? `${questionEvidence.length} Evidence Attached`
                : "Attach Evidence"}
            </span>
          </Button>

          {/* Notes Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowNotes(!showNotes)}
            className="text-xs h-8 text-slate-400 hover:text-white"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            <span>{showNotes ? "Hide Notes" : response?.notes ? "View Note" : "Add Note"}</span>
          </Button>
        </div>

        {/* Not Applicable Toggle */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleToggleNA}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              isNA
                ? "bg-red-950/40 border-red-500/50 text-red-300"
                : "border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700"
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>{isNA ? "Restore Question" : "Mark as N/A"}</span>
          </button>
        </div>
      </div>

      {/* Expandable Notes Input */}
      {showNotes && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Contextual Factory Remarks &amp; Justification:
          </label>
          <textarea
            rows={2}
            value={response?.notes || ""}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add specific cell IDs, planned investments, machine serials, or operational constraints..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>
      )}
    </div>
  );
}
