import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { SmokeyBackground, AuthPortal } from "@/components/ui/login-form";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoMeta({
      title: "Sign In & Access Portal | INDUS Industrial Robotics",
      description: "Sign in to access INDUS robotics engineering platform, user administration, and telemetry command center.",
      path: "/",
      noindex: true,
    }),
  component: RootLoginLandingPage,
});

function RootLoginLandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // If user already authenticated, redirect to user-admin or home
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/indus_admin_token=([^;]+)/);
      if (match && match[1]) {
        navigate({ to: "/user-admin" });
      }
    }
  }, [navigate]);

  return (
    <main className="relative w-full min-h-[calc(100vh-80px)] bg-gray-950 flex items-center justify-center p-4">
      <SmokeyBackground className="absolute inset-0" backdropBlurAmount="md" color="#1E40AF" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md my-12">
        <AuthPortal initialMode="login" />
        <div className="mt-4 text-center">
          <Link
            to="/home"
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors underline"
          >
            Or browse robotics catalog as guest &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
