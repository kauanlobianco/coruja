import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  Globe,
  Shield,
  Target,
  TrendingUp,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import type { PlanOption } from '../types'

interface CustomPlanStepProps {
  selectedPlan: PlanOption['id']
  showPaywallSheet: boolean
  onSelectPlan: (plan: PlanOption['id']) => void
  onOpenPaywall: () => void
  onClosePaywall: () => void
  onBack: () => void
  onContinueToOnboarding: () => void
}

type TimelineAccent = 'cyan' | 'purple' | 'success' | 'amber'

interface TimelineItem {
  day: string
  title: string
  body: string
  Icon: React.ComponentType<{ size?: number }>
  accent: TimelineAccent
  highlight?: string
}

const timelineItems: TimelineItem[] = [
  {
    day: 'Dia 0',
    title: 'Prepare seu espaço',
    body: 'Organize seu ambiente físico, digital e social para facilitar a mudança.',
    Icon: Calendar,
    accent: 'cyan',
  },
  {
    day: 'Dia 1',
    title: 'Vença a abstinência',
    body: 'Use técnicas mentais e físicas rápidas para atravessar os desejos e redefinir o foco.',
    Icon: Brain,
    accent: 'purple',
    highlight:
      'No Dia 2, seu cérebro começa a se reiniciar. Os níveis de dopamina começam a se estabilizar. Os desejos podem surgir, mas é um sinal de que a cura começou.',
  },
  {
    day: 'Dia 3',
    title: 'Fortaleça seu Porquê',
    body: 'Transforme seu motivo para parar em motivação diária e foco.',
    Icon: Target,
    accent: 'cyan',
  },
  {
    day: 'Dia 4',
    title: 'Elimine os Sintomas',
    body: 'Lide com baixa energia, problemas de sono ou irritabilidade com resets simples.',
    Icon: Wrench,
    accent: 'purple',
    highlight:
      'Seu foco começa a voltar. A névoa levanta e a motivação retorna lentamente. Melhor sono, energia e clareza estão ao virar da esquina.',
  },
  {
    day: 'Dia 5',
    title: 'Sinta-se Melhor no Corpo',
    body: 'Mova-se, coma limpo e recarregue — sua energia e clareza retornam rápido.',
    Icon: Dumbbell,
    accent: 'success',
  },
  {
    day: 'Dia 6',
    title: 'Você Não Está Sozinho',
    body: 'Conecte-se com outros no mesmo caminho. Compartilhe vitórias, receba apoio.',
    Icon: Globe,
    accent: 'cyan',
  },
  {
    day: 'Dia 7',
    title: 'Retome o Seu Tempo',
    body: 'Substitua velhos hábitos por metas reais e ação significativa.',
    Icon: Clock,
    accent: 'amber',
  },
  {
    day: 'Semana 1 completa',
    title: 'Estatísticas e Momentum',
    body: 'Seus impulsos ainda existem, mas são mais fáceis de controlar. Energia, confiança e motivação real estão chegando.',
    Icon: TrendingUp,
    accent: 'success',
  },
]

export function CustomPlanStep({
  selectedPlan,
  showPaywallSheet,
  onSelectPlan,
  onOpenPaywall,
  onClosePaywall,
  onBack,
  onContinueToOnboarding,
}: CustomPlanStepProps) {
  return (
    <>
      <section className="cp-page">
        <div className="quiz-custom-header">
          <button onClick={onBack} aria-label="Voltar" className="cp-back-button">
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="cp-scroll">
          <div className="cp-intro">
            <div className="cp-guarantee-badge">
              <CheckCircle2 size={12} />
              <span>Sem compromisso, cancele quando quiser</span>
            </div>

            <p className="cp-eyebrow">Coruja</p>
            <h2 className="cp-headline">Não é sobre força de vontade.</h2>
            <p className="cp-subheadline">É sobre um sistema que realmente funciona</p>
            <p className="cp-body">
              O Coruja te guia por um reinício de 30 dias, fornecendo estrutura e ferramentas
              que apoiam seu crescimento mesmo além desse período.
            </p>
            <p className="cp-section-title">Veja como são seus primeiros 7 dias:</p>
          </div>

          <div className="cp-timeline">
            <div className="cp-timeline-line" aria-hidden="true" />
            {timelineItems.map((item, i) => (
              <div key={i} className="cp-timeline-item">
                <div className={`cp-item-dot cp-item-dot--${item.accent}`} aria-hidden="true">
                  <item.Icon size={13} />
                </div>
                <div className="cp-item-content">
                  {item.highlight && (
                    <div className="cp-item-highlight">{item.highlight}</div>
                  )}
                  <div className="cp-item-card">
                    <span className="cp-item-day">{item.day}</span>
                    <strong className="cp-item-title">{item.title}</strong>
                    <p className="cp-item-body">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cp-footer">
          <div className="cp-footer-guarantee">
            <CheckCircle2 size={13} />
            <span>Sem compromisso, cancele quando quiser</span>
          </div>
          <button className="button button-primary cp-cta" onClick={onOpenPaywall}>
            Começar minha jornada
          </button>
        </div>
      </section>

      <AnimatePresence>
        {showPaywallSheet && (
          <motion.div
            className="cp-sheet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClosePaywall}
          >
            <motion.div
              className="cp-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 36 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cp-sheet-handle" aria-hidden="true" />

              <div className="cp-sheet-toprow">
                <div className="cp-sale-badge">
                  <Zap size={11} />
                  <span>60% Off Sale</span>
                </div>
                <span className="cp-slots-left">9 vagas restantes</span>
                <button
                  className="cp-sheet-close"
                  onClick={onClosePaywall}
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="cp-sheet-title">Escolha Seu Plano</h3>

              <button
                className={`cp-plan-card${selectedPlan === 'annual' ? ' cp-plan-card--active' : ''}`}
                onClick={() => onSelectPlan('annual')}
              >
                <div
                  className={`cp-plan-radio${selectedPlan === 'annual' ? ' cp-plan-radio--active' : ''}`}
                  aria-hidden="true"
                >
                  {selectedPlan === 'annual' && <div className="cp-plan-radio-dot" />}
                </div>
                <div className="cp-plan-info">
                  <div className="cp-plan-row">
                    <span className="cp-plan-name">Anual</span>
                    <div className="cp-plan-price-block">
                      <span className="cp-plan-old-price">R$149,90</span>
                      <span className="cp-plan-price">R$ 12,49</span>
                    </div>
                  </div>
                  <span className="cp-plan-period">por mês</span>
                </div>
              </button>

              <button
                className={`cp-plan-card${selectedPlan === 'lifetime' ? ' cp-plan-card--active' : ''}`}
                onClick={() => onSelectPlan('lifetime')}
              >
                <div
                  className={`cp-plan-radio${selectedPlan === 'lifetime' ? ' cp-plan-radio--active' : ''}`}
                  aria-hidden="true"
                >
                  {selectedPlan === 'lifetime' && <div className="cp-plan-radio-dot" />}
                </div>
                <div className="cp-plan-info">
                  <div className="cp-plan-row">
                    <span className="cp-plan-name">Vitalício</span>
                    <div className="cp-plan-price-block">
                      <span className="cp-plan-old-price">R$449,90</span>
                      <span className="cp-plan-price">R$ 299,90</span>
                    </div>
                  </div>
                  <span className="cp-plan-period">pague uma vez</span>
                </div>
              </button>

              <div className="cp-sheet-guarantee">
                <Shield size={13} />
                <span>Sem compromisso, cancele quando quiser</span>
              </div>

              <button
                className="button button-primary cp-sheet-cta"
                onClick={onContinueToOnboarding}
              >
                Começar minha jornada
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
