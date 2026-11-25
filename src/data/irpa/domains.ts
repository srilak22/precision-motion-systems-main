// INDUS Industrial Robotics - 12 IRPA Assessment Domains & Weights
// Generated from IRPA Phase 1 Maturity Scoring Model

export interface AssessmentDomain {
  id: string;
  code: string;
  name: string;
  weightDiscrete: number;
  weightProcess: number;
  weightHybrid: number;
  medianBenchmark: number;
  levels: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
}

export const ASSESSMENT_DOMAINS: AssessmentDomain[] = [
  {
    "id": "D01",
    "code": "D01",
    "name": "Production Automation",
    "weightDiscrete": 0.12,
    "weightProcess": 0.08,
    "weightHybrid": 0.1,
    "medianBenchmark": 4.0,
    "levels": {
      "level0": "100% manual operations; zero mechanization; no power tools.",
      "level1": "Manual hand tools; unbuffered lines; high physical strain.",
      "level2": "Standalone single-purpose machines; manual loading/unloading.",
      "level3": "Semi-automated assembly lines; synchronized conveyors; automated press fixtures.",
      "level4": "Fully automated multi-station transfer lines; closed-loop dispensing and torquing.",
      "level5": "Autonomous self-balancing lines; AI-modulated takt; zero-defect adaptive execution."
    }
  },
  {
    "id": "D02",
    "code": "D02",
    "name": "Robotic Systems Adoption",
    "weightDiscrete": 0.14,
    "weightProcess": 0.04,
    "weightHybrid": 0.1,
    "medianBenchmark": 4.2,
    "levels": {
      "level0": "Zero robots deployed across the plant.",
      "level1": "Sparse trial robots (<5/10k workers); high downtime; manual pendant jogging.",
      "level2": "Isolated standalone robots for simple pick/place or single-pass weld.",
      "level3": "Robotics across all key bottlenecks; multi-axis sync; basic OLP simulation.",
      "level4": "High density (>200/10k); offline programming; integrated vision guidance; cobots.",
      "level5": "Physical AI & autonomous mobile manipulation; zero-shot trajectory re-planning."
    }
  },
  {
    "id": "D03",
    "code": "D03",
    "name": "Material Handling Automation",
    "weightDiscrete": 0.1,
    "weightProcess": 0.1,
    "weightHybrid": 0.1,
    "medianBenchmark": 3.8,
    "levels": {
      "level0": "Manual carrying, wheelbarrows, and pushcarts.",
      "level1": "Manual forklifts with paper dispatch; static pallet stacks.",
      "level2": "Motorized roller conveyors; basic vertical lift modules.",
      "level3": "Automated Guided Vehicles (AGVs) on magnetic tape; robotic palletizers.",
      "level4": "Autonomous Mobile Robots (AMRs) with dynamic SLAM; ASRS high-bay buffers.",
      "level5": "End-to-end autonomous intralogistics; VDA 5050 fleet coordination; autonomous dock loading."
    }
  },
  {
    "id": "D04",
    "code": "D04",
    "name": "Quality Inspection and Vision Systems",
    "weightDiscrete": 0.1,
    "weightProcess": 0.12,
    "weightHybrid": 0.11,
    "medianBenchmark": 4.5,
    "levels": {
      "level0": "No formal quality checks; customer complaints identify defects.",
      "level1": "100% manual visual inspection under bench lights; high operator fatigue.",
      "level2": "Offline CMM room sampling (1 part/shift); manual go/no-go plug gauges.",
      "level3": "Inline 2D machine vision; automated barcode reading; in-situ tool probing.",
      "level4": "100% inline 3D laser metrology; automated optical inspection (AOI); high-speed OCR.",
      "level5": "Closed-loop AI defect recognition; zero-shot anomaly detection; auto-tool compensation."
    }
  },
  {
    "id": "D05",
    "code": "D05",
    "name": "Machine and CNC Automation",
    "weightDiscrete": 0.1,
    "weightProcess": 0.04,
    "weightHybrid": 0.07,
    "medianBenchmark": 4.0,
    "levels": {
      "level0": "Manual crank milling machines and engine lathes.",
      "level1": "Basic standalone CNCs with manual vise tightening and operator loading.",
      "level2": "Automated bar feeders on lathes; hydraulic clamping fixtures.",
      "level3": "Robotic CNC machine tending cells; dual grippers; tool life monitoring.",
      "level4": "Simultaneous 5-axis CNCs; zero-point workholding; on-machine metrology probing.",
      "level5": "Autonomous lights-out machining cells; adaptive feed-rate control; tool condition AI."
    }
  },
  {
    "id": "D06",
    "code": "D06",
    "name": "Maintenance and Reliability",
    "weightDiscrete": 0.08,
    "weightProcess": 0.14,
    "weightHybrid": 0.1,
    "medianBenchmark": 4.0,
    "levels": {
      "level0": "Pure run-to-failure (breakdown maintenance); chronic asset downtime.",
      "level1": "Paper-based logbooks; basic calendar preventive maintenance (PM).",
      "level2": "Digital CMMS tracking work orders; usage-based PM (operating hours).",
      "level3": "Condition-based maintenance (CBM); periodic vibration and thermal surveys.",
      "level4": "Continuous online wireless IoT vibration and temperature telemetry; automated alarms.",
      "level5": "AI predictive maintenance (PdM); remaining useful life (RUL) modeling; auto-dispatch."
    }
  },
  {
    "id": "D07",
    "code": "D07",
    "name": "Industrial Safety and Human-Robot Collaboration",
    "weightDiscrete": 0.08,
    "weightProcess": 0.1,
    "weightHybrid": 0.09,
    "medianBenchmark": 4.5,
    "levels": {
      "level0": "Unguarded rotating equipment; open hazardous zones; zero safety relays.",
      "level1": "Basic sheet metal covers; hardwired e-stops breaking control power directly.",
      "level2": "Perimeter wire fencing; standard safety relays (PLc); basic light curtains.",
      "level3": "Safety PLCs (PLd / Cat 3); interlocked RFID access gates; ISO 13855 stopping audits.",
      "level4": "PLe / Cat 4 safety network (PROFIsafe / CIP Safety); dynamic safety laser scanners.",
      "level5": "Certified ISO/TS 15066 collaborative zones; speed and separation monitoring; safe kinematics."
    }
  },
  {
    "id": "D08",
    "code": "D08",
    "name": "Industrial IoT and Sensor Integration",
    "weightDiscrete": 0.07,
    "weightProcess": 0.1,
    "weightHybrid": 0.08,
    "medianBenchmark": 4.0,
    "levels": {
      "level0": "No sensors beyond mechanical limit switches; machines air-gapped.",
      "level1": "Analog gauges and lights; isolated data loggers recording to local CSV.",
      "level2": "Digital sensors connected to local PLCs; basic Modbus TCP networking.",
      "level3": "IO-Link smart sensors; industrial edge gateways; MQTT / OPC UA data streaming.",
      "level4": "Sub-second real-time telemetry; enterprise historian; Purdue model OT security.",
      "level5": "Converged TSN deterministic network; private 5G mesh; cloud-edge unified namespace."
    }
  },
  {
    "id": "D09",
    "code": "D09",
    "name": "PLC, SCADA and Control Systems",
    "weightDiscrete": 0.07,
    "weightProcess": 0.12,
    "weightHybrid": 0.09,
    "medianBenchmark": 4.2,
    "levels": {
      "level0": "Manual relay logic panels and knife switches; no PLCs.",
      "level1": "Legacy obsolete PLCs; undocumented spaghetti ladder logic.",
      "level2": "Current-generation standard PLCs; localized standalone HMI touchscreens.",
      "level3": "Standardized IEC 61131-3 logic; centralized client-server SCADA; fieldbus I/O.",
      "level4": "High-performance redundant PACs; EtherCAT microsecond bus; High-Performance HMI (ISA-101).",
      "level5": "Virtual soft-PLCs on real-time Linux; unified namespace; ISA-18.2 automated alarm suppression."
    }
  },
  {
    "id": "D10",
    "code": "D10",
    "name": "MES, ERP and Production Planning",
    "weightDiscrete": 0.06,
    "weightProcess": 0.08,
    "weightHybrid": 0.08,
    "medianBenchmark": 3.8,
    "levels": {
      "level0": "Paper shop travelers and manual whiteboard scheduling.",
      "level1": "End-of-shift manual keyboard data entry into standalone accounting software.",
      "level2": "Spreadsheet-based scheduling (Excel); manual barcode scanning at department gates.",
      "level3": "MES software tracking real-time WIP; automated work order dispatch; OEE calculation.",
      "level4": "Automated ISA-95 integration between MES and ERP; paperless electronic batch records (eBR).",
      "level5": "Closed-loop autonomous scheduling; real-time dynamic dispatching; automated product carbon audit."
    }
  },
  {
    "id": "D11",
    "code": "D11",
    "name": "AI, Analytics and Digital Twin",
    "weightDiscrete": 0.04,
    "weightProcess": 0.04,
    "weightHybrid": 0.04,
    "medianBenchmark": 3.5,
    "levels": {
      "level0": "Zero analytics; reliance on historical intuition and guesswork.",
      "level1": "Static 2D CAD plant drawings; manual Excel Pareto charts.",
      "level2": "Kinematic 3D CAD simulation of robot reach and physical clearances.",
      "level3": "Virtual commissioning (Software-in-the-Loop); supervised deep learning vision models.",
      "level4": "Real-time synchronized digital twin; predictive quality ML models; edge AI inference.",
      "level5": "Prescriptive autonomous optimization; Physical AI foundation models; reinforcement learning."
    }
  },
  {
    "id": "D12",
    "code": "D12",
    "name": "Workforce Skills and Digital Readiness",
    "weightDiscrete": 0.04,
    "weightProcess": 0.04,
    "weightHybrid": 0.04,
    "medianBenchmark": 3.8,
    "levels": {
      "level0": "Untrained manual laborers; zero technical automation literacy.",
      "level1": "Operators fearful of automation; 100% reliance on outside integrators.",
      "level2": "Technicians perform basic robot jogging, point touch-up, and board swapping.",
      "level3": "In-house automation engineering team programming PLCs and teaching robots.",
      "level4": "Internal Robotics Center of Excellence; digital SOPs; structured mechatronics apprenticeships.",
      "level5": "Empowered Physical AI culture; continuous upskilling; operators co-designing automated workflows."
    }
  }
];

export const IRPA_DOMAINS = ASSESSMENT_DOMAINS.map((d) => ({
  ...d,
  number: parseInt(d.id.replace("D", ""), 10),
  weights: {
    discrete: d.weightDiscrete,
    process: d.weightProcess,
    hybrid: d.weightHybrid,
  },
}));

