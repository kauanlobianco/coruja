import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Brain, ListChecks, Mic, ShieldCheck, Wind, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { appRoutes } from '../../core/config/routes'
import { TypewriterLine } from '../../components/ui/TypewriterLine'
import { OrbFadeLine } from '../../components/ui/OrbFadeLine'
import { AiMentorChat } from '../library/components/AiMentorChat'
import { buildSosRescuePlan } from './sos-rescue-plan'
import { buildSosSystemPrompt } from './sos-system-prompt'
import { useVoiceMentor } from './use-voice-mentor'

type SosPanel = null | 'shield' | 'breathe' | 'plan'

const BREATHING_STEPS = ['Inspire', 'Segure', 'Expire', 'Pause']
const BREATH_STEP_SECONDS = 5
const BREATH_TOTAL_CYCLES = 4
const WAVE_HEIGHTS = [6, 12, 18, 14, 22, 16, 10, 18, 12, 6]

function PanelOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="sos-v2-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    />
  )
}

function PanelShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <PanelOverlay onClose={onClose} />
      <motion.div
        className="sos-v2-panel"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      >
        <button type="button" className="sos-v2-panel-close" onClick={onClose} aria-label="Fechar">
          <X size={16} strokeWidth={2} />
        </button>
        {children}
      </motion.div>
    </>
  )
}

function ShieldPanel({
  rescuePlan,
  motivations,
  onClose,
}: {
  rescuePlan: ReturnType<typeof buildSosRescuePlan>
  motivations: string[]
  onClose: () => void
}) {
  return (
    <PanelShell onClose={onClose}>
      <h2 className="sos-v2-panel-title">Seu lembrete</h2>

      {motivations.length > 0 ? (
        <div className="sos-v2-panel-section">
          <span className="sos-v2-panel-label">O que voce quer proteger</span>
          <div className="sos-v2-panel-chips">
            {motivations.slice(0, 3).map((motivation) => (
              <span key={motivation} className="sos-v2-chip">{motivation}</span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="sos-v2-panel-section">
        <span className="sos-v2-panel-label">Sua resposta</span>
        <div className="sos-v2-trap-list">
          {rescuePlan.trapOptions.map((trap) => (
            <div key={trap.id} className="sos-v2-trap-item">
              <p className="sos-v2-trap-text">"{trap.text}"</p>
              <p className="sos-v2-trap-response">{trap.responseText}</p>
            </div>
          ))}
        </div>
      </div>
    </PanelShell>
  )
}

function BreathePanel({ onClose }: { onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(BREATH_STEP_SECONDS)
  const [cycleCount, setCycleCount] = useState(0)
  const [cycleComplete, setCycleComplete] = useState(false)

  useEffect(() => {
    if (cycleComplete) return

    const interval = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds > 1) return seconds - 1

        setStepIndex((index) => {
          const next = (index + 1) % BREATHING_STEPS.length
          if (next === 0) {
            setCycleCount((count) => {
              const updated = count + 1
              if (updated >= BREATH_TOTAL_CYCLES) setCycleComplete(true)
              return updated
            })
          }
          return next
        })

        return BREATH_STEP_SECONDS
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [cycleComplete])

  const progress = (BREATH_STEP_SECONDS - secondsLeft) / BREATH_STEP_SECONDS
  const circumference = 2 * Math.PI * 44

  return (
    <PanelShell onClose={onClose}>
      <h2 className="sos-v2-panel-title">Respira comigo</h2>
      <p className="sos-v2-panel-sub">Um minuto. Sem decidir nada no meio.</p>

      {cycleComplete ? (
        <div className="sos-v2-breathe-done">
          <p className="sos-v2-breathe-done-text">Voce voltou para o corpo.</p>
          <p className="sos-v2-breathe-done-sub">Agora volta para a tela principal e fica comigo.</p>
          <button type="button" className="sos-v2-panel-btn" onClick={onClose}>Fechar</button>
        </div>
      ) : (
        <div className="sos-v2-breathe-body">
          <div className="sos-v2-breathe-orb-wrap">
            <svg className="sos-v2-breathe-ring" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.85s linear' }}
              />
            </svg>

            <div className="sos-v2-breathe-center">
              <span className="sos-v2-breathe-phase">{BREATHING_STEPS[stepIndex]}</span>
              <span className="sos-v2-breathe-count">{secondsLeft}s</span>
            </div>
          </div>

          <p className="sos-v2-breathe-hint">
            {BREATH_TOTAL_CYCLES - cycleCount} ciclos restantes
          </p>
        </div>
      )}
    </PanelShell>
  )
}

function QuickPlanPanel({
  actions,
  onClose,
}: {
  actions: string[]
  onClose: () => void
}) {
  return (
    <PanelShell onClose={onClose}>
      <h2 className="sos-v2-panel-title">Quebra o impulso</h2>
      <p className="sos-v2-panel-sub">Escolhe uma e faz agora.</p>
      <ol className="sos-v2-plan-list">
        {actions.map((item, index) => (
          <li key={item} className="sos-v2-plan-item">
            <span className="sos-v2-plan-num">{index + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </PanelShell>
  )
}

export function SosPage() {
  const navigate = useNavigate()
  const { state, openSosSession } = useAppState()

  const rescuePlan = useMemo(
    () => buildSosRescuePlan(state.profile, state.sos.configuration),
    [state.profile, state.sos.configuration],
  )

  const liveLines = useMemo(
    () => [
      rescuePlan.presenceLine,
      rescuePlan.momentLine,
      rescuePlan.trapLine,
      rescuePlan.motivationLine,
      rescuePlan.shieldLine,
      rescuePlan.actionLine,
    ],
    [
      rescuePlan.presenceLine,
      rescuePlan.momentLine,
      rescuePlan.trapLine,
      rescuePlan.motivationLine,
      rescuePlan.shieldLine,
      rescuePlan.actionLine,
    ],
  )

  const [activePanel, setActivePanel] = useState<SosPanel>(null)
  const [lineIndex, setLineIndex] = useState(0)
  const [lineComplete, setLineComplete] = useState(false)
  const [mentorOpen, setMentorOpen] = useState(false)

  const systemPrompt = useMemo(
    () => buildSosSystemPrompt(state, rescuePlan),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const { voiceState, reply, error: voiceError, handleOrbTap } = useVoiceMentor({
    systemPrompt,
  })

  const registerSosSession = useEffectEvent(() => { void openSosSession() })
  useEffect(() => { registerSosSession() }, [registerSosSession])

  useEffect(() => {
    setLineIndex(0)
    setLineComplete(false)
  }, [liveLines])

  useEffect(() => {
    if (!lineComplete) return
    // Pause text cycling while voice is active
    if (voiceState !== 'idle' && voiceState !== 'error') return

    const timeout = window.setTimeout(() => {
      setLineIndex((index) => (index + 1) % liveLines.length)
      setLineComplete(false)
    }, 1500)

    return () => window.clearTimeout(timeout)
  }, [lineComplete, liveLines.length, voiceState])

  const activeLine = liveLines[lineIndex]
  const isCommandLine = activeLine === rescuePlan.actionLine

  // What text to show inside orb — AI reply overrides the typewriter lines
  const voiceActive = voiceState !== 'idle' && voiceState !== 'error'

  return (
    <AppShell title="" eyebrow="" shellMode="entry" hideTopbar contentClassName="app-content-sos">
      <div className="sos-v3-screen">
        <div className="sos-v3-topbar">
          <div className="sos-v3-chip">SOS ativo</div>
          <button
            type="button"
            className="sos-v3-close"
            onClick={() => navigate(-1)}
            aria-label="Fechar"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="sos-v3-stage">
          <div className="sos-v3-core">
            <motion.button
              type="button"
              className={[
                'sos-v3-orb',
                voiceState === 'listening' ? 'is-listening' : '',
                voiceState === 'processing' ? 'is-processing' : '',
                voiceState === 'speaking' ? 'is-speaking' : '',
              ].filter(Boolean).join(' ')}
              onClick={handleOrbTap}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.985 }}
            >
              <div className="sos-v3-aura sos-v3-aura--one" aria-hidden="true" />
              <div className="sos-v3-aura sos-v3-aura--two" aria-hidden="true" />
              <div className="sos-v3-ring sos-v3-ring--outer" aria-hidden="true" />
              <div className="sos-v3-ring sos-v3-ring--inner" aria-hidden="true" />

              <div className="sos-v3-orb-content">
                <span className="sos-v3-presence">
                  {voiceState === 'requesting'
                    ? 'aguardando microfone...'
                    : voiceState === 'listening'
                      ? <span className="sos-v3-mic-hint"><Mic size={11} />ouvindo...</span>
                      : voiceState === 'processing'
                        ? 'processando...'
                        : 'toque para conversar'}
                </span>

                <div className="sos-v3-message-wrap">
                  <AnimatePresence mode="wait">
                    {voiceActive ? (
                      <motion.div
                        key={`voice-${voiceState}`}
                        className="sos-v3-message-line"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        {voiceState === 'speaking' ? (
                          <OrbFadeLine
                            key={reply}
                            text={reply}
                            holdMs={1600}
                            className="sos-v3-message sos-v3-message--ai"
                          />
                        ) : (
                          <span className="sos-v3-message sos-v3-message--dim">
                            {voiceState === 'listening' ? '\u00a0' : 'pensando...'}
                          </span>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`tw-${lineIndex}`}
                        className="sos-v3-message-line"
                        initial={{ opacity: 0, filter: 'blur(3px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(3px)' }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                      >
                        <TypewriterLine
                          key={`${lineIndex}-${activeLine}`}
                          text={activeLine}
                          charDelay={58}
                          onComplete={() => setLineComplete(true)}
                          className={`sos-v3-message${isCommandLine ? ' is-command' : ''}`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={`sos-v3-waveform${voiceState === 'listening' ? ' is-active' : ''}`} aria-hidden="true">
                  {WAVE_HEIGHTS.map((height, index) => (
                    <div
                      key={index}
                      className="sos-v3-wave-bar"
                      style={{
                        height: `${height}px`,
                        animationDelay: `${index * (voiceState === 'listening' ? 0.07 : 0.1)}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.button>

            {voiceError ? (
              <p className="sos-v3-voice-error">{voiceError}</p>
            ) : null}
          </div>

          <div className="sos-v3-tools-section">
            <p className="sos-v3-tools-title">Ferramentas</p>
            <div className="sos-v3-support-dock" aria-label="Apoios secundarios">
              <button type="button" className="sos-v3-support-btn" onClick={() => setActivePanel('shield')}>
                <div className="sos-v3-support-icon sos-v3-support-icon--blue">
                  <ShieldCheck size={18} strokeWidth={2} />
                </div>
                <div className="sos-v3-support-text">
                  <span className="sos-v3-support-name">Lembrete</span>
                  <span className="sos-v3-support-desc">Seus motivos e respostas</span>
                </div>
              </button>

              <button type="button" className="sos-v3-support-btn" onClick={() => setActivePanel('breathe')}>
                <div className="sos-v3-support-icon sos-v3-support-icon--teal">
                  <Wind size={18} strokeWidth={2} />
                </div>
                <div className="sos-v3-support-text">
                  <span className="sos-v3-support-name">Respira</span>
                  <span className="sos-v3-support-desc">1 minuto de fôlego</span>
                </div>
              </button>

              <button type="button" className="sos-v3-support-btn" onClick={() => setActivePanel('plan')}>
                <div className="sos-v3-support-icon sos-v3-support-icon--orange">
                  <ListChecks size={18} strokeWidth={2} />
                </div>
                <div className="sos-v3-support-text">
                  <span className="sos-v3-support-name">Aja agora</span>
                  <span className="sos-v3-support-desc">Quebra o impulso</span>
                </div>
              </button>

              <button type="button" className="sos-v3-support-btn" onClick={() => navigate(appRoutes.libraryGames)}>
                <div className="sos-v3-support-icon sos-v3-support-icon--purple">
                  <Brain size={18} strokeWidth={2} />
                </div>
                <div className="sos-v3-support-text">
                  <span className="sos-v3-support-name">Desvia</span>
                  <span className="sos-v3-support-desc">Jogo cognitivo rápido</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {activePanel === 'shield' ? (
            <ShieldPanel
              key="shield"
              rescuePlan={rescuePlan}
              motivations={state.profile.motivations}
              onClose={() => setActivePanel(null)}
            />
          ) : null}

          {activePanel === 'breathe' ? (
            <BreathePanel key="breathe" onClose={() => setActivePanel(null)} />
          ) : null}

          {activePanel === 'plan' ? (
            <QuickPlanPanel
              key="plan"
              actions={rescuePlan.quickActions}
              onClose={() => setActivePanel(null)}
            />
          ) : null}
        </AnimatePresence>

        {mentorOpen ? (
          <AiMentorChat
            entryMode="sos"
            initialSuggestions={rescuePlan.mentorSuggestions}
            sosContext={{
              selectedTrapText: rescuePlan.activeTrap.text,
              responseText: rescuePlan.activeTrap.responseText,
              motivation: rescuePlan.motivation,
            }}
            onBack={() => setMentorOpen(false)}
          />
        ) : null}
      </div>
    </AppShell>
  )
}
