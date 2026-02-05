"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    X,
    Check,
    AlertTriangle,
    Info,
    CheckCircle,
    Briefcase,
    UserSearch,
    FileBox,
    Shield,
    Clock,
    MoreHorizontal,
    Trash2,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatRelativeTime } from "@/lib/utils";

export interface Notification {
    id: string;
    type: "case_update" | "suspect_alert" | "evidence_added" | "assignment" | "system" | "urgent";
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    metadata?: {
        caseId?: string;
        suspectId?: string;
        evidenceId?: string;
        userId?: string;
        userName?: string;
    };
}

// Mock notifications
const mockNotifications: Notification[] = [
    {
        id: "notif-001",
        type: "urgent",
        title: "HIGH PRIORITY: Suspect Sighted",
        message: 'Viktor "The Ghost" Petrov spotted near Metro Station District 7.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
        read: false,
        actionUrl: "/suspects/suspect-001",
        metadata: { suspectId: "suspect-001" },
    },
    {
        id: "notif-002",
        type: "case_update",
        title: "Case Status Updated",
        message: "Downtown Jewelry Heist moved to Active status by Agent Chen.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        read: false,
        actionUrl: "/cases/case-002",
        metadata: { caseId: "case-002", userName: "Agent Chen" },
    },
    {
        id: "notif-003",
        type: "evidence_added",
        title: "New Evidence Logged",
        message: "Digital forensics report added to Cyber Bank Heist case.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        actionUrl: "/evidence/evidence-005",
        metadata: { evidenceId: "evidence-005" },
    },
    {
        id: "notif-004",
        type: "assignment",
        title: "New Case Assignment",
        message: "You have been assigned as lead investigator for Cold Case #47.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
        actionUrl: "/cases/case-007",
    },
    {
        id: "notif-005",
        type: "system",
        title: "System Maintenance",
        message: "Scheduled maintenance window: 02:00-04:00 UTC tonight.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
    },
];

interface NotificationsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const unreadCount = notifications.filter((n) => !n.read).length;
    const filteredNotifications =
        filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "urgent":
                return <AlertTriangle className="h-4 w-4" />;
            case "case_update":
                return <Briefcase className="h-4 w-4" />;
            case "suspect_alert":
                return <UserSearch className="h-4 w-4" />;
            case "evidence_added":
                return <FileBox className="h-4 w-4" />;
            case "assignment":
                return <Shield className="h-4 w-4" />;
            case "system":
                return <Info className="h-4 w-4" />;
            default:
                return <Bell className="h-4 w-4" />;
        }
    };

    const getIconStyle = (type: Notification["type"]) => {
        switch (type) {
            case "urgent":
                return "bg-status-critical/20 text-status-critical";
            case "case_update":
                return "bg-accent-primary/20 text-accent-primary";
            case "suspect_alert":
                return "bg-status-warning/20 text-status-warning";
            case "evidence_added":
                return "bg-status-secure/20 text-status-secure";
            case "assignment":
                return "bg-accent-secondary/20 text-accent-secondary";
            default:
                return "bg-bureau-700 text-bureau-400";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="fixed top-16 right-4 w-96 max-h-[80vh] bg-bureau-900 border border-bureau-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-bureau-700 bg-bureau-850">
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-accent-primary" />
                                <h3 className="font-semibold text-bureau-100">Notifications</h3>
                                {unreadCount > 0 && (
                                    <Badge variant="danger" size="xs">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                                        <Check className="h-4 w-4 mr-1" />
                                        Mark all read
                                    </Button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-bureau-800 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-bureau-400" />
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-bureau-800">
                            {["all", "unread"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f as typeof filter)}
                                    className={cn(
                                        "px-3 py-1 text-xs rounded-full transition-colors capitalize",
                                        filter === f
                                            ? "bg-accent-primary text-white"
                                            : "bg-bureau-800 text-bureau-400 hover:bg-bureau-700"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[60vh] overflow-y-auto">
                            {filteredNotifications.length > 0 ? (
                                <div>
                                    {filteredNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                "px-4 py-3 border-b border-bureau-800/50 hover:bg-bureau-800/30 transition-colors",
                                                !notification.read && "bg-accent-primary/5"
                                            )}
                                        >
                                            <div className="flex gap-3">
                                                <div
                                                    className={cn(
                                                        "p-2 rounded-lg flex-shrink-0",
                                                        getIconStyle(notification.type)
                                                    )}
                                                >
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4
                                                            className={cn(
                                                                "text-sm font-medium",
                                                                notification.read
                                                                    ? "text-bureau-300"
                                                                    : "text-bureau-100"
                                                            )}
                                                        >
                                                            {notification.title}
                                                        </h4>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button className="p-1 hover:bg-bureau-700 rounded">
                                                                    <MoreHorizontal className="h-4 w-4 text-bureau-500" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {!notification.read && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => markAsRead(notification.id)}
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        Mark as read
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuItem
                                                                    onClick={() => deleteNotification(notification.id)}
                                                                    className="text-status-critical"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <p className="text-sm text-bureau-400 mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs text-bureau-500 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {formatRelativeTime(notification.timestamp)}
                                                        </span>
                                                        {notification.type === "urgent" && (
                                                            <Badge
                                                                variant="danger"
                                                                size="xs"
                                                                pulse
                                                            >
                                                                Urgent
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-bureau-500">
                                    <Bell className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                    <p>No notifications</p>
                                    <p className="text-sm mt-1">
                                        {filter === "unread" ? "All caught up!" : "Check back later"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-bureau-700 bg-bureau-850">
                            <Button variant="outline" className="w-full" size="sm">
                                View All Notifications
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Notification Bell with unread count
export function NotificationBell({
    onClick,
    unreadCount = 0,
}: {
    onClick: () => void;
    unreadCount?: number;
}) {
    return (
        <button
            onClick={onClick}
            className="relative p-2 hover:bg-bureau-800 rounded-lg transition-colors"
        >
            <Bell className="h-5 w-5 text-bureau-400" />
            {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-status-critical text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
        </button>
    );
}
