import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { buildAnalyticsReport } from '../../core/domain/analytics'

const rangeOptions = [7, 14, 30]

export function AnalyticsPage() {
  const { state, setAnalyticsRange } = useAppState()
  const report = buildAnalyticsReport({
    checkIns: state.checkIns,
    relapses: state.relapses,
    analytics: state.analytics,
  })

  const hasEnoughData = report.uniqueCheckInDays >= 3

  return (
    <AppShell title="Analytics" eyebrow="Leitura do progresso">
      <section className="form-card">
        <span className="section-label">Periodo</span>
        <h2>Janela de análise</h2>
        <div className="chip-row">
          {rangeOptions.map((option) => (
            <button
              key={option}
              className={
                state.analytics.selectedRangeDays === option ? 'chip active' : 'chip'
              }
              type="button"
              onClick={() => void setAnalyticsRange(option)}
            >
              {option} dias
            </button>
          ))}
        </div>
      </section>

      <section className="panel-stack">
        <div className="card-grid">
          <article className="info-card highlight-card">
            <span className="section-label">Recovery score</span>
            <h2>{report.recoveryScore}</h2>
            <p>
              Score derivado dos check-ins recentes e das recaídas no período,
              sem depender do nome das categorias.
            </p>
          </article>

          <article className="info-card">
            <span className="section-label">Base de dados</span>
            <h2>{report.periodCheckIns.length} check-ins</h2>
            <p>Dias únicos: {report.uniqueCheckInDays}</p>
            <p>Recaídas no período: {report.periodRelapses.length}</p>
          </article>

          <article className="info-card">
            <span className="section-label">Craving media</span>
            <h2>{report.averageCraving.toFixed(1)}/10</h2>
            <p>
              Média simples da fissura salva nos check-ins do período
              selecionado.
            </p>
          </article>
        </div>

        {!hasEnoughData ? (
          <article className="info-card">
            <span className="section-label">Dados insuficientes</span>
            <h2>Analytics completa bloqueada por enquanto</h2>
            <p>
              Mantive a regra do legado: é preciso ter pelo menos 3 dias únicos
              de check-in para considerar o painel mais confiável.
            </p>
          </article>
        ) : null}

        <div className="card-grid">
          <article className="info-card">
            <span className="section-label">Estados mentais</span>
            <h2>Distribuição por ocorrência</h2>
            {report.dominantMentalStates.length === 0 ? (
              <p>Nenhum estado mental salvo no período.</p>
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
            <h2>Ranking por frequência</h2>
            {report.dominantTriggers.length === 0 ? (
              <p>Nenhum gatilho salvo no período.</p>
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
          <h2>Media diária no período</h2>
          {report.cravingSeries.length === 0 ? (
            <p>Nenhum check-in no período selecionado.</p>
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
