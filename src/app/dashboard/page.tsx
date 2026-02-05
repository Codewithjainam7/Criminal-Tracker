"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Briefcase,
    UserSearch,
    FileBox,
    Users,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Clock,
    CheckCircle,
    Shield,
    Target,
    Activity,
    X,
    Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { DashboardLayout } from "@/components/layout";
import { NewCaseDialog } from "@/components/dialogs";
import { getCaseStats, getSuspectStats, seedCases, seedSuspects, seedUsers } from "@/data/seed";
import { cn, formatRelativeTime, formatCaseId, formatDate } from "@/lib/utils";
import { CASE_STATUS_LABELS, CASE_PRIORITY_LABELS } from "@/types/case";
import { SUSPECT_STATUS_LABELS, RISK_LEVEL_LABELS } from "@/types/suspect";

// Activity Log Data
const activityLog = [
    { id: 1, action: "Case Updated", entity: "Downtown Financial District Murder", user: "Sarah Blackwood", time: new Date(Date.now() - 1000 * 60 * 5), type: "case" },
    { id: 2, action: "Suspect Apprehended", entity: "Viktor Morozov", user: "Michael Chen", time: new Date(Date.now() - 1000 * 60 * 30), type: "suspect" },
    { id: 3, action: "Evidence Added", entity: "DNA Sample EV-2026-0045", user: "Lisa Patel", time: new Date(Date.now() - 1000 * 60 * 60), type: "evidence" },
    { id: 4, action: "New Case Created", entity: "Westside Missing Teenager", user: "Sarah Blackwood", time: new Date(Date.now() - 1000 * 60 * 120), type: "case" },
    { id: 5, action: "Witness Statement Recorded", entity: "Maria Santos", user: "Michael Chen", time: new Date(Date.now() - 1000 * 60 * 180), type: "witness" },
    { id: 6, action: "Case Priority Changed", entity: "Metropolitan Bank Cyber Heist", user: "Admin", time: new Date(Date.now() - 1000 * 60 * 240), type: "case" },
    { id: 7, action: "Suspect Added", entity: "Carlos Vega", user: "Lisa Patel", time: new Date(Date.now() - 1000 * 60 * 300), type: "suspect" },
    { id: 8, action: "Evidence Analyzed", entity: "Fingerprint FP-2026-0012", user: "Forensic Lab", time: new Date(Date.now() - 1000 * 60 * 360), type: "evidence" },
];

// Activity Log Modal Component
function ActivityLogModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-[10%] mx-auto max-w-2xl bg-bureau-900 border border-bureau-700 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-bureau-700 bg-bureau-850">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent-primary/20 rounded-lg">
                            <Clock className="h-5 w-5 text-accent-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-bureau-100">Activity Log</h2>
                            <p className="text-sm text-bureau-500">Recent system activities</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    {activityLog.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 bg-bureau-800/50 rounded-lg border border-bureau-700 hover:border-bureau-600 transition-colors"
                        >
                            <div className={cn(
                                "p-2 rounded-lg",
                                activity.type === "case" && "bg-accent-primary/20",
                                activity.type === "suspect" && "bg-status-critical/20",
                                activity.type === "evidence" && "bg-status-warning/20",
                                activity.type === "witness" && "bg-status-secure/20"
                            )}>
                                {activity.type === "case" && <Briefcase className="h-4 w-4 text-accent-primary" />}
                                {activity.type === "suspect" && <UserSearch className="h-4 w-4 text-status-critical" />}
                                {activity.type === "evidence" && <FileBox className="h-4 w-4 text-status-warning" />}
                                {activity.type === "witness" && <Users className="h-4 w-4 text-status-secure" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-bureau-100">{activity.action}</p>
                                <p className="text-xs text-bureau-400 mt-0.5">{activity.entity}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-bureau-500">by {activity.user}</span>
                                    <span className="text-xs text-bureau-600">•</span>
                                    <span className="text-xs text-bureau-500">{formatRelativeTime(activity.time)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="px-6 py-4 border-t border-bureau-700 bg-bureau-850">
                    <Button variant="outline" className="w-full" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </motion.div>
        </>
    );
}

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    className?: string;
    href?: string;
}

function StatCard({ title, value, change, icon, trend = "neutral", className, href }: StatCardProps) {
    const router = useRouter();

    const handleClick = () => {
        if (href) router.push(href);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClick}
            className={href ? "cursor-pointer" : ""}
        >
            <Card className={cn("relative overflow-hidden transition-all", href && "hover:border-accent-primary/50", className)}>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-bureau-400">{title}</p>
                            <p className="text-3xl font-bold text-bureau-100 mt-2">{value}</p>
                            {change !== undefined && (
                                <div className="flex items-center gap-1 mt-2">
                                    {trend === "up" ? (
                                        <TrendingUp className="h-4 w-4 text-status-secure" />
                                    ) : trend === "down" ? (
                                        <TrendingDown className="h-4 w-4 text-status-critical" />
                                    ) : null}
                                    <span
                                        className={cn(
                                            "text-sm font-medium",
                                            trend === "up" && "text-status-secure",
                                            trend === "down" && "text-status-critical",
                                            trend === "neutral" && "text-bureau-500"
                                        )}
                                    >
                                        {change > 0 && "+"}
                                        {change}% from last month
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-bureau-700/50 rounded-lg">
                            {icon}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// Case Card Component - Now Clickable
function CaseCard({ caseData }: { caseData: typeof seedCases[0] }) {
    const leadInvestigator = seedUsers.find((u) => u.id === caseData.leadInvestigatorId);

    return (
        <Link href={`/cases/${caseData.id}`}>
            <Card hover className="p-4 cursor-pointer transition-all hover:border-accent-primary/50">
                <div className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-mono text-bureau-500">
                                {formatCaseId(caseData.id)}
                            </p>
                            <h4 className="text-sm font-medium text-bureau-100 mt-1 line-clamp-1">
                                {caseData.title}
                            </h4>
                        </div>
                        <Badge
                            variant={
                                caseData.priority === "critical"
                                    ? "priority-critical"
                                    : caseData.priority === "high"
                                        ? "priority-high"
                                        : caseData.priority === "medium"
                                            ? "priority-medium"
                                            : "priority-low"
                            }
                            size="xs"
                        >
                            {CASE_PRIORITY_LABELS[caseData.priority]}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <Badge
                            variant={
                                caseData.status === "active"
                                    ? "case-active"
                                    : caseData.status === "open"
                                        ? "case-open"
                                        : caseData.status === "pending"
                                            ? "case-pending"
                                            : caseData.status === "closed"
                                                ? "case-closed"
                                                : "case-cold"
                            }
                            size="xs"
                        >
                            {CASE_STATUS_LABELS[caseData.status]}
                        </Badge>
                        <span className="text-xs text-bureau-500">
                            {formatRelativeTime(caseData.dateUpdated)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-bureau-700">
                        <div className="flex items-center gap-2">
                            <Avatar name={leadInvestigator?.fullName || "Unknown"} size="xs" />
                            <span className="text-xs text-bureau-400">
                                {leadInvestigator?.fullName || "Unassigned"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-bureau-500">
                            <UserSearch className="h-3 w-3" />
                            {caseData.suspectIds.length}
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

// Wanted Suspect Card - Now Clickable
function WantedSuspectCard({ suspect }: { suspect: typeof seedSuspects[0] }) {
    return (
        <Link href={`/suspects/${suspect.id}`}>
            <div className="flex items-center gap-3 p-3 bg-bureau-800/50 rounded-lg border border-bureau-700 hover:border-status-critical/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-bureau-700 rounded-lg flex items-center justify-center">
                    <UserSearch className="h-6 w-6 text-bureau-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-bureau-100 truncate">
                            {suspect.fullName}
                        </p>
                        <Badge
                            variant={
                                suspect.riskLevel === "extreme"
                                    ? "risk-extreme"
                                    : suspect.riskLevel === "high"
                                        ? "risk-high"
                                        : "risk-medium"
                            }
                            size="xs"
                        >
                            {RISK_LEVEL_LABELS[suspect.riskLevel]}
                        </Badge>
                    </div>
                    <p className="text-xs text-bureau-500 mt-0.5">
                        {suspect.aliases[0] || suspect.suspectNumber}
                    </p>
                </div>
                <Badge variant="solid-danger" size="xs" pulse>
                    WANTED
                </Badge>
            </div>
        </Link>
    );
}

export default function DashboardPage() {
    const [showNewCaseDialog, setShowNewCaseDialog] = useState(false);
    const [showActivityLog, setShowActivityLog] = useState(false);
    const router = useRouter();

    const caseStats = getCaseStats();
    const suspectStats = getSuspectStats();

    const recentCases = seedCases
        .sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime())
        .slice(0, 5);

    const wantedSuspects = seedSuspects
        .filter((s) => s.status === "wanted")
        .sort((a, b) => {
            const riskOrder = { extreme: 0, high: 1, medium: 2, low: 3, unknown: 4 };
            return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        })
        .slice(0, 5);

    // Get critical cases for review
    const criticalCases = seedCases.filter(c => c.priority === "critical" || c.priority === "high");

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-bureau-100">Dashboard</h1>
                        <p className="text-bureau-400 mt-1">
                            Welcome back, Agent. Here&apos;s your operational overview.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            leftIcon={<Clock className="h-4 w-4" />}
                            onClick={() => setShowActivityLog(true)}
                        >
                            Activity Log
                        </Button>
                        <Button
                            leftIcon={<Briefcase className="h-4 w-4" />}
                            onClick={() => setShowNewCaseDialog(true)}
                        >
                            New Case
                        </Button>
                    </div>
                </div>

                {/* Stats Grid - Now Clickable */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Cases"
                        value={caseStats.total}
                        change={12}
                        trend="up"
                        icon={<Briefcase className="h-6 w-6 text-accent-primary" />}
                        href="/cases"
                    />
                    <StatCard
                        title="Active Investigations"
                        value={caseStats.active}
                        change={-5}
                        trend="down"
                        icon={<Activity className="h-6 w-6 text-status-warning" />}
                        href="/cases?status=active"
                    />
                    <StatCard
                        title="Wanted Suspects"
                        value={suspectStats.wanted}
                        icon={<Target className="h-6 w-6 text-status-critical" />}
                        href="/suspects?status=wanted"
                    />
                    <StatCard
                        title="Clearance Rate"
                        value={`${caseStats.clearanceRate}%`}
                        change={3}
                        trend="up"
                        icon={<CheckCircle className="h-6 w-6 text-status-secure" />}
                        href="/analytics"
                    />
                </div>

                {/* Priority Alerts - Now with working Review Cases button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-status-warning/30 bg-status-warning/5">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-status-warning/20 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-status-warning" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-bureau-100">
                                        Priority Alert: {caseStats.critical} Critical Cases Require Attention
                                    </h3>
                                    <p className="text-sm text-bureau-400 mt-1">
                                        Multiple high-priority cases are pending review. Immediate action recommended.
                                    </p>
                                </div>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => router.push('/cases?priority=critical,high')}
                                >
                                    Review Cases
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Cases */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-bureau-100">Recent Cases</h2>
                            <Link href="/cases">
                                <Button variant="ghost" size="sm">
                                    View All
                                </Button>
                            </Link>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {recentCases.map((caseData) => (
                                <CaseCard key={caseData.id} caseData={caseData} />
                            ))}
                        </div>
                    </div>

                    {/* Wanted Suspects */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-bureau-100">
                                Most Wanted
                            </h2>
                            <Link href="/suspects?status=wanted">
                                <Button variant="ghost" size="sm">
                                    View All
                                </Button>
                            </Link>
                        </div>
                        <Card padding="sm">
                            <div className="space-y-2">
                                {wantedSuspects.map((suspect) => (
                                    <WantedSuspectCard key={suspect.id} suspect={suspect} />
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Quick Stats Row - Now Clickable */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Link href="/cases?status=open">
                        <Card className="p-4 cursor-pointer hover:border-case-open/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-case-open/20 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-case-open" />
                                </div>
                                <div>
                                    <p className="text-sm text-bureau-400">Open Cases</p>
                                    <p className="text-xl font-bold text-bureau-100">{caseStats.open}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/cases?status=cold">
                        <Card className="p-4 cursor-pointer hover:border-case-cold/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-case-cold/20 rounded-lg">
                                    <Clock className="h-5 w-5 text-case-cold" />
                                </div>
                                <div>
                                    <p className="text-sm text-bureau-400">Cold Cases</p>
                                    <p className="text-xl font-bold text-bureau-100">{caseStats.cold}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/suspects?risk=extreme">
                        <Card className="p-4 cursor-pointer hover:border-status-critical/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-risk-extreme/20 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-status-critical" />
                                </div>
                                <div>
                                    <p className="text-sm text-bureau-400">Extreme Risk</p>
                                    <p className="text-xl font-bold text-bureau-100">{suspectStats.extremeRisk}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/suspects?status=apprehended">
                        <Card className="p-4 cursor-pointer hover:border-status-secure/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-status-secure/20 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-status-secure" />
                                </div>
                                <div>
                                    <p className="text-sm text-bureau-400">Apprehended</p>
                                    <p className="text-xl font-bold text-bureau-100">{suspectStats.apprehended}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>

                {/* Bureau Footer */}
                <div className="text-center py-6 border-t border-bureau-800">
                    <div className="flex items-center justify-center gap-2 text-bureau-500">
                        <Shield className="h-4 w-4" />
                        <span className="text-xs font-mono uppercase tracking-widest">
                            Criminal Investigation Tracker • Project Antigravity Ultra
                        </span>
                    </div>
                </div>
            </div>

            {/* New Case Dialog */}
            <NewCaseDialog
                isOpen={showNewCaseDialog}
                onClose={() => setShowNewCaseDialog(false)}
            />

            {/* Activity Log Modal */}
            <ActivityLogModal
                isOpen={showActivityLog}
                onClose={() => setShowActivityLog(false)}
            />
        </DashboardLayout>
    );
}
