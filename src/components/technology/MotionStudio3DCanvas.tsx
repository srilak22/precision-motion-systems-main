import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Sparkles, Eye } from "lucide-react";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type StudioPreset = "dual-welding" | "cnc-tending" | "pick-place";

interface MotionStudio3DCanvasProps {
  preset: StudioPreset;
  railOffset: number; // -1 to 1
  tableAngle: number; // degrees
  j2Offset: number; // degrees
  j3Offset: number; // degrees
  showEnvelope: boolean;
  showTrails: boolean;
  speed: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

function rotatePoint(p: Vec3, yaw: number, pitch: number): Vec3 {
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  const x1 = p.x * cosY - p.z * sinY;
  const z1 = p.x * sinY + p.z * cosY;
  const y2 = p.y * cosP - z1 * sinP;
  const z2 = p.y * sinP + z1 * cosP;

  return { x: x1, y: y2, z: z2 };
}

export function MotionStudio3DCanvas({
  preset,
  railOffset,
  tableAngle,
  j2Offset,
  j3Offset,
  showEnvelope,
  showTrails,
  speed,
  isPlaying,
  onTogglePlay,
}: MotionStudio3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [yaw, setYaw] = useState(-0.62);
  const [pitch, setPitch] = useState(0.44);
  const [zoom, setZoom] = useState(1.05);
  const timeRef = useRef(0);
  const trail1Ref = useRef<Vec3[]>([]);
  const trail2Ref = useRef<Vec3[]>([]);
  const dragRef = useRef<{ active: boolean; x: number; y: number; yaw: number; pitch: number }>({
    active: false,
    x: 0,
    y: 0,
    yaw: -0.62,
    pitch: 0.44,
  });

  useEffect(() => {
    trail1Ref.current = [];
    trail2Ref.current = [];
  }, [preset]);

  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (isPlaying) {
        timeRef.current += dt * speed;
        if (!dragRef.current.active) {
          setYaw((prev) => prev + dt * 0.08 * speed);
        }
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        rafId = requestAnimationFrame(render);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Rich radial studio backdrop
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75,
      );
      bgGrad.addColorStop(0, "#111C33");
      bgGrad.addColorStop(0.55, "#090F1E");
      bgGrad.addColorStop(1, "#050811");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const project = (p: Vec3) => {
        const shifted = { x: p.x, y: p.y - 0.55, z: p.z };
        const r = rotatePoint(shifted, yaw, pitch);
        const camDist = 6.2 / zoom;
        const denom = Math.max(0.6, camDist - r.z);
        const fov = Math.min(width, height) * 1.18;
        const scale = fov / denom;
        return {
          x: width * 0.5 + r.x * scale,
          y: height * 0.54 - r.y * scale,
          depth: r.z,
          scale,
        };
      };

      const drawSeg = (a: Vec3, b: Vec3, color: string, lw: number, glow = false, dashed = false) => {
        const pa = project(a);
        const pb = project(b);
        ctx.save();
        ctx.beginPath();
        if (dashed) ctx.setLineDash([5, 4]);
        if (glow) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
        }
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
      };

      // 1. 3D Perspective Floor Grid
      for (let gx = -2.5; gx <= 2.5; gx += 0.5) {
        const alpha = gx === 0 ? 0.35 : 0.14;
        drawSeg({ x: gx, y: 0, z: -2.0 }, { x: gx, y: 0, z: 2.0 }, `rgba(56, 189, 248, ${alpha})`, 1);
      }
      for (let gz = -2.0; gz <= 2.0; gz += 0.5) {
        const alpha = gz === 0 ? 0.35 : 0.14;
        drawSeg({ x: -2.5, y: 0, z: gz }, { x: 2.5, y: 0, z: gz }, `rgba(56, 189, 248, ${alpha})`, 1);
      }

      // 2. 7th-Axis Linear Rail Track (E1)
      drawSeg({ x: -2.0, y: 0.06, z: -0.95 }, { x: 2.0, y: 0.06, z: -0.95 }, "#334155", 8);
      drawSeg({ x: -2.0, y: 0.06, z: -0.75 }, { x: 2.0, y: 0.06, z: -0.75 }, "#334155", 8);
      drawSeg({ x: -2.0, y: 0.08, z: -0.85 }, { x: 2.0, y: 0.08, z: -0.85 }, "#155EEF", 2, true);

      // 3. Central Rotating Workpiece Fixture / Index Table (Axis A)
      const tRad = (tableAngle * Math.PI) / 180 + (isPlaying ? timeRef.current * 0.25 : 0);
      const tablePts = 28;
      for (let i = 0; i < tablePts; i++) {
        const a1 = (i / tablePts) * Math.PI * 2;
        const a2 = ((i + 1) / tablePts) * Math.PI * 2;
        drawSeg(
          { x: Math.cos(a1) * 0.65, y: 0.22, z: Math.sin(a1) * 0.65 + 0.35 },
          { x: Math.cos(a2) * 0.65, y: 0.22, z: Math.sin(a2) * 0.65 + 0.35 },
          "rgba(56, 189, 248, 0.55)",
          2,
        );
      }
      // Rotating workpiece frame on table
      const wHalf = 0.36;
      const wCorners: Vec3[] = [
        { x: -wHalf, y: 0.24, z: -wHalf * 0.7 },
        { x: wHalf, y: 0.24, z: -wHalf * 0.7 },
        { x: wHalf, y: 0.24, z: wHalf * 0.7 },
        { x: -wHalf, y: 0.24, z: wHalf * 0.7 },
      ].map((c) => ({
        x: c.x * Math.cos(tRad) - c.z * Math.sin(tRad),
        y: c.y,
        z: c.x * Math.sin(tRad) + c.z * Math.cos(tRad) + 0.35,
      }));
      for (let i = 0; i < 4; i++) {
        const a = wCorners[i];
        const b = wCorners[(i + 1) % 4];
        drawSeg(a, b, "#22D3EE", 2, true);
        drawSeg(
          { x: a.x, y: a.y + 0.32, z: a.z },
          { x: b.x, y: b.y + 0.32, z: b.z },
          "#38BDF8",
          2,
        );
        drawSeg(a, { x: a.x, y: a.y + 0.32, z: a.z }, "rgba(56, 189, 248, 0.5)", 1.5);
      }

      // 4. Helper to draw a 6-axis articulated robot arm with kinematics & glow
      const drawRobot = (
        baseX: number,
        baseZ: number,
        phase: number,
        accent: string,
        trailStore: React.MutableRefObject<Vec3[]>,
      ) => {
        const t = timeRef.current + phase;
        const j1 = Math.sin(t * 0.9) * 0.55;
        const j2 = 0.45 + (j2Offset * Math.PI) / 180 + Math.sin(t * 1.4) * 0.22;
        const j3 = -0.65 + (j3Offset * Math.PI) / 180 + Math.cos(t * 1.4) * 0.25;

        const base: Vec3 = { x: baseX, y: 0.08, z: baseZ };
        const shoulder: Vec3 = { x: baseX, y: 0.58, z: baseZ };

        const L1 = 0.85;
        const L2 = 0.75;
        const L3 = 0.26;

        const elbow: Vec3 = {
          x: shoulder.x + Math.sin(j1) * Math.cos(j2) * L1,
          y: shoulder.y + Math.sin(j2) * L1 + 0.35,
          z: shoulder.z + Math.cos(j1) * Math.cos(j2) * L1,
        };

        const wrist: Vec3 = {
          x: elbow.x + Math.sin(j1) * Math.cos(j2 + j3) * L2,
          y: elbow.y + Math.sin(j2 + j3) * L2,
          z: elbow.z + Math.cos(j1) * Math.cos(j2 + j3) * L2,
        };

        const tcp: Vec3 = {
          x: wrist.x + Math.sin(j1) * L3 * 0.6,
          y: wrist.y - L3,
          z: wrist.z + Math.cos(j1) * L3 * 0.6,
        };

        // Optional 3D Reach Envelope Rings
        if (showEnvelope) {
          const envR = 1.35;
          const segs = 30;
          for (let i = 0; i < segs; i++) {
            const a1 = (i / segs) * Math.PI * 2;
            const a2 = ((i + 1) / segs) * Math.PI * 2;
            drawSeg(
              { x: baseX + Math.cos(a1) * envR, y: 0.04, z: baseZ + Math.sin(a1) * envR },
              { x: baseX + Math.cos(a2) * envR, y: 0.04, z: baseZ + Math.sin(a2) * envR },
              "rgba(21, 94, 239, 0.25)",
              1,
              false,
              true,
            );
          }
        }

        // Links with metallic industrial contrast
        drawSeg(base, shoulder, "#475569", 14);
        drawSeg(shoulder, elbow, "#F1F5F9", 11);
        drawSeg(elbow, wrist, "#CBD5E1", 8);
        drawSeg(wrist, tcp, accent, 4, true);

        // Joints
        const jointList = [
          { p: base, r: 9 },
          { p: shoulder, r: 8 },
          { p: elbow, r: 6.5 },
          { p: wrist, r: 5 },
        ];
        for (const j of jointList) {
          const pj = project(j.p);
          ctx.save();
          ctx.beginPath();
          ctx.arc(pj.x, pj.y, j.r, 0, Math.PI * 2);
          ctx.fillStyle = "#0B1324";
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = accent;
          ctx.shadowColor = accent;
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.restore();
        }

        // TCP Laser / Spark Glow
        const pTcp = project(tcp);
        ctx.save();
        ctx.beginPath();
        ctx.arc(pTcp.x, pTcp.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = accent;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();

        // Update & draw glowing 3D TCP motion trail
        if (showTrails) {
          if (isPlaying) {
            trailStore.current.push(tcp);
            if (trailStore.current.length > 36) trailStore.current.shift();
          }
          const pts = trailStore.current;
          for (let i = 1; i < pts.length; i++) {
            const alpha = i / pts.length;
            drawSeg(pts[i - 1], pts[i], accent, 2.2 * alpha, true);
          }
        }
      };

      if (preset === "dual-welding") {
        drawRobot(-0.95 + railOffset * 0.45, -0.85, 0, "#22D3EE", trail1Ref);
        drawRobot(0.95 + railOffset * 0.45, -0.85, Math.PI * 0.65, "#38BDF8", trail2Ref);
      } else if (preset === "cnc-tending") {
        drawRobot(railOffset * 0.75, -0.85, 0, "#38BDF8", trail1Ref);
      } else {
        drawRobot(-0.55 + railOffset * 0.4, -0.85, 0, "#34D399", trail1Ref);
        drawRobot(0.55 + railOffset * 0.4, -0.85, 1.4, "#22D3EE", trail2Ref);
      }

      ctx.restore();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [preset, railOffset, tableAngle, j2Offset, j3Offset, showEnvelope, showTrails, speed, isPlaying, yaw, pitch, zoom]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = { active: true, x: e.clientX, y: e.clientY, yaw, pitch };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setYaw(dragRef.current.yaw + dx * 0.008);
    setPitch(Math.max(0.08, Math.min(1.25, dragRef.current.pitch + dy * 0.008)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current.active = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-[#050811]">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={(e) => {
          e.preventDefault();
          setZoom((z) => Math.max(0.65, Math.min(1.85, z - e.deltaY * 0.001)));
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Top Left Minimal Status Pill */}
      <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/75 px-3 py-1.5 backdrop-blur-md text-[11px] font-mono text-slate-200">
        <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>LIVE 3D KINEMATICS · 1 kHz</span>
      </div>

      {/* Top Right Play/Pause & Camera Presets */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-950/80 p-1.5 backdrop-blur-md text-[11px] font-mono text-slate-200">
        <button
          type="button"
          onClick={onTogglePlay}
          className="inline-flex items-center gap-1 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] px-2.5 py-1 font-bold text-white cursor-pointer"
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setYaw(-0.62);
            setPitch(0.44);
            setZoom(1.05);
          }}
          className="rounded-lg px-2 py-1 hover:bg-white/10 cursor-pointer"
        >
          3D Iso
        </button>
        <button
          type="button"
          onClick={() => {
            setYaw(0);
            setPitch(1.22);
          }}
          className="rounded-lg px-2 py-1 hover:bg-white/10 cursor-pointer"
        >
          Top
        </button>
        <button
          type="button"
          onClick={() => {
            setYaw(0);
            setPitch(0.14);
          }}
          className="rounded-lg px-2 py-1 hover:bg-white/10 cursor-pointer"
        >
          Front
        </button>
        <button
          type="button"
          onClick={() => {
            setYaw(-0.62);
            setPitch(0.44);
            setZoom(1.05);
          }}
          className="p-1.5 rounded-lg hover:bg-white/10 text-cyan-300 cursor-pointer"
          title="Reset Camera"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2 text-[11px] font-mono text-slate-400">
        <Eye size={12} className="text-cyan-400" />
        <span>Drag to orbit 360° · Scroll to zoom</span>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-4 hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
        <Sparkles size={12} />
        <span>7th-Axis E1 + Rotary Table A</span>
      </div>
    </div>
  );
}
