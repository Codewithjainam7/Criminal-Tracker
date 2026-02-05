"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

// Professional page transition variants
const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut",
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.99,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
};

// Slide variants for list items
export const staggerItemVariants: Variants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: { duration: 0.2 }
    },
};

// Container for staggered children
export const staggerContainerVariants: Variants = {
    initial: {},
    enter: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
    exit: {
        transition: {
            staggerChildren: 0.03,
            staggerDirection: -1,
        },
    },
};

// Fade-up animation for cards
export const fadeUpVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    },
};

// Scale animation
export const scaleVariants: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" }
    },
};

// Slide-in from left
export const slideInLeftVariants: Variants = {
    initial: { opacity: 0, x: -50 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    },
};

// Slide-in from right
export const slideInRightVariants: Variants = {
    initial: { opacity: 0, x: 50 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    },
};

// Page transition wrapper component
export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Animated container for staggered list items
export function StaggerContainer({
    children,
    className = "",
    delay = 0
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            variants={staggerContainerVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={className}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </motion.div>
    );
}

// Animated item for use inside StaggerContainer
export function StaggerItem({
    children,
    className = ""
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div variants={staggerItemVariants} className={className}>
            {children}
        </motion.div>
    );
}

// Fade-up animated element
export function FadeUp({
    children,
    className = "",
    delay = 0
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            variants={fadeUpVariants}
            initial="initial"
            animate="animate"
            className={className}
            transition={{ delay: delay / 1000 }}
        >
            {children}
        </motion.div>
    );
}

// Scale-in animated element
export function ScaleIn({
    children,
    className = "",
    delay = 0
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            variants={scaleVariants}
            initial="initial"
            animate="animate"
            className={className}
            transition={{ delay: delay / 1000 }}
        >
            {children}
        </motion.div>
    );
}

// Animated stat counter
export function AnimatedCounter({
    value,
    duration = 1.5,
    className = ""
}: {
    value: number;
    duration?: number;
    className?: string;
}) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {value}
            </motion.span>
        </motion.span>
    );
}

// Animated progress bar
export function AnimatedProgress({
    value,
    className = "",
    color = "bg-accent-primary"
}: {
    value: number;
    className?: string;
    color?: string;
}) {
    return (
        <div className={`h-2 bg-bureau-800 rounded-full overflow-hidden ${className}`}>
            <motion.div
                className={`h-full ${color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
        </div>
    );
}

// Pulse animation for attention-grabbing elements
export function PulseAttention({
    children,
    className = ""
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            animate={{
                scale: [1, 1.02, 1],
                boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0)",
                    "0 0 0 8px rgba(59, 130, 246, 0.1)",
                    "0 0 0 0 rgba(59, 130, 246, 0)",
                ],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            {children}
        </motion.div>
    );
}
