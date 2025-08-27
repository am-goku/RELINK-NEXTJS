'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function LoadingModal({ message = "Processing..." }: { message?: string }) {
    return (
        <React.Fragment>
            <div className="fixed inset-0 bg-black/30 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center gap-4 min-w-[200px]">
                    <p className="text-gray-700 dark:text-gray-200 text-lg font-medium">{message}</p>
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [1, 0.5, 1],
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
