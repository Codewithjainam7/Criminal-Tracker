// Witness Management Types

export type WitnessStatus = "active" | "uncooperative" | "unavailable" | "deceased" | "relocated";

export type ProtectionLevel = "none" | "low" | "medium" | "high" | "witness_protection";

export type CredibilityRating = "high" | "medium" | "low" | "unverified";

export interface Witness {
    id: string;
    witnessNumber: string;

    // Identity (may be anonymized)
    firstName: string;
    lastName: string;
    fullName: string;
    isAnonymized: boolean;
    anonymousId?: string;

    // Contact Info
    dateOfBirth?: Date;
    phoneNumber?: string;
    email?: string;
    address?: WitnessAddress;

    // Status
    status: WitnessStatus;
    protectionLevel: ProtectionLevel;
    credibilityRating: CredibilityRating;

    // Relationship to Case
    relationshipToCase: string;
    relationshipToSuspect?: string;
    relationshipToVictim?: string;

    // Case Links
    linkedCaseIds: string[];

    // Statements
    statements: WitnessStatement[];

    // Contact History
    contactHistory: ContactRecord[];
    preferredContactMethod: ContactMethod;

    // Protection Details
    protectionDetails?: ProtectionDetails;

    // Notes
    notes: string;
    concerns: string[];

    // Metadata
    assignedOfficer: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface WitnessAddress {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isSecure: boolean;
    isCurrent: boolean;
}

export interface WitnessStatement {
    id: string;
    witnessId: string;
    caseId: string;

    // Content
    content: string;
    summary: string;

    // Recording
    recordingType: RecordingType;
    recordingUrl?: string;
    transcription?: string;

    // Details
    dateGiven: Date;
    location: string;
    takenBy: string;

    // Verification
    isSworn: boolean;
    isRecorded: boolean;
    isTranscribed: boolean;

    // Attachments
    attachments: string[];

    // Metadata
    createdAt: Date;
    updatedAt: Date;
}

export type RecordingType = "written" | "audio" | "video" | "transcript";

export interface ContactRecord {
    id: string;
    witnessId: string;
    contactDate: Date;
    contactType: ContactMethod;
    purpose: string;
    outcome: string;
    officer: string;
    notes?: string;
}

export type ContactMethod = "phone" | "email" | "in_person" | "video_call" | "mail";

export interface ProtectionDetails {
    level: ProtectionLevel;
    startDate: Date;
    endDate?: Date;
    assignedAgents: string[];
    safeHouseLocation?: string;
    specialInstructions: string;
    threatAssessment: string;
    reviewDate: Date;
}

export interface WitnessFilter {
    status?: WitnessStatus[];
    protectionLevel?: ProtectionLevel[];
    credibility?: CredibilityRating[];
    caseId?: string;
    search?: string;
    hasStatements?: boolean;
}

export interface WitnessSummary {
    id: string;
    witnessNumber: string;
    displayName: string;
    status: WitnessStatus;
    protectionLevel: ProtectionLevel;
    linkedCaseCount: number;
    statementCount: number;
    isAnonymized: boolean;
}

export const WITNESS_STATUS_LABELS: Record<WitnessStatus, string> = {
    active: "Active",
    uncooperative: "Uncooperative",
    unavailable: "Unavailable",
    deceased: "Deceased",
    relocated: "Relocated",
};

export const PROTECTION_LEVEL_LABELS: Record<ProtectionLevel, string> = {
    none: "No Protection",
    low: "Low Priority",
    medium: "Medium Priority",
    high: "High Priority",
    witness_protection: "Witness Protection Program",
};

export const CREDIBILITY_LABELS: Record<CredibilityRating, string> = {
    high: "High Credibility",
    medium: "Medium Credibility",
    low: "Low Credibility",
    unverified: "Unverified",
};
