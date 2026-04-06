import { useCallback, useRef, useState } from 'react'
import { iconBank, shuffleArray } from '../../shared/gameUtils'

export interface MemCard {
  id: number
  icon: string
  flipped: boolean
  matched: boolean
}

interface MemState {
  cards: MemCard[]
  moves: number
}

export function useMemoryGame(onFeedback: (correct: boolean) => void) {
  const [state, setStateRaw] = useState<MemState>({ cards: [], moves: 0 })

  // Mirror of React state — lets us read the latest value synchronously
  // without relying on setState updater (which runs twice in StrictMode).
  const stateRef  = useRef<MemState>({ cards: [], moves: 0 })
  const lockedRef = useRef(false)
  const flippedRef = useRef<number[]>([])  // at most 2 IDs at a time

  /** Sync helper: update both the ref and React state in one call */
  const commit = useCallback((next: MemState) => {
    stateRef.current = next
    setStateRaw(next)
  }, [])

  const start = useCallback(() => {
    lockedRef.current  = false
    flippedRef.current = []

    const selected = shuffleArray([...iconBank]).slice(0, 12)
    const paired   = shuffleArray([...selected, ...selected])
    const cards: MemCard[] = paired.map((icon, i) => ({ id: i, icon, flipped: false, matched: false }))
    const next: MemState   = { cards, moves: 0 }

    commit(next)
  }, [commit])

  const flipCard = useCallback(
    (id: number) => {
      // ── guards ──────────────────────────────────────────────────────────
      if (lockedRef.current) return
      if (flippedRef.current.includes(id)) return
      if (flippedRef.current.length >= 2) return

      const current = stateRef.current
      const card = current.cards[id]
      if (!card || card.flipped || card.matched) return

      // ── flip the clicked card ────────────────────────────────────────────
      const flippedCards = current.cards.map((c) => (c.id === id ? { ...c, flipped: true } : c))
      flippedRef.current = [...flippedRef.current, id]

      if (flippedRef.current.length < 2) {
        // Only one card flipped — just show it
        commit({ ...current, cards: flippedCards })
        return
      }

      // ── two cards are now face-up ────────────────────────────────────────
      lockedRef.current = true
      const [id1, id2] = flippedRef.current
      const c1 = flippedCards[id1]
      const c2 = flippedCards[id2]

      commit({ cards: flippedCards, moves: current.moves + 1 })

      if (c1.icon === c2.icon) {
        // ── MATCH ──────────────────────────────────────────────────────────
        setTimeout(() => {
          onFeedback(true)
          const matched = stateRef.current.cards.map((c) =>
            c.id === id1 || c.id === id2 ? { ...c, matched: true } : c,
          )
          flippedRef.current = []
          lockedRef.current  = false
          commit({ ...stateRef.current, cards: matched })
          if (matched.every((c) => c.matched)) setTimeout(start, 1500)
        }, 400)
      } else {
        // ── NO MATCH ───────────────────────────────────────────────────────
        setTimeout(() => {
          const unflipped = stateRef.current.cards.map((c) =>
            c.id === id1 || c.id === id2 ? { ...c, flipped: false } : c,
          )
          flippedRef.current = []
          lockedRef.current  = false
          commit({ ...stateRef.current, cards: unflipped })
        }, 1000)
      }
    },
    [commit, onFeedback, start],
  )

  return { state, start, flipCard }
}
