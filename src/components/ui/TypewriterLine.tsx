import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface TypewriterLineProps {
  text: string
  /** ms por caractere */
  charDelay?: number
  onComplete?: () => void
  className?: string
}

/**
 * Digita o texto caractere por caractere.
 * Cursor piscante (framer-motion) aparece logo após o último caractere digitado e some ao terminar.
 */
export function TypewriterLine({
  text,
  charDelay = 60,
  onComplete,
  className,
}: TypewriterLineProps) {
  const [typed, setTyped] = useState('')
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    let index = 0
    let timer: ReturnType<typeof setTimeout>

    function typeNext() {
      index++
      setTyped(text.slice(0, index))
      if (index < text.length) {
        timer = setTimeout(typeNext, charDelay)
      } else {
        onCompleteRef.current?.()
      }
    }

    timer = setTimeout(typeNext, charDelay)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const done = typed.length >= text.length

  return (
    <span className={className}>
      {typed}
      {!done && (
        <motion.span
          className="typewriter-cursor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </span>
  )
}
