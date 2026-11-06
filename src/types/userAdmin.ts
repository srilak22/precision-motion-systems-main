export type UserRole =
  | "super_admin"
  | "robotics_engineer"
  | "plant_operator"
  | "process_analyst"
  | "client_partner";

export type UserStatus = "active" | "pending" | "suspended" | "inactive";

export type Department =
  | "Robotics & Mechatronics"
  | "Automation & Controls"
  | "Quality Assurance & Safety"
  | "Plant Operations"
  | "Executive Leadership"
  | "Client Solutions";

export interface UserPermissions {
  telemetryStream: boolean;
  motionControl: boolean;
  digitalTwinSimulation: boolean;
  rpaWorkflows: boolean;
  userAdministration: boolean;
  auditLogsView: boolean;
  firmwareOTA: boolean;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  status: UserStatus;
  mfaEnabled: boolean;
  assignedPlants: string[];
  lastLogin: string;
  createdAt: string;
  avatarUrl?: string;
  permissions: UserPermissions;
  notes?: string;
}

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  targetUser: string;
  ipAddress: string;
  facility: string;
  severity: "info" | "warning" | "critical";
}

export interface RbacRoleDefinition {
  role: UserRole;
  title: string;
  description: string;
  userCount: number;
  permissions: Record<keyof UserPermissions, boolean>;
}

export interface RedisSessionRecord {
  sessionId: string;
  userId: string;
  userName: string;
  email: string;
  role: UserRole;
  department: Department;
  clientIp: string;
  userAgent: string;
  facility: string;
  createdAt: string;
  lastActive: string;
  ttlSeconds: number;
  status: "active" | "idle" | "expired";
}

export interface RedisHealthStatus {
  connected: boolean;
  provider: "Redis Cloud" | "Self-Hosted Redis" | "Resilient In-Memory Redis Engine";
  endpoint: string;
  activeSessionsCount: number;
  totalMemoryBytes: number;
  pingLatencyMs: number;
  keyPrefix: string;
  lastSync: string;
}

