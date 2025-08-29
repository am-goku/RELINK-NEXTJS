import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn = classNames utility that merges Tailwind classes safely
export function cn(...inputs: string[]) {
    return twMerge(clsx(inputs));
}