import React, { useState } from "react";
import {
  Rotate3d,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Box,
  Download,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCadViewerProps {
  modelName: string;
  modelCode: string;
  cadFormat?: string;
  cadFilename?: string;
  posterImage?: string;
  onDownloadCad: () => void;
}

export function ProductCadViewer({
  modelName,
  modelCode,
  cadFormat = "STEP AP242 / GLTF",
  cadFilename,
  posterImage,
  onDownloadCad,
}: ProductCadViewerProps) {
  const [wireframe, setWireframe] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(25);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isRotating, setIsRotating] = useState(false);

  const filename = cadFilename || `${modelCode.replace(/[\s/]/g, "_")}_3D_ASSEMBLY.STEP`;

  const handleReset = () => {
    setRotationAngle(25);
    setZoomLevel(1);
    setWireframe(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden flex flex-col">
      {/* 3D Viewer Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-200/90 bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 text-[#1D4ED8] border border-blue-100">
            <Box size={16} />
          </span>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] block">
              INTERACTIVE 3D CAD KINEMATICS
            </span>
            <span className="text-xs font-bold text-slate-900 font-mono">
              {modelCode} // {cadFormat}
            </span>
          </div>
        </div>

        {/* Control Action Buttons */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
              wireframe
                ? "bg-[#1D4ED8] text-white border-[#1D4ED8]"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-1">
              <Layers size={12} />
              <span>{wireframe ? "Wireframe" : "Shaded"}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
            className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>

          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
            className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="Reset Perspective"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Interactive 3D Canvas Stage */}
      <div
        className="relative h-72 sm:h-96 w-full bg-radial from-slate-50 to-slate-100/80 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={() => setIsRotating(true)}
        onMouseUp={() => setIsRotating(false)}
        onMouseMove={(e) => {
          if (isRotating) {
            setRotationAngle((prev) => (prev + e.movementX * 0.5) % 360);
          }
        }}
      >
        {/* Architectural 3D Ground Grid */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none opacity-40"
          style={{
            backgroundImage: `linear-gradient(to right, #1d4ed814 1px, transparent 1px), linear-gradient(to bottom, #1d4ed814 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            transform: "perspective(400px) rotateX(60deg)",
            transformOrigin: "bottom center",
          }}
        />

        {/* 3D Model Visual Representation with Real-Time Perspective Controls */}
        <div
          className="relative transition-transform duration-75 will-change-transform flex items-center justify-center p-6"
          style={{
            transform: `scale(${zoomLevel}) rotateY(${rotationAngle}deg) rotateX(12deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {posterImage ? (
            <img
              src={posterImage}
              alt={`${modelName} 3D Model`}
              className={`max-h-56 sm:max-h-72 object-contain drop-shadow-xl transition-all ${
                wireframe ? "filter invert contrast-200 opacity-70" : ""
              }`}
            />
          ) : (
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-2xl border-2 border-dashed border-[#1D4ED8]/60 bg-blue-50/50 flex flex-col items-center justify-center p-6 text-center shadow-lg">
              <Box size={48} className="text-[#1D4ED8] animate-pulse mb-3" />
              <div className="text-xs font-mono font-bold text-slate-900">{modelCode}</div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">Full 3D Kinematic Envelope</div>
            </div>
          )}

          {/* Floating Spatial Datum Coordinate Stamp */}
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-mono font-bold text-[#1D4ED8] shadow-2xs pointer-events-none">
            DATUM ORIGIN (0,0,0)
          </div>
        </div>

        {/* Interaction Hint Overlay */}
        <div className="absolute bottom-3 left-4 text-[11px] font-mono text-slate-500 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-200/80 shadow-2xs flex items-center gap-1.5 pointer-events-none">
          <Rotate3d size={13} className="text-[#1D4ED8]" />
          <span>Click &amp; drag to rotate 3D assembly · Scroll to zoom</span>
        </div>
      </div>

      {/* CAD File Spec & Download Strip */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Calibrated Geometric Model:</span>
            <code className="text-[#1D4ED8] bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
              {filename}
            </code>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Conforms to ISO 10303-242 / DIN 3990. Includes full mating constraints and collision envelopes.
          </div>
        </div>

        <button
          type="button"
          onClick={onDownloadCad}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#155EEF] text-white text-xs font-mono font-bold transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Download size={14} />
          <span>Download CAD (.STEP)</span>
        </button>
      </div>
    </div>
  );
}
