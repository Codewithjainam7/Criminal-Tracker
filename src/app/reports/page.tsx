"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Download,
    Plus,
    Search,
    Calendar,
    Clock,
    User,
    Briefcase,
    FileBox,
    UserSearch,
    BarChart3,
    Shield,
    Printer,
    Eye,
    MoreHorizontal,
    Loader2,
    CheckCircle,
    File,
    FilePlus,
    FileCheck,
    FileWarning,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
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
import { toast } from "@/components/ui/toast";
import { seedCases, seedUsers } from "@/data/seed";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import { CASE_STATUS_LABELS } from "@/types/case";

interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: "case" | "suspect" | "evidence" | "analytics";
    fields: string[];
}

const reportTemplates: ReportTemplate[] = [
    {
        id: "case-summary",
        name: "Case Summary Report",
        description: "Comprehensive overview of case details, suspects, evidence, and timeline",
        icon: <Briefcase className="h-6 w-6" />,
        category: "case",
        fields: ["caseId", "dateRange", "includeEvidence", "includeSuspects"],
    },
    {
        id: "suspect-profile",
        name: "Suspect Profile Report",
        description: "Detailed suspect dossier with criminal history and known associates",
        icon: <UserSearch className="h-6 w-6" />,
        category: "suspect",
        fields: ["suspectId", "includeHistory", "includeAssociates"],
    },
    {
        id: "evidence-chain",
        name: "Chain of Custody Report",
        description: "Complete evidence handling documentation for court proceedings",
        icon: <FileBox className="h-6 w-6" />,
        category: "evidence",
        fields: ["evidenceId", "caseId", "dateRange"],
    },
    {
        id: "investigation-progress",
        name: "Investigation Progress Report",
        description: "Status update on investigation milestones and next steps",
        icon: <BarChart3 className="h-6 w-6" />,
        category: "analytics",
        fields: ["caseId", "period", "includeMetrics"],
    },
    {
        id: "witness-statements",
        name: "Witness Statement Compilation",
        description: "Compiled witness interviews and testimonies",
        icon: <User className="h-6 w-6" />,
        category: "case",
        fields: ["caseId", "dateRange"],
    },
    {
        id: "incident-report",
        name: "Incident Report",
        description: "Formal incident documentation for records",
        icon: <FileWarning className="h-6 w-6" />,
        category: "case",
        fields: ["caseId", "incidentDate", "location"],
    },
];

interface GeneratedReport {
    id: string;
    templateId: string;
    name: string;
    caseNumber?: string;
    generatedBy: string;
    generatedAt: Date;
    status: "completed" | "pending" | "failed";
    fileSize: string;
}

const mockReports: GeneratedReport[] = [
    {
        id: "report-001",
        templateId: "case-summary",
        name: "Downtown Financial Heist - Summary",
        caseNumber: "CIT-2026-001",
        generatedBy: "user-002",
        generatedAt: new Date("2026-01-28T14:30:00"),
        status: "completed",
        fileSize: "2.4 MB",
    },
    {
        id: "report-002",
        templateId: "suspect-profile",
        name: "Viktor Morozov - Full Profile",
        caseNumber: "CIT-2026-001",
        generatedBy: "user-002",
        generatedAt: new Date("2026-01-27T10:15:00"),
        status: "completed",
        fileSize: "1.8 MB",
    },
    {
        id: "report-003",
        templateId: "evidence-chain",
        name: "Chain of Custody - EV-2026-00001",
        caseNumber: "CIT-2026-001",
        generatedBy: "user-003",
        generatedAt: new Date("2026-01-26T16:45:00"),
        status: "completed",
        fileSize: "856 KB",
    },
    {
        id: "report-004",
        templateId: "investigation-progress",
        name: "Harbor Drug Ring - Weekly Progress",
        caseNumber: "CIT-2026-002",
        generatedBy: "user-005",
        generatedAt: new Date("2026-01-25T09:00:00"),
        status: "completed",
        fileSize: "1.2 MB",
    },
];

function ReportTemplateCard({
    template,
    onSelect,
}: {
    template: ReportTemplate;
    onSelect: () => void;
}) {
    const categoryColors = {
        case: "bg-accent-primary/20 text-accent-primary",
        suspect: "bg-status-warning/20 text-status-warning",
        evidence: "bg-status-secure/20 text-status-secure",
        analytics: "bg-accent-secondary/20 text-accent-secondary",
    };

    return (
        <Card hover className="cursor-pointer" onClick={onSelect}>
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-lg", categoryColors[template.category])}>
                        {template.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-bureau-100">{template.name}</h3>
                        <p className="text-sm text-bureau-400 mt-1">{template.description}</p>
                        <Badge variant="outline" size="xs" className="mt-3 capitalize">
                            {template.category}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ReportHistoryRow({ report }: { report: GeneratedReport }) {
    const user = seedUsers.find((u) => u.id === report.generatedBy);
    const template = reportTemplates.find((t) => t.id === report.templateId);

    return (
        <tr className="border-b border-bureau-700 hover:bg-bureau-800/50 transition-colors">
            <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-bureau-800 rounded">
                        <File className="h-4 w-4 text-bureau-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-bureau-100">{report.name}</p>
                        {report.caseNumber && (
                            <p className="text-xs text-bureau-500">{report.caseNumber}</p>
                        )}
                    </div>
                </div>
            </td>
            <td className="py-3 px-4">
                <Badge variant="outline" size="xs">
                    {template?.name || "Unknown"}
                </Badge>
            </td>
            <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                    <Avatar name={user?.fullName || "Unknown"} size="xs" />
                    <span className="text-sm text-bureau-400">{user?.lastName}</span>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-bureau-400">
                    {formatRelativeTime(report.generatedAt)}
                </span>
            </td>
            <td className="py-3 px-4">
                <Badge
                    variant={report.status === "completed" ? "success" : report.status === "pending" ? "warning" : "danger"}
                    size="xs"
                >
                    {report.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {report.status}
                </Badge>
            </td>
            <td className="py-3 px-4">
                <span className="text-sm text-bureau-500">{report.fileSize}</span>
            </td>
            <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" title="View">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" title="Download">
                        <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <FilePlus className="mr-2 h-4 w-4" />
                                Regenerate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-status-critical">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </td>
        </tr>
    );
}

export default function ReportsPage() {
    const [showGenerateDialog, setShowGenerateDialog] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
    const [selectedCase, setSelectedCase] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationComplete, setGenerationComplete] = useState(false);

    const handleSelectTemplate = (template: ReportTemplate) => {
        setSelectedTemplate(template);
        setShowGenerateDialog(true);
        setGenerationComplete(false);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simulate report generation
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setIsGenerating(false);
        setGenerationComplete(true);
        toast.success("Report generated successfully");
    };

    const handleCloseDialog = () => {
        setShowGenerateDialog(false);
        setSelectedTemplate(null);
        setSelectedCase("");
        setGenerationComplete(false);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-bureau-100 flex items-center gap-2">
                            <FileText className="h-7 w-7 text-accent-primary" />
                            Reports
                        </h1>
                        <p className="text-bureau-400 mt-1">
                            Generate and manage investigation reports
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="templates" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="templates" className="flex items-center gap-2">
                            <FilePlus className="h-4 w-4" />
                            Templates
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4" />
                            Generated Reports
                            <Badge variant="default" size="xs" className="ml-1">
                                {mockReports.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    {/* Templates Tab */}
                    <TabsContent value="templates">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {reportTemplates.map((template) => (
                                <ReportTemplateCard
                                    key={template.id}
                                    template={template}
                                    onSelect={() => handleSelectTemplate(template)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history">
                        <Card padding="none">
                            <div className="p-4 border-b border-bureau-700 flex items-center gap-4">
                                <div className="flex-1 max-w-md relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bureau-500" />
                                    <Input placeholder="Search reports..." className="pl-10" />
                                </div>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="case">Case Reports</SelectItem>
                                        <SelectItem value="suspect">Suspect Reports</SelectItem>
                                        <SelectItem value="evidence">Evidence Reports</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full data-table">
                                    <thead>
                                        <tr className="border-b border-bureau-700">
                                            <th className="text-left py-3 px-4">Report</th>
                                            <th className="text-left py-3 px-4">Template</th>
                                            <th className="text-left py-3 px-4">Generated By</th>
                                            <th className="text-left py-3 px-4">Date</th>
                                            <th className="text-left py-3 px-4">Status</th>
                                            <th className="text-left py-3 px-4">Size</th>
                                            <th className="text-left py-3 px-4 w-32">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockReports.map((report) => (
                                            <ReportHistoryRow key={report.id} report={report} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Generate Report Dialog */}
                <Dialog open={showGenerateDialog} onOpenChange={handleCloseDialog}>
                    <DialogContent size="md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                {selectedTemplate?.icon}
                                {selectedTemplate?.name}
                            </DialogTitle>
                            <DialogDescription>
                                {selectedTemplate?.description}
                            </DialogDescription>
                        </DialogHeader>

                        <AnimatePresence mode="wait">
                            {!isGenerating && !generationComplete ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4 py-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                            Select Case
                                        </label>
                                        <Select value={selectedCase} onValueChange={setSelectedCase}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a case" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {seedCases.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.caseNumber} - {c.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                            Date Range
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input type="date" defaultValue="2026-01-01" />
                                            <Input type="date" defaultValue="2026-01-29" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-bureau-300">
                                            Include in Report
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="w-4 h-4 rounded border-bureau-600 bg-bureau-800 text-accent-primary"
                                                />
                                                <span className="text-sm text-bureau-300">Evidence Records</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="w-4 h-4 rounded border-bureau-600 bg-bureau-800 text-accent-primary"
                                                />
                                                <span className="text-sm text-bureau-300">Suspect Information</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-bureau-600 bg-bureau-800 text-accent-primary"
                                                />
                                                <span className="text-sm text-bureau-300">Timeline Events</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-bureau-600 bg-bureau-800 text-accent-primary"
                                                />
                                                <span className="text-sm text-bureau-300">Witness Statements</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                            Output Format
                                        </label>
                                        <Select defaultValue="pdf">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pdf">PDF Document</SelectItem>
                                                <SelectItem value="docx">Word Document</SelectItem>
                                                <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </motion.div>
                            ) : isGenerating ? (
                                <motion.div
                                    key="generating"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-12 text-center"
                                >
                                    <div className="relative inline-block">
                                        <div className="w-20 h-20 rounded-full border-4 border-bureau-700" />
                                        <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-accent-primary border-t-transparent animate-spin" />
                                        <FileText className="absolute inset-0 m-auto h-8 w-8 text-accent-primary" />
                                    </div>
                                    <p className="text-bureau-200 mt-6 font-medium">Generating Report...</p>
                                    <p className="text-bureau-500 mt-2 text-sm">
                                        Compiling data and formatting document
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="complete"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-12 text-center"
                                >
                                    <div className="w-20 h-20 rounded-full bg-status-secure/20 flex items-center justify-center mx-auto">
                                        <CheckCircle className="h-10 w-10 text-status-secure" />
                                    </div>
                                    <p className="text-bureau-100 mt-6 font-semibold text-lg">Report Generated!</p>
                                    <p className="text-bureau-400 mt-2 text-sm">
                                        Your report is ready for download
                                    </p>
                                    <div className="flex items-center justify-center gap-3 mt-6">
                                        <Button variant="outline" leftIcon={<Eye className="h-4 w-4" />}>
                                            Preview
                                        </Button>
                                        <Button leftIcon={<Download className="h-4 w-4" />}>
                                            Download PDF
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!isGenerating && !generationComplete && (
                            <DialogFooter>
                                <Button variant="outline" onClick={handleCloseDialog}>
                                    Cancel
                                </Button>
                                <Button onClick={handleGenerate} disabled={!selectedCase}>
                                    Generate Report
                                </Button>
                            </DialogFooter>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
