import { useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

const breathingSteps = ['Inspire', 'Segure', 'Expire', 'Pause']

export function SosPage() {
  const navigate = useNavigate()
  const { state, openSosSession } = useAppState()
  const [stepIndex, setStepIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(300)

  const motivations =
    state.profile.motivations.length > 0
      ? state.profile.motivations
      : ['Seu próximo passo ainda importa.']

  const activeMotivation = motivations[state.sos.totalSessions % motivations.length]
  const registerSosSession = useEffectEvent(() => {
    void openSosSession()
  })

  useEffect(() => {
    registerSosSession()
  }, [])

  useEffect(() => {
    const breathingTimer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % breathingSteps.length)
    }, 4000)

    const countdownTimer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => {
      window.clearInterval(breathingTimer)
      window.clearInterval(countdownTimer)
    }
  }, [])

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')

  return (
    <AppShell title="Modo SOS" eyebrow="Suporte imediato">
      <section className="info-card highlight-card">
        <span className="section-label">Intervenção rápida</span>
        <h2>{breathingSteps[stepIndex]}</h2>
        <p>
          Respiração guiada em ciclos simples para reduzir impulso automático e
          recuperar previsibilidade.
        </p>
        <div className="sos-breathing">{breathingSteps[stepIndex]}</div>
      </section>

      <section className="panel-stack">
        <div className="card-grid">
          <article className="info-card">
            <span className="section-label">Motivo de hoje</span>
            <h2>{activeMotivation}</h2>
            <p>
              O SOS já consome os motivos salvos no onboarding, como no fluxo do
              legado.
            </p>
          </article>

          <article className="info-card">
            <span className="section-label">Timer</span>
            <h2>
              {minutes}:{seconds}
            </h2>
            <p>
              Temporizador contínuo de apoio para atravessar o pico de impulso.
            </p>
          </article>
        </div>

        <div className="hero-actions">
          <button className="button button-secondary" onClick={() => navigate('/check-in')}>
            Voltar ao check-in
          </button>
          <button className="button button-primary" onClick={() => navigate('/app')}>
            Encerrar SOS
          </button>
        </div>
      </section>
    </AppShell>
  )
}
