import { AnimatePresence, motion } from "framer-motion";

function TextInput(
    props: React.InputHTMLAttributes<HTMLInputElement> & {
        leftIcon?: React.ReactNode;
        rightAdornment?: React.ReactNode;
        error?: string;
    }
) {
    const { leftIcon, rightAdornment, error, className = "", ...rest } = props;
    return (
        <div className="w-full">
            <div
                className={`mt-1 flex items-center rounded-2xl border bg-white/80 dark:bg-neutral-800/80 px-3 py-2 shadow-sm backdrop-blur-sm transition-all ${error
                    ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-300"
                    : "border-gray-200 dark:border-neutral-700 focus-within:border-gray-400 focus-within:ring-gray-300"
                    } focus-within:ring-2`}
            >
                {leftIcon && <span className="mr-2 opacity-80">{leftIcon}</span>}
                <input
                    {...rest}
                    className={`flex-1 bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 ${className}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${rest.id}-error` : undefined}
                />
                {rightAdornment && <span className="ml-2">{rightAdornment}</span>}
            </div>
            <AnimatePresence initial={false}>
                {error && (
                    <motion.p
                        id={`${rest.id}-error`}
                        className="mt-1 text-xs text-red-600 dark:text-red-400"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

export { TextInput };