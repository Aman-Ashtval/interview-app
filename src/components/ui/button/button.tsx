"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils";
import styles from "./button.module.scss";

const BUTTON_VARIANTS = [
  "default",
  "primary",
  "success",
  "danger",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;

const BUTTON_SIZES = ["default", "sm", "lg", "icon"] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      asChild = false,
      disabled,
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled ?? isLoading;

    const variantClass = styles[`btn--${variant}`];
    const sizeClass = styles[`btn--size-${size}`];

    return (
      <Comp
        className={cn(styles.btn, variantClass, sizeClass, className)}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2
              className={styles.btn__loader}
              width={16}
              height={16}
              aria-hidden
            />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button };
