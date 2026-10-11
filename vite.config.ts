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
            next();
          });
        },
      },
    ],
  },
});
