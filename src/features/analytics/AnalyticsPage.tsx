import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  BarChart3,
  Flame,
  PieChart,
  TrendingUp,
} from 'lucide-react'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { buildAnalyticsReport } from '../../core/domain/analytics'

const weekdayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
const triggerColors = ['#7C5CBF', '#EC9731', '#C44B4B', '#3DAA7D', '#4455CC']

function formatTodayLabel(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(value)
}

function formatShortDate(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
  }).format(value)
}

function startOfWeekMonday(value: Date) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  return date
}

function addDays(value: Date, amount: number) {
  const next = new Date(value)
  next.setDate(next.getDate() + amount)
  return next
}

function differenceInDays(from: Date, to: Date) {
  const start = new Date(from)
  const end = new Date(to)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000) + 1)
}

function buildLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return ''
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`
  }

  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
}

function buildAreaPath(points: Array<{ x: number; y: number }>, baseY: number) {
  if (points.length === 0) {
    return ''
  }

  const line = buildLinePath(points)
  const first = points[0]
  const last = points[points.length - 1]
  return `${line} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`
}

function getMentalStateMeta(value: string | null | undefined) {
  const normalized = value?.toLowerCase() ?? ''

  if (normalized.includes('ans')) {
    return { emoji: '😞', tone: '#C44B4B', label: 'Muito mal' }
  }

  if (normalized.includes('cans') || normalized.includes('triste')) {
    return { emoji: '😔', tone: '#E07428', label: 'Cansado' }
  }

  if (normalized.includes('calmo') || normalized.includes('neutro')) {
    return { emoji: '😐', tone: '#EC9731', label: 'Neutro' }
  }

  if (normalized.includes('bem')) {
    return { emoji: '🙂', tone: '#5EBD8A', label: 'Bem' }
  }

  if (normalized.includes('tranquilo')) {
    return { emoji: '😌', tone: '#3DAA7D', label: 'Tranquilo' }
  }

  return { emoji: '•', tone: 'rgba(255,255,255,0.18)', label: 'Sem registro' }
}

export function AnalyticsPage() {
  const { state, demoNow } = useAppState()
  const navigate = useNavigate()
  const [hoveredTrigger, setHoveredTrigger] = useState<number | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const joinedReference =
    state.profile.joinedAt ?? state.profile.startDate ?? state.checkIns[0]?.createdAt ?? demoNow.toISOString()
  const totalPeriodDays = differenceInDays(new Date(joinedReference), demoNow)

  const report = buildAnalyticsReport({
    checkIns: state.checkIns,
    relapses: state.relapses,
    analytics: {
      ...state.analytics,
      selectedRangeDays: totalPeriodDays,
    },
    now: demoNow,
  })

  const evolutionScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        state.streak.current * 3 +
          report.consistencyScore * 0.35 +
          report.recoveryScore * 0.45 -
          report.periodRelapses.length * 10 -
          report.averageCraving * 4,
      ),
    ),
  )
  const evolutionTone =
    evolutionScore >= 75 ? 'forte' : evolutionScore >= 50 ? 'consistente' : 'em construcao'
  const evolutionBody =
    evolutionScore >= 75
      ? 'Seu historico recente combina consistencia, menos recaidas e uma vontade mais sob controle.'
      : evolutionScore >= 50
        ? 'Sua evolucao esta acontecendo. Manter o ritual diario deve fortalecer esse movimento.'
        : 'Seu painel ainda mostra oscilacao. Pequenas repeticoes consistentes devem melhorar esse score.'

  const userFirstName = (state.profile.name || 'Você').trim().split(/\s+/)[0]
  const periodCheckInsCount = report.periodCheckIns.length
  const periodRelapsesCount = report.periodRelapses.length

  const weeklyMoodData = useMemo(() => {
    const weekStart = startOfWeekMonday(demoNow)
    const days = weekdayLabels.map((label, index) => {
      const date = addDays(weekStart, index)
      date.setHours(0, 0, 0, 0)
      const dayKey = date.toISOString()
      const entries = state.checkIns
        .filter((entry) => {
          const entryDate = new Date(entry.createdAt)
          entryDate.setHours(0, 0, 0, 0)
          return entryDate.toISOString() === dayKey
        })
        .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
      const entry = entries[0] ?? null
      const meta = getMentalStateMeta(entry?.mentalState)

      return {
        label,
        date,
        entry,
        meta,
      }
    })

    return {
      start: weekStart,
      end: addDays(weekStart, 6),
      registeredCount: days.filter((item) => item.entry).length,
      days,
    }
  }, [demoNow, state.checkIns])

  const donutData = report.dominantTriggers.slice(0, 5).map((item, index) => ({
    ...item,
    color: triggerColors[index % triggerColors.length],
  }))
  const donutTotal = donutData.reduce((sum, item) => sum + item.count, 0)
  const donutRadius = 72
  const donutCircumference = 2 * Math.PI * donutRadius
  const donutSegments = donutData.reduce<
    Array<{
      key: string
      label: string
      count: number
      color: string
      fraction: number
      strokeDasharray: string
      strokeDashoffset: number
    }>
  >((segments, item) => {
    const previousLength = segments.reduce((sum, segment) => {
      const [length] = segment.strokeDasharray.split(' ')
      return sum + Number(length)
    }, 0)
    const fraction = donutTotal > 0 ? item.count / donutTotal : 0
    const length = donutCircumference * fraction

    segments.push({
      ...item,
      fraction,
      strokeDasharray: `${length} ${donutCircumference - length}`,
      strokeDashoffset: -(donutCircumference * 0.25 + previousLength),
    })

    return segments
  }, [])

  const width = 320
  const height = 180
  const paddingX = 12
  const paddingTop = 14
  const paddingBottom = 24
  const baseY = height - paddingBottom
  const chartWidth = width - paddingX * 2
  const chartHeight = baseY - paddingTop
  const linePoints = report.cravingSeries.map((item, index, list) => {
    const x =
      list.length === 1 ? width / 2 : paddingX + (chartWidth * index) / Math.max(1, list.length - 1)
    const y = baseY - (item.averageCraving / 10) * chartHeight
    return {
      ...item,
      x,
      y,
      label: new Date(item.dayKey).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
    }
  })
  const lineChart = {
    width,
    height,
    baseY,
    grid: [0, 2.5, 5, 7.5, 10].map((value) => ({
      value,
      y: baseY - (value / 10) * chartHeight,
    })),
    points: linePoints,
    linePath: buildLinePath(linePoints),
    areaPath: buildAreaPath(linePoints, baseY),
  }

  const insights: Array<{ tone: 'trend' | 'alert'; text: string }> = []

  if (report.uniqueCheckInDays > 0) {
    insights.push({
      tone: report.trendLabel === 'attention' ? 'alert' : 'trend',
      text: report.trendBody,
    })
  }

  if (report.dominantTriggers[0]) {
    insights.push({
      tone: 'trend',
      text: `O gatilho que mais aparece neste periodo e ${report.dominantTriggers[0].label.toLowerCase()}.`,
    })
  }

  if (report.consistencyScore >= 70) {
    insights.push({
      tone: 'trend',
      text: 'Sua consistencia recente esta forte. Isso ajuda a leitura do seu progresso ficar mais confiavel.',
    })
  } else if (report.uniqueCheckInDays > 0 && report.consistencyScore < 40) {
    insights.push({
      tone: 'alert',
      text: 'Seu historico ainda esta irregular. Retomar o ritual diario pode melhorar sua leitura de padroes.',
    })
  }

  const motionTransition = (index: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const, delay: index * 0.1 },
  })

  return (
    <AppShell title="" eyebrow="" hideTopbar>
      <section className="analytics-screen">
        <header className="analytics-header">
          <p className="analytics-header-subtitle">Sua evolucao</p>
          <h1>Analytics</h1>
          <span className="analytics-header-date">{formatTodayLabel(demoNow)}</span>
        </header>

        <motion.section className="analytics-streak-snapshot" {...motionTransition(0)}>
          <article className="analytics-snapshot-hero">
            <div className="analytics-snapshot-hero-top">
              <div className="analytics-snapshot-streak">
                <div className="analytics-snapshot-streak-icon" aria-hidden="true">
                  <Flame size={18} strokeWidth={2.2} />
                </div>
                <div className="analytics-snapshot-streak-number">{state.streak.current}</div>
                <div className="analytics-snapshot-streak-label">Sequência diária</div>
                <button
                  type="button"
                  className="analytics-relapse-quick"
                  onClick={() => navigate('/relapse')}
                >
                  Registrar recaída &gt;
                </button>
              </div>

              <div className="analytics-snapshot-hero-copy">
                <div className="analytics-snapshot-hero-copy-title">
                  {evolutionScore >= 75
                    ? 'Mais clareza mental'
                    : evolutionScore >= 50
                      ? 'Mais consistência'
                      : 'Em construção'}
                </div>
                <div className="analytics-snapshot-hero-copy-body">
                  {evolutionBody.replace(/^Seu\s+/i, `${userFirstName}, `)}
                </div>
              </div>
            </div>

            <div className="analytics-snapshot-calendar">
              <div className="analytics-snapshot-calendar-days">
                {weeklyMoodData.days.map((d) => (
                  <div key={d.label} className="analytics-snapshot-day">
                    <span className="analytics-snapshot-day-label">{d.label}</span>
                    <span
                      className={
                        d.entry
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
                  <div className="analytics-snapshot-stat-label">Dias desde o onboarding</div>
                </div>
                <div className="analytics-snapshot-divider" aria-hidden="true" />
                <div className="analytics-snapshot-stat">
                  <div className="analytics-snapshot-stat-value">{periodCheckInsCount}</div>
                  <div className="analytics-snapshot-stat-label">Check-ins</div>
                </div>
                <div className="analytics-snapshot-divider" aria-hidden="true" />
                <div className="analytics-snapshot-stat">
                  <div className="analytics-snapshot-stat-value">{periodRelapsesCount}</div>
                  <div className="analytics-snapshot-stat-label">Recaídas no período</div>
                </div>
                <div className="analytics-snapshot-divider" aria-hidden="true" />
                <div className="analytics-snapshot-stat">
                  <div className="analytics-snapshot-stat-value">{evolutionScore}</div>
                  <div className="analytics-snapshot-stat-label">Score de evolução</div>
                </div>
              </div>
            </div>
          </article>
        </motion.section>

        <motion.section className="analytics-block" {...motionTransition(1)}>
          <div className="analytics-block-label">Estado mental</div>
          <article className="analytics-surface">
            <div className="analytics-mini-head">
              <div className="analytics-mini-title">
                <span className="analytics-mini-dot" />
                <strong>Mapa emocional</strong>
              </div>
              <span className="analytics-mini-range">
                {formatShortDate(weeklyMoodData.start)} - {formatShortDate(weeklyMoodData.end)}
              </span>
            </div>

            <div className="analytics-mood-week">
              {weeklyMoodData.days.map((item) => (
                <article key={item.label} className="analytics-mood-day">
                  <span className="analytics-mood-day-label">{item.label}</span>
                  <div
                    className="analytics-mood-emoji-shell"
                    style={{
                      color: item.meta.tone,
                      background: item.entry
                        ? `${item.meta.tone}1A`
                        : 'rgba(255,255,255,0.04)',
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
              {report.dominantMentalStates.length === 0 ? (
                <div className="empty-state analytics-empty-state analytics-inline-empty">
                  <p>Registre check-ins para ver como seu estado mental vem aparecendo.</p>
                </div>
              ) : (
                report.dominantMentalStates.slice(0, 5).map((item) => {
                  const meta = getMentalStateMeta(item.label)
                  const width = (item.count / report.dominantMentalStates[0].count) * 100

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
                          style={{ width: `${width}%`, background: meta.tone }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="analytics-week-footer">
              <strong>{weeklyMoodData.registeredCount}</strong>
              <span>dias com leitura emocional</span>
            </div>
          </article>
        </motion.section>

        <motion.section className="analytics-block" {...motionTransition(2)}>
          <div className="analytics-block-label">Distribuicao de gatilhos</div>
          <article className="analytics-surface">
            <h2 className="analytics-surface-title">Distribuicao de Gatilhos</h2>
            {donutData.length === 0 ? (
              <div className="empty-state analytics-empty-state">
                <PieChart size={28} />
                <p>Registre check-ins para ver seus padroes</p>
              </div>
            ) : (
              <div className="analytics-donut-layout">
                <div className="analytics-donut-shell">
                  <svg viewBox="0 0 200 200" className="analytics-donut-svg" aria-hidden="true">
                    <circle
                      cx="100"
                      cy="100"
                      r={donutRadius}
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="22"
                    />
                    {donutSegments.map((segment, index) => {
                      const hovered = hoveredTrigger === index
                      const faded = hoveredTrigger !== null && hoveredTrigger !== index

                      return (
                        <motion.circle
                          key={segment.key}
                          cx="100"
                          cy="100"
                          r={donutRadius}
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
                          key={donutSegments[hoveredTrigger].key}
                          className="analytics-donut-center-copy"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                        >
                          <strong style={{ color: donutSegments[hoveredTrigger].color }}>
                            {donutSegments[hoveredTrigger].count}
                          </strong>
                          <span>{donutSegments[hoveredTrigger].label}</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="all"
                          className="analytics-donut-center-copy"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                        >
                          <strong>{donutTotal}</strong>
                          <span>registros</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="analytics-donut-legend">
                  {donutSegments.map((segment, index) => {
                    const percentage = donutTotal > 0 ? Math.round(segment.fraction * 100) : 0
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

        <motion.section className="analytics-block" {...motionTransition(3)}>
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
            {lineChart.points.length === 0 ? (
              <div className="empty-state analytics-empty-state">
                <BarChart3 size={28} />
                <p>Faca alguns check-ins para liberar a curva da sua evolucao.</p>
                <Link className="button button-primary shimmer" to="/check-in">
                  Fazer check-in
                </Link>
              </div>
            ) : (
              <div className="analytics-line-chart-shell">
                <svg viewBox={`0 0 ${lineChart.width} ${lineChart.height}`} className="analytics-line-chart">
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

                  {lineChart.grid.map((item) => (
                    <line
                      key={item.value}
                      x1="0"
                      x2={lineChart.width}
                      y1={item.y}
                      y2={item.y}
                      className="analytics-line-grid"
                    />
                  ))}

                  <path d={lineChart.areaPath} fill="url(#areaGrad)" />
                  <path d={lineChart.linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="3.5" />

                  {lineChart.points.map((point, index) => (
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
                  {lineChart.points.map((point) => (
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
                      <strong>{lineChart.points[hoveredPoint].averageCraving.toFixed(1)}/10</strong>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )}
          </article>
        </motion.section>

        <motion.section className="analytics-block" {...motionTransition(4)}>
          <div className="analytics-block-label">Score de evolucao</div>
          <article className="analytics-surface analytics-score-card">
            <div className="analytics-score-head">
              <div>
                <h2 className="analytics-surface-title">Seu score hoje</h2>
                <p className="analytics-surface-description">
                  Leitura simples baseada em streak, consistencia, recaidas e media de vontade.
                </p>
              </div>
              <div className="analytics-score-value">
                <strong>{evolutionScore}</strong>
                <span>/100</span>
              </div>
            </div>
            <div className="analytics-score-bar">
              <div
                className="analytics-score-fill"
                style={{ width: `${evolutionScore}%` }}
              />
            </div>
            <div className="analytics-score-copy">
              <strong>{evolutionTone}</strong>
              <p>{evolutionBody}</p>
            </div>
          </article>
        </motion.section>

        <motion.section className="analytics-block" {...motionTransition(4)}>
          <div className="analytics-block-label">Recaidas</div>
          <article className="analytics-surface">
            <div className="analytics-surface-head">
              <h2 className="analytics-surface-title">Ultimos registros de recaida</h2>
              <span className="analytics-surface-meta">{report.periodRelapses.length} no periodo</span>
            </div>
            {report.periodRelapses.length === 0 ? (
              <div className="empty-state analytics-empty-state analytics-inline-empty">
                <p>Nenhuma recaida registrada no periodo selecionado.</p>
              </div>
            ) : (
              <div className="analytics-relapse-list">
                {report.periodRelapses
                  .slice()
                  .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
                  .slice(0, 4)
                  .map((entry) => (
                    <article key={entry.id} className="analytics-relapse-item">
                      <div className="analytics-relapse-head">
                        <strong>
                          {new Intl.DateTimeFormat('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          }).format(new Date(entry.createdAt))}
                        </strong>
                        <span>streak anterior: {entry.previousStreak} dias</span>
                      </div>
                      <p>{entry.cause || 'Sem causa registrada.'}</p>
                    </article>
                  ))}
              </div>
            )}
          </article>
        </motion.section>

        {insights.length > 0 ? (
          <motion.section className="analytics-block" {...motionTransition(6)}>
            <div className="analytics-block-label">Insights</div>
            <div className="analytics-insights">
              {insights.slice(0, 3).map((insight, index) => {
                const Icon = insight.tone === 'alert' ? AlertCircle : TrendingUp

                return (
                  <article key={`${insight.text}-${index}`} className="insight-card">
                    <Icon size={18} />
                    <p>{insight.text}</p>
                  </article>
                )
              })}
            </div>
          </motion.section>
        ) : null}
      </section>
    </AppShell>
  )
}
