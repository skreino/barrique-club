import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";

const variants = {
  primary: "bg-champagne text-espresso shadow-[0_10px_28px_rgba(199,166,106,0.2)] hover:bg-[#d9bd82]",
  wine: "bg-burgundy text-crema shadow-[0_12px_30px_rgba(107,23,43,0.26)] hover:bg-wine",
  ghost: "border border-champagne/25 bg-crema/7 text-crema hover:border-champagne/45 hover:bg-crema/12",
  quiet: "text-champagne hover:text-crema"
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-champagne/50 disabled:cursor-not-allowed disabled:opacity-50",
        "active:translate-y-px",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: keyof typeof variants;
}) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-champagne/50",
        "active:translate-y-px",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
