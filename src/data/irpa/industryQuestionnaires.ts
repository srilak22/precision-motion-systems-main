// INDUS Industrial Robotics - 15 Industry-Specific Questionnaires
// Generated from IRPA Phase 1 Industry Questionnaires

export interface IndustryQuestion {
  section: string;
  id: string;
  parameter: string;
  questionText: string;
  answerType: string;
  optionsOrRange: string;
  evidenceRequired: string;
  guidance: string;
}

export const INDUSTRY_QUESTIONNAIRES: Record<string, IndustryQuestion[]> = {
  "IND_01_Automotive": [
    {
      "section": "Company Information",
      "id": "IND_01-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_01-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_01-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_01-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_01-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_01-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_01-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_01-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_01-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_01-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_01-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_01-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_01-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_01-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_01-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_01-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_01-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_02_Aerospace": [
    {
      "section": "Company Information",
      "id": "IND_02-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_02-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_02-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_02-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_02-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_02-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_02-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_02-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_02-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_02-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_02-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_02-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_02-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_02-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_02-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_02-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_02-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_03_Electronics": [
    {
      "section": "Company Information",
      "id": "IND_03-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_03-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_03-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_03-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_03-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_03-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_03-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_03-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_03-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_03-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_03-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_03-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_03-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_03-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_03-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_03-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_03-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_04_Semiconductor": [
    {
      "section": "Company Information",
      "id": "IND_04-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_04-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_04-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_04-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_04-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_04-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_04-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_04-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_04-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_04-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_04-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_04-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_04-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_04-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_04-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_04-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_04-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_05_Pharmaceutical": [
    {
      "section": "Company Information",
      "id": "IND_05-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_05-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_05-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_05-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_05-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_05-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_05-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_05-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_05-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_05-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_05-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_05-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_05-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_05-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_05-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_05-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_05-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_06_Food_Beverage": [
    {
      "section": "Company Information",
      "id": "IND_06-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_06-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_06-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_06-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_06-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_06-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_06-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_06-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_06-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_06-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_06-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_06-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_06-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_06-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_06-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_06-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_06-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_07_Textile": [
    {
      "section": "Company Information",
      "id": "IND_07-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_07-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_07-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_07-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_07-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_07-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_07-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_07-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_07-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_07-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_07-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_07-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_07-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_07-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_07-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_07-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_07-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_08_Metal_Fab": [
    {
      "section": "Company Information",
      "id": "IND_08-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_08-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_08-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_08-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_08-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_08-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_08-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_08-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_08-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_08-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_08-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_08-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_08-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_08-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_08-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_08-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_08-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_09_Heavy_Eng": [
    {
      "section": "Company Information",
      "id": "IND_09-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_09-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_09-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_09-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_09-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_09-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_09-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_09-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_09-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_09-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_09-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_09-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_09-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_09-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_09-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_09-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_09-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_10_Warehouse": [
    {
      "section": "Company Information",
      "id": "IND_10-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_10-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_10-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_10-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_10-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_10-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_10-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_10-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_10-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_10-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_10-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_10-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_10-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_10-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_10-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_10-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_10-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_11_Chemical": [
    {
      "section": "Company Information",
      "id": "IND_11-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_11-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_11-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_11-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_11-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_11-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_11-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_11-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_11-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_11-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_11-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_11-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_11-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_11-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_11-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_11-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_11-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_12_Packaging": [
    {
      "section": "Company Information",
      "id": "IND_12-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_12-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_12-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_12-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_12-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_12-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_12-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_12-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_12-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_12-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_12-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_12-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_12-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_12-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_12-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_12-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_12-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_13_Plastic_Polymer": [
    {
      "section": "Company Information",
      "id": "IND_13-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_13-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_13-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_13-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_13-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_13-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_13-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_13-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_13-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_13-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_13-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_13-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_13-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_13-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_13-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_13-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_13-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_14_Consumer_Goods": [
    {
      "section": "Company Information",
      "id": "IND_14-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_14-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_14-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_14-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_14-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_14-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_14-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_14-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_14-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_14-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_14-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_14-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_14-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_14-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_14-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_14-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_14-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ],
  "IND_15_Industrial_Equip": [
    {
      "section": "Company Information",
      "id": "IND_15-01",
      "parameter": "Corporate Entity & Plant Location",
      "questionText": "What is the full corporate legal entity name, facility site address, and operational business unit?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Free text (Company Name, Facility Address, GPS, Parent Corp)",
      "evidenceRequired": "Business registration certificate or plant overview brochure",
      "guidance": "Establishes baseline legal and physical entity scope for assessment"
    },
    {
      "section": "Company Information",
      "id": "IND_15-02",
      "parameter": "Annual Operating Revenue",
      "questionText": "What is the approximate annual revenue or gross operating budget of this manufacturing facility?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$10M, $10M-$50M, $50M-$250M, $250M-$1B, >$1B",
      "evidenceRequired": "Annual report or verified executive disclosure",
      "guidance": "Determines capital investment threshold and financial return horizons"
    },
    {
      "section": "Factory Profile",
      "id": "IND_15-03",
      "parameter": "Facility Footprint & Layout",
      "questionText": "What is the total covered manufacturing floor space (sq ft / sq m) and plant layout type?",
      "answerType": "Dropdown",
      "optionsOrRange": "Fixed Straight Line, U-Shaped Cells, Process Villages (Job Shop), Island-Based Agile Matrix",
      "evidenceRequired": "Plant layout drawing (DWG / PDF)",
      "guidance": "Identifies physical material transit distances and spatial constraints for robotics"
    },
    {
      "section": "Factory Profile",
      "id": "IND_15-04",
      "parameter": "Operating Schedule & Shifts",
      "questionText": "What is the weekly operational shift structure and annual operating days?",
      "answerType": "Multiple Choice",
      "optionsOrRange": "1 shift (8h/5d), 2 shifts (16h/5d), 3 shifts (24h/5d), Continuous 24/7 (365d)",
      "evidenceRequired": "Plant production calendar",
      "guidance": "Critical for calculating labor cost savings and equipment payback multiples"
    },
    {
      "section": "Production Capacity",
      "id": "IND_15-05",
      "parameter": "Nameplate vs Actual Throughput",
      "questionText": "What is the plant's nameplate design capacity versus average trailing 12-month actual output?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Percentage (%) or Units/Hour",
      "evidenceRequired": "Monthly production volume summary reports",
      "guidance": "Identifies overall plant capacity utilization and growth constraints"
    },
    {
      "section": "Production Capacity",
      "id": "IND_15-06",
      "parameter": "Primary Production Bottleneck",
      "questionText": "Which specific process station or machine currently limits overall plant throughput?",
      "answerType": "Descriptive Response",
      "optionsOrRange": "Station name, machine type, process description",
      "evidenceRequired": "Vaule Stream Map (VSM) or bottleneck cycle time audit",
      "guidance": "Directs high-priority robotics recommendations to highest financial return areas"
    },
    {
      "section": "Existing Machinery",
      "id": "IND_15-07",
      "parameter": "Machinery Fleet Count & Age",
      "questionText": "How many primary production machines are installed, and what percentage exceed 10 years of age?",
      "answerType": "Percentage",
      "optionsOrRange": "Total machines (Count) and % older than 10 years (0-100%)",
      "evidenceRequired": "Machine asset register with installation years",
      "guidance": "Evaluates retrofit versus replacement needs for legacy automation"
    },
    {
      "section": "Current Robotics",
      "id": "IND_15-08",
      "parameter": "Active Industrial Robot Count",
      "questionText": "How many operational industrial robots (articulated, SCARA, delta, cobot) are currently deployed?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Integer count (0 to 1,000+)",
      "evidenceRequired": "Robotics asset list with OEM models and serial numbers",
      "guidance": "Calculates factory robot density and baseline automation maturity"
    },
    {
      "section": "Manual Operations",
      "id": "IND_15-09",
      "parameter": "Direct Labor Manual Operation %",
      "questionText": "What percentage of total assembly, processing, and handling steps are executed manually by human labor?",
      "answerType": "Percentage",
      "optionsOrRange": "0% to 100% in 5% increments",
      "evidenceRequired": "Industrial engineering labor staffing tables",
      "guidance": "Directly indicates potential scope for robotic process automation"
    },
    {
      "section": "Material Handling",
      "id": "IND_15-10",
      "parameter": "Internal Transit Automation %",
      "questionText": "What percentage of internal raw material, WIP, and finished product movement is automated?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (All forklifts/carts) to 100% (Full AGV/AMR/ASRS)",
      "evidenceRequired": "Intralogistics equipment audit, material flow diagrams",
      "guidance": "Quantifies warehouse and material handling modernization opportunity"
    },
    {
      "section": "Quality Inspection",
      "id": "IND_15-11",
      "parameter": "Machine Vision & Metrology",
      "questionText": "Is automated machine vision or in-line metrology used for 100% quality inspection?",
      "answerType": "Dropdown",
      "optionsOrRange": "None (Manual visual only), Sample CMM checks only, Inline 2D vision, Inline 3D laser/metrology, AI visual inspection",
      "evidenceRequired": "Quality control plan, vision station specifications",
      "guidance": "Evaluates scrap reduction and defect containment capabilities"
    },
    {
      "section": "Maintenance Practices",
      "id": "IND_15-12",
      "parameter": "Unplanned Machine Downtime",
      "questionText": "What is the average monthly unplanned machine downtime percentage across primary lines?",
      "answerType": "Percentage",
      "optionsOrRange": "0.0% to 30.0%+",
      "evidenceRequired": "CMMS downtime logs, OEE availability reports",
      "guidance": "Evaluates reliability, predictive maintenance need, and financial loss rate"
    },
    {
      "section": "Industrial Connectivity",
      "id": "IND_15-13",
      "parameter": "Machine Network Connectivity %",
      "questionText": "What percentage of plant machines are connected to a central network (Ethernet/SCADA/MES)?",
      "answerType": "Percentage",
      "optionsOrRange": "0% (Completely air-gapped) to 100% (All connected)",
      "evidenceRequired": "Plant network architecture diagram, IP switch tables",
      "guidance": "Assesses foundational readiness for Industry 4.0 and IIoT analytics"
    },
    {
      "section": "Workforce Capabilities",
      "id": "IND_15-14",
      "parameter": "Internal Automation Engineering Staff",
      "questionText": "How many full-time automation, robotics, and controls engineers are employed at this facility?",
      "answerType": "Numeric Input",
      "optionsOrRange": "Count of full-time dedicated controls/robotics engineers",
      "evidenceRequired": "Plant organizational chart, technical job descriptions",
      "guidance": "Measures client self-sufficiency vs reliance on turnkey integration"
    },
    {
      "section": "Current Challenges",
      "id": "IND_15-15",
      "parameter": "Top Operational Pain Points",
      "questionText": "What are the facility's three most critical operational or business challenges?",
      "answerType": "Multi-select",
      "optionsOrRange": "Labor shortages, High scrap rate, Frequent changeovers, Safety/ergonomics, Equipment downtime, Inflexible tooling",
      "evidenceRequired": "Plant manager interview notes",
      "guidance": "Aligns robotics solution roadmap with core executive priorities"
    },
    {
      "section": "Automation Objectives",
      "id": "IND_15-16",
      "parameter": "Horizon 3-Year Automation Goals",
      "questionText": "What are the primary strategic targets for automation over the next 24-36 months?",
      "answerType": "Multi-select",
      "optionsOrRange": "Reduce direct labor cost by >30%, Increase throughput by >25%, Achieve zero-defect quality, Flexible mixed-model runs, Carbon reduction",
      "evidenceRequired": "Executive strategy brief or capital planning charter",
      "guidance": "Defines the target maturity state ($M_{target}$) for gap calculations"
    },
    {
      "section": "Investment Readiness",
      "id": "IND_15-17",
      "parameter": "CapEx Budget & Hurdle Payback",
      "questionText": "What is the approved/estimated capital expenditure budget and maximum required payback period?",
      "answerType": "Dropdown",
      "optionsOrRange": "<$100k (<12mo), $100k-$500k (12-18mo), $500k-$2M (18-24mo), $2M-$10M (24-36mo), >$10M (>36mo)",
      "evidenceRequired": "CapEx budget authorization or investment policy",
      "guidance": "Ensures technical robotics recommendations match capital constraints"
    }
  ]
};
