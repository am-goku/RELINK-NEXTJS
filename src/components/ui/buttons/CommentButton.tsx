"use client";


import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/styles/cn";


/********************************
* BUTTON COMPONENT
********************************/
const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-white hover:bg-primary/90 focus:ring-none",
                ghost:
                    "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
                outline:
                    "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                destructive:
                    "bg-red-500 text-white hover:bg-red-600 focus:ring-none",
            },
            size: {
                sm: "h-8 px-3 text-xs",
                md: "h-10 px-4 text-sm",
                lg: "h-12 px-6 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);


export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };