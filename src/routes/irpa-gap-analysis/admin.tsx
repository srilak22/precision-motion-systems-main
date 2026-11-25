import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { IrpaNavigationHeader } from "@/components/irpa/IrpaNavigationHeader";
import { AdminPortal } from "@/components/irpa/AdminPortal";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/irpa-gap-analysis/admin")({
  head: () =>
    buildSeoMeta({
      title: "IRPA Executive Command Center | INDUS Administration",
      description: "Industrial Robotics Process Automation assessment system overview, metrics, and audit logs.",
      path: "/irpa-gap-analysis/admin",
      noindex: true,
    }),
  component: IrpaAdminRoute,
});

function IrpaAdminRoute() {
  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col">
      <IrpaNavigationHeader currentModule="admin" />
      <main className="flex-1">
        <AdminPortal />
      </main>
    </div>
  );
}
