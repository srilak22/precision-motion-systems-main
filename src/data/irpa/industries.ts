// INDUS Industrial Robotics - 15 Supported Assessment Industries
// Generated from IRPA Phase 1 Research & Benchmark Data

export interface IndustryDefinition {
  id: string;
  code: string;
  name: string;
  slug: string;
  archetype: string;
  type: "Discrete" | "Process" | "Hybrid";
  currentMedian: number;
  targetBenchmark: number;
  primaryBottlenecks: string;
  fastTrackFocus: string;
  typicalPayback: string;
}

export const IRPA_INDUSTRIES: IndustryDefinition[] = [
  {
    "id": "IND-01",
    "code": "IND-01",
    "name": "Automotive Manufacturing",
    "slug": "automotive",
    "archetype": "Discrete OEM / Tier 1",
    "type": "Discrete",
    "currentMedian": 3.4,
    "targetBenchmark": 4.6,
    "primaryBottlenecks": "D01, D02, D07",
    "fastTrackFocus": "Dual-arm EV battery assembly, AMR line-side kitting",
    "typicalPayback": "12-16 months"
  },
  {
    "id": "IND-02",
    "code": "IND-02",
    "name": "Aerospace Manufacturing",
    "slug": "aerospace",
    "archetype": "High-Mix Low-Volume",
    "type": "Discrete",
    "currentMedian": 2.6,
    "targetBenchmark": 4.1,
    "primaryBottlenecks": "D04, D05, D11",
    "fastTrackFocus": "Robotic airframe drilling, laser metrology feedback",
    "typicalPayback": "18-24 months"
  },
  {
    "id": "IND-03",
    "code": "IND-03",
    "name": "Electronics Manufacturing",
    "slug": "electronics",
    "archetype": "High-Speed Micro-Assembly",
    "type": "Discrete",
    "currentMedian": 3.2,
    "targetBenchmark": 4.7,
    "primaryBottlenecks": "D02, D04, D08",
    "fastTrackFocus": "SCARA odd-form insertion, 3D SPI closed-loop AOI",
    "typicalPayback": "9-14 months"
  },
  {
    "id": "IND-04",
    "code": "IND-04",
    "name": "Semiconductor Manufacturing",
    "slug": "semiconductor",
    "archetype": "Cleanroom High-Capital",
    "type": "Discrete",
    "currentMedian": 3.8,
    "targetBenchmark": 4.9,
    "primaryBottlenecks": "D03, D08, D11",
    "fastTrackFocus": "EFEM cleanroom wafer handling, sub-fab predictive AI",
    "typicalPayback": "12-18 months"
  },
  {
    "id": "IND-05",
    "code": "IND-05",
    "name": "Pharmaceutical Manufacturing",
    "slug": "pharmaceutical",
    "archetype": "Sterile Life Sciences",
    "type": "Process",
    "currentMedian": 2.7,
    "targetBenchmark": 4.3,
    "primaryBottlenecks": "D01, D07, D10",
    "fastTrackFocus": "Aseptic isolator robotics, paperless eBR compliance",
    "typicalPayback": "14-20 months"
  },
  {
    "id": "IND-06",
    "code": "IND-06",
    "name": "Food and Beverage Processing",
    "slug": "food-beverage",
    "archetype": "High-Speed Hygienic",
    "type": "Hybrid",
    "currentMedian": 2.4,
    "targetBenchmark": 3.9,
    "primaryBottlenecks": "D01, D03, D06",
    "fastTrackFocus": "IP69K delta primary picking, robotic palletizing",
    "typicalPayback": "10-15 months"
  },
  {
    "id": "IND-07",
    "code": "IND-07",
    "name": "Textile Manufacturing",
    "slug": "textile",
    "archetype": "Deformable Material",
    "type": "Discrete",
    "currentMedian": 1.5,
    "targetBenchmark": 3.2,
    "primaryBottlenecks": "D01, D02, D04",
    "fastTrackFocus": "Vision-guided fabric handling, automated creel loading",
    "typicalPayback": "16-22 months"
  },
  {
    "id": "IND-08",
    "code": "IND-08",
    "name": "Metal Fabrication",
    "slug": "metal-fabrication",
    "archetype": "Job Shop / Structural",
    "type": "Discrete",
    "currentMedian": 2.2,
    "targetBenchmark": 3.8,
    "primaryBottlenecks": "D02, D05, D08",
    "fastTrackFocus": "Cobot weld cells, robotic press brake sheet tending",
    "typicalPayback": "11-15 months"
  },
  {
    "id": "IND-09",
    "code": "IND-09",
    "name": "Heavy Engineering",
    "slug": "heavy-engineering",
    "archetype": "Large-Scale Structural",
    "type": "Discrete",
    "currentMedian": 1.9,
    "targetBenchmark": 3.5,
    "primaryBottlenecks": "D02, D05, D07",
    "fastTrackFocus": "Track-mounted adaptive welding, robotic grit blasting",
    "typicalPayback": "18-26 months"
  },
  {
    "id": "IND-10",
    "code": "IND-10",
    "name": "Warehousing and Logistics",
    "slug": "logistics",
    "archetype": "Intralogistics / E-Commerce",
    "type": "Discrete",
    "currentMedian": 2.5,
    "targetBenchmark": 4.4,
    "primaryBottlenecks": "D03, D08, D10",
    "fastTrackFocus": "Goods-to-Person AMR fleets, robotic mixed-case palletizing",
    "typicalPayback": "10-16 months"
  },
  {
    "id": "IND-11",
    "code": "IND-11",
    "name": "Chemical Manufacturing",
    "slug": "chemical",
    "archetype": "Continuous Process",
    "type": "Process",
    "currentMedian": 2.8,
    "targetBenchmark": 4.2,
    "primaryBottlenecks": "D06, D08, D09",
    "fastTrackFocus": "ATEX robotic drum filling, quadruped inspection robots",
    "typicalPayback": "15-20 months"
  },
  {
    "id": "IND-12",
    "code": "IND-12",
    "name": "Packaging Industries",
    "slug": "packaging",
    "archetype": "High-Speed Converting",
    "type": "Discrete",
    "currentMedian": 3.0,
    "targetBenchmark": 4.5,
    "primaryBottlenecks": "D01, D03, D04",
    "fastTrackFocus": "Delta top-load cartoning, multi-line robotic palletizing",
    "typicalPayback": "8-12 months"
  },
  {
    "id": "IND-13",
    "code": "IND-13",
    "name": "Plastic and Polymer Manufacturing",
    "slug": "plastics",
    "archetype": "Molding & Converting",
    "type": "Hybrid",
    "currentMedian": 2.7,
    "targetBenchmark": 4.1,
    "primaryBottlenecks": "D01, D05, D06",
    "fastTrackFocus": "Side-entry high-speed IML robots, servo degating",
    "typicalPayback": "10-14 months"
  },
  {
    "id": "IND-14",
    "code": "IND-14",
    "name": "Consumer Goods Manufacturing",
    "slug": "consumer-goods",
    "archetype": "Fast-Moving Consumer",
    "type": "Discrete",
    "currentMedian": 2.9,
    "targetBenchmark": 4.4,
    "primaryBottlenecks": "D01, D03, D04",
    "fastTrackFocus": "Vision collating deltas, cobot variety pack kitting",
    "typicalPayback": "11-15 months"
  },
  {
    "id": "IND-15",
    "code": "IND-15",
    "name": "Industrial Equipment Manufacturing",
    "slug": "industrial-equipment",
    "archetype": "Precision Machinery",
    "type": "Discrete",
    "currentMedian": 2.4,
    "targetBenchmark": 4.0,
    "primaryBottlenecks": "D02, D05, D09",
    "fastTrackFocus": "Heavy casting CNC machine tending, robotic deburring",
    "typicalPayback": "14-18 months"
  }
];
