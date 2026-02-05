import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Notification, NotificationType } from "@/types/common";

interface NotificationsState {
    // State
    notifications: Notification[];
    unreadCount: number;
    isOpen: boolean;

    // Actions
    addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;

    // UI
    toggleOpen: () => void;
    setOpen: (open: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
    immer((set, get) => ({
        // Initial State
        notifications: [],
        unreadCount: 0,
        isOpen: false,

        // Add Notification
        addNotification: (notification) =>
            set((state) => {
                const newNotification: Notification = {
                    ...notification,
                    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    read: false,
                    createdAt: new Date(),
                };
                state.notifications.unshift(newNotification);
                state.unreadCount = state.notifications.filter((n) => !n.read).length;
            }),

        // Mark as Read
        markAsRead: (id) =>
            set((state) => {
                const notification = state.notifications.find((n) => n.id === id);
                if (notification && !notification.read) {
                    notification.read = true;
                    state.unreadCount = state.notifications.filter((n) => !n.read).length;
                }
            }),

        // Mark All as Read
        markAllAsRead: () =>
            set((state) => {
                state.notifications.forEach((n) => {
                    n.read = true;
                });
                state.unreadCount = 0;
            }),

        // Remove Notification
        removeNotification: (id) =>
            set((state) => {
                const index = state.notifications.findIndex((n) => n.id === id);
                if (index !== -1) {
                    const wasUnread = !state.notifications[index].read;
                    state.notifications.splice(index, 1);
                    if (wasUnread) {
                        state.unreadCount = Math.max(0, state.unreadCount - 1);
                    }
                }
            }),

        // Clear All
        clearAll: () =>
            set((state) => {
                state.notifications = [];
                state.unreadCount = 0;
            }),

        // UI
        toggleOpen: () =>
            set((state) => {
                state.isOpen = !state.isOpen;
            }),

        setOpen: (open) =>
            set((state) => {
                state.isOpen = open;
            }),
    }))
);

// Helper to create typed notifications
export function createNotification(
    type: NotificationType,
    title: string,
    message: string,
    actionUrl?: string
): Omit<Notification, "id" | "createdAt" | "read"> {
    return { type, title, message, actionUrl };
}
