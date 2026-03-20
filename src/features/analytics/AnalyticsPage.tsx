import { useMemo } from 'react'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { buildAnalyticsReport } from '../../core/domain/analytics'
import {
  differenceInDays,
  startOfWeekMonday,
  addDays,
  weekdayLabels,
  triggerColors,
  getMentalStateMeta,
  buildLinePath,
  buildAreaPath,
  formatTodayLabel,
} from './utils'

import { StreakSnapshot } from './sections/StreakSnapshot'
import { MoodMap } from './sections/MoodMap'
import { TriggerDonut } from './sections/TriggerDonut'
import { CravingChart } from './sections/CravingChart'
import { EvolutionScore } from './sections/EvolutionScore'
import { RelapseList } from './sections/RelapseList'
import { InsightsList } from './sections/InsightsList'

export function AnalyticsPage() {
  const { state, demoNow } = useAppState()

  const joinedReference =
    state.profile.joinedAt ?? state.profile.startDate ?? state.checkIns[0]?.createdAt ?? demoNow.toISOString()
  const totalPeriodDays = differenceInDays(new Date(joinedReference), demoNow)

  const report = buildAnalyticsReport({
    checkIns: state.checkIns,
    relapses: state.relapses,
    analytics: { ...state.analytics, selectedRangeDays: totalPeriodDays },
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

  // ── Weekly mood data ────────────────────────────────────────────────────────
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
      return { label, date, entry, meta: getMentalStateMeta(entry?.mentalState) }
    })
    return {
      start: weekStart,
      end: addDays(weekStart, 6),
      registeredCount: days.filter((d) => d.entry).length,
      days,
    }
  }, [demoNow, state.checkIns])

  // ── Donut data ──────────────────────────────────────────────────────────────
  const donutRadius = 72
  const donutCircumference = 2 * Math.PI * donutRadius
  const donutData = report.dominantTriggers.slice(0, 5).map((item, index) => ({
    ...item,
    color: triggerColors[index % triggerColors.length],
  }))
  const donutTotal = donutData.reduce((sum, item) => sum + item.count, 0)
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

  // ── Craving line chart ──────────────────────────────────────────────────────
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
      label: new Date(item.dayKey).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    }
  })
  const lineChart = {
    grid: [0, 2.5, 5, 7.5, 10].map((value) => ({ value, y: baseY - (value / 10) * chartHeight })),
    points: linePoints,
    linePath: buildLinePath(linePoints),
    areaPath: buildAreaPath(linePoints, baseY),
  }

  // ── Insights ────────────────────────────────────────────────────────────────
  const insights: Array<{ tone: 'trend' | 'alert'; text: string }> = []
  if (report.uniqueCheckInDays > 0) {
    insights.push({ tone: report.trendLabel === 'attention' ? 'alert' : 'trend', text: report.trendBody })
  }
  if (report.dominantTriggers[0]) {
    insights.push({ tone: 'trend', text: `O gatilho que mais aparece neste periodo e ${report.dominantTriggers[0].label.toLowerCase()}.` })
  }
  if (report.consistencyScore >= 70) {
    insights.push({ tone: 'trend', text: 'Sua consistencia recente esta forte. Isso ajuda a leitura do seu progresso ficar mais confiavel.' })
  } else if (report.uniqueCheckInDays > 0 && report.consistencyScore < 40) {
    insights.push({ tone: 'alert', text: 'Seu historico ainda esta irregular. Retomar o ritual diario pode melhorar sua leitura de padroes.' })
  }

  return (
    <AppShell title="" eyebrow="" hideTopbar>
      <section className="analytics-screen">
        <header className="analytics-header">
          <p className="analytics-header-subtitle">Sua evolucao</p>
          <h1>Analytics</h1>
          <span className="analytics-header-date">{formatTodayLabel(demoNow)}</span>
        </header>

        <StreakSnapshot
          streak={state.streak.current}
          totalPeriodDays={totalPeriodDays}
          periodCheckInsCount={report.periodCheckIns.length}
          periodRelapsesCount={report.periodRelapses.length}
          evolutionScore={evolutionScore}
          evolutionBody={evolutionBody}
          userFirstName={userFirstName}
          weeklyMoodDays={weeklyMoodData.days}
          motionDelay={0}
        />

        <MoodMap
          days={weeklyMoodData.days}
          weekStart={weeklyMoodData.start}
          weekEnd={weeklyMoodData.end}
          registeredCount={weeklyMoodData.registeredCount}
          dominantMentalStates={report.dominantMentalStates}
          motionDelay={0.1}
        />

        <TriggerDonut
          segments={donutSegments}
          total={donutTotal}
          radius={donutRadius}
          circumference={donutCircumference}
          motionDelay={0.2}
        />

        <CravingChart
          points={lineChart.points}
          width={width}
          height={height}
          baseY={baseY}
          grid={lineChart.grid}
          linePath={lineChart.linePath}
          areaPath={lineChart.areaPath}
          motionDelay={0.3}
        />

        <EvolutionScore
          evolutionScore={evolutionScore}
          evolutionTone={evolutionTone}
          evolutionBody={evolutionBody}
          motionDelay={0.4}
        />

        <RelapseList relapses={report.periodRelapses} motionDelay={0.4} />

        <InsightsList insights={insights} motionDelay={0.6} />
      </section>
    </AppShell>
  )
}
