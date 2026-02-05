import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
    Case,
    CaseSummary,
    CaseFilter,
    CaseNote,
    TimelineEvent,
    CaseStatus,
    CasePriority
} from "@/types/case";
import type { PaginatedResult, SortConfig } from "@/types/common";

type ViewMode = "table" | "kanban" | "grid";

interface CasesState {
    // State
    cases: Case[];
    selectedCase: Case | null;
    caseSummaries: CaseSummary[];
    pagination: PaginatedResult<CaseSummary> | null;

    // UI State
    viewMode: ViewMode;
    filters: CaseFilter;
    sortConfig: SortConfig;
    isLoading: boolean;
    error: string | null;

    // Actions
    setCases: (cases: Case[]) => void;
    addCase: (caseData: Case) => void;
    updateCase: (id: string, updates: Partial<Case>) => void;
    deleteCase: (id: string) => void;
    setSelectedCase: (caseData: Case | null) => void;

    // Timeline & Notes
    addTimelineEvent: (caseId: string, event: TimelineEvent) => void;
    addNote: (caseId: string, note: CaseNote) => void;
    updateNote: (caseId: string, noteId: string, updates: Partial<CaseNote>) => void;
    toggleNotePin: (caseId: string, noteId: string) => void;

    // Status & Assignment
    updateStatus: (caseId: string, status: CaseStatus) => void;
    updatePriority: (caseId: string, priority: CasePriority) => void;
    assignOfficer: (caseId: string, officerId: string) => void;
    removeOfficer: (caseId: string, officerId: string) => void;

    // Links
    linkSuspect: (caseId: string, suspectId: string) => void;
    unlinkSuspect: (caseId: string, suspectId: string) => void;
    linkEvidence: (caseId: string, evidenceId: string) => void;
    linkCase: (caseId: string, linkedCaseId: string) => void;

    // UI Actions
    setViewMode: (mode: ViewMode) => void;
    setFilters: (filters: CaseFilter) => void;
    clearFilters: () => void;
    setSortConfig: (config: SortConfig) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setPagination: (pagination: PaginatedResult<CaseSummary>) => void;
}

const initialFilters: CaseFilter = {
    status: undefined,
    priority: undefined,
    category: undefined,
    assignedTo: undefined,
    dateRange: undefined,
    search: undefined,
    tags: undefined,
    jurisdiction: undefined,
};

export const useCasesStore = create<CasesState>()(
    immer((set) => ({
        // Initial State
        cases: [],
        selectedCase: null,
        caseSummaries: [],
        pagination: null,
        viewMode: "table",
        filters: initialFilters,
        sortConfig: { field: "dateUpdated", direction: "desc" },
        isLoading: false,
        error: null,

        // Case CRUD
        setCases: (cases) =>
            set((state) => {
                state.cases = cases;
            }),

        addCase: (caseData) =>
            set((state) => {
                state.cases.push(caseData);
            }),

        updateCase: (id, updates) =>
            set((state) => {
                const index = state.cases.findIndex((c) => c.id === id);
                if (index !== -1) {
                    state.cases[index] = { ...state.cases[index], ...updates };
                }
                if (state.selectedCase?.id === id) {
                    state.selectedCase = { ...state.selectedCase, ...updates };
                }
            }),

        deleteCase: (id) =>
            set((state) => {
                state.cases = state.cases.filter((c) => c.id !== id);
                if (state.selectedCase?.id === id) {
                    state.selectedCase = null;
                }
            }),

        setSelectedCase: (caseData) =>
            set((state) => {
                state.selectedCase = caseData;
            }),

        // Timeline & Notes
        addTimelineEvent: (caseId, event) =>
            set((state) => {
                const caseIndex = state.cases.findIndex((c) => c.id === caseId);
                if (caseIndex !== -1) {
                    state.cases[caseIndex].timeline.push(event);
                }
            }),

        addNote: (caseId, note) =>
            set((state) => {
                const caseIndex = state.cases.findIndex((c) => c.id === caseId);
                if (caseIndex !== -1) {
                    state.cases[caseIndex].notes.push(note);
                }
            }),

        updateNote: (caseId, noteId, updates) =>
            set((state) => {
                const caseIndex = state.cases.findIndex((c) => c.id === caseId);
                if (caseIndex !== -1) {
                    const noteIndex = state.cases[caseIndex].notes.findIndex(
                        (n) => n.id === noteId
                    );
                    if (noteIndex !== -1) {
                        state.cases[caseIndex].notes[noteIndex] = {
                            ...state.cases[caseIndex].notes[noteIndex],
                            ...updates,
                        };
                    }
                }
            }),

        toggleNotePin: (caseId, noteId) =>
            set((state) => {
                const caseIndex = state.cases.findIndex((c) => c.id === caseId);
                if (caseIndex !== -1) {
                    const noteIndex = state.cases[caseIndex].notes.findIndex(
                        (n) => n.id === noteId
                    );
                    if (noteIndex !== -1) {
                        state.cases[caseIndex].notes[noteIndex].isPinned =
                            !state.cases[caseIndex].notes[noteIndex].isPinned;
                    }
                }
            }),

        // Status & Assignment
        updateStatus: (caseId, status) =>
            set((state) => {
                const index = state.cases.findIndex((c) => c.id === caseId);
                if (index !== -1) {
                    state.cases[index].status = status;
                    state.cases[index].dateUpdated = new Date();
                    if (status === "closed") {
                        state.cases[index].dateClosed = new Date();
                    }
                }
            }),

        updatePriority: (caseId, priority) =>
            set((state) => {
                const index = state.cases.findIndex((c) => c.id === caseId);
                if (index !== -1) {
                    state.cases[index].priority = priority;
                    state.cases[index].dateUpdated = new Date();
                }
            }),

        assignOfficer: (caseId, officerId) =>
            set((state) => {
                const index = state.cases.findIndex((c) => c.id === caseId);
                if (index !== -1 && !state.cases[index].assignedOfficers.includes(officerId)) {
                    state.cases[index].assignedOfficers.push(officerId);
                }
            }),

        removeOfficer: (caseId, officerId) =>
            set((state) => {
                const index = state.cases.findIndex((c) => c.id === caseId);
                if (index !== -1) {
                    state.cases[index].assignedOfficers = state.cases[index].assignedOfficers.filter(
                        (id) => id !== officerId
                    );
                }
            }),

        // Links
        linkSuspect: (caseId, suspectId) =>
            set((state) => {
                const index = state.cases.findIndex((c) => c.id === caseId);
                if (index !== -1 && !state.cases[index].suspectIds.includes(suspectId)) {
                    state.cases[index].suspectIds.push(suspectId);
                }
            }),

        unlinkSuspect: (caseId, suspectId) =>
            set((state) => {
                const index = state.cases.findIndex((c) => c.id === caseId);
                if (index !== -1) {
                    state.cases[index].suspectIds = state.cases[index].suspectIds.filter(
                        (id) => id !== suspectId
                    );
                }
            }),

        linkEvidence: (caseId, evidenceId) =>
            set((state) => {
                const index = state.cases.findIndex((c) => c.id === caseId);
                if (index !== -1 && !state.cases[index].evidenceIds.includes(evidenceId)) {
                    state.cases[index].evidenceIds.push(evidenceId);
                }
            }),

        linkCase: (caseId, linkedCaseId) =>
            set((state) => {
                const index = state.cases.findIndex((c) => c.id === caseId);
                if (index !== -1 && !state.cases[index].linkedCaseIds.includes(linkedCaseId)) {
                    state.cases[index].linkedCaseIds.push(linkedCaseId);
                }
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
                state.caseSummaries = pagination.items;
            }),
    }))
);
