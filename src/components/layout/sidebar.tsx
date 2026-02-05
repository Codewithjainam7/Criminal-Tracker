"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Briefcase,
    UserSearch,
    FileBox,
    Users,
    BarChart3,
    FileText,
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Bell,
    HelpCircle,
    Brain,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface NavItem {
    title: string;
    href: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeVariant?: "default" | "danger" | "warning";
    children?: NavItem[];
}

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        title: "Cases",
        href: "/cases",
        icon: <Briefcase className="h-5 w-5" />,
        badge: 12,
        badgeVariant: "default",
    },
    {
        title: "Suspects",
        href: "/suspects",
        icon: <UserSearch className="h-5 w-5" />,
        badge: 3,
        badgeVariant: "danger",
    },
    {
        title: "Evidence",
        href: "/evidence",
        icon: <FileBox className="h-5 w-5" />,
    },
    {
        title: "Witnesses",
        href: "/witnesses",
        icon: <Users className="h-5 w-5" />,
    },
    {
        title: "AI Matching",
        href: "/ai-matching",
        icon: <Brain className="h-5 w-5" />,
        badge: "Beta",
        badgeVariant: "warning",
    },
    {
        title: "Analytics",
        href: "/analytics",
        icon: <BarChart3 className="h-5 w-5" />,
    },
    {
        title: "Reports",
        href: "/reports",
        icon: <FileText className="h-5 w-5" />,
    },
];

const bottomNavItems: NavItem[] = [
    {
        title: "Admin",
        href: "/admin",
        icon: <Shield className="h-5 w-5" />,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: <Settings className="h-5 w-5" />,
    },
    {
        title: "Help",
        href: "/help",
        icon: <HelpCircle className="h-5 w-5" />,
    },
];

function NavLink({
    item,
    collapsed,
    index,
}: {
    item: NavItem;
    collapsed: boolean;
    index: number;
}) {
    const pathname = usePathname();
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            <Link
                href={item.href}
                className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                    isActive
                        ? "bg-gradient-to-r from-accent-primary/20 to-accent-primary/5 text-accent-primary shadow-lg shadow-accent-primary/10"
                        : "text-bureau-400 hover:bg-bureau-800/80 hover:text-bureau-100"
                )}
            >
                {/* Active glow effect */}
                {isActive && (
                    <motion.div
                        layoutId="sidebar-glow"
                        className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 to-transparent"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}

                {/* Active indicator bar */}
                {isActive && (
                    <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-accent-primary to-accent-secondary rounded-r-full shadow-lg shadow-accent-primary/50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}

                <span className={cn(
                    "shrink-0 relative z-10 transition-transform duration-200",
                    isActive && "scale-110"
                )}>
                    {item.icon}
                </span>

                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="font-medium text-sm whitespace-nowrap overflow-hidden relative z-10"
                        >
                            {item.title}
                        </motion.span>
                    )}
                </AnimatePresence>

                {!collapsed && item.badge && (
                    <motion.div
                        className="ml-auto relative z-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                    >
                        <Badge
                            variant={
                                item.badgeVariant === "danger"
                                    ? "danger"
                                    : item.badgeVariant === "warning"
                                        ? "warning"
                                        : "primary"
                            }
                            size="xs"
                            pulse={item.badgeVariant === "danger"}
                        >
                            {item.badge}
                        </Badge>
                    </motion.div>
                )}

                {/* Hover effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-bureau-700/0 via-bureau-700/50 to-bureau-700/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                />
            </Link>
        </motion.div>
    );
}

export function Sidebar() {
    const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();

    return (
        <motion.aside
            initial={false}
            animate={{ width: sidebarCollapsed ? 80 : 280 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            className={cn(
                "fixed left-0 top-0 h-screen z-40 flex flex-col",
                "hidden md:flex",
                // Glassmorphism effect
                "bg-bureau-900/70 backdrop-blur-xl border-r border-bureau-700/50",
                "shadow-2xl shadow-black/20"
            )}
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-primary/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-secondary/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
            </div>

            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-bureau-700/50 relative">
                <Link href="/dashboard" className="flex items-center gap-3 min-w-0 flex-1 group">
                    <motion.div
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/30 relative overflow-hidden flex-shrink-0"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* Animated shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                        <Shield className="h-6 w-6 text-white relative z-10" />
                    </motion.div>
                    <AnimatePresence>
                        {!sidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="min-w-0 flex-1 overflow-hidden"
                            >
                                <span className="font-bold text-lg text-bureau-100 whitespace-nowrap flex items-center gap-1">
                                    CIT
                                    <Zap className="h-3 w-3 text-accent-primary animate-pulse flex-shrink-0" />
                                </span>
                                <span className="text-[10px] text-bureau-500 block truncate">
                                    Criminal Investigation Tracker
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Link>

                {/* Collapse toggle */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleSidebarCollapse}
                    className={cn(
                        "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full",
                        "bg-bureau-800 border border-bureau-700 shadow-lg",
                        "flex items-center justify-center",
                        "text-bureau-400 hover:text-bureau-100 hover:bg-bureau-700",
                        "transition-colors duration-200"
                    )}
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 relative">
                <div className="space-y-1">
                    {mainNavItems.map((item, index) => (
                        <NavLink key={item.href} item={item} collapsed={sidebarCollapsed} index={index} />
                    ))}
                </div>

                <div className="pt-4 mt-4 border-t border-bureau-700/50 space-y-1">
                    {bottomNavItems.map((item, index) => (
                        <NavLink
                            key={item.href}
                            item={item}
                            collapsed={sidebarCollapsed}
                            index={mainNavItems.length + index}
                        />
                    ))}
                </div>
            </nav>

            {/* User Profile Section */}
            <div className="p-3 border-t border-bureau-700/50 relative">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                        "flex items-center gap-3 p-2 rounded-xl",
                        "bg-gradient-to-r from-bureau-800/80 to-bureau-800/40",
                        "backdrop-blur-sm border border-bureau-700/30",
                        "hover:border-accent-primary/30 transition-all duration-300",
                        "cursor-pointer group"
                    )}
                >
                    <div className="relative">
                        <Avatar name="John Agent" size="sm" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-status-secure border-2 border-bureau-900 rounded-full" />
                    </div>
                    <AnimatePresence>
                        {!sidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="flex-1 min-w-0 overflow-hidden"
                            >
                                <p className="text-sm font-medium text-bureau-100 truncate group-hover:text-accent-primary transition-colors">
                                    John Agent
                                </p>
                                <p className="text-2xs text-bureau-500 truncate">
                                    Senior Investigator
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.aside>
    );
}
