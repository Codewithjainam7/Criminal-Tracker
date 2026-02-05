"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FileDown,
    FileText,
    FileSpreadsheet,
    FileJson,
    Printer,
    Download,
    Check,
    Loader2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ExportFormat = "pdf" | "csv" | "xlsx" | "json";

interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: ExportFormat) => void;
    title?: string;
    itemCount?: number;
}

const exportFormats: { format: ExportFormat; icon: React.ReactNode; label: string; description: string }[] = [
    {
        format: "pdf",
        icon: <FileText className="h-5 w-5" />,
        label: "PDF Document",
        description: "Best for printing and sharing",
    },
    {
        format: "csv",
        icon: <FileSpreadsheet className="h-5 w-5" />,
        label: "CSV Spreadsheet",
        description: "Compatible with Excel, Google Sheets",
    },
    {
        format: "xlsx",
        icon: <FileSpreadsheet className="h-5 w-5" />,
        label: "Excel Workbook",
        description: "Native Excel format with formatting",
    },
    {
        format: "json",
        icon: <FileJson className="h-5 w-5" />,
        label: "JSON Data",
        description: "For developers and integrations",
    },
];

export function ExportDialog({
    isOpen,
    onClose,
    onExport,
    title = "Export Data",
    itemCount,
}: ExportDialogProps) {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("pdf");
    const [isExporting, setIsExporting] = useState(false);
    const [exportComplete, setExportComplete] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        // Simulate export process
        await new Promise((resolve) => setTimeout(resolve, 1500));

        onExport(selectedFormat);
        setIsExporting(false);
        setExportComplete(true);

        // Auto-close after success
        setTimeout(() => {
            setExportComplete(false);
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
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
                className="fixed inset-x-4 top-[20%] mx-auto max-w-md bg-bureau-900 border border-bureau-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-bureau-700 bg-bureau-850">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent-primary/20 rounded-lg">
                            <FileDown className="h-5 w-5 text-accent-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-bureau-100">{title}</h2>
                            {itemCount && (
                                <p className="text-sm text-bureau-500">{itemCount} items selected</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-bureau-800 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-bureau-400" />
                    </button>
                </div>

                {/* Format Selection */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-bureau-400">Select export format:</p>

                    <div className="grid grid-cols-2 gap-3">
                        {exportFormats.map((item) => (
                            <button
                                key={item.format}
                                onClick={() => setSelectedFormat(item.format)}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all text-left group",
                                    selectedFormat === item.format
                                        ? "border-accent-primary bg-accent-primary/10"
                                        : "border-bureau-700 hover:border-bureau-600 bg-bureau-800/50"
                                )}
                            >
                                <div
                                    className={cn(
                                        "p-2 rounded-lg w-fit mb-2",
                                        selectedFormat === item.format
                                            ? "bg-accent-primary/20 text-accent-primary"
                                            : "bg-bureau-700 text-bureau-400 group-hover:text-bureau-300"
                                    )}
                                >
                                    {item.icon}
                                </div>
                                <h4
                                    className={cn(
                                        "font-medium text-sm",
                                        selectedFormat === item.format
                                            ? "text-bureau-100"
                                            : "text-bureau-300"
                                    )}
                                >
                                    {item.label}
                                </h4>
                                <p className="text-xs text-bureau-500 mt-1">{item.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-bureau-700 bg-bureau-850">
                    <Button variant="outline" onClick={onClose} disabled={isExporting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleExport}
                        disabled={isExporting || exportComplete}
                        leftIcon={
                            exportComplete ? (
                                <Check className="h-4 w-4" />
                            ) : isExporting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )
                        }
                        className={exportComplete ? "bg-status-secure hover:bg-status-secure" : ""}
                    >
                        {exportComplete
                            ? "Exported!"
                            : isExporting
                                ? "Exporting..."
                                : `Export as ${selectedFormat.toUpperCase()}`}
                    </Button>
                </div>
            </motion.div>
        </>
    );
}

// Export utility functions
export const exportUtils = {
    // Generate CSV from data
    toCSV: (data: Record<string, unknown>[], headers?: string[]): string => {
        if (data.length === 0) return "";

        const keys = headers || Object.keys(data[0]);
        const csvRows = [
            keys.join(","),
            ...data.map((row) =>
                keys
                    .map((key) => {
                        const value = row[key];
                        if (typeof value === "string" && value.includes(",")) {
                            return `"${value}"`;
                        }
                        return String(value ?? "");
                    })
                    .join(",")
            ),
        ];

        return csvRows.join("\n");
    },

    // Generate JSON from data
    toJSON: (data: unknown): string => {
        return JSON.stringify(data, null, 2);
    },

    // Download file
    downloadFile: (content: string, filename: string, contentType: string) => {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // Export as CSV
    exportCSV: (data: Record<string, unknown>[], filename: string) => {
        const csv = exportUtils.toCSV(data);
        exportUtils.downloadFile(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
    },

    // Export as JSON
    exportJSON: (data: unknown, filename: string) => {
        const json = exportUtils.toJSON(data);
        exportUtils.downloadFile(json, `${filename}.json`, "application/json");
    },

    // Print function
    print: () => {
        window.print();
    },
};

// Quick export button component
export function QuickExportButton({
    data,
    filename = "export",
    format = "csv",
    className,
}: {
    data: Record<string, unknown>[];
    filename?: string;
    format?: "csv" | "json";
    className?: string;
}) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (format === "csv") {
            exportUtils.exportCSV(data, filename);
        } else {
            exportUtils.exportJSON(data, filename);
        }

        setIsExporting(false);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className={className}
            leftIcon={
                isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Download className="h-4 w-4" />
                )
            }
        >
            Export
        </Button>
    );
}
