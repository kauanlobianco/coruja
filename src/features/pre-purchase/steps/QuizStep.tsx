import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { QuizOption } from '../../../components/quiz/QuizOption'
import { quizQuestions } from '../data'
import type { QuizQuestion } from '../types'

interface QuizStepProps {
  quizIndex: number
  currentQuestion: QuizQuestion
  quizProgress: number
  pendingAnswerIndex: number | null
  transitionDirection: 1 | -1
  onBack: () => void
  onSelectOption: (index: number) => void
  onConfirm: () => void
}

function isFinalQuestion(question: QuizQuestion) {
  const last = quizQuestions[quizQuestions.length - 1]
  return question.id === last?.id && question.answers.length === 2
}

export function QuizStep({
  quizIndex,
  currentQuestion,
  quizProgress,
  pendingAnswerIndex,
  onBack,
  onSelectOption,
  onConfirm,
}: QuizStepProps) {
  const isFinal = isFinalQuestion(currentQuestion)

  return (
    <section className="prepurchase-quiz">
      <div className="prepurchase-quiz-header">
        <div className="prepurchase-quiz-header-row">
          <button type="button" className="prepurchase-quiz-back" onClick={onBack}>
            <ChevronLeft size={20} strokeWidth={2.4} />
          </button>

          <div className="prepurchase-quiz-meta">Pergunta #{quizIndex + 1}</div>

          <div className="prepurchase-quiz-badge">PT-BR</div>
        </div>

        <div className="prepurchase-quiz-progress">
          <div className="prepurchase-quiz-progress-copy">
            <span>Seu avanco no quiz</span>
            <span>{Math.round(quizProgress)}%</span>
          </div>
          <div className="prepurchase-quiz-progress-track">
            <div
              className="prepurchase-quiz-progress-fill"
              style={{ width: `${quizProgress}%` }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentQuestion.id}
          className="prepurchase-quiz-stage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <div className="prepurchase-quiz-body">
            <div className="prepurchase-quiz-copy">
              <p className="prepurchase-quiz-kicker">{currentQuestion.factor}</p>
              <h2 className="prepurchase-quiz-question">{currentQuestion.prompt}</h2>
            </div>

            {isFinal ? (
              <div className="prepurchase-quiz-decision">
                {currentQuestion.answers.map((answer, answerIndex) => {
                  const selected = pendingAnswerIndex === answerIndex
                  const isAffirmative = answerIndex === 1

                  return (
                    <button
                      key={answer.label}
                      type="button"
                      className={
                        selected
                          ? `prepurchase-quiz-decision-card ${
                              isAffirmative
                                ? 'prepurchase-quiz-decision-card-danger prepurchase-quiz-decision-card-selected'
                                : 'prepurchase-quiz-decision-card-safe prepurchase-quiz-decision-card-selected'
                            }`
                          : `prepurchase-quiz-decision-card ${
                              isAffirmative
                                ? 'prepurchase-quiz-decision-card-danger'
                                : 'prepurchase-quiz-decision-card-safe'
                            }`
                      }
                      aria-pressed={selected}
                      onClick={() => onSelectOption(answerIndex)}
                    >
                      <span className="prepurchase-quiz-decision-glow" />
                      <span className="prepurchase-quiz-decision-content">
                        <span className="prepurchase-quiz-decision-kicker">
                          {isAffirmative ? 'Sinal de alerta' : 'Sem perda declarada'}
                        </span>
                        <span className="prepurchase-quiz-decision-label">
                          {answer.label}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="prepurchase-quiz-options">
                {currentQuestion.answers.map((answer, answerIndex) => (
                  <QuizOption
                    key={answer.label}
                    number={answerIndex + 1}
                    label={answer.label}
                    selected={pendingAnswerIndex === answerIndex}
                    onClick={() => onSelectOption(answerIndex)}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        className={
          pendingAnswerIndex === null
            ? 'prepurchase-quiz-confirm prepurchase-quiz-confirm-disabled'
            : 'prepurchase-quiz-confirm'
        }
        onClick={onConfirm}
        disabled={pendingAnswerIndex === null}
      >
        Confirmar resposta
      </button>
    </section>
  )
}
