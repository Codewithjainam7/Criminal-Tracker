"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileBox,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Clock,
    MapPin,
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
    ChevronDown,
    CheckCircle,
    AlertCircle,
    Lock,
    Briefcase,
    User,
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
import { CASE_STATUS_LABELS, CASE_PRIORITY_LABELS } from "@/types/case";

// Icon mapping for evidence types
const typeIcons: Record<EvidenceType, React.ReactNode> = {
    ballistics: <Shield className="h-4 w-4" />,
    dna: <Fingerprint className="h-4 w-4" />,
    fingerprint: <Fingerprint className="h-4 w-4" />,
    document: <FileText className="h-4 w-4" />,
    photo: <Camera className="h-4 w-4" />,
    video: <Film className="h-4 w-4" />,
    audio: <Film className="h-4 w-4" />,
    digital_storage: <HardDrive className="h-4 w-4" />,
    drugs: <Pill className="h-4 w-4" />,
    weapon: <Shield className="h-4 w-4" />,
    clothing: <User className="h-4 w-4" />,
    financial: <DollarSign className="h-4 w-4" />,
    other: <FileBox className="h-4 w-4" />,
};

// Chain of Custody Modal
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

                    <div className="relative max-h-[400px] overflow-y-auto">
                        {evidence.chainOfCustody.map((entry, index) => {
                            const handler = seedUsers.find((u) => u.id === entry.handledBy);
                            const receiver = seedUsers.find((u) => u.id === entry.receivedBy);

                            return (
                                <div key={entry.id} className="relative pl-8 pb-4 last:pb-0">
                                    {index < evidence.chainOfCustody.length - 1 && (
                                        <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-bureau-700" />
                                    )}
                                    <div
                                        className={cn(
                                            "absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center",
                                            entry.verified
                                                ? "bg-status-secure/20 text-status-secure"
                                                : "bg-status-warning/20 text-status-warning"
                                        )}
                                    >
                                        {entry.verified ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                    </div>
                                    <div className="bg-bureau-800/30 rounded-lg p-3 border border-bureau-700">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="font-medium text-bureau-100 capitalize text-sm">
                                                {entry.action.replace("_", " ")}
                                            </p>
                                            <span className="text-xs text-bureau-500">
                                                {new Date(entry.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-bureau-500">From: </span>
                                                <span className="text-bureau-300">{entry.fromLocation}</span>
                                            </div>
                                            <div>
                                                <span className="text-bureau-500">To: </span>
                                                <span className="text-bureau-300">{entry.toLocation}</span>
                                            </div>
                                        </div>
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

// Compact Evidence Item within a case
function EvidenceItem({ evidence }: { evidence: (typeof seedEvidence)[0] }) {
    const [showCustody, setShowCustody] = useState(false);

    return (
        <>
            <div className="flex items-center gap-3 p-3 bg-bureau-800/30 rounded-lg border border-bureau-700 hover:border-bureau-600 transition-colors group">
                <div
                    className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        evidence.isClassified
                            ? "bg-status-critical/20 text-status-critical"
                            : "bg-accent-primary/20 text-accent-primary"
                    )}
                >
                    {typeIcons[evidence.type]}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/evidence/${evidence.id}`}
                            className="text-sm font-medium text-bureau-100 hover:text-accent-primary truncate"
                        >
                            {evidence.name}
                        </Link>
                        {evidence.isClassified && <Lock className="h-3 w-3 text-status-critical flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono text-bureau-500">{evidence.evidenceNumber}</span>
                        <span className="text-xs text-bureau-600">•</span>
                        <span className="text-xs text-bureau-400">{EVIDENCE_TYPE_LABELS[evidence.type]}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
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
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/evidence/${evidence.id}`}>
                        <button className="p-1.5 hover:bg-bureau-700 rounded text-bureau-400 hover:text-bureau-100">
                            <Eye className="h-4 w-4" />
                        </button>
                    </Link>
                    <button
                        onClick={() => setShowCustody(true)}
                        className="p-1.5 hover:bg-bureau-700 rounded text-bureau-400 hover:text-bureau-100"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <ChainOfCustodyModal
                evidence={evidence}
                open={showCustody}
                onClose={() => setShowCustody(false)}
            />
        </>
    );
}

// Case Section with Evidence
function CaseEvidenceSection({
    caseData,
    evidenceItems,
    defaultExpanded = false
}: {
    caseData: typeof seedCases[0];
    evidenceItems: typeof seedEvidence;
    defaultExpanded?: boolean;
}) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const leadInvestigator = seedUsers.find((u) => u.id === caseData.leadInvestigatorId);

    const analyzedCount = evidenceItems.filter(e => e.status === "analyzed").length;
    const pendingCount = evidenceItems.filter(e => e.status === "pending_analysis" || e.status === "under_analysis").length;

    return (
        <Card className="overflow-hidden">
            {/* Case Header - Clickable */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center gap-4 hover:bg-bureau-800/50 transition-colors"
            >
                <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                    caseData.priority === "critical" ? "bg-status-critical/20" :
                        caseData.priority === "high" ? "bg-status-warning/20" :
                            "bg-accent-primary/20"
                )}>
                    <Briefcase className={cn(
                        "h-6 w-6",
                        caseData.priority === "critical" ? "text-status-critical" :
                            caseData.priority === "high" ? "text-status-warning" :
                                "text-accent-primary"
                    )} />
                </div>

                <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-bureau-500">{caseData.caseNumber}</span>
                        <Badge
                            variant={
                                caseData.priority === "critical"
                                    ? "priority-critical"
                                    : caseData.priority === "high"
                                        ? "priority-high"
                                        : "priority-medium"
                            }
                            size="xs"
                        >
                            {CASE_PRIORITY_LABELS[caseData.priority]}
                        </Badge>
                        <Badge
                            variant={
                                caseData.status === "active"
                                    ? "case-active"
                                    : caseData.status === "closed"
                                        ? "case-closed"
                                        : "default"
                            }
                            size="xs"
                        >
                            {CASE_STATUS_LABELS[caseData.status]}
                        </Badge>
                    </div>
                    <h3 className="text-base font-medium text-bureau-100 mt-1 truncate">
                        {caseData.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-bureau-400">
                            Lead: {leadInvestigator?.fullName || "Unassigned"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                        <p className="text-lg font-bold text-bureau-100">{evidenceItems.length}</p>
                        <p className="text-xs text-bureau-500">Evidence</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {analyzedCount > 0 && (
                            <div className="flex items-center gap-1 text-status-secure">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-xs">{analyzedCount}</span>
                            </div>
                        )}
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-1 text-status-warning">
                                <Clock className="h-4 w-4" />
                                <span className="text-xs">{pendingCount}</span>
                            </div>
                        )}
                    </div>

                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="h-5 w-5 text-bureau-400" />
                    </motion.div>
                </div>
            </button>

            {/* Evidence List - Expandable */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-bureau-700 p-4 space-y-2 bg-bureau-850/50">
                            {evidenceItems.map((evidence) => (
                                <EvidenceItem key={evidence.id} evidence={evidence} />
                            ))}

                            <div className="flex items-center justify-between pt-3 border-t border-bureau-700 mt-3">
                                <Link
                                    href={`/cases/${caseData.id}`}
                                    className="text-xs text-accent-primary hover:underline flex items-center gap-1"
                                >
                                    View Full Case Details
                                    <ChevronRight className="h-3 w-3" />
                                </Link>
                                <Button variant="outline" size="sm" leftIcon={<Plus className="h-3 w-3" />}>
                                    Add Evidence
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}

export default function EvidencePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const stats = getEvidenceStats();

    // Group evidence by case
    const evidenceByCase = useMemo(() => {
        const grouped = new Map<string, typeof seedEvidence>();

        seedEvidence.forEach((evidence) => {
            // Apply filters
            const matchesSearch =
                searchQuery === "" ||
                evidence.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                evidence.evidenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || evidence.status === statusFilter;

            if (matchesSearch && matchesStatus) {
                const caseId = evidence.caseId;
                if (!grouped.has(caseId)) {
                    grouped.set(caseId, []);
                }
                grouped.get(caseId)!.push(evidence);
            }
        });

        return grouped;
    }, [searchQuery, statusFilter]);

    // Get cases that have evidence
    const casesWithEvidence = useMemo(() => {
        return seedCases
            .filter((c) => evidenceByCase.has(c.id))
            .sort((a, b) => {
                // Sort by priority first, then by number of evidence items
                const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                if (priorityDiff !== 0) return priorityDiff;
                return (evidenceByCase.get(b.id)?.length || 0) - (evidenceByCase.get(a.id)?.length || 0);
            });
    }, [evidenceByCase]);

    const totalFilteredEvidence = Array.from(evidenceByCase.values()).reduce((acc, items) => acc + items.length, 0);

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
                            {stats.total} total items organized across {seedCases.length} cases
                        </p>
                    </div>

                    <Button leftIcon={<Plus className="h-4 w-4" />}>
                        Log Evidence
                    </Button>
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
                            placeholder="Search evidence by name or number..."
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
                            <SelectItem value="collected">Collected</SelectItem>
                            <SelectItem value="stored">Stored</SelectItem>
                            <SelectItem value="pending_analysis">Pending Analysis</SelectItem>
                            <SelectItem value="under_analysis">Under Analysis</SelectItem>
                            <SelectItem value="analyzed">Analyzed</SelectItem>
                        </SelectContent>
                    </Select>

                    {(statusFilter !== "all" || searchQuery) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setStatusFilter("all");
                                setSearchQuery("");
                            }}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    )}

                    <div className="text-sm text-bureau-400 self-center">
                        Showing {totalFilteredEvidence} items in {casesWithEvidence.length} cases
                    </div>
                </div>

                {/* Cases with Evidence - Accordion Style */}
                <div className="space-y-3">
                    {casesWithEvidence.map((caseData, index) => (
                        <CaseEvidenceSection
                            key={caseData.id}
                            caseData={caseData}
                            evidenceItems={evidenceByCase.get(caseData.id) || []}
                            defaultExpanded={index === 0}
                        />
                    ))}

                    {casesWithEvidence.length === 0 && (
                        <Card className="p-12 text-center">
                            <FileBox className="h-12 w-12 mx-auto mb-3 text-bureau-500 opacity-50" />
                            <p className="text-bureau-400">No evidence matches your filters</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => {
                                    setStatusFilter("all");
                                    setSearchQuery("");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
