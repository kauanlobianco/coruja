import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../app/state/use-app-state'
import { AppShell } from '../../shared/layout/AppShell'
import { getPrePurchaseAge, getPrePurchaseName } from '../pre-purchase/storage'

const goalOptions = [
  {
    days: 5,
    title: 'Ganhar tracao',
    description: 'Uma meta curta para sair do automatico e comecar com firmeza.',
  },
  {
    days: 10,
    title: 'Criar consistencia',
    description: 'Tempo suficiente para firmar rotina e abrir mais distancia do impulso.',
  },
  {
    days: 15,
    title: 'Recomeco mais firme',
    description: 'Uma meta mais forte para quem quer virar a chave com mais estrutura.',
  },
  {
    days: 30,
    title: 'Marco maior',
    description: 'Um compromisso mais longo para quem quer buscar um primeiro grande marco.',
  },
]

const defaultMotivations = [
  'Quero ter mais clareza mental',
  'Quero voltar a sentir controle sobre mim',
  'Quero melhorar meus relacionamentos',
  'Quero parar de perder tempo com isso',
  'Quero dormir melhor',
  'Quero me sentir mais presente na minha vida',
]

const defaultTriggers = [
  'Sozinho no quarto',
  'Celular na cama',
  'Madrugada',
  'Redes sociais',
  'Depois de um dia estressante',
  'Depois de um conflito',
  'Quando fico sem rumo',
  'Quando estou enrolando tarefas',
  'Depois de beber',
  'Banho demorado',
  'Apos acordar',
  'Fim de semana sem rotina',
  'Cansaco no fim do dia',
  'Quando fico sozinho em casa',
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
  const [customMotivation, setCustomMotivation] = useState('')
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
    const resolvedAge =
      state.profile.age ?? (prePurchaseAge.trim() ? Number(prePurchaseAge) : null)
    const resolvedCustomMotivation = customMotivation.trim()
    const resolvedMotivations = resolvedCustomMotivation
      ? Array.from(new Set([...motivations, resolvedCustomMotivation]))
      : motivations

    await completeOnboarding({
      name: name.trim() || 'Usuario',
      age: resolvedAge,
      goalDays,
      motivations: resolvedMotivations,
      triggers,
    })

    navigate('/app', { replace: true })
  }

  const selectedGoal =
    goalOptions.find((option) => option.days === goalDays) ?? goalOptions[0]

  return (
    <AppShell
      title="Vamos montar a base da sua jornada"
      eyebrow="Onboarding"
      shellMode="entry"
    >
      <form className="panel-stack" onSubmit={handleSubmit}>
        <section className="info-card highlight-card">
          <span className="section-label">Identidade</span>
          <h2>Como voce quer ser chamado aqui dentro?</h2>
          <p>
            Esse nome vai aparecer na sua Home e nos momentos em que o app
            estiver te apoiando mais de perto.
          </p>
          <div className="field">
            <div className="input-wrapper">
              <input
                className="input-field"
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder=" "
              />
              <label className="input-label" htmlFor="name">
                Nome
              </label>
            </div>
          </div>
        </section>

        <section className="info-card">
          <span className="section-label">Meta inicial</span>
          <h2>Qual vai ser a sua primeira meta?</h2>
          <p>
            Nao precisa provar tudo agora. Escolha uma meta que pareca seria,
            mas possivel de sustentar.
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
          <span className="section-label">Motivos</span>
          <h2>Por que isso importa para voce?</h2>
          <p>
            Escolha os motivos que mais combinam com o que voce quer recuperar
            na sua vida. Eles vao reaparecer quando voce precisar lembrar por
            que comecou.
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
          <div className="field">
            <div className="input-wrapper">
              <input
                className="input-field"
                id="custom-motivation"
                value={customMotivation}
                onChange={(event) => setCustomMotivation(event.target.value)}
                placeholder=" "
                maxLength={80}
              />
              <label className="input-label" htmlFor="custom-motivation">
                Outro motivo importante para voce
              </label>
            </div>
          </div>
        </section>

        <section className="info-card">
          <span className="section-label">Gatilhos</span>
          <h2>Em que momentos voce costuma ficar mais vulneravel?</h2>
          <p>
            Aqui a ideia e mapear situacoes do seu dia a dia. Isso ajuda o app a
            entender melhor seu contexto e a te orientar com mais clareza depois.
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
          <h2>O que fica pronto quando voce entrar no app</h2>
          <dl className="home-stats-grid">
            <div>
              <dt>Meta ativa</dt>
              <dd>{selectedGoal.days} dias</dd>
            </div>
            <div>
              <dt>Motivos escolhidos</dt>
              <dd>{motivations.length + (customMotivation.trim() ? 1 : 0)}</dd>
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
            Ao continuar, essa base vai organizar sua Home, seu streak, seus
            check-ins e os momentos de suporte como SOS.
          </p>
          <button
            className="button button-primary"
            type="submit"
            disabled={!name.trim() || motivations.length === 0}
          >
            Entrar no app
          </button>
        </section>
      </form>
    </AppShell>
  )
}
