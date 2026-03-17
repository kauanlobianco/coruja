import { Preferences } from '@capacitor/preferences'
import { platform } from '../../../core/platform/capacitor'
import { getSupabaseClient } from '../../../core/remote/supabase'

const DEVICE_ID_KEY = 'coruja.device.id'
const ACCOUNT_SESSION_KEY = 'coruja.account.session'

interface StoredAccountSession {
  userId: string
  email: string
  deviceId: string
  sessionToken: string
  establishedAt: string
}

interface ProfileSessionRow {
  id: string
  active_device_id: string | null
  active_session_token: string | null
  active_device_label: string | null
  last_seen_at: string | null
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `coruja-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function getDeviceLabel() {
  if (typeof navigator !== 'undefined') {
    return `${platform}:${navigator.userAgent.slice(0, 80)}`
  }

  return `${platform}:unknown`
}

async function readStoredSession() {
  const { value } = await Preferences.get({ key: ACCOUNT_SESSION_KEY })
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as StoredAccountSession
  } catch {
    return null
  }
}

export async function getOrCreateDeviceId() {
  const existing = await Preferences.get({ key: DEVICE_ID_KEY })
  if (existing.value) {
    return existing.value
  }

  const nextId = createId()
  await Preferences.set({ key: DEVICE_ID_KEY, value: nextId })
  return nextId
}

export async function getLocalAccountSession() {
  return readStoredSession()
}

export async function establishExclusiveAccountSession(input: {
  userId: string
  email: string
}) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { success: false as const, reason: 'missing-env' as const }
  }

  const deviceId = await getOrCreateDeviceId()
  const sessionToken = createId()
  const now = new Date().toISOString()

  const localSession: StoredAccountSession = {
    userId: input.userId,
    email: input.email,
    deviceId,
    sessionToken,
    establishedAt: now,
  }

  await Preferences.set({
    key: ACCOUNT_SESSION_KEY,
    value: JSON.stringify(localSession),
  })

  const { error } = await supabase.from('profiles').upsert(
    {
      id: input.userId,
      email: input.email,
      active_device_id: deviceId,
      active_session_token: sessionToken,
      active_device_label: getDeviceLabel(),
      last_seen_at: now,
    },
    { onConflict: 'id' },
  )

  if (error) {
    await Preferences.remove({ key: ACCOUNT_SESSION_KEY })
    return {
      success: false as const,
      reason: 'remote-error' as const,
      error: error.message,
    }
  }

  return {
    success: true as const,
    deviceId,
    sessionToken,
    lastLeaseRefreshAt: now,
  }
}

export async function refreshExclusiveAccountSession(userId: string) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { ok: false as const, reason: 'missing-env' as const }
  }

  const localSession = await readStoredSession()
  if (!localSession || localSession.userId !== userId) {
    return { ok: false as const, reason: 'missing-local-session' as const }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, active_device_id, active_session_token, active_device_label, last_seen_at',
    )
    .eq('id', userId)
    .single<ProfileSessionRow>()

  if (error || !data) {
    return {
      ok: false as const,
      reason: 'remote-error' as const,
      error: error?.message ?? 'Nao foi possivel validar a sessao remota.',
    }
  }

  if (
    data.active_device_id !== localSession.deviceId ||
    data.active_session_token !== localSession.sessionToken
  ) {
    return { ok: false as const, reason: 'session-revoked' as const }
  }

  const now = new Date().toISOString()
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      active_device_label: getDeviceLabel(),
      last_seen_at: now,
    })
    .eq('id', userId)
    .eq('active_device_id', localSession.deviceId)
    .eq('active_session_token', localSession.sessionToken)

  if (updateError) {
    return {
      ok: false as const,
      reason: 'remote-error' as const,
      error: updateError.message,
    }
  }

  return { ok: true as const, lastLeaseRefreshAt: now, deviceId: localSession.deviceId }
}

export async function releaseExclusiveAccountSession(userId: string) {
  const supabase = getSupabaseClient()
  const localSession = await readStoredSession()

  await Preferences.remove({ key: ACCOUNT_SESSION_KEY })

  if (!supabase || !localSession || localSession.userId !== userId) {
    return
  }

  await supabase
    .from('profiles')
    .update({
      active_device_id: null,
      active_session_token: null,
      active_device_label: null,
    })
    .eq('id', userId)
    .eq('active_device_id', localSession.deviceId)
    .eq('active_session_token', localSession.sessionToken)
}

export async function clearLocalAccountSession() {
  await Preferences.remove({ key: ACCOUNT_SESSION_KEY })
}
