import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../app/state/use-app-state'
import { quizQuestions, painSlides, solutionSlides } from './data'
import { clearPrePurchaseState, loadPrePurchaseState, savePrePurchaseState } from './storage'
import type { FunnelStep, PrePurchaseState, QuizAnswer, PlanOption } from './types'

import { LandingStep } from './steps/LandingStep'
import { QuizStep } from './steps/QuizStep'
import { LoadingStep } from './steps/LoadingStep'
import { IdentityStep } from './steps/IdentityStep'
import { SymptomsStep } from './steps/SymptomsStep'
import { DiagnosisStep, buildDiagnosisReport } from './steps/DiagnosisStep'
import { PainCarouselStep } from './steps/PainCarouselStep'
import { SolutionCarouselStep } from './steps/SolutionCarouselStep'
import { ToggleActivationStep } from './steps/ToggleActivationStep'
import { SocialProofStep } from './steps/SocialProofStep'
import { PlanPreviewStep } from './steps/PlanPreviewStep'
import { PlanRevealStep } from './steps/PlanRevealStep'
import { CustomPlanStep } from './steps/CustomPlanStep'
import { PaywallStep } from './steps/PaywallStep'

const steps: FunnelStep[] = [
  'landing', 'quiz', 'loading', 'identity', 'symptoms', 'diagnosis',
  'pain-carousel', 'toggle-activation', 'solution-carousel', 'social-proof',
  'plan-preview', 'plan-reveal', 'custom-plan', 'paywall',
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
  darkMode: false,
}

function getProgress(step: FunnelStep) {
  return ((steps.indexOf(step) + 1) / steps.length) * 100
}

function getQuizProgress(quizIndex: number) {
  return ((quizIndex + 1) / quizQuestions.length) * 100
}

export function PrePurchasePage() {
  const navigate = useNavigate()
  const { state: appState, demoNow } = useAppState()
  const [state, setState] = useState<PrePurchaseState>(() => loadPrePurchaseState() ?? initialState)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showPaywallSheet, setShowPaywallSheet] = useState(false)
  const [quizTransitionDirection, setQuizTransitionDirection] = useState<1 | -1>(1)
  const [painTransitionDirection, setPainTransitionDirection] = useState<1 | -1>(1)
  const [solutionTransitionDirection, setSolutionTransitionDirection] = useState<1 | -1>(1)
  const [carouselFlowDirection, setCarouselFlowDirection] = useState<1 | -1>(1)
  const [toggleActivated, setToggleActivated] = useState(false)

  // Persist state on every change
  useEffect(() => {
    savePrePurchaseState(state)
  }, [state])

  // Drive the loading animation and auto-advance to identity
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

  // Derived values
  const currentQuestion = quizQuestions[state.quizIndex]
  const quizProgress = getQuizProgress(state.quizIndex)

  const diagnosis = useMemo(
    () => buildDiagnosisReport(state.score, state.quizAnswers),
    [state.score, state.quizAnswers],
  )

  // ── Actions ────────────────────────────────────────────────────────────────

  function goTo(step: FunnelStep) {
    setState((current) => ({ ...current, step }))
  }

  function handleQuizBack() {
    setQuizTransitionDirection(-1)
    setState((current) => {
      if (current.quizIndex > 0) {
        const prevQuestionId = quizQuestions[current.quizIndex - 1]?.id
        const prevAnswer = current.quizAnswers.find((a) => a.questionId === prevQuestionId)
        return {
          ...current,
          quizIndex: current.quizIndex - 1,
          pendingQuizAnswerIndex: prevAnswer?.answerIndex ?? null,
        }
      }
      return { ...current, pendingQuizAnswerIndex: null, step: 'landing' }
    })
  }

  function handleQuizOptionSelect(answerIndex: number) {
    setState((current) => ({ ...current, pendingQuizAnswerIndex: answerIndex }))
  }

  function handleQuizConfirm() {
    if (state.pendingQuizAnswerIndex === null) return

    const selectedAnswer = currentQuestion.answers[state.pendingQuizAnswerIndex]
    setQuizTransitionDirection(1)

    setState((current) => {
      const quizAnswers: QuizAnswer[] = [
        ...current.quizAnswers.filter((a) => a.questionId !== currentQuestion.id),
        { questionId: currentQuestion.id, answerIndex: current.pendingQuizAnswerIndex!, points: selectedAnswer.points },
      ]
      const score = quizAnswers.reduce((sum, a) => sum + a.points, 0)
      const isLast = current.quizIndex === quizQuestions.length - 1

      if (isLast) {
        return { ...current, pendingQuizAnswerIndex: null, quizAnswers, score, step: 'loading' }
      }

      return { ...current, pendingQuizAnswerIndex: null, quizAnswers, score, quizIndex: current.quizIndex + 1 }
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
    setPainTransitionDirection(1)
    if (state.painSlide >= painSlides.length - 1) {
      setCarouselFlowDirection(1)
      setSolutionTransitionDirection(1)
    }
    setState((current) => ({
      ...current,
      painSlide: Math.min(current.painSlide + 1, painSlides.length - 1),
      step: current.painSlide >= painSlides.length - 1 ? 'toggle-activation' : 'pain-carousel',
    }))
  }

  function previousPainSlide() {
    setPainTransitionDirection(-1)
    setState((current) => ({
      ...current,
      painSlide: Math.max(current.painSlide - 1, 0),
      step: current.painSlide <= 0 ? 'diagnosis' : 'pain-carousel',
    }))
  }

  function nextSolutionSlide() {
    setSolutionTransitionDirection(1)
    setState((current) => ({
      ...current,
      solutionSlide: Math.min(current.solutionSlide + 1, solutionSlides.length - 1),
      step: current.solutionSlide >= solutionSlides.length - 1 ? 'social-proof' : 'solution-carousel',
    }))
  }

  function previousSolutionSlide() {
    setSolutionTransitionDirection(-1)
    if (state.solutionSlide <= 0) {
      setCarouselFlowDirection(-1)
      setPainTransitionDirection(-1)
    }
    setState((current) => ({
      ...current,
      solutionSlide: Math.max(current.solutionSlide - 1, 0),
      step: current.solutionSlide <= 0 ? 'pain-carousel' : 'solution-carousel',
      painSlide: current.solutionSlide <= 0 ? painSlides.length - 1 : current.painSlide,
    }))
  }

  function handleIdentityContinue() {
    setState((current) => ({ ...current, step: 'symptoms', darkMode: true }))
  }

  function continueToOnboarding() {
    clearPrePurchaseState()
    navigate('/account/auth?mode=signup&signupOnly=1', { replace: true })
  }

  // ── Layout ─────────────────────────────────────────────────────────────────

  const usesImmersiveFrame = [
    'landing', 'quiz', 'loading', 'identity', 'symptoms', 'diagnosis',
    'pain-carousel', 'toggle-activation', 'solution-carousel', 'social-proof',
  ].includes(state.step)

  const usesSolutionMood = state.step === 'solution-carousel' || state.step === 'social-proof'

  const showSolutionBg = usesSolutionMood
    || (state.step === 'toggle-activation' && toggleActivated)
  const showPainBg = (state.step === 'pain-carousel' || (state.step === 'toggle-activation' && !toggleActivated))

  const funnelFrameClassName = [
    usesImmersiveFrame
      ? 'funnel-frame funnel-phone-frame funnel-phone-frame-quiz prepurchase-shell'
      : 'funnel-frame funnel-phone-frame prepurchase-shell',
    state.darkMode && !showSolutionBg ? 'prepurchase-dark-mode' : '',
    state.step === 'pain-carousel' || state.step === 'toggle-activation' || state.step === 'solution-carousel' ? 'prepurchase-carousel-mode' : '',
    showPainBg ? 'prepurchase-pain-mode' : '',
    showSolutionBg ? 'prepurchase-solution-mode' : '',
  ].filter(Boolean).join(' ')

  const showDefaultHeader = !steps.includes(state.step)
  const isCarouselFlowStep = state.step === 'pain-carousel' || state.step === 'solution-carousel'

  const handleToggleActivate = useCallback(() => {
    setToggleActivated(true)
  }, [])

  const handleToggleActivationComplete = useCallback(() => {
    setCarouselFlowDirection(1)
    setToggleActivated(false)
    setState((current) => ({ ...current, step: 'solution-carousel' }))
  }, [])

  return (
    <div className="app-shell">
      <div className="phone-shell">
        <div className="phone-frame">
          <div className="phone-notch" aria-hidden="true" />

          <div className={funnelFrameClassName} style={{ maxWidth: '100vw', minWidth: 0, overflowX: 'hidden' }}>
            <div className="prepurchase-dark-overlay" aria-hidden="true" />
            {showDefaultHeader && (
              <header className="funnel-header">
                <div className="funnel-header-main" style={{ width: '100%' }}>
                  <span className="eyebrow">Pre-compra</span>
                  <h1>Foco Mode</h1>
                </div>
                <div className="funnel-progress">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${getProgress(state.step)}%` }} />
                  </div>
                </div>
              </header>
            )}

            {state.step === 'landing' && (
              <LandingStep
                conflictError={
                  appState.backup.status === 'conflict' ? (appState.backup.lastError ?? null) : null
                }
                onStart={() => goTo('quiz')}
              />
            )}

            {state.step === 'quiz' && (
              <QuizStep
                quizIndex={state.quizIndex}
                currentQuestion={currentQuestion}
                quizProgress={quizProgress}
                pendingAnswerIndex={state.pendingQuizAnswerIndex}
                transitionDirection={quizTransitionDirection}
                onBack={handleQuizBack}
                onSelectOption={handleQuizOptionSelect}
                onConfirm={handleQuizConfirm}
              />
            )}

            {state.step === 'loading' && (
              <LoadingStep
                progress={loadingProgress}
                onBack={() => setState((current) => ({ ...current, step: 'quiz' }))}
              />
            )}

            {state.step === 'identity' && (
              <IdentityStep
                name={state.name}
                age={state.age}
                onChangeName={(value) => setState((current) => ({ ...current, name: value }))}
                onChangeAge={(value) => setState((current) => ({ ...current, age: value }))}
                onBack={() => setState((current) => ({ ...current, step: 'quiz' }))}
                onContinue={handleIdentityContinue}
              />
            )}

            {state.step === 'symptoms' && (
              <SymptomsStep
                symptoms={state.symptoms}
                onToggleSymptom={toggleSymptom}
                onBack={() => setState((current) => ({ ...current, step: 'identity', darkMode: false }))}
                onContinue={() => goTo('diagnosis')}
              />
            )}

            {state.step === 'diagnosis' && (
              <DiagnosisStep
                score={state.score}
                diagnosis={diagnosis}
                onBack={() => setState((current) => ({ ...current, step: 'symptoms' }))}
                onContinue={() => goTo('pain-carousel')}
              />
            )}

            {isCarouselFlowStep && (
              <AnimatePresence mode="wait" initial={false} custom={carouselFlowDirection}>
                <motion.div
                  key={state.step}
                  className="prepurchase-carousel-switch"
                  custom={carouselFlowDirection}
                  initial={{
                    x: toggleActivated ? 0 : carouselFlowDirection > 0 ? 44 : -44,
                    opacity: 0,
                    scale: toggleActivated ? 1 : 0.986,
                    filter: toggleActivated ? 'blur(0px)' : 'blur(8px)',
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                  }}
                  exit={{
                    x: carouselFlowDirection > 0 ? -36 : 36,
                    opacity: 0,
                    scale: 0.992,
                    filter: 'blur(6px)',
                  }}
                  transition={{ duration: toggleActivated ? 0.8 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  {state.step === 'pain-carousel' ? (
                    <PainCarouselStep
                      slideIndex={state.painSlide}
                      transitionDirection={painTransitionDirection}
                      onBack={previousPainSlide}
                      onNext={nextPainSlide}
                    />
                  ) : (
                    <SolutionCarouselStep
                      slideIndex={state.solutionSlide}
                      transitionDirection={solutionTransitionDirection}
                      onBack={previousSolutionSlide}
                      onNext={nextSolutionSlide}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {state.step === 'toggle-activation' && (
              <ToggleActivationStep
                onActivate={handleToggleActivate}
                onComplete={handleToggleActivationComplete}
              />
            )}

            {state.step === 'social-proof' && (
              <SocialProofStep
                onBack={() => setState((current) => ({ ...current, step: 'solution-carousel' }))}
                onContinue={() => goTo('plan-preview')}
              />
            )}

            {state.step === 'plan-preview' && (
              <PlanPreviewStep
                onBack={() => goTo('social-proof')}
                onContinue={() => goTo('plan-reveal')}
              />
            )}

            {state.step === 'plan-reveal' && (
              <PlanRevealStep
                name={state.name}
                onBack={() => goTo('plan-preview')}
                onContinue={() => goTo('custom-plan')}
              />
            )}

            {state.step === 'custom-plan' && (
              <CustomPlanStep
                selectedPlan={state.selectedPlan}
                showPaywallSheet={showPaywallSheet}
                onSelectPlan={(plan: PlanOption['id']) =>
                  setState((current) => ({ ...current, selectedPlan: plan }))
                }
                onOpenPaywall={() => setShowPaywallSheet(true)}
                onClosePaywall={() => setShowPaywallSheet(false)}
                onBack={() => goTo('plan-reveal')}
                onContinueToOnboarding={continueToOnboarding}
              />
            )}

            {state.step === 'paywall' && <PaywallStep />}
          </div>
        </div>
      </div>
    </div>
  )
}
