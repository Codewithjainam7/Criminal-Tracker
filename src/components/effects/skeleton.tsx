"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SkeletonProps {
    className?: string;
    variant?: "default" | "circular" | "rectangular" | "text";
    animation?: "pulse" | "shimmer" | "wave";
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
}

export function Skeleton({
    className,
    variant = "default",
    animation = "shimmer",
    width,
    height,
    style,
}: SkeletonProps) {
    const baseStyles = "bg-bureau-800/50";

    const variantStyles = {
        default: "rounded-lg",
        circular: "rounded-full",
        rectangular: "rounded-none",
        text: "rounded h-4",
    };

    const animationStyles = {
        pulse: "animate-pulse",
        shimmer: "relative overflow-hidden",
        wave: "animate-pulse",
    };

    return (
        <div
            className={cn(
                baseStyles,
                variantStyles[variant],
                animationStyles[animation],
                className
            )}
            style={{ width, height, ...style }}
        >
            {animation === "shimmer" && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
            )}
        </div>
    );
}

// Pre-built skeleton patterns
export function CardSkeleton() {
    return (
        <div className="p-4 rounded-xl bg-bureau-800/30 border border-bureau-700/50 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="w-10 h-10" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
            </div>
        </div>
    );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-bureau-700/50">
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton
                    key={i}
                    className="h-4 flex-1"
                    style={{ maxWidth: i === 0 ? "200px" : undefined }}
                />
            ))}
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="p-5 rounded-xl bg-bureau-800/30 border border-bureau-700/50"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton variant="circular" className="w-12 h-12" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Cards Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    {[1, 2, 3].map((i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-lg bg-bureau-800/30"
                        >
                            <Skeleton variant="circular" className="w-8 h-8" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-5 w-16" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function CasesSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

export function DetailPageSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-64" />
                    <div className="flex gap-2 pt-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-bureau-800/30 flex items-center gap-3">
                        <Skeleton variant="circular" className="w-10 h-10" />
                        <div className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-5 w-12" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-10 w-80" />
                    <div className="p-6 rounded-xl bg-bureau-800/30 space-y-4">
                        <Skeleton className="h-5 w-40" />
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="space-y-1">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="p-6 rounded-xl bg-bureau-800/30 space-y-4">
                        <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                        <div className="text-center space-y-1">
                            <Skeleton className="h-5 w-32 mx-auto" />
                            <Skeleton className="h-4 w-24 mx-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
