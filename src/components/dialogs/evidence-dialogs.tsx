"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Archive,
    CheckCircle,
    AlertCircle,
    Loader2,
    FileBox,
    Beaker,
    Package,
    Trash2,
    Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EvidenceStatus } from "@/types/evidence";

interface UpdateStatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentStatus: EvidenceStatus;
    evidenceNumber: string;
    onUpdateStatus: (status: EvidenceStatus, notes?: string) => void;
}

const STATUS_OPTIONS: { value: EvidenceStatus; label: string; icon: React.ReactNode; description: string; color: string }[] = [
    {
        value: "collected",
        label: "Collected",
        icon: <Package className="h-5 w-5" />,
        description: "Recently collected from scene",
        color: "bg-status-info/20 text-status-info border-status-info/30",
    },
    {
        value: "in_lab",
        label: "In Lab",
        icon: <Beaker className="h-5 w-5" />,
        description: "Under forensic analysis",
        color: "bg-status-warning/20 text-status-warning border-status-warning/30",
    },
    {
        value: "analyzed",
        label: "Analyzed",
        icon: <CheckCircle className="h-5 w-5" />,
        description: "Analysis complete",
        color: "bg-status-secure/20 text-status-secure border-status-secure/30",
    },
    {
        value: "stored",
        label: "Stored",
        icon: <Archive className="h-5 w-5" />,
        description: "In secure storage",
        color: "bg-accent-primary/20 text-accent-primary border-accent-primary/30",
    },
    {
        value: "released",
        label: "Released",
        icon: <Upload className="h-5 w-5" />,
        description: "Released from custody",
        color: "bg-bureau-600/20 text-bureau-400 border-bureau-500/30",
    },
    {
        value: "destroyed",
        label: "Destroyed",
        icon: <Trash2 className="h-5 w-5" />,
        description: "Evidence destroyed",
        color: "bg-status-critical/20 text-status-critical border-status-critical/30",
    },
];

export function UpdateStatusDialog({
    isOpen,
    onClose,
    currentStatus,
    evidenceNumber,
    onUpdateStatus,
}: UpdateStatusDialogProps) {
    const [selectedStatus, setSelectedStatus] = useState<EvidenceStatus>(currentStatus);
    const [notes, setNotes] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleUpdate = async () => {
        if (selectedStatus === currentStatus) {
            onClose();
            return;
        }

        setIsUpdating(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onUpdateStatus(selectedStatus, notes);
        setIsUpdating(false);
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
            setNotes("");
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-[10%] mx-auto max-w-lg bg-bureau-900 border border-bureau-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-bureau-700 bg-bureau-850">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent-primary/20 rounded-lg">
                            <Archive className="h-5 w-5 text-accent-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-bureau-100">Update Evidence Status</h2>
                            <p className="text-sm text-bureau-500">{evidenceNumber}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bureau-800 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-bureau-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {showSuccess ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-8"
                        >
                            <div className="w-16 h-16 bg-status-secure/20 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-8 w-8 text-status-secure" />
                            </div>
                            <p className="text-lg font-medium text-bureau-100">Status Updated!</p>
                            <p className="text-sm text-bureau-400 mt-1">Evidence status has been updated successfully.</p>
                        </motion.div>
                    ) : (
                        <>
                            <p className="text-sm text-bureau-400 mb-4">Select new status for this evidence item:</p>

                            <div className="grid grid-cols-2 gap-3">
                                {STATUS_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSelectedStatus(option.value)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 transition-all text-left group",
                                            selectedStatus === option.value
                                                ? option.color
                                                : "border-bureau-700 hover:border-bureau-600 bg-bureau-800/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-2 rounded-lg w-fit mb-2",
                                            selectedStatus === option.value ? "" : "bg-bureau-700"
                                        )}>
                                            {option.icon}
                                        </div>
                                        <h4 className={cn(
                                            "font-medium text-sm",
                                            selectedStatus === option.value ? "" : "text-bureau-300"
                                        )}>
                                            {option.label}
                                        </h4>
                                        <p className="text-xs text-bureau-500 mt-1">{option.description}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Notes */}
                            <div className="mt-4">
                                <label className="text-sm text-bureau-400 block mb-2">Notes (optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any notes about this status change..."
                                    className="w-full h-24 px-4 py-3 bg-bureau-800 border border-bureau-700 rounded-xl text-bureau-100 placeholder:text-bureau-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-none"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                {!showSuccess && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-bureau-700 bg-bureau-850">
                        <Button variant="outline" onClick={onClose} disabled={isUpdating}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={isUpdating || selectedStatus === currentStatus}
                            leftIcon={isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        >
                            {isUpdating ? "Updating..." : "Update Status"}
                        </Button>
                    </div>
                )}
            </motion.div>
        </>
    );
}

// Transfer Custody Dialog
interface TransferCustodyDialogProps {
    isOpen: boolean;
    onClose: () => void;
    evidenceNumber: string;
    currentLocation: string;
    onTransfer: (data: { handlerId: string; location: string; notes: string }) => void;
}

export function TransferCustodyDialog({
    isOpen,
    onClose,
    evidenceNumber,
    currentLocation,
    onTransfer,
}: TransferCustodyDialogProps) {
    const [handlerName, setHandlerName] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [isTransferring, setIsTransferring] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleTransfer = async () => {
        if (!handlerName || !newLocation) return;

        setIsTransferring(true);
        await new Promise((resolve) => setTimeout(resolve, 1200));
        onTransfer({ handlerId: "user-001", location: newLocation, notes });
        setIsTransferring(false);
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
            setHandlerName("");
            setNewLocation("");
            setNotes("");
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-[15%] mx-auto max-w-lg bg-bureau-900 border border-bureau-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-bureau-700 bg-bureau-850">
                    <div>
                        <h2 className="text-lg font-semibold text-bureau-100">Transfer Custody</h2>
                        <p className="text-sm text-bureau-500">{evidenceNumber}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bureau-800 rounded-lg">
                        <X className="h-5 w-5 text-bureau-400" />
                    </button>
                </div>

                <div className="p-6">
                    {showSuccess ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-8"
                        >
                            <div className="w-16 h-16 bg-status-secure/20 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-8 w-8 text-status-secure" />
                            </div>
                            <p className="text-lg font-medium text-bureau-100">Custody Transferred!</p>
                            <p className="text-sm text-bureau-400 mt-1">Chain of custody has been updated.</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-3 bg-bureau-800/50 rounded-lg border border-bureau-700">
                                <p className="text-xs text-bureau-500">Current Location</p>
                                <p className="text-sm text-bureau-100">{currentLocation}</p>
                            </div>

                            <div>
                                <label className="text-sm text-bureau-400 block mb-2">Receiving Officer *</label>
                                <input
                                    type="text"
                                    value={handlerName}
                                    onChange={(e) => setHandlerName(e.target.value)}
                                    placeholder="Enter officer name"
                                    className="w-full px-4 py-3 bg-bureau-800 border border-bureau-700 rounded-xl text-bureau-100 placeholder:text-bureau-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-bureau-400 block mb-2">New Location *</label>
                                <input
                                    type="text"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    placeholder="Enter new storage location"
                                    className="w-full px-4 py-3 bg-bureau-800 border border-bureau-700 rounded-xl text-bureau-100 placeholder:text-bureau-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-bureau-400 block mb-2">Transfer Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Reason for transfer..."
                                    className="w-full h-20 px-4 py-3 bg-bureau-800 border border-bureau-700 rounded-xl text-bureau-100 placeholder:text-bureau-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {!showSuccess && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-bureau-700 bg-bureau-850">
                        <Button variant="outline" onClick={onClose} disabled={isTransferring}>Cancel</Button>
                        <Button
                            onClick={handleTransfer}
                            disabled={isTransferring || !handlerName || !newLocation}
                            leftIcon={isTransferring ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                        >
                            {isTransferring ? "Transferring..." : "Transfer Custody"}
                        </Button>
                    </div>
                )}
            </motion.div>
        </>
    );
}

// Add Analysis Report Dialog
interface AddAnalysisDialogProps {
    isOpen: boolean;
    onClose: () => void;
    evidenceNumber: string;
    onSubmit: (report: string) => void;
}

export function AddAnalysisDialog({
    isOpen,
    onClose,
    evidenceNumber,
    onSubmit,
}: AddAnalysisDialogProps) {
    const [report, setReport] = useState("");
    const [analyst, setAnalyst] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!report || !analyst) return;

        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onSubmit(report);
        setIsSubmitting(false);
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
            setReport("");
            setAnalyst("");
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-[10%] mx-auto max-w-2xl bg-bureau-900 border border-bureau-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-bureau-700 bg-bureau-850">
                    <div>
                        <h2 className="text-lg font-semibold text-bureau-100">Add Analysis Report</h2>
                        <p className="text-sm text-bureau-500">{evidenceNumber}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bureau-800 rounded-lg">
                        <X className="h-5 w-5 text-bureau-400" />
                    </button>
                </div>

                <div className="p-6">
                    {showSuccess ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-8"
                        >
                            <div className="w-16 h-16 bg-status-secure/20 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-8 w-8 text-status-secure" />
                            </div>
                            <p className="text-lg font-medium text-bureau-100">Report Added!</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-bureau-400 block mb-2">Analyst Name *</label>
                                <input
                                    type="text"
                                    value={analyst}
                                    onChange={(e) => setAnalyst(e.target.value)}
                                    placeholder="Enter analyst name"
                                    className="w-full px-4 py-3 bg-bureau-800 border border-bureau-700 rounded-xl text-bureau-100 placeholder:text-bureau-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-bureau-400 block mb-2">Analysis Report *</label>
                                <textarea
                                    value={report}
                                    onChange={(e) => setReport(e.target.value)}
                                    placeholder="Enter detailed analysis findings, methods used, conclusions..."
                                    className="w-full h-48 px-4 py-3 bg-bureau-800 border border-bureau-700 rounded-xl text-bureau-100 placeholder:text-bureau-600 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-none font-mono text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-status-warning/10 border border-status-warning/20 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-status-warning flex-shrink-0" />
                                <p className="text-sm text-bureau-300">
                                    Submitting this report will update the evidence status to "Analyzed"
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {!showSuccess && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-bureau-700 bg-bureau-850">
                        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !report || !analyst}
                            leftIcon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </Button>
                    </div>
                )}
            </motion.div>
        </>
    );
}
