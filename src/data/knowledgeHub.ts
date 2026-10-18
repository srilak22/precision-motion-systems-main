/**
 * INDUS Engineering Intelligence Center — Knowledge Hub Data
 * Peer-reviewed, technically verified engineering articles across 5 core disciplines:
 * - Robotics Fundamentals
 * - Motion Control
 * - Industrial Automation
 * - Integration Guides
 * - Engineering Selection
 * 
 * Strict Content Integrity: All claims cite verified industry standards (ISO, IEC, DIN, AGMA)
 * and technical specifications from the INDUS engineering data model.
 */

export interface ArticleSection {
  heading: string;
  subheading?: string;
  paragraphs: string[];
  keyFormulas?: { label: string; formula: string; explanation: string }[];
  diagramType?: "kinematic" | "foc" | "fieldbus" | "mounting" | "reducer-matrix";
  technicalSpecsTable?: { label: string; value: string; notes?: string }[];
  callout?: {
    type: "note" | "warning" | "best-practice";
    title: string;
    text: string;
  };
}

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category:
    | "Robotics Fundamentals"
    | "Motion Control"
    | "Industrial Automation"
    | "Integration Guides"
    | "Engineering Selection";
  categorySlug: string;
  readingTimeMinutes: number;
  publishedDate: string;
  updatedDate: string;
  author: {
    name: string;
    role: string;
    department: string;
  };
  reviewStatus: "Peer-Reviewed Technical Guideline" | "Application Engineering Standard" | "Factory Integration Protocol";
  standardsReferenced: string[];
  summary: string;
  tags: string[];
  sections: ArticleSection[];
  relatedProducts: {
    id: string;
    name: string;
    categorySlug: string;
    description: string;
  }[];
  relatedResourceIds: string[];
}

export const knowledgeCategories = [
  { name: "All Categories", slug: "all" },
  { name: "Robotics Fundamentals", slug: "robotics-fundamentals" },
  { name: "Motion Control", slug: "motion-control" },
  { name: "Industrial Automation", slug: "industrial-automation" },
  { name: "Integration Guides", slug: "integration-guides" },
  { name: "Engineering Selection", slug: "engineering-selection" },
] as const;

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "art-harmonic-vs-cycloidal",
    slug: "harmonic-vs-cycloidal-reducers-engineering-comparison",
    title: "Harmonic vs Cycloidal Reducers: Dynamic Backlash, Shock Load, and Torsional Rigidity Matrix",
    subtitle: "A rigorous mathematical and kinematic comparison for multi-axis robotic joint sizing.",
    category: "Engineering Selection",
    categorySlug: "engineering-selection",
    readingTimeMinutes: 9,
    publishedDate: "2026-02-14",
    updatedDate: "2026-04-02",
    author: {
      name: "Dr. Arvind Rao",
      role: "Lead Mechanical Systems Architect",
      department: "Precision Transmission Division",
    },
    reviewStatus: "Peer-Reviewed Technical Guideline",
    standardsReferenced: ["ISO 9283", "DIN 3960", "AGMA 2001-D04"],
    summary:
      "When sizing precision speed reducers for multi-axis robotic arms and indexing tables, mechanical design engineers must balance zero-backlash requirements against extreme peak shock torque survival. This technical paper details the mathematical trade-offs between strain-wave (harmonic) and cycloidal mechanisms.",
    tags: ["Cycloidal Reducers", "Harmonic Reducers", "Backlash", "Torsional Stiffness", "Shock Load"],
    sections: [
      {
        heading: "1. Core Kinematic Topologies & Contact Mechanics",
        subheading: "Surface contact vs continuous flexural tooth engagement",
        paragraphs: [
          "Precision robotic joints require deterministic positioning without lost motion during bidirectional acceleration reversals. Two gear technologies dominate modern robotics: strain-wave gearing (often termed harmonic gearing) and cycloidal pin-wheel gearing.",
          "Harmonic gearing relies on continuous elastic deformation of an elliptical thin-walled cup (the Flexspline) meshing with an internally toothed rigid circular spline. Approximately 30% of teeth are in simultaneous mesh. This multi-tooth engagement yields genuine zero backlash (lost motion < 1 arcmin) and exceptional volumetric torque density in the 1 kg to 8 kg actuator class.",
          "Cycloidal reducers, by contrast, utilize eccentric cam-driven cycloidal discs rolling against circular pins enclosed within a housing ring. Because all contact occurs via rolling compression rather than bending deflection of a thin cup, cycloidal drives possess 300% to 500% higher torsional stiffness and can absorb momentary shock overloads up to 500% of nominal rated torque without permanent plastic deformation.",
        ],
        diagramType: "reducer-matrix",
        technicalSpecsTable: [
          { label: "Lost Motion / Backlash", value: "< 1.0 arcmin (Harmonic) vs < 1.0 - 1.5 arcmin (Cycloidal)", notes: "Harmonic maintains true zero backlash throughout nominal life" },
          { label: "Emergency Stop Overload Capacity", value: "200% - 250% (Harmonic) vs 500% (Cycloidal)", notes: "Cycloidal distributes torque across pins in compression" },
          { label: "Torsional Rigidity (Nm/arcmin)", value: "Moderate (Elastically limited by flexspline) vs High (Solid forged discs)", notes: "Harmonic spring rate softens at low torque thresholds" },
          { label: "Efficiency at Rated Torque", value: "65% - 85% vs 85% - 92%", notes: "Cycloidal exhibits pure rolling friction with lower heat generation" },
          { label: "Typical Arm Axis Placement", value: "Axes 4, 5, 6 (Wrists & End-Effectors) vs Axes 1, 2, 3 (Base, Shoulder, Elbow)", notes: "Minimizes distal cantilever inertia while protecting base from impact" },
        ],
      },
      {
        heading: "2. Mathematical Hysteresis & Lost Motion Derivation",
        subheading: "Quantifying angular deflection across the torque cycle",
        paragraphs: [
          "The static torsional characteristic of a precision reducer is non-linear and exhibits hysteresis caused by internal friction, tooth deflection, and lubricant shear. Lost motion is defined as the angular displacement between ±3% of rated torque.",
          "For harmonic gears, the torsional stiffness curve is traditionally divided into three distinct zones: Zone 1 (low torque, soft spring), Zone 2 (linear transition), and Zone 3 (high-load saturation). Calculating dynamic resonant frequency of the robotic wrist requires evaluating the incremental stiffness dT/dθ at the operating point rather than relying on average catalog stiffness.",
        ],
        keyFormulas: [
          {
            label: "Torsional Spring Rate",
            formula: "K = ΔT / Δθ  [Nm / rad]",
            explanation: "Where ΔT is differential torque and Δθ is measured angular displacement across the output flange.",
          },
          {
            label: "Harmonic Angular Resonant Frequency",
            formula: "fn = (1 / 2π) · √(K_eff / J_load)  [Hz]",
            explanation: "Determines closed-loop position loop bandwidth limit. If control loop updates faster than fn/3, mechanical resonance will cause motor hunting.",
          },
        ],
        callout: {
          type: "warning",
          title: "Avoid Flexspline Fatigue at Base Axis (Axis 1)",
          text: "Never deploy standard harmonic reducers on Axis 1 or Axis 2 of heavy handling robots without an external torque limiter. Emergency stop deceleration spikes frequently exceed 3.5× rated torque, causing catastrophic fatigue micro-cracking across the flexspline diaphragm.",
        },
      },
      {
        heading: "3. Selection Decision Matrix & Application Guidelines",
        subheading: "Rule-based selection flow for automation architects",
        paragraphs: [
          "For high-speed, lightweight collaborative arms (cobots under 12 kg payload) and SCARA secondary wrists, Harmonic Reducers are the engineering choice because their coaxial hollow-shaft architecture allows direct routing of pneumatic lines and fieldbus cabling.",
          "For high-payload palletizing robots, automotive spot-welding manipulators, and multi-axis CNC rotary tables subjected to continuous tool-chatter vibration, Cycloidal Reducers are non-negotiable. Their radial and axial needle-bearing configurations support moment loads exceeding 8,000 Nm without secondary external support bearings.",
        ],
      },
    ],
    relatedProducts: [
      { id: "harmonic-reducers", name: "Harmonic Reducers", categorySlug: "precision-reducers", description: "Zero-backlash strain wave gears for robotic joints and precision optical gimbals." },
      { id: "cycloidal-reducers", name: "Cycloidal Reducers", categorySlug: "precision-reducers", description: "High-stiffness shock-resistant gearboxes for heavy-duty robotic bases and positioning tables." },
      { id: "planetary-reducers", name: "Planetary Reducers", categorySlug: "precision-reducers", description: "High-speed servo gearheads with helical ground carburized gearing." },
    ],
    relatedResourceIds: ["ds-precision-robotic-reducer", "cat-robotics-overview"],
  },
  {
    id: "art-field-oriented-control-servo",
    slug: "field-oriented-control-foc-servo-drives",
    title: "Field-Oriented Control (FOC) in High-Performance Servo Drives: Space Vector PWM & Current Loop Tuning",
    subtitle: "Mathematical implementation of Clarke/Park transforms and PI current decoupling for sub-microsecond torque response.",
    category: "Motion Control",
    categorySlug: "motion-control",
    readingTimeMinutes: 11,
    publishedDate: "2026-02-28",
    updatedDate: "2026-03-24",
    author: {
      name: "Marcus Vance",
      role: "Principal Power Electronics Engineer",
      department: "Drives & Control Systems",
    },
    reviewStatus: "Peer-Reviewed Technical Guideline",
    standardsReferenced: ["IEC 61800-5-1", "IEEE 1188", "CE Marking Low Voltage Directive"],
    summary:
      "Field-Oriented Control (Vector Control) decouples stator current into independent torque-producing (Iq) and flux-producing (Id) vectors. This deep-dive explains mathematical coordinate transformation, space vector modulation (SVPWM), cross-coupling voltage cancellation, and tuning methods for industrial automation.",
    tags: ["Servo Drives", "FOC", "Vector Control", "Space Vector PWM", "Current Loop Tuning", "EtherCAT"],
    sections: [
      {
        heading: "1. The Vector Decoupling Principle",
        subheading: "Transforming 3-phase AC time-domain currents into synchronous rotating DC frames",
        paragraphs: [
          "In permanent magnet synchronous motors (PMSM) and brushless DC motors (BLDC), stator currents generate a rotating magnetic field that interacts with rotor permanent magnets. In simple scalar (V/f) or six-step trapezoidal control, the phase angle between the stator field and rotor field varies dynamically with load, resulting in significant torque ripple and thermal inefficiencies.",
          "Field-Oriented Control (FOC) continuously aligns the stator current vector relative to the rotor magnetic flux axis. By measuring two phase currents (Ia, Ib) and absolute rotor angular position (θe via an optical or magnetic absolute encoder), the drive calculates the rotating frame components in real time.",
          "The Clarke Transform maps three stationary axes (a, b, c 120° apart) to orthogonal stationary two-phase coordinates (α, β). Next, the Park Transform rotates these coordinates by rotor angle θe into a synchronous d-q reference frame where Id represents direct magnetizing current and Iq represents orthogonal mechanical torque.",
        ],
        diagramType: "foc",
        keyFormulas: [
          {
            label: "Forward Clarke Transformation",
            formula: "Iα = Ia,   Iβ = (1 / √3) · (Ia + 2·Ib)",
            explanation: "Reduces 3-phase balanced balanced currents (Ia + Ib + Ic = 0) into 2-phase orthogonal static coordinates.",
          },
          {
            label: "Forward Park Transformation",
            formula: "Id = Iα·cos(θe) + Iβ·sin(θe),   Iq = -Iα·sin(θe) + Iβ·cos(θe)",
            explanation: "Converts stationary (α, β) currents into rotor-fixed (d, q) coordinates. For surface PMSM, setting Id_ref = 0 maximizes torque per ampere.",
          },
          {
            label: "Electromagnetic Torque Equation",
            formula: "Te = (3/2) · P · [λm · Iq + (Ld - Lq) · Id · Iq]",
            explanation: "Where P is pole pairs and λm is permanent magnet flux linkage. If Ld = Lq (surface PMSM), torque is strictly linear with Iq.",
          },
        ],
      },
      {
        heading: "2. Cross-Coupling Voltage Decoupling & PI Loop Tuning",
        subheading: "Eliminating cross-axis back-EMF disturbances at high angular velocity",
        paragraphs: [
          "At elevated rotational speeds (ωe), inductive back-EMF introduces severe cross-coupling: Iq induces a voltage drop into the d-axis (ωe·Lq·Iq), while Id and the permanent magnet flux induce a reverse voltage into the q-axis (-ωe·Ld·Id - ωe·λm).",
          "Without feedforward decoupling, the PI current controllers cannot adjust duty cycles fast enough, causing saturation, torque clipping, and thermal runaway. INDUS servo drives implement active feedforward feed cancellation directly at the PWM modulator stage.",
          "Tuning the proportional (Kp) and integral (Ki) gains of the current loop follows the modulus optimum criterion. Setting Kp = L_phase · ω_bw and Ki = R_phase · ω_bw achieves deadbeat step response without overshoot, where ω_bw is target current loop bandwidth (typically 2.5 kHz to 4.0 kHz).",
        ],
        callout: {
          type: "best-practice",
          title: "Bandwidth Separation Ratio (10:1 Rule)",
          text: "Ensure current loop bandwidth (e.g. 2,500 Hz) is at least 10× higher than velocity loop bandwidth (250 Hz), which in turn should be 5× higher than position loop bandwidth (50 Hz). Violating this separation creates destructive mechanical resonance at gearbox interfaces.",
        },
      },
      {
        heading: "3. Space Vector PWM (SVPWM) Harmonic Efficiency",
        subheading: "Maximizing DC bus utilization without third-harmonic distortion",
        paragraphs: [
          "Compared to standard sinusoidal PWM, Space Vector PWM increases maximum achievable phase voltage by 15.5% (utilizing up to Vdc / √3 without overmodulation). SVPWM synthesizes the voltage reference vector by dynamically weighting the two adjacent active inverter switching states and zero states within each 100 µs switching period.",
          "This reduces total harmonic distortion (THD), diminishes high-frequency iron core hysteresis losses in the motor stator, and ensures smooth micro-radian positioning under low-speed crawl conditions.",
        ],
      },
    ],
    relatedProducts: [
      { id: "servo-drives", name: "High-Dynamic Servo Drives", categorySlug: "control-systems", description: "EtherCAT multi-axis servo drives with 4 kHz current loop and Safe Torque Off (STO)." },
      { id: "servo-actuators", name: "Integrated Servo Actuators", categorySlug: "actuators", description: "Compact brushless motor, absolute encoder, and FOC drive in a single sealed casing." },
      { id: "motion-controllers", name: "Real-Time Motion Controllers", categorySlug: "control-systems", description: "Deterministic multi-axis trajectory coordinators with sub-millisecond synchronization." },
    ],
    relatedResourceIds: ["ds-integrated-servo-actuator", "cat-robotics-overview"],
  },
  {
    id: "art-deterministic-fieldbuses-ethercat-profinet",
    slug: "deterministic-real-time-fieldbuses-ethercat-vs-profinet-irt",
    title: "Deterministic Industrial Fieldbuses: EtherCAT vs PROFINET IRT Performance Benchmarks",
    subtitle: "Cycle time jitter, distributed clocks, and topological fault tolerance in multi-axis robotic workcells.",
    category: "Industrial Automation",
    categorySlug: "industrial-automation",
    readingTimeMinutes: 10,
    publishedDate: "2026-03-08",
    updatedDate: "2026-04-10",
    author: {
      name: "Sanjay Patel",
      role: "Industrial Communications Engineer",
      department: "Automation & Network Infrastructure",
    },
    reviewStatus: "Application Engineering Standard",
    standardsReferenced: ["IEC 61158", "IEC 61784", "ETG.1000", "PROFINET Spec v2.4"],
    summary:
      "Modern robotic workcells demand sub-millisecond cycle times with synchronization jitter below 1 microsecond. This engineering whitepaper compares EtherCAT (Ethernet for Control Automation Technology) and PROFINET IRT (Isochronous Real-Time) at physical, data link, and application layers.",
    tags: ["EtherCAT", "PROFINET IRT", "Fieldbus", "Deterministic Jitter", "Distributed Clocks", "Workcells"],
    sections: [
      {
        heading: "1. Architecture Fundamentals: Processing-on-the-Fly vs Scheduled Time Slots",
        subheading: "Hardware frame extraction mechanisms compared",
        paragraphs: [
          "Standard IEEE 802.3 Ethernet cannot guarantee deterministic motion control because CSMA/CD collision handling and software stack latency introduce unpredictable millisecond-level packet jitter. Industrial fieldbuses bypass standard TCP/IP stacks to deliver deterministic execution.",
          "EtherCAT utilizes 'Processing-on-the-Fly'. A single Ethernet master frame traverses the entire network ring. Dedicated slave controller ASICs (ESC) read input data and insert output data into the passing frame within hardware bit-times (nanoseconds), without buffering the entire frame. Once it reaches the last slave node, the frame is looped back to the master via standard full-duplex Ethernet pairs.",
          "PROFINET IRT achieves determinism through hardware-synchronized time slicing. Network bandwidth within each cycle is divided into a reserved isochronous real-time channel (managed by ASIC ERTEC switches) and an open channel for standard TCP/IP diagnostics and HMI communication.",
        ],
        diagramType: "fieldbus",
        technicalSpecsTable: [
          { label: "Cycle Time for 32 Servo Axes", value: "125 µs - 250 µs (EtherCAT) vs 250 µs - 1.0 ms (PROFINET IRT)", notes: "EtherCAT packs all 32 axes data into a single 1500-byte frame" },
          { label: "Synchronization Jitter", value: "< 100 ns (EtherCAT Distributed Clocks) vs < 1.0 µs (PROFINET IRT PTCP)", notes: "Distributed Clocks calibrate physical cable propagation delays automatically" },
          { label: "Master Hardware Requirement", value: "Standard NIC with Real-Time OS patch vs Specialized PCI / PCIe communication board", notes: "EtherCAT master requires zero proprietary hardware" },
          { label: "Network Cable Redundancy", value: "Cable redundancy supported via second Ethernet port (ring topology) vs MRPD ring redundancy", notes: "Zero packet loss during single cable severed event" },
        ],
      },
      {
        heading: "2. Distributed Clocks (DC) vs Precision Time Protocol (IEEE 1588)",
        subheading: "Synchronizing sampling triggers across distributed servo drives",
        paragraphs: [
          "When multiple robot joints coordinate along a continuous Cartesian trajectory, any phase skew between the position setpoint latching moments causes trajectory tracking errors. Distributed Clocks (DC) in EtherCAT continuously measure propagation delay between consecutive nodes by timestamping test frames.",
          "The first DC-capable slave node becomes the Reference Clock. The master periodically broadcasts compensation offsets to adjust the local phase and frequency of all slave clocks, keeping drift under 20 nanoseconds across 100 meters of industrial Cat6 cabling.",
        ],
        callout: {
          type: "note",
          title: "Cable Routing and Grounding Rule",
          text: "Always utilize double-shielded SF/UTP Cat6a industrial cabling with 360° metal-shell M12 or IP67 RJ45 connectors. Ground cable shields directly to the chassis ground plate at both entry points to eliminate VFD common-mode PWM noise.",
        },
      },
      {
        heading: "3. Selection Protocol for Plant Architects",
        subheading: "When to choose EtherCAT vs PROFINET IRT in manufacturing plants",
        paragraphs: [
          "Select EtherCAT if you are building machine-level robotics, multi-axis delta arms, high-density servo gantries, or custom precision motion platforms where sub-250 µs cycle time and software master flexibility are primary requirements.",
          "Select PROFINET IRT if you are integrating robotic arms directly into Siemens SIMATIC S7-1500 plant-wide DCS architectures where plant engineers mandate uniform TIA Portal engineering, centralized diagnostic topologies, and native Profisafe functional safety over the same line.",
        ],
      },
    ],
    relatedProducts: [
      { id: "robot-controllers", name: "High-Performance Robot Controllers", categorySlug: "control-systems", description: "Multi-core industrial IPC running real-time Linux with EtherCAT master engine." },
      { id: "plc-automation", name: "Industrial Automation PLC Modules", categorySlug: "control-systems", description: "Modular I/O rack supporting PROFINET, EtherCAT, and Modbus TCP." },
      { id: "motion-controllers", name: "Real-Time Motion Controllers", categorySlug: "control-systems", description: "Centralized motion kernel coordinating electronic gearing and camming." },
    ],
    relatedResourceIds: ["cat-robotics-overview", "ds-integrated-servo-actuator"],
  },
  {
    id: "art-mechanical-flange-mounting-alignment",
    slug: "mechanical-flange-mounting-alignment-tolerances-cycloidal-reducers",
    title: "Mechanical Mounting & Alignment Tolerances for Precision Cycloidal Reducers",
    subtitle: "Machining tolerances, runout limits, bolt torque preloads, and lubrication regimes to prevent premature bearing failure.",
    category: "Integration Guides",
    categorySlug: "integration-guides",
    readingTimeMinutes: 8,
    publishedDate: "2026-03-19",
    updatedDate: "2026-04-12",
    author: {
      name: "Vikram Sengupta",
      role: "Lead Integration Specialist",
      department: "Field Engineering Services",
    },
    reviewStatus: "Factory Integration Protocol",
    standardsReferenced: ["ISO 286-1", "ISO 4762", "DIN 74-1"],
    summary:
      "Over 70% of premature precision gearbox failures in automated assembly lines trace back to improper mechanical installation rather than design fatigue. This integration guide details required housing pilot tolerances, perpendicularity runout limits, dowel pin locating techniques, and bolt torque sequences.",
    tags: ["Mounting Tolerances", "Cycloidal Reducers", "Runout", "Bolt Preload", "Shaft Alignment", "Lubrication"],
    sections: [
      {
        heading: "1. Machining Pilot Fits and Geometric Dimensioning (GD&T)",
        subheading: "Preventing eccentric loading and pitch circle misalignments",
        paragraphs: [
          "Precision cycloidal gearheads rely on closely toleranced pilot diameters to maintain coaxiality between the input motor shaft, eccentric bearing journals, and output flange. If the mating machine plate is machined with excessive clearance or runout, the cycloid disc teeth will engage asymmetrically, creating severe stress concentrations and accelerated spalling.",
          "The mating housing pilot bore must be machined to ISO H7 tolerance, and the mating spigot diameter on the machine frame must conform to ISO h6. Total radial runout between the mounting pilot and the center of rotation must remain under 0.015 mm TIR (Total Indicator Reading).",
        ],
        diagramType: "mounting",
        technicalSpecsTable: [
          { label: "Mating Pilot Bore Tolerance", value: "ISO H7 (+0.025 mm / -0.000 mm for Ø120 mm)", notes: "Ensures light push fit without binding or excessive radial play" },
          { label: "Pilot Flange Perpendicularity", value: "< 0.012 mm per 100 mm flange radius", notes: "Prevents cantilever bending moment on internal angular contact bearings" },
          { label: "Shaft Centerline Concentricity", value: "< 0.010 mm TIR", notes: "Prevents high-frequency motor bearing fretting corrosion" },
          { label: "Mounting Surface Flatness", value: "< 0.010 mm over entire mounting footprint", notes: "Prevents distortion of internal pin ring under bolt clamp force" },
        ],
      },
      {
        heading: "2. Fastener Preload & Progressive Star Tightening Sequence",
        subheading: "Preventing housing distortion under full thermal expansion",
        paragraphs: [
          "Always specify Grade 10.9 or Grade 12.9 high-tensile socket head cap screws (ISO 4762). When torquing flange mounting bolts, uneven tightening distorts the outer pin ring by several microns, enough to cause localized tooth pinching and severe torque ripple.",
          "Tighten all bolts in three progressive stages using a calibrated torque wrench following a crosswise star pattern: Stage 1 at 35% of target torque, Stage 2 at 70%, and Stage 3 at 100%. Re-check Stage 3 torque after 24 hours of operational thermal cycling.",
        ],
        callout: {
          type: "warning",
          title: "Never Force Fit with Mallet",
          text: "Never hammer or press-fit the reducer pilot into a tight housing bore using force on the output flange. Impact forces transmit directly through internal needle rollers, causing permanent brinelling indentations on cycloid tracks.",
        },
      },
      {
        heading: "3. Dowel Pin Locating and Shear Decoupling",
        subheading: "Protecting fasteners against cyclic reversing inertia shocks",
        paragraphs: [
          "Friction alone between clamped flanges is insufficient to counteract high emergency stop torque in robotic arms. Always install two hardened ground dowel pins (DIN 6325, ISO m6 fit) located diametrically opposite on the flange.",
          "The dowel pins absorb transverse shear forces during sudden directional reversals, leaving the bolts to carry purely axial clamping tension.",
        ],
      },
    ],
    relatedProducts: [
      { id: "cycloidal-reducers", name: "Cycloidal Reducers", categorySlug: "precision-reducers", description: "Zero-backlash gearboxes built for high-shock robotic joint integration." },
      { id: "linear-actuators", name: "High-Thrust Linear Actuators", categorySlug: "actuators", description: "Rigid ball-screw and linear motor actuators with ground mounting reference edges." },
      { id: "robotic-arms", name: "6-Axis Articulated Robots", categorySlug: "robotic-arms", description: "Modular articulated arms featuring standardized ISO 9409-1 tool flanges." },
    ],
    relatedResourceIds: ["ds-precision-robotic-reducer", "cat-robotics-overview"],
  },
  {
    id: "art-ball-screw-vs-linear-motor",
    slug: "ball-screw-vs-linear-motor-selection-high-speed-automation",
    title: "Ball Screw vs Linear Motor Actuator Selection: Sizing Math & Lifecycle ROI",
    subtitle: "Inertia matching, thermal drift, duty cycle limitations, and maintenance intervals for high-speed linear positioning.",
    category: "Engineering Selection",
    categorySlug: "engineering-selection",
    readingTimeMinutes: 10,
    publishedDate: "2026-03-27",
    updatedDate: "2026-04-14",
    author: {
      name: "Dr. Arvind Rao",
      role: "Lead Mechanical Systems Architect",
      department: "Precision Transmission Division",
    },
    reviewStatus: "Peer-Reviewed Technical Guideline",
    standardsReferenced: ["ISO 3408-3", "DIN 69051", "VDI 2853"],
    summary:
      "Linear motion selection dictates the throughput, repeatability, and maintenance lifecycle of pick-and-place gantry systems, cleanroom wafer shuttles, and CNC feed axes. This engineering guide compares preloaded recirculating ball screws against ironcore and ironless direct-drive linear motors.",
    tags: ["Ball Screws", "Linear Motors", "Direct Drive", "Positioning Stages", "Inertia Matching", "Duty Cycle"],
    sections: [
      {
        heading: "1. Kinematic Limits: Critical Speed vs Direct-Drive Velocity",
        subheading: "Bypassing ball screw whip and dN value constraints",
        paragraphs: [
          "Precision ground ball screws convert rotary servo torque into linear thrust with high mechanical efficiency (> 90%). However, as stroke lengths exceed 1,500 mm and linear velocities surpass 1.5 m/s, ball screws encounter critical rotational speed limits (screw whip) and internal ball recirculation dN velocity limits.",
          "Linear direct-drive motors eliminate all intermediate mechanical transmission elements: no couplings, no bearings, no screws, and no backlash. The coil assembly (forcer) moves directly along a permanent magnet track. This enables continuous accelerations exceeding 50 m/s² (5g) and linear speeds up to 5 m/s, constrained only by linear guide rail velocity limits and cable track flexibility.",
        ],
        diagramType: "kinematic",
        keyFormulas: [
          {
            label: "Ball Screw Critical Speed (Whip Limit)",
            formula: "n_crit = fk · (d_root / L²) · 10⁷  [rpm]",
            explanation: "Where d_root is root diameter, L is unsupported shaft length, and fk is end mounting factor (Fixed-Fixed = 21.9, Fixed-Supported = 15.1).",
          },
          {
            label: "Linear Motor Thrust Demand",
            formula: "F_total = (m_carriage + m_payload) · a + F_friction + F_process  [N]",
            explanation: "Direct thrust required during acceleration phase. There is zero mechanical advantage, requiring proper coil thermal sizing.",
          },
        ],
        technicalSpecsTable: [
          { label: "Maximum Linear Velocity", value: "Up to 1.5 - 2.0 m/s (Ball Screw) vs Up to 5.0 - 8.0 m/s (Linear Motor)", notes: "Linear motors maintain high velocity over multi-meter travel" },
          { label: "Repeatability", value: "±0.005 mm (Ground Ball Screw) vs ±0.0005 mm (Linear Motor + Optical Scale)", notes: "Direct drive eliminates pitch error, torsional windup, and backlash" },
          { label: "Maximum Stroke Length", value: "Typically < 3,000 mm due to sag vs Unlimited modular magnet tracks (10m+)", notes: "Linear motor tracks can be butt-jointed seamlessly" },
          { label: "Continuous Force Density", value: "High (Multiplied by lead pitch screw ratio) vs Moderate (Requires water cooling above 2,000 N)", notes: "Ball screws excel in heavy axial thrust operations" },
        ],
      },
      {
        heading: "2. Thermal Dissipation and Precision Expansion Drift",
        subheading: "Managing resistive I²R heat generation inside high-precision machine beds",
        paragraphs: [
          "A critical engineering drawback of ironcore linear motors is direct heat dissipation into the machine carriage. High acceleration duty cycles generate significant copper I²R resistive losses in the moving coil, inducing thermal expansion in mounting plates and optical linear scales.",
          "For semiconductor metrology, wafer handling, and sub-micron inspection, INDUS engineers specify ironless linear motors (U-channel design) or forced liquid-cooled ironcore stages with hollow chiller plates to stabilize machine bed temperature within ±0.1°C.",
        ],
        callout: {
          type: "best-practice",
          title: "Vertical Z-Axis Safety Warning",
          text: "Never install a linear motor on a vertical axis without a fail-safe pneumatic counterbalance or permanent magnet holding brake. If power fails, a direct-drive vertical stage drops instantly under gravity with zero mechanical resistance.",
        },
      },
    ],
    relatedProducts: [
      { id: "linear-actuators", name: "High-Thrust Linear Actuators", categorySlug: "actuators", description: "Precision ground ball screw modules with integrated linear guides and servo motors." },
      { id: "electric-actuators", name: "Direct-Drive Electric Actuators", categorySlug: "actuators", description: "Compact rodless and rod-style electric actuators with sub-millimeter repeat accuracy." },
      { id: "pick-and-place-robots", name: "Pick & Place Robots", categorySlug: "robotic-arms", description: "High-speed Cartesian and delta robots engineered for 120 cycles/minute throughput." },
    ],
    relatedResourceIds: ["ds-linear-positioning-actuator", "cat-robotics-overview"],
  },
  {
    id: "art-kinematic-singularities-avoidance",
    slug: "kinematic-singularities-in-6-axis-robots-avoidance-trajectory-planning",
    title: "Kinematic Singularities in 6-Axis Industrial Robots: Mathematical Detection & Trajectory Avoidance",
    subtitle: "Analyzing Wrist, Shoulder, and Elbow singular configurations to prevent joint velocity spikes.",
    category: "Robotics Fundamentals",
    categorySlug: "robotics-fundamentals",
    readingTimeMinutes: 9,
    publishedDate: "2026-04-05",
    updatedDate: "2026-04-15",
    author: {
      name: "Sanjay Patel",
      role: "Industrial Robotics Controls Engineer",
      department: "Kinematics & Motion Planning",
    },
    reviewStatus: "Peer-Reviewed Technical Guideline",
    standardsReferenced: ["ISO 9787", "IEEE Robotics and Automation Magazine"],
    summary:
      "Kinematic singularities occur when the Jacobian matrix of a 6-axis articulated robot loses full rank (det(J) = 0), collapsing a degree of freedom and causing inverse kinematics algorithms to demand infinite angular joint velocity. This technical paper presents practical singularity detection and damped least squares (DLS) avoidance algorithms.",
    tags: ["6-Axis Robots", "Singularities", "Jacobian", "Inverse Kinematics", "Trajectory Planning", "Motion Control"],
    sections: [
      {
        heading: "1. The Three Classical 6-Axis Robotic Singularities",
        subheading: "Wrist, Shoulder, and Elbow alignment geometries",
        paragraphs: [
          "In industrial manipulators, inverse kinematics maps Cartesian end-effector velocities (v, ω) to joint angular velocities (q̇) via the manipulator Jacobian J(q). When det(J(q)) approaches zero, computing q̇ = J⁻¹ · ẋ demands near-infinite joint velocity, triggering servo overcurrent trips or violent physical vibrations.",
          "The three fundamental singular configurations are:",
          "1. Wrist Singularity: Occurs when Joint 4 and Joint 6 axes become collinear (Joint 5 angle = 0°). The robot loses the ability to rotate about the normal to the wrist plane without spinning Joints 4 and 6 at extreme counter-opposed speeds.",
          "2. Shoulder Singularity: Occurs when the wrist center point falls on the vertical centerline of Joint 1. The robot cannot translate sideways in Cartesian space without an instantaneous 180° swing of the heavy base axis.",
          "3. Elbow Singularity: Occurs when the arm is fully extended or fully folded back (wrist center aligns with the upper and lower arm plane). The robot loses radial extension capability.",
        ],
        diagramType: "kinematic",
        keyFormulas: [
          {
            label: "Differential Kinematics Equation",
            formula: "ẋ = J(q) · q̇   =>   q̇ = J(q)⁻¹ · ẋ",
            explanation: "Where ẋ is Cartesian 6-DoF velocity vector and q̇ is 6-axis joint velocity vector.",
          },
          {
            label: "Damped Least Squares (Levenberg-Marquardt) Inverse",
            formula: "J* = Jᵀ · (J · Jᵀ + λ² · I)⁻¹",
            explanation: "Where λ is dynamic damping factor. As det(J) -> 0, λ increases smoothly, trading minor trajectory tracking deviation for finite bounded joint velocities.",
          },
        ],
        callout: {
          type: "note",
          title: "Offline CAM Trajectory Optimization",
          text: "During offline robot cell programming (e.g., in laser cutting or welding paths), tilt the workpiece or tool mounting angle by 5° to 10° relative to the base axis. This simple engineering adjustment keeps Joint 5 away from 0°, eliminating wrist singularity crossings entirely.",
        },
      },
      {
        heading: "2. Real-Time Dynamic Singular Region Blending",
        subheading: "Transitioning smoothly from Cartesian to joint-space interpolation",
        paragraphs: [
          "INDUS robot controllers continuously evaluate the manipulability index w = √(det(J · Jᵀ)). When w drops below a calibrated threshold (w_crit), the trajectory generator automatically engages Damped Least Squares (DLS) or smoothly blends the motion from Cartesian linear (MOVL) to joint interpolation (MOVJ).",
          "This ensures automated continuous welding torches and glue dispensing heads maintain smooth flow without stuttering or tripping servo drive overspeed safety interlocks.",
        ],
      },
    ],
    relatedProducts: [
      { id: "6-axis-robots", name: "6-Axis Articulated Robots", categorySlug: "robotic-arms", description: "Precision multi-axis articulated arms with sub-0.04 mm repeatability." },
      { id: "robot-controllers", name: "Robot Trajectory Controllers", categorySlug: "control-systems", description: "Real-time kinematic kernel with automated singularity avoidance and collision monitoring." },
      { id: "collaborative-robots", name: "Collaborative Robots", categorySlug: "robotic-arms", description: "Power and force limited 6-DoF arms with intuitive lead-through teaching." },
    ],
    relatedResourceIds: ["cat-robotics-overview"],
  },
];
