import type { AppModel } from './models'
import { defaultAppModel } from './models'

function getUtcDayStamp(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
}

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
  const diffMs = getUtcDayStamp(to) - getUtcDayStamp(from)
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

export function normalizeAppModel(model: AppModel, now = new Date()): AppModel {
  const current = getCurrentStreakFromStartDate(model.profile.startDate, now)
  const best = Math.max(model.streak.best, current)

  return {
    ...model,
    profile: {
      ...defaultAppModel.profile,
      ...model.profile,
      age: model.profile.age ?? null,
      joinedAt: model.profile.joinedAt ?? null,
    },
    streak: {
      ...model.streak,
      current,
      best,
    },
  }
}
