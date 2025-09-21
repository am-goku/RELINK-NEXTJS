'use client';

import React, { FC, useCallback, ReactNode } from "react";

type ActionButtonProps = {
    onAction: () => Promise<void>;       // async API action
    children: ReactNode;                 // icon + label
    className?: string;                  // override styling
};

export const ActionButton: FC<ActionButtonProps> = ({
    onAction,
    children,
    className = "px-4 py-1 rounded-full flex items-center gap-1 bg-[#2D3436] text-white hover:brightness-110 dark:bg-gray-200 dark:text-neutral-900",
}) => {
    const handleClick = useCallback(async () => {
        await onAction();
    }, [onAction]);

    return (
        <button onClick={handleClick} className={className}>
            {children}
        </button>
    );
};
