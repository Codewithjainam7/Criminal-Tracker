import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Theme, ToastMessage, ModalState } from "@/types/common";

interface UIState {
    // Sidebar
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;

    // Theme
    theme: Theme;

    // Modals
    modals: Record<string, ModalState>;

    // Toast Notifications
    toasts: ToastMessage[];

    // Command Palette
    commandPaletteOpen: boolean;

    // Global Search
    globalSearchQuery: string;
    globalSearchOpen: boolean;

    // Loading States
    globalLoading: boolean;
    loadingMessage: string | null;

    // Mobile
    mobileMenuOpen: boolean;

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebarCollapse: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;

    // Theme
    setTheme: (theme: Theme) => void;

    // Modals
    openModal: (modalId: string, data?: unknown) => void;
    closeModal: (modalId: string) => void;
    toggleModal: (modalId: string) => void;

    // Toasts
    addToast: (toast: Omit<ToastMessage, "id">) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;

    // Command Palette
    openCommandPalette: () => void;
    closeCommandPalette: () => void;
    toggleCommandPalette: () => void;

    // Global Search
    setGlobalSearchQuery: (query: string) => void;
    openGlobalSearch: () => void;
    closeGlobalSearch: () => void;

    // Loading
    setGlobalLoading: (loading: boolean, message?: string) => void;

    // Mobile
    toggleMobileMenu: () => void;
    setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        immer((set) => ({
            // Initial State
            sidebarOpen: true,
            sidebarCollapsed: false,
            theme: "dark",
            modals: {},
            toasts: [],
            commandPaletteOpen: false,
            globalSearchQuery: "",
            globalSearchOpen: false,
            globalLoading: false,
            loadingMessage: null,
            mobileMenuOpen: false,

            // Sidebar Actions
            toggleSidebar: () =>
                set((state) => {
                    state.sidebarOpen = !state.sidebarOpen;
                }),

            setSidebarOpen: (open) =>
                set((state) => {
                    state.sidebarOpen = open;
                }),

            toggleSidebarCollapse: () =>
                set((state) => {
                    state.sidebarCollapsed = !state.sidebarCollapsed;
                }),

            setSidebarCollapsed: (collapsed) =>
                set((state) => {
                    state.sidebarCollapsed = collapsed;
                }),

            // Theme
            setTheme: (theme) =>
                set((state) => {
                    state.theme = theme;
                }),

            // Modals
            openModal: (modalId, data) =>
                set((state) => {
                    state.modals[modalId] = { isOpen: true, data };
                }),

            closeModal: (modalId) =>
                set((state) => {
                    if (state.modals[modalId]) {
                        state.modals[modalId].isOpen = false;
                    }
                }),

            toggleModal: (modalId) =>
                set((state) => {
                    if (state.modals[modalId]) {
                        state.modals[modalId].isOpen = !state.modals[modalId].isOpen;
                    } else {
                        state.modals[modalId] = { isOpen: true };
                    }
                }),

            // Toasts
            addToast: (toast) =>
                set((state) => {
                    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                    state.toasts.push({ ...toast, id });
                    // Auto-remove after duration
                    if (toast.duration !== 0) {
                        setTimeout(() => {
                            set((s) => {
                                s.toasts = s.toasts.filter((t) => t.id !== id);
                            });
                        }, toast.duration || 5000);
                    }
                }),

            removeToast: (id) =>
                set((state) => {
                    state.toasts = state.toasts.filter((t) => t.id !== id);
                }),

            clearToasts: () =>
                set((state) => {
                    state.toasts = [];
                }),

            // Command Palette
            openCommandPalette: () =>
                set((state) => {
                    state.commandPaletteOpen = true;
                }),

            closeCommandPalette: () =>
                set((state) => {
                    state.commandPaletteOpen = false;
                }),

            toggleCommandPalette: () =>
                set((state) => {
                    state.commandPaletteOpen = !state.commandPaletteOpen;
                }),

            // Global Search
            setGlobalSearchQuery: (query) =>
                set((state) => {
                    state.globalSearchQuery = query;
                }),

            openGlobalSearch: () =>
                set((state) => {
                    state.globalSearchOpen = true;
                }),

            closeGlobalSearch: () =>
                set((state) => {
                    state.globalSearchOpen = false;
                    state.globalSearchQuery = "";
                }),

            // Loading
            setGlobalLoading: (loading, message) =>
                set((state) => {
                    state.globalLoading = loading;
                    state.loadingMessage = loading ? (message || null) : null;
                }),

            // Mobile
            toggleMobileMenu: () =>
                set((state) => {
                    state.mobileMenuOpen = !state.mobileMenuOpen;
                }),

            setMobileMenuOpen: (open) =>
                set((state) => {
                    state.mobileMenuOpen = open;
                }),
        })),
        {
            name: "cit-ui-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                sidebarCollapsed: state.sidebarCollapsed,
                theme: state.theme,
            }),
        }
    )
);
