"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    Sparkles,
    Search,
    Target,
    UserSearch,
    FileBox,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    Loader2,
    Zap,
    Shield,
    MapPin,
    Calendar,
    Fingerprint,
    Scale,
    TrendingUp,
    X,
    Plus,
    Info,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { seedSuspects, seedCases, getCaseById } from "@/data/seed";
import { cn, formatRelativeTime, calculateAge } from "@/lib/utils";
import { MODUS_OPERANDI_OPTIONS, RISK_LEVEL_LABELS, SUSPECT_STATUS_LABELS } from "@/types/suspect";
import { CASE_CATEGORY_LABELS } from "@/types/case";

// AI matching algorithm simulation
function calculateMatchScore(
    suspect: (typeof seedSuspects)[0],
    criteria: {
        moPatterns: string[];
        location?: string;
        ageRange?: { min: number; max: number };
        category?: string;
    }
): {
    score: number;
    breakdown: {
        moScore: number;
        locationScore: number;
        historyScore: number;
        profileScore: number;
    };
    reasoning: string[];
} {
    const reasoning: string[] = [];
    let moScore = 0;
    let locationScore = 0;
    let historyScore = 0;
    let profileScore = 0;

    // M.O. Pattern Matching (40 points max)
    if (criteria.moPatterns.length > 0) {
        const matchedMO = suspect.modusOperandi.filter((mo) =>
            criteria.moPatterns.includes(mo)
        );
        if (matchedMO.length > 0) {
            moScore = Math.min(40, (matchedMO.length / criteria.moPatterns.length) * 40);
            reasoning.push(`Matched ${matchedMO.length} M.O. patterns: ${matchedMO.join(", ")}`);
        }
    }

    // Location Matching (20 points max)
    if (criteria.location && suspect.lastKnownAddress?.city) {
        if (suspect.lastKnownAddress.city.toLowerCase().includes(criteria.location.toLowerCase())) {
            locationScore = 20;
            reasoning.push(`Last known in ${suspect.lastKnownAddress.city}`);
        }
    }

    // Criminal History (25 points max)
    if (suspect.criminalHistory.length > 0) {
        historyScore = Math.min(25, suspect.criminalHistory.length * 8);
        reasoning.push(`${suspect.criminalHistory.length} prior offense(s) on record`);
    }

    // Risk Profile (15 points max)
    const riskScores = { extreme: 15, high: 12, medium: 8, low: 4, unknown: 2 };
    profileScore = riskScores[suspect.riskLevel] || 0;
    if (suspect.riskLevel === "extreme" || suspect.riskLevel === "high") {
        reasoning.push(`Classified as ${RISK_LEVEL_LABELS[suspect.riskLevel]}`);
    }

    const totalScore = moScore + locationScore + historyScore + profileScore;

    return {
        score: Math.round(totalScore),
        breakdown: {
            moScore: Math.round(moScore),
            locationScore: Math.round(locationScore),
            historyScore: Math.round(historyScore),
            profileScore: Math.round(profileScore),
        },
        reasoning,
    };
}

function ScoreBar({ score, label, maxScore, color }: { score: number; label: string; maxScore: number; color: string }) {
    const percentage = (score / maxScore) * 100;
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
                <span className="text-bureau-400">{label}</span>
                <span className="text-bureau-300 font-medium">{score}/{maxScore}</span>
            </div>
            <div className="h-2 bg-bureau-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn("h-full rounded-full", color)}
                />
            </div>
        </div>
    );
}

function MatchResultCard({
    suspect,
    matchData,
    rank,
}: {
    suspect: (typeof seedSuspects)[0];
    matchData: ReturnType<typeof calculateMatchScore>;
    rank: number;
}) {
    const scoreColor =
        matchData.score >= 70
            ? "text-status-critical"
            : matchData.score >= 50
                ? "text-status-warning"
                : "text-bureau-400";

    const scoreRingColor =
        matchData.score >= 70
            ? "from-status-critical to-red-600"
            : matchData.score >= 50
                ? "from-status-warning to-orange-600"
                : "from-bureau-500 to-bureau-600";

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.1 }}
        >
            <Card hover className="relative overflow-hidden">
                {/* Rank Badge */}
                <div className="absolute top-3 left-3">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                        rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                            rank === 2 ? "bg-bureau-400/20 text-bureau-400" :
                                rank === 3 ? "bg-orange-600/20 text-orange-600" :
                                    "bg-bureau-700 text-bureau-500"
                    )}>
                        #{rank}
                    </div>
                </div>

                <div className="p-5 pt-14">
                    <div className="flex items-start gap-4">
                        {/* Score Circle */}
                        <div className="relative flex-shrink-0">
                            <div className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br",
                                scoreRingColor
                            )}>
                                <div className="w-16 h-16 rounded-full bg-bureau-900 flex items-center justify-center">
                                    <span className={cn("text-2xl font-bold", scoreColor)}>
                                        {matchData.score}
                                    </span>
                                </div>
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                                <Badge variant="default" size="xs">
                                    /100
                                </Badge>
                            </div>
                        </div>

                        {/* Suspect Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-bureau-100">
                                    {suspect.fullName}
                                </h3>
                                {suspect.status === "wanted" && (
                                    <Badge variant="solid-danger" size="xs" pulse>
                                        WANTED
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-bureau-500 mt-0.5">
                                {suspect.aliases[0] ? `"${suspect.aliases[0]}"` : suspect.suspectNumber}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge
                                    variant={
                                        suspect.riskLevel === "extreme" ? "risk-extreme" :
                                            suspect.riskLevel === "high" ? "risk-high" : "risk-medium"
                                    }
                                    size="xs"
                                >
                                    {RISK_LEVEL_LABELS[suspect.riskLevel]}
                                </Badge>
                                <span className="text-xs text-bureau-500">
                                    {suspect.age ? `Age ${suspect.age}` : "Unknown Age"}
                                </span>
                            </div>
                        </div>

                        {/* View Button */}
                        <Link href={`/suspects/${suspect.id}`}>
                            <Button variant="outline" size="sm">
                                View Profile
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </div>

                    {/* Score Breakdown */}
                    <div className="mt-5 pt-5 border-t border-bureau-700 space-y-3">
                        <ScoreBar
                            score={matchData.breakdown.moScore}
                            label="M.O. Pattern Match"
                            maxScore={40}
                            color="bg-accent-primary"
                        />
                        <ScoreBar
                            score={matchData.breakdown.historyScore}
                            label="Criminal History"
                            maxScore={25}
                            color="bg-status-warning"
                        />
                        <ScoreBar
                            score={matchData.breakdown.locationScore}
                            label="Location Proximity"
                            maxScore={20}
                            color="bg-status-secure"
                        />
                        <ScoreBar
                            score={matchData.breakdown.profileScore}
                            label="Risk Profile"
                            maxScore={15}
                            color="bg-status-critical"
                        />
                    </div>

                    {/* Reasoning */}
                    {matchData.reasoning.length > 0 && (
                        <div className="mt-4 p-3 bg-bureau-800/50 rounded-lg">
                            <p className="text-xs text-bureau-500 font-medium mb-2">AI Analysis</p>
                            <ul className="space-y-1">
                                {matchData.reasoning.map((reason, idx) => (
                                    <li key={idx} className="text-sm text-bureau-300 flex items-start gap-2">
                                        <CheckCircle className="h-3.5 w-3.5 text-status-secure mt-0.5 flex-shrink-0" />
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}

export default function AIMatchingPage() {
    const [selectedMO, setSelectedMO] = useState<string[]>([]);
    const [location, setLocation] = useState("");
    const [selectedCase, setSelectedCase] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const activeCases = seedCases.filter((c) => c.status === "active" || c.status === "open");

    // Calculate matches
    const matches = useMemo(() => {
        if (!showResults || selectedMO.length === 0) return [];

        const results = seedSuspects
            .filter((s) => s.status === "wanted" || s.status === "unknown")
            .map((suspect) => ({
                suspect,
                matchData: calculateMatchScore(suspect, {
                    moPatterns: selectedMO,
                    location: location || undefined,
                }),
            }))
            .filter((r) => r.matchData.score > 0)
            .sort((a, b) => b.matchData.score - a.matchData.score);

        return results;
    }, [showResults, selectedMO, location]);

    const handleAnalyze = async () => {
        if (selectedMO.length === 0) return;

        setIsAnalyzing(true);
        // Simulate AI processing
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setShowResults(true);
        setIsAnalyzing(false);
    };

    const handleCaseSelect = (caseId: string) => {
        setSelectedCase(caseId);
        const caseData = getCaseById(caseId);
        if (caseData) {
            // Auto-populate based on case
            setLocation(caseData.location.city);
        }
    };

    const handleAddMO = (mo: string) => {
        if (!selectedMO.includes(mo)) {
            setSelectedMO([...selectedMO, mo]);
        }
    };

    const handleRemoveMO = (mo: string) => {
        setSelectedMO(selectedMO.filter((m) => m !== mo));
        setShowResults(false);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-bureau-100 flex items-center gap-2">
                            <Brain className="h-7 w-7 text-accent-secondary" />
                            AI Suspect Matching
                            <Badge variant="info" size="sm" className="ml-2">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Beta
                            </Badge>
                        </h1>
                        <p className="text-bureau-400 mt-1">
                            Advanced M.O. pattern analysis and suspect correlation engine
                        </p>
                    </div>
                </div>

                {/* How It Works */}
                <Card className="bg-gradient-to-br from-accent-secondary/10 to-accent-primary/5 border-accent-secondary/20">
                    <CardContent className="py-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-accent-secondary/20 rounded-lg">
                                <Info className="h-5 w-5 text-accent-secondary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-bureau-100">How AI Matching Works</h3>
                                <p className="text-sm text-bureau-400 mt-1">
                                    Our AI analyzes modus operandi patterns, criminal history, location data, and risk profiles
                                    to identify potential suspects. Each match is scored out of 100 based on pattern correlation.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Input Panel */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-accent-primary" />
                                    Match Criteria
                                </CardTitle>
                                <CardDescription>
                                    Define patterns to search against suspect database
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Link to Case */}
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        Link to Case (Optional)
                                    </label>
                                    <Select value={selectedCase} onValueChange={handleCaseSelect}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a case" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {activeCases.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.caseNumber} - {c.title.substring(0, 30)}...
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* M.O. Patterns */}
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        Modus Operandi Patterns *
                                    </label>
                                    <Select onValueChange={handleAddMO}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Add M.O. pattern" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MODUS_OPERANDI_OPTIONS.filter((mo) => !selectedMO.includes(mo)).map((mo) => (
                                                <SelectItem key={mo} value={mo}>
                                                    {mo}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedMO.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {selectedMO.map((mo) => (
                                                <Badge
                                                    key={mo}
                                                    variant="info"
                                                    className="flex items-center gap-1"
                                                >
                                                    {mo}
                                                    <button
                                                        onClick={() => handleRemoveMO(mo)}
                                                        className="ml-1 hover:text-white"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        Location Filter
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bureau-500" />
                                        <Input
                                            placeholder="City or area"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={handleAnalyze}
                                    disabled={selectedMO.length === 0 || isAnalyzing}
                                    loading={isAnalyzing}
                                    leftIcon={!isAnalyzing ? <Zap className="h-4 w-4" /> : undefined}
                                >
                                    {isAnalyzing ? "Analyzing Patterns..." : "Run AI Analysis"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Scoring Guide */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Scoring Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-bureau-400">M.O. Pattern Match</span>
                                    <span className="text-bureau-300 font-mono">40 pts</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-bureau-400">Criminal History</span>
                                    <span className="text-bureau-300 font-mono">25 pts</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-bureau-400">Location Proximity</span>
                                    <span className="text-bureau-300 font-mono">20 pts</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-bureau-400">Risk Profile</span>
                                    <span className="text-bureau-300 font-mono">15 pts</span>
                                </div>
                                <div className="border-t border-bureau-700 pt-3 flex items-center justify-between font-medium">
                                    <span className="text-bureau-300">Total</span>
                                    <span className="text-accent-primary font-mono">100 pts</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {isAnalyzing ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-20"
                                >
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full border-4 border-bureau-700" />
                                        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-accent-primary border-t-transparent animate-spin" />
                                        <Brain className="absolute inset-0 m-auto h-10 w-10 text-accent-primary" />
                                    </div>
                                    <p className="text-bureau-300 mt-6 font-medium">Analyzing M.O. patterns...</p>
                                    <p className="text-bureau-500 mt-2 text-sm">
                                        Scanning {seedSuspects.filter((s) => s.status === "wanted").length} wanted suspects
                                    </p>
                                </motion.div>
                            ) : showResults ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-bureau-100">
                                                Match Results
                                            </h2>
                                            <p className="text-sm text-bureau-400">
                                                Found {matches.length} potential matches
                                            </p>
                                        </div>
                                        {matches.length > 0 && matches[0].matchData.score >= 70 && (
                                            <Badge variant="danger" pulse>
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                High Confidence Match
                                            </Badge>
                                        )}
                                    </div>

                                    {matches.length > 0 ? (
                                        <div className="space-y-4">
                                            {matches.slice(0, 5).map((match, idx) => (
                                                <MatchResultCard
                                                    key={match.suspect.id}
                                                    suspect={match.suspect}
                                                    matchData={match.matchData}
                                                    rank={idx + 1}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <Card className="p-8 text-center">
                                            <UserSearch className="h-12 w-12 text-bureau-600 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-bureau-300">No Matches Found</h3>
                                            <p className="text-bureau-500 mt-2">
                                                Try adjusting your M.O. patterns or location criteria
                                            </p>
                                        </Card>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="w-24 h-24 rounded-full bg-bureau-800 flex items-center justify-center mb-6">
                                        <Brain className="h-12 w-12 text-bureau-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-bureau-300">
                                        Ready to Analyze
                                    </h3>
                                    <p className="text-bureau-500 mt-2 max-w-md">
                                        Select M.O. patterns from the left panel and click "Run AI Analysis"
                                        to find potential suspect matches
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
