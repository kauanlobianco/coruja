import { getSupabaseClient } from '../../../core/remote/supabase'

export async function signUpWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { success: false as const, error: 'Supabase nao configurado.' }
  }

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    return { success: false as const, error: error.message }
  }

  const userId = data.user?.id ?? data.session?.user.id
  if (!userId) {
    return {
      success: false as const,
      error: 'Conta criada, mas a sessao ainda nao esta pronta. Verifique o e-mail e tente entrar.',
    }
  }

  return {
    success: true as const,
    userId,
    email: data.user?.email ?? email,
  }
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { success: false as const, error: 'Supabase nao configurado.' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { success: false as const, error: error.message }
  }

  const userId = data.user?.id ?? data.session?.user?.id
  if (!userId) {
    return { success: false as const, error: 'Nao foi possivel validar a sessao.' }
  }

  return {
    success: true as const,
    userId,
    email: data.user?.email ?? email,
  }
}

export async function resetPasswordForEmail(email: string) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { success: false as const, error: 'Supabase nao configurado.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) {
    return { success: false as const, error: error.message }
  }

  return { success: true as const }
}

export async function signOutCurrentUser() {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return
  }

  await supabase.auth.signOut()
}
