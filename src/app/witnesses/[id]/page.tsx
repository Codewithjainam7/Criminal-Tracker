"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Edit,
    MoreHorizontal,
    UserCheck,
    Calendar,
    Phone,
    Mail,
    MapPin,
    Briefcase,
    Shield,
    Clock,
    ChevronRight,
    Eye,
    EyeOff,
    Star,
    FileText,
    MessageSquare,
    AlertTriangle,
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
import { seedCases } from "@/data/seed";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import type { Witness } from "@/types/witness";

// Mock witness data (would come from seed data)
const seedWitnesses: Witness[] = [
    {
        id: "witness-001",
        witnessNumber: "WIT-2026-0001",
        firstName: "Maria",
        lastName: "Santos",
        fullName: "Maria Santos",
        isAnonymized: false,
        dateOfBirth: new Date("1985-07-22"),
        phoneNumber: "555-0123",
        email: "m.santos@email.com",
        address: {
            street: "456 Oak Avenue",
            city: "Metro City",
            state: "CA",
            zipCode: "90002",
            country: "USA",
            isSecure: false,
            isCurrent: true,
        },
        status: "active",
        protectionLevel: "none",
        credibilityRating: "high",
        relationshipToCase: "Eyewitness",
        linkedCaseIds: ["case-001"],
        statements: [
            {
                id: "stmt-001",
                witnessId: "witness-001",
                caseId: "case-001",
                content: "I saw the suspect enter through the back door around 2:15 AM. He was wearing dark clothing and a face mask.",
                summary: "Eyewitness account of suspect entering premises",
                recordingType: "written",
                dateGiven: new Date("2026-01-15"),
                location: "Police Station",
                takenBy: "user-002",
                isSworn: true,
                isRecorded: false,
                isTranscribed: false,
                attachments: [],
                createdAt: new Date("2026-01-15"),
                updatedAt: new Date("2026-01-15"),
            },
        ],
        contactHistory: [],
        preferredContactMethod: "phone",
        notes: "Cooperative witness. Works across the street from crime scene.",
        concerns: [],
        assignedOfficer: "user-002",
        createdAt: new Date("2026-01-15"),
        updatedAt: new Date("2026-01-20"),
    },
    {
        id: "witness-002",
        witnessNumber: "WIT-2026-0002",
        firstName: "PROTECTED",
        lastName: "IDENTITY",
        fullName: "PROTECTED IDENTITY",
        isAnonymized: true,
        anonymousId: "WP-001",
        status: "relocated",
        protectionLevel: "witness_protection",
        credibilityRating: "high",
        relationshipToCase: "Insider witness",
        linkedCaseIds: ["case-001", "case-005"],
        statements: [],
        contactHistory: [],
        preferredContactMethod: "in_person",
        protectionDetails: {
            level: "witness_protection",
            startDate: new Date("2026-01-10"),
            assignedAgents: ["user-004"],
            safeHouseLocation: "CLASSIFIED",
            specialInstructions: "No direct contact without supervisor approval",
            threatAssessment: "High risk - organized crime retaliation",
            reviewDate: new Date("2026-04-10"),
        },
        notes: "Key witness in syndicate case. Identity must remain confidential.",
        concerns: ["Organized crime retaliation"],
        assignedOfficer: "user-001",
        createdAt: new Date("2026-01-10"),
        updatedAt: new Date("2026-01-25"),
    },
];

function getWitnessById(id: string): Witness | undefined {
    return seedWitnesses.find((w) => w.id === id);
}

export default function WitnessDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const witness = getWitnessById(id);

    if (!witness) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <UserCheck className="h-16 w-16 text-bureau-600 mb-4" />
                    <h1 className="text-xl font-semibold text-bureau-200">Witness Not Found</h1>
                    <p className="text-bureau-500 mt-2">The witness profile doesn't exist.</p>
                    <Button variant="outline" className="mt-6" onClick={() => router.push("/witnesses")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Witnesses
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const linkedCases = (witness.linkedCaseIds || [])
        .map((caseId) => seedCases.find((c) => c.id === caseId))
        .filter(Boolean);

    const statements = witness.statements || [];
    const isProtected = witness.protectionLevel !== "none";

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
                                onClick={() => router.push("/witnesses")}
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Witnesses
                            </Button>
                            <span className="text-bureau-600">/</span>
                            <span className="font-mono text-sm text-bureau-400">
                                {witness.witnessNumber}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-bureau-100 flex items-center gap-2">
                            {isProtected && (
                                <Shield className="h-6 w-6 text-status-warning" />
                            )}
                            {witness.fullName}
                        </h1>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <Badge
                                variant={
                                    witness.status === "active" ? "success" :
                                        witness.status === "relocated" ? "warning" :
                                            witness.status === "unavailable" ? "danger" : "default"
                                }
                            >
                                {witness.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-status-warning fill-status-warning" />
                                {witness.credibilityRating} credibility
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" leftIcon={<MessageSquare className="h-4 w-4" />}>
                            Record Statement
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
                                <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                                <DropdownMenuItem>Link to Case</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-status-warning">
                                    Enable Protection
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Protected Warning */}
                {isProtected && (
                    <Card className="bg-status-warning/10 border-status-warning/30">
                        <CardContent className="py-4">
                            <div className="flex items-center gap-3 text-status-warning">
                                <AlertTriangle className="h-5 w-5" />
                                <div>
                                    <p className="font-medium">PROTECTED WITNESS</p>
                                    <p className="text-sm text-bureau-400">
                                        This witness is under protection. Access to full details is restricted.
                                        Protection Level: {witness.protectionLevel?.toUpperCase().replace("_", " ")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent-primary/20 rounded-lg">
                                <FileText className="h-5 w-5 text-accent-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Statements</p>
                                <p className="font-medium text-bureau-100">{statements.length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-secure/20 rounded-lg">
                                <Briefcase className="h-5 w-5 text-status-secure" />
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
                                <Star className="h-5 w-5 text-status-warning" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Credibility</p>
                                <p className="font-medium text-bureau-100 capitalize">{witness.credibilityRating}</p>
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
                                <p className="font-medium text-bureau-100">{formatRelativeTime(witness.updatedAt)}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="statements">
                            <TabsList>
                                <TabsTrigger value="statements">Statements</TabsTrigger>
                                <TabsTrigger value="cases">Linked Cases</TabsTrigger>
                                <TabsTrigger value="contact">Contact Info</TabsTrigger>
                            </TabsList>

                            <TabsContent value="statements" className="mt-4">
                                <Card>
                                    <CardContent className="py-6">
                                        {statements.length > 0 ? (
                                            <div className="space-y-4">
                                                {statements.map((stmt) => {
                                                    const linkedCase = seedCases.find((c) => c.id === stmt.caseId);
                                                    return (
                                                        <div key={stmt.id} className="p-4 bg-bureau-800/50 rounded-lg">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <Badge variant={stmt.isSworn ? "success" : "warning"} size="xs">
                                                                    {stmt.isSworn ? "Sworn Statement" : "Unsworn"}
                                                                </Badge>
                                                                <span className="text-xs text-bureau-500">
                                                                    {formatDate(stmt.dateGiven)}
                                                                </span>
                                                            </div>
                                                            <p className="text-bureau-200 text-sm leading-relaxed italic">
                                                                "{stmt.content}"
                                                            </p>
                                                            <p className="text-xs text-bureau-500 mt-2">
                                                                Summary: {stmt.summary}
                                                            </p>
                                                            {linkedCase && (
                                                                <Link href={`/cases/${linkedCase.id}`} className="block mt-3">
                                                                    <div className="flex items-center gap-2 text-xs text-bureau-400 hover:text-accent-primary">
                                                                        <Briefcase className="h-3 w-3" />
                                                                        {linkedCase.title}
                                                                    </div>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <MessageSquare className="h-10 w-10 text-bureau-600 mx-auto mb-3" />
                                                <p className="text-bureau-400">No statements recorded</p>
                                                <Button variant="outline" size="sm" className="mt-4">
                                                    Record First Statement
                                                </Button>
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
                                                        <Badge variant={caseData!.status === "active" ? "case-active" : "case-closed"} size="xs" className="mt-2">
                                                            {caseData!.status}
                                                        </Badge>
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

                            <TabsContent value="contact" className="mt-4">
                                <Card>
                                    <CardContent className="py-6">
                                        {!isProtected ? (
                                            <div className="space-y-4">
                                                {witness.phoneNumber && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-bureau-800 rounded-lg">
                                                            <Phone className="h-4 w-4 text-bureau-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-bureau-500">Phone</p>
                                                            <p className="text-bureau-200">{witness.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {witness.email && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-bureau-800 rounded-lg">
                                                            <Mail className="h-4 w-4 text-bureau-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-bureau-500">Email</p>
                                                            <p className="text-bureau-200">{witness.email}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {witness.address && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-bureau-800 rounded-lg">
                                                            <MapPin className="h-4 w-4 text-bureau-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-bureau-500">Address</p>
                                                            <p className="text-bureau-200">
                                                                {witness.address.street}, {witness.address.city}, {witness.address.state}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {witness.relationshipToCase && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-bureau-800 rounded-lg">
                                                            <Briefcase className="h-4 w-4 text-bureau-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-bureau-500">Relationship to Case</p>
                                                            <p className="text-bureau-200">{witness.relationshipToCase}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <EyeOff className="h-10 w-10 text-status-warning mx-auto mb-3" />
                                                <p className="text-status-warning font-medium">Contact Information Redacted</p>
                                                <p className="text-bureau-500 text-sm mt-1">
                                                    This witness is under protection. Contact info is restricted.
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="py-6">
                                <div className="aspect-square bg-bureau-800 rounded-lg flex items-center justify-center mb-4">
                                    {isProtected ? (
                                        <Shield className="h-16 w-16 text-status-warning" />
                                    ) : (
                                        <Avatar name={witness.fullName} size="xl" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className="font-semibold text-bureau-100">{witness.fullName}</h3>
                                    <p className="text-sm text-bureau-500">{witness.witnessNumber}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {witness.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-bureau-400">{witness.notes}</p>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Record Info</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-bureau-500">Created</span>
                                    <span className="text-bureau-300">{formatDate(witness.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-bureau-500">Last Updated</span>
                                    <span className="text-bureau-300">{formatDate(witness.updatedAt)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
