// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        name: "api-track-dev-middleware",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (
              req.url &&
              (req.url === "/api/jira-webhook" || req.url.startsWith("/api/jira-webhook?"))
            ) {
              try {
                // @ts-expect-error JS module without declaration file
                const webhookModule = await import("./api/jira-webhook.js");
                const handler = webhookModule.default;
                const chunks: Buffer[] = [];
                req.on("data", (chunk: Buffer) => {
                  chunks.push(chunk);
                });
                req.on("end", async () => {
                  const rawBuf = Buffer.concat(chunks);
                  (req as unknown as Record<string, unknown>)["rawBody"] = rawBuf;
                  try {
                    (req as unknown as Record<string, unknown>)["body"] = JSON.parse(
                      rawBuf.toString("utf8"),
                    );
                  } catch {
                    (req as unknown as Record<string, unknown>)["body"] = rawBuf;
                  }
                  const resAny = res as unknown as {
                    status: (code: number) => typeof resAny;
                    json: (data: unknown) => typeof resAny;
                  };
                  resAny.status = function (code: number) {
                    res.statusCode = code;
                    return resAny;
                  };
                  resAny.json = function (data: unknown) {
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(data));
                    return resAny;
                  };
                  await handler(req as unknown, res as unknown);
                });
                return;
              } catch (e) {
                console.error("Local /api/jira-webhook middleware error:", e);
                return next(e);
              }
            }

            if (req.url && (req.url === "/api/track" || req.url.startsWith("/api/track?"))) {
              try {
                // @ts-expect-error JS module without declaration file
                const trackModule = await import("./api/track.js");
                const handler = trackModule.default;
                let body = "";
                req.on("data", (chunk: Buffer) => {
                  body += chunk.toString();
                });
                req.on("end", async () => {
                  if (body) {
                    try {
                      (req as unknown as Record<string, unknown>)["body"] = JSON.parse(body);
                    } catch {
                      (req as unknown as Record<string, unknown>)["body"] = body;
                    }
                  }
                  // Polyfill Express-style helpers for Connect response
                  const resAny = res as unknown as {
                    status: (code: number) => typeof resAny;
                    json: (data: unknown) => typeof resAny;
                  };
                  resAny.status = function (code: number) {
                    res.statusCode = code;
                    return resAny;
                  };
                  resAny.json = function (data: unknown) {
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(data));
                    return resAny;
                  };

                  await handler(req as unknown, res as unknown);
                });
                return;
              } catch (e) {
                console.error("Local /api/track middleware error:", e);
                return next(e);
              }
            }
            if (
              req.url &&
              (req.url === "/api/consultation" || req.url.startsWith("/api/consultation?"))
            ) {
              try {
                // @ts-expect-error JS module without declaration file
                const consultationModule = await import("./api/consultation.js");
                const handler = consultationModule.default;
                let body = "";
                req.on("data", (chunk: Buffer) => {
                  body += chunk.toString();
                });
                req.on("end", async () => {
                  if (body) {
                    try {
                      (req as unknown as Record<string, unknown>)["body"] = JSON.parse(body);
                    } catch {
                      (req as unknown as Record<string, unknown>)["body"] = body;
                    }
                  }
                  const resAny = res as unknown as {
                    status: (code: number) => typeof resAny;
                    json: (data: unknown) => typeof resAny;
                    setHeader: (k: string, v: string) => typeof resAny;
                    end: (d?: unknown) => void;
                  };
                  resAny.status = function (code: number) {
                    res.statusCode = code;
                    return resAny;
                  };
                  resAny.json = function (data: unknown) {
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(data));
                    return resAny;
                  };
                  await handler(req as unknown, res as unknown);
                });
                return;
              } catch (e) {
                console.error("Local /api/consultation middleware error:", e);
                return next(e);
              }
            }
            if (
              req.url &&
              (req.url === "/api/youtube-lead" || req.url.startsWith("/api/youtube-lead?"))
            ) {
              try {
                // @ts-expect-error JS module without declaration file
                const ytModule = await import("./api/youtube-lead.js");
                const handler = ytModule.default;
                let body = "";
                req.on("data", (chunk: Buffer) => {
                  body += chunk.toString();
                });
                req.on("end", async () => {
                  if (body) {
                    try {
                      (req as unknown as Record<string, unknown>)["body"] = JSON.parse(body);
                    } catch {
                      (req as unknown as Record<string, unknown>)["body"] = body;
                    }
                  }
                  const resAny = res as unknown as {
                    status: (code: number) => typeof resAny;
                    json: (data: unknown) => typeof resAny;
                  };
                  resAny.status = function (code: number) {
                    res.statusCode = code;
                    return resAny;
                  };
                  resAny.json = function (data: unknown) {
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(data));
                    return resAny;
                  };

                  await handler(req as unknown, res as unknown);
                });
                return;
              } catch (e) {
                console.error("Local /api/youtube-lead middleware error:", e);
                return next(e);
              }
            }
            if (
              req.url &&
              (req.url === "/api/auth/youtube/start" ||
                req.url.startsWith("/api/auth/youtube/start?"))
            ) {
              try {
                // @ts-expect-error JS module without declaration file
                const startModule = await import("./api/auth/youtube/start.js");
                const handler = startModule.default;
                const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
                (req as unknown as Record<string, unknown>)["query"] = Object.fromEntries(
                  url.searchParams.entries(),
                );
                const resAny = res as unknown as {
                  status: (code: number) => typeof resAny;
                  json: (data: unknown) => typeof resAny;
                };
                resAny.status = function (code: number) {
                  res.statusCode = code;
                  return resAny;
                };
                resAny.json = function (data: unknown) {
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify(data));
                  return resAny;
                };
                await handler(req as unknown, res as unknown);
                return;
              } catch (e) {
                console.error("Local /api/auth/youtube/start middleware error:", e);
                return next(e);
              }
            }
            if (
              req.url &&
              (req.url === "/api/auth/youtube/callback" ||
                req.url.startsWith("/api/auth/youtube/callback?"))
            ) {
              try {
                // @ts-expect-error JS module without declaration file
                const callbackModule = await import("./api/auth/youtube/callback.js");
                const handler = callbackModule.default;
                const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
                (req as unknown as Record<string, unknown>)["query"] = Object.fromEntries(
                  url.searchParams.entries(),
                );
                const resAny = res as unknown as {
                  status: (code: number) => typeof resAny;
                  json: (data: unknown) => typeof resAny;
                };
                resAny.status = function (code: number) {
                  res.statusCode = code;
                  return resAny;
                };
                resAny.json = function (data: unknown) {
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify(data));
                  return resAny;
                };
                await handler(req as unknown, res as unknown);
                return;
              } catch (e) {
                console.error("Local /api/auth/youtube/callback middleware error:", e);
                return next(e);
              }
            }
            if (
              req.url &&
              (req.url === "/api/report-email" ||
                req.url.startsWith("/api/report-email?") ||
                req.url === "/api/cron/reports" ||
                req.url.startsWith("/api/cron/reports?") ||
                req.url === "/api/report-daily" ||
                req.url.startsWith("/api/report-daily?") ||
                req.url === "/api/report-weekly" ||
                req.url.startsWith("/api/report-weekly?") ||
                req.url === "/api/report-monthly" ||
                req.url.startsWith("/api/report-monthly?"))
            ) {
              try {
                const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
                const pathname = url.pathname;
                let targetModulePath = "./api/cron/reports.js";
                if (pathname.includes("report-email")) targetModulePath = "./api/report-email.js";
                else if (pathname.includes("daily")) targetModulePath = "./api/_lib/report-daily.js";
                else if (pathname.includes("weekly")) targetModulePath = "./api/_lib/report-weekly.js";
                else if (pathname.includes("monthly")) targetModulePath = "./api/_lib/report-monthly.js";

                const reportModule = await import(targetModulePath);
                const handler = reportModule.default;
                let body = "";
                req.on("data", (chunk: Buffer) => {
                  body += chunk.toString();
                });
                req.on("end", async () => {
                  if (body) {
                    try {
                      (req as unknown as Record<string, unknown>)["body"] = JSON.parse(body);
                    } catch {
                      (req as unknown as Record<string, unknown>)["body"] = body;
                    }
                  }
                  (req as unknown as Record<string, unknown>)["query"] = Object.fromEntries(
                    url.searchParams.entries(),
                  );
                  const resAny = res as unknown as {
                    status: (code: number) => typeof resAny;
                    json: (data: unknown) => typeof resAny;
                    setHeader: (k: string, v: string) => typeof resAny;
                    end: (d?: unknown) => void;
                  };
                  resAny.status = function (code: number) {
                    res.statusCode = code;
                    return resAny;
                  };
                  resAny.json = function (data: unknown) {
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(data));
                    return resAny;
                  };
                  await handler(req as unknown, res as unknown);
                });
                return;
              } catch (e) {
                console.error("Local report middleware error:", e);
                return next(e);
              }
            }
            next();
          });
        },
      },
    ],
  },
});
