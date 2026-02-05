// Evidence Management Types

export type EvidenceType =
    | "ballistics"
    | "dna"
    | "fingerprint"
    | "document"
    | "photo"
    | "video"
    | "audio"
    | "digital_storage"
    | "drugs"
    | "weapon"
    | "clothing"
    | "financial"
    | "other";

export type EvidenceCategory =
    | "physical"
    | "digital"
    | "biological"
    | "documentary";

export type EvidenceStatus =
    | "collected"
    | "stored"
    | "pending_analysis"
    | "under_analysis"
    | "analyzed"
    | "in_lab"
    | "released"
    | "destroyed";

export type EvidenceIntegrity = "verified" | "compromised" | "pending";

export interface ChainOfCustodyEntry {
    id: string;
    evidenceId: string;
    action: "collected" | "transferred" | "analyzed" | "stored" | "released";
    fromLocation: string;
    toLocation: string;
    handledBy: string;
    receivedBy: string;
    timestamp: Date;
    notes?: string;
    verified: boolean;
}

// Alias for store compatibility
export interface CustodyEntry {
    id: string;
    evidenceId: string;
    fromCustodian: string;
    toCustodian: string;
    transferDate: Date;
    reason: string;
    location: string;
    condition: string;
}

// Analysis record for store
export interface AnalysisRecord {
    id: string;
    evidenceId: string;
    analystId: string;
    type: string;
    findings: string;
    conclusion: string;
    date: Date;
    attachments: string[];
}

export interface Evidence {
    id: string;
    evidenceNumber: string;
    caseId: string;

    // Classification
    type: EvidenceType;
    category: EvidenceCategory;

    // Basic Info
    name: string;
    description: string;
    status: EvidenceStatus;

    // Location
    location: {
        current: string;
        original: string;
    };

    // Collection
    collectedBy: string;
    collectedAt: Date;

    // Chain of Custody
    chainOfCustody: ChainOfCustodyEntry[];

    // Analysis
    analysisResults?: string;

    // Media
    photos: string[];

    // Tags
    tags: string[];

    // Classification
    isClassified: boolean;
    classificationLevel?: "CONFIDENTIAL" | "SECRET" | "TOP_SECRET";

    // Metadata
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface EvidenceFilter {
    type?: EvidenceType[];
    status?: EvidenceStatus[];
    category?: EvidenceCategory[];
    caseId?: string;
    dateRange?: { from: Date; to: Date };
    search?: string;
    tags?: string[];
    integrity?: EvidenceIntegrity;
}

export interface EvidenceSummary {
    id: string;
    evidenceNumber: string;
    name: string;
    type: EvidenceType;
    status: EvidenceStatus;
    caseId: string;
    collectedAt: Date;
}

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
    ballistics: "Ballistics",
    dna: "DNA",
    fingerprint: "Fingerprint",
    document: "Document",
    photo: "Photograph",
    video: "Video",
    audio: "Audio",
    digital_storage: "Digital Storage",
    drugs: "Narcotics",
    weapon: "Weapon",
    clothing: "Clothing",
    financial: "Financial Records",
    other: "Other",
};

export const EVIDENCE_CATEGORY_LABELS: Record<EvidenceCategory, string> = {
    physical: "Physical",
    digital: "Digital",
    biological: "Biological",
    documentary: "Documentary",
};

export const EVIDENCE_STATUS_LABELS: Record<EvidenceStatus, string> = {
    collected: "Collected",
    stored: "Stored",
    pending_analysis: "Pending Analysis",
    under_analysis: "Under Analysis",
    analyzed: "Analyzed",
    in_lab: "In Lab",
    released: "Released",
    destroyed: "Destroyed",
};

