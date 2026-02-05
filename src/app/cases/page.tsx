"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Grid3X3,
    LayoutList,
    Columns,
    Plus,
    Search,
    Filter,
    ChevronDown,
    MoreHorizontal,
    Clock,
    User,
    MapPin,
    Eye,
    Edit,
    Trash2,
    FileText,
    X,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { NewCaseDialog } from "@/components/dialogs";
import { seedCases, seedUsers } from "@/data/seed";
import { cn, formatCaseId, formatRelativeTime } from "@/lib/utils";
import {
    CASE_STATUS_LABELS,
    CASE_PRIORITY_LABELS,
    CASE_CATEGORY_LABELS,
    type CaseStatus,
    type CasePriority,
    type CaseCategory,
} from "@/types/case";

type ViewMode = "table" | "grid" | "kanban";

// Filter options
const statusOptions: CaseStatus[] = ["open", "active", "pending", "under_review", "closed", "cold"];
const priorityOptions: CasePriority[] = ["critical", "high", "medium", "low"];

function CaseCard({ caseData }: { caseData: (typeof seedCases)[0] }) {
    const leadInvestigator = seedUsers.find((u) => u.id === caseData.leadInvestigatorId);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Link href={`/cases/${caseData.id}`}>
                <Card hover padding="none" className="group">
                    <div className="p-4 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-mono text-bureau-500">
                                    {caseData.caseNumber}
                                </p>
                                <h3 className="text-sm font-medium text-bureau-100 mt-1 line-clamp-1 group-hover:text-accent-primary transition-colors">
                                    {caseData.title}
                                </h3>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-1 hover:bg-bureau-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="h-4 w-4 text-bureau-400" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Case
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Generate Report
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-status-critical">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Case
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Category & Location */}
                        <div className="flex items-center gap-2 text-xs text-bureau-400">
                            <span className="capitalize">
                                {CASE_CATEGORY_LABELS[caseData.category]}
                            </span>
                            <span className="text-bureau-600">•</span>
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{caseData.location.city}</span>
                        </div>

                        {/* Status & Priority */}
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    caseData.status === "active"
                                        ? "case-active"
                                        : caseData.status === "open"
                                            ? "case-open"
                                            : caseData.status === "pending" || caseData.status === "under_review"
                                                ? "case-pending"
                                                : caseData.status === "closed"
                                                    ? "case-closed"
                                                    : "case-cold"
                                }
                                size="xs"
                            >
                                {CASE_STATUS_LABELS[caseData.status]}
                            </Badge>
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
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 bg-bureau-850/50 border-t border-bureau-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar name={leadInvestigator?.fullName || "Unknown"} size="xs" />
                            <span className="text-xs text-bureau-400 truncate max-w-[100px]">
                                {leadInvestigator?.fullName || "Unassigned"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-bureau-500">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(caseData.dateUpdated)}
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
}

// Kanban Column
function KanbanColumn({
    status,
    cases,
}: {
    status: CaseStatus;
    cases: (typeof seedCases);
}) {
    const statusColors = {
        open: "border-case-open",
        active: "border-case-active",
        pending: "border-case-pending",
        under_review: "border-case-pending",
        closed: "border-case-closed",
        cold: "border-case-cold",
    };

    return (
        <div className="flex-1 min-w-[280px] max-w-[320px]">
            <div
                className={cn(
                    "flex items-center gap-2 p-3 bg-bureau-800/50 rounded-t-lg border-t-2",
                    statusColors[status]
                )}
            >
                <h3 className="font-medium text-bureau-200 text-sm">
                    {CASE_STATUS_LABELS[status]}
                </h3>
                <Badge variant="default" size="xs">
                    {cases.length}
                </Badge>
            </div>
            <div className="p-2 bg-bureau-850/30 rounded-b-lg min-h-[400px] space-y-2">
                <AnimatePresence>
                    {cases.map((caseData) => (
                        <CaseCard key={caseData.id} caseData={caseData} />
                    ))}
                </AnimatePresence>
                {cases.length === 0 && (
                    <p className="text-center text-bureau-500 text-sm py-8">
                        No cases
                    </p>
                )}
            </div>
        </div>
    );
}

// Table Row
function CaseTableRow({ caseData }: { caseData: (typeof seedCases)[0] }) {
    const leadInvestigator = seedUsers.find((u) => u.id === caseData.leadInvestigatorId);

    return (
        <tr className="border-b border-bureau-700 hover:bg-bureau-800/50 transition-colors">
            <td className="py-3 px-4">
                <Link href={`/cases/${caseData.id}`} className="hover:text-accent-primary">
                    <p className="font-mono text-xs text-bureau-400">{caseData.caseNumber}</p>
                    <p className="text-sm font-medium text-bureau-100 mt-0.5">{caseData.title}</p>
                </Link>
            </td>
            <td className="py-3 px-4">
                <Badge
                    variant={
                        caseData.status === "active"
                            ? "case-active"
                            : caseData.status === "open"
                                ? "case-open"
                                : caseData.status === "pending" || caseData.status === "under_review"
                                    ? "case-pending"
                                    : caseData.status === "closed"
                                        ? "case-closed"
                                        : "case-cold"
                    }
                    size="xs"
                >
                    {CASE_STATUS_LABELS[caseData.status]}
                </Badge>
            </td>
            <td className="py-3 px-4">
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
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-bureau-300">
                    {CASE_CATEGORY_LABELS[caseData.category]}
                </span>
            </td>
            <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                    <Avatar name={leadInvestigator?.fullName || "?"} size="xs" />
                    <span className="text-sm text-bureau-300">{leadInvestigator?.lastName}</span>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-bureau-400">
                    {formatRelativeTime(caseData.dateUpdated)}
                </span>
            </td>
            <td className="py-3 px-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-bureau-700 rounded">
                            <MoreHorizontal className="h-4 w-4 text-bureau-400" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
}

export default function CasesPage() {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);

    // Filter cases
    const filteredCases = useMemo(() => {
        return seedCases.filter((c) => {
            const matchesSearch =
                searchQuery === "" ||
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || c.status === statusFilter;
            const matchesPriority = priorityFilter === "all" || c.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [searchQuery, statusFilter, priorityFilter]);

    // Group cases by status for Kanban view
    const casesByStatus = useMemo(() => {
        return statusOptions.reduce((acc, status) => {
            acc[status] = filteredCases.filter((c) => c.status === status);
            return acc;
        }, {} as Record<CaseStatus, typeof filteredCases>);
    }, [filteredCases]);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-bureau-100 flex items-center gap-2">
                            <Briefcase className="h-7 w-7 text-accent-primary" />
                            Case Management
                        </h1>
                        <p className="text-bureau-400 mt-1">
                            {filteredCases.length} cases found
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex items-center bg-bureau-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("table")}
                                className={cn(
                                    "p-2 rounded-md transition-colors",
                                    viewMode === "table"
                                        ? "bg-bureau-700 text-bureau-100"
                                        : "text-bureau-400 hover:text-bureau-200"
                                )}
                                title="Table View"
                            >
                                <LayoutList className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "p-2 rounded-md transition-colors",
                                    viewMode === "grid"
                                        ? "bg-bureau-700 text-bureau-100"
                                        : "text-bureau-400 hover:text-bureau-200"
                                )}
                                title="Grid View"
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("kanban")}
                                className={cn(
                                    "p-2 rounded-md transition-colors",
                                    viewMode === "kanban"
                                        ? "bg-bureau-700 text-bureau-100"
                                        : "text-bureau-400 hover:text-bureau-200"
                                )}
                                title="Kanban View"
                            >
                                <Columns className="h-4 w-4" />
                            </button>
                        </div>

                        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsNewCaseOpen(true)}>
                            New Case
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bureau-500" />
                        <Input
                            placeholder="Search cases..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {CASE_STATUS_LABELS[status]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            {priorityOptions.map((priority) => (
                                <SelectItem key={priority} value={priority}>
                                    {CASE_PRIORITY_LABELS[priority]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {(statusFilter !== "all" || priorityFilter !== "all" || searchQuery) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setStatusFilter("all");
                                setPriorityFilter("all");
                                setSearchQuery("");
                            }}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Content based on view mode */}
                <AnimatePresence mode="wait">
                    {viewMode === "table" && (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Card padding="none">
                                <div className="overflow-x-auto">
                                    <table className="w-full data-table">
                                        <thead>
                                            <tr className="border-b border-bureau-700">
                                                <th className="text-left py-3 px-4">Case</th>
                                                <th className="text-left py-3 px-4">Status</th>
                                                <th className="text-left py-3 px-4">Priority</th>
                                                <th className="text-left py-3 px-4">Category</th>
                                                <th className="text-left py-3 px-4">Lead</th>
                                                <th className="text-left py-3 px-4">Updated</th>
                                                <th className="text-left py-3 px-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCases.map((caseData) => (
                                                <CaseTableRow key={caseData.id} caseData={caseData} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredCases.length === 0 && (
                                    <div className="text-center py-12 text-bureau-500">
                                        <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p>No cases match your filters</p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}

                    {viewMode === "grid" && (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {filteredCases.map((caseData) => (
                                <CaseCard key={caseData.id} caseData={caseData} />
                            ))}
                            {filteredCases.length === 0 && (
                                <div className="col-span-full text-center py-12 text-bureau-500">
                                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No cases match your filters</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {viewMode === "kanban" && (
                        <motion.div
                            key="kanban"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-4 overflow-x-auto pb-4"
                        >
                            {statusOptions.map((status) => (
                                <KanbanColumn
                                    key={status}
                                    status={status}
                                    cases={casesByStatus[status]}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* New Case Dialog */}
            <NewCaseDialog
                isOpen={isNewCaseOpen}
                onClose={() => setIsNewCaseOpen(false)}
            />
        </DashboardLayout>
    );
}
