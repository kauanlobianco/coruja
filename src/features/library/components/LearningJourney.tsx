import { Check, ChevronDown, Clock3, Lock } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { CuradoriaArticleItem } from '../../../data/curadoria'
import type { CuradoriaArticleReadingState } from './CuradoriaArticleModal'

type JourneyStepState = 'completed' | 'current' | 'upcoming' | 'locked'

interface LearningJourneyProps {
  articles: CuradoriaArticleItem[]
  readingProgress: Record<string, CuradoriaArticleReadingState>
  momentumMessage?: string | null
  onOpenArticle: (article: CuradoriaArticleItem) => void
}

interface StepModel {
  article: CuradoriaArticleItem
  index: number
  state: JourneyStepState
  hasProgress: boolean
  isCompleted: boolean
  timeLabel: string | null
}

function parseMinutesLabel(label: string) {
  const match = label.match(/(\d+)/)
  return match ? Number(match[1]) : 0
}

function getStepState(index: number, currentIndex: number, isCompleted: boolean): JourneyStepState {
  if (isCompleted) return 'completed'
  if (index === currentIndex) return 'current'
  if (index === currentIndex + 1) return 'upcoming'
  return 'locked'
}

function getRemainingTime(article: CuradoriaArticleItem, progress?: CuradoriaArticleReadingState) {
  const totalMinutes = parseMinutesLabel(article.tempo)
  if (!totalMinutes) return article.tempo

  const totalSections = Math.max(article.secoes.length, 1)
  const completedSections = Math.min(progress?.currentSection ?? 0, totalSections - 1)
  const remainingRatio = (totalSections - completedSections) / totalSections
  const remainingMinutes = Math.max(1, Math.round(totalMinutes * remainingRatio))

  return `${remainingMinutes} min de leitura`
}

export function LearningJourney({
  articles,
  readingProgress,
  momentumMessage,
  onOpenArticle,
}: LearningJourneyProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const completedCount = articles.filter((article) => readingProgress[article.id]?.completed).length
  const firstIncompleteIndex = articles.findIndex((article) => !readingProgress[article.id]?.completed)
  const currentIndex = firstIncompleteIndex === -1 ? Math.max(articles.length - 1, 0) : firstIncompleteIndex
  const completionPercent = articles.length ? Math.round((completedCount / articles.length) * 100) : 0

  const defaultVisibleIndexes = useMemo(() => {
    const visible = new Set<number>()

    if (articles.length === 0) {
      return visible
    }

    if (firstIncompleteIndex === -1) {
      visible.add(Math.max(articles.length - 2, 0))
      visible.add(articles.length - 1)
      return visible
    }

    if (currentIndex > 0) {
      visible.add(currentIndex - 1)
    }

    visible.add(currentIndex)

    if (currentIndex + 1 < articles.length) {
      visible.add(currentIndex + 1)
    }

    return visible
  }, [articles.length, currentIndex, firstIncompleteIndex])

  const hiddenCount = Math.max(articles.length - defaultVisibleIndexes.size, 0)

  const steps = useMemo<StepModel[]>(
    () =>
      articles.map((article, index) => {
        const progress = readingProgress[article.id]
        const isCompleted = progress?.completed ?? false
        const hasProgress = (progress?.currentSection ?? 0) > 0
        const state = getStepState(index, currentIndex, isCompleted)

        return {
          article,
          index,
          state,
          hasProgress,
          isCompleted,
          timeLabel: state === 'current' ? getRemainingTime(article, progress) : article.tempo,
        }
      }),
    [articles, currentIndex, readingProgress],
  )

  const visibleSteps = isExpanded
    ? steps
    : steps.filter((step) => defaultVisibleIndexes.has(step.index))

  return (
    <section className="learning-journey panel-stack" aria-label="Sua jornada de leitura">
      <div className="learning-journey-shell">
        <header className="learning-journey-header">
          <h2>Sua jornada de leitura</h2>

          <div className="learning-journey-progress-block">
            <div className="learning-journey-progressbar" aria-hidden="true">
              <span
                className="learning-journey-progressbar-fill"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <div className="learning-journey-progress-meta">
              <span>{completedCount} de {articles.length} concluidos</span>
            </div>
          </div>
        </header>

        {momentumMessage ? <p className="learning-journey-momentum">{momentumMessage}</p> : null}

        <div
          className={`learning-journey-timeline${isExpanded ? ' learning-journey-timeline--expanded' : ''}`}
        >
          {visibleSteps.map((step) => (
            <article
              key={step.article.id}
              className={`learning-step learning-step--${step.state}`}
              aria-current={step.state === 'current' ? 'step' : undefined}
            >
              <div className="learning-step-rail" aria-hidden="true">
                <span className="learning-step-node">
                  {step.isCompleted ? (
                    <Check size={13} strokeWidth={2.6} />
                  ) : step.state === 'locked' ? (
                    <Lock size={12} strokeWidth={2.2} />
                  ) : (
                    <span className="learning-step-node-core" />
                  )}
                </span>
                {step.index < visibleSteps[visibleSteps.length - 1].index ? (
                  <span className="learning-step-line" />
                ) : null}
              </div>

              {step.state === 'current' ? (
                <button
                  type="button"
                  className="learning-step-card"
                  onClick={() => onOpenArticle(step.article)}
                >
                  <div className="learning-step-card-top">
                    <span className="learning-step-card-kicker">
                      {step.hasProgress ? 'Continue leitura' : 'Proxima etapa'}
                    </span>
                    {step.timeLabel ? (
                      <span className="learning-step-card-time">
                        <Clock3 size={12} strokeWidth={2.2} />
                        {step.timeLabel}
                      </span>
                    ) : null}
                  </div>

                  <h3>{step.article.titulo}</h3>
                  <p>{step.article.subtitulo}</p>

                  <span className="learning-step-card-action">
                    {step.hasProgress ? 'Continuar leitura' : 'Comecar agora'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className={`learning-step-row learning-step-row--${step.state}`}
                  onClick={step.state === 'locked' ? undefined : () => onOpenArticle(step.article)}
                  disabled={step.state === 'locked'}
                >
                  <div className="learning-step-row-copy">
                    <h3>{step.article.titulo}</h3>
                    <p>
                      {step.state === 'completed'
                        ? 'Leitura concluida'
                        : step.state === 'upcoming'
                          ? 'Disponivel agora'
                          : `Libera ao concluir a etapa ${Math.max(step.index, 1)}`}
                    </p>
                  </div>

                  {step.timeLabel ? (
                    <span className="learning-step-row-meta">
                      <Clock3 size={12} strokeWidth={2.2} />
                      {step.timeLabel}
                    </span>
                  ) : null}
                </button>
              )}
            </article>
          ))}
        </div>

        {hiddenCount > 0 ? (
          <button
            type="button"
            className="learning-journey-toggle"
            onClick={() => setIsExpanded((current) => !current)}
          >
            {isExpanded ? 'Mostrar menos' : `Ver jornada completa (${hiddenCount})`}
            <ChevronDown
              size={15}
              strokeWidth={2.2}
              className={isExpanded ? 'is-rotated' : undefined}
            />
          </button>
        ) : null}
      </div>
    </section>
  )
}
