import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { UserManagementDashboard } from "@/components/admin/UserManagementDashboard";
import { buildSeoMeta } from "@/lib/seo";
import { Users, ShieldCheck, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/user-admin")({
  head: () =>
    buildSeoMeta({
      title: "User Admin Page | INDUS Industrial Robotics",
      description: "Enterprise administration portal for industrial robotics engineering, plant operations, and access controls.",
      path: "/user-admin",
      noindex: true,
    }),
  component: UserAdminPageRoute,
});

function UserAdminPageRoute() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header Bar */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-8 text-surface-foreground lg:px-10">
        <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="text-xs font-bold uppercase tracking-wider text-surface-foreground/60 hover:text-signal"
              >
                INDUS Industrial
              </Link>
              <span className="text-surface-foreground/40">/</span>
              <Link
                to="/intelligence"
                className="text-xs font-bold uppercase tracking-wider text-surface-foreground/60 hover:text-signal"
              >
                Intelligence Hub
              </Link>
              <span className="text-surface-foreground/40">/</span>
              <span className="text-xs uppercase tracking-wider text-signal font-bold">
                User Admin Page
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl flex items-center gap-3">
              <Users className="size-8 text-signal" />
              User Admin Page &bull; IN27-355
            </h1>
            <p className="mt-1 text-xs font-mono text-muted-foreground">
              Industrial Robotics Access Control &bull; Role Provisioning &bull; Security Audit Ledger
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-none border-border font-mono text-xs font-bold uppercase"
            >
              <Link to="/intelligence">
                Command Center
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-none bg-signal font-mono text-xs font-bold uppercase text-white hover:bg-signal/90"
            >
              <Link to="/login">
                Sign In
                <ArrowRight size={13} className="ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-5 py-8 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <UserManagementDashboard />
        </div>
      </section>
    </main>
  );
}
