// Suspect Management Types

export type SuspectStatus =
    | "wanted"
    | "apprehended"
    | "released"
    | "deceased"
    | "unknown"
    | "cleared";

export type RiskLevel = "extreme" | "high" | "medium" | "low" | "unknown";

export type Gender = "male" | "female" | "other" | "unknown";

export interface Suspect {
    id: string;
    suspectNumber: string;

    // Identity
    firstName: string;
    lastName: string;
    fullName: string;
    aliases: string[];
    dateOfBirth?: Date;
    age?: number;
    gender: Gender;
    nationality: string;

    // Physical Attributes
    physicalAttributes: PhysicalAttributes;

    // Biometrics
    biometrics?: Biometrics;

    // Contact/Location
    lastKnownAddress?: Address;
    knownLocations: Address[];

    // Criminal Profile
    status: SuspectStatus;
    riskLevel: RiskLevel;
    modusOperandi: string[];
    criminalHistory: CriminalRecord[];
    knownAssociates: string[];
    gangAffiliation?: string;

    // Case Links
    linkedCaseIds: string[];

    // Media
    mugshot?: string;
    photos: string[];

    // Notes
    notes: string;
    distinguishingMarks: DistinguishingMark[];

    // Metadata
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PhysicalAttributes {
    height?: number; // in cm
    weight?: number; // in kg
    build: BuildType;
    hairColor: string;
    eyeColor: string;
    skinTone: string;
    facialHair?: string;
    distinguishingFeatures: string[];
}

export type BuildType =
    | "slim"
    | "average"
    | "athletic"
    | "muscular"
    | "heavy"
    | "unknown";

export interface Biometrics {
    fingerprintId?: string;
    dnaProfileId?: string;
    voicePrintId?: string;
    facialRecognitionId?: string;
}

export interface Address {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    isVerified: boolean;
    lastSeen?: Date;
}

export interface CriminalRecord {
    id: string;
    offense: string;
    offenseCategory: string;
    date: Date;
    location: string;
    outcome: string;
    sentence?: string;
    releaseDate?: Date;
    caseReference?: string;
    notes?: string;
}

export interface DistinguishingMark {
    id: string;
    type: MarkType;
    description: string;
    bodyLocation: BodyLocation;
    size?: string;
    imageUrl?: string;
}

export type MarkType =
    | "tattoo"
    | "scar"
    | "birthmark"
    | "piercing"
    | "deformity"
    | "other";

export type BodyLocation =
    | "head"
    | "face"
    | "neck"
    | "chest"
    | "back"
    | "left_arm"
    | "right_arm"
    | "left_hand"
    | "right_hand"
    | "abdomen"
    | "left_leg"
    | "right_leg"
    | "left_foot"
    | "right_foot"
    | "other";

export interface SuspectMatch {
    suspectId: string;
    suspect: Suspect;
    confidenceScore: number;
    matchBreakdown: MatchBreakdown;
    reasoning: string[];
}

export interface MatchBreakdown {
    moPatternScore: number;      // 40 points max
    criminalHistoryScore: number; // 25 points max
    locationScore: number;        // 20 points max
    physicalAttributeScore: number; // 15 points max
}

export interface SuspectFilter {
    status?: SuspectStatus[];
    riskLevel?: RiskLevel[];
    gender?: Gender[];
    ageRange?: { min: number; max: number };
    search?: string;
    modusOperandi?: string[];
    hasActiveCase?: boolean;
}

export interface SuspectSummary {
    id: string;
    suspectNumber: string;
    fullName: string;
    status: SuspectStatus;
    riskLevel: RiskLevel;
    mugshot?: string;
    linkedCaseCount: number;
    lastKnownLocation?: string;
}

export const SUSPECT_STATUS_LABELS: Record<SuspectStatus, string> = {
    wanted: "Wanted",
    apprehended: "Apprehended",
    released: "Released",
    deceased: "Deceased",
    unknown: "Unknown",
    cleared: "Cleared",
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
    extreme: "Extreme Risk",
    high: "High Risk",
    medium: "Medium Risk",
    low: "Low Risk",
    unknown: "Unknown",
};

export const BODY_LOCATION_LABELS: Record<BodyLocation, string> = {
    head: "Head",
    face: "Face",
    neck: "Neck",
    chest: "Chest",
    back: "Back",
    left_arm: "Left Arm",
    right_arm: "Right Arm",
    left_hand: "Left Hand",
    right_hand: "Right Hand",
    abdomen: "Abdomen",
    left_leg: "Left Leg",
    right_leg: "Right Leg",
    left_foot: "Left Foot",
    right_foot: "Right Foot",
    other: "Other",
};

export const MODUS_OPERANDI_OPTIONS = [
    "Armed Robbery",
    "Breaking & Entering",
    "Con Artist",
    "Cyber Attack",
    "Document Forgery",
    "Drug Distribution",
    "Extortion",
    "Fraud",
    "Home Invasion",
    "Identity Theft",
    "Kidnapping",
    "Money Laundering",
    "Murder for Hire",
    "Organized Theft Ring",
    "Pickpocketing",
    "Stalking",
    "Vehicle Theft",
    "Vandalism",
] as const;
