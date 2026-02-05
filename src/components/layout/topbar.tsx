"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Search,
    Bell,
    Command,
    Menu,
    X,
    ChevronDown,
    LogOut,
    User,
    Settings,
    HelpCircle,
    Shield,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore, useNotificationsStore, useAuthStore } from "@/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
    const {
        sidebarCollapsed,
        mobileMenuOpen,
        toggleMobileMenu,
        openCommandPalette,
    } = useUIStore();
    const { unreadCount, toggleOpen: toggleNotifications } = useNotificationsStore();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "fixed top-0 right-0 h-16 z-30 flex items-center justify-between px-4 lg:px-6",
                // Glassmorphism
                "bg-bureau-900/60 backdrop-blur-xl border-b border-bureau-700/50",
                "shadow-lg shadow-black/10",
                // Left position for sidebar
                "left-0 md:left-[280px]",
                sidebarCollapsed && "md:left-[80px]"
            )}
            style={{
                transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-32 bg-accent-primary/5 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-0 right-1/4 w-96 h-32 bg-accent-secondary/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
            </div>

            {/* Mobile Menu Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-bureau-400 hover:text-bureau-100 hover:bg-bureau-800/50 rounded-lg transition-all"
            >
                {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Menu className="h-6 w-6" />
                )}
            </motion.button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4 relative">
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={openCommandPalette}
                    className={cn(
                        "w-full flex items-center gap-3 px-4 h-10 rounded-xl",
                        "bg-bureau-800/50 backdrop-blur-sm",
                        "border border-bureau-700/50 hover:border-accent-primary/30",
                        "text-bureau-500 hover:text-bureau-400",
                        "shadow-inner shadow-black/10",
                        "transition-all duration-300 group"
                    )}
                >
                    <Search className="h-4 w-4 group-hover:text-accent-primary transition-colors" />
                    <span className="text-sm flex-1 text-left">Search cases, suspects, evidence...</span>
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-bureau-700/50 backdrop-blur-sm rounded-lg text-xs text-bureau-400 border border-bureau-600/30">
                        <Command className="h-3 w-3" />K
                    </kbd>
                </motion.button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 relative z-10">
                {/* Status Indicator */}
                <motion.div
                    className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-status-secure/10 border border-status-secure/20 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="w-2 h-2 bg-status-secure rounded-full animate-pulse" />
                    <span className="text-xs text-status-secure font-medium">SECURE</span>
                </motion.div>

                {/* Notifications */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleNotifications}
                    className={cn(
                        "relative p-2.5 rounded-xl transition-all duration-300",
                        "text-bureau-400 hover:text-bureau-100",
                        "hover:bg-bureau-800/50 backdrop-blur-sm",
                        "border border-transparent hover:border-bureau-700/50"
                    )}
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-status-critical to-red-600 text-white text-2xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-status-critical/50 animate-pulse"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </motion.span>
                    )}
                </motion.button>

                {/* Divider */}
                <div className="w-px h-8 bg-bureau-700/50 mx-1" />

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                                "flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-all duration-300",
                                "hover:bg-bureau-800/50 backdrop-blur-sm",
                                "border border-transparent hover:border-bureau-700/50",
                                "group"
                            )}
                        >
                            <div className="relative">
                                <Avatar name="John Agent" size="sm" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-status-secure border-2 border-bureau-900 rounded-full" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <span className="text-sm font-medium text-bureau-200 group-hover:text-bureau-100 transition-colors">
                                    John Agent
                                </span>
                                <span className="text-2xs text-bureau-500 block">Level 5 Clearance</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-bureau-500 group-hover:text-bureau-400 transition-colors" />
                        </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-bureau-900/90">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex items-center gap-3">
                                <Avatar name="John Agent" size="sm" />
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">John Agent</p>
                                    <p className="text-xs text-bureau-500">john.agent@cia.gov</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="group">
                            <User className="mr-2 h-4 w-4 group-hover:text-accent-primary transition-colors" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="group">
                            <Settings className="mr-2 h-4 w-4 group-hover:text-accent-primary transition-colors" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="group">
                            <HelpCircle className="mr-2 h-4 w-4 group-hover:text-accent-primary transition-colors" />
                            Help & Support
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-status-critical focus:text-status-critical"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.header>
    );
}
