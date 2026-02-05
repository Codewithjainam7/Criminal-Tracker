"use client";

import { useState, useEffect } from "react";
import { BootSequence } from "@/components/effects";

interface AppWrapperProps {
    children: React.ReactNode;
    showBootSequence?: boolean;
}

export function AppWrapper({ children, showBootSequence = true }: AppWrapperProps) {
    const [isBooting, setIsBooting] = useState(showBootSequence);
    const [hasBooted, setHasBooted] = useState(false);

    // Check if already booted this session
    useEffect(() => {
        if (typeof window !== "undefined") {
            const booted = sessionStorage.getItem("cit-booted");
            if (booted === "true") {
                setIsBooting(false);
                setHasBooted(true);
            }
        }
    }, []);

    const handleBootComplete = () => {
        setIsBooting(false);
        setHasBooted(true);
        if (typeof window !== "undefined") {
            sessionStorage.setItem("cit-booted", "true");
        }
    };

    if (isBooting && !hasBooted) {
        return <BootSequence onComplete={handleBootComplete} />;
    }

    return <>{children}</>;
}
