import { type ReactNode, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Check,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Flame,
  Goal,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useAppState } from '../../app/state/use-app-state'
import { AppShell } from '../../shared/layout/AppShell'
import { hasCheckInToday } from '../../core/domain/check-in'
import { appRoutes } from '../../core/config/routes'

interface HomeToolCardProps {
  className: string
  iconClassName: string
  icon: ReactNode
  title: string
  onClick: () => void
  children: ReactNode
}

function HomeToolCard({
  className,
  iconClassName,
  icon,
  title,
  onClick,
  children,
}: HomeToolCardProps) {
  return (
    <article className={`tool-card ${className}`} onClick={onClick}>
      <div className="tool-card-head">
        <div className={`tool-card-icon-shell ${iconClassName}`}>
          <div className="tool-card-icon">{icon}</div>
        </div>
        <div className="tool-card-copy">
          <h2>{title}</h2>
        </div>
      </div>
      {children}
    </article>
  )
}

function formatPtDay(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(value)
}

function getMentalStateEmoji(value: string | null | undefined) {
  if (!value) {
    return '😐'
  }

  const normalized = value.toLowerCase()

  if (
    normalized.includes('ans') ||
    normalized.includes('pan') ||
    normalized.includes('agita') ||
    normalized.includes('sobre')
  ) {
    return '😣'
  }

  if (
    normalized.includes('triste') ||
    normalized.includes('culpa') ||
    normalized.includes('cans') ||
    normalized.includes('vazio')
  ) {
    return '😔'
  }

  if (
    normalized.includes('calm') ||
    normalized.includes('bem') ||
    normalized.includes('leve') ||
    normalized.includes('estavel')
  ) {
    return '🙂'
  }

  return '😐'
}

function getPrimaryAction(state: ReturnType<typeof useAppState>['state'], now: Date) {
  if (!hasCheckInToday(state.checkIns, now)) {
    return {
      key: 'check-in',
      description: 'Seu primeiro passo de hoje e registrar como voce esta.',
    }
  }

  const lastCheckIn = state.checkIns.at(-1)
  if (lastCheckIn && lastCheckIn.craving >= 7) {
    return {
      key: 'sos',
      description: 'Seu ultimo registro pediu mais cuidado. O melhor agora e se proteger.',
    }
  }

  if (!state.blocker.isEnabled) {
    return {
      key: 'blocker',
      description: 'A protecao ainda esta desligada neste aparelho.',
    }
  }

  return {
    key: 'journal',
    description: 'Seu dia basico esta coberto. Vale registrar contexto ou aprendizados.',
  }
}

export function HomePage() {
  const navigate = useNavigate()
  const { state, demoNow } = useAppState()

  const primaryAction = useMemo(() => getPrimaryAction(state, demoNow), [demoNow, state])
  const hasCheckInDoneToday = hasCheckInToday(state.checkIns, demoNow)
  const lastJournalEntry = state.journalEntries.at(-1) ?? null
  const motivations = state.profile.motivations.slice(0, 4)
  const duplicatedMotivations = motivations.length > 0 ? [...motivations, ...motivations] : []
  const goalProgress = state.profile.goalDays
    ? Math.min(100, Math.round((state.streak.current / state.profile.goalDays) * 100))
    : 0
  const homeSubtitle = hasCheckInDoneToday
    ? `${formatPtDay(demoNow)} | check-in concluido`
    : `${formatPtDay(demoNow)} | check-in pendente`
  const userInitial = state.profile.name?.trim().charAt(0).toUpperCase() || 'C'

  const recentMoodEmojis = state.checkIns
    .slice(-3)
    .map((checkIn) => getMentalStateEmoji(checkIn.mentalState))
  const previewMoodEmojis = recentMoodEmojis.length > 0 ? recentMoodEmojis : ['😐', '😔', '🙂']

  const journalPreview = lastJournalEntry?.title?.trim() || 'Nenhuma entrada ainda.'

  const heroCardClassName =
    state.streak.current === 0
      ? 'info-card highlight-card home-hero-card home-hero-card-zero'
      : 'info-card highlight-card home-hero-card'

  const motionCards = [0, 1, 2, 3]

  return (
    <AppShell
      title={
        state.profile.name ? (
          <>
            Ola, <span>{state.profile.name}</span>
          </>
        ) : (
          'Sua recuperacao'
        )
      }
      eyebrow=""
      subtitle={homeSubtitle}
      actions={<div className="home-avatar">{userInitial}</div>}
    >
      <section className="home-flow">
        <motion.article
          className={heroCardClassName}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: motionCards[0] * 0.08 }}
        >
          <div className="home-hero-top">
            <div className="home-streak-copy">
              <div className="home-streak-number-row">
                <h2>{state.streak.current}</h2>
                <p className="home-streak-label">dias limpos</p>
                <span className="home-streak-icon-shell">
                  {state.streak.current > 0 ? (
                    <Flame className="streak-flame streak-pulse" size={28} />
                  ) : (
                    <Goal className="home-streak-goal" size={26} />
                  )}
                </span>
              </div>
              <div className="home-streak-progress">
                <div className="home-streak-progress-label">
                  <span>
                    {state.streak.current} de {state.profile.goalDays} dias · Maior sequencia:{' '}
                    {state.streak.best} dias
                  </span>
                </div>
                <div className="progress-track home-streak-progress-track">
                  <div
                    className="progress-fill home-streak-progress-fill"
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        <motion.article
          className={
            hasCheckInDoneToday
              ? 'info-card home-checkin-card home-checkin-card-done'
              : 'info-card home-checkin-card'
          }
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: motionCards[1] * 0.08 }}
        >
          <div className="home-checkin-row">
            <div className="home-checkin-main">
              {hasCheckInDoneToday ? (
                <Check className="home-checkin-icon home-checkin-icon-done" size={20} />
              ) : (
                <Circle className="home-checkin-icon" size={20} />
              )}
              <div>
                <h2>Check-in de hoje</h2>
                <p
                  className={
                    hasCheckInDoneToday
                      ? 'home-checkin-state home-checkin-state-done'
                      : 'home-checkin-state'
                  }
                >
                  {hasCheckInDoneToday ? 'Concluido' : 'Pendente'}
                </p>
              </div>
            </div>

            {hasCheckInDoneToday ? null : (
              <button
                className="button button-primary shimmer home-card-button"
                onClick={() => navigate(appRoutes.checkIn)}
              >
                Registrar
              </button>
            )}
          </div>
        </motion.article>

        <motion.article
          className="info-card home-commitment-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: motionCards[2] * 0.08 }}
        >
          <div className="home-commitment-head">
            <Sparkles className="home-commitment-icon" size={24} />
            <div>
              <span className="home-commitment-kicker">compromisso do dia</span>
              <h2>{primaryAction.description}</h2>
            </div>
          </div>
        </motion.article>

        {motivations.length > 0 ? (
          <section className="motivos-section">
            <p className="motivos-label">seus motivos</p>
            <div className="motivos-track-wrapper">
              <div className="motivos-track">
                {duplicatedMotivations.map((motivo, index) => (
                  <div key={`${motivo}-${index}`} className="motivo-pill">
                    <Sparkles size={14} />
                    <span>{motivo}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <motion.section
          className="home-tools-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: motionCards[3] * 0.08 }}
        >
          <div className="home-modules-label">Ferramentas do app</div>

          <div className="home-tools-grid">
            <HomeToolCard
              className="tool-card-checkin"
              iconClassName="tool-card-icon-shell-primary"
              icon={<ClipboardCheck size={22} />}
              title="Check-in"
              onClick={() => navigate(appRoutes.checkIn)}
            >
              <div className="tool-card-emojis" aria-hidden="true">
                {previewMoodEmojis.map((emoji, index) => (
                  <span
                    key={`${emoji}-${index}`}
                    className={
                      recentMoodEmojis.length > 0
                        ? 'tool-card-emoji'
                        : 'tool-card-emoji tool-card-emoji-faded'
                    }
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              <span
                className={
                  hasCheckInDoneToday
                    ? 'tool-card-status tool-card-status-success'
                    : 'tool-card-status'
                }
              >
                {hasCheckInDoneToday ? 'feito hoje' : 'pendente'}
              </span>
            </HomeToolCard>

            <HomeToolCard
              className="tool-card-blocker"
              iconClassName="tool-card-icon-shell-success"
              icon={<ShieldCheck size={22} />}
              title="Bloqueador"
              onClick={() => navigate(appRoutes.blocker)}
            >
              {state.blocker.isEnabled ? (
                <div className="tool-card-blocker-state">
                  <span className="tool-card-dot tool-card-dot-success" />
                  <strong>Protegido</strong>
                </div>
              ) : (
                <div className="tool-card-blocker-state tool-card-blocker-state-off">
                  <strong>Desativado</strong>
                </div>
              )}
            </HomeToolCard>
          </div>

          <article className="tool-card-journal" onClick={() => navigate(appRoutes.journal)}>
            <div className="tool-card-journal-icon-shell">
              <div className="tool-card-journal-icon">
                <BookOpen size={20} />
              </div>
            </div>
            <div className="tool-card-journal-copy">
              <strong>Jornal</strong>
              <p>{journalPreview}</p>
            </div>
            <ChevronRight className="tool-card-journal-chevron" size={18} />
          </article>
        </motion.section>
      </section>
    </AppShell>
  )
}
