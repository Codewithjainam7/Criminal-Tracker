"use client";

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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { DashboardLayout } from "@/components/layout";
import { getCaseStats, getSuspectStats, seedCases, seedSuspects, seedUsers } from "@/data/seed";
import { cn, formatRelativeTime, formatCaseId } from "@/lib/utils";
import { CASE_STATUS_LABELS, CASE_PRIORITY_LABELS } from "@/types/case";
import { SUSPECT_STATUS_LABELS, RISK_LEVEL_LABELS } from "@/types/suspect";

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    className?: string;
}

function StatCard({ title, value, change, icon, trend = "neutral", className }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={cn("relative overflow-hidden", className)}>
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

// Case Card Component
function CaseCard({ caseData }: { caseData: typeof seedCases[0] }) {
    const leadInvestigator = seedUsers.find((u) => u.id === caseData.leadInvestigatorId);

    return (
        <Card hover className="p-4">
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
    );
}

// Wanted Suspect Card
function WantedSuspectCard({ suspect }: { suspect: typeof seedSuspects[0] }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-bureau-800/50 rounded-lg border border-bureau-700">
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
    );
}

export default function DashboardPage() {
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
                        <Button variant="outline" leftIcon={<Clock className="h-4 w-4" />}>
                            Activity Log
                        </Button>
                        <Button leftIcon={<Briefcase className="h-4 w-4" />}>
                            New Case
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Cases"
                        value={caseStats.total}
                        change={12}
                        trend="up"
                        icon={<Briefcase className="h-6 w-6 text-accent-primary" />}
                    />
                    <StatCard
                        title="Active Investigations"
                        value={caseStats.active}
                        change={-5}
                        trend="down"
                        icon={<Activity className="h-6 w-6 text-status-warning" />}
                    />
                    <StatCard
                        title="Wanted Suspects"
                        value={suspectStats.wanted}
                        icon={<Target className="h-6 w-6 text-status-critical" />}
                    />
                    <StatCard
                        title="Clearance Rate"
                        value={`${caseStats.clearanceRate}%`}
                        change={3}
                        trend="up"
                        icon={<CheckCircle className="h-6 w-6 text-status-secure" />}
                    />
                </div>

                {/* Priority Alerts */}
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
                                <Button variant="warning" size="sm">
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
                            <Button variant="ghost" size="sm">
                                View All
                            </Button>
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
                            <Button variant="ghost" size="sm">
                                View All
                            </Button>
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

                {/* Quick Stats Row */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4">
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
                    <Card className="p-4">
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
                    <Card className="p-4">
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
                    <Card className="p-4">
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
        </DashboardLayout>
    );
}
