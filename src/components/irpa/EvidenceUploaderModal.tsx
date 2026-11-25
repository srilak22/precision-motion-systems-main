import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EvidenceFileItem {
  id: string;
  questionId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  verificationStatus: "pending" | "verified" | "rejected";
  dataUrl?: string;
  downloadUrl?: string;
}

interface EvidenceUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  questionTitle: string;
  assessmentId: string;
  existingFiles: EvidenceFileItem[];
  onUploadSuccess: (newFile: EvidenceFileItem) => void;
  onDeleteFile?: (fileId: string) => void;
}

const ACCEPTED_EXTENSIONS = [".pdf", ".xlsx", ".csv", ".docx", ".jpg", ".jpeg", ".png"];
const MAX_SIZE_MB = 15;

export function EvidenceUploaderModal({
  isOpen,
  onClose,
  questionId,
  questionTitle,
  assessmentId,
  existingFiles,
  onUploadSuccess,
  onDeleteFile,
}: EvidenceUploaderModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadError(null);

    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`File exceeds maximum size limit of ${MAX_SIZE_MB} MB.`);
      return;
    }

    // Validate extension
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setUploadError(`File type "${ext}" not supported. Allowed formats: PDF, XLSX, CSV, DOCX, JPG, PNG.`);
      return;
    }

    setUploading(true);

    try {
      // Read file as Base64 data URL
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
      });
      reader.readAsDataURL(file);
      const dataUrl = await base64Promise;

      const storedToken = localStorage.getItem("indus_irpa_token");
      const res = await fetch(`/api/assessments/${assessmentId}/evidence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        body: JSON.stringify({
          questionId,
          fileName: file.name,
          fileType: file.type || ext,
          fileSize: file.size,
          dataUrl,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to upload evidence file.");
      }

      onUploadSuccess({
        id: resData.evidence?.id || `evi-${Date.now()}`,
        questionId,
        fileName: file.name,
        fileType: file.type || ext,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        verificationStatus: "pending",
        downloadUrl: resData.evidence?.downloadUrl,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to process and upload file.");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".xlsx") || lower.endsWith(".csv")) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    }
    if (lower.endsWith(".pdf") || lower.endsWith(".docx")) {
      return <FileText className="w-5 h-5 text-blue-400" />;
    }
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png")) {
      return <ImageIcon className="w-5 h-5 text-purple-400" />;
    }
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const questionFiles = existingFiles.filter((f) => f.questionId === questionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Evidence Verification &bull; {questionId}</span>
            </div>
            <h3 className="text-lg font-bold text-white line-clamp-1">{questionTitle}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload SOPs, telemetry screenshots, equipment lists, or audit logs to substantiate capability scores.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-cyan-400 bg-cyan-950/20"
                : "border-slate-700 bg-slate-950/40 hover:border-slate-500 hover:bg-slate-950/60"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
              accept=".pdf,.xlsx,.csv,.docx,.jpg,.jpeg,.png"
              className="hidden"
            />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-white mb-1">
                {uploading ? (
                  <span className="text-cyan-400 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                    Uploading and indexing file...
                  </span>
                ) : (
                  <>Click to browse or drag &amp; drop evidence files here</>
                )}
              </div>
              <div className="text-xs text-slate-400">
                Supports PDF, XLSX, CSV, DOCX, JPG, PNG &bull; Max {MAX_SIZE_MB} MB
              </div>
            </div>
          </div>

          {uploadError && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center gap-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Attached Files List */}
          <div>
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Attached Evidence ({questionFiles.length})</span>
              <span className="text-[11px] text-slate-500">Subject to consultant verification</span>
            </div>

            {questionFiles.length === 0 ? (
              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/30 text-center text-xs text-slate-500">
                No supporting evidence files uploaded for this question yet.
              </div>
            ) : (
              <div className="space-y-2">
                {questionFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                        {getFileIcon(file.fileName)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate max-w-[260px] sm:max-w-md">
                          {file.fileName}
                        </div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                          <span>{formatFileSize(file.fileSize)}</span>
                          <span>&bull;</span>
                          <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {file.verificationStatus === "verified" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      ) : file.verificationStatus === "rejected" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950 border border-red-500/50 text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}

                      {onDeleteFile && (
                        <button
                          type="button"
                          onClick={() => onDeleteFile(file.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
          <Button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-5 py-2 rounded-lg"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
