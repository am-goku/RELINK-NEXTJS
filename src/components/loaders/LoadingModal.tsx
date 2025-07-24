'use client';

import { motion } from 'framer-motion';

export default function LoadingModal({ message = "Processing..." }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center gap-4 min-w-[200px]">
                <p className="text-lg font-medium text-gray-700">{message}</p>
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="w-3 h-3 bg-blue-500 rounded-full"
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
    );
}
