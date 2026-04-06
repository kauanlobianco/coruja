import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GamesHub, type GameId } from './GamesHub'
import { appRoutes } from '../../core/config/routes'
import { MemoryGame } from './games/MemoryGame/MemoryGame'
import { FindGame } from './games/FindGame/FindGame'
import { ScrambleGame } from './games/ScrambleGame/ScrambleGame'
import { BreatheGame } from './games/BreatheGame/BreatheGame'
import { StroopGame } from './games/StroopGame/StroopGame'
import { MathGame } from './games/MathGame/MathGame'
import { EcoGame } from './games/EcoGame/EcoGame'
import { RastrosGame } from './games/RastrosGame/RastrosGame'

export function GamesCatalogPage() {
  const navigate = useNavigate()
  const [activeGame, setActiveGame] = useState<GameId | null>(null)

  function closeGame() {
    setActiveGame(null)
  }

  return (
    <>
      <div className="cg-page">
        <div className="cg-inner">
          <GamesHub
            onSelect={setActiveGame}
            onBack={() => navigate(appRoutes.library)}
          />
        </div>
      </div>

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
