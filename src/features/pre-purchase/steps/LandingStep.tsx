import { ArrowRight, Leaf, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface LandingStepProps {
  conflictError: string | null
  onStart: () => void
}

export function LandingStep({ conflictError, onStart }: LandingStepProps) {
  const navigate = useNavigate()

  return (
    <section className="prepurchase-landing">
      <div className="prepurchase-landing-brand">
        <h1 className="prepurchase-logo">CORUJA</h1>

        <div className="prepurchase-hero-copy">
          <h2 className="prepurchase-hero-title">Bem-vindo!</h2>
          <p className="prepurchase-hero-subtitle">
            Vamos comecar descobrindo se voce esta enfrentando um problema com
            pornografia.
          </p>
        </div>

        <div className="prepurchase-social-proof" aria-label="Avaliacao media dos usuarios">
          <Leaf className="prepurchase-social-proof-leaf" size={18} />
          <div className="prepurchase-social-proof-text">
            <span className="prepurchase-social-proof-rating">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={14} fill="currentColor" strokeWidth={1.8} />
              ))}
            </span>
            <span className="prepurchase-social-proof-caption">
              4.9 de avaliacao entre usuarios em recuperacao
            </span>
          </div>
          <Leaf className="prepurchase-social-proof-leaf" size={18} />
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
