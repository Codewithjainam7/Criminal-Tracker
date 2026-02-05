// Common/Shared Types

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ResponseMeta;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
}

export interface ResponseMeta {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
}

// Pagination
export interface PaginationParams {
    page: number;
    perPage: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
    items: T[];
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

// Sorting
export interface SortConfig {
    field: string;
    direction: "asc" | "desc";
}

// Filter Builder
export interface FilterCondition {
    field: string;
    operator: FilterOperator;
    value: unknown;
}

export type FilterOperator =
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "starts_with"
    | "ends_with"
    | "greater_than"
    | "less_than"
    | "between"
    | "in"
    | "not_in"
    | "is_null"
    | "is_not_null";

export interface SavedFilter {
    id: string;
    name: string;
    conditions: FilterCondition[];
    createdBy: string;
    isShared: boolean;
    createdAt: Date;
}

// Select Options
export interface SelectOption<T = string> {
    value: T;
    label: string;
    disabled?: boolean;
    icon?: string;
}

// Date Range
export interface DateRange {
    from: Date;
    to: Date;
}

// Location/Coordinates
export interface Coordinates {
    lat: number;
    lng: number;
}

export interface GeoLocation {
    address: string;
    coordinates: Coordinates;
    accuracy?: number;
}

// Notification
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    actionUrl?: string;
    createdAt: Date;
}

export type NotificationType =
    | "info"
    | "success"
    | "warning"
    | "error"
    | "case_update"
    | "assignment"
    | "mention"
    | "system";

// Audit Log
export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: AuditAction;
    resource: string;
    resourceId: string;
    details: Record<string, unknown>;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
}

export type AuditAction =
    | "create"
    | "read"
    | "update"
    | "delete"
    | "login"
    | "logout"
    | "export"
    | "assign"
    | "status_change";

// File/Attachment
export interface Attachment {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    thumbnailUrl?: string;
    uploadedBy: string;
    uploadedAt: Date;
}

// Comment/Note
export interface Comment {
    id: string;
    content: string;
    author: string;
    authorName: string;
    mentions: string[];
    attachments: Attachment[];
    createdAt: Date;
    updatedAt: Date;
}

// Activity/Timeline
export interface Activity {
    id: string;
    type: string;
    title: string;
    description: string;
    user: string;
    userName: string;
    resourceType: string;
    resourceId: string;
    metadata?: Record<string, unknown>;
    timestamp: Date;
}

// Status Badge Config
export interface StatusConfig {
    label: string;
    color: string;
    bgColor: string;
    icon?: string;
}

// Table Column Config
export interface TableColumn<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    width?: string;
    align?: "left" | "center" | "right";
    render?: (value: unknown, row: T) => React.ReactNode;
}

// Modal State
export interface ModalState {
    isOpen: boolean;
    data?: unknown;
}

// Toast Message
export interface ToastMessage {
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message?: string;
    duration?: number;
}

// Search Result
export interface SearchResult {
    id: string;
    type: "case" | "suspect" | "evidence" | "witness" | "user";
    title: string;
    subtitle?: string;
    url: string;
    highlights?: string[];
}

// Global Search Category
export interface SearchCategory {
    id: string;
    label: string;
    icon: string;
    results: SearchResult[];
    total: number;
}

// Theme
export type Theme = "light" | "dark" | "system";

// Keyboard Shortcut
export interface KeyboardShortcut {
    keys: string[];
    description: string;
    action: () => void;
}
