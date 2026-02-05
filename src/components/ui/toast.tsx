"use client";

import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="dark"
            className="toaster group"
            position="bottom-right"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-bureau-800 group-[.toaster]:text-bureau-100 group-[.toaster]:border-bureau-700 group-[.toaster]:shadow-lg",
                    title: "group-[.toast]:text-bureau-100 group-[.toast]:font-semibold",
                    description: "group-[.toast]:text-bureau-400",
                    actionButton:
                        "group-[.toast]:bg-accent-primary group-[.toast]:text-white",
                    cancelButton:
                        "group-[.toast]:bg-bureau-700 group-[.toast]:text-bureau-300",
                    closeButton:
                        "group-[.toast]:bg-bureau-700 group-[.toast]:text-bureau-300 group-[.toast]:border-bureau-600",
                    success:
                        "group-[.toaster]:border-status-secure/30 group-[.toaster]:bg-status-secure/10",
                    error:
                        "group-[.toaster]:border-status-critical/30 group-[.toaster]:bg-status-critical/10",
                    warning:
                        "group-[.toaster]:border-status-warning/30 group-[.toaster]:bg-status-warning/10",
                    info:
                        "group-[.toaster]:border-status-info/30 group-[.toaster]:bg-status-info/10",
                },
            }}
            {...props}
        />
    );
};

// Custom toast functions with icons
const customToast = {
    success: (message: string, description?: string) => {
        toast.success(message, {
            description,
            icon: <CheckCircle2 className="h-5 w-5 text-status-secure" />,
        });
    },
    error: (message: string, description?: string) => {
        toast.error(message, {
            description,
            icon: <AlertCircle className="h-5 w-5 text-status-critical" />,
        });
    },
    warning: (message: string, description?: string) => {
        toast.warning(message, {
            description,
            icon: <AlertTriangle className="h-5 w-5 text-status-warning" />,
        });
    },
    info: (message: string, description?: string) => {
        toast.info(message, {
            description,
            icon: <Info className="h-5 w-5 text-status-info" />,
        });
    },
    loading: (message: string, description?: string) => {
        return toast.loading(message, { description });
    },
    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(promise, messages);
    },
    dismiss: (id?: string | number) => toast.dismiss(id),
};

export { Toaster, customToast as toast };
