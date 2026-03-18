import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { buildCheckInStrategy, hasCheckInToday } from '../../core/domain/check-in'
import { appRoutes } from '../../core/config/routes'

const mentalStates = [
  { id: 'calmo', label: 'Mais estavel', note: 'Sem muita pressao percebida neste momento.' },
  { id: 'ansioso', label: 'Ansioso', note: 'Mente acelerada e mais vulneravel ao impulso.' },
  { id: 'cansado', label: 'Cansado', note: 'Pouca energia costuma reduzir sua margem de controle.' },
  { id: 'frustrado', label: 'Frustrado', note: 'Atrito emocional pode empurrar decisoes impulsivas.' },
]

const fallbackTriggers = [
  'Redes sociais',
  'Celular na cama',
  'Tedio',
  'Depois de um dia estressante',
]

function getCravingLabel(craving: number) {
  if (craving >= 8) {
    return 'Muito alta. Este e um momento de protecao imediata.'
  }

  if (craving >= 5) {
    return 'Media. Vale agir agora, antes que isso cresca.'
  }

  if (craving >= 2) {
    return 'Baixa, mas ainda pede atencao.'
  }

  return 'Baixa. Bom momento para sustentar o ritmo do dia.'
}

export function CheckInPage() {
  const navigate = useNavigate()
  const { state, saveCheckIn, demoNow } = useAppState()
  const [pledgeConfirmed, setPledgeConfirmed] = useState(false)
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

  const selectedMentalState = mentalStates.find((item) => item.id === mentalState) ?? null
  const suggestSos = craving >= 7
  const suggestLibrary = craving >= 4 && craving < 7

  async function handleStrategyAction(destination: 'home' | 'sos' | 'library') {
    const escalatedToSos = destination === 'sos'
    const result = await handlePersistCheckIn(escalatedToSos)

    if (!result) {
      return
    }

    if (destination === 'sos') {
      navigate(appRoutes.sos, { replace: true })
      return
    }

    if (destination === 'library') {
      navigate(appRoutes.library, { replace: true })
      return
    }

    navigate(appRoutes.home, { replace: true })
  }

  async function handlePersistCheckIn(escalatedToSos: boolean) {
    if (!mentalState || !strategy) {
      return false
    }

    const result = await saveCheckIn({
      craving,
      mentalState,
      triggers: selectedTriggers,
      notes,
      strategy,
      escalatedToSos,
    })

    return result.saved
  }

  const strategyOverlay =
    !alreadyCheckedIn && showStrategy && strategy ? (
      <section className="checkin-modal-backdrop modal-overlay">
        <article className="info-card highlight-card checkin-modal-card modal-content">
          <span className="section-label">Seu proximo passo</span>
          <h2>
            {suggestSos
              ? 'Proteja este momento agora'
              : suggestLibrary
                ? 'Hora de desacelerar'
                : 'Siga com o seu dia de forma mais segura'}
          </h2>
          <p>{strategy}</p>
          {selectedMentalState ? (
            <p>
              Estado registrado: <strong>{selectedMentalState.label}</strong>
            </p>
          ) : null}
          {suggestSos ? (
            <p className="warning-banner">
              Sua vontade esta alta. O caminho mais seguro agora e salvar este check-in e ir para
              o SOS.
            </p>
          ) : null}
          {suggestLibrary ? (
            <p className="warning-banner">
              Sua vontade esta em um nivel medio. Vale salvar este momento e entrar em um conteudo
              de relaxamento na Biblioteca.
            </p>
          ) : null}
          <div className="hero-actions">
            <button
              className="button button-secondary"
              onClick={() => void handleStrategyAction('home')}
            >
              Continuar para a Home
            </button>
            {suggestLibrary ? (
              <button
                className="button button-secondary"
                onClick={() => void handleStrategyAction('library')}
              >
                Ir para a Biblioteca
              </button>
            ) : null}
            {suggestSos ? (
              <button
                className="button button-primary"
                onClick={() => void handleStrategyAction('sos')}
              >
                Ir para o SOS
              </button>
            ) : null}
          </div>
        </article>
      </section>
    ) : null

  return (
    <AppShell title="Check-in do dia" eyebrow="Rotina diaria" overlay={strategyOverlay}>
      <section className="panel-stack">
        {alreadyCheckedIn ? (
          <article className="info-card highlight-card">
            <span className="section-label">Registrado hoje</span>
            <h2>Seu check-in de hoje ja foi feito</h2>
            <p>
              Para manter seu historico limpo e a leitura da sua evolucao mais confiavel, o app
              libera um check-in por dia.
            </p>
            <div className="hero-actions">
              <button className="button button-secondary" onClick={() => navigate('/app')}>
                Voltar para a Home
              </button>
              <button className="button button-primary" onClick={() => navigate('/sos')}>
                Ir para o SOS
              </button>
            </div>
          </article>
        ) : (
          <>
            <article className="info-card highlight-card">
              <span className="section-label">Compromisso de hoje</span>
              <h2>Confirme a intencao que vai guiar o seu dia</h2>
              <p>
                Este primeiro passo existe para te tirar do automatico. Antes de medir o momento,
                confirme a direcao de hoje.
              </p>
              <button
                className={pledgeConfirmed ? 'button button-primary' : 'button button-secondary'}
                type="button"
                onClick={() => setPledgeConfirmed((current) => !current)}
              >
                {pledgeConfirmed
                  ? 'Compromisso confirmado para hoje'
                  : 'Hoje eu escolho proteger meu dia'}
              </button>
            </article>

            <article className="info-card highlight-card">
              <span className="section-label">Leitura do momento</span>
              <h2>Como esta sua vontade agora?</h2>
              <p>
                Nao e para se julgar. E para entender o momento com honestidade e responder melhor
                a ele.
              </p>
              <div className="section-header">
                <div>
                  <dt>Intensidade</dt>
                  <dd>{craving} / 10</dd>
                </div>
                <span className="status-pill">{getCravingLabel(craving)}</span>
              </div>
              <input
                id="craving"
                type="range"
                min={0}
                max={10}
                value={craving}
                disabled={!pledgeConfirmed}
                onChange={(event) => setCraving(Number(event.target.value))}
              />
            </article>

            <article className="info-card">
              <span className="section-label">Seu estado agora</span>
              <h2>Como voce se percebe neste momento?</h2>
              <p>
                Escolher bem esse estado ajuda o app a sugerir uma resposta mais coerente com o
                seu contexto real.
              </p>
              <div className="pricing-grid">
                {mentalStates.map((item) => (
                  <button
                    key={item.id}
                    className={
                      mentalState === item.id ? 'plan-card plan-card-active' : 'plan-card'
                    }
                    type="button"
                    disabled={!pledgeConfirmed}
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
              <h2>O que pode estar contribuindo para isso?</h2>
              <p>
                Escolha os gatilhos que mais combinam com o seu dia. Eles ajudam a identificar
                padroes e deixam sua estrategia mais util.
              </p>
              <div className="chip-row">
                {availableTriggers.map((item) => (
                  <button
                    key={item}
                    className={selectedTriggers.includes(item) ? 'chip active' : 'chip'}
                    type="button"
                    disabled={!pledgeConfirmed}
                    onClick={() => toggleTrigger(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p>{selectedTriggers.length} gatilho(s) selecionado(s)</p>
            </article>

            <article className="info-card">
              <span className="section-label">Observacao opcional</span>
              <h2>Quer registrar algo importante sobre este momento?</h2>
              <p>
                Se fizer sentido, deixe uma anotacao curta. Isso pode te ajudar a entender melhor
                seus padroes depois.
              </p>
              <textarea
                id="notes"
                className="textarea"
                value={notes}
                disabled={!pledgeConfirmed}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="O que esta pesando mais agora?"
              />
            </article>

            {!showStrategy ? (
              <article className="info-card">
                <span className="section-label">Fechamento</span>
                <h2>Gerar meu proximo passo</h2>
                <p>
                  Quando voce continuar, o app transforma esse registro em uma orientacao pratica
                  para agora.
                </p>
                <button
                  className="button button-primary"
                  type="button"
                  disabled={!pledgeConfirmed || !mentalState}
                  onClick={() => setShowStrategy(true)}
                >
                  Gerar minha estrategia
                </button>
              </article>
            ) : null}
          </>
        )}
      </section>
    </AppShell>
  )
}
