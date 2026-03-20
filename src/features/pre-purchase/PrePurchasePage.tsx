import { useEffect, useMemo, useState } from 'react'
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
import { SocialProofStep } from './steps/SocialProofStep'
import { PlanPreviewStep } from './steps/PlanPreviewStep'
import { CustomPlanStep } from './steps/CustomPlanStep'
import { PaywallStep } from './steps/PaywallStep'

const steps: FunnelStep[] = [
  'landing', 'quiz', 'loading', 'identity', 'symptoms', 'diagnosis',
  'pain-carousel', 'solution-carousel', 'social-proof',
  'plan-preview', 'custom-plan', 'paywall',
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

function getProgress(step: FunnelStep) {
  return ((steps.indexOf(step) + 1) / steps.length) * 100
}

function getQuizProgress(quizIndex: number) {
  return ((quizIndex + 1) / quizQuestions.length) * 100
}

export function PrePurchasePage() {
  const navigate = useNavigate()
  const { state: appState } = useAppState()
  const [state, setState] = useState<PrePurchaseState>(() => loadPrePurchaseState() ?? initialState)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showPaywallSheet, setShowPaywallSheet] = useState(false)
  const [quizTransitionDirection, setQuizTransitionDirection] = useState<1 | -1>(1)

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
        return { ...current, quizIndex: current.quizIndex - 1, pendingQuizAnswerIndex: null }
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
        ...current.quizAnswers,
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
    setState((current) => ({
      ...current,
      painSlide: current.painSlide + 1,
      step: current.painSlide >= painSlides.length - 1 ? 'solution-carousel' : 'pain-carousel',
    }))
  }

  function nextSolutionSlide() {
    setState((current) => ({
      ...current,
      solutionSlide: current.solutionSlide + 1,
      step: current.solutionSlide >= solutionSlides.length - 1 ? 'social-proof' : 'solution-carousel',
    }))
  }

  function continueToOnboarding() {
    clearPrePurchaseState()
    navigate('/account/auth?mode=signup&signupOnly=1', { replace: true })
  }

  // ── Layout ─────────────────────────────────────────────────────────────────

  const usesImmersiveFrame = [
    'landing', 'quiz', 'loading', 'identity', 'symptoms', 'diagnosis',
    'pain-carousel', 'solution-carousel', 'social-proof',
  ].includes(state.step)

  const funnelFrameClassName = usesImmersiveFrame
    ? 'funnel-frame funnel-phone-frame funnel-phone-frame-quiz prepurchase-shell'
    : 'funnel-frame funnel-phone-frame prepurchase-shell'

  const showDefaultHeader = !steps.includes(state.step)

  return (
    <div className="app-shell">
      <div className="phone-shell">
        <div className="phone-frame">
          <div className="phone-notch" aria-hidden="true" />

          <div className={funnelFrameClassName} style={{ maxWidth: '100vw', minWidth: 0, overflowX: 'hidden' }}>
            {showDefaultHeader && (
              <header className="funnel-header">
                <div className="funnel-header-main" style={{ width: '100%' }}>
                  <span className="eyebrow">Pre-compra</span>
                  <h1>Coruja</h1>
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
                onContinue={() => goTo('symptoms')}
              />
            )}

            {state.step === 'symptoms' && (
              <SymptomsStep
                symptoms={state.symptoms}
                onToggleSymptom={toggleSymptom}
                onBack={() => setState((current) => ({ ...current, step: 'identity' }))}
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

            {state.step === 'pain-carousel' && (
              <PainCarouselStep slideIndex={state.painSlide} onNext={nextPainSlide} />
            )}

            {state.step === 'solution-carousel' && (
              <SolutionCarouselStep slideIndex={state.solutionSlide} onNext={nextSolutionSlide} />
            )}

            {state.step === 'social-proof' && (
              <SocialProofStep
                onBack={() => setState((current) => ({ ...current, step: 'solution-carousel' }))}
                onContinue={() => goTo('plan-preview')}
              />
            )}

            {state.step === 'plan-preview' && (
              <PlanPreviewStep
                name={state.name}
                onBack={() => goTo('social-proof')}
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
                onBack={() => goTo('plan-preview')}
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
