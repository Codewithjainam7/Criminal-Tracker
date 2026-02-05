"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Database,
    Key,
    Smartphone,
    Mail,
    Save,
    Eye,
    EyeOff,
    CheckCircle,
    AlertTriangle,
    Moon,
    Sun,
    Monitor,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { seedUsers } from "@/data/seed";

// Get current user (mock)
const currentUser = seedUsers[0];

function Toggle({
    checked,
    onChange,
    disabled = false,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                checked ? "bg-accent-primary" : "bg-bureau-700",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            <span
                className={cn(
                    "inline-block h-4 w-4 rounded-full bg-white transition-transform",
                    checked ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
    );
}

function SettingRow({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-bureau-700 last:border-0">
            <div className="flex-1 pr-4">
                <p className="font-medium text-bureau-100">{title}</p>
                {description && (
                    <p className="text-sm text-bureau-500 mt-0.5">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
}

export default function SettingsPage() {
    // Profile state
    const [firstName, setFirstName] = useState(currentUser.firstName);
    const [lastName, setLastName] = useState(currentUser.lastName);
    const [email, setEmail] = useState(currentUser.email);
    const [phone, setPhone] = useState(currentUser.phoneNumber || "");

    // Notification state
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [caseUpdates, setCaseUpdates] = useState(true);
    const [suspectAlerts, setSuspectAlerts] = useState(true);
    const [evidenceUpdates, setEvidenceUpdates] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(false);

    // Security state
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser.twoFactorEnabled);
    const [sessionTimeout, setSessionTimeout] = useState("30");

    // Appearance state
    const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
    const [compactMode, setCompactMode] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleSaveProfile = () => {
        toast.success("Profile updated successfully");
    };

    const handleSaveNotifications = () => {
        toast.success("Notification preferences saved");
    };

    const handleSaveSecurity = () => {
        toast.success("Security settings updated");
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-bureau-100 flex items-center gap-2">
                        <Settings className="h-7 w-7 text-accent-primary" />
                        Settings
                    </h1>
                    <p className="text-bureau-400 mt-1">
                        Manage your account preferences and application settings
                    </p>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList variant="underline">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            Appearance
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Avatar Section */}
                            <Card>
                                <CardContent className="py-6">
                                    <div className="flex items-center gap-6">
                                        <Avatar
                                            name={currentUser.fullName}
                                            size="xl"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-bureau-100">{currentUser.fullName}</h3>
                                            <p className="text-sm text-bureau-400">
                                                {currentUser.rank} • {currentUser.department}
                                            </p>
                                            <div className="flex items-center gap-2 mt-3">
                                                <Button variant="outline" size="sm">
                                                    Upload Photo
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Personal Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your personal details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                                First Name
                                            </label>
                                            <Input
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                                Last Name
                                            </label>
                                            <Input
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                            Email Address
                                        </label>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                            Phone Number
                                        </label>
                                        <Input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div>
                                            <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                                Badge ID
                                            </label>
                                            <Input
                                                value={currentUser.badgeId}
                                                disabled
                                                className="bg-bureau-800/50 font-mono"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                                Role
                                            </label>
                                            <Input
                                                value={currentUser.role}
                                                disabled
                                                className="bg-bureau-800/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button onClick={handleSaveProfile} leftIcon={<Save className="h-4 w-4" />}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Channels</CardTitle>
                                    <CardDescription>Choose how you receive notifications</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SettingRow
                                        title="Email Notifications"
                                        description="Receive notifications via email"
                                    >
                                        <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
                                    </SettingRow>
                                    <SettingRow
                                        title="Push Notifications"
                                        description="Receive push notifications in browser"
                                    >
                                        <Toggle checked={pushNotifications} onChange={setPushNotifications} />
                                    </SettingRow>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Alert Types</CardTitle>
                                    <CardDescription>Select which updates you want to be notified about</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SettingRow
                                        title="Case Updates"
                                        description="New evidence, status changes, and team activity"
                                    >
                                        <Toggle checked={caseUpdates} onChange={setCaseUpdates} />
                                    </SettingRow>
                                    <SettingRow
                                        title="Suspect Alerts"
                                        description="High-priority suspect sightings and status changes"
                                    >
                                        <Toggle checked={suspectAlerts} onChange={setSuspectAlerts} />
                                    </SettingRow>
                                    <SettingRow
                                        title="Evidence Updates"
                                        description="Analysis results and chain of custody changes"
                                    >
                                        <Toggle checked={evidenceUpdates} onChange={setEvidenceUpdates} />
                                    </SettingRow>
                                    <SettingRow
                                        title="Weekly Summary Report"
                                        description="Receive a weekly digest of all activity"
                                    >
                                        <Toggle checked={weeklyReport} onChange={setWeeklyReport} />
                                    </SettingRow>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveNotifications} leftIcon={<Save className="h-4 w-4" />}>
                                    Save Preferences
                                </Button>
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Two-Factor Authentication</CardTitle>
                                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={cn(
                                                    "w-12 h-12 rounded-lg flex items-center justify-center",
                                                    twoFactorEnabled
                                                        ? "bg-status-secure/20 text-status-secure"
                                                        : "bg-bureau-700 text-bureau-400"
                                                )}
                                            >
                                                <Smartphone className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-bureau-100">
                                                    Authenticator App
                                                </p>
                                                <p className="text-sm text-bureau-500">
                                                    {twoFactorEnabled ? "Enabled" : "Not configured"}
                                                </p>
                                            </div>
                                        </div>
                                        <Toggle checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
                                    </div>
                                    {twoFactorEnabled && (
                                        <div className="mt-4 p-3 bg-status-secure/10 border border-status-secure/20 rounded-lg flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-status-secure" />
                                            <span className="text-sm text-status-secure">
                                                Two-factor authentication is active
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Session Security</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <SettingRow
                                        title="Session Timeout"
                                        description="Automatically log out after inactivity"
                                    >
                                        <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="15">15 minutes</SelectItem>
                                                <SelectItem value="30">30 minutes</SelectItem>
                                                <SelectItem value="60">1 hour</SelectItem>
                                                <SelectItem value="120">2 hours</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingRow>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                            Current Password
                                        </label>
                                        <Input type="password" placeholder="Enter current password" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                            New Password
                                        </label>
                                        <Input type="password" placeholder="Enter new password" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                            Confirm New Password
                                        </label>
                                        <Input type="password" placeholder="Confirm new password" />
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button variant="outline">
                                            Update Password
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-status-warning/30 bg-status-warning/5">
                                <CardContent className="py-4">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="h-5 w-5 text-status-warning" />
                                        <div>
                                            <p className="font-medium text-bureau-100">Active Sessions</p>
                                            <p className="text-sm text-bureau-400">
                                                You are currently logged in on 2 devices
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm" className="ml-auto">
                                            Manage Sessions
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveSecurity} leftIcon={<Save className="h-4 w-4" />}>
                                    Save Security Settings
                                </Button>
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Theme</CardTitle>
                                    <CardDescription>Select your preferred color scheme</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: "dark", label: "Dark", icon: Moon },
                                            { value: "light", label: "Light", icon: Sun },
                                            { value: "system", label: "System", icon: Monitor },
                                        ].map(({ value, label, icon: Icon }) => (
                                            <button
                                                key={value}
                                                onClick={() => setTheme(value as typeof theme)}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
                                                    theme === value
                                                        ? "border-accent-primary bg-accent-primary/10"
                                                        : "border-bureau-700 hover:border-bureau-600"
                                                )}
                                            >
                                                <Icon className={cn(
                                                    "h-6 w-6",
                                                    theme === value ? "text-accent-primary" : "text-bureau-400"
                                                )} />
                                                <span className={cn(
                                                    "text-sm font-medium",
                                                    theme === value ? "text-accent-primary" : "text-bureau-300"
                                                )}>
                                                    {label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Layout</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <SettingRow
                                        title="Compact Mode"
                                        description="Reduce spacing for a denser interface"
                                    >
                                        <Toggle checked={compactMode} onChange={setCompactMode} />
                                    </SettingRow>
                                    <SettingRow
                                        title="Collapsed Sidebar"
                                        description="Start with sidebar collapsed by default"
                                    >
                                        <Toggle checked={sidebarCollapsed} onChange={setSidebarCollapsed} />
                                    </SettingRow>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Data Display</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <SettingRow
                                        title="Default View"
                                        description="Preferred view for lists"
                                    >
                                        <Select defaultValue="grid">
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="grid">Grid</SelectItem>
                                                <SelectItem value="table">Table</SelectItem>
                                                <SelectItem value="kanban">Kanban</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingRow>
                                    <SettingRow
                                        title="Items Per Page"
                                        description="Number of items to display in lists"
                                    >
                                        <Select defaultValue="20">
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                                <SelectItem value="100">100</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </SettingRow>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
