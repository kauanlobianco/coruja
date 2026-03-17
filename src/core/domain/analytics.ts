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
  uniqueCheckInDays: number
  averageCraving: number
  recoveryScore: number
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

export function buildAnalyticsReport(input: {
  checkIns: CheckInEntry[]
  relapses: RelapseEntry[]
  analytics: AnalyticsSnapshot
  now?: Date
}): AnalyticsReport {
  const now = input.now ?? new Date()
  const periodDays = input.analytics.selectedRangeDays
  const periodStart = createPeriodStart(periodDays, now)

  const periodCheckIns = input.checkIns.filter(
    (entry) => new Date(entry.createdAt).getTime() >= periodStart.getTime(),
  )

  const periodRelapses = input.relapses.filter(
    (entry) => new Date(entry.createdAt).getTime() >= periodStart.getTime(),
  )

  const uniqueCheckInDays = new Set(
    periodCheckIns.map((entry) => startOfDay(entry.createdAt).toISOString()),
  ).size

  const totalCraving = periodCheckIns.reduce((sum, entry) => sum + entry.craving, 0)
  const averageCraving = periodCheckIns.length > 0 ? totalCraving / periodCheckIns.length : 0

  const recoveryBase = 100 - averageCraving * 8 - periodRelapses.length * 18
  const recoveryScore = Math.max(0, Math.min(100, Math.round(recoveryBase)))

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

  return {
    periodDays,
    periodCheckIns,
    periodRelapses,
    uniqueCheckInDays,
    averageCraving,
    recoveryScore,
    dominantMentalStates,
    dominantTriggers,
    cravingSeries,
  }
}
