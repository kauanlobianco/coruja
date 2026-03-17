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
    title: 'Perda de controle',
    matches: (answers: Map<number, number>) =>
      answers.get(13) === 1 || answers.get(6) === 4,
    copy:
      'Suas respostas indicam episodios de perda de controle, com dificuldade de interromper ou regular o comportamento.',
  },
  {
    id: 'interferencia-vida',
    title: 'Interferencia na vida',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(6)
      return answer === 3 || answer === 4
    },
    copy:
      'O comportamento ja apresenta interferencia em areas do dia a dia, o que aumenta significativamente o nivel de risco.',
  },
  {
    id: 'tentativas-frustradas',
    title: 'Tentativas frustradas',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(12)
      return answer === 3 || answer === 4
    },
    copy:
      'Voce relatou tentativas de reduzir ou parar que nao se mantiveram, o que sugere falha de regulacao do comportamento.',
  },
  {
    id: 'impacto-sexual',
    title: 'Impacto sexual',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(8)
      return answer !== undefined && answer >= 2
    },
    copy:
      'Existe impacto sexual associado ao padrao, o que indica prejuizo funcional especifico.',
  },
  {
    id: 'escalada',
    title: 'Escalada e tolerancia',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(10)
      return answer !== undefined && answer >= 2
    },
    copy:
      'Ha sinais de escalada: necessidade de estimulos mais intensos para obter o mesmo efeito.',
  },
  {
    id: 'impacto-emocional',
    title: 'Impacto emocional',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(9)
      return answer !== undefined && answer >= 2
    },
    copy:
      'Sua resposta indica um ciclo emocional apos o consumo, com culpa, vazio ou ansiedade que podem sustentar repeticao por reforco negativo.',
  },
  {
    id: 'gasto-financeiro',
    title: 'Gasto financeiro',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(11)
      return answer === 3 || answer === 4
    },
    copy:
      'Houve indicacao de impacto financeiro, que e um marcador objetivo de gravidade.',
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
      label: 'Risco critico',
      short: 'Perda recorrente de controle, impacto funcional severo e ciclo de reforco negativo.',
    }
  }

  if (score >= 56) {
    return {
      label: 'Risco alto',
      short: 'Dificuldade crescente de controle, escalada gradual e tentativas frustradas.',
    }
  }

  if (score >= 16) {
    return {
      label: 'Risco moderado',
      short: 'Indicios de automatizacao e inicio de impacto emocional.',
    }
  }

  return {
    label: 'Referencia saudavel',
    short: 'Baixo risco. Consumo nao dominante e governanca preservada.',
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
    copies.push('Seus sintomas fisicos sugerem priorizar recuperacao de vitalidade, energia e funcao sexual.')
  }

  if (map.has('Mental')) {
    copies.push('Os sintomas mentais apontam para foco, dopamina e clareza cognitiva como frente principal de recuperacao.')
  }

  if (map.has('Social')) {
    copies.push('Os sintomas sociais mostram que reconexao, autoestima e relacionamentos merecem entrar no plano desde o inicio.')
  }

  if (map.has('Fe')) {
    copies.push('Tambem existe uma camada espiritual importante para este usuario, que pode ser usada como ancora de recomeco.')
  }

  return copies
}

function getDiagnosisReport(score: number, quizAnswers: QuizAnswer[], symptoms: string[]) {
  const band = getRiskBand(score)
  const answersByQuestion = new Map<number, number>(
    quizAnswers.map((answer) => [answer.questionId, answer.answerIndex]),
  )
  const markers = markerRules.filter((rule) => rule.matches(answersByQuestion))
  const symptomPriorityCopies = getSymptomPriorityCopies(symptoms)
  const healthyDistance = Math.max(0, score - 15)

  return {
    band,
    markers,
    symptomPriorityCopies,
    healthyDistance,
  }
}

function getLandingChecks() {
  return [
    'Quiz psicometrico com 13 perguntas',
    'Score de risco real entre 0 e 100%',
    'Diagnostico com marcadores clinicos',
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
                <h2>Descubra seu score de risco e o que esta sustentando esse padrao.</h2>
                <p>
                  Este pre-compra agora segue a mesma estrutura mobile do produto e usa a
                  logica real de quiz e sintomas dos PRDs.
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
                    Iniciar avaliacao
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
                <h2>Calculando seu score de risco</h2>
                <p>
                  Cruzando intensidade, escalada, impacto emocional, sexual e perda de
                  controle para montar seu diagnostico.
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
                  Estes sintomas nao alteram o score. Eles personalizam a leitura final por
                  foco mental, vitalidade fisica, reconexao social e fe.
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
                <span className="section-label">Diagnostico</span>
                <h2>{diagnosis.band.label}</h2>
                <p>{diagnosis.band.short}</p>
                <div className="diagnosis-metrics">
                  <div className="metric-card">
                    <strong>{state.score}%</strong>
                    <span>score de risco</span>
                  </div>
                  <div className="metric-card">
                    <strong>{diagnosis.healthyDistance}%</strong>
                    <span>acima do limite saudavel</span>
                  </div>
                  <div className="metric-card">
                    <strong>{diagnosis.markers.length}</strong>
                    <span>marcadores clinicos</span>
                  </div>
                  <div className="metric-card">
                    <strong>{state.symptoms.length}</strong>
                    <span>sintomas marcados</span>
                  </div>
                </div>
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
                {diagnosis.symptomPriorityCopies.length > 0 ? (
                  <div className="timeline-list">
                    {diagnosis.symptomPriorityCopies.map((copy) => (
                      <div key={copy} className="timeline-item">
                        <strong>Prioridade do plano</strong>
                        <p>{copy}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                <button className="button button-primary" onClick={() => goTo('pain-carousel')}>
                  Entender o padrao
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
                  {state.painSlide === painSlides.length - 1 ? 'Ver solucao' : 'Proximo'}
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
                    ? 'Ver prova social'
                    : 'Proximo'}
                </button>
              </section>
            ) : null}

            {state.step === 'social-proof' ? (
              <section className="funnel-panel">
                <span className="section-label">Feedbacks</span>
                <h2>Voce nao precisa recomecar sozinho</h2>
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
                  {state.name || 'Voce'} em {getPlanDate()}
                </h2>
                <p>
                  Se nada mudar, o padrao tende a ganhar automatismo. Com plano, medicao e
                  protecao, o objetivo vira reduzir recaidas e recuperar governanca.
                </p>
                <button className="button button-primary" onClick={() => goTo('custom-plan')}>
                  Ver plano personalizado
                </button>
              </section>
            ) : null}

            {state.step === 'custom-plan' ? (
              <section className="funnel-panel">
                <span className="section-label">Plano personalizado</span>
                <h2>Seu primeiro mapa de execucao</h2>
                <div className="timeline-list">
                  <div className="timeline-item">
                    <strong>Fase 1</strong>
                    <p>Reduzir exposicao, mapear gatilhos e interromper o piloto automatico.</p>
                  </div>
                  <div className="timeline-item">
                    <strong>Fase 2</strong>
                    <p>Ganhar rotina com check-in, SOS, journal e visualizacao real do progresso.</p>
                  </div>
                  <div className="timeline-item">
                    <strong>Fase 3</strong>
                    <p>Consolidar consistencia, proteger horarios criticos e enfraquecer a escalada.</p>
                  </div>
                </div>
                <button className="button button-primary" onClick={() => goTo('paywall')}>
                  Escolher plano
                </button>
              </section>
            ) : null}

            {state.step === 'paywall' ? (
              <section className="funnel-panel">
                <span className="section-label">Paywall</span>
                <h2>Escolha o formato do seu reboot</h2>
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
                  Continuar com {state.selectedPlan === 'annual' ? 'Plano anual' : 'Acesso vitalicio'}
                </button>
                <button className="text-link" onClick={continueToOnboarding}>
                  Seguir para cadastro nesta fase do prototipo
                </button>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
