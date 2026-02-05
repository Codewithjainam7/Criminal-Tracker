"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bureau-900 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary:
                    "bg-accent-primary text-white hover:bg-accent-primary/90 shadow-md hover:shadow-lg active:scale-[0.98]",
                secondary:
                    "bg-bureau-700 text-bureau-100 hover:bg-bureau-600 border border-bureau-600",
                danger:
                    "bg-status-critical text-white hover:bg-status-critical/90 shadow-md",
                warning:
                    "bg-status-warning text-bureau-900 hover:bg-status-warning/90",
                success:
                    "bg-status-secure text-white hover:bg-status-secure/90",
                ghost:
                    "text-bureau-300 hover:bg-bureau-800 hover:text-bureau-100",
                outline:
                    "border border-bureau-600 text-bureau-300 hover:bg-bureau-800 hover:text-bureau-100 hover:border-bureau-500",
                link:
                    "text-accent-primary underline-offset-4 hover:underline",
            },
            size: {
                sm: "h-8 px-3 text-xs",
                md: "h-10 px-4 text-sm",
                lg: "h-12 px-6 text-base",
                xl: "h-14 px-8 text-lg",
                icon: "h-10 w-10",
                "icon-sm": "h-8 w-8",
                "icon-lg": "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            loading = false,
            leftIcon,
            rightIcon,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                    </>
                ) : (
                    <>
                        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
                    </>
                )}
            </Comp>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
