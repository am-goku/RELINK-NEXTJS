import React from "react";

// components/skeletons/SkeletonPostCard.tsx
export default function SkeletonPostCard() {
    return (
        <React.Fragment>
            <div className="animate-pulse p-4 bg-white dark:bg-neutral-900 rounded-lg shadow w-full mb-4">
                <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-1/3 mb-2" />
                <div className="h-6 bg-gray-300 dark:bg-neutral-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-neutral-600 rounded w-5/6" />
            </div>
        </React.Fragment>
    );
}
