'use client';

import { Loader2 } from "lucide-react";
import React, { FC, useCallback, ReactNode } from "react";

type ActionButtonProps = {
    onAction: () => Promise<void>;       // async API action
    children: ReactNode;                 // icon + label
    loading?: boolean;                  // loading state
    className?: string;                  // override styling
};

export const ActionButton: FC<ActionButtonProps> = ({
    onAction,
    children,
    loading,
    className = "px-4 py-1 rounded-full flex items-center gap-1 bg-[#2D3436] text-white hover:brightness-110 dark:bg-gray-200 dark:text-neutral-900",
}) => {
    const handleClick = useCallback(async () => {
        await onAction();
    }, [onAction]);

    return (
        <button onClick={handleClick} disabled={loading} className={className}>
            {loading ? <Loader2 className="animate-spin h-3 w-3" /> : children}
        </button>
    );
};
