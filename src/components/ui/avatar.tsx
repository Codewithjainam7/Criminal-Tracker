"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, getInitials } from "@/lib/utils";
import { User } from "lucide-react";

const avatarVariants = cva(
    "relative flex shrink-0 overflow-hidden rounded-full",
    {
        variants: {
            size: {
                xs: "h-6 w-6 text-xs",
                sm: "h-8 w-8 text-xs",
                md: "h-10 w-10 text-sm",
                lg: "h-12 w-12 text-base",
                xl: "h-16 w-16 text-lg",
                "2xl": "h-20 w-20 text-xl",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

interface AvatarProps
    extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
    src?: string | null;
    alt?: string;
    name?: string;
    showStatus?: boolean;
    status?: "online" | "offline" | "busy" | "away";
}

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    AvatarProps
>(({ className, src, alt, name, size, showStatus, status = "offline", ...props }, ref) => {
    const initials = name ? getInitials(name) : null;

    const statusColors = {
        online: "bg-status-secure",
        offline: "bg-bureau-500",
        busy: "bg-status-critical",
        away: "bg-status-warning",
    };

    return (
        <div className="relative inline-block">
            <AvatarPrimitive.Root
                ref={ref}
                className={cn(avatarVariants({ size }), className)}
                {...props}
            >
                <AvatarPrimitive.Image
                    src={src || undefined}
                    alt={alt || name || "Avatar"}
                    className="aspect-square h-full w-full object-cover"
                />
                <AvatarPrimitive.Fallback
                    className={cn(
                        "flex h-full w-full items-center justify-center bg-bureau-700 text-bureau-300 font-medium"
                    )}
                >
                    {initials || <User className="h-1/2 w-1/2" />}
                </AvatarPrimitive.Fallback>
            </AvatarPrimitive.Root>

            {showStatus && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 block rounded-full ring-2 ring-bureau-900",
                        statusColors[status],
                        size === "xs" && "h-1.5 w-1.5",
                        size === "sm" && "h-2 w-2",
                        size === "md" && "h-2.5 w-2.5",
                        size === "lg" && "h-3 w-3",
                        size === "xl" && "h-3.5 w-3.5",
                        size === "2xl" && "h-4 w-4"
                    )}
                />
            )}
        </div>
    );
});
Avatar.displayName = "Avatar";

interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    size?: VariantProps<typeof avatarVariants>["size"];
    className?: string;
}

function AvatarGroup({ children, max = 4, size = "md", className }: AvatarGroupProps) {
    const childrenArray = React.Children.toArray(children);
    const visibleChildren = childrenArray.slice(0, max);
    const remainingCount = childrenArray.length - max;

    return (
        <div className={cn("flex -space-x-2", className)}>
            {visibleChildren.map((child, index) => (
                <div key={index} className="ring-2 ring-bureau-900 rounded-full">
                    {React.isValidElement(child)
                        ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
                        : child}
                </div>
            ))}
            {remainingCount > 0 && (
                <div
                    className={cn(
                        avatarVariants({ size }),
                        "flex items-center justify-center bg-bureau-700 text-bureau-300 font-medium border-2 border-bureau-900"
                    )}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}

export { Avatar, AvatarGroup, avatarVariants };
