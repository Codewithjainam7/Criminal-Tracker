import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { User, UserSession } from "@/types/user";

interface AuthState {
    // State
    user: User | null;
    session: UserSession | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (user: User, session: UserSession) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    refreshSession: (session: UserSession) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        immer((set) => ({
            // Initial State
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login
            login: (user, session) =>
                set((state) => {
                    state.user = user;
                    state.session = session;
                    state.isAuthenticated = true;
                    state.error = null;
                }),

            // Logout
            logout: () =>
                set((state) => {
                    state.user = null;
                    state.session = null;
                    state.isAuthenticated = false;
                }),

            // Update User Profile
            updateUser: (updates) =>
                set((state) => {
                    if (state.user) {
                        state.user = { ...state.user, ...updates };
                    }
                }),

            // Set Loading State
            setLoading: (loading) =>
                set((state) => {
                    state.isLoading = loading;
                }),

            // Set Error
            setError: (error) =>
                set((state) => {
                    state.error = error;
                }),

            // Refresh Session
            refreshSession: (session) =>
                set((state) => {
                    state.session = session;
                }),

            // Clear Error
            clearError: () =>
                set((state) => {
                    state.error = null;
                }),
        })),
        {
            name: "cit-auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                session: state.session,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
