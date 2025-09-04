import { motion } from "framer-motion"

export default function MessageSkeleton() {
    return (
        <div className="p-4 space-y-4 animate-pulse">
            {/* Skeleton message bubbles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                    <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 
              ${i % 2 === 0
                                ? "bg-gray-200 dark:bg-neutral-700"
                                : "bg-blue-100 dark:bg-blue-900"}
            `}
                    >
                        <div className="h-3 w-24 rounded bg-gray-300 dark:bg-neutral-600 mb-2" />
                        <div className="h-3 w-36 rounded bg-gray-300 dark:bg-neutral-600" />
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
