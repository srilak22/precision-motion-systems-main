import React, { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface PointCloud3DViewportProps {
  progress: number;
  isSimulating: boolean;
}

// Generate deterministic 3D point cloud for the structural subframe workpiece
function generateWorkpiecePointCloud(): { pos: Vec3; color: string }[] {
  const points: { pos: Vec3; color: string }[] = [];
  // Subframe box centered at (x: 1.4, y: 0.45, z: 0) with size (1.6, 0.9, 1.0)
  const cx = 1.35;
  const cy = 0.45;
  const cz = 0;
  const hx = 0.8;
  const hy = 0.45;
  const hz = 0.5;

  // Pseudo-random deterministic generator
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  // Top surface & edges (dense structured-light scan)
  for (let i = 0; i < 420; i++) {
    const x = cx + (rand() * 2 - 1) * hx;
    const z = cz + (rand() * 2 - 1) * hz;
    const y = cy + hy + (rand() - 0.5) * 0.025;
    points.push({ pos: { x, y, z }, color: "#38BDF8" });
  }

  // Front & back faces
  for (let i = 0; i < 360; i++) {
    const x = cx + (rand() * 2 - 1) * hx;
    const y = cy + (rand() * 2 - 1) * hy;
    const z = cz + (i % 2 === 0 ? hz : -hz) + (rand() - 0.5) * 0.02;
    points.push({ pos: { x, y, z }, color: i % 2 === 0 ? "#60A5FA" : "#1D4ED8" });
  }

  // Side faces
  for (let i = 0; i < 260; i++) {
    const x = cx + (i % 2 === 0 ? hx : -hx) + (rand() - 0.5) * 0.02;
    const y = cy + (rand() * 2 - 1) * hy;
    const z = cz + (rand() * 2 - 1) * hz;
    points.push({ pos: { x, y, z }, color: "#3B82F6" });
  }

  // Internal rib / structural pocket highlights
  for (let i = 0; i < 160; i++) {
    const x = cx + (rand() - 0.5) * 0.1;
    const y = cy + (rand() * 2 - 1) * hy;
    const z = cz + (rand() * 2 - 1) * hz;
    points.push({ pos: { x, y, z }, color: "#22D3EE" });
  }

  return points;
}

const WORKPIECE_POINTS = generateWorkpiecePointCloud();

function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

function bezier3(p0: Vec3, p1: Vec3, p2: Vec3, t: number): Vec3 {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    z: u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z,
  };
}

export function PointCloud3DViewport({ progress, isSimulating }: PointCloud3DViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [yaw, setYaw] = useState<number>(-0.55);
  const [pitch, setPitch] = useState<number>(0.42);
  const [zoom, setZoom] = useState<number>(1.0);
  const dragRef = useRef<{ active: boolean; x: number; y: number; yaw: number; pitch: number }>({
    active: false,
    x: 0,
    y: 0,
    yaw: -0.55,
    pitch: 0.42,
  });

  // Gentle auto-orbit when simulating and not dragging
  useEffect(() => {
    if (!isSimulating) return;
    const id = setInterval(() => {
      if (!dragRef.current.active) {
        setYaw((prev) => prev + 0.003);
      }
    }, 30);
    return () => clearInterval(id);
  }, [isSimulating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    const project = (p: Vec3): { x: number; y: number; depth: number; scale: number } => {
      // Shift world center slightly so robot + workpiece are centered
      const wx = p.x - 0.35;
      const wy = p.y - 0.55;
      const wz = p.z;

      // Rotate around Y (yaw)
      const x1 = wx * cosY - wz * sinY;
      const z1 = wx * sinY + wz * cosY;

      // Rotate around X (pitch)
      const y2 = wy * cosP - z1 * sinP;
      const z2 = wy * sinP + z1 * cosP;

      const camDist = 5.4 / zoom;
      const denom = Math.max(0.5, camDist - z2);
      const fov = Math.min(width, height) * 1.15;
      const scale = fov / denom;

      return {
        x: width * 0.5 + x1 * scale,
        y: height * 0.54 - y2 * scale,
        depth: z2,
        scale,
      };
    };

    const drawLine3D = (a: Vec3, b: Vec3, color: string, lineWidth = 1, dashed = false) => {
      const pa = project(a);
      const pb = project(b);
      ctx.save();
      ctx.beginPath();
      if (dashed) ctx.setLineDash([5, 4]);
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    };

    // 1. 3D Floor Coordinate Grid
    for (let gx = -2.0; gx <= 3.0; gx += 0.5) {
      drawLine3D({ x: gx, y: 0, z: -2.0 }, { x: gx, y: 0, z: 2.0 }, "rgba(59, 130, 246, 0.16)", 1);
    }
    for (let gz = -2.0; gz <= 2.0; gz += 0.5) {
      drawLine3D({ x: -2.0, y: 0, z: gz }, { x: 3.0, y: 0, z: gz }, "rgba(59, 130, 246, 0.16)", 1);
    }

    // 3D Origin Triad (X, Y, Z)
    drawLine3D({ x: -1.6, y: 0.02, z: 1.4 }, { x: -1.2, y: 0.02, z: 1.4 }, "#EF4444", 2);
    drawLine3D({ x: -1.6, y: 0.02, z: 1.4 }, { x: -1.6, y: 0.42, z: 1.4 }, "#10B981", 2);
    drawLine3D({ x: -1.6, y: 0.02, z: 1.4 }, { x: -1.6, y: 0.02, z: 1.8 }, "#3B82F6", 2);

    // 2. Workpiece Wireframe Bounding Box
    const bx0 = 0.55;
    const bx1 = 2.15;
    const by0 = 0.0;
    const by1 = 0.9;
    const bz0 = -0.5;
    const bz1 = 0.5;
    const boxEdges: [Vec3, Vec3][] = [
      [{ x: bx0, y: by0, z: bz0 }, { x: bx1, y: by0, z: bz0 }],
      [{ x: bx1, y: by0, z: bz0 }, { x: bx1, y: by0, z: bz1 }],
      [{ x: bx1, y: by0, z: bz1 }, { x: bx0, y: by0, z: bz1 }],
      [{ x: bx0, y: by0, z: bz1 }, { x: bx0, y: by0, z: bz0 }],
      [{ x: bx0, y: by1, z: bz0 }, { x: bx1, y: by1, z: bz0 }],
      [{ x: bx1, y: by1, z: bz0 }, { x: bx1, y: by1, z: bz1 }],
      [{ x: bx1, y: by1, z: bz1 }, { x: bx0, y: by1, z: bz1 }],
      [{ x: bx0, y: by1, z: bz1 }, { x: bx0, y: by1, z: bz0 }],
      [{ x: bx0, y: by0, z: bz0 }, { x: bx0, y: by1, z: bz0 }],
      [{ x: bx1, y: by0, z: bz0 }, { x: bx1, y: by1, z: bz0 }],
      [{ x: bx1, y: by0, z: bz1 }, { x: bx1, y: by1, z: bz1 }],
      [{ x: bx0, y: by0, z: bz1 }, { x: bx0, y: by1, z: bz1 }],
    ];
    boxEdges.forEach(([a, b]) => drawLine3D(a, b, "rgba(148, 163, 184, 0.28)", 1));

    // 3. Depth-Sorted 3D Point Cloud
    const projectedPoints = WORKPIECE_POINTS.map((pt) => {
      const p = project(pt.pos);
      return { ...p, color: pt.color };
    }).sort((a, b) => a.depth - b.depth);

    for (const pt of projectedPoints) {
      const r = Math.max(1.1, Math.min(2.6, pt.scale * 0.0052));
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = 0.78;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 4. 3D Planned & Executed Trajectory Curve
    const tNorm = Math.max(0, Math.min(1, (progress - 20) / 78));
    const trajStart: Vec3 = { x: -0.25, y: 1.55, z: -0.35 };
    const trajCtrl: Vec3 = { x: 0.65, y: 1.95, z: 0.25 };
    const trajTarget: Vec3 = { x: 1.35, y: 0.92, z: 0.08 };

    // Full planned trajectory (dashed emerald)
    const steps = 32;
    for (let i = 0; i < steps; i++) {
      const pA = bezier3(trajStart, trajCtrl, trajTarget, i / steps);
      const pB = bezier3(trajStart, trajCtrl, trajTarget, (i + 1) / steps);
      drawLine3D(pA, pB, "rgba(16, 185, 129, 0.65)", 2, true);
    }

    // Executed trajectory up to tNorm (solid amber)
    const execSteps = Math.max(1, Math.floor(steps * tNorm));
    for (let i = 0; i < execSteps; i++) {
      const pA = bezier3(trajStart, trajCtrl, trajTarget, i / steps);
      const pB = bezier3(trajStart, trajCtrl, trajTarget, (i + 1) / steps);
      drawLine3D(pA, pB, "#F59E0B", 3, false);
    }

    // 5. 3D Articulated 6-Axis Robot Arm
    const toolTip = bezier3(trajStart, trajCtrl, trajTarget, tNorm);
    const basePos: Vec3 = { x: -1.15, y: 0.0, z: 0.0 };
    const shoulderPos: Vec3 = { x: -1.05, y: 0.65, z: 0.0 };
    const wristPos: Vec3 = { x: toolTip.x - 0.16, y: toolTip.y + 0.26, z: toolTip.z };
    const elbowPos: Vec3 = lerp3(shoulderPos, wristPos, 0.5);
    elbowPos.y += 0.52;
    elbowPos.z -= 0.15;

    // Robot links
    drawLine3D(basePos, shoulderPos, "#475569", 12);
    drawLine3D(shoulderPos, elbowPos, "#E2E8F0", 10);
    drawLine3D(elbowPos, wristPos, "#CBD5E1", 8);
    drawLine3D(wristPos, toolTip, "#22D3EE", 4.5);

    // Robot joints
    const joints: { pos: Vec3; r: number; stroke: string }[] = [
      { pos: basePos, r: 9, stroke: "#3B82F6" },
      { pos: shoulderPos, r: 7.5, stroke: "#3B82F6" },
      { pos: elbowPos, r: 6.5, stroke: "#3B82F6" },
      { pos: wristPos, r: 5, stroke: "#22D3EE" },
    ];
    for (const j of joints) {
      const pj = project(j.pos);
      ctx.beginPath();
      ctx.arc(pj.x, pj.y, j.r, 0, Math.PI * 2);
      ctx.fillStyle = "#0F172A";
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = j.stroke;
      ctx.stroke();
    }

    // Active tool tip & target marker
    const pTip = project(toolTip);
    ctx.beginPath();
    ctx.arc(pTip.x, pTip.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#22D3EE";
    ctx.fill();

    const pTarget = project(trajTarget);
    ctx.beginPath();
    ctx.arc(pTarget.x, pTarget.y, 7, 0, Math.PI * 2);
    ctx.strokeStyle = "#F43F5E";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pTarget.x, pTarget.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#F43F5E";
    ctx.fill();

    ctx.font = "bold 11px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillStyle = "#FDA4AF";
    ctx.fillText("Target [X: 420.2, Y: 110.5, Z: 18.0]", pTarget.x + 12, pTarget.y + 4);

    ctx.restore();
  }, [yaw, pitch, zoom, progress]);

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

  const resetCamera = () => {
    setYaw(-0.55);
    setPitch(0.42);
    setZoom(1.0);
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[340px]">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={(e) => {
          e.preventDefault();
          setZoom((z) => Math.max(0.65, Math.min(1.75, z - e.deltaY * 0.001)));
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Camera View Controls */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg border border-white/15 bg-slate-950/80 px-2 py-1 backdrop-blur-xs text-[10px] font-mono text-slate-300">
        <button
          type="button"
          onClick={() => {
            setYaw(-0.55);
            setPitch(0.42);
          }}
          className="px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer"
        >
          3D Iso
        </button>
        <button
          type="button"
          onClick={() => {
            setYaw(0);
            setPitch(1.22);
          }}
          className="px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer"
        >
          Top
        </button>
        <button
          type="button"
          onClick={() => {
            setYaw(0);
            setPitch(0.15);
          }}
          className="px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer"
        >
          Front
        </button>
        <button
          type="button"
          onClick={resetCamera}
          className="p-1 rounded hover:bg-white/10 text-cyan-300 cursor-pointer"
          title="Reset 3D Camera"
        >
          <RotateCcw size={11} />
        </button>
      </div>

      <span className="pointer-events-none absolute bottom-2 left-2 text-[10px] font-mono text-slate-400">
        Drag to orbit 3D · Scroll to zoom
      </span>
    </div>
  );
}
