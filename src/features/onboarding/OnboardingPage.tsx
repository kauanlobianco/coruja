import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppState } from '../../app/state/use-app-state'
import { AppShell } from '../../shared/layout/AppShell'
import { getPrePurchaseAge, getPrePurchaseName } from '../pre-purchase/storage'
import { SelectionScreen, type SelectionOption } from '../../components/onboarding/SelectionScreen'

// ─── Data ────────────────────────────────────────────────────────────────────

const motivationOptions: SelectionOption[] = [
  { label: 'Mais clareza mental', emoji: '🧠' },
  { label: 'Voltar a ter controle', emoji: '🎯' },
  { label: 'Melhorar relacionamentos', emoji: '💛' },
  { label: 'Parar de perder tempo', emoji: '⏱' },
  { label: 'Dormir melhor', emoji: '🌙' },
  { label: 'Estar mais presente', emoji: '🌿' },
  { label: 'Autoestima mais sólida', emoji: '💪' },
  { label: 'Foco no trabalho', emoji: '📈' },
]

const triggerOptions: SelectionOption[] = [
  { label: 'Sozinho no quarto', emoji: '🚪' },
  { label: 'Celular na cama', emoji: '📱' },
  { label: 'Madrugada', emoji: '🌒' },
  { label: 'Redes sociais', emoji: '📲' },
  { label: 'Dia estressante', emoji: '😤' },
  { label: 'Após um conflito', emoji: '🌪' },
  { label: 'Sem rumo', emoji: '🌀' },
  { label: 'Enrolando tarefas', emoji: '😮‍💨' },
  { label: 'Depois de beber', emoji: '🍺' },
  { label: 'Ao acordar', emoji: '☀️' },
]

interface GoalOption {
  days: number
  label: string
  desc: string
  emoji: string
}

const goalOptions: GoalOption[] = [
  { days: 5,  label: 'Ganhar tração',    desc: 'Sair do automático com firmeza', emoji: '🚀' },
  { days: 10, label: 'Criar consistência', desc: 'Firmar rotina e criar distância', emoji: '📌' },
  { days: 15, label: 'Recomeço firme',   desc: 'Virar a chave com mais estrutura', emoji: '🔥' },
  { days: 30, label: 'Marco maior',      desc: 'Um compromisso mais longo',        emoji: '🏆' },
]

// ─── Slide transition variants ────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -56 : 56, opacity: 0 }),
}

const slideTransition = { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const }

// ─── Welcome Step (Step 0) ────────────────────────────────────────────────────

function WelcomeStep({ name, onNext }: { name: string; onNext: () => void }) {
  const displayName = name.trim() || 'você'

  return (
    <AppShell title="" eyebrow="" shellMode="entry" hideTopbar>
      <div className="ob-welcome-screen">
        {/* Progress */}
        <div style={{ padding: '0', flexShrink: 0 }}>
          <div className="ob-step-label" style={{ marginBottom: 12 }}>1 de 4</div>
          <div className="ob-progress-track">
            <motion.div
              className="ob-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: '25%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Hero content */}
        <div className="ob-welcome-hero">
          <div>
            <p className="ob-welcome-intro">Bem-vindo de volta</p>
            <h1 className="ob-welcome-title">
              Olá, <span className="ob-welcome-name">{displayName}</span>.<br />
              Vamos começar?
            </h1>
          </div>
          <p className="ob-welcome-sub">
            Em 3 passos rápidos vamos personalizar sua jornada. Escolha com calma — isso vai guiar tudo no app.
          </p>
        </div>

        {/* CTA */}
        <div className="ob-bottom-bar">
          <motion.button
            type="button"
            className="button ob-cta"
            onClick={onNext}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
          >
            Continuar
          </motion.button>
        </div>
      </div>
    </AppShell>
  )
}

// ─── Goal Step (Step 3 — single select + number prominent) ───────────────────

function GoalStep({
  step,
  progress,
  onContinue,
}: {
  step: string
  progress: number
  onContinue: (days: number) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <AppShell title="" eyebrow="" shellMode="entry" hideTopbar>
      <motion.div
        className="ob-screen"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="ob-header">
          <div className="ob-step-row">
            <span className="ob-step-label">{step}</span>
          </div>
          <h1 className="ob-title">Sua primeira meta</h1>
          <p className="ob-subtitle">Escolha uma meta séria, mas possível de sustentar.</p>
          <div
            className="ob-progress-track"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="ob-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Context card */}
        <div className="ob-context-card">
          <span className="ob-context-icon" aria-hidden="true">🎯</span>
          <p className="ob-context-message">
            Não precisa provar tudo agora. O importante é dar o primeiro passo com intenção.
          </p>
        </div>

        {/* Goal pills — single-col, number prominent */}
        <div className="ob-pills-area ob-pills-area--single">
          {goalOptions.map((opt) => {
            const isSelected = selected === opt.days
            return (
              <motion.button
                key={opt.days}
                type="button"
                className={`ob-goal-pill${isSelected ? ' ob-goal-pill--selected' : ''}`}
                onClick={() => setSelected(opt.days)}
                whileTap={{ scale: 0.97 }}
                animate={isSelected ? { scale: [1, 0.97, 1.02, 1.0] } : { scale: 1 }}
                transition={isSelected ? { duration: 0.18, times: [0, 0.3, 0.7, 1] } : { duration: 0.1 }}
              >
                <span className="ob-goal-emoji" aria-hidden="true">{opt.emoji}</span>
                <div className="ob-goal-days-block">
                  <span className="ob-goal-days-number">{opt.days}</span>
                  <span className="ob-goal-days-unit">dias</span>
                </div>
                <div className="ob-goal-pill-copy">
                  <span className="ob-goal-pill-title">{opt.label}</span>
                  <span className="ob-goal-pill-desc">{opt.desc}</span>
                </div>
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                      style={{ fontSize: 14, flexShrink: 0 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        {/* Bottom bar */}
        <div className="ob-bottom-bar">
          <AnimatePresence mode="wait">
            {selected !== null ? (
              <motion.button
                key="cta-active"
                type="button"
                className="button ob-cta"
                onClick={() => onContinue(selected!)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                Começar agora
              </motion.button>
            ) : (
              <motion.button
                key="cta-ghost"
                type="button"
                className="button ob-cta ob-cta--ghost"
                disabled
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Escolha sua meta para começar
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AppShell>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function OnboardingPage() {
  const navigate = useNavigate()
  const { state, completeOnboarding } = useAppState()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [motivations, setMotivations] = useState<string[]>(
    state.profile.motivations.length > 0 ? state.profile.motivations : [],
  )
  const [triggers, setTriggers] = useState<string[]>(
    state.profile.triggers.length > 0 ? state.profile.triggers : [],
  )

  const name = state.profile.name || getPrePurchaseName()

  function advance(nextStep: number) {
    setDirection(1)
    setStep(nextStep)
  }

  async function handleFinish(days: number) {
    const prePurchaseAge = getPrePurchaseAge()
    const resolvedAge =
      state.profile.age ?? (prePurchaseAge.trim() ? Number(prePurchaseAge) : null)

    await completeOnboarding({
      name: name.trim() || 'Usuário',
      age: resolvedAge,
      goalDays: days,
      motivations,
      triggers,
    })

    navigate('/app', { replace: true })
  }

  // Step 0 — Welcome hero
  if (step === 0) {
    return <WelcomeStep name={name} onNext={() => advance(1)} />
  }

  // Steps 1–3 — animated slide transitions
  return (
    <AnimatePresence mode="wait" custom={direction}>
      {step === 1 && (
        <motion.div
          key="step-motivations"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          style={{ height: '100%' }}
        >
          <SelectionScreen
            title="O que te trouxe aqui?"
            subtitle="Vamos personalizar sua jornada com base no que você selecionar."
            contextIcon="🤝"
            contextMessage="Você não está sozinho. Milhares de pessoas compartilham esses sentimentos e encontraram um caminho."
            options={motivationOptions}
            progress={0.5}
            step="2 de 4"
            onContinue={(selected) => {
              setMotivations(selected)
              advance(2)
            }}
          />
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          key="step-triggers"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          style={{ height: '100%' }}
        >
          <SelectionScreen
            title="Seus gatilhos"
            subtitle="Identifique os momentos em que você fica mais vulnerável."
            contextIcon="🔍"
            contextMessage="Conhecer seus gatilhos é o primeiro passo para ter controle sobre eles."
            options={triggerOptions}
            progress={0.75}
            step="3 de 4"
            onContinue={(selected) => {
              setTriggers(selected)
              advance(3)
            }}
          />
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          key="step-goal"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          style={{ height: '100%' }}
        >
          <GoalStep
            step="4 de 4"
            progress={1}
            onContinue={(days) => handleFinish(days)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
