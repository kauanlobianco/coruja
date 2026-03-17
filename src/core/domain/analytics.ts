import type { AnalyticsSnapshot, CheckInEntry, RelapseEntry } from './models'

interface AnalyticsBucket {
  key: string
  label: string
  count: number
}

export interface AnalyticsReport {
  periodDays: number
  periodCheckIns: CheckInEntry[]
  periodRelapses: RelapseEntry[]
  previousPeriodCheckIns: CheckInEntry[]
  previousPeriodRelapses: RelapseEntry[]
  uniqueCheckInDays: number
  previousUniqueCheckInDays: number
  averageCraving: number
  previousAverageCraving: number
  recoveryScore: number
  previousRecoveryScore: number
  cravingDelta: number
  recoveryDelta: number
  consistencyScore: number
  trendLabel: 'improving' | 'stable' | 'attention'
  trendHeadline: string
  trendBody: string
  lastCheckInAt: string | null
  recentCheckIns: CheckInEntry[]
  dominantMentalStates: AnalyticsBucket[]
  dominantTriggers: AnalyticsBucket[]
  cravingSeries: Array<{
    dayKey: string
    averageCraving: number
    count: number
  }>
}

function normalizeLabel(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

function buildBuckets(values: string[]) {
  const map = new Map<string, AnalyticsBucket>()

  for (const rawValue of values) {
    const label = normalizeLabel(rawValue)
    if (!label) {
      continue
    }

    const key = label.toLocaleLowerCase()
    const current = map.get(key)

    if (current) {
      current.count += 1
      continue
    }

    map.set(key, {
      key,
      label,
      count: 1,
    })
  }

  return [...map.values()].sort((left, right) => right.count - left.count)
}

function startOfDay(dateLike: string | Date) {
  const date = typeof dateLike === 'string' ? new Date(dateLike) : new Date(dateLike)
  date.setHours(0, 0, 0, 0)
  return date
}

function createPeriodStart(days: number, now = new Date()) {
  const periodStart = startOfDay(now)
  periodStart.setDate(periodStart.getDate() - (days - 1))
  return periodStart
}

function createPreviousPeriodStart(days: number, now = new Date()) {
  const start = createPeriodStart(days, now)
  start.setDate(start.getDate() - days)
  return start
}

function createPreviousPeriodEnd(days: number, now = new Date()) {
  const end = createPeriodStart(days, now)
  end.setMilliseconds(end.getMilliseconds() - 1)
  return end
}

function computeAverageCraving(checkIns: CheckInEntry[]) {
  const totalCraving = checkIns.reduce((sum, entry) => sum + entry.craving, 0)
  return checkIns.length > 0 ? totalCraving / checkIns.length : 0
}

function computeRecoveryScore(averageCraving: number, relapseCount: number) {
  const recoveryBase = 100 - averageCraving * 8 - relapseCount * 18
  return Math.max(0, Math.min(100, Math.round(recoveryBase)))
}

function roundDelta(value: number) {
  return Math.round(value * 10) / 10
}

function computeConsistencyScore(uniqueCheckInDays: number, periodDays: number) {
  if (periodDays <= 0) {
    return 0
  }

  return Math.max(0, Math.min(100, Math.round((uniqueCheckInDays / periodDays) * 100)))
}

function buildTrendCopy(input: {
  cravingDelta: number
  recoveryDelta: number
  averageCraving: number
  uniqueCheckInDays: number
  periodDays: number
}): Pick<AnalyticsReport, 'trendLabel' | 'trendHeadline' | 'trendBody'> {
  const isImproving = input.recoveryDelta >= 3 || input.cravingDelta <= -0.6
  const needsAttention = input.recoveryDelta <= -3 || input.cravingDelta >= 0.6

  if (input.uniqueCheckInDays === 0) {
    return {
      trendLabel: 'stable',
      trendHeadline: 'Seu historico ainda esta comecando',
      trendBody: 'Assim que seus check-ins entrarem, esta tela vai comparar periodos e mostrar sua evolucao.',
    }
  }

  if (isImproving) {
    return {
      trendLabel: 'improving',
      trendHeadline: 'Voce esta melhor que no periodo anterior',
      trendBody:
        input.averageCraving <= 4
          ? 'Sua fissura media caiu e a rotina recente parece mais estavel.'
          : 'Mesmo com vulnerabilidade presente, o periodo atual ja mostra melhora objetiva.',
    }
  }

  if (needsAttention) {
    return {
      trendLabel: 'attention',
      trendHeadline: 'Seu historico pede mais protecao agora',
      trendBody:
        input.uniqueCheckInDays < Math.max(3, Math.ceil(input.periodDays / 3))
          ? 'A consistencia caiu e isso reduz a leitura do progresso. Vale retomar o ritual diario.'
          : 'A fissura media subiu em relacao ao periodo anterior. Este e um bom momento para check-in, SOS e bloqueador.',
    }
  }

  return {
    trendLabel: 'stable',
    trendHeadline: 'Seu ritmo esta estavel',
    trendBody: 'O periodo atual esta proximo do anterior. Pequenas repeticoes consistentes devem gerar a proxima melhora.',
  }
}

export function buildAnalyticsReport(input: {
  checkIns: CheckInEntry[]
  relapses: RelapseEntry[]
  analytics: AnalyticsSnapshot
  now?: Date
}): AnalyticsReport {
  const now = input.now ?? new Date()
  const periodDays = input.analytics.selectedRangeDays
  const periodStart = createPeriodStart(periodDays, now)
  const previousPeriodStart = createPreviousPeriodStart(periodDays, now)
  const previousPeriodEnd = createPreviousPeriodEnd(periodDays, now)

  const periodCheckIns = input.checkIns.filter(
    (entry) => new Date(entry.createdAt).getTime() >= periodStart.getTime(),
  )

  const previousPeriodCheckIns = input.checkIns.filter((entry) => {
    const createdAt = new Date(entry.createdAt).getTime()
    return createdAt >= previousPeriodStart.getTime() && createdAt <= previousPeriodEnd.getTime()
  })

  const periodRelapses = input.relapses.filter(
    (entry) => new Date(entry.createdAt).getTime() >= periodStart.getTime(),
  )

  const previousPeriodRelapses = input.relapses.filter((entry) => {
    const createdAt = new Date(entry.createdAt).getTime()
    return createdAt >= previousPeriodStart.getTime() && createdAt <= previousPeriodEnd.getTime()
  })

  const uniqueCheckInDays = new Set(
    periodCheckIns.map((entry) => startOfDay(entry.createdAt).toISOString()),
  ).size

  const previousUniqueCheckInDays = new Set(
    previousPeriodCheckIns.map((entry) => startOfDay(entry.createdAt).toISOString()),
  ).size

  const averageCraving = computeAverageCraving(periodCheckIns)
  const previousAverageCraving = computeAverageCraving(previousPeriodCheckIns)
  const recoveryScore = computeRecoveryScore(averageCraving, periodRelapses.length)
  const previousRecoveryScore = computeRecoveryScore(
    previousAverageCraving,
    previousPeriodRelapses.length,
  )
  const cravingDelta = roundDelta(previousAverageCraving - averageCraving)
  const recoveryDelta = recoveryScore - previousRecoveryScore
  const consistencyScore = computeConsistencyScore(uniqueCheckInDays, periodDays)

  const trendCopy = buildTrendCopy({
    cravingDelta,
    recoveryDelta,
    averageCraving,
    uniqueCheckInDays,
    periodDays,
  })

  const dominantMentalStates = buildBuckets(periodCheckIns.map((entry) => entry.mentalState))
  const dominantTriggers = buildBuckets(periodCheckIns.flatMap((entry) => entry.triggers))

  const cravingByDay = new Map<
    string,
    {
      dayKey: string
      total: number
      count: number
    }
  >()

  for (const entry of periodCheckIns) {
    const dayKey = startOfDay(entry.createdAt).toISOString()
    const current = cravingByDay.get(dayKey)

    if (current) {
      current.total += entry.craving
      current.count += 1
      continue
    }

    cravingByDay.set(dayKey, {
      dayKey,
      total: entry.craving,
      count: 1,
    })
  }

  const cravingSeries = [...cravingByDay.values()]
    .sort((left, right) => Date.parse(left.dayKey) - Date.parse(right.dayKey))
    .map((item) => ({
      dayKey: item.dayKey,
      averageCraving: item.total / item.count,
      count: item.count,
    }))

  const recentCheckIns = [...periodCheckIns]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, 6)

  return {
    periodDays,
    periodCheckIns,
    periodRelapses,
    previousPeriodCheckIns,
    previousPeriodRelapses,
    uniqueCheckInDays,
    previousUniqueCheckInDays,
    averageCraving,
    previousAverageCraving,
    recoveryScore,
    previousRecoveryScore,
    cravingDelta,
    recoveryDelta,
    consistencyScore,
    trendLabel: trendCopy.trendLabel,
    trendHeadline: trendCopy.trendHeadline,
    trendBody: trendCopy.trendBody,
    lastCheckInAt: periodCheckIns.at(-1)?.createdAt ?? null,
    recentCheckIns,
    dominantMentalStates,
    dominantTriggers,
    cravingSeries,
  }
}
