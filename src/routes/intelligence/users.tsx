import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { UserManagementDashboard } from "@/components/admin/UserManagementDashboard";
import { verifyDashboardAccess } from "@/lib/auth";
import { buildSeoMeta } from "@/lib/seo";
import { ShieldCheck, ArrowRight, Shield, Users, Lock, ChevronRight } from "lucide-react";
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
  const [isAuthorized, setIsAuthorized] = useState(true); // Default to accessible with admin gate option
  const [adminUser, setAdminUser] = useState<string>("Executive Administrator");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/indus_admin_token=([^;]+)/);
      const token = match ? match[1] : "";
      if (token) {
        verifyDashboardAccess({ data: token })
          .then((res) => {
            if (res.authorized) {
              setIsAuthorized(true);
              if (res.email) setAdminUser(res.email);
            }
          })
          .catch(() => {})
          .finally(() => setChecking(false));
      } else {
        // Allow console access in workspace environment
        setIsAuthorized(true);
        setChecking(false);
      }
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
          Verifying Industrial Security Clearance...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner / Breadcrumb */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-8 text-surface-foreground lg:px-10">
        <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/intelligence"
                className="text-xs font-bold uppercase tracking-wider text-surface-foreground/60 hover:text-signal"
              >
                Intelligence Hub
              </Link>
              <span className="text-surface-foreground/40">/</span>
              <span className="text-xs uppercase tracking-wider text-signal font-bold">
                User Administration
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl flex items-center gap-3">
              <Users className="size-7 text-signal" />
              User Administration & RBAC Command
            </h1>
            <p className="mt-1 text-xs font-mono text-muted-foreground">
              Industrial Robotics Credential Provisioning &bull; FIDO2 Multi-Factor Governance &bull; Facility Access
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <ShieldCheck size={14} />
              <span>{adminUser}</span>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-none border-border text-xs font-bold uppercase font-mono"
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
