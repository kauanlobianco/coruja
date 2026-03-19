import { motion, AnimatePresence } from 'framer-motion'

interface SelectionPillProps {
  label: string
  emoji: string
  selected: boolean
  onClick: () => void
  /** When true, pill spans 2 grid columns (for odd last item) */
  spanFull?: boolean
}

export function SelectionPill({ label, emoji, selected, onClick, spanFull = false }: SelectionPillProps) {
  return (
    <motion.button
      type="button"
      className={`ob-selection-pill${selected ? ' ob-selection-pill--selected' : ''}`}
      style={spanFull ? { gridColumn: 'span 2' } : undefined}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      animate={selected ? { scale: [1, 0.97, 1.02, 1.0] } : { scale: 1 }}
      transition={
        selected
          ? { duration: 0.18, times: [0, 0.3, 0.7, 1], ease: 'easeOut' }
          : { duration: 0.12 }
      }
    >
      <span className="ob-pill-emoji" aria-hidden="true">{emoji}</span>
      <span className="ob-pill-label">{label}</span>
      <AnimatePresence>
        {selected && (
          <motion.span
            className="ob-pill-check"
            aria-hidden="true"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.6 }}
          >
            ✓
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
