"use client";

import { motion, MotionConfig, useScroll, useSpring } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const viewport = { once: true, margin: "0px 0px -70px 0px" } as const;

/** Wrap the app once: honours the visitor's "reduce motion" setting for every animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Thin gold progress bar along the top edge showing how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gold"
    />
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
  scale?: number;
};

/** Fades and slides a block in once, when it scrolls into view. */
export function Reveal({ children, className, delay = 0, x = 0, y = 28, scale = 1 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y, scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={viewport}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  /** Position in the grid; items in the same row are staggered. */
  index?: number;
  /**
   * For items at the top of the page: use a CSS animation (runs immediately, no JavaScript needed)
   * so the first images and text are never hidden while the page loads.
   */
  eager?: boolean;
};

/** A <li> that reveals itself with a small stagger based on its column. Use inside a plain <ul>. */
export function RevealItem({ children, className = "", index = 0, eager = false }: RevealItemProps) {
  const delay = (index % 4) * 0.08;
  if (eager) {
    return (
      <li className={`rise ${className}`} style={{ "--d": `${delay * 1000}ms` } as CSSProperties}>
        {children}
      </li>
    );
  }
  return (
    <motion.li
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </motion.li>
  );
}
