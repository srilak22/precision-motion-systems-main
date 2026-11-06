"use client";
import React, { useEffect, useRef, useState, FormEvent } from "react";
import {
  User,
  Lock,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  CheckCircle2,
  Info,
  UserPlus,
  Building,
  Cpu,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { submitLogin, getAuthStatus } from "@/lib/auth";
import {
  registerNewUser,
  authenticateUser,
  DEFAULT_PLANTS,
} from "@/data/mockUsersData";
import type { UserRole, Department } from "@/types/userAdmin";

// Vertex shader source code
const vertexSmokeySource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

// Fragment shader source code for the smokey background effect
const fragmentSmokeySource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution;
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    float time = iTime * 0.5;

    // Normalize mouse input (0.0 - 1.0) and remap to -1.0 ~ 1.0
    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;

    vec2 distortion = centeredUV;
    // Apply distortion for a wavy, smokey effect
    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    // Create a glowing wave pattern
    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.9, 0.2, wave);

    fragColor = vec4(u_color * glow, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

type BlurSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface SmokeyBackgroundProps {
  backdropBlurAmount?: string;
  color?: string;
  className?: string;
}

const blurClassMap: Record<BlurSize, string> = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

export function SmokeyBackground({
  backdropBlurAmount = "sm",
  color = "#1E40AF",
  className = "",
}: SmokeyBackgroundProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return [r, g, b];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }

    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSmokeySource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSmokeySource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const uColorLocation = gl.getUniformLocation(program, "u_color");

    let animationFrameId: number;
    let startTime = performance.now();

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      const currentTime = (performance.now() - startTime) / 1000;

      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(iTimeLocation, currentTime);
      gl.uniform2f(iMouseLocation, mousePosition.x, canvas.height - mousePosition.y);

      const [r, g, b] = hexToRgb(color);
      gl.uniform3f(uColorLocation, r, g, b);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [color]);

  const finalBlurClass =
    blurClassMap[backdropBlurAmount as BlurSize] || blurClassMap.sm;

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className={`absolute inset-0 ${finalBlurClass}`} />
    </div>
  );
}

interface AuthPortalProps {
  initialMode?: "login" | "register";
}

export function AuthPortal({ initialMode = "login" }: AuthPortalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Common State
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
  const [regRole, setRegRole] = useState<UserRole>("robotics_engineer");
  const [regDept, setRegDept] = useState<Department>("Robotics & Mechatronics");
  const [regPlant, setRegPlant] = useState(DEFAULT_PLANTS[0]);

  // Handle URL query ?tab=register
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "register") {
        setMode("register");
      }
    }
  }, []);

  // Quick Demo Login helper
  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Indus@Robotics2026");
    setErrorMessage(null);
  };

  // Sign In Handler
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      // 1. First attempt server-side authentication if configured
      try {
        const result = await submitLogin({
          data: { email, password },
        });

        if (result && result.success) {
          setSuccessMessage("Administrator access authenticated. Redirecting to Command Center...");
          document.cookie = `indus_admin_token=${result.token}; path=/; max-age=28800; SameSite=Strict; Secure`;
          setTimeout(() => {
            window.location.href = "/intelligence";
          }, 900);
          return;
        }
      } catch {
        // Fall through to persistent user directory authentication
      }

      // 2. Authenticate against registered engineers & operators in local store
      const localResult = authenticateUser(email, password);
      if (localResult.success) {
        setSuccessMessage(localResult.message);
        document.cookie = `indus_admin_token=${localResult.token}; path=/; max-age=28800; SameSite=Strict; Secure`;
        setTimeout(() => {
          // Redirect based on role
          if (localResult.user?.role === "super_admin") {
            window.location.href = "/user-admin";
          } else {
            window.location.href = "/user-admin";
          }
        }, 1000);
      } else {
        setErrorMessage(localResult.message);
      }
    } catch {
      setErrorMessage("Authentication process encountered an unexpected issue.");
    } finally {
      setLoading(false);
    }
  };

  // Register Handler
  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const regResult = registerNewUser({
        name: regName,
        email: regEmail,
        role: regRole,
        department: regDept,
        assignedPlants: [regPlant],
        mfaEnabled: true,
      });

      if (!regResult.success) {
        setErrorMessage(regResult.message);
        setLoading(false);
        return;
      }

      setSuccessMessage("Engineering credentials created! Authenticating session...");
      // Auto login
      const loginRes = authenticateUser(regEmail, regPassword);
      if (loginRes.token) {
        document.cookie = `indus_admin_token=${loginRes.token}; path=/; max-age=28800; SameSite=Strict; Secure`;
      }

      setTimeout(() => {
        window.location.href = "/user-admin";
      }, 1200);
    } catch {
      setErrorMessage("Failed to provision user. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-8 bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800 shadow-2xl text-white">
      {/* Brand Header */}
      <div className="text-center space-y-1.5 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-mono uppercase tracking-wider mb-2">
          <Cpu size={12} className="text-blue-400" />
          INDUS Engineering Portal
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          {mode === "login" ? "Industrial Access Sign In" : "Register Engineering Account"}
        </h2>
        <p className="text-xs text-slate-300 font-mono">
          {mode === "login"
            ? "Sign in to access robotics telemetry & administration"
            : "Provision access to robotic cells & RPA toolchains"}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl mb-6 border border-white/10 text-xs font-mono">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2 rounded-lg font-bold transition-all ${
            mode === "login"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2 rounded-lg font-bold transition-all ${
            mode === "register"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Register User
        </button>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="mb-4 border border-rose-500/40 bg-rose-950/60 p-3 rounded-xl flex items-start gap-2.5 text-xs text-rose-200">
          <ShieldAlert className="size-4 shrink-0 mt-0.5 text-rose-400" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 border border-emerald-500/40 bg-emerald-950/60 p-3 rounded-xl flex items-start gap-2.5 text-xs text-emerald-200">
          <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-400" />
          <p className="leading-relaxed">{successMessage}</p>
        </div>
      )}

      {/* MODE 1: LOGIN FORM */}
      {mode === "login" && (
        <form className="space-y-4" onSubmit={handleLoginSubmit}>
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <User size={13} className="text-blue-400" />
              Corporate Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. seshadri@indusrobotics.com"
              className="w-full h-11 px-3.5 bg-black/40 border border-white/20 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Lock size={13} className="text-blue-400" />
                Security Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-mono text-blue-400 hover:text-blue-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full h-11 px-3.5 bg-black/40 border border-white/20 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Selector */}
          <div className="pt-2 pb-1 border-t border-white/10">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Quick Test Credentials (1-Click Fill):
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoLogin("seshadri@indusrobotics.com")}
                className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono transition-colors"
              >
                <div className="font-bold text-purple-300">Super Admin</div>
                <div className="text-[9px] text-slate-400 truncate">Dr. Seshadri</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("sri.lakshana@indusrobotics.com")}
                className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono transition-colors"
              >
                <div className="font-bold text-blue-300">Lead Engineer</div>
                <div className="text-[9px] text-slate-400 truncate">Sri Lakshana</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("poojasri@indusrobotics.com")}
                className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono transition-colors"
              >
                <div className="font-bold text-emerald-300">RPA Analyst</div>
                <div className="text-[9px] text-slate-400 truncate">Pooja Sri</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("elena.r@indusrobotics.com")}
                className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono transition-colors"
              >
                <div className="font-bold text-amber-300">Plant Operator</div>
                <div className="text-[9px] text-slate-400 truncate">Elena Rostova</div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30"
          >
            {loading ? "Authenticating Clearance..." : "Authorize Access"}
            <ArrowRight size={14} className="ml-2" />
          </button>
        </form>
      )}

      {/* MODE 2: REGISTRATION FORM */}
      {mode === "register" && (
        <form className="space-y-3.5" onSubmit={handleRegisterSubmit}>
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-1">
              Full Legal Name *
            </label>
            <input
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="e.g. Vikram Patel"
              className="w-full h-10 px-3 bg-black/40 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-1">
              Work Email Address *
            </label>
            <input
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="v.patel@indusrobotics.com"
              className="w-full h-10 px-3 bg-black/40 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full h-10 px-3 bg-black/40 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full h-10 px-3 bg-black/40 border border-white/20 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-1">
                Role *
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as UserRole)}
                className="w-full h-10 px-2.5 bg-black/60 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="robotics_engineer">Robotics Engineer</option>
                <option value="plant_operator">Plant Operator</option>
                <option value="process_analyst">Process Analyst</option>
                <option value="client_partner">Client Partner</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-1">
                Department *
              </label>
              <select
                value={regDept}
                onChange={(e) => setRegDept(e.target.value as Department)}
                className="w-full h-10 px-2.5 bg-black/60 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="Robotics & Mechatronics">Robotics</option>
                <option value="Automation & Controls">Automation</option>
                <option value="Plant Operations">Plant Operations</option>
                <option value="Quality Assurance & Safety">Quality & Safety</option>
                <option value="Client Solutions">Client Solutions</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-1">
              Primary Facility / Plant *
            </label>
            <select
              value={regPlant}
              onChange={(e) => setRegPlant(e.target.value)}
              className="w-full h-10 px-2.5 bg-black/60 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            >
              {DEFAULT_PLANTS.map((plant) => (
                <option key={plant} value={plant}>
                  {plant}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30"
            >
              {loading ? "Registering Credentials..." : "Complete Registration"}
              <UserPlus size={14} className="ml-2" />
            </button>
          </div>
        </form>
      )}

      {/* Footer Switcher */}
      <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs font-mono text-slate-300">
        {mode === "login" ? (
          <p>
            Need a new account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
              }}
              className="text-blue-400 hover:text-blue-300 font-bold underline ml-1"
            >
              Register here
            </button>
          </p>
        ) : (
          <p>
            Already registered?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
              }}
              className="text-blue-400 hover:text-blue-300 font-bold underline ml-1"
            >
              Sign In here
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

// Backward-compatible export
export function LoginForm() {
  return <AuthPortal initialMode="login" />;
}
