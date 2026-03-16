import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  painSlides,
  planOptions,
  quizQuestions,
  solutionSlides,
  symptomOptions,
  testimonials,
} from './data'
import {
  clearPrePurchaseState,
  loadPrePurchaseState,
  savePrePurchaseState,
} from './storage'
import type { FunnelStep, PrePurchaseState } from './types'

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
  quizAnswers: [],
  score: 0,
  name: '',
  age: '',
  symptoms: [],
  selectedPlan: 'annual',
  painSlide: 0,
  solutionSlide: 0,
}

function getDiagnosisCopy(score: number) {
  if (score >= 40) {
    return {
      title: 'Padrão de alto risco detectado',
      body: 'Seu resultado sugere um ciclo já bem consolidado entre gatilho, impulso e culpa. A prioridade aqui é reduzir recaídas rápidas e reconstruir previsibilidade.',
    }
  }

  if (score >= 28) {
    return {
      title: 'Padrão moderado com sinais de escalada',
      body: 'Seu diagnóstico aponta repetição relevante e impacto claro em foco, sono e disciplina. Ainda é um ótimo momento para reorganizar a rotina.',
    }
  }

  return {
    title: 'Padrão inicial, mas já com impacto real',
    body: 'Mesmo num estágio mais leve, seu resultado mostra que já existe um ciclo se formando. O melhor momento para estruturar um plano é antes da escalada.',
  }
}

function getPlanDate() {
  const date = new Date()
  date.setDate(date.getDate() + 30)

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  })
}

function getProgress(step: FunnelStep) {
  return ((steps.indexOf(step) + 1) / steps.length) * 100
}

export function PrePurchasePage() {
  const navigate = useNavigate()
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
  const diagnosis = useMemo(() => getDiagnosisCopy(state.score), [state.score])

  function goTo(step: FunnelStep) {
    setState((current) => ({ ...current, step }))
  }

  function answerQuiz(points: number) {
    setState((current) => {
      const quizAnswers = [...current.quizAnswers, points]
      const score = quizAnswers.reduce((sum, value) => sum + value, 0)
      const isLast = current.quizIndex === quizQuestions.length - 1

      if (isLast) {
        return {
          ...current,
          quizAnswers,
          score,
          step: 'loading',
        }
      }

      return {
        ...current,
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
    navigate('/onboarding', { replace: true })
  }

  return (
    <div className="funnel-shell">
      <div className="funnel-frame">
        <header className="funnel-header">
          <div>
            <span className="eyebrow">Pre-compra React</span>
            <h1>Coruja</h1>
          </div>
          <div className="funnel-progress">
            <span>{Math.round(getProgress(state.step))}%</span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${getProgress(state.step)}%` }}
              />
            </div>
          </div>
        </header>

        {state.step === 'landing' ? (
          <section className="funnel-panel funnel-hero">
            <span className="section-label">Landing</span>
            <h2>Recomece com clareza, não no improviso</h2>
            <p>
              Um fluxo guiado para entender seu padrão, diagnosticar seus
              gatilhos e montar um plano mais estável antes de entrar no app.
            </p>
            <div className="hero-checks">
              <span>Quiz com 13 perguntas</span>
              <span>Sintomas e diagnóstico</span>
              <span>Plano e paywall desacoplados</span>
            </div>
            <button className="button button-primary" onClick={() => goTo('quiz')}>
              Iniciar avaliação
            </button>
          </section>
        ) : null}

        {state.step === 'quiz' ? (
          <section className="funnel-panel">
            <span className="section-label">Quiz</span>
            <h2>
              Pergunta {state.quizIndex + 1} de {quizQuestions.length}
            </h2>
            <p>{currentQuestion.prompt}</p>
            <div className="answer-grid">
              {currentQuestion.answers.map((answer) => (
                <button
                  key={answer.label}
                  className="answer-card"
                  onClick={() => answerQuiz(answer.points)}
                >
                  {answer.label}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {state.step === 'loading' ? (
          <section className="funnel-panel loading-panel">
            <span className="section-label">Loading</span>
            <h2>Gerando sua leitura personalizada</h2>
            <p>
              Cruzando padrão de impulso, impacto emocional e comportamento da
              rotina para montar a próxima etapa.
            </p>
            <div className="loading-ring" />
          </section>
        ) : null}

        {state.step === 'identity' ? (
          <section className="funnel-panel form-card">
            <span className="section-label">Identidade</span>
            <h2>Quem está começando esse reboot?</h2>
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
            <h2>Quais sinais mais combinam com o seu momento?</h2>
            <div className="chip-row">
              {symptomOptions.map((symptom) => (
                <button
                  key={symptom}
                  className={state.symptoms.includes(symptom) ? 'chip active' : 'chip'}
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                </button>
              ))}
            </div>
            <button
              className="button button-primary"
              disabled={state.symptoms.length === 0}
              onClick={() => goTo('diagnosis')}
            >
              Ver diagnóstico
            </button>
          </section>
        ) : null}

        {state.step === 'diagnosis' ? (
          <section className="funnel-panel highlight-panel">
            <span className="section-label">Diagnóstico</span>
            <h2>{diagnosis.title}</h2>
            <p>{diagnosis.body}</p>
            <div className="diagnosis-metrics">
              <div className="metric-card">
                <strong>{state.score}</strong>
                <span>Pontuação total</span>
              </div>
              <div className="metric-card">
                <strong>{state.symptoms.length}</strong>
                <span>Sintomas marcados</span>
              </div>
            </div>
            <button className="button button-primary" onClick={() => goTo('pain-carousel')}>
              Entender o padrão
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
              {state.painSlide === painSlides.length - 1 ? 'Ver solução' : 'Próximo'}
            </button>
          </section>
        ) : null}

        {state.step === 'solution-carousel' ? (
          <section className="funnel-panel">
            <span className="section-label">Carrossel de solução</span>
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
                : 'Próximo'}
            </button>
          </section>
        ) : null}

        {state.step === 'social-proof' ? (
          <section className="funnel-panel">
            <span className="section-label">Feedbacks</span>
            <h2>Você não precisa recomeçar sozinho</h2>
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
              {state.name || 'Você'} em {getPlanDate()}
            </h2>
            <p>
              Com um fluxo mais consistente, o foco é reduzir impulsos, recuperar
              previsibilidade e construir um histórico visível de progresso.
            </p>
            <button className="button button-primary" onClick={() => goTo('custom-plan')}>
              Ver plano personalizado
            </button>
          </section>
        ) : null}

        {state.step === 'custom-plan' ? (
          <section className="funnel-panel">
            <span className="section-label">Plano personalizado</span>
            <h2>Seu primeiro mapa de execução</h2>
            <div className="timeline-list">
              <div className="timeline-item">
                <strong>Semana 1</strong>
                <p>Mapear gatilhos, ajustar rotina e reduzir exposição aos horários críticos.</p>
              </div>
              <div className="timeline-item">
                <strong>Semana 2</strong>
                <p>Consolidar check-in e respostas rápidas para ansiedade, tédio e estresse.</p>
              </div>
              <div className="timeline-item">
                <strong>Semana 3+</strong>
                <p>Ganhar consistência e visualizar progresso com metas e intervenções mais precisas.</p>
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
              Continuar com {state.selectedPlan === 'annual' ? 'Plano anual' : 'Acesso vitalício'}
            </button>
            <button className="text-link" onClick={continueToOnboarding}>
              Seguir para onboarding nesta fase do protótipo
            </button>
          </section>
        ) : null}
      </div>
    </div>
  )
}
