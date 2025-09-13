import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, MoreHorizontal } from 'lucide-react'
import { Session } from 'next-auth';
import React, { useState } from 'react'

type Props = {
    session: Session;
    post_id: string;
}

function PostHeader({ session, post_id }: Props) {

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex items-center justify-between mb-4">
            <button onClick={() => history.back()} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="relative">
                <button onClick={() => setMenuOpen((s) => !s)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                    <MoreHorizontal />
                </button>
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 mt-2 w-40 rounded-xl bg-white dark:bg-neutral-800 shadow-lg p-2">
                            <button className="w-full text-left px-3 py-2 rounded hover:bg-black/5 dark:hover:bg-white/5 text-red-500">Report</button>
                            {
                                session.user.id === post_id && (
                                    <>
                                        <button className="w-full text-left px-3 py-2 rounded hover:bg-black/5 dark:hover:bg-white/5">Edit post</button>
                                        <button className="w-full text-left px-3 py-2 rounded hover:bg-black/5 dark:hover:bg-white/5 text-red-500">Delete</button>
                                    </>
                                )
                            }
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default PostHeader