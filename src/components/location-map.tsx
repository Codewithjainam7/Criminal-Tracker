"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LocationMarker {
    id: string;
    lat: number;
    lng: number;
    label: string;
    type: "suspect" | "evidence" | "incident" | "witness";
    status?: string;
    address?: string;
}

interface LocationMapProps {
    markers: LocationMarker[];
    center?: { lat: number; lng: number };
    className?: string;
    onMarkerClick?: (marker: LocationMarker) => void;
}

// Mock map visualization - in production, integrate with Mapbox or Leaflet
export function LocationMap({
    markers,
    center = { lat: 40.7128, lng: -74.0060 }, // NYC default
    className,
    onMarkerClick,
}: LocationMapProps) {
    const [zoom, setZoom] = useState(12);
    const [selectedMarker, setSelectedMarker] = useState<LocationMarker | null>(null);

    const handleMarkerClick = (marker: LocationMarker) => {
        setSelectedMarker(marker);
        onMarkerClick?.(marker);
    };

    const getMarkerColor = (type: LocationMarker["type"]) => {
        switch (type) {
            case "suspect":
                return "bg-status-critical";
            case "evidence":
                return "bg-status-warning";
            case "incident":
                return "bg-accent-primary";
            case "witness":
                return "bg-status-secure";
            default:
                return "bg-bureau-500";
        }
    };

    const getMarkerRingColor = (type: LocationMarker["type"]) => {
        switch (type) {
            case "suspect":
                return "ring-status-critical/30";
            case "evidence":
                return "ring-status-warning/30";
            case "incident":
                return "ring-accent-primary/30";
            case "witness":
                return "ring-status-secure/30";
            default:
                return "ring-bureau-500/30";
        }
    };

    return (
        <div
            className={cn(
                "relative rounded-xl overflow-hidden border border-bureau-700 bg-bureau-900",
                className
            )}
        >
            {/* Map Container - Simulated with grid background */}
            <div className="relative h-full min-h-[400px] bg-bureau-950">
                {/* Grid overlay for map effect */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: `${50 / (zoom / 12)}px ${50 / (zoom / 12)}px`,
                    }}
                />

                {/* Scanning animation overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent"
                        animate={{ y: ["0%", "40000%"] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Markers */}
                <div className="absolute inset-0">
                    {markers.map((marker, index) => {
                        // Calculate position relative to center (simplified)
                        const offsetX = ((marker.lng - center.lng) * zoom * 10) + 50;
                        const offsetY = ((center.lat - marker.lat) * zoom * 10) + 50;

                        return (
                            <motion.button
                                key={marker.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                                onClick={() => handleMarkerClick(marker)}
                                className={cn(
                                    "absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                                )}
                                style={{
                                    left: `${Math.min(Math.max(offsetX, 10), 90)}%`,
                                    top: `${Math.min(Math.max(offsetY, 10), 90)}%`,
                                }}
                            >
                                {/* Pulse ring */}
                                <span
                                    className={cn(
                                        "absolute inset-0 rounded-full animate-ping opacity-75",
                                        getMarkerColor(marker.type)
                                    )}
                                    style={{ animationDuration: "2s" }}
                                />

                                {/* Marker dot */}
                                <span
                                    className={cn(
                                        "relative flex items-center justify-center w-6 h-6 rounded-full ring-4",
                                        getMarkerColor(marker.type),
                                        getMarkerRingColor(marker.type),
                                        selectedMarker?.id === marker.id && "ring-white/50"
                                    )}
                                >
                                    <MapPin className="h-3 w-3 text-white" />
                                </span>

                                {/* Tooltip on hover */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="bg-bureau-800 border border-bureau-700 rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                                        <p className="text-sm font-medium text-bureau-100">{marker.label}</p>
                                        <p className="text-xs text-bureau-500 capitalize">{marker.type}</p>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Center crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                    <Target className="h-8 w-8 text-accent-primary" />
                </div>

                {/* Selected marker info panel */}
                {selectedMarker && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-4 right-4 bg-bureau-900/90 backdrop-blur-sm border border-bureau-700 rounded-xl p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "w-3 h-3 rounded-full",
                                            getMarkerColor(selectedMarker.type)
                                        )}
                                    />
                                    <h4 className="font-medium text-bureau-100">{selectedMarker.label}</h4>
                                    <Badge variant="outline" size="xs" className="capitalize">
                                        {selectedMarker.type}
                                    </Badge>
                                </div>
                                {selectedMarker.address && (
                                    <p className="text-sm text-bureau-400 mt-1 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {selectedMarker.address}
                                    </p>
                                )}
                                <p className="text-xs text-bureau-500 mt-1">
                                    Coordinates: {selectedMarker.lat.toFixed(4)}, {selectedMarker.lng.toFixed(4)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedMarker(null)}
                                className="p-1 hover:bg-bureau-800 rounded"
                            >
                                <span className="text-bureau-400 text-sm">×</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                    onClick={() => setZoom((z) => Math.min(z + 2, 20))}
                    className="p-2 bg-bureau-900/90 backdrop-blur-sm border border-bureau-700 rounded-lg hover:bg-bureau-800 transition-colors"
                >
                    <ZoomIn className="h-4 w-4 text-bureau-300" />
                </button>
                <button
                    onClick={() => setZoom((z) => Math.max(z - 2, 4))}
                    className="p-2 bg-bureau-900/90 backdrop-blur-sm border border-bureau-700 rounded-lg hover:bg-bureau-800 transition-colors"
                >
                    <ZoomOut className="h-4 w-4 text-bureau-300" />
                </button>
                <button className="p-2 bg-bureau-900/90 backdrop-blur-sm border border-bureau-700 rounded-lg hover:bg-bureau-800 transition-colors">
                    <Layers className="h-4 w-4 text-bureau-300" />
                </button>
                <button className="p-2 bg-bureau-900/90 backdrop-blur-sm border border-bureau-700 rounded-lg hover:bg-bureau-800 transition-colors">
                    <Navigation className="h-4 w-4 text-bureau-300" />
                </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-bureau-900/90 backdrop-blur-sm border border-bureau-700 rounded-lg p-3">
                <p className="text-xs font-medium text-bureau-400 mb-2">Legend</p>
                <div className="space-y-1.5">
                    {[
                        { type: "suspect", label: "Suspect Location" },
                        { type: "evidence", label: "Evidence Found" },
                        { type: "incident", label: "Incident Site" },
                        { type: "witness", label: "Witness Location" },
                    ].map((item) => (
                        <div key={item.type} className="flex items-center gap-2">
                            <span
                                className={cn(
                                    "w-2 h-2 rounded-full",
                                    getMarkerColor(item.type as LocationMarker["type"])
                                )}
                            />
                            <span className="text-xs text-bureau-300">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coordinates display */}
            <div className="absolute top-4 left-4 bg-bureau-900/90 backdrop-blur-sm border border-bureau-700 rounded-lg px-3 py-2">
                <p className="text-xs font-mono text-bureau-400">
                    {center.lat.toFixed(4)}°N, {Math.abs(center.lng).toFixed(4)}°W
                </p>
                <p className="text-xs text-bureau-500">Zoom: {zoom}x</p>
            </div>
        </div>
    );
}

// Mini map for cards
export function MiniLocationMap({
    lat,
    lng,
    label,
    className,
}: {
    lat: number;
    lng: number;
    label?: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "relative h-24 rounded-lg overflow-hidden bg-bureau-950 border border-bureau-700",
                className
            )}
        >
            {/* Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
          `,
                    backgroundSize: "20px 20px",
                }}
            />

            {/* Center marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inset-0 w-4 h-4 bg-accent-primary rounded-full animate-ping opacity-50" />
                <span className="relative flex items-center justify-center w-4 h-4 bg-accent-primary rounded-full">
                    <MapPin className="h-2.5 w-2.5 text-white" />
                </span>
            </div>

            {/* Coordinates */}
            <div className="absolute bottom-1 left-1 bg-bureau-900/80 rounded px-1.5 py-0.5">
                <p className="text-[10px] font-mono text-bureau-400">
                    {lat.toFixed(2)}°, {lng.toFixed(2)}°
                </p>
            </div>

            {label && (
                <div className="absolute top-1 left-1 bg-bureau-900/80 rounded px-1.5 py-0.5">
                    <p className="text-[10px] text-bureau-300 truncate max-w-[100px]">{label}</p>
                </div>
            )}
        </div>
    );
}
