import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

const goalOptions = [
  {
    days: 5,
    title: 'Ganhar tracao',
    description: 'Retomar com uma meta curta e mais facil de sustentar.',
  },
  {
    days: 10,
    title: 'Criar consistencia',
    description: 'Recomecar com mais estrutura e alguns dias de distancia do impulso.',
  },
  {
    days: 15,
    title: 'Recomeco mais firme',
    description: 'Assumir um novo compromisso com mais clareza.',
  },
  {
    days: 30,
    title: 'Marco maior',
    description: 'Buscar um primeiro marco mais longo depois desse recomeco.',
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
    <AppShell title="Recaida" eyebrow="Recomeco">
      <section className="panel-stack">
        <article className="info-card highlight-card">
          <span className="section-label">Primeiro passo</span>
          <h2>Um deslize nao precisa virar abandono</h2>
          <p>
            Registre este momento com honestidade. O objetivo aqui nao e te punir, e te ajudar a
            recomecar com mais clareza.
          </p>
        </article>

        <article className="info-card">
          <span className="section-label">O que continua com voce</span>
          <h2>Voce nao perde o que aprendeu</h2>
          <p>Seu historico continua aqui. Agora a ideia e transformar isso em um novo passo.</p>
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
          <h2>Como voce quer recomecar a partir daqui?</h2>
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
          <h2>O que mais pesou neste momento?</h2>
          <div className="field">
            <label htmlFor="relapse-cause">O que aconteceu</label>
            <input
              id="relapse-cause"
              value={cause}
              onChange={(event) => setCause(event.target.value)}
              placeholder="Ex.: celular na madrugada depois de um dia pesado"
            />
          </div>
          <div className="field">
            <label htmlFor="relapse-reflection">O que voce quer lembrar depois</label>
            <textarea
              id="relapse-reflection"
              className="textarea"
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              placeholder="Se fizer sentido, escreva o que voce aprendeu ou o que quer fazer diferente."
            />
          </div>
          <p>Se voce escrever essa reflexao, ela tambem fica salva no Jornal.</p>
        </article>

        <article className="info-card">
          <span className="section-label">Confirmacao</span>
          <h2>Fechar este momento e recomecar</h2>
          <p>
            Ao confirmar, o app registra a recaida, reinicia seu marco de inicio e aplica a nova
            meta que voce escolheu.
          </p>
          <div className="hero-actions">
            <button className="button button-secondary" onClick={() => navigate('/app')}>
              Voltar
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
