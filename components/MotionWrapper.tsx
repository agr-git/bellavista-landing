"use client";

/**
 * Single client boundary for Framer Motion enter-animations.
 *
 * Usage:
 *   <MotionWrapper> <section>...</section> </MotionWrapper>
 *
 * All other components should stay server components. If you need motion in a
 * new place, wrap children in this component instead of creating another
 * client boundary. See ADR-002 / PLAN.md B3.
 */

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Delay before enter animation starts (seconds). Default: 0. */
  delay?: number;
  /** Additional classes. */
  className?: string;
  /** Disable the motion entirely (still renders children). */
  disabled?: boolean;
};

export default function MotionWrapper({
  children,
  delay = 0,
  className,
  disabled = false,
}: Props) {
  const prefersReducedMotion = useReducedMotion();

  if (disabled || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
      }}
    >
      {children}
    </motion.div>
  );
}
