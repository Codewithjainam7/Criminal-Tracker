"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Save, Calendar, Users, AlertCircle } from "lucide-react";
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
import { seedUsers } from "@/data/seed";
import { cn } from "@/lib/utils";
import type { CaseCategory, CasePriority } from "@/types/case";

interface NewCaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: NewCaseData) => void;
}

export interface NewCaseData {
    title: string;
    description: string;
    category: CaseCategory;
    priority: CasePriority;
    assignedTo: string[];
}

const categories: { value: CaseCategory; label: string }[] = [
    { value: "homicide", label: "Homicide" },
    { value: "robbery", label: "Robbery" },
    { value: "cybercrime", label: "Cybercrime" },
    { value: "fraud", label: "Fraud" },
    { value: "narcotics", label: "Narcotics" },
    { value: "assault", label: "Assault" },
    { value: "kidnapping", label: "Kidnapping" },
    { value: "arson", label: "Arson" },
    { value: "other", label: "Other" },
];

const priorities: { value: CasePriority; label: string; color: string }[] = [
    { value: "critical", label: "Critical", color: "bg-status-critical" },
    { value: "high", label: "High", color: "bg-status-warning" },
    { value: "medium", label: "Medium", color: "bg-accent-primary" },
    { value: "low", label: "Low", color: "bg-bureau-500" },
];

export function NewCaseDialog({ isOpen, onClose, onSubmit }: NewCaseDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<CaseCategory>("other");
    const [priority, setPriority] = useState<CasePriority>("medium");
    const [assignedTo, setAssignedTo] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const investigators = seedUsers.filter(
        (u) => u.role === "INVESTIGATOR" || u.role === "ADMIN"
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Case title is required");
            return;
        }

        if (!description.trim()) {
            toast.error("Case description is required");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newCase: NewCaseData = {
            title,
            description,
            category,
            priority,
            assignedTo,
        };

        onSubmit?.(newCase);
        toast.success(`Case "${title}" has been created.`);

        // Reset form
        setTitle("");
        setDescription("");
        setCategory("other");
        setPriority("medium");
        setAssignedTo([]);
        setIsSubmitting(false);
        onClose();
    };

    const toggleAssignee = (userId: string) => {
        setAssignedTo((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
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
                        className="fixed inset-x-4 top-[10%] mx-auto max-w-xl bg-bureau-900 border border-bureau-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-bureau-700 bg-bureau-850">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent-primary/20 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-accent-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-bureau-100">Create New Case</h2>
                                    <p className="text-sm text-bureau-500">Enter case details below</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                    Case Title <span className="text-status-critical">*</span>
                                </label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter case title..."
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                    Description <span className="text-status-critical">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the case..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-bureau-800 border border-bureau-700 rounded-lg text-bureau-100 placeholder:text-bureau-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary resize-none"
                                    required
                                />
                            </div>

                            {/* Category & Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        Category
                                    </label>
                                    <Select value={category} onValueChange={(v) => setCategory(v as CaseCategory)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                        Priority
                                    </label>
                                    <Select value={priority} onValueChange={(v) => setPriority(v as CasePriority)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {priorities.map((p) => (
                                                <SelectItem key={p.value} value={p.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn("w-2 h-2 rounded-full", p.color)} />
                                                        {p.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Assign Team */}
                            <div>
                                <label className="block text-sm font-medium text-bureau-300 mb-1.5">
                                    <Users className="h-4 w-4 inline mr-1" />
                                    Assign Team Members
                                </label>
                                <div className="flex flex-wrap gap-2 p-3 bg-bureau-800/50 rounded-lg border border-bureau-700 max-h-32 overflow-y-auto">
                                    {investigators.map((user) => (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => toggleAssignee(user.id)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-sm transition-all",
                                                assignedTo.includes(user.id)
                                                    ? "bg-accent-primary text-white"
                                                    : "bg-bureau-700 text-bureau-300 hover:bg-bureau-600"
                                            )}
                                        >
                                            {user.firstName} {user.lastName.charAt(0)}.
                                        </button>
                                    ))}
                                </div>
                                {assignedTo.length > 0 && (
                                    <p className="text-xs text-bureau-500 mt-1">
                                        {assignedTo.length} team member(s) selected
                                    </p>
                                )}
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
                                Create Case
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
