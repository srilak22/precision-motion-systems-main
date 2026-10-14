/**
 * INDUS Industrial Robotics — Robotics Consultation & Appointment Booking Types
 */

export type IndustryCategory =
  | "Automotive and automobile manufacturing"
  | "Electronics and electrical manufacturing"
  | "Food and beverage processing"
  | "Pharmaceuticals and healthcare manufacturing"
  | "Warehousing and logistics"
  | "Packaging and material handling"
  | "Metal fabrication and welding"
  | "Textile manufacturing"
  | "Agriculture and farming"
  | "Aerospace and precision manufacturing"
  | "General industrial automation"
  | "Other industries";

export type RobotCategory =
  | "Articulated robotic arms"
  | "Collaborative robots (cobots)"
  | "SCARA robots"
  | "Cartesian and gantry robots"
  | "Delta and pick-and-place robots"
  | "Autonomous mobile robots (AMRs)"
  | "Automated guided vehicles (AGVs)"
  | "Welding robots"
  | "Palletizing and depalletizing robots"
  | "Machine-tending robots"
  | "Inspection and quality-control automation"
  | "Robotic assembly systems"
  | "Custom robotic solutions"
  | "Complete industrial automation systems"
  | "Not sure, recommend a solution";

export type ProjectStage =
  | "Research"
  | "Planning"
  | "Budgeting"
  | "Ready to Implement"
  | "Existing System Upgrade";

export type PreferredSolution =
  | "New installation"
  | "Replacement"
  | "Integration"
  | "Upgrade"
  | "Consultation only";

export type OperatingEnvironment =
  | "Standard industrial factory"
  | "Cleanroom (ISO Class 3-8)"
  | "High temperature / Foundry"
  | "Washdown / Food Grade (IP67/IP69K)"
  | "Hazardous / ATEX / Explosive"
  | "Cold storage (-20°C to 4°C)"
  | "Outdoor / Dusty";

export type AccuracyRequirement =
  | "Ultra-precision (±0.02 mm or better)"
  | "High precision (±0.05 mm)"
  | "Standard precision (±0.1 mm - ±0.5 mm)"
  | "Coarse / Handling (±1 mm or more)"
  | "Not sure / To be evaluated";

export type ProductionShift =
  | "Continuous 24/7 (3 shifts)"
  | "Two shifts (16 hrs/day)"
  | "Single shift (8 hrs/day)"
  | "Batch / Intermittent run"
  | "Pilot / Prototype line";

export type BudgetRange =
  | "< $25,000"
  | "$25,000 - $50,000"
  | "$50,000 - $100,000"
  | "$100,000 - $250,000"
  | "> $250,000"
  | "Flexible / Undetermined";

export type ImplementationTimeline =
  | "Immediate (< 1 month)"
  | "1 - 3 months"
  | "3 - 6 months"
  | "6 - 12 months"
  | "Exploring / Planning phase";

export type ConsultationMode = "Google Meet (Online Video)" | "In-Person Consultation (INDUS Center)";

export type BookingStatus =
  | "New"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Rescheduled";

export interface BookingFormData {
  // Step 1: Industry & Application
  industry: IndustryCategory | "";
  specificApplication: string;
  robotCategory: RobotCategory | "";
  projectStage: ProjectStage;
  preferredSolution: PreferredSolution;

  // Step 2: Technical Specifications
  projectDescription: string;
  materialHandled: string;
  payloadKg: string;
  reachMm: string;
  cycleTimeSec: string;
  operatingEnvironment: OperatingEnvironment | "";
  accuracyRequirement: AccuracyRequirement | "";
  productionShifts: ProductionShift | "";
  existingEquipment: string;
  projectBudget: BudgetRange | "";
  implementationTimeline: ImplementationTimeline | "";
  
  // Conditional: Welding specific
  weldingProcess?: string | undefined;
  shieldingGas?: string | undefined;

  // Conditional: Handling / Palletizing specific
  palletDimensions?: string | undefined;
  palletThroughput?: string | undefined;

  // File Attachment (optional)
  attachmentName?: string | undefined;
  attachmentSize?: number | undefined;
  attachmentType?: string | undefined;
  attachmentData?: string | undefined; // base64 string

  // Step 3: Customer Information
  fullName: string;
  companyEmail: string;
  phoneNumber: string;
  companyName: string;
  jobTitle: string;
  country: string;
  city: string;
  companyWebsite?: string | undefined;
  consultationMode: ConsultationMode;
  additionalComments?: string | undefined;
  privacyConsent: boolean;

  // Step 4: Appointment Scheduling
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: string; // e.g. "10:00 - 10:30"
  timezone: string; // e.g. "Asia/Kolkata"

  // Honeypot anti-spam
  _hp?: string | undefined;
}

export interface ConsultationSlot {
  time: string; // e.g. "10:00"
  endTime: string; // e.g. "10:30"
  display: string; // e.g. "10:00 AM - 10:30 AM"
  available: boolean;
  reason?: string | undefined;
}

export interface ConsultationBookingRecord {
  bookingId: string; // e.g. "INDUS-BC-20261014-9481"
  calendarEventId: string;
  googleMeetUrl?: string | undefined;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;

  // Customer
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  companyName: string;
  jobTitle: string;
  country: string;
  city: string;
  companyWebsite?: string | undefined;

  // Requirement
  industry: IndustryCategory;
  robotCategory: RobotCategory;
  specificApplication: string;
  projectStage: ProjectStage;
  preferredSolution: PreferredSolution;
  consultationMode: ConsultationMode;
  projectDescription: string;
  materialHandled: string;
  payloadKg?: string | undefined;
  reachMm?: string | undefined;
  cycleTimeSec?: string | undefined;
  operatingEnvironment?: string | undefined;
  accuracyRequirement?: string | undefined;
  productionShifts?: string | undefined;
  existingEquipment?: string | undefined;
  projectBudget?: string | undefined;
  implementationTimeline?: string | undefined;
  weldingProcess?: string | undefined;
  palletDimensions?: string | undefined;
  attachmentName?: string | undefined;
  additionalComments?: string | undefined;

  // Appointment details
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // "10:00 - 10:30"
  timezone: string;

  // Admin notes
  adminNotes?: string | undefined;
}
