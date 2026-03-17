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

function getTodaySummary(state: ReturnType<typeof useAppState>['state'], now: Date) {
  const checkInDone = hasCheckInToday(state.checkIns, now)
  const lastCheckIn = state.checkIns.at(-1) ?? null

  if (!checkInDone) {
    return 'Hoje ainda nao foi registrado. Comece entendendo como voce esta agora.'
  }

  if (lastCheckIn && lastCheckIn.craving >= 7) {
    return 'Seu ultimo check-in mostrou um momento delicado. O foco agora e reduzir risco.'
  }

  if (state.blocker.isEnabled) {
    return 'Seu check-in foi feito e sua protecao esta ligada. Agora e sustentar o dia.'
  }

  return 'Seu check-in foi feito. O proximo passo inteligente e ligar a protecao ou escrever no Jornal.'
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
                <h2>Registrar como voce esta</h2>
              </div>
              <div className="home-card-status">
                {primaryAction.key === 'check-in' ? (
                  <span className="status-pill status-next">Recomendado</span>
                ) : null}
                <span
                  className={
                    hasCheckInDoneToday ? 'status-pill status-ready' : 'status-pill status-next'
                  }
                >
                  {hasCheckInDoneToday ? 'Feito' : 'Pendente'}
                </span>
              </div>
            </div>
            {lastCheckIn ? (
              <div className="home-item-body">
                <p>Ultimo registro em {formatPtDate(lastCheckIn.createdAt)}</p>
                <p>
                  Vontade {lastCheckIn.craving}/10, estado {lastCheckIn.mentalState} e{' '}
                  {lastCheckIn.triggers.length} gatilho(s) marcado(s).
                </p>
              </div>
            ) : (
              <p>Sem registro hoje. Este e o primeiro passo importante do seu dia.</p>
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
                <span className="section-label">Jornal</span>
                <h2>Clarear o momento</h2>
              </div>
              <div className="home-card-status">
                {primaryAction.key === 'journal' ? (
                  <span className="status-pill status-next">Recomendado</span>
                ) : null}
                <span className="status-pill">{state.journalEntries.length} entrada(s)</span>
              </div>
            </div>
            {lastJournalEntry ? (
              <div className="home-item-body">
                <p>Ultima entrada em {formatPtDate(lastJournalEntry.createdAt)}</p>
                <p>{lastJournalEntry.title}</p>
              </div>
            ) : (
              <p>Use o Jornal para registrar contexto, aprendizados e o que esta pesando no dia.</p>
            )}
            {primaryAction.key === 'journal' ? <p>{todaySummary}</p> : null}
            <span className="text-link">Abrir Jornal</span>
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
                <h2>Proteger seu ambiente</h2>
              </div>
              <div className="home-card-status">
                {primaryAction.key === 'blocker' ? (
                  <span className="status-pill status-next">Recomendado</span>
                ) : null}
                <span
                  className={
                    state.blocker.isEnabled
                      ? 'status-pill status-ready'
                      : 'status-pill status-later'
                  }
                >
                  {state.blocker.isEnabled ? 'Ativo' : 'Desligado'}
                </span>
              </div>
            </div>
            <div className="home-item-body">
              <p>
                {state.blocker.isEnabled
                  ? `${state.blocker.blockedDomains.length || 11} dominios protegidos e ${state.blocker.blockedAttempts.length} tentativa(s) interrompida(s).`
                  : 'Ative a protecao para reduzir exposicao em momentos vulneraveis.'}
              </p>
              {state.blocker.blockedAttempts.length > 0 ? (
                <p>
                  Ultima interrupcao em{' '}
                  {formatPtDate(state.blocker.blockedAttempts.at(-1)?.createdAt ?? null)}.
                </p>
              ) : null}
            </div>
            {primaryAction.key === 'blocker' ? <p>{todaySummary}</p> : null}
            <span className="text-link">Abrir Bloqueador</span>
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
              <span className="section-label">Seu streak</span>
              <h2>{state.streak.current} dias</h2>
            </div>
            <span className="status-pill">{goalProgress}% da meta</span>
          </div>
          <p>
            Meta atual de {state.profile.goalDays} dias. Sua melhor marca ate aqui foi de{' '}
            {state.streak.best} dias.
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
              <strong>{state.blocker.isEnabled ? 'ativa' : 'desligada'}</strong>
              <span>protecao do aparelho</span>
            </div>
            <div className="metric-card">
              <strong>{state.relapses.length}</strong>
              <span>recaida(s) registradas</span>
            </div>
            <div className="metric-card">
              <strong>{state.sos.totalSessions}</strong>
              <span>uso(s) do SOS</span>
            </div>
          </div>
        </article>

        <article className="info-card">
          <span className="section-label">Hoje</span>
          <h2>{todaySummary}</h2>
          <p>{primaryAction.description}</p>
        </article>

        {orderedCards.map((card) => card.element)}

        <article
          className="info-card home-list-card"
          onClick={() => navigate(appRoutes.relapse)}
        >
          <div className="home-list-head">
            <div>
              <span className="section-label">Recaida</span>
              <h2>Registrar um recomeco</h2>
            </div>
            <div className="home-card-status">
              <span className="status-pill">{state.relapses.length} registro(s)</span>
            </div>
          </div>
          <div className="home-item-body">
            <p>
              Se voce teve um deslize, registre esse momento com clareza para recomecar sem
              abandonar a jornada.
            </p>
            {state.relapses.length > 0 ? (
              <p>
                Ultimo registro em {formatPtDate(state.relapses.at(-1)?.createdAt ?? null)}.
              </p>
            ) : null}
          </div>
          <span className="text-link">Abrir recaida</span>
        </article>

        <section className="panel-stack">
          <div className="section-header">
            <div>
              <span className="section-label">Motivos</span>
              <h2>O que voce quer proteger</h2>
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
