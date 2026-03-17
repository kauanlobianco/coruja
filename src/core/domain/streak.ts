import type { AppModel } from './models'

export function getCurrentStreakFromStartDate(startDate: string | null, now = new Date()) {
  if (!startDate) {
    return 0
  }

  const start = new Date(startDate)
  if (Number.isNaN(start.getTime())) {
    return 0
  }

  const from = new Date(start)
  const to = new Date(now)
  from.setHours(0, 0, 0, 0)
  to.setHours(0, 0, 0, 0)

  const diffMs = to.getTime() - from.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

export function normalizeAppModel(model: AppModel): AppModel {
  const current = getCurrentStreakFromStartDate(model.profile.startDate)
  const best = Math.max(model.streak.best, current)

  return {
    ...model,
    streak: {
      ...model.streak,
      current,
      best,
    },
  }
}
