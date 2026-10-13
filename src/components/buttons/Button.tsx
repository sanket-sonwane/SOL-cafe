import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "inverse" | "outline" | "outlineInverse" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-espresso text-ivory hover:bg-ink",
  inverse: "bg-ivory text-espresso hover:bg-cream",
  outline: "border border-espresso/25 text-espresso hover:border-espresso/60 hover:bg-espresso/[0.04]",
  outlineInverse: "border border-ivory/40 text-ivory hover:bg-ivory hover:text-espresso",
  ghost: "text-espresso hover:text-coffee",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-9 px-4 text-[0.8125rem]",
  md: "min-h-11 px-6 text-sm",
  lg: "min-h-12 px-7 text-[0.9375rem] md:min-h-[3.25rem] md:px-8",
};

/**
 * Shared geometry for every action in the interface.
 *
 * The minimum height is 36–44px depending on size, so pointer targets stay
 * comfortable on touch devices (PRD §8.3). Press feedback is a 0.98 scale — a
 * Tier 1 interaction that must not delay the user.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium whitespace-nowrap",
    "transition-[background-color,color,border-color,transform,opacity] duration-200 ease-[var(--ease-sol)]",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function Button({ children, variant, size, className, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
}

interface ButtonLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Adds the safe external-link attributes automatically. */
  external?: boolean;
}

export function ButtonLink({
  children,
  variant,
  size,
  className,
  external = false,
  href,
  ...rest
}: ButtonLinkProps) {
  const isExternal = external || (typeof href === "string" && /^https?:/i.test(href));

  return (
    <a
      href={href}
      className={buttonClasses({ variant, size, className })}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
