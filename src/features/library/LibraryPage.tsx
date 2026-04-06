import { useEffect, useMemo, useState } from 'react'
import { BookOpen, ChevronRight, MessageCircleMore, Quote, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { appRoutes } from '../../core/config/routes'
import { AppShell } from '../../shared/layout/AppShell'
import { AiMentorChat, FocoBotAvatar } from './components/AiMentorChat'
import { type GameId } from '../games/GamesHub'
import { GameCardStack } from '../games/GameCardStack'
import { MemoryGame } from '../games/games/MemoryGame/MemoryGame'
import { FindGame } from '../games/games/FindGame/FindGame'
import { ScrambleGame } from '../games/games/ScrambleGame/ScrambleGame'
import { BreatheGame } from '../games/games/BreatheGame/BreatheGame'
import { StroopGame } from '../games/games/StroopGame/StroopGame'
import { MathGame } from '../games/games/MathGame/MathGame'
import { EcoGame } from '../games/games/EcoGame/EcoGame'
import { RastrosGame } from '../games/games/RastrosGame/RastrosGame'
import {
  curadoriaArtigos,
  curadoriaCatalogo,
  type CuradoriaArticleItem,
  type CuradoriaPlayableItem,
} from '../../data/curadoria'
import { CuradoriaCarousel } from './components/CuradoriaCarousel'
import { CuradoriaMediaModal } from './components/CuradoriaMediaModal'
import { LearningJourney } from './components/LearningJourney'
import {
  CuradoriaArticleModal,
  type CuradoriaArticleReadingState,
} from './components/CuradoriaArticleModal'

const DAILY_INSIGHTS = [
  {
    text: 'O segredo da mudanca e focar toda a sua energia nao em lutar contra o velho, mas em construir o novo.',
    author: 'Socrates',
  },
  {
    text: 'Disciplina e a ponte entre metas e realizacoes. Cada dia e uma escolha de atravessar essa ponte.',
    author: 'Jim Rohn',
  },
  {
    text: 'Recaida nao e fracasso. E uma informacao. Analise o que precipitou e retome mais inteligente.',
    author: 'Coruja',
  },
  {
    text: 'Cada dia sem o habito e um dia de retreinamento neural. O cerebro esta mudando, mesmo quando voce nao percebe.',
    author: 'Coruja',
  },
  {
    text: 'Voce nao precisa de forca de vontade infinita. Precisa de um ambiente melhor e um plano especifico.',
    author: 'James Clear',
  },
  {
    text: 'A recuperacao nao e uma linha reta. E uma espiral ascendente. Cada volta acontece em um nivel mais alto.',
    author: 'Coruja',
  },
  {
    text: 'Pequenas escolhas, repetidas com consistencia, mudam quem voce e. Identidade se constroi em atos, nao em intencoes.',
    author: 'James Clear',
  },
]

const READING_PROGRESS_STORAGE_KEY = 'coruja-library-reading-progress'

function loadReadingProgress() {
  if (typeof window === 'undefined') return {} as Record<string, CuradoriaArticleReadingState>

  try {
    const stored = window.localStorage.getItem(READING_PROGRESS_STORAGE_KEY)
    if (!stored) return {} as Record<string, CuradoriaArticleReadingState>
    return JSON.parse(stored) as Record<string, CuradoriaArticleReadingState>
  } catch {
    return {} as Record<string, CuradoriaArticleReadingState>
  }
}

export function LibraryPage() {
  const navigate = useNavigate()
  const [activeGame, setActiveGame] = useState<GameId | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [activeMedia, setActiveMedia] = useState<CuradoriaPlayableItem | null>(null)
  const [activeArticle, setActiveArticle] = useState<CuradoriaArticleItem | null>(null)
  const [journeyOpen, setJourneyOpen] = useState(false)
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(loadReadingProgress)
  const [momentumMessage, setMomentumMessage] = useState<string | null>(null)

  const mediaCatalog = useMemo(
    () => curadoriaCatalogo.filter((item) => item.tipo !== 'article'),
    [],
  )

  const completedArticleIds = useMemo(
    () =>
      Object.entries(readingProgress)
        .filter(([, progress]) => progress.completed)
        .map(([id]) => id),
    [readingProgress],
  )

  const currentJourneyArticle = useMemo(() => {
    const inProgress = curadoriaArtigos.find((article) => {
      const progress = readingProgress[article.id]
      return progress && !progress.completed && progress.currentSection > 0
    })

    if (inProgress) {
      return inProgress
    }

    const nextArticle = curadoriaArtigos.find((article) => !readingProgress[article.id]?.completed)
    return nextArticle ?? curadoriaArtigos[curadoriaArtigos.length - 1]
  }, [readingProgress])

  const currentJourneyProgress = currentJourneyArticle
    ? readingProgress[currentJourneyArticle.id]
    : undefined

  const currentJourneyPercent = currentJourneyArticle
    ? currentJourneyProgress?.completed
      ? 100
      : Math.round(
          (((currentJourneyProgress?.currentSection ?? 0) + 1) / currentJourneyArticle.secoes.length) * 100,
        )
    : 0

  const todayInsight = DAILY_INSIGHTS[new Date().getDay() % DAILY_INSIGHTS.length]

  useEffect(() => {
    if (!journeyOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setJourneyOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [journeyOpen])

  function closeGame() {
    setActiveGame(null)
  }

  function updateReadingProgress(itemId: string, nextState: CuradoriaArticleReadingState) {
    setReadingProgress((current) => {
      const previous = current[itemId]
      const next = { ...current, [itemId]: nextState }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(READING_PROGRESS_STORAGE_KEY, JSON.stringify(next))
      }

      if (!previous?.completed && nextState.completed) {
        setMomentumMessage('Bom avanco. Vamos para o proximo passo?')
      }

      return next
    })
  }

  return (
    <>
      <AppShell title="Biblioteca" contentClassName="app-content-library">
        <section className="library-page">
          <section className="library-section library-section--hero">
            <div className="library-section-head">
              <h2>Jornada de leitura</h2>
              <span>Ativo agora</span>
            </div>

            <button
              type="button"
              className="library-learning-hero"
              onClick={() => setJourneyOpen(true)}
            >
              <div className="library-learning-hero-copy">
                <span className="library-learning-kicker">
                  {currentJourneyProgress?.completed
                    ? 'Trilha concluida'
                    : currentJourneyProgress?.currentSection
                      ? `Modulo ${curadoriaArtigos.findIndex((article) => article.id === currentJourneyArticle.id) + 1}`
                      : 'Comece por aqui'}
                </span>
                <h3>{currentJourneyArticle.titulo}</h3>
                <p>{currentJourneyArticle.subtitulo}</p>

                <div className="library-learning-progress">
                  <div className="library-learning-progress-head">
                    <span>Progresso do capitulo</span>
                    <strong>{currentJourneyPercent}%</strong>
                  </div>

                  <div className="library-learning-progressbar" aria-hidden="true">
                    <span style={{ width: `${currentJourneyPercent}%` }} />
                  </div>
                </div>

                <span className="library-learning-cta">
                  Continuar leitura
                  <ChevronRight size={16} strokeWidth={2.2} />
                </span>
              </div>

              <div className="library-learning-hero-art" aria-hidden="true">
                <BookOpen size={54} strokeWidth={1.7} />
              </div>
            </button>
          </section>

          <section className="library-section">
            <div className="library-section-head">
              <h2>Mentor pessoal</h2>
            </div>

            <button
              type="button"
              className="lib-ai-entry"
              onClick={() => setChatOpen(true)}
            >
              <div className="lib-ai-entry-icon">
                <div className="ob-chat-avatar lib-ai-entry-avatar">
                  <FocoBotAvatar />
                </div>
              </div>
              <div className="lib-ai-entry-copy">
                <span className="lib-ai-entry-title">Como voce se sente hoje?</span>
                <span className="lib-ai-entry-sub">Converse com seu mentor para processar emocoes e buscar orientacao rapida.</span>
                <span className="lib-ai-entry-cta">
                  Conversar agora
                  <MessageCircleMore size={15} strokeWidth={2.2} />
                </span>
              </div>
              <ChevronRight size={18} strokeWidth={2} className="lib-ai-entry-arrow" />
            </button>
          </section>

          <section className="library-section curadoria-panel">
            <CuradoriaCarousel
              items={mediaCatalog}
              activeItemId={selectedContentId}
              completedArticleIds={completedArticleIds}
              onViewAll={() => navigate(appRoutes.libraryMedia)}
              onSelect={(id) => {
                setSelectedContentId(id)
                const selectedItem = mediaCatalog.find((item) => item.id === id)
                if (selectedItem) {
                  setActiveMedia(selectedItem)
                }
              }}
            />
          </section>

          <section className="library-section">
            <GameCardStack
              onSelect={setActiveGame}
              onViewAll={() => navigate(appRoutes.libraryGames)}
            />
          </section>

          <section className="library-section library-section--insight">
            <div className="lib-insight">
              <Quote size={18} strokeWidth={1.8} className="lib-insight-icon" aria-hidden="true" />
              <div className="lib-insight-body">
                <span className="lib-insight-label">Insight do dia</span>
                <p className="lib-insight-quote">{todayInsight.text}</p>
                <span className="lib-insight-author">- {todayInsight.author}</span>
              </div>
            </div>
          </section>
        </section>
      </AppShell>

      <CuradoriaMediaModal item={activeMedia} onClose={() => setActiveMedia(null)} />
      {journeyOpen ? (
        <div
          className="library-journey-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Jornada de leitura"
          onClick={() => setJourneyOpen(false)}
        >
          <div className="library-journey-modal" onClick={(event) => event.stopPropagation()}>
            <div className="library-journey-modal-head">
              <div>
                <span>Jornada de leitura</span>
                <h3>Continue no seu ritmo</h3>
              </div>

              <button
                type="button"
                className="curadoria-modal-close"
                onClick={() => setJourneyOpen(false)}
                aria-label="Fechar jornada"
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            <LearningJourney
              articles={curadoriaArtigos}
              readingProgress={readingProgress}
              momentumMessage={momentumMessage}
              onOpenArticle={(article) => {
                setJourneyOpen(false)
                setMomentumMessage(null)
                setActiveArticle(article)
              }}
            />
          </div>
        </div>
      ) : null}
      <CuradoriaArticleModal
        item={activeArticle}
        readingState={activeArticle ? readingProgress[activeArticle.id] : undefined}
        onReadingStateChange={updateReadingProgress}
        onClose={() => setActiveArticle(null)}
      />

      {chatOpen ? <AiMentorChat onBack={() => setChatOpen(false)} /> : null}

      {activeGame === 'memory' ? <MemoryGame onBack={closeGame} /> : null}
      {activeGame === 'find' ? <FindGame onBack={closeGame} /> : null}
      {activeGame === 'scramble' ? <ScrambleGame onBack={closeGame} /> : null}
      {activeGame === 'breathe' ? <BreatheGame onBack={closeGame} /> : null}
      {activeGame === 'stroop' ? <StroopGame onBack={closeGame} /> : null}
      {activeGame === 'math' ? <MathGame onBack={closeGame} /> : null}
      {activeGame === 'eco' ? <EcoGame onBack={closeGame} /> : null}
      {activeGame === 'rastros' ? <RastrosGame onBack={closeGame} /> : null}
    </>
  )
}
