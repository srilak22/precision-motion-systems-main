/**
 * ══════════════════════════════════════════════════════════════════
 *   INDUS DIGITAL PRESENCE INTELLIGENCE PLATFORM (Tasks 1, 2 & 3)
 *   Session Intelligence + Traffic Intelligence + Geo Intelligence
 * ══════════════════════════════════════════════════════════════════
 */
(function () {
  // ── 1. CONFIGURATION ────────────────────────────────────────────
  const ENDPOINT_URL =
    "https://script.google.com/macros/s/AKfycbw8NhfkPJGeYu4NAaisxN3FHaWmAVlZTmEO2x1CsBirRPvt5pQjI5zNv3qVXqEA2W1a/exec";

  const STORAGE_KEY_SESSION  = "ti_session_id";
  const STORAGE_KEY_TRAFFIC  = "ti_traffic_meta";
  const STORAGE_KEY_LANDING  = "ti_landing_page";
  const STORAGE_KEY_GEO      = "ti_geo_meta";
  const STORAGE_KEY_PREV     = "ti_previous_page";

  // ── 2. SESSION ID MANAGEMENT ────────────────────────────────────
  function getOrCreateSessionId() {
    let sid = sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now();
      sessionStorage.setItem(STORAGE_KEY_SESSION, sid);
    }
    return sid;
  }

  // ── 3. UTM & REFERRER EXTRACTION ────────────────────────────────
  function parseTrafficSource() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    let hasIncomingUTMs = false;
    utmKeys.forEach(function (k) {
      const v = urlParams.get(k);
      if (v !== null && v.trim() !== "") hasIncomingUTMs = true;
    });

    const refRaw = document.referrer || "";
    let isInternal = false;
    let refDomain = "";
    if (refRaw) {
      try {
        const refUrl = new URL(refRaw);
        refDomain = refUrl.hostname.toLowerCase().replace(/^www\./, "");
        const curHost = window.location.hostname.toLowerCase().replace(/^www\./, "");
        if (refDomain === curHost || ((refDomain === "localhost" || refDomain === "127.0.0.1") && (curHost === "localhost" || curHost === "127.0.0.1"))) {
          isInternal = true;
        }
      } catch (e) {
        refDomain = refRaw.toLowerCase().replace(/^www\./, "");
      }
    }

    // Preserve session acquisition source across internal navigation or SPA page changes
    const saved = sessionStorage.getItem(STORAGE_KEY_TRAFFIC);
    if (!hasIncomingUTMs && saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    if (isInternal && !hasIncomingUTMs) {
      const directFallback = {
        trafficType:    "Direct",
        trafficChannel: "Direct",
        trafficSource:  "direct",
        trafficMedium:  "none",
        utmSource:      "",
        utmMedium:      "",
        utmCampaign:    "",
        utmContent:     "",
        utmTerm:        "",
        referrer:       "",
        referrerDomain: ""
      };
      sessionStorage.setItem(STORAGE_KEY_TRAFFIC, JSON.stringify(directFallback));
      return directFallback;
    }

    const utmSource   = (urlParams.get("utm_source")   || "").trim();
    const utmMedium   = (urlParams.get("utm_medium")   || "").trim();
    const utmCampaign = (urlParams.get("utm_campaign") || "").trim();
    const utmContent  = (urlParams.get("utm_content")  || "").trim();
    const utmTerm     = (urlParams.get("utm_term")     || "").trim();

    const srcLower = utmSource.toLowerCase();
    const medLower = utmMedium.toLowerCase();

    const searchEngines = ["google", "bing", "yahoo", "duckduckgo", "baidu", "yandex", "ecosia", "ask", "brave", "startpage"];
    const matchedSearch = searchEngines.find(function (se) {
      return (refDomain && refDomain.includes(se)) || srcLower.includes(se);
    });

    const socialEngines = ["linkedin", "instagram", "facebook", "twitter", "x.com", "t.co", "youtube", "reddit", "pinterest", "tiktok", "threads", "whatsapp"];
    const matchedSocial = socialEngines.find(function (sn) {
      return (refDomain && refDomain.includes(sn)) || srcLower.includes(sn);
    });

    const emailDomains = ["mail.google.com", "outlook.live.com", "outlook.office.com", "mail.yahoo.com", "mail.aol.com", "webmail"];
    const isEmail = refRaw.startsWith("mailto:") || (refDomain && emailDomains.some(function (d) { return refDomain.includes(d); })) || ["email", "e-mail", "mail", "newsletter"].includes(medLower) || ["email", "newsletter"].includes(srcLower);

    const paidMediums = ["cpc", "ppc", "paid", "paidsearch", "paid_search", "cpa", "cpm", "ad"];
    const hasPaidMedium = paidMediums.includes(medLower);
    const hasAdClickId = urlParams.has("gclid") || urlParams.has("msclkid") || urlParams.has("dclid") || urlParams.has("wbraid") || urlParams.has("gbraid");
    const isPaidSearch = (hasPaidMedium && (matchedSearch || hasAdClickId || !matchedSocial)) || (hasAdClickId && !matchedSocial);

    let trafficType = "Direct";
    let source  = "direct";
    let medium  = "none";

    // 1. Paid Search
    if (isPaidSearch || (matchedSearch && hasPaidMedium)) {
      trafficType = "Paid Search";
      source = utmSource || (matchedSearch || (hasAdClickId ? "google" : "paid_search"));
      medium = utmMedium || "cpc";
    }
    // 2. Organic Search
    else if (medLower === "organic" || (matchedSearch && !hasPaidMedium && !utmCampaign)) {
      trafficType = "Organic Search";
      source = matchedSearch || (utmSource || "google");
      medium = utmMedium || "organic";
    }
    // 3. Social
    else if (matchedSocial || ["social", "social-network", "social-media", "sm"].includes(medLower)) {
      trafficType = "Social";
      source = matchedSocial || (utmSource || "social");
      medium = utmMedium || "social";
    }
    // 4. Email
    else if (isEmail) {
      trafficType = "Email";
      source = utmSource || (refDomain || "email");
      medium = utmMedium || "email";
    }
    // 5. Referral
    else if (refDomain && !isInternal && !(utmCampaign || utmSource || utmMedium)) {
      trafficType = "Referral";
      source = refDomain;
      medium = "referral";
    }
    // 7. Campaign
    else if (utmCampaign || utmSource || utmMedium) {
      trafficType = "Campaign";
      source = utmSource || "campaign";
      medium = utmMedium || "campaign";
    }
    // 6. Direct
    else {
      trafficType = "Direct";
      source = "direct";
      medium = "none";
    }

    const trafficData = {
      trafficType:    trafficType,
      trafficChannel: trafficType,
      trafficSource:  source,
      trafficMedium:  medium,
      utmSource:      utmSource,
      utmMedium:      utmMedium,
      utmCampaign:    utmCampaign,
      utmContent:     utmContent,
      utmTerm:        utmTerm,
      referrer:       isInternal ? "" : refRaw,
      referrerDomain: isInternal ? "" : (refDomain || "direct"),
      "Traffic Type":   trafficType,
      "traffic_type":   trafficType,
      "Traffic Source": source,
      "traffic_source": source,
      "Traffic Medium": medium,
      "traffic_medium": medium,
      "UTM Source":     utmSource,
      "utm_source":     utmSource,
      "UTM Medium":     utmMedium,
      "utm_medium":     utmMedium,
      "UTM Campaign":   utmCampaign,
      "utm_campaign":   utmCampaign,
      "UTM Term":       utmTerm,
      "utm_term":       utmTerm,
      "UTM Content":    utmContent,
      "utm_content":    utmContent,
      Referrer:         isInternal ? "" : refRaw
    };

    sessionStorage.setItem(STORAGE_KEY_TRAFFIC, JSON.stringify(trafficData));
    return trafficData;
  }

  // ── 3b. GEO INTELLIGENCE (Task 3: Privacy-Safe coarse lookup) ────
  function getCachedGeo() {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY_GEO);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  }

  // ── 3d. IP & NETWORK INTELLIGENCE (Task 5: Privacy-Safe) ───────
  function maskIpAddress(rawIp) {
    if (!rawIp) return { maskedIp: "unknown", ipVersion: "unknown", networkId: "net_unknown" };
    if (rawIp.indexOf(":") !== -1) {
      var segments = rawIp.split(":");
      var prefix = segments.slice(0, 3).join(":");
      return {
        maskedIp: prefix + ":xxxx:xxxx::/48",
        ipVersion: "IPv6",
        networkId: "net6_" + prefix.replace(/:/g, "_")
      };
    } else if (rawIp.indexOf(".") !== -1) {
      var octets = rawIp.split(".");
      var subnet = octets.slice(0, 3).join(".");
      return {
        maskedIp: subnet + ".xxx",
        ipVersion: "IPv4",
        networkId: "net4_" + subnet.replace(/\./g, "_")
      };
    }
    return { maskedIp: "anonymized", ipVersion: "IPv4", networkId: "net_anon" };
  }

  function classifyNetworkRisk(ipData, userAgent, dwellSeconds) {
    var isBot = /bot|crawler|spider|headless|phantom|selenium|puppeteer/i.test(userAgent || "");
    var org = ((ipData && (ipData.organization || ipData.isp)) || "").toLowerCase();
    var isDatacenter = (ipData && ipData.isDataCenter) || /hosting|cloud|datacenter|data center|server|vpn|proxy|tor|amazon|aws|google cloud|microsoft|azure|digitalocean|ovh|linode|hetzner|vultr|alibaba|tencent|fastly|cloudflare/i.test(org);
    var isSuspiciousSpeed = dwellSeconds >= 0 && dwellSeconds < 1;

    if (isBot && isDatacenter) {
      return {
        networkRiskSignal: "POTENTIAL AUTOMATION",
        supportingSignals: "Datacenter Hosting Subnet + Automated Bot User-Agent"
      };
    }
    if (isDatacenter && isSuspiciousSpeed) {
      return {
        networkRiskSignal: "POTENTIAL AUTOMATION",
        supportingSignals: "Hosting Network + High Click Velocity (<1s dwell)"
      };
    }
    if (isBot) {
      return {
        networkRiskSignal: "NEEDS REVIEW",
        supportingSignals: "Automated User-Agent Flagged on Residential/Enterprise IP"
      };
    }
    if (isSuspiciousSpeed) {
      return {
        networkRiskSignal: "NEEDS REVIEW",
        supportingSignals: "High Request Velocity (<1s between events)"
      };
    }
    if (isDatacenter) {
      return {
        networkRiskSignal: "UNUSUAL",
        supportingSignals: "Commercial Cloud / Datacenter ASN (Human-like browsing)"
      };
    }
    return {
      networkRiskSignal: "NORMAL",
      supportingSignals: "Standard Residential/Enterprise ISP with Natural Human Dwell"
    };
  }

  function resolveGeoAsync() {
    if (getCachedGeo()) return;

    fetch("https://ipwho.is/")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.success !== false) {
          var rawIp = data.ip || "";
          var ipMeta = maskIpAddress(rawIp);
          var orgName = ((data.connection && data.connection.org) || (data.connection && data.connection.isp) || "").toLowerCase();
          var isDc = /hosting|cloud|datacenter|data center|server|vpn|proxy|tor|amazon|aws|google cloud|microsoft|azure|digitalocean|ovh|linode|hetzner|vultr|alibaba|tencent|fastly|cloudflare/i.test(orgName);

          var geo = {
            country:      data.country || "",
            countryCode:  data.country_code || "",
            region:       data.region || "",
            city:         data.city || "",
            timezone:     (data.timezone && data.timezone.id) || Intl.DateTimeFormat().resolvedOptions().timeZone,
            latitude:     typeof data.latitude === "number" ? data.latitude : "",
            longitude:    typeof data.longitude === "number" ? data.longitude : "",
            isp:          (data.connection && data.connection.isp) || "",
            organization: (data.connection && data.connection.org) || "",
            asn:          (data.connection && data.connection.asn) ? ("AS" + data.connection.asn) : "",
            geoProvider:  "ipwho.is",
            // Task 5: IP Intelligence
            ipVersion:    ipMeta.ipVersion,
            maskedIp:     ipMeta.maskedIp,
            networkId:    ipMeta.networkId,
            isDataCenter: isDc,
            isProxyVpn:   !!(data.proxy || data.vpn || data.tor)
          };
          sessionStorage.setItem(STORAGE_KEY_GEO, JSON.stringify(geo));
          if (!sessionStorage.getItem("ti_geo_sent")) {
            sessionStorage.setItem("ti_geo_sent", "true");
            trackEvent("session_start", {
              event: "session_start",
              eventType: "session_start"
            });
          }
        }
      })
      .catch(function () {
        var fallback = {
          country:      "",
          countryCode:  "",
          region:       "",
          city:         "",
          timezone:     Intl.DateTimeFormat().resolvedOptions().timeZone,
          latitude:     "",
          longitude:    "",
          isp:          "",
          organization: "",
          asn:          "",
          geoProvider:  "browser_fallback",
          ipVersion:    "IPv4",
          maskedIp:     "anonymized",
          networkId:    "net_anon",
          isDataCenter: false,
          isProxyVpn:   false
        };
        sessionStorage.setItem(STORAGE_KEY_GEO, JSON.stringify(fallback));
      });
  }

  // Pre-fetch geo immediately on script load
  resolveGeoAsync();

  // ── 3c. TIME ZONE INTELLIGENCE (Task 4) ─────────────────────────
  function deriveTimeMeta(tz) {
    const now = new Date();
    const timezone = tz || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    let localHour = now.getHours();
    let dayOfWeek = "Monday";
    let isWeekend = "Weekday";
    let localDate = now.toISOString().split("T")[0];
    let localTimestamp = localDate + " " + now.toTimeString().split(" ")[0];
    let timeOfDayBucket = "Night";
    let isBusinessHours = "Business Hours";

    try {
      const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        weekday: "long"
      });
      const parts = {};
      dtf.formatToParts(now).forEach(function(p) { parts[p.type] = p.value; });
      localHour = parseInt(parts.hour, 10) % 24;
      dayOfWeek = parts.weekday || "Monday";
      const isWknd = (dayOfWeek === "Saturday" || dayOfWeek === "Sunday");
      isWeekend = isWknd ? "Weekend" : "Weekday";
      localDate = parts.year + "-" + parts.month + "-" + parts.day;
      localTimestamp = localDate + " " + parts.hour + ":" + parts.minute + ":" + parts.second;

      if (localHour >= 5 && localHour < 9) timeOfDayBucket = "Early Morning";
      else if (localHour >= 9 && localHour < 12) timeOfDayBucket = "Morning";
      else if (localHour >= 12 && localHour < 17) timeOfDayBucket = "Afternoon";
      else if (localHour >= 17 && localHour < 21) timeOfDayBucket = "Evening";
      else timeOfDayBucket = "Night";

      const isBiz = !isWknd && (localHour >= 9 && localHour < 18);
      isBusinessHours = isBiz ? "Business Hours" : "After Hours";
    } catch(e) {}

    const offsetMin = -now.getTimezoneOffset();
    const sign = offsetMin >= 0 ? "+" : "-";
    const pad = function(n) { return String(Math.floor(Math.abs(n))).padStart(2, "0"); };
    const utcOffset = "UTC" + sign + pad(offsetMin / 60) + ":" + pad(offsetMin % 60);

    return {
      timezone:        timezone,
      utcOffset:       utcOffset,
      localTimestamp:  localTimestamp,
      localDate:       localDate,
      localHour:       localHour,
      dayOfWeek:       dayOfWeek,
      isWeekend:       isWeekend,
      timeOfDayBucket: timeOfDayBucket,
      isBusinessHours: isBusinessHours
    };
  }

  // ── 4. DEVICE INTELLIGENCE DETECTION ────────────────────────────
  const STORAGE_KEY_DEVICE = "ti_device_intelligence";

  function detectBrowserName() {
    if (typeof navigator === "undefined" || !navigator.userAgent) return "Unknown";
    var ua = navigator.userAgent;
    if (/MSIE\s|Trident\//i.test(ua)) return "Internet Explorer";
    if (/Edg\/|EdgA\/|EdgiOS\/|Edge\//i.test(ua)) return "Microsoft Edge";
    if (/OPR\/|OPT\/|Opera/i.test(ua)) return "Opera";
    if (/Chrome\/|CriOS\//i.test(ua)) return "Google Chrome";
    if (/Firefox\/|FxiOS\//i.test(ua)) return "Mozilla Firefox";
    if (/Safari\//i.test(ua) && !/Chrome\/|CriOS\/|Edg\/|OPR\//i.test(ua) && !/Android/i.test(ua)) return "Safari";
    return "Unknown";
  }

  function detectOperatingSystem() {
    if (typeof navigator === "undefined") return "Unknown";
    var ua = navigator.userAgent || "";
    var platform = navigator.platform || "";
    var maxTouchPoints = navigator.maxTouchPoints || 0;

    if (/Android/i.test(ua)) return "Android";
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
    if (isIOS) return "iOS";
    if (/Windows NT|Windows|Win32|Win64/i.test(ua) || /Win/i.test(platform)) return "Windows";
    if ((/Mac OS X|Macintosh|Mac_PowerPC/i.test(ua) || /Mac/i.test(platform)) && !isIOS) return "macOS";
    if ((/Linux|X11/i.test(ua) || /Linux/i.test(platform)) && !/Android/i.test(ua)) return "Linux";
    return "Unknown";
  }

  function detectDeviceCategory() {
    if (typeof window === "undefined") return "Desktop";
    var ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
    var platform = (typeof navigator !== "undefined" && navigator.platform) || "";
    var maxTouchPoints = (typeof navigator !== "undefined" && navigator.maxTouchPoints) || 0;

    var isIPad = /iPad/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
    var isTabletUA = /(tablet|playbook|silk)|(android(?!.*mobi))/i.test(ua);
    if (isIPad || isTabletUA) return "Tablet";

    var isMobileUA = /Mobile|iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    if (isMobileUA) return "Mobile";

    var width = (typeof window.screen !== "undefined" && window.screen.width) ? window.screen.width : window.innerWidth;
    if (width > 0) {
      if (width <= 768) return "Mobile";
      if (width <= 1024) return "Tablet";
    }
    return "Desktop";
  }

  function detectScreenResolution() {
    if (typeof window === "undefined" || !window.screen) return "";
    var w = window.screen.width;
    var h = window.screen.height;
    if (typeof w === "number" && typeof h === "number" && w > 0 && h > 0) {
      return Math.round(w) + "x" + Math.round(h);
    }
    return "";
  }

  function getDeviceDetails() {
    try {
      var cached = sessionStorage.getItem(STORAGE_KEY_DEVICE);
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed && parsed.device && parsed.browser && parsed.operatingSystem) {
          return parsed;
        }
      }
    } catch (e) {}

    var details = {
      device: detectDeviceCategory(),
      browser: detectBrowserName(),
      operatingSystem: detectOperatingSystem(),
      screen: detectScreenResolution()
    };

    try {
      sessionStorage.setItem(STORAGE_KEY_DEVICE, JSON.stringify(details));
    } catch (e) {}

    return details;
  }

  function getDeviceType() {
    return getDeviceDetails().device;
  }

  // ── 5. DATA TRANSMISSION (sendBeacon + fetch fallback) ──────────
  function sendPayload(payload) {
    const dataString = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([dataString], { type: "text/plain;charset=UTF-8" });
      const sent = navigator.sendBeacon(ENDPOINT_URL, blob);
      if (sent) return;
    }

    fetch(ENDPOINT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: dataString
    }).catch(function () {});
  }

  // ── 6. CORE TRACKING FUNCTION ───────────────────────────────────
  function trackEvent(eventType, extra) {
    const sid     = getOrCreateSessionId();
    const traffic = parseTrafficSource();
    const deviceInfo = getDeviceDetails();

    let landingPage = sessionStorage.getItem(STORAGE_KEY_LANDING);
    if (!landingPage) {
      landingPage = window.location.pathname;
      sessionStorage.setItem(STORAGE_KEY_LANDING, landingPage);
    }

    const previousPage = sessionStorage.getItem(STORAGE_KEY_PREV) || "";

    const geo = getCachedGeo() || {
      country:      "",
      countryCode:  "",
      region:       "",
      city:         "",
      timezone:     Intl.DateTimeFormat().resolvedOptions().timeZone,
      latitude:     "",
      longitude:    "",
      isp:          "",
      organization: "",
      asn:          "",
      geoProvider:  "pending"
    };

    const timeMeta = deriveTimeMeta(geo.timezone);
    const dwellVal = (extra && (extra.dwellTimeSec !== undefined ? extra.dwellTimeSec : extra.dwellTime)) || 0;
    const risk = classifyNetworkRisk(geo, navigator.userAgent, dwellVal);

    const payload = Object.assign(
      {
        eventId:        "evt_" + Math.random().toString(36).substring(2, 10),
        sessionId:      sid,
        timestamp:      new Date().toISOString(),
        event:          eventType || "page_view",
        eventType:      eventType || "page_view",
        type:           eventType || "page_view",
        sheet:          (extra && (extra.sheet || extra.sheetName)) || (eventType === "page_view" ? "Page Views" : eventType === "click" ? "Clicks" : eventType === "cta_click" ? "CTA Interactions" : eventType === "form_submit" ? "Form Submissions" : eventType === "lead" ? "Leads" : eventType === "whatsapp_click" ? "WhatsApp Enquiries" : eventType === "download" ? "Downloads" : eventType === "search" ? "Search Activity" : eventType === "scroll" ? "Scroll & Engagement" : eventType === "session_start" ? "Website Sessions" : "Website Activity"),
        sheetName:      (extra && (extra.sheet || extra.sheetName)) || (eventType === "page_view" ? "Page Views" : eventType === "click" ? "Clicks" : eventType === "cta_click" ? "CTA Interactions" : eventType === "form_submit" ? "Form Submissions" : eventType === "lead" ? "Leads" : eventType === "whatsapp_click" ? "WhatsApp Enquiries" : eventType === "download" ? "Downloads" : eventType === "search" ? "Search Activity" : eventType === "scroll" ? "Scroll & Engagement" : eventType === "session_start" ? "Website Sessions" : "Website Activity"),
        table:          (extra && (extra.table || extra.sheet)) || (eventType === "page_view" ? "Page Views" : eventType === "click" ? "Clicks" : eventType === "cta_click" ? "CTA Interactions" : eventType === "form_submit" ? "Form Submissions" : eventType === "lead" ? "Leads" : eventType === "whatsapp_click" ? "WhatsApp Enquiries" : eventType === "download" ? "Downloads" : eventType === "search" ? "Search Activity" : eventType === "scroll" ? "Scroll & Engagement" : eventType === "session_start" ? "Website Sessions" : "Website Activity"),
        spreadsheetId:  "1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc",
        sheetGid:       "2025481644",
        spreadsheetUrl: "https://docs.google.com/spreadsheets/d/1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc/edit?gid=2025481644#gid=2025481644",
        pagePath:       window.location.pathname,
        page:           window.location.pathname,
        pageTitle:      document.title,
        previousPage:   previousPage,
        landingPage:    landingPage,
        device:         deviceInfo.device,
        browser:        deviceInfo.browser,
        operatingSystem: deviceInfo.operatingSystem,
        screen:         deviceInfo.screen,
        deviceType:     deviceInfo.device,
        Device:         deviceInfo.device,
        Browser:        deviceInfo.browser,
        "Operating System": deviceInfo.operatingSystem,
        operating_system: deviceInfo.operatingSystem,
        Screen:         deviceInfo.screen,
        "Screen Resolution": deviceInfo.screen,
        isConversion:   false,
        conversionType: "none",
        dwellTimeSec:   0,
        dwellTime:      0,
        // Task 5: IP Intelligence
        ipVersion:         geo.ipVersion || "IPv4",
        maskedIp:          geo.maskedIp || "anonymized",
        networkId:         geo.networkId || "net_anon",
        isDataCenter:      !!geo.isDataCenter,
        isProxyVpn:        !!geo.isProxyVpn,
        networkRiskSignal: risk.networkRiskSignal,
        supportingSignals: risk.supportingSignals
      },
      traffic,
      geo,
      timeMeta,
      extra || {}
    );

    const trafficAnalysisText = (traffic.trafficChannel || "Direct") + " Traffic (" + (traffic.trafficSource || "direct") + ") - " + (geo.city ? geo.city + ", " + geo.country : "Visitor") + " on " + window.location.pathname;
    const trafficIntelligenceText = "Channel: " + (traffic.trafficChannel || "Direct") + " | Source: " + (traffic.trafficSource || "direct") + " | Medium: " + (traffic.trafficMedium || "none") + " | Campaign: " + (traffic.utmCampaign || "none");
    const ipVal = geo.ip || geo.maskedIp || "anonymized";
    const tsVal = payload.timestamp || new Date().toISOString();

    payload["Traffic Analysis"] = trafficAnalysisText;
    payload["traffic analysis"] = trafficAnalysisText;
    payload["traffic_analysis"] = trafficAnalysisText;
    payload["trafficAnalysis"] = trafficAnalysisText;

    payload["Traffic Intelligence"] = trafficIntelligenceText;
    payload["traffic intelligence"] = trafficIntelligenceText;
    payload["traffic_intelligence"] = trafficIntelligenceText;
    payload["trafficIntelligence"] = trafficIntelligenceText;

    payload["IP"] = ipVal;
    payload["IP Address"] = ipVal;
    payload["ip_address"] = ipVal;
    payload["Timestamp"] = tsVal;
    payload["Time Stamp"] = tsVal;
    payload["Date & Time"] = tsVal;
    payload["timestapm"] = tsVal;
    payload["TIMESTAPM"] = tsVal;

    sendPayload(payload);
    sessionStorage.setItem(STORAGE_KEY_PREV, window.location.pathname);
  }

  // ── 7. AUTO-INITIALIZE ON PAGE LOAD & RESOLVE GEO ──────────────
  let pageStartTime = Date.now();

  function onPageLoad() {
    trackEvent("page_view");
    resolveGeoAsync();
  }

  function onPageLeave() {
    const dwell = Math.round((Date.now() - pageStartTime) / 1000);
    trackEvent("dwell", {
      dwellTimeSec: dwell,
      dwellTime:    dwell
    });
  }

  if (document.readyState === "complete") {
    onPageLoad();
  } else {
    window.addEventListener("load", onPageLoad);
  }

  // Kick off geo resolution immediately
  resolveGeoAsync();

  window.addEventListener("beforeunload", onPageLeave);

  // ── 8. SPA ROUTE NAVIGATION INTERCEPTION ────────────────────────
  let lastTrackedPath = window.location.pathname;
  function handleUrlChange() {
    const current = window.location.pathname;
    if (current !== lastTrackedPath) {
      lastTrackedPath = current;
      pageStartTime = Date.now();
      trackEvent("page_view", {
        page: current,
        pagePath: current,
        event: "page_view",
        eventType: "page_view"
      });
    }
  }

  window.addEventListener("popstate", handleUrlChange);

  if (typeof history !== "undefined" && history.pushState) {
    const origPush = history.pushState;
    history.pushState = function () {
      origPush.apply(this, arguments);
      setTimeout(handleUrlChange, 50);
    };
    const origReplace = history.replaceState;
    history.replaceState = function () {
      origReplace.apply(this, arguments);
      setTimeout(handleUrlChange, 50);
    };
  }

  // ── 9. GLOBAL INTERACTION & CTA TRACKER ─────────────────────────
  document.addEventListener(
    "click",
    function (e) {
      const target = e.target;
      if (!target) return;
      const el = target.closest("button, a, [role='button'], input[type='submit']");
      if (!el) return;

      const text = (el.textContent || "").trim().slice(0, 80);
      const href = el.getAttribute("href") || "";
      const isWhatsApp = href.indexOf("wa.me") !== -1 || href.indexOf("whatsapp") !== -1 || text.toLowerCase().indexOf("whatsapp") !== -1;
      const isCta = /quote|consult|enquir|contact|download|spec/i.test(text);

      const ev = isWhatsApp ? "whatsapp_click" : (isCta ? "cta_click" : "click");
      trackEvent(ev, {
        event: ev,
        eventType: ev,
        element: text || el.tagName.toLowerCase(),
        details: href || window.location.pathname
      });
    },
    { capture: true, passive: true }
  );

  // ── 10. GLOBAL CONVERSION TRACKER ───────────────────────────────
  window.trackConversion = function (goalName) {
    trackEvent("conversion", {
      isConversion:   true,
      conversionType: goalName || "contact_submit"
    });
  };
})();
