import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

const goalOptions = [5, 10, 15, 30]

export function RelapsePage() {
  const navigate = useNavigate()
  const { state, registerRelapse } = useAppState()
  const [nextGoalDays, setNextGoalDays] = useState(state.profile.goalDays || 5)
  const [cause, setCause] = useState('')
  const [reflection, setReflection] = useState('')

  async function handleConfirm() {
    await registerRelapse({
      nextGoalDays,
      cause,
      reflection,
    })

    navigate('/app', { replace: true })
  }

  return (
    <AppShell title="Recaida" eyebrow="Recomeco">
      <section className="form-card">
        <span className="section-label">Etapa 1</span>
        <h2>Registrar sem perder clareza</h2>
        <p>
          No legado, a recaida reseta a baseline do streak antes mesmo da
          reflexao. Esse comportamento foi mantido aqui.
        </p>

        <div className="card-grid">
          <article className="info-card">
            <span className="section-label">Streak atual</span>
            <h2>{state.streak.current} dias</h2>
            <p>Meta atual: {state.profile.goalDays} dias</p>
          </article>

          <article className="info-card">
            <span className="section-label">Novo objetivo</span>
            <div className="chip-row">
              {goalOptions.map((option) => (
                <button
                  key={option}
                  className={nextGoalDays === option ? 'chip active' : 'chip'}
                  type="button"
                  onClick={() => setNextGoalDays(option)}
                >
                  {option} dias
                </button>
              ))}
            </div>
          </article>
        </div>

        <div className="field">
          <label htmlFor="relapse-cause">O que puxou essa recaida?</label>
          <input
            id="relapse-cause"
            value={cause}
            onChange={(event) => setCause(event.target.value)}
            placeholder="Ex.: ansiedade + celular na madrugada"
          />
        </div>

        <div className="field">
          <label htmlFor="relapse-reflection">Reflexao opcional</label>
          <textarea
            id="relapse-reflection"
            className="textarea"
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="Se quiser, registre o que aprendeu com esse momento."
          />
        </div>

        <div className="hero-actions">
          <button className="button button-secondary" onClick={() => navigate('/app')}>
            Cancelar
          </button>
          <button className="button button-primary" onClick={() => void handleConfirm()}>
            Confirmar e recomecar
          </button>
        </div>
      </section>

      <section className="info-card">
        <span className="section-label">Invariante portada</span>
        <h2>Reset com historico preservado</h2>
        <p>
          A recaida cria um registro em historico, reseta a data de inicio do
          streak e pode gerar automaticamente uma entrada no jornal.
        </p>
      </section>
    </AppShell>
  )
}
