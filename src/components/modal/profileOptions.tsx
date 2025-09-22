'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Props {
    open: boolean;
    profile_id?: string;
    onClose: () => void;
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

export default function ProfileOptionsModal({ open, profile_id, onClose, }: Props) {
    const router = useRouter();

    const { data: session } = useSession();
    const isOwnProfile = session?.user.id === profile_id;


    const changePageTo = (url: string) => {
        router.push(url);
        onClose();
    }

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
                            {isOwnProfile ? (
                                <>
                                    <OptionButton label="Edit Profile" onClick={() => { changePageTo('/settings?tab=edit-profile'); }} />
                                    <OptionButton label="Account Settings" onClick={() => {changePageTo('/settings?tab=account');}} />
                                    <OptionButton label="Interface Settings" onClick={() => {changePageTo('/settings?tab=interface');}} />
                                    <OptionButton label="Privacy Policy" onClick={() => {changePageTo('/settings?tab=privacy-policy');}} />
                                    <OptionButton label="Help & Support" onClick={() => {changePageTo('/settings?tab=help-support');}} />
                                    <OptionButton label="Share Profile" onClick={() => { }} />
                                    <OptionButton label="Copy Profile Link" onClick={() => { }} />
                                    <OptionButton label="Logout" onClick={() => signOut()} danger />
                                </>
                            ) : (
                                <>
                                    <OptionButton label="Share Profile" onClick={() => { }} />
                                    <OptionButton label="Copy Profile Link" onClick={() => { }} />
                                    <OptionButton label="Report User" onClick={() => { }} danger />
                                    <OptionButton label="Block User" onClick={() => { }} danger />
                                </>
                            )}

                            <OptionButton label="Cancel" onClick={onClose} />
                        </div>


                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
