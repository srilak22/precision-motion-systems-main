import { createFileRoute } from "@tanstack/react-router";
import { AuthPortal } from "@/components/ui/login-form";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/register")({
  head: () =>
    buildSeoMeta({
      title: "Create Account | INDUS Industrial Robotics",
      description: "Create an account on INDUS Industrial Robotics.",
      path: "/register",
      noindex: true,
    }),
  component: RegisterComponent,
});

function RegisterComponent() {
  return (
    <main className="w-full min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md my-12">
        <AuthPortal initialMode="register" />
      </div>
    </main>
  );
}
