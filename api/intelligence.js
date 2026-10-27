// @ts-check
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { spawn } from "node:child_process";

const DB_PATH = path.resolve(process.cwd(), ".data/us_robotics_intelligence.db");

/**
 * Get SQLite database handle
 */
function getDb() {
  const db = new DatabaseSync(DB_PATH);
  return db;
}

/**
 * Main API Handler for US Robotics Intelligence Platform
 * @param {import("http").IncomingMessage & { query?: Record<string, string>, body?: any }} req
 * @param {import("http").ServerResponse & { status: (code: number) => any, json: (data: any) => any }} res
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  const db = getDb();

  try {
    // ------------------------------------------------------------------------
    // 1. STATS ENDPOINT: /api/intelligence/stats
    // ------------------------------------------------------------------------
    if (pathname === "/api/intelligence/stats" || searchParams.get("action") === "stats") {
      const totalCompanies = db.prepare("SELECT COUNT(*) as c FROM companies").get().c;
      const verifiedWebsites = db.prepare("SELECT COUNT(*) as c FROM companies WHERE website != '' AND website IS NOT NULL").get().c;
      const usHeadquartered = db.prepare("SELECT COUNT(*) as c FROM companies WHERE us_presence_status = 'US Headquartered'").get().c;
      const usFacilities = db.prepare("SELECT COUNT(*) as c FROM companies WHERE us_presence_status LIKE '%US Operating%'").get().c;
      
      const totalProducts = db.prepare("SELECT COUNT(*) as c FROM products").get().c;
      const totalContacts = db.prepare("SELECT COUNT(*) as c FROM business_contacts").get().c;
      const totalPeople = db.prepare("SELECT COUNT(*) as c FROM people").get().c;
      const totalApplications = db.prepare("SELECT COUNT(*) as c FROM applications").get().c;
      const totalEvidence = db.prepare("SELECT COUNT(*) as c FROM source_evidence").get().c;
      const totalSources = db.prepare("SELECT COUNT(*) as c FROM sources").get().c;

      // Category breakdown
      const categories = db.prepare(`
        SELECT company_type, COUNT(*) as count 
        FROM companies 
        GROUP BY company_type 
        ORDER BY count DESC 
        LIMIT 10
      `).all();

      // State breakdown
      const states = db.prepare(`
        SELECT hq_state as state, COUNT(*) as count 
        FROM companies 
        WHERE hq_state IS NOT NULL AND hq_state != '' AND hq_country = 'United States'
        GROUP BY hq_state 
        ORDER BY count DESC 
        LIMIT 10
      `).all();

      // Quality audit indicators
      const missingWebsite = db.prepare("SELECT COUNT(*) as c FROM companies WHERE website IS NULL OR website = ''").get().c;
      const missingState = db.prepare("SELECT COUNT(*) as c FROM companies WHERE (hq_state IS NULL OR hq_state = '') AND hq_country = 'United States'").get().c;
      const missingContacts = db.prepare("SELECT COUNT(*) as c FROM companies WHERE company_id NOT IN (SELECT DISTINCT company_id FROM business_contacts)").get().c;
      const missingProducts = db.prepare("SELECT COUNT(*) as c FROM companies WHERE company_id NOT IN (SELECT DISTINCT company_id FROM products)").get().c;
      const unverified = db.prepare("SELECT COUNT(*) as c FROM companies WHERE verification_status != 'VERIFIED'").get().c;

      return res.json({
        success: true,
        summary: {
          total_companies: totalCompanies,
          verified_websites: verifiedWebsites,
          us_headquartered: usHeadquartered,
          us_operating_facilities: usFacilities,
          total_products: totalProducts,
          total_contacts: totalContacts,
          total_people: totalPeople,
          total_applications: totalApplications,
          total_evidence: totalEvidence,
          total_sources: totalSources,
        },
        distributions: {
          categories,
          states
        },
        quality_center: {
          missing_website: missingWebsite,
          missing_state: missingState,
          missing_contacts: missingContacts,
          missing_products: missingProducts,
          unverified: unverified
        }
      });
    }

    // ------------------------------------------------------------------------
    // 2. COMPANY DETAIL: /api/intelligence/company?id=...
    // ------------------------------------------------------------------------
    if (pathname === "/api/intelligence/company" || searchParams.get("action") === "company") {
      const companyId = searchParams.get("id");
      if (!companyId) {
        res.statusCode = 400;
        return res.json({ success: false, error: "Missing company id" });
      }

      const company = db.prepare("SELECT * FROM companies WHERE company_id = ?").get(companyId);
      if (!company) {
        res.statusCode = 404;
        return res.json({ success: false, error: "Company not found" });
      }

      const products = db.prepare("SELECT * FROM products WHERE company_id = ?").all(companyId);
      const people = db.prepare("SELECT * FROM people WHERE company_id = ?").all(companyId);
      const contacts = db.prepare("SELECT * FROM business_contacts WHERE company_id = ?").all(companyId);
      const applications = db.prepare("SELECT * FROM applications WHERE company_id = ?").all(companyId);
      const evidence = db.prepare("SELECT * FROM source_evidence WHERE entity_id = ? OR entity_id IN (SELECT person_id FROM people WHERE company_id = ?)").all(companyId, companyId);
      const discoveredUrls = db.prepare("SELECT * FROM discovered_urls WHERE domain = ?").all(company.canonical_domain);
      const crawlJobs = db.prepare("SELECT * FROM crawl_jobs WHERE target_domain = ? ORDER BY started_at DESC LIMIT 5").all(company.canonical_domain);

      return res.json({
        success: true,
        company,
        products,
        people,
        contacts,
        applications,
        evidence,
        discovered_urls: discoveredUrls,
        crawl_jobs: crawlJobs
      });
    }

    // ------------------------------------------------------------------------
    // 3. RESEARCH PRESET QUERIES: /api/intelligence/queries?preset_id=...
    // ------------------------------------------------------------------------
    if (pathname === "/api/intelligence/queries" || searchParams.get("action") === "queries") {
      const presetId = searchParams.get("preset_id") || "1";
      let querySql = "";
      let params = [];
      let queryTitle = "";
      let queryDescription = "";

      switch (presetId) {
        case "1":
          queryTitle = "US Precision Reducer & Joint Gearbox Manufacturers";
          queryDescription = "Companies that design, manufacture, or supply precision harmonic, cycloidal, or planetary gearheads.";
          querySql = `
            SELECT c.*, p.product_name, p.category as product_category, p.backlash, p.gear_ratio
            FROM companies c
            JOIN products p ON c.company_id = p.company_id
            WHERE p.category LIKE '%Reducer%' OR p.product_name LIKE '%Reducer%' OR p.product_name LIKE '%Harmonic%' OR c.primary_products LIKE '%Reducer%'
            LIMIT 50
          `;
          break;
        case "2":
          queryTitle = "Manufacturers with Documented Payload & Reach Specifications";
          queryDescription = "Robotics manufacturers that publish concrete payload capacities (kg) and reach (mm).";
          querySql = `
            SELECT c.company_id, c.legal_name, c.website, c.hq_state, p.product_name, p.category, p.payload_capacity, p.reach, p.repeatability
            FROM companies c
            JOIN products p ON c.company_id = p.company_id
            WHERE p.payload_capacity IS NOT NULL AND p.payload_capacity != 'N/A' AND p.reach IS NOT NULL AND p.reach != 'N/A'
            ORDER BY c.legal_name ASC
            LIMIT 50
          `;
          break;
        case "3":
          queryTitle = "Robotic Joint Module & Motion Subsystem Suppliers";
          queryDescription = "Suppliers of integrated rotary actuators, joint modules, and precision bearings for robot articulation.";
          querySql = `
            SELECT c.*
            FROM companies c
            WHERE c.primary_products LIKE '%Joint%' OR c.primary_products LIKE '%Actuator%' OR c.company_description LIKE '%actuator%'
            LIMIT 50
          `;
          break;
        case "4":
          queryTitle = "Robotic Machine-Tending & Workcell Integrators";
          queryDescription = "Turnkey robotic workcells and automated CNC loading/unloading specialists in the United States.";
          querySql = `
            SELECT c.*, a.application_area, a.industry_served
            FROM companies c
            LEFT JOIN applications a ON c.company_id = a.company_id
            WHERE c.company_description LIKE '%machine tending%' OR c.company_description LIKE '%work cell%' OR a.application_area LIKE '%Machine Tending%'
            LIMIT 50
          `;
          break;
        case "5":
          queryTitle = "Industrial Servo Drives & Motion Controllers";
          queryDescription = "Manufacturers of multi-axis servo drives, motion controllers, and precision motor systems.";
          querySql = `
            SELECT c.*, p.product_name, p.category
            FROM companies c
            JOIN products p ON c.company_id = p.company_id
            WHERE p.category LIKE '%Servo%' OR c.primary_products LIKE '%Servo%' OR c.primary_products LIKE '%Motion Control%'
            LIMIT 50
          `;
          break;
        case "6":
          queryTitle = "Companies with Publicly Listed Engineering Leadership";
          queryDescription = "Robotics companies with verified executives, founders, or engineering directors linked to public evidence.";
          querySql = `
            SELECT c.company_id, c.legal_name, c.website, c.hq_state, pe.full_name, pe.job_title, pe.role_category, pe.linkedin_url, pe.official_bio_url
            FROM companies c
            JOIN people pe ON c.company_id = pe.company_id
            WHERE pe.job_title IS NOT NULL
            ORDER BY c.legal_name ASC
            LIMIT 50
          `;
          break;
        case "7":
          queryTitle = "Companies with Verified Public Sales Contacts";
          queryDescription = "Robotics providers publishing direct business phone numbers and sales contact channels.";
          querySql = `
            SELECT c.company_id, c.legal_name, c.website, c.hq_state, bc.contact_type, bc.contact_value, bc.source_url
            FROM companies c
            JOIN business_contacts bc ON c.company_id = bc.company_id
            WHERE bc.contact_value IS NOT NULL AND bc.contact_value != ''
            ORDER BY c.legal_name ASC
            LIMIT 50
          `;
          break;
        case "8":
          queryTitle = "Robotics Leaders in Key Manufacturing Hubs (MI, CA, OH, MA)";
          queryDescription = "Companies operating with headquarters or manufacturing facilities in the primary US robotics clusters.";
          querySql = `
            SELECT c.*
            FROM companies c
            WHERE c.hq_state IN ('Michigan', 'California', 'Ohio', 'Massachusetts')
            ORDER BY c.hq_state ASC, c.completeness_score DESC
            LIMIT 50
          `;
          break;
        case "9":
          queryTitle = "Providers Serving Aerospace & Semiconductor Automation";
          queryDescription = "Companies with evidence of cleanroom, wafer-handling, or high-reliability aerospace deployments.";
          querySql = `
            SELECT c.*
            FROM companies c
            WHERE c.company_description LIKE '%aerospace%' OR c.company_description LIKE '%semiconductor%' OR c.primary_products LIKE '%aerospace%'
            LIMIT 50
          `;
          break;
        default:
          queryTitle = "High-Completeness Verified Intelligence Profiles";
          queryDescription = "Companies with comprehensive records including websites, contacts, and products.";
          querySql = `
            SELECT c.*
            FROM companies c
            WHERE c.completeness_score >= 0.70
            ORDER BY c.completeness_score DESC
            LIMIT 50
          `;
      }

      const results = db.prepare(querySql).all(...params);
      return res.json({
        success: true,
        preset_id: presetId,
        title: queryTitle,
        description: queryDescription,
        count: results.length,
        results
      });
    }

    // ------------------------------------------------------------------------
    // 4. TRIGGER CRAWL JOB: /api/intelligence/crawl (POST)
    // ------------------------------------------------------------------------
    if (pathname === "/api/intelligence/crawl" && req.method === "POST") {
      const { company_id, max_pages = 5 } = req.body || {};
      if (!company_id) {
        res.statusCode = 400;
        return res.json({ success: false, error: "Missing company_id parameter" });
      }

      const company = db.prepare("SELECT company_id, legal_name, website, canonical_domain FROM companies WHERE company_id = ?").get(company_id);
      if (!company) {
        res.statusCode = 404;
        return res.json({ success: false, error: `Company ${company_id} not found` });
      }

      // Execute Python crawler synchronously or spawn async
      const pythonExe = process.platform === "win32" ? ".\\.venv\\Scripts\\python.exe" : "./.venv/bin/python";
      const scriptCode = `
import sys
from src.intelligence.crawler import RoboticsIntelligenceCrawler
crawler = RoboticsIntelligenceCrawler()
res = crawler.run_company_crawl('${company_id}', max_pages=${max_pages})
import json
print("RESULT_JSON:" + json.dumps(res))
`;

      const pyProc = spawn(pythonExe, ["-c", scriptCode], { cwd: process.cwd() });
      let stdout = "";
      let stderr = "";

      pyProc.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pyProc.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      pyProc.on("close", (code) => {
        if (code !== 0) {
          res.statusCode = 500;
          return res.json({ success: false, error: "Crawler execution error", details: stderr });
        }

        const match = stdout.match(/RESULT_JSON:(.*)/);
        let crawlResult = { status: "completed", raw_output: stdout };
        if (match) {
          try {
            crawlResult = JSON.parse(match[1]);
          } catch (e) {
            // keep raw
          }
        }

        return res.json({
          success: true,
          crawl_result: crawlResult
        });
      });

      return;
    }

    // ------------------------------------------------------------------------
    // 5. EXPORT DATASET: /api/intelligence/export
    // ------------------------------------------------------------------------
    if (pathname === "/api/intelligence/export" || searchParams.get("action") === "export") {
      const format = searchParams.get("format") || "csv";
      const rows = db.prepare(`
        SELECT 
          c.company_id, c.legal_name, c.website, c.canonical_domain, c.company_type,
          c.hq_country, c.hq_state, c.hq_city, c.us_presence_status, c.primary_products,
          c.verification_status, c.confidence_score, c.completeness_score, c.last_verified,
          (SELECT COUNT(*) FROM products p WHERE p.company_id = c.company_id) as product_count,
          (SELECT COUNT(*) FROM people pe WHERE pe.company_id = c.company_id) as people_count,
          (SELECT contact_value FROM business_contacts bc WHERE bc.company_id = c.company_id LIMIT 1) as contact_phone
        FROM companies c
        ORDER BY c.completeness_score DESC, c.legal_name ASC
      `).all();

      if (format === "json") {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", 'attachment; filename="us_robotics_intelligence_export.json"');
        return res.json(rows);
      } else {
        // Return CSV
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="us_robotics_intelligence_export.csv"');
        
        const headers = [
          "Company ID", "Legal Name", "Website", "Domain", "Type",
          "HQ Country", "HQ State", "HQ City", "US Presence", "Primary Products",
          "Verification", "Confidence Score", "Completeness Score", "Last Verified",
          "Product Count", "People Count", "Contact Channel"
        ];
        
        let csvContent = "\uFEFF" + headers.join(",") + "\n";
        for (const r of rows) {
          const line = [
            `"${r.company_id}"`,
            `"${(r.legal_name || '').replace(/"/g, '""')}"`,
            `"${r.website || ''}"`,
            `"${r.canonical_domain || ''}"`,
            `"${r.company_type || ''}"`,
            `"${r.hq_country || ''}"`,
            `"${r.hq_state || ''}"`,
            `"${r.hq_city || ''}"`,
            `"${r.us_presence_status || ''}"`,
            `"${(r.primary_products || '').replace(/"/g, '""')}"`,
            `"${r.verification_status || ''}"`,
            r.confidence_score,
            r.completeness_score,
            `"${r.last_verified || ''}"`,
            r.product_count,
            r.people_count,
            `"${(r.contact_phone || '').replace(/"/g, '""')}"`
          ].join(",");
          csvContent += line + "\n";
        }
        res.end(csvContent);
        return;
      }
    }

    // ------------------------------------------------------------------------
    // 6. COMPANIES SEARCH & DIRECTORY: /api/intelligence/companies
    // ------------------------------------------------------------------------
    const q = searchParams.get("q") || "";
    const state = searchParams.get("state") || "";
    const category = searchParams.get("category") || "";
    const usPresence = searchParams.get("us_presence") || "";
    const verification = searchParams.get("verification") || "";
    const hasContacts = searchParams.get("has_contacts");
    const hasSpecs = searchParams.get("has_specs");
    const sortBy = searchParams.get("sort_by") || "completeness_score";
    const order = searchParams.get("order")?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
    const offset = (page - 1) * limit;

    let whereClauses = ["1=1"];
    let queryParams = [];

    if (q) {
      whereClauses.push(`(
        c.legal_name LIKE ? OR 
        c.canonical_domain LIKE ? OR 
        c.primary_products LIKE ? OR 
        c.company_description LIKE ? OR
        c.hq_city LIKE ? OR
        c.hq_state LIKE ?
      )`);
      const term = `%${q}%`;
      queryParams.push(term, term, term, term, term, term);
    }

    if (state) {
      whereClauses.push("c.hq_state = ?");
      queryParams.push(state);
    }

    if (category) {
      whereClauses.push("(c.company_type = ? OR c.robotics_categories LIKE ?)");
      queryParams.push(category, `%${category}%`);
    }

    if (usPresence) {
      whereClauses.push("c.us_presence_status = ?");
      queryParams.push(usPresence);
    }

    if (verification) {
      whereClauses.push("c.verification_status = ?");
      queryParams.push(verification);
    }

    if (hasContacts === "true") {
      whereClauses.push("c.company_id IN (SELECT DISTINCT company_id FROM business_contacts)");
    }

    if (hasSpecs === "true") {
      whereClauses.push("c.company_id IN (SELECT DISTINCT company_id FROM products WHERE payload_capacity IS NOT NULL OR reach IS NOT NULL)");
    }

    const whereSql = whereClauses.join(" AND ");

    // Count total matching
    const countSql = `SELECT COUNT(*) as total FROM companies c WHERE ${whereSql}`;
    const totalCount = db.prepare(countSql).get(...queryParams).total;

    // Allowed sort columns
    const allowedSorts = ["completeness_score", "legal_name", "hq_state", "confidence_score", "last_verified"];
    const safeSort = allowedSorts.includes(sortBy) ? sortBy : "completeness_score";

    // Query rows with preview stats
    const selectSql = `
      SELECT 
        c.company_id, c.legal_name, c.trading_name, c.website, c.canonical_domain,
        c.company_type, c.robotics_categories, c.primary_products, c.company_description,
        c.hq_country, c.hq_state, c.hq_city, c.us_presence_status, c.us_operating_locations,
        c.founded_year, c.employee_range, c.verification_status, c.confidence_score,
        c.completeness_score, c.last_verified,
        (SELECT COUNT(*) FROM products p WHERE p.company_id = c.company_id) as product_count,
        (SELECT COUNT(*) FROM people pe WHERE pe.company_id = c.company_id) as people_count,
        (SELECT contact_value FROM business_contacts bc WHERE bc.company_id = c.company_id LIMIT 1) as contact_phone
      FROM companies c
      WHERE ${whereSql}
      ORDER BY c.${safeSort} ${order}
      LIMIT ? OFFSET ?
    `;

    const rows = db.prepare(selectSql).all(...queryParams, limit, offset);

    return res.json({
      success: true,
      pagination: {
        page,
        limit,
        total: totalCount,
        total_pages: Math.ceil(totalCount / limit)
      },
      companies: rows
    });

  } catch (err) {
    console.error("Intelligence API Error:", err);
    res.statusCode = 500;
    return res.json({
      success: false,
      error: "Internal Server Error",
      message: err.message
    });
  }
}
