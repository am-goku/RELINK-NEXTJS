'use client';

import React from 'react';

interface UserListSkeletonProps {
    count?: number; // number of skeleton items to show
}

export default function UserListSkeleton({ count = 5 }: UserListSkeletonProps) {
    return (
        <React.Fragment>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition animate-pulse"
                >
                    <div className="flex items-center gap-3">
                        {/* Avatar placeholder */}
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />

                        {/* Name & username placeholder */}
                        <div className="flex flex-col gap-1">
                            <div className="w-32 h-4 rounded bg-gray-300 dark:bg-gray-600" />
                            <div className="w-20 h-3 rounded bg-gray-200 dark:bg-gray-500" />
                        </div>
                    </div>

                    {/* Follow button placeholder */}
                    <div className="w-20 h-6 rounded bg-gray-300 dark:bg-gray-600" />
                </div>
            ))}
        </React.Fragment>

    );
}
