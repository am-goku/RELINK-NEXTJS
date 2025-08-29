import { cn } from "@/styles/cn";
import React from "react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full border-0 border-b border-gray-300 dark:border-gray-700 bg-transparent px-0 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-b-primary focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed",
        className || ""
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
