import { motion } from 'framer-motion'
import { ChevronLeft, Heart } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../app/state/use-app-state'
import { appRoutes } from '../../core/config/routes'
import { AppShell } from '../../shared/layout/AppShell'

const GOAL_OPTIONS = [5, 10, 15, 30]
const FEELINGS = ['Ansiedade', 'Cansaço', 'Tédio', 'Solidão', 'Outro']

function resilienceLabel(percent: number) {
  if (percent >= 70) return { label: 'Alta', level: 'high' as const }
  if (percent >= 40) return { label: 'Média', level: 'medium' as const }
  return { label: 'Baixa', level: 'low' as const }
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const, delay },
})

export function RelapsePage() {
  const navigate = useNavigate()
  const { state, registerRelapse } = useAppState()

  const [nextGoalDays, setNextGoalDays] = useState(state.profile.goalDays || 5)
  const [customGoalVisible, setCustomGoalVisible] = useState(false)
  const [customDays, setCustomDays] = useState('')
  const [cause, setCause] = useState('')
  const [reflection, setReflection] = useState('')
  const [feelings, setFeelings] = useState<string[]>([])

  const progressPercent =
    state.profile.goalDays > 0
      ? Math.min(100, Math.round((state.streak.current / state.profile.goalDays) * 100))
      : 0

  const resilience = resilienceLabel(progressPercent)

  function toggleFeeling(f: string) {
    setFeelings((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    )
  }

  async function handleConfirm() {
    const causeWithFeelings =
      feelings.length > 0
        ? `[${feelings.join(', ')}]${cause ? ' — ' + cause : ''}`
        : cause

    await registerRelapse({
      nextGoalDays:
        customGoalVisible && Number(customDays) > 0
          ? Number(customDays)
          : nextGoalDays,
      cause: causeWithFeelings,
      reflection,
    })

    navigate('/app', { replace: true })
  }

  return (
    <AppShell
      title="Recaída"
      leading={
        <button className="app-back-button" type="button" onClick={() => navigate(appRoutes.home)}>
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
      }
    >
      <div className="relapse-page">

        {/* 1 — Hero de acolhimento */}
        <motion.div className="relapse-hero" {...fadeUp(0)}>
          <div className="relapse-hero-glow" />
          <div className="relapse-hero-icon-ring">
            <Heart size={26} strokeWidth={1.5} />
          </div>
          <h1 className="relapse-hero-title">Você ainda está no caminho</h1>
          <p className="relapse-hero-sub">
            Reconhecer é o primeiro passo. Estar aqui já é coragem.
          </p>
        </motion.div>

        {/* 2 — Jornada percorrida */}
        <motion.div className="relapse-journey-card" {...fadeUp(0.08)}>
          <span className="relapse-label">SUA JORNADA ATÉ AQUI</span>
          <div className="relapse-journey-body">
            <div className="relapse-journey-stat">
              <span className="relapse-journey-number">{state.streak.current}</span>
              <span className="relapse-journey-unit">dias</span>
            </div>
            <div className="relapse-journey-right">
              <span className={`relapse-resilience-badge relapse-resilience--${resilience.level}`}>
                {resilience.label}
              </span>
              <span className="relapse-journey-pct">{progressPercent}% da meta</span>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </motion.div>

        {/* 3 — Próxima meta */}
        <motion.div className="relapse-section" {...fadeUp(0.16)}>
          <span className="relapse-label relapse-label--amber">PRÓXIMA META</span>
          <p className="relapse-section-hint">Escolha um objetivo que pareça real agora.</p>
          <div className="relapse-goal-grid">
            {GOAL_OPTIONS.map((days) => (
              <button
                key={days}
                type="button"
                className={`relapse-goal-card${
                  nextGoalDays === days && !customGoalVisible
                    ? ' relapse-goal-card--active'
                    : ''
                }`}
                onClick={() => {
                  setNextGoalDays(days)
                  setCustomGoalVisible(false)
                }}
              >
                <span className="relapse-goal-days">{days}</span>
                <span className="relapse-goal-unit">dias</span>
              </button>
            ))}
          </div>
          {!customGoalVisible ? (
            <button
              type="button"
              className="relapse-custom-link"
              onClick={() => setCustomGoalVisible(true)}
            >
              Personalizar minha meta
            </button>
          ) : (
            <div className="relapse-custom-input-wrap">
              <input
                className="relapse-custom-input"
                type="number"
                min="1"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                placeholder="Quantos dias?"
              />
              <button
                type="button"
                className="relapse-custom-cancel"
                onClick={() => setCustomGoalVisible(false)}
              >
                Cancelar
              </button>
            </div>
          )}
        </motion.div>

        {/* 4 — O que você está sentindo? */}
        <motion.div className="relapse-section" {...fadeUp(0.24)}>
          <span className="relapse-label">O QUE VOCÊ ESTÁ SENTINDO?</span>
          <div className="relapse-feelings-row">
            {FEELINGS.map((f) => (
              <button
                key={f}
                type="button"
                className={`relapse-feeling-pill${
                  feelings.includes(f) ? ' relapse-feeling-pill--active' : ''
                }`}
                onClick={() => toggleFeeling(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 5 — Reflexão */}
        <motion.div className="relapse-section" {...fadeUp(0.32)}>
          <span className="relapse-label">O QUE ACONTECEU?</span>
          <textarea
            className="relapse-textarea"
            value={cause}
            onChange={(e) => setCause(e.target.value)}
            placeholder="Descreva o momento ou situação que antecedeu..."
            rows={3}
          />
          <span className="relapse-label">MENSAGEM PARA O SEU EU DE AMANHÃ</span>
          <textarea
            className="relapse-textarea relapse-textarea--last"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Uma lembrança, uma força, uma promessa..."
            rows={3}
          />
        </motion.div>

        {/* 6 — CTA */}
        <motion.div className="relapse-actions" {...fadeUp(0.4)}>
          <button
            type="button"
            className="button button-primary shimmer relapse-confirm-btn"
            onClick={() => void handleConfirm()}
          >
            Recomeçar Agora
          </button>
        </motion.div>

      </div>
    </AppShell>
  )
}
