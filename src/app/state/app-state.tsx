import type { PropsWithChildren } from 'react'
import { startTransition, useEffect, useRef, useState } from 'react'
import {
  loadPersistedAppState,
  savePersistedAppState,
} from '../../core/storage/app-preferences'
import { AppStateContext } from './context'
import type {
  AppModel,
  CheckInEntry,
  JournalEntry,
  UserProfile,
} from '../../core/domain/models'
import { defaultAppModel } from '../../core/domain/models'
import { normalizeAppModel } from '../../core/domain/streak'
import { hasCheckInToday } from '../../core/domain/check-in'
import { createRelapseTransition } from '../../core/domain/relapse'
import { uploadBackupForAccount } from '../../features/account/services/backup-service'
import {
  clearLocalAccountSession,
  refreshExclusiveAccountSession,
  releaseExclusiveAccountSession,
} from '../../features/account/services/device-session-service'
import { signOutCurrentUser } from '../../features/account/services/auth-service'
import {
  checkBlockerPermission,
  getBlockerVpnStatus,
  isBlockerVpnRunning,
  startBlockerVpn,
} from '../../features/blocker/blocker-native'
import { DEFAULT_BLOCKED_DOMAINS } from '../../features/blocker/blocked-domains'

const initialState: AppModel = normalizeAppModel(defaultAppModel)

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `coruja-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function isRecentIsoDate(value: string | null, thresholdMs: number) {
  if (!value) {
    return false
  }

  const parsed = Date.parse(value)
  if (!Number.isFinite(parsed)) {
    return false
  }

  return Date.now() - parsed < thresholdMs
}

export interface AppStateContextValue {
  ready: boolean
  state: AppModel
  completeOnboarding: (
    payload: Pick<UserProfile, 'name' | 'goalDays' | 'motivations' | 'triggers'>,
  ) => Promise<void>
  setProAccess: (enabled: boolean) => Promise<void>
  setBlockerEnabled: (enabled: boolean) => Promise<void>
  setBlockedDomains: (domains: string[]) => Promise<void>
  registerBlockedAttempt: (url: string) => Promise<void>
  markSyncNow: () => Promise<void>
  saveCheckIn: (payload: {
    craving: number
    mentalState: string
    triggers: string[]
    notes: string
    strategy: string | null
    escalatedToSos: boolean
  }) => Promise<{ saved: boolean; reason?: 'already-checked-in' }>
  openSosSession: () => Promise<void>
  saveJournalEntry: (payload: {
    title: string
    content: string
    type: 'freeform' | 'relapse'
  }) => Promise<void>
  deleteJournalEntry: (entryId: string) => Promise<void>
  registerRelapse: (payload: {
    nextGoalDays: number
    cause: string
    reflection: string
  }) => Promise<void>
  setAnalyticsRange: (days: number) => Promise<void>
  linkAccount: (payload: {
    userId: string
    email: string
    lastBackupAt?: string | null
    lastLeaseRefreshAt?: string | null
  }) => Promise<void>
  replaceModelFromBackup: (
    model: AppModel,
    account: {
      userId: string
      email: string
      lastBackupAt?: string | null
      lastLeaseRefreshAt?: string | null
    },
  ) => Promise<void>
  setBackupStatus: (
    status: AppModel['backup']['status'],
    lastError: string | null,
  ) => Promise<void>
  logoutAccount: (reason?: string | null) => Promise<void>
  resetApp: () => Promise<void>
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<AppModel>(initialState)
  const stateRef = useRef<AppModel>(initialState)
  const syncInFlightRef = useRef(false)
  const sessionCheckInFlightRef = useRef(false)
  const blockerSyncRef = useRef<string | null>(null)

  useEffect(() => {
    let active = true

    void loadPersistedAppState().then((stored) => {
      if (!active) {
        return
      }

      startTransition(() => {
        setState(stored)
        stateRef.current = stored
        setReady(true)
      })
    })

    return () => {
      active = false
    }
  }, [])

  async function commitState(next: AppModel) {
    stateRef.current = next
    setState(next)
    await savePersistedAppState(next)
  }

  async function logoutAccount(reason?: string | null) {
    const currentAccount = stateRef.current.account

    if (currentAccount) {
      await releaseExclusiveAccountSession(currentAccount.userId)
    } else {
      await clearLocalAccountSession()
    }

    await signOutCurrentUser()

    await commitState(
      normalizeAppModel({
        ...defaultAppModel,
        backup: {
          status: reason ? 'conflict' : 'idle',
          lastError: reason ?? null,
          hasRemoteBackup: false,
        },
      }),
    )
  }

  async function syncRemoteBackup(model: AppModel) {
    const account = model.account

    if (!account || syncInFlightRef.current) {
      return
    }

    syncInFlightRef.current = true

    try {
      const syncingModel = normalizeAppModel({
        ...model,
        backup: {
          ...model.backup,
          status: 'uploading',
          lastError: null,
        },
      })

      await commitState(syncingModel)

      const uploaded = await uploadBackupForAccount({
        userId: account.userId,
        email: account.email,
        model: syncingModel,
      })

      if (!uploaded.success) {
        const failedModel = normalizeAppModel({
          ...syncingModel,
          backup: {
            ...syncingModel.backup,
            status: 'error',
            lastError:
              uploaded.reason === 'remote-error'
                ? uploaded.error ?? 'Erro remoto ao sincronizar.'
                : 'Supabase nao configurado.',
          },
        })

        await commitState(failedModel)
        return
      }

      const syncedModel = normalizeAppModel({
        ...syncingModel,
        account: {
          ...account,
          lastBackupAt: uploaded.lastBackupAt,
        },
        backup: {
          ...syncingModel.backup,
          status: 'idle',
          lastError: null,
          hasRemoteBackup: true,
        },
      })

      await commitState(syncedModel)
    } finally {
      syncInFlightRef.current = false
    }
  }

  async function updateState(
    recipe: (current: AppModel) => AppModel,
    options?: { syncRemote?: boolean },
  ) {
    const next = normalizeAppModel(recipe(stateRef.current))
    await commitState(next)

    if (options?.syncRemote) {
      await syncRemoteBackup(next)
    }
  }

  const accountUserId = state.account?.userId

  useEffect(() => {
    if (!ready || !accountUserId) {
      return
    }

    const activeAccountUserId = accountUserId
    let active = true

    async function validateSession() {
      if (!active || sessionCheckInFlightRef.current) {
        return
      }

      sessionCheckInFlightRef.current = true

      try {
        const result = await refreshExclusiveAccountSession(activeAccountUserId)
        if (!active) {
          return
        }

        if (result.ok) {
          if (stateRef.current.account?.lastLeaseRefreshAt === result.lastLeaseRefreshAt) {
            return
          }

          await updateState((current) => ({
            ...current,
            account: current.account
              ? {
                  ...current.account,
                  lastLeaseRefreshAt: result.lastLeaseRefreshAt,
                }
              : current.account,
          }))
          return
        }

        if (result.reason === 'session-revoked') {
          await logoutAccount('Sua conta foi aberta em outro dispositivo.')
          return
        }

        if (result.reason === 'missing-local-session') {
          await logoutAccount('Sua sessao local expirou e voce precisa entrar novamente.')
          return
        }

        await updateState((current) => ({
          ...current,
          backup: {
            ...current.backup,
            status: 'error',
            lastError:
              result.reason === 'remote-error'
                ? result.error ?? 'Falha ao validar a sessao ativa.'
                : 'Supabase nao configurado.',
          },
        }))
      } finally {
        sessionCheckInFlightRef.current = false
      }
    }

    void validateSession()
    const interval = window.setInterval(() => {
      void validateSession()
    }, 15000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, accountUserId])

  useEffect(() => {
    if (!ready) {
      return
    }

    let active = true

    async function reconcileBlockerRuntime() {
      const desiredDomains =
        stateRef.current.blocker.blockedDomains.length > 0
          ? stateRef.current.blocker.blockedDomains
          : DEFAULT_BLOCKED_DOMAINS
      const signature = `${stateRef.current.blocker.isEnabled}:${desiredDomains.join('|')}`

      if (blockerSyncRef.current === signature) {
        return
      }

      try {
        const [permission, vpnStatus, vpnRunning] = await Promise.all([
          checkBlockerPermission(),
          getBlockerVpnStatus(),
          isBlockerVpnRunning(),
        ])

        if (!active) {
          return
        }

        const nativeActive = vpnStatus.active || vpnRunning.running

        if (stateRef.current.blocker.isEnabled) {
          if (!permission.granted) {
            blockerSyncRef.current = signature
            return
          }

          if (!nativeActive || blockerSyncRef.current !== signature) {
            await startBlockerVpn(desiredDomains)
          }

          if (stateRef.current.blocker.blockedDomains.length === 0) {
            await updateState(
              (current) => ({
                ...current,
                blocker: {
                  ...current.blocker,
                  blockedDomains: desiredDomains,
                },
              }),
              { syncRemote: true },
            )
          }

          blockerSyncRef.current = signature
          return
        }

        if (nativeActive) {
          await updateState(
            (current) => ({
              ...current,
              blocker: {
                ...current.blocker,
                isEnabled: true,
                blockedDomains:
                  current.blocker.blockedDomains.length > 0
                    ? current.blocker.blockedDomains
                    : desiredDomains,
              },
            }),
            { syncRemote: true },
          )
          blockerSyncRef.current = `true:${desiredDomains.join('|')}`
          return
        }

        blockerSyncRef.current = signature
      } catch {
        // Keep runtime guardrail silent; the UI can still report explicit action failures.
      }
    }

    void reconcileBlockerRuntime()

    const interval = window.setInterval(() => {
      void reconcileBlockerRuntime()
    }, 15000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, state.blocker.isEnabled, state.blocker.blockedDomains])

  const value: AppStateContextValue = {
    ready,
    state,
    completeOnboarding: async (profile) => {
      const now = new Date().toISOString()

      await updateState(
        (current) => ({
          ...current,
          hasCompletedOnboarding: true,
          profile: {
            ...current.profile,
            ...profile,
            startDate: current.profile.startDate ?? now,
          },
        }),
        { syncRemote: true },
      )
    },
    setProAccess: async (enabled) => {
      await updateState(
        (current) => ({
          ...current,
          hasProAccess: enabled,
        }),
        { syncRemote: true },
      )
    },
    setBlockerEnabled: async (enabled) => {
      await updateState(
        (current) => ({
          ...current,
          blocker: {
            ...current.blocker,
            isEnabled: enabled,
          },
        }),
        { syncRemote: true },
      )
    },
    setBlockedDomains: async (domains) => {
      const normalizedDomains = [...new Set(domains.map((domain) => domain.trim().toLowerCase()))]
        .filter(Boolean)

      await updateState(
        (current) => ({
          ...current,
          blocker: {
            ...current.blocker,
            blockedDomains: normalizedDomains,
          },
        }),
        { syncRemote: true },
      )
    },
    registerBlockedAttempt: async (url) => {
      const domain = url.trim().toLowerCase()
      if (!domain) {
        return
      }

      const lastAttempt = stateRef.current.blocker.blockedAttempts.at(-1)
      if (
        lastAttempt?.url === domain &&
        isRecentIsoDate(lastAttempt.createdAt, 5000)
      ) {
        return
      }

      await updateState(
        (current) => ({
          ...current,
          blocker: {
            ...current.blocker,
            blockedAttempts: [
              ...current.blocker.blockedAttempts,
              {
                id: createId(),
                url: domain,
                createdAt: new Date().toISOString(),
              },
            ],
          },
        }),
        { syncRemote: true },
      )
    },
    markSyncNow: async () => {
      if (!stateRef.current.account) {
        await updateState((current) => ({
          ...current,
          backup: {
            ...current.backup,
            status: 'error',
            lastError: 'Nenhuma conta vinculada para sincronizar.',
          },
        }))
        return
      }

      await syncRemoteBackup(stateRef.current)
    },
    saveCheckIn: async (payload) => {
      if (hasCheckInToday(stateRef.current.checkIns)) {
        return { saved: false, reason: 'already-checked-in' }
      }

      const entry: CheckInEntry = {
        id: createId(),
        createdAt: new Date().toISOString(),
        craving: payload.craving,
        mentalState: payload.mentalState,
        triggers: payload.triggers,
        notes: payload.notes,
        strategy: payload.strategy,
        escalatedToSos: payload.escalatedToSos,
      }

      await updateState(
        (current) => ({
          ...current,
          checkIns: [...current.checkIns, entry],
        }),
        { syncRemote: true },
      )

      return { saved: true }
    },
    openSosSession: async () => {
      const now = new Date().toISOString()

      if (isRecentIsoDate(stateRef.current.sos.lastOpenedAt, 5000)) {
        return
      }

      await updateState(
        (current) => ({
          ...current,
          sos: {
            lastOpenedAt: now,
            totalSessions: current.sos.totalSessions + 1,
          },
        }),
        { syncRemote: true },
      )
    },
    saveJournalEntry: async (payload) => {
      const entry: JournalEntry = {
        id: createId(),
        createdAt: new Date().toISOString(),
        title: payload.title,
        content: payload.content,
        type: payload.type,
      }

      await updateState(
        (current) => ({
          ...current,
          journalEntries: [...current.journalEntries, entry],
        }),
        { syncRemote: true },
      )
    },
    deleteJournalEntry: async (entryId) => {
      await updateState(
        (current) => ({
          ...current,
          journalEntries: current.journalEntries.filter((entry) => entry.id !== entryId),
        }),
        { syncRemote: true },
      )
    },
    registerRelapse: async (payload) => {
      const result = createRelapseTransition({
        current: stateRef.current,
        nextGoalDays: payload.nextGoalDays,
        cause: payload.cause,
        reflection: payload.reflection,
        createId,
      })

      await updateState(() => result.nextModel, { syncRemote: true })
    },
    setAnalyticsRange: async (days) => {
      await updateState((current) => ({
        ...current,
        analytics: {
          ...current.analytics,
          selectedRangeDays: days,
          lastComputedAt: new Date().toISOString(),
        },
      }))
    },
    linkAccount: async (payload) => {
      await updateState((current) => ({
        ...current,
        account: {
          userId: payload.userId,
          email: payload.email,
          lastBackupAt: payload.lastBackupAt ?? current.account?.lastBackupAt ?? null,
          lastRestoreAt: current.account?.lastRestoreAt ?? null,
          lastLeaseRefreshAt:
            payload.lastLeaseRefreshAt ?? current.account?.lastLeaseRefreshAt ?? null,
        },
      }))
    },
    replaceModelFromBackup: async (model, account) => {
      const merged = normalizeAppModel({
        ...model,
        account: {
          userId: account.userId,
          email: account.email,
          lastBackupAt: account.lastBackupAt ?? null,
          lastRestoreAt: new Date().toISOString(),
          lastLeaseRefreshAt:
            account.lastLeaseRefreshAt ?? model.account?.lastLeaseRefreshAt ?? null,
        },
        backup: {
          ...model.backup,
          status: 'idle',
          lastError: null,
          hasRemoteBackup: true,
        },
      })

      await commitState(merged)
    },
    setBackupStatus: async (status, lastError) => {
      await updateState((current) => ({
        ...current,
        backup: {
          ...current.backup,
          status,
          lastError,
        },
      }))
    },
    logoutAccount,
    resetApp: async () => {
      await logoutAccount(null)
    },
  }

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  )
}
