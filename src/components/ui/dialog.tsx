"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
    "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-bureau-850 border border-bureau-700 shadow-bureau-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
    {
        variants: {
            size: {
                sm: "max-w-sm w-full rounded-lg p-4",
                md: "max-w-md w-full rounded-lg p-6",
                lg: "max-w-lg w-full rounded-lg p-6",
                xl: "max-w-xl w-full rounded-lg p-6",
                "2xl": "max-w-2xl w-full rounded-lg p-6",
                full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] w-full rounded-lg p-6 overflow-auto",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

interface DialogContentProps
    extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
    showClose?: boolean;
}

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    DialogContentProps
>(({ className, children, size, showClose = true, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(dialogContentVariants({ size }), className)}
            {...props}
        >
            {children}
            {showClose && (
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-bureau-900 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-bureau-700 text-bureau-400 hover:text-bureau-100">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            )}
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
        {...props}
    />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6",
            className
        )}
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight text-bureau-100", className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-bureau-400 mt-1.5", className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};
