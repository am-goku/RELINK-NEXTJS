import { Loader2 } from "lucide-react";

function PrimaryButton({
    loading,
    disabled,
    children,
    ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
    return (
        <button
            {...rest}
            disabled={disabled || loading}
            className={`relative inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 font-semibold shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60 ${disabled || loading
                ? "bg-gray-400 text-white dark:bg-neutral-700"
                : "bg-[#2D3436] text-white hover:brightness-110 dark:bg-gray-200 dark:text-neutral-900"
                }`}
        >
            {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {children}
        </button>
    );
}

export default PrimaryButton