"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MenuIcon } from "../ui/icons";

/**
 * Mobile dropdown menu. Still a native <details>, so it opens without JavaScript,
 * but it now closes itself when a link inside it is tapped, when you tap outside it,
 * or when you press Escape.
 */
export function MobileMenu({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = () => {
      if (ref.current) ref.current.open = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      const el = ref.current;
      if (el?.open && !el.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <details ref={ref} className="group relative md:hidden">
      <summary
        aria-label={label}
        className="grid size-10 cursor-pointer list-none place-items-center rounded-full border border-gold/40 text-cream [&::-webkit-details-marker]:hidden"
      >
        <MenuIcon />
      </summary>
      <div
        onClick={(e) => {
          // Any link tapped inside the panel (page links, #work anchor, language switch) closes it.
          if ((e.target as HTMLElement).closest("a") && ref.current)
            ref.current.open = false;
        }}
        className="absolute right-0 top-12 w-64 rounded-2xl border border-gold/30 bg-navy-deep p-4 shadow-xl"
      >
        {children}
      </div>
    </details>
  );
}
