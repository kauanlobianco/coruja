import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface BackgroundCirclesProps {
  /** 'active' = verde/emerald  |  'inactive' = vermelho */
  variant?: 'active' | 'inactive'
  children?: ReactNode
  className?: string
}

function AnimatedGrid() {
  return (
    <motion.div
      className="bg-circles-grid"
      animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export function BackgroundCircles({
  variant = 'inactive',
  children,
  className,
}: BackgroundCirclesProps) {
  return (
    <div className={`bg-circles bg-circles--${variant}${className ? ` ${className}` : ''}`}>
      <AnimatedGrid />

      {/* 3 anéis concêntricos pulsantes */}
      <div className="bg-circles-rings">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`bg-circles-ring bg-circles-ring-${i}`}
            animate={{
              rotate: 360,
              scale: [1, 1.05 + i * 0.05, 1],
              opacity: [0.75, 1, 0.75],
            }}
            transition={{
              rotate: { duration: 12 + i * 4, repeat: Infinity, ease: 'linear' },
              scale:  { duration: 5 + i,      repeat: Infinity, ease: 'easeInOut' },
              opacity:{ duration: 5 + i,      repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        ))}
      </div>

      {/* Conteúdo central (ícone + texto) */}
      {children && (
        <div className="bg-circles-content">
          {children}
        </div>
      )}

      {/* Glow radial de cor */}
      <div className="bg-circles-glow" />
    </div>
  )
}
