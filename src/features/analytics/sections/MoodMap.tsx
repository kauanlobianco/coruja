import { motion } from 'framer-motion'
import { getMentalStateMeta, formatShortDate } from '../utils'

interface MoodDay {
  label: string
  entry: { mentalState?: string | null; craving?: number } | null
  meta: ReturnType<typeof getMentalStateMeta>
}

interface MoodMapProps {
  days: MoodDay[]
  weekStart: Date
  weekEnd: Date
  registeredCount: number
  dominantMentalStates: Array<{ key: string; label: string; count: number }>
  motionDelay: number
}

export function MoodMap({
  days,
  weekStart,
  weekEnd,
  registeredCount,
  dominantMentalStates,
  motionDelay,
}: MoodMapProps) {
  const maxCount = dominantMentalStates[0]?.count ?? 1

  return (
    <motion.section
      className="analytics-block"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: motionDelay }}
    >
      <div className="analytics-block-label">Estado mental</div>
      <article className="analytics-surface">
        <div className="analytics-mini-head">
          <div className="analytics-mini-title">
            <span className="analytics-mini-dot" />
            <strong>Mapa emocional</strong>
          </div>
          <span className="analytics-mini-range">
            {formatShortDate(weekStart)} - {formatShortDate(weekEnd)}
          </span>
        </div>

        <div className="analytics-mood-week">
          {days.map((item) => (
            <article key={item.label} className="analytics-mood-day">
              <span className="analytics-mood-day-label">{item.label}</span>
              <div
                className="analytics-mood-emoji-shell"
                style={{
                  color: item.meta.tone,
                  background: item.entry ? `${item.meta.tone}1A` : 'rgba(255,255,255,0.04)',
                }}
              >
                <span className="analytics-mood-emoji">{item.meta.emoji}</span>
              </div>
              <strong className="analytics-mood-state">{item.meta.label}</strong>
              <span className="analytics-mood-craving">
                {item.entry ? `vontade ${item.entry.craving}/10` : 'sem check-in'}
              </span>
            </article>
          ))}
        </div>

        <div className="analytics-mental-bars">
          {dominantMentalStates.length === 0 ? (
            <div className="empty-state analytics-empty-state analytics-inline-empty">
              <p>Registre check-ins para ver como seu estado mental vem aparecendo.</p>
            </div>
          ) : (
            dominantMentalStates.slice(0, 5).map((item) => {
              const meta = getMentalStateMeta(item.label)
              const barWidth = (item.count / maxCount) * 100

              return (
                <div key={item.key} className="analytics-mental-bar-item">
                  <div className="analytics-mental-bar-head">
                    <span className="analytics-mental-bar-label">
                      <span>{meta.emoji}</span>
                      {item.label}
                    </span>
                    <strong>{item.count}</strong>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill analytics-mental-bar-fill"
                      style={{ width: `${barWidth}%`, background: meta.tone }}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="analytics-week-footer">
          <strong>{registeredCount}</strong>
          <span>dias com leitura emocional</span>
        </div>
      </article>
    </motion.section>
  )
}
