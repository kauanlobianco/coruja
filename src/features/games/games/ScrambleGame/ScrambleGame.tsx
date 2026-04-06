import { Award, Type } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GlobalFeedback } from '../../shared/GlobalFeedback'
import { GameTopbar } from '../../shared/GameTopbar'
import { shuffleArray } from '../../shared/gameUtils'
import { useFeedback } from '../../shared/useFeedback'

const BASE_WORDS = [
  'AMOR','VIDA','AZUL','BRISA','MENTE','CALMA','FOCO','ALMA','PLENO',
  'LIVRE','FELIZ','TEMPO','PAUSA','SOPRO','CLARO','VERDE','NOBRE',
  'IDEIA','SONHO','VIGOR','PONTO','NUVEM','CLIMA','VENTO','FLUXO',
  'CALOR','TERRA','FUNDO','SABER','LUGAR','FALAR','CANTO','JOGAR',
  'NINHO','MUNDO','VIVER','FORTE','CINZA','PRAIA','FRUTO','NOITE',
  'TARDE','MANHA',
]

const DICTIONARY = new Set([
  'AMOR','ROMA','MORA','RAMO','VIDA','DIVA','AZUL','BRISA','MENTE',
  'CALMA','FOCO','ALMA','LAMA','MALA','PLENO','LIVRE','FELIZ','TEMPO',
  'PAUSA','SOPRO','POROS','CLARO','COLAR','CORAL','VERDE','NOBRE',
  'IDEIA','SONHO','VIGOR','PONTO','NUVEM','CLIMA','VENTO','FLUXO',
  'CALOR','TERRA','FUNDO','SABER','BARES','LUGAR','FALAR','CANTO',
  'CONTA','JOGAR','NINHO','MUNDO','VIVER','FORTE','CINZA','PRAIA',
  'PARIA','FRUTO','NOITE','TARDE','MANHA',
])

interface ScrambleGameProps {
  onBack: () => void
}

export function ScrambleGame({ onBack }: ScrambleGameProps) {
  const [screen, setScreen] = useState<'start' | 'play'>('start')

  return (
    <div className="cg-page">
      {screen === 'start' ? (
        <ScrambleStart onBack={onBack} onPlay={() => setScreen('play')} />
      ) : (
        <ScramblePlay onBack={() => setScreen('start')} />
      )}
    </div>
  )
}

function ScrambleStart({ onBack, onPlay }: { onBack: () => void; onPlay: () => void }) {
  return (
    <div className="cg-inner">
      <GameTopbar onBack={onBack} />
      <div className="cg-start-content cg-start-content--scramble">
        <div className="cg-start-icon cg-start-icon--scramble">
          <Type size={48} color="white" />
        </div>
        <h2 className="cg-preview-title">Palavras Embaralhadas</h2>
        <p className="cg-preview-desc">
          Desembaralhe as letras para formar palavras e estimular seu raciocínio verbal.
        </p>
        <button type="button" className="cg-btn-pill" onClick={onPlay}>
          INICIAR JOGO
        </button>
      </div>
    </div>
  )
}

function normalizeWord(w: string) {
  return w
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function ScramblePlay({ onBack }: { onBack: () => void }) {
  const { feedback, showFeedback } = useFeedback()
  const [score, setScore] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [currentLettersSorted, setCurrentLettersSorted] = useState('')
  const [scrambled, setScrambled] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevWordRef = useRef('')

  const nextWord = useCallback(() => {
    let word: string
    do {
      word = BASE_WORDS[Math.floor(Math.random() * BASE_WORDS.length)]
    } while (word === prevWordRef.current)
    prevWordRef.current = word

    let shuffled: string[]
    do {
      shuffled = shuffleArray(word.split(''))
    } while (shuffled.join('') === word)

    setCurrentWord(word)
    setCurrentLettersSorted(word.split('').sort().join(''))
    setScrambled(shuffled)
    setInput('')
    setIsAnimating(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  useEffect(() => {
    nextWord()
  }, [nextWord])

  function checkWord() {
    if (isAnimating) return
    const guess = normalizeWord(input)
    const sortedGuess = guess.split('').sort().join('')

    if (sortedGuess === currentLettersSorted && DICTIONARY.has(guess)) {
      setIsAnimating(true)
      setScore((s) => s + 1)
      showFeedback(true)
      setTimeout(() => nextWord(), 500)
    } else {
      showFeedback(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="cg-inner">
      <GlobalFeedback feedback={feedback} />
      <GameTopbar
        onBack={onBack}
        title="Palavras Embaralhadas"
        right={
          <span className="cg-score-card">
            <Award size={14} style={{ color: '#d946ef' }} />
            {score}
          </span>
        }
      />
      <div className="cg-scramble-play">
        <div className="cg-scramble-letters">
          {scrambled.map((letter, i) => (
            <div key={i} className="cg-letter-box">
              {letter}
            </div>
          ))}
        </div>

        <div className="cg-scramble-input-area">
          <input
            ref={inputRef}
            type="text"
            className="cg-scramble-input"
            placeholder="Digite a palavra aqui"
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkWord()}
          />
          <button type="button" className="cg-btn-check" onClick={checkWord}>
            VERIFICAR
          </button>
          <button type="button" className="cg-btn-skip" onClick={nextWord}>
            Pular Palavra
          </button>
        </div>
      </div>
    </div>
  )
}
