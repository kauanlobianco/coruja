import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { hasCheckInToday } from '../../core/domain/check-in'

function formatPtDate(value: string | null) {
  if (!value) {
    return 'ainda nao registrado'
  }

  return new Date(value).toLocaleString('pt-BR')
}

function getPrimaryAction(state: ReturnType<typeof useAppState>['state']) {
  if (!hasCheckInToday(state.checkIns)) {
    return {
      label: 'Fazer check-in de hoje',
      description: 'Seu check-in diario ainda nao foi registrado.',
      path: '/check-in',
    }
  }

  if (state.blocker.isEnabled && state.blocker.blockedDomains.length === 0) {
    return {
      label: 'Revisar bloqueador',
      description: 'A protecao esta ligada, mas a lista precisa ser revisada.',
      path: '/blocker',
    }
  }

  return {
    label: 'Abrir SOS preventivo',
    description: 'Seu check-in de hoje ja foi salvo. Mantenha o ritmo com apoio rapido.',
    path: '/sos',
  }
}

export function HomePage() {
  const navigate = useNavigate()
  const app = useAppState()
  const { state, markSyncNow } = app

  const recentCheckIns = [...state.checkIns].slice(-3).reverse()
  const recentJournal = [...state.journalEntries].slice(-2).reverse()
  const motivations = state.profile.motivations.slice(0, 4)
  const hasCheckInDoneToday = hasCheckInToday(state.checkIns)
  const primaryAction = useMemo(() => getPrimaryAction(state), [state])

  return (
    <AppShell
      title={state.profile.name ? `Ola, ${state.profile.name}` : 'Sua rotina de recuperacao'}
      eyebrow="Home"
      actions={
        <>
          <button
            className="button button-primary"
            onClick={() => navigate(primaryAction.path)}
          >
            {primaryAction.label}
          </button>
          <button className="button button-secondary" onClick={() => navigate('/journal')}>
            Abrir jornal
          </button>
          <button className="button button-secondary" onClick={() => navigate('/blocker')}>
            {state.blocker.isEnabled ? 'Protecao ativa' : 'Configurar bloqueador'}
          </button>
          <button className="button button-secondary" onClick={() => void markSyncNow()}>
            Sincronizar agora
          </button>
        </>
      }
    >
      <section className="info-card highlight-card home-hero-card">
        <span className="section-label">Seu progresso</span>
        <h2>{state.streak.current} dias de streak</h2>
        <p>{primaryAction.description}</p>
        <div className="home-stats-grid">
          <div className="metric-card">
            <strong>{state.profile.goalDays}</strong>
            <span>meta atual</span>
          </div>
          <div className="metric-card">
            <strong>{state.streak.best}</strong>
            <span>melhor marca</span>
          </div>
          <div className="metric-card">
            <strong>{hasCheckInDoneToday ? 'feito' : 'pendente'}</strong>
            <span>check-in de hoje</span>
          </div>
          <div className="metric-card">
            <strong>{state.sos.totalSessions}</strong>
            <span>sessoes SOS</span>
          </div>
        </div>
      </section>

      <section className="panel-stack">
        <div className="section-header">
          <div>
            <span className="section-label">Rotina do dia</span>
            <h2>O que mais importa agora</h2>
          </div>
        </div>

        <div className="card-grid">
          <article className="info-card">
            <span className="section-label">Acao principal</span>
            <h2>{primaryAction.label}</h2>
            <p>{primaryAction.description}</p>
            <div className="hero-actions">
              <button
                className="button button-primary"
                onClick={() => navigate(primaryAction.path)}
              >
                Continuar
              </button>
              <button className="button button-secondary" onClick={() => navigate('/analytics')}>
                Ver analytics
              </button>
            </div>
          </article>

          <article className="info-card">
            <span className="section-label">Protecao</span>
            <h2>{state.blocker.isEnabled ? 'Bloqueador ativo' : 'Bloqueador desligado'}</h2>
            <p>
              Dominios protegidos: {state.blocker.blockedDomains.length || 11} | Tentativas:{' '}
              {state.blocker.blockedAttempts.length}
            </p>
            <p>
              {state.blocker.isEnabled
                ? 'A camada nativa do Android esta pronta para segurar momentos vulneraveis.'
                : 'Ative a protecao para reduzir exposicao nos horarios mais criticos.'}
            </p>
            <button className="button button-secondary" onClick={() => navigate('/blocker')}>
              Abrir bloqueador
            </button>
          </article>
        </div>
      </section>

      <section className="panel-stack">
        <div className="section-header">
          <div>
            <span className="section-label">Suas ancoras</span>
            <h2>Motivos para continuar</h2>
          </div>
          <button className="text-link" onClick={() => navigate('/onboarding')}>
            Revisar onboarding
          </button>
        </div>

        {motivations.length === 0 ? (
          <article className="info-card">
            <h2>Motivos ainda nao definidos</h2>
            <p>
              O onboarding pode ser revisitado para salvar ancoras mais fortes e usar isso
              no SOS e na tela de bloqueio.
            </p>
          </article>
        ) : (
          <div className="card-grid">
            {motivations.map((motivation) => (
              <article key={motivation} className="info-card">
                <span className="section-label">Motivo</span>
                <h2>{motivation}</h2>
                <p>Esse motivo acompanha a home, o SOS e os momentos de bloqueio.</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel-stack">
        <div className="section-header">
          <div>
            <span className="section-label">Resumo recente</span>
            <h2>Historico vivo do usuario</h2>
          </div>
        </div>

        <div className="card-grid">
          <article className="info-card">
            <span className="section-label">Check-ins</span>
            <h2>Ultimos registros</h2>
            {recentCheckIns.length === 0 ? (
              <p>Nenhum check-in salvo ainda.</p>
            ) : (
              <div className="timeline-list">
                {recentCheckIns.map((entry) => (
                  <div key={entry.id} className="timeline-item">
                    <strong>{formatPtDate(entry.createdAt)}</strong>
                    <p>
                      Fissura {entry.craving}/10 | Estado {entry.mentalState} | SOS:{' '}
                      {entry.escalatedToSos ? 'sim' : 'nao'}
                    </p>
                    <p>
                      {entry.triggers.length > 0
                        ? `Gatilhos: ${entry.triggers.join(', ')}`
                        : 'Nenhum gatilho informado.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="info-card">
            <span className="section-label">Jornal e recaidas</span>
            <h2>Contexto emocional</h2>
            <p>Entradas do jornal: {state.journalEntries.length}</p>
            <p>Recaidas registradas: {state.relapses.length}</p>
            <p>Ultima recaida: {formatPtDate(state.streak.lastRelapseAt)}</p>
            {recentJournal.length > 0 ? (
              <div className="timeline-list">
                {recentJournal.map((entry) => (
                  <div key={entry.id} className="timeline-item">
                    <strong>{entry.title}</strong>
                    <p>{formatPtDate(entry.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </article>

          <article className="info-card">
            <span className="section-label">Conta e backup</span>
            <h2>Base segura</h2>
            <p>Conta vinculada: {state.account ? 'sim' : 'nao'}</p>
            <p>Backup remoto: {state.backup.hasRemoteBackup ? 'encontrado' : 'ainda nao confirmado'}</p>
            <p>Ultimo sync: {formatPtDate(state.account?.lastBackupAt ?? null)}</p>
            <p>Ultimo restore: {formatPtDate(state.account?.lastRestoreAt ?? null)}</p>
            {state.backup.lastError ? <p>Erro atual: {state.backup.lastError}</p> : null}
          </article>
        </div>
      </section>
    </AppShell>
  )
}
