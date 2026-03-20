import { ChevronLeft } from 'lucide-react'

interface LoadingStepProps {
  progress: number
  onBack: () => void
}

export function LoadingStep({ progress, onBack }: LoadingStepProps) {
  return (
    <section className="prepurchase-loading">
      <div className="prepurchase-loading-header">
        <button
          type="button"
          className="prepurchase-quiz-back"
          onClick={onBack}
        >
          <ChevronLeft size={20} strokeWidth={2.4} />
        </button>
      </div>

      <div className="prepurchase-loading-body">
        <div className="prepurchase-loading-ring-shell">
          <div className="prepurchase-loading-ring">
            <svg
              className="prepurchase-loading-ring-svg"
              viewBox="0 0 120 120"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="prepurchaseLoadingRingGradient"
                  x1="10%"
                  y1="10%"
                  x2="90%"
                  y2="90%"
                >
                  <stop offset="0%" stopColor="#F6F0E8" />
                  <stop offset="20%" stopColor="#EC9E32" />
                  <stop offset="62%" stopColor="#E35B2E" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
              </defs>
              <circle
                className="prepurchase-loading-ring-track"
                cx="60"
                cy="60"
                r="46"
              />
              <circle
                className="prepurchase-loading-ring-progress"
                cx="60"
                cy="60"
                r="46"
                pathLength="100"
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: 100 - progress,
                }}
              />
            </svg>

            <div className="prepurchase-loading-ring-core">
              <span className="prepurchase-loading-value">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        <div className="prepurchase-loading-copy">
          <h2 className="prepurchase-loading-title">Calculando</h2>
          <p className="prepurchase-loading-subtitle">
            Construindo plano personalizado
          </p>
        </div>
      </div>
    </section>
  )
}
