import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link href={href} className={`button button--${variant} ${className}`}>
      <span>{children}</span>
      <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" />
    </Link>
  );
}
