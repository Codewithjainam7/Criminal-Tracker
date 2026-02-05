// Case Management Types

export type CaseStatus =
    | "open"
    | "active"
    | "pending"
    | "under_review"
    | "closed"
    | "cold";

export type CasePriority = "critical" | "high" | "medium" | "low";

export type CaseCategory =
    | "homicide"
    | "assault"
    | "robbery"
    | "burglary"
    | "fraud"
    | "cybercrime"
    | "narcotics"
    | "kidnapping"
    | "missing_person"
    | "terrorism"
    | "organized_crime"
    | "trafficking"
    | "corruption"
    | "arson"
    | "other";

export interface Case {
    id: string;
    caseNumber: string;
    title: string;
    description: string;
    status: CaseStatus;
    priority: CasePriority;
    category: CaseCategory;

    // Dates
    dateOpened: Date;
    dateUpdated: Date;
    dateClosed?: Date;
    incidentDate: Date;

    // Location
    location: CaseLocation;
    jurisdiction: string;

    // Assignments
    leadInvestigatorId: string;
    assignedOfficers: string[];

    // Related entities
    suspectIds: string[];
    witnessIds: string[];
    evidenceIds: string[];
    linkedCaseIds: string[];

    // Details
    timeline: TimelineEvent[];
    notes: CaseNote[];
    tags: string[];

    // Classification
    isClassified: boolean;
    classificationLevel?: ClassificationLevel;

    // Statistics
    estimatedDamage?: number;
    victimCount: number;

    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CaseLocation {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    locationType: LocationType;
}

export type LocationType =
    | "residence"
    | "business"
    | "public_space"
    | "vehicle"
    | "online"
    | "unknown";

export type ClassificationLevel =
    | "unclassified"
    | "confidential"
    | "secret"
    | "top_secret";

export interface TimelineEvent {
    id: string;
    caseId: string;
    title: string;
    description: string;
    eventType: TimelineEventType;
    timestamp: Date;
    location?: string;
    participants: string[];
    attachments: string[];
    createdBy: string;
    createdAt: Date;
}

export type TimelineEventType =
    | "incident"
    | "investigation"
    | "evidence_collected"
    | "witness_interview"
    | "suspect_identified"
    | "arrest"
    | "court_hearing"
    | "forensic_analysis"
    | "surveillance"
    | "tip_received"
    | "status_change"
    | "note_added"
    | "other";

export interface CaseNote {
    id: string;
    caseId: string;
    content: string;
    isPinned: boolean;
    mentions: string[];
    attachments: string[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CaseFilter {
    status?: CaseStatus[];
    priority?: CasePriority[];
    category?: CaseCategory[];
    assignedTo?: string;
    dateRange?: {
        from: Date;
        to: Date;
    };
    search?: string;
    tags?: string[];
    jurisdiction?: string;
}

export interface CaseSummary {
    id: string;
    caseNumber: string;
    title: string;
    status: CaseStatus;
    priority: CasePriority;
    category: CaseCategory;
    leadInvestigatorId: string;
    suspectCount: number;
    evidenceCount: number;
    dateOpened: Date;
    dateUpdated: Date;
}

// Case statistics
export interface CaseStatistics {
    total: number;
    open: number;
    active: number;
    closed: number;
    cold: number;
    byCategory: Record<CaseCategory, number>;
    byPriority: Record<CasePriority, number>;
    clearanceRate: number;
    avgResolutionDays: number;
}

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
    open: "Open",
    active: "Active Investigation",
    pending: "Pending Review",
    under_review: "Under Review",
    closed: "Closed",
    cold: "Cold Case",
};

export const CASE_PRIORITY_LABELS: Record<CasePriority, string> = {
    critical: "Critical",
    high: "High Priority",
    medium: "Medium",
    low: "Low Priority",
};

export const CASE_CATEGORY_LABELS: Record<CaseCategory, string> = {
    homicide: "Homicide",
    assault: "Assault",
    robbery: "Robbery",
    burglary: "Burglary",
    fraud: "Fraud",
    cybercrime: "Cybercrime",
    narcotics: "Narcotics",
    kidnapping: "Kidnapping",
    missing_person: "Missing Person",
    terrorism: "Terrorism",
    organized_crime: "Organized Crime",
    trafficking: "Human Trafficking",
    corruption: "Corruption",
    arson: "Arson",
    other: "Other",
};
