"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    Users,
    Settings,
    Database,
    Activity,
    Key,
    Lock,
    Eye,
    EyeOff,
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    UserPlus,
    RefreshCw,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { seedUsers } from "@/data/seed";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";

function UserRow({ user }: { user: (typeof seedUsers)[0] }) {
    return (
        <tr className="border-b border-bureau-700 hover:bg-bureau-800/50 transition-colors">
            <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                    <Avatar name={user.fullName} size="sm" showStatus status={user.status === "active" ? "online" : "offline"} />
                    <div>
                        <p className="text-sm font-medium text-bureau-100">{user.fullName}</p>
                        <p className="text-xs text-bureau-500">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4">
                <Badge variant="outline" size="xs">{user.role}</Badge>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-bureau-400">{user.department}</span>
            </td>
            <td className="py-3 px-4">
                <Badge
                    variant={user.status === "active" ? "success" : "danger"}
                    size="xs"
                >
                    {user.status === "active" ? "Active" : user.status === "on_leave" ? "On Leave" : "Inactive"}
                </Badge>
            </td>
            <td className="py-3 px-4 text-sm text-bureau-500">
                {user.lastLogin ? formatRelativeTime(user.lastLogin) : "Never"}
            </td>
            <td className="py-3 px-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-status-critical">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deactivate
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
}

// Audit log mock data
const auditLogs = [
    { id: "log-001", action: "User login", user: "Sarah Blackwood", timestamp: new Date("2026-01-29T00:30:00"), type: "auth", status: "success" },
    { id: "log-002", action: "Case created - CIT-2026-011", user: "Michael Chen", timestamp: new Date("2026-01-28T23:15:00"), type: "case", status: "success" },
    { id: "log-003", action: "Suspect profile updated", user: "Sarah Blackwood", timestamp: new Date("2026-01-28T22:45:00"), type: "suspect", status: "success" },
    { id: "log-004", action: "Evidence uploaded", user: "David Thompson", timestamp: new Date("2026-01-28T21:30:00"), type: "evidence", status: "success" },
    { id: "log-005", action: "Failed login attempt", user: "unknown@email.com", timestamp: new Date("2026-01-28T20:15:00"), type: "auth", status: "failed" },
    { id: "log-006", action: "Report generated", user: "Lisa Patel", timestamp: new Date("2026-01-28T19:00:00"), type: "report", status: "success" },
    { id: "log-007", action: "User role changed", user: "Admin", timestamp: new Date("2026-01-28T18:30:00"), type: "admin", status: "success" },
    { id: "log-008", action: "Bulk evidence export", user: "Michael Chen", timestamp: new Date("2026-01-28T17:45:00"), type: "evidence", status: "success" },
];

function AuditLogRow({ log }: { log: (typeof auditLogs)[0] }) {
    const typeColors = {
        auth: "text-accent-primary",
        case: "text-status-warning",
        suspect: "text-status-critical",
        evidence: "text-status-secure",
        report: "text-accent-secondary",
        admin: "text-bureau-400",
    };

    return (
        <tr className="border-b border-bureau-700 hover:bg-bureau-800/50 transition-colors">
            <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                    {log.status === "success" ? (
                        <CheckCircle className="h-4 w-4 text-status-secure" />
                    ) : (
                        <XCircle className="h-4 w-4 text-status-critical" />
                    )}
                    <span className="text-sm text-bureau-200">{log.action}</span>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-bureau-400">{log.user}</span>
            </td>
            <td className="py-3 px-4">
                <Badge variant="outline" size="xs" className={typeColors[log.type as keyof typeof typeColors]}>
                    {log.type}
                </Badge>
            </td>
            <td className="py-3 px-4 text-sm text-bureau-500">
                {formatRelativeTime(log.timestamp)}
            </td>
        </tr>
    );
}

export default function AdminPage() {
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const filteredUsers = seedUsers.filter((u) => {
        const matchesSearch = searchQuery === "" ||
            u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const stats = {
        totalUsers: seedUsers.length,
        activeUsers: seedUsers.filter((u) => u.status === "active").length,
        onlineUsers: seedUsers.filter((u) => u.status === "active" && u.lastLogin && new Date().getTime() - u.lastLogin.getTime() < 3600000).length,
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-bureau-100 flex items-center gap-2">
                            <Shield className="h-7 w-7 text-accent-primary" />
                            Admin Panel
                        </h1>
                        <p className="text-bureau-400 mt-1">
                            System administration and user management
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent-primary/20 rounded-lg">
                                <Users className="h-5 w-5 text-accent-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">Total Users</p>
                                <p className="text-xl font-bold text-bureau-100">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-secure/20 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-status-secure" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">Active Users</p>
                                <p className="text-xl font-bold text-bureau-100">{stats.activeUsers}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-warning/20 rounded-lg">
                                <Activity className="h-5 w-5 text-status-warning" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">Online Now</p>
                                <p className="text-xl font-bold text-bureau-100">{stats.onlineUsers}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent-secondary/20 rounded-lg">
                                <Database className="h-5 w-5 text-accent-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">System Health</p>
                                <p className="text-xl font-bold text-status-secure">Optimal</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Tabs defaultValue="users" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger value="audit" className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Audit Log
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Security
                        </TabsTrigger>
                    </TabsList>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <Card padding="none">
                            <div className="p-4 border-b border-bureau-700 flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bureau-500" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="All Roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="administrator">Administrator</SelectItem>
                                        <SelectItem value="investigator">Investigator</SelectItem>
                                        <SelectItem value="analyst">Analyst</SelectItem>
                                        <SelectItem value="forensic">Forensic</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => setShowAddUserDialog(true)}>
                                    Add User
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full data-table">
                                    <thead>
                                        <tr className="border-b border-bureau-700">
                                            <th className="text-left py-3 px-4">User</th>
                                            <th className="text-left py-3 px-4">Role</th>
                                            <th className="text-left py-3 px-4">Department</th>
                                            <th className="text-left py-3 px-4">Status</th>
                                            <th className="text-left py-3 px-4">Last Login</th>
                                            <th className="text-left py-3 px-4 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <UserRow key={user.id} user={user} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Audit Log Tab */}
                    <TabsContent value="audit">
                        <Card padding="none">
                            <div className="p-4 border-b border-bureau-700 flex items-center justify-between">
                                <h3 className="font-semibold text-bureau-100">Recent Activity</h3>
                                <Button variant="outline" size="sm" leftIcon={<RefreshCw className="h-4 w-4" />}>
                                    Refresh
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full data-table">
                                    <thead>
                                        <tr className="border-b border-bureau-700">
                                            <th className="text-left py-3 px-4">Action</th>
                                            <th className="text-left py-3 px-4">User</th>
                                            <th className="text-left py-3 px-4">Type</th>
                                            <th className="text-left py-3 px-4">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditLogs.map((log) => (
                                            <AuditLogRow key={log.id} log={log} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password Policy</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-bureau-300">Minimum Length</span>
                                        <Badge variant="primary">12 characters</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-bureau-300">Require Uppercase</span>
                                        <Badge variant="success">Enabled</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-bureau-300">Require Special Characters</span>
                                        <Badge variant="success">Enabled</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-bureau-300">Password Expiry</span>
                                        <Badge variant="primary">90 days</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Session Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-bureau-300">Session Timeout</span>
                                        <Badge variant="primary">30 minutes</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-bureau-300">Max Concurrent Sessions</span>
                                        <Badge variant="primary">3</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-bureau-300">2FA Requirement</span>
                                        <Badge variant="success">Mandatory</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-bureau-300">Failed Login Lockout</span>
                                        <Badge variant="primary">5 attempts</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Security Alerts</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-status-secure/10 border border-status-secure/20 rounded-lg">
                                            <CheckCircle className="h-5 w-5 text-status-secure" />
                                            <div>
                                                <p className="text-bureau-100 font-medium">All Systems Secure</p>
                                                <p className="text-sm text-bureau-400">No security incidents detected in the last 24 hours</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Add User Dialog */}
                <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                    <DialogContent size="md">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Create a new user account for the system
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">First Name</label>
                                    <Input placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">Last Name</label>
                                    <Input placeholder="Doe" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bureau-300 mb-1.5">Email</label>
                                <Input type="email" placeholder="john.doe@agency.gov" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bureau-300 mb-1.5">Role</label>
                                <Select defaultValue="investigator">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="administrator">Administrator</SelectItem>
                                        <SelectItem value="investigator">Investigator</SelectItem>
                                        <SelectItem value="analyst">Analyst</SelectItem>
                                        <SelectItem value="forensic">Forensic Specialist</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bureau-300 mb-1.5">Department</label>
                                <Input placeholder="Major Crimes Unit" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                setShowAddUserDialog(false);
                                toast.success("User created successfully");
                            }}>
                                Create User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
