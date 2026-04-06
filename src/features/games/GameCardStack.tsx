import { AnimatePresence, motion } from 'framer-motion'
import {
  Atom,
  Brain,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Palette,
  Play,
  Radio,
  Search,
  Type,
  Wind,
} from 'lucide-react'
import { useState } from 'react'
import type { ComponentType } from 'react'
import type { GameId } from './GamesHub'

interface GameMeta {
  id: GameId
  title: string
  desc: string
  gradStart: string
  gradEnd: string
  shadow: string
  Icon: ComponentType<{ size?: number; color?: string }>
}

const GAMES: GameMeta[] = [
  {
    id: 'memory',
    title: 'Jogo da Memoria',
    desc: 'Encontre os pares e exercite a memoria de curto prazo.',
    gradStart: '#3b82f6',
    gradEnd: '#1d4ed8',
    shadow: 'rgba(59,130,246,0.45)',
    Icon: Brain,
  },
  {
    id: 'find',
    title: 'Encontre Rapido',
    desc: 'Localize o simbolo certo na grade. Treina foco e percepcao.',
    gradStart: '#8b5cf6',
    gradEnd: '#6d28d9',
    shadow: 'rgba(139,92,246,0.45)',
    Icon: Search,
  },
  {
    id: 'scramble',
    title: 'Palavras Embaralhadas',
    desc: 'Reordene as letras e forme palavras. Ativa o raciocinio verbal.',
    gradStart: '#d946ef',
    gradEnd: '#7c3aed',
    shadow: 'rgba(217,70,239,0.45)',
    Icon: Type,
  },
  {
    id: 'breathe',
    title: 'Pausa para Respirar',
    desc: 'Guia visual de respiracao para acalmar a mente rapidamente.',
    gradStart: '#38bdf8',
    gradEnd: '#0284c7',
    shadow: 'rgba(56,189,248,0.45)',
    Icon: Wind,
  },
  {
    id: 'stroop',
    title: 'Teste de Stroop',
    desc: 'Toque na cor, nao na palavra. Quebra padroes automaticos.',
    gradStart: '#f97316',
    gradEnd: '#b45309',
    shadow: 'rgba(249,115,22,0.45)',
    Icon: Palette,
  },
  {
    id: 'math',
    title: 'Desafio Matematico',
    desc: 'Resolva operacoes o mais rapido que puder. 30 segundos.',
    gradStart: '#fb923c',
    gradEnd: '#ef4444',
    shadow: 'rgba(251,146,60,0.45)',
    Icon: Calculator,
  },
  {
    id: 'eco',
    title: 'Eco Visual',
    desc: 'Memorize e repita a sequencia luminosa. Simon diz.',
    gradStart: '#1e3a8a',
    gradEnd: '#06b6d4',
    shadow: 'rgba(6,182,212,0.45)',
    Icon: Radio,
  },
  {
    id: 'rastros',
    title: 'Rastros da Noite',
    desc: 'Acompanhe o alvo entre as esferas em movimento.',
    gradStart: '#0891b2',
    gradEnd: '#1e3a8a',
    shadow: 'rgba(8,145,178,0.45)',
    Icon: Atom,
  },
]

const POSITIONS = [
  { scale: 1, y: 0 },
  { scale: 0.93, y: -28 },
  { scale: 0.86, y: -56 },
]

const EXIT_ANIM = { y: 320, scale: 1, zIndex: 10 }
const ENTER_ANIM = { y: -28, scale: 0.86 }

interface DeckItem {
  uid: number
  gameIdx: number
}

function makeInitialDeck(): DeckItem[] {
  return [0, 1, 2].map((gameIdx, uid) => ({ uid, gameIdx }))
}

function GameCardFace({
  game,
  isFront,
  onPlay,
}: {
  game: GameMeta
  isFront: boolean
  onPlay: () => void
}) {
  return (
    <div className="gcs-card-face">
      <div className="gcs-card-info">
        <div className="gcs-card-text">
          <span className="gcs-card-title">{game.title}</span>
          <span className="gcs-card-desc">{game.desc}</span>
        </div>
        {isFront ? (
          <button type="button" className="gcs-play-btn" onClick={onPlay}>
            <Play size={13} fill="currentColor" />
            Jogar
          </button>
        ) : null}
      </div>

      <div className={`gcs-card-art gcs-card-art--${game.id}`}>
        <div className="gcs-card-pattern" aria-hidden="true" />
        <div className="gcs-card-art-glow" />
        <game.Icon size={52} color="rgba(255,255,255,0.95)" />
      </div>
    </div>
  )
}

interface GameCardStackProps {
  onSelect: (id: GameId) => void
  onViewAll?: () => void
}

export function GameCardStack({ onSelect, onViewAll }: GameCardStackProps) {
  const [deck, setDeck] = useState<DeckItem[]>(makeInitialDeck)
  const [uidCounter, setUidCounter] = useState(GAMES.length)

  function advance() {
    setDeck((prev) => {
      const nextGameIdx = (prev[2].gameIdx + 1) % GAMES.length
      return [...prev.slice(1), { uid: uidCounter, gameIdx: nextGameIdx }]
    })
    setUidCounter((current) => current + 1)
  }

  function retreat() {
    setDeck((prev) => {
      const previousGameIdx = (prev[0].gameIdx - 1 + GAMES.length) % GAMES.length
      return [{ uid: uidCounter, gameIdx: previousGameIdx }, prev[0], prev[1]]
    })
    setUidCounter((current) => current + 1)
  }

  return (
    <div className="gcs-section">
      <div className="gcs-section-header">
        {onViewAll ? (
          <button type="button" className="gcs-section-link" onClick={onViewAll}>
            <span className="gcs-section-label">Jogos Cognitivos</span>
            <ChevronRight size={16} />
          </button>
        ) : (
          <span className="gcs-section-label">Jogos Cognitivos</span>
        )}

        <div className="gcs-section-actions">
          <button
            type="button"
            className="gcs-next-icon-btn"
            onClick={retreat}
            aria-label="Mostrar jogo anterior"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            className="gcs-next-icon-btn"
            onClick={advance}
            aria-label="Mostrar proximo jogo"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="gcs-stage">
        <AnimatePresence initial={false}>
          {deck.slice(0, 3).map((item, index) => {
            const game = GAMES[item.gameIdx]
            const pos = POSITIONS[index] ?? POSITIONS[2]

            return (
              <motion.div
                key={item.uid}
                className="gcs-card"
                initial={index === 2 ? ENTER_ANIM : undefined}
                animate={{ y: pos.y, scale: pos.scale }}
                exit={index === 0 ? EXIT_ANIM : undefined}
                transition={{ type: 'spring', duration: 0.65, bounce: 0 }}
                style={{
                  zIndex: index === 0 ? 10 : 3 - index,
                  left: '50%',
                  x: '-50%',
                  bottom: 0,
                }}
              >
                <GameCardFace
                  game={game}
                  isFront={index === 0}
                  onPlay={() => onSelect(game.id)}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
