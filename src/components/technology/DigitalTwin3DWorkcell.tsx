import React, { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface DigitalTwin3DWorkcellProps {
  isStreaming: boolean;
  selectedAxisIndex: number; // 0..5 for J1..J6
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

export function DigitalTwin3DWorkcell({
  isStreaming,
  selectedAxisIndex,
}: DigitalTwin3DWorkcellProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [yaw, setYaw] = useState(-0.65);
  const [pitch, setPitch] = useState(0.45);
  const [zoom, setZoom] = useState(1.0);
  const timeRef = useRef(0);
  const dragRef = useRef<{ active: boolean; x: number; y: number; yaw: number; pitch: number }>({
    active: false,
    x: 0,
    y: 0,
    yaw: -0.65,
    pitch: 0.45,
  });

  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (isStreaming) {
        timeRef.current += dt;
        if (!dragRef.current.active) {
          setYaw((prev) => prev + dt * 0.06);
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

      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75,
      );
      bgGrad.addColorStop(0, "#101B33");
      bgGrad.addColorStop(0.6, "#080E1D");
      bgGrad.addColorStop(1, "#050811");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const project = (p: Vec3) => {
        const shifted = { x: p.x, y: p.y - 0.5, z: p.z };
        const r = rotatePoint(shifted, yaw, pitch);
        const camDist = 6.2 / zoom;
        const denom = Math.max(0.6, camDist - r.z);
        const fov = Math.min(width, height) * 1.15;
        const scale = fov / denom;
        return {
          x: width * 0.5 + r.x * scale,
          y: height * 0.55 - r.y * scale,
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
          ctx.shadowBlur = 10;
        }
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
      };

      const drawBox3D = (cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, stroke: string) => {
        const hx = sx / 2;
        const hy = sy / 2;
        const hz = sz / 2;
        const edges: [Vec3, Vec3][] = [
          [{ x: cx - hx, y: cy - hy, z: cz - hz }, { x: cx + hx, y: cy - hy, z: cz - hz }],
          [{ x: cx + hx, y: cy - hy, z: cz - hz }, { x: cx + hx, y: cy - hy, z: cz + hz }],
          [{ x: cx + hx, y: cy - hy, z: cz + hz }, { x: cx - hx, y: cy - hy, z: cz + hz }],
          [{ x: cx - hx, y: cy - hy, z: cz + hz }, { x: cx - hx, y: cy - hy, z: cz - hz }],
          [{ x: cx - hx, y: cy + hy, z: cz - hz }, { x: cx + hx, y: cy + hy, z: cz - hz }],
          [{ x: cx + hx, y: cy + hy, z: cz - hz }, { x: cx + hx, y: cy + hy, z: cz + hz }],
          [{ x: cx + hx, y: cy + hy, z: cz + hz }, { x: cx - hx, y: cy + hy, z: cz + hz }],
          [{ x: cx - hx, y: cy + hy, z: cz + hz }, { x: cx - hx, y: cy + hy, z: cz - hz }],
          [{ x: cx - hx, y: cy - hy, z: cz - hz }, { x: cx - hx, y: cy + hy, z: cz - hz }],
          [{ x: cx + hx, y: cy - hy, z: cz - hz }, { x: cx + hx, y: cy + hy, z: cz - hz }],
          [{ x: cx + hx, y: cy - hy, z: cz + hz }, { x: cx + hx, y: cy + hy, z: cz + hz }],
          [{ x: cx - hx, y: cy - hy, z: cz + hz }, { x: cx - hx, y: cy + hy, z: cz + hz }],
        ];
        edges.forEach(([a, b]) => drawSeg(a, b, stroke, 1.5));
      };

      // 1. 3D Floor Grid
      for (let gx = -2.0; gx <= 2.0; gx += 0.5) {
        drawSeg({ x: gx, y: 0, z: -1.5 }, { x: gx, y: 0, z: 1.5 }, "rgba(56, 189, 248, 0.14)", 1);
      }
      for (let gz = -1.5; gz <= 1.5; gz += 0.5) {
        drawSeg({ x: -2.0, y: 0, z: gz }, { x: 2.0, y: 0, z: gz }, "rgba(56, 189, 248, 0.14)", 1);
      }

      // 2. 3D Safety Fence Perimeter
      const fW = 1.9;
      const fD = 1.35;
      const fH = 0.65;
      const fencePosts: Vec3[] = [
        { x: -fW, y: 0, z: -fD },
        { x: fW, y: 0, z: -fD },
        { x: fW, y: 0, z: fD },
        { x: -fW, y: 0, z: fD },
      ];
      for (let i = 0; i < 4; i++) {
        const a = fencePosts[i];
        const b = fencePosts[(i + 1) % 4];
        drawSeg(a, { x: a.x, y: fH, z: a.z }, "rgba(148, 163, 184, 0.45)", 2);
        drawSeg({ x: a.x, y: fH, z: a.z }, { x: b.x, y: fH, z: b.z }, "rgba(148, 163, 184, 0.35)", 1.5, false, true);
      }

      // 3. Laser Safety Scanner Arc
      const scanSegs = 28;
      for (let i = 0; i < scanSegs; i++) {
        const a1 = (i / scanSegs) * Math.PI * 2;
        const a2 = ((i + 1) / scanSegs) * Math.PI * 2;
        drawSeg(
          { x: Math.cos(a1) * 1.15, y: 0.03, z: Math.sin(a1) * 1.15 },
          { x: Math.cos(a2) * 1.15, y: 0.03, z: Math.sin(a2) * 1.15 },
          "rgba(34, 211, 238, 0.38)",
          1.2,
          false,
          true,
        );
      }

      // 4. Pallet Staging Boxes (3D wireframes with vibrant industrial colors)
      drawBox3D(-1.15, 0.15, 0.35, 0.42, 0.3, 0.35, "#F59E0B");
      drawBox3D(-0.68, 0.15, 0.35, 0.42, 0.3, 0.35, "#3B82F6");
      drawBox3D(-1.15, 0.15, -0.1, 0.42, 0.3, 0.35, "#10B981");
      drawBox3D(-0.9, 0.46, 0.15, 0.42, 0.3, 0.35, "#A855F7");

      // 5. Animated 6-Axis Palletizing Robot Arm
      const t = timeRef.current;
      const j1 = Math.sin(t * 0.85) * 0.85;
      const j2 = 0.52 + Math.sin(t * 1.7) * 0.2;
      const j3 = -0.68 + Math.cos(t * 1.7) * 0.22;

      const j1Pos: Vec3 = { x: 0.35, y: 0.08, z: 0 };
      const j2Pos: Vec3 = { x: 0.35, y: 0.56, z: 0 };
      const L1 = 0.85;
      const L2 = 0.72;
      const j3Pos: Vec3 = {
        x: j2Pos.x + Math.sin(j1) * Math.cos(j2) * L1,
        y: j2Pos.y + Math.sin(j2) * L1 + 0.32,
        z: j2Pos.z + Math.cos(j1) * Math.cos(j2) * L1,
      };
      const j4Pos: Vec3 = {
        x: (j3Pos.x + j2Pos.x) * 0.5 + Math.sin(j1) * 0.15,
        y: (j3Pos.y + j2Pos.y) * 0.5 + 0.1,
        z: (j3Pos.z + j2Pos.z) * 0.5 + Math.cos(j1) * 0.15,
      };
      const j5Pos: Vec3 = {
        x: j3Pos.x + Math.sin(j1) * Math.cos(j2 + j3) * L2,
        y: j3Pos.y + Math.sin(j2 + j3) * L2,
        z: j3Pos.z + Math.cos(j1) * Math.cos(j2 + j3) * L2,
      };
      const j6Pos: Vec3 = {
        x: j5Pos.x,
        y: j5Pos.y - 0.24,
        z: j5Pos.z,
      };

      drawSeg({ x: 0.35, y: 0, z: 0 }, j2Pos, "#475569", 15);
      drawSeg(j2Pos, j3Pos, "#FACC15", 11);
      drawSeg(j3Pos, j5Pos, "#FDE047", 8);
      drawSeg(j5Pos, j6Pos, "#22D3EE", 4.5, true);

      // Held payload box on end effector
      drawBox3D(j6Pos.x, j6Pos.y - 0.14, j6Pos.z, 0.28, 0.22, 0.28, "#10B981");

      // Joints (highlight the user-selected axis J1..J6!)
      const jointNodes = [j1Pos, j2Pos, j3Pos, j4Pos, j5Pos, j6Pos];
      jointNodes.forEach((pos, idx) => {
        const pj = project(pos);
        const isSelected = idx === selectedAxisIndex;
        ctx.save();
        ctx.beginPath();
        ctx.arc(pj.x, pj.y, isSelected ? 10 : 6.5, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#155EEF" : "#0B1324";
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeStyle = isSelected ? "#22D3EE" : "#38BDF8";
        if (isSelected) {
          ctx.shadowColor = "#22D3EE";
          ctx.shadowBlur = 16;
        }
        ctx.stroke();
        ctx.restore();
      });

      ctx.restore();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [isStreaming, selectedAxisIndex, yaw, pitch, zoom]);

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
    <div className="relative w-full h-[320px] sm:h-[360px] rounded-xl overflow-hidden bg-[#050811] border border-slate-800">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={(e) => {
          e.preventDefault();
          setZoom((z) => Math.max(0.65, Math.min(1.8, z - e.deltaY * 0.001)));
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-lg border border-white/15 bg-slate-950/80 p-1 backdrop-blur-xs text-[10px] font-mono text-slate-200">
        <button
          type="button"
          onClick={() => {
            setYaw(-0.65);
            setPitch(0.45);
            setZoom(1.0);
          }}
          className="px-2 py-0.5 rounded hover:bg-white/10 cursor-pointer"
        >
          3D Iso
        </button>
        <button
          type="button"
          onClick={() => {
            setYaw(0);
            setPitch(1.22);
          }}
          className="px-2 py-0.5 rounded hover:bg-white/10 cursor-pointer"
        >
          Top
        </button>
        <button
          type="button"
          onClick={() => {
            setYaw(-0.65);
            setPitch(0.45);
            setZoom(1.0);
          }}
          className="p-1 rounded hover:bg-white/10 text-cyan-300 cursor-pointer"
          title="Reset 3D View"
        >
          <RotateCcw size={11} />
        </button>
      </div>

      <span className="pointer-events-none absolute bottom-2.5 left-3 text-[10px] font-mono text-slate-400">
        Drag to orbit 360° · Scroll to zoom
      </span>
    </div>
  );
}
