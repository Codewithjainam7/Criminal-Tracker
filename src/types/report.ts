// Report Types

export type ReportType =
    | "case_summary"
    | "investigation_report"
    | "evidence_report"
    | "suspect_dossier"
    | "witness_report"
    | "statistics_report"
    | "activity_report"
    | "custom";

export type ReportFormat = "pdf" | "docx" | "html";

export type ReportStatus = "draft" | "pending_review" | "approved" | "finalized";

export interface Report {
    id: string;
    reportNumber: string;

    // Basic Info
    title: string;
    type: ReportType;
    format: ReportFormat;
    status: ReportStatus;

    // Content
    content: ReportContent;
    template: string;

    // Metadata
    caseId?: string;
    suspectId?: string;
    witnessId?: string;

    // Generation
    generatedBy: string;
    generatedAt: Date;

    // Review
    reviewedBy?: string;
    reviewedAt?: Date;
    approvedBy?: string;
    approvedAt?: Date;

    // File
    filePath?: string;
    fileSize?: number;

    // Classification
    isClassified: boolean;
    classificationLevel?: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface ReportContent {
    header: ReportHeader;
    sections: ReportSection[];
    footer: ReportFooter;
    charts?: ReportChart[];
    tables?: ReportTable[];
    signatures?: ReportSignature[];
}

export interface ReportHeader {
    organization: string;
    department: string;
    reportDate: Date;
    caseNumber?: string;
    classification?: string;
    logo?: string;
}

export interface ReportSection {
    id: string;
    title: string;
    content: string;
    order: number;
    pageBreakBefore?: boolean;
}

export interface ReportFooter {
    pageNumbers: boolean;
    watermark?: string;
    confidentialityNotice?: string;
}

export interface ReportChart {
    id: string;
    type: "bar" | "line" | "pie" | "area" | "radar";
    title: string;
    data: unknown;
    options?: unknown;
}

export interface ReportTable {
    id: string;
    title: string;
    headers: string[];
    rows: string[][];
    caption?: string;
}

export interface ReportSignature {
    id: string;
    name: string;
    title: string;
    department: string;
    signedAt?: Date;
    signatureImage?: string;
}

export interface ReportTemplate {
    id: string;
    name: string;
    type: ReportType;
    description: string;
    sections: TemplateSectionConfig[];
    isDefault: boolean;
    createdAt: Date;
}

export interface TemplateSectionConfig {
    id: string;
    title: string;
    placeholder: string;
    required: boolean;
    order: number;
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
    case_summary: "Case Summary",
    investigation_report: "Investigation Report",
    evidence_report: "Evidence Report",
    suspect_dossier: "Suspect Dossier",
    witness_report: "Witness Report",
    statistics_report: "Statistics Report",
    activity_report: "Activity Report",
    custom: "Custom Report",
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
    draft: "Draft",
    pending_review: "Pending Review",
    approved: "Approved",
    finalized: "Finalized",
};
