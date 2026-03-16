import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../app/state/use-app-state'
import { AppShell } from '../../shared/layout/AppShell'
import { getPrePurchaseName } from '../pre-purchase/storage'

const defaultMotivations = [
  'Mais clareza mental',
  'Menos impulsividade',
  'Sono melhor',
  'Rotina mais saudavel',
]

const defaultTriggers = [
  'Ansiedade',
  'Celular a noite',
  'Tedio',
  'Estresse',
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { state, completeOnboarding } = useAppState()
  const [name, setName] = useState(state.profile.name || getPrePurchaseName())
  const [goalDays, setGoalDays] = useState(state.profile.goalDays)
  const [motivations, setMotivations] = useState<string[]>(
    state.profile.motivations.length > 0
      ? state.profile.motivations
      : [defaultMotivations[0]],
  )
  const [triggers, setTriggers] = useState<string[]>(
    state.profile.triggers.length > 0 ? state.profile.triggers : [],
  )

  function toggleValue(value: string, current: string[], setter: (values: string[]) => void) {
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await completeOnboarding({
      name: name.trim() || 'Usuario',
      goalDays,
      motivations,
      triggers,
    })

    navigate('/app', { replace: true })
  }

  return (
    <AppShell title="Fluxo inicial enxuto" eyebrow="Onboarding">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Como quer ser chamado?"
          />
        </div>

        <div className="field">
          <label htmlFor="goalDays">Meta inicial em dias</label>
          <input
            id="goalDays"
            type="number"
            min={1}
            max={90}
            value={goalDays}
            onChange={(event) => setGoalDays(Number(event.target.value) || 1)}
          />
        </div>

        <div className="field">
          <span>Motivações principais</span>
          <div className="chip-row">
            {defaultMotivations.map((item) => (
              <button
                key={item}
                className={motivations.includes(item) ? 'chip active' : 'chip'}
                type="button"
                onClick={() => toggleValue(item, motivations, setMotivations)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span>Gatilhos iniciais</span>
          <div className="chip-row">
            {defaultTriggers.map((item) => (
              <button
                key={item}
                className={triggers.includes(item) ? 'chip active' : 'chip'}
                type="button"
                onClick={() => toggleValue(item, triggers, setTriggers)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button className="button button-primary" type="submit">
          Salvar onboarding
        </button>
      </form>

      <section className="info-card">
        <span className="section-label">Decisao estrutural</span>
        <h2>Um fluxo, uma rota, uma fonte de verdade</h2>
        <p>
          O app antigo distribuía setup entre páginas React, HTMLs públicos e
          armazenamento duplicado. Aqui, o onboarding já grava apenas um estado
          versionável e fácil de migrar.
        </p>
      </section>
    </AppShell>
  )
}
