import { createFileRoute } from "@tanstack/react-router";
import { SmokeyBackground, AuthPortal } from "@/components/ui/login-form";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () =>
    buildSeoMeta({
      title: "Engineering Sign In & Registration | INDUS Industrial Robotics",
      description: "Sign in to INDUS engineering platform or register a new user account.",
      path: "/login",
      noindex: true,
    }),
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <main className="relative w-full min-h-[calc(100vh-80px)] bg-gray-950 flex items-center justify-center p-4">
      <SmokeyBackground className="absolute inset-0" backdropBlurAmount="md" color="#1E40AF" />
      <div className="relative z-10 flex items-center justify-center w-full max-w-md my-12">
        <AuthPortal initialMode="login" />
      </div>
    </main>
  );
}
