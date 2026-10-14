"use client";
import { useRef, type ReactNode } from "react";
import { useInView, useReducedMotion, motion } from "motion/react";
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -35px 0px" });
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        inView && !reducedMotion
          ? { y: [12, 0], opacity: [0.65, 1] }
          : { y: 0, opacity: 1 }
      }
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
