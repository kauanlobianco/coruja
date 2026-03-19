import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '../../shared/layout/AppShell'
import { SelectionPill } from './SelectionPill'

export interface SelectionOption {
  label: string
  emoji: string
}

interface SelectionScreenProps {
  title: string
  subtitle: string
  contextIcon: string
  contextMessage: string
  options: SelectionOption[]
  progress: number // 0–1
  step: string    // ex: "2 de 4"
  /** When true: single select (radio behavior), no counter. Default: false (multi) */
  singleSelect?: boolean
  onContinue: (selected: string[]) => void
}

export function SelectionScreen({
  title,
  subtitle,
  contextIcon,
  contextMessage,
  options,
  progress,
  step,
  singleSelect = false,
  onContinue,
}: SelectionScreenProps) {
  const [selected, setSelected] = useState<string[]>([])

  function toggle(label: string) {
    if (singleSelect) {
      setSelected([label])
    } else {
      setSelected((prev) =>
        prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
      )
    }
  }

  const hasSelection = selected.length > 0

  return (
    <AppShell title="" eyebrow="" shellMode="entry" hideTopbar>
      <motion.div
        className="ob-screen"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="ob-header">
          <div className="ob-step-row">
            <span className="ob-step-label">{step}</span>
          </div>
          <h1 className="ob-title">{title}</h1>
          <p className="ob-subtitle">{subtitle}</p>
          <div
            className="ob-progress-track"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="ob-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Empathy context card */}
        <div className="ob-context-card">
          <span className="ob-context-icon" aria-hidden="true">{contextIcon}</span>
          <p className="ob-context-message">{contextMessage}</p>
        </div>

        {/* Pill grid — 2-col by default, 1-col for goal */}
        <div className={`ob-pills-area${singleSelect ? ' ob-pills-area--single' : ''}`}>
          {options.map((opt, i) => {
            const isLast = i === options.length - 1
            const isOdd = options.length % 2 !== 0
            // Last pill in odd list spans 2 columns (only in 2-col layout)
            const spanFull = !singleSelect && isLast && isOdd
            return (
              <SelectionPill
                key={opt.label}
                label={opt.label}
                emoji={opt.emoji}
                selected={selected.includes(opt.label)}
                onClick={() => toggle(opt.label)}
                spanFull={spanFull}
              />
            )
          })}
        </div>

        {/* Bottom bar */}
        <div className="ob-bottom-bar">
          {!singleSelect && hasSelection && (
            <p className="ob-count-label">
              {selected.length} {selected.length === 1 ? 'selecionado' : 'selecionados'}
            </p>
          )}
          <AnimatePresence mode="wait">
            {hasSelection ? (
              <motion.button
                key="cta-active"
                type="button"
                className="button ob-cta"
                onClick={() => onContinue(selected)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                Continuar
              </motion.button>
            ) : (
              <motion.button
                key="cta-ghost"
                type="button"
                className="button ob-cta ob-cta--ghost"
                disabled
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Selecione ao menos uma opção
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AppShell>
  )
}
