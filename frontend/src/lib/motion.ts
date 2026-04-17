export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
}

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

export const cardHover = {
  whileHover: { scale: 1.015, transition: { duration: 0.15 } },
}

export const slideInRight = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit: { x: '100%', transition: { duration: 0.2 } },
}
