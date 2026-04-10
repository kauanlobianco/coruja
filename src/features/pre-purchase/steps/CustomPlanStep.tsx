import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  CalendarCheck,
  Flame,
  Lock,
  Shield,
  ShieldCheck,
  Star,
  TrendingUp,
  Trophy,
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

type Accent = 'cyan' | 'purple' | 'success' | 'amber' | 'danger' | 'ember'

interface Highlight {
  type: 'badge' | 'stat'
  label: string
  value?: string
  Icon?: React.ComponentType<{ size?: number }>
}

interface DayItem {
  day: string
  tool: string
  Icon: React.ComponentType<{ size?: number }>
  accent: Accent
  headline: string
  body: string
  highlight?: Highlight
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
    highlight: { type: 'badge', label: 'Reflexão Ativa Desbloqueada', Icon: BookOpen },
  },
  {
    day: 'Dia 3',
    tool: 'Sequência',
    Icon: Flame,
    accent: 'ember',
    headline: '3 dias. Primeira vitória real.',
    body: 'Sua dopamina começa a se recalibrar. O hábito está sendo reescrito agora.',
    highlight: { type: 'stat', label: 'Dias limpos', value: '3' },
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
    highlight: { type: 'stat', label: 'Resiliência média', value: '84%' },
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
    highlight: { type: 'badge', label: 'Padrão Emocional Identificado', Icon: TrendingUp },
  },
]

const lockedDays: DayItem[] = [
  {
    day: 'Dia 14',
    tool: 'Analytics',
    Icon: TrendingUp,
    accent: 'purple',
    headline: '2 semanas de clareza',
    body: 'Os impulsos existem, mas agora você os vê chegando. Isso muda tudo.',
    highlight: { type: 'stat', label: 'Clareza emocional', value: '91%' },
  },
  {
    day: 'Dia 15',
    tool: 'Marco',
    Icon: Trophy,
    accent: 'success',
    headline: 'Você atravessou a zona crítica',
    body: 'A maioria desiste antes daqui. Você não é a maioria.',
  },
  {
    day: 'Dias 16–21',
    tool: 'Evolução',
    Icon: TrendingUp,
    accent: 'cyan',
    headline: 'Nova fase desbloqueada',
    body: '••••••••••• ••••• ••••••• ••••••',
  },
  {
    day: 'Dias 22–28',
    tool: 'Mentalidade',
    Icon: Flame,
    accent: 'ember',
    headline: 'Mentalidade em transformação',
    body: '•••• •••••••••• ••••• ••• ••••••',
  },
]

const accentVars: Record<Accent, string> = {
  cyan: 'var(--color-accent-cyan)',
  amber: 'var(--color-accent-amber)',
  ember: '#e35b2e',
  danger: '#dc3545',
  purple: '#8a64dc',
  success: 'var(--color-success)',
}

function TimelineCard({ item, locked = false, opacity = 1 }: { item: DayItem; locked?: boolean; opacity?: number }) {
  const color = accentVars[item.accent]
  return (
    <div className="cp-tl-item" style={{ opacity }}>
      <div className="cp-tl-left">
        <div className="cp-tl-dot" style={{ '--dot-color': color } as React.CSSProperties}>
          {locked ? <Lock size={10} /> : <item.Icon size={12} />}
        </div>
        <div className="cp-tl-line-seg" aria-hidden="true" />
      </div>
      <div className="cp-tl-right">
        <div className="cp-tl-label">
          <span className="cp-tl-day" style={{ color: locked ? undefined : color }}>{item.day}</span>
          <span className="cp-tl-sep" aria-hidden="true">•</span>
          <span className="cp-tl-tool">{item.tool}</span>
        </div>
        <div className={`cp-tl-card${locked ? ' cp-tl-card--locked' : ''}`}>
          <h3 className="cp-tl-headline">{item.headline}</h3>
          <p className="cp-tl-body">{item.body}</p>
          {item.highlight && !locked && (
            <div
              className={`cp-tl-highlight cp-tl-highlight--${item.highlight.type}`}
              style={{ '--hl-color': color } as React.CSSProperties}
            >
              {item.highlight.type === 'badge' && item.highlight.Icon && (
                <item.highlight.Icon size={11} />
              )}
              <span className="cp-tl-highlight-label">{item.highlight.label}</span>
              {item.highlight.value && (
                <span className="cp-tl-highlight-value">{item.highlight.value}</span>
              )}
            </div>
          )}
          {locked && (
            <div className="cp-tl-lock-row">
              <Lock size={11} />
              <span>Desbloqueado com o plano</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
        <div className="cp-tl-hero">
          <div className="cp-tl-hero-headline-row">
            <button onClick={onBack} aria-label="Voltar" className="cp-back-button cp-tl-back-button">
              <ArrowLeft size={15} />
            </button>
            <h2 className="cp-tl-hero-title">Sua Jornada</h2>
          </div>
          <p className="cp-tl-hero-sub">Cada ferramenta, no momento certo.</p>
        </div>

        {/* Timeline */}
        <div className="cp-tl-scroll">
          <div className="cp-tl-list">
            {visibleDays.map((item, i) => (
              <TimelineCard key={i} item={item} />
            ))}
            {lockedDays.map((item, i) => (
              <TimelineCard
                key={`locked-${i}`}
                item={item}
                locked
                opacity={Math.max(0.32 - i * 0.07, 0.06)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="cp-footer">
          <div className="cp-footer-guarantee">
            <Shield size={13} />
            <span>Cancele quando quiser · Sem compromisso</span>
          </div>
          <button type="button" className="button button-ember-brand cp-cta" onClick={onOpenPaywall}>
            Começar Jornada
          </button>
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
