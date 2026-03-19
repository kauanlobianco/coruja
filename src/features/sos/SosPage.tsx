import { useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

const breathingSteps = ['Inspire', 'Segure', 'Expire', 'Pause']
const defaultMotivations = ['Seu proximo passo ainda importa.']
const panicSupportMessages = [
  'Fique so nos proximos minutos.',
  'Nao siga o impulso no pico.',
  'Esperar tambem e agir.',
]

const breathingStepSeconds = 5
const breathingStepMs = breathingStepSeconds * 1000
const traceDurationMs = breathingStepMs * breathingSteps.length

function formatCountdown(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

export function SosPage() {
  const navigate = useNavigate()
  const { state, openSosSession } = useAppState()
  const motivations =
    state.profile.motivations.length > 0 ? state.profile.motivations : defaultMotivations

  const [stepIndex, setStepIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [motivationIndex, setMotivationIndex] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(300)
  const [breathPhaseSecondsLeft, setBreathPhaseSecondsLeft] = useState(breathingStepSeconds)

  const registerSosSession = useEffectEvent(() => {
    void openSosSession()
  })

  useEffect(() => {
    registerSosSession()
  }, [])

  useEffect(() => {
    const breathingTimer = window.setInterval(() => {
      setBreathPhaseSecondsLeft((current) => {
        if (current <= 1) {
          setStepIndex((step) => {
            const next = (step + 1) % breathingSteps.length
            if (next === 0) {
              setCycleCount((count) => count + 1)
            }
            return next
          })

          return breathingStepSeconds
        }

        return current - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(breathingTimer)
    }
  }, [])

  useEffect(() => {
    if (motivations.length <= 1) {
      return
    }

    const flashcardTimer = window.setInterval(() => {
      setMotivationIndex((current) => (current + 1) % motivations.length)
    }, 4000)

    return () => {
      window.clearInterval(flashcardTimer)
    }
  }, [motivations])

  useEffect(() => {
    if (!timerStarted || secondsLeft === 0) {
      return
    }

    const countdownTimer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => {
      window.clearInterval(countdownTimer)
    }
  }, [timerStarted, secondsLeft])

  const activeMotivation = motivations[motivationIndex % motivations.length]
  const timerDone = secondsLeft === 0
  const supportMessage = timerDone
    ? 'O pico passou. Escolha seu proximo passo.'
    : panicSupportMessages[Math.min(cycleCount, panicSupportMessages.length - 1)]

  return (
    <AppShell title="" eyebrow="" hideTopbar contentClassName="app-content-sos">
      <section className="sos-screen">
        <motion.div
          className="sos-content"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <h1>{activeMotivation}</h1>
          {motivations.length > 1 ? (
            <p className="sos-motivation-strip">{motivations.join(' • ')}</p>
          ) : null}

          <div className="sos-breathing-stage">
            <div
              className="sos-breathing"
              style={{ ['--sos-trace-duration' as any]: `${traceDurationMs}ms` }}
            >
              <div className="sos-breathing-perimeter">
                <svg className="sos-breathing-trace" viewBox="0 0 100 100" aria-hidden="true">
                  <defs>
                    <linearGradient id="sos-trace-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E07B39" />
                      <stop offset="100%" stopColor="#1ECFC4" />
                    </linearGradient>
                  </defs>
                  <rect
                    className="sos-breathing-trace-path"
                    x="8"
                    y="8"
                    width="84"
                    height="84"
                    rx="22"
                    ry="22"
                    pathLength={1}
                    fill="none"
                    stroke="url(#sos-trace-gradient)"
                  />
                </svg>

                <div className="sos-breathing-inner">
                  <span className="sos-breathing-phase-label">{breathingSteps[stepIndex]}</span>
                  <div className="sos-breathing-phase-number">{breathPhaseSecondsLeft}</div>
                </div>
              </div>
            </div>

            <p className="sos-support-copy">Siga o ritmo e ganhe alguns minutos de distancia.</p>
          </div>

          <div className="sos-timer-block">
            <span className="section-label">Segure por 5 minutos</span>
            <strong className="sos-timer">{formatCountdown(secondsLeft)}</strong>
            <p className="sos-support-copy">{supportMessage}</p>
          </div>

          <button
            className="sos-primary-button"
            type="button"
            onClick={() => {
              setTimerStarted(true)
              if (timerDone) {
                setSecondsLeft(300)
              }
            }}
          >
            {timerStarted && !timerDone ? 'Contagem em andamento' : 'Comecar agora'}
          </button>

          <div className="sos-secondary-actions">
            <button className="sos-secondary-button" onClick={() => navigate('/app')}>
              Estou bem, voltar para a Home
            </button>
            <button className="sos-secondary-button" onClick={() => navigate('/library')}>
              Relaxar na biblioteca de jogos
            </button>
          </div>
        </motion.div>
      </section>
    </AppShell>
  )
}
