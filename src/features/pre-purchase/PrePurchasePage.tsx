import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart2,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronLeft,
  Flame,
  Frown,
  HeartCrack,
  Leaf,
  Rocket,
  Shield,
  ShieldCheck,
  Sprout,
  Star,
  Target,
  Trophy,
  Unplug,
  Users,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../app/state/use-app-state'
import { QuizOption } from '../../components/quiz/QuizOption'
import {
  painSlides,
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

function getQuizProgress(quizIndex: number) {
  return ((quizIndex + 1) / quizQuestions.length) * 100
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



export function PrePurchasePage() {
  const navigate = useNavigate()
  const { state: appState } = useAppState()
  const [state, setState] = useState<PrePurchaseState>(() => loadPrePurchaseState() ?? initialState)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showPaywallSheet, setShowPaywallSheet] = useState(false)
  const [quizTransitionDirection, setQuizTransitionDirection] = useState<1 | -1>(1)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll testimonials
  useEffect(() => {
    if (state.step !== 'social-proof' || !scrollerRef.current) return

    const scroller = scrollerRef.current
    let scrollInterval: ReturnType<typeof window.setInterval> | null = null

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!scroller) return
        
        const cardWidth = scroller.offsetWidth * 0.85 + 16 // card width + gap
        const maxScroll = scroller.scrollWidth - scroller.offsetWidth
        
        if (scroller.scrollLeft >= maxScroll - 10) {
          scroller.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scroller.scrollBy({ left: cardWidth, behavior: 'smooth' })
        }
      }, 3500)
    }

    startAutoScroll()
    return () => {
      if (scrollInterval !== null) {
        window.clearInterval(scrollInterval)
      }
    }
  }, [state.step])

  useEffect(() => {
    savePrePurchaseState(state)
  }, [state])

  useEffect(() => {
    if (state.step !== 'loading') {
      setLoadingProgress(0)
      return
    }

    const duration = 2500
    const startTime = Date.now()
    let frameId: number

    setLoadingProgress(0)

    const frame = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const currentProgress = Math.min((elapsed / duration) * 100, 100)
      
      setLoadingProgress(currentProgress)

      if (elapsed < duration) {
        frameId = requestAnimationFrame(frame)
      } else {
        setState((current) => ({ ...current, step: 'identity' }))
      }
    }

    frameId = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(frameId)
  }, [state.step])

  const currentQuestion = quizQuestions[state.quizIndex]
  const quizProgress = getQuizProgress(state.quizIndex)
  const isFinalQuizQuestion =
    currentQuestion.id === quizQuestions[quizQuestions.length - 1]?.id &&
    currentQuestion.answers.length === 2
  const diagnosis = useMemo(
    () => getDiagnosisReport(state.score, state.quizAnswers, state.symptoms),
    [state.quizAnswers, state.score, state.symptoms],
  )
  const symptomCategoryMeta: Record<
    SymptomCategory,
    { icon: typeof Brain; description: string; accentClassName: string }
  > = {
    Mental: {
      icon: Brain,
      description: 'Foco, energia mental e clareza cognitiva.',
      accentClassName: 'is-mental',
    },
    Fisico: {
      icon: Activity,
      description: 'Sinais no corpo, energia e resposta sexual.',
      accentClassName: 'is-physical',
    },
    Social: {
      icon: Users,
      description: 'Conexao, autoconfianca e vida relacional.',
      accentClassName: 'is-social',
    },
    Fe: {
      icon: Shield,
      description: 'Sentido, integridade e vida espiritual.',
      accentClassName: 'is-faith',
    },
  }

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

  function handleQuizBack() {
    setQuizTransitionDirection(-1)

    setState((current) => {
      if (current.quizIndex > 0) {
        return {
          ...current,
          quizIndex: current.quizIndex - 1,
          pendingQuizAnswerIndex: null,
        }
      }

      return {
        ...current,
        pendingQuizAnswerIndex: null,
        step: 'landing',
      }
    })
  }

  function handleQuizOptionSelect(answerIndex: number) {
    setState((current) => ({
      ...current,
      pendingQuizAnswerIndex: answerIndex,
    }))
  }

  function handleQuizConfirm() {
    if (state.pendingQuizAnswerIndex === null) {
      return
    }

    const selectedAnswer = currentQuestion.answers[state.pendingQuizAnswerIndex]
    setQuizTransitionDirection(1)
    void confirmQuizAnswer(currentQuestion.id, state.pendingQuizAnswerIndex, selectedAnswer.points)
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

  const usesImmersiveFrame = [
    'landing',
    'quiz',
    'loading',
    'identity',
    'symptoms',
    'diagnosis',
    'pain-carousel',
    'solution-carousel',
    'social-proof',
  ].includes(state.step)

  const funnelFrameClassName =
    usesImmersiveFrame
      ? 'funnel-frame funnel-phone-frame funnel-phone-frame-quiz prepurchase-shell'
      : 'funnel-frame funnel-phone-frame prepurchase-shell'

  return (
    <div className="app-shell">
      <div className="phone-shell">
        <div className="phone-frame">
          <div className="phone-notch" aria-hidden="true" />

          <div
            className={funnelFrameClassName}
            style={{ maxWidth: '100vw', minWidth: 0, overflowX: 'hidden' }}
          >
            {!['landing', 'quiz', 'loading', 'identity', 'symptoms', 'diagnosis', 'pain-carousel', 'solution-carousel', 'social-proof', 'plan-preview', 'custom-plan', 'paywall'].includes(state.step) && (
              <header className="funnel-header">
                <div className="funnel-header-main" style={{ width: '100%' }}>
                  <span className="eyebrow">Pre-compra</span>
                  <h1>Coruja</h1>
                </div>
                <div className="funnel-progress">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${getProgress(state.step)}%` }}
                    />
                  </div>
                </div>
              </header>
            )}

            {state.step === 'landing' ? (
              <section className="prepurchase-landing">
                <div className="prepurchase-landing-brand">
                  <h1 className="prepurchase-logo">CORUJA</h1>

                  <div className="prepurchase-hero-copy">
                    <h2 className="prepurchase-hero-title">Bem-vindo!</h2>
                    <p className="prepurchase-hero-subtitle">
                      Vamos comecar descobrindo se voce esta enfrentando um problema com
                      pornografia.
                    </p>
                  </div>

                  <div className="prepurchase-social-proof" aria-label="Avaliacao media dos usuarios">
                    <Leaf className="prepurchase-social-proof-leaf" size={18} />
                    <div className="prepurchase-social-proof-text">
                      <span className="prepurchase-social-proof-rating">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} size={14} fill="currentColor" strokeWidth={1.8} />
                        ))}
                      </span>
                      <span className="prepurchase-social-proof-caption">
                        4.9 de avaliacao entre usuarios em recuperacao
                      </span>
                    </div>
                    <Leaf className="prepurchase-social-proof-leaf" size={18} />
                  </div>
                </div>

                <div className="prepurchase-landing-actions">
                  {appState.backup.status === 'conflict' && appState.backup.lastError ? (
                    <p className="warning-banner prepurchase-warning">{appState.backup.lastError}</p>
                  ) : null}

                  <button
                    type="button"
                    className="prepurchase-landing-primary"
                    onClick={() => goTo('quiz')}
                  >
                    <span>Iniciar Quiz</span>
                    <span className="prepurchase-landing-primary-icon" aria-hidden="true">
                      <ArrowRight size={16} strokeWidth={2.6} />
                    </span>
                  </button>

                  <button
                    type="button"
                    className="prepurchase-landing-secondary"
                    onClick={() => navigate('/account/auth?mode=login&loginOnly=1')}
                  >
                    Ja e assinante?
                  </button>
                </div>
              </section>
            ) : null}
            {state.step === 'quiz' ? (
              <section className="prepurchase-quiz">
                <div className="prepurchase-quiz-header">
                  <div className="prepurchase-quiz-header-row">
                    <button type="button" className="prepurchase-quiz-back" onClick={handleQuizBack}>
                      <ChevronLeft size={20} strokeWidth={2.4} />
                    </button>

                    <div className="prepurchase-quiz-meta">Pergunta #{state.quizIndex + 1}</div>

                    <div className="prepurchase-quiz-badge">PT-BR</div>
                  </div>

                  <div className="prepurchase-quiz-progress">
                    <div className="prepurchase-quiz-progress-copy">
                      <span>Seu avanco no quiz</span>
                      <span>{Math.round(quizProgress)}%</span>
                    </div>
                    <div className="prepurchase-quiz-progress-track">
                      <div
                        className="prepurchase-quiz-progress-fill"
                        style={{ width: `${quizProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentQuestion.id}
                    className="prepurchase-quiz-stage"
                    initial={{ opacity: 0, scale: 0.97, x: quizTransitionDirection * 24 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.97, x: quizTransitionDirection * -24 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="prepurchase-quiz-body">
                      <div className="prepurchase-quiz-copy">
                        <p className="prepurchase-quiz-kicker">{currentQuestion.factor}</p>
                        <h2 className="prepurchase-quiz-question">{currentQuestion.prompt}</h2>
                      </div>

                      {isFinalQuizQuestion ? (
                        <div className="prepurchase-quiz-decision">
                          {currentQuestion.answers.map((answer, answerIndex) => {
                            const selected = state.pendingQuizAnswerIndex === answerIndex
                            const isAffirmative = answerIndex === 1

                            return (
                              <button
                                key={answer.label}
                                type="button"
                                className={
                                  selected
                                    ? `prepurchase-quiz-decision-card ${
                                        isAffirmative
                                          ? 'prepurchase-quiz-decision-card-danger prepurchase-quiz-decision-card-selected'
                                          : 'prepurchase-quiz-decision-card-safe prepurchase-quiz-decision-card-selected'
                                      }`
                                    : `prepurchase-quiz-decision-card ${
                                        isAffirmative
                                          ? 'prepurchase-quiz-decision-card-danger'
                                          : 'prepurchase-quiz-decision-card-safe'
                                      }`
                                }
                                aria-pressed={selected}
                                onClick={() => handleQuizOptionSelect(answerIndex)}
                              >
                                <span className="prepurchase-quiz-decision-glow" />
                                <span className="prepurchase-quiz-decision-content">
                                  <span className="prepurchase-quiz-decision-kicker">
                                    {isAffirmative ? 'Sinal de alerta' : 'Sem perda declarada'}
                                  </span>
                                  <span className="prepurchase-quiz-decision-label">
                                    {answer.label}
                                  </span>
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="prepurchase-quiz-options">
                          {currentQuestion.answers.map((answer, answerIndex) => (
                            <QuizOption
                              key={answer.label}
                              number={answerIndex + 1}
                              label={answer.label}
                              selected={state.pendingQuizAnswerIndex === answerIndex}
                              onClick={() => handleQuizOptionSelect(answerIndex)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className={
                        state.pendingQuizAnswerIndex === null
                          ? 'prepurchase-quiz-confirm prepurchase-quiz-confirm-disabled'
                          : 'prepurchase-quiz-confirm'
                      }
                      onClick={handleQuizConfirm}
                      disabled={state.pendingQuizAnswerIndex === null}
                    >
                      Confirmar resposta
                    </button>
                  </motion.div>
                </AnimatePresence>
              </section>
            ) : null}
            {state.step === 'loading' ? (
              <section className="prepurchase-loading">
                <div className="prepurchase-loading-header">
                  <button
                    type="button"
                    className="prepurchase-quiz-back"
                    onClick={() => setState((current) => ({ ...current, step: 'quiz' }))}
                  >
                    <ChevronLeft size={20} strokeWidth={2.4} />
                  </button>
                </div>

                <div className="prepurchase-loading-body">
                  <div className="prepurchase-loading-ring-shell">
                    <div className="prepurchase-loading-ring">
                      <svg
                        className="prepurchase-loading-ring-svg"
                        viewBox="0 0 120 120"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient
                            id="prepurchaseLoadingRingGradient"
                            x1="10%"
                            y1="10%"
                            x2="90%"
                            y2="90%"
                          >
                            <stop offset="0%" stopColor="#F6F0E8" />
                            <stop offset="20%" stopColor="#EC9E32" />
                            <stop offset="62%" stopColor="#E35B2E" />
                            <stop offset="100%" stopColor="#FBBF24" />
                          </linearGradient>
                        </defs>
                        <circle
                          className="prepurchase-loading-ring-track"
                          cx="60"
                          cy="60"
                          r="46"
                        />
                        <circle
                          className="prepurchase-loading-ring-progress"
                          cx="60"
                          cy="60"
                          r="46"
                          pathLength="100"
                          style={{
                            strokeDasharray: 100,
                            strokeDashoffset: 100 - loadingProgress,
                          }}
                        />
                      </svg>

                      <div className="prepurchase-loading-ring-core">
                        <span className="prepurchase-loading-value">
                          {Math.round(loadingProgress)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="prepurchase-loading-copy">
                    <h2 className="prepurchase-loading-title">Calculando</h2>
                    <p className="prepurchase-loading-subtitle">
                      Construindo plano personalizado
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            {state.step === 'identity' ? (
              <section className="prepurchase-identity">
                <div className="prepurchase-quiz-header prepurchase-identity-header">
                  <div className="prepurchase-quiz-header-row">
                    <button
                      type="button"
                      className="prepurchase-quiz-back"
                      onClick={() => setState((current) => ({ ...current, step: 'quiz' }))}
                    >
                      <ChevronLeft size={20} strokeWidth={2.4} />
                    </button>

                    <div className="prepurchase-identity-progress" aria-hidden="true">
                      <div className="prepurchase-quiz-progress-track">
                        <div className="prepurchase-quiz-progress-fill" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div className="prepurchase-quiz-badge">PT-BR</div>
                  </div>
                </div>

                <div className="prepurchase-identity-body">
                  <div className="prepurchase-identity-copy">
                    <p className="prepurchase-quiz-kicker">Etapa final</p>
                    <h2 className="prepurchase-identity-title">Finalmente</h2>
                    <p className="prepurchase-identity-subtitle">Um pouco mais sobre voce</p>
                  </div>

                  <div className="prepurchase-identity-form">
                    <label className="prepurchase-identity-field">
                      <span className="prepurchase-identity-label">Seu nome</span>
                      <input
                        className="prepurchase-identity-input"
                        value={state.name}
                        onChange={(event) =>
                          setState((current) => ({ ...current, name: event.target.value }))
                        }
                        placeholder="Como prefere ser chamado?"
                      />
                    </label>

                    <label className="prepurchase-identity-field">
                      <span className="prepurchase-identity-label">Sua idade</span>
                      <input
                        className="prepurchase-identity-input"
                        value={state.age}
                        onChange={(event) =>
                          setState((current) => ({ ...current, age: event.target.value }))
                        }
                        placeholder="Ex: 22"
                        type="number"
                        inputMode="numeric"
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    className="prepurchase-identity-submit"
                    disabled={!state.name.trim() || !state.age.trim()}
                    onClick={() => goTo('symptoms')}
                  >
                    Concluir quiz
                  </button>
                </div>
              </section>
            ) : null}
            {state.step === 'symptoms' ? (
              <section className="prepurchase-symptoms">
                <div className="prepurchase-quiz-header prepurchase-symptoms-header">
                  <div className="prepurchase-quiz-header-row">
                    <button
                      type="button"
                      className="prepurchase-quiz-back"
                      onClick={() => setState((current) => ({ ...current, step: 'identity' }))}
                    >
                      <ChevronLeft size={20} strokeWidth={2.4} />
                    </button>

                    <div className="prepurchase-symptoms-title-wrap">
                      <div className="prepurchase-quiz-meta">Mapa de impacto</div>
                      <div className="prepurchase-symptoms-title">Sintomas</div>
                    </div>

                    <div className="prepurchase-quiz-badge">PT-BR</div>
                  </div>
                </div>

                <div className="prepurchase-symptoms-body">
                  <div className="prepurchase-symptoms-intro">
                    <div className="prepurchase-symptoms-alert">
                      <div className="prepurchase-symptoms-alert-icon">
                        <Activity size={18} strokeWidth={2.2} />
                      </div>
                      <div className="prepurchase-symptoms-alert-copy">
                        <span className="prepurchase-symptoms-alert-label">Sinal importante</span>
                        <p className="prepurchase-symptoms-alert-text">
                          O uso excessivo pode deixar marcas reais em areas importantes da sua vida.
                        </p>
                      </div>
                    </div>

                    <div className="prepurchase-symptoms-lead">
                      <p className="prepurchase-symptoms-lead-title">
                        O que mais tem pesado em voce?
                      </p>
                      <p className="prepurchase-symptoms-lead-body">
                        Selecione os sinais que combinam com seu momento.
                      </p>
                    </div>
                  </div>

                  <div className="prepurchase-symptoms-groups">
                    {symptomCategories.map((category) => {
                      const categoryOptions = symptomOptions.filter(
                        (option) => option.category === category,
                      )
                      const selectedCount = categoryOptions.filter((option) =>
                        state.symptoms.includes(option.label),
                      ).length
                      const meta = symptomCategoryMeta[category]
                      const Icon = meta.icon

                      return (
                        <section
                          key={category}
                          className={`prepurchase-symptom-group ${meta.accentClassName}`}
                        >
                          <div className="prepurchase-symptom-group-header">
                            <div className="prepurchase-symptom-group-icon">
                              <Icon size={16} strokeWidth={2.1} />
                            </div>

                            <div className="prepurchase-symptom-group-copy">
                              <div className="prepurchase-symptom-group-topline">
                                <h3 className="prepurchase-symptom-group-title">{category}</h3>
                                <span className="prepurchase-symptom-group-count">
                                  {selectedCount > 0 ? `${selectedCount} marcados` : 'Opcional'}
                                </span>
                              </div>
                              <p className="prepurchase-symptom-group-description">
                                {meta.description}
                              </p>
                            </div>
                          </div>

                          <div className="prepurchase-symptom-options">
                            {categoryOptions.map((option) => {
                              const isActive = state.symptoms.includes(option.label)

                              return (
                                <button
                                  key={option.label}
                                  type="button"
                                  className={
                                    isActive
                                      ? 'prepurchase-symptom-option prepurchase-symptom-option-active'
                                      : 'prepurchase-symptom-option'
                                  }
                                  aria-pressed={isActive}
                                  onClick={() => toggleSymptom(option.label)}
                                >
                                  <span className="prepurchase-symptom-option-marker">
                                    {isActive ? <CheckCircle2 size={16} strokeWidth={2.4} /> : null}
                                  </span>
                                  <span className="prepurchase-symptom-option-label">
                                    {option.label}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </section>
                      )
                    })}
                  </div>

                  <div className="prepurchase-symptoms-footer">
                    <div className="prepurchase-symptoms-selection">
                      <span className="prepurchase-symptoms-selection-value">
                        {state.symptoms.length}
                      </span>
                      <span className="prepurchase-symptoms-selection-copy">
                        sintomas selecionados para montar sua leitura
                      </span>
                    </div>

                    <button
                      type="button"
                      className="prepurchase-symptoms-submit"
                      disabled={state.symptoms.length === 0}
                      onClick={() => goTo('diagnosis')}
                    >
                      Continuar analise
                    </button>
                  </div>
                </div>
              </section>
            ) : null}
            {state.step === 'diagnosis' ? (
              <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: '0', background: 'transparent' }}>
                <div className="quiz-custom-header">
                  <button onClick={() => setState(cur => ({ ...cur, step: 'symptoms' }))}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  </button>
                  <div style={{ flex: 1 }}></div>
                  <div className="lang-badge">🇺🇸 EN</div>
                </div>

                <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', textAlign: 'center', marginTop: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    Análise Concluída 
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#1fa24e" stroke="#1fa24e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" stroke="none"></circle><polyline points="8 12 11 15 16 9" stroke="#fff"></polyline></svg>
                  </h2>
                  <p style={{ color: '#e0e0e0', textAlign: 'center', fontSize: '1.05rem', marginBottom: '32px' }}>
                    Temos algumas notícias para dar a você...<br/><br/>
                    {diagnosis.band.short}*
                  </p>

                  <div className="diagnosis-bar-chart">
                    <div className="bar-wrapper">
                      <div className="bar-fill bar-fill-red" style={{ height: `${Math.min(Math.max(state.score, 20), 100)}%` }}>
                        {state.score > 20 ? `${Math.round(state.score)}%` : ''}
                      </div>
                      <div className="bar-label">sua pontuação</div>
                    </div>
                    <div className="bar-wrapper">
                      <div className="bar-fill bar-fill-green" style={{ height: '40%' }}>
                        40%
                      </div>
                      <div className="bar-label">Média</div>
                    </div>
                  </div>

                  <p style={{ color: '#d7191d', textAlign: 'center', fontSize: '1rem', fontWeight: '600', marginBottom: '24px' }}>
                    {Math.round(state.score)}% maior dependência de pornografia 📈
                  </p>

                  <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: '0.8rem', marginBottom: '32px' }}>
                    * este resultado é apenas uma indicação, não um diagnóstico médico.
                  </p>

                  <div style={{ paddingBottom: '24px', marginTop: 'auto' }}>
                    <button className="button-blue-pill" onClick={() => goTo('pain-carousel')}>
                      Verificar seus sintomas
                    </button>
                  </div>
                </div>
              </section>
            ) : null}

            {state.step === 'pain-carousel' ? (
              <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: '0', background: 'transparent' }}>
                <div className="pain-carousel-logo">Coruja</div>

                <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                      {(() => {
                        const iconName = painSlides[state.painSlide].icon
                        if (iconName === 'Brain') return <Brain color="#fff" fill="#fbb6ce" size={100} strokeWidth={1} />
                        if (iconName === 'HeartCrack') return <HeartCrack color="#fff" fill="#e2e8f0" size={100} strokeWidth={1} />
                        if (iconName === 'Unplug') return <Unplug color="#fff" size={100} strokeWidth={1} />
                        if (iconName === 'Frown') return <Frown color="#fff" fill="#60a5fa" size={100} strokeWidth={1} />
                        return null
                      })()}
                    </div>

                    <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', marginBottom: '16px', lineHeight: '1.2' }}>
                      {painSlides[state.painSlide].title}
                    </h2>
                    <p style={{ color: '#fff', fontSize: '1.05rem', lineHeight: '1.5' }}>
                      {painSlides[state.painSlide].body}
                    </p>
                  </div>

                  <div style={{ paddingBottom: '24px', paddingTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="pain-carousel-dots">
                      {painSlides.map((item, index) => (
                        <span
                          key={item.title}
                          className={`pain-carousel-dot ${index === state.painSlide ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                    <button className="button-white-pill" style={{ width: 'fit-content', padding: '12px 32px' }} onClick={nextPainSlide}>
                      Próximo &gt;
                    </button>
                  </div>
                </div>
              </section>
            ) : null}

            {state.step === 'solution-carousel' ? (
              <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: '0', background: 'transparent' }}>
                <div className="pain-carousel-logo">Coruja</div>

                <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                      {(() => {
                        const iconName = solutionSlides[state.solutionSlide].icon
                        if (iconName === 'Rocket') return <Rocket color="#fff" fill="#facc15" size={120} strokeWidth={1} />
                        if (iconName === 'Brain') return <Brain color="#fff" fill="#cbd5e1" size={120} strokeWidth={1} />
                        if (iconName === 'Flame') return <Flame color="#fff" fill="#f97316" size={120} strokeWidth={1} />
                        if (iconName === 'ShieldCheck') return <ShieldCheck color="#fff" fill="#ef4444" size={120} strokeWidth={1} />
                        if (iconName === 'Trophy') return <Trophy color="#fff" fill="#facc15" size={120} strokeWidth={1} />
                        if (iconName === 'Sprout') return <Sprout color="#fff" fill="#22c55e" size={120} strokeWidth={1} />
                        if (iconName === 'Activity') return <Activity color="#fff" size={120} strokeWidth={1.5} />
                        return null
                      })()}
                    </div>

                    <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', marginBottom: '16px', lineHeight: '1.2' }}>
                      {solutionSlides[state.solutionSlide].title}
                    </h2>
                    <p style={{ color: '#fff', fontSize: '1.05rem', lineHeight: '1.5' }}>
                      {solutionSlides[state.solutionSlide].body}
                    </p>
                  </div>

                  <div style={{ paddingBottom: '24px', paddingTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="press-logos">
                      <span className="press-logo-text">Forbes</span>
                      <span className="press-logo-divider">|</span>
                      <span className="press-logo-text sans">TECH<br/>TIMES</span>
                      <span className="press-logo-divider">|</span>
                      <span className="press-logo-text">LA WEEKLY</span>
                    </div>

                    <div className="pain-carousel-dots">
                      {solutionSlides.map((item, index) => (
                        <span
                          key={item.title}
                          className={`pain-carousel-dot ${index === state.solutionSlide ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                    <button className="button-white-pill" style={{ width: 'fit-content', padding: '12px 32px' }} onClick={nextSolutionSlide}>
                      Próximo &gt;
                    </button>
                  </div>
                </div>
              </section>
            ) : null}

            {state.step === 'social-proof' ? (
              <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, minWidth: 0, width: '100%', padding: '0', background: 'transparent' }}>
                <div className="quiz-custom-header">
                  <button onClick={() => setState(cur => ({ ...cur, step: 'solution-carousel' }))}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  </button>
                  <div className="title" style={{ fontSize: '0.9rem', color: '#fff' }}>O Coruja ajuda você a parar a porn...</div>
                  <div style={{ flex: 1 }}></div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', width: '100%', minWidth: 0, maxWidth: '100vw' }}>
                  
                  {/* Custom Graph */}
                  <div className="social-proof-graph-container" style={{ flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
                      <div style={{ color: '#fff' }}>
                        <div style={{ fontWeight: '700', fontSize: '1rem', lineHeight: '1.2' }}>Porn Recovery</div>
                        <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '1.2rem', lineHeight: '0' }}>×</span> relapse
                        </div>
                      </div>
                      <span style={{ color: '#fff', fontWeight: '800', fontSize: '1.2rem', letterSpacing: '0.05em' }}>Coruja</span>
                    </div>
                    
                    <div style={{ width: '100%', position: 'relative', height: '160px' }}>
                      <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}>
                        {/* Grid Lines */}
                        <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                        
                        {/* Conventional Methods Area (Red) */}
                        <path 
                          d="M 0 160 
                             C 40 165, 60 145, 80 155 
                             S 120 175, 140 160 
                             S 180 135, 220 155 
                             S 260 175, 290 140 
                             S 330 110, 350 145 
                             S 380 160, 390 165" 
                          fill="none" 
                          stroke="#ef4444" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                        />
                        <path 
                          d="M 0 160 
                             C 40 165, 60 145, 80 155 
                             S 120 175, 140 160 
                             S 180 135, 220 155 
                             S 260 175, 290 140 
                             S 330 110, 350 145 
                             S 380 160, 390 165 
                             L 390 180 L 0 180 Z" 
                          fill="url(#redGrad)" 
                          opacity="0.3" 
                        />
                        <circle cx="0" cy="160" r="5" fill="#fff" />
                        <circle cx="390" cy="165" r="5" fill="#ef4444" />
                        
                        {/* Recovery Line (Green) */}
                        <path 
                          d="M 0 140 C 60 140, 120 90, 180 85 S 280 40, 360 30" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="4" 
                          strokeLinecap="round" 
                        />
                        <circle cx="0" cy="140" r="5" fill="#fff" />
                        <circle cx="360" cy="30" r="6" fill="#10b981" />
                        
                        {/* Status Bubbles */}
                        <g transform="translate(320, 45)">
                          <rect x="0" y="0" width="65" height="22" rx="11" fill="rgba(16, 185, 129, 0.15)" />
                          <text x="32" y="15" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">Recovery</text>
                        </g>

                        <g transform="translate(280, 115)">
                          <rect x="0" y="0" width="85" height="22" rx="11" fill="rgba(239, 68, 68, 0.1)" />
                          <text x="42" y="15" fill="#ef4444" fontSize="11" fontWeight="600" textAnchor="middle">Conventional</text>
                        </g>
                        
                        {/* Time Markers */}
                        <text x="60" y="198" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">Week 1</text>
                        <text x="200" y="198" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">Week 2</text>
                        <text x="340" y="198" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">Week 3</text>

                        {/* Gradients */}
                        <defs>
                          <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Horizontal Testimonials */}
                  <div className="testimonials-scroller" ref={scrollerRef} style={{ flexShrink: 0, width: '100%', minWidth: 0 }}>
                    {testimonials.map((item) => (
                      <div key={item.name} className="testimonial-card-horizontal">
                        <div className="testimonial-card-header">
                          <div className="testimonial-avatar">{item.name.charAt(0)}</div>
                          <div className="testimonial-name-wrap">
                            <span className="testimonial-name">{item.name}</span>
                            <BadgeCheck size={16} fill="#10b981" color="#fff" />
                          </div>
                        </div>
                        <h4 className="testimonial-title">{item.role}</h4>
                        <p className="testimonial-quote">{item.quote}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ flexShrink: 0, padding: '16px 20px 24px', background: 'transparent', width: '100%', minWidth: 0, maxWidth: '100vw', boxSizing: 'border-box' }}>
                  <p style={{ color: '#fff', textAlign: 'center', fontSize: '0.90rem', lineHeight: '1.4', marginBottom: '16px' }}>
                    O Coruja ajuda você a parar a pornografia 76% mais rápido do que apenas força de vontade. 📈
                  </p>
                  <button className="button-white-pill" onClick={() => goTo('plan-preview')}>
                    Continuar
                  </button>
                </div>
              </section>
            ) : null}

            {/* ── PLAN PREVIEW - Single scrollable page ── */}
            {state.step === 'plan-preview' ? (
              <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
                {/* Back button only - no dots, no progress bar */}
                <div className="quiz-custom-header" style={{ flexShrink: 0 }}>
                  <button onClick={() => goTo('social-proof')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  </button>
                  <div style={{ flex: 1 }} />
                </div>

                {/* Single scrollable column */}
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 2px 8px' }}>

                  {/* ── Section 1: Personalised plan header ── */}
                  <div className="plan-scroll-section" style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <CheckCircle2 size={16} color="#10b981" />
                      <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: '600' }}>Plano criado</span>
                    </div>
                    <h1 style={{ color: '#fff', fontSize: '1.65rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
                      {state.name ? `${state.name}, criamos um plano personalizado para você.` : 'Criamos um plano personalizado para você.'}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: '16px' }}>Você vai parar a pornografia até:</p>
                    <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px 18px', marginBottom: '20px', display: 'inline-block' }}>
                      <span style={{ color: '#fff', fontWeight: '700', fontSize: '1rem' }}>{getPlanDate()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '16px' }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginLeft: '4px' }}>4.9 · 10 mil avaliações</span>
                    </div>
                    <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700' }}>Torne-se a melhor versão de si mesmo com Coruja</p>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', marginTop: '4px' }}>Mais forte. Mais saudável. Mais feliz.</p>
                  </div>

                  <div className="plan-scroll-divider" />

                  {/* ── Section 2: Domine a si mesmo ── */}
                  <div className="plan-scroll-section" style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Trophy size={26} color="#fff" />
                      </div>
                      <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '800' }}>Domine a si mesmo</h2>
                    </div>
                    {[
                      { icon: <CheckCircle2 size={16} color="#10b981" />, text: 'Construa um autocontrole inabalável' },
                      { icon: <CheckCircle2 size={16} color="#a855f7" />, text: 'Torne-se mais atraente e confiante' },
                      { icon: <CheckCircle2 size={16} color="#f59e0b" />, text: 'Experimente intimidade real e conexão' },
                      { icon: <CheckCircle2 size={16} color="#10b981" />, text: 'Preencha cada dia com orgulho e felicidade' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px' }}>
                        {item.icon}
                        <span style={{ color: '#fff', fontSize: '0.9rem' }}>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="plan-scroll-divider" />

                  {/* ── Section 3: Profile card ── */}
                  <div className="plan-scroll-section" style={{ marginBottom: '28px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', textAlign: 'center', marginBottom: '14px' }}>Bem-vindo ao Coruja. Este é o cartão do seu perfil para acompanhar o progresso.</p>
                    <div style={{ background: 'linear-gradient(135deg, #f97316, #9333ea, #2563eb)', borderRadius: '18px', padding: '20px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '5px 10px' }}>
                          <span style={{ color: '#fff', fontWeight: '800', fontSize: '0.8rem' }}>CORUJA</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', opacity: 0.8 }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
                        </div>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', marginBottom: '2px' }}>Sequência ativa</p>
                      <p style={{ color: '#fff', fontSize: '2.2rem', fontWeight: '900', marginBottom: '16px' }}>0 days</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.67rem' }}>Nome</p>
                          <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.82rem' }}>{state.name || 'Usuário'}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.67rem' }}>Livre desde</p>
                          <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.82rem' }}>11/25</p>
                        </div>
                      </div>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textAlign: 'center', marginTop: '14px' }}>Agora, vamos construir o aplicativo em torno de você.</p>
                  </div>

                  <div className="plan-scroll-divider" />

                  {/* ── Section 4: All in one place ── */}
                  <div className="plan-scroll-section" style={{ marginBottom: '28px' }}>
                    <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>Tudo em um só lugar</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {[
                        { icon: <BarChart2 size={20} color="#a855f7" />, label: 'Dashboard', color: 'rgba(168,85,247,0.15)' },
                        { icon: <Shield size={20} color="#3b82f6" />, label: 'Bloqueador', color: 'rgba(59,130,246,0.15)' },
                        { icon: <Activity size={20} color="#10b981" />, label: 'Check-in', color: 'rgba(16,185,129,0.15)' },
                        { icon: <BookOpen size={20} color="#f59e0b" />, label: 'Jornal', color: 'rgba(245,158,11,0.15)' },
                        { icon: <Target size={20} color="#ef4444" />, label: 'Metas', color: 'rgba(239,68,68,0.15)' },
                        { icon: <Brain size={20} color="#8b5cf6" />, label: 'SOS', color: 'rgba(139,92,246,0.15)' },
                      ].map((item, i) => (
                        <div key={i} style={{ background: item.color, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {item.icon}
                          <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.82rem' }}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="plan-scroll-divider" />

                  {/* ── Section 5: Relacionamentos reais ── */}
                  <div className="plan-scroll-section" style={{ marginBottom: '28px' }}>
                    <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>Construa relacionamentos reais</h2>
                    {[
                      { icon: <CheckCircle2 size={16} color="#a855f7" />, text: 'Fortaleça sua inteligência emocional' },
                      { icon: <CheckCircle2 size={16} color="#3b82f6" />, text: 'Seja mais confiável e responsável' },
                      { icon: <CheckCircle2 size={16} color="#10b981" />, text: 'Experimente intimidade real e conexão' },
                      { icon: <CheckCircle2 size={16} color="#f59e0b" />, text: 'Torne-se a pessoa que eles merecem' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px' }}>
                        {item.icon}
                        <span style={{ color: '#fff', fontSize: '0.9rem' }}>{item.text}</span>
                      </div>
                    ))}
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', textAlign: 'center', marginTop: '10px', fontStyle: 'italic', padding: '0 8px' }}>
                      "A pornografia estava prejudicando minha capacidade de amar e de me relacionar. Ainda bem que consegui virar o jogo a tempo."
                    </p>
                  </div>

                  {/* ── Section 6: CTA ── */}
                  <div className="plan-scroll-section" style={{ paddingBottom: '8px' }}>
                    <button className="button-white-pill" onClick={() => goTo('custom-plan')}>Torne-se um Coruja</button>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', marginTop: '10px' }}>A compra aparece discretamente · Cancele quando quiser</p>
                  </div>

                </div>
              </section>
            ) : null}


            {/* ── CUSTOM PLAN = Neon Timeline ── */}
            {state.step === 'custom-plan' ? (
              <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
                <div className="quiz-custom-header">
                  <button onClick={() => goTo('plan-preview')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  </button>
                  <div style={{ flex: 1 }} />
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 16px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ background: 'rgba(168,85,247,0.2)', borderRadius: '8px', padding: '6px 10px' }}>
                        <span style={{ color: '#a855f7', fontWeight: '700', fontSize: '0.75rem' }}>✓ Sem compromisso, cancele quando quiser</span>
                      </div>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Coruja</p>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '900', lineHeight: '1.2', marginBottom: '8px' }}>Não é sobre força de vontade.</h2>
                    <p style={{ color: '#a855f7', fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>É sobre um sistema que realmente funciona</p>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '20px' }}>O Coruja te guia por um reinício de 30 dias, fornecendo estrutura e ferramentas que apoiam seu crescimento mesmo além desse período.</p>
                    <p style={{ color: '#fff', fontWeight: '700', marginBottom: '16px', fontSize: '0.9rem' }}>Veja como são seus primeiros 7 dias:</p>
                  </div>

                  {/* Timeline */}
                  <div style={{ position: 'relative', paddingLeft: '16px' }}>
                    {/* Vertical glowing line */}
                    <div style={{ position: 'absolute', left: '28px', top: '24px', bottom: '24px', width: '2px', background: 'linear-gradient(180deg, #a855f7, #6366f1, #3b82f6)', opacity: 0.4 }} />

                    {[
                      { day: 'Dia 0', title: 'Prepare seu espaço', body: 'Organize seu ambiente físico, digital e social para facilitar a mudança.', emoji: '🗓️', color: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.5)' },
                      { day: 'Dia 1', title: 'Vença a abstinência', body: 'Use técnicas mentais e físicas rápidas para atravessar os desejos e redefinir o foco.', emoji: '🧠', color: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.5)', highlight: 'No Dia 2, seu cérebro começa a se reiniciar. Os níveis de dopamina começam a se estabilizar. Os desejos podem surgir, mas é um sinal de que a cura começou.' },
                      { day: 'Dia 3', title: 'Fortaleça seu Porquê', body: 'Transforme seu motivo para parar em motivação diária e foco.', emoji: '🎯', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.5)' },
                      { day: 'Dia 4', title: 'Elimine os Sintomas', body: 'Lide com baixa energia, problemas de sono ou irritabilidade com resets simples.', emoji: '🔧', color: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.5)', highlight: 'Seu foco começa a voltar. A névoa levanta e a motivação retorna lentamente. Melhor sono, energia e clareza estão ao virar da esquina.' },
                      { day: 'Dia 5', title: 'Sinta-se Melhor no Corpo', body: 'Mova-se, coma limpo e recarregue — sua energia e clareza retornam rápido.', emoji: '💪', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.5)' },
                      { day: 'Dia 6', title: 'Você Não Está Sozinho', body: 'Conecte-se com outros no mesmo caminho. Compartilhe vitórias, receba apoio.', emoji: '🌐', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.5)' },
                      { day: 'Dia 7', title: 'Retome o Seu Tempo', body: 'Substitua velhos hábitos por metas reais e ação significativa.', emoji: '⏱️', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.5)' },
                      { day: 'Fim da Semana 1', title: 'Estatísticas e Momentum', body: 'Seus impulsos ainda existem, mas são mais fáceis de controlar. Energia, confiança e motivação real estão chegando. O sistema de recompensa do seu cérebro está se estabilizando — este é o primeiro sabor real de liberdade.', emoji: '📈', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.5)' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', position: 'relative' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: item.color, border: `2px solid ${item.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, fontSize: '0.8rem' }}>
                          {item.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          {item.highlight && (
                            <div style={{ background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', lineHeight: '1.5' }}>
                              {item.highlight}
                            </div>
                          )}
                          <div style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${item.border}`, borderRadius: '12px', padding: '14px', boxShadow: `0 0 15px ${item.border}30` }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', marginBottom: '4px', fontWeight: '600' }}>{item.day}</p>
                            <p style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem', marginBottom: '6px' }}>{item.title}</p>
                            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: '1.5' }}>{item.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ flexShrink: 0, padding: '16px 0 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
                    <CheckCircle2 size={14} color="#10b981" />
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Sem compromisso, cancele quando quiser</span>
                  </div>
                  <button
                    style={{ width: '100%', padding: '16px', borderRadius: '60px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,0.5)' }}
                    onClick={() => setShowPaywallSheet(true)}
                  >
                    COMEÇAR MINHA JORNADA HOJE 🙌
                  </button>
                </div>
              </section>
            ) : null}

            {/* ── PAYWALL (redirects to custom-plan neon timeline with sheet) ── */}
            {state.step === 'paywall' ? (
              <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Star size={40} color="#f59e0b" fill="#f59e0b" style={{ marginBottom: '16px' }} />
                  <p style={{ color: '#fff', fontWeight: '700', fontSize: '1rem' }}>Carregando seu plano...</p>
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── PAYWALL BOTTOM SHEET ── */}
      {showPaywallSheet && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          onClick={() => setShowPaywallSheet(false)}
        >
          {/* Backdrop */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />

          {/* Sheet */}
          <div
            style={{ position: 'relative', background: 'linear-gradient(180deg, #13102a 0%, #0d0b1f 100%)', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', boxShadow: '0 -20px 60px rgba(0,0,0,0.8)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)', margin: '0 auto 20px' }} />

            {/* Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(245,158,11,0.2)', borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>⚡</span>
                  <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '0.72rem' }}>60% Off Sale</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>9 vagas restantes</span>
              </div>
              <button onClick={() => setShowPaywallSheet(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
                <X size={20} />
              </button>
            </div>

            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', textAlign: 'center' }}>Escolha Seu Plano</h3>

            {/* Annual option */}
            <button
              style={{ width: '100%', background: state.selectedPlan === 'annual' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', border: state.selectedPlan === 'annual' ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', marginBottom: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
              onClick={() => setState(cur => ({ ...cur, selectedPlan: 'annual' }))}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${state.selectedPlan === 'annual' ? '#6366f1' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {state.selectedPlan === 'annual' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem' }}>Anual</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textDecoration: 'line-through' }}>R$149,90</div>
                    <div style={{ color: '#fff', fontWeight: '800', fontSize: '0.95rem' }}>R$ 12,49</div>
                  </div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>por mês</span>
              </div>
            </button>

            {/* Lifetime option */}
            <button
              style={{ width: '100%', background: state.selectedPlan === 'lifetime' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', border: state.selectedPlan === 'lifetime' ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', marginBottom: '20px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
              onClick={() => setState(cur => ({ ...cur, selectedPlan: 'lifetime' }))}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${state.selectedPlan === 'lifetime' ? '#6366f1' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {state.selectedPlan === 'lifetime' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem' }}>Vitalício</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textDecoration: 'line-through' }}>R$449,90</div>
                    <div style={{ color: '#fff', fontWeight: '800', fontSize: '0.95rem' }}>R$ 299,90</div>
                  </div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>pague uma vez</span>
              </div>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
              <Shield size={14} color="rgba(255,255,255,0.4)" />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Sem compromisso, cancele quando quiser</span>
            </div>

            <button
              style={{ width: '100%', padding: '16px', borderRadius: '60px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,0.5)' }}
              onClick={continueToOnboarding}
            >
              Começar minha jornada
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


