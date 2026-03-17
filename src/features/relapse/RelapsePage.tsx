import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

const goalOptions = [
  {
    days: 5,
    title: 'Primeiro passo',
    description: 'Retomar com uma meta simples e executavel.',
  },
  {
    days: 10,
    title: 'Construir o habito',
    description: 'Recomecar com mais consistencia e estrutura.',
  },
  {
    days: 15,
    title: 'Desafio real',
    description: 'Voltar ao plano com um compromisso mais firme.',
  },
]

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

  const progressPercent =
    state.profile.goalDays > 0
      ? Math.min(100, Math.round((state.streak.current / state.profile.goalDays) * 100))
      : 0

  return (
    <AppShell title="Recaida" eyebrow="Recomeco guiado">
      <section className="panel-stack">
        <article className="info-card highlight-card">
          <span className="section-label">Primeiro passo</span>
          <h2>Nao transforme um deslize em abandono</h2>
          <p>
            Mantive a logica mais importante do app antigo: a recaida reinicia a
            baseline do streak, preserva o historico e abre caminho para um
            recomeço organizado.
          </p>
        </article>

        <article className="info-card">
          <span className="section-label">Resumo da tentativa atual</span>
          <h2>Voce nao volta para zero em aprendizado</h2>
          <p>
            Esta tela serve para registrar o que aconteceu e escolher a proxima
            meta com mais clareza.
          </p>
          <dl className="home-stats-grid">
            <div>
              <dt>Streak atual</dt>
              <dd>{state.streak.current} dias</dd>
            </div>
            <div>
              <dt>Meta anterior</dt>
              <dd>{state.profile.goalDays} dias</dd>
            </div>
            <div>
              <dt>Progresso atingido</dt>
              <dd>{progressPercent}%</dd>
            </div>
            <div>
              <dt>Melhor streak</dt>
              <dd>{state.streak.best} dias</dd>
            </div>
          </dl>
        </article>

        <article className="info-card">
          <span className="section-label">Nova meta</span>
          <h2>Defina como voce quer recomecar</h2>
          <div className="pricing-grid">
            {goalOptions.map((option) => (
              <button
                key={option.days}
                className={
                  nextGoalDays === option.days ? 'plan-card plan-card-active' : 'plan-card'
                }
                type="button"
                onClick={() => setNextGoalDays(option.days)}
              >
                <span className="section-label">{option.days} dias</span>
                <strong>{option.title}</strong>
                <p>{option.description}</p>
              </button>
            ))}
          </div>
        </article>

        <article className="info-card">
          <span className="section-label">Contexto</span>
          <h2>O que puxou esse momento?</h2>
          <div className="field">
            <label htmlFor="relapse-cause">Causa principal</label>
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
              placeholder="Se quiser, registre o que voce aprendeu com esse momento."
            />
          </div>
          <p>
            Se voce escrever uma reflexao, ela tambem entra no Jornal para ficar
            acessivel depois.
          </p>
        </article>

        <article className="info-card">
          <span className="section-label">Confirmacao</span>
          <h2>Fechar este ciclo e recomecar</h2>
          <p>
            Ao confirmar, o app registra a recaida, reseta a data de inicio do
            streak e aplica sua nova meta imediatamente.
          </p>
          <div className="hero-actions">
            <button className="button button-secondary" onClick={() => navigate('/app')}>
              Cancelar
            </button>
            <button className="button button-primary" onClick={() => void handleConfirm()}>
              Confirmar e recomecar
            </button>
          </div>
        </article>
      </section>
    </AppShell>
  )
}
