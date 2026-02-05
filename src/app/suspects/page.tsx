"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserSearch,
    Grid3X3,
    LayoutList,
    Plus,
    Search,
    AlertTriangle,
    Shield,
    Eye,
    Edit,
    MoreHorizontal,
    MapPin,
    Calendar,
    Briefcase,
    X,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { NewSuspectDialog } from "@/components/dialogs";
import { seedSuspects, seedCases } from "@/data/seed";
import { cn, formatRelativeTime, formatSuspectId, calculateAge } from "@/lib/utils";
import {
    SUSPECT_STATUS_LABELS,
    RISK_LEVEL_LABELS,
    type SuspectStatus,
    type RiskLevel,
} from "@/types/suspect";

type ViewMode = "grid" | "table";

const statusOptions: SuspectStatus[] = ["wanted", "apprehended", "released", "deceased", "unknown", "cleared"];
const riskOptions: RiskLevel[] = ["extreme", "high", "medium", "low", "unknown"];

function SuspectCard({ suspect }: { suspect: (typeof seedSuspects)[0] }) {
    const linkedCasesCount = seedCases.filter((c) =>
        c.suspectIds.includes(suspect.id)
    ).length;

    const riskColorClasses = {
        extreme: "bg-gradient-to-br from-risk-extreme to-red-900",
        high: "bg-gradient-to-br from-risk-high/80 to-orange-900/50",
        medium: "bg-gradient-to-br from-risk-medium/50 to-yellow-900/30",
        low: "bg-gradient-to-br from-risk-low/30 to-green-900/20",
        unknown: "bg-gradient-to-br from-bureau-700 to-bureau-800",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            <Link href={`/suspects/${suspect.id}`}>
                <Card
                    hover
                    padding="none"
                    className={cn(
                        "group overflow-hidden",
                        suspect.riskLevel === "extreme" && "ring-1 ring-risk-extreme/30"
                    )}
                >
                    {/* Risk Banner */}
                    <div
                        className={cn(
                            "h-2",
                            riskColorClasses[suspect.riskLevel]
                        )}
                    />

                    <div className="p-4 space-y-4">
                        {/* Header with Avatar */}
                        <div className="flex items-start gap-3">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-lg bg-bureau-700 flex items-center justify-center overflow-hidden">
                                    {suspect.mugshot ? (
                                        <img
                                            src={suspect.mugshot}
                                            alt={suspect.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserSearch className="h-8 w-8 text-bureau-500" />
                                    )}
                                </div>
                                {suspect.status === "wanted" && (
                                    <div className="absolute -top-1 -right-1">
                                        <Badge variant="solid-danger" size="xs" pulse>
                                            !
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-mono text-bureau-500">
                                    {suspect.suspectNumber}
                                </p>
                                <h3 className="text-base font-semibold text-bureau-100 mt-0.5 group-hover:text-accent-primary transition-colors">
                                    {suspect.fullName}
                                </h3>
                                {suspect.aliases.length > 0 && (
                                    <p className="text-xs text-bureau-400 mt-0.5 truncate">
                                        a.k.a. &quot;{suspect.aliases[0]}&quot;
                                    </p>
                                )}
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
                                        View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Suspect
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        Link to Case
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Status & Risk Badges */}
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    suspect.status === "wanted"
                                        ? "danger"
                                        : suspect.status === "apprehended"
                                            ? "success"
                                            : suspect.status === "cleared"
                                                ? "info"
                                                : "default"
                                }
                                size="xs"
                                pulse={suspect.status === "wanted"}
                            >
                                {SUSPECT_STATUS_LABELS[suspect.status]}
                            </Badge>
                            <Badge
                                variant={
                                    suspect.riskLevel === "extreme"
                                        ? "risk-extreme"
                                        : suspect.riskLevel === "high"
                                            ? "risk-high"
                                            : suspect.riskLevel === "medium"
                                                ? "risk-medium"
                                                : suspect.riskLevel === "low"
                                                    ? "risk-low"
                                                    : "default"
                                }
                                size="xs"
                            >
                                {RISK_LEVEL_LABELS[suspect.riskLevel]}
                            </Badge>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1.5 text-bureau-400">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {suspect.dateOfBirth
                                        ? `Age ${calculateAge(suspect.dateOfBirth)}`
                                        : "Unknown Age"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-bureau-400">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">
                                    {suspect.lastKnownAddress?.city || "Unknown"}
                                </span>
                            </div>
                        </div>

                        {/* M.O. Tags */}
                        {suspect.modusOperandi.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {suspect.modusOperandi.slice(0, 2).map((mo) => (
                                    <Badge key={mo} variant="outline" size="xs">
                                        {mo}
                                    </Badge>
                                ))}
                                {suspect.modusOperandi.length > 2 && (
                                    <Badge variant="default" size="xs">
                                        +{suspect.modusOperandi.length - 2}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 bg-bureau-850/50 border-t border-bureau-700 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-bureau-400">
                            <Briefcase className="h-3 w-3" />
                            <span>{linkedCasesCount} linked cases</span>
                        </div>
                        <span className="text-bureau-500">
                            Updated {formatRelativeTime(suspect.updatedAt)}
                        </span>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
}

// Table Row Component
function SuspectTableRow({ suspect }: { suspect: (typeof seedSuspects)[0] }) {
    const linkedCasesCount = seedCases.filter((c) =>
        c.suspectIds.includes(suspect.id)
    ).length;

    return (
        <tr className="border-b border-bureau-700 hover:bg-bureau-800/50 transition-colors">
            <td className="py-3 px-4">
                <Link href={`/suspects/${suspect.id}`} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-bureau-700 flex items-center justify-center flex-shrink-0">
                        {suspect.mugshot ? (
                            <img
                                src={suspect.mugshot}
                                alt={suspect.fullName}
                                className="w-full h-full object-cover rounded"
                            />
                        ) : (
                            <UserSearch className="h-5 w-5 text-bureau-500" />
                        )}
                    </div>
                    <div>
                        <p className="font-mono text-xs text-bureau-400">{suspect.suspectNumber}</p>
                        <p className="text-sm font-medium text-bureau-100">{suspect.fullName}</p>
                    </div>
                </Link>
            </td>
            <td className="py-3 px-4">
                <Badge
                    variant={
                        suspect.status === "wanted"
                            ? "danger"
                            : suspect.status === "apprehended"
                                ? "success"
                                : "default"
                    }
                    size="xs"
                    pulse={suspect.status === "wanted"}
                >
                    {SUSPECT_STATUS_LABELS[suspect.status]}
                </Badge>
            </td>
            <td className="py-3 px-4">
                <Badge
                    variant={
                        suspect.riskLevel === "extreme"
                            ? "risk-extreme"
                            : suspect.riskLevel === "high"
                                ? "risk-high"
                                : suspect.riskLevel === "medium"
                                    ? "risk-medium"
                                    : "risk-low"
                    }
                    size="xs"
                >
                    {RISK_LEVEL_LABELS[suspect.riskLevel]}
                </Badge>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-bureau-400">
                    {suspect.aliases[0] || "-"}
                </span>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-bureau-400">
                    {linkedCasesCount}
                </span>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-bureau-500">
                    {formatRelativeTime(suspect.updatedAt)}
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
                            View Profile
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

export default function SuspectsPage() {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [riskFilter, setRiskFilter] = useState<string>("all");
    const [isNewSuspectOpen, setIsNewSuspectOpen] = useState(false);

    const filteredSuspects = useMemo(() => {
        return seedSuspects.filter((s) => {
            const matchesSearch =
                searchQuery === "" ||
                s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.suspectNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.aliases.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus = statusFilter === "all" || s.status === statusFilter;
            const matchesRisk = riskFilter === "all" || s.riskLevel === riskFilter;
            return matchesSearch && matchesStatus && matchesRisk;
        });
    }, [searchQuery, statusFilter, riskFilter]);

    // Sort by risk level (extreme first)
    const sortedSuspects = useMemo(() => {
        const riskOrder = { extreme: 0, high: 1, medium: 2, low: 3, unknown: 4 };
        return [...filteredSuspects].sort(
            (a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
        );
    }, [filteredSuspects]);

    const wantedCount = seedSuspects.filter((s) => s.status === "wanted").length;
    const extremeCount = seedSuspects.filter((s) => s.riskLevel === "extreme").length;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-bureau-100 flex items-center gap-2">
                            <UserSearch className="h-7 w-7 text-status-critical" />
                            Suspect Database
                        </h1>
                        <p className="text-bureau-400 mt-1">
                            {filteredSuspects.length} suspects • {wantedCount} wanted • {extremeCount} extreme risk
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex items-center bg-bureau-800 rounded-lg p-1">
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
                        </div>

                        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsNewSuspectOpen(true)}>
                            Add Suspect
                        </Button>
                    </div>
                </div>

                {/* Alert Banner for Extreme Risk */}
                {extremeCount > 0 && (
                    <Card className="border-risk-extreme/30 bg-risk-extreme/5 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-risk-extreme/20 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-status-critical" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-bureau-100">
                                    {extremeCount} Extreme Risk Suspects at Large
                                </h3>
                                <p className="text-sm text-bureau-400 mt-0.5">
                                    Exercise extreme caution. Armed and dangerous.
                                </p>
                            </div>
                            <Button variant="danger" size="sm">
                                View All
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bureau-500" />
                        <Input
                            placeholder="Search suspects, aliases..."
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
                                    {SUSPECT_STATUS_LABELS[status]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={riskFilter} onValueChange={setRiskFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Risk Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Risk Levels</SelectItem>
                            {riskOptions.map((risk) => (
                                <SelectItem key={risk} value={risk}>
                                    {RISK_LEVEL_LABELS[risk]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {(statusFilter !== "all" || riskFilter !== "all" || searchQuery) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setStatusFilter("all");
                                setRiskFilter("all");
                                setSearchQuery("");
                            }}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {viewMode === "grid" ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {sortedSuspects.map((suspect) => (
                                <SuspectCard key={suspect.id} suspect={suspect} />
                            ))}
                            {sortedSuspects.length === 0 && (
                                <div className="col-span-full text-center py-12 text-bureau-500">
                                    <UserSearch className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No suspects match your filters</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
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
                                                <th className="text-left py-3 px-4">Suspect</th>
                                                <th className="text-left py-3 px-4">Status</th>
                                                <th className="text-left py-3 px-4">Risk</th>
                                                <th className="text-left py-3 px-4">Alias</th>
                                                <th className="text-left py-3 px-4">Cases</th>
                                                <th className="text-left py-3 px-4">Updated</th>
                                                <th className="text-left py-3 px-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedSuspects.map((suspect) => (
                                                <SuspectTableRow key={suspect.id} suspect={suspect} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {sortedSuspects.length === 0 && (
                                    <div className="text-center py-12 text-bureau-500">
                                        <UserSearch className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p>No suspects match your filters</p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* New Suspect Dialog */}
            <NewSuspectDialog
                isOpen={isNewSuspectOpen}
                onClose={() => setIsNewSuspectOpen(false)}
            />
        </DashboardLayout>
    );
}
