"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

const inputVariants = cva(
    "flex w-full bg-bureau-800 border text-bureau-100 transition-all duration-200 placeholder:text-bureau-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "border-bureau-600 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary",
                error: "border-status-critical focus:border-status-critical focus:ring-1 focus:ring-status-critical",
                success: "border-status-secure focus:border-status-secure focus:ring-1 focus:ring-status-secure",
            },
            inputSize: {
                sm: "h-8 px-3 text-xs rounded-md",
                md: "h-10 px-4 text-sm rounded-md",
                lg: "h-12 px-4 text-base rounded-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            inputSize: "md",
        },
    }
);

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
    label?: string;
    helperText?: string;
    error?: string;
    success?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    floatingLabel?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = "text",
            variant,
            inputSize,
            label,
            helperText,
            error,
            success,
            leftIcon,
            rightIcon,
            floatingLabel = false,
            disabled,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const [isFocused, setIsFocused] = React.useState(false);
        const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);

        const inputId = React.useId();
        const isPassword = type === "password";
        const currentType = isPassword && showPassword ? "text" : type;

        const currentVariant = error ? "error" : success ? "success" : variant;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
        };

        return (
            <div className="w-full space-y-1.5">
                {label && !floatingLabel && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-bureau-300"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-bureau-500">
                            {leftIcon}
                        </div>
                    )}

                    {floatingLabel && label && (
                        <label
                            htmlFor={inputId}
                            className={cn(
                                "absolute left-4 transition-all duration-200 pointer-events-none",
                                isFocused || hasValue
                                    ? "-top-2 text-xs bg-bureau-800 px-1 text-accent-primary"
                                    : "top-1/2 -translate-y-1/2 text-sm text-bureau-500"
                            )}
                        >
                            {label}
                        </label>
                    )}

                    <input
                        id={inputId}
                        type={currentType}
                        className={cn(
                            inputVariants({ variant: currentVariant, inputSize }),
                            leftIcon && "pl-10",
                            (rightIcon || isPassword || error || success) && "pr-10",
                            floatingLabel && "pt-4 pb-2",
                            className
                        )}
                        ref={ref}
                        disabled={disabled}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        onChange={handleChange}
                        {...props}
                    />

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {error && (
                            <AlertCircle className="h-4 w-4 text-status-critical" />
                        )}
                        {success && !error && (
                            <CheckCircle2 className="h-4 w-4 text-status-secure" />
                        )}
                        {isPassword && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-bureau-500 hover:text-bureau-300 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        )}
                        {rightIcon && !error && !success && !isPassword && rightIcon}
                    </div>
                </div>

                {(error || success || helperText) && (
                    <p
                        className={cn(
                            "text-xs",
                            error ? "text-status-critical" : success ? "text-status-secure" : "text-bureau-500"
                        )}
                    >
                        {error || success || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input, inputVariants };
