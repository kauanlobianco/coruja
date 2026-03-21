import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

const GOAL_OPTIONS = [5, 10, 15, 30]

const FEELINGS = ['Ansiedade', 'Cansaço', 'Tédio', 'Solidão', 'Outro']

function resilienceLabel(percent: number) {
  if (percent >= 70) return { label: 'Alta', level: 'high' as const }
  if (percent >= 40) return { label: 'Média', level: 'medium' as const }
  return { label: 'Baixa', level: 'low' as const }
}

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
      nextGoalDays: customGoalVisible && Number(customDays) > 0
        ? Number(customDays)
        : nextGoalDays,
      cause: causeWithFeelings,
      reflection,
    })

    navigate('/app', { replace: true })
  }

  return (
    <AppShell title="Recaída">
      <div className="relapse-page">

        {/* 1 — Acolhimento */}
        <div className="relapse-welcome">
          <div className="relapse-welcome-icon">
            <Heart size={32} strokeWidth={1.6} />
          </div>
          <h1 className="relapse-welcome-title">Um deslize não é o fim</h1>
          <p className="relapse-welcome-sub">
            Seu histórico continua aqui. Transforme este momento em um novo passo.
          </p>
        </div>

        {/* 2 — Cards de contexto */}
        <div className="relapse-context-row">
          <div className="relapse-context-card">
            <span className="relapse-label">JORNADA</span>
            <span className="relapse-context-value">{state.streak.current} dias</span>
            <div className="relapse-progress-track">
              <progress
                className="relapse-progress-bar"
                value={progressPercent}
                max={100}
              />
            </div>
          </div>
          <div className="relapse-context-card">
            <span className="relapse-label">RESILIÊNCIA</span>
            <span className={`relapse-context-value relapse-resilience--${resilience.level}`}>
              {resilience.label}
            </span>
            <span className="relapse-context-hint">{progressPercent}% da meta</span>
          </div>
        </div>

        {/* 3 — Escolha de meta */}
        <div className="relapse-section">
          <span className="relapse-label relapse-label--accent">NOVO RITMO</span>
          <div className="relapse-goal-grid">
            {GOAL_OPTIONS.map((days) => (
              <button
                key={days}
                type="button"
                className={`relapse-goal-card${nextGoalDays === days && !customGoalVisible ? ' relapse-goal-card--active' : ''}`}
                onClick={() => { setNextGoalDays(days); setCustomGoalVisible(false) }}
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
              ✦ Personalizar minha meta
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
        </div>

        {/* 4 — Reflexão */}
        <div className="relapse-section">
          <span className="relapse-label">O QUE ACONTECEU?</span>
          <textarea
            className="relapse-textarea"
            value={cause}
            onChange={(e) => setCause(e.target.value)}
            placeholder="Descreva o momento, sentimentos ou situações que precederam este evento..."
            rows={3}
          />

          <span className="relapse-label">O QUE LEMBRAR DEPOIS?</span>
          <textarea
            className="relapse-textarea"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Uma mensagem para o seu 'eu' de amanhã..."
            rows={3}
          />

          <span className="relapse-label">SENTIMENTO</span>
          <div className="relapse-feelings-row">
            {FEELINGS.map((f) => (
              <button
                key={f}
                type="button"
                className={`relapse-feeling-pill${feelings.includes(f) ? ' relapse-feeling-pill--active' : ''}`}
                onClick={() => toggleFeeling(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 5 — Botões */}
        <div className="relapse-actions">
          <button
            type="button"
            className="button button-primary relapse-confirm-btn"
            onClick={() => void handleConfirm()}
          >
            Confirmar e Recomeçar ↗
          </button>
          <button
            type="button"
            className="relapse-back-btn"
            onClick={() => navigate('/app')}
          >
            Voltar
          </button>
        </div>

      </div>
    </AppShell>
  )
}
