// Adapted from Animate UI's Fade primitive for this small CSS-based project.
// Source: https://animate-ui.com/r/primitives-effects-fade.json (MIT license)
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export function Fade({ children, className, slide = true }: { children: ReactNode; className?: string; slide?: boolean }) {
  const reduceMotion = useReducedMotion()
  return <motion.div
    className={className}
    initial={slide ? { opacity: 0, y: reduceMotion ? 0 : 10 } : { opacity: 0 }}
    animate={slide ? { opacity: 1, y: 0 } : { opacity: 1 }}
    exit={slide ? { opacity: 0, y: reduceMotion ? 0 : -6 } : { opacity: 0 }}
    transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
  >{children}</motion.div>
}
