import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../app/state/use-app-state'
import { AppShell } from '../../shared/layout/AppShell'
import { hasCheckInToday } from '../../core/domain/check-in'
import { appRoutes } from '../../core/config/routes'

function formatPtDate(value: string | null) {
  if (!value) {
    return 'ainda nao registrado'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getPrimaryAction(state: ReturnType<typeof useAppState>['state'], now: Date) {
  if (!hasCheckInToday(state.checkIns, now)) {
    return {
      key: 'check-in',
      label: 'Fazer check-in de hoje',
      description: 'Seu check-in diario ainda esta pendente e deve abrir a rotina principal.',
      path: appRoutes.checkIn,
    }
  }

  const lastCheckIn = state.checkIns.at(-1)
  if (lastCheckIn && lastCheckIn.craving >= 7) {
    return {
      key: 'sos',
      label: 'Ir para Panico agora',
      description: `Sua ultima fissura foi ${lastCheckIn.craving}/10. Vale reforcar a protecao antes que ela cresca.`,
      path: appRoutes.sos,
    }
  }

  if (!state.blocker.isEnabled) {
    return {
      key: 'blocker',
      label: 'Ativar bloqueador',
      description: 'A camada de protecao ainda esta desligada para este dispositivo.',
      path: appRoutes.blocker,
    }
  }

  return {
    key: 'journal',
    label: 'Escrever no journal',
    description: 'O basico do dia esta coberto. Registre contexto para consolidar a rotina.',
    path: appRoutes.journal,
  }
}

function getTodaySummary(state: ReturnType<typeof useAppState>['state'], now: Date) {
  const checkInDone = hasCheckInToday(state.checkIns, now)
  const lastCheckIn = state.checkIns.at(-1) ?? null

  if (!checkInDone) {
    return 'Hoje ainda nao foi registrado. O primeiro passo do dia e medir como voce esta.'
  }

  if (lastCheckIn && lastCheckIn.craving >= 7) {
    return 'Seu ultimo check-in indicou alta vulnerabilidade. O foco agora e reduzir risco, nao testar autocontrole.'
  }

  if (state.blocker.isEnabled) {
    return 'Seu check-in foi feito e a protecao esta ligada. O objetivo agora e sustentar consistencia.'
  }

  return 'Seu check-in foi feito. O proximo passo inteligente e ligar a protecao ou registrar contexto no journal.'
}

export function HomePage() {
  const navigate = useNavigate()
  const { state, demoNow } = useAppState()

  const primaryAction = useMemo(() => getPrimaryAction(state, demoNow), [demoNow, state])
  const hasCheckInDoneToday = hasCheckInToday(state.checkIns, demoNow)
  const lastCheckIn = state.checkIns.at(-1) ?? null
  const lastJournalEntry = state.journalEntries.at(-1) ?? null
  const motivations = state.profile.motivations.slice(0, 4)
  const goalProgress = state.profile.goalDays
    ? Math.min(100, Math.round((state.streak.current / state.profile.goalDays) * 100))
    : 0
  const todaySummary = useMemo(() => getTodaySummary(state, demoNow), [demoNow, state])
  const orderedCards = useMemo(() => {
    const cards = [
      {
        key: 'check-in',
        element: (
          <article
            key="check-in"
            className="info-card home-list-card"
            onClick={() => navigate(appRoutes.checkIn)}
          >
            <div className="home-list-head">
              <div>
                <span className="section-label">Check-in</span>
                <h2>Check-in do dia</h2>
              </div>
              <div className="home-card-status">
                {primaryAction.key === 'check-in' ? <span className="status-pill status-next">Recomendado</span> : null}
                <span className={hasCheckInDoneToday ? 'status-pill status-ready' : 'status-pill status-next'}>
                  {hasCheckInDoneToday ? 'Concluido' : 'Pendente'}
                </span>
              </div>
            </div>
            {lastCheckIn ? (
              <div className="home-item-body">
                <p>Ultimo registro em {formatPtDate(lastCheckIn.createdAt)}</p>
                <p>
                  Fissura {lastCheckIn.craving}/10, estado {lastCheckIn.mentalState} e{' '}
                  {lastCheckIn.triggers.length} gatilho(s) mapeado(s).
                </p>
              </div>
            ) : (
              <p>Sem registro hoje. Esta e a primeira acao importante da sua rotina.</p>
            )}
            {primaryAction.key === 'check-in' ? <p>{todaySummary}</p> : null}
            <span className="text-link">Abrir check-in</span>
          </article>
        ),
      },
      {
        key: 'journal',
        element: (
          <article
            key="journal"
            className="info-card home-list-card"
            onClick={() => navigate(appRoutes.journal)}
          >
            <div className="home-list-head">
              <div>
                <span className="section-label">Journal</span>
                <h2>Reflexao e contexto</h2>
              </div>
              <div className="home-card-status">
                {primaryAction.key === 'journal' ? <span className="status-pill status-next">Recomendado</span> : null}
                <span className="status-pill">{state.journalEntries.length} entrada(s)</span>
              </div>
            </div>
            {lastJournalEntry ? (
              <div className="home-item-body">
                <p>Ultima entrada em {formatPtDate(lastJournalEntry.createdAt)}</p>
                <p>{lastJournalEntry.title}</p>
              </div>
            ) : (
              <p>Escreva para clarear o momento e guardar aprendizados da jornada.</p>
            )}
            {primaryAction.key === 'journal' ? <p>{todaySummary}</p> : null}
            <span className="text-link">Abrir journal</span>
          </article>
        ),
      },
      {
        key: 'blocker',
        element: (
          <article
            key="blocker"
            className="info-card home-list-card"
            onClick={() => navigate(appRoutes.blocker)}
          >
            <div className="home-list-head">
              <div>
                <span className="section-label">Bloqueador</span>
                <h2>Protecao de sites</h2>
              </div>
              <div className="home-card-status">
                {primaryAction.key === 'blocker' ? <span className="status-pill status-next">Recomendado</span> : null}
                <span
                  className={
                    state.blocker.isEnabled ? 'status-pill status-ready' : 'status-pill status-later'
                  }
                >
                  {state.blocker.isEnabled ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            <div className="home-item-body">
              <p>
                {state.blocker.isEnabled
                  ? `${state.blocker.blockedDomains.length || 11} dominios protegidos e ${state.blocker.blockedAttempts.length} tentativa(s) bloqueada(s).`
                  : 'Ative a protecao para reduzir exposicao em momentos vulneraveis.'}
              </p>
              {state.blocker.blockedAttempts.length > 0 ? (
                <p>
                  Ultimo bloqueio em{' '}
                  {formatPtDate(state.blocker.blockedAttempts.at(-1)?.createdAt ?? null)}.
                </p>
              ) : null}
            </div>
            {primaryAction.key === 'blocker' ? <p>{todaySummary}</p> : null}
            <span className="text-link">Abrir bloqueador</span>
          </article>
        ),
      },
    ]

    return [...cards].sort((left, right) => {
      if (left.key === primaryAction.key) {
        return -1
      }

      if (right.key === primaryAction.key) {
        return 1
      }

      return 0
    })
  }, [
    hasCheckInDoneToday,
    lastCheckIn,
    lastJournalEntry,
    navigate,
    primaryAction.key,
    state.blocker.blockedAttempts,
    state.blocker.blockedDomains.length,
    state.blocker.isEnabled,
    state.journalEntries.length,
    todaySummary,
  ])

  return (
    <AppShell
      title={state.profile.name ? `Ola, ${state.profile.name}` : 'Sua recuperacao'}
      eyebrow="Home"
    >
      <section className="panel-stack home-flow">
        <article className="info-card highlight-card home-hero-card">
          <div className="home-list-head">
            <div>
              <span className="section-label">Streak</span>
              <h2>{state.streak.current} dias</h2>
            </div>
            <span className="status-pill">{goalProgress}% da meta</span>
          </div>
          <p>
            Meta atual de {state.profile.goalDays} dias. Melhor marca: {state.streak.best} dias.
          </p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${goalProgress}%` }} />
          </div>
          <div className="home-stats-grid">
            <div className="metric-card">
              <strong>{hasCheckInDoneToday ? 'feito' : 'pendente'}</strong>
              <span>check-in de hoje</span>
            </div>
            <div className="metric-card">
              <strong>{state.blocker.isEnabled ? 'ativa' : 'inativa'}</strong>
              <span>protecao deste device</span>
            </div>
            <div className="metric-card">
              <strong>{state.relapses.length}</strong>
              <span>recaidas registradas</span>
            </div>
            <div className="metric-card">
              <strong>{state.sos.totalSessions}</strong>
              <span>sessoes de panico</span>
            </div>
          </div>
        </article>

        {orderedCards.map((card) => card.element)}

        <section className="panel-stack">
          <div className="section-header">
            <div>
              <span className="section-label">Motivos</span>
              <h2>Suas ancoras</h2>
            </div>
          </div>

          {motivations.length === 0 ? (
            <article className="info-card">
              <p>Seus motivos ainda nao foram definidos. Revise o onboarding para preencher isso.</p>
            </article>
          ) : (
            <div className="home-motivos-grid">
              {motivations.map((motivation) => (
                <article key={motivation} className="info-card motivo-card-lite">
                  <span className="section-label">Motivo</span>
                  <h2>{motivation}</h2>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </AppShell>
  )
}
