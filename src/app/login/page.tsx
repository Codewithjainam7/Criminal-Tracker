"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    Eye,
    EyeOff,
    Lock,
    User,
    KeyRound,
    AlertCircle,
    Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [badgeId, setBadgeId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState<"credentials" | "2fa">("credentials");
    const [twoFactorCode, setTwoFactorCode] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (badgeId && password) {
            // Simulate successful login, redirect would happen here
            setStep("2fa");
        } else {
            setError("Please enter your badge ID and password");
        }
        setIsLoading(false);
    };

    const handleTwoFactor = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (twoFactorCode.length === 6) {
            // Redirect to dashboard
            window.location.href = "/dashboard";
        } else {
            setError("Please enter a valid 6-digit code");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-bureau-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pattern-grid opacity-30" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-bureau-950 via-bureau-900/50 to-bureau-950" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo & Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary mb-4 shadow-lg shadow-accent-primary/25">
                        <Shield className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-bureau-100">
                        Criminal Investigation Tracker
                    </h1>
                    <p className="text-bureau-500 mt-2">
                        Secure Access Portal
                    </p>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card variant="glass" className="p-6">
                        {/* Security Badge */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Lock className="h-4 w-4 text-status-secure" />
                            <span className="text-xs text-status-secure font-medium uppercase tracking-wide">
                                256-bit Encrypted Connection
                            </span>
                        </div>

                        {step === "credentials" ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="flex items-center gap-2 p-3 bg-status-critical/10 border border-status-critical/30 rounded-lg"
                                    >
                                        <AlertCircle className="h-4 w-4 text-status-critical flex-shrink-0" />
                                        <p className="text-sm text-status-critical">{error}</p>
                                    </motion.div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                            Badge ID
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bureau-500" />
                                            <input
                                                id="badge-id"
                                                type="text"
                                                value={badgeId}
                                                onChange={(e) => setBadgeId(e.target.value.toUpperCase())}
                                                placeholder="CBI-XXXX"
                                                className="w-full h-11 pl-10 pr-4 bg-bureau-800 border border-bureau-600 rounded-lg text-bureau-100 placeholder:text-bureau-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bureau-500" />
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                className="w-full h-11 pl-10 pr-12 bg-bureau-800 border border-bureau-600 rounded-lg text-bureau-100 placeholder:text-bureau-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-bureau-500 hover:text-bureau-300"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            id="remember-device"
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-bureau-600 bg-bureau-800 text-accent-primary focus:ring-accent-primary focus:ring-offset-bureau-900"
                                        />
                                        <span className="text-bureau-400">Remember device</span>
                                    </label>
                                    <a
                                        href="#"
                                        className="text-accent-primary hover:text-accent-primary/80 transition-colors"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11"
                                    loading={isLoading}
                                >
                                    {isLoading ? "Authenticating..." : "Sign In"}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleTwoFactor} className="space-y-4">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 mb-4">
                                        <Fingerprint className="h-8 w-8 text-accent-primary" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-bureau-100">
                                        Two-Factor Authentication
                                    </h2>
                                    <p className="text-sm text-bureau-400 mt-1">
                                        Enter the 6-digit code from your authenticator app
                                    </p>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-status-critical/10 border border-status-critical/30 rounded-lg">
                                        <AlertCircle className="h-4 w-4 text-status-critical" />
                                        <p className="text-sm text-status-critical">{error}</p>
                                    </div>
                                )}

                                <div className="flex justify-center gap-2">
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <input
                                            key={i}
                                            id={`2fa-${i}`}
                                            type="text"
                                            maxLength={1}
                                            value={twoFactorCode[i] || ""}
                                            onChange={(e) => {
                                                const newCode = twoFactorCode.split("");
                                                newCode[i] = e.target.value;
                                                setTwoFactorCode(newCode.join(""));
                                                // Auto-focus next input
                                                if (e.target.value && e.target.nextElementSibling) {
                                                    (e.target.nextElementSibling as HTMLInputElement).focus();
                                                }
                                            }}
                                            className="w-12 h-14 text-center text-xl font-mono bg-bureau-800 border border-bureau-600 rounded-lg text-bureau-100 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
                                        />
                                    ))}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11"
                                    loading={isLoading}
                                >
                                    Verify
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => setStep("credentials")}
                                    className="w-full text-sm text-bureau-400 hover:text-bureau-200 transition-colors"
                                >
                                    ← Back to login
                                </button>
                            </form>
                        )}
                    </Card>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-6"
                >
                    <p className="text-xs text-bureau-600">
                        CLASSIFIED • AUTHORIZED PERSONNEL ONLY
                    </p>
                    <p className="text-xs text-bureau-700 mt-1">
                        Project Antigravity Ultra • v1.0.0
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
