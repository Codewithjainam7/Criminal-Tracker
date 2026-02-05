import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Bureau Professional Dark Theme
                bureau: {
                    950: "#030712", // Deepest background
                    900: "#0a0f1a", // Main background
                    850: "#0f172a", // Elevated background
                    800: "#1e293b", // Card background
                    700: "#334155", // Borders
                    600: "#475569", // Muted text
                    500: "#64748b", // Secondary text
                    400: "#94a3b8", // Primary text
                    300: "#cbd5e1",
                    200: "#e2e8f0",
                    100: "#f1f5f9",
                    50: "#f8fafc",
                },
                // Accent colors
                accent: {
                    primary: "#3b82f6",    // Blue
                    secondary: "#6366f1",  // Indigo
                    tertiary: "#8b5cf6",   // Purple
                },
                // Status colors
                status: {
                    critical: "#ef4444",   // Red
                    warning: "#f59e0b",    // Amber
                    caution: "#eab308",    // Yellow
                    secure: "#22c55e",     // Green
                    info: "#0ea5e9",       // Sky blue
                    pending: "#a855f7",    // Purple
                },
                // Case priority colors
                priority: {
                    critical: "#dc2626",
                    high: "#ea580c",
                    medium: "#ca8a04",
                    low: "#16a34a",
                },
                // Case status colors
                case: {
                    open: "#3b82f6",
                    active: "#22c55e",
                    pending: "#f59e0b",
                    closed: "#64748b",
                    cold: "#06b6d4",
                },
                // Risk level colors
                risk: {
                    extreme: "#7c2d12",
                    high: "#dc2626",
                    medium: "#f59e0b",
                    low: "#22c55e",
                    unknown: "#64748b",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
                display: ["Inter", "system-ui", "sans-serif"],
            },
            fontSize: {
                "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
            },
            boxShadow: {
                bureau: "0 0 0 1px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                "bureau-lg": "0 0 0 1px rgba(59, 130, 246, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.4)",
                glow: "0 0 20px rgba(59, 130, 246, 0.3)",
                "glow-sm": "0 0 10px rgba(59, 130, 246, 0.2)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "grid-pattern": "linear-gradient(to right, rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.03) 1px, transparent 1px)",
                "bureau-gradient": "linear-gradient(135deg, #0a0f1a 0%, #1e293b 100%)",
            },
            animation: {
                "fade-in": "fadeIn 0.2s ease-out",
                "slide-in": "slideIn 0.3s ease-out",
                "slide-up": "slideUp 0.3s ease-out",
                "scale-in": "scaleIn 0.2s ease-out",
                pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                shimmer: "shimmer 2s linear infinite",
                "spin-slow": "spin 3s linear infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideIn: {
                    "0%": { transform: "translateX(-10px)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(10px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                scaleIn: {
                    "0%": { transform: "scale(0.95)", opacity: "0" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            borderRadius: {
                bureau: "0.375rem",
            },
            spacing: {
                "18": "4.5rem",
                "88": "22rem",
                "128": "32rem",
            },
        },
    },
    plugins: [],
};

export default config;
