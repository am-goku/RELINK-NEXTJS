"use client";

import { X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserConnectionList } from "@/services/api/user-apis";
import { ShortUser } from "@/utils/sanitizer/user";
import { Types } from "mongoose";
import UserListSkeleton from "../ui/loaders/UserListSkeleton";

interface FollowModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: "Followers" | "Following";
    user_id: Types.ObjectId;
    onToggleFollow?: (userId: string) => void;
}

export default function FollowModal({
    isOpen,
    onClose,
    title,
    user_id,
}: FollowModalProps) {

    const [users, setUsers] = useState<ShortUser[]>([])
    const [error, setError] = useState<string | null>(null)

    // UI States
    const [loading, setLoading] = useState<boolean>(false)

    // Close modal on ESC press
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    //fetch user list
    const fetchUserList = useCallback(async () => {
        await getUserConnectionList({
            id: user_id,
            setUsers,
            type: title === "Followers" ? "followers" : "following",
            setError,
            setLoading
        })
    }, [user_id, title])


    //Fetching user connection list
    useEffect(() => {
        if (user_id) {
            fetchUserList()
        }
    }, [fetchUserList, user_id])

    // Error handling from error state
    useEffect(() => {
        if (error) {
            console.log(error)
        }
        return () => setError(null)
    }, [error])


    return (
        <React.Fragment>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 transition-colors"
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
                            <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl shadow-lg overflow-hidden transition-colors">
                                {/* Header */}
                                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-gray-600 dark:text-gray-300" />
                                    </button>
                                </div>

                                {/* User List */}
                                <div className="max-h-96 overflow-y-auto">
                                    {loading ? (
                                        <UserListSkeleton />
                                    ) : users?.length === 0 ? (
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                                            No {title.toLowerCase()} yet
                                        </p>
                                    ) : (
                                        users?.map((user) => (
                                            <div
                                                key={user._id}
                                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                                                        <p className="font-medium text-gray-800 dark:text-gray-100">{user.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                                                    </div>
                                                </div>
                                                {/* Follow button can be added here */}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </React.Fragment>
    );
}
