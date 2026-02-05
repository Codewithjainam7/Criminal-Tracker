"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Phone,
    Mail,
    MapPin,
    Shield,
    Eye,
    Edit,
    FileText,
    Clock,
    Briefcase,
    AlertTriangle,
    CheckCircle,
    UserX,
    Grid3X3,
    LayoutList,
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
import { seedCases } from "@/data/seed";
import { cn, formatDate } from "@/lib/utils";

// Witness types
type WitnessStatus = "available" | "unavailable" | "protected" | "relocated" | "deceased";
type WitnessType = "eyewitness" | "character" | "expert" | "alibi" | "cooperating";

interface Witness {
    id: string;
    witnessNumber: string;
    firstName: string;
    lastName: string;
    fullName: string;
    type: WitnessType;
    status: WitnessStatus;
    caseId: string;
    contactPhone?: string;
    contactEmail?: string;
    address?: string;
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
        firstName: "Dr. Angela",
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
];

const STATUS_LABELS: Record<WitnessStatus, string> = {
    available: "Available",
    unavailable: "Unavailable",
    protected: "Protected",
    relocated: "Relocated",
    deceased: "Deceased",
};

const TYPE_LABELS: Record<WitnessType, string> = {
    eyewitness: "Eyewitness",
    character: "Character",
    expert: "Expert",
    alibi: "Alibi",
    cooperating: "Cooperating",
};

type ViewMode = "grid" | "table";

function WitnessCard({ witness }: { witness: Witness }) {
    const linkedCase = seedCases.find((c) => c.id === witness.caseId);

    return (
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
                        <div className="relative">
                            <Avatar name={witness.fullName} size="lg" />
                            {witness.isProtected && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-status-secure rounded-full flex items-center justify-center">
                                    <Shield className="h-3 w-3 text-white" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-mono text-bureau-500">{witness.witnessNumber}</p>
                            <h3 className="font-medium text-bureau-100 mt-0.5 group-hover:text-accent-primary transition-colors">
                                {witness.isProtected ? "PROTECTED IDENTITY" : witness.fullName}
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
                                    View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Statements
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                            variant={
                                witness.status === "available"
                                    ? "success"
                                    : witness.status === "protected"
                                        ? "info"
                                        : witness.status === "unavailable"
                                            ? "warning"
                                            : "default"
                            }
                            size="xs"
                        >
                            {STATUS_LABELS[witness.status]}
                        </Badge>
                        <Badge variant="outline" size="xs">
                            {TYPE_LABELS[witness.type]}
                        </Badge>
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
                            {witness.reliability} reliability
                        </Badge>
                    </div>

                    {/* Contact Info */}
                    {!witness.isProtected && (
                        <div className="space-y-1.5 text-xs text-bureau-400">
                            {witness.contactPhone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    <span>{witness.contactPhone}</span>
                                </div>
                            )}
                            {witness.contactEmail && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate">{witness.contactEmail}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-bureau-400">
                            <FileText className="h-3 w-3" />
                            <span>{witness.statements} statements</span>
                        </div>
                        <div className="flex items-center gap-1 text-bureau-500">
                            <Clock className="h-3 w-3" />
                            <span>Last: {formatDate(witness.lastContact)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-bureau-850/50 border-t border-bureau-700 flex items-center justify-between text-xs">
                    <Link
                        href={`/cases/${witness.caseId}`}
                        className="flex items-center gap-1 text-bureau-400 hover:text-accent-primary"
                    >
                        <Briefcase className="h-3 w-3" />
                        <span>{linkedCase?.caseNumber || "Unknown Case"}</span>
                    </Link>
                </div>
            </Card>
        </motion.div>
    );
}

export default function WitnessesPage() {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    const filteredWitnesses = useMemo(() => {
        return seedWitnesses.filter((w) => {
            const matchesSearch =
                searchQuery === "" ||
                w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                w.witnessNumber.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || w.status === statusFilter;
            const matchesType = typeFilter === "all" || w.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [searchQuery, statusFilter, typeFilter]);

    const stats = {
        total: seedWitnesses.length,
        available: seedWitnesses.filter((w) => w.status === "available").length,
        protected: seedWitnesses.filter((w) => w.isProtected).length,
    };

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
                            {stats.total} witnesses • {stats.available} available • {stats.protected} protected
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
                            Add Witness
                        </Button>
                    </div>
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
                                <p className="text-xl font-bold text-bureau-100">
                                    {seedWitnesses.filter((w) => w.status === "unavailable").length}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bureau-500" />
                        <Input
                            placeholder="Search witnesses..."
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

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="eyewitness">Eyewitness</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                            <SelectItem value="character">Character</SelectItem>
                            <SelectItem value="cooperating">Cooperating</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Grid View */}
                <AnimatePresence mode="wait">
                    {viewMode === "grid" ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {filteredWitnesses.map((witness) => (
                                <WitnessCard key={witness.id} witness={witness} />
                            ))}
                            {filteredWitnesses.length === 0 && (
                                <div className="col-span-full text-center py-12 text-bureau-500">
                                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No witnesses match your filters</p>
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
                                                <th className="text-left py-3 px-4">Witness</th>
                                                <th className="text-left py-3 px-4">Status</th>
                                                <th className="text-left py-3 px-4">Type</th>
                                                <th className="text-left py-3 px-4">Reliability</th>
                                                <th className="text-left py-3 px-4">Statements</th>
                                                <th className="text-left py-3 px-4">Last Contact</th>
                                                <th className="text-left py-3 px-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredWitnesses.map((witness) => (
                                                <tr
                                                    key={witness.id}
                                                    className="border-b border-bureau-700 hover:bg-bureau-800/50"
                                                >
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar name={witness.fullName} size="sm" />
                                                            <div>
                                                                <p className="font-mono text-xs text-bureau-500">
                                                                    {witness.witnessNumber}
                                                                </p>
                                                                <p className="text-sm text-bureau-100">
                                                                    {witness.isProtected ? "PROTECTED" : witness.fullName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge
                                                            variant={
                                                                witness.status === "available" ? "success" :
                                                                    witness.status === "protected" ? "info" : "warning"
                                                            }
                                                            size="xs"
                                                        >
                                                            {STATUS_LABELS[witness.status]}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-bureau-300">
                                                        {TYPE_LABELS[witness.type]}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge
                                                            variant={
                                                                witness.reliability === "high" ? "success" :
                                                                    witness.reliability === "medium" ? "warning" : "danger"
                                                            }
                                                            size="xs"
                                                        >
                                                            {witness.reliability}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-bureau-400">
                                                        {witness.statements}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-bureau-400">
                                                        {formatDate(witness.lastContact)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Button variant="ghost" size="icon-sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
