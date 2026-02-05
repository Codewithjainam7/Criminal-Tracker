"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    PieChart,
    Activity,
    Calendar,
    Users,
    Briefcase,
    UserSearch,
    FileBox,
    Clock,
    MapPin,
    Target,
    AlertTriangle,
    CheckCircle,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { seedCases, seedSuspects, seedEvidence, seedUsers, getCaseStats, getSuspectStats, getEvidenceStats } from "@/data/seed";
import { cn } from "@/lib/utils";
import { CASE_STATUS_LABELS, CASE_CATEGORY_LABELS } from "@/types/case";

// Mock chart data
const monthlyData = [
    { month: "Aug", cases: 8, solved: 5 },
    { month: "Sep", cases: 12, solved: 8 },
    { month: "Oct", cases: 10, solved: 7 },
    { month: "Nov", cases: 15, solved: 9 },
    { month: "Dec", cases: 11, solved: 8 },
    { month: "Jan", cases: 10, solved: 6 },
];

const categoryData = [
    { category: "Homicide", count: 3, color: "bg-status-critical" },
    { category: "Robbery", count: 2, color: "bg-status-warning" },
    { category: "Cybercrime", count: 2, color: "bg-accent-primary" },
    { category: "Fraud", count: 2, color: "bg-accent-secondary" },
    { category: "Other", count: 1, color: "bg-bureau-500" },
];

const locationData = [
    { city: "Metro City", cases: 6 },
    { city: "Downtown", cases: 3 },
    { city: "Harbor District", cases: 2 },
    { city: "Industrial Zone", cases: 1 },
];

function StatCard({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    color,
}: {
    title: string;
    value: string | number;
    change: string;
    changeType: "up" | "down";
    icon: any;
    color: string;
}) {
    return (
        <Card className="p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-bureau-400">{title}</p>
                    <p className="text-3xl font-bold text-bureau-100 mt-1">{value}</p>
                    <div className="flex items-center gap-1 mt-2">
                        {changeType === "up" ? (
                            <ArrowUpRight className="h-4 w-4 text-status-secure" />
                        ) : (
                            <ArrowDownRight className="h-4 w-4 text-status-critical" />
                        )}
                        <span
                            className={cn(
                                "text-sm font-medium",
                                changeType === "up" ? "text-status-secure" : "text-status-critical"
                            )}
                        >
                            {change}
                        </span>
                        <span className="text-xs text-bureau-500">vs last month</span>
                    </div>
                </div>
                <div className={cn("p-3 rounded-xl", color)}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </Card>
    );
}

function BarChartSimple({ data }: { data: typeof monthlyData }) {
    const maxCases = Math.max(...data.map((d) => d.cases));

    return (
        <div className="space-y-3">
            {data.map((item, idx) => (
                <div key={item.month} className="flex items-center gap-3">
                    <span className="text-xs text-bureau-500 w-8">{item.month}</span>
                    <div className="flex-1 flex gap-1">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.cases / maxCases) * 100}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="h-6 bg-accent-primary/80 rounded-r flex items-center justify-end pr-2"
                        >
                            <span className="text-xs text-white font-medium">{item.cases}</span>
                        </motion.div>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.solved / maxCases) * 100}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.1 + 0.1 }}
                            className="h-6 bg-status-secure/80 rounded-r flex items-center justify-end pr-2"
                        >
                            <span className="text-xs text-white font-medium">{item.solved}</span>
                        </motion.div>
                    </div>
                </div>
            ))}
            <div className="flex items-center justify-center gap-6 pt-2 border-t border-bureau-700">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-accent-primary" />
                    <span className="text-xs text-bureau-400">New Cases</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-status-secure" />
                    <span className="text-xs text-bureau-400">Solved</span>
                </div>
            </div>
        </div>
    );
}

function DonutChart({ data }: { data: typeof categoryData }) {
    const total = data.reduce((acc, d) => acc + d.count, 0);

    return (
        <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {(() => {
                        let offset = 0;
                        return data.map((item, idx) => {
                            const percentage = (item.count / total) * 100;
                            const strokeDasharray = `${percentage} ${100 - percentage}`;
                            const strokeDashoffset = -offset;
                            offset += percentage;

                            return (
                                <circle
                                    key={item.category}
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    stroke={
                                        item.color === "bg-status-critical"
                                            ? "#ef4444"
                                            : item.color === "bg-status-warning"
                                                ? "#f59e0b"
                                                : item.color === "bg-accent-primary"
                                                    ? "#3b82f6"
                                                    : item.color === "bg-accent-secondary"
                                                        ? "#8b5cf6"
                                                        : "#64748b"
                                    }
                                    strokeWidth="15"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    pathLength="100"
                                    className="transition-all duration-500"
                                />
                            );
                        });
                    })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-bureau-100">{total}</span>
                    <span className="text-xs text-bureau-500">Total</span>
                </div>
            </div>
            <div className="space-y-2">
                {data.map((item) => (
                    <div key={item.category} className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded", item.color)} />
                        <span className="text-sm text-bureau-300">{item.category}</span>
                        <span className="text-sm text-bureau-500 ml-auto">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HorizontalBarChart({ data }: { data: typeof locationData }) {
    const maxCases = Math.max(...data.map((d) => d.cases));

    return (
        <div className="space-y-4">
            {data.map((item, idx) => (
                <div key={item.city}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-bureau-300">{item.city}</span>
                        <span className="text-sm text-bureau-400 font-medium">{item.cases}</span>
                    </div>
                    <div className="h-2 bg-bureau-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.cases / maxCases) * 100}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("6m");

    const caseStats = getCaseStats();
    const suspectStats = getSuspectStats();
    const evidenceStats = getEvidenceStats();

    const clearanceRate = ((caseStats.closed / caseStats.total) * 100).toFixed(0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-bureau-100 flex items-center gap-2">
                            <BarChart3 className="h-7 w-7 text-accent-primary" />
                            Analytics
                        </h1>
                        <p className="text-bureau-400 mt-1">
                            Investigation metrics and performance insights
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[140px]">
                                <Calendar className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1m">Last Month</SelectItem>
                                <SelectItem value="3m">Last 3 Months</SelectItem>
                                <SelectItem value="6m">Last 6 Months</SelectItem>
                                <SelectItem value="1y">Last Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Cases"
                        value={caseStats.total}
                        change="+12%"
                        changeType="up"
                        icon={Briefcase}
                        color="bg-accent-primary"
                    />
                    <StatCard
                        title="Active Investigations"
                        value={caseStats.active}
                        change="-5%"
                        changeType="down"
                        icon={Activity}
                        color="bg-status-warning"
                    />
                    <StatCard
                        title="Clearance Rate"
                        value={`${clearanceRate}%`}
                        change="+3%"
                        changeType="up"
                        icon={Target}
                        color="bg-status-secure"
                    />
                    <StatCard
                        title="Wanted Suspects"
                        value={suspectStats.wanted}
                        change="+2"
                        changeType="up"
                        icon={UserSearch}
                        color="bg-status-critical"
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-accent-primary" />
                                Case Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BarChartSimple data={monthlyData} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-accent-secondary" />
                                Cases by Category
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DonutChart data={categoryData} />
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-status-warning" />
                                Cases by Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart data={locationData} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-status-info" />
                                Avg. Resolution Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center py-4">
                                    <span className="text-5xl font-bold text-bureau-100">23</span>
                                    <span className="text-xl text-bureau-400 ml-1">days</span>
                                    <p className="text-sm text-bureau-500 mt-1">Average time to close</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-bureau-700">
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-status-secure">12d</p>
                                        <p className="text-xs text-bureau-500">Fastest</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-bureau-200">23d</p>
                                        <p className="text-xs text-bureau-500">Median</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-status-warning">45d</p>
                                        <p className="text-xs text-bureau-500">Slowest</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-accent-primary" />
                                Team Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {seedUsers.slice(0, 4).map((user, idx) => (
                                    <div key={user.id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-xs font-bold text-white">
                                            {user.firstName[0]}{user.lastName[0]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-bureau-200">{user.lastName}</p>
                                            <div className="h-1.5 bg-bureau-800 rounded-full mt-1 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${80 - idx * 15}%` }}
                                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                    className="h-full bg-accent-primary rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm text-bureau-400 font-medium">
                                            {4 - idx} cases
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4 text-center">
                        <FileBox className="h-8 w-8 text-accent-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold text-bureau-100">{evidenceStats.total}</p>
                        <p className="text-sm text-bureau-400">Evidence Items</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-status-secure mx-auto mb-2" />
                        <p className="text-2xl font-bold text-bureau-100">{evidenceStats.analyzed}</p>
                        <p className="text-sm text-bureau-400">Analyzed</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <AlertTriangle className="h-8 w-8 text-status-warning mx-auto mb-2" />
                        <p className="text-2xl font-bold text-bureau-100">{suspectStats.extremeRisk}</p>
                        <p className="text-sm text-bureau-400">High Risk Suspects</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <Users className="h-8 w-8 text-bureau-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-bureau-100">{seedUsers.length}</p>
                        <p className="text-sm text-bureau-400">Active Agents</p>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
