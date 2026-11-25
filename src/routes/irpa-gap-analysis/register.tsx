import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { IrpaNavigationHeader } from "@/components/irpa/IrpaNavigationHeader";
import { CompanyRegistrationForm } from "@/components/irpa/CompanyRegistrationForm";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/irpa-gap-analysis/register")({
  head: () =>
    buildSeoMeta({
      title: "Company Registration | IRPA Automation Gap Analysis",
      description: "Register your enterprise to initiate factory automation maturity assessment.",
      path: "/irpa-gap-analysis/register",
    }),
  component: IrpaRegisterRoute,
});

function IrpaRegisterRoute() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col">
      <IrpaNavigationHeader currentModule="register" />
      <main className="flex-1 py-6">
        <CompanyRegistrationForm
          onSuccess={(companyId) => {
            navigate({ to: "/irpa-gap-analysis/factory-profile" });
          }}
        />
      </main>
    </div>
  );
}
