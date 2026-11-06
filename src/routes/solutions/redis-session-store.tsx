import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserManagementDashboard } from "@/components/admin/UserManagementDashboard";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/solutions/redis-session-store")({
  head: () =>
    buildSeoMeta({
      title: "Redis Distributed Session Store Solution | INDUS Industrial Robotics",
      description:
        "Industrial enterprise Redis session persistence architecture for multi-plant robotics operations, FIDO2 token validation, and sub-millisecond session replication.",
      path: "/solutions/redis-session-store",
    }),
  component: SolutionsRedisSessionPageRoute,
});

function SolutionsRedisSessionPageRoute() {
  return (
    <main className="w-full px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <UserManagementDashboard defaultTab="redis" />
      </div>
    </main>
  );
}
