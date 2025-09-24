import React from "react";

type CheckboxProps = {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
};

export function Checkbox({ id, label, checked, onChange, disabled }: CheckboxProps) {
    return (
        <label
            htmlFor={id}
            className={`flex items-center gap-2 cursor-pointer select-none 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <input
                id={id}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
                className="peer hidden"
            />
            {/* Custom checkbox style */}
            <span
                className={`w-5 h-5 rounded border flex items-center justify-center
          peer-checked:bg-blue-600 peer-checked:border-blue-600
          peer-focus:ring-2 peer-focus:ring-blue-400
          dark:border-neutral-600 dark:peer-checked:bg-blue-500`}
            >
                {checked && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-4.25-4.25a1 1 0 111.414-1.414l3.543 3.543 7.543-7.543a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </span>
            <span className="text-sm text-gray-800 dark:text-gray-200">{label}</span>
        </label>
    );
}
