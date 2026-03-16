import { Preferences } from '@capacitor/preferences'
import { z } from 'zod'
import type { AppStateShape } from '../../app/state/types'

const APP_STATE_KEY = 'coruja.app.state'

const appStateSchema = z.object({
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

const fallbackState: AppStateShape = {
  hasCompletedOnboarding: false,
  hasProAccess: false,
  blockerEnabled: false,
  lastSyncAt: null,
  profile: {
    name: '',
    goalDays: 14,
    motivations: [],
    triggers: [],
  },
}

export async function loadPersistedAppState(): Promise<AppStateShape> {
  try {
    const { value } = await Preferences.get({ key: APP_STATE_KEY })
    if (!value) {
      return fallbackState
    }

    const parsed = JSON.parse(value) as unknown
    return appStateSchema.parse(parsed)
  } catch {
    return fallbackState
  }
}

export async function savePersistedAppState(state: AppStateShape) {
  await Preferences.set({
    key: APP_STATE_KEY,
    value: JSON.stringify(state),
  })
}
