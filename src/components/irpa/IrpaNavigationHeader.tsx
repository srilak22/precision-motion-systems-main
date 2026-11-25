import React from "react";
import { Link } from "@tanstack/react-router";
import { Bot, ShieldCheck, UserCheck, Settings, ArrowLeft, FileText } from "lucide-react";

interface IrpaNavProps {
  currentModule?: "landing" | "register" | "factory" | "assessment" | "consultant" | "admin" | "analytics";
  assessmentId?: string;
}

export function IrpaNavigationHeader({ currentModule = "landing", assessmentId }: IrpaNavProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-mono">
            <ArrowLeft className="w-4 h-4" />
            <span>INDUS Portal</span>
          </Link>
          <span className="text-slate-700">|</span>
          <Link to="/irpa-gap-analysis" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-white text-sm tracking-wide">INDUS IRPA</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  PHASE 2
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Robotics Process Automation Gap Analysis</p>
            </div>
          </Link>
        </div>

        {/* Quick Nav Links */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Link
            to="/irpa-gap-analysis"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === "landing"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-900"
            }`}
          >
            Overview
          </Link>

          <Link
            to="/irpa-gap-analysis/register"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === "register" || currentModule === "factory" || currentModule === "assessment"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-300 hover:text-white hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Assessment</span>
            </span>
          </Link>

          <Link
            to="/irpa-gap-analysis/consultant"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === "consultant"
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                : "text-slate-300 hover:text-white hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Consultant Portal</span>
            </span>
          </Link>

          {assessmentId && (
            <Link
              to={`/irpa-gap-analysis/analytics/${assessmentId}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentModule === "analytics"
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-900"
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Analytics</span>
              </span>
            </Link>
          )}

          <Link
            to="/irpa-gap-analysis/admin"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentModule === "admin"
                ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/40"
                : "text-slate-300 hover:text-white hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin Center</span>
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
