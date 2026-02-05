"use client";

import { motion } from "framer-motion";
import {
    Clock,
    Briefcase,
    UserSearch,
    FileBox,
    UserCheck,
    MessageSquare,
    Upload,
    Edit,
    Trash2,
    LogIn,
    AlertTriangle,
    CheckCircle,
    ArrowRight,
    MoreHorizontal,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeTime } from "@/lib/utils";

export type ActivityType =
    | "case_created"
    | "case_updated"
    | "case_closed"
    | "suspect_added"
    | "suspect_updated"
    | "evidence_logged"
    | "evidence_analyzed"
    | "witness_interviewed"
    | "note_added"
    | "file_uploaded"
    | "status_changed"
    | "user_login"
    | "alert_generated";

export interface Activity {
    id: string;
    type: ActivityType;
    title: string;
    description?: string;
    timestamp: Date;
    user?: {
        name: string;
        avatar?: string;
    };
    metadata?: {
        caseId?: string;
        caseNumber?: string;
        suspectId?: string;
        evidenceId?: string;
        oldStatus?: string;
        newStatus?: string;
    };
}

// Mock activities
export const mockActivities: Activity[] = [
    {
        id: "act-001",
        type: "evidence_logged",
        title: "New Evidence Logged",
        description: "Ballistic fragment recovered from crime scene added to HOM-2026-0001",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        user: { name: "Sarah Blackwood" },
        metadata: { caseNumber: "HOM-2026-0001" },
    },
    {
        id: "act-002",
        type: "status_changed",
        title: "Case Status Updated",
        description: "Downtown Jewelry Heist moved from Open to Active Investigation",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        user: { name: "Michael Chen" },
        metadata: { oldStatus: "Open", newStatus: "Active" },
    },
    {
        id: "act-003",
        type: "suspect_added",
        title: "New Suspect Identified",
        description: 'Viktor "The Ghost" Petrov linked to cyber bank heist',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        user: { name: "Elena Rodriguez" },
    },
    {
        id: "act-004",
        type: "witness_interviewed",
        title: "Witness Interview Completed",
        description: "Key witness Maria Santos provided crucial testimony",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        user: { name: "David Kim" },
    },
    {
        id: "act-005",
        type: "case_created",
        title: "New Case Opened",
        description: "Industrial Warehouse Arson - suspected insurance fraud",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        user: { name: "Sarah Blackwood" },
        metadata: { caseNumber: "AST-2025-0156" },
    },
    {
        id: "act-006",
        type: "alert_generated",
        title: "Priority Alert",
        description: "Suspect Viktor Petrov sighted in Metro District 7",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
        id: "act-007",
        type: "evidence_analyzed",
        title: "Forensic Analysis Complete",
        description: "DNA analysis results received for evidence EV-2026-00003",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        user: { name: "James Wilson" },
    },
    {
        id: "act-008",
        type: "file_uploaded",
        title: "Documents Uploaded",
        description: "Surveillance footage from Metro Station added to case files",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        user: { name: "Elena Rodriguez" },
    },
];

const getActivityIcon = (type: ActivityType) => {
    switch (type) {
        case "case_created":
        case "case_updated":
        case "case_closed":
            return <Briefcase className="h-4 w-4" />;
        case "suspect_added":
        case "suspect_updated":
            return <UserSearch className="h-4 w-4" />;
        case "evidence_logged":
        case "evidence_analyzed":
            return <FileBox className="h-4 w-4" />;
        case "witness_interviewed":
            return <UserCheck className="h-4 w-4" />;
        case "note_added":
            return <MessageSquare className="h-4 w-4" />;
        case "file_uploaded":
            return <Upload className="h-4 w-4" />;
        case "status_changed":
            return <ArrowRight className="h-4 w-4" />;
        case "user_login":
            return <LogIn className="h-4 w-4" />;
        case "alert_generated":
            return <AlertTriangle className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
    }
};

const getActivityColor = (type: ActivityType) => {
    switch (type) {
        case "case_created":
            return "bg-status-secure/20 text-status-secure border-status-secure/30";
        case "case_closed":
            return "bg-bureau-600/20 text-bureau-400 border-bureau-600/30";
        case "suspect_added":
        case "suspect_updated":
            return "bg-status-critical/20 text-status-critical border-status-critical/30";
        case "evidence_logged":
        case "evidence_analyzed":
            return "bg-status-warning/20 text-status-warning border-status-warning/30";
        case "witness_interviewed":
            return "bg-accent-primary/20 text-accent-primary border-accent-primary/30";
        case "alert_generated":
            return "bg-status-critical/20 text-status-critical border-status-critical/30";
        default:
            return "bg-accent-secondary/20 text-accent-secondary border-accent-secondary/30";
    }
};

interface ActivityTimelineProps {
    activities?: Activity[];
    maxItems?: number;
    showLoadMore?: boolean;
    className?: string;
}

export function ActivityTimeline({
    activities = mockActivities,
    maxItems = 10,
    showLoadMore = true,
    className,
}: ActivityTimelineProps) {
    const displayedActivities = activities.slice(0, maxItems);

    return (
        <div className={cn("relative", className)}>
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-bureau-700 via-bureau-700 to-transparent" />

            <div className="space-y-4">
                {displayedActivities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="relative pl-12 group"
                    >
                        {/* Icon */}
                        <div
                            className={cn(
                                "absolute left-2.5 top-0 w-5 h-5 rounded-full border flex items-center justify-center",
                                getActivityColor(activity.type)
                            )}
                        >
                            {getActivityIcon(activity.type)}
                        </div>

                        {/* Content */}
                        <div className="bg-bureau-800/50 backdrop-blur-sm border border-bureau-700/50 rounded-lg p-3 hover:bg-bureau-800/70 transition-colors group-hover:border-bureau-600">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-sm font-medium text-bureau-100">
                                            {activity.title}
                                        </h4>
                                        {activity.type === "alert_generated" && (
                                            <Badge variant="danger" size="xs" pulse>
                                                Alert
                                            </Badge>
                                        )}
                                        {activity.metadata?.caseNumber && (
                                            <Badge variant="outline" size="xs">
                                                {activity.metadata.caseNumber}
                                            </Badge>
                                        )}
                                    </div>
                                    {activity.description && (
                                        <p className="text-sm text-bureau-400 mt-1 line-clamp-2">
                                            {activity.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 mt-2">
                                        {activity.user && (
                                            <div className="flex items-center gap-1.5">
                                                <Avatar name={activity.user.name} size="xs" />
                                                <span className="text-xs text-bureau-500">
                                                    {activity.user.name}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-xs text-bureau-600 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatRelativeTime(activity.timestamp)}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-bureau-700 rounded transition-all">
                                    <MoreHorizontal className="h-4 w-4 text-bureau-500" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Load More */}
            {showLoadMore && activities.length > maxItems && (
                <div className="text-center mt-4 pl-12">
                    <button className="text-sm text-accent-primary hover:text-accent-primary/80 transition-colors">
                        Load more activities ({activities.length - maxItems} remaining)
                    </button>
                </div>
            )}
        </div>
    );
}

// Compact horizontal timeline for case detail pages
export function CompactTimeline({
    activities = mockActivities.slice(0, 5),
    className,
}: {
    activities?: Activity[];
    className?: string;
}) {
    return (
        <div className={cn("flex items-center gap-1 overflow-x-auto", className)}>
            {activities.map((activity, index) => (
                <div key={activity.id} className="flex items-center">
                    <div
                        className={cn(
                            "p-1.5 rounded-full cursor-pointer hover:scale-110 transition-transform",
                            getActivityColor(activity.type)
                        )}
                        title={`${activity.title} - ${formatRelativeTime(activity.timestamp)}`}
                    >
                        {getActivityIcon(activity.type)}
                    </div>
                    {index < activities.length - 1 && (
                        <div className="w-4 h-px bg-bureau-700" />
                    )}
                </div>
            ))}
        </div>
    );
}
