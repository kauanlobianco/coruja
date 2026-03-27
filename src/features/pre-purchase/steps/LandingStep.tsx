import { ArrowRight, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface LandingStepProps {
  conflictError: string | null
  onStart: () => void
}

export function LandingStep({ conflictError, onStart }: LandingStepProps) {
  const navigate = useNavigate()

  return (
    <section className="prepurchase-landing">
      <div className="foco-landing-particles" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="foco-particle" />
        ))}
      </div>

      <div className="prepurchase-landing-brand">
        <div className="foco-brand-center">
          <div className="prepurchase-hero-copy foco-hero-center">
            <h2 className="prepurchase-hero-title">Bem-vindo!</h2>
            <p className="prepurchase-hero-subtitle">
              Vamos comecar descobrindo se voce esta enfrentando um problema com
              pornografia.
            </p>
          </div>

          <div className="foco-brand-logo" aria-label="Foco Mode">
            <div className="foco-brand-top">FOCO</div>
            <div className="foco-brand-bottom">
              <span>M</span>
              <div className="foco-brand-toggle">
                <div className="foco-brand-toggle-knob"></div>
              </div>
              <span>E</span>
            </div>
            
            <div className="foco-brand-rating">
              <span className="foco-brand-rating-stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={11} fill="currentColor" strokeWidth={1.8} />
                ))}
              </span>
              <span className="foco-brand-rating-text">
                4.9 de avaliação
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="prepurchase-landing-actions">
        {conflictError ? (
          <p className="warning-banner prepurchase-warning">{conflictError}</p>
        ) : null}

        <button
          type="button"
          className="prepurchase-landing-primary"
          onClick={onStart}
        >
          <span>Iniciar Quiz</span>
          <span className="prepurchase-landing-primary-icon" aria-hidden="true">
            <ArrowRight size={16} strokeWidth={2.6} />
          </span>
        </button>

        <button
          type="button"
          className="prepurchase-landing-secondary"
          onClick={() => navigate('/account/auth?mode=login&loginOnly=1')}
        >
          <span className="prepurchase-landing-secondary-label">Ja e assinante?</span>
          <ArrowRight size={13} strokeWidth={2.2} />
        </button>
      </div>
    </section>
  )
}
