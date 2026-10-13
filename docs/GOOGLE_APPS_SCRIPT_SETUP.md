# Google Calendar & Sheets Synchronization Setup

## Overview
This setup links your **INDUSTRY VISIT** Google Calendar Appointment Schedule (`https://calendar.app.google/ZMQqX8rKGyCZqtqB7`) to your Google Sheet (`1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48`).

## 1-Minute Deployment Steps

1. **Open Google Sheets**:
   Open [Indus Leads Capture](https://docs.google.com/spreadsheets/d/1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48/edit?usp=sharing).

2. **Open Apps Script Editor**:
   In the Google Sheets menu, click **Extensions** > **Apps Script**.

3. **Paste Code**:
   - Replace any existing code in the editor with the entire content of [`google-apps-script/Code.gs`](../google-apps-script/Code.gs).
   - In the left sidebar under **Project Settings** (gear icon), enable **Show "appsscript.json" manifest file in editor**.
   - Copy the contents of [`google-apps-script/appsscript.json`](../google-apps-script/appsscript.json) into `appsscript.json`.
   - Click **Save** (disk icon).

4. **Run One-Click Setup**:
   - In the toolbar function dropdown, select **`setupAppointmentSync`**.
   - Click **Run**.
   - When prompted, click **Review permissions**, choose your Google account (`srilakshanaint2027g3@gmail.com`), click **Advanced** > **Go to Untitled project (unsafe)**, and click **Allow**.

5. **Done!**:
   - `setupAppointmentSync` automatically creates the **Appointment Bookings** tab without modifying any existing tabs.
   - Formats headers with INDUS design styling.
   - Installs a time-driven trigger running `syncCalendarAppointments` every 5 minutes.
   - Dispatches exactly one email notification to `srilakshanaint2027g3@gmail.com` per new booking (and sets `Admin Notified = Yes` to prevent duplicates).
