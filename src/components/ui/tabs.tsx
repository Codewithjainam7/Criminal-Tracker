"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
        variant?: "default" | "underline" | "pills";
    }
>(({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
        default: "inline-flex h-10 items-center justify-center rounded-lg bg-bureau-800 p-1 text-bureau-400",
        underline: "inline-flex items-center border-b border-bureau-700 gap-4",
        pills: "inline-flex items-center gap-2 flex-wrap",
    };

    return (
        <TabsPrimitive.List
            ref={ref}
            className={cn(variantStyles[variant], className)}
            {...props}
        />
    );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
        variant?: "default" | "underline" | "pills";
        icon?: React.ReactNode;
    }
>(({ className, variant = "default", icon, children, ...props }, ref) => {
    const variantStyles = {
        default: "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-bureau-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-bureau-700 data-[state=active]:text-bureau-100 data-[state=active]:shadow-sm",
        underline: "inline-flex items-center justify-center whitespace-nowrap pb-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-accent-primary data-[state=active]:text-bureau-100 hover:text-bureau-200",
        pills: "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all bg-bureau-800 border border-bureau-700 data-[state=active]:bg-accent-primary data-[state=active]:text-white data-[state=active]:border-accent-primary hover:bg-bureau-700",
    };

    return (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(
                "gap-2",
                variantStyles[variant],
                className
            )}
            {...props}
        >
            {icon}
            {children}
        </TabsPrimitive.Trigger>
    );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-4 ring-offset-bureau-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 data-[state=inactive]:hidden",
            className
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
