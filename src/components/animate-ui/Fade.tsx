// Adapted from Animate UI's Fade primitive for this small CSS-based project.
// Source: https://animate-ui.com/r/primitives-effects-fade.json (MIT license)
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export function Fade({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion()
  return <motion.div
    className={className}
    initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
    transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
  >{children}</motion.div>
}
