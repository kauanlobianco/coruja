import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { buildAnalyticsReport } from '../../core/domain/analytics'

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
    <AppShell title="Analytics" eyebrow="Leitura do progresso">
      <section className="form-card">
        <span className="section-label">Periodo</span>
        <h2>Janela de analise</h2>
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
          <span className="section-label">Evolucao</span>
          <h2>{report.trendHeadline}</h2>
          <p>{report.trendBody}</p>
          <div className="analytics-hero-grid">
            <div className="metric-card">
              <strong>{report.recoveryScore}</strong>
              <span>score atual</span>
            </div>
            <div className="metric-card">
              <strong>{formatSignedDelta(report.recoveryDelta)}</strong>
              <span>vs periodo anterior</span>
            </div>
            <div className="metric-card">
              <strong>{formatSignedDelta(report.cravingDelta, '/10')}</strong>
              <span>queda de fissura</span>
            </div>
            <div className="metric-card">
              <strong>{report.consistencyScore}%</strong>
              <span>consistencia da rotina</span>
            </div>
          </div>
        </article>

        <div className="card-grid">
          <article className="info-card">
            <span className="section-label">Historico recente</span>
            <h2>{report.periodCheckIns.length} check-ins</h2>
            <p>Ultimo registro: {formatPtDateTime(report.lastCheckInAt)}</p>
            <p>Janela anterior: {report.previousPeriodCheckIns.length} check-ins.</p>
          </article>

          <article className="info-card">
            <span className="section-label">Consistencia</span>
            <h2>{report.uniqueCheckInDays} dias ativos</h2>
            <p>De {report.periodDays} dias observados no periodo atual.</p>
            <p>Periodo anterior: {report.previousUniqueCheckInDays} dias ativos.</p>
          </article>

          <article className="info-card">
            <span className="section-label">Fissura media</span>
            <h2>{report.averageCraving.toFixed(1)}/10</h2>
            <p>Periodo anterior: {report.previousAverageCraving.toFixed(1)}/10.</p>
            <p>Recaidas no periodo: {report.periodRelapses.length}</p>
          </article>
        </div>

        {!hasEnoughData ? (
          <article className="info-card">
            <span className="section-label">Dados insuficientes</span>
            <h2>Analytics completa bloqueada por enquanto</h2>
            <p>
              Mantive a regra do legado: e preciso ter pelo menos 3 dias unicos de check-in
              para considerar o painel mais confiavel.
            </p>
          </article>
        ) : null}

        <article className="info-card">
          <div className="section-header analytics-section-head">
            <div>
              <span className="section-label">Linha do tempo</span>
              <h2>Seu historico visivel</h2>
            </div>
            <span className="status-pill">{report.recentCheckIns.length} registro(s)</span>
          </div>
          {report.recentCheckIns.length === 0 ? (
            <p>
              Assim que voce registrar check-ins, esta linha do tempo vai mostrar a evolucao
              recente.
            </p>
          ) : (
            <div className="analytics-timeline">
              {report.recentCheckIns.map((entry) => (
                <article key={entry.id} className="analytics-timeline-item">
                  <div className="analytics-timeline-head">
                    <strong>{formatPtDateTime(entry.createdAt)}</strong>
                    <span className="status-pill">fissura {entry.craving}/10</span>
                  </div>
                  <p>Estado: {entry.mentalState}</p>
                  <p>
                    {entry.triggers.length > 0
                      ? `Gatilhos: ${entry.triggers.join(', ')}.`
                      : 'Sem gatilhos registrados neste check-in.'}
                  </p>
                  {entry.notes ? <p>Anotacao: {entry.notes}</p> : null}
                </article>
              ))}
            </div>
          )}
        </article>

        <div className="card-grid">
          <article className="info-card">
            <span className="section-label">Estados mentais</span>
            <h2>Frequencia no periodo</h2>
            {report.dominantMentalStates.length === 0 ? (
              <p>Nenhum estado mental salvo no periodo.</p>
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
            <h2>Ranking por frequencia</h2>
            {report.dominantTriggers.length === 0 ? (
              <p>Nenhum gatilho salvo no periodo.</p>
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
          <span className="section-label">Serie de fissura</span>
          <h2>Media diaria do periodo</h2>
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
