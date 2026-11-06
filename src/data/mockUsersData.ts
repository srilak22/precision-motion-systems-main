import type {
  UserRecord,
  UserRole,
  SecurityAuditEntry,
  RbacRoleDefinition,
} from "@/types/userAdmin";

export const DEFAULT_PLANTS = [
  "Bengaluru Gigafactory 1",
  "Detroit Robotics Assembly Plant",
  "Tokyo R&D Robotics Center",
  "Munich Precision Motion Lab",
  "Singapore Logistics Hub",
];

export const INITIAL_USERS: UserRecord[] = [
  {
    id: "USR-001",
    name: "Dr. Seshadri Srinivasan",
    email: "seshadri@indusrobotics.com",
    role: "super_admin",
    department: "Executive Leadership",
    status: "active",
    mfaEnabled: true,
    assignedPlants: ["Bengaluru Gigafactory 1", "Tokyo R&D Robotics Center", "Munich Precision Motion Lab"],
    lastLogin: "2026-11-06 13:42:10 UTC",
    createdAt: "2024-01-15",
    permissions: {
      telemetryStream: true,
      motionControl: true,
      digitalTwinSimulation: true,
      rpaWorkflows: true,
      userAdministration: true,
      auditLogsView: true,
      firmwareOTA: true,
    },
    notes: "Executive Director & System Security Chief",
  },
  {
    id: "USR-002",
    name: "Dr. Annanya Pandey",
    email: "annanya@indusrobotics.com",
    role: "super_admin",
    department: "Executive Leadership",
    status: "active",
    mfaEnabled: true,
    assignedPlants: ["Bengaluru Gigafactory 1", "Detroit Robotics Assembly Plant"],
    lastLogin: "2026-11-06 11:15:32 UTC",
    createdAt: "2024-02-01",
    permissions: {
      telemetryStream: true,
      motionControl: true,
      digitalTwinSimulation: true,
      rpaWorkflows: true,
      userAdministration: true,
      auditLogsView: true,
      firmwareOTA: true,
    },
    notes: "Chief Technology Officer & Robotics Architect",
  },
  {
    id: "USR-003",
    name: "Sri Lakshana",
    email: "sri.lakshana@indusrobotics.com",
    role: "robotics_engineer",
    department: "Robotics & Mechatronics",
    status: "active",
    mfaEnabled: true,
    assignedPlants: ["Bengaluru Gigafactory 1", "Munich Precision Motion Lab"],
    lastLogin: "2026-11-06 13:50:00 UTC",
    createdAt: "2024-06-12",
    permissions: {
      telemetryStream: true,
      motionControl: true,
      digitalTwinSimulation: true,
      rpaWorkflows: true,
      userAdministration: false,
      auditLogsView: true,
      firmwareOTA: true,
    },
    notes: "Lead Industrial Robotics Automation Engineer",
  },
  {
    id: "USR-004",
    name: "Pooja Sri",
    email: "poojasri@indusrobotics.com",
    role: "process_analyst",
    department: "Automation & Controls",
    status: "active",
    mfaEnabled: true,
    assignedPlants: ["Bengaluru Gigafactory 1"],
    lastLogin: "2026-11-06 12:20:45 UTC",
    createdAt: "2024-07-20",
    permissions: {
      telemetryStream: true,
      motionControl: false,
      digitalTwinSimulation: true,
      rpaWorkflows: true,
      userAdministration: false,
      auditLogsView: true,
      firmwareOTA: false,
    },
    notes: "RPA & Video Process Analysis Engineer",
  },
  {
    id: "USR-005",
    name: "Rajesh Kumar",
    email: "rajesh.k@indusrobotics.com",
    role: "robotics_engineer",
    department: "Automation & Controls",
    status: "active",
    mfaEnabled: true,
    assignedPlants: ["Bengaluru Gigafactory 1"],
    lastLogin: "2026-11-05 18:04:19 UTC",
    createdAt: "2024-08-10",
    permissions: {
      telemetryStream: true,
      motionControl: true,
      digitalTwinSimulation: true,
      rpaWorkflows: true,
      userAdministration: false,
      auditLogsView: false,
      firmwareOTA: false,
    },
    notes: "Senior Kinematics & Motion Control Engineer",
  },
  {
    id: "USR-006",
    name: "Elena Rostova",
    email: "elena.r@indusrobotics.com",
    role: "plant_operator",
    department: "Plant Operations",
    status: "active",
    mfaEnabled: true,
    assignedPlants: ["Detroit Robotics Assembly Plant"],
    lastLogin: "2026-11-06 09:12:03 UTC",
    createdAt: "2024-09-01",
    permissions: {
      telemetryStream: true,
      motionControl: false,
      digitalTwinSimulation: false,
      rpaWorkflows: true,
      userAdministration: false,
      auditLogsView: false,
      firmwareOTA: false,
    },
    notes: "Automotive Welding Cell Supervisor",
  },
  {
    id: "USR-007",
    name: "Kenji Sato",
    email: "k.sato@indusrobotics.jp",
    role: "robotics_engineer",
    department: "Quality Assurance & Safety",
    status: "active",
    mfaEnabled: true,
    assignedPlants: ["Tokyo R&D Robotics Center"],
    lastLogin: "2026-11-06 06:45:11 UTC",
    createdAt: "2024-09-18",
    permissions: {
      telemetryStream: true,
      motionControl: false,
      digitalTwinSimulation: true,
      rpaWorkflows: true,
      userAdministration: false,
      auditLogsView: true,
      firmwareOTA: false,
    },
    notes: "ISO 10218 Robot Safety Compliance Auditor",
  },
  {
    id: "USR-008",
    name: "Marcus Vance",
    email: "m.vance@gigafactory-tier1.com",
    role: "client_partner",
    department: "Client Solutions",
    status: "pending",
    mfaEnabled: false,
    assignedPlants: ["Detroit Robotics Assembly Plant"],
    lastLogin: "Never (Pending verification)",
    createdAt: "2026-11-05",
    permissions: {
      telemetryStream: true,
      motionControl: false,
      digitalTwinSimulation: false,
      rpaWorkflows: false,
      userAdministration: false,
      auditLogsView: false,
      firmwareOTA: false,
    },
    notes: "Tier-1 Automotive Partner - awaiting executive approval",
  },
  {
    id: "USR-009",
    name: "Arthur Pendelton",
    email: "a.pendelton@legacy-ops.com",
    role: "plant_operator",
    department: "Plant Operations",
    status: "suspended",
    mfaEnabled: false,
    assignedPlants: ["Detroit Robotics Assembly Plant"],
    lastLogin: "2026-10-18 14:11:00 UTC",
    createdAt: "2024-05-11",
    permissions: {
      telemetryStream: false,
      motionControl: false,
      digitalTwinSimulation: false,
      rpaWorkflows: false,
      userAdministration: false,
      auditLogsView: false,
      firmwareOTA: false,
    },
    notes: "Suspended due to multiple failed MFA challenges",
  },
];

export const RBAC_ROLE_DEFINITIONS: RbacRoleDefinition[] = [
  {
    role: "super_admin",
    title: "Super Administrator",
    description: "Full root access across all facilities, telemetry, user management, and security keys.",
    userCount: 2,
    permissions: {
      telemetryStream: true,
      motionControl: true,
      digitalTwinSimulation: true,
      rpaWorkflows: true,
      userAdministration: true,
      auditLogsView: true,
      firmwareOTA: true,
    },
  },
  {
    role: "robotics_engineer",
    title: "Robotics Automation Engineer",
    description: "Access to live robot telemetry, 3D digital twins, kinematics calculations, and firmware OTA testing.",
    userCount: 3,
    permissions: {
      telemetryStream: true,
      motionControl: true,
      digitalTwinSimulation: true,
      rpaWorkflows: true,
      userAdministration: false,
      auditLogsView: true,
      firmwareOTA: true,
    },
  },
  {
    role: "plant_operator",
    title: "Plant Floor Operator",
    description: "Monitors active assembly lines, acknowledges safety alerts, and runs scheduled RPA tasks.",
    userCount: 2,
    permissions: {
      telemetryStream: true,
      motionControl: false,
      digitalTwinSimulation: false,
      rpaWorkflows: true,
      userAdministration: false,
      auditLogsView: false,
      firmwareOTA: false,
    },
  },
  {
    role: "process_analyst",
    title: "Process & RPA Analyst",
    description: "Evaluates robotization cycle times, video-based throughput calculations, and automation reports.",
    userCount: 1,
    permissions: {
      telemetryStream: true,
      motionControl: false,
      digitalTwinSimulation: true,
      rpaWorkflows: true,
      userAdministration: false,
      auditLogsView: true,
      firmwareOTA: false,
    },
  },
  {
    role: "client_partner",
    title: "Client & Ecosystem Partner",
    description: "Read-only visibility into contracted robotic cells, uptime SLAs, and technical specifications.",
    userCount: 1,
    permissions: {
      telemetryStream: true,
      motionControl: false,
      digitalTwinSimulation: false,
      rpaWorkflows: false,
      userAdministration: false,
      auditLogsView: false,
      firmwareOTA: false,
    },
  },
];

export const INITIAL_AUDIT_LOGS: SecurityAuditEntry[] = [
  {
    id: "AUD-991",
    timestamp: "2026-11-06 13:42:15 UTC",
    actor: "Dr. Seshadri Srinivasan",
    action: "ADMIN_LOGIN_SUCCESS",
    targetUser: "Dr. Seshadri Srinivasan",
    ipAddress: "14.139.182.42 (Bengaluru, IN)",
    facility: "Bengaluru Gigafactory 1",
    severity: "info",
  },
  {
    id: "AUD-990",
    timestamp: "2026-11-06 13:21:04 UTC",
    actor: "Sri Lakshana",
    action: "DIGITAL_TWIN_SIMULATION_EXECUTED",
    targetUser: "Sri Lakshana",
    ipAddress: "106.51.78.11 (Bengaluru, IN)",
    facility: "Bengaluru Gigafactory 1",
    severity: "info",
  },
  {
    id: "AUD-989",
    timestamp: "2026-11-06 11:15:33 UTC",
    actor: "Dr. Annanya Pandey",
    action: "ROLE_PERMISSION_VERIFIED",
    targetUser: "Rajesh Kumar",
    ipAddress: "192.168.10.201 (Internal VPN)",
    facility: "Detroit Robotics Assembly Plant",
    severity: "info",
  },
  {
    id: "AUD-988",
    timestamp: "2026-11-05 22:18:40 UTC",
    actor: "SYSTEM_SECURITY_AGENT",
    action: "USER_ACCOUNT_SUSPENDED",
    targetUser: "Arthur Pendelton",
    ipAddress: "198.51.100.84 (Detroit, US)",
    facility: "Detroit Robotics Assembly Plant",
    severity: "warning",
  },
  {
    id: "AUD-987",
    timestamp: "2026-11-05 14:02:19 UTC",
    actor: "Dr. Seshadri Srinivasan",
    action: "NEW_CLIENT_INVITATION_DISPATCHED",
    targetUser: "Marcus Vance",
    ipAddress: "14.139.182.42 (Bengaluru, IN)",
    facility: "Detroit Robotics Assembly Plant",
    severity: "info",
  },
];

const STORAGE_KEY = "indus_user_admin_records_v1";
const AUDIT_STORAGE_KEY = "indus_user_admin_audit_v1";
export const ACTIVE_SESSION_KEY = "indus_active_user_session_v1";

export function getActiveUserSession(): UserRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setActiveUserSession(user: UserRecord): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("indus:auth-change", { detail: user }));
  } catch {
    // ignore
  }
}

export function clearActiveUserSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    document.cookie = "indus_admin_token=; path=/; max-age=0; SameSite=Strict; Secure";
    window.dispatchEvent(new CustomEvent("indus:auth-change", { detail: null }));
  } catch {
    // ignore
  }
}

export function loadUsersFromStorage(): UserRecord[] {
  if (typeof window === "undefined") return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_USERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsersToStorage(users: UserRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore localStorage quota errors
  }
}

export function loadAuditLogsFromStorage(): SecurityAuditEntry[] {
  if (typeof window === "undefined") return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return INITIAL_AUDIT_LOGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_AUDIT_LOGS;
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function appendAuditLog(entry: Omit<SecurityAuditEntry, "id" | "timestamp">): SecurityAuditEntry {
  const currentLogs = loadAuditLogsFromStorage();
  const newEntry: SecurityAuditEntry = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace("T", " ").replace(/\..+/, " UTC"),
    ...entry,
  };
  const updated = [newEntry, ...currentLogs];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }
  }
  return newEntry;
}

export function registerNewUser(data: {
  name: string;
  email: string;
  role?: UserRole;
  department?: import("@/types/userAdmin").Department;
  assignedPlants?: string[];
  mfaEnabled?: boolean;
}): { success: boolean; user?: UserRecord; message: string } {
  const users = loadUsersFromStorage();
  const normalizedEmail = data.email.trim().toLowerCase();

  // Check existing
  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return {
      success: false,
      message: "An engineering account with this email address already exists.",
    };
  }

  const role = data.role || "robotics_engineer";
  const newUser: UserRecord = {
    id: `USR-${(users.length + 1).toString().padStart(3, "0")}`,
    name: data.name.trim(),
    email: normalizedEmail,
    role: role,
    department: data.department || "Robotics & Mechatronics",
    status: "active",
    mfaEnabled: data.mfaEnabled ?? true,
    assignedPlants: data.assignedPlants && data.assignedPlants.length > 0 ? data.assignedPlants : [DEFAULT_PLANTS[0]],
    lastLogin: "Just now (Initial Session)",
    createdAt: new Date().toISOString().split("T")[0],
    permissions: {
      telemetryStream: true,
      motionControl: role === "super_admin" || role === "robotics_engineer",
      digitalTwinSimulation: role !== "plant_operator" && role !== "client_partner",
      rpaWorkflows: role !== "client_partner",
      userAdministration: role === "super_admin",
      auditLogsView: role === "super_admin" || role === "robotics_engineer",
      firmwareOTA: role === "super_admin" || role === "robotics_engineer",
    },
    notes: "Self-registered via INDUS Engineering Portal",
  };

  const updatedUsers = [newUser, ...users];
  saveUsersToStorage(updatedUsers);

  appendAuditLog({
    actor: newUser.name,
    action: "USER_REGISTRATION_COMPLETED",
    targetUser: newUser.name,
    ipAddress: "14.139.182.42 (Self-Registration)",
    facility: newUser.assignedPlants[0],
    severity: "info",
  });

  return {
    success: true,
    user: newUser,
    message: "Registration successful! Account provisioned with engineering credentials.",
  };
}

export function authenticateUser(
  email: string,
  _password?: string,
): { success: boolean; user?: UserRecord; token?: string; message: string } {
  const users = loadUsersFromStorage();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return {
      success: false,
      message: "No engineering account found with this email. Please check your credentials or register.",
    };
  }

  if (user.status === "suspended") {
    return {
      success: false,
      message: "This account is currently SUSPENDED. Please contact your system administrator.",
    };
  }

  // Update last login
  user.lastLogin = new Date().toISOString().replace("T", " ").replace(/\..+/, " UTC");
  const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
  saveUsersToStorage(updatedUsers);

  appendAuditLog({
    actor: user.name,
    action: "USER_LOGIN_SUCCESS",
    targetUser: user.name,
    ipAddress: "14.139.182.42 (Browser Session)",
    facility: user.assignedPlants[0] || "Global",
    severity: "info",
  });

  // Ephemeral simulated token
  const token = btoa(JSON.stringify({ email: user.email, role: user.role, time: Date.now() }));

  // Set active session
  setActiveUserSession(user);

  return {
    success: true,
    user,
    token,
    message: `Welcome back, ${user.name}! Authenticated as ${user.role.replace("_", " ").toUpperCase()}.`,
  };
}
