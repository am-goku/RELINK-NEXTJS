'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface Props {
    open: boolean;
    author_id: string;
    onClose: () => void;
    onDelete?: () => void;
    onReport?: () => void;
    onUnfollow?: () => void;
    onGoToPost?: () => void;
    onShare?: () => void;
    onCopyLink?: () => void;
    onViewAccount?: () => void;
}

const OptionButton: React.FC<{ label: string; onClick: () => void; danger?: boolean }> = ({ label, onClick, danger }) => (
    <button
        onClick={onClick}
        className={`w-full py-3 text-center text-sm font-medium transition border-b last:border-none dark:border-neutral-700 ${danger
            ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950'
            : 'text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-neutral-800'
            }`}
    >
        {label}
    </button>
);

export default function PostOptionsModal({
    open,
    author_id,
    onClose,
    onDelete,
    onReport,
    onUnfollow,
    onGoToPost,
    onShare,
    onCopyLink,
    onViewAccount,
}: Props) {

    const { data: session } = useSession();

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/40" onClick={onClose} />

                    <motion.div
                        className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-800/90 dark:ring-white/10"
                        initial={{ y: 40 }}
                        animate={{ y: 0 }}
                        exit={{ y: 40 }}
                    >
                        <div className="divide-y divide-gray-200 dark:divide-neutral-700">

                            {
                                session?.user.id === author_id ? (
                                    <OptionButton label="Delete Post" onClick={onDelete ?? (() => { })} danger />
                                ) : (
                                    <OptionButton label="Report" onClick={onReport ?? (() => { })} danger />
                                )
                            }

                            <OptionButton label="Unfollow User" onClick={onUnfollow ?? (() => { })} danger />
                            <OptionButton label="View Post" onClick={onGoToPost ?? (() => { })} />
                            <OptionButton label="Share" onClick={onShare ?? (() => { })} />
                            <OptionButton label="Copy Link" onClick={onCopyLink ?? (() => { })} />
                            <OptionButton label="About this Account" onClick={onViewAccount ?? (() => { })} />
                            <OptionButton label="Cancel" onClick={onClose} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
