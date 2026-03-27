import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Flame,
  Lock,
  Shield,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  TrendingUp,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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

type Accent = 'cyan' | 'purple' | 'success' | 'amber' | 'danger' | 'ember'

interface DayItem {
  day: string
  tool: string
  Icon: React.ComponentType<{ size?: number }>
  accent: Accent
  headline: string
  body: string
}

const visibleDays: DayItem[] = [
  {
    day: 'Dia 0',
    tool: 'Configuração',
    Icon: Wrench,
    accent: 'cyan',
    headline: 'Seu ambiente preparado',
    body: 'Bloqueador ativo, Foco Mode configurado. A proteção começa agora.',
  },
  {
    day: 'Dia 1',
    tool: 'Check-in',
    Icon: CalendarCheck,
    accent: 'cyan',
    headline: 'O ponto de partida',
    body: 'Registre como você está. Esse dado guia toda a sua recuperação.',
  },
  {
    day: 'Dia 2',
    tool: 'Diário',
    Icon: BookOpen,
    accent: 'amber',
    headline: 'Coloque em palavras',
    body: 'Escreva sobre o momento difícil de ontem. Nomear o inimigo é metade da batalha.',
  },
  {
    day: 'Dia 3',
    tool: 'Sequência',
    Icon: Flame,
    accent: 'ember',
    headline: '3 dias. Primeira vitória real.',
    body: 'Sua dopamina começa a se recalibrar. O hábito está sendo reescrito agora.',
  },
  {
    day: 'Dia 5',
    tool: 'SOS',
    Icon: Zap,
    accent: 'danger',
    headline: 'Preparado antes da crise',
    body: 'Aprenda o SOS agora. Quando a fissura chegar, você já sabe o que fazer.',
  },
  {
    day: 'Dia 7',
    tool: 'Analytics',
    Icon: BarChart2,
    accent: 'purple',
    headline: '1ª semana — o padrão aparece',
    body: 'Seus dados revelam o que te puxa. Clareza que a força de vontade não dá.',
  },
  {
    day: 'Dia 9',
    tool: 'Bloqueador',
    Icon: ShieldCheck,
    accent: 'success',
    headline: 'Protegido 24 horas',
    body: 'Menos esforço mental. O app trabalha enquanto você descansa das batalhas.',
  },
  {
    day: 'Dia 11',
    tool: 'Diário',
    Icon: BookOpen,
    accent: 'amber',
    headline: 'Os dados mostram quem você virou',
    body: '11 registros. Um homem que enfrenta, não foge. Você está diferente.',
  },
  {
    day: 'Dia 14',
    tool: 'Analytics',
    Icon: TrendingUp,
    accent: 'purple',
    headline: '2 semanas de clareza',
    body: 'Os impulsos existem, mas agora você os vê chegando. Isso muda tudo.',
  },
  {
    day: 'Dia 15',
    tool: 'Marco',
    Icon: Trophy,
    accent: 'success',
    headline: 'Você atravessou a zona crítica',
    body: 'A maioria desiste antes daqui. Você não é a maioria.',
  },
]

const lockedDays = [
  { day: 'Dias 16–21', headline: 'Nova fase desbloqueada' },
  { day: 'Dias 22–28', headline: 'Mentalidade em transformação' },
  { day: 'Dia 30',    headline: 'Missão cumprida' },
]


const CheckFilled = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={22} height={22} style={style}>
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
)

const CheckOutline = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={22} height={22} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

const STEP_HEIGHT = 56
const LIST_OFFSET = 60

export function CustomPlanStep({
  selectedPlan,
  showPaywallSheet,
  onSelectPlan,
  onOpenPaywall,
  onClosePaywall,
  onBack,
  onContinueToOnboarding,
}: CustomPlanStepProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (isReady) return
    if (activeStep >= visibleDays.length - 1) {
      const t = setTimeout(() => setIsReady(true), 500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setActiveStep((s) => s + 1), 1400)
    return () => clearTimeout(t)
  }, [activeStep, isReady])

  // Auto-scroll to keep active item near the top of the viewport
  useEffect(() => {
    const container = scrollRef.current
    const item = itemsRef.current[activeStep]
    if (!container || !item) return
    const containerTop = container.getBoundingClientRect().top
    const itemTop = item.getBoundingClientRect().top
    const target = container.scrollTop + (itemTop - containerTop) - LIST_OFFSET
    container.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
  }, [activeStep])

  return (
    <>
      <section className="cp-page">
        <div className="quiz-custom-header">
          <button onClick={onBack} aria-label="Voltar" className="cp-back-button">
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* Hero */}
        <div className="cp2-hero">
          <div className="cp-guarantee-badge">
            <CheckCircle2 size={12} />
            <span>Plano personalizado pronto</span>
          </div>
          <h2 className="cp-headline">Sua jornada dia a dia</h2>
          <p className="cp2-hero-sub">Cada ferramenta, no momento certo.</p>
        </div>

        {/* Multi-step loader area */}
        <div className="cp2-viewport" ref={scrollRef}>
          <div className="cp2-list">
            {visibleDays.map((item, index) => {
              const distance = Math.abs(index - activeStep)
              const isPast = index < activeStep
              const isActive = index === activeStep
              const opacity = isActive
                ? 1
                : isPast
                  ? Math.max(1 - distance * 0.07, 0.45)
                  : Math.max(1 - distance * 0.3, 0)
              return (
                <motion.div
                  key={index}
                  ref={(el) => { itemsRef.current[index] = el as HTMLDivElement | null }}
                  className={`cp2-step${isActive ? ' cp2-step--active' : ''}`}
                  animate={{ opacity }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="cp2-step-icon">
                    {isPast || isActive ? (
                      <CheckFilled style={{ color: 'var(--color-accent-cyan)' }} />
                    ) : (
                      <CheckOutline style={{ color: 'rgba(255,255,255,0.18)' }} />
                    )}
                  </div>
                  <div className={`cp2-step-card${isActive ? ' cp2-step-card--active' : ''}`}>
                    <div className="cp2-step-top">
                      <span
                        className="cp2-step-day"
                        style={{ color: isActive ? 'var(--color-accent-cyan)' : undefined }}
                      >
                        {item.day}
                      </span>
                      <span className="cp2-step-sep" aria-hidden="true">·</span>
                      <span className="cp2-step-tool">{item.tool}</span>
                    </div>
                    <p className={`cp2-step-headline${isActive ? ' cp2-step-headline--active' : ''}`}>
                      {item.headline}
                    </p>
                    <p className="cp2-step-body">{item.body}</p>
                  </div>
                </motion.div>
              )
            })}

            {lockedDays.map((item, i) => (
              <div
                key={`locked-${i}`}
                className="cp2-step cp2-step--locked"
                style={{ opacity: Math.max(0.12 - i * 0.035, 0.04) }}
              >
                <div className="cp2-step-icon">
                  <Lock size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
                <div className="cp2-step-card">
                  <div className="cp2-step-top">
                    <span className="cp2-step-day">{item.day}</span>
                  </div>
                  <p className="cp2-step-headline">{item.headline}</p>
                  <p className="cp2-step-body cp2-step-body--locked">••••••••••••••••••••••</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="cp-footer">
          <div className="cp-footer-guarantee">
            <CheckCircle2 size={13} />
            <span>Cancele quando quiser · Sem compromisso</span>
          </div>
          <motion.button
            className="button button-ember-brand cp-cta"
            onClick={onOpenPaywall}
            animate={
              isReady
                ? { boxShadow: ['0 0 0 0px rgba(227,91,46,0.4)', '0 0 0 10px rgba(227,91,46,0)'] }
                : {}
            }
            transition={isReady ? { duration: 1.4, repeat: Infinity, ease: 'easeOut' } : {}}
          >
            Começar Jornada
          </motion.button>
        </div>
      </section>

      {/* Paywall sheet */}
      <AnimatePresence>
        {showPaywallSheet && (
          <motion.div
            className="cp-sheet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
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
                  <span>60% Off hoje</span>
                </div>
                <span className="cp-slots-left">9 vagas restantes</span>
                <button className="cp-sheet-close" onClick={onClosePaywall} aria-label="Fechar">
                  <X size={18} />
                </button>
              </div>

              <h3 className="cp-sheet-title">Escolha seu plano</h3>

              {/* Plano Anual */}
              <button
                className={`cp-plan-card${selectedPlan === 'annual' ? ' cp-plan-card--active' : ''}`}
                onClick={() => onSelectPlan('annual')}
              >
                <div className={`cp-plan-radio${selectedPlan === 'annual' ? ' cp-plan-radio--active' : ''}`} aria-hidden="true">
                  {selectedPlan === 'annual' && <div className="cp-plan-radio-dot" />}
                </div>
                <div className="cp-plan-info">
                  <div className="cp-plan-row">
                    <div className="cp-plan-name-group">
                      <span className="cp-plan-name">Anual</span>
                      <span className="cp-plan-popular-badge">Mais popular</span>
                    </div>
                    <div className="cp-plan-price-block">
                      <span className="cp-plan-old-price">R$149,90</span>
                      <span className="cp-plan-price">R$ 12,49</span>
                    </div>
                  </div>
                  <span className="cp-plan-period">por mês · cobrado anualmente</span>
                </div>
              </button>

              {/* Plano Vitalício */}
              <button
                className={`cp-plan-card${selectedPlan === 'lifetime' ? ' cp-plan-card--active' : ''}`}
                onClick={() => onSelectPlan('lifetime')}
              >
                <div className={`cp-plan-radio${selectedPlan === 'lifetime' ? ' cp-plan-radio--active' : ''}`} aria-hidden="true">
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
                  <span className="cp-plan-period">pague uma vez, acesso para sempre</span>
                </div>
              </button>

              <ul className="cp-sheet-includes">
                {['Acesso completo a todas as ferramentas', 'Bloqueador inteligente ativo', 'Análises e relatórios pessoais'].map((f, i) => (
                  <li key={i}>
                    <Star size={11} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="cp-sheet-guarantee">
                <Shield size={13} />
                <span>Sem compromisso · Cancele quando quiser</span>
              </div>

              <button className="button button-ember-brand cp-sheet-cta" onClick={onContinueToOnboarding}>
                Começar Jornada
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
