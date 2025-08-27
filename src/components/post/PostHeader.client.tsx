'use client'

import React, { useRef, useEffect, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface PostHeaderProps {
    user: {
        _id: string;
        name: string;
        username: string;
        image: string;
    };
    currentUserID: string;
}

export default function PostHeader({ user, currentUserID }: PostHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isOwnPost = user?._id.toString() === currentUserID.toString();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex items-center justify-between mb-4">
            {/* User Info */}
            <div className="flex items-center">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                        src={user?.image || "/images/default-profile.png"}
                        alt={user?.name || "User"}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {user?.name || user?.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{user?.username}
                    </p>
                </div>
            </div>

            {/* Menu */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 transition-colors">
                        <ul className="text-sm text-gray-700 dark:text-gray-200">
                            {isOwnPost ? (
                                <>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                        Delete
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                        Archive
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                        Report
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                        Block
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
