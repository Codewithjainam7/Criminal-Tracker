"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const badgeVariants = cva(
    "inline-flex items-center gap-1 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "bg-bureau-700 text-bureau-200 border border-bureau-600",
                primary: "bg-accent-primary/20 text-accent-primary border border-accent-primary/30",
                secondary: "bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30",
                success: "bg-status-secure/20 text-status-secure border border-status-secure/30",
                warning: "bg-status-warning/20 text-status-warning border border-status-warning/30",
                danger: "bg-status-critical/20 text-status-critical border border-status-critical/30",
                info: "bg-status-info/20 text-status-info border border-status-info/30",

                // Case Status
                "case-open": "bg-case-open/20 text-case-open border border-case-open/30",
                "case-active": "bg-case-active/20 text-case-active border border-case-active/30",
                "case-pending": "bg-case-pending/20 text-case-pending border border-case-pending/30",
                "case-closed": "bg-case-closed/20 text-case-closed border border-case-closed/30",
                "case-cold": "bg-case-cold/20 text-case-cold border border-case-cold/30",

                // Priority
                "priority-critical": "bg-priority-critical/20 text-priority-critical border border-priority-critical/30",
                "priority-high": "bg-priority-high/20 text-priority-high border border-priority-high/30",
                "priority-medium": "bg-priority-medium/20 text-priority-medium border border-priority-medium/30",
                "priority-low": "bg-priority-low/20 text-priority-low border border-priority-low/30",

                // Risk Level
                "risk-extreme": "bg-risk-extreme/30 text-red-300 border border-risk-extreme/50",
                "risk-high": "bg-risk-high/20 text-risk-high border border-risk-high/30",
                "risk-medium": "bg-risk-medium/20 text-risk-medium border border-risk-medium/30",
                "risk-low": "bg-risk-low/20 text-risk-low border border-risk-low/30",

                // Solid variants
                "solid-primary": "bg-accent-primary text-white",
                "solid-danger": "bg-status-critical text-white",
                "solid-success": "bg-status-secure text-white",
                "solid-warning": "bg-status-warning text-bureau-900",

                // Outline
                outline: "border border-bureau-500 text-bureau-300 bg-transparent",
            },
            size: {
                xs: "px-1.5 py-0.5 text-2xs rounded",
                sm: "px-2 py-0.5 text-xs rounded-md",
                md: "px-2.5 py-1 text-sm rounded-md",
                lg: "px-3 py-1.5 text-base rounded-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "sm",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    icon?: React.ReactNode;
    removable?: boolean;
    onRemove?: () => void;
    pulse?: boolean;
}

function Badge({
    className,
    variant,
    size,
    icon,
    removable,
    onRemove,
    pulse,
    children,
    ...props
}: BadgeProps) {
    return (
        <div
            className={cn(badgeVariants({ variant, size }), className)}
            {...props}
        >
            {pulse && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                </span>
            )}
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
            {removable && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-1 hover:bg-white/10 rounded p-0.5 transition-colors"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </div>
    );
}

export { Badge, badgeVariants };
