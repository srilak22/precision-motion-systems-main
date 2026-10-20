/**
 * INDUS Industrial Robotics — Future Agentic Network Specification & Architecture
 *
 * Defines the capability boundaries, allowed operations, evidence requirements,
 * and human-in-the-loop governance policies for 10 future specialized engineering agents.
 *
 * NOTE: These specifications define the rigorous structural contract for future autonomous
 * agent participation. Agents are NOT represented as operational or unsupervised in this phase.
 */

import { FutureAgentContract } from "./types";

export const FUTURE_AGENT_CONTRACTS: FutureAgentContract[] = [
  // 1. PRODUCT RESEARCH AGENT
  {
    agentId: "agent:product-research",
    agentName: "Product Research Agent",
    role: "Autonomous Technical Literature & Manufacturer Datasheet Ingestion",
    primaryPurpose: "Discovers and indexes official manufacturer engineering documentation, testing standards, and CAD drawing repositories.",
    scopeAndBoundaries: {
      authorizedActions: [
        "Index official manufacturer datasheets, CAD models, and application manuals",
        "Extract technical parameters (torque, speed, backlash, stiffness, voltage, IP rating)",
        "Parse testing conditions and ISO/DIN/IEC standards cited in manufacturer literature",
      ],
      strictBoundaries: [
        "MUST only ingest official primary manufacturer domains and accredited standards bodies (ISO, DIN, IEC, AGMA, IEEE)",
        "CANNOT scrape third-party distributor aggregators or unverified blog posts",
        "CANNOT author or extrapolate missing specifications without citing raw document page numbers",
      ],
      unauthorizedActions: [
        "Modifying published catalogue values without human approval",
        "Scraping competitor pricing, marketing slogans, or proprietary promotional copy",
      ],
    },
    allowedReadOperations: ["fetch_verified_source", "search_standards_registry", "inspect_node_provenance"],
    allowedWriteOperations: ["stage_new_research_source", "propose_parameter_update", "log_provenance_audit"],
    requiredInputTypes: ["ResearchSource"],
    expectedOutputTypes: ["ResearchSource", "Specification"],
    evidenceRequirements: ["Valid URL to official manufacturer domain", "Document title and revision date", "Page number of verified claim"],
    verificationCriteria: ["Document cryptographic hash", "Cryptographic timestamp", "Peer review by application engineer"],
    humanReviewRequirements: {
      mandatoryTriggers: [
        "Any update to rated torque or safety performance level",
        "Any discrepancy with existing manufacturer documentation",
      ],
      approvalWorkflow: "Requires approval by Principal Robotics Systems Engineer before publishing.",
    },
    capabilities: [
      {
        capabilityId: "cap:datasheet-parameter-extraction",
        name: "Datasheet Parameter Parsing",
        description: "Extracts physical units and values from OEM technical specification tables.",
        inputSchemaDescription: "{ sourcePdfUrl: string, targetNodeId: string }",
        outputSchemaDescription: "{ parameters: Array<{ name: string, value: string, unit: string, pageRef: number }> }",
        isDeterministic: true,
      },
    ],
  },

  // 2. PRODUCT CLASSIFICATION AGENT
  {
    agentId: "agent:product-classification",
    agentName: "Product Classification Agent",
    role: "Ontological Taxonomy & Component Family Mapping",
    primaryPurpose: "Assigns mechatronic components into the 12 master product lines, 6 intelligence levels, and kinematic robot subsystems.",
    scopeAndBoundaries: {
      authorizedActions: [
        "Analyze operating principles to assign components to exact technology families",
        "Map components to primary kinematics (e.g. RV cycloidal to J1/J2; strain wave to J4-J6)",
        "Assign components to Level 0 through Level 5 in the intelligence framework",
      ],
      strictBoundaries: [
        "MUST preserve distinction between component families, product lines, and manufacturer models",
        "CANNOT place high-backlash gearboxes into precision robotics joint categories",
      ],
      unauthorizedActions: [
        "Creating arbitrary new product lines without architectural review",
        "Reclassifying verified safety devices as non-safety components",
      ],
    },
    allowedReadOperations: ["inspect_product_taxonomy", "inspect_operating_principles", "query_intelligence_levels"],
    allowedWriteOperations: ["propose_taxonomy_reclassification", "stage_subsystem_mapping"],
    requiredInputTypes: ["ProductRange", "Technology"],
    expectedOutputTypes: ["ProductLine", "RobotSubsystem", "IntelligenceLevel"],
    evidenceRequirements: ["Operating principle diagram", "Mechanical kinematic articulation type"],
    verificationCriteria: ["Conformance with ISO 9283 / ISO 10218-1 mechanical classifications"],
    humanReviewRequirements: {
      mandatoryTriggers: ["Reclassifying a component across different intelligence levels or product lines"],
      approvalWorkflow: "Taxonomy review signed off by Lead Mechatronics Architect.",
    },
    capabilities: [
      {
        capabilityId: "cap:mechatronic-classification",
        name: "Component Family Classifier",
        description: "Determines whether a reducer is strain-wave, RV cycloidal, planetary, or hypoid.",
        inputSchemaDescription: "{ operatingPrincipleText: string, mechanicalFeatures: string[] }",
        outputSchemaDescription: "{ technologyType: string, confidenceScore: number, recommendedLineId: string }",
        isDeterministic: false,
      },
    ],
  },

  // 3. SPECIFICATION VERIFICATION AGENT
  {
    agentId: "agent:specification-verification",
    agentName: "Specification Verification Agent",
    role: "Unit Dimensional Analysis & Physical Sanity Auditing",
    primaryPurpose: "Validates that all numeric ratings adhere to physical laws, consistent SI units, and allowable operating envelopes.",
    scopeAndBoundaries: {
      authorizedActions: [
        "Verify dimensional consistency across torque (Nm), speed (RPM), angular velocity (rad/s), and power (kW)",
        "Audit power balance: Power (W) = Torque (Nm) * Angular Velocity (rad/s)",
        "Flag impossible ratings (e.g. 100% efficiency, negative backlash, infinite stiffness)",
      ],
      strictBoundaries: [
        "MUST enforce standard SI units and standardized industrial tolerances",
        "MUST flag any missing test conditions (e.g. ambient temperature, duty cycle, input speed)",
      ],
      unauthorizedActions: [
        "Approving unverified marketing claims without physical test conditions",
      ],
    },
    allowedReadOperations: ["inspect_specifications", "audit_physical_dimensions", "query_verification_state"],
    allowedWriteOperations: ["set_verification_state", "mark_specification_pending", "flag_unit_anomaly"],
    requiredInputTypes: ["Specification", "ProductRange"],
    expectedOutputTypes: ["Specification"],
    evidenceRequirements: ["SI unit conversion proof", "Power-torque-speed algebraic balance"],
    verificationCriteria: ["100% mathematical consistency with mechanical physics equations"],
    humanReviewRequirements: {
      mandatoryTriggers: ["Any flag indicating physical impossibility or discrepancy > 10%"],
      approvalWorkflow: "Engineering sign-off required before setting status to 'verified'.",
    },
    capabilities: [
      {
        capabilityId: "cap:torque-speed-power-audit",
        name: "Physics Consistency Checker",
        description: "Validates continuous and peak power ratings against mechanical torque-speed profiles.",
        inputSchemaDescription: "{ torqueNm: number, speedRpm: number, powerKw: number }",
        outputSchemaDescription: "{ calculatedPowerKw: number, discrepancyPercent: number, isValid: boolean }",
        isDeterministic: true,
      },
    ],
  },

  // 4. COMPONENT COMPATIBILITY AGENT
  {
    agentId: "agent:component-compatibility",
    agentName: "Component Compatibility Agent",
    role: "Drivetrain Pairing & Cross-Component Interface Validation",
    primaryPurpose: "Evaluates mechanical bolt circles, shaft couplings, fieldbus protocols, and thermal duty pairings between adjacent mechatronic components.",
    scopeAndBoundaries: {
      authorizedActions: [
        "Check motor flange to gearbox input adapter alignment (ISO 9409, DIN standards)",
        "Calculate reflected inertia ratio (JL / JM <= 5:1 for dynamic cycles)",
        "Verify fieldbus protocol compatibility (e.g. EtherCAT Master to EtherCAT CiA 402 Drive)",
      ],
      strictBoundaries: [
        "MUST refuse pairing where mechanical thermal rating is exceeded",
        "CANNOT approve pairing with incompatible communications protocols",
      ],
      unauthorizedActions: [
        "Silently waiving safety clearance or inertia ratio constraints",
      ],
    },
    allowedReadOperations: ["query_compatibility_rules", "inspect_flange_dimensions", "inspect_fieldbus_profiles"],
    allowedWriteOperations: ["create_compatibility_edge", "create_incompatibility_edge", "flag_pairing_warning"],
    requiredInputTypes: ["ProductRange", "CompatibilityRule"],
    expectedOutputTypes: ["CompatibilityRule"],
    evidenceRequirements: ["CAD dimensional overlay", "Fieldbus conformance statement", "Inertia ratio equation"],
    verificationCriteria: ["Zero mechanical interference, matched voltage and fieldbus, acceptable inertia ratio"],
    humanReviewRequirements: {
      mandatoryTriggers: ["Pairing marked as verified across safety-critical components"],
      approvalWorkflow: "Application Engineer sign-off required.",
    },
    capabilities: [
      {
        capabilityId: "cap:inertia-ratio-verification",
        name: "Inertia Ratio Validator",
        description: "Computes reflected load inertia through gear ratio and efficiency against motor rotor inertia.",
        inputSchemaDescription: "{ loadInertiaKgM2: number, motorInertiaKgM2: number, gearRatio: number, efficiency: number }",
        outputSchemaDescription: "{ reflectedInertiaKgM2: number, ratio: number, isCompliant: boolean }",
        isDeterministic: true,
      },
    ],
  },

  // 5. APPLICATION ENGINEERING AGENT
  {
    agentId: "agent:application-engineering",
    agentName: "Application Engineering Agent",
    role: "Industrial Use Case Mapping & Operating Envelope Assessment",
    primaryPurpose: "Maps manufacturing tasks across the 18 vertical sectors to appropriate robot kinematic architectures and component BOMs.",
    scopeAndBoundaries: {
      authorizedActions: [
        "Analyze operating environments (cleanroom class, ATEX explosive zoning, washdown IP rating)",
        "Recommend suitable robot kinematics (Delta, SCARA, 6-Axis, Gantry, AMR)",
        "Assemble representative mechatronic bills of materials for specific industrial use cases",
      ],
      strictBoundaries: [
        "MUST respect environmental constraints (e.g. NO unsealed gearboxes in washdown zones)",
        "CANNOT recommend non-ATEX components in explosive chemical areas",
      ],
      unauthorizedActions: [
        "Promising cycle times without dynamic simulation or kinematic acceleration analysis",
      ],
    },
    allowedReadOperations: ["inspect_use_cases", "query_environmental_ratings", "inspect_application_verticals"],
    allowedWriteOperations: ["link_component_to_use_case", "propose_use_case_refinement"],
    requiredInputTypes: ["UseCase", "Application", "ProductRange"],
    expectedOutputTypes: ["UseCase"],
    evidenceRequirements: ["Environmental operating standards (ISO 14644, ATEX Directive 2014/34/EU)"],
    verificationCriteria: ["Meets or exceeds all environmental, cycle time, and payload constraints"],
    humanReviewRequirements: {
      mandatoryTriggers: ["Any ATEX Zone 0/1 or ISO Class 1 cleanroom recommendation"],
      approvalWorkflow: "Senior Automation Systems Engineer sign-off.",
    },
    capabilities: [
      {
        capabilityId: "cap:environmental-suitability-check",
        name: "Environmental Envelope Checker",
        description: "Validates IP rating, operating temperature range, and corrosion resistance against process conditions.",
        inputSchemaDescription: "{ componentIpRating: string, operatingTempRange: string, requiredEnvironment: string }",
        outputSchemaDescription: "{ isSuitable: boolean, warnings: string[] }",
        isDeterministic: true,
      },
    ],
  },

  // 6. PRODUCT SELECTION AGENT
  {
    agentId: "agent:product-selection",
    agentName: "Product Selection Agent",
    role: "Interactive Parametric Sizing & Recommendation Engine",
    primaryPurpose: "Guides engineering buyers through progressive multi-criteria component sizing wizards.",
    scopeAndBoundaries: {
      authorizedActions: [
        "Collect engineering parameters (payload, speed, stroke, backlash, ratio, duty cycle)",
        "Filter verified catalogue candidates matching preliminary mechanical constraints",
        "Present transparent trade-offs between competing technologies (e.g. Strain-Wave vs RV)",
      ],
      strictBoundaries: [
        "MUST explicitly declare that preliminary recommendations require final engineering validation",
        "CANNOT recommend out-of-spec products merely to present a result",
      ],
      unauthorizedActions: [
        "Claiming guaranteed cycle performance without full dynamic multi-body analysis",
      ],
    },
    allowedReadOperations: ["query_product_catalogue", "evaluate_sizing_rules", "inspect_specifications"],
    allowedWriteOperations: ["generate_selection_dossier", "log_selection_session"],
    requiredInputTypes: ["SelectionRule", "ProductRange"],
    expectedOutputTypes: ["ProductRange"],
    evidenceRequirements: ["Matched parameter filter criteria with safety margins"],
    verificationCriteria: ["Meets continuous thermal torque and peak shock margins"],
    humanReviewRequirements: {
      mandatoryTriggers: ["Sizing results submitted for formal commercial quote"],
      approvalWorkflow: "Application Engineering Team reviews RFQ before commercial quotation dispatch.",
    },
    capabilities: [
      {
        capabilityId: "cap:reducer-sizing-matrix",
        name: "Reducer Selection Solver",
        description: "Filters reducers matching required output torque, speed, and backlash constraints.",
        inputSchemaDescription: "{ requiredTorqueNm: number, outputSpeedRpm: number, maxBacklashArcmin: number }",
        outputSchemaDescription: "{ candidateRanges: Array<{ id: string, name: string, torqueMarginPercent: number }> }",
        isDeterministic: true,
      },
    ],
  },

  // 7. ROBOTICS ARCHITECTURE AGENT
  {
    agentId: "agent:robotics-architecture",
    agentName: "Robotics Architecture Agent",
    role: "System-Level Hardware Topology & Kinematic Stack Assembly",
    primaryPurpose: "Validates complete 6-tier mechatronic architectures from mechanical transmission up to edge intelligence.",
    scopeAndBoundaries: {
      authorizedActions: [
        "Verify complete signal chains from encoder feedback to servo drive to motion controller",
        "Verify functional safety isolation (ISO 13849-1 PLe safety circuit independence)",
        "Calculate complete fieldbus latency budgets (< 250 µs for deterministic motion loops)",
      ],
      strictBoundaries: [
        "MUST maintain orthogonal separation between deterministic control and asynchronous AI perception",
        "CANNOT route emergency-stop or safety interlocking through non-safety software loops",
      ],
      unauthorizedActions: [
        "Authorizing unverified architectures with single points of failure in safety circuits",
      ],
    },
    allowedReadOperations: ["inspect_architecture_stack", "query_intelligence_framework", "inspect_safety_circuits"],
    allowedWriteOperations: ["stage_architecture_diagram", "flag_safety_architecture_violation"],
    requiredInputTypes: ["RobotSubsystem", "IntelligenceLevel", "ProductRange"],
    expectedOutputTypes: ["RobotSubsystem"],
    evidenceRequirements: ["System signal flow diagram", "Safety circuit category definition (Cat 3/4)"],
    verificationCriteria: ["Zero single points of failure in safety path, fieldbus latency within budget"],
    humanReviewRequirements: {
      mandatoryTriggers: ["Any modification to safety loop or real-time control bus topology"],
      approvalWorkflow: "Certified Functional Safety Engineer sign-off.",
    },
    capabilities: [
      {
        capabilityId: "cap:latency-budget-audit",
        name: "Fieldbus Latency Budgeter",
        description: "Sums cyclic propagation delays across TSN switches, fieldbus masters, and drives.",
        inputSchemaDescription: "{ busNodesCount: number, cycleRateUs: number, payloadBytesPerNode: number }",
        outputSchemaDescription: "{ totalLatencyUs: number, isJitterCompliant: boolean }",
        isDeterministic: true,
      },
    ],
  },

  // 8. TECHNICAL DOCUMENTATION AGENT
  {
    agentId: "agent:technical-documentation",
    agentName: "Technical Documentation Agent",
    role: "Engineering Resource Management & Document Lifecycle Auditing",
    primaryPurpose: "Manages verified datasheets, 3D CAD STEP models, wiring diagrams, and manual revisions.",
    scopeAndBoundaries: {
      authorizedActions: [
        "Audit resource links to ensure zero dead links or 404 responses",
        "Verify CAD model coordinate frames and ISO 9409-1 flange alignment",
        "Track document revision codes (e.g. REV 2026.1) and deprecation notices",
      ],
      strictBoundaries: [
        "MUST immediately flag and unpublish dead or broken resource links",
        "CANNOT link to unverified third-party CAD mirrors or placeholder files",
      ],
      unauthorizedActions: [
        "Fabricating fictitious CAD download links",
      ],
    },
    allowedReadOperations: ["audit_resource_links", "inspect_cad_metadata", "verify_document_hashes"],
    allowedWriteOperations: ["update_resource_status", "deprecate_outdated_datasheet"],
    requiredInputTypes: ["EngineeringResource"],
    expectedOutputTypes: ["EngineeringResource"],
    evidenceRequirements: ["HTTP 200 verification header", "Cryptographic file hash"],
    verificationCriteria: ["100% link availability and verified manufacturer origin"],
    humanReviewRequirements: {
      mandatoryTriggers: ["Datasheet superseded by major manufacturer redesign"],
      approvalWorkflow: "Documentation manager approval.",
    },
    capabilities: [
      {
        capabilityId: "cap:resource-link-health-check",
        name: "Resource Link Validator",
        description: "Executes automated HTTP HEAD checks against all published engineering resources.",
        inputSchemaDescription: "{ resourceId: string, url: string }",
        outputSchemaDescription: "{ httpStatus: number, contentType: string, isValid: boolean }",
        isDeterministic: true,
      },
    ],
  },

  // 9. ENGINEERING ENQUIRY AGENT
  {
    agentId: "agent:engineering-enquiry",
    agentName: "Engineering Enquiry Agent",
    role: "Technical RFQ Structuring & Application Dispatch",
    primaryPurpose: "Transforms unstructured engineering enquiry inputs into structured Jira engineering tickets and Google Sheets lead records.",
    scopeAndBoundaries: {
      authorizedActions: [
        "Sanitize and validate contact details, email format, and company credentials",
        "Structure customer operating requirements (payload, cadence, environment, budget)",
        "Route RFQ to appropriate engineering specialist based on product line and industry",
      ],
      strictBoundaries: [
        "MUST never expose customer personal information in client-side logs or public URLs",
        "CANNOT promise commercial pricing or delivery dates autonomously",
      ],
      unauthorizedActions: [
        "Autonomous commercial contract commitment or unauthorized discounting",
      ],
    },
    allowedReadOperations: ["inspect_enquiry_form", "query_sales_routing_matrix"],
    allowedWriteOperations: ["create_jira_issue", "append_google_sheets_record", "send_confirmation_receipt"],
    requiredInputTypes: ["Enquiry"],
    expectedOutputTypes: ["Enquiry"],
    evidenceRequirements: ["Valid user consent", "Completed technical requirement payload"],
    verificationCriteria: ["Successful Jira issue creation key and Google Sheets 200 OK"],
    humanReviewRequirements: {
      mandatoryTriggers: ["All commercial RFQs requiring binding quotation"],
      approvalWorkflow: "Commercial Engineering Director approval before quotation dispatch.",
    },
    capabilities: [
      {
        capabilityId: "cap:rfq-payload-sanitizer",
        name: "Enquiry Payload Sanitizer",
        description: "Validates and sanitizes customer requirements before dispatch to Jira.",
        inputSchemaDescription: "{ name: string, company: string, email: string, requirementsText: string }",
        outputSchemaDescription: "{ sanitizedPayload: Record<string, string>, isSpam: boolean, isValid: boolean }",
        isDeterministic: true,
      },
    ],
  },

  // 10. CATALOGUE QUALITY AGENT
  {
    agentId: "agent:catalogue-quality",
    agentName: "Catalogue Quality Agent",
    role: "Graph Completeness Auditing & Integrity Assertion",
    primaryPurpose: "Continuously traverses the knowledge graph to detect missing specifications, broken relationships, unverified claims, and orphaned nodes.",
    scopeAndBoundaries: {
      authorizedActions: [
        "Traverse all nodes and edges to verify referential integrity",
        "Flag products with status 'specification-pending' that exceed review deadlines",
        "Generate automated Graph Integrity Reports with pass/warning/fail metrics",
      ],
      strictBoundaries: [
        "MUST enforce zero tolerance for ungrounded claims or broken internal links",
        "CANNOT auto-delete nodes without human administrative review",
      ],
      unauthorizedActions: [
        "Silently suppressing graph integrity warnings",
      ],
    },
    allowedReadOperations: ["traverse_entire_graph", "audit_graph_integrity", "inspect_unverified_claims"],
    allowedWriteOperations: ["publish_integrity_report", "flag_catalogue_defect"],
    requiredInputTypes: ["ProductLine", "ProductRange", "Specification", "CompatibilityRule"],
    expectedOutputTypes: ["Specification"],
    evidenceRequirements: ["Referential graph traversal trace", "Audit rule assertion logs"],
    verificationCriteria: ["Zero dangling pointers, 100% of published nodes linked to valid parents"],
    humanReviewRequirements: {
      mandatoryTriggers: ["Graph integrity status drops to 'WARNING' or 'FAIL'"],
      approvalWorkflow: "System Architect intervention required to resolve integrity defects.",
    },
    capabilities: [
      {
        capabilityId: "cap:full-graph-audit",
        name: "Full Graph Traversal Auditor",
        description: "Checks every node and edge for referential validity and source traceability.",
        inputSchemaDescription: "{ checkOrphans: boolean, checkSources: boolean }",
        outputSchemaDescription: "{ totalNodes: number, totalEdges: number, defectCount: number, status: string }",
        isDeterministic: true,
      },
    ],
  },
];

export const getAgentContractById = (agentId: string): FutureAgentContract | undefined =>
  FUTURE_AGENT_CONTRACTS.find((a) => a.agentId === agentId);

export const getAllAgentContracts = (): FutureAgentContract[] =>
  FUTURE_AGENT_CONTRACTS;
