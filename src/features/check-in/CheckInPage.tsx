import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { buildCheckInStrategy, hasCheckInToday } from '../../core/domain/check-in'

const mentalStates = [
  { id: 'calmo', label: 'Calmo' },
  { id: 'ansioso', label: 'Ansioso' },
  { id: 'cansado', label: 'Cansado' },
  { id: 'frustrado', label: 'Frustrado' },
]

const fallbackTriggers = ['Ansiedade', 'Celular a noite', 'Tedio', 'Estresse']

export function CheckInPage() {
  const navigate = useNavigate()
  const { state, saveCheckIn } = useAppState()
  const [craving, setCraving] = useState(5)
  const [mentalState, setMentalState] = useState('calmo')
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [showStrategy, setShowStrategy] = useState(false)

  const alreadyCheckedIn = useMemo(() => hasCheckInToday(state.checkIns), [state.checkIns])

  const availableTriggers =
    state.profile.triggers.length > 0 ? state.profile.triggers : fallbackTriggers

  const strategy = buildCheckInStrategy({
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

  return (
    <AppShell title="Check-in diário" eyebrow="Check-in">
      <section className="form-card">
        <span className="section-label">Rotina diária</span>
        <h2>Registrar como você está hoje</h2>
        <p>
          Este fluxo já respeita a regra do legado: apenas um check-in por dia
          calendário.
        </p>

        {alreadyCheckedIn ? (
          <div className="info-card inline-card">
            <span className="section-label">Hoje já foi salvo</span>
            <h2>Check-in diário concluído</h2>
            <p>
              Para manter a regra crítica consistente, um segundo check-in hoje
              não é permitido.
            </p>
            <div className="hero-actions">
              <button className="button button-secondary" onClick={() => navigate('/app')}>
                Voltar ao app
              </button>
              <button className="button button-primary" onClick={() => navigate('/sos')}>
                Abrir SOS
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="field">
              <label htmlFor="craving">Nível de fissura: {craving}/10</label>
              <input
                id="craving"
                type="range"
                min={0}
                max={10}
                value={craving}
                onChange={(event) => setCraving(Number(event.target.value))}
              />
            </div>

            <div className="field">
              <span>Estado mental</span>
              <div className="chip-row">
                {mentalStates.map((item) => (
                  <button
                    key={item.id}
                    className={mentalState === item.id ? 'chip active' : 'chip'}
                    type="button"
                    onClick={() => setMentalState(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <span>Gatilhos do momento</span>
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
            </div>

            <div className="field">
              <label htmlFor="notes">Notas rápidas</label>
              <textarea
                id="notes"
                className="textarea"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="O que está acontecendo agora?"
              />
            </div>

            {!showStrategy ? (
              <button className="button button-primary" onClick={() => setShowStrategy(true)}>
                Gerar estratégia
              </button>
            ) : (
              <div className="info-card inline-card">
                <span className="section-label">Estratégia recomendada</span>
                <h2>Próximo passo prático</h2>
                <p>{strategy}</p>
                <div className="hero-actions">
                  <button className="button button-secondary" onClick={() => void handleSave(false)}>
                    Salvar e voltar
                  </button>
                  <button className="button button-primary" onClick={() => void handleSave(true)}>
                    Salvar e ir para SOS
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="info-card">
        <span className="section-label">Invariante portada</span>
        <h2>Um check-in por dia</h2>
        <p>
          Essa regra é importante para manter streak, analytics e consistência
          do histórico sem ruído de duplicação.
        </p>
      </section>
    </AppShell>
  )
}
