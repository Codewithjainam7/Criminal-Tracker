"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Edit,
    MoreHorizontal,
    FileBox,
    Calendar,
    MapPin,
    User,
    Clock,
    ChevronRight,
    Hash,
    Briefcase,
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Camera,
    Fingerprint,
    FileText,
    Package,
    Archive,
    Upload,
    Plus,
    Image as ImageIcon,
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
import {
    UpdateStatusDialog,
    TransferCustodyDialog,
    AddAnalysisDialog
} from "@/components/dialogs";
import { useUIStore } from "@/store";
import { seedEvidence, seedCases, seedUsers } from "@/data/seed";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import {
    EVIDENCE_TYPE_LABELS,
    EVIDENCE_STATUS_LABELS,
    type EvidenceStatus,
} from "@/types/evidence";

// Helper function to get evidence by ID
function getEvidenceById(id: string) {
    return seedEvidence.find((e) => e.id === id);
}

export default function EvidenceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const { addToast } = useUIStore();

    // Dialog states
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [transferDialogOpen, setTransferDialogOpen] = useState(false);
    const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);

    // Local state for evidence (simulating real-time updates)
    const [evidenceData, setEvidenceData] = useState(() => getEvidenceById(id));

    if (!evidenceData) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <FileBox className="h-16 w-16 text-bureau-600 mb-4" />
                    <h1 className="text-xl font-semibold text-bureau-200">Evidence Not Found</h1>
                    <p className="text-bureau-500 mt-2">The evidence item doesn't exist.</p>
                    <Button variant="outline" className="mt-6" onClick={() => router.push("/evidence")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Evidence Locker
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const linkedCase = seedCases.find((c) => c.id === evidenceData.caseId);
    const collectedBy = seedUsers.find((u) => u.id === evidenceData.collectedBy);
    const chainOfCustody = evidenceData.chainOfCustody || [];

    // Get storage location value from location object
    const storageLocation = evidenceData.location.current;
    const collectionLocation = evidenceData.location.original;

    // Handlers for dialog actions
    const handleUpdateStatus = (newStatus: EvidenceStatus, notes?: string) => {
        setEvidenceData((prev) => prev ? { ...prev, status: newStatus, updatedAt: new Date() } : prev);
        addToast({
            type: "success",
            title: "Status Updated",
            message: `Evidence status changed to "${EVIDENCE_STATUS_LABELS[newStatus]}"`,
        });
    };

    const handleTransferCustody = (data: { handlerId: string; location: string; notes: string }) => {
        const newEntry = {
            id: `coc-${Date.now()}`,
            evidenceId: evidenceData.id,
            action: "transferred" as const,
            fromLocation: evidenceData.location.current,
            toLocation: data.location,
            handledBy: data.handlerId,
            receivedBy: data.handlerId,
            timestamp: new Date(),
            notes: data.notes,
            verified: true,
        };

        setEvidenceData((prev) => prev ? {
            ...prev,
            location: { ...prev.location, current: data.location },
            chainOfCustody: [...(prev.chainOfCustody || []), newEntry],
            updatedAt: new Date(),
        } : prev);

        addToast({
            type: "success",
            title: "Custody Transferred",
            message: `Evidence moved to ${data.location}`,
        });
    };

    const handleAddAnalysis = (report: string) => {
        setEvidenceData((prev) => prev ? {
            ...prev,
            status: "analyzed",
            analysisResults: report,
            updatedAt: new Date(),
        } : prev);

        addToast({
            type: "success",
            title: "Analysis Report Added",
            message: "Evidence marked as analyzed",
        });
    };

    const handleRequestAnalysis = () => {
        setEvidenceData((prev) => prev ? {
            ...prev,
            status: "in_lab",
            updatedAt: new Date(),
        } : prev);

        addToast({
            type: "info",
            title: "Analysis Requested",
            message: "Evidence sent to forensic lab for analysis",
        });
    };

    const getStatusBadge = () => {
        switch (evidenceData.status) {
            case "in_lab":
                return <Badge variant="warning">In Lab</Badge>;
            case "analyzed":
                return <Badge variant="success">Analyzed</Badge>;
            case "stored":
                return <Badge variant="info">Stored</Badge>;
            case "released":
                return <Badge variant="default">Released</Badge>;
            case "destroyed":
                return <Badge variant="danger">Destroyed</Badge>;
            case "collected":
                return <Badge variant="primary">Collected</Badge>;
            default:
                return <Badge variant="default">{evidenceData.status}</Badge>;
        }
    };

    const getTypeIcon = () => {
        switch (evidenceData.category) {
            case "physical":
                return <Package className="h-5 w-5" />;
            case "digital":
                return <FileText className="h-5 w-5" />;
            case "biological":
                return <Fingerprint className="h-5 w-5" />;
            case "documentary":
                return <Camera className="h-5 w-5" />;
            default:
                return <FileBox className="h-5 w-5" />;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push("/evidence")}
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Evidence Locker
                            </Button>
                            <span className="text-bureau-600">/</span>
                            <span className="font-mono text-sm text-bureau-400">
                                {evidenceData.evidenceNumber}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-bureau-100">
                            {evidenceData.description}
                        </h1>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                            {getStatusBadge()}
                            <Badge variant="outline" className="flex items-center gap-1">
                                {getTypeIcon()}
                                <span className="ml-1">{EVIDENCE_TYPE_LABELS[evidenceData.type]}</span>
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            leftIcon={<Archive className="h-4 w-4" />}
                            onClick={() => setStatusDialogOpen(true)}
                        >
                            Update Status
                        </Button>
                        <Button leftIcon={<Edit className="h-4 w-4" />}>
                            Edit Details
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTransferDialogOpen(true)}>
                                    Transfer Custody
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setAnalysisDialogOpen(true)}>
                                    Add Analysis Report
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-status-critical">
                                    Mark as Destroyed
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </motion.div>

                {/* Summary Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid gap-4 md:grid-cols-4"
                >
                    <Card variant="gradient" className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent-primary/20 rounded-lg">
                                <Briefcase className="h-5 w-5 text-accent-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Linked Case</p>
                                <p className="font-medium text-bureau-100 truncate">
                                    {linkedCase?.caseNumber || "N/A"}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card variant="gradient" className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-warning/20 rounded-lg">
                                <MapPin className="h-5 w-5 text-status-warning" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Location</p>
                                <p className="font-medium text-bureau-100">{storageLocation}</p>
                            </div>
                        </div>
                    </Card>
                    <Card variant="gradient" className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-status-secure/20 rounded-lg">
                                <Shield className="h-5 w-5 text-status-secure" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Chain of Custody</p>
                                <p className="font-medium text-bureau-100">{chainOfCustody.length} entries</p>
                            </div>
                        </div>
                    </Card>
                    <Card variant="gradient" className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-bureau-700 rounded-lg">
                                <Calendar className="h-5 w-5 text-bureau-400" />
                            </div>
                            <div>
                                <p className="text-xs text-bureau-500">Collected</p>
                                <p className="font-medium text-bureau-100">{formatDate(evidenceData.collectedAt)}</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="details">
                            <TabsList>
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="chain">Chain of Custody</TabsTrigger>
                                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                                <TabsTrigger value="photos">Photos</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="mt-4 space-y-4">
                                {/* Evidence Details */}
                                <Card variant="glass">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileBox className="h-4 w-4" />
                                            Evidence Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-bureau-500">Evidence Number</p>
                                                <p className="text-bureau-100 font-mono">{evidenceData.evidenceNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500">Type</p>
                                                <p className="text-bureau-100 capitalize">{EVIDENCE_TYPE_LABELS[evidenceData.type]}</p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500">Status</p>
                                                <p className="text-bureau-100 capitalize">{EVIDENCE_STATUS_LABELS[evidenceData.status]}</p>
                                            </div>
                                            <div>
                                                <p className="text-bureau-500">Category</p>
                                                <p className="text-bureau-100 capitalize">{evidenceData.category}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-bureau-500">Collection Location</p>
                                                <p className="text-bureau-100">{collectionLocation}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-bureau-500">Storage Location</p>
                                                <p className="text-bureau-100">{storageLocation}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Description */}
                                <Card variant="glass">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Description
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-bureau-300 text-sm leading-relaxed">
                                            {evidenceData.description}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Tags */}
                                {evidenceData.tags && evidenceData.tags.length > 0 && (
                                    <Card variant="glass">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Hash className="h-4 w-4" />
                                                Tags
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {evidenceData.tags.map((tag) => (
                                                    <Badge key={tag} variant="outline" size="sm">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="chain" className="mt-4">
                                <Card variant="glass">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Chain of Custody
                                        </CardTitle>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setTransferDialogOpen(true)}
                                            leftIcon={<Plus className="h-4 w-4" />}
                                        >
                                            Add Entry
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="py-6">
                                        {chainOfCustody.length > 0 ? (
                                            <div className="space-y-4">
                                                {chainOfCustody.map((entry, idx) => {
                                                    const handler = seedUsers.find((u) => u.id === entry.handledBy);
                                                    return (
                                                        <motion.div
                                                            key={entry.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            className="flex gap-4"
                                                        >
                                                            <div className="flex flex-col items-center">
                                                                <div className={cn(
                                                                    "w-3 h-3 rounded-full",
                                                                    entry.action === "collected" ? "bg-status-secure" :
                                                                        entry.action === "transferred" ? "bg-accent-primary" :
                                                                            entry.action === "analyzed" ? "bg-status-warning" : "bg-bureau-500"
                                                                )} />
                                                                {idx < chainOfCustody.length - 1 && (
                                                                    <div className="w-0.5 h-full bg-bureau-700 mt-1" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 pb-4">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-bureau-100 capitalize">
                                                                        {entry.action.replace("_", " ")}
                                                                    </p>
                                                                    <Badge variant="outline" size="xs">
                                                                        {formatRelativeTime(entry.timestamp)}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-bureau-400 mt-1">
                                                                    By {handler?.fullName || "Unknown"} at {entry.toLocation}
                                                                </p>
                                                                <p className="text-xs text-bureau-500 mt-1">
                                                                    {formatDate(entry.timestamp)}
                                                                </p>
                                                                {entry.notes && (
                                                                    <p className="text-sm text-bureau-400 mt-2 italic bg-bureau-800/50 p-2 rounded">
                                                                        "{entry.notes}"
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Shield className="h-10 w-10 text-bureau-600 mx-auto mb-3" />
                                                <p className="text-bureau-400">No chain of custody entries</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-4"
                                                    onClick={() => setTransferDialogOpen(true)}
                                                >
                                                    Add First Entry
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="analysis" className="mt-4">
                                <Card variant="glass">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Fingerprint className="h-4 w-4" />
                                            Analysis Report
                                        </CardTitle>
                                        {evidenceData.analysisResults && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setAnalysisDialogOpen(true)}
                                            >
                                                Update Report
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <CardContent className="py-6">
                                        {evidenceData.analysisResults ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-status-secure">
                                                    <CheckCircle className="h-5 w-5" />
                                                    <span className="font-medium">Analysis Complete</span>
                                                </div>
                                                <div className="p-4 bg-bureau-800/50 rounded-lg border border-bureau-700">
                                                    <p className="text-bureau-300 text-sm whitespace-pre-wrap">
                                                        {evidenceData.analysisResults}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Fingerprint className="h-10 w-10 text-bureau-600 mx-auto mb-3" />
                                                <p className="text-bureau-400">No analysis report available</p>
                                                <div className="flex items-center justify-center gap-3 mt-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleRequestAnalysis}
                                                    >
                                                        Request Analysis
                                                    </Button>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => setAnalysisDialogOpen(true)}
                                                    >
                                                        Add Report
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="photos" className="mt-4">
                                <Card variant="glass">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Camera className="h-4 w-4" />
                                            Evidence Photos
                                        </CardTitle>
                                        <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
                                            Upload Photo
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="py-6">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {/* Placeholder upload area */}
                                            <div className="aspect-square bg-bureau-800/50 rounded-xl border-2 border-dashed border-bureau-600 flex flex-col items-center justify-center cursor-pointer hover:border-accent-primary/50 transition-colors">
                                                <ImageIcon className="h-8 w-8 text-bureau-500 mb-2" />
                                                <p className="text-sm text-bureau-500">Drop image here</p>
                                                <p className="text-xs text-bureau-600">or click to upload</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Column - Quick Info */}
                    <div className="space-y-6">
                        {/* Evidence Photo */}
                        <Card variant="glow">
                            <CardContent className="py-6">
                                <div className="aspect-square bg-bureau-800 rounded-lg flex items-center justify-center mb-4 overflow-hidden border border-bureau-700">
                                    <FileBox className="h-16 w-16 text-bureau-600" />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-semibold text-bureau-100 truncate">
                                        {evidenceData.evidenceNumber}
                                    </h3>
                                    <p className="text-sm text-bureau-500">{EVIDENCE_TYPE_LABELS[evidenceData.type]}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Collected By */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-sm">Collected By</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {collectedBy ? (
                                    <div className="flex items-center gap-3">
                                        <Avatar name={collectedBy.fullName} size="sm" />
                                        <div>
                                            <p className="font-medium text-bureau-100">{collectedBy.fullName}</p>
                                            <p className="text-sm text-bureau-500">{collectedBy.rank}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-bureau-400">Unknown</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Linked Case */}
                        {linkedCase && (
                            <Card variant="glass" hover>
                                <CardHeader>
                                    <CardTitle className="text-sm">Linked Case</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Link href={`/cases/${linkedCase.id}`}>
                                        <div className="flex items-center justify-between hover:bg-bureau-800/50 -m-2 p-2 rounded-lg transition-colors">
                                            <div>
                                                <p className="font-mono text-xs text-bureau-500">{linkedCase.caseNumber}</p>
                                                <p className="font-medium text-bureau-100 mt-0.5">{linkedCase.title}</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-bureau-500" />
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        {/* Timestamps */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-sm">Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-bureau-500">Collected</span>
                                    <span className="text-bureau-300">{formatDate(evidenceData.collectedAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-bureau-500">Last Updated</span>
                                    <span className="text-bureau-300">{formatRelativeTime(evidenceData.updatedAt)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <UpdateStatusDialog
                isOpen={statusDialogOpen}
                onClose={() => setStatusDialogOpen(false)}
                currentStatus={evidenceData.status}
                evidenceNumber={evidenceData.evidenceNumber}
                onUpdateStatus={handleUpdateStatus}
            />

            <TransferCustodyDialog
                isOpen={transferDialogOpen}
                onClose={() => setTransferDialogOpen(false)}
                evidenceNumber={evidenceData.evidenceNumber}
                currentLocation={storageLocation}
                onTransfer={handleTransferCustody}
            />

            <AddAnalysisDialog
                isOpen={analysisDialogOpen}
                onClose={() => setAnalysisDialogOpen(false)}
                evidenceNumber={evidenceData.evidenceNumber}
                onSubmit={handleAddAnalysis}
            />
        </DashboardLayout>
    );
}
