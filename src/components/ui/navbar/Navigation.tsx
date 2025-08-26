import { useUser } from "@/context/UserContext";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const Navigation = ({ session }: { session: Session }) => {
    const { user } = useUser();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <React.Fragment>
            <div className="relative flex items-center gap-4 text-sm font-medium">
                {/* Nav Links */}
                <Link
                    id="home"
                    href="/"
                    className="px-4 py-2 rounded hover:bg-primary dark:hover:bg-primary-dark transition-colors"
                >
                    Home
                </Link>
                <Link
                    id="explore"
                    href="/explore"
                    className="px-4 py-2 rounded hover:bg-primary dark:hover:bg-primary-dark transition-colors"
                >
                    Explore
                </Link>
                <Link
                    id="chat"
                    href="/chat"
                    className="px-4 py-2 rounded hover:bg-primary dark:hover:bg-primary-dark transition-colors"
                >
                    Chat
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-primary dark:hover:bg-primary-dark focus:outline-none transition-colors"
                    >
                        <Image
                            src={user?.image || "/images/default-profile.png"}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                        />
                        <span className="hidden md:inline text-sm font-medium">
                            {user?.name || user?.username}
                        </span>
                        <svg
                            className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 transition-colors">
                            <Link
                                href={`/${session.user.username}`}
                                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                My Profile
                            </Link>
                            <Link
                                href="/settings/profile"
                                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Settings
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Navigation;