"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-[var(--border-color)] bg-transparent px-3 py-1 text-sm text-[var(--text-black-color)] shadow-sm transition-colors placeholder:text-[var(--text-placeholder)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary-color)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
