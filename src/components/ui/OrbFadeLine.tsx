import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { TypewriterLine } from './TypewriterLine'

// Split by sentence — keep sentences together, only break if very long
function toChunks(text: string, max = 60): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/)
  const chunks: string[] = []

  for (const raw of sentences) {
    const s = raw.trim()
    if (!s) continue
    if (s.length <= max) {
      chunks.push(s)
    } else {
      const words = s.split(' ')
      const mid = Math.ceil(words.length / 2)
      chunks.push(words.slice(0, mid).join(' '))
      chunks.push(words.slice(mid).join(' '))
    }
  }

  return chunks.filter(Boolean)
}

interface OrbFadeLineProps {
  text: string
  charDelay?: number
  /** ms to hold after typing finishes before advancing */
  holdMs?: number
  className?: string
  onComplete?: () => void
}

export function OrbFadeLine({
  text,
  charDelay = 55,
  holdMs = 1200,
  className,
  onComplete,
}: OrbFadeLineProps) {
  const chunks = toChunks(text)
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(false)   // current chunk finished typing?
  const [visible, setVisible] = useState(true) // fade in/out

  const hasMore = index < chunks.length - 1

  // After typing finishes → wait holdMs → fade out → advance
  useEffect(() => {
    if (!typed) return
    const hold = window.setTimeout(() => {
      setVisible(false)
    }, holdMs)
    return () => window.clearTimeout(hold)
  }, [typed, holdMs])

  // After fade-out completes → next chunk or done
  function handleExited() {
    if (hasMore) {
      setIndex((i) => i + 1)
      setTyped(false)
      setVisible(true)
    } else {
      onComplete?.()
    }
  }

  if (chunks.length === 0) return null

  return (
    <span className="orb-fade-line-wrap">
      <AnimatePresence mode="wait" onExitComplete={handleExited}>
        {visible && (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38 }}
          >
            <TypewriterLine
              key={`chunk-${index}`}
              text={chunks[index]}
              charDelay={charDelay}
              onComplete={() => setTyped(true)}
              className={className}
            />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Continuation dots — shown while there are more chunks and typing is done */}
      <AnimatePresence>
        {typed && hasMore && (
          <motion.span
            className="orb-fade-more"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            ···
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
