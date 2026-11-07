"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fill } from "@/lib/i18n";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, WhatsAppIcon } from "./icons";

export type GalleryItem = {
  id: string;
  name: string;
  description?: string;
  /** Category name, shown in the lightbox on mixed galleries (home page). */
  category?: string;
  src: string;
  alt: string;
  /** Prebuilt wa.me link with the product name filled in. */
  enquireUrl: string;
};

export type GalleryLabels = {
  enquire: string;
  close: string;
  next: string;
  previous: string;
  open: string;
  /** e.g. "{current} of {total}" */
  counter: string;
};

type Props = {
  items: GalleryItem[];
  labels: GalleryLabels;
  /** Load the first N images eagerly (use for galleries at the top of a page). */
  priorityCount?: number;
};

export function ProductGallery({ items, labels, priorityCount = 0 }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active !== null && !dialog.open) dialog.showModal();
    if (active === null && dialog.open) dialog.close();
  }, [active]);

  const step = (delta: number) =>
    setActive((i) => (i === null ? i : (i + delta + items.length) % items.length));

  const close = () => {
    setActive(null);
    triggerRef.current?.focus();
  };

  const current = active !== null ? items[active] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setActive(index);
              }}
              aria-label={`${labels.open}: ${item.name}`}
              className="group block w-full text-left"
            >
              <span className="relative block aspect-[4/5] overflow-hidden rounded-2xl border border-gold/40 bg-sand shadow-sm transition-shadow group-hover:shadow-lg">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                  priority={index < priorityCount}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="mt-3 block font-display text-base font-semibold text-navy sm:text-lg">
                {item.name}
              </span>
              {item.category && (
                <span className="block text-xs text-gold-dark">{item.category}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={current?.name}
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-0 h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 open:flex open:items-center open:justify-center"
      >
        {current && active !== null && (
          <div className="relative flex h-full w-full max-w-5xl flex-col px-3 pb-4 pt-14 sm:px-6">
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20 sm:right-6"
            >
              <CloseIcon />
            </button>

            <div className="relative min-h-0 flex-1">
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={labels.previous}
                    className="absolute left-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-navy-deep/60 text-cream transition-colors hover:bg-navy-deep sm:left-2"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={labels.next}
                    className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-navy-deep/60 text-cream transition-colors hover:bg-navy-deep sm:right-2"
                  >
                    <ChevronRightIcon />
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 flex flex-col items-center gap-3 text-center text-cream sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="font-display text-xl font-semibold">{current.name}</p>
                {current.description && (
                  <p className="mt-1 max-w-xl text-sm text-cream/75">{current.description}</p>
                )}
                <p className="mt-1 text-xs text-gold-soft">
                  {fill(labels.counter, { current: active + 1, total: items.length })}
                </p>
              </div>
              <a
                href={current.enquireUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#128c4a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f7a40]"
              >
                <WhatsAppIcon />
                {labels.enquire}
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
