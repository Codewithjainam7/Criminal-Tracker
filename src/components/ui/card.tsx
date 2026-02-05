"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated" | "outlined" | "glass" | "gradient" | "glow";
    hover?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", hover = false, padding = "md", children, ...props }, ref) => {
        const variantStyles = {
            default: "bg-bureau-800/80 backdrop-blur-sm border border-bureau-700/50 shadow-lg shadow-black/10",
            elevated: "bg-bureau-800/90 backdrop-blur-md border border-bureau-700/60 shadow-xl shadow-black/20",
            outlined: "bg-transparent border-2 border-bureau-600/50 backdrop-blur-sm",
            glass: "bg-bureau-900/40 backdrop-blur-xl border border-white/5 shadow-2xl shadow-black/30",
            gradient: "bg-gradient-to-br from-bureau-800/90 to-bureau-900/90 backdrop-blur-md border border-bureau-700/40 shadow-xl",
            glow: "bg-bureau-800/80 backdrop-blur-md border border-accent-primary/20 shadow-lg shadow-accent-primary/10",
        };

        const paddingStyles = {
            none: "",
            sm: "p-3",
            md: "p-5",
            lg: "p-6",
        };

        const hoverStyles = hover
            ? "hover:border-accent-primary/30 hover:shadow-xl hover:shadow-accent-primary/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            : "";

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl relative overflow-hidden",
                    variantStyles[variant],
                    paddingStyles[padding],
                    hoverStyles,
                    className
                )}
                {...props}
            >
                {/* Subtle shine effect for glass/glow variants */}
                {(variant === "glass" || variant === "glow") && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                )}
                {children}
            </div>
        );
    }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 pb-4", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight text-bureau-100",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-bureau-400", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center pt-4 border-t border-bureau-700/50", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

// Premium stat card component
interface StatCardProps {
    title: string;
    value: string | number;
    change?: { value: number; trend: "up" | "down" | "neutral" };
    icon?: React.ReactNode;
    color?: "blue" | "purple" | "green" | "red" | "yellow";
    className?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
    ({ title, value, change, icon, color = "blue", className }, ref) => {
        const colorStyles = {
            blue: "from-accent-primary/20 to-accent-primary/5 border-accent-primary/20",
            purple: "from-accent-secondary/20 to-accent-secondary/5 border-accent-secondary/20",
            green: "from-status-secure/20 to-status-secure/5 border-status-secure/20",
            red: "from-status-critical/20 to-status-critical/5 border-status-critical/20",
            yellow: "from-status-warning/20 to-status-warning/5 border-status-warning/20",
        };

        const iconColors = {
            blue: "text-accent-primary bg-accent-primary/20",
            purple: "text-accent-secondary bg-accent-secondary/20",
            green: "text-status-secure bg-status-secure/20",
            red: "text-status-critical bg-status-critical/20",
            yellow: "text-status-warning bg-status-warning/20",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "relative rounded-xl p-5 backdrop-blur-md border overflow-hidden",
                    "bg-gradient-to-br",
                    colorStyles[color],
                    "hover:scale-[1.02] transition-transform duration-300",
                    className
                )}
            >
                {/* Background glow */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full blur-2xl" />

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-bureau-400">{title}</span>
                        {icon && (
                            <div className={cn("p-2 rounded-lg", iconColors[color])}>
                                {icon}
                            </div>
                        )}
                    </div>
                    <div className="text-3xl font-bold text-bureau-100 mb-1">{value}</div>
                    {change && (
                        <div className={cn(
                            "text-sm flex items-center gap-1",
                            change.trend === "up" && "text-status-secure",
                            change.trend === "down" && "text-status-critical",
                            change.trend === "neutral" && "text-bureau-400"
                        )}>
                            <span>{change.trend === "up" ? "↑" : change.trend === "down" ? "↓" : "→"}</span>
                            <span>{Math.abs(change.value)}%</span>
                            <span className="text-bureau-500">vs last month</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
StatCard.displayName = "StatCard";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, StatCard };
