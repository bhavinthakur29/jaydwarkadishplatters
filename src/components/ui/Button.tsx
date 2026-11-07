import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "gold" | "navy" | "outline" | "outlineLight" | "whatsapp";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-navy-deep hover:bg-gold-soft",
  navy: "bg-navy text-cream hover:bg-navy-soft",
  outline: "border border-navy/30 text-navy hover:border-navy hover:bg-navy hover:text-cream",
  outlineLight: "border border-gold/60 text-cream hover:bg-gold hover:text-navy-deep",
  whatsapp: "bg-[#128c4a] text-white hover:bg-[#0f7a40]",
};

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Opens in a new tab (for external links like WhatsApp / Maps / Instagram). */
  external?: boolean;
} & Omit<ComponentProps<"a">, "href" | "children" | "className">;

export function ButtonLink({
  href,
  variant = "gold",
  icon,
  children,
  className = "",
  external = false,
  ...rest
}: ButtonLinkProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${variants[variant]} ${className}`;
  if (external || /^(https?:|tel:|mailto:)/.test(href)) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {icon}
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
