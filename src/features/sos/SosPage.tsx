import { useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

const breathingSteps = ['Inspire', 'Segure', 'Expire', 'Pause']
const defaultMotivations = ['Seu proximo passo ainda importa.']
const panicSupportMessages = [
  'Voce nao precisa vencer o dia inteiro agora. So os proximos minutos.',
  'A fissura sobe e desce. O seu trabalho aqui e nao obedecer no pico.',
  'Esperar tambem e uma acao. Continue no plano por mais um ciclo.',
]

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

  const registerSosSession = useEffectEvent(() => {
    void openSosSession()
  })

  useEffect(() => {
    registerSosSession()
  }, [])

  useEffect(() => {
    const breathingTimer = window.setInterval(() => {
      setStepIndex((current) => {
        const next = (current + 1) % breathingSteps.length
        if (next === 0) {
          setCycleCount((count) => count + 1)
        }
        return next
      })
    }, 3500)

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
    ? 'O pico ja passou. Volte para a home ou registre como ficou seu estado.'
    : panicSupportMessages[Math.min(cycleCount, panicSupportMessages.length - 1)]

  return (
    <AppShell title="Modo SOS" eyebrow="Suporte imediato">
      <section className="panel-stack">
        <article className="info-card highlight-card">
          <span className="section-label">Lembre-se do motivo</span>
          <h2>{activeMotivation}</h2>
          <p>
            Este bloco herda a ideia central do app antigo: colocar sua ancora na
            frente do impulso antes de qualquer outra decisao.
          </p>
          <div className="carousel-dots" aria-hidden="true">
            {motivations.map((motivation, index) => (
              <span
                key={motivation}
                className={motivationIndex === index ? 'dot active' : 'dot'}
              />
            ))}
          </div>
          {motivations.length > 1 ? (
            <button
              className="text-link"
              type="button"
              onClick={() => setMotivationIndex((current) => (current + 1) % motivations.length)}
            >
              Proximo motivo
            </button>
          ) : null}
        </article>

        <div className="card-grid">
          <article className="info-card">
            <span className="section-label">Respiracao guiada</span>
            <h2>{breathingSteps[stepIndex]}</h2>
            <p>
              Ciclos curtos para tirar o usuario do modo automatico e criar
              alguns minutos de distancia do gatilho.
            </p>
            <div className="sos-breathing">{breathingSteps[stepIndex]}</div>
            <p>{cycleCount} ciclo(s) completo(s)</p>
          </article>

          <article className="info-card">
            <span className="section-label">Segure por 5 minutos</span>
            <h2>{formatCountdown(secondsLeft)}</h2>
            <p>{supportMessage}</p>
            <div className="toolbar">
              <button
                className="button button-primary"
                type="button"
                onClick={() => {
                  setTimerStarted(true)
                  if (timerDone) {
                    setSecondsLeft(300)
                  }
                }}
              >
                {timerStarted && !timerDone ? 'Contagem em andamento' : 'Iniciar contagem'}
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  setTimerStarted(false)
                  setSecondsLeft(300)
                }}
              >
                Reiniciar
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="info-card">
        <span className="section-label">Proximo passo</span>
        <h2>Saia daqui com uma acao definida</h2>
        <p>
          O SOS nao e um fim em si. Ele prepara o usuario para voltar ao check-in
          ou retornar a home sem seguir o impulso.
        </p>
        <div className="hero-actions">
          <button className="button button-secondary" onClick={() => navigate('/check-in')}>
            Voltar ao check-in
          </button>
          <button className="button button-secondary" onClick={() => navigate('/journal')}>
            Ir para o jornal
          </button>
          <button className="button button-primary" onClick={() => navigate('/app')}>
            Voltar para a home
          </button>
        </div>
      </section>
    </AppShell>
  )
}
