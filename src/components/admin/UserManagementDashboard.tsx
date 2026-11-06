import React, { useState, useEffect, useMemo } from "react";
import type {
  UserRecord,
  UserRole,
  UserStatus,
  Department,
  SecurityAuditEntry,
  RedisSessionRecord,
  RedisHealthStatus,
} from "@/types/userAdmin";
import {
  INITIAL_USERS,
  DEFAULT_PLANTS,
  RBAC_ROLE_DEFINITIONS,
  loadUsersFromStorage,
  saveUsersToStorage,
  loadAuditLogsFromStorage,
  appendAuditLog,
} from "@/data/mockUsersData";
import {
  getAllActiveRedisSessions,
  revokeSessionFromRedis,
  getRedisHealth,
  flushAllRedisSessions,
} from "@/lib/redisSession";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Building,
  Key,
  Lock,
  Mail,
  User,
  Settings,
  X,
  FileSpreadsheet,
  Cpu,
  Layers,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Database,
  Server,
  Activity,
  Zap,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROLE_BADGES: Record<
  UserRole,
  { label: string; bg: string; text: string; border: string }
> = {
  super_admin: {
    label: "Super Admin",
    bg: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
  },
  robotics_engineer: {
    label: "Robotics Engineer",
    bg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  plant_operator: {
    label: "Plant Operator",
    bg: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
  },
  process_analyst: {
    label: "Process Analyst",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    text: "text-emerald-800 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  client_partner: {
    label: "Client Partner",
    bg: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-700",
  },
};

const STATUS_BADGES: Record<
  UserStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  active: {
    label: "Active",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    icon: AlertTriangle,
  },
  suspended: {
    label: "Suspended",
    bg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    icon: ShieldAlert,
  },
  inactive: {
    label: "Inactive",
    bg: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    text: "text-gray-700 dark:text-gray-300",
    border: "border-gray-300 dark:border-gray-700",
    icon: XCircle,
  },
};

export function UserManagementDashboard({
  defaultTab = "directory",
}: {
  defaultTab?: "directory" | "rbac" | "audit" | "redis";
} = {}) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"directory" | "rbac" | "audit" | "redis">(defaultTab);

  // Redis Session Management State
  const [redisSessions, setRedisSessions] = useState<RedisSessionRecord[]>([]);
  const [redisHealth, setRedisHealth] = useState<RedisHealthStatus | null>(null);
  const [redisLoading, setRedisLoading] = useState(false);
  const [redisPingTesting, setRedisPingTesting] = useState(false);
  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null);

  // Local theme state for dashboard container (Clean Light vs Dark Tech)
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [inspectUser, setInspectUser] = useState<UserRecord | null>(null);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserRecord | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // New User Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("robotics_engineer");
  const [newDept, setNewDept] = useState<Department>("Robotics & Mechatronics");
  const [newPlants, setNewPlants] = useState<string[]>([DEFAULT_PLANTS[0]]);
  const [newMfa, setNewMfa] = useState(true);
  const [newNotes, setNewNotes] = useState("");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = () => {
    const loadedUsers = loadUsersFromStorage();
    const loadedAudit = loadAuditLogsFromStorage();
    setUsers(loadedUsers);
    setAuditLogs(loadedAudit);
  };

  const loadRedisData = async () => {
    try {
      setRedisLoading(true);
      const [sessions, health] = await Promise.all([
        getAllActiveRedisSessions(),
        getRedisHealth(),
      ]);
      setRedisSessions(sessions);
      setRedisHealth(health);
    } catch (err) {
      console.error("Failed to load Redis session data:", err);
    } finally {
      setRedisLoading(false);
    }
  };

  const handleRevokeRedisSession = async (sess: RedisSessionRecord) => {
    await revokeSessionFromRedis(sess.sessionId);
    appendAuditLog({
      actor: "Command Center Admin",
      action: "REDIS_SESSION_REVOKED",
      targetUser: `${sess.userName} (${sess.userId})`,
      ipAddress: sess.clientIp,
      facility: sess.facility,
      severity: "warning",
    });
    await loadRedisData();
    setAuditLogs(loadAuditLogsFromStorage());
    showToast(`Redis session [${sess.sessionId}] revoked from cluster.`);
  };

  const handleFlushRedis = async () => {
    if (
      !window.confirm(
        "Are you sure you want to flush all active Redis sessions? All connected operators across plants will be signed out."
      )
    ) {
      return;
    }
    await flushAllRedisSessions();
    appendAuditLog({
      actor: "Command Center Admin",
      action: "REDIS_STORE_FLUSHED",
      targetUser: "ALL_ACTIVE_SESSIONS",
      ipAddress: "14.139.182.42 (Admin Console)",
      facility: "Global Redis Cluster",
      severity: "critical",
    });
    await loadRedisData();
    setAuditLogs(loadAuditLogsFromStorage());
    showToast("All active Redis sessions have been flushed.", "warning");
  };

  const handleTestRedisPing = async () => {
    setRedisPingTesting(true);
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 140));
    const latency = Math.round((performance.now() - start) * 10) / 10;
    setRedisPingTesting(false);
    showToast(`Redis Cloud PONG received in ${latency}ms (Host: stylish-inspired-turbosmart-23109.db.redis.io)`);
  };

  const handleCopySessionKey = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`indus:session:${id}`);
      setCopiedSessionId(id);
      setTimeout(() => setCopiedSessionId(null), 2000);
      showToast(`Copied key: indus:session:${id}`);
    }
  };

  useEffect(() => {
    loadData();
    loadRedisData();
    // Check saved theme
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("indus_admin_theme") as "light" | "dark" | null;
      if (savedTheme) setThemeMode(savedTheme);

      const handleRedisChange = () => {
        loadRedisData();
      };
      window.addEventListener("indus:redis-session-change", handleRedisChange);
      return () => {
        window.removeEventListener("indus:redis-session-change", handleRedisChange);
      };
    }
  }, []);

  const toggleTheme = () => {
    const next = themeMode === "light" ? "dark" : "light";
    setThemeMode(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("indus_admin_theme", next);
    }
  };

  // Sync users state with localStorage
  const updateUsers = (newUsers: UserRecord[]) => {
    setUsers(newUsers);
    saveUsersToStorage(newUsers);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "active").length;
    const pending = users.filter((u) => u.status === "pending").length;
    const suspended = users.filter((u) => u.status === "suspended").length;
    const mfaEnforced = users.filter((u) => u.mfaEnabled).length;
    const mfaRate = total > 0 ? Math.round((mfaEnforced / total) * 100) : 0;
    const engineers = users.filter((u) => u.role === "robotics_engineer" || u.role === "super_admin").length;

    return { total, active, pending, suspended, mfaRate, engineers };
  }, [users]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(query);
        const matchesEmail = u.email.toLowerCase().includes(query);
        const matchesId = u.id.toLowerCase().includes(query);
        const matchesDept = u.department.toLowerCase().includes(query);
        const matchesPlant = u.assignedPlants.some((p) => p.toLowerCase().includes(query));
        if (!matchesName && !matchesEmail && !matchesId && !matchesDept && !matchesPlant) {
          return false;
        }
      }

      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (deptFilter !== "all" && u.department !== deptFilter) return false;

      return true;
    });
  }, [users, searchQuery, roleFilter, statusFilter, deptFilter]);

  // Handlers
  const handleToggleStatus = (user: UserRecord) => {
    const nextStatus: UserStatus = user.status === "active" ? "suspended" : "active";
    const updated = users.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u));
    updateUsers(updated);

    appendAuditLog({
      actor: "Command Center Admin",
      action: nextStatus === "active" ? "USER_ACCOUNT_ACTIVATED" : "USER_ACCOUNT_SUSPENDED",
      targetUser: user.name,
      ipAddress: "14.139.182.42 (Admin Console)",
      facility: user.assignedPlants[0] || "Global",
      severity: nextStatus === "active" ? "info" : "warning",
    });
    setAuditLogs(loadAuditLogsFromStorage());
    showToast(`User ${user.name} status updated to ${nextStatus.toUpperCase()}`);
  };

  const handleDeleteUser = (user: UserRecord) => {
    const updated = users.filter((u) => u.id !== user.id);
    updateUsers(updated);

    appendAuditLog({
      actor: "Command Center Admin",
      action: "USER_ACCOUNT_DECOMMISSIONED",
      targetUser: user.name,
      ipAddress: "14.139.182.42 (Admin Console)",
      facility: user.assignedPlants[0] || "Global",
      severity: "warning",
    });
    setAuditLogs(loadAuditLogsFromStorage());
    setDeleteConfirmUser(null);
    showToast(`User ${user.name} removed successfully.`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast("Please provide both name and email", "error");
      return;
    }

    const newUser: UserRecord = {
      id: `USR-${(users.length + 1).toString().padStart(3, "0")}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      department: newDept,
      status: "active",
      mfaEnabled: newMfa,
      assignedPlants: newPlants.length > 0 ? newPlants : [DEFAULT_PLANTS[0]],
      lastLogin: "Never (Newly Provisioned)",
      createdAt: new Date().toISOString().split("T")[0],
      permissions: {
        telemetryStream: true,
        motionControl: newRole === "super_admin" || newRole === "robotics_engineer",
        digitalTwinSimulation: newRole !== "plant_operator" && newRole !== "client_partner",
        rpaWorkflows: newRole !== "client_partner",
        userAdministration: newRole === "super_admin",
        auditLogsView: newRole === "super_admin" || newRole === "robotics_engineer",
        firmwareOTA: newRole === "super_admin" || newRole === "robotics_engineer",
      },
      notes: newNotes.trim() || "Provisioned via User Administration Console",
    };

    updateUsers([newUser, ...users]);

    appendAuditLog({
      actor: "Command Center Admin",
      action: "USER_PROVISIONED",
      targetUser: newUser.name,
      ipAddress: "14.139.182.42 (Admin Console)",
      facility: newUser.assignedPlants[0],
      severity: "info",
    });
    setAuditLogs(loadAuditLogsFromStorage());

    setShowAddModal(false);
    setNewName("");
    setNewEmail("");
    setNewNotes("");
    showToast(`New user ${newUser.name} created successfully.`);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    const updated = users.map((u) => (u.id === editUser.id ? editUser : u));
    updateUsers(updated);

    appendAuditLog({
      actor: "Command Center Admin",
      action: "USER_ROLE_PROFILE_UPDATED",
      targetUser: editUser.name,
      ipAddress: "14.139.182.42 (Admin Console)",
      facility: editUser.assignedPlants[0] || "Global",
      severity: "info",
    });
    setAuditLogs(loadAuditLogsFromStorage());

    setEditUser(null);
    showToast(`Updated profile for ${editUser.name}.`);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Role", "Department", "Status", "MFA", "Assigned Plants", "Last Login"];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      `"${u.email}"`,
      u.role,
      `"${u.department}"`,
      u.status,
      u.mfaEnabled ? "Enabled" : "Disabled",
      `"${u.assignedPlants.join("; ")}"`,
      `"${u.lastLogin}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `indus_users_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("User directory exported to CSV.");
  };

  // Determine dynamic classes based on themeMode
  const isDark = themeMode === "dark";
  const containerClass = isDark
    ? "bg-[#0B1320] text-slate-100 border-slate-800"
    : "bg-white text-slate-900 border-slate-200";
  const cardClass = isDark
    ? "bg-slate-900/90 border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-slate-900 shadow-sm";
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-500";
  const inputClass = isDark
    ? "bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500"
    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400";
  const tableHeadClass = isDark
    ? "bg-slate-950/80 border-slate-800 text-slate-400"
    : "bg-slate-50 border-slate-200 text-slate-600 font-semibold";
  const tableRowHoverClass = isDark
    ? "hover:bg-slate-800/40 border-slate-800/60"
    : "hover:bg-slate-50/80 border-slate-200/80";

  return (
    <div className={`w-full rounded-2xl p-6 transition-colors duration-200 ${containerClass} border shadow-xl space-y-6`}>
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-mono shadow-2xl backdrop-blur-md transition-all ${
            notification.type === "success"
              ? "bg-emerald-950 border-emerald-500/50 text-emerald-200"
              : "bg-rose-950 border-rose-500/50 text-rose-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="size-4 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header & Theme Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5 border-inherit">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Users className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Industrial User & Access Administration
              </h2>
              <p className={`text-xs ${mutedTextClass} font-mono mt-0.5`}>
                RBAC Access Governance &bull; Multi-Plant Personnel &bull; FIDO2 MFA Compliance
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
              isDark
                ? "bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title="Toggle Dashboard Theme"
          >
            {isDark ? (
              <>
                <Sun size={14} className="text-amber-400" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <Moon size={14} className="text-blue-600" />
                <span>Dark Theme</span>
              </>
            )}
          </button>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className={`font-mono text-xs uppercase border ${
              isDark
                ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Download size={13} className="mr-1.5" />
            Export CSV
          </Button>

          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs uppercase font-bold shadow-md shadow-blue-500/20"
          >
            <UserPlus size={13} className="mr-1.5" />
            Provision User
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className={`border rounded-xl p-5 ${cardClass}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono text-xs uppercase tracking-wider ${mutedTextClass}`}>Total Users</span>
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight">{metrics.total}</div>
          <div className="mt-2 text-xs flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{metrics.active}</span>
            <span className={mutedTextClass}>active accounts</span>
          </div>
        </div>

        {/* Certified Engineers */}
        <div className={`border rounded-xl p-5 ${cardClass}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono text-xs uppercase tracking-wider ${mutedTextClass}`}>Robotics Engineers</span>
            <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Cpu className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight">{metrics.engineers}</div>
          <div className={`mt-2 text-xs ${mutedTextClass}`}>Certified kinematics control access</div>
        </div>

        {/* MFA Compliance */}
        <div className={`border rounded-xl p-5 ${cardClass}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono text-xs uppercase tracking-wider ${mutedTextClass}`}>MFA Compliance</span>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {metrics.mfaRate}%
          </div>
          <div className={`mt-2 text-xs ${mutedTextClass}`}>FIDO2 & TOTP hardware verified</div>
        </div>

        {/* Pending Approvals */}
        <div className={`border rounded-xl p-5 ${cardClass}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono text-xs uppercase tracking-wider ${mutedTextClass}`}>Pending Access</span>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {metrics.pending}
          </div>
          <div className={`mt-2 text-xs ${mutedTextClass}`}>Awaiting director sign-off</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-inherit pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("directory")}
          className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === "directory"
              ? "bg-blue-600 text-white shadow-sm"
              : isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Users size={14} />
          User Directory ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("rbac")}
          className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === "rbac"
              ? "bg-blue-600 text-white shadow-sm"
              : isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Key size={14} />
          RBAC Access Matrix
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === "audit"
              ? "bg-blue-600 text-white shadow-sm"
              : isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Shield size={14} />
          Security Audit Trail ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab("redis")}
          className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
            activeTab === "redis"
              ? "bg-blue-600 text-white shadow-sm"
              : isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Database size={14} className={activeTab === "redis" ? "text-amber-300" : "text-amber-500"} />
          Redis Session Store ({redisSessions.length})
        </button>
      </div>

      {/* TAB 1: USER DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border ${cardClass}`}>
            <div className="relative md:col-span-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${mutedTextClass}`} />
              <input
                placeholder="Search name, email, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-10 pl-9 pr-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
              />
            </div>

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className={`w-full h-10 rounded-lg border px-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
              >
                <option value="all">All Roles (Any)</option>
                <option value="super_admin">Super Admin</option>
                <option value="robotics_engineer">Robotics Engineer</option>
                <option value="plant_operator">Plant Operator</option>
                <option value="process_analyst">Process Analyst</option>
                <option value="client_partner">Client Partner</option>
              </select>
            </div>

            <div>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className={`w-full h-10 rounded-lg border px-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
              >
                <option value="all">All Departments (Any)</option>
                <option value="Executive Leadership">Executive Leadership</option>
                <option value="Robotics & Mechatronics">Robotics & Mechatronics</option>
                <option value="Automation & Controls">Automation & Controls</option>
                <option value="Plant Operations">Plant Operations</option>
                <option value="Quality Assurance & Safety">Quality Assurance & Safety</option>
                <option value="Client Solutions">Client Solutions</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full h-10 rounded-lg border px-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
              >
                <option value="all">All Statuses (Any)</option>
                <option value="active">Active</option>
                <option value="pending">Pending Approval</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className={`overflow-x-auto rounded-xl border ${cardClass}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${tableHeadClass}`}>
                  <th className="py-3.5 px-4">User Profile</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Facilities</th>
                  <th className="py-3.5 px-4">Security / MFA</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={`py-12 text-center font-mono text-xs ${mutedTextClass}`}>
                      No users match the selected query and filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const roleBadge = ROLE_BADGES[user.role];
                    const statusBadge = STATUS_BADGES[user.status];
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr key={user.id} className={`transition-colors border-b ${tableRowHoverClass}`}>
                        {/* User Identity */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                            </div>
                            <div>
                              <div className="font-semibold text-inherit hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                                <span>{user.name}</span>
                                <span className={`font-mono text-[10px] ${mutedTextClass}`}>{user.id}</span>
                              </div>
                              <div className={`text-xs font-mono ${mutedTextClass}`}>{user.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border ${roleBadge.bg}`}
                          >
                            {roleBadge.label}
                          </span>
                        </td>

                        {/* Department */}
                        <td className={`py-4 px-4 font-mono text-xs ${mutedTextClass}`}>
                          {user.department}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border ${statusBadge.bg}`}
                          >
                            <StatusIcon size={13} />
                            {statusBadge.label}
                          </span>
                        </td>

                        {/* Facilities */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {user.assignedPlants.map((plant, idx) => (
                              <span
                                key={idx}
                                className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded border ${
                                  isDark
                                    ? "bg-slate-800 border-slate-700 text-slate-300"
                                    : "bg-slate-100 border-slate-200 text-slate-700"
                                }`}
                              >
                                {plant.replace("Gigafactory", "GF").replace("Robotics Assembly Plant", "Plant")}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Security / MFA */}
                        <td className="py-4 px-4">
                          {user.mfaEnabled ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                              <ShieldCheck size={14} />
                              Hardware MFA
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-amber-600 dark:text-amber-400">
                              <AlertTriangle size={14} />
                              Unprotected
                            </span>
                          )}
                        </td>

                        {/* Last Login */}
                        <td className={`py-4 px-4 font-mono text-[11px] ${mutedTextClass}`}>
                          {user.lastLogin}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setInspectUser(user)}
                              title="Inspect User Details"
                              className={`p-2 rounded-lg transition-colors ${
                                isDark
                                  ? "hover:bg-slate-800 text-slate-400 hover:text-blue-400"
                                  : "hover:bg-slate-100 text-slate-500 hover:text-blue-600"
                              }`}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => setEditUser({ ...user })}
                              title="Edit Credentials & Roles"
                              className={`p-2 rounded-lg transition-colors ${
                                isDark
                                  ? "hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
                                  : "hover:bg-slate-100 text-slate-500 hover:text-cyan-600"
                              }`}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              title={user.status === "active" ? "Suspend Account" : "Activate Account"}
                              className={`p-2 rounded-lg transition-colors ${
                                user.status === "active"
                                  ? "hover:bg-amber-500/10 text-slate-400 hover:text-amber-500"
                                  : "hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500"
                              }`}
                            >
                              <Shield size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmUser(user)}
                              title="Decommission User"
                              className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC ACCESS MATRIX */}
      {activeTab === "rbac" && (
        <div className="space-y-4">
          <div className={`p-5 rounded-xl border ${cardClass}`}>
            <h3 className="text-base font-bold uppercase tracking-tight mb-1">
              Role-Based Access Control (RBAC) Governance Matrix
            </h3>
            <p className={`text-xs ${mutedTextClass} leading-relaxed`}>
              Granular permission matrix enforced across INDUS telemetry brokers, digital twin models, physical actuator control, and user administration.
            </p>
          </div>

          <div className={`overflow-x-auto rounded-xl border ${cardClass}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${tableHeadClass}`}>
                  <th className="py-3.5 px-4">Role Definition</th>
                  <th className="py-3.5 px-4 text-center">Telemetry Stream</th>
                  <th className="py-3.5 px-4 text-center">Motion Control</th>
                  <th className="py-3.5 px-4 text-center">Digital Twin Sim</th>
                  <th className="py-3.5 px-4 text-center">RPA Workflows</th>
                  <th className="py-3.5 px-4 text-center">User Admin</th>
                  <th className="py-3.5 px-4 text-center">Audit Logs</th>
                  <th className="py-3.5 px-4 text-center">Firmware OTA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit text-xs font-mono">
                {RBAC_ROLE_DEFINITIONS.map((def) => {
                  const badge = ROLE_BADGES[def.role];
                  return (
                    <tr key={def.role} className={`transition-colors border-b ${tableRowHoverClass}`}>
                      <td className="py-4 px-4 font-sans">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border ${badge.bg}`}
                          >
                            {def.title}
                          </span>
                          <span className={`text-[10px] font-mono ${mutedTextClass}`}>
                            ({def.userCount} active users)
                          </span>
                        </div>
                        <p className={`text-xs ${mutedTextClass} max-w-sm`}>{def.description}</p>
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.telemetryStream ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">GRANTED</span>
                        ) : (
                          <span className={`${mutedTextClass} font-bold opacity-40`}>RESTRICTED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.motionControl ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">FULL R/W</span>
                        ) : (
                          <span className={`${mutedTextClass} font-bold opacity-40`}>RESTRICTED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.digitalTwinSimulation ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">INTERACTIVE</span>
                        ) : (
                          <span className={`${mutedTextClass} font-bold opacity-40`}>RESTRICTED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.rpaWorkflows ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">EXECUTE</span>
                        ) : (
                          <span className={`${mutedTextClass} font-bold opacity-40`}>RESTRICTED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.userAdministration ? (
                          <span className="text-purple-600 dark:text-purple-400 font-bold">SUPER ADMIN</span>
                        ) : (
                          <span className={`${mutedTextClass} font-bold opacity-40`}>DENIED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.auditLogsView ? (
                          <span className="text-blue-600 dark:text-blue-400 font-bold">AUDITOR</span>
                        ) : (
                          <span className={`${mutedTextClass} font-bold opacity-40`}>DENIED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.firmwareOTA ? (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">CERTIFIED</span>
                        ) : (
                          <span className={`${mutedTextClass} font-bold opacity-40`}>DENIED</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY AUDIT TRAIL */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-4 rounded-xl border ${cardClass}`}>
            <div>
              <h3 className="text-base font-bold uppercase tracking-tight mb-0.5">
                Cryptographic Security & Access Event Stream
              </h3>
              <p className={`text-xs ${mutedTextClass}`}>
                Immutable audit ledger recording privilege alterations, login events, and facility allocations.
              </p>
            </div>
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className={`font-mono text-xs uppercase border ${
                isDark
                  ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <RefreshCw size={12} className="mr-1.5" />
              Sync Ledger
            </Button>
          </div>

          <div className={`overflow-x-auto rounded-xl border ${cardClass}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${tableHeadClass}`}>
                  <th className="py-3.5 px-4">Event ID</th>
                  <th className="py-3.5 px-4">Timestamp (UTC)</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Target User</th>
                  <th className="py-3.5 px-4">Facility / Node</th>
                  <th className="py-3.5 px-4">Source IP</th>
                  <th className="py-3.5 px-4 text-center">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit text-xs font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className={`transition-colors border-b ${tableRowHoverClass}`}>
                    <td className="py-3.5 px-4 text-blue-600 dark:text-blue-400 font-bold">{log.id}</td>
                    <td className={`py-3.5 px-4 ${mutedTextClass}`}>{log.timestamp}</td>
                    <td className="py-3.5 px-4 font-sans font-semibold text-inherit">{log.actor}</td>
                    <td className="py-3.5 px-4 text-amber-600 dark:text-amber-400 font-semibold">{log.action}</td>
                    <td className="py-3.5 px-4 font-sans text-inherit">{log.targetUser}</td>
                    <td className={`py-3.5 px-4 ${mutedTextClass}`}>{log.facility}</td>
                    <td className={`py-3.5 px-4 ${mutedTextClass}`}>{log.ipAddress}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          log.severity === "critical"
                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                            : log.severity === "warning"
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REDIS DISTRIBUTED USER SESSION STORE */}
      {activeTab === "redis" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Redis Cluster Status Banner */}
          <div className={`p-5 rounded-xl border ${cardClass}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Database className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
                      Redis Distributed User Session Store
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        LIVE RESP3
                      </span>
                    </h3>
                    <p className={`text-xs ${mutedTextClass} font-mono mt-0.5`}>
                      In-Memory Key-Value Store &bull; Key Prefix: <code className="text-blue-500">indus:session:*</code> &bull; 24h Expiration Policy (TTL: 86,400s)
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={handleTestRedisPing}
                  disabled={redisPingTesting}
                  variant="outline"
                  size="sm"
                  className={`font-mono text-xs uppercase border ${
                    isDark
                      ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Zap size={13} className={`mr-1.5 text-amber-500 ${redisPingTesting ? "animate-spin" : ""}`} />
                  {redisPingTesting ? "Pinging..." : "Test Redis Ping"}
                </Button>

                <Button
                  onClick={loadRedisData}
                  disabled={redisLoading}
                  variant="outline"
                  size="sm"
                  className={`font-mono text-xs uppercase border ${
                    isDark
                      ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <RefreshCw size={13} className={`mr-1.5 text-blue-500 ${redisLoading ? "animate-spin" : ""}`} />
                  Refresh Keys
                </Button>

                <Button
                  onClick={handleFlushRedis}
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs uppercase border border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40"
                >
                  <Trash2 size={13} className="mr-1.5 text-rose-500" />
                  Flush All Sessions
                </Button>
              </div>
            </div>

            {/* Health & Infrastructure Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-inherit text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-500/5 border border-inherit">
                <span className={mutedTextClass}>REDIS CLOUD HOST</span>
                <div className="font-bold text-inherit truncate mt-1 text-[11px]" title="stylish-inspired-turbosmart-23109.db.redis.io:10886">
                  stylish-inspired-turbosmart...:10886
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 size={11} /> TLS 1.3 Encrypted
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-500/5 border border-inherit">
                <span className={mutedTextClass}>ACTIVE SESSIONS</span>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {redisSessions.length} keys
                </div>
                <div className={`text-[10px] ${mutedTextClass} mt-0.5`}>
                  All verified operators
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-500/5 border border-inherit">
                <span className={mutedTextClass}>RESP3 PING LATENCY</span>
                <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {redisHealth?.pingLatencyMs ?? 14.2} ms
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Sub-millisecond write cache
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-500/5 border border-inherit">
                <span className={mutedTextClass}>FAILOVER ENGINE</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <Server size={12} /> Resilient Cloud KV
                </div>
                <div className={`text-[10px] ${mutedTextClass} mt-0.5`}>
                  Zero-Downtime Session Sync
                </div>
              </div>
            </div>
          </div>

          {/* Active Redis Sessions Table */}
          <div className={`overflow-x-auto rounded-xl border ${cardClass}`}>
            <div className="p-4 border-b border-inherit flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-tight flex items-center gap-2">
                  <Activity size={15} className="text-blue-500" />
                  Active Redis Session Registry ({redisSessions.length})
                </h4>
                <p className={`text-xs ${mutedTextClass} font-mono mt-0.5`}>
                  Direct inspection of in-flight sessions stored in Redis with remaining TTL.
                </p>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Pattern: indus:session:*
              </span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${tableHeadClass}`}>
                  <th className="py-3.5 px-4">Redis Key / Session ID</th>
                  <th className="py-3.5 px-4">User Identity</th>
                  <th className="py-3.5 px-4">Role & Dept</th>
                  <th className="py-3.5 px-4">Facility & Origin</th>
                  <th className="py-3.5 px-4">Created (UTC)</th>
                  <th className="py-3.5 px-4">TTL Countdown</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Revocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit text-xs font-mono">
                {redisSessions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      No active sessions stored in Redis. Log in to create a new session.
                    </td>
                  </tr>
                ) : (
                  redisSessions.map((sess) => {
                    const ttlPercentage = Math.round((sess.ttlSeconds / 86400) * 100);
                    const hoursRemaining = Math.floor(sess.ttlSeconds / 3600);
                    const minsRemaining = Math.floor((sess.ttlSeconds % 3600) / 60);

                    return (
                      <tr key={sess.sessionId} className={`transition-colors border-b ${tableRowHoverClass}`}>
                        {/* Session ID & Key */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-blue-600 dark:text-blue-400 font-bold font-mono text-[11px]">
                              indus:session:{sess.sessionId}
                            </span>
                            <button
                              onClick={() => handleCopySessionKey(sess.sessionId)}
                              title="Copy Redis Key"
                              className="p-1 rounded text-slate-400 hover:text-inherit hover:bg-slate-500/10 transition-colors"
                            >
                              <Copy size={12} className={copiedSessionId === sess.sessionId ? "text-emerald-500" : ""} />
                            </button>
                          </div>
                          <span className={`text-[10px] ${mutedTextClass} block mt-0.5`}>
                            Session ID: {sess.sessionId}
                          </span>
                        </td>

                        {/* User Identity */}
                        <td className="py-3.5 px-4">
                          <div className="font-sans font-semibold text-inherit">{sess.userName}</div>
                          <div className={`text-[10px] ${mutedTextClass}`}>{sess.email}</div>
                        </td>

                        {/* Role & Dept */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                              ROLE_BADGES[sess.role]?.bg || "bg-slate-100 text-slate-700 border-slate-300"
                            }`}
                          >
                            {ROLE_BADGES[sess.role]?.label || sess.role}
                          </span>
                          <span className={`text-[10px] ${mutedTextClass} block mt-0.5`}>
                            {sess.department}
                          </span>
                        </td>

                        {/* Facility & Origin */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-inherit">{sess.facility}</div>
                          <div className={`text-[10px] ${mutedTextClass} truncate max-w-[140px]`} title={sess.clientIp}>
                            IP: {sess.clientIp}
                          </div>
                        </td>

                        {/* Created At */}
                        <td className={`py-3.5 px-4 ${mutedTextClass} text-[11px]`}>
                          {sess.createdAt}
                        </td>

                        {/* TTL Countdown */}
                        <td className="py-3.5 px-4 min-w-[140px]">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              {hoursRemaining}h {minsRemaining}m left
                            </span>
                            <span className={mutedTextClass}>{sess.ttlSeconds}s</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${Math.min(100, Math.max(5, ttlPercentage))}%` }}
                            ></div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                            <span className="size-1.5 rounded-full bg-emerald-500"></span>
                            ACTIVE
                          </span>
                        </td>

                        {/* Revocation */}
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            onClick={() => handleRevokeRedisSession(sess)}
                            variant="outline"
                            size="sm"
                            className="h-7 px-2.5 text-[10px] font-mono uppercase text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 size={11} className="mr-1 text-rose-500" />
                            Revoke
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Redis Technical Specs Card */}
          <div className={`p-5 rounded-xl border ${cardClass}`}>
            <h4 className="font-bold text-sm uppercase tracking-tight mb-2 flex items-center gap-2">
              <Key size={14} className="text-amber-500" />
              Redis Integration & Security Architecture
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold uppercase text-[11px]">
                  01. Key-Value Storage Schema
                </span>
                <p className={`${mutedTextClass} leading-relaxed`}>
                  All user sessions are saved with key structure <code className="text-blue-500">indus:session:[sessionId]</code>. Values are JSON serialized user identity, plant permissions, MFA validation status, and client metadata.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold uppercase text-[11px]">
                  02. 24-Hour Sliding TTL
                </span>
                <p className={`${mutedTextClass} leading-relaxed`}>
                  Sessions enforce an automatic 86,400-second (24-hour) expiration using Redis native <code className="text-blue-500">EXPIRE</code>. Idle robot control sessions automatically evict to safeguard kinematics command safety.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold uppercase text-[11px]">
                  03. Connect-Redis Integration
                </span>
                <p className={`${mutedTextClass} leading-relaxed`}>
                  Compatible with the backend <code className="text-blue-500">connect-redis@10.0.0</code> and <code className="text-blue-500">express-session</code> pipeline configured with HTTP-only cookies and TLS 1.3 socket security.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / PROVISION USER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-5 ${cardClass}`}>
            <div className="flex items-center justify-between border-b pb-4 border-inherit">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">
                    Provision Industrial User
                  </h3>
                  <p className={`text-xs ${mutedTextClass}`}>Add robotics engineer or plant operator</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-1 rounded-lg ${mutedTextClass} hover:text-inherit`}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1`}>
                  Full Name *
                </label>
                <input
                  required
                  placeholder="e.g. Maya Lin"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1`}>
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="m.lin@indusrobotics.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1`}>
                    System Role *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
                  >
                    <option value="robotics_engineer">Robotics Engineer</option>
                    <option value="plant_operator">Plant Operator</option>
                    <option value="process_analyst">Process Analyst</option>
                    <option value="client_partner">Client Partner</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1`}>
                    Department *
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value as Department)}
                    className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
                  >
                    <option value="Robotics & Mechatronics">Robotics & Mechatronics</option>
                    <option value="Automation & Controls">Automation & Controls</option>
                    <option value="Plant Operations">Plant Operations</option>
                    <option value="Quality Assurance & Safety">Quality Assurance & Safety</option>
                    <option value="Executive Leadership">Executive Leadership</option>
                    <option value="Client Solutions">Client Solutions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1.5`}>
                  Assigned Facility / Plant
                </label>
                <div className={`space-y-1.5 max-h-32 overflow-y-auto border p-3 rounded-lg ${cardClass}`}>
                  {DEFAULT_PLANTS.map((plant) => (
                    <label key={plant} className={`flex items-center gap-2 text-xs font-mono cursor-pointer hover:text-blue-500 ${mutedTextClass}`}>
                      <input
                        type="checkbox"
                        checked={newPlants.includes(plant)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewPlants([...newPlants, plant]);
                          } else {
                            setNewPlants(newPlants.filter((p) => p !== plant));
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0"
                      />
                      <span>{plant}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="new-mfa"
                  checked={newMfa}
                  onChange={(e) => setNewMfa(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <label htmlFor="new-mfa" className={`text-xs font-mono cursor-pointer ${mutedTextClass}`}>
                  Require Hardware / TOTP Multi-Factor Authentication (MFA)
                </label>
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1`}>
                  Admin Notes
                </label>
                <input
                  placeholder="e.g. Assigned to Delta Cell Calibration line"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-inherit">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="font-mono text-xs uppercase"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs uppercase font-bold"
                >
                  Confirm Provisioning
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INSPECT USER DRAWER */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl space-y-5 ${cardClass}`}>
            <div className="flex items-center justify-between border-b pb-4 border-inherit">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono font-bold text-sm flex items-center justify-center">
                  {inspectUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">
                    {inspectUser.name}
                  </h3>
                  <p className={`text-xs font-mono text-blue-600 dark:text-blue-400`}>{inspectUser.id} &bull; {inspectUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectUser(null)}
                className={`p-1 rounded-lg ${mutedTextClass} hover:text-inherit`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className={`p-3 rounded-lg border ${cardClass}`}>
                <span className={`block text-[10px] uppercase ${mutedTextClass}`}>Role</span>
                <span className="font-bold text-inherit">{ROLE_BADGES[inspectUser.role].label}</span>
              </div>
              <div className={`p-3 rounded-lg border ${cardClass}`}>
                <span className={`block text-[10px] uppercase ${mutedTextClass}`}>Department</span>
                <span className="font-bold text-inherit">{inspectUser.department}</span>
              </div>
              <div className={`p-3 rounded-lg border ${cardClass}`}>
                <span className={`block text-[10px] uppercase ${mutedTextClass}`}>Account Status</span>
                <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">{inspectUser.status}</span>
              </div>
              <div className={`p-3 rounded-lg border ${cardClass}`}>
                <span className={`block text-[10px] uppercase ${mutedTextClass}`}>MFA Status</span>
                <span className={inspectUser.mfaEnabled ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-amber-600 dark:text-amber-400 font-bold"}>
                  {inspectUser.mfaEnabled ? "Enforced (Hardware Key)" : "Not Configured"}
                </span>
              </div>
            </div>

            <div>
              <span className={`text-xs font-mono uppercase block mb-1.5 ${mutedTextClass}`}>
                Assigned Robotics Facilities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inspectUser.assignedPlants.map((plant, idx) => (
                  <span
                    key={idx}
                    className={`text-xs font-mono px-2.5 py-1 rounded-md border ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-300"
                        : "bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    {plant}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className={`text-xs font-mono uppercase block mb-1.5 ${mutedTextClass}`}>
                Granular Permissions
              </span>
              <div className={`grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-lg border ${cardClass}`}>
                {Object.entries(inspectUser.permissions).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-0.5">
                    <span className={mutedTextClass}>{key}</span>
                    <span className={val ? "text-emerald-600 dark:text-emerald-400 font-bold" : `${mutedTextClass} opacity-40 font-bold`}>
                      {val ? "ALLOW" : "DENY"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {inspectUser.notes && (
              <div className="border-t pt-3 border-inherit">
                <span className={`text-[10px] font-mono uppercase block mb-1 ${mutedTextClass}`}>
                  Operator Notes
                </span>
                <p className={`text-xs ${mutedTextClass}`}>{inspectUser.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-inherit">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const target = inspectUser;
                  setInspectUser(null);
                  setEditUser({ ...target });
                }}
                className="font-mono text-xs uppercase"
              >
                <Edit2 size={13} className="mr-1.5" />
                Edit User
              </Button>
              <Button
                size="sm"
                onClick={() => setInspectUser(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs uppercase font-bold"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT USER MODAL */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-5 ${cardClass}`}>
            <div className="flex items-center justify-between border-b pb-4 border-inherit">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Edit2 size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">
                    Modify User Profile
                  </h3>
                  <p className={`text-xs font-mono ${mutedTextClass}`}>{editUser.id} &bull; {editUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditUser(null)}
                className={`p-1 rounded-lg ${mutedTextClass} hover:text-inherit`}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1`}>
                  Full Name
                </label>
                <input
                  required
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1`}>
                    System Role
                  </label>
                  <select
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value as UserRole })}
                    className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="robotics_engineer">Robotics Engineer</option>
                    <option value="plant_operator">Plant Operator</option>
                    <option value="process_analyst">Process Analyst</option>
                    <option value="client_partner">Client Partner</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1`}>
                    Status
                  </label>
                  <select
                    value={editUser.status}
                    onChange={(e) => setEditUser({ ...editUser, status: e.target.value as UserStatus })}
                    className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1`}>
                  Department
                </label>
                <select
                  value={editUser.department}
                  onChange={(e) => setEditUser({ ...editUser, department: e.target.value as Department })}
                  className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
                >
                  <option value="Robotics & Mechatronics">Robotics & Mechatronics</option>
                  <option value="Automation & Controls">Automation & Controls</option>
                  <option value="Plant Operations">Plant Operations</option>
                  <option value="Quality Assurance & Safety">Quality Assurance & Safety</option>
                  <option value="Executive Leadership">Executive Leadership</option>
                  <option value="Client Solutions">Client Solutions</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-mfa"
                  checked={editUser.mfaEnabled}
                  onChange={(e) => setEditUser({ ...editUser, mfaEnabled: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <label htmlFor="edit-mfa" className={`text-xs font-mono cursor-pointer ${mutedTextClass}`}>
                  MFA Hardware Key / Authenticator Enforced
                </label>
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase ${mutedTextClass} mb-1`}>
                  Notes
                </label>
                <input
                  value={editUser.notes || ""}
                  onChange={(e) => setEditUser({ ...editUser, notes: e.target.value })}
                  className={`w-full h-10 px-3 rounded-lg border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${inputClass}`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-inherit">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditUser(null)}
                  className="font-mono text-xs uppercase"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs uppercase font-bold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-md rounded-2xl border border-rose-500/40 p-6 shadow-2xl space-y-4 ${cardClass}`}>
            <div className="flex items-center gap-3 text-rose-500">
              <ShieldAlert size={24} />
              <h3 className="text-lg font-bold tracking-tight">
                Decommission User Account
              </h3>
            </div>
            <p className={`text-xs ${mutedTextClass} leading-relaxed`}>
              Are you sure you want to decommission account{" "}
              <strong className="text-inherit font-semibold">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})?
              All cryptographic sessions and physical robotics telemetry access will be immediately terminated.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-inherit">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmUser(null)}
                className="font-mono text-xs uppercase"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleDeleteUser(deleteConfirmUser)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs uppercase font-bold"
              >
                Confirm Decommission
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
