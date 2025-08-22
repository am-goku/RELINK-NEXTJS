import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AnimatedSectionProps {
    title: string;
    icon?: React.ElementType;
    children: React.ReactNode;
}

export default function AnimatedSection({ title, icon: Icon, children }: AnimatedSectionProps) {
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 transition-colors">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex items-center gap-3 font-semibold text-[#2D3436] dark:text-gray-100">
                        {Icon && <Icon className="text-[#6C5CE7] dark:text-blue-400" size={20} />}
                        <h2>{title}</h2>
                    </div>
                    {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>

                <AnimatePresence initial={false}>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 text-sm text-[#636e72] dark:text-gray-200 space-y-3 overflow-hidden"
                        >
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </React.Fragment>
    );
}
