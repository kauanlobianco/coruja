import { Preferences } from '@capacitor/preferences'
import { z } from 'zod'
import type { AppModel } from '../domain/models'
import { defaultAppModel } from '../domain/models'
import { normalizeAppModel } from '../domain/streak'

const APP_STATE_KEY = 'coruja.app.state'
const DEMO_CLOCK_OFFSET_KEY = 'coruja.demo.clock.offset'

const appStateSchema = z.object({
  hasCompletedOnboarding: z.boolean(),
  hasProAccess: z.boolean(),
  profile: z.object({
    name: z.string(),
    age: z.number().int().min(0).nullable().optional().catch(null).default(null),
    goalDays: z.number().int().min(1),
    motivations: z.array(z.string()),
    triggers: z.array(z.string()),
    startDate: z.string().nullable(),
    joinedAt: z.string().nullable().optional().catch(null).default(null),
    avatarId: z.number().int().min(1),
  }),
  streak: z.object({
    current: z.number().int().min(0),
    best: z.number().int().min(0),
    lastRelapseAt: z.string().nullable(),
  }),
  checkIns: z.array(
    z.object({
      id: z.string(),
      createdAt: z.string(),
      craving: z.number().int().min(0).max(10),
      mentalState: z.string(),
      triggers: z.array(z.string()),
      notes: z.string(),
      strategy: z.string().nullable(),
      escalatedToSos: z.boolean(),
    }),
  ),
  journalEntries: z.array(
    z.object({
      id: z.string(),
      createdAt: z.string(),
      title: z.string(),
      content: z.string(),
      type: z.enum(['freeform', 'relapse']),
    }),
  ),
  relapses: z.array(
    z.object({
      id: z.string(),
      createdAt: z.string(),
      previousStreak: z.number().int().min(0),
      previousGoalDays: z.number().int().min(1),
      nextGoalDays: z.number().int().min(1),
      cause: z.string(),
      journalEntryId: z.string().nullable(),
      viewed: z.boolean(),
    }),
  ),
  blocker: z.object({
    isEnabled: z.boolean(),
    blockedDomains: z.array(z.string()),
    blockedAttempts: z.array(
      z.object({
        id: z.string(),
        url: z.string(),
        createdAt: z.string(),
      }),
    ),
  }),
  analytics: z.object({
    lastComputedAt: z.string().nullable(),
    selectedRangeDays: z.number().int().min(1),
  }),
  account: z
    .object({
      userId: z.string(),
      email: z.string(),
      lastBackupAt: z.string().nullable(),
      lastRestoreAt: z.string().nullable(),
      lastLeaseRefreshAt: z.string().nullable(),
    })
    .nullable(),
  backup: z.object({
    status: z.enum(['idle', 'uploading', 'restoring', 'conflict', 'error']),
    lastError: z.string().nullable(),
    hasRemoteBackup: z.boolean(),
  }),
  sos: z.object({
    lastOpenedAt: z.string().nullable(),
    totalSessions: z.number().int().min(0),
  }),
})

const legacyStateSchema = z.object({
  hasCompletedOnboarding: z.boolean(),
  hasProAccess: z.boolean(),
  blockerEnabled: z.boolean(),
  lastSyncAt: z.string().nullable(),
  profile: z.object({
    name: z.string(),
    goalDays: z.number().int().min(1),
    motivations: z.array(z.string()),
    triggers: z.array(z.string()),
  }),
})

function migrateLegacyState(value: z.infer<typeof legacyStateSchema>): AppModel {
  return normalizeAppModel({
    ...defaultAppModel,
    hasCompletedOnboarding: value.hasCompletedOnboarding,
    hasProAccess: value.hasProAccess,
    profile: {
      ...defaultAppModel.profile,
      ...value.profile,
    },
    blocker: {
      ...defaultAppModel.blocker,
      isEnabled: value.blockerEnabled,
    },
  })
}

export async function loadPersistedAppState(): Promise<AppModel> {
  try {
    const { value } = await Preferences.get({ key: APP_STATE_KEY })
    if (!value) {
      return normalizeAppModel(defaultAppModel)
    }

    const parsed = JSON.parse(value) as unknown
    const nextState = appStateSchema.safeParse(parsed)
    if (nextState.success) {
      return normalizeAppModel(nextState.data)
    }

    const legacyState = legacyStateSchema.safeParse(parsed)
    if (legacyState.success) {
      return migrateLegacyState(legacyState.data)
    }

    return normalizeAppModel(defaultAppModel)
  } catch {
    return normalizeAppModel(defaultAppModel)
  }
}

export async function savePersistedAppState(state: AppModel) {
  await Preferences.set({
    key: APP_STATE_KEY,
    value: JSON.stringify(state),
  })
}

export async function loadDemoClockOffsetDays() {
  try {
    const { value } = await Preferences.get({ key: DEMO_CLOCK_OFFSET_KEY })
    if (!value) {
      return 0
    }

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  } catch {
    return 0
  }
}

export async function saveDemoClockOffsetDays(offsetDays: number) {
  await Preferences.set({
    key: DEMO_CLOCK_OFFSET_KEY,
    value: String(offsetDays),
  })
}
