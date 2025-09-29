"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import apiInstance from "@/lib/axios";

type SaveButtonProps = {
    initialSaved?: boolean;
    post_id?: string;
};

export default function SaveButton({ initialSaved = false, post_id }: SaveButtonProps) {
    const [saved, setSaved] = useState(initialSaved);
    const [error, setError] = useState<string | null>(null);

    const toggleSave = useCallback(async () => {
        if (!post_id) return;

        const prevSaved = saved;

        // Optimistic update
        setSaved(!prevSaved);

        try {
            const res = await apiInstance.patch(`/api/posts/${post_id}/save`);
            setSaved(res.data.saved);
        } catch (error) {
            setError(getErrorMessage(error) || "An error occurred while updating the save status.");
            // rollback immediately
            setSaved(prevSaved);
        }
    }, [post_id, saved]);

    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(null), 3000);
        return () => clearTimeout(timer);
    }, [error]);

    return (
        <button
            onClick={toggleSave}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="save"
        >
            <motion.div
                key={saved ? "saved" : "unsaved"}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
                <Bookmark
                    className="h-4 w-4"
                    fill={saved ? "blue" : "none"}
                    stroke={saved ? "blue" : "currentColor"}
                />
            </motion.div>

            <span className="text-xs">{saved ? "Saved" : "Save"}</span>
        </button>
    );
}
