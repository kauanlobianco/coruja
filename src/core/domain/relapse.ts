import type { AppModel, JournalEntry, RelapseEntry } from './models'

export function createRelapseTransition(input: {
  current: AppModel
  nextGoalDays: number
  cause: string
  reflection: string
  createId: () => string
  now?: string
}) {
  const now = input.now ?? new Date().toISOString()

  const relapseEntry: RelapseEntry = {
    id: input.createId(),
    createdAt: now,
    previousStreak: input.current.streak.current,
    previousGoalDays: input.current.profile.goalDays,
    nextGoalDays: input.nextGoalDays,
    cause: input.cause,
    journalEntryId: null,
    viewed: false,
  }

  let journalEntry: JournalEntry | null = null

  if (input.reflection.trim()) {
    journalEntry = {
      id: input.createId(),
      createdAt: now,
      title: 'Reflexao de recaida',
      content: input.reflection.trim(),
      type: 'relapse',
    }

    relapseEntry.journalEntryId = journalEntry.id
  }

  return {
    relapseEntry,
    journalEntry,
    nextModel: {
      ...input.current,
      profile: {
        ...input.current.profile,
        goalDays: input.nextGoalDays,
        startDate: now,
      },
      streak: {
        ...input.current.streak,
        current: 0,
        lastRelapseAt: now,
      },
      relapses: [...input.current.relapses, relapseEntry],
      journalEntries: journalEntry
        ? [...input.current.journalEntries, journalEntry]
        : input.current.journalEntries,
    },
  }
}
