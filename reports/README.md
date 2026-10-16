# INDUS Industrial Robotics — Scheduled Executive Reports & Email Delivery Architecture

This document describes the architecture, operation, security controls, and verification procedures for the INDUS Industrial Robotics automated report email delivery subsystem.

---

## 1. Architectural Overview & Migration Summary

### Historical vs New Architecture

```
[HISTORICAL ARCHITECTURE]
+-------------------------------------------------------------+
| Google Apps Script (Cloud Project)                          |
| - Time-Driven Triggers                                      |
| - Data aggregation from Sheets                              |
| - MailApp.sendEmail() [Gmail Quota & Token Limits]          |
+-------------------------------------------------------------+
  Issues:
  1. Apps Script execution timeouts (6-minute hard limit).
  2. Silent quota exhaustion without structured monitoring.
  3. No cryptographic cron authentication (CRON_SECRET).
  4. Coupling of email delivery with sheet calculation logic.

[NEW VERCEL BACKEND ARCHITECTURE]
+-------------------------------------------------------------+
| Vercel Cron Scheduler                                       |
| - Daily:   0 15 * * *   (21:00 IST / 15:00 UTC)             |
| - Weekly:  30 3 * * 1   (09:00 IST Monday / 03:30 UTC)      |
| - Monthly: 30 3 1 * *   (09:00 IST 1st of Month / 03:30 UTC)|
+-----------------------------+-------------------------------+
                              | HTTP GET / POST with Bearer CRON_SECRET
                              v
+-------------------------------------------------------------+
| Vercel Serverless Function Engine                           |
| - /api/cron/reports (Coordinator)                           |
| - /api/report-daily, /api/report-weekly, /api/report-monthly|
+-----------------------------+-------------------------------+
                              |
      +-----------------------+-----------------------+
      | Data Aggregation                              | Delivery Pipeline
      v                                               v
+--------------------------+             +--------------------------+
| Data Sources:            |             | Security & Reliability:  |
| - Local Store (.data)    |             | - Idempotency Key Lock   |
| - Atlassian Jira Cloud   |             | - Zero Credential Leak   |
|   (DI, YLT, LIT Projects)|             | - HTML & ASCII Templates |
| - Google Sheets Sync     |             | - Nodemailer (Gmail SMTP)|
+--------------------------+             +--------------------------+
```

### Key Principles Preserved
1. **Zero Integration Breakage:** Website inquiry forms, Jira DI ticket generation, YouTube YLT isolated routing, Google Sheets synchronization tabs, Telegram notifications, and Google Calendar appointment booking remain 100% operational.
2. **True Status Integrity:** The API returns `email_sent: true` **only** after the SMTP server explicitly accepts delivery with a confirmed `messageId`.
3. **No Credential Exposure:** Sensitive SMTP passwords and API tokens are restricted to server-side environment variables and strictly sanitized in logs and error responses.

---

## 2. API Endpoints & Authentication Contracts

### Available Endpoints

| Endpoint | HTTP Methods | Description | Parameters / Payload |
| :--- | :--- | :--- | :--- |
| `/api/report-email` | `POST` (Strict) | **Primary Email API.** Accepts JSON payload for on-demand & scheduled report execution with end-to-end Vercel logging. | Body: `{"type": "daily\|weekly\|monthly", "force": boolean, "recipient": "email"}`<br>Headers: `Authorization: Bearer <SECRET>` or `X-Report-Email-Secret: <SECRET>` |
| `/api/cron/reports` | `GET`, `POST` | Vercel Cron Coordinator. Auto-detects schedule or accepts explicit type. | `type=daily\|weekly\|monthly`<br>`force=true`<br>`secret=<CRON_SECRET>`<br>`recipient=<email>` |
| `/api/report-daily` | `GET`, `POST` | Explicit daily report runner (24-hour lookback). | `force=true`<br>`secret=<CRON_SECRET>`<br>`recipient=<email>` |
| `/api/report-weekly` | `GET`, `POST` | Explicit weekly digest runner (7-day lookback). | `force=true`<br>`secret=<CRON_SECRET>`<br>`recipient=<email>` |
| `/api/report-monthly` | `GET`, `POST` | Explicit monthly review runner (30-day lookback). | `force=true`<br>`secret=<CRON_SECRET>`<br>`recipient=<email>` |

### Authentication Contract

Calls to scheduled report endpoints must authenticate using one of the following methods:

1. **HTTP Authorization Header (Recommended for Jira Automation & curl):**
   ```http
   Authorization: Bearer <REPORT_EMAIL_API_SECRET>
   ```
2. **Custom Secret Header:**
   ```http
   X-Report-Email-Secret: <REPORT_EMAIL_API_SECRET>
   ```
   or
   ```http
   X-Cron-Secret: <CRON_SECRET>
   ```
3. **Vercel Automatic Cron Header:**
   ```http
   X-Vercel-Cron: 1
   ```
4. **URL Query Parameter (GET endpoints only):**
   ```
   https://precision-motion-systems-main.vercel.app/api/report-daily?secret=<CRON_SECRET>
   ```

*Note: `/api/report-email` strictly requires POST and rejects query-parameter secrets to prevent secret exposure in access logs and browser history.*

---

## 3. Vercel Runtime Logging & Observability

Every invocation of `/api/report-email` and the scheduled report endpoints emits structured, searchable logs directly into the **Vercel Project Logs dashboard**:

### Searchable Event Prefixes

- `[report-email] request_received` — Emitted immediately when an API request is received.
- `[report-email] authentication_failed` — Emitted when secret authentication fails or is missing (HTTP 401).
- `[report-email] validation_failed` — Emitted when method (HTTP 405), payload (HTTP 400), or recipient (HTTP 403) fails validation.
- `[report-email] email_send_started` — Emitted immediately before dispatching email via Nodemailer SMTP.
- `[report-email] email_send_succeeded` — Emitted after SMTP server explicitly confirms delivery with `messageId`.
- `[report-email] email_send_failed` — Emitted with safe error category on SMTP rejection or timeout.
- `[report-email] request_completed` — Emitted on request termination with final HTTP status, durationMs, and correlationId.

### Log Payload Schema

```json
[report-email] request_completed {
  "event": "request_completed",
  "timestamp": "2026-10-16T13:45:00.000Z",
  "correlationId": "8f12a345-6789-4abc-def0-123456789abc",
  "reportType": "daily",
  "statusCode": 200,
  "durationMs": 412,
  "errorCategory": null
}
```

### Viewing Logs in Vercel Dashboard

1. Log into [vercel.com](https://vercel.com) and navigate to **precision-motion-systems-main**.
2. Click on the **Logs** tab in the project navigation bar.
3. In the environment selector, choose **Production** (or Preview).
4. In the search box, enter:
   ```text
   report-email
   ```
5. You can also filter by specific lifecycle events, e.g.:
   - `[report-email] email_send_succeeded`
   - `[report-email] authentication_failed`
   - `[report-email] email_send_failed`

---

## 4. Production Schedules & Jira Automation Setup

### Vercel Cron Schedules

| Report Type | Target IST Schedule | UTC Cron Expression | Target URL |
| :--- | :--- | :--- | :--- |
| **Daily** | Every day, 9:00 PM IST | `0 15 * * *` | `/api/cron/reports?type=daily` |
| **Weekly** | Monday, 9:00 AM IST | `30 3 * * 1` | `/api/cron/reports?type=weekly` |
| **Monthly** | 1st day of month, 9:00 AM IST | `30 3 1 * *` | `/api/cron/reports?type=monthly` |

### Jira Cloud Automation Configuration Guide

If your organization prefers Jira Cloud Automation as the primary scheduler:

1. In Jira Cloud, navigate to **Project settings $\rightarrow$ Automation** (or **System settings $\rightarrow$ Global Automation**).
2. Click **Create rule**.
3. **Trigger:** Set **Scheduled**:
   - Cron: `0 0 21 ? * * *` (Every day at 21:00 / 9:00 PM IST).
4. **Action:** Add **Send web request**:
   - **Web request URL:** `https://precision-motion-systems-main.vercel.app/api/report-email`
   - **HTTP method:** `POST`
   - **Web request headers:**
     - `Content-Type`: `application/json`
     - `Authorization`: `Bearer <REPORT_EMAIL_API_SECRET>`
   - **Web request body:** `Custom data`
     ```json
     {
       "type": "daily"
     }
     ```
   - Check **Wait for response** (optional).
5. Name the rule (e.g., `INDUS Vercel Daily Report Trigger`) and click **Turn on rule**.

*Important: If Jira Automation is configured to send emails using Jira's internal email action, those emails bypass Vercel entirely and will not produce Vercel runtime logs. By sending a web request to `/api/report-email`, Jira delegates the delivery to Vercel, ensuring unified Nodemailer SMTP dispatch, idempotency locking, and visible runtime logs.*

---

## 5. Required Vercel Environment Variables

Configure the following variables in **Vercel Project Settings $\rightarrow$ Environment Variables**:

| Variable Name | Required | Example / Description |
| :--- | :---: | :--- |
| `SMTP_USER` | **Yes** | `engineering@indus-robotics.com` (Authorized Google Workspace / Gmail account) |
| `SMTP_PASS` | **Yes** | `abcd efgh ijkl mnop` (16-character Google App Password) |
| `REPORT_EMAIL_API_SECRET` | **Yes** | 32+ character high-entropy secret string for authenticating `/api/report-email` |
| `CRON_SECRET` | **Yes** | Shared secret string for authenticating Vercel Cron jobs |
| `REPORT_EMAIL_TO` | **Yes** | `srilakshanaint2027g3@gmail.com,management@indus-robotics.com` (Authorized recipient list) |
| `REPORT_EMAIL_FROM` | Optional | Custom From header, e.g. `"INDUS Industrial Robotics" <engineering@indus-robotics.com>` |
| `ADMIN_EMAIL` | Optional | Fallback recipient address |

### Gmail App Password Generation Procedure
1. Navigate to the Google Account Security portal: [https://myaccount.google.com/security](https://myaccount.google.com/security).
2. Ensure **2-Step Verification** is active.
3. Search for or navigate to **App Passwords**: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
4. Enter an App Name (e.g. `INDUS Vercel Report Delivery`).
5. Generate the 16-character passcode.
6. Copy the passcode into Vercel as `SMTP_PASS` (spaces may be removed or kept; Nodemailer handles both).

---

## 5. Duplicate Prevention & Idempotency Mechanism

To prevent duplicate emails caused by overlapping serverless triggers or accidental retries:

1. **Period-Based Idempotency Key:**
   - Daily: `daily-YYYY-MM-DD`
   - Weekly: `weekly-YYYY-Wxx`
   - Monthly: `monthly-YYYY-MM`
2. **Execution Locking:**
   - Before executing, the coordinator checks `.data/reports_idempotency.json`.
   - If a report with the same period key is marked `SENT` and `force=true` is **not** specified, execution exits immediately with:
     ```json
     {
       "status": "duplicate_skipped",
       "success": true,
       "email_sent": false,
       "duplicate": true,
       "message": "Report for period 'daily-2026-10-16' was already successfully delivered."
     }
     ```
   - If an execution is currently `IN_PROGRESS` (started $<60\text{s}$ ago), duplicate concurrent execution is blocked.
3. **Manual Override:**
   - Adding `?force=true` bypasses idempotency for administrative testing and ad-hoc generation.

---

## 6. Response Format Specifications

### Success (Email Provider Accepted)
```json
{
  "status": "success",
  "success": true,
  "email_sent": true,
  "messageId": "<c28abf10-1845-8120-74bc-87588019@indus-robotics.com>",
  "report_type": "daily",
  "reporting_period": "15 Oct 2026, 09:00 PM to 16 Oct 2026, 09:00 PM (IST)",
  "period_key": "daily-2026-10-16",
  "recipients_count": 2,
  "data_retrieved": true,
  "execution_time_ms": 1140,
  "metrics": {
    "totalLeads": 14,
    "dealflow": {
      "websiteDI": 9,
      "youtubeYLT": 3,
      "linkedinLIT": 2
    },
    "consultations": {
      "total": 4,
      "confirmed": 3,
      "rescheduled": 1,
      "cancelled": 0
    }
  }
}
```

### Configuration Missing (Safe Monitoring Response)
```json
{
  "status": "configuration_missing",
  "success": false,
  "email_sent": false,
  "error": "SMTP_CONFIG_MISSING",
  "message": "SMTP_USER or SMTP_PASS (Gmail App Password) is not configured in Vercel environment variables.",
  "report_type": "daily",
  "reporting_period": "15 Oct 2026 to 16 Oct 2026 (IST)",
  "data_retrieved": true,
  "recipients_count": 1
}
```

### Authentication Failure (Provider Rejection)
```json
{
  "status": "authentication_failed",
  "success": false,
  "email_sent": false,
  "error": "SMTP_AUTH_FAILED",
  "message": "Gmail SMTP authentication rejected credentials. Verify SMTP_USER and Gmail App Password (SMTP_PASS)."
}
```

---

## 7. Google Apps Script Trigger Audit & Transition Rules

### Triggers to DISABLE in Google Apps Script
Disable only triggers that send scheduled summary reports.

| Function Name in Apps Script | Trigger Type | Action |
| :--- | :--- | :--- |
| `sendDailyReportEmail()` / `dailyDigest()` (if present) | Time-driven | **Disable** after Vercel production deployment verification. |
| `sendWeeklyReportEmail()` (if present) | Time-driven | **Disable** after Vercel production deployment verification. |

### Triggers to PRESERVE in Google Apps Script (CRITICAL)
Do **NOT** disable the following mission-critical operational automations:
- `syncCalendarAppointments()`: Synchronizes Google Calendar appointments to the Google Sheet every 5 minutes.
- `doPost()` / `doGet()`: Handles consultation slot availability queries, instant booking persistence, and website lead mirroring.
- `sendAdminNotification()` / `sendCustomerConsultationEmail()`: Instant client booking notifications triggered during an active booking.

---

## 8. Verification & Testing Instructions

### Local Testing
```bash
# 1. Test Daily Report Endpoint locally (skipping SMTP if credentials not yet configured)
curl -s "http://localhost:8080/api/report-daily?force=true" | jq .

# 2. Test with mock or explicit recipient
curl -s "http://localhost:8080/api/cron/reports?type=weekly&recipient=test@example.com&force=true" | jq .

# 3. Run automated regression and unit test suite
node tests/test_report_delivery.mjs
```

### Rollback Procedure
If SMTP delivery requires suspension or rollback:
1. Delete the `crons` entries in `vercel.json` or commit an empty crons array.
2. Push to `origin/master`. Vercel immediately de-registers the cron triggers.
3. All website leads, Jira tickets, and Google Sheets integrations remain completely unaffected because report delivery is strictly isolated.
