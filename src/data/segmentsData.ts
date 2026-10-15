/**
 * INDUS Industrial Robotics — Segment-Specific Engineering Solutions Data
 * 
 * Detailed engineering specifications connecting production tasks to:
 * - Required Technology
 * - Mechanical Constraints
 * - Motion Requirements
 * - Control Architecture
 * - Safety Considerations
 * - Verification Methods
 */

export interface ProductionTask {
  taskName: string;
  description: string;
  requiredTechnology: string[];
  mechanicalConstraints: string;
  motionRequirements: string;
  controlArchitecture: string;
  safetyConsiderations: string;
  verificationMethod: string;
  recommendedProductIds: string[];
}

export interface SystemLevelArchitecture {
  mechanicalEnvelope: string;
  fieldbusTopology: string;
  safetyIntegrity: string;
  throughputTarget: string;
}

export interface SegmentSolution {
  id: string;
  slug: string;
  title: string;
  badge: string;
  subtitle: string;
  overview: string;
  keyStandards: string[];
  productionTasks: ProductionTask[];
  systemLevelArchitecture: SystemLevelArchitecture;
}

export const segmentsData: Record<string, SegmentSolution> = {
  "automotive": {
    "id": "automotive",
    "slug": "automotive",
    "title": "Automotive & Electric Vehicle Manufacturing",
    "badge": "High-Throughput Continuous Duty",
    "subtitle": "Connecting Body-in-White welding, EV battery module assembly, and powertrain machining to deterministic multi-axis robotic workcells.",
    "overview": "Modern automotive and EV production demands 24/7 uptime at takt times under 60 seconds. High-strength steel hot stampings, aluminum casting structures, and high-voltage battery modules impose extreme mechanical rigidity requirements, high dynamic inertia absorption, and strict safety zoning for shared human-robot line-side stations.",
    "keyStandards": [
      "ISO 10218-2 Industrial Robot Systems and Integration",
      "ISO 13849-1 Performance Level d/e Safety Interlocks",
      "VDA 6.3 Process Audit Conformance",
      "AWS D16.1M/D16.1 Robotic Arc Welding Safety"
    ],
    "productionTasks": [
      {
        "taskName": "Body-in-White (BIW) High-Duty Spot & Laser Seam Welding",
        "description": "High-speed multi-pass laser welding and servo spot gun welding across stamped galvanized high-strength steel chassis sub-assemblies.",
        "requiredTechnology": [
          "IND-ROB-WLD-1800-A Dedicated Hollow-Wrist Welding Robot",
          "IND-RED-CYC-160-RV High-Shock Cycloidal Pin-Wheel Reducer",
          "Real-Time Optical Seam Tracking Profiler"
        ],
        "mechanicalConstraints": "Cantilevered welding gun mass (18-25 kg) generates dynamic overturning moments exceeding 280 Nm during 2.5 G reorientation maneuvers. Robot link deflections must remain under 0.08 mm under full servo clamp force (4.5 kN).",
        "motionRequirements": "Takt time \u2264 48 s for 38 spot welds. Continuous contouring velocity along seam curves at 25 mm/s \u00b1 0.5 mm/s. Path repeatability \u2264 \u00b10.04 mm according to ISO 9283.",
        "controlArchitecture": "Deterministic EtherCAT / PROFINET IRT fieldbus synchronizing robot trajectory with digital medium-frequency DC welding inverter at 1 ms cycle rate.",
        "safetyConsiderations": "Cell perimeter interlocked with dual-channel Category 4 PLe safety gates, perimeter muting light curtains, and Safe Operating Stop (SOS) during fixture indexing.",
        "verificationMethod": "Calibrated 6-DoF laser tracker dynamic path verification, non-destructive ultrasonic weld bead inspection, and metallurgical cross-section etch testing.",
        "recommendedProductIds": [
          "welding",
          "cycloidal",
          "robot-controllers",
          "handling"
        ]
      },
      {
        "taskName": "EV Prismatic Battery Cell Stacking & Laser Busbar Bonding",
        "description": "High-precision transfer, compressive stacking, and fiber laser busbar welding of lithium-ion prismatic battery cells into structural pack modules.",
        "requiredTechnology": [
          "IND-ARM-6AX-1400-P Precision 6-Axis Articulated Robot",
          "IND-ACT-ELE-063-ISO Force-Regulated Electric Cylinder",
          "Multi-Axis Micro-Laser Scanner"
        ],
        "mechanicalConstraints": "Uniform compressive stacking force (3000 N \u00b1 50 N) across 12-cell groupings to prevent cell pouch expansion and thermal runaway. Cleanroom-compatible grease seals preventing particulate shedding.",
        "motionRequirements": "Sub-millimeter cell placement repeatability (\u00b10.03 mm) to ensure laser busbar weld gaps remain under 25 \u00b5m. Takt time \u2264 1.2 s per individual cell pick-and-place.",
        "controlArchitecture": "Integrated force-displacement monitoring over EtherCAT CoE. Real-time feedback loop transitioning from velocity approach to constant force dwell without overshoot.",
        "safetyConsiderations": "Insulated ceramic/polyoxymethylene gripper jaws tested to 1500 VDC dielectric breakdown. Thermal imaging cameras triggering emergency inert gas flood.",
        "verificationMethod": "Laser triangulation profilometry verifying coplanarity of busbar pads to within 20 \u00b5m; dynamic micro-ohm electrical contact resistance testing.",
        "recommendedProductIds": [
          "6-axis",
          "electric",
          "motion-controllers",
          "servo-drives"
        ]
      },
      {
        "taskName": "Powertrain Engine & Gearbox Heavy Machining CNC Tending",
        "description": "Automated loading and unloading of raw cast-iron cylinder heads and transmission housings into 5-axis horizontal CNC machining centers.",
        "requiredTechnology": [
          "IND-ROB-HND-2100-H Heavy-Duty Handling Robot",
          "IND-RED-IND-220-RA Right-Angle Heavy Servo Gearbox",
          "Dual-Chuck Pneumatic Expansion Gripper"
        ],
        "mechanicalConstraints": "Handling raw 38kg engine block castings exposed to high-pressure oil/coolant spray (IP67 enclosure required). Machine door clearance restricts robot elbow sweep envelope to < 1100 mm.",
        "motionRequirements": "Rapid machine load/unload exchange time \u2264 8.5 s to maximize CNC spindle utilization. Smooth S-curve deceleration to eliminate chuck seating bounce.",
        "controlArchitecture": "PROFINET IO Device handshake with CNC Siemens 840D / Fanuc CNC controller, verifying pneumatic part-seat backpressure sensors before cycle start.",
        "safetyConsiderations": "Safe Torque Off (STO) and Safely-Limited Speed (SLS) active during manual tool-wear inspection; interlocked automatic pneumatic chip-guard splash doors.",
        "verificationMethod": "Air-gage dimensional seating verification confirming casting rests firmly against locating pins with zero gap (< 5 \u00b5m air leakage threshold).",
        "recommendedProductIds": [
          "handling",
          "gearboxes",
          "robot-controllers",
          "cycloidal"
        ]
      }
    ],
    "systemLevelArchitecture": {
      "mechanicalEnvelope": "Overhead gantry and floor pedestal mounts with reinforced concrete vibration dampening foundations (min 300mm slab thickness).",
      "fieldbusTopology": "Redundant ring PROFINET IRT / EtherCAT master topology with distributed clock synchronization under 500 ns.",
      "safetyIntegrity": "T\u00dcV Rheinland certified dual-channel SIL 3 / Cat 4 PLe safety architecture with CIP Safety and integrated safety PLC.",
      "throughputTarget": "Line takt times 45 - 60 seconds; overall equipment effectiveness (OEE) target \u2265 92.5% across 3 shifts."
    }
  },
  "electronics": {
    "id": "electronics",
    "slug": "electronics",
    "title": "Electronics & Semiconductor Assembly",
    "badge": "Sub-Micron Precision & Cleanroom",
    "subtitle": "Micro-precision SCARA and collaborative robotics engineered for PCB surface-mount assembly, wafer handling, and cleanroom test inspection.",
    "overview": "The electronics manufacturing sector demands ultra-fast cycle rates, zero electrostatic discharge (ESD) risks, cleanroom particulate containment (ISO Class 5), and sub-millimeter insertion precision. Our solutions eliminate mechanical vibration, provide closed-loop force sensing for micro-connectors, and interface seamlessly with high-speed optical vision inspection cameras.",
    "keyStandards": [
      "ISO 14644-1 Cleanrooms and Associated Controlled Environments (Class 5)",
      "ANSI/ESD S20.20 Electrostatic Discharge Control Standard",
      "IPC-A-610 Acceptability of Electronic Assemblies",
      "SEMI S2 Environmental, Health, and Safety Guideline for Semiconductor Equipment"
    ],
    "productionTasks": [
      {
        "taskName": "High-Density BGA Component Pick-and-Place with 2D/3D Vision",
        "description": "High-speed picking of fragile ball grid array (BGA) and multi-chip modules from tape-and-reel feeders and placement onto PCB solder paste pads.",
        "requiredTechnology": [
          "IND-ARM-SCA-600-H High-Speed SCARA 4-Axis Robot",
          "IND-ACT-LIN-200-B Precision Guided Linear Module",
          "GigE Vision Direct Coaxial Optical Camera"
        ],
        "mechanicalConstraints": "Quill tip deflection must remain below 8 \u00b5m under full travel. Conductive ESD dissipative vacuum nozzles with surface resistivity between 10^6 and 10^9 ohms/sq.",
        "motionRequirements": "Placement cycle time \u2264 0.38 s per component. Placement accuracy \u00b10.015 mm with rotational orientation alignment to \u00b10.005\u00b0.",
        "controlArchitecture": "Hardware registration position latch (< 1 \u00b5s latency) triggering synchronized camera strobes on-the-fly without coming to a complete stop.",
        "safetyConsiderations": "Fully enclosed clear polycarbonate safety cell with interlocked optical access windows, Category 3 safety relays, and ionized anti-static air curtains.",
        "verificationMethod": "Automated Optical Inspection (AOI) with structured blue LED illumination verifying solder paste co-planarity and component lead offset.",
        "recommendedProductIds": [
          "4-axis",
          "linear",
          "motion-controllers",
          "sensors-feedback"
        ]
      },
      {
        "taskName": "Precision Force-Controlled Micro-Connector Mating",
        "description": "Zero-defect mechanical insertion of flexible printed circuits (FPC) and delicate multi-pin wiring harness headers into automotive electronic control units.",
        "requiredTechnology": [
          "IND-ROB-ASM-085-H Force-Guided Assembly Robot",
          "IND-SNS-ENC-026-BC 26-bit Absolute Optical Encoder",
          "Multi-Axis Micro Force-Torque Sensor"
        ],
        "mechanicalConstraints": "Pin clearances down to 15 \u00b5m. Tooling mass strictly limited to < 1.2 kg to maximize force transducer sensitivity and eliminate inertia masking.",
        "motionRequirements": "Compliant insertion speed 5 mm/s with force threshold trip response < 5 ms if contact force exceeds 12.5 N.",
        "controlArchitecture": "Active impedance control loop executing on real-time Linux RTOS at 500 \u00b5s update rate, actively executing spiral search trajectories upon micro-misalignment.",
        "safetyConsiderations": "Low-power collaborative force thresholds (ISO/TS 15066) permitting open access workcells without safety fencing.",
        "verificationMethod": "Dual-curve force-displacement signature qualification verifying tactile click confirmation and terminal retention latching.",
        "recommendedProductIds": [
          "assembly",
          "sensors-feedback",
          "robot-controllers",
          "servo-drives"
        ]
      },
      {
        "taskName": "Semiconductor Silicon Wafer Cassette FOUP Transfer",
        "description": "Cleanroom transfer of 300mm silicon wafers between front-opening unified pods (FOUPs) and vacuum process chambers.",
        "requiredTechnology": [
          "IND-ACT-ROT-140-DD Hollow Direct-Drive Rotary Actuator",
          "IND-RED-HMC-025-CS Zero-Backlash Strain Wave Reducer",
          "Vacuum Ceramic End-Effector Paddle"
        ],
        "mechanicalConstraints": "Strict ISO Class 4 particulate emission limit (< 10 particles of size \u2265 0.5 \u00b5m per cubic foot). Zero oil lubrication mist: vacuum-baked grease and magnetic fluid seals.",
        "motionRequirements": "Ultra-smooth jerk-free S-curve trajectory with maximum vibration acceleration < 0.05 G to prevent wafer micro-scratching or slip off ceramic pins.",
        "controlArchitecture": "Direct drive servo loop with notch filtering tuning out structural arm resonance frequencies at 18 Hz and 42 Hz.",
        "safetyConsiderations": "Interlocked vacuum sensor confirming minimum negative pressure (-85 kPa) before wafer lift arm acceleration begins.",
        "verificationMethod": "Optical wafer edge-grip sensor verification and laser particle counter sampling downstream of the manipulator wrist.",
        "recommendedProductIds": [
          "rotary",
          "harmonic",
          "servo-drives",
          "motion-controllers"
        ]
      }
    ],
    "systemLevelArchitecture": {
      "mechanicalEnvelope": "Vibration-isolated optical breadboard and cleanroom ceiling-mount HEPA laminar flow fan filter units (FFU).",
      "fieldbusTopology": "EtherCAT CoE real-time bus with deterministic motion cycles down to 250 \u00b5s and IEEE 1588 time synchronization.",
      "safetyIntegrity": "SEMI S2 compliant safety interlock loops with automatic power cutoffs and redundant vacuum retention reservoirs.",
      "throughputTarget": "Placement rates up to 10,000 components per hour (CPH); zero-defect yield rate \u2265 99.98%."
    }
  },
  "manufacturing": {
    "id": "manufacturing",
    "slug": "manufacturing",
    "title": "Precision Manufacturing & Metal Processing",
    "badge": "High Rigidity & Heavy Duty",
    "subtitle": "High-stiffness industrial robotics engineered for CNC milling tending, robotic deburring, press brake bending, and heavy metal fabrication.",
    "overview": "Precision metal manufacturing environments expose automation components to intense cutting forces, abrasive swarf, hot metal chips, and aggressive chemical cutting fluids. Our solutions combine heavy cast-iron kinematic links, high-shock cycloidal gearing, sealed IP67 drive enclosures, and active compliance control.",
    "keyStandards": [
      "ISO 12100 Safety of Machinery - General Principles for Design",
      "ISO 10218-1 Robots for Industrial Environments",
      "ISO 9409-1 Manipulating Industrial Robots - Mechanical Interfaces",
      "DIN 3990 Calculation of Load Capacity of Cylindrical Gears"
    ],
    "productionTasks": [
      {
        "taskName": "Automated 5-Axis CNC Milling Part Loading & Chip Washdown",
        "description": "Continuous loading of heavy forged steel billets into high-precision hydraulic vises inside CNC machining centers with automated coolant blow-off.",
        "requiredTechnology": [
          "IND-ROB-HND-2100-H Heavy-Duty Handling Robot",
          "IND-RED-CYC-160-RV Cycloidal Pin-Wheel Reducer",
          "IP67 Sealed Dual-Grip Chuck Tooling"
        ],
        "mechanicalConstraints": "Severe splashing of synthetic water-soluble cutting emulsions (pH 8.5-9.5). Robot wrist must endure continuous immersion in coolant spray (IP67).",
        "motionRequirements": "Billet loading cycle time \u2264 12 s including air-blast door sequence. Position repeatability \u00b10.04 mm to ensure seating against carbide locators.",
        "controlArchitecture": "PROFINET IRT / EtherNet/IP handshake with machine tool CNC, polling automatic chuck clamp pressure sensors and door interlock state.",
        "safetyConsiderations": "Cell light curtains equipped with optical mute sensors allowing pallet entry while halting robot during operator spindle inspection.",
        "verificationMethod": "Differential pneumatic back-pressure seat confirmation sensors detecting gaps > 10 \u00b5m between workpiece and locating stops.",
        "recommendedProductIds": [
          "handling",
          "cycloidal",
          "robot-controllers",
          "gearboxes"
        ]
      },
      {
        "taskName": "Robotic Constant-Force Deburring & Chamfering",
        "description": "Contour deburring, edge blending, and weld seam grinding across complex cast iron and aluminum engine blocks using pneumatic compliant grinding spindles.",
        "requiredTechnology": [
          "IND-ARM-6AX-1400-P 6-Axis Articulated Robot",
          "IND-ACT-SRV-090-INT Smart Servo Actuator",
          "Pneumatic Radial/Axial Compliant Spindle"
        ],
        "mechanicalConstraints": "High continuous vibration feedback (150-300 Hz) transmitted from abrasive carbide burrs into robot wrist. Requires high-rigidity cycloidal and strain wave stages.",
        "motionRequirements": "Contour tracking speed 15 - 50 mm/s with path accuracy \u00b10.05 mm along complex 3D spline trajectories.",
        "controlArchitecture": "Robot controller executes 3D spline interpolation with programmed tangential tool orientation to maintain constant contact angle.",
        "safetyConsiderations": "High-volume dust collection shroud with spark arrestor; heavy steel perimeter enclosure with laminated safety glass viewing ports.",
        "verificationMethod": "Post-process 3D laser profiler verifying chamfer width (1.5 mm \u00b1 0.1 mm) and surface roughness Ra < 3.2 \u00b5m.",
        "recommendedProductIds": [
          "6-axis",
          "servo",
          "robot-controllers",
          "sensors-feedback"
        ]
      },
      {
        "taskName": "Automated Sheet Metal Press Brake Tending & Bending",
        "description": "Synchronized following and bending support for large sheet metal panels during press brake hydraulic down-stroke.",
        "requiredTechnology": [
          "IND-ROB-HND-2100-H Heavy Handling Robot",
          "IND-ACT-LIN-200-B Heavy Linear Transfer Axis (7th Axis Track)",
          "Vacuum Suction Cup End-Effector Array"
        ],
        "mechanicalConstraints": "Dynamic upward panel bending generates continuous reaction arc. Robot wrist must follow sheet angle smoothly without introducing buckling stress.",
        "motionRequirements": "Real-time trajectory synchronization with press brake punch speed (10 - 25 mm/s) over bend angles from 0\u00b0 to 135\u00b0.",
        "controlArchitecture": "Direct encoder feedback connection between hydraulic press ram position and robot trajectory generator over EtherCAT fieldbus.",
        "safetyConsiderations": "Pneumatic vacuum backup accumulator providing 30 seconds of suction holding power in event of main electrical or shop air failure.",
        "verificationMethod": "Optical angle measurement sensor verifying bend angle within \u00b10.5\u00b0 across the full 2000mm sheet length.",
        "recommendedProductIds": [
          "handling",
          "linear",
          "robot-controllers",
          "cycloidal"
        ]
      }
    ],
    "systemLevelArchitecture": {
      "mechanicalEnvelope": "Heavy tubular steel floor frameworks with leveling jack screws anchored by M24 chemical anchors into industrial concrete.",
      "fieldbusTopology": "Fieldbus ring combining EtherCAT for high-bandwidth drives and PROFINET for machine tool CNC communications.",
      "safetyIntegrity": "Full compliance with ISO 13849-1 PL d safety circuits including emergency stop circuits and electro-sensitive safety fences.",
      "throughputTarget": "Continuous 3-shift operation with mean time between failures (MTBF) exceeding 45,000 operational hours."
    }
  },
  "warehousing-logistics": {
    "id": "warehousing-logistics",
    "slug": "warehousing-logistics",
    "title": "Warehousing & Autonomous Intralogistics",
    "badge": "Autonomous Mobile & High-Throughput",
    "subtitle": "Connecting AGVs, autonomous swerve-drive AMRs, and high-rate robotic palletizers into synchronized warehouse fulfillment pipelines.",
    "overview": "E-commerce and modern omnichannel distribution centers require flexible, autonomous intralogistics capable of handling mixed-SKU pallets, dynamic aisle navigation, and high-speed box sortation. Our technologies power heavy-payload AMRs, omnidirectional mobile chassis, and heavy-duty 4-axis palletizing robots.",
    "keyStandards": [
      "ISO 3691-4 Safety of Driverless Industrial Trucks and Mobile Robots",
      "ANSI/ITSDF B56.5 Safety Standard for Guided Industrial Vehicles",
      "VDI 2198 Type Sheets for Industrial Trucks",
      "EN 619 Continuous Handling Equipment and Systems"
    ],
    "productionTasks": [
      {
        "taskName": "Autonomous Pallet Transport & Dynamic Aisle AMR Navigation",
        "description": "Point-to-point transfer of loaded Euro and GMA pallets (up to 1200kg) between receiving docks, automated racking, and packing stations.",
        "requiredTechnology": [
          "IND-MOD-SWR-300-SD Dual-Servo Swerve Drive AMR Module",
          "IND-WHL-DRV-200-BLDC In-Hub Planetary AGV Drive Wheel",
          "Dual Safety LiDAR Navigation Scanners"
        ],
        "mechanicalConstraints": "Vehicle height constrained to < 220 mm to drive beneath standard pallet transfer stands. Dynamic radial wheel load up to 600 kg per wheel module.",
        "motionRequirements": "Maximum travel velocity 2.2 m/s on straight warehouse lanes; 0.8 m/s during zero-radius swerve crab turns. Positioning repeatability at docking station \u00b15 mm.",
        "controlArchitecture": "ROS 2 Navigation Stack running on industrial x86 computer, commanding dual swerve modules over 1 ms EtherCAT CoE loop.",
        "safetyConsiderations": "Dual 360\u00b0 Safety LiDAR scanners switching safety fields based on vehicle speed, complying with ISO 3691-4 automatic stopping distances.",
        "verificationMethod": "Laser distance sensor docking verification and dynamic decel brake distance testing under maximum 1200kg load.",
        "recommendedProductIds": [
          "mobile-modules",
          "drive",
          "servo-drives",
          "motion-controllers"
        ]
      },
      {
        "taskName": "High-Throughput Case & Crate End-of-Line Palletizing",
        "description": "Continuous sorting and stacking of corrugated cartons, shrink-wrapped beverage bundles, and plastic crates onto wooden pallets at rates up to 1200 cycles/hour.",
        "requiredTechnology": [
          "IND-ROB-PAL-3100-H 4-Axis Heavy Palletizing Robot",
          "IND-RED-CYC-160-RV High-Shock Cycloidal Pin-Wheel Reducer",
          "High-Flow Large-Area Foam Vacuum Gripper"
        ],
        "mechanicalConstraints": "Combined carton layer weight + vacuum gripper mass up to 120kg. Arm reach must span 3150mm across dual pallet build stations.",
        "motionRequirements": "Palletizing cycle time \u2264 3.0 s per pick-and-place cycle. Maximum pallet stack height up to 2400 mm.",
        "controlArchitecture": "Dedicated pallet pattern software running on controller, calculating layer configurations, slip-sheet placement, and box barcode orientation.",
        "safetyConsiderations": "Muting light curtains allowing pallet exit while preventing human entry; emergency stop interlocks coupled to spring-applied motor brakes.",
        "verificationMethod": "3D time-of-flight optical camera verifying finished pallet stack stability, overhang limits (< 15 mm), and corner alignment.",
        "recommendedProductIds": [
          "palletizing",
          "cycloidal",
          "robot-controllers",
          "servo-drives"
        ]
      },
      {
        "taskName": "Omnidirectional Tote Shuttling in Tight Mezzanine Aisles",
        "description": "High-agility autonomous shuttling of plastic totes and micro-bins across narrow mezzanine aisles with zero turning radius.",
        "requiredTechnology": [
          "IND-WHL-MEC-204-HD Heavy-Duty Mecanum Wheel Set",
          "IND-WHL-OMN-150-SS Stainless Omni Wheel",
          "Compact 48V Low-Voltage Servo Drives"
        ],
        "mechanicalConstraints": "Aisle clearance limited to vehicle width + 100mm. Requires pure lateral strafing capability without chassis pivoting.",
        "motionRequirements": "Continuous speed 1.5 m/s forward and 1.0 m/s lateral strafing. Acceleration rate 1.2 m/s\u00b2.",
        "controlArchitecture": "4-wheel synchronized velocity control matrix over CANopen DS402 fieldbus.",
        "safetyConsiderations": "Bump-sensitive mechanical safety edges combined with ultrasonic proximity sensors for short-range obstacle detection.",
        "verificationMethod": "Optical floor grid odometry calibration verifying lateral position drift < 2 mm per 10 meters of travel.",
        "recommendedProductIds": [
          "mecanum",
          "omni",
          "servo-drives",
          "motion-controllers"
        ]
      }
    ],
    "systemLevelArchitecture": {
      "mechanicalEnvelope": "Low-profile welded steel AMR chassis frames and heavy structural floor-anchored palletizer plinths.",
      "fieldbusTopology": "High-reliability industrial Wi-Fi / Private 5G connecting mobile fleets to central Warehouse Management System (WMS).",
      "safetyIntegrity": "Certified ISO 3691-4 mobile safety architecture integrating safety PLCs, safety encoders, and dynamic LiDAR scanners.",
      "throughputTarget": "Fleet operating efficiency \u2265 99.2% uptime with automated high-rate battery charging contacts."
    }
  },
  "food-packaging": {
    "id": "food-packaging",
    "slug": "food-packaging",
    "title": "Food, Beverage & Sanitary Packaging",
    "badge": "Hygienic Washdown & High Speed",
    "subtitle": "FDA-compliant stainless robotics engineered for direct food contact, sanitary washdown, delta pick-and-place, and case packing.",
    "overview": "Food and beverage packaging environments demand ultra-high cycle speeds, non-toxic food-grade lubricants (NSF H1), corrosion-resistant stainless materials, and IP69K washdown resistance to endure high-pressure caustic chemical clean-in-place (CIP) regimens. Our solutions prevent bacterial harborage, deliver gentle food handling, and execute high-speed carton loading.",
    "keyStandards": [
      "EN 1672-2 Food Processing Machinery - Basic Concepts - Hygiene Requirements",
      "FDA 21 CFR 177 Food Contact Polymers and Elastomers",
      "3-A Sanitary Standards for Processing Equipment",
      "EHEDG Guidelines for Hygienic Design of Equipment"
    ],
    "productionTasks": [
      {
        "taskName": "High-Speed Primary Food Sorting & Flow-Wrapper Feeding",
        "description": "Picking randomly oriented baked goods, snack bars, chocolates, or frozen items from washdown conveyor belts and indexing into flow-wrapper pockets.",
        "requiredTechnology": [
          "IND-ARM-DLT-1200-F High-Speed Parallel Delta Robot",
          "IND-ACT-LIN-200-B Sanitary Linear Actuator",
          "FDA Compliant Silicone Soft Suction Cups"
        ],
        "mechanicalConstraints": "Hygienic design: smooth spherical joint housings without crevices, unthreaded smooth titanium rods, and 316L stainless hardware preventing food debris traps.",
        "motionRequirements": "Ultra-fast pick rate: up to 180 picks per minute per robot. Dynamic belt tracking over conveyor speeds up to 45 m/min.",
        "controlArchitecture": "High-speed conveyor tracking software with gigabit vision camera capturing part centroid and rotation angle on-the-fly.",
        "safetyConsiderations": "Washdown stainless steel frame enclosure with shatterproof polycarbonate panels; magnetic coded safety door switches (IP67).",
        "verificationMethod": "High-speed vision inspection verifying zero product surface bruising and 100% wrapper pocket fill rate.",
        "recommendedProductIds": [
          "pick-and-place",
          "linear",
          "robot-controllers",
          "servo-drives"
        ]
      },
      {
        "taskName": "Secondary Carton Loading & Blister Pack Collation",
        "description": "Collating individually wrapped pouches, sachets, or pharmaceutical blister packs and loading them into cartons or display trays.",
        "requiredTechnology": [
          "IND-ARM-SCA-600-H Cleanroom SCARA 4-Axis Robot",
          "IND-ACT-ELE-063-ISO Electric Cylinder Pusher",
          "Multi-Up Mechanical Gripper Head"
        ],
        "mechanicalConstraints": "Multi-up gripper picking 4 items simultaneously. Total gripper tooling mass < 2.5 kg to maintain high Z-axis acceleration.",
        "motionRequirements": "Carton load cycle time \u2264 1.1 s per 4-pack grouping. Vertical placement accuracy \u00b10.05 mm.",
        "controlArchitecture": "EtherCAT CoE bus synchronizing SCARA Cartesian paths with indexing carton conveyor belts.",
        "safetyConsiderations": "Food-grade NSF H1 synthetic grease lubrication throughout all robot joints and ball screw splines.",
        "verificationMethod": "Checkweigher dynamic mass verification and barcode optical scanner checking carton lot code readability.",
        "recommendedProductIds": [
          "4-axis",
          "electric",
          "motion-controllers",
          "servo-drives"
        ]
      },
      {
        "taskName": "Corrosive Washdown Pouch Pumping & CIP Valve Actuation",
        "description": "Automated clean-in-place (CIP) sanitary valve cycling and liquid food pouch filling under high-pressure chemical washdown.",
        "requiredTechnology": [
          "IND-ACT-ELE-063-ISO Stainless Electric Cylinder",
          "IND-CTL-PLC-61131 Modular Industrial Automation Controller",
          "Sanitary Tri-Clamp Mechanical Interface"
        ],
        "mechanicalConstraints": "IP69K protection rating: capable of withstanding 100 bar water jet at 80\u00b0C with sodium hydroxide (NaOH) cleaning solutions.",
        "motionRequirements": "Smooth programmable metering velocity stroke with precise force hold to prevent pouch burst during seal crimping.",
        "controlArchitecture": "IEC 61131-3 logic sequencing valve timing with pneumatic purge and clean-in-place chemical flush cycles.",
        "safetyConsiderations": "Pressure relief burst discs and dual-channel safety interlocks preventing valve opening while chemical line is pressurized.",
        "verificationMethod": "Pressure decay leak testing confirming zero seal leakage over 100,000 continuous cycling strokes.",
        "recommendedProductIds": [
          "electric",
          "plc-automation",
          "sensors-feedback",
          "linear"
        ]
      }
    ],
    "systemLevelArchitecture": {
      "mechanicalEnvelope": "304/316L stainless steel tubular open-channel frameworks designed with 15\u00b0 shed angles to facilitate complete washdown drainage.",
      "fieldbusTopology": "EtherCAT IP67 fieldbus box modules eliminating cabinet wire runs inside the wet washdown production zone.",
      "safetyIntegrity": "IP69K rated stainless emergency stop pushbuttons and safety light curtains with heated desiccant lenses preventing condensation blinding.",
      "throughputTarget": "Line speeds up to 600 packaged food items per minute; CIP changeover turnaround under 20 minutes."
    }
  },
  "inspection-quality": {
    "id": "inspection-quality",
    "slug": "inspection-quality",
    "title": "Inspection & Metrology Quality Control",
    "badge": "Metrology-Grade & Zero Vibration",
    "subtitle": "Sub-micron optical metrology, 3D laser scanning, automated ultrasonic NDT, and coordinate measuring inspection cells.",
    "overview": "Automated in-line quality assurance demands volumetric accuracy, zero-vibration mechanical stabilization, deterministic hardware camera triggering, and seamless CAD model deviation comparisons. Our solutions combine thermally stabilized robot castings, sub-arcminute harmonic drives, 26-bit optical encoders, and high-speed vision synchronization.",
    "keyStandards": [
      "ISO 10360-8 Acceptance and Reverification Tests for Coordinate Measuring Machines",
      "ISO 9283 Manipulating Industrial Robots - Performance Criteria",
      "VDI/VDE 2634 Optical 3D Measuring Systems",
      "ISO 17025 General Requirements for the Competence of Testing and Calibration Laboratories"
    ],
    "productionTasks": [
      {
        "taskName": "Automated In-Line 3D Laser Scanning of Car Body Geometries",
        "description": "High-density 3D surface scanning of automotive door assemblies, hood panels, and body-in-white structures against master CAD models.",
        "requiredTechnology": [
          "IND-ROB-INS-1200-M Metrology-Grade Inspection Robot",
          "IND-RED-HMC-025-CS Zero-Backlash Strain Wave Reducer",
          "Blue Light High-Resolution 3D Optical Scanner"
        ],
        "mechanicalConstraints": "Ultra-low vibration: settling time < 120 ms to achieve stable optical fringe projection. Thermally compensated robot links minimizing thermal drift (< 3.5 \u00b5m/\u00b0C).",
        "motionRequirements": "Constant velocity scan passes at 500 mm/s with path deviation < 0.05 mm. Multi-pose inspection covering 64 inspection viewpoints in under 45 seconds.",
        "controlArchitecture": "Hardware position-based output trigger (< 1 \u00b5s pulse) synchronizing laser line capture with robot joint position latch registers.",
        "safetyConsiderations": "Class 2M / 3R laser safety zoning with filtered interlocked enclosure glass and personnel safety scanner perimeter protection.",
        "verificationMethod": "Daily calibration against carbon-fiber certified ball-bar length artifact (ISO 10360-8) confirming volumetric length error < 35 \u00b5m.",
        "recommendedProductIds": [
          "inspection",
          "harmonic",
          "sensors-feedback",
          "robot-controllers"
        ]
      },
      {
        "taskName": "Automated Non-Destructive Ultrasonic Testing (NDT) of Composite Aerostructures",
        "description": "Automated phased-array ultrasonic water-squirter scanning across carbon-fiber aircraft wing skins and fuselage stiffeners to detect internal delaminations.",
        "requiredTechnology": [
          "IND-ARM-6AX-1400-P Precision 6-Axis Robot",
          "IND-ACT-LIN-200-B Extended Linear Gantry Rail (7th Axis)",
          "Phased Array Ultrasonic Water-Coupled Probe"
        ],
        "mechanicalConstraints": "Normal incident acoustic beam alignment: probe face must remain strictly perpendicular to curved aerodynamic surfaces within \u00b10.25\u00b0.",
        "motionRequirements": "Continuous raster scan indexing at 150 mm/s with 1.0 mm index step across 4000 mm aerospace component lengths.",
        "controlArchitecture": "Real-time surface normal calculation algorithm feeding tool orientation vector into robot kinematic engine over EtherCAT CoE.",
        "safetyConsiderations": "Pneumatic water collection troughs with recirculating filtration; perimeter safety fences with dual-channel category 4 interlocks.",
        "verificationMethod": "Standard test block with artificial flat-bottom holes (FBH \u00d81.0 mm) validating 100% acoustic flaw detection sensitivity.",
        "recommendedProductIds": [
          "6-axis",
          "linear",
          "motion-controllers",
          "servo-drives"
        ]
      },
      {
        "taskName": "Precision Gap-and-Flush Measurement on Assembly Lines",
        "description": "Continuous high-speed measurement of vehicle exterior seams (headlamp to fender, door to pillar) verifying flushness and gap tolerances.",
        "requiredTechnology": [
          "IND-ARM-COB-1000-C Collaborative Robot Arm",
          "IND-ACT-ROT-140-DD Direct-Drive Rotary Actuator",
          "Laser Caliper Line Measurement Head"
        ],
        "mechanicalConstraints": "Line-side collaborative envelope: compact arm mounting directly on automated mobile platform or pedestal alongside moving vehicle skids.",
        "motionRequirements": "Conveyor tracking synchronization matching car body transfer speed (80 - 150 mm/s) while taking 24 measurement points along vehicle beltline.",
        "controlArchitecture": "Dynamic conveyor line tracking card with high-speed encoder input synchronizing collaborative robot TCP with assembly skid carrier.",
        "safetyConsiderations": "ISO/TS 15066 collaborative power and force limiting ensuring robot arm ceases motion upon inadvertent operator contact (< 65 N threshold).",
        "verificationMethod": "Calibrated stepped gauge block master check verifying gap measurement repeatability within \u00b10.02 mm and flushness to \u00b10.03 mm.",
        "recommendedProductIds": [
          "collaborative",
          "rotary",
          "robot-controllers",
          "sensors-feedback"
        ]
      }
    ],
    "systemLevelArchitecture": {
      "mechanicalEnvelope": "Granite surface plates or vibration-isolated structural steel pedestals decoupled from plant floor vibrations.",
      "fieldbusTopology": "Deterministic IEEE 1588 PTP (Precision Time Protocol) over Gigabit Ethernet synchronizing sensor capture with robot pose.",
      "safetyIntegrity": "Full compliance with optical safety standards (IEC 60825-1 Laser Safety) and machinery safety directives (ISO 13849-1).",
      "throughputTarget": "100% in-line quality verification replacing batch statistical sampling with complete digital twin traceability."
    }
  }
};

export const getSegmentSolution = (id: string): SegmentSolution | undefined => {
  if (segmentsData[id]) return segmentsData[id];
  const normalized = id.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normalized === "warehousing" || normalized === "logistics" || normalized === "warehousinglogistics") {
    return segmentsData["warehousing-logistics"];
  }
  if (normalized === "inspection" || normalized === "quality" || normalized === "inspectionquality") {
    return segmentsData["inspection-quality"];
  }
  if (normalized === "food" || normalized === "packaging" || normalized === "foodpackaging") {
    return segmentsData["food-packaging"];
  }
  return undefined;
};

export const getAllSegmentSolutions = (): SegmentSolution[] => {
  return Object.values(segmentsData);
};
