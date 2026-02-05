"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

interface BootSequenceProps {
    onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [bootPhase, setBootPhase] = useState(0);
    const completedRef = useRef(false);

    const bootMessages = [
        "INITIALIZING SYSTEM...",
        "LOADING SECURE PROTOCOLS...",
        "CONNECTING TO DATABASE...",
        "AUTHENTICATING AGENT...",
        "SYSTEM READY",
    ];

    useEffect(() => {
        const totalDuration = 2500; // 2.5 seconds boot time
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const x = Math.min(1, elapsed / totalDuration);

            // Cubic ease out for natural loading feel
            const easedProgress = (1 - Math.pow(1 - x, 3)) * 100;

            // Update boot phase based on progress
            setBootPhase(Math.min(4, Math.floor(easedProgress / 20)));

            if (x >= 1) {
                clearInterval(interval);
                setProgress(100);

                if (!completedRef.current) {
                    completedRef.current = true;
                    setIsExiting(true);
                    setTimeout(() => {
                        onComplete();
                    }, 800); // Wait for exit animation
                }
            } else {
                setProgress(easedProgress);
            }
        }, 16);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden font-sans bg-[#020617]"
                >
                    {/* Dynamic Abstract Wallpaper Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.4, 0.3],
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-500/30 rounded-full blur-[120px]"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.15, 1],
                                y: [0, -20, 0],
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-500/20 rounded-full blur-[100px]"
                        />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[80px]"
                        />
                    </div>

                    {/* Heavy Frost Layer */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl" />

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.07) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.07) 1px, transparent 1px)
                `,
                                backgroundSize: "50px 50px",
                            }}
                        />
                    </div>

                    {/* Main Content Container */}
                    <div className="relative z-10 flex flex-col items-center gap-10">
                        {/* Logo Container - Futuristic Glass Squircle */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative group"
                        >
                            {/* Ambient Glow behind logo */}
                            <div className="absolute inset-0 bg-blue-500/40 blur-2xl rounded-[40px] scale-75 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                            {/* Glass Box */}
                            <div className="w-32 h-32 rounded-[36px] bg-white/[0.07] backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative overflow-hidden transition-transform duration-700 hover:scale-105">
                                {/* Inner sheen */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50" />

                                <Shield
                                    size={56}
                                    className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] relative z-10"
                                    strokeWidth={1.5}
                                />

                                {/* Reflection highlight */}
                                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-[36px]" />
                            </div>
                        </motion.div>

                        {/* Typography */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-center space-y-3"
                        >
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight drop-shadow-lg">
                                CIT<span className="text-blue-500 font-normal">Pro</span>
                            </h1>
                            <p className="text-[10px] font-medium text-white/40 uppercase tracking-[0.4em]">
                                Criminal Investigation Tracker
                            </p>
                        </motion.div>

                        {/* Boot Message */}
                        <motion.div
                            key={bootPhase}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs font-mono text-blue-400/80 tracking-widest"
                        >
                            {bootMessages[bootPhase]}
                        </motion.div>

                        {/* iOS 26 Glass Progress Bar */}
                        <div className="w-64 h-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 p-[2px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)] relative overflow-hidden mt-4">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-white rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)] relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            >
                                {/* Animated Glare */}
                                <motion.div
                                    animate={{ x: ["0%", "200%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                                />
                                <div className="absolute inset-0 bg-white/20 opacity-50" />
                            </motion.div>
                        </div>

                        {/* Progress Percentage */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-xs text-white/30 font-mono"
                        >
                            {Math.round(progress)}%
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
