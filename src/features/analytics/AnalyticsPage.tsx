import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { buildAnalyticsReport } from '../../core/domain/analytics'
import { Link } from 'react-router-dom'

const rangeOptions = [7, 14, 30]

function formatPtDateTime(value: string | null) {
  if (!value) {
    return 'ainda sem registro'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatSignedDelta(value: number, suffix = '') {
  if (value === 0) {
    return `0${suffix}`
  }

  return `${value > 0 ? '+' : ''}${value}${suffix}`
}

export function AnalyticsPage() {
  const { state, setAnalyticsRange, demoNow } = useAppState()
  const report = buildAnalyticsReport({
    checkIns: state.checkIns,
    relapses: state.relapses,
    analytics: state.analytics,
    now: demoNow,
  })

  const hasEnoughData = report.uniqueCheckInDays >= 3
  const trendClassName =
    report.trendLabel === 'improving'
      ? 'info-card highlight-card analytics-trend-card trend-positive'
      : report.trendLabel === 'attention'
        ? 'info-card analytics-trend-card trend-warning'
        : 'info-card analytics-trend-card'

  return (
    <AppShell title="Analytics" eyebrow="Historico e evolucao">
      <section className="form-card">
        <span className="section-label">Periodo</span>
        <h2>Veja sua evolucao no tempo</h2>
        <div className="chip-row">
          {rangeOptions.map((option) => (
            <button
              key={option}
              className={state.analytics.selectedRangeDays === option ? 'chip active' : 'chip'}
              type="button"
              onClick={() => void setAnalyticsRange(option)}
            >
              {option} dias
            </button>
          ))}
        </div>
      </section>

      <section className="panel-stack">
        <article className={trendClassName}>
          <span className="section-label">Visao geral</span>
          <h2>{report.trendHeadline}</h2>
          <p>{report.trendBody}</p>
          <div className="analytics-hero-grid">
            <div className="metric-card">
              <strong>{report.recoveryScore}</strong>
              <span>score atual</span>
            </div>
            <div className="metric-card">
              <strong>{formatSignedDelta(report.recoveryDelta)}</strong>
              <span>vs antes</span>
            </div>
            <div className="metric-card">
              <strong>{formatSignedDelta(report.cravingDelta, '/10')}</strong>
              <span>mudanca na vontade</span>
            </div>
            <div className="metric-card">
              <strong>{report.consistencyScore}%</strong>
              <span>consistencia</span>
            </div>
          </div>
        </article>

        <div className="card-grid">
          <article className="info-card">
            <span className="section-label">Historico</span>
            <h2>{report.periodCheckIns.length} check-ins</h2>
            <p>Ultimo registro: {formatPtDateTime(report.lastCheckInAt)}</p>
            <p>Antes: {report.previousPeriodCheckIns.length} check-ins.</p>
          </article>

          <article className="info-card">
            <span className="section-label">Dias ativos</span>
            <h2>{report.uniqueCheckInDays} dias</h2>
            <p>De {report.periodDays} dias no periodo atual.</p>
            <p>Antes: {report.previousUniqueCheckInDays} dias.</p>
          </article>

          <article className="info-card">
            <span className="section-label">Vontade media</span>
            <h2>{report.averageCraving.toFixed(1)}/10</h2>
            <p>Antes: {report.previousAverageCraving.toFixed(1)}/10.</p>
            <p>Recaidas: {report.periodRelapses.length}</p>
          </article>
        </div>

        {!hasEnoughData ? (
          <article className="info-card">
            <span className="section-label">Ainda nao liberado</span>
            <div className="empty-state">
              <h2>Seu painel vai ficar melhor com mais alguns registros</h2>
              <p>Faca check-ins em pelo menos 3 dias diferentes para liberar uma leitura mais confiavel.</p>
            </div>
            <div className="toolbar">
              <Link className="button button-secondary" to="/app">
                Voltar para a Home
              </Link>
              <Link className="button button-primary shimmer" to="/check-in">
                Fazer check-in
              </Link>
            </div>
          </article>
        ) : null}

        <article className="info-card">
          <div className="section-header analytics-section-head">
            <div>
              <span className="section-label">Linha do tempo</span>
              <h2>Seus registros recentes</h2>
            </div>
            <span className="status-pill">{report.recentCheckIns.length} registro(s)</span>
          </div>
          {report.recentCheckIns.length === 0 ? (
            <p>Seus registros mais recentes vao aparecer aqui.</p>
          ) : (
            <div className="analytics-timeline">
              {report.recentCheckIns.map((entry) => (
                <article key={entry.id} className="analytics-timeline-item">
                  <div className="analytics-timeline-head">
                    <strong>{formatPtDateTime(entry.createdAt)}</strong>
                    <span className="status-pill">vontade {entry.craving}/10</span>
                  </div>
                  <p>Estado: {entry.mentalState}</p>
                  <p>
                    {entry.triggers.length > 0
                      ? `Gatilhos: ${entry.triggers.join(', ')}.`
                      : 'Sem gatilhos registrados.'}
                  </p>
                  {entry.notes ? <p>Anotacao: {entry.notes}</p> : null}
                </article>
              ))}
            </div>
          )}
        </article>

        <div className="card-grid">
          <article className="info-card">
            <span className="section-label">Estados</span>
            <h2>O que mais aparece</h2>
            {report.dominantMentalStates.length === 0 ? (
              <p>Nenhum estado registrado neste periodo.</p>
            ) : (
              <div className="bar-list">
                {report.dominantMentalStates.slice(0, 5).map((item) => (
                  <div key={item.key} className="bar-item">
                    <div className="bar-label-row">
                      <span>{item.label}</span>
                      <strong>{item.count}</strong>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(item.count / report.dominantMentalStates[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="info-card">
            <span className="section-label">Gatilhos</span>
            <h2>O que mais pesa</h2>
            {report.dominantTriggers.length === 0 ? (
              <p>Nenhum gatilho registrado neste periodo.</p>
            ) : (
              <div className="bar-list">
                {report.dominantTriggers.slice(0, 5).map((item) => (
                  <div key={item.key} className="bar-item">
                    <div className="bar-label-row">
                      <span>{item.label}</span>
                      <strong>{item.count}</strong>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(item.count / report.dominantTriggers[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <article className="info-card">
          <span className="section-label">Serie do periodo</span>
          <h2>Como sua vontade vem mudando</h2>
          {report.cravingSeries.length === 0 ? (
            <p>Nenhum check-in no periodo selecionado.</p>
          ) : (
            <div className="bar-list">
              {report.cravingSeries.map((item) => (
                <div key={item.dayKey} className="bar-item">
                  <div className="bar-label-row">
                    <span>
                      {new Date(item.dayKey).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>
                    <strong>{item.averageCraving.toFixed(1)}/10</strong>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill bar-fill-cool"
                      style={{ width: `${(item.averageCraving / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </AppShell>
  )
}
