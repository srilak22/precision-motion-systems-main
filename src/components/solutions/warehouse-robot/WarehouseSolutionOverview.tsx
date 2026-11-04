import React from "react";
import { Scan, Radio, Navigation, CloudLightning, CheckCircle2, ShieldCheck } from "lucide-react";
import { images } from "@/lib/images";

export function WarehouseSolutionOverview() {
  const centralRobotImage = images.warehouseRobot;

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <ShieldCheck size={14} />
            <span>SYSTEM BLUEPRINT</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Autonomous Inventory Auditing <span className="text-[#155EEF]">Architecture</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            A synchronized mobile scanning platform integrating ultra-high frequency RFID readers, multi-tier LiDAR SLAM, and cloud WMS reconcilers.
          </p>
        </div>

        {/* Central Robot Visual with 4 Cardinal Subsystem Nodes */}
        <div className="relative mx-auto max-w-4xl py-10">
          {/* Center Card */}
          <div className="relative z-10 mx-auto w-72 sm:w-96 rounded-2xl border-2 border-blue-500/30 bg-white p-3 shadow-xl">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
              <img
                src={centralRobotImage}
                alt="INDUS Warehouse Inventory AMR"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-3 text-center">
              <div className="font-display font-bold text-slate-900 text-base">INDUS Inventory AMR-120</div>
              <div className="text-xs text-[#155EEF] font-mono">Autonomous Warehouse Auditor</div>
            </div>
          </div>

          {/* TOP Node */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-mono font-bold text-[#155EEF] shadow-md">
              <Scan size={16} />
              <span>UHF RFID &amp; 1D/2D Barcode Array</span>
            </div>
            <div className="h-6 w-0.5 bg-blue-400" />
          </div>

          {/* BOTTOM Node */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="h-6 w-0.5 bg-blue-400" />
            <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-mono font-bold text-[#155EEF] shadow-md">
              <CloudLightning size={16} />
              <span>Cloud WMS / ERP API</span>
            </div>
          </div>

          {/* LEFT Node */}
          <div className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 flex items-center">
            <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-mono font-bold text-[#155EEF] shadow-md">
              <Navigation size={16} />
              <span className="hidden sm:inline">360° Safety LiDAR</span>
            </div>
            <div className="w-6 h-0.5 bg-blue-400" />
          </div>

          {/* RIGHT Node */}
          <div className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 flex items-center">
            <div className="w-6 h-0.5 bg-blue-400" />
            <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-mono font-bold text-[#155EEF] shadow-md">
              <Radio size={16} />
              <span className="hidden sm:inline">12m Telescopic Mast</span>
            </div>
          </div>
        </div>

        {/* 5-Point Checklist */}
        <div className="mt-16 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h3 className="font-display text-lg font-bold text-slate-900 mb-6 text-center">
            Core Autonomous Operating Checklist
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Audits 20,000+ RFID Tags per Hour",
              "Navigates Racking Aisles via 3D LiDAR",
              "Detects Obstacles, Workers & Forklifts",
              "Reconciles SAP, Manhattan, Oracle WMS",
              "Dispatches Automated Discrepancy Heatmaps",
              "Auto-Docks for Inductive Fast-Charging",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-[#155EEF] shrink-0" />
                <span className="text-sm text-slate-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
