import { AnimatePresence, motion } from 'framer-motion'
import {
  Bed,
  Brain,
  Briefcase,
  Clock3,
  Compass,
  HeartHandshake,
  House,
  ListTodo,
  MoonStar,
  Smartphone,
  Sparkles,
  Target,
  TriangleAlert,
  UserRound,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  target: Target,
  heart: HeartHandshake,
  clock: Clock3,
  moon: MoonStar,
  sparkles: Sparkles,
  shield: UserRound,
  briefcase: Briefcase,
  bed: Bed,
  user: UserRound,
  zap: Zap,
  alert: TriangleAlert,
  compass: Compass,
  tasks: ListTodo,
  house: House,
  phone: Smartphone,
}

interface SelectionPillProps {
  label: string
  icon?: string
  selected: boolean
  onClick: () => void
  spanFull?: boolean
  compact?: boolean
}

function inferIconKey(label: string) {
  const normalized = label.toLowerCase()

  if (normalized.includes('clareza') || normalized.includes('mental')) return 'brain'
  if (normalized.includes('controle')) return 'target'
  if (normalized.includes('relacion')) return 'heart'
  if (normalized.includes('tempo')) return 'clock'
  if (normalized.includes('dormir')) return 'moon'
  if (normalized.includes('presente')) return 'sparkles'
  if (normalized.includes('autoestima')) return 'shield'
  if (normalized.includes('trabalho')) return 'briefcase'
  if (normalized.includes('cansado')) return 'bed'
  if (normalized.includes('entediado')) return 'sparkles'
  if (normalized.includes('ansioso')) return 'alert'
  if (normalized.includes('frustrado')) return 'zap'
  if (normalized.includes('fim de semana')) return 'clock'
  if (normalized.includes('quarto')) return 'house'
  if (normalized.includes('celular')) return 'phone'
  if (normalized.includes('madrugada')) return 'moon'
  if (normalized.includes('redes')) return 'sparkles'
  if (normalized.includes('estressante')) return 'zap'
  if (normalized.includes('conflito')) return 'alert'
  if (normalized.includes('sem rumo')) return 'compass'
  if (normalized.includes('enrolando')) return 'tasks'
  if (normalized.includes('beber')) return 'clock'
  if (normalized.includes('acordar')) return 'sparkles'

  return 'sparkles'
}

export function SelectionPill({
  label,
  icon,
  selected,
  onClick,
  spanFull = false,
  compact = false,
}: SelectionPillProps) {
  const Icon = iconMap[icon ?? inferIconKey(label)] ?? Sparkles

  return (
    <motion.button
      type="button"
      className={`ob-selection-pill${selected ? ' ob-selection-pill--selected' : ''}${compact ? ' ob-selection-pill--compact' : ''}`}
      style={spanFull && !compact ? { gridColumn: 'span 2' } : undefined}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      animate={selected ? { scale: [1, 0.985, 1.01, 1] } : { scale: [1, 0.985, 1] }}
      transition={
        selected
          ? { duration: 0.18, times: [0, 0.3, 0.7, 1], ease: 'easeOut' }
          : { duration: 0.14, times: [0, 0.4, 1], ease: 'easeOut' }
      }
    >
      <span className="ob-pill-icon" aria-hidden="true">
        <Icon size={14} strokeWidth={2} />
      </span>
      <span className="ob-pill-label">{label}</span>
      <AnimatePresence>
        {selected ? (
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
        ) : null}
      </AnimatePresence>
    </motion.button>
  )
}
