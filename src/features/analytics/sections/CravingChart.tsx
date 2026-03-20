import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buildLinePath, buildAreaPath } from '../utils'

interface CravingPoint {
  dayKey: string
  averageCraving: number
  x: number
  y: number
  label: string
}

interface CravingChartProps {
  points: CravingPoint[]
  width: number
  height: number
  baseY: number
  grid: Array<{ value: number; y: number }>
  linePath: string
  areaPath: string
  motionDelay: number
}

export function CravingChart({
  points,
  width,
  height,
  baseY,
  grid,
  linePath,
  areaPath,
  motionDelay,
}: CravingChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  return (
    <motion.section
      className="analytics-block"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: motionDelay }}
    >
      <div className="analytics-block-label">Evolucao</div>
      <article className="analytics-surface">
        <div className="analytics-surface-head">
          <div>
            <h2 className="analytics-surface-title">Evolucao da vontade</h2>
            <p className="analytics-surface-description">
              Media de vontade registrada ao longo de todo o seu historico.
            </p>
          </div>
          <span className="analytics-surface-meta">periodo completo</span>
        </div>
        {points.length === 0 ? (
          <div className="empty-state analytics-empty-state">
            <BarChart3 size={28} />
            <p>Faca alguns check-ins para liberar a curva da sua evolucao.</p>
            <Link className="button button-primary shimmer" to="/check-in">
              Fazer check-in
            </Link>
          </div>
        ) : (
          <div className="analytics-line-chart-shell">
            <svg viewBox={`0 0 ${width} ${height}`} className="analytics-line-chart">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2BB5C4" />
                  <stop offset="100%" stopColor="#7C5CBF" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2BB5C4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2BB5C4" stopOpacity="0" />
                </linearGradient>
              </defs>

              {grid.map((item) => (
                <line
                  key={item.value}
                  x1="0"
                  x2={width}
                  y1={item.y}
                  y2={item.y}
                  className="analytics-line-grid"
                />
              ))}

              <path d={areaPath} fill="url(#areaGrad)" />
              <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="3.5" />

              {points.map((point, index) => (
                <circle
                  key={point.dayKey}
                  cx={point.x}
                  cy={point.y}
                  r={hoveredPoint === index ? 5 : 3}
                  fill="#4455CC"
                  className="analytics-line-point"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </svg>

            <div className="analytics-line-axis">
              {points.map((point) => (
                <span key={point.dayKey}>{point.label}</span>
              ))}
            </div>

            <AnimatePresence>
              {hoveredPoint !== null ? (
                <motion.div
                  className="analytics-line-tooltip"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                >
                  <strong>{points[hoveredPoint].averageCraving.toFixed(1)}/10</strong>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </article>
    </motion.section>
  )
}

// Re-export helpers so orchestrator can build the chart data
export { buildLinePath, buildAreaPath }
export type { CravingPoint }
