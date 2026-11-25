"use client";
import React, { useEffect, useState, FormEvent } from "react";
import { ArrowRight, ShieldAlert, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { IndusLogo } from "@/components/brand/IndusLogo";
import { submitLogin } from "@/lib/auth";
import {
  registerNewUser,
  authenticateUser,
  setActiveUserSession,
  DEFAULT_PLANTS,
} from "@/data/mockUsersData";
import type { UserRecord } from "@/types/userAdmin";

export function SmokeyBackground({
  className = "",
}: {
  backdropBlurAmount?: string;
  color?: string;
  className?: string;
}): React.JSX.Element {
  return <div className={`bg-[#F8FAFC] ${className}`} aria-hidden="true" />;
}

interface AuthPortalProps {
  initialMode?: "login" | "register";
  redirectTo?: string;
  onSuccess?: (user: UserRecord) => void;
  allowGuestBypass?: boolean;
}

export function AuthPortal({
  initialMode = "login",
  redirectTo = "/",
  onSuccess,
  allowGuestBypass = true,
}: AuthPortalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "register") {
        setMode("register");
      }
    }
  }, []);

  const handleGuestBypass = () => {
    const guestUser: UserRecord = {
      id: "USR-GUEST",
      name: "Guest",
      email: "guest@indusrobotics.com",
      role: "robotics_engineer",
      department: "Client Solutions",
      status: "active",
      mfaEnabled: false,
      assignedPlants: [DEFAULT_PLANTS[0]],
      lastLogin: "Just now",
      createdAt: new Date().toISOString().split("T")[0],
      permissions: {
        telemetryStream: true,
        motionControl: false,
        digitalTwinSimulation: true,
        rpaWorkflows: true,
        userAdministration: false,
        auditLogsView: false,
        firmwareOTA: false,
      },
      notes: "Guest Explorer Mode",
    };
    setActiveUserSession(guestUser);
    if (onSuccess) {
      onSuccess(guestUser);
    } else {
      window.location.href = redirectTo || "/";
    }
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      try {
        const result = await submitLogin({ data: { email, password } });
        if (result && result.success) {
          setSuccessMessage("Signed in successfully.");
          document.cookie = `indus_admin_token=${result.token}; path=/; max-age=28800; SameSite=Strict; Secure`;
          setTimeout(() => {
            window.location.href = redirectTo || "/";
          }, 500);
          return;
        }
      } catch {
        // Fall through to local user directory authentication
      }

      const localResult = authenticateUser(email, password);
      if (localResult.success && localResult.user) {
        setSuccessMessage("Signed in successfully.");
        document.cookie = `indus_admin_token=${localResult.token}; path=/; max-age=28800; SameSite=Strict; Secure`;
        setActiveUserSession(localResult.user);
        if (onSuccess) {
          setTimeout(() => onSuccess(localResult.user!), 350);
          return;
        }
        setTimeout(() => {
          window.location.href = redirectTo || "/";
        }, 500);
      } else {
        setErrorMessage(localResult.message);
      }
    } catch {
      setErrorMessage("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const regResult = registerNewUser({
        name: regName,
        email: regEmail,
        role: "robotics_engineer",
        department: "Robotics & Mechatronics",
        assignedPlants: [DEFAULT_PLANTS[0]],
        mfaEnabled: false,
      });

      if (!regResult.success) {
        setErrorMessage(regResult.message);
        setLoading(false);
        return;
      }

      setSuccessMessage("Account created. Signing you in...");
      const loginRes = authenticateUser(regEmail, regPassword);
      if (loginRes.token && loginRes.user) {
        document.cookie = `indus_admin_token=${loginRes.token}; path=/; max-age=28800; SameSite=Strict; Secure`;
        setActiveUserSession(loginRes.user);
        if (onSuccess) {
          setTimeout(() => onSuccess(loginRes.user!), 350);
          return;
        }
      }

      setTimeout(() => {
        window.location.href = redirectTo || "/";
      }, 600);
    } catch {
      setErrorMessage("Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm text-slate-900">
      <div className="mb-6">
        <div className="mb-5 flex justify-center">
          <IndusLogo size="md" theme="light" />
        </div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900">
          {mode === "login" ? "Sign in to INDUS" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === "login"
            ? "Enter your email and password to continue."
            : "Fill in your details below to get started."}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <ShieldAlert className="size-4 shrink-0 mt-0.5 text-rose-500" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
          <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-500" />
          <p className="leading-relaxed">{successMessage}</p>
        </div>
      )}

      {mode === "login" ? (
        <form className="space-y-4" onSubmit={handleLoginSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center rounded-lg bg-[#155EEF] hover:bg-[#1047BF] disabled:opacity-50 text-sm font-semibold text-white transition-colors cursor-pointer"
          >
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            <ArrowRight size={15} className="ml-2" />
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleRegisterSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Your full name"
              className="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center rounded-lg bg-[#155EEF] hover:bg-[#1047BF] disabled:opacity-50 text-sm font-semibold text-white transition-colors cursor-pointer"
          >
            <span>{loading ? "Creating account..." : "Create Account"}</span>
            <ArrowRight size={15} className="ml-2" />
          </button>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
        {mode === "login" ? (
          <p>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="font-semibold text-[#155EEF] hover:underline cursor-pointer"
            >
              Create one
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="font-semibold text-[#155EEF] hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        )}

        {allowGuestBypass && (
          <div className="mt-3">
            <button
              type="button"
              onClick={handleGuestBypass}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 underline cursor-pointer transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoginForm() {
  return <AuthPortal initialMode="login" />;
}
