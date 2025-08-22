"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { SanitizedUser } from "@/utils/sanitizer/user";

interface FollowModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: "Followers" | "Following";
    users: {_id: string, username: string, name: string, image: string}[];
    onToggleFollow?: (userId: string) => void;
}

export default function FollowModal({
    isOpen,
    onClose,
    title,
    users,
    // onToggleFollow,
}: FollowModalProps) {
    // Close modal on ESC press
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);



    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 px-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl shadow-lg overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 px-4 py-3">
                                <h2 className="text-lg font-semibold">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* User List */}
                            <div className="max-h-96 overflow-y-auto">
                                {users.length === 0 ? (
                                    <p className="text-center text-neutral-500 py-6">
                                        No {title.toLowerCase()} yet
                                    </p>
                                ) : (
                                    users.map((user) => (
                                        <div
                                            key={user._id}
                                            className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={
                                                        user.image ||
                                                        `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                                                    }
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-neutral-500">
                                                        @{user.username}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* <button
                                                onClick={() => onToggleFollow(user._id)}
                                                className={`px-4 py-1.5 text-sm font-medium rounded-full border transition 
                          ${title === "Following" || user.isFollowing
                                                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                                        : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                                    }`}
                                            >
                                                {title === "Following"
                                                    ? "Following"
                                                    : user.isFollowing
                                                        ? "Following"
                                                        : "Follow"}
                                            </button> */}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
