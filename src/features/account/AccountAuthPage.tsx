import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import {
  signInWithEmail,
  resetPasswordForEmail,
  signOutCurrentUser,
  signUpWithEmail,
} from './services/auth-service'
import { restoreBackupForAccount, uploadBackupForAccount } from './services/backup-service'
import { useAppState } from '../../app/state/use-app-state'
import { normalizeAppModel } from '../../core/domain/streak'
import { establishExclusiveAccountSession } from './services/device-session-service'

type Mode = 'login' | 'signup'

export function AccountAuthPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { state, linkAccount, replaceModelFromBackup, setBackupStatus } = useAppState()
  const signupOnly = params.get('signupOnly') === '1'
  const loginOnly = params.get('loginOnly') === '1'
  const forcedMode: Mode | null = signupOnly ? 'signup' : loginOnly ? 'login' : null
  const [mode, setMode] = useState<Mode>(forcedMode ?? ((params.get('mode') as Mode) || 'signup'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Digite seu e-mail para redefinir a senha.')
      return
    }

    setError('')
    setMessage('')
    setLoading(true)

    const result = await resetPasswordForEmail(email.trim())
    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    setMessage('Link de redefinicao enviado para o seu e-mail.')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (mode === 'signup' && password !== confirmPassword) {
      setError('As senhas nao coincidem.')
      return
    }

    setLoading(true)

    const result =
      mode === 'signup'
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password)

    if (!result.success) {
      setLoading(false)
      setError(result.error)
      return
    }

    const session = await establishExclusiveAccountSession({
      userId: result.userId,
      email: result.email,
    })

    if (!session.success) {
      await signOutCurrentUser()
      setLoading(false)
      setError(
        session.reason === 'remote-error'
          ? session.error ?? 'Nao foi possivel assumir a sessao ativa dessa conta.'
          : 'Supabase nao configurado.',
      )
      return
    }

    await linkAccount({
      userId: result.userId,
      email: result.email,
      lastBackupAt: null,
      lastLeaseRefreshAt: session.lastLeaseRefreshAt,
    })

    if (mode === 'login') {
      await setBackupStatus('restoring', null)
      const restored = await restoreBackupForAccount(result.userId)

      if (restored.restored) {
        await replaceModelFromBackup(restored.model, {
          userId: result.userId,
          email: result.email,
          lastBackupAt: restored.lastBackupAt,
          lastLeaseRefreshAt: session.lastLeaseRefreshAt,
        })
        setLoading(false)
        navigate('/app', { replace: true })
        return
      }

      if (restored.reason === 'remote-error') {
        await setBackupStatus('error', restored.error ?? 'Falha ao restaurar o backup remoto.')
        setLoading(false)
        setError('Nao foi possivel restaurar seu backup agora. Tente novamente em instantes.')
        return
      }

      await setBackupStatus('error', 'Nenhum backup remoto foi localizado para esta conta.')
      setLoading(false)
      setError('Conta encontrada, mas nenhum backup remoto foi localizado para este login.')
      return
    }

    await setBackupStatus('uploading', null)
    const signupSnapshot = normalizeAppModel({
      ...state,
      account: {
        userId: result.userId,
        email: result.email,
        lastBackupAt: null,
        lastRestoreAt: null,
        lastLeaseRefreshAt: session.lastLeaseRefreshAt,
      },
      backup: {
        ...state.backup,
        status: 'uploading',
        lastError: null,
      },
    })

    const uploaded = await uploadBackupForAccount({
      userId: result.userId,
      email: result.email,
      model: signupSnapshot,
    })

    if (!uploaded.success) {
      await setBackupStatus('error', uploaded.reason === 'remote-error' ? uploaded.error ?? 'Erro de sync.' : 'Supabase nao configurado.')
      setLoading(false)
      setError('Conta criada, mas o backup inicial nao foi concluido. Configure o Supabase para seguir.')
      return
    }

    await linkAccount({
      userId: result.userId,
      email: result.email,
      lastBackupAt: uploaded.lastBackupAt,
      lastLeaseRefreshAt: session.lastLeaseRefreshAt,
    })
    await setBackupStatus('idle', null)
    setLoading(false)
    navigate('/onboarding', { replace: true })
  }

  return (
    <AppShell title="Conta e backup" eyebrow="Auth" shellMode="entry">
      <form className="form-card" onSubmit={handleSubmit}>
        <span className="section-label">Acesso</span>
        <h2>{mode === 'signup' ? 'Criar conta obrigatoria' : 'Entrar para restaurar backup'}</h2>

        {!forcedMode ? (
          <div className="chip-row">
            <button
              className={mode === 'signup' ? 'chip active' : 'chip'}
              type="button"
              onClick={() => setMode('signup')}
            >
              Criar conta
            </button>
            <button
              className={mode === 'login' ? 'chip active' : 'chip'}
              type="button"
              onClick={() => setMode('login')}
            >
              Entrar
            </button>
          </div>
        ) : null}

        <div className="field">
          <div className="input-wrapper">
            <input
              className="input-field"
              id="account-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder=" "
              required
            />
            <label className="input-label" htmlFor="account-email">
              E-mail
            </label>
          </div>
        </div>

        <div className="field">
          <div className="input-wrapper">
            <input
              className="input-field"
              id="account-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder=" "
              required
            />
            <label className="input-label" htmlFor="account-password">
              Senha
            </label>
          </div>
        </div>

        {mode === 'signup' ? (
          <div className="field">
            <div className="input-wrapper">
              <input
                className="input-field"
                id="account-password-confirm"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder=" "
                required
              />
              <label className="input-label" htmlFor="account-password-confirm">
                Confirmar senha
              </label>
            </div>
          </div>
        ) : null}

        {error ? <p className="toast toast-error">{error}</p> : null}
        {message ? <p className="toast toast-success">{message}</p> : null}

        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? 'Processando...' : mode === 'signup' ? 'Criar conta e seguir' : 'Entrar e restaurar'}
        </button>

        {mode === 'login' ? (
          <button
            className="text-link"
            type="button"
            onClick={() => void handleForgotPassword()}
            disabled={loading}
          >
            Esqueci minha senha
          </button>
        ) : null}
      </form>
    </AppShell>
  )
}
