import { createFileRoute } from "@tanstack/react-router";
import { SmokeyBackground, LoginForm } from "@/components/ui/login-form";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <main className="relative w-full min-h-[calc(100vh-80px)] bg-gray-950 flex items-center justify-center p-4">
      <SmokeyBackground className="absolute inset-0" backdropBlurAmount="md" color="#1E40AF" />
      <div className="relative z-10 flex items-center justify-center w-full max-w-md my-12">
        <LoginForm />
      </div>
    </main>
  );
}
