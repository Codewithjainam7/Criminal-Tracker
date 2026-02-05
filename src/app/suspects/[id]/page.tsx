"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    UserSearch,
    ArrowLeft,
    Edit,
    AlertTriangle,
    MapPin,
    Calendar,
    Scale,
    Shield,
    FileText,
    Users,
    Briefcase,
    MoreHorizontal,
    Fingerprint,
    User,
    Clock,
    ChevronRight,
    Hash,
    Ruler,
    Weight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSuspectById, seedCases, seedSuspects } from "@/data/seed";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import {
    SUSPECT_STATUS_LABELS,
    RISK_LEVEL_LABELS,
} from "@/types/suspect";

export default function SuspectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const suspect = getSuspectById(id);

    if (!suspect) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <UserSearch className="h-16 w-16 text-bureau-600 mb-4" />
                    <h1 className="text-xl font-semibold text-bureau-200">Suspect Not Found</h1>
                    <p className="text-bureau-500 mt-2">The suspect profile doesn't exist.</p>
                    <Button variant="outline" className="mt-6" onClick={() => router.push("/suspects")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Suspects
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const linkedCases = (suspect.linkedCaseIds || [])
        .map((caseId) => seedCases.find((c) => c.id === caseId))
        .filter(Boolean);

    const criminalHistory = suspect.criminalHistory || [];
    const knownAssociates = suspect.knownAssociates || [];
    const aliases = suspect.aliases || [];
    const modusOperandi = suspect.modusOperandi || [];

    // Get associate details from other suspects
    const associateDetails = knownAssociates
        .map((assocId) => seedSuspects.find((s) => s.id === assocId))
        .filter(Boolean);

    const isArmed = suspect.riskLevel === "extreme" || suspect.riskLevel === "high";

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push("/suspects")}
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Suspects
                            </Button>
                            <span className="text-bureau-600">/</span>
                            <span className="font-mono text-sm text-bureau-400">
                                {suspect.suspectNumber}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-bureau-100">
                            {suspect.fullName}
                        </h1>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <Badge
                                variant={
                                    suspect.status === "wanted"
                                        ? "solid-danger"
                                        : suspect.status === "apprehended"
                                            ? "success"
                                            : suspect.status === "cleared"
                                                ? "info"
                                                : "default"
                                }
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
                                                : "risk-low"
                                }
                            >
                                {RISK_LEVEL_LABELS[suspect.riskLevel]} Risk
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" leftIcon={<FileText className="h-4 w-4" />}>
                            Generate Dossier
                        </Button>
                        <Button leftIcon={<Edit className="h-4 w-4" />}>
                            Edit Profile
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Issue BOLO Alert</DropdownMenuItem>
                                <DropdownMenuItem>Add to Watchlist</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-status-critical">
                                    Mark as Apprehended
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-critical/20 rounded-lg">
                                <Scale className="h-5 w-5 text-status-critical" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Prior Offenses</p>
                                <p className="font-medium text-bureau-100">{criminalHistory.length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent-primary/20 rounded-lg">
                                <Briefcase className="h-5 w-5 text-accent-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Linked Cases</p>
                                <p className="font-medium text-bureau-100">{linkedCases.length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-warning/20 rounded-lg">
                                <Users className="h-5 w-5 text-status-warning" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Known Associates</p>
                                <p className="font-medium text-bureau-100">{knownAssociates.length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-bureau-700 rounded-lg">
                                <Clock className="h-5 w-5 text-bureau-400" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Last Updated</p>
                                <p className="font-medium text-bureau-100">{formatRelativeTime(suspect.updatedAt)}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="overview">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="criminal-history">Criminal History</TabsTrigger>
                                <TabsTrigger value="cases">Linked Cases</TabsTrigger>
                                <TabsTrigger value="associates">Associates</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-4 space-y-4">
                                {/* Physical Description */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Physical Description
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-bureau-500">Age</p>
                                                <p className="text-bureau-100">{suspect.age || "Unknown"}</p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500">Gender</p>
                                                <p className="text-bureau-100 capitalize">{suspect.gender}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div>
                                                    <p className="text-bureau-500">Height</p>
                                                    <p className="text-bureau-100">
                                                        {suspect.physicalAttributes?.height
                                                            ? `${suspect.physicalAttributes.height} cm`
                                                            : "Unknown"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div>
                                                    <p className="text-bureau-500">Weight</p>
                                                    <p className="text-bureau-100">
                                                        {suspect.physicalAttributes?.weight
                                                            ? `${suspect.physicalAttributes.weight} kg`
                                                            : "Unknown"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500">Hair</p>
                                                <p className="text-bureau-100 capitalize">
                                                    {suspect.physicalAttributes?.hairColor || "Unknown"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500">Eyes</p>
                                                <p className="text-bureau-100 capitalize">
                                                    {suspect.physicalAttributes?.eyeColor || "Unknown"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500">Build</p>
                                                <p className="text-bureau-100 capitalize">
                                                    {suspect.physicalAttributes?.build || "Unknown"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500">Nationality</p>
                                                <p className="text-bureau-100">{suspect.nationality || "Unknown"}</p>
                                            </div>
                                        </div>
                                        {suspect.physicalAttributes?.distinguishingFeatures &&
                                            suspect.physicalAttributes.distinguishingFeatures.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-bureau-700">
                                                    <p className="text-bureau-500 text-sm mb-2">Distinguishing Features</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {suspect.physicalAttributes.distinguishingFeatures.map((feature, idx) => (
                                                            <Badge key={idx} variant="outline" size="sm">
                                                                {feature}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                    </CardContent>
                                </Card>

                                {/* Aliases */}
                                {aliases.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Hash className="h-4 w-4" />
                                                Known Aliases
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {aliases.map((alias) => (
                                                    <Badge key={alias} variant="default">
                                                        "{alias}"
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Modus Operandi */}
                                {modusOperandi.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Fingerprint className="h-4 w-4" />
                                                Modus Operandi
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {modusOperandi.map((mo) => (
                                                    <Badge key={mo} variant="info">
                                                        {mo}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Last Known Address */}
                                {suspect.lastKnownAddress && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Last Known Location
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-bureau-200">
                                                {suspect.lastKnownAddress.street}, {suspect.lastKnownAddress.city}, {suspect.lastKnownAddress.state} {suspect.lastKnownAddress.zipCode}
                                            </p>
                                            {suspect.lastKnownAddress.isVerified !== undefined && (
                                                <p className="text-sm text-bureau-500 mt-1">
                                                    {suspect.lastKnownAddress.isVerified ? "✓ Verified" : "⚠ Unverified"}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Notes */}
                                {suspect.notes && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Notes
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-bureau-300 text-sm">{suspect.notes}</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="criminal-history" className="mt-4">
                                <Card>
                                    <CardContent className="py-6">
                                        {criminalHistory.length > 0 ? (
                                            <div className="space-y-4">
                                                {criminalHistory.map((record, idx) => (
                                                    <div key={record.id} className="flex gap-4 pb-4 border-b border-bureau-700 last:border-0">
                                                        <div className="flex flex-col items-center">
                                                            <div className={cn(
                                                                "w-3 h-3 rounded-full",
                                                                record.outcome === "Convicted" ? "bg-status-critical" :
                                                                    record.outcome === "Acquitted" ? "bg-status-secure" : "bg-status-warning"
                                                            )} />
                                                            {idx < criminalHistory.length - 1 && (
                                                                <div className="w-0.5 h-full bg-bureau-700 mt-1" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium text-bureau-100">
                                                                    {record.offense}
                                                                </p>
                                                                <Badge
                                                                    variant={
                                                                        record.outcome === "Convicted" ? "danger" :
                                                                            record.outcome === "Acquitted" ? "success" : "warning"
                                                                    }
                                                                    size="xs"
                                                                >
                                                                    {record.outcome}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-bureau-400 mt-1">
                                                                {record.location}
                                                            </p>
                                                            <p className="text-xs text-bureau-500 mt-1">
                                                                {formatDate(record.date)}
                                                                {record.sentence && ` • Sentence: ${record.sentence}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Scale className="h-10 w-10 text-bureau-600 mx-auto mb-3" />
                                                <p className="text-bureau-400">No criminal history on record</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="cases" className="mt-4">
                                <div className="space-y-3">
                                    {linkedCases.map((caseData) => (
                                        <Link key={caseData!.id} href={`/cases/${caseData!.id}`}>
                                            <Card hover className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-mono text-xs text-bureau-500">{caseData!.caseNumber}</p>
                                                        <p className="font-medium text-bureau-100 mt-0.5">{caseData!.title}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge
                                                                variant={
                                                                    caseData!.status === "active" ? "case-active" :
                                                                        caseData!.status === "closed" ? "case-closed" : "case-pending"
                                                                }
                                                                size="xs"
                                                            >
                                                                {caseData!.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-bureau-500" />
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                    {linkedCases.length === 0 && (
                                        <Card className="p-8 text-center">
                                            <Briefcase className="h-10 w-10 text-bureau-600 mx-auto mb-3" />
                                            <p className="text-bureau-400">No linked cases</p>
                                        </Card>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="associates" className="mt-4">
                                <Card>
                                    <CardContent className="py-6">
                                        {associateDetails.length > 0 ? (
                                            <div className="space-y-3">
                                                {associateDetails.map((associate) => (
                                                    <Link key={associate!.id} href={`/suspects/${associate!.id}`}>
                                                        <div className="flex items-center gap-4 p-3 bg-bureau-800/50 rounded-lg hover:bg-bureau-700/50 transition-colors">
                                                            <Avatar name={associate!.fullName} size="sm" />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-bureau-100">{associate!.fullName}</p>
                                                                <p className="text-sm text-bureau-500">{associate!.suspectNumber}</p>
                                                            </div>
                                                            <Badge
                                                                variant={
                                                                    associate!.status === "wanted" ? "danger" :
                                                                        associate!.status === "apprehended" ? "warning" : "default"
                                                                }
                                                                size="xs"
                                                            >
                                                                {SUSPECT_STATUS_LABELS[associate!.status]}
                                                            </Badge>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Users className="h-10 w-10 text-bureau-600 mx-auto mb-3" />
                                                <p className="text-bureau-400">No known associates</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Column - Photo and Quick Info */}
                    <div className="space-y-6">
                        {/* Mugshot */}
                        <Card>
                            <CardContent className="py-6">
                                <div className="aspect-[3/4] bg-bureau-800 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                                    {suspect.mugshot ? (
                                        <div className="w-full h-full flex items-center justify-center text-bureau-600">
                                            <UserSearch className="h-20 w-20" />
                                        </div>
                                    ) : (
                                        <UserSearch className="h-20 w-20 text-bureau-600" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className="font-semibold text-bureau-100">{suspect.fullName}</h3>
                                    <p className="text-sm text-bureau-500">{suspect.suspectNumber}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Warning */}
                        {(isArmed || suspect.riskLevel === "extreme") && (
                            <Card className="bg-status-critical/10 border-status-critical/30">
                                <CardContent className="py-4">
                                    <div className="flex items-center gap-3 text-status-critical">
                                        <AlertTriangle className="h-5 w-5" />
                                        <div>
                                            <p className="font-medium">CAUTION</p>
                                            <p className="text-sm">
                                                {suspect.riskLevel === "extreme" ? "Extreme risk level. " : ""}
                                                {suspect.riskLevel === "high" ? "High risk individual." : ""}
                                                {suspect.gangAffiliation && `Gang affiliation: ${suspect.gangAffiliation}`}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Issue BOLO Alert
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    Link to Case
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <Users className="h-4 w-4 mr-2" />
                                    Add Associate
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Report
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Dates */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Record Info</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-bureau-500">Created</span>
                                    <span className="text-bureau-300">{formatDate(suspect.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-bureau-500">Last Updated</span>
                                    <span className="text-bureau-300">{formatDate(suspect.updatedAt)}</span>
                                </div>
                                {suspect.gangAffiliation && (
                                    <div className="flex justify-between">
                                        <span className="text-bureau-500">Gang Affiliation</span>
                                        <span className="text-bureau-300">{suspect.gangAffiliation}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
