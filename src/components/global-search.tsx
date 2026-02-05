"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    X,
    Briefcase,
    UserSearch,
    FileBox,
    UserCheck,
    Clock,
    ArrowRight,
    Command,
    Hash,
    Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { seedCases, seedSuspects, seedEvidence } from "@/data/seed";
import { cn, formatRelativeTime } from "@/lib/utils";

interface SearchResult {
    id: string;
    type: "case" | "suspect" | "evidence" | "witness";
    title: string;
    subtitle: string;
    url: string;
    metadata?: string;
    priority?: "critical" | "high" | "medium" | "low";
    status?: string;
}

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [filter, setFilter] = useState<"all" | "case" | "suspect" | "evidence">("all");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search function
    const performSearch = useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const q = searchQuery.toLowerCase();
        const searchResults: SearchResult[] = [];

        // Search cases
        if (filter === "all" || filter === "case") {
            seedCases.forEach((c) => {
                if (
                    c.title.toLowerCase().includes(q) ||
                    c.caseNumber.toLowerCase().includes(q) ||
                    c.description.toLowerCase().includes(q)
                ) {
                    searchResults.push({
                        id: c.id,
                        type: "case",
                        title: c.title,
                        subtitle: c.caseNumber,
                        url: `/cases/${c.id}`,
                        metadata: formatRelativeTime(c.dateUpdated),
                        priority: c.priority,
                        status: c.status,
                    });
                }
            });
        }

        // Search suspects
        if (filter === "all" || filter === "suspect") {
            seedSuspects.forEach((s) => {
                if (
                    s.fullName.toLowerCase().includes(q) ||
                    s.suspectNumber.toLowerCase().includes(q) ||
                    s.aliases.some((a) => a.toLowerCase().includes(q))
                ) {
                    searchResults.push({
                        id: s.id,
                        type: "suspect",
                        title: s.fullName,
                        subtitle: s.suspectNumber,
                        url: `/suspects/${s.id}`,
                        metadata: s.aliases[0] ? `a.k.a. "${s.aliases[0]}"` : undefined,
                        status: s.status,
                    });
                }
            });
        }

        // Search evidence
        if (filter === "all" || filter === "evidence") {
            seedEvidence.forEach((e) => {
                if (
                    e.description.toLowerCase().includes(q) ||
                    e.evidenceNumber.toLowerCase().includes(q)
                ) {
                    searchResults.push({
                        id: e.id,
                        type: "evidence",
                        title: e.description,
                        subtitle: e.evidenceNumber,
                        url: `/evidence/${e.id}`,
                        metadata: e.type,
                        status: e.status,
                    });
                }
            });
        }

        setResults(searchResults.slice(0, 10));
        setSelectedIndex(0);
    }, [filter]);

    // Handle query change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            performSearch(query);
        }, 150);
        return () => clearTimeout(timeoutId);
    }, [query, performSearch]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((i) => Math.max(i - 1, 0));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        router.push(results[selectedIndex].url);
                        onClose();
                    }
                    break;
                case "Escape":
                    onClose();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, results, selectedIndex, router, onClose]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "case":
                return <Briefcase className="h-4 w-4" />;
            case "suspect":
                return <UserSearch className="h-4 w-4" />;
            case "evidence":
                return <FileBox className="h-4 w-4" />;
            case "witness":
                return <UserCheck className="h-4 w-4" />;
            default:
                return <Hash className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "case":
                return "text-accent-primary bg-accent-primary/20";
            case "suspect":
                return "text-status-critical bg-status-critical/20";
            case "evidence":
                return "text-status-warning bg-status-warning/20";
            case "witness":
                return "text-status-secure bg-status-secure/20";
            default:
                return "text-bureau-400 bg-bureau-700";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Search Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
                    >
                        <div className="bg-bureau-900 border border-bureau-700 rounded-xl shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-bureau-700">
                                <Search className="h-5 w-5 text-bureau-500" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search cases, suspects, evidence..."
                                    className="flex-1 bg-transparent text-bureau-100 placeholder:text-bureau-500 focus:outline-none text-lg"
                                />
                                <div className="flex items-center gap-2">
                                    <kbd className="hidden sm:inline-flex px-2 py-1 text-xs bg-bureau-800 text-bureau-400 rounded border border-bureau-700">
                                        ESC
                                    </kbd>
                                    <button
                                        onClick={onClose}
                                        className="p-1 hover:bg-bureau-800 rounded-lg transition-colors"
                                    >
                                        <X className="h-5 w-5 text-bureau-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex items-center gap-2 px-4 py-2 border-b border-bureau-800">
                                <Filter className="h-4 w-4 text-bureau-500" />
                                {["all", "case", "suspect", "evidence"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f as typeof filter)}
                                        className={cn(
                                            "px-3 py-1 text-xs rounded-full transition-colors capitalize",
                                            filter === f
                                                ? "bg-accent-primary text-white"
                                                : "bg-bureau-800 text-bureau-400 hover:bg-bureau-700"
                                        )}
                                    >
                                        {f === "all" ? "All" : `${f}s`}
                                    </button>
                                ))}
                            </div>

                            {/* Results */}
                            <div className="max-h-[50vh] overflow-y-auto">
                                {results.length > 0 ? (
                                    <div className="py-2">
                                        {results.map((result, index) => (
                                            <button
                                                key={`${result.type}-${result.id}`}
                                                onClick={() => {
                                                    router.push(result.url);
                                                    onClose();
                                                }}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                                                    index === selectedIndex
                                                        ? "bg-accent-primary/10"
                                                        : "hover:bg-bureau-800/50"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "p-2 rounded-lg",
                                                        getTypeColor(result.type)
                                                    )}
                                                >
                                                    {getTypeIcon(result.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-bureau-100 truncate">
                                                            {result.title}
                                                        </span>
                                                        {result.priority === "critical" && (
                                                            <Badge variant="priority-critical" size="xs">
                                                                Critical
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-bureau-500">
                                                        <span className="font-mono">{result.subtitle}</span>
                                                        {result.metadata && (
                                                            <>
                                                                <span className="text-bureau-600">•</span>
                                                                <span className="truncate">{result.metadata}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-bureau-600" />
                                            </button>
                                        ))}
                                    </div>
                                ) : query ? (
                                    <div className="py-12 text-center text-bureau-500">
                                        <Search className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                        <p>No results found for "{query}"</p>
                                        <p className="text-sm mt-1">Try a different search term</p>
                                    </div>
                                ) : (
                                    <div className="py-8 px-4">
                                        <p className="text-sm text-bureau-500 mb-4">Recent searches</p>
                                        <div className="space-y-2">
                                            {["Homicide", "Armed Robbery", "Evidence EV-2026"].map((term) => (
                                                <button
                                                    key={term}
                                                    onClick={() => setQuery(term)}
                                                    className="flex items-center gap-2 w-full p-2 text-left text-bureau-400 hover:text-bureau-100 hover:bg-bureau-800/50 rounded-lg transition-colors"
                                                >
                                                    <Clock className="h-4 w-4 text-bureau-600" />
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-4 py-2 border-t border-bureau-800 text-xs text-bureau-500">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 bg-bureau-800 rounded">↑</kbd>
                                        <kbd className="px-1 py-0.5 bg-bureau-800 rounded">↓</kbd>
                                        to navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 bg-bureau-800 rounded">↵</kbd>
                                        to select
                                    </span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <Command className="h-3 w-3" /> + K to search
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Hook to open global search with Cmd/Ctrl+K
export function useGlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return { isOpen, setIsOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
}
