"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useUIStore } from "@/store";
import { Toaster } from "@/components/ui/toast";
import { GlobalSearch, useGlobalSearch } from "@/components/global-search";
import { NotificationsPanel } from "@/components/notifications-panel";
import { useNotificationsStore } from "@/store";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { sidebarCollapsed } = useUIStore();
    const globalSearch = useGlobalSearch();
    const { isOpen: notificationsOpen, toggleOpen: toggleNotifications } = useNotificationsStore();

    return (
        <div className="min-h-screen bg-bureau-950 relative overflow-hidden">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
                        backgroundSize: "50px 50px",
                    }}
                />
                {/* Ambient glow */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-secondary/5 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000" />
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />
            </div>

            <Sidebar />
            <Topbar />

            <main
                className={cn(
                    "pt-20 min-h-screen transition-all duration-300 ease-out relative z-10",
                    "ml-0 md:ml-[280px]",
                    sidebarCollapsed && "md:ml-[80px]"
                )}
            >
                <div className="p-4 lg:p-6 xl:p-8">
                    {children}
                </div>
            </main>

            {/* Global Search */}
            <GlobalSearch isOpen={globalSearch.isOpen} onClose={globalSearch.close} />

            {/* Notifications Panel */}
            <NotificationsPanel isOpen={notificationsOpen} onClose={toggleNotifications} />

            <Toaster />
        </div>
    );
}
