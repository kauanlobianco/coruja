import { useCallback, useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, ArrowRight, Clock3, ExternalLink, X } from 'lucide-react'
import type { CuradoriaArticleItem } from '../../../data/curadoria'

export interface CuradoriaArticleReadingState {
  currentSection: number
  completed: boolean
  completedAt?: string
  abandonCount?: number
  preferredMode?: 'full' | 'summary'
}

interface CuradoriaArticleModalProps {
  item: CuradoriaArticleItem | null
  readingState?: CuradoriaArticleReadingState
  onReadingStateChange: (itemId: string, nextState: CuradoriaArticleReadingState) => void
  onClose: () => void
}

function openExternalLink(url: string) {
  const openedWindow = window.open(url, '_blank', 'noopener,noreferrer')

  if (!openedWindow) {
    window.location.assign(url)
  }
}

export function CuradoriaArticleModal({
  item,
  readingState,
  onReadingStateChange,
  onClose,
}: CuradoriaArticleModalProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const currentSection = item
    ? Math.min(readingState?.currentSection ?? 0, Math.max(item.secoes.length - 1, 0))
    : 0

  const currentContent = useMemo(() => {
    if (!item) {
      return null
    }

    return item.secoes[currentSection] ?? item.secoes[0] ?? null
  }, [currentSection, item])

  const totalSections = item?.secoes.length ?? 0
  const isCompleted = readingState?.completed ?? false
  const preferredMode = readingState?.preferredMode ?? 'full'
  const abandonCount = readingState?.abandonCount ?? 0

  const handleClose = useCallback(() => {
    if (!item) {
      onClose()
      return
    }

    if (!isCompleted) {
      onReadingStateChange(item.id, {
        currentSection,
        completed: false,
        completedAt: readingState?.completedAt,
        abandonCount: abandonCount + 1,
        preferredMode,
      })
    }

    onClose()
  }, [
    abandonCount,
    currentSection,
    isCompleted,
    item,
    onClose,
    onReadingStateChange,
    preferredMode,
    readingState?.completedAt,
  ])

  useEffect(() => {
    if (!item) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [handleClose, item])

  useEffect(() => {
    if (!scrollRef.current) {
      return
    }

    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentSection, item?.id])

  if (!item || !currentContent || totalSections === 0) {
    return null
  }

  const isFirstSection = currentSection === 0
  const isLastSection = currentSection === totalSections - 1
  const progressPercent = ((currentSection + 1) / totalSections) * 100
  const remainingMinutes = Math.max(
    1,
    Math.round((Number(item.tempo.match(/(\d+)/)?.[1] ?? 8) * (totalSections - currentSection)) / totalSections),
  )

  const visibleParagraphs =
    preferredMode === 'summary'
      ? currentContent.paragrafos.slice(0, 1)
      : currentContent.paragrafos

  function updateProgress(nextSection: number, completed = isCompleted) {
    const boundedSection = Math.min(Math.max(nextSection, 0), totalSections - 1)
    onReadingStateChange(item.id, {
      currentSection: boundedSection,
      completed,
      completedAt: completed ? readingState?.completedAt ?? new Date().toISOString() : undefined,
      abandonCount,
      preferredMode,
    })
  }

  function concludeReading() {
    onReadingStateChange(item.id, {
      currentSection: totalSections - 1,
      completed: true,
      completedAt: readingState?.completedAt ?? new Date().toISOString(),
      abandonCount,
      preferredMode,
    })
    onClose()
  }

  function switchReadingMode(nextMode: 'full' | 'summary') {
    onReadingStateChange(item.id, {
      currentSection,
      completed: isCompleted,
      completedAt: readingState?.completedAt,
      abandonCount,
      preferredMode: nextMode,
    })
  }

  function handleAdvance() {
    if (isLastSection) {
      concludeReading()
      return
    }

    updateProgress(currentSection + 1, isCompleted)
  }

  return (
    <div
      className="curadoria-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Leitura: ${item.titulo}`}
      onClick={handleClose}
    >
      <div className="curadoria-reading-modal" onClick={(event) => event.stopPropagation()}>
        <div className="curadoria-reading-progressbar" aria-hidden="true">
          <span className="curadoria-reading-progressbar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="curadoria-reading-scroll" ref={scrollRef}>
          <header className="curadoria-reading-header">
            <div className="curadoria-reading-toprow">
              <button
                type="button"
                className="curadoria-modal-close curadoria-reading-close"
                onClick={handleClose}
                aria-label="Fechar leitura"
              >
                <X size={18} strokeWidth={2.4} />
              </button>

              <span className="curadoria-reading-step-label">
                Etapa {currentSection + 1} de {totalSections}
              </span>
            </div>

            <div className="curadoria-reading-metarow">
              <span className="curadoria-reading-step-meta">
                <Clock3 size={12} strokeWidth={2.2} />
                Faltam ~{remainingMinutes} min
              </span>
            </div>
          </header>

          {isFirstSection ? (
            <div className="curadoria-reading-hero">
              <span className="curadoria-reading-kicker">Jornada de leitura</span>
              <h3>{item.titulo}</h3>
              <p className="curadoria-reading-section-title">{currentContent.titulo}</p>
            </div>
          ) : (
            <div className="curadoria-reading-section-header">
              <span className="curadoria-reading-kicker">Continuando leitura</span>
              <p className="curadoria-reading-section-title">{currentContent.titulo}</p>
            </div>
          )}

          <article className="curadoria-reading-content">
            {visibleParagraphs.map((paragrafo) => (
              <p key={paragrafo}>{paragrafo}</p>
            ))}
          </article>

          {!isLastSection ? (
            <p className="curadoria-reading-guidance">Continue, voce esta indo bem.</p>
          ) : null}

          {abandonCount >= 2 && !isCompleted ? (
            <div className="curadoria-reading-mode-switch">
              <button
                type="button"
                className={`curadoria-reading-mode-button${preferredMode === 'summary' ? ' is-active' : ''}`}
                onClick={() => switchReadingMode('summary')}
              >
                Versao resumida
              </button>
              <button
                type="button"
                className={`curadoria-reading-mode-button${preferredMode === 'full' ? ' is-active' : ''}`}
                onClick={() => switchReadingMode('full')}
              >
                Leitura completa
              </button>
            </div>
          ) : null}

          <div className="curadoria-reading-sources">
            <span className="curadoria-reading-sources-label">Baseado em</span>
            <div className="curadoria-reading-sources-list">
              {item.referencias.map((referencia) => (
                <button
                  key={referencia.label}
                  type="button"
                  className="curadoria-reading-source-link"
                  onClick={() => openExternalLink(referencia.url)}
                >
                  {referencia.label}
                  <ExternalLink size={13} strokeWidth={2.2} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="curadoria-reading-floating">
            {!isFirstSection ? (
              <button
                type="button"
                className="curadoria-reading-floating-secondary"
                onClick={() => updateProgress(currentSection - 1, isCompleted)}
                aria-label="Voltar etapa"
              >
                <ArrowLeft size={16} strokeWidth={2.2} />
              </button>
            ) : null}

            <button
              type="button"
              className="button button-ember-brand curadoria-reading-floating-primary"
              onClick={handleAdvance}
            >
              {isLastSection ? 'Concluir leitura' : 'Continuar'}
              <ArrowRight size={16} strokeWidth={2.2} />
            </button>
          </div>

          <div className="curadoria-reading-page-indicator" aria-label={`Pagina ${currentSection + 1} de ${totalSections}`}>
            - {currentSection + 1} -
          </div>
        </div>
      </div>
    </div>
  )
}
