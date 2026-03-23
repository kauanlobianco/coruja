import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { AnalyticsReport } from '../../../core/domain/analytics'

interface WeekDay {
  label: string
  entry: { mentalState?: string | null; craving?: number } | null
}

interface StreakSnapshotProps {
  streak: number
  totalPeriodDays: number
  periodCheckInsCount: number
  periodRelapsesCount: number
  evolutionScore: number
  evolutionBody: string
  userFirstName: string
  weeklyMoodDays: WeekDay[]
  motionDelay: number
}

export function StreakSnapshot({
  streak,
  totalPeriodDays,
  periodCheckInsCount,
  periodRelapsesCount,
  evolutionScore,
  evolutionBody,
  userFirstName,
  weeklyMoodDays,
  motionDelay,
}: StreakSnapshotProps) {
  const navigate = useNavigate()

  const snapshotTitle =
    evolutionScore >= 75
      ? 'Mais clareza mental'
      : evolutionScore >= 50
        ? 'Mais consistencia'
        : 'Em construcao'

  return (
    <motion.section
      className="analytics-streak-snapshot"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: motionDelay }}
    >
      <article className="analytics-snapshot-hero">
        <div className="analytics-snapshot-hero-top">
          <div className="analytics-snapshot-streak">
            <div className="analytics-snapshot-streak-icon" aria-hidden="true">
              <Flame size={18} strokeWidth={2.2} />
            </div>
            <div className="analytics-snapshot-streak-number">{streak}</div>
            <div className="analytics-snapshot-streak-label">Sequencia atual</div>
          </div>

          <div className="analytics-snapshot-hero-copy">
            <div className="analytics-snapshot-kicker">Visao geral</div>
            <div className="analytics-snapshot-hero-copy-title">{snapshotTitle}</div>
            <div className="analytics-snapshot-hero-copy-body">
              {evolutionBody.replace(/^Seu\s+/i, `${userFirstName}, `)}
            </div>
            <button
              type="button"
              className="analytics-relapse-quick"
              onClick={() => navigate('/relapse')}
            >
              Registrar recaida &gt;
            </button>
          </div>
        </div>

        <div className="analytics-snapshot-calendar">
          <div className="analytics-snapshot-calendar-head">Atividade da semana</div>
          <div className="analytics-snapshot-calendar-days">
            {weeklyMoodDays.map((day) => (
              <div key={day.label} className="analytics-snapshot-day">
                <span className="analytics-snapshot-day-label">{day.label}</span>
                <span
                  className={
                    day.entry
                      ? 'analytics-snapshot-day-icon analytics-snapshot-day-icon-active'
                      : 'analytics-snapshot-day-icon analytics-snapshot-day-icon-inactive'
                  }
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-snapshot-card">
          <div className="analytics-snapshot-card-head">Seu resumo</div>
          <div className="analytics-snapshot-stats">
            <div className="analytics-snapshot-stat">
              <div className="analytics-snapshot-stat-value">{totalPeriodDays}</div>
              <div className="analytics-snapshot-stat-label">Dias de jornada</div>
            </div>
            <div className="analytics-snapshot-stat">
              <div className="analytics-snapshot-stat-value">{periodCheckInsCount}</div>
              <div className="analytics-snapshot-stat-label">Check-ins</div>
            </div>
            <div className="analytics-snapshot-stat">
              <div className="analytics-snapshot-stat-value">{periodRelapsesCount}</div>
              <div className="analytics-snapshot-stat-label">Recaidas</div>
            </div>
            <div className="analytics-snapshot-stat">
              <div className="analytics-snapshot-stat-value">{evolutionScore}</div>
              <div className="analytics-snapshot-stat-label">Score atual</div>
            </div>
          </div>
        </div>
      </article>
    </motion.section>
  )
}

export type { AnalyticsReport }
