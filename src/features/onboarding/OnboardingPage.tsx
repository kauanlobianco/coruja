import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../app/state/use-app-state'
import { AppShell } from '../../shared/layout/AppShell'
import { getPrePurchaseAge, getPrePurchaseName } from '../pre-purchase/storage'

const goalOptions = [
  {
    days: 5,
    title: 'Primeiro passo',
    description: 'Entrar no ritmo e provar para si mesmo que voce consegue.',
  },
  {
    days: 10,
    title: 'Construir o habito',
    description: 'Ganhar consistencia e criar mais distancia do impulso.',
  },
  {
    days: 15,
    title: 'Desafio real',
    description: 'Comecar uma virada mais forte com estrutura diaria.',
  },
]

const defaultMotivations = [
  'Ter mais clareza mental',
  'Recuperar meu foco',
  'Dormir melhor',
  'Ter mais controle sobre mim',
  'Melhorar meus relacionamentos',
  'Parar de perder tempo',
]

const defaultTriggers = [
  'Ansiedade',
  'Estresse',
  'Tedio',
  'Solidao',
  'Celular a noite',
  'Redes sociais',
  'Insônia',
  'Conflitos',
]

function toggleValue(
  value: string,
  current: string[],
  setter: (values: string[]) => void,
) {
  setter(
    current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value],
  )
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const { state, completeOnboarding } = useAppState()
  const [name, setName] = useState(state.profile.name || getPrePurchaseName())
  const [goalDays, setGoalDays] = useState(state.profile.goalDays || 5)
  const [motivations, setMotivations] = useState<string[]>(
    state.profile.motivations.length > 0
      ? state.profile.motivations
      : [defaultMotivations[0]],
  )
  const [triggers, setTriggers] = useState<string[]>(
    state.profile.triggers.length > 0 ? state.profile.triggers : [],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prePurchaseAge = getPrePurchaseAge()
    const resolvedAge = state.profile.age ?? (prePurchaseAge.trim() ? Number(prePurchaseAge) : null)

    await completeOnboarding({
      name: name.trim() || 'Usuario',
      age: resolvedAge,
      goalDays,
      motivations,
      triggers,
    })

    navigate('/app', { replace: true })
  }

  const selectedGoal =
    goalOptions.find((option) => option.days === goalDays) ?? goalOptions[0]

  return (
    <AppShell
      title="Feche sua base antes de entrar no app"
      eyebrow="Onboarding"
      shellMode="entry"
    >
      <form className="panel-stack" onSubmit={handleSubmit}>
        <section className="info-card highlight-card">
          <span className="section-label">Identidade</span>
          <h2>Como quer ser chamado dentro do app?</h2>
          <p>
            Este nome vai aparecer na home, no streak e nos momentos de suporte
            como SOS e bloqueador.
          </p>
          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Como quer ser chamado?"
            />
          </div>
        </section>

        <section className="info-card">
          <span className="section-label">Meta inicial</span>
          <h2>Qual e sua primeira meta?</h2>
          <p>
            Como no app antigo, a meta inicial organiza o streak e o senso de
            progresso desde o primeiro dia.
          </p>
          <div className="pricing-grid">
            {goalOptions.map((option) => (
              <button
                key={option.days}
                className={
                  goalDays === option.days ? 'plan-card plan-card-active' : 'plan-card'
                }
                type="button"
                onClick={() => setGoalDays(option.days)}
              >
                <span className="section-label">{option.days} dias</span>
                <strong>{option.title}</strong>
                <p>{option.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="info-card">
          <span className="section-label">Seus motivos</span>
          <h2>Escolha as ancoras que vao te puxar de volta</h2>
          <p>
            Estes motivos abastecem a home, o SOS e as mensagens de apoio em
            momentos mais delicados.
          </p>
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
        </section>

        <section className="info-card">
          <span className="section-label">Mapa de risco</span>
          <h2>Quais gatilhos merecem atencao logo no comeco?</h2>
          <p>
            Eles nao ficam presos a nomes fixos. Servem para orientar check-ins,
            analytics e futuras acoes preventivas.
          </p>
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
        </section>

        <section className="info-card">
          <span className="section-label">Resumo</span>
          <h2>O que vai nascer quando voce terminar este passo</h2>
          <dl className="home-stats-grid">
            <div>
              <dt>Meta ativa</dt>
              <dd>{selectedGoal.days} dias</dd>
            </div>
            <div>
              <dt>Motivos escolhidos</dt>
              <dd>{motivations.length}</dd>
            </div>
            <div>
              <dt>Gatilhos mapeados</dt>
              <dd>{triggers.length}</dd>
            </div>
            <div>
              <dt>Destino</dt>
              <dd>Home principal</dd>
            </div>
          </dl>
          <p>
            Ao salvar, esta configuracao vira a base do seu streak, da home
            principal e do suporte rapido.
          </p>
          <button className="button button-primary" type="submit">
            Entrar no app
          </button>
        </section>
      </form>
    </AppShell>
  )
}
