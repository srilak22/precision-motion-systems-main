import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { UserManagementDashboard } from "@/components/admin/UserManagementDashboard";
import { verifyDashboardAccess } from "@/lib/auth";
import { buildSeoMeta } from "@/lib/seo";
import { ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/intelligence/users")({
  head: () =>
    buildSeoMeta({
      title: "User Administration | INDUS Industrial Robotics Command Center",
      description: "Enterprise user administration, RBAC access governance, and security audit ledger.",
      path: "/intelligence/users",
      noindex: true,
    }),
  component: UserAdminPage,
});

function UserAdminPage() {
  const [adminUser, setAdminUser] = useState<string>("Executive Administrator");

  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/indus_admin_token=([^;]+)/);
      const token = match ? match[1] : "";
      if (token) {
        verifyDashboardAccess({ data: token })
          .then((res) => {
            if (res.authorized && res.email) {
              setAdminUser(res.email);
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background text-foreground">
      {/* Top Banner / Breadcrumb */}
      <section className="border-b border-border bg-white dark:bg-card px-5 py-8 lg:px-10 shadow-xs">
        <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/intelligence"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
              >
                Intelligence Hub
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-xs uppercase tracking-wider text-primary font-bold">
                User Administration
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Users className="size-6" />
              </div>
              User Administration & RBAC Command
            </h1>
            <p className="mt-1 text-xs font-mono text-muted-foreground">
              Industrial Robotics Credential Provisioning &bull; FIDO2 Multi-Factor Governance &bull; Facility Access
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="border border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2">
              <ShieldCheck size={14} />
              <span>{adminUser}</span>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-lg border-border text-xs font-bold uppercase font-mono"
            >
              <Link to="/intelligence">
                Command Center
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
    </div>
  );
}
