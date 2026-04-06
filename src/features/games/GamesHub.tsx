import {
  Atom,
  Brain,
  Calculator,
  ChevronLeft,
  Palette,
  Radio,
  Search,
  Type,
  Wind,
} from 'lucide-react'
import type { ComponentType } from 'react'

export type GameId =
  | 'memory'
  | 'find'
  | 'scramble'
  | 'breathe'
  | 'stroop'
  | 'math'
  | 'eco'
  | 'rastros'

interface GameMeta {
  id: GameId
  title: string
  theme: string
  Icon: ComponentType<{ size?: number; color?: string }>
}

const GAMES: GameMeta[] = [
  { id: 'memory',  title: 'Jogo da\nMemória',          theme: 'memory',  Icon: Brain },
  { id: 'find',    title: 'Encontre\nRápido',           theme: 'find',    Icon: Search },
  { id: 'scramble',title: 'Palavras\nEmbaralhadas',     theme: 'scramble',Icon: Type },
  { id: 'breathe', title: 'Pausa para\nRespirar',       theme: 'breathe', Icon: Wind },
  { id: 'stroop',  title: 'Teste de\nStroop',           theme: 'stroop',  Icon: Palette },
  { id: 'math',    title: 'Desafio\nMatemático',        theme: 'math',    Icon: Calculator },
  { id: 'eco',     title: 'Eco\nVisual',                theme: 'eco',     Icon: Radio },
  { id: 'rastros', title: 'Rastros da\nNoite',          theme: 'rastros', Icon: Atom },
]

interface GamesHubProps {
  onSelect: (id: GameId) => void
  onBack?: () => void
}

export function GamesHub({ onSelect, onBack }: GamesHubProps) {
  return (
    <div className="cg-hub">
      {onBack && (
        <div className="cg-topbar cg-hub-topbar">
          <button type="button" className="cg-btn-back" onClick={onBack} aria-label="Voltar">
            <ChevronLeft size={20} />
          </button>
          <span className="cg-view-title">Jogos Cognitivos</span>
          <span className="cg-spacer" />
        </div>
      )}
      <div className="cg-hub-header">
        <div className="cg-hub-logo">REBOOT</div>
        <h1 className="cg-hub-title">Prevenção de Recaídas</h1>
        <p className="cg-hub-subtitle">Vença o impulso com estes exercícios cognitivos</p>
      </div>

      <div className="cg-hub-grid">
        {GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            className={`cg-card cg-card--${game.theme}`}
            onClick={() => onSelect(game.id)}
          >
            <div className="cg-card-pattern" aria-hidden="true" />
            <div className="cg-card-content">
              <div className="cg-card-icon">
                <game.Icon size={22} color="white" />
              </div>
              <p className="cg-card-title">
                {game.title.split('\n').map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
