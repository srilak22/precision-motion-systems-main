import React from "react";
import { Scan, Radio, Cpu, ArrowDown, Database, Server, Smartphone, CheckCircle2 } from "lucide-react";

export function WarehouseArchitectureDiagram() {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>SYSTEM SCHEMATIC</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Robot System <span className="text-[#155EEF]">Architecture Diagram</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            High-speed dual-bus pipeline bridging physical RF sensing to ERP enterprise data lakes.
          </p>
        </div>

        {/* Diagram Card in Technical High-Contrast Schematic */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-8 sm:p-12 text-white shadow-xl">
          {/* Top Sensor Layer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl border border-blue-500/40 bg-blue-950/40">
              <Scan size={24} className="text-sky-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">UHF RFID Antennae</div>
              <div className="text-xs text-slate-400">860-960 MHz Array</div>
            </div>
            <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/40">
              <Scan size={24} className="text-cyan-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Bar/QR Code Cameras</div>
              <div className="text-xs text-slate-400">High-Speed 2D Matrix</div>
            </div>
            <div className="p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/40">
              <Radio size={24} className="text-indigo-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">3D Safety LiDAR</div>
              <div className="text-xs text-slate-400">Dual-Plane Navigation</div>
            </div>
          </div>

          <div className="my-6 flex justify-center text-[#155EEF]">
            <ArrowDown size={32} className="animate-bounce" />
          </div>

          {/* Central AI Computing Node */}
          <div className="rounded-xl border-2 border-blue-500 bg-blue-950/60 p-6 text-center shadow-lg">
            <Cpu size={32} className="text-sky-300 mx-auto mb-2" />
            <div className="font-display font-bold text-lg text-white">
              NVIDIA Jetson AGX Orin Edge Computer
            </div>
            <div className="text-xs text-sky-200 mt-1">
              YOLOv8 Bay Verification • Real-Time ROS 2 Nav2 Costmaps • Dual-Core Mast Control
            </div>
          </div>

          <div className="my-6 flex justify-center text-[#155EEF]">
            <ArrowDown size={32} className="animate-bounce" />
          </div>

          {/* Execution & Output Streams */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-5 text-center">
              <Database size={24} className="text-emerald-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">WMS Cloud Synchronizer</div>
              <div className="text-xs text-emerald-200 mt-1">
                Automated reconciliation with SAP, Manhattan, Oracle ERP
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-5 text-center">
              <Smartphone size={24} className="text-amber-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Operations Telematics Portal</div>
              <div className="text-xs text-amber-200 mt-1">
                3D Discrepancy Heatmaps • Instant Misplaced SKU Alerts
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
