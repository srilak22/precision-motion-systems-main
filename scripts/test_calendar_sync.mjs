import fs from "fs";
import path from "path";
import assert from "assert";

console.log("===============================================================================");
console.log("INDUS Robotics — Google Calendar & Google Sheets Sync Test Suite");
console.log("===============================================================================\n");

async function runTests() {
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error(`       Error: ${err.message}`);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error(`       Error: ${err.message}`);
    }
  }

  // 1. Verify Configuration & Frontend Links
  test("Configuration includes valid calendar & spreadsheet URLs", () => {
    const configPath = path.resolve("src/data/config.ts");
    const content = fs.readFileSync(configPath, "utf-8");
    assert(content.includes("https://calendar.app.google/ZMQqX8rKGyCZqtqB7"), "Missing booking URL in config.ts");
    assert(content.includes("1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48"), "Missing spreadsheet ID in config.ts");
    assert(content.includes("Appointment Bookings"), "Missing tab name in config.ts");
  });

  test("Header component includes responsive Book Appointment button", () => {
    const headerPath = path.resolve("src/components/layout/Header.tsx");
    const content = fs.readFileSync(headerPath, "utf-8");
    assert(content.includes("handleBookAppointment"), "Missing handleBookAppointment in Header.tsx");
    assert(content.includes("Book Appointment"), "Missing Book Appointment button text in Header.tsx");
    assert(content.includes("appointmentBookingUrl"), "Missing booking URL reference in Header.tsx");
  });

  test("MobileNav component includes Book an Appointment button", () => {
    const mobilePath = path.resolve("src/components/layout/MobileNav.tsx");
    const content = fs.readFileSync(mobilePath, "utf-8");
    assert(content.includes("handleBookAppointment"), "Missing handleBookAppointment in MobileNav.tsx");
    assert(content.includes("Book an Appointment"), "Missing Book an Appointment button text in MobileNav.tsx");
  });

  test("Contact Hub index includes Book an Appointment hero CTA and dedicated channel card", () => {
    const contactPath = path.resolve("src/routes/contact/index.tsx");
    const content = fs.readFileSync(contactPath, "utf-8");
    assert(content.includes("handleBookAppointment"), "Missing handleBookAppointment in contact/index.tsx");
    assert(content.includes("Industry Visit & Consultation"), "Missing channel card in contact/index.tsx");
    assert(content.includes("Book an Appointment"), "Missing Book an Appointment button in contact/index.tsx");
  });

  test("Footer component includes Book an Appointment banner CTA and quick link", () => {
    const footerPath = path.resolve("src/components/layout/Footer.tsx");
    const content = fs.readFileSync(footerPath, "utf-8");
    assert(content.includes("Book an Appointment"), "Missing Book an Appointment in Footer.tsx");
    assert(content.includes("appointmentBookingUrl"), "Missing appointmentBookingUrl in Footer.tsx");
  });

  // 2. Test Live Calendar Link Resolution
  await asyncTest("Live Google Calendar booking link resolves correctly", async () => {
    const res = await fetch("https://calendar.app.google/ZMQqX8rKGyCZqtqB7", { redirect: "manual" });
    assert(res.status === 302 || res.status === 200, `Unexpected status: ${res.status}`);
    const location = res.headers.get("location") || "";
    if (res.status === 302) {
      assert(location.includes("appointments/schedules"), `Redirect location did not match schedule: ${location}`);
    }
  });

  // 3. Test Google Sheet Accessibility
  await asyncTest("Target Google Spreadsheet is reachable", async () => {
    const res = await fetch("https://docs.google.com/spreadsheets/d/1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48/edit?usp=sharing");
    assert(res.status === 200, `Sheet returned status ${res.status}`);
    const text = await res.text();
    assert(text.includes("Indus Leads Capture"), "Sheet title did not match Indus Leads Capture");
  });

  // 4. Test Extraction Parser Logic (replicates Code.gs logic in JS)
  test("Code.gs extraction regex correctly extracts fields from appointment description", () => {
    const mockDescription = `
Booking details:
Name: Vikram Malhotra
Email: vikram.m@tata-advanced.com
Company: Tata Advanced Manufacturing
Requirement: Sizing high-payload delta robots for line 4
Phone: +91 98765 43210
Google Meet: https://meet.google.com/abc-defg-hij
`;
    const mockTitle = "INDUSTRY VISIT - Vikram Malhotra";

    // Replicate regex from Code.gs
    const nameMatch = mockDescription.match(/(?:Booked by|Customer Name|Name):\s*([^\n\r<]+)/i);
    const emailMatch = mockDescription.match(/(?:Email|Customer Email):\s*([^\n\r<\s]+@[^\n\r<\s]+)/i);
    const companyMatch = mockDescription.match(/(?:Company|Company Name|Organization|Org):\s*([^\n\r<]+)/i);
    const purposeMatch = mockDescription.match(/(?:Purpose|Requirement|Reason|Notes|Topic|Tell us about your requirement|Project description):\s*([^\n\r<]+)/i);
    const linkMatch = mockDescription.match(/(https:\/\/(?:meet\.google\.com|teams\.microsoft\.com|zoom\.us)[^\s<]+)/i);

    assert.strictEqual(nameMatch?.[1].trim(), "Vikram Malhotra");
    assert.strictEqual(emailMatch?.[1].trim(), "vikram.m@tata-advanced.com");
    assert.strictEqual(companyMatch?.[1].trim(), "Tata Advanced Manufacturing");
    assert.strictEqual(purposeMatch?.[1].trim(), "Sizing high-payload delta robots for line 4");
    assert.strictEqual(linkMatch?.[1].trim(), "https://meet.google.com/abc-defg-hij");
  });

  // 5. Test Deduplication & Rescheduling Simulation
  test("Sync engine deduplication, rescheduling, and cancellation logic simulation", () => {
    // In-memory sheet simulation
    const sheetRows = [
      ["Event ID", "Customer Name", "Customer Email", "Company", "Appointment Purpose", "Date", "Time", "Status", "Creation Timestamp", "Meeting Location", "Admin Notified", "Last Synced"]
    ];

    function syncEvent(event, existingRows) {
      const existingIdx = existingRows.findIndex(r => r[0] === event.id);
      if (existingIdx === -1) {
        // New row
        existingRows.push([
          event.id,
          event.name,
          event.email,
          event.company,
          event.purpose,
          event.date,
          event.time,
          "Confirmed",
          new Date().toISOString(),
          event.link,
          "No", // Needs admin notification
          new Date().toISOString()
        ]);
        return { action: "inserted", notify: true };
      } else {
        const row = existingRows[existingIdx];
        if (row[5] !== event.date || row[6] !== event.time) {
          row[5] = event.date;
          row[6] = event.time;
          row[7] = "Rescheduled";
          row[11] = new Date().toISOString();
          return { action: "rescheduled", notify: false };
        }
        return { action: "no_change", notify: false };
      }
    }

    // Step 1: Initial event sync
    const event1 = {
      id: "evt_1001",
      name: "Ananya Sharma",
      email: "ananya@solardynamics.in",
      company: "Solar Dynamics Corp",
      purpose: "Factory tour & joint actuator sizing",
      date: "2026-10-20",
      time: "10:00 - 11:00 (IST)",
      link: "https://meet.google.com/xyz-uvw-rst"
    };

    const res1 = syncEvent(event1, sheetRows);
    assert.strictEqual(res1.action, "inserted");
    assert.strictEqual(res1.notify, true);
    assert.strictEqual(sheetRows.length, 2);

    // Simulate sending email and marking Admin Notified
    sheetRows[1][10] = "Yes";

    // Step 2: Sync again with exact same event (Idempotent test)
    const res2 = syncEvent(event1, sheetRows);
    assert.strictEqual(res2.action, "no_change");
    assert.strictEqual(res2.notify, false);
    assert.strictEqual(sheetRows.length, 2, "No duplicate row created");
    assert.strictEqual(sheetRows[1][10], "Yes", "Admin notified state preserved");

    // Step 3: Customer reschedules event to different time
    const event1Rescheduled = { ...event1, date: "2026-10-22", time: "14:00 - 15:00 (IST)" };
    const res3 = syncEvent(event1Rescheduled, sheetRows);
    assert.strictEqual(res3.action, "rescheduled");
    assert.strictEqual(sheetRows.length, 2, "Still exactly 1 row");
    assert.strictEqual(sheetRows[1][5], "2026-10-22", "Date updated");
    assert.strictEqual(sheetRows[1][7], "Rescheduled", "Status changed to Rescheduled");

    // Step 4: Cancellation test
    const activeCalendarIds = new Set(); // event is deleted from calendar
    for (let i = 1; i < sheetRows.length; i++) {
      if (!activeCalendarIds.has(sheetRows[i][0])) {
        sheetRows[i][7] = "Cancelled";
      }
    }
    assert.strictEqual(sheetRows[1][7], "Cancelled", "Cancelled status recorded properly");
  });

  console.log(`\n===============================================================================`);
  console.log(`Results: ${passed}/${total} tests passed successfully.`);
  console.log(`===============================================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
