import type { ReactNode } from "react";
import { Reveal } from "./Motion";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  /** Use on navy backgrounds. */
  light?: boolean;
  align?: "center" | "left";
  as?: "h1" | "h2";
  children?: ReactNode;
};

/** Small gold diamond divider, echoing the ornament in her branding. */
export function Ornament({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden>
      <span className={`h-px w-12 ${light ? "bg-gold/60" : "bg-gold-dark/40"}`} />
      <span className={`size-2 rotate-45 ${light ? "bg-gold" : "bg-gold-dark"}`} />
      <span className={`h-px w-12 ${light ? "bg-gold/60" : "bg-gold-dark/40"}`} />
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  light = false,
  align = "center",
  as: Tag = "h2",
  children,
}: Props) {
  const center = align === "center";
  const wrapperClass = center ? "mx-auto max-w-2xl text-center" : "max-w-2xl";
  const body = (
    <>
      {eyebrow && (
        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.22em] ${
            light ? "text-gold" : "text-gold-dark"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={`font-display text-3xl font-semibold leading-tight sm:text-4xl ${
          light ? "text-cream" : "text-navy"
        }`}
      >
        {title}
      </Tag>
      {center && (
        <div className="mt-4">
          <Ornament light={light} />
        </div>
      )}
      {subtitle && (
        <p className={`mt-4 text-base ${light ? "text-cream/80" : "text-navy-deep/75"}`}>
          {subtitle}
        </p>
      )}
      {children}
    </>
  );
  // The page's main heading is at the top of the screen: animate it with CSS so it never waits for JS.
  return Tag === "h1" ? (
    <div className={`rise ${wrapperClass}`}>{body}</div>
  ) : (
    <Reveal className={wrapperClass}>{body}</Reveal>
  );
}
