"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import apiInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors/errorResponse";

type LikeButtonProps = {
    initialLiked?: boolean;
    initialCount?: number;
    post_id?: string;
};

export default function LikeButton({
    initialLiked = false,
    initialCount = 0,
    post_id,
}: LikeButtonProps) {

    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [error, setError] = useState<string | null>(null);

    const ToggleLike = useCallback(async () => {
        if (!post_id) return;

        const prevLiked = liked;
        const prevCount = count;

        // Optimistic update
        setLiked(!prevLiked);
        setCount(prevLiked ? prevCount - 1 : prevCount + 1);

        try {
            const res = await apiInstance.patch(`/api/posts/${post_id}/like`);
            setLiked(res.data.liked);
            setCount(res.data.likesCount);
        } catch (error) {
            setError(getErrorMessage(error) || "An error occurred while updating the like status.");
            // rollback immediately
            setLiked(prevLiked);
            setCount(prevCount);
        }
    }, [count, liked, post_id]);

    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(null), 3000);
        return () => clearTimeout(timer);
    }, [error]);

    return (
        <button
            onClick={ToggleLike}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="like"
        >
            <motion.div
                key={liked ? "liked" : "unliked"}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
                <Heart
                    className="h-4 w-4"
                    fill={liked ? "red" : "none"}
                    stroke={liked ? "red" : "currentColor"}
                />
            </motion.div>

            <span className="text-xs">{count}</span>
        </button>
    );
}
