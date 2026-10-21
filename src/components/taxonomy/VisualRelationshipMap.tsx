import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Info, Layers, Cpu, Briefcase, Move3d, CheckCircle2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapNode {
  id: string;
  label: string;
  type: "robot" | "mobility" | "component" | "application";
  x: number;
  y: number;
  description: string;
  categoryTag: string;
  catalogHref?: string;
  appHref?: string;
}

interface MapEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  category: "component" | "application" | "mobility";
  status: "verified compatibility" | "general engineering relevance";
}

const NODES: MapNode[] = [
  // 1. Robot Architecture Nodes (Center-Left Column, x: 260)
  {
    id: "r-humanoid",
    label: "Bipedal Humanoid",
    type: "robot",
    x: 270,
    y: 70,
    categoryTag: "01. Humanoid",
    description: "Anthropomorphic 32+ DoF bipedal robot with whole-body dynamic balance and bi-manual manipulation.",
  },
  {
    id: "r-articulated",
    label: "6-Axis Industrial Arm",
    type: "robot",
    x: 270,
    y: 160,
    categoryTag: "02. Industrial",
    description: "High-rigidity serial revolute manipulator for automotive spot welding and precision handling.",
  },
  {
    id: "r-amr",
    label: "Warehouse AMR",
    type: "robot",
    x: 270,
    y: 250,
    categoryTag: "03. Mobile Driverless",
    description: "LiDAR SLAM natural feature navigation mobile transport platform with VDA 5050 fleet interface.",
  },
  {
    id: "r-quadruped",
    label: "Quadruped UGV Mule",
    type: "robot",
    x: 270,
    y: 340,
    categoryTag: "04. Legged / UGVs",
    description: "Dynamic 4-legged walking robot traversing stairs, gravel, and ATEX petrochemical facilities.",
  },
  {
    id: "r-drone",
    label: "Confined-Space Drone",
    type: "robot",
    x: 270,
    y: 430,
    categoryTag: "05. Aerial",
    description: "Cage-protected multirotor for GPS-denied boiler and tank inspections with 3D LiDAR point clouds.",
  },
  {
    id: "r-rov",
    label: "Subsea Work-Class ROV",
    type: "robot",
    x: 270,
    y: 520,
    categoryTag: "06. Underwater",
    description: "150 kW deep-sea intervention vehicle with dual hydraulic manipulators and 3,000m depth rating.",
  },
  {
    id: "r-asrs",
    label: "AS/RS Cube Grid",
    type: "robot",
    x: 270,
    y: 610,
    categoryTag: "07. Logistics",
    description: "Ultra-dense modular automated tote retrieval cube framework with autonomous rail shuttles.",
  },
  {
    id: "r-surgical",
    label: "Robotic Surgical System",
    type: "robot",
    x: 270,
    y: 700,
    categoryTag: "08. Specialised",
    description: "Master-slave teleoperated surgical platform with tremor-filtered micro-articulated EndoWrists.",
  },

  // 2. Mobility & Locomotion (Left Column, x: 60)
  {
    id: "m-legged",
    label: "Dynamic Legged Gait",
    type: "mobility",
    x: 70,
    y: 180,
    categoryTag: "Mobility",
    description: "Dynamic whole-body balancing and ground-reaction force control across unstructured obstacles.",
  },
  {
    id: "m-stationary",
    label: "Fixed Workcell Base",
    type: "mobility",
    x: 70,
    y: 300,
    categoryTag: "Mobility",
    description: "High-stiffness floor pedestal or linear 7th axis rail mounting for continuous repeatability.",
  },
  {
    id: "m-diff-drive",
    label: "Differential Wheel Drive",
    type: "mobility",
    x: 70,
    y: 420,
    categoryTag: "Mobility",
    description: "Independent left/right drive wheels delivering zero-radius turning on smooth industrial concrete.",
  },
  {
    id: "m-vectored-thruster",
    label: "Vectored Subsea Thruster",
    type: "mobility",
    x: 70,
    y: 580,
    categoryTag: "Mobility",
    description: "Multi-axis marine thruster configuration delivering 6-DoF station-keeping against ocean currents.",
  },

  // 3. Components & Drivetrain (Center-Right Column, x: 570)
  {
    id: "c-strain-wave",
    label: "Strain-Wave Harmonic Reducer",
    type: "component",
    x: 580,
    y: 110,
    categoryTag: "Line 1: Reducers",
    catalogHref: "/products/precision-reducers",
    description: "Zero-backlash flexible spline gearhead delivering high torque density in robot joints.",
  },
  {
    id: "c-cycloid",
    label: "RV Cycloidal Drive",
    type: "component",
    x: 580,
    y: 220,
    categoryTag: "Line 1: Reducers",
    catalogHref: "/products/precision-reducers",
    description: "High-torsional-rigidity 2-stage cycloidal drive resisting up to 500% momentary shock overloads.",
  },
  {
    id: "c-frameless-pmsm",
    label: "Frameless Torque PMSM Kit",
    type: "component",
    x: 580,
    y: 330,
    categoryTag: "Line 2: Motors",
    catalogHref: "/products/actuators/servo",
    description: "Rotor/stator direct-integration motor kit delivering maximum torque-to-mass ratio.",
  },
  {
    id: "c-safety-scanner",
    label: "Safety Laser Scanner (PL d)",
    type: "component",
    x: 580,
    y: 440,
    categoryTag: "Line 11: Safety",
    catalogHref: "/products/control-systems",
    description: "Dynamic safety field switching certified to ISO 3691-4 and ISO 13849-1 Category 3.",
  },
  {
    id: "c-machine-vision",
    label: "3D Vision & Radiometric Core",
    type: "component",
    x: 580,
    y: 550,
    categoryTag: "Line 7: Vision",
    catalogHref: "/products/control-systems/sensors-feedback",
    description: "Industrial stereo vision and thermal radiometric sensors for inspection and grasping.",
  },
  {
    id: "c-robot-controller",
    label: "Deterministic Robot Controller",
    type: "component",
    x: 580,
    y: 660,
    categoryTag: "Line 8: Controllers",
    catalogHref: "/products/control-systems/robot-controllers",
    description: "Real-time trajectory interpolation over EtherCAT with integrated functional safety logic.",
  },

  // 4. Industrial Applications (Right Column, x: 860)
  {
    id: "a-automotive",
    label: "Automotive Body-in-White",
    type: "application",
    x: 870,
    y: 140,
    categoryTag: "Manufacturing",
    appHref: "/applications/automotive",
    description: "High-speed spot welding, structural sealant dispensing, and chassis framing cells.",
  },
  {
    id: "a-warehousing",
    label: "E-Commerce Fulfillment",
    type: "application",
    x: 870,
    y: 280,
    categoryTag: "Logistics",
    appHref: "/applications/warehousing",
    description: "Goods-to-person picking, automated tote storage, and cross-dock pallet transfer.",
  },
  {
    id: "a-energy",
    label: "Offshore Energy & Petrochem",
    type: "application",
    x: 870,
    y: 450,
    categoryTag: "Asset Integrity",
    appHref: "/applications/energy",
    description: "Subsea wellhead intervention, pipeline survey, and ATEX facility autonomous patrol.",
  },
  {
    id: "a-electronics",
    label: "Semiconductor Cleanroom",
    type: "application",
    x: 870,
    y: 580,
    categoryTag: "Cleanroom",
    appHref: "/applications/electronics",
    description: "Silicon wafer cassette transfer and micro-assembly under ISO Class 1 conditions.",
  },
  {
    id: "a-medical",
    label: "Minimally Invasive Surgery",
    type: "application",
    x: 870,
    y: 690,
    categoryTag: "Healthcare",
    appHref: "/applications/medical",
    description: "Sub-millimeter motion scaling and tremor filtering in human laparoscopic surgery.",
  },
];

const EDGES: MapEdge[] = [
  // Robot -> Mobility
  { id: "e1", source: "r-humanoid", target: "m-legged", label: "DYNAMIC GAIT", category: "mobility", status: "verified compatibility" },
  { id: "e2", source: "r-quadruped", target: "m-legged", label: "4-LEG TROTTING", category: "mobility", status: "verified compatibility" },
  { id: "e3", source: "r-articulated", target: "m-stationary", label: "RIGID PEDESTAL", category: "mobility", status: "verified compatibility" },
  { id: "e4", source: "r-surgical", target: "m-stationary", label: "RCM PIVOT", category: "mobility", status: "verified compatibility" },
  { id: "e5", source: "r-amr", target: "m-diff-drive", label: "DIFF STEER", category: "mobility", status: "verified compatibility" },
  { id: "e6", source: "r-asrs", target: "m-diff-drive", label: "GRID SHUTTLE", category: "mobility", status: "verified compatibility" },
  { id: "e7", source: "r-rov", target: "m-vectored-thruster", label: "6-DOF HYDRO", category: "mobility", status: "verified compatibility" },

  // Robot -> Components
  { id: "e8", source: "r-humanoid", target: "c-strain-wave", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },
  { id: "e9", source: "r-humanoid", target: "c-frameless-pmsm", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },
  { id: "e10", source: "r-articulated", target: "c-cycloid", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },
  { id: "e11", source: "r-articulated", target: "c-strain-wave", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },
  { id: "e12", source: "r-articulated", target: "c-robot-controller", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },
  { id: "e13", source: "r-amr", target: "c-safety-scanner", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },
  { id: "e14", source: "r-amr", target: "c-frameless-pmsm", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },
  { id: "e15", source: "r-quadruped", target: "c-frameless-pmsm", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },
  { id: "e16", source: "r-quadruped", target: "c-machine-vision", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },
  { id: "e17", source: "r-drone", target: "c-machine-vision", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },
  { id: "e18", source: "r-surgical", target: "c-strain-wave", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },
  { id: "e19", source: "r-asrs", target: "c-robot-controller", label: "USES_COMPONENT", category: "component", status: "verified compatibility" },

  // Components -> Applications
  { id: "e20", source: "c-cycloid", target: "a-automotive", label: "SUPPORTS_APP", category: "application", status: "verified compatibility" },
  { id: "e21", source: "c-safety-scanner", target: "a-warehousing", label: "SUPPORTS_APP", category: "application", status: "verified compatibility" },
  { id: "e22", source: "c-machine-vision", target: "a-energy", label: "SUPPORTS_APP", category: "application", status: "verified compatibility" },
  { id: "e23", source: "c-strain-wave", target: "a-electronics", label: "SUPPORTS_APP", category: "application", status: "verified compatibility" },
  { id: "e24", source: "c-strain-wave", target: "a-medical", label: "SUPPORTS_APP", category: "application", status: "verified compatibility" },

  // Direct Robot -> Application
  { id: "e25", source: "r-articulated", target: "a-automotive", label: "OPERATES_IN", category: "application", status: "verified compatibility" },
  { id: "e26", source: "r-amr", target: "a-warehousing", label: "OPERATES_IN", category: "application", status: "verified compatibility" },
  { id: "e27", source: "r-asrs", target: "a-warehousing", label: "OPERATES_IN", category: "application", status: "verified compatibility" },
  { id: "e28", source: "r-rov", target: "a-energy", label: "OPERATES_IN", category: "application", status: "verified compatibility" },
  { id: "e29", source: "r-quadruped", target: "a-energy", label: "OPERATES_IN", category: "application", status: "verified compatibility" },
  { id: "e30", source: "r-surgical", target: "a-medical", label: "OPERATES_IN", category: "application", status: "verified compatibility" },
];

export function VisualRelationshipMap({ onSelectSubcategory }: { onSelectSubcategory?: (id: string) => void }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("r-articulated");
  const [filterMode, setFilterMode] = useState<"all" | "component" | "application" | "mobility">("all");

  const selectedNode = NODES.find((n) => n.id === selectedNodeId) || NODES[1];

  // Filter edges based on category
  const filteredEdges = EDGES.filter((edge) => {
    if (filterMode === "all") return true;
    return edge.category === filterMode;
  });

  // Calculate connected edges & nodes
  const connectedEdgeIds = new Set<string>();
  const connectedNodeIds = new Set<string>([selectedNode.id]);

  for (const edge of EDGES) {
    if (edge.source === selectedNode.id || edge.target === selectedNode.id) {
      connectedEdgeIds.add(edge.id);
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    }
  }

  // Find neighbor details for inspector
  const neighborRelationships = EDGES.filter(
    (e) => e.source === selectedNode.id || e.target === selectedNode.id
  ).map((e) => {
    const isSource = e.source === selectedNode.id;
    const otherNodeId = isSource ? e.target : e.source;
    const otherNode = NODES.find((n) => n.id === otherNodeId);
    return {
      edgeId: e.id,
      relation: e.label,
      targetNode: otherNode,
      direction: isSource ? "outgoing" : "incoming",
      status: e.status,
    };
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h3 className="font-display text-lg font-bold uppercase text-foreground">
            Robotics Systems Architecture Relationship Map
          </h3>
          <p className="text-xs text-muted-foreground">
            Illustrating traceable connections between mechanical architecture, locomotion, physical components, and verified industrial application verticals.
          </p>
        </div>

        {/* Filter Modes */}
        <div className="flex items-center gap-1.5 rounded bg-surface-elevated/80 p-1 border border-border/60">
          <Filter size={13} className="ml-2 text-muted-foreground" />
          <button
            onClick={() => setFilterMode("all")}
            className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
              filterMode === "all" ? "bg-signal text-signal-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Edges ({EDGES.length})
          </button>
          <button
            onClick={() => setFilterMode("component")}
            className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
              filterMode === "component" ? "bg-signal text-signal-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Components
          </button>
          <button
            onClick={() => setFilterMode("application")}
            className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
              filterMode === "application" ? "bg-signal text-signal-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Applications
          </button>
          <button
            onClick={() => setFilterMode("mobility")}
            className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
              filterMode === "mobility" ? "bg-signal text-signal-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mobility
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Graph Canvas + Contextual Inspector */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left 3 Cols: SVG Interactive Graph */}
        <div className="lg:col-span-3 rounded-lg border border-border/60 bg-surface-dark p-4 shadow-xl overflow-x-auto">
          {/* Header Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/30 pb-3 mb-2 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-precision-blue inline-block"></span>
                <span>Mobility</span>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-signal inline-block"></span>
                <span>Robot System</span>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span>Catalogue Component</span>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-full bg-emerald-400 inline-block"></span>
                <span>Application Domain</span>
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Click any node to focus connections
            </span>
          </div>

          <svg viewBox="0 0 1020 780" className="w-full min-w-[840px] select-none text-xs">
            <defs>
              <marker id="edge-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#64748B" />
              </marker>
              <marker id="edge-arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#16C7E8" />
              </marker>
            </defs>

            {/* Background Column Band Guides */}
            <rect x="20" y="20" width="160" height="740" rx="4" fill="#16243A" fillOpacity="0.3" stroke="#334155" strokeDasharray="3 3" />
            <text x="100" y="45" textAnchor="middle" fill="#64748B" fontWeight="bold" fontSize="10">MOBILITY MECHANISMS</text>

            <rect x="210" y="20" width="230" height="740" rx="4" fill="#16243A" fillOpacity="0.4" stroke="#334155" strokeDasharray="3 3" />
            <text x="325" y="45" textAnchor="middle" fill="#64748B" fontWeight="bold" fontSize="10">ROBOT ARCHITECTURES</text>

            <rect x="480" y="20" width="260" height="740" rx="4" fill="#16243A" fillOpacity="0.3" stroke="#334155" strokeDasharray="3 3" />
            <text x="610" y="45" textAnchor="middle" fill="#64748B" fontWeight="bold" fontSize="10">HARDWARE COMPONENTS</text>

            <rect x="770" y="20" width="230" height="740" rx="4" fill="#16243A" fillOpacity="0.3" stroke="#334155" strokeDasharray="3 3" />
            <text x="885" y="45" textAnchor="middle" fill="#64748B" fontWeight="bold" fontSize="10">DEPLOYED DOMAINS</text>

            {/* Render Edges */}
            {filteredEdges.map((edge) => {
              const srcNode = NODES.find((n) => n.id === edge.source);
              const tgtNode = NODES.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isConnectedToSelected = connectedEdgeIds.has(edge.id);
              const isFaint = selectedNodeId && !isConnectedToSelected;

              // Cubic bezier curve between nodes
              const dx = (tgtNode.x - srcNode.x) / 2;
              const pathD = `M ${srcNode.x} ${srcNode.y} C ${srcNode.x + dx} ${srcNode.y}, ${tgtNode.x - dx} ${tgtNode.y}, ${tgtNode.x} ${tgtNode.y}`;

              const midX = (srcNode.x + tgtNode.x) / 2;
              const midY = (srcNode.y + tgtNode.y) / 2;

              return (
                <g key={edge.id} className="transition-all duration-300">
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isConnectedToSelected ? "#16C7E8" : "#475569"}
                    strokeWidth={isConnectedToSelected ? 2.5 : 1}
                    strokeDasharray={isConnectedToSelected ? "none" : "3 3"}
                    opacity={isFaint ? 0.15 : isConnectedToSelected ? 1 : 0.6}
                    markerEnd={isConnectedToSelected ? "url(#edge-arrow-active)" : "url(#edge-arrow)"}
                  />

                  {/* Labeled Edge Pill */}
                  {isConnectedToSelected && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect x="-42" y="-9" width="84" height="18" rx="3" fill="#101B2D" stroke="#16C7E8" strokeWidth="1" />
                      <text x="0" y="3" textAnchor="middle" fill="#16C7E8" fontSize="8" fontWeight="bold">
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {NODES.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isConnected = connectedNodeIds.has(node.id);
              const isDimmed = selectedNodeId && !isConnected;

              // Badge colors
              let strokeColor = "#475569";
              let badgeFill = "#16243A";
              let textColor = "#CBD5E1";

              if (node.type === "robot") {
                strokeColor = isSelected ? "#16C7E8" : "#2388FF";
                badgeFill = isSelected ? "#16C7E8" : "#16243A";
                textColor = isSelected ? "#101B2D" : "#E2E8F0";
              } else if (node.type === "component") {
                strokeColor = isSelected ? "#F59E0B" : "#D97706";
                badgeFill = isSelected ? "#F59E0B" : "#16243A";
                textColor = isSelected ? "#101B2D" : "#FEF3C7";
              } else if (node.type === "application") {
                strokeColor = isSelected ? "#10B981" : "#059669";
                badgeFill = isSelected ? "#10B981" : "#16243A";
                textColor = isSelected ? "#101B2D" : "#D1FAE5";
              } else if (node.type === "mobility") {
                strokeColor = isSelected ? "#38BDF8" : "#0284C7";
                badgeFill = isSelected ? "#38BDF8" : "#16243A";
                textColor = isSelected ? "#101B2D" : "#E0F2FE";
              }

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer transition-all duration-300"
                  opacity={isDimmed ? 0.25 : 1}
                >
                  {/* Glowing ring if selected */}
                  {isSelected && (
                    <rect
                      x={node.x - 72}
                      y={node.y - 20}
                      width="144"
                      height="40"
                      rx="6"
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="3"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Node Card */}
                  <rect
                    x={node.x - 70}
                    y={node.y - 18}
                    width="140"
                    height="36"
                    rx="4"
                    fill={badgeFill}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 2 : 1}
                  />

                  {/* Node Label */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={textColor}
                    fontWeight="bold"
                    fontSize="11"
                  >
                    {node.label}
                  </text>

                  {/* Sub-tag indicator */}
                  <text
                    x={node.x}
                    y={node.y + 26}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="8"
                  >
                    {node.categoryTag}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right 1 Col: Contextual Detail Panel */}
        <div className="rounded-lg border border-border/60 bg-card p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="rounded bg-signal/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-signal">
                {selectedNode.type.toUpperCase()}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {selectedNode.categoryTag}
              </span>
            </div>

            <div>
              <h4 className="font-display text-lg font-bold text-foreground">
                {selectedNode.label}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {selectedNode.description}
              </p>
            </div>

            {/* Connected Relations List */}
            <div className="border-t border-border/60 pt-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
                <Layers size={13} className="text-signal" />
                Connected Relationships ({neighborRelationships.length})
              </h5>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {neighborRelationships.map((item) => (
                  <div
                    key={item.edgeId}
                    onClick={() => item.targetNode && setSelectedNodeId(item.targetNode.id)}
                    className="flex cursor-pointer items-start justify-between rounded border border-border/50 bg-surface-elevated/40 p-2.5 hover:border-signal/50 hover:bg-surface-elevated transition-all"
                  >
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-signal">
                        {item.relation}
                      </span>
                      <p className="text-xs font-bold text-foreground mt-0.5">
                        {item.targetNode?.label || "Unknown Node"}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {item.targetNode?.categoryTag}
                      </span>
                    </div>
                    <CheckCircle2 size={13} className="text-emerald-500 mt-1 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="border-t border-border/60 pt-4 mt-6 space-y-2">
            {selectedNode.type === "robot" && onSelectSubcategory && (
              <Button
                className="w-full rounded-none bg-signal text-signal-foreground font-bold uppercase text-xs hover:bg-signal/90"
                onClick={() => {
                  const subId = `subcat:${selectedNode.id.replace("r-", "")}`;
                  onSelectSubcategory(subId);
                }}
              >
                Inspect Engineering Specs
                <ArrowRight size={13} className="ml-1.5" />
              </Button>
            )}

            {selectedNode.catalogHref && (
              <Button
                asChild
                variant="outline"
                className="w-full rounded-none border-border font-bold uppercase text-xs"
              >
                <Link to={selectedNode.catalogHref}>
                  <Cpu size={13} className="mr-1.5 text-signal" />
                  View Catalogue Products
                </Link>
              </Button>
            )}

            {selectedNode.appHref && (
              <Button
                asChild
                variant="outline"
                className="w-full rounded-none border-border font-bold uppercase text-xs"
              >
                <Link to={selectedNode.appHref}>
                  <Briefcase size={13} className="mr-1.5 text-signal" />
                  Explore Industrial Vertical
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
