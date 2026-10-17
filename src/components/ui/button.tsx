import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-[#1a56d6] transition-colors",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-border bg-background text-foreground shadow-xs hover:border-primary/60 hover:bg-muted hover:text-primary transition-colors",
        secondary:
          "border border-border bg-secondary text-secondary-foreground shadow-xs hover:bg-background hover:border-primary/40 transition-colors",
        ghost: "hover:bg-muted hover:text-primary transition-colors",
        link: "text-primary underline-offset-4 hover:underline lowercase tracking-normal text-sm font-medium",
        dark: "border border-border/40 bg-surface-dark text-white shadow-xs hover:bg-surface-elevated hover:border-primary/50 transition-colors",
        accent: "bg-[#45C8F5] text-[#101B35] shadow-sm hover:bg-[#32b5e2] transition-colors",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3.5 text-[11px]",
        lg: "h-11 px-6 text-xs sm:text-sm",
        xl: "h-12 px-7 text-sm",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
