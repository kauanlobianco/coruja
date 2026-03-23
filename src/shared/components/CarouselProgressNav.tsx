import { motion } from 'framer-motion'
import { CheckCircle2, ChevronLeft } from 'lucide-react'

interface CarouselProgressNavProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onBack?: () => void
  showBackFromFirstStep?: boolean
  nextLabel?: string
  finishLabel?: string
}

const DOT_SIZE = 8
const DOT_GAP = 28
const OVERLAY_PADDING = 8
const BACK_BUTTON_WIDTH = 56
const NEXT_BUTTON_WIDE = 172
const NEXT_BUTTON_COMPACT = 136

function getOverlayWidth(step: number) {
  return DOT_SIZE + OVERLAY_PADDING * 2 + (step - 1) * DOT_GAP
}

function getTrackWidth(totalSteps: number) {
  return DOT_SIZE + (totalSteps - 1) * DOT_GAP
}

export function CarouselProgressNav({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  showBackFromFirstStep = false,
  nextLabel = 'Continuar',
  finishLabel = 'Concluir',
}: CarouselProgressNavProps) {
  const canGoBack = typeof onBack === 'function' && (currentStep > 1 || showBackFromFirstStep)
  const isLastStep = currentStep === totalSteps

  return (
    <div className="carousel-progress-nav">
      <div
        className="carousel-progress-track"
        aria-label={`Passo ${currentStep} de ${totalSteps}`}
        style={{ width: getTrackWidth(totalSteps) }}
      >
        {Array.from({ length: totalSteps }).map((_, index) => (
          <span
            key={index}
            className={
              index + 1 <= currentStep ? 'carousel-progress-dot is-active' : 'carousel-progress-dot'
            }
          />
        ))}

        <motion.div
          className="carousel-progress-overlay"
          initial={false}
          animate={{ width: getOverlayWidth(currentStep) }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 24,
            mass: 0.8,
          }}
        />
      </div>

      <div className="carousel-progress-actions">
        <div className="carousel-progress-actions-row">
          {canGoBack ? (
            <motion.button
              type="button"
              className="carousel-progress-back"
              onClick={onBack}
              initial={{ opacity: 0, width: 0, scale: 0.88 }}
              animate={{ opacity: 1, width: BACK_BUTTON_WIDTH, scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.88 }}
              transition={{
                type: 'spring',
                stiffness: 360,
                damping: 24,
                mass: 0.8,
              }}
            >
              <ChevronLeft size={18} strokeWidth={2.2} />
            </motion.button>
          ) : null}

          <motion.button
            type="button"
            className="carousel-progress-next"
            onClick={onNext}
            initial={false}
            animate={{
              width: canGoBack ? NEXT_BUTTON_COMPACT : NEXT_BUTTON_WIDE,
            }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 26,
              mass: 0.9,
            }}
          >
            <span className="carousel-progress-next-label">
              {isLastStep ? <CheckCircle2 size={16} strokeWidth={2.2} /> : null}
              {isLastStep ? finishLabel : nextLabel}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
