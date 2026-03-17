import type { AppModel } from '../../../core/domain/models'
import { normalizeAppModel } from '../../../core/domain/streak'
import { getSupabaseClient } from '../../../core/remote/supabase'

interface ProfileRow {
  id: string
  backup_state: AppModel | null
  last_backup_at: string | null
  onboarding_done: boolean | null
}

export async function restoreBackupForAccount(userId: string) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { restored: false as const, reason: 'missing-env' as const }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, backup_state, last_backup_at, onboarding_done')
    .eq('id', userId)
    .single<ProfileRow>()

  if (error) {
    if (error.code === 'PGRST116') {
      return { restored: false as const, reason: 'missing-backup' as const }
    }

    return {
      restored: false as const,
      reason: 'remote-error' as const,
      error: error.message,
    }
  }

  if (!data?.backup_state) {
    return { restored: false as const, reason: 'missing-backup' as const }
  }

  return {
    restored: true as const,
    model: normalizeAppModel(data.backup_state),
    lastBackupAt: data.last_backup_at,
  }
}

export async function uploadBackupForAccount(input: {
  userId: string
  email: string
  model: AppModel
}) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { success: false as const, reason: 'missing-env' as const }
  }

  const now = new Date().toISOString()

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: input.userId,
        email: input.email,
        onboarding_done: input.model.hasCompletedOnboarding,
        backup_state: input.model,
        last_backup_at: now,
      },
      { onConflict: 'id' },
    )

  if (error) {
    return { success: false as const, reason: 'remote-error' as const, error: error.message }
  }

  return { success: true as const, lastBackupAt: now }
}
