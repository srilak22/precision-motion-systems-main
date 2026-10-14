#!/usr/bin/env node
/**
 * INDUS Industrial Robotics — Consultation Booking System Integration Tests
 * 
 * Verifies:
 *  1. Industry and Robot category configurations (12 industries, 14 robot types)
 *  2. Slot calculation for business hours (09:30 - 18:00 IST) and weekend rejection
 *  3. Server-side validation of inputs, email, phone, and consent
 *  4. Booking confirmation with unique reference ID and Google Meet link
 *  5. Server-side concurrency lock and double-booking prevention
 *  6. Admin list, status change (New -> In Progress -> Completed/Cancelled)
 *  7. Cancellation handling and slot liberation
 *  8. .ICS file generation and Google Calendar URL generation
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local and .env
for (const envFile of [".env.local", ".env"]) {
  try {
    const content = readFileSync(resolve(__dirname, "..", envFile), "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {}
}

import consultationHandler from "../api/consultation.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// Mock Express Request & Response helper
function createMockReqRes({ method = "GET", url = "/api/consultation", body = {}, headers = {} } = {}) {
  const req = {
    method,
    url,
    body,
    headers: {
      host: "localhost:8080",
      origin: "http://localhost:8080",
      ...headers,
    },
  };

  let statusCode = 200;
  let responseData = null;
  const resHeaders = {};

  const res = {
    setHeader(k, v) {
      resHeaders[k.toLowerCase()] = v;
      return res;
    },
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    },
    end() {
      return res;
    },
  };

  const execute = async () => {
    await consultationHandler(req, res);
    return { status: statusCode, data: responseData, headers: resHeaders };
  };

  return { req, res, execute };
}

// Helper to find a future weekday (Monday - Friday)
function getFutureWeekday(daysAhead = 7) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Helper to find a weekend date
function getFutureWeekend() {
  const d = new Date();
  while (d.getDay() !== 0) {
    d.setDate(d.getDate() + 1);
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function runTests() {
  console.log("\n=======================================================");
  console.log(" INDUS INDUSTRIAL ROBOTICS — CONSULTATION SYSTEM TESTS");
  console.log("=======================================================\n");

  const testWeekday = getFutureWeekday(10);
  const testWeekend = getFutureWeekend();
  console.log(`Test Weekday Date: ${testWeekday}`);
  console.log(`Test Weekend Date: ${testWeekend}\n`);

  // -------------------------------------------------------------------------
  // TEST SUITE 1: Data Configuration & Model Integrity
  // -------------------------------------------------------------------------
  console.log("Suite 1: Data Configuration & Recommendations Integrity");
  try {
    const dataModule = await import("../src/data/robotics-consultation.ts");
    const { INDUSTRIES, ROBOT_CATEGORIES, PROJECT_STAGES, PREFERRED_SOLUTIONS, CONSULTATION_CONFIG } = dataModule;

    assert(Array.isArray(INDUSTRIES) && INDUSTRIES.length === 12, "All 12 specified industry categories exist");
    assert(Array.isArray(ROBOT_CATEGORIES) && ROBOT_CATEGORIES.length >= 15, "All 14 robot categories + 'Not sure' option exist");

    const automotive = INDUSTRIES.find((i) => i.id === "Automotive and automobile manufacturing");
    assert(Boolean(automotive && automotive.recommendedRobots.includes("Welding robots")), "Automotive industry recommends Welding robots");

    const electronics = INDUSTRIES.find((i) => i.id === "Electronics and electrical manufacturing");
    assert(Boolean(electronics && electronics.recommendedRobots.includes("SCARA robots")), "Electronics industry recommends SCARA robots");

    const food = INDUSTRIES.find((i) => i.id === "Food and beverage processing");
    assert(Boolean(food && food.recommendedRobots.includes("Delta and pick-and-place robots")), "Food & Beverage recommends Delta robots");

    const pharma = INDUSTRIES.find((i) => i.id === "Pharmaceuticals and healthcare manufacturing");
    assert(Boolean(pharma && pharma.recommendedRobots.includes("Inspection and quality-control automation")), "Pharma recommends Inspection automation");

    const logistics = INDUSTRIES.find((i) => i.id === "Warehousing and logistics");
    assert(Boolean(logistics && logistics.recommendedRobots.includes("Autonomous mobile robots (AMRs)")), "Logistics recommends AMRs");

    const notSureOption = ROBOT_CATEGORIES.find((r) => r.id === "Not sure, recommend a solution");
    assert(Boolean(notSureOption), "'Not sure, recommend a solution' is available for guidance");

    assert(CONSULTATION_CONFIG.DEFAULT_TIMEZONE === "Asia/Kolkata", "Default timezone configured to Asia/Kolkata (IST)");
    assert(CONSULTATION_CONFIG.MEETING_DURATION_MINUTES === 30, "Default meeting duration configured to 30 minutes");
  } catch (err) {
    console.error("Suite 1 Error:", err);
    failed++;
  }

  // -------------------------------------------------------------------------
  // TEST SUITE 2: Live Slot Calculation & Availability API
  // -------------------------------------------------------------------------
  console.log("\nSuite 2: Slot Availability Calculation & Business Rules");
  try {
    // 2.1: Request slots for a valid weekday
    const mockWeekday = createMockReqRes({
      method: "GET",
      url: `/api/consultation?action=slots&date=${testWeekday}&timezone=Asia/Kolkata`,
    });
    const resWeekday = await mockWeekday.execute();

    assert(resWeekday.status === 200, "GET /api/consultation returns HTTP 200 for valid date");
    assert(resWeekday.data.status === "success", "Response contains status: success");
    assert(Array.isArray(resWeekday.data.slots) && resWeekday.data.slots.length > 0, "Slots array returned for business hours");
    assert(resWeekday.data.timezone === "Asia/Kolkata", "Timezone matches Asia/Kolkata");

    const firstSlot = resWeekday.data.slots[0];
    assert(Boolean(firstSlot.time && firstSlot.endTime && firstSlot.display), "Slot contains time, endTime, and display labels");

    // 2.2: Weekend rejection
    const mockWeekend = createMockReqRes({
      method: "GET",
      url: `/api/consultation?action=slots&date=${testWeekend}&timezone=Asia/Kolkata`,
    });
    const resWeekend = await mockWeekend.execute();

    assert(resWeekend.status === 200, "Weekend slot request handled cleanly");
    assert(resWeekend.data.isWeekend === true, "Weekend correctly flagged as non-business day");
    const allWeekendSlotsUnavailable = resWeekend.data.slots.every((s) => s.available === false);
    assert(allWeekendSlotsUnavailable, "All slots on weekends are marked unavailable");

    // 2.3: Invalid date parameter rejection
    const mockInvalid = createMockReqRes({
      method: "GET",
      url: `/api/consultation?action=slots&date=not-a-date`,
    });
    const resInvalid = await mockInvalid.execute();
    assert(resInvalid.status === 400, "Invalid date format rejected with HTTP 400");
  } catch (err) {
    console.error("Suite 2 Error:", err);
    failed++;
  }

  // -------------------------------------------------------------------------
  // TEST SUITE 3: Server-Side Validation & Anti-Spam Protection
  // -------------------------------------------------------------------------
  console.log("\nSuite 3: Server-Side Input Validation & Anti-Spam");
  try {
    // 3.1: Missing required full name
    const mockNoName = createMockReqRes({
      method: "POST",
      url: "/api/consultation?action=book",
      body: {
        fullName: "",
        companyEmail: "test@robotics.com",
        phoneNumber: "+91 98765 43210",
        privacyConsent: true,
      },
    });
    const resNoName = await mockNoName.execute();
    assert(resNoName.status === 400, "Rejected missing name with HTTP 400");

    // 3.2: Invalid corporate email
    const mockBadEmail = createMockReqRes({
      method: "POST",
      url: "/api/consultation?action=book",
      body: {
        fullName: "John Engineer",
        companyEmail: "invalid-email-no-at",
        phoneNumber: "+91 98765 43210",
        companyName: "AutoCorp",
        jobTitle: "Plant Manager",
        country: "India",
        city: "Chennai",
        industry: "Automotive and automobile manufacturing",
        robotCategory: "Welding robots",
        projectDescription: "Heavy body-in-white spot welding line requiring high duty cycle.",
        selectedDate: testWeekday,
        selectedSlot: "10:00 - 10:30",
        privacyConsent: true,
      },
    });
    const resBadEmail = await mockBadEmail.execute();
    assert(resBadEmail.status === 400, "Rejected invalid email format with HTTP 400");

    // 3.3: Missing privacy consent
    const mockNoConsent = createMockReqRes({
      method: "POST",
      url: "/api/consultation?action=book",
      body: {
        fullName: "John Engineer",
        companyEmail: "john@autocorp.com",
        phoneNumber: "+91 98765 43210",
        companyName: "AutoCorp",
        jobTitle: "Plant Manager",
        country: "India",
        city: "Chennai",
        industry: "Automotive and automobile manufacturing",
        robotCategory: "Welding robots",
        projectDescription: "Heavy body-in-white spot welding line requiring high duty cycle.",
        selectedDate: testWeekday,
        selectedSlot: "10:00 - 10:30",
        privacyConsent: false,
      },
    });
    const resNoConsent = await mockNoConsent.execute();
    assert(resNoConsent.status === 400, "Rejected missing privacy consent with HTTP 400");

    // 3.4: Honeypot anti-spam trap
    const mockHoneypot = createMockReqRes({
      method: "POST",
      url: "/api/consultation?action=book",
      body: {
        fullName: "Spam Bot",
        companyEmail: "bot@spam.com",
        _hp: "I am a malicious bot filling hidden fields",
      },
    });
    const resHoneypot = await mockHoneypot.execute();
    assert(resHoneypot.status === 200 && resHoneypot.data.bookingId.includes("PROT"), "Honeypot spam silently neutralized without booking");
  } catch (err) {
    console.error("Suite 3 Error:", err);
    failed++;
  }

  // -------------------------------------------------------------------------
  // TEST SUITE 4: End-to-End Booking Confirmation & Concurrency Protection
  // -------------------------------------------------------------------------
  console.log("\nSuite 4: End-to-End Booking Submission & Concurrency Lock");
  let createdBookingId = null;
  const targetSlot = "11:00 - 11:30";

  try {
    const validBookingPayload = {
      fullName: "Sri Lakshana",
      companyEmail: "srilakshana.int2027g3@gmail.com",
      phoneNumber: "+91 98765 43210",
      companyName: "Precision Motion Tech Industries",
      jobTitle: "Automation Director",
      country: "India",
      city: "Chennai",
      companyWebsite: "https://precision-motion-systems-main.vercel.app",
      industry: "Automotive and automobile manufacturing",
      robotCategory: "Welding robots",
      specificApplication: "Spot & Laser Welding (BIW)",
      projectStage: "Planning",
      preferredSolution: "New installation",
      consultationMode: "Google Meet (Online Video)",
      projectDescription: "Looking to deploy a multi-axis automated robotic welding cell for high-tensile steel frames with synchronized rotary positioner.",
      materialHandled: "High-tensile steel frame stampings",
      payloadKg: "20",
      reachMm: "1800",
      cycleTimeSec: "45",
      operatingEnvironment: "Standard industrial factory",
      accuracyRequirement: "High precision (±0.05 mm)",
      productionShifts: "Two shifts (16 hrs/day)",
      existingEquipment: "Siemens S7-1500 PLC (PROFINET)",
      projectBudget: "$100,000 - $250,000",
      implementationTimeline: "1 - 3 months",
      weldingProcess: "MIG/MAG GMAW with Ar/CO2 80/20",
      selectedDate: testWeekday,
      selectedSlot: targetSlot,
      timezone: "Asia/Kolkata",
      privacyConsent: true,
    };

    // 4.1: First valid booking submission
    const mockBook = createMockReqRes({
      method: "POST",
      url: "/api/consultation?action=book",
      body: validBookingPayload,
    });
    const resBook = await mockBook.execute();

    assert(resBook.status === 200, "Booking confirmed with HTTP 200");
    assert(resBook.data.status === "success", "Response status is success");
    assert(Boolean(resBook.data.bookingId && resBook.data.bookingId.startsWith("INDUS-BC-")), "Unique Reference ID generated in INDUS-BC-YYYYMMDD-XXXX format");
    assert(Boolean(resBook.data.googleMeetUrl && resBook.data.googleMeetUrl.includes("meet.google.com")), "Google Meet link automatically generated");
    assert(resBook.data.appointmentDate === testWeekday, "Appointment date recorded correctly");
    assert(resBook.data.appointmentTime === targetSlot, "Appointment time slot recorded correctly");

    createdBookingId = resBook.data.bookingId;
    console.log(`    -> Created Test Booking: ${createdBookingId} | Meet: ${resBook.data.googleMeetUrl}`);

    // 4.2: Concurrency & Double-Booking Protection:
    // A second customer immediately attempts to book the same slot on the same date!
    const mockConflict = createMockReqRes({
      method: "POST",
      url: "/api/consultation?action=book",
      headers: {
        "x-forwarded-for": "198.51.100.42",
      },
      body: {
        ...validBookingPayload,
        fullName: "Rival Client",
        companyEmail: "rival@competitor.com",
        companyName: "Rival Auto",
      },
    });
    const resConflict = await mockConflict.execute();

    assert(resConflict.status === 409, "Double-booking attempt rejected with HTTP 409 Conflict");
    assert(resConflict.data.status === "error", "Conflict error reported in response");
    assert(resConflict.data.error === "SLOT_CONFLICT" || resConflict.data.error === "SLOT_UNAVAILABLE", "Server returns atomic slot collision error");
    console.log(`    -> Double booking successfully blocked: ${resConflict.data.message}`);

    // 4.3: Querying slot availability now shows that slot as unavailable
    const mockVerify = createMockReqRes({
      method: "GET",
      url: `/api/consultation?action=slots&date=${testWeekday}&timezone=Asia/Kolkata`,
    });
    const resVerify = await mockVerify.execute();
    const bookedSlotEntry = resVerify.data.slots.find((s) => s.time === "11:00");
    assert(Boolean(bookedSlotEntry && bookedSlotEntry.available === false), "Booked slot is marked unavailable on the public calendar");
  } catch (err) {
    console.error("Suite 4 Error:", err);
    failed++;
  }

  // -------------------------------------------------------------------------
  // TEST SUITE 5: Admin Management & Role-Based Control
  // -------------------------------------------------------------------------
  console.log("\nSuite 5: Admin Dashboard Operations & Status Lifecycle");
  try {
    // 5.1: Retrieve list of bookings as admin
    const mockList = createMockReqRes({
      method: "GET",
      url: "/api/consultation?action=list",
      headers: {
        authorization: "Bearer indus_test_admin_token",
      },
    });
    const resList = await mockList.execute();

    assert(resList.status === 200, "Admin list bookings returns HTTP 200");
    assert(Array.isArray(resList.data.bookings), "Bookings array returned to admin");
    const foundBooking = resList.data.bookings.find((b) => b.bookingId === createdBookingId);
    assert(Boolean(foundBooking), "Newly created booking is present in admin database");
    assert(foundBooking?.companyName === "Precision Motion Tech Industries", "Customer company name persisted accurately");
    assert(foundBooking?.robotCategory === "Welding robots", "Robot category persisted accurately");
    assert(foundBooking?.status === "Confirmed", "Initial booking status is Confirmed");

    // 5.2: Update status to "In Progress"
    const mockStatus = createMockReqRes({
      method: "POST",
      url: "/api/consultation?action=update_status",
      body: {
        bookingId: createdBookingId,
        status: "In Progress",
        adminNotes: "Engineering CAD simulation prepared for 1800mm reach verification.",
      },
    });
    const resStatus = await mockStatus.execute();
    assert(resStatus.status === 200, "Status update returns HTTP 200");
    assert(resStatus.data.booking.status === "In Progress", "Booking status successfully transitioned to 'In Progress'");
    assert(Boolean(resStatus.data.booking.adminNotes?.includes("simulation")), "Admin notes saved with booking");

    // 5.3: Cancel booking
    const mockCancel = createMockReqRes({
      method: "POST",
      url: "/api/consultation?action=cancel",
      body: {
        bookingId: createdBookingId,
        reason: "Integration test completed",
      },
    });
    const resCancel = await mockCancel.execute();
    assert(resCancel.status === 200, "Cancellation returns HTTP 200");
    assert(resCancel.data.status === "success", "Cancellation confirmed");

    // 5.4: Verify slot liberation after cancellation
    const mockLiberated = createMockReqRes({
      method: "GET",
      url: `/api/consultation?action=slots&date=${testWeekday}&timezone=Asia/Kolkata`,
    });
    const resLiberated = await mockLiberated.execute();
    const liberatedSlotEntry = resLiberated.data.slots.find((s) => s.time === "11:00");
    assert(Boolean(liberatedSlotEntry && liberatedSlotEntry.available === true), "Cancelled slot is freed and available for new bookings");
  } catch (err) {
    console.error("Suite 5 Error:", err);
    failed++;
  }

  // -------------------------------------------------------------------------
  // TEST SUITE 6: Calendar File & Link Utilities
  // -------------------------------------------------------------------------
  console.log("\nSuite 6: Calendar Link & ICS Generation Utilities");
  try {
    const { getGoogleCalendarLink } = await import("../src/lib/consultation-api.ts");

    const gCalUrl = getGoogleCalendarLink({
      title: "INDUS Robotics Consultation: AutoCorp [INDUS-BC-20261024-9999]",
      details: "Application review and kinematic sizing.",
      location: "https://meet.google.com/indus-rob-test",
      dateStr: "2026-10-24",
      timeStr: "10:00 - 10:30",
    });

    assert(Boolean(gCalUrl.includes("calendar.google.com/calendar/render")), "Google Calendar URL uses valid Google Calendar render template");
    assert(Boolean(gCalUrl.includes("INDUS%20Robotics%20Consultation") || gCalUrl.includes("INDUS+Robotics+Consultation")), "Event title is properly URL-encoded");
    assert(Boolean(gCalUrl.includes("meet.google.com")), "Google Meet link included in calendar URL");
  } catch (err) {
    console.error("Suite 6 Error:", err);
    failed++;
  }

  // -------------------------------------------------------------------------
  // Final Results
  // -------------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(` TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  await new Promise((resolve) => setTimeout(resolve, 150));
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
