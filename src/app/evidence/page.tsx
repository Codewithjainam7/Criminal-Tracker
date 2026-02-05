"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileBox,
    Grid3X3,
    LayoutList,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Clock,
    MapPin,
    User,
    Eye,
    Edit,
    Link as LinkIcon,
    Shield,
    Fingerprint,
    Film,
    FileText,
    HardDrive,
    Pill,
    Camera,
    DollarSign,
    X,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    Lock,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { seedEvidence, seedUsers, seedCases, getEvidenceStats } from "@/data/seed";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
    EVIDENCE_STATUS_LABELS,
    EVIDENCE_TYPE_LABELS,
    EVIDENCE_CATEGORY_LABELS,
    type EvidenceType,
    type EvidenceStatus,
} from "@/types/evidence";

type ViewMode = "grid" | "table";

const statusOptions: EvidenceStatus[] = ["collected", "stored", "pending_analysis", "under_analysis", "analyzed", "released", "destroyed"];
const typeOptions: EvidenceType[] = ["ballistics", "dna", "fingerprint", "document", "photo", "video", "audio", "digital_storage", "drugs", "weapon", "clothing", "financial", "other"];

// Icon mapping for evidence types
const typeIcons: Record<EvidenceType, React.ReactNode> = {
    ballistics: <Shield className="h-5 w-5" />,
    dna: <Fingerprint className="h-5 w-5" />,
    fingerprint: <Fingerprint className="h-5 w-5" />,
    document: <FileText className="h-5 w-5" />,
    photo: <Camera className="h-5 w-5" />,
    video: <Film className="h-5 w-5" />,
    audio: <Film className="h-5 w-5" />,
    digital_storage: <HardDrive className="h-5 w-5" />,
    drugs: <Pill className="h-5 w-5" />,
    weapon: <Shield className="h-5 w-5" />,
    clothing: <User className="h-5 w-5" />,
    financial: <DollarSign className="h-5 w-5" />,
    other: <FileBox className="h-5 w-5" />,
};

function ChainOfCustodyModal({
    evidence,
    open,
    onClose,
}: {
    evidence: (typeof seedEvidence)[0];
    open: boolean;
    onClose: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent size="lg">
                <DialogHeader>
                    <DialogTitle>Chain of Custody</DialogTitle>
                    <DialogDescription>
                        {evidence.evidenceNumber} - {evidence.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    {/* Current Status */}
                    <div className="p-4 bg-bureau-800/50 rounded-lg border border-bureau-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-bureau-400">Current Location</p>
                                <p className="font-medium text-bureau-100">{evidence.location.current}</p>
                            </div>
                            <Badge
                                variant={
                                    evidence.status === "analyzed"
                                        ? "success"
                                        : evidence.status === "pending_analysis"
                                            ? "warning"
                                            : "default"
                                }
                            >
                                {EVIDENCE_STATUS_LABELS[evidence.status]}
                            </Badge>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        {evidence.chainOfCustody.map((entry, index) => {
                            const handler = seedUsers.find((u) => u.id === entry.handledBy);
                            const receiver = seedUsers.find((u) => u.id === entry.receivedBy);

                            return (
                                <div key={entry.id} className="relative pl-8 pb-6 last:pb-0">
                                    {/* Timeline line */}
                                    {index < evidence.chainOfCustody.length - 1 && (
                                        <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-bureau-700" />
                                    )}

                                    {/* Timeline dot */}
                                    <div
                                        className={cn(
                                            "absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center",
                                            entry.verified
                                                ? "bg-status-secure/20 text-status-secure"
                                                : "bg-status-warning/20 text-status-warning"
                                        )}
                                    >
                                        {entry.verified ? (
                                            <CheckCircle className="h-4 w-4" />
                                        ) : (
                                            <AlertCircle className="h-4 w-4" />
                                        )}
                                    </div>

                                    {/* Entry content */}
                                    <div className="bg-bureau-800/30 rounded-lg p-4 border border-bureau-700">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-medium text-bureau-100 capitalize">
                                                    {entry.action.replace("_", " ")}
                                                </p>
                                                <p className="text-xs text-bureau-500 mt-0.5">
                                                    {new Date(entry.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            {entry.verified && (
                                                <Badge variant="success" size="xs">
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                            <div>
                                                <p className="text-bureau-500 text-xs">From</p>
                                                <p className="text-bureau-300">{entry.fromLocation}</p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500 text-xs">To</p>
                                                <p className="text-bureau-300">{entry.toLocation}</p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500 text-xs">Handled By</p>
                                                <p className="text-bureau-300">{handler?.fullName || "Unknown"}</p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500 text-xs">Received By</p>
                                                <p className="text-bureau-300">{receiver?.fullName || "Unknown"}</p>
                                            </div>
                                        </div>

                                        {entry.notes && (
                                            <p className="text-sm text-bureau-400 mt-3 italic border-t border-bureau-700 pt-3">
                                                {entry.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function EvidenceCard({ evidence }: { evidence: (typeof seedEvidence)[0] }) {
    const [showCustody, setShowCustody] = useState(false);
    const linkedCase = seedCases.find((c) => c.id === evidence.caseId);
    const collector = seedUsers.find((u) => u.id === evidence.collectedBy);

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <Card hover padding="none" className="group">
                    <div className="p-4 space-y-3">
                        {/* Header */}
                        <div className="flex items-start gap-3">
                            <div
                                className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                                    evidence.isClassified
                                        ? "bg-status-critical/20 text-status-critical"
                                        : "bg-accent-primary/20 text-accent-primary"
                                )}
                            >
                                {typeIcons[evidence.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-mono text-bureau-500">
                                        {evidence.evidenceNumber}
                                    </p>
                                    {evidence.isClassified && (
                                        <Lock className="h-3 w-3 text-status-critical" />
                                    )}
                                </div>
                                <h3 className="text-sm font-medium text-bureau-100 mt-0.5 line-clamp-1 group-hover:text-accent-primary transition-colors">
                                    {evidence.name}
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
                                    <DropdownMenuItem onClick={() => setShowCustody(true)}>
                                        <LinkIcon className="mr-2 h-4 w-4" />
                                        Chain of Custody
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-bureau-400 line-clamp-2">
                            {evidence.description}
                        </p>

                        {/* Status & Type */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                variant={
                                    evidence.status === "analyzed"
                                        ? "success"
                                        : evidence.status === "pending_analysis"
                                            ? "warning"
                                            : evidence.status === "under_analysis"
                                                ? "info"
                                                : "default"
                                }
                                size="xs"
                            >
                                {EVIDENCE_STATUS_LABELS[evidence.status]}
                            </Badge>
                            <Badge variant="outline" size="xs">
                                {EVIDENCE_TYPE_LABELS[evidence.type]}
                            </Badge>
                            <Badge variant="default" size="xs">
                                {EVIDENCE_CATEGORY_LABELS[evidence.category]}
                            </Badge>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-bureau-400">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{evidence.location.current}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 bg-bureau-850/50 border-t border-bureau-700 flex items-center justify-between text-xs">
                        <Link
                            href={`/cases/${evidence.caseId}`}
                            className="flex items-center gap-1 text-bureau-400 hover:text-accent-primary"
                        >
                            <FileBox className="h-3 w-3" />
                            <span>{linkedCase?.caseNumber || "Unknown Case"}</span>
                        </Link>
                        <button
                            onClick={() => setShowCustody(true)}
                            className="flex items-center gap-1 text-bureau-500 hover:text-accent-primary transition-colors"
                        >
                            <span>{evidence.chainOfCustody.length} custody records</span>
                            <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                </Card>
            </motion.div>

            <ChainOfCustodyModal
                evidence={evidence}
                open={showCustody}
                onClose={() => setShowCustody(false)}
            />
        </>
    );
}

function EvidenceTableRow({ evidence }: { evidence: (typeof seedEvidence)[0] }) {
    const [showCustody, setShowCustody] = useState(false);
    const linkedCase = seedCases.find((c) => c.id === evidence.caseId);
    const collector = seedUsers.find((u) => u.id === evidence.collectedBy);

    return (
        <>
            <tr className="border-b border-bureau-700 hover:bg-bureau-800/50 transition-colors">
                <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "w-10 h-10 rounded flex items-center justify-center flex-shrink-0",
                                evidence.isClassified
                                    ? "bg-status-critical/20 text-status-critical"
                                    : "bg-accent-primary/20 text-accent-primary"
                            )}
                        >
                            {typeIcons[evidence.type]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-mono text-xs text-bureau-400">{evidence.evidenceNumber}</p>
                                {evidence.isClassified && (
                                    <Lock className="h-3 w-3 text-status-critical" />
                                )}
                            </div>
                            <p className="text-sm font-medium text-bureau-100 max-w-[250px] truncate">
                                {evidence.name}
                            </p>
                        </div>
                    </div>
                </td>
                <td className="py-3 px-4">
                    <Badge
                        variant={
                            evidence.status === "analyzed"
                                ? "success"
                                : evidence.status === "pending_analysis"
                                    ? "warning"
                                    : evidence.status === "under_analysis"
                                        ? "info"
                                        : "default"
                        }
                        size="xs"
                    >
                        {EVIDENCE_STATUS_LABELS[evidence.status]}
                    </Badge>
                </td>
                <td className="py-3 px-4">
                    <span className="text-sm text-bureau-300">
                        {EVIDENCE_TYPE_LABELS[evidence.type]}
                    </span>
                </td>
                <td className="py-3 px-4">
                    <Link
                        href={`/cases/${evidence.caseId}`}
                        className="text-sm text-bureau-400 hover:text-accent-primary"
                    >
                        {linkedCase?.caseNumber}
                    </Link>
                </td>
                <td className="py-3 px-4">
                    <span className="text-sm text-bureau-400 truncate max-w-[150px] block">
                        {evidence.location.current}
                    </span>
                </td>
                <td className="py-3 px-4">
                    <button
                        onClick={() => setShowCustody(true)}
                        className="text-sm text-accent-primary hover:underline"
                    >
                        {evidence.chainOfCustody.length} entries
                    </button>
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
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowCustody(true)}>
                                <LinkIcon className="mr-2 h-4 w-4" />
                                Chain of Custody
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </td>
            </tr>

            <ChainOfCustodyModal
                evidence={evidence}
                open={showCustody}
                onClose={() => setShowCustody(false)}
            />
        </>
    );
}

export default function EvidencePage() {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    const stats = getEvidenceStats();

    const filteredEvidence = useMemo(() => {
        return seedEvidence.filter((e) => {
            const matchesSearch =
                searchQuery === "" ||
                e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.evidenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || e.status === statusFilter;
            const matchesType = typeFilter === "all" || e.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [searchQuery, statusFilter, typeFilter]);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-bureau-100 flex items-center gap-2">
                            <FileBox className="h-7 w-7 text-accent-primary" />
                            Evidence Locker
                        </h1>
                        <p className="text-bureau-400 mt-1">
                            {stats.total} items • {stats.pending} pending analysis • {stats.classified} classified
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-bureau-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "p-2 rounded-md transition-colors",
                                    viewMode === "grid"
                                        ? "bg-bureau-700 text-bureau-100"
                                        : "text-bureau-400 hover:text-bureau-200"
                                )}
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
                            >
                                <LayoutList className="h-4 w-4" />
                            </button>
                        </div>

                        <Button leftIcon={<Plus className="h-4 w-4" />}>
                            Log Evidence
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent-primary/20 rounded-lg">
                                <FileBox className="h-5 w-5 text-accent-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">Total Evidence</p>
                                <p className="text-xl font-bold text-bureau-100">{stats.total}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-warning/20 rounded-lg">
                                <Clock className="h-5 w-5 text-status-warning" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">Pending Analysis</p>
                                <p className="text-xl font-bold text-bureau-100">{stats.pending}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-secure/20 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-status-secure" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">Analyzed</p>
                                <p className="text-xl font-bold text-bureau-100">{stats.analyzed}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-critical/20 rounded-lg">
                                <Lock className="h-5 w-5 text-status-critical" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">Classified</p>
                                <p className="text-xl font-bold text-bureau-100">{stats.classified}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bureau-500" />
                        <Input
                            placeholder="Search evidence..."
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
                                    {EVIDENCE_STATUS_LABELS[status]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {typeOptions.slice(0, 10).map((type) => (
                                <SelectItem key={type} value={type}>
                                    {EVIDENCE_TYPE_LABELS[type]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {(statusFilter !== "all" || typeFilter !== "all" || searchQuery) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setStatusFilter("all");
                                setTypeFilter("all");
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
                            {filteredEvidence.map((evidence) => (
                                <EvidenceCard key={evidence.id} evidence={evidence} />
                            ))}
                            {filteredEvidence.length === 0 && (
                                <div className="col-span-full text-center py-12 text-bureau-500">
                                    <FileBox className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No evidence matches your filters</p>
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
                                                <th className="text-left py-3 px-4">Evidence</th>
                                                <th className="text-left py-3 px-4">Status</th>
                                                <th className="text-left py-3 px-4">Type</th>
                                                <th className="text-left py-3 px-4">Case</th>
                                                <th className="text-left py-3 px-4">Location</th>
                                                <th className="text-left py-3 px-4">Chain</th>
                                                <th className="text-left py-3 px-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredEvidence.map((evidence) => (
                                                <EvidenceTableRow key={evidence.id} evidence={evidence} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredEvidence.length === 0 && (
                                    <div className="text-center py-12 text-bureau-500">
                                        <FileBox className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p>No evidence matches your filters</p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
