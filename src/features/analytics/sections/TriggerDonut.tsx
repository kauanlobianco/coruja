import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PieChart } from 'lucide-react'

interface DonutSegment {
  key: string
  label: string
  count: number
  color: string
  fraction: number
  strokeDasharray: string
  strokeDashoffset: number
}

interface TriggerDonutProps {
  segments: DonutSegment[]
  total: number
  radius: number
  circumference: number
  motionDelay: number
}

export function TriggerDonut({ segments, total, radius, circumference: _circumference, motionDelay }: TriggerDonutProps) {
  const [hoveredTrigger, setHoveredTrigger] = useState<number | null>(null)

  return (
    <motion.section
      className="analytics-block"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: motionDelay }}
    >
      <div className="analytics-block-label">Distribuicao de gatilhos</div>
      <article className="analytics-surface">
        <h2 className="analytics-surface-title">Distribuicao de Gatilhos</h2>
        {segments.length === 0 ? (
          <div className="empty-state analytics-empty-state">
            <PieChart size={28} />
            <p>Registre check-ins para ver seus padroes</p>
          </div>
        ) : (
          <div className="analytics-donut-layout">
            <div className="analytics-donut-shell">
              <svg viewBox="0 0 200 200" className="analytics-donut-svg" aria-hidden="true">
                <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="22" />
                {segments.map((segment, index) => {
                  const hovered = hoveredTrigger === index
                  const faded = hoveredTrigger !== null && hoveredTrigger !== index

                  return (
                    <motion.circle
                      key={segment.key}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth={hovered ? 26 : 22}
                      strokeLinecap="round"
                      strokeDasharray={segment.strokeDasharray}
                      strokeDashoffset={segment.strokeDashoffset}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: faded ? 0.35 : 1 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      style={{
                        filter: hovered ? `drop-shadow(0 0 10px ${segment.color}99)` : 'none',
                        transformOrigin: 'center',
                        transform: 'rotate(-90deg)',
                        transition: 'opacity 0.4s ease, stroke-width 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => setHoveredTrigger(index)}
                      onMouseLeave={() => setHoveredTrigger(null)}
                    />
                  )
                })}
              </svg>

              <div className="analytics-donut-center">
                <AnimatePresence mode="wait">
                  {hoveredTrigger !== null ? (
                    <motion.div
                      key={segments[hoveredTrigger].key}
                      className="analytics-donut-center-copy"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                    >
                      <strong style={{ color: segments[hoveredTrigger].color }}>
                        {segments[hoveredTrigger].count}
                      </strong>
                      <span>{segments[hoveredTrigger].label}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="all"
                      className="analytics-donut-center-copy"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                    >
                      <strong>{total}</strong>
                      <span>registros</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="analytics-donut-legend">
              {segments.map((segment, index) => {
                const percentage = total > 0 ? Math.round(segment.fraction * 100) : 0
                return (
                  <button
                    key={segment.key}
                    type="button"
                    className={
                      hoveredTrigger === index
                        ? 'analytics-donut-legend-item analytics-donut-legend-item-active'
                        : 'analytics-donut-legend-item'
                    }
                    onMouseEnter={() => setHoveredTrigger(index)}
                    onMouseLeave={() => setHoveredTrigger(null)}
                    onFocus={() => setHoveredTrigger(index)}
                    onBlur={() => setHoveredTrigger(null)}
                  >
                    <span className="analytics-donut-swatch" style={{ background: segment.color }} />
                    <span className="analytics-donut-legend-label">{segment.label}</span>
                    <strong>{percentage}%</strong>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </article>
    </motion.section>
  )
}

// Export the computed type so the orchestrator can use it
export type { DonutSegment }
