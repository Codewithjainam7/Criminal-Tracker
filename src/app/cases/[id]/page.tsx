"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Briefcase,
    ArrowLeft,
    Edit,
    FileText,
    Share2,
    MoreHorizontal,
    MapPin,
    Calendar,
    Clock,
    User,
    Users,
    UserSearch,
    FileBox,
    AlertTriangle,
    CheckCircle,
    Info,
    Plus,
    ChevronRight,
    MessageSquare,
    Shield,
    Link as LinkIcon,
    ExternalLink,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    getCaseById,
    seedUsers,
    seedSuspects,
    seedEvidence,
    seedCases,
} from "@/data/seed";
import { cn, formatRelativeTime, formatDate } from "@/lib/utils";
import {
    CASE_STATUS_LABELS,
    CASE_PRIORITY_LABELS,
    CASE_CATEGORY_LABELS,
} from "@/types/case";
import { SUSPECT_STATUS_LABELS, RISK_LEVEL_LABELS } from "@/types/suspect";
import { EVIDENCE_STATUS_LABELS, EVIDENCE_TYPE_LABELS } from "@/types/evidence";

export default function CaseDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const caseData = getCaseById(id);

    if (!caseData) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Briefcase className="h-16 w-16 text-bureau-600 mb-4" />
                    <h1 className="text-xl font-semibold text-bureau-200">Case Not Found</h1>
                    <p className="text-bureau-500 mt-2">The case you're looking for doesn't exist.</p>
                    <Button variant="outline" className="mt-6" onClick={() => router.push("/cases")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Cases
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const leadInvestigator = seedUsers.find((u) => u.id === caseData.leadInvestigatorId);
    const assignedOfficers = caseData.assignedOfficers
        .map((id) => seedUsers.find((u) => u.id === id))
        .filter(Boolean);
    const suspects = caseData.suspectIds
        .map((id) => seedSuspects.find((s) => s.id === id))
        .filter(Boolean);
    const evidence = seedEvidence.filter((e) => e.caseId === caseData.id);
    const linkedCases = caseData.linkedCaseIds
        .map((id) => seedCases.find((c) => c.id === id))
        .filter(Boolean);

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
                                onClick={() => router.push("/cases")}
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Cases
                            </Button>
                            <span className="text-bureau-600">/</span>
                            <span className="font-mono text-sm text-bureau-400">
                                {caseData.caseNumber}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-bureau-100">
                            {caseData.title}
                        </h1>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
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
                            >
                                {CASE_PRIORITY_LABELS[caseData.priority]}
                            </Badge>
                            <Badge variant="outline">
                                {CASE_CATEGORY_LABELS[caseData.category]}
                            </Badge>
                            {caseData.isClassified && (
                                <Badge variant="danger">
                                    <Shield className="h-3 w-3 mr-1" />
                                    {caseData.classificationLevel?.toUpperCase()}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" leftIcon={<FileText className="h-4 w-4" />}>
                            Generate Report
                        </Button>
                        <Button leftIcon={<Edit className="h-4 w-4" />}>
                            Edit Case
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share Case
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    Link Cases
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-status-critical">
                                    Close Case
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent-primary/20 rounded-lg">
                                <Calendar className="h-5 w-5 text-accent-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Opened</p>
                                <p className="font-medium text-bureau-100">{formatDate(caseData.dateOpened)}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-warning/20 rounded-lg">
                                <UserSearch className="h-5 w-5 text-status-warning" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Suspects</p>
                                <p className="font-medium text-bureau-100">{suspects.length} identified</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-secure/20 rounded-lg">
                                <FileBox className="h-5 w-5 text-status-secure" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Evidence</p>
                                <p className="font-medium text-bureau-100">{evidence.length} items</p>
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
                                <p className="font-medium text-bureau-100">{formatRelativeTime(caseData.dateUpdated)}</p>
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
                                <TabsTrigger value="suspects">Suspects ({suspects.length})</TabsTrigger>
                                <TabsTrigger value="evidence">Evidence ({evidence.length})</TabsTrigger>
                                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-4 space-y-4">
                                {/* Description */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Case Description</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-bureau-300 leading-relaxed">
                                            {caseData.description}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Location */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-bureau-500">Address</p>
                                                <p className="text-bureau-100">{caseData.location.address}</p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500">City</p>
                                                <p className="text-bureau-100">
                                                    {caseData.location.city}, {caseData.location.state} {caseData.location.zipCode}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500">Jurisdiction</p>
                                                <p className="text-bureau-100">{caseData.jurisdiction}</p>
                                            </div>
                                            {caseData.incidentDate && (
                                                <div>
                                                    <p className="text-bureau-500">Incident Date</p>
                                                    <p className="text-bureau-100">{formatDate(caseData.incidentDate)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Tags */}
                                {caseData.tags.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Tags</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {caseData.tags.map((tag) => (
                                                    <Badge key={tag} variant="outline">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Linked Cases */}
                                {linkedCases.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <LinkIcon className="h-4 w-4" />
                                                Linked Cases
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {linkedCases.map((linked) => (
                                                    <Link
                                                        key={linked!.id}
                                                        href={`/cases/${linked!.id}`}
                                                        className="flex items-center justify-between p-3 bg-bureau-800/50 rounded-lg hover:bg-bureau-800 transition-colors"
                                                    >
                                                        <div>
                                                            <p className="font-mono text-xs text-bureau-500">{linked!.caseNumber}</p>
                                                            <p className="text-sm text-bureau-100">{linked!.title}</p>
                                                        </div>
                                                        <ExternalLink className="h-4 w-4 text-bureau-500" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="suspects" className="mt-4">
                                <div className="space-y-3">
                                    {suspects.map((suspect) => (
                                        <Link key={suspect!.id} href={`/suspects/${suspect!.id}`}>
                                            <Card hover className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-lg bg-bureau-700 flex items-center justify-center">
                                                        <UserSearch className="h-7 w-7 text-bureau-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-medium text-bureau-100">{suspect!.fullName}</h4>
                                                            <Badge
                                                                variant={
                                                                    suspect!.status === "wanted" ? "danger" :
                                                                        suspect!.status === "apprehended" ? "success" : "default"
                                                                }
                                                                size="xs"
                                                            >
                                                                {SUSPECT_STATUS_LABELS[suspect!.status]}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-bureau-500 mt-0.5">
                                                            {suspect!.aliases[0] ? `"${suspect!.aliases[0]}"` : suspect!.suspectNumber}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge
                                                                variant={
                                                                    suspect!.riskLevel === "extreme" ? "risk-extreme" :
                                                                        suspect!.riskLevel === "high" ? "risk-high" : "risk-medium"
                                                                }
                                                                size="xs"
                                                            >
                                                                {RISK_LEVEL_LABELS[suspect!.riskLevel]}
                                                            </Badge>
                                                            {suspect!.modusOperandi.slice(0, 2).map((mo) => (
                                                                <Badge key={mo} variant="outline" size="xs">{mo}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-bureau-500" />
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                    {suspects.length === 0 && (
                                        <Card className="p-8 text-center">
                                            <UserSearch className="h-10 w-10 text-bureau-600 mx-auto mb-3" />
                                            <p className="text-bureau-400">No suspects linked to this case</p>
                                            <Button variant="outline" size="sm" className="mt-4">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Suspect
                                            </Button>
                                        </Card>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="evidence" className="mt-4">
                                <div className="space-y-3">
                                    {evidence.map((item) => (
                                        <Card key={item.id} hover className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-accent-primary/20 flex items-center justify-center">
                                                    <FileBox className="h-6 w-6 text-accent-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-mono text-xs text-bureau-500">{item.evidenceNumber}</p>
                                                        <Badge
                                                            variant={item.status === "analyzed" ? "success" : "warning"}
                                                            size="xs"
                                                        >
                                                            {EVIDENCE_STATUS_LABELS[item.status]}
                                                        </Badge>
                                                    </div>
                                                    <h4 className="font-medium text-bureau-100 mt-0.5">{item.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <Badge variant="outline" size="xs">
                                                            {EVIDENCE_TYPE_LABELS[item.type]}
                                                        </Badge>
                                                        <span className="text-xs text-bureau-500">
                                                            {item.chainOfCustody.length} custody records
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                    {evidence.length === 0 && (
                                        <Card className="p-8 text-center">
                                            <FileBox className="h-10 w-10 text-bureau-600 mx-auto mb-3" />
                                            <p className="text-bureau-400">No evidence logged for this case</p>
                                            <Button variant="outline" size="sm" className="mt-4">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Log Evidence
                                            </Button>
                                        </Card>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="timeline" className="mt-4">
                                <Card>
                                    <CardContent className="py-6">
                                        {caseData.timeline.length > 0 ? (
                                            <div className="space-y-4">
                                                {caseData.timeline.map((event, idx) => (
                                                    <div key={event.id} className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-3 h-3 rounded-full bg-accent-primary" />
                                                            {idx < caseData.timeline.length - 1 && (
                                                                <div className="w-0.5 h-full bg-bureau-700 mt-1" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 pb-4">
                                                            <p className="text-xs text-bureau-500">
                                                                {formatDate(event.timestamp)}
                                                            </p>
                                                            <h4 className="font-medium text-bureau-100 mt-1">
                                                                {event.title}
                                                            </h4>
                                                            {event.description && (
                                                                <p className="text-sm text-bureau-400 mt-1">
                                                                    {event.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Clock className="h-10 w-10 text-bureau-600 mx-auto mb-3" />
                                                <p className="text-bureau-400">No timeline events recorded</p>
                                                <Button variant="outline" size="sm" className="mt-4">
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Add Event
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Column - Team & Actions */}
                    <div className="space-y-6">
                        {/* Lead Investigator */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Lead Investigator</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <Avatar name={leadInvestigator?.fullName || "Unknown"} size="lg" showStatus status="online" />
                                    <div>
                                        <p className="font-medium text-bureau-100">
                                            {leadInvestigator?.fullName || "Unassigned"}
                                        </p>
                                        <p className="text-sm text-bureau-500">
                                            {leadInvestigator?.rank} • {leadInvestigator?.department}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Assigned Officers */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center justify-between">
                                    <span>Assigned Team</span>
                                    <Badge variant="default" size="xs">{assignedOfficers.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {assignedOfficers.slice(0, 5).map((officer) => (
                                        <div key={officer!.id} className="flex items-center gap-3">
                                            <Avatar name={officer!.fullName} size="sm" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-bureau-100 truncate">{officer!.fullName}</p>
                                                <p className="text-xs text-bureau-500">{officer!.rank}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" size="sm" className="w-full mt-4">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Member
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <UserSearch className="h-4 w-4 mr-2" />
                                    Add Suspect
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <FileBox className="h-4 w-4 mr-2" />
                                    Log Evidence
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <Users className="h-4 w-4 mr-2" />
                                    Add Witness
                                </Button>
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Add Note
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-status-secure mt-2" />
                                        <div>
                                            <p className="text-bureau-300">Evidence analyzed</p>
                                            <p className="text-xs text-bureau-500">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2" />
                                        <div>
                                            <p className="text-bureau-300">Suspect profile updated</p>
                                            <p className="text-xs text-bureau-500">5 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-status-warning mt-2" />
                                        <div>
                                            <p className="text-bureau-300">New witness statement</p>
                                            <p className="text-xs text-bureau-500">1 day ago</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
