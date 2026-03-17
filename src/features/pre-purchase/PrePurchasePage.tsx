import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../app/state/use-app-state'
import {
  painSlides,
  planOptions,
  quizQuestions,
  solutionSlides,
  symptomCategories,
  symptomOptions,
  testimonials,
} from './data'
import {
  clearPrePurchaseState,
  loadPrePurchaseState,
  savePrePurchaseState,
} from './storage'
import type {
  FunnelStep,
  PrePurchaseState,
  QuizAnswer,
  SymptomCategory,
} from './types'

const steps: FunnelStep[] = [
  'landing',
  'quiz',
  'loading',
  'identity',
  'symptoms',
  'diagnosis',
  'pain-carousel',
  'solution-carousel',
  'social-proof',
  'plan-preview',
  'custom-plan',
  'paywall',
]

const initialState: PrePurchaseState = {
  step: 'landing',
  quizIndex: 0,
  pendingQuizAnswerIndex: null,
  quizAnswers: [],
  score: 0,
  name: '',
  age: '',
  symptoms: [],
  selectedPlan: 'annual',
  painSlide: 0,
  solutionSlide: 0,
}

const markerRules = [
  {
    id: 'perda-controle',
    title: 'Perda de controle em momentos-chave',
    matches: (answers: Map<number, number>) =>
      answers.get(13) === 1 || answers.get(6) === 4,
    copy:
      'Suas respostas mostram momentos em que interromper ou regular esse comportamento tem ficado dificil demais.',
  },
  {
    id: 'interferencia-vida',
    title: 'Impacto no dia a dia',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(6)
      return answer === 3 || answer === 4
    },
    copy:
      'Isso ja esta encostando em areas importantes da sua rotina, e por isso merece ser tratado com seriedade agora.',
  },
  {
    id: 'tentativas-frustradas',
    title: 'Dificuldade para sustentar tentativas',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(12)
      return answer === 3 || answer === 4
    },
    copy:
      'Voce ja tentou reduzir ou parar, mas nao conseguiu manter isso por muito tempo sozinho.',
  },
  {
    id: 'impacto-sexual',
    title: 'Impacto na vida sexual',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(8)
      return answer !== undefined && answer >= 2
    },
    copy:
      'Esse padrao tambem esta aparecendo na sua vida sexual, o que mostra que o problema nao ficou isolado.',
  },
  {
    id: 'escalada',
    title: 'Escalada do padrao',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(10)
      return answer !== undefined && answer >= 2
    },
    copy:
      'Ha sinais de que o que antes bastava ja nao tem o mesmo efeito, e a busca por estimulo tem aumentado.',
  },
  {
    id: 'impacto-emocional',
    title: 'Peso emocional depois do consumo',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(9)
      return answer !== undefined && answer >= 2
    },
    copy:
      'O que acontece depois tambem importa: culpa, vazio ou ansiedade costumam alimentar o retorno ao mesmo ciclo.',
  },
  {
    id: 'gasto-financeiro',
    title: 'Impacto financeiro',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(11)
      return answer === 3 || answer === 4
    },
    copy:
      'Voce tambem sinalizou impacto no dinheiro, o que mostra que esse padrao ja esta cobrando um preco concreto.',
  },
]

function getProgress(step: FunnelStep) {
  return ((steps.indexOf(step) + 1) / steps.length) * 100
}

function getQuizProgress(index: number) {
  return ((index + 1) / quizQuestions.length) * 100
}

function getPlanDate() {
  const date = new Date()
  date.setDate(date.getDate() + 30)

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  })
}

function getRiskBand(score: number) {
  if (score >= 78) {
    return {
      label: 'Nivel em que esse padrao ja esta pesando em partes importantes da sua rotina',
      short: 'O que voce respondeu mostra um ciclo mais entranhado, com impacto real e dificuldade de interromper em alguns momentos.',
    }
  }

  if (score >= 56) {
    return {
      label: 'Nivel em que esse padrao ja comeca a tomar espaco demais no seu dia',
      short: 'Suas respostas mostram dificuldade crescente de controle, desgaste e tentativas que nao se sustentaram.',
    }
  }

  if (score >= 16) {
    return {
      label: 'Nivel que merece atencao antes que esse padrao ganhe mais forca',
      short: 'Ja existem sinais de repeticao automatica e impacto emocional, mesmo que isso ainda pareca administravel em alguns dias.',
    }
  }

  return {
    label: 'Nivel com poucos sinais de peso agora, mas que ainda merece cuidado',
    short: 'Seu resultado nao mostra um padrao dominante neste momento, mas vale proteger sua rotina para isso nao ganhar espaco.',
  }
}

function getSymptomCategoryMap(selectedSymptoms: string[]) {
  const map = new Map<SymptomCategory, string[]>()

  for (const option of symptomOptions) {
    if (!selectedSymptoms.includes(option.label)) {
      continue
    }

    const current = map.get(option.category) ?? []
    map.set(option.category, [...current, option.label])
  }

  return map
}

function getSymptomPriorityCopies(selectedSymptoms: string[]) {
  const map = getSymptomCategoryMap(selectedSymptoms)
  const copies: string[] = []

  if (map.has('Fisico')) {
    copies.push('Seu plano precisa cuidar de energia, vitalidade e da parte fisica que esse padrao pode estar desgastando.')
  }

  if (map.has('Mental')) {
    copies.push('Seu plano precisa comecar por foco, clareza e estabilidade mental no dia a dia.')
  }

  if (map.has('Social')) {
    copies.push('Seu plano tambem precisa olhar para autoestima, reconexao e relacoes desde o inicio.')
  }

  if (map.has('Fe')) {
    copies.push('Tambem existe uma camada espiritual importante para voce, que pode servir de apoio nos momentos mais vulneraveis.')
  }

  return copies
}

function getDiagnosisReport(score: number, quizAnswers: QuizAnswer[], symptoms: string[]) {
  const band = getRiskBand(score)
  const answersByQuestion = new Map<number, number>(
    quizAnswers.map((answer) => [answer.questionId, answer.answerIndex]),
  )
  const markers = markerRules.filter((rule) => rule.matches(answersByQuestion)).slice(0, 3)
  const symptomPriorityCopies = getSymptomPriorityCopies(symptoms)

  return {
    band,
    markers,
    symptomPriorityCopies,
  }
}

function getLandingChecks() {
  return [
    'Quiz com 13 perguntas',
    'Leitura personalizada do seu momento',
    'Plano inicial construindo a partir das suas respostas',
  ]
}

export function PrePurchasePage() {
  const navigate = useNavigate()
  const { state: appState } = useAppState()
  const [state, setState] = useState<PrePurchaseState>(() => loadPrePurchaseState() ?? initialState)

  useEffect(() => {
    savePrePurchaseState(state)
  }, [state])

  useEffect(() => {
    if (state.step !== 'loading') {
      return
    }

    const timeout = window.setTimeout(() => {
      setState((current) => ({ ...current, step: 'identity' }))
    }, 1800)

    return () => window.clearTimeout(timeout)
  }, [state.step])

  const currentQuestion = quizQuestions[state.quizIndex]
  const diagnosis = useMemo(
    () => getDiagnosisReport(state.score, state.quizAnswers, state.symptoms),
    [state.quizAnswers, state.score, state.symptoms],
  )

  function goTo(step: FunnelStep) {
    setState((current) => ({ ...current, step }))
  }

  function confirmQuizAnswer(questionId: number, answerIndex: number, points: number) {
    setState((current) => {
      const quizAnswers = [
        ...current.quizAnswers,
        {
          questionId,
          answerIndex,
          points,
        },
      ]
      const score = quizAnswers.reduce((sum, value) => sum + value.points, 0)
      const isLast = current.quizIndex === quizQuestions.length - 1

      if (isLast) {
        return {
          ...current,
          pendingQuizAnswerIndex: null,
          quizAnswers,
          score,
          step: 'loading',
        }
      }

      return {
        ...current,
        pendingQuizAnswerIndex: null,
        quizAnswers,
        score,
        quizIndex: current.quizIndex + 1,
      }
    })
  }

  function toggleSymptom(symptom: string) {
    setState((current) => ({
      ...current,
      symptoms: current.symptoms.includes(symptom)
        ? current.symptoms.filter((item) => item !== symptom)
        : [...current.symptoms, symptom],
    }))
  }

  function nextPainSlide() {
    setState((current) => ({
      ...current,
      painSlide: current.painSlide + 1,
      step:
        current.painSlide >= painSlides.length - 1
          ? 'solution-carousel'
          : 'pain-carousel',
    }))
  }

  function nextSolutionSlide() {
    setState((current) => ({
      ...current,
      solutionSlide: current.solutionSlide + 1,
      step:
        current.solutionSlide >= solutionSlides.length - 1
          ? 'social-proof'
          : 'solution-carousel',
    }))
  }

  function continueToOnboarding() {
    clearPrePurchaseState()
    navigate('/account/auth?mode=signup&signupOnly=1', { replace: true })
  }

  return (
    <div className="app-shell">
      <div className="phone-shell">
        <div className="phone-frame">
          <div className="phone-notch" aria-hidden="true" />

          <div
            className={
              state.step === 'quiz'
                ? 'funnel-frame funnel-phone-frame funnel-phone-frame-quiz'
                : 'funnel-frame funnel-phone-frame'
            }
          >
            <header
              className={state.step === 'quiz' ? 'funnel-header funnel-header-quiz' : 'funnel-header'}
            >
              <div className="funnel-header-main">
                <span className="eyebrow">Pre-compra</span>
                <h1>Coruja</h1>
              </div>
              {state.step === 'quiz' ? (
                <div className="funnel-progress funnel-progress-quiz">
                  <div className="funnel-progress-topline">
                    <span className="section-label">Quiz</span>
                    <span className="status-pill">
                      {state.quizIndex + 1}/{quizQuestions.length}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${getQuizProgress(state.quizIndex)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="funnel-progress">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${getProgress(state.step)}%` }}
                    />
                  </div>
                </div>
              )}
            </header>

            {state.step === 'landing' ? (
              <section className="funnel-panel funnel-hero">
                <span className="section-label">Landing</span>
                <h2>Bem-vindo!</h2>
                <p>
                  Responda algumas perguntas e descubra como a pornografia esta afetando sua
                  vida e qual e o proximo passo real.
                </p>
                {appState.backup.status === 'conflict' && appState.backup.lastError ? (
                  <p className="warning-banner">{appState.backup.lastError}</p>
                ) : null}
                <div className="hero-checks">
                  {getLandingChecks().map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="hero-actions">
                  <button className="button button-primary" onClick={() => goTo('quiz')}>
                    Comecar Quiz
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={() => navigate('/account/auth?mode=login&loginOnly=1')}
                  >
                    Ja tenho conta
                  </button>
                </div>
              </section>
            ) : null}

            {state.step === 'quiz' ? (
              <section className="funnel-panel quiz-panel">
                <div className="quiz-copy">
                  <h2>{currentQuestion.prompt}</h2>
                  <p>Fator: {currentQuestion.factor}</p>
                </div>
                <div className="answer-grid quiz-answer-grid">
                  {currentQuestion.answers.map((answer, answerIndex) => (
                    <button
                      key={answer.label}
                      className={
                        state.pendingQuizAnswerIndex === answerIndex
                          ? 'answer-card answer-card-active'
                          : 'answer-card'
                      }
                      onClick={() =>
                        setState((current) => ({
                          ...current,
                          pendingQuizAnswerIndex: answerIndex,
                        }))
                      }
                    >
                      <strong>{answer.label}</strong>
                    </button>
                  ))}
                </div>
                <button
                  className="button button-primary quiz-confirm-button"
                  disabled={state.pendingQuizAnswerIndex === null}
                  onClick={() => {
                    if (state.pendingQuizAnswerIndex === null) {
                      return
                    }

                    const selectedAnswer = currentQuestion.answers[state.pendingQuizAnswerIndex]
                    void confirmQuizAnswer(
                      currentQuestion.id,
                      state.pendingQuizAnswerIndex,
                      selectedAnswer.points,
                    )
                  }}
                >
                  Confirmar resposta
                </button>
              </section>
            ) : null}

            {state.step === 'loading' ? (
              <section className="funnel-panel loading-panel">
                <span className="section-label">Loading</span>
                <h2>Montando sua leitura</h2>
                <p>
                  Cruzando suas respostas para mostrar onde esse padrao esta mais forte hoje.
                </p>
                <div className="loading-ring" />
              </section>
            ) : null}

            {state.step === 'identity' ? (
              <section className="funnel-panel form-card">
                <span className="section-label">Identidade</span>
                <h2>Quem esta comecando esse reboot?</h2>
                <div className="field">
                  <label htmlFor="funnel-name">Nome</label>
                  <input
                    id="funnel-name"
                    value={state.name}
                    onChange={(event) =>
                      setState((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Seu primeiro nome"
                  />
                </div>
                <div className="field">
                  <label htmlFor="funnel-age">Idade</label>
                  <input
                    id="funnel-age"
                    value={state.age}
                    onChange={(event) =>
                      setState((current) => ({ ...current, age: event.target.value }))
                    }
                    placeholder="Sua idade"
                  />
                </div>
                <button
                  className="button button-primary"
                  disabled={!state.name.trim() || !state.age.trim()}
                  onClick={() => goTo('symptoms')}
                >
                  Continuar
                </button>
              </section>
            ) : null}

            {state.step === 'symptoms' ? (
              <section className="funnel-panel">
                <span className="section-label">Sintomas</span>
                <h2>Quais dores mais combinam com o seu momento?</h2>
                <p>
                  Isso ajuda a deixar a leitura final mais fiel ao que voce esta vivendo agora.
                </p>
                <div className="panel-stack">
                  {symptomCategories.map((category) => (
                    <article key={category} className="info-card inline-card">
                      <span className="section-label">{category}</span>
                      <div className="chip-row">
                        {symptomOptions
                          .filter((option) => option.category === category)
                          .map((option) => (
                            <button
                              key={option.label}
                              className={
                                state.symptoms.includes(option.label) ? 'chip active' : 'chip'
                              }
                              onClick={() => toggleSymptom(option.label)}
                            >
                              {option.label}
                            </button>
                          ))}
                      </div>
                    </article>
                  ))}
                </div>
                <button
                  className="button button-primary"
                  disabled={state.symptoms.length === 0}
                  onClick={() => goTo('diagnosis')}
                >
                  Ver diagnostico
                </button>
              </section>
            ) : null}

            {state.step === 'diagnosis' ? (
              <section className="funnel-panel highlight-panel">
                <span className="section-label">Seu resultado</span>
                <h2>
                  {state.name ? `${state.name}, com base no que voce nos contou` : 'Com base no que voce nos contou'}
                </h2>
                <p>{diagnosis.band.label}</p>
                <div className="diagnosis-metrics">
                  <div className="metric-card">
                    <strong>{state.score}</strong>
                    <span>ponto de partida</span>
                  </div>
                  <div className="metric-card">
                    <strong>{diagnosis.markers.length}</strong>
                    <span>sinais que apareceram</span>
                  </div>
                  <div className="metric-card">
                    <strong>{state.symptoms.length}</strong>
                    <span>sintomas do seu momento</span>
                  </div>
                </div>
                <p>
                  {diagnosis.band.short}
                </p>
                <p>
                  Esse resultado foi montado a partir das suas respostas sobre frequencia,
                  impacto, escalada e perda de controle. Ele nao e uma sentenca. E um ponto de
                  partida para entender o que esta acontecendo hoje.
                </p>
                {diagnosis.markers.length > 0 ? (
                  <div className="timeline-list">
                    {diagnosis.markers.map((marker) => (
                      <div key={marker.id} className="timeline-item">
                        <strong>{marker.title}</strong>
                        <p>{marker.copy}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                <p>
                  Quando esse padrao ja ficou automatico demais, so forca de vontade costuma nao
                  bastar. O que ajuda e ter estrutura para reconhecer o gatilho, agir antes e
                  acompanhar o progresso com clareza.
                </p>
                {diagnosis.symptomPriorityCopies.length > 0 ? (
                  <div className="timeline-list">
                    {diagnosis.symptomPriorityCopies.map((copy) => (
                      <div key={copy} className="timeline-item">
                        <strong>O que seu plano precisa priorizar</strong>
                        <p>{copy}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                <button className="button button-primary" onClick={() => goTo('pain-carousel')}>
                  Entender o que isso significa
                </button>
              </section>
            ) : null}

            {state.step === 'pain-carousel' ? (
              <section className="funnel-panel">
                <span className="section-label">Carrossel de dor</span>
                <h2>{painSlides[state.painSlide].title}</h2>
                <p>{painSlides[state.painSlide].body}</p>
                <div className="carousel-dots">
                  {painSlides.map((item, index) => (
                    <span
                      key={item.title}
                      className={index === state.painSlide ? 'dot active' : 'dot'}
                    />
                  ))}
                </div>
                <button className="button button-primary" onClick={nextPainSlide}>
                  {state.painSlide === painSlides.length - 1 ? 'Ver a saida' : 'Continuar'}
                </button>
              </section>
            ) : null}

            {state.step === 'solution-carousel' ? (
              <section className="funnel-panel">
                <span className="section-label">Carrossel de solucao</span>
                <h2>{solutionSlides[state.solutionSlide].title}</h2>
                <p>{solutionSlides[state.solutionSlide].body}</p>
                <div className="carousel-dots">
                  {solutionSlides.map((item, index) => (
                    <span
                      key={item.title}
                      className={index === state.solutionSlide ? 'dot active' : 'dot'}
                    />
                  ))}
                </div>
                <button className="button button-primary" onClick={nextSolutionSlide}>
                  {state.solutionSlide === solutionSlides.length - 1
                    ? 'Ver como o Coruja ajuda'
                    : 'Continuar'}
                </button>
              </section>
            ) : null}

            {state.step === 'social-proof' ? (
              <section className="funnel-panel">
                <span className="section-label">Relatos e comparacao</span>
                <h2>Quem ja usou conta o que mudou</h2>
                <div className="timeline-list">
                  <div className="timeline-item">
                    <strong>Sozinho</strong>
                    <p>Normalmente falta continuidade quando o impulso sobe e os gatilhos aparecem de novo.</p>
                  </div>
                  <div className="timeline-item">
                    <strong>Bloqueador isolado</strong>
                    <p>Ajuda a cortar acesso, mas nao cuida sozinho do que acontece antes, durante e depois do gatilho.</p>
                  </div>
                  <div className="timeline-item">
                    <strong>Com Coruja</strong>
                    <p>Voce junta rotina, protecao, resposta imediata e historico para nao depender so de tentativa solta.</p>
                  </div>
                </div>
                <div className="testimonial-grid">
                  {testimonials.map((item) => (
                    <article key={item.name} className="testimonial-card">
                      <p>"{item.quote}"</p>
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                    </article>
                  ))}
                </div>
                <button className="button button-primary" onClick={() => goTo('plan-preview')}>
                  Ver meu plano
                </button>
              </section>
            ) : null}

            {state.step === 'plan-preview' ? (
              <section className="funnel-panel highlight-panel">
                <span className="section-label">Preview do plano</span>
                <h2>
                  Com base no que voce respondeu, tracamos um horizonte ate {getPlanDate()}
                </h2>
                <p>
                  Esse marco foi definido a partir do seu momento hoje. Nao e promessa de
                  resultado. E uma referencia para voce enxergar a direcao do seu plano.
                </p>
                <div className="timeline-list">
                  <div className="timeline-item">
                    <strong>Mais presenca no dia</strong>
                    <p>Entender melhor seus gatilhos e reduzir o piloto automatico nos horarios mais vulneraveis.</p>
                  </div>
                  <div className="timeline-item">
                    <strong>Menos peso depois de cair</strong>
                    <p>Ter um caminho claro para recomecar com mais rapidez, em vez de sumir por culpa ou cansaco.</p>
                  </div>
                  <div className="timeline-item">
                    <strong>Rotina mais protegida</strong>
                    <p>Usar apoio diario, resposta imediata e protecao do ambiente para ganhar mais consistencia.</p>
                  </div>
                </div>
                <button className="button button-primary" onClick={() => goTo('custom-plan')}>
                  Revelar meu plano
                </button>
              </section>
            ) : null}

            {state.step === 'custom-plan' ? (
              <section className="funnel-panel">
                <span className="section-label">Plano personalizado</span>
                <h2>
                  {state.name ? `${state.name}, seu plano foi montado a partir do que voce nos contou` : 'Seu plano foi montado a partir do que voce nos contou'}
                </h2>
                <p>
                  O Coruja organiza sua rotina em torno do que mais pesa hoje, do que te deixa
                  vulneravel e do que voce quer proteger daqui para frente.
                </p>
                <div className="timeline-list">
                  <div className="timeline-item">
                    <strong>Check-in diario</strong>
                    <p>Para voce perceber como esta, identificar seus gatilhos e nao deixar o dia correr no automatico.</p>
                  </div>
                  <div className="timeline-item">
                    <strong>SOS</strong>
                    <p>Para ter uma resposta imediata quando a vontade subir e atravessar o momento sem agir no impulso.</p>
                  </div>
                  <div className="timeline-item">
                    <strong>Bloqueador</strong>
                    <p>Para proteger o ambiente nos momentos em que confiar so na disciplina nao basta.</p>
                  </div>
                  <div className="timeline-item">
                    <strong>Jornal</strong>
                    <p>Para registrar o que aconteceu, entender padroes e recomecar com mais clareza quando precisar.</p>
                  </div>
                  <div className="timeline-item">
                    <strong>Analytics</strong>
                    <p>Para enxergar seu historico, perceber evolucao e entender o que mais pesa na sua rotina.</p>
                  </div>
                  <div className="timeline-item">
                    <strong>Metas</strong>
                    <p>Para transformar o processo em direcao concreta, com marcos visiveis e progresso acompanhado de perto.</p>
                  </div>
                </div>
                <p>
                  O app acompanha sua evolucao ao longo do caminho. Ele nao serve so para
                  registrar o que aconteceu, mas para te ajudar a ajustar a rota enquanto voce
                  avanca.
                </p>
                <button className="button button-primary" onClick={() => goTo('paywall')}>
                  Escolher meu plano
                </button>
              </section>
            ) : null}

            {state.step === 'paywall' ? (
              <section className="funnel-panel">
                <span className="section-label">Paywall</span>
                <h2>Escolha como quer comecar</h2>
                <p>
                  Seu plano ja esta pronto. Agora e so decidir o formato que faz mais sentido
                  para seguir com acompanhamento, protecao e progresso visivel.
                </p>
                <div className="pricing-grid">
                  {planOptions.map((plan) => (
                    <button
                      key={plan.id}
                      className={
                        state.selectedPlan === plan.id
                          ? 'plan-card plan-card-active'
                          : 'plan-card'
                      }
                      onClick={() =>
                        setState((current) => ({ ...current, selectedPlan: plan.id }))
                      }
                    >
                      <strong>{plan.title}</strong>
                      <span>{plan.price}</span>
                      <p>{plan.description}</p>
                    </button>
                  ))}
                </div>
                <button className="button button-primary" onClick={continueToOnboarding}>
                  {state.selectedPlan === 'annual'
                    ? 'Continuar com o plano anual'
                    : 'Continuar com acesso vitalicio'}
                </button>
                <button className="text-link" onClick={continueToOnboarding}>
                  Ver cadastro e liberar meu acesso
                </button>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
