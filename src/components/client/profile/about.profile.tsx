'use client';

import { SanitizedUser } from "@/utils/sanitizer/user";
import { CalendarDays, UserCircle2, Link as LinkIcon } from "lucide-react";

type AboutCardProps = {
    user: Pick<SanitizedUser, "name" | "bio" | "created_at" | "links" | "gender">;
};

export const AboutCard = ({ user }: AboutCardProps) => {
    return (
        <div className="bg-white dark:bg-dark-bg/90 p-4 rounded-2xl shadow space-y-3">
            {/* Title */}
            <h3 className="font-semibold text-lg">
                About {user.name || "User"}
            </h3>

            {/* Bio */}
            {user.bio ? (
                <p className="text-gray-700 dark:text-gray-300">
                    {user.bio}
                </p>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No bio available</p>
            )}

            {/* Gender */}
            {user.gender && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <UserCircle2 size={16} />
                    <span>{user.gender}</span>
                </div>
            )}

            {/* Joined Date */}
            {user.created_at && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CalendarDays size={16} />
                    <span>
                        Joined {new Date(user.created_at).toLocaleDateString(undefined, {
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>
            )}

            {/* Links */}
            {user.links && user?.links.length > 0 && (
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">Links</span>
                    {user?.links.map((link, i) => (
                        <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                            <LinkIcon size={14} />
                            {link}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};
