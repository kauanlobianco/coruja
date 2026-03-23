import { Activity, Brain, Users, Shield, CheckCircle2, ChevronLeft } from 'lucide-react'
import type { SymptomCategory } from '../types'
import { symptomCategories, symptomOptions } from '../data'

const symptomCategoryMeta: Record<
  SymptomCategory,
  { icon: typeof Brain; description: string; accentClassName: string }
> = {
  Mental: {
    icon: Brain,
    description: 'Foco, energia mental e clareza cognitiva.',
    accentClassName: 'is-mental',
  },
  Fisico: {
    icon: Activity,
    description: 'Sinais no corpo, energia e resposta sexual.',
    accentClassName: 'is-physical',
  },
  Social: {
    icon: Users,
    description: 'Conexao, autoconfianca e vida relacional.',
    accentClassName: 'is-social',
  },
  Fe: {
    icon: Shield,
    description: 'Sentido, integridade e vida espiritual.',
    accentClassName: 'is-faith',
  },
}

interface SymptomsStepProps {
  symptoms: string[]
  onToggleSymptom: (symptom: string) => void
  onBack: () => void
  onContinue: () => void
}

export function SymptomsStep({ symptoms, onToggleSymptom, onBack, onContinue }: SymptomsStepProps) {
  return (
    <section className="prepurchase-symptoms">
      <div className="prepurchase-quiz-header prepurchase-symptoms-header">
        <div className="prepurchase-quiz-header-row">
          <button
            type="button"
            className="prepurchase-quiz-back"
            onClick={onBack}
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
          </button>

          <div className="prepurchase-symptoms-title-wrap">
            <div className="prepurchase-quiz-meta">Mapa de impacto</div>
            <div className="prepurchase-symptoms-title">Sintomas</div>
          </div>

          <div className="prepurchase-quiz-badge">PT-BR</div>
        </div>
      </div>

      <div className="prepurchase-symptoms-body">
        <div className="prepurchase-symptoms-intro">
          <div className="prepurchase-symptoms-alert">
            <div className="prepurchase-symptoms-alert-icon">
              <Activity size={18} strokeWidth={2.2} />
            </div>
            <div className="prepurchase-symptoms-alert-copy">
              <span className="prepurchase-symptoms-alert-label">Sinal importante</span>
              <p className="prepurchase-symptoms-alert-text">
                O uso excessivo pode deixar marcas reais em areas importantes da sua vida.
              </p>
            </div>
          </div>

          <div className="prepurchase-symptoms-lead">
            <p className="prepurchase-symptoms-lead-title">
              O que mais tem pesado em voce?
            </p>
            <p className="prepurchase-symptoms-lead-body">
              Selecione os sinais que combinam com seu momento.
            </p>
          </div>
        </div>

        <div className="prepurchase-symptoms-groups">
          {symptomCategories.map((category) => {
            const categoryOptions = symptomOptions.filter(
              (option) => option.category === category,
            )
            const selectedCount = categoryOptions.filter((option) =>
              symptoms.includes(option.label),
            ).length
            const meta = symptomCategoryMeta[category]
            const Icon = meta.icon

            return (
              <section
                key={category}
                className={`prepurchase-symptom-group ${meta.accentClassName}`}
              >
                <div className="prepurchase-symptom-group-header">
                  <div className="prepurchase-symptom-group-icon">
                    <Icon size={16} strokeWidth={2.1} />
                  </div>

                  <div className="prepurchase-symptom-group-copy">
                    <div className="prepurchase-symptom-group-topline">
                      <h3 className="prepurchase-symptom-group-title">{category}</h3>
                      <span className="prepurchase-symptom-group-count">
                        {selectedCount > 0 ? `${selectedCount} marcados` : 'Opcional'}
                      </span>
                    </div>
                    <p className="prepurchase-symptom-group-description">
                      {meta.description}
                    </p>
                  </div>
                </div>

                <div className="prepurchase-symptom-options">
                  {categoryOptions.map((option) => {
                    const isActive = symptoms.includes(option.label)

                    return (
                      <button
                        key={option.label}
                        type="button"
                        className={
                          isActive
                            ? 'prepurchase-symptom-option prepurchase-symptom-option-active'
                            : 'prepurchase-symptom-option'
                        }
                        aria-pressed={isActive}
                        onClick={() => onToggleSymptom(option.label)}
                      >
                        <span className="prepurchase-symptom-option-marker">
                          {isActive ? <CheckCircle2 size={16} strokeWidth={2.4} /> : null}
                        </span>
                        <span className="prepurchase-symptom-option-label">
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <div className="prepurchase-symptoms-footer">
          <div className="prepurchase-symptoms-selection">
            <span className="prepurchase-symptoms-selection-value">
              {symptoms.length}
            </span>
            <span className="prepurchase-symptoms-selection-copy">
              sintomas selecionados para montar sua leitura
            </span>
          </div>

          <button
            type="button"
            className="button-ember-brand prepurchase-symptoms-submit"
            disabled={symptoms.length === 0}
            onClick={onContinue}
          >
            Ver resultado do diagnostico
          </button>
        </div>
      </div>
    </section>
  )
}
