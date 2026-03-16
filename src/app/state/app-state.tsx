import type { PropsWithChildren } from 'react'
import {
  startTransition,
  useEffect,
  useState,
} from 'react'
import {
  loadPersistedAppState,
  savePersistedAppState,
} from '../../core/storage/app-preferences'
import type { AppProfile, AppStateShape } from './types'
import { AppStateContext } from './context'

const initialState: AppStateShape = {
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

export interface AppStateContextValue {
  ready: boolean
  state: AppStateShape
  completeOnboarding: (payload: AppProfile) => Promise<void>
  setProAccess: (enabled: boolean) => Promise<void>
  setBlockerEnabled: (enabled: boolean) => Promise<void>
  markSyncNow: () => Promise<void>
  resetApp: () => Promise<void>
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<AppStateShape>(initialState)

  useEffect(() => {
    let active = true

    void loadPersistedAppState().then((stored) => {
      if (!active) {
        return
      }

      startTransition(() => {
        setState(stored)
        setReady(true)
      })
    })

    return () => {
      active = false
    }
  }, [])

  async function updateState(recipe: (current: AppStateShape) => AppStateShape) {
    const next = recipe(state)
    setState(next)
    await savePersistedAppState(next)
  }

  const value: AppStateContextValue = {
    ready,
    state,
    completeOnboarding: async (profile) => {
      await updateState((current) => ({
        ...current,
        hasCompletedOnboarding: true,
        profile,
      }))
    },
    setProAccess: async (enabled) => {
      await updateState((current) => ({
        ...current,
        hasProAccess: enabled,
      }))
    },
    setBlockerEnabled: async (enabled) => {
      await updateState((current) => ({
        ...current,
        blockerEnabled: enabled,
      }))
    },
    markSyncNow: async () => {
      await updateState((current) => ({
        ...current,
        lastSyncAt: new Date().toISOString(),
      }))
    },
    resetApp: async () => {
      setState(initialState)
      await savePersistedAppState(initialState)
    },
  }

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  )
}
