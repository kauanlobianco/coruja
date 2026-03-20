import { ChevronLeft } from 'lucide-react'

interface IdentityStepProps {
  name: string
  age: string
  onChangeName: (value: string) => void
  onChangeAge: (value: string) => void
  onBack: () => void
  onContinue: () => void
}

export function IdentityStep({
  name,
  age,
  onChangeName,
  onChangeAge,
  onBack,
  onContinue,
}: IdentityStepProps) {
  return (
    <section className="prepurchase-identity">
      <div className="prepurchase-quiz-header prepurchase-identity-header">
        <div className="prepurchase-quiz-header-row">
          <button
            type="button"
            className="prepurchase-quiz-back"
            onClick={onBack}
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
          </button>

          <div className="prepurchase-identity-progress" aria-hidden="true">
            <div className="prepurchase-quiz-progress-track">
              <div className="prepurchase-quiz-progress-fill" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="prepurchase-quiz-badge">PT-BR</div>
        </div>
      </div>

      <div className="prepurchase-identity-body">
        <div className="prepurchase-identity-copy">
          <p className="prepurchase-quiz-kicker">Etapa final</p>
          <h2 className="prepurchase-identity-title">Finalmente</h2>
          <p className="prepurchase-identity-subtitle">Um pouco mais sobre voce</p>
        </div>

        <div className="prepurchase-identity-form">
          <label className="prepurchase-identity-field">
            <span className="prepurchase-identity-label">Seu nome</span>
            <input
              className="prepurchase-identity-input"
              value={name}
              onChange={(event) => onChangeName(event.target.value)}
              placeholder="Como prefere ser chamado?"
            />
          </label>

          <label className="prepurchase-identity-field">
            <span className="prepurchase-identity-label">Sua idade</span>
            <input
              className="prepurchase-identity-input"
              value={age}
              onChange={(event) => onChangeAge(event.target.value)}
              placeholder="Ex: 22"
              type="number"
              inputMode="numeric"
            />
          </label>
        </div>

        <button
          type="button"
          className="prepurchase-identity-submit"
          disabled={!name.trim() || !age.trim()}
          onClick={onContinue}
        >
          Concluir quiz
        </button>
      </div>
    </section>
  )
}
