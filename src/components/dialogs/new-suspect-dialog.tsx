"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserSearch, Save, AlertTriangle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { RiskLevel, SuspectStatus, Gender } from "@/types/suspect";

interface NewSuspectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: NewSuspectData) => void;
}

export interface NewSuspectData {
    firstName: string;
    lastName: string;
    aliases: string[];
    dateOfBirth?: string;
    gender: Gender;
    nationality: string;
    riskLevel: RiskLevel;
    status: SuspectStatus;
    modusOperandi: string[];
    notes: string;
}

const riskLevels: { value: RiskLevel; label: string; color: string }[] = [
    { value: "extreme", label: "Extreme", color: "bg-red-600" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "low", label: "Low", color: "bg-green-500" },
    { value: "unknown", label: "Unknown", color: "bg-gray-500" },
];

const statuses: { value: SuspectStatus; label: string }[] = [
    { value: "wanted", label: "Wanted" },
    { value: "apprehended", label: "Apprehended" },
    { value: "released", label: "Released" },
    { value: "unknown", label: "Unknown" },
];

const moPatterns = [
    "Armed Robbery",
    "Burglary",
    "Cyber Attack",
    "Drug Distribution",
    "Extortion",
    "Fraud",
    "Identity Theft",
    "Money Laundering",
    "Murder for Hire",
    "Organized Theft Ring",
];

export function NewSuspectDialog({ isOpen, onClose, onSubmit }: NewSuspectDialogProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [aliasInput, setAliasInput] = useState("");
    const [aliases, setAliases] = useState<string[]>([]);
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState<Gender>("unknown");
    const [nationality, setNationality] = useState("");
    const [riskLevel, setRiskLevel] = useState<RiskLevel>("unknown");
    const [status, setStatus] = useState<SuspectStatus>("wanted");
    const [selectedMO, setSelectedMO] = useState<string[]>([]);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addAlias = () => {
        if (aliasInput.trim() && !aliases.includes(aliasInput.trim())) {
            setAliases([...aliases, aliasInput.trim()]);
            setAliasInput("");
        }
    };

    const removeAlias = (alias: string) => {
        setAliases(aliases.filter((a) => a !== alias));
    };

    const toggleMO = (mo: string) => {
        setSelectedMO((prev) =>
            prev.includes(mo) ? prev.filter((m) => m !== mo) : [...prev, mo]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName.trim() || !lastName.trim()) {
            toast.error("First and last name are required");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newSuspect: NewSuspectData = {
            firstName,
            lastName,
            aliases,
            dateOfBirth: dateOfBirth || undefined,
            gender,
            nationality,
            riskLevel,
            status,
            modusOperandi: selectedMO,
            notes,
        };

        onSubmit?.(newSuspect);
        toast.success(`Profile for "${firstName} ${lastName}" has been added to the database.`);

        // Reset form
        setFirstName("");
        setLastName("");
        setAliases([]);
        setAliasInput("");
        setDateOfBirth("");
        setGender("unknown");
        setNationality("");
        setRiskLevel("unknown");
        setStatus("wanted");
        setSelectedMO([]);
        setNotes("");
        setIsSubmitting(false);
        onClose();
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

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-x-4 top-[5%] mx-auto max-w-2xl bg-bureau-900 border border-bureau-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-bureau-700 bg-bureau-850">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-status-critical/20 rounded-lg">
                                    <UserSearch className="h-5 w-5 text-status-critical" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-bureau-100">Add New Suspect</h2>
                                    <p className="text-sm text-bureau-500">Enter suspect information</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        First Name <span className="text-status-critical">*</span>
                                    </label>
                                    <Input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="First name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        Last Name <span className="text-status-critical">*</span>
                                    </label>
                                    <Input
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Last name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Aliases */}
                            <div>
                                <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                    Known Aliases
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        value={aliasInput}
                                        onChange={(e) => setAliasInput(e.target.value)}
                                        placeholder="Add an alias..."
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAlias())}
                                    />
                                    <Button type="button" variant="outline" onClick={addAlias}>
                                        Add
                                    </Button>
                                </div>
                                {aliases.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {aliases.map((alias) => (
                                            <Badge
                                                key={alias}
                                                variant="default"
                                                className="cursor-pointer hover:bg-bureau-600"
                                                onClick={() => removeAlias(alias)}
                                            >
                                                "{alias}" <X className="h-3 w-3 ml-1" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Demographics */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        Date of Birth
                                    </label>
                                    <Input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        className="text-bureau-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        Gender
                                    </label>
                                    <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                            <SelectItem value="unknown">Unknown</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        Nationality
                                    </label>
                                    <Input
                                        value={nationality}
                                        onChange={(e) => setNationality(e.target.value)}
                                        placeholder="Nationality"
                                    />
                                </div>
                            </div>

                            {/* Status & Risk */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        Status
                                    </label>
                                    <Select value={status} onValueChange={(v) => setStatus(v as SuspectStatus)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((s) => (
                                                <SelectItem key={s.value} value={s.value}>
                                                    {s.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                                        Risk Level
                                    </label>
                                    <Select value={riskLevel} onValueChange={(v) => setRiskLevel(v as RiskLevel)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {riskLevels.map((r) => (
                                                <SelectItem key={r.value} value={r.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn("w-2 h-2 rounded-full", r.color)} />
                                                        {r.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Modus Operandi */}
                            <div>
                                <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                    Modus Operandi (M.O.)
                                </label>
                                <div className="flex flex-wrap gap-2 p-3 bg-bureau-800/50 rounded-lg border border-bureau-700 max-h-32 overflow-y-auto">
                                    {moPatterns.map((mo) => (
                                        <button
                                            key={mo}
                                            type="button"
                                            onClick={() => toggleMO(mo)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-sm transition-all",
                                                selectedMO.includes(mo)
                                                    ? "bg-status-critical text-white"
                                                    : "bg-bureau-700 text-bureau-300 hover:bg-bureau-600"
                                            )}
                                        >
                                            {mo}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                    Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Additional notes about the suspect..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-bureau-800 border border-bureau-700 rounded-lg text-bureau-100 placeholder:text-bureau-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary resize-none"
                                />
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-bureau-700 bg-bureau-850">
                            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                leftIcon={<Save className="h-4 w-4" />}
                                loading={isSubmitting}
                            >
                                Add Suspect
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
