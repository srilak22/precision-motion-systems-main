/**
 * INDUS Industrial Robotics — Knowledge Graph & Agentic Network Schema
 *
 * Defines the formal ontologies, node types, relationship edges,
 * validation rules, and future agent-ready capability contracts.
 */

export type KnowledgeNodeType =
  | "ProductLine"
  | "ProductRange"
  | "ProductModel"
  | "ProductConfiguration"
  | "Specification"
  | "Technology"
  | "Component"
  | "Application"
  | "UseCase"
  | "Industry"
  | "RobotSubsystem"
  | "IntelligenceLevel"
  | "EngineeringResource"
  | "ResearchSource"
  | "CompatibilityRule"
  | "SelectionRule"
  | "Enquiry";

export type KnowledgeRelationType =
  | "BELONGS_TO"
  | "USES_TECHNOLOGY"
  | "HAS_SPECIFICATION"
  | "HAS_CONFIGURATION"
  | "USED_IN"
  | "SUPPORTS_USE_CASE"
  | "CONNECTS_TO"
  | "REQUIRES_COMPONENT"
  | "COMPATIBLE_WITH"
  | "INCOMPATIBLE_WITH"
  | "ALTERNATIVE_TO"
  | "REQUIRES_INTERFACE"
  | "HAS_RESOURCE"
  | "SUPPORTED_BY_SOURCE"
  | "OPERATES_AT_LEVEL"
  | "REQUIRES_VALIDATION";

export type VerificationState =
  | "verified"
  | "configurable"
  | "preliminary"
  | "custom-on-request"
  | "specification-pending";

export type ContentStatus =
  | "draft"
  | "reviewed"
  | "published"
  | "deprecated"
  | "superseded";

export interface NodeAuditMetadata {
  createdAt: string;
  lastReviewed: string;
  reviewedBy: string;
  version: string;
  changeLog?: string;
}

export interface AgentAccessPolicy {
  allowedAgents: string[];
  readRestricted: boolean;
  writeRequiresHumanApproval: boolean;
  sensitiveCommercialData: boolean;
}

export interface KnowledgeNode {
  id: string; // Global stable identifier, e.g. "range:ind-red-cup-strain-wave"
  nodeType: KnowledgeNodeType;
  canonicalName: string;
  slug: string;
  summary: string;
  description: string;
  parentId?: string;
  attributes: Record<string, any>;
  specificationRefs?: string[];
  sourceRefs?: string[];
  relationshipRefs?: string[];
  verificationStatus: VerificationState;
  contentStatus: ContentStatus;
  audit: NodeAuditMetadata;
  agentAccess: AgentAccessPolicy;
}

export interface KnowledgeEdge {
  id: string; // Unique edge identifier, e.g. "edge:pmsm-compat-strain-wave"
  sourceNodeId: string;
  targetNodeId: string;
  relationType: KnowledgeRelationType;
  description: string;
  verificationStatus: VerificationState;
  evidenceSourceId?: string;
  conditions?: string[];
  constraints?: Record<string, any>;
  bidirectional?: boolean;
}

export interface AgentCapability {
  capabilityId: string;
  name: string;
  description: string;
  inputSchemaDescription: string;
  outputSchemaDescription: string;
  isDeterministic: boolean;
}

export interface FutureAgentContract {
  agentId: string;
  agentName: string;
  role: string;
  primaryPurpose: string;
  scopeAndBoundaries: {
    authorizedActions: string[];
    strictBoundaries: string[];
    unauthorizedActions: string[];
  };
  allowedReadOperations: string[];
  allowedWriteOperations: string[];
  requiredInputTypes: KnowledgeNodeType[];
  expectedOutputTypes: KnowledgeNodeType[];
  evidenceRequirements: string[];
  verificationCriteria: string[];
  humanReviewRequirements: {
    mandatoryTriggers: string[];
    approvalWorkflow: string;
  };
  capabilities: AgentCapability[];
}

export interface GraphIntegrityReport {
  timestamp: string;
  totalNodes: number;
  totalEdges: number;
  nodesByType: Record<KnowledgeNodeType, number>;
  edgesByType: Record<KnowledgeRelationType, number>;
  verificationBreakdown: Record<VerificationState, number>;
  danglingReferences: {
    edgeId: string;
    missingNodeId: string;
    direction: "source" | "target";
  }[];
  orphanedNodes: string[];
  nodesLackingSources: string[];
  integrityStatus: "PASS" | "WARNING" | "FAIL";
}
