"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Plus,
    Search,
    Phone,
    Mail,
    Shield,
    Eye,
    FileText,
    Clock,
    Briefcase,
    CheckCircle,
    UserX,
    ChevronDown,
    ChevronRight,
    X,
    MessageSquare,
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
import { seedCases } from "@/data/seed";
import { cn, formatDate } from "@/lib/utils";
import { CASE_STATUS_LABELS, CASE_PRIORITY_LABELS } from "@/types/case";

// Simplified Witness type for this page
interface Witness {
    id: string;
    witnessNumber: string;
    firstName: string;
    lastName: string;
    fullName: string;
    type: "eyewitness" | "character" | "expert" | "alibi" | "cooperating";
    status: "available" | "unavailable" | "protected" | "relocated" | "deceased";
    caseId: string;
    contactPhone?: string;
    contactEmail?: string;
    isProtected: boolean;
    reliability: "high" | "medium" | "low";
    statements: number;
    lastContact: Date;
    notes?: string;
}

// Seed witnesses
const seedWitnesses: Witness[] = [
    {
        id: "witness-001",
        witnessNumber: "WIT-2026-00001",
        firstName: "Maria",
        lastName: "Santos",
        fullName: "Maria Santos",
        type: "eyewitness",
        status: "available",
        caseId: "case-001",
        contactPhone: "+1-555-0134",
        contactEmail: "m.santos@email.com",
        isProtected: false,
        reliability: "high",
        statements: 3,
        lastContact: new Date("2026-01-25"),
    },
    {
        id: "witness-002",
        witnessNumber: "WIT-2026-00002",
        firstName: "Robert",
        lastName: "Chen",
        fullName: "Robert Chen",
        type: "expert",
        status: "available",
        caseId: "case-003",
        contactPhone: "+1-555-0189",
        contactEmail: "r.chen@techsecurity.com",
        isProtected: false,
        reliability: "high",
        statements: 2,
        lastContact: new Date("2026-01-22"),
        notes: "Cybersecurity expert, former FBI",
    },
    {
        id: "witness-003",
        witnessNumber: "WIT-2026-00003",
        firstName: "James",
        lastName: "Wilson",
        fullName: "James Wilson",
        type: "cooperating",
        status: "protected",
        caseId: "case-002",
        isProtected: true,
        reliability: "medium",
        statements: 5,
        lastContact: new Date("2026-01-28"),
        notes: "Key informant, identity protected",
    },
    {
        id: "witness-004",
        witnessNumber: "WIT-2026-00004",
        firstName: "Emily",
        lastName: "Brooks",
        fullName: "Emily Brooks",
        type: "eyewitness",
        status: "available",
        caseId: "case-001",
        contactPhone: "+1-555-0156",
        isProtected: false,
        reliability: "high",
        statements: 2,
        lastContact: new Date("2026-01-20"),
    },
    {
        id: "witness-005",
        witnessNumber: "WIT-2026-00005",
        firstName: "David",
        lastName: "Kim",
        fullName: "David Kim",
        type: "character",
        status: "available",
        caseId: "case-005",
        contactPhone: "+1-555-0198",
        contactEmail: "d.kim@email.com",
        isProtected: false,
        reliability: "medium",
        statements: 1,
        lastContact: new Date("2026-01-15"),
    },
    {
        id: "witness-006",
        witnessNumber: "WIT-2026-00006",
        firstName: "Samantha",
        lastName: "Price",
        fullName: "Samantha Price",
        type: "alibi",
        status: "unavailable",
        caseId: "case-004",
        isProtected: false,
        reliability: "low",
        statements: 1,
        lastContact: new Date("2026-01-10"),
        notes: "Relocated overseas, difficult to contact",
    },
    {
        id: "witness-007",
        witnessNumber: "WIT-2026-00007",
        firstName: "Michael",
        lastName: "Torres",
        fullName: "Michael Torres",
        type: "eyewitness",
        status: "protected",
        caseId: "case-006",
        isProtected: true,
        reliability: "high",
        statements: 4,
        lastContact: new Date("2026-01-27"),
        notes: "Under witness protection program",
    },
    {
        id: "witness-008",
        witnessNumber: "WIT-2026-00008",
        firstName: "Angela",
        lastName: "Martinez",
        fullName: "Dr. Angela Martinez",
        type: "expert",
        status: "available",
        caseId: "case-007",
        contactPhone: "+1-555-0211",
        contactEmail: "a.martinez@forensics.gov",
        isProtected: false,
        reliability: "high",
        statements: 2,
        lastContact: new Date("2026-01-26"),
        notes: "Forensic pathologist",
    },
    {
        id: "witness-009",
        witnessNumber: "WIT-2026-00009",
        firstName: "Linda",
        lastName: "Park",
        fullName: "Linda Park",
        type: "eyewitness",
        status: "available",
        caseId: "case-002",
        contactPhone: "+1-555-0223",
        isProtected: false,
        reliability: "medium",
        statements: 2,
        lastContact: new Date("2026-01-24"),
    },
    {
        id: "witness-010",
        witnessNumber: "WIT-2026-00010",
        firstName: "Thomas",
        lastName: "Baker",
        fullName: "Thomas Baker",
        type: "character",
        status: "available",
        caseId: "case-003",
        contactPhone: "+1-555-0245",
        contactEmail: "t.baker@email.com",
        isProtected: false,
        reliability: "high",
        statements: 1,
        lastContact: new Date("2026-01-18"),
    },
];

const STATUS_LABELS = {
    available: "Available",
    unavailable: "Unavailable",
    protected: "Protected",
    relocated: "Relocated",
    deceased: "Deceased",
};

const TYPE_LABELS = {
    eyewitness: "Eyewitness",
    character: "Character",
    expert: "Expert",
    alibi: "Alibi",
    cooperating: "Cooperating",
};

// Compact Witness Item for accordion
function WitnessItem({ witness }: { witness: Witness }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-bureau-800/30 rounded-lg border border-bureau-700 hover:border-bureau-600 transition-colors group">
            <div className="relative flex-shrink-0">
                <Avatar name={witness.fullName} size="md" />
                {witness.isProtected && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-status-secure rounded-full flex items-center justify-center">
                        <Shield className="h-2.5 w-2.5 text-white" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <Link
                        href={`/witnesses/${witness.id}`}
                        className="text-sm font-medium text-bureau-100 hover:text-accent-primary truncate"
                    >
                        {witness.isProtected ? "PROTECTED IDENTITY" : witness.fullName}
                    </Link>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-bureau-500">{witness.witnessNumber}</span>
                    <span className="text-xs text-bureau-600">•</span>
                    <span className="text-xs text-bureau-400">{TYPE_LABELS[witness.type]}</span>
                    {!witness.isProtected && witness.contactPhone && (
                        <>
                            <span className="text-xs text-bureau-600">•</span>
                            <span className="text-xs text-bureau-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {witness.contactPhone}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                <Badge
                    variant={
                        witness.reliability === "high"
                            ? "success"
                            : witness.reliability === "medium"
                                ? "warning"
                                : "danger"
                    }
                    size="xs"
                >
                    {witness.reliability}
                </Badge>
                <Badge
                    variant={
                        witness.status === "available"
                            ? "success"
                            : witness.status === "protected"
                                ? "info"
                                : "warning"
                    }
                    size="xs"
                >
                    {STATUS_LABELS[witness.status]}
                </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-bureau-500 flex-shrink-0">
                <FileText className="h-3 w-3" />
                <span>{witness.statements}</span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/witnesses/${witness.id}`}>
                    <button className="p-1.5 hover:bg-bureau-700 rounded text-bureau-400 hover:text-bureau-100">
                        <Eye className="h-4 w-4" />
                    </button>
                </Link>
                <button className="p-1.5 hover:bg-bureau-700 rounded text-bureau-400 hover:text-bureau-100">
                    <MessageSquare className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

// Case Section with Witnesses (Accordion)
function CaseWitnessSection({
    caseData,
    witnesses,
    defaultExpanded = false
}: {
    caseData: typeof seedCases[0];
    witnesses: Witness[];
    defaultExpanded?: boolean;
}) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const availableCount = witnesses.filter(w => w.status === "available").length;
    const protectedCount = witnesses.filter(w => w.isProtected).length;
    const totalStatements = witnesses.reduce((acc, w) => acc + w.statements, 0);

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
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                        <p className="text-lg font-bold text-bureau-100">{witnesses.length}</p>
                        <p className="text-xs text-bureau-500">Witnesses</p>
                    </div>

                    <div className="text-right">
                        <p className="text-lg font-bold text-bureau-100">{totalStatements}</p>
                        <p className="text-xs text-bureau-500">Statements</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {availableCount > 0 && (
                            <div className="flex items-center gap-1 text-status-secure">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-xs">{availableCount}</span>
                            </div>
                        )}
                        {protectedCount > 0 && (
                            <div className="flex items-center gap-1 text-status-info">
                                <Shield className="h-4 w-4" />
                                <span className="text-xs">{protectedCount}</span>
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

            {/* Witness List - Expandable */}
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
                            {witnesses.map((witness) => (
                                <WitnessItem key={witness.id} witness={witness} />
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
                                    Add Witness
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}

export default function WitnessesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const stats = {
        total: seedWitnesses.length,
        available: seedWitnesses.filter((w) => w.status === "available").length,
        protected: seedWitnesses.filter((w) => w.isProtected).length,
        unavailable: seedWitnesses.filter((w) => w.status === "unavailable").length,
    };

    // Group witnesses by case
    const witnessesByCase = useMemo(() => {
        const grouped = new Map<string, Witness[]>();

        seedWitnesses.forEach((witness) => {
            // Apply filters
            const matchesSearch =
                searchQuery === "" ||
                witness.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                witness.witnessNumber.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || witness.status === statusFilter;

            if (matchesSearch && matchesStatus) {
                const caseId = witness.caseId;
                if (!grouped.has(caseId)) {
                    grouped.set(caseId, []);
                }
                grouped.get(caseId)!.push(witness);
            }
        });

        return grouped;
    }, [searchQuery, statusFilter]);

    // Get cases that have witnesses
    const casesWithWitnesses = useMemo(() => {
        return seedCases
            .filter((c) => witnessesByCase.has(c.id))
            .sort((a, b) => {
                // Sort by priority first, then by number of witnesses
                const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                if (priorityDiff !== 0) return priorityDiff;
                return (witnessesByCase.get(b.id)?.length || 0) - (witnessesByCase.get(a.id)?.length || 0);
            });
    }, [witnessesByCase]);

    const totalFilteredWitnesses = Array.from(witnessesByCase.values()).reduce((acc, items) => acc + items.length, 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-bureau-100 flex items-center gap-2">
                            <Users className="h-7 w-7 text-accent-primary" />
                            Witness Management
                        </h1>
                        <p className="text-bureau-400 mt-1">
                            {stats.total} witnesses organized across {seedCases.length} cases
                        </p>
                    </div>

                    <Button leftIcon={<Plus className="h-4 w-4" />}>
                        Add Witness
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent-primary/20 rounded-lg">
                                <Users className="h-5 w-5 text-accent-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">Total Witnesses</p>
                                <p className="text-xl font-bold text-bureau-100">{stats.total}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-secure/20 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-status-secure" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">Available</p>
                                <p className="text-xl font-bold text-bureau-100">{stats.available}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-info/20 rounded-lg">
                                <Shield className="h-5 w-5 text-status-info" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">Protected</p>
                                <p className="text-xl font-bold text-bureau-100">{stats.protected}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-warning/20 rounded-lg">
                                <UserX className="h-5 w-5 text-status-warning" />
                            </div>
                            <div>
                                <p className="text-sm text-bureau-400">Unavailable</p>
                                <p className="text-xl font-bold text-bureau-100">{stats.unavailable}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bureau-500" />
                        <Input
                            placeholder="Search witnesses by name or number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="protected">Protected</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
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
                        Showing {totalFilteredWitnesses} witnesses in {casesWithWitnesses.length} cases
                    </div>
                </div>

                {/* Cases with Witnesses - Accordion Style */}
                <div className="space-y-3">
                    {casesWithWitnesses.map((caseData, index) => (
                        <CaseWitnessSection
                            key={caseData.id}
                            caseData={caseData}
                            witnesses={witnessesByCase.get(caseData.id) || []}
                            defaultExpanded={index === 0}
                        />
                    ))}

                    {casesWithWitnesses.length === 0 && (
                        <Card className="p-12 text-center">
                            <Users className="h-12 w-12 mx-auto mb-3 text-bureau-500 opacity-50" />
                            <p className="text-bureau-400">No witnesses match your filters</p>
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
