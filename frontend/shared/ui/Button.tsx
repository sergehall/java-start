import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/shared/lib/cn";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }>;

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const variantClass =
    variant === "primary" ? "border-transparent bg-ink text-panel" : "border-line bg-transparent text-ink";

  return (
    <button
      className={cn(
        "inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2.5 rounded-lg border px-[18px] font-extrabold transition duration-150 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
