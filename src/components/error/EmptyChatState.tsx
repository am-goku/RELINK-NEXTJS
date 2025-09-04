import { MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

export default function EmptyChatState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-full text-center p-6"
        >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <MessageSquare className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>

            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                No messages yet
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1">
                Start the conversation and break the ice! Your messages will appear here.
            </p>
        </motion.div>
    )
}
