import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Github,
  Linkedin,
  LockKeyhole,
  Mail,
  Twitter,
} from 'lucide-react'
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const normalizedEmail = email.trim()
  const isEmailValid = useMemo(() => {
    if (!normalizedEmail) {
      return true
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  }, [normalizedEmail])

  async function handleForgotPassword() {
    if (!normalizedEmail) {
      setError('Digite seu e-mail para redefinir a senha.')
      return
    }

    if (!isEmailValid) {
      setError('Digite um e-mail valido para redefinir a senha.')
      return
    }

    setError('')
    setMessage('')
    setLoading(true)

    const result = await resetPasswordForEmail(normalizedEmail)
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

    if (!normalizedEmail || !password) {
      setError('Preencha e-mail e senha para continuar.')
      return
    }

    if (!isEmailValid) {
      setError('Digite um e-mail valido.')
      return
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('As senhas nao coincidem.')
      return
    }

    setLoading(true)

    const result =
      mode === 'signup'
        ? await signUpWithEmail(normalizedEmail, password)
        : await signInWithEmail(normalizedEmail, password)

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
    <AppShell
      title="Conta e backup"
      eyebrow="Auth"
      shellMode="entry"
      hideTopbar
      contentClassName="app-content-auth"
    >
      <section className="account-auth-screen">
        <div className="account-auth-orb account-auth-orb-primary" aria-hidden="true" />
        <div className="account-auth-orb account-auth-orb-secondary" aria-hidden="true" />

        <button
          type="button"
          className="account-auth-back"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
        </button>

        <article className="account-auth-card">
          <div className="account-auth-header">
            <span className="section-label">
              {mode === 'signup' ? 'Criar conta' : 'Entrar'}
            </span>
            <h1>{mode === 'signup' ? 'Seu progresso merece um lugar seguro.' : 'Volte para o seu progresso.'}</h1>
            <p>
              {mode === 'signup'
                ? 'Crie sua conta para proteger streak, diario, bloqueador e restaurar tudo quando precisar.'
                : 'Entre com sua conta para recuperar backup, continuar a jornada e manter seu dispositivo protegido.'}
            </p>
          </div>

          {!forcedMode ? (
            <div className="account-auth-mode-switch" role="tablist" aria-label="Modo de acesso">
              <button
                className={mode === 'signup' ? 'account-auth-mode-button is-active' : 'account-auth-mode-button'}
                type="button"
                onClick={() => setMode('signup')}
              >
                Criar conta
              </button>
              <button
                className={mode === 'login' ? 'account-auth-mode-button is-active' : 'account-auth-mode-button'}
                type="button"
                onClick={() => setMode('login')}
              >
                Entrar
              </button>
            </div>
          ) : null}

          <form className="account-auth-form" onSubmit={handleSubmit}>
            <div className={`account-auth-field ${normalizedEmail && !isEmailValid ? 'is-invalid' : ''}`}>
              <label className="account-auth-label" htmlFor="account-email">
                E-mail
              </label>
              <div className="account-auth-input-shell">
                <Mail size={18} className="account-auth-input-icon" />
                <input
                  className="account-auth-input"
                  id="account-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  required
                />
              </div>
              {normalizedEmail && !isEmailValid ? (
                <span className="account-auth-help account-auth-help-error">
                  Digite um e-mail valido.
                </span>
              ) : (
                <span className="account-auth-help">Usaremos este e-mail para acesso e recuperacao.</span>
              )}
            </div>

            <div className="account-auth-field">
              <label className="account-auth-label" htmlFor="account-password">
                Senha
              </label>
              <div className="account-auth-input-shell">
                <LockKeyhole size={18} className="account-auth-input-icon" />
                <input
                  className="account-auth-input"
                  id="account-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                />
                <button
                  type="button"
                  className="account-auth-visibility-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'signup' ? (
              <div className="account-auth-field">
                <label className="account-auth-label" htmlFor="account-password-confirm">
                  Confirmar senha
                </label>
                <div className="account-auth-input-shell">
                  <LockKeyhole size={18} className="account-auth-input-icon" />
                  <input
                    className="account-auth-input"
                    id="account-password-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="account-auth-visibility-toggle"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    aria-label={showConfirmPassword ? 'Ocultar confirmacao de senha' : 'Mostrar confirmacao de senha'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="account-auth-options">
              <label className="account-auth-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((current) => !current)}
                />
                <span className="account-auth-checkbox-mark" aria-hidden="true" />
                <span>Lembrar neste aparelho</span>
              </label>

              {mode === 'login' ? (
                <button
                  className="account-auth-link-button"
                  type="button"
                  onClick={() => void handleForgotPassword()}
                  disabled={loading}
                >
                  Esqueci minha senha
                </button>
              ) : (
                <span className="account-auth-inline-note">Backup vinculado ao seu e-mail</span>
              )}
            </div>

            {error ? <p className="toast toast-error">{error}</p> : null}
            {message ? <p className="toast toast-success">{message}</p> : null}

            <button className="button button-primary account-auth-submit" type="submit" disabled={loading}>
              {loading ? 'Processando...' : mode === 'signup' ? 'Criar conta e seguir' : 'Entrar e restaurar'}
            </button>
          </form>

          <div className="account-auth-separator">
            <span>ou continue com</span>
          </div>

          <div className="account-auth-socials" aria-label="Acessos sociais em breve">
            <button type="button" className="account-auth-social-button" disabled aria-label="GitHub em breve">
              <Github size={18} />
            </button>
            <button type="button" className="account-auth-social-button" disabled aria-label="Twitter em breve">
              <Twitter size={18} />
            </button>
            <button type="button" className="account-auth-social-button" disabled aria-label="LinkedIn em breve">
              <Linkedin size={18} />
            </button>
          </div>

          <p className="account-auth-footer">
            {mode === 'signup' ? 'Ja tem uma conta?' : 'Ainda nao tem conta?'}{' '}
            {forcedMode ? (
              <span className="account-auth-footer-muted">
                {mode === 'signup' ? 'O acesso continua no fluxo atual.' : 'Use o acesso liberado no fluxo atual.'}
              </span>
            ) : (
              <button
                type="button"
                className="account-auth-footer-link"
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              >
                {mode === 'signup' ? 'Entrar' : 'Criar conta'}
              </button>
            )}
          </p>
        </article>
      </section>
    </AppShell>
  )
}
