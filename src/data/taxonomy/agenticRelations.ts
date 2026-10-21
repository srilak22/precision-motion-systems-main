/**
 * INDUS Total Robotics Taxonomy — Graph Architecture & Future Agentic Network
 *
 * Defines stable identifiers, explicit semantic ontology relationships, and an automated
 * integrity validation engine preparing the data foundation for future autonomous
 * research, classification, and component selection agents.
 */

import { TOTAL_ROBOTICS_PILLARS, getAllSubcategories } from "./roboticsTaxonomyData";
import { TAXONOMY_FACETS } from "./facets";
import { RESEARCH_REGISTER } from "./researchRegister";

export type AgenticRelationType =
  | "SUBCATEGORY_OF"
  | "CLASSIFIED_BY"
  | "OPERATES_IN"
  | "PERFORMS"
  | "USES_COMPONENT"
  | "SUPPORTS_APPLICATION"
  | "HAS_SPECIFICATION"
  | "HAS_RESOURCE"
  | "SUPPORTED_BY_SOURCE"
  | "REQUIRES_VALIDATION";

export interface TaxonomyGraphNode {
  id: string;
  type:
    | "Pillar"
    | "Subcategory"
    | "FacetOption"
    | "CatalogueComponent"
    | "Application"
    | "ResearchSource"
    | "Specification"
    | "Resource";
  label: string;
  metadata?: Record<string, any>;
}

export interface TaxonomyGraphEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: AgenticRelationType;
  label: string;
  verificationStatus: "verified" | "requiring validation" | "general engineering relevance";
  evidenceSourceId?: string;
}

export interface TaxonomyGraphIntegrityReport {
  timestamp: string;
  totalNodes: number;
  totalEdges: number;
  nodesByType: Record<string, number>;
  edgesByRelation: Record<AgenticRelationType, number>;
  duplicateIds: string[];
  danglingEdges: {
    edgeId: string;
    missingId: string;
    role: "source" | "target";
  }[];
  missingParents: string[];
  unsourcedClaims: string[];
  status: "PASS" | "WARNING" | "FAIL";
  message: string;
}

/**
 * Builds the canonical knowledge graph nodes and edges dynamically from the taxonomy data
 */
export function buildTaxonomyGraph(): { nodes: TaxonomyGraphNode[]; edges: TaxonomyGraphEdge[] } {
  const nodesMap = new Map<string, TaxonomyGraphNode>();
  const edges: TaxonomyGraphEdge[] = [];

  // 1. Add Research Sources
  for (const src of RESEARCH_REGISTER) {
    nodesMap.set(src.id, {
      id: src.id,
      type: "ResearchSource",
      label: src.title,
      metadata: { publisher: src.publisherOrManufacturer, url: src.url },
    });
  }

  // 2. Add Facet Options
  for (const facetKey of Object.keys(TAXONOMY_FACETS)) {
    const facet = TAXONOMY_FACETS[facetKey];
    for (const opt of facet.options) {
      const facetNodeId = `facet:${facet.id}:${opt.id}`;
      nodesMap.set(facetNodeId, {
        id: facetNodeId,
        type: "FacetOption",
        label: opt.label,
        metadata: { facetId: facet.id, shortCode: opt.shortCode },
      });
    }
  }

  // 3. Add Pillars
  for (const pillar of TOTAL_ROBOTICS_PILLARS) {
    nodesMap.set(pillar.id, {
      id: pillar.id,
      type: "Pillar",
      label: pillar.title,
      metadata: { categoryNumber: pillar.categoryNumber },
    });

    // Connect Pillar to governing standards
    for (const std of pillar.governingStandards) {
      const matchedSource = RESEARCH_REGISTER.find((s) => s.title.includes(std.split(":")[0]));
      if (matchedSource) {
        edges.push({
          id: `edge:${pillar.id}:source:${matchedSource.id}`,
          sourceNodeId: pillar.id,
          targetNodeId: matchedSource.id,
          relationType: "SUPPORTED_BY_SOURCE",
          label: "Governed by Standard",
          verificationStatus: "verified",
        });
      }
    }
  }

  // 4. Add Subcategories and Relationships
  for (const subcat of getAllSubcategories()) {
    nodesMap.set(subcat.id, {
      id: subcat.id,
      type: "Subcategory",
      label: subcat.title,
      metadata: { ifrClassification: subcat.ifrClassification, isoRef: subcat.isoStandardRef },
    });

    // Edge: SUBCATEGORY_OF
    edges.push({
      id: `edge:${subcat.id}:parent:${subcat.pillarId}`,
      sourceNodeId: subcat.id,
      targetNodeId: subcat.pillarId,
      relationType: "SUBCATEGORY_OF",
      label: "Subcategory of Pillar",
      verificationStatus: "verified",
    });

    // Edge: CLASSIFIED_BY for each facet
    const facetEntries = Object.entries(subcat.facets) as [string, string[]][];
    for (const [fName, optIds] of facetEntries) {
      for (const optId of optIds) {
        const facetNodeId = `facet:${fName}:${optId}`;
        if (nodesMap.has(facetNodeId)) {
          let relation: AgenticRelationType = "CLASSIFIED_BY";
          if (fName === "environment") relation = "OPERATES_IN";
          if (fName === "capability") relation = "PERFORMS";

          edges.push({
            id: `edge:${subcat.id}:${fName}:${optId}`,
            sourceNodeId: subcat.id,
            targetNodeId: facetNodeId,
            relationType: relation,
            label: `${relation} -> ${optId}`,
            verificationStatus: "verified",
          });
        }
      }
    }

    // Edge: USES_COMPONENT
    for (const comp of subcat.compatibleComponents) {
      const compNodeId = `comp:${comp.componentId}`;
      if (!nodesMap.has(compNodeId)) {
        nodesMap.set(compNodeId, {
          id: compNodeId,
          type: "CatalogueComponent",
          label: comp.name,
          metadata: { lineId: comp.lineId },
        });
      }
      edges.push({
        id: `edge:${subcat.id}:comp:${comp.componentId}`,
        sourceNodeId: subcat.id,
        targetNodeId: compNodeId,
        relationType: comp.relationshipType === "requiring validation" ? "REQUIRES_VALIDATION" : "USES_COMPONENT",
        label: comp.relationshipType,
        verificationStatus: comp.relationshipType,
      });
    }

    // Edge: SUPPORTS_APPLICATION
    for (const app of subcat.applications) {
      const appNodeId = `app:${app.applicationId}`;
      if (!nodesMap.has(appNodeId)) {
        nodesMap.set(appNodeId, {
          id: appNodeId,
          type: "Application",
          label: app.name,
          metadata: { domain: app.domain },
        });
      }
      edges.push({
        id: `edge:${subcat.id}:app:${app.applicationId}`,
        sourceNodeId: subcat.id,
        targetNodeId: appNodeId,
        relationType: "SUPPORTS_APPLICATION",
        label: `Deployed in ${app.domain}`,
        verificationStatus: "verified",
      });
    }

    // Specifications and Sourced Claims
    for (let i = 0; i < subcat.specifications.length; i++) {
      const spec = subcat.specifications[i];
      const specNodeId = `spec:${subcat.id}:${i}`;
      nodesMap.set(specNodeId, {
        id: specNodeId,
        type: "Specification",
        label: `${spec.parameter}: ${spec.value} ${spec.unit}`,
        metadata: { ...spec },
      });

      edges.push({
        id: `edge:${subcat.id}:has_spec:${i}`,
        sourceNodeId: subcat.id,
        targetNodeId: specNodeId,
        relationType: "HAS_SPECIFICATION",
        label: `Specified: ${spec.parameter}`,
        verificationStatus: spec.verificationStatus === "verified" ? "verified" : "general engineering relevance",
      });

      // Connect spec to source
      if (spec.source && nodesMap.has(spec.source)) {
        edges.push({
          id: `edge:spec:${i}:src:${spec.source}`,
          sourceNodeId: specNodeId,
          targetNodeId: spec.source,
          relationType: "SUPPORTED_BY_SOURCE",
          label: `Evidence Source`,
          verificationStatus: "verified",
        });
      }
    }

    // Resources
    for (let r = 0; r < subcat.resources.length; r++) {
      const res = subcat.resources[r];
      const resNodeId = `res:${subcat.id}:${r}`;
      nodesMap.set(resNodeId, {
        id: resNodeId,
        type: "Resource",
        label: res.title,
        metadata: { type: res.type, referenceId: res.referenceId },
      });

      edges.push({
        id: `edge:${subcat.id}:res:${r}`,
        sourceNodeId: subcat.id,
        targetNodeId: resNodeId,
        relationType: "HAS_RESOURCE",
        label: res.type,
        verificationStatus: "verified",
      });
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  };
}

/**
 * Validates the complete taxonomy knowledge graph for integrity:
 * - Duplicate IDs
 * - Dangling references (missing source or target)
 * - Missing parents
 * - Unsourced claims
 */
export function validateTaxonomyGraph(): TaxonomyGraphIntegrityReport {
  const { nodes, edges } = buildTaxonomyGraph();
  const nodeIds = new Set<string>();
  const duplicateIds: string[] = [];

  for (const node of nodes) {
    if (nodeIds.has(node.id)) {
      duplicateIds.push(node.id);
    }
    nodeIds.add(node.id);
  }

  const danglingEdges: { edgeId: string; missingId: string; role: "source" | "target" }[] = [];
  const edgesByRelation: Record<AgenticRelationType, number> = {
    SUBCATEGORY_OF: 0,
    CLASSIFIED_BY: 0,
    OPERATES_IN: 0,
    PERFORMS: 0,
    USES_COMPONENT: 0,
    SUPPORTS_APPLICATION: 0,
    HAS_SPECIFICATION: 0,
    HAS_RESOURCE: 0,
    SUPPORTED_BY_SOURCE: 0,
    REQUIRES_VALIDATION: 0,
  };

  for (const edge of edges) {
    edgesByRelation[edge.relationType] = (edgesByRelation[edge.relationType] || 0) + 1;
    if (!nodeIds.has(edge.sourceNodeId)) {
      danglingEdges.push({ edgeId: edge.id, missingId: edge.sourceNodeId, role: "source" });
    }
    if (!nodeIds.has(edge.targetNodeId)) {
      danglingEdges.push({ edgeId: edge.id, missingId: edge.targetNodeId, role: "target" });
    }
  }

  const missingParents: string[] = [];
  for (const subcat of getAllSubcategories()) {
    if (!nodeIds.has(subcat.pillarId)) {
      missingParents.push(subcat.id);
    }
  }

  const unsourcedClaims: string[] = [];
  for (const subcat of getAllSubcategories()) {
    for (const spec of subcat.specifications) {
      if (spec.verificationStatus === "verified" && (!spec.source || !nodeIds.has(spec.source))) {
        unsourcedClaims.push(`${subcat.id}: ${spec.parameter}`);
      }
    }
  }

  const nodesByType: Record<string, number> = {};
  for (const n of nodes) {
    nodesByType[n.type] = (nodesByType[n.type] || 0) + 1;
  }

  const isHealthy = duplicateIds.length === 0 && danglingEdges.length === 0 && missingParents.length === 0;

  return {
    timestamp: new Date().toISOString(),
    totalNodes: nodes.length,
    totalEdges: edges.length,
    nodesByType,
    edgesByRelation,
    duplicateIds,
    danglingEdges,
    missingParents,
    unsourcedClaims,
    status: isHealthy ? "PASS" : "FAIL",
    message: isHealthy
      ? `Knowledge Graph validated successfully: ${nodes.length} nodes, ${edges.length} edges across 10 relation types with 0 dangling references.`
      : `Integrity check failed: ${duplicateIds.length} duplicate IDs, ${danglingEdges.length} dangling references.`,
  };
}
