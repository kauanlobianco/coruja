import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
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
type AuthStep = 'email' | 'password'

const slide = {
  initial: (dir: number) => ({ opacity: 0, x: dir * 24 }),
  animate: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -24 }),
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
}

export function AccountAuthPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { state, linkAccount, replaceModelFromBackup, setBackupStatus } = useAppState()
  const signupOnly = params.get('signupOnly') === '1'
  const loginOnly = params.get('loginOnly') === '1'
  const forcedMode: Mode | null = signupOnly ? 'signup' : loginOnly ? 'login' : null
  const [mode, setMode] = useState<Mode>(forcedMode ?? ((params.get('mode') as Mode) || 'signup'))
  const [authStep, setAuthStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [stepDir, setStepDir] = useState(1)

  const normalizedEmail = email.trim()
  const isEmailValid = useMemo(() => {
    if (!normalizedEmail) return true
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  }, [normalizedEmail])

  function handleModeSwitch(newMode: Mode) {
    setMode(newMode)
    setAuthStep('email')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setMessage('')
  }

  function handleEmailContinue() {
    setError('')
    if (!normalizedEmail) {
      setError('Digite seu e-mail para continuar.')
      return
    }
    if (!isEmailValid) {
      setError('E-mail inválido.')
      return
    }
    setStepDir(1)
    setAuthStep('password')
  }

  function handleBackToEmail() {
    setStepDir(-1)
    setAuthStep('email')
    setError('')
    setMessage('')
  }

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

        <div className="foco-landing-particles" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="foco-particle" />
          ))}
        </div>

        <button
          type="button"
          className="account-auth-back"
          onClick={authStep === 'password' ? handleBackToEmail : () => navigate(-1)}
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
        </button>

        <article className="account-auth-card">

          {/* Header */}
          <div className="account-auth-header">
            <h1>
              {mode === 'signup'
                ? 'Seu progresso merece um lugar seguro.'
                : 'Volte para o seu progresso.'}
            </h1>
          </div>

          {/* Mode switch — only on email step */}
          {!forcedMode && authStep === 'email' && (
            <div className="account-auth-mode-switch" role="tablist">
              <button
                className={`account-auth-mode-button${mode === 'signup' ? ' is-active' : ''}`}
                type="button"
                onClick={() => handleModeSwitch('signup')}
              >
                Criar conta
              </button>
              <button
                className={`account-auth-mode-button${mode === 'login' ? ' is-active' : ''}`}
                type="button"
                onClick={() => handleModeSwitch('login')}
              >
                Entrar
              </button>
            </div>
          )}

          <form className="account-auth-form" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait" custom={stepDir}>
              {authStep === 'email' ? (
                <motion.div
                  key="email"
                  className="account-auth-step"
                  custom={stepDir}
                  variants={slide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={slide.transition}
                >
                  <div className={`account-auth-field${normalizedEmail && !isEmailValid ? ' is-invalid' : ''}`}>
                    <div className="account-auth-input-shell">
                      <Mail size={16} className="account-auth-input-icon" />
                      <input
                        className="account-auth-input"
                        id="account-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleEmailContinue())}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                    {normalizedEmail && !isEmailValid && (
                      <span className="account-auth-help account-auth-help-error">E-mail inválido.</span>
                    )}
                  </div>

                  {error && <p className="toast toast-error">{error}</p>}

                  <button
                    type="button"
                    className="button button-primary account-auth-submit"
                    onClick={handleEmailContinue}
                  >
                    Continuar
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="password"
                  className="account-auth-step"
                  custom={stepDir}
                  variants={slide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={slide.transition}
                >
                  {/* Email chip */}
                  <div className="account-auth-email-chip">
                    <Mail size={13} />
                    <span>{normalizedEmail}</span>
                    <button type="button" onClick={handleBackToEmail} className="account-auth-chip-change">
                      Trocar
                    </button>
                  </div>

                  {/* Password */}
                  <div className="account-auth-field">
                    <div className="account-auth-input-shell">
                      <LockKeyhole size={16} className="account-auth-input-icon" />
                      <input
                        className="account-auth-input"
                        id="account-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={mode === 'signup' ? 'Crie uma senha' : 'Sua senha'}
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="account-auth-visibility-toggle"
                        onClick={() => setShowPassword((c) => !c)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password — signup only */}
                  {mode === 'signup' && (
                    <div className="account-auth-field">
                      <div className="account-auth-input-shell">
                        <LockKeyhole size={16} className="account-auth-input-icon" />
                        <input
                          className="account-auth-input"
                          id="account-password-confirm"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirme a senha"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="account-auth-visibility-toggle"
                          onClick={() => setShowConfirmPassword((c) => !c)}
                          aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {error && <p className="toast toast-error">{error}</p>}
                  {message && <p className="toast toast-success">{message}</p>}

                  <button
                    className="button button-primary account-auth-submit"
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? 'Processando...'
                      : mode === 'signup'
                        ? 'Criar conta'
                        : 'Entrar'}
                  </button>

                  {mode === 'login' && (
                    <button
                      className="account-auth-link-button"
                      type="button"
                      onClick={() => void handleForgotPassword()}
                      disabled={loading}
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="account-auth-footer">
            {mode === 'signup' ? 'Já tem uma conta?' : 'Ainda não tem conta?'}{' '}
            {forcedMode ? (
              <span className="account-auth-footer-muted">O acesso continua no fluxo atual.</span>
            ) : (
              <button
                type="button"
                className="account-auth-footer-link"
                onClick={() => handleModeSwitch(mode === 'signup' ? 'login' : 'signup')}
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
