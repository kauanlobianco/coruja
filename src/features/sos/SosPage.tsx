import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BrainCircuit,
  ChevronLeft,
  Gamepad2,
  HeartHandshake,
  MessageCircleMore,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { appRoutes } from '../../core/config/routes'
import type { GameId } from '../games/GamesHub'
import { FindGame } from '../games/games/FindGame/FindGame'
import { MemoryGame } from '../games/games/MemoryGame/MemoryGame'
import { StroopGame } from '../games/games/StroopGame/StroopGame'
import { AiMentorChat } from '../library/components/AiMentorChat'
import { buildSosRescuePlan } from './sos-rescue-plan'

type SosStage = 'ground' | 'reflect' | 'reconnect' | 'distract' | 'outcome'

const breathingSteps = ['Inspire', 'Segure', 'Expire', 'Pause']
const breathingStepSeconds = 5

const gameCopy: Record<GameId, { title: string; duration: string; body: string }> = {
  stroop: {
    title: 'Missao de foco rapido',
    duration: '90 segundos',
    body: 'Puxa sua atencao para fora do automatismo e quebra o embalo da fissura.',
  },
  find: {
    title: 'Missao de foco visual',
    duration: '90 segundos',
    body: 'Ajuda seu cerebro a sair da repeticao mental e voltar para o presente.',
  },
  memory: {
    title: 'Missao de memoria',
    duration: '90 segundos',
    body: 'Te coloca em uma tarefa curta, concreta e mais calma para atravessar o pico.',
  },
  breathe: {
    title: 'Missao de respiracao',
    duration: '90 segundos',
    body: 'Ajuda a reduzir a ativacao e recuperar o ritmo do corpo.',
  },
  scramble: {
    title: 'Missao de palavras',
    duration: '90 segundos',
    body: 'Desvia sua atencao para uma tarefa curta e estruturada.',
  },
  math: {
    title: 'Missao numerica',
    duration: '90 segundos',
    body: 'Puxa sua mente para um foco simples e objetivo.',
  },
  eco: {
    title: 'Missao visual',
    duration: '90 segundos',
    body: 'Interrompe o impulso com uma tarefa curta de atencao.',
  },
  rastros: {
    title: 'Missao de rastros',
    duration: '90 segundos',
    body: 'Ajuda a atravessar o pico com foco externo e ritmo.',
  },
}

function MissionOption({
  active,
  gameId,
  onSelect,
}: {
  active: boolean
  gameId: GameId
  onSelect: (gameId: GameId) => void
}) {
  return (
    <button
      type="button"
      className={`sos-mission-chip${active ? ' is-active' : ''}`}
      onClick={() => onSelect(gameId)}
    >
      {gameCopy[gameId].title}
    </button>
  )
}

export function SosPage() {
  const navigate = useNavigate()
  const { state, openSosSession } = useAppState()
  const rescuePlan = useMemo(
    () => buildSosRescuePlan(state.profile, state.sos.configuration),
    [state.profile, state.sos.configuration],
  )

  const [stepIndex, setStepIndex] = useState(0)
  const [breathPhaseSecondsLeft, setBreathPhaseSecondsLeft] = useState(breathingStepSeconds)
  const [stage, setStage] = useState<SosStage>('ground')
  const [selectedTrapId, setSelectedTrapId] = useState<string | null>(null)
  const [missionGame, setMissionGame] = useState<GameId>(rescuePlan.recommendedGame)
  const [activeGame, setActiveGame] = useState<GameId | null>(null)
  const [mentorOpen, setMentorOpen] = useState(false)
  const [outcomeChoice, setOutcomeChoice] = useState<'better' | 'hard' | null>(null)
  const [scrollKey, setScrollKey] = useState(0)

  const registerSosSession = useEffectEvent(() => {
    void openSosSession()
  })

  useEffect(() => {
    registerSosSession()
  }, [])

  useEffect(() => {
    setMissionGame(rescuePlan.recommendedGame)
  }, [rescuePlan.recommendedGame])

  useEffect(() => {
    setScrollKey((current) => current + 1)
  }, [stage])

  useEffect(() => {
    const breathingTimer = window.setInterval(() => {
      setBreathPhaseSecondsLeft((current) => {
        if (current <= 1) {
          setStepIndex((step) => (step + 1) % breathingSteps.length)
          return breathingStepSeconds
        }

        return current - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(breathingTimer)
    }
  }, [])

  const selectedTrap =
    rescuePlan.trapOptions.find((trap) => trap.id === selectedTrapId) ?? null

  const activeResponse = selectedTrap?.responseText ?? rescuePlan.fallbackResponse
  const mentorSuggestions = selectedTrap
    ? [
        `To com a armadilha "${selectedTrap.text}" forte agora.`,
        'Me ajuda a atravessar os proximos 2 minutos.',
        'Me da um proximo passo simples agora.',
      ]
    : rescuePlan.mentorSuggestions

  function handleMissionStart() {
    setActiveGame(missionGame)
  }

  function handleMissionBack() {
    setActiveGame(null)
    setStage('outcome')
  }

  function handleTryAnotherMission() {
    const nextMission =
      missionGame === rescuePlan.recommendedGame
        ? rescuePlan.alternativeGames[0] ?? rescuePlan.recommendedGame
        : rescuePlan.recommendedGame

    setMissionGame(nextMission)
    setOutcomeChoice(null)
    setStage('distract')
  }

  return (
    <>
      <AppShell
        title=""
        eyebrow=""
        hideTopbar
        shellMode="system"
        contentClassName="app-content-sos"
      >
        <section className="sos-screen">
          <div className="sos-stage-layout">
            <div className="sos-stage-topbar">
              <span className="sos-stage-chip">SOS ativo</span>
              <button
                type="button"
                className="sos-stage-close"
                onClick={() => navigate(appRoutes.home)}
              >
                <ChevronLeft size={16} strokeWidth={2.2} />
                Fechar
              </button>
            </div>

            <div key={scrollKey} className="sos-stage-scroll">
              <motion.div
                key={stage}
                className="sos-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                {stage === 'ground' ? (
                  <>
                    <div className="sos-hero-copy">
                      <span className="sos-kicker">
                        <ShieldAlert size={14} strokeWidth={2.1} />
                        Voce nao precisa passar por isso sozinho
                      </span>
                      <h1>{rescuePlan.entryLine}</h1>
                      <p className="sos-support-copy">
                        Vamos atravessar os proximos minutos um passo de cada vez.
                      </p>
                    </div>

                    <div className="sos-breathing-stage">
                      <div className="sos-breathing">
                        <div className="sos-breathing-perimeter">
                          <div className="sos-breathing-inner">
                            <span className="sos-breathing-phase-label">{breathingSteps[stepIndex]}</span>
                            <div className="sos-breathing-phase-number">{breathPhaseSecondsLeft}</div>
                          </div>
                        </div>
                      </div>
                      <p className="sos-support-copy">
                        Respire alguns ciclos comigo. Nao precisa resolver tudo agora.
                      </p>
                    </div>
                  </>
                ) : null}

                {stage === 'reflect' ? (
                  <>
                    <div className="sos-hero-copy">
                      <span className="sos-kicker">
                        <HeartHandshake size={14} strokeWidth={2.1} />
                        Sem pressa
                      </span>
                      <h1>O que mais parece com isso agora?</h1>
                      <p className="sos-support-copy">
                        Se alguma frase parecer familiar, toque nela. Se nao, siga sem escolher.
                      </p>
                    </div>

                    <div className="sos-reflect-card">
                      <div className="sos-reflect-options">
                        {rescuePlan.trapOptions.slice(0, 3).map((trap) => (
                          <button
                            key={trap.id}
                            type="button"
                            className={`sos-reflect-option${selectedTrapId === trap.id ? ' is-active' : ''}`}
                            onClick={() => setSelectedTrapId((current) => current === trap.id ? null : trap.id)}
                          >
                            {trap.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}

                {stage === 'reconnect' ? (
                  <>
                    <div className="sos-hero-copy">
                      <span className="sos-kicker">
                        <Sparkles size={14} strokeWidth={2.1} />
                        Volte para o que importa
                      </span>
                      <h1>Leia isso devagar.</h1>
                    </div>

                    <div className="sos-message-card">
                      <p className="sos-message-quote">{activeResponse}</p>
                    </div>

                    <div className="sos-support-grid">
                      <div className="sos-support-card">
                        <span className="sos-support-label">Seu porque</span>
                        <p>{rescuePlan.motivation}</p>
                      </div>

                      <div className="sos-support-card">
                        <span className="sos-support-label">Se ceder agora</span>
                        <p>{rescuePlan.consequence}</p>
                      </div>
                    </div>
                  </>
                ) : null}

                {stage === 'distract' ? (
                  <>
                    <div className="sos-hero-copy">
                      <span className="sos-kicker">
                        <Gamepad2 size={14} strokeWidth={2.1} />
                        Missao de foco
                      </span>
                      <h1>Agora vamos tirar seu cerebro do automatico.</h1>
                      <p className="sos-support-copy">
                        Escolhi uma missao curta para atravessar esse pico com voce.
                      </p>
                    </div>

                    <div className="sos-mission-card">
                      <div className="sos-mission-head">
                        <div>
                          <span className="sos-support-label">Recomendado agora</span>
                          <h2>{gameCopy[missionGame].title}</h2>
                        </div>
                        <span className="sos-mission-duration">{gameCopy[missionGame].duration}</span>
                      </div>
                      <p>{gameCopy[missionGame].body}</p>
                    </div>

                    <div className="sos-mission-switcher">
                      <span className="sos-support-label">Trocar missao</span>
                      <div className="sos-mission-chip-row">
                        {[rescuePlan.recommendedGame, ...rescuePlan.alternativeGames].map((gameId) => (
                          <MissionOption
                            key={gameId}
                            active={missionGame === gameId}
                            gameId={gameId}
                            onSelect={setMissionGame}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}

                {stage === 'outcome' ? (
                  <>
                    <div className="sos-hero-copy">
                      <span className="sos-kicker">
                        <BrainCircuit size={14} strokeWidth={2.1} />
                        Reavaliar
                      </span>
                      <h1>Como voce esta agora?</h1>
                      <p className="sos-support-copy">
                        Nao precisa estar perfeito. O importante e escolher o proximo passo certo.
                      </p>
                    </div>

                    {outcomeChoice === null ? (
                      <div className="sos-outcome-options">
                        <button type="button" className="sos-outcome-option" onClick={() => setOutcomeChoice('better')}>
                          Melhorou um pouco
                        </button>
                        <button type="button" className="sos-outcome-option" onClick={() => setOutcomeChoice('hard')}>
                          Ainda esta dificil
                        </button>
                        <button type="button" className="sos-outcome-option" onClick={() => setMentorOpen(true)}>
                          Quero falar com o mentor
                        </button>
                      </div>
                    ) : null}

                    {outcomeChoice === 'better' ? (
                      <div className="sos-outcome-card">
                        <p>Boa. O pico perdeu forca. Agora escolha um caminho simples para sustentar isso.</p>
                      </div>
                    ) : null}

                    {outcomeChoice === 'hard' ? (
                      <div className="sos-outcome-card">
                        <p>Tudo bem. Voce nao falhou. Vamos fazer mais uma missao curta ou chamar o mentor agora.</p>
                      </div>
                    ) : null}
                  </>
                ) : null}
              </motion.div>
            </div>

            <div className="sos-stage-footer">
              {stage === 'ground' ? (
                <>
                  <button type="button" className="sos-primary-button" onClick={() => setStage('reflect')}>
                    Continuar
                  </button>
                  <button type="button" className="sos-secondary-button" onClick={() => setMentorOpen(true)}>
                    <MessageCircleMore size={15} strokeWidth={2.2} />
                    Falar com mentor
                  </button>
                </>
              ) : null}

              {stage === 'reflect' ? (
                <>
                  <button type="button" className="sos-primary-button" onClick={() => setStage('reconnect')}>
                    Isso me ajuda
                  </button>
                  <button type="button" className="sos-secondary-button" onClick={() => setStage('reconnect')}>
                    Nao sei agora, seguir mesmo assim
                  </button>
                </>
              ) : null}

              {stage === 'reconnect' ? (
                <>
                  <button type="button" className="sos-primary-button" onClick={() => setStage('distract')}>
                    Ir para missao de foco
                  </button>
                  <button type="button" className="sos-secondary-button" onClick={() => setMentorOpen(true)}>
                    <MessageCircleMore size={15} strokeWidth={2.2} />
                    Falar com mentor
                  </button>
                </>
              ) : null}

              {stage === 'distract' ? (
                <>
                  <button type="button" className="sos-primary-button" onClick={handleMissionStart}>
                    Comecar missao
                    <ArrowRight size={16} strokeWidth={2.2} />
                  </button>
                  <button type="button" className="sos-secondary-button" onClick={() => setMentorOpen(true)}>
                    <MessageCircleMore size={15} strokeWidth={2.2} />
                    Prefiro falar com mentor
                  </button>
                </>
              ) : null}

              {stage === 'outcome' && outcomeChoice === 'better' ? (
                <>
                  <button type="button" className="sos-primary-button" onClick={() => navigate(appRoutes.home)}>
                    Voltar para a Home
                  </button>
                  <button type="button" className="sos-secondary-button" onClick={() => navigate(appRoutes.library)}>
                    Ir para biblioteca
                  </button>
                </>
              ) : null}

              {stage === 'outcome' && outcomeChoice === 'hard' ? (
                <>
                  <button type="button" className="sos-primary-button" onClick={handleTryAnotherMission}>
                    Tentar outra missao
                  </button>
                  <button type="button" className="sos-secondary-button" onClick={() => setMentorOpen(true)}>
                    <MessageCircleMore size={15} strokeWidth={2.2} />
                    Falar com mentor
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </section>
      </AppShell>

      {mentorOpen ? (
        <AiMentorChat
          onBack={() => setMentorOpen(false)}
          entryMode="sos"
          sosContext={{
            selectedTrapText: selectedTrap?.text,
            responseText: activeResponse,
            motivation: rescuePlan.motivation,
          }}
          initialSuggestions={mentorSuggestions}
        />
      ) : null}

      {activeGame === 'stroop' ? <StroopGame onBack={handleMissionBack} /> : null}
      {activeGame === 'find' ? <FindGame onBack={handleMissionBack} /> : null}
      {activeGame === 'memory' ? <MemoryGame onBack={handleMissionBack} /> : null}
    </>
  )
}
