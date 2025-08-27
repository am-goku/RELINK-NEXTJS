"use client";

import React from "react";
import { motion } from "framer-motion";

interface UpdateButtonProps {
    label: string; // Text when not loading
    doFunc: () => Promise<void>; // Async function to execute
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>; // Optional external loading setter
    loading?: boolean; // Optional external loading state
    className?: string; // Optional extra classes
}

export default function UpdateButton({
    label,
    doFunc,
    setLoading,
    loading: externalLoading,
    className = "",
}: UpdateButtonProps) {
    const [internalLoading, setInternalLoading] = React.useState(false);

    const isLoading = externalLoading ?? internalLoading;

    const handleClick = async () => {
        try {
            if (!externalLoading) setInternalLoading(true);
            if (setLoading) setLoading(true);
            await doFunc();
        } catch (err) {
            console.error(err);
        } finally {
            if (!externalLoading) setInternalLoading(false);
            if (setLoading) setLoading(false);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            disabled={isLoading}
            className={`w-full md:w-auto px-6 py-2 rounded-lg font-semibold transition-all duration-200 
        bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 
        text-white disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        >
            {isLoading ? "Loading..." : label}
        </motion.button>
    );
}
