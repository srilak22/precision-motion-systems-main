import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { UserManagementDashboard } from "@/components/admin/UserManagementDashboard";
import { buildSeoMeta } from "@/lib/seo";
import { Database, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/redis-sessions")({
  head: () =>
    buildSeoMeta({
      title: "Redis User Session Store | INDUS Industrial Robotics",
      description: "Distributed Redis session management portal for INDUS Industrial Robotics, operator authentication, and live key expiration.",
      path: "/redis-sessions",
      noindex: true,
    }),
  component: RedisSessionsPageRoute,
});

function RedisSessionsPageRoute() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-background text-foreground">
      {/* Header Bar */}
      <section className="border-b border-border bg-white dark:bg-card px-5 py-8 lg:px-10 shadow-xs">
        <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
              >
                INDUS Industrial
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <Link
                to="/user-admin"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
              >
                User Admin
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-xs uppercase tracking-wider text-primary font-bold">
                Redis Session Store
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Database className="size-6" />
              </div>
              Redis User Session Store &bull; Live Cluster
            </h1>
            <p className="mt-1 text-xs font-mono text-muted-foreground">
              RESP3 Protocol &bull; Key-Value User Auth &bull; 24-Hour Automated Eviction (TTL: 86,400s)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-lg border-border font-mono text-xs font-bold uppercase"
            >
              <Link to="/user-admin">
                User Directory
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 font-mono text-xs font-bold uppercase text-white shadow-xs"
            >
              <Link to="/login">
                Switch Session
                <ArrowRight size={13} className="ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-5 py-8 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <UserManagementDashboard defaultTab="redis" />
        </div>
      </section>
    </main>
  );
}
