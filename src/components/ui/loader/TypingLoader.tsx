"use client";

import { motion } from "framer-motion";
import { Dot } from "lucide-react";

type TypingLoaderProps = {
    isMe?: boolean; // whether the typing indicator is mine or the other user's
};

const TypingLoader = ({ isMe = false }: TypingLoaderProps) => {
    return (
        <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div
                className={`rounded-2xl p-3 shadow-sm max-w-[40%] flex items-center gap-1
          ${isMe ? "bg-[#2D3436] text-white" : "bg-white dark:bg-neutral-800 text-[#2D3436]"}`}
            >
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0.2, y: 0 }}
                        animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    >
                        <Dot className="w-4 h-4" />
                    </motion.span>
                ))}
            </div>
        </div>
    );
};

export default TypingLoader;
