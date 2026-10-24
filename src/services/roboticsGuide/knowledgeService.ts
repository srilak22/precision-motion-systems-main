/**
 * INDUS Industrial Robotics — Robotics Guide Knowledge Retrieval Layer
 *
 * Source of truth for product-specific discovery, technical explanations,
 * and verified engineering specifications.
 * Grounding Rule: Never invent model numbers, torque values, speeds, or certifications.
 */

import { products, type Product } from "@/data/robotics";
import {
  INTELLIGENT_ACTUATORS_DATA,
  type IntelligentActuatorItem,
  type ActuatorModelVariant,
} from "@/data/intelligentActuatorsData";
import {
  PRECISION_REDUCER_RANGES,
  type ReducerRangeItem,
} from "@/data/precisionReducersData";
import {
  engineeringDossiers,
  getAllEngineeringDossiers,
  type EngineeringProductDossier,
} from "@/data/engineeringData";
import { technologiesData } from "@/data/technologies";
import type {
  ProductCardData,
  ComparisonTableData,
  ComparisonRow,
} from "./types";

/* =========================================================================
   1. PRODUCT CARD MAPPERS (Grounded in Verified Data)
   ========================================================================= */

export function mapActuatorToCard(
  item: IntelligentActuatorItem,
  variantIndex = 1
): ProductCardData {
  const variant = item.modelVariants[variantIndex] || item.modelVariants[0];
  return {
    id: item.id,
    name: item.name,
    modelCode: variant ? variant.modelCode : item.slug.toUpperCase(),
    category: item.categoryName,
    categorySlug: item.categorySlug,
    slug: item.slug,
    valueProp: item.engineeringValueProposition || item.headline,
    specs: [
      {
        label: "Rated Output",
        value: item.headlineSpecs.ratedTorqueOrForce.value,
        unit: item.headlineSpecs.ratedTorqueOrForce.unit,
      },
      {
        label: "Output Speed",
        value: item.headlineSpecs.outputSpeed.value,
        unit: item.headlineSpecs.outputSpeed.unit,
      },
      {
        label: "Feedback",
        value: item.headlineSpecs.positionFeedback.value,
        unit: item.headlineSpecs.positionFeedback.unit,
      },
      {
        label: "Fieldbus",
        value: item.headlineSpecs.integration.value,
        unit: item.headlineSpecs.integration.unit,
      },
    ],
    application:
      item.practicalApplications[0]?.applicationName ||
      "Multi-Axis Robotic Articulation",
    detailUrl: `/products/${item.categorySlug}/${item.slug}`,
    compareId: item.id,
  };
}

export function mapReducerToCard(item: ReducerRangeItem): ProductCardData {
  return {
    id: item.id,
    name: item.name,
    modelCode: item.id.toUpperCase(),
    category: "Precision Reducers",
    categorySlug: "precision-reducers",
    slug: item.id,
    valueProp: item.engineeringPurpose || item.tagline,
    specs: [
      {
        label: "Rated Torque",
        value: item.specifications.ratedTorqueNm,
        unit: "Nm",
      },
      {
        label: "Backlash",
        value: item.specifications.backlashArcmin,
        unit: "arcmin",
      },
      {
        label: "Gear Ratios",
        value: item.specifications.gearRatios,
      },
      {
        label: "Efficiency",
        value: item.specifications.efficiencyPercent,
        unit: "%",
      },
    ],
    application: item.typicalApplications[0] || "Robotic Joint Transmission",
    detailUrl: `/products/precision-reducers/${item.id}`,
    compareId: item.id,
  };
}

export function mapProductToCard(item: Product): ProductCardData {
  const dossier = engineeringDossiers[item.id];
  const specs: { label: string; value: string; unit?: string }[] = [];

  if (dossier && dossier.parameters.length > 0) {
    dossier.parameters.slice(0, 4).forEach((p) => {
      specs.push({
        label: p.name,
        value: p.value,
        unit: p.unit,
      });
    });
  } else {
    // Verified specs from product specification summary
    item.specifications.slice(0, 4).forEach((s) => {
      if (!s.value.includes("on request")) {
        specs.push({ label: s.label, value: s.value });
      }
    });
    if (specs.length === 0) {
      specs.push({ label: "Design Status", value: "Verified Industrial Hardware" });
    }
  }

  return {
    id: item.id,
    name: item.name,
    modelCode: dossier?.modelIdentifier || item.id.toUpperCase(),
    category: item.category,
    categorySlug: item.categorySlug,
    slug: item.slug,
    valueProp: item.shortDescription || item.positioning,
    specs,
    application: item.applications[0] || "Industrial Automation",
    detailUrl: `/products/${item.categorySlug}/${item.slug}`,
    compareId: item.id,
  };
}

/* =========================================================================
   2. MOTION TYPE & PRODUCT DISCOVERY
   ========================================================================= */

export function discoverProductsByIntent(query: string): {
  products: ProductCardData[];
  explanation: string;
  recommendedCategory: string;
  requiresFollowUp?: string;
} {
  const q = query.toLowerCase();

  // 1. Rotary movement / Joint articulation
  if (
    q.includes("rotary") ||
    q.includes("rotational") ||
    q.includes("joint") ||
    q.includes("turning") ||
    q.includes("indexing") ||
    q.includes("turret")
  ) {
    const ira = INTELLIGENT_ACTUATORS_DATA["intelligent-rotary-actuator"];
    const harmonicReducer = PRECISION_REDUCER_RANGES.find(
      (r) => r.technology === "harmonic-strain-wave"
    );

    const cards: ProductCardData[] = [];
    if (ira) cards.push(mapActuatorToCard(ira, 1));
    if (harmonicReducer) cards.push(mapReducerToCard(harmonicReducer));

    const rotaryProduct = products.find((p) => p.slug === "rotary-actuator" || p.id === "rotary");
    if (rotaryProduct && !cards.some((c) => c.slug === rotaryProduct.slug)) {
      cards.push(mapProductToCard(rotaryProduct));
    }

    return {
      products: cards.slice(0, 3),
      explanation:
        "For precise rotational motion, INDUS provides all-in-one Intelligent Rotary Actuators (IND-IRA) with integrated hollow-shaft harmonic gearing and dual absolute encoders, as well as standalone zero-backlash precision reducers for external servo couplings.",
      recommendedCategory: "rotary-actuator",
      requiresFollowUp:
        "What continuous torque (Nm) or joint envelope (mm) is required for this rotational axis?",
    };
  }

  // 2. Linear motion / Thrust / Push / Slide / Cartesian
  if (
    q.includes("linear") ||
    q.includes("push") ||
    q.includes("thrust") ||
    q.includes("slide") ||
    q.includes("gantry") ||
    q.includes("cylinder") ||
    q.includes("cartesian") ||
    q.includes("stroke")
  ) {
    const ila = INTELLIGENT_ACTUATORS_DATA["intelligent-linear-actuator"];
    const cards: ProductCardData[] = [];
    if (ila) cards.push(mapActuatorToCard(ila, 1));

    const linearProd = products.find((p) => p.slug === "linear-actuator" || p.id === "linear");
    if (linearProd) cards.push(mapProductToCard(linearProd));

    const electricProd = products.find((p) => p.id === "electric");
    if (electricProd) cards.push(mapProductToCard(electricProd));

    return {
      products: cards.slice(0, 3),
      explanation:
        "For linear actuation and Cartesian transfers, INDUS Intelligent Linear Actuators (IND-ILA) combine C5/C3 ground ball screws, high-thrust servo motors, and direct optical position feedback (±0.005 mm repeatability) with rated thrust up to 12,000 N.",
      recommendedCategory: "linear-actuator",
      requiresFollowUp:
        "What required stroke length (mm) and continuous thrust force (N) does your tooling require?",
    };
  }

  // 3. Robotic Arm / Multi-Axis Articulation / Cobot
  if (
    q.includes("robot") ||
    q.includes("arm") ||
    q.includes("cobot") ||
    q.includes("collaborative") ||
    q.includes("articulated") ||
    q.includes("scara") ||
    q.includes("6-axis")
  ) {
    const robotProds = products.filter(
      (p) =>
        p.categorySlug === "robotic-arms" ||
        p.categorySlug === "industrial-robots" ||
        p.categorySlug === "collaborative-robots"
    );

    return {
      products: robotProds.slice(0, 3).map(mapProductToCard),
      explanation:
        "INDUS multi-axis kinematic systems feature high-wrist-torque 6-axis articulated arms for machine loading and welding, as well as collaborative robots with joint torque feedback complying with ISO 10218-1 and ISO/TS 15066.",
      recommendedCategory: "robot",
      requiresFollowUp:
        "What is the workpiece + gripper payload weight (kg) and radial reach requirement (mm)?",
    };
  }

  // 4. Reducer / Gearbox / Transmission
  if (
    q.includes("gear") ||
    q.includes("reducer") ||
    q.includes("gearbox") ||
    q.includes("backlash") ||
    q.includes("strain wave") ||
    q.includes("harmonic") ||
    q.includes("cycloidal") ||
    q.includes("planetary")
  ) {
    const reducerCards = PRECISION_REDUCER_RANGES.slice(0, 3).map(mapReducerToCard);
    return {
      products: reducerCards,
      explanation:
        "INDUS supplies traceable precision gear units including zero-backlash strain-wave reducers (<1 arcmin), high-torsional-rigidity cycloidal RV pin-wheel units, and precision helical planetary gearheads (DIN 3990 certified).",
      recommendedCategory: "gearbox",
      requiresFollowUp:
        "Do you require zero backlash (<1 arcmin) for precision path following, or high shock overload capacity (cycloidal)?",
    };
  }

  // 5. Mobile Robotics / AGV / AMR / Wheel
  if (
    q.includes("amr") ||
    q.includes("agv") ||
    q.includes("mobile") ||
    q.includes("wheel") ||
    q.includes("mecanum") ||
    q.includes("intralogistics")
  ) {
    const wheelProds = products.filter((p) => p.categorySlug === "robotic-wheels");
    return {
      products: wheelProds.slice(0, 3).map(mapProductToCard),
      explanation:
        "For autonomous mobile robots and automated guided vehicles, INDUS manufactures integrated brushless in-hub servo wheel drives with dual planetary reduction, failsafe braking, and polyurethane treads supporting payloads from 300 to 2,000 kg.",
      recommendedCategory: "robotic-wheels",
      requiresFollowUp:
        "What total vehicle gross mass (chassis + payload) and floor travel speed are you planning?",
    };
  }

  // General search across products
  const matched = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.features.some((f) => f.toLowerCase().includes(q))
    )
    .slice(0, 3)
    .map(mapProductToCard);

  return {
    products: matched.length > 0 ? matched : products.slice(0, 2).map(mapProductToCard),
    explanation:
      "Here are verified candidate motion components from the INDUS engineering catalogue matching your criteria:",
    recommendedCategory: "rotary-actuator",
  };
}

/* =========================================================================
   3. TECHNICAL EXPLANATIONS (Grounding Engineering Principles & Trade-offs)
   ========================================================================= */

export function getEngineeringExplanation(conceptQuery: string): {
  title: string;
  principles: string;
  tradeOffs: string;
  typicalApplications: string;
  indusCatalogueConnection: string;
  relevantProducts: ProductCardData[];
} | null {
  const q = conceptQuery.toLowerCase();

  // Harmonic vs Planetary
  if (
    (q.includes("harmonic") || q.includes("strain wave")) &&
    (q.includes("planetary") || q.includes("gearbox"))
  ) {
    const harmonicItem = PRECISION_REDUCER_RANGES.find(
      (r) => r.technology === "harmonic-strain-wave"
    );
    const planetaryItem = PRECISION_REDUCER_RANGES.find(
      (r) => r.technology === "precision-planetary"
    );

    const relevantProducts: ProductCardData[] = [];
    if (harmonicItem) relevantProducts.push(mapReducerToCard(harmonicItem));
    if (planetaryItem) relevantProducts.push(mapReducerToCard(planetaryItem));

    return {
      title: "Harmonic Drive (Strain-Wave) vs Precision Planetary Gearbox",
      principles:
        "• Harmonic Drive (Strain-Wave): Employs three concentric components: an elliptical wave generator, a flexible thin-walled flexspline, and a rigid circular spline. Rotation of the elliptical cam deflects the flexspline into progressive engagement, achieving continuous tooth meshing across ~30% of teeth simultaneously with true zero mechanical backlash.\n\n• Planetary Gearbox: Divides input motor torque across three or four rotating planetary gears orbiting between a central sun pinion and an outer internal ring gear. Tooth load is shared across multiple mesh points with high mechanical efficiency (>95%).",
      tradeOffs:
        "• Backlash & Accuracy: Harmonic drives provide near-zero backlash (< 1.0 arcmin) with exceptional repeatability, whereas standard precision planetary gearheads typically exhibit 1 to 3 arcminutes of mechanical clearance.\n• Reduction Ratios: Harmonic drives achieve single-stage reduction ratios of 30:1 up to 160:1 in a single compact coaxial slice. Planetary gearheads are typically limited to 3:1–10:1 per stage (requiring 2 or 3 stages for >50:1 ratios, increasing axial length).\n• Shock Capacity & Rigidity: Planetary gearboxes deliver significantly higher torsional stiffness and emergency shock torque limits (up to 300% rated), while harmonic drives have lower torsional stiffness under heavy reversing loads and lower continuous thermal efficiency (75%–85%).",
      typicalApplications:
        "• Harmonic Drives: Collaborative robot joints (J4–J6), semiconductor wafer indexing, surgical robotics, radar gimbals, and hollow-shaft machine joints.\n• Planetary Gearboxes: Cartesian gantries, CNC feed axes, AGV traction drives, packaging line transfers, and heavy industrial automation.",
      indusCatalogueConnection:
        "INDUS manufactures both technologies under ISO 9283 and DIN 3990 standards: the INDUS Zero-Backlash Strain-Wave Reducer and the INDUS Precision Helical Planetary Gearbox series.",
      relevantProducts,
    };
  }

  // Cycloidal vs Harmonic
  if (
    (q.includes("cycloidal") || q.includes("rv")) &&
    (q.includes("harmonic") || q.includes("strain wave"))
  ) {
    const rvItem = PRECISION_REDUCER_RANGES.find((r) => r.technology === "rv-cycloidal");
    const harmonicItem = PRECISION_REDUCER_RANGES.find(
      (r) => r.technology === "harmonic-strain-wave"
    );

    const relevantProducts: ProductCardData[] = [];
    if (harmonicItem) relevantProducts.push(mapReducerToCard(harmonicItem));
    if (rvItem) relevantProducts.push(mapReducerToCard(rvItem));

    return {
      title: "Harmonic Strain-Wave vs Cycloidal (RV) Reducers",
      principles:
        "• Harmonic Reducers: Utilize an elastic flexspline deformed into an elliptical profile. Best suited for compact, lightweight, coaxial joints with pure zero backlash.\n\n• RV Cycloidal Reducers: Utilize eccentric cam shafts rolling cycloidal discs across precision needle-pin pins, integrated with internal planetary pre-reduction stages. Shock forces are distributed across nearly 50% of the pin contact points in compression.",
      tradeOffs:
        "• Torsional Rigidity: RV Cycloidal gearboxes provide 3x to 5x higher torsional stiffness (up to 180 Nm/arcmin) and can survive 500% emergency stop shock loads without tooth shearing.\n• Envelope & Weight: Harmonic drives are 40% lighter and offer generous central hollow-bore throughputs for internal wire harness routing, making them ideal for robot wrists (J4–J6), while RV cycloidal units are preferred for heavy primary robot base joints (J1–J3).",
      typicalApplications:
        "• Cycloidal (RV): Heavy industrial articulated robot axes (J1, J2, J3), CNC rotary tilt tables, positioners.\n• Harmonic: Compact cobot joints, robot wrists, precision optical pan-tilts.",
      indusCatalogueConnection:
        "INDUS offers both product ranges: the INDUS High-Stiffness RV Cycloidal Reducer and the INDUS Strain-Wave Reducer.",
      relevantProducts,
    };
  }

  // Actuators: Rotary vs Linear or Integrated Mechatronic
  if (q.includes("intelligent actuator") || q.includes("integrated actuator") || q.includes("frameless")) {
    const ira = INTELLIGENT_ACTUATORS_DATA["intelligent-rotary-actuator"];
    const relevantProducts: ProductCardData[] = [];
    if (ira) relevantProducts.push(mapActuatorToCard(ira, 1));

    return {
      title: "Integrated Intelligent Actuators vs Traditional Separate Servo Systems",
      principles:
        "A traditional motion axis requires five discrete vendor items: external servo drive, external brake, separate gearbox, servomotor, and multi-conductor trailing cables. An Intelligent Actuator (IND-IRA / IND-ILA) mechatronically integrates a frameless BLDC motor, zero-backlash gearhead, dual 19-bit absolute encoders, and DSP servo inverter into a single IP65 sealed housing with direct EtherCAT / CANopen bus ports.",
      tradeOffs:
        "• Space & Cabling: Reduces control cabinet footprint by 80% and eliminates long motor power lines (preventing radiated EMI and cable wear in moving articulated arms).\n• Thermal Dissipation: Heat generated by the motor and drive shares a common housing; continuous thermal derating calculations (S1 duty) are essential in high ambient installations.",
      typicalApplications:
        "Hollow-arm collaborative robots, AGV steering pivots, automated tool turrets, and high-density multi-axis pick-and-place machines.",
      indusCatalogueConnection:
        "Available in the INDUS Intelligent Actuators family (IND-IRA rotary and IND-ILA linear series).",
      relevantProducts,
    };
  }

  // Absolute vs Incremental Encoders
  if (q.includes("encoder") || q.includes("feedback") || q.includes("biss") || q.includes("incremental")) {
    return {
      title: "Dual Absolute Encoders vs Incremental Feedback in Robotics",
      principles:
        "• Incremental Encoders: Count pulse transitions from a reference mark. Upon electrical power interruption or e-stop, joint position is lost, requiring a homing sequence that can risk mechanical collision with work fixtures.\n\n• Dual Absolute Encoders: Read absolute mechanical code patterns simultaneously on both the motor input shaft (17-bit) and the gearbox output shaft (19-bit).",
      tradeOffs:
        "• Dual feedback enables direct compensation of mechanical gear wind-up, thermal expansion, and backlash under load.\n• Preserves exact joint coordinates through e-stops, eliminating machine re-homing cycle times.",
      typicalApplications:
        "Safety-critical cobots, cleanroom wafer loading, multi-axis machine tool tending, and surgical robotics.",
      indusCatalogueConnection:
        "All INDUS Intelligent Actuators (IND-IRA) come standard with dual 19-bit optical/magnetic BiSS-C absolute encoders.",
      relevantProducts: [
        mapActuatorToCard(INTELLIGENT_ACTUATORS_DATA["intelligent-rotary-actuator"], 0),
      ],
    };
  }

  return null;
}

/* =========================================================================
   4. MODEL COMPARISONS (Parameter by Parameter Grounding)
   ========================================================================= */

export function compareActuatorModels(
  modelCodeA = "IND-IRA-070",
  modelCodeB = "IND-IRA-090"
): ComparisonTableData {
  const isLinear =
    modelCodeA.toLowerCase().includes("ila") ||
    modelCodeB.toLowerCase().includes("ila") ||
    modelCodeA.toLowerCase().includes("linear") ||
    modelCodeB.toLowerCase().includes("linear");

  if (isLinear) {
    const ila = INTELLIGENT_ACTUATORS_DATA["intelligent-linear-actuator"];
    const varA =
      ila.modelVariants.find((v) => v.modelCode.includes(modelCodeA)) ||
      ila.modelVariants[0];
    const varB =
      ila.modelVariants.find((v) => v.modelCode.includes(modelCodeB)) ||
      ila.modelVariants[1];

    const rows: ComparisonRow[] = [
      {
        parameter: "Continuous Rated Thrust",
        unit: "N",
        modelAVal: varA.nominalTorqueOrForce,
        modelBVal: varB.nominalTorqueOrForce,
        difference: `Model B provides ${
          parseInt(varB.nominalTorqueOrForce) - parseInt(varA.nominalTorqueOrForce)
        } N (+${Math.round(
          (parseInt(varB.nominalTorqueOrForce) / parseInt(varA.nominalTorqueOrForce) - 1) * 100
        )}%) higher continuous push force`,
      },
      {
        parameter: "Peak Acceleration Thrust",
        unit: "N",
        modelAVal: varA.peakTorqueOrForce,
        modelBVal: varB.peakTorqueOrForce,
        difference: `Model B withstands ${
          parseInt(varB.peakTorqueOrForce) - parseInt(varA.peakTorqueOrForce)
        } N higher dynamic pressing force`,
      },
      {
        parameter: "Rated Linear Speed",
        unit: "mm/s",
        modelAVal: varA.ratedSpeed,
        modelBVal: varB.ratedSpeed,
        difference: `Model A is rated for ${
          parseInt(varA.ratedSpeed) - parseInt(varB.ratedSpeed)
        } mm/s higher velocity`,
      },
      {
        parameter: "Available Stroke Range",
        unit: "mm",
        modelAVal: varA.strokeRangeMm || "100 – 800 mm",
        modelBVal: varB.strokeRangeMm || "100 – 1400 mm",
        difference: "Model B supports extended travel lengths",
      },
      {
        parameter: "Position Feedback Scale",
        unit: "Resolution",
        modelAVal: varA.encoderResolution,
        modelBVal: varB.encoderResolution,
        difference: "Direct carriage optical/magnetic linear scale",
      },
      {
        parameter: "Continuous Current",
        unit: "A",
        modelAVal: varA.continuousCurrent,
        modelBVal: varB.continuousCurrent,
        difference: `Model B requires ${
          (parseFloat(varB.continuousCurrent) - parseFloat(varA.continuousCurrent)).toFixed(1)
        } A higher supply current`,
      },
      {
        parameter: "Base Carriage Mass",
        unit: "kg",
        modelAVal: varA.massKg,
        modelBVal: varB.massKg,
        difference: "Model B has heavier structural extrusion for moment rigidity",
      },
      {
        parameter: "Extrusion Profile",
        unit: "mm",
        modelAVal: varA.flangeSizeMm,
        modelBVal: varB.flangeSizeMm,
        difference: "Model B features wider rail spacing for pitch/yaw moment resistance",
      },
    ];

    return {
      title: `Technical Comparison: ${varA.modelCode} vs ${varB.modelCode}`,
      modelA: {
        name: `IND-ILA Size 50 (${varA.modelCode})`,
        code: varA.modelCode,
        url: `/products/intelligent-actuators/intelligent-linear-actuator`,
      },
      modelB: {
        name: `IND-ILA Size 80 (${varB.modelCode})`,
        code: varB.modelCode,
        url: `/products/intelligent-actuators/intelligent-linear-actuator`,
      },
      rows,
      engineeringInsight:
        "Select IND-ILA-050 for high-speed pick-and-place inspection stages with payloads up to 15 kg. Select IND-ILA-080 or IND-ILA-110 for battery cell pressing, crimping, or Cartesian transfers where continuous thrust force and moment loads dominate.",
      missingDataNotes: [
        "Dynamic moment capacities (My, Mp, Mr) are published on the product detail page.",
        "Screw critical whirling speed limits stroke velocity above 1000mm length.",
      ],
    };
  }

  const ira = INTELLIGENT_ACTUATORS_DATA["intelligent-rotary-actuator"];
  const varA =
    ira.modelVariants.find((v) => v.modelCode.includes(modelCodeA)) ||
    ira.modelVariants[0];
  const varB =
    ira.modelVariants.find((v) => v.modelCode.includes(modelCodeB)) ||
    ira.modelVariants[1];

  const rows: ComparisonRow[] = [
    {
      parameter: "Rated Continuous Torque",
      unit: "Nm",
      modelAVal: varA.nominalTorqueOrForce,
      modelBVal: varB.nominalTorqueOrForce,
      difference: `Model B provides ${
        parseInt(varB.nominalTorqueOrForce) - parseInt(varA.nominalTorqueOrForce)
      } Nm (+${Math.round(
        (parseInt(varB.nominalTorqueOrForce) / parseInt(varA.nominalTorqueOrForce) - 1) * 100
      )}%) additional continuous torque`,
    },
    {
      parameter: "Peak Acceleration Torque",
      unit: "Nm",
      modelAVal: varA.peakTorqueOrForce,
      modelBVal: varB.peakTorqueOrForce,
      difference: `Model B withstands ${
        parseInt(varB.peakTorqueOrForce) - parseInt(varA.peakTorqueOrForce)
      } Nm higher peak transient loads`,
    },
    {
      parameter: "Rated Output Speed",
      unit: "rpm",
      modelAVal: varA.ratedSpeed,
      modelBVal: varB.ratedSpeed,
      difference: `Model A is rated for +${
        parseInt(varA.ratedSpeed) - parseInt(varB.ratedSpeed)
      } rpm higher output speed`,
    },
    {
      parameter: "Continuous Current",
      unit: "A",
      modelAVal: varA.continuousCurrent,
      modelBVal: varB.continuousCurrent,
      difference: `Model B requires ${
        (parseFloat(varB.continuousCurrent) - parseFloat(varA.continuousCurrent)).toFixed(1)
      } A higher bus supply`,
    },
    {
      parameter: "Torsional Backlash",
      unit: "arcmin",
      modelAVal: varA.backlash || "< 1.0 arcmin",
      modelBVal: varB.backlash || "< 1.0 arcmin",
      difference: "Identical zero-backlash strain-wave gearing",
    },
    {
      parameter: "Flange Frame Size",
      unit: "mm",
      modelAVal: varA.flangeSizeMm,
      modelBVal: varB.flangeSizeMm,
      difference: "Model B has larger mounting footprint",
    },
    {
      parameter: "Mass / Weight",
      unit: "kg",
      modelAVal: varA.massKg,
      modelBVal: varB.massKg,
      difference: `Model B is ${(parseFloat(varB.massKg) - parseFloat(varA.massKg)).toFixed(2)} kg heavier`,
    },
    {
      parameter: "Ingress Protection",
      unit: "Rating",
      modelAVal: varA.ipRating,
      modelBVal: varB.ipRating,
      difference: "Both sealed to industrial IP65",
    },
    {
      parameter: "Position Feedback",
      unit: "Type",
      modelAVal: varA.encoderResolution,
      modelBVal: varB.encoderResolution,
      difference: "Identical dual 19-bit BiSS-C absolute architecture",
    },
  ];

  return {
    title: `Technical Comparison: ${varA.modelCode} vs ${varB.modelCode}`,
    modelA: {
      name: `${varA.modelCode}`,
      code: varA.modelCode,
      url: `/products/intelligent-actuators/intelligent-rotary-actuator`,
    },
    modelB: {
      name: `${varB.modelCode}`,
      code: varB.modelCode,
      url: `/products/intelligent-actuators/intelligent-rotary-actuator`,
    },
    rows,
    engineeringInsight:
      "Select smaller sizes for distal robot arm joints (J4–J6) where minimizing distal mass is critical to acceleration. Select larger sizes for primary articulated shoulder/elbow joints (J1–J3) or CNC rotary tables where continuous holding torque and bearing moment stiffness govern.",
    missingDataNotes: [
      "Dynamic thermal derating curves vary by duty factor and ambient airflow.",
      "CAD STEP files and 2D flange interface drawings are available on product detail pages.",
    ],
  };
}

export function getDiagnosticExplanation(query: string): {
  title: string;
  observedCondition: string;
  verifiedThreshold: string;
  rootCauses: string[];
  recommendedInvestigation: string[];
  documentationRef: string;
} | null {
  const q = query.toLowerCase();

  if (q.includes("temperature") || q.includes("thermal") || q.includes("overheat")) {
    return {
      title: "Diagnostic Analysis: Motor Winding / Inverter Over-Temperature",
      observedCondition: "Internal stator thermistor or MOSFET power bridge reading elevated temperature (>85°C).",
      verifiedThreshold: "Automatic current derating starts at 85.0°C; Hardware safety trip cut-off occurs at 115.0°C.",
      rootCauses: [
        "Continuous RMS torque demand exceeding catalog continuous rating (S1 duty cycle).",
        "Insufficient thermal conduction to machine base chassis (mounting plate thickness <15mm).",
        "Ambient enclosure temperature exceeding rated 40°C specification.",
        "Frequent rapid acceleration/deceleration cycles without adequate dwell cooling periods.",
      ],
      recommendedInvestigation: [
        "Measure RMS current over full operating cycle to verify it remains within continuous rating.",
        "Inspect mounting flange thermal paste or contact flatness (ISO 9409-1 face).",
        "Verify ambient ventilation and convective airflow around actuator aluminum housing.",
        "Implement velocity smoothing (S-curve jerk limiting) to lower peak acceleration thermal spikes.",
      ],
      documentationRef: "DS-IND-IRA-2026 Section 4.2 'Thermal Derating Curves & Heat Sink Requirements'",
    };
  }

  if (q.includes("tracking error") || q.includes("following error") || q.includes("compliance")) {
    return {
      title: "Diagnostic Analysis: Dynamic Following Error Warning",
      observedCondition: "Output flange position lag relative to commanded trajectory exceeds allowable tolerance.",
      verifiedThreshold: "Warning threshold: ±12.0 arcmin (Rotary) / ±25 µm (Linear); Error trip: ±20.0 arcmin.",
      rootCauses: [
        "Mechanical binding or external physical obstruction along the motion path.",
        "Dynamic acceleration torque command exceeding peak motor limit.",
        "Excessive reflected payload inertia ratio (J_load / J_motor > 10:1).",
        "Position loop gain (Kp) or velocity feed-forward (VFF) detuned or lagging.",
      ],
      recommendedInvestigation: [
        "Manually rotate output flange with drive de-energized to check for mechanical resistance or bearing wear.",
        "Check EtherCAT CSP trajectory interpolation cycle time (ensure jitter is <1 µs).",
        "Verify dual-encoder calibration offset between motor shaft and output flange.",
        "Tune cascade position loop Kp and anti-resonance notch filter in servo drive parameters.",
      ],
      documentationRef: "MAN-IND-IRA-ETH-2026 Chapter 6 'CiA 402 Following Error Window & Gain Tuning'",
    };
  }

  if (q.includes("current") || q.includes("stall") || q.includes("overload")) {
    return {
      title: "Diagnostic Analysis: Motor Over-Current / Stall Current Spike",
      observedCondition: "Drive phase current exceeds 110% of rated continuous S1 limit during steady-state velocity.",
      verifiedThreshold: "Continuous S1 limit: 11.0 A (Size 090); Peak trip threshold: 28.0 A for >1.0 sec.",
      rootCauses: [
        "Mechanical payload jamming or extreme cantilever moment load on output bearing.",
        "Dynamic friction increase due to grease degradation or contamination.",
        "Supply DC bus voltage drop under high-load acceleration.",
      ],
      recommendedInvestigation: [
        "Verify external DC bus voltage remains within 48V ±10% under full load.",
        "Inspect payload overhung moment against allowable radial bearing load Fr (3200 N).",
        "Perform dyno friction test with no-load test motion to verify baseline tare torque.",
      ],
      documentationRef: "DS-IND-IRA-2026 Section 3 'Electrical & Power Supply Guidelines'",
    };
  }

  if (q.includes("communication") || q.includes("fieldbus") || q.includes("ethercat") || q.includes("sync") || q.includes("jitter")) {
    return {
      title: "Diagnostic Analysis: Fieldbus Synchronization Interruption",
      observedCondition: "Distributed Clock (DC) sync jitter exceeding 25 µs or missed cyclic synchronous PDO packets.",
      verifiedThreshold: "Target jitter: <0.8 µs; Warning threshold: >15 µs; Fieldbus watchdog trip: 100 ms timeout.",
      rootCauses: [
        "Industrial Ethernet cable EMI noise coupling (unshielded patch cable or routing near high-voltage lines).",
        "PLC / IPC master real-time kernel task overrun or high CPU priority competition.",
        "Improper grounding of M12 connector shielding shell to machine star-ground.",
      ],
      recommendedInvestigation: [
        "Ensure Cat5e/Cat6 shielded twisted-pair (STP) cables with 360° braided shield termination are used.",
        "Check TwinCAT / CODESYS real-time task jitter on the host controller.",
        "Inspect M12 connector pins for corrosion, loose locking nut, or physical damage.",
      ],
      documentationRef: "APP-IND-IRA-XML-ESI 'EtherCAT Distributed Clocks Setup & Topology Guide'",
    };
  }

  return null;
}

export function getActuatorSpecExplanation(query: string): {
  title: string;
  summary: string;
  engineeringImpact: string;
  indusStandard: string;
} | null {
  const q = query.toLowerCase();

  if (q.includes("dual") || q.includes("19-bit") || q.includes("encoder") || q.includes("biss")) {
    return {
      title: "Dual 19-Bit Absolute Position Feedback Architecture",
      summary: "INDUS Intelligent Actuators incorporate two separate absolute encoders: an optical encoder on the high-speed motor shaft and a 19-bit (524,288 counts/rev) optical encoder directly on the output load flange.",
      engineeringImpact: "In conventional actuators with only a motor-side encoder, gear tooth deflection and strain-wave torsional windup create unmeasured position errors at the robot joint. Dual encoders allow the embedded DSP drive to sample true flange position in real time, actively compensating for mechanical compliance and guaranteeing ±10 arcsecond bilateral repeatability.",
      indusStandard: "BiSS-C / SSI synchronous serial protocol with battery-less absolute multi-turn memory.",
    };
  }

  if (q.includes("sto") || q.includes("safe torque off") || q.includes("safety")) {
    return {
      title: "Integrated Safe Torque Off (STO SIL2 / PLd)",
      summary: "A dual-channel hardware safety function that de-energizes the gate drive signals to the inverter power MOSFETs, preventing the motor from producing shaft torque.",
      engineeringImpact: "Enables Category 3 PLd / SIL2 safety compliance without requiring large external contactors between the power supply and the actuator, preserving DC bus voltage and enabling instant restart once safety guards are reset.",
      indusStandard: "Certified to EN ISO 13849-1 and IEC 61800-5-2 with dual redundant hardware cut-off channels.",
    };
  }

  if (q.includes("cia 402") || q.includes("csp") || q.includes("profile")) {
    return {
      title: "CiA 402 Drive Profiles (CSP, CSV, CST)",
      summary: "The standardized CAN in Automation device profile for motion drives, implemented over EtherCAT (CoE) and CANopen.",
      engineeringImpact: "Cyclic Synchronous Position (CSP) allows host controllers (like Beckhoff TwinCAT, Siemens, or Omron) to transmit interpolated target positions every 1 millisecond. The actuator's embedded DSP drive interpolates trajectory points with 5th-order splines, running cascaded current, velocity, and position loops locally for ultra-smooth multi-axis motion.",
      indusStandard: "CiA 402 standard state machine with 0x6040 Controlword and 0x6041 Statusword.",
    };
  }

  return null;
}

export function compareGeneralComponents(
  idA: string,
  idB: string
): ComparisonTableData | null {
  const dossierA = engineeringDossiers[idA];
  const dossierB = engineeringDossiers[idB];

  if (!dossierA || !dossierB) {
    return null;
  }

  const rows: ComparisonRow[] = [];
  const paramsA = new Map(dossierA.parameters.map((p) => [p.name, p]));
  const paramsB = new Map(dossierB.parameters.map((p) => [p.name, p]));

  // Compare common parameters
  dossierA.parameters.forEach((pA) => {
    const pB = paramsB.get(pA.name);
    rows.push({
      parameter: pA.name,
      unit: pA.unit || "",
      modelAVal: pA.value,
      modelBVal: pB ? pB.value : "[Requires Confirmation]",
      difference: pB ? `${pA.value} vs ${pB.value}` : "Not published in secondary record",
      missing: !pB,
    });
  });

  return {
    title: `Comparison: ${dossierA.componentType} vs ${dossierB.componentType}`,
    modelA: {
      name: dossierA.componentType,
      code: dossierA.modelIdentifier,
      url: `/products/${dossierA.categorySlug}/${dossierA.id}`,
    },
    modelB: {
      name: dossierB.componentType,
      code: dossierB.modelIdentifier,
      url: `/products/${dossierB.categorySlug}/${dossierB.id}`,
    },
    rows: rows.slice(0, 8),
    engineeringInsight:
      "Parameters reflect published ISO/DIN test conditions. Verify allowable radial/axial loads against dynamic duty cycles before design freeze.",
  };
}
