import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
    Suspect,
    SuspectSummary,
    SuspectFilter,
    SuspectStatus,
    RiskLevel,
    DistinguishingMark,
    CriminalRecord
} from "@/types/suspect";
import type { PaginatedResult, SortConfig } from "@/types/common";

type ViewMode = "grid" | "table";

interface SuspectsState {
    // State
    suspects: Suspect[];
    selectedSuspect: Suspect | null;
    suspectSummaries: SuspectSummary[];
    pagination: PaginatedResult<SuspectSummary> | null;

    // UI State
    viewMode: ViewMode;
    filters: SuspectFilter;
    sortConfig: SortConfig;
    isLoading: boolean;
    error: string | null;

    // Actions
    setSuspects: (suspects: Suspect[]) => void;
    addSuspect: (suspect: Suspect) => void;
    updateSuspect: (id: string, updates: Partial<Suspect>) => void;
    deleteSuspect: (id: string) => void;
    setSelectedSuspect: (suspect: Suspect | null) => void;

    // Status Updates
    updateStatus: (suspectId: string, status: SuspectStatus) => void;
    updateRiskLevel: (suspectId: string, riskLevel: RiskLevel) => void;

    // Aliases & Associates
    addAlias: (suspectId: string, alias: string) => void;
    removeAlias: (suspectId: string, alias: string) => void;
    addAssociate: (suspectId: string, associateId: string) => void;
    removeAssociate: (suspectId: string, associateId: string) => void;

    // Criminal History
    addCriminalRecord: (suspectId: string, record: CriminalRecord) => void;
    updateCriminalRecord: (suspectId: string, recordId: string, updates: Partial<CriminalRecord>) => void;

    // Distinguishing Marks
    addDistinguishingMark: (suspectId: string, mark: DistinguishingMark) => void;
    removeDistinguishingMark: (suspectId: string, markId: string) => void;

    // Case Links
    linkToCase: (suspectId: string, caseId: string) => void;
    unlinkFromCase: (suspectId: string, caseId: string) => void;

    // M.O. Tags
    addModusOperandi: (suspectId: string, mo: string) => void;
    removeModusOperandi: (suspectId: string, mo: string) => void;

    // UI Actions
    setViewMode: (mode: ViewMode) => void;
    setFilters: (filters: SuspectFilter) => void;
    clearFilters: () => void;
    setSortConfig: (config: SortConfig) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setPagination: (pagination: PaginatedResult<SuspectSummary>) => void;
}

const initialFilters: SuspectFilter = {
    status: undefined,
    riskLevel: undefined,
    gender: undefined,
    ageRange: undefined,
    search: undefined,
    modusOperandi: undefined,
    hasActiveCase: undefined,
};

export const useSuspectsStore = create<SuspectsState>()(
    immer((set) => ({
        // Initial State
        suspects: [],
        selectedSuspect: null,
        suspectSummaries: [],
        pagination: null,
        viewMode: "grid",
        filters: initialFilters,
        sortConfig: { field: "updatedAt", direction: "desc" },
        isLoading: false,
        error: null,

        // CRUD Actions
        setSuspects: (suspects) =>
            set((state) => {
                state.suspects = suspects;
            }),

        addSuspect: (suspect) =>
            set((state) => {
                state.suspects.push(suspect);
            }),

        updateSuspect: (id, updates) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === id);
                if (index !== -1) {
                    state.suspects[index] = { ...state.suspects[index], ...updates };
                }
                if (state.selectedSuspect?.id === id) {
                    state.selectedSuspect = { ...state.selectedSuspect, ...updates };
                }
            }),

        deleteSuspect: (id) =>
            set((state) => {
                state.suspects = state.suspects.filter((s) => s.id !== id);
                if (state.selectedSuspect?.id === id) {
                    state.selectedSuspect = null;
                }
            }),

        setSelectedSuspect: (suspect) =>
            set((state) => {
                state.selectedSuspect = suspect;
            }),

        // Status Updates
        updateStatus: (suspectId, status) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1) {
                    state.suspects[index].status = status;
                    state.suspects[index].updatedAt = new Date();
                }
            }),

        updateRiskLevel: (suspectId, riskLevel) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1) {
                    state.suspects[index].riskLevel = riskLevel;
                    state.suspects[index].updatedAt = new Date();
                }
            }),

        // Aliases
        addAlias: (suspectId, alias) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1 && !state.suspects[index].aliases.includes(alias)) {
                    state.suspects[index].aliases.push(alias);
                }
            }),

        removeAlias: (suspectId, alias) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1) {
                    state.suspects[index].aliases = state.suspects[index].aliases.filter(
                        (a) => a !== alias
                    );
                }
            }),

        // Associates
        addAssociate: (suspectId, associateId) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1 && !state.suspects[index].knownAssociates.includes(associateId)) {
                    state.suspects[index].knownAssociates.push(associateId);
                }
            }),

        removeAssociate: (suspectId, associateId) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1) {
                    state.suspects[index].knownAssociates = state.suspects[index].knownAssociates.filter(
                        (id) => id !== associateId
                    );
                }
            }),

        // Criminal History
        addCriminalRecord: (suspectId, record) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1) {
                    state.suspects[index].criminalHistory.push(record);
                }
            }),

        updateCriminalRecord: (suspectId, recordId, updates) =>
            set((state) => {
                const suspectIndex = state.suspects.findIndex((s) => s.id === suspectId);
                if (suspectIndex !== -1) {
                    const recordIndex = state.suspects[suspectIndex].criminalHistory.findIndex(
                        (r) => r.id === recordId
                    );
                    if (recordIndex !== -1) {
                        state.suspects[suspectIndex].criminalHistory[recordIndex] = {
                            ...state.suspects[suspectIndex].criminalHistory[recordIndex],
                            ...updates,
                        };
                    }
                }
            }),

        // Distinguishing Marks
        addDistinguishingMark: (suspectId, mark) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1) {
                    state.suspects[index].distinguishingMarks.push(mark);
                }
            }),

        removeDistinguishingMark: (suspectId, markId) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1) {
                    state.suspects[index].distinguishingMarks =
                        state.suspects[index].distinguishingMarks.filter((m) => m.id !== markId);
                }
            }),

        // Case Links
        linkToCase: (suspectId, caseId) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1 && !state.suspects[index].linkedCaseIds.includes(caseId)) {
                    state.suspects[index].linkedCaseIds.push(caseId);
                }
            }),

        unlinkFromCase: (suspectId, caseId) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1) {
                    state.suspects[index].linkedCaseIds =
                        state.suspects[index].linkedCaseIds.filter((id) => id !== caseId);
                }
            }),

        // Modus Operandi
        addModusOperandi: (suspectId, mo) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1 && !state.suspects[index].modusOperandi.includes(mo)) {
                    state.suspects[index].modusOperandi.push(mo);
                }
            }),

        removeModusOperandi: (suspectId, mo) =>
            set((state) => {
                const index = state.suspects.findIndex((s) => s.id === suspectId);
                if (index !== -1) {
                    state.suspects[index].modusOperandi =
                        state.suspects[index].modusOperandi.filter((m) => m !== mo);
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
                state.suspectSummaries = pagination.items;
            }),
    }))
);
