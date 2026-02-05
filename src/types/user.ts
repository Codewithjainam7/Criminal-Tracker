// User and Authentication Types

export type UserRole =
    | "ADMIN"
    | "INVESTIGATOR"
    | "FORENSIC"
    | "ANALYST"
    | "VIEWER";

export type UserStatus = "active" | "inactive" | "suspended" | "on_leave";

export interface User {
    id: string;
    badgeId: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: UserRole;
    department: string;
    division: string;
    rank: string;
    phoneNumber: string;
    avatar?: string;
    status: UserStatus;
    permissions: Permission[];
    twoFactorEnabled: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserSession {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    lastActivity: Date;
}

export interface Permission {
    id: string;
    name: string;
    resource: string;
    actions: PermissionAction[];
}

export type PermissionAction = "create" | "read" | "update" | "delete" | "export" | "assign";

export interface UserActivity {
    id: string;
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: string;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
}

export interface LoginCredentials {
    badgeId: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    badgeId: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    department: string;
    division: string;
    rank: string;
    phoneNumber: string;
    adminCode: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordReset {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface TwoFactorSetup {
    secret: string;
    qrCode: string;
    backupCodes: string[];
}

export interface TwoFactorVerification {
    code: string;
}

// Role-based access configuration
export const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
    ADMIN: ["create", "read", "update", "delete", "export", "assign"],
    INVESTIGATOR: ["create", "read", "update", "export", "assign"],
    FORENSIC: ["create", "read", "update", "export"],
    ANALYST: ["read", "export"],
    VIEWER: ["read"],
};

export const ROLE_LABELS: Record<UserRole, string> = {
    ADMIN: "Administrator",
    INVESTIGATOR: "Lead Investigator",
    FORENSIC: "Forensic Analyst",
    ANALYST: "Intelligence Analyst",
    VIEWER: "Viewer",
};

export const DEPARTMENTS = [
    "Homicide",
    "Narcotics",
    "Cybercrime",
    "Organized Crime",
    "Financial Crimes",
    "Counter-Terrorism",
    "Missing Persons",
    "Cold Cases",
    "Internal Affairs",
    "Special Investigations",
] as const;

export const DIVISIONS = [
    "Eastern District",
    "Western District",
    "Northern District",
    "Southern District",
    "Central Command",
    "Metropolitan Unit",
    "Federal Liaison",
] as const;

export const RANKS = [
    "Agent",
    "Senior Agent",
    "Special Agent",
    "Supervisory Agent",
    "Assistant Director",
    "Deputy Director",
    "Director",
] as const;
