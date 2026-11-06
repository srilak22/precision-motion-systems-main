import React, { useState, useEffect, useMemo } from "react";
import type {
  UserRecord,
  UserRole,
  UserStatus,
  Department,
  SecurityAuditEntry,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROLE_BADGES: Record<
  UserRole,
  { label: string; bg: string; text: string; border: string }
> = {
  super_admin: {
    label: "Super Admin",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  robotics_engineer: {
    label: "Robotics Engineer",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  plant_operator: {
    label: "Plant Operator",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  process_analyst: {
    label: "Process Analyst",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  client_partner: {
    label: "Client Partner",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
  },
};

const STATUS_BADGES: Record<
  UserStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  active: {
    label: "Active",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: AlertTriangle,
  },
  suspended: {
    label: "Suspended",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    icon: ShieldAlert,
  },
  inactive: {
    label: "Inactive",
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    border: "border-gray-500/30",
    icon: XCircle,
  },
};

export function UserManagementDashboard() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"directory" | "rbac" | "audit">("directory");

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

  useEffect(() => {
    loadData();
  }, []);

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
    showToast(`User ${user.name} is now ${nextStatus.toUpperCase()}`);
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
    showToast(`Updated credentials for ${editUser.name}.`);
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

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `indus_users_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("User directory exported to CSV.");
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-mono shadow-2xl backdrop-blur-md transition-all ${
            notification.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : "bg-rose-950/90 border-rose-500/50 text-rose-200"
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

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-border/40 bg-surface-dark/80 p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="font-mono text-xs uppercase tracking-wider">Total Users</span>
            <Users className="size-4 text-signal" />
          </div>
          <div className="text-3xl font-display font-bold text-foreground">{metrics.total}</div>
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">{metrics.active}</span> active accounts
          </div>
        </div>

        <div className="border border-border/40 bg-surface-dark/80 p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="font-mono text-xs uppercase tracking-wider">Robotics Engineers</span>
            <Cpu className="size-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-display font-bold text-foreground">{metrics.engineers}</div>
          <div className="mt-2 text-xs text-muted-foreground">Certified control access</div>
        </div>

        <div className="border border-border/40 bg-surface-dark/80 p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="font-mono text-xs uppercase tracking-wider">MFA Compliance</span>
            <ShieldCheck className="size-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-display font-bold text-emerald-400">{metrics.mfaRate}%</div>
          <div className="mt-2 text-xs text-muted-foreground">FIDO2 / Hardware token rate</div>
        </div>

        <div className="border border-border/40 bg-surface-dark/80 p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="font-mono text-xs uppercase tracking-wider">Pending Access</span>
            <Clock className="size-4 text-amber-400" />
          </div>
          <div className="text-3xl font-display font-bold text-amber-400">{metrics.pending}</div>
          <div className="mt-2 text-xs text-muted-foreground">Awaiting director sign-off</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "directory"
                ? "border-signal text-signal bg-signal/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users size={14} />
            User Directory ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("rbac")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "rbac"
                ? "border-signal text-signal bg-signal/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Key size={14} />
            RBAC Access Matrix
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "audit"
                ? "border-signal text-signal bg-signal/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield size={14} />
            Security Audit Trail ({auditLogs.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="border-border/60 font-mono text-xs uppercase text-surface-foreground hover:border-signal hover:text-signal"
          >
            <Download size={13} className="mr-1.5" />
            Export CSV
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="bg-signal text-white font-mono text-xs uppercase font-bold hover:bg-signal/90 shadow-[0_0_15px_rgba(0,102,255,0.25)]"
          >
            <UserPlus size={13} className="mr-1.5" />
            Provision User
          </Button>
        </div>
      </div>

      {/* TAB 1: USER DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-surface-dark/60 p-4 rounded-lg border border-border/40">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/80 border-border/50 font-mono text-xs"
              />
            </div>

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full h-9 rounded-md bg-background/80 border border-border/50 px-3 text-xs font-mono text-foreground focus:outline-none focus:border-signal"
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
                className="w-full h-9 rounded-md bg-background/80 border border-border/50 px-3 text-xs font-mono text-foreground focus:outline-none focus:border-signal"
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
                className="w-full h-9 rounded-md bg-background/80 border border-border/50 px-3 text-xs font-mono text-foreground focus:outline-none focus:border-signal"
              >
                <option value="all">All Statuses (Any)</option>
                <option value="active">Active</option>
                <option value="pending">Pending Approval</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-lg border border-border/40 bg-surface-dark/40 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-surface-dark/90 text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Facilities</th>
                  <th className="py-3 px-4">Security / MFA</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground font-mono text-xs">
                      No users match the selected query and filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const roleBadge = ROLE_BADGES[user.role];
                    const statusBadge = STATUS_BADGES[user.status];
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* User Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-signal/10 border border-signal/30 text-signal font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                            </div>
                            <div>
                              <div className="font-medium text-foreground hover:text-signal transition-colors flex items-center gap-2">
                                <span>{user.name}</span>
                                <span className="font-mono text-[10px] text-muted-foreground/60">{user.id}</span>
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}
                          >
                            {roleBadge.label}
                          </span>
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                          {user.department}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                          >
                            <StatusIcon size={12} />
                            {statusBadge.label}
                          </span>
                        </td>

                        {/* Facilities */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {user.assignedPlants.map((plant, idx) => (
                              <span
                                key={idx}
                                className="inline-block text-[10px] font-mono bg-border/20 border border-border/40 text-surface-foreground/80 px-1.5 py-0.5 rounded"
                              >
                                {plant.replace("Gigafactory", "GF").replace("Robotics Assembly Plant", "Plant")}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Security / MFA */}
                        <td className="py-3.5 px-4">
                          {user.mfaEnabled ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                              <ShieldCheck size={13} />
                              Hardware MFA
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400/80">
                              <AlertTriangle size={13} />
                              Unprotected
                            </span>
                          )}
                        </td>

                        {/* Last Login */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                          {user.lastLogin}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectUser(user)}
                              title="Inspect User Details"
                              className="p-1.5 rounded hover:bg-surface-dark text-muted-foreground hover:text-signal transition-colors"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => setEditUser({ ...user })}
                              title="Edit Credentials & Roles"
                              className="p-1.5 rounded hover:bg-surface-dark text-muted-foreground hover:text-cyan-400 transition-colors"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              title={user.status === "active" ? "Suspend Account" : "Activate Account"}
                              className={`p-1.5 rounded hover:bg-surface-dark transition-colors ${
                                user.status === "active"
                                  ? "text-muted-foreground hover:text-amber-400"
                                  : "text-muted-foreground hover:text-emerald-400"
                              }`}
                            >
                              <Shield size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmUser(user)}
                              title="Decommission User"
                              className="p-1.5 rounded hover:bg-surface-dark text-muted-foreground hover:text-rose-400 transition-colors"
                            >
                              <Trash2 size={15} />
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
        <div className="space-y-6">
          <div className="bg-surface-dark/60 p-5 rounded-lg border border-border/40">
            <h3 className="font-display text-lg font-bold uppercase text-foreground mb-1">
              Role-Based Access Control (RBAC) Governance Matrix
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Granular permission matrix enforced across INDUS telemetry brokers, digital twin models, physical actuator control, and user administration.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border/40 bg-surface-dark/40 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-surface-dark/90 text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Role Definition</th>
                  <th className="py-3 px-4 text-center">Telemetry Stream</th>
                  <th className="py-3 px-4 text-center">Motion Control</th>
                  <th className="py-3 px-4 text-center">Digital Twin Sim</th>
                  <th className="py-3 px-4 text-center">RPA Workflows</th>
                  <th className="py-3 px-4 text-center">User Admin</th>
                  <th className="py-3 px-4 text-center">Audit Logs</th>
                  <th className="py-3 px-4 text-center">Firmware OTA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-sm font-mono text-xs">
                {RBAC_ROLE_DEFINITIONS.map((def) => {
                  const badge = ROLE_BADGES[def.role];
                  return (
                    <tr key={def.role} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-sans">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            {def.title}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            ({def.userCount} active users)
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-sm">{def.description}</p>
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.telemetryStream ? (
                          <span className="text-emerald-400 font-bold">GRANTED</span>
                        ) : (
                          <span className="text-muted-foreground/40 font-bold">RESTRICTED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.motionControl ? (
                          <span className="text-emerald-400 font-bold">FULL R/W</span>
                        ) : (
                          <span className="text-muted-foreground/40 font-bold">RESTRICTED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.digitalTwinSimulation ? (
                          <span className="text-emerald-400 font-bold">INTERACTIVE</span>
                        ) : (
                          <span className="text-muted-foreground/40 font-bold">RESTRICTED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.rpaWorkflows ? (
                          <span className="text-emerald-400 font-bold">EXECUTE</span>
                        ) : (
                          <span className="text-muted-foreground/40 font-bold">RESTRICTED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.userAdministration ? (
                          <span className="text-purple-400 font-bold">SUPER ADMIN</span>
                        ) : (
                          <span className="text-muted-foreground/40 font-bold">DENIED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.auditLogsView ? (
                          <span className="text-cyan-400 font-bold">AUDITOR</span>
                        ) : (
                          <span className="text-muted-foreground/40 font-bold">DENIED</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {def.permissions.firmwareOTA ? (
                          <span className="text-amber-400 font-bold">CERTIFIED</span>
                        ) : (
                          <span className="text-muted-foreground/40 font-bold">DENIED</span>
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
          <div className="flex items-center justify-between bg-surface-dark/60 p-4 rounded-lg border border-border/40">
            <div>
              <h3 className="font-display text-base font-bold uppercase text-foreground mb-0.5">
                Cryptographic Security & Access Event Stream
              </h3>
              <p className="text-xs text-muted-foreground">
                Immutable audit ledger recording privilege alterations, login events, and facility allocations.
              </p>
            </div>
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="border-border/60 font-mono text-xs uppercase"
            >
              <RefreshCw size={12} className="mr-1.5" />
              Sync Ledger
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border/40 bg-surface-dark/40 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-surface-dark/90 text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target User</th>
                  <th className="py-3 px-4">Facility / Node</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4 text-center">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-xs font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-signal font-bold">{log.id}</td>
                    <td className="py-3 px-4 text-muted-foreground">{log.timestamp}</td>
                    <td className="py-3 px-4 font-sans font-medium text-foreground">{log.actor}</td>
                    <td className="py-3 px-4 text-amber-400 font-semibold">{log.action}</td>
                    <td className="py-3 px-4 font-sans text-surface-foreground">{log.targetUser}</td>
                    <td className="py-3 px-4 text-muted-foreground">{log.facility}</td>
                    <td className="py-3 px-4 text-muted-foreground/80">{log.ipAddress}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.severity === "critical"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                            : log.severity === "warning"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
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

      {/* MODAL 1: ADD / PROVISION USER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl border border-border/60 bg-surface-dark p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-signal/10 border border-signal/30 text-signal">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold uppercase text-foreground">
                    Provision Industrial User
                  </h3>
                  <p className="text-xs text-muted-foreground">Add robotics engineer or plant operator</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Full Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Maya Lin"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-background/80 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Email Address *
                </label>
                <Input
                  required
                  type="email"
                  placeholder="m.lin@indusrobotics.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-background/80 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    System Role *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full h-9 rounded-md bg-background/80 border border-border/50 px-3 text-xs font-mono text-foreground focus:outline-none focus:border-signal"
                  >
                    <option value="robotics_engineer">Robotics Engineer</option>
                    <option value="plant_operator">Plant Operator</option>
                    <option value="process_analyst">Process Analyst</option>
                    <option value="client_partner">Client Partner</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    Department *
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value as Department)}
                    className="w-full h-9 rounded-md bg-background/80 border border-border/50 px-3 text-xs font-mono text-foreground focus:outline-none focus:border-signal"
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
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
                  Assigned Facility / Plant
                </label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto border border-border/40 p-2.5 rounded-md bg-background/50">
                  {DEFAULT_PLANTS.map((plant) => (
                    <label key={plant} className="flex items-center gap-2 text-xs font-mono text-muted-foreground cursor-pointer hover:text-foreground">
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
                        className="rounded border-border/50 text-signal focus:ring-0"
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
                  className="rounded border-border/50 text-signal focus:ring-0"
                />
                <label htmlFor="new-mfa" className="text-xs font-mono text-muted-foreground cursor-pointer">
                  Require Hardware / TOTP Multi-Factor Authentication (MFA)
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Admin Notes
                </label>
                <Input
                  placeholder="e.g. Assigned to Delta Cell Calibration line"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="bg-background/80 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/40">
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
                  className="bg-signal text-white font-mono text-xs uppercase font-bold hover:bg-signal/90"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-xl border border-border/60 bg-surface-dark p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-signal/10 border border-signal/30 text-signal font-mono font-bold text-sm flex items-center justify-center">
                  {inspectUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold uppercase text-foreground">
                    {inspectUser.name}
                  </h3>
                  <p className="text-xs font-mono text-signal">{inspectUser.id} &bull; {inspectUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectUser(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="border border-border/40 bg-background/50 p-3 rounded">
                <span className="text-muted-foreground block text-[10px] uppercase">Role</span>
                <span className="text-foreground font-bold">{ROLE_BADGES[inspectUser.role].label}</span>
              </div>
              <div className="border border-border/40 bg-background/50 p-3 rounded">
                <span className="text-muted-foreground block text-[10px] uppercase">Department</span>
                <span className="text-foreground font-bold">{inspectUser.department}</span>
              </div>
              <div className="border border-border/40 bg-background/50 p-3 rounded">
                <span className="text-muted-foreground block text-[10px] uppercase">Account Status</span>
                <span className="text-emerald-400 font-bold uppercase">{inspectUser.status}</span>
              </div>
              <div className="border border-border/40 bg-background/50 p-3 rounded">
                <span className="text-muted-foreground block text-[10px] uppercase">MFA Status</span>
                <span className={inspectUser.mfaEnabled ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  {inspectUser.mfaEnabled ? "Enforced (Hardware Key)" : "Not Configured"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-muted-foreground block mb-1.5">
                Assigned Robotics Facilities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inspectUser.assignedPlants.map((plant, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono bg-border/20 border border-border/40 text-surface-foreground px-2 py-1 rounded"
                  >
                    {plant}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-muted-foreground block mb-1.5">
                Granular Permissions
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-background/50 p-3 rounded border border-border/40">
                {Object.entries(inspectUser.permissions).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{key}</span>
                    <span className={val ? "text-emerald-400 font-bold" : "text-muted-foreground/40 font-bold"}>
                      {val ? "ALLOW" : "DENY"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {inspectUser.notes && (
              <div className="border-t border-border/40 pt-3">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                  Operator Notes
                </span>
                <p className="text-xs text-muted-foreground font-sans">{inspectUser.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/40">
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
                className="bg-signal text-white font-mono text-xs uppercase font-bold hover:bg-signal/90"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT USER MODAL */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl border border-border/60 bg-surface-dark p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Edit2 size={18} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold uppercase text-foreground">
                    Modify User Profile
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">{editUser.id} &bull; {editUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditUser(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Full Name
                </label>
                <Input
                  required
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className="bg-background/80 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    System Role
                  </label>
                  <select
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value as UserRole })}
                    className="w-full h-9 rounded-md bg-background/80 border border-border/50 px-3 text-xs font-mono text-foreground focus:outline-none focus:border-signal"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="robotics_engineer">Robotics Engineer</option>
                    <option value="plant_operator">Plant Operator</option>
                    <option value="process_analyst">Process Analyst</option>
                    <option value="client_partner">Client Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    Status
                  </label>
                  <select
                    value={editUser.status}
                    onChange={(e) => setEditUser({ ...editUser, status: e.target.value as UserStatus })}
                    className="w-full h-9 rounded-md bg-background/80 border border-border/50 px-3 text-xs font-mono text-foreground focus:outline-none focus:border-signal"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Department
                </label>
                <select
                  value={editUser.department}
                  onChange={(e) => setEditUser({ ...editUser, department: e.target.value as Department })}
                  className="w-full h-9 rounded-md bg-background/80 border border-border/50 px-3 text-xs font-mono text-foreground focus:outline-none focus:border-signal"
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
                  className="rounded border-border/50 text-signal focus:ring-0"
                />
                <label htmlFor="edit-mfa" className="text-xs font-mono text-muted-foreground cursor-pointer">
                  MFA Hardware Key / Authenticator Enforced
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Notes
                </label>
                <Input
                  value={editUser.notes || ""}
                  onChange={(e) => setEditUser({ ...editUser, notes: e.target.value })}
                  className="bg-background/80 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/40">
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
                  className="bg-signal text-white font-mono text-xs uppercase font-bold hover:bg-signal/90"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-xl border border-rose-500/40 bg-surface-dark p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert size={24} />
              <h3 className="font-display text-lg font-bold uppercase text-foreground">
                Decommission User
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to decommission account{" "}
              <strong className="text-foreground">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})?
              All cryptographic sessions and physical robotics telemetry access will be immediately terminated.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/40">
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
