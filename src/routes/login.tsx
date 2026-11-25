import { createFileRoute } from "@tanstack/react-router";
import { AuthPortal } from "@/components/ui/login-form";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () =>
    buildSeoMeta({
      title: "Sign In | INDUS Industrial Robotics",
      description: "Sign in to INDUS Industrial Robotics or create an account.",
      path: "/login",
      noindex: true,
    }),
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <main className="w-full min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md my-12">
        <AuthPortal initialMode="login" />
      </div>
    </main>
  );
}
