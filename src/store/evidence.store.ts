import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
    Evidence,
    EvidenceSummary,
    EvidenceFilter,
    EvidenceStatus,
} from "@/types/evidence";
import type { PaginatedResult, SortConfig } from "@/types/common";

type ViewMode = "gallery" | "list";

interface EvidenceState {
    // State
    evidence: Evidence[];
    selectedEvidence: Evidence | null;
    evidenceSummaries: EvidenceSummary[];
    pagination: PaginatedResult<EvidenceSummary> | null;

    // UI State
    viewMode: ViewMode;
    filters: EvidenceFilter;
    sortConfig: SortConfig;
    isLoading: boolean;
    isUploading: boolean;
    uploadProgress: number;
    error: string | null;

    // Actions
    setEvidence: (evidence: Evidence[]) => void;
    addEvidence: (evidence: Evidence) => void;
    updateEvidence: (id: string, updates: Partial<Evidence>) => void;
    deleteEvidence: (id: string) => void;
    setSelectedEvidence: (evidence: Evidence | null) => void;

    // Status
    updateStatus: (evidenceId: string, status: EvidenceStatus) => void;

    // Tags
    addTag: (evidenceId: string, tag: string) => void;
    removeTag: (evidenceId: string, tag: string) => void;

    // Upload
    setUploading: (uploading: boolean) => void;
    setUploadProgress: (progress: number) => void;

    // UI Actions
    setViewMode: (mode: ViewMode) => void;
    setFilters: (filters: EvidenceFilter) => void;
    clearFilters: () => void;
    setSortConfig: (config: SortConfig) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setPagination: (pagination: PaginatedResult<EvidenceSummary>) => void;
}

const initialFilters: EvidenceFilter = {
    type: undefined,
    status: undefined,
    caseId: undefined,
    dateRange: undefined,
    search: undefined,
    tags: undefined,
};

export const useEvidenceStore = create<EvidenceState>()(
    immer((set) => ({
        // Initial State
        evidence: [],
        selectedEvidence: null,
        evidenceSummaries: [],
        pagination: null,
        viewMode: "gallery",
        filters: initialFilters,
        sortConfig: { field: "collectedAt", direction: "desc" },
        isLoading: false,
        isUploading: false,
        uploadProgress: 0,
        error: null,

        // CRUD Actions
        setEvidence: (evidence) =>
            set((state) => {
                state.evidence = evidence;
            }),

        addEvidence: (evidence) =>
            set((state) => {
                state.evidence.push(evidence);
            }),

        updateEvidence: (id, updates) =>
            set((state) => {
                const index = state.evidence.findIndex((e) => e.id === id);
                if (index !== -1) {
                    state.evidence[index] = { ...state.evidence[index], ...updates };
                }
                if (state.selectedEvidence?.id === id) {
                    state.selectedEvidence = { ...state.selectedEvidence, ...updates };
                }
            }),

        deleteEvidence: (id) =>
            set((state) => {
                state.evidence = state.evidence.filter((e) => e.id !== id);
                if (state.selectedEvidence?.id === id) {
                    state.selectedEvidence = null;
                }
            }),

        setSelectedEvidence: (evidence) =>
            set((state) => {
                state.selectedEvidence = evidence;
            }),

        // Status
        updateStatus: (evidenceId, status) =>
            set((state) => {
                const index = state.evidence.findIndex((e) => e.id === evidenceId);
                if (index !== -1) {
                    state.evidence[index].status = status;
                    state.evidence[index].updatedAt = new Date();
                }
            }),

        // Tags
        addTag: (evidenceId, tag) =>
            set((state) => {
                const index = state.evidence.findIndex((e) => e.id === evidenceId);
                if (index !== -1 && !state.evidence[index].tags.includes(tag)) {
                    state.evidence[index].tags.push(tag);
                }
            }),

        removeTag: (evidenceId, tag) =>
            set((state) => {
                const index = state.evidence.findIndex((e) => e.id === evidenceId);
                if (index !== -1) {
                    state.evidence[index].tags = state.evidence[index].tags.filter((t) => t !== tag);
                }
            }),

        // Upload
        setUploading: (uploading) =>
            set((state) => {
                state.isUploading = uploading;
                if (!uploading) state.uploadProgress = 0;
            }),

        setUploadProgress: (progress) =>
            set((state) => {
                state.uploadProgress = progress;
            }),

        // UI Actions
        setViewMode: (mode) =>
            set((state) => {
                state.viewMode = mode;
            }),

        setFilters: (filters) =>
            set((state) => {
                state.filters = { ...state.filters, ...filters };
            }),

        clearFilters: () =>
            set((state) => {
                state.filters = initialFilters;
            }),

        setSortConfig: (config) =>
            set((state) => {
                state.sortConfig = config;
            }),

        setLoading: (loading) =>
            set((state) => {
                state.isLoading = loading;
            }),

        setError: (error) =>
            set((state) => {
                state.error = error;
            }),

        setPagination: (pagination) =>
            set((state) => {
                state.pagination = pagination;
                state.evidenceSummaries = pagination.items;
            }),
    }))
);
