import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { buildCheckInStrategy, hasCheckInToday } from '../../core/domain/check-in'

const mentalStates = [
  { id: 'calmo', label: 'Calmo', note: 'Sem muita pressao percebida agora.' },
  { id: 'ansioso', label: 'Ansioso', note: 'Mente acelerada e mais vulneravel ao impulso.' },
  { id: 'cansado', label: 'Cansado', note: 'Pouca energia costuma reduzir o autocontrole.' },
  { id: 'frustrado', label: 'Frustrado', note: 'Atrito emocional pode empurrar decisoes impulsivas.' },
]

const fallbackTriggers = ['Ansiedade', 'Celular a noite', 'Tedio', 'Estresse']

function getCravingLabel(craving: number) {
  if (craving >= 8) {
    return 'Muito alta. Nao vale enfrentar isso sozinho.'
  }

  if (craving >= 5) {
    return 'Moderada. Vale intervir antes que cresca.'
  }

  if (craving >= 2) {
    return 'Baixa, mas ainda pede atencao.'
  }

  return 'Tranquila. Bom momento para consolidar rotina.'
}

export function CheckInPage() {
  const navigate = useNavigate()
  const { state, saveCheckIn, demoNow } = useAppState()
  const [craving, setCraving] = useState(0)
  const [mentalState, setMentalState] = useState<string | null>(null)
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [showStrategy, setShowStrategy] = useState(false)

  const alreadyCheckedIn = useMemo(
    () => hasCheckInToday(state.checkIns, demoNow),
    [demoNow, state.checkIns],
  )
  const availableTriggers =
    state.profile.triggers.length > 0 ? state.profile.triggers : fallbackTriggers

  const strategy =
    mentalState === null
      ? null
      : buildCheckInStrategy({
          craving,
          mentalState,
          triggers: selectedTriggers,
        })

  function toggleTrigger(trigger: string) {
    setSelectedTriggers((current) =>
      current.includes(trigger)
        ? current.filter((item) => item !== trigger)
        : [...current, trigger],
    )
  }

  async function handleSave(escalatedToSos: boolean) {
    if (!mentalState || !strategy) {
      return
    }

    const result = await saveCheckIn({
      craving,
      mentalState,
      triggers: selectedTriggers,
      notes,
      strategy,
      escalatedToSos,
    })

    if (!result.saved) {
      return
    }

    navigate(escalatedToSos ? '/sos' : '/app', { replace: true })
  }

  const selectedMentalState = mentalStates.find((item) => item.id === mentalState) ?? null
  const suggestSos = craving >= 7

  return (
    <AppShell title="Check-in do dia" eyebrow="Rotina diaria">
      <section className="panel-stack">
        {alreadyCheckedIn ? (
          <article className="info-card highlight-card">
            <span className="section-label">Ja concluido hoje</span>
            <h2>Seu check-in de hoje ja foi registrado</h2>
            <p>
              Mantivemos a regra mais importante do legado: um check-in por dia,
              para proteger streak, analytics e historico sem duplicacao.
            </p>
            <div className="hero-actions">
              <button className="button button-secondary" onClick={() => navigate('/app')}>
                Voltar para a home
              </button>
              <button className="button button-primary" onClick={() => navigate('/sos')}>
                Ir para SOS
              </button>
            </div>
          </article>
        ) : (
          <>
            <article className="info-card highlight-card">
              <span className="section-label">Leitura do momento</span>
              <h2>Como esta sua fissura agora?</h2>
              <p>
                O objetivo aqui nao e julgar. E medir o momento para gerar uma
                resposta pratica e mais segura.
              </p>
              <div className="section-header">
                <div>
                  <dt>Intensidade</dt>
                  <dd>
                    {craving} / 10
                  </dd>
                </div>
                <span className="status-pill">{getCravingLabel(craving)}</span>
              </div>
              <input
                id="craving"
                type="range"
                min={0}
                max={10}
                value={craving}
                onChange={(event) => setCraving(Number(event.target.value))}
              />
            </article>

            <article className="info-card">
              <span className="section-label">Estado mental</span>
              <h2>Qual e seu estado agora?</h2>
              <p>
                Como no app antigo, este passo muda a estrategia recomendada e
                ajuda a qualificar o contexto do dia.
              </p>
              <div className="pricing-grid">
                {mentalStates.map((item) => (
                  <button
                    key={item.id}
                    className={
                      mentalState === item.id ? 'plan-card plan-card-active' : 'plan-card'
                    }
                    type="button"
                    onClick={() => setMentalState(item.id)}
                  >
                    <strong>{item.label}</strong>
                    <p>{item.note}</p>
                  </button>
                ))}
              </div>
            </article>

            <article className="info-card">
              <span className="section-label">Gatilhos do momento</span>
              <h2>O que esta contribuindo para esse estado?</h2>
              <p>
                Esses gatilhos entram no registro do dia e alimentam analytics,
                estrategia e futuras prevencoes.
              </p>
              <div className="chip-row">
                {availableTriggers.map((item) => (
                  <button
                    key={item}
                    className={selectedTriggers.includes(item) ? 'chip active' : 'chip'}
                    type="button"
                    onClick={() => toggleTrigger(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p>{selectedTriggers.length} gatilho(s) selecionado(s)</p>
            </article>

            <article className="info-card">
              <span className="section-label">Observacao rapida</span>
              <h2>Algo importante para registrar?</h2>
              <p>
                Este campo ajuda a contextualizar recaidas, journal e leitura de
                padroes depois.
              </p>
              <textarea
                id="notes"
                className="textarea"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="O que esta acontecendo agora?"
              />
            </article>

            {!showStrategy ? (
              <article className="info-card">
                <span className="section-label">Fechamento</span>
                <h2>Gerar a estrategia do dia</h2>
                <p>
                  Quando voce gerar a estrategia, o app consolida esse momento em
                  uma resposta pratica e decide com mais clareza se o SOS deve
                  entrar agora.
                </p>
                <button
                  className="button button-primary"
                  type="button"
                  disabled={!mentalState}
                  onClick={() => setShowStrategy(true)}
                >
                  Gerar minha estrategia
                </button>
              </article>
            ) : (
              <article className="info-card highlight-card">
                <span className="section-label">Estrategia recomendada</span>
                <h2>{suggestSos ? 'Intervencao imediata' : 'Proximo passo do dia'}</h2>
                <p>{strategy}</p>
                {selectedMentalState ? (
                  <p>
                    Estado lido: <strong>{selectedMentalState.label}</strong>
                  </p>
                ) : null}
                {suggestSos ? (
                  <p className="warning-banner">
                    A fissura esta alta. O caminho mais seguro agora e salvar este
                    check-in e seguir direto para o SOS.
                  </p>
                ) : null}
                <div className="hero-actions">
                  <button className="button button-secondary" onClick={() => setShowStrategy(false)}>
                    Revisar respostas
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={() => void handleSave(false)}
                  >
                    Salvar e voltar para a home
                  </button>
                  <button className="button button-primary" onClick={() => void handleSave(true)}>
                    Salvar e ir para SOS
                  </button>
                </div>
              </article>
            )}
          </>
        )}
      </section>
    </AppShell>
  )
}
