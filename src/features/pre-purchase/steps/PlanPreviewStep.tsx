import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  Brain,
  CalendarCheck,
  CheckCircle2,
  Flame,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { MultiPhoneMockup } from '../../../shared/components/MultiPhoneMockup'
import { MindfulnessIllustration } from '../../../components/illustrations/MindfulnessIllustration'

interface PlanPreviewStepProps {
  name: string
  demoNow: Date
  onBack: () => void
  onContinue: () => void
}

function getPlanDate(now: Date) {
  const date = new Date(now)
  date.setDate(date.getDate() + 30)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
}

function getPlanDateShort(now: Date) {
  const date = new Date(now)
  date.setDate(date.getDate() + 30)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
}

const transformations = [
  {
    before: 'Compulsão silenciosa',
    after: 'Controle consciente',
    Icon: Zap,
    accent: 'amber',
  },
  {
    before: 'Vergonha acumulada',
    after: 'Orgulho genuíno',
    Icon: TrendingUp,
    accent: 'cyan',
  },
  {
    before: 'Relacionamentos vazios',
    after: 'Presença e conexão real',
    Icon: Trophy,
    accent: 'success',
  },
] as const

const appFeatures = [
  {
    title: 'Monitoramento de Progresso',
    desc: 'Acompanhe seus dias limpos e marcos de recuperação com precisão.',
    Icon: Flame,
    color: 'var(--color-accent-amber)'
  },
  {
    title: 'Análise de Gatilhos',
    desc: 'Identifique padrões emocionais e situações de risco para evitar recaídas.',
    Icon: BarChart2,
    color: 'var(--color-accent-purple)'
  },
  {
    title: 'Bloqueador Inteligente',
    desc: 'Proteção em tempo real para manter você focado no que importa.',
    Icon: ShieldCheck,
    color: 'var(--color-accent-cyan)'
  },
  {
    title: 'Diário de Jornada',
    desc: 'Registre seus pensamentos e sentimentos para fortalecer sua mentalidade.',
    Icon: BookOpen,
    color: 'var(--color-warning)'
  },
  {
    title: 'Modo SOS',
    desc: 'Ferramentas de emergência para momentos críticos de urgência.',
    Icon: Brain,
    color: 'var(--color-danger)'
  },
  {
    title: 'Metas Personalizadas',
    desc: 'Defina objetivos claros e celebre cada pequena vitória no seu ritmo.',
    Icon: Target,
    color: 'var(--color-success)'
  }
] as const


export function PlanPreviewStep({ name, demoNow, onBack, onContinue }: PlanPreviewStepProps) {
  const planDate = getPlanDate(demoNow)
  const planDateShort = getPlanDateShort(demoNow)
  const displayName = name || 'Você'
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll-triggered reveal animations
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('pp-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { root, threshold: 0.15 }
    )

    const targets = root.querySelectorAll('.pp-reveal')
    targets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="pp-page">
      <div className="quiz-custom-header">
        <button onClick={onBack} aria-label="Voltar" className="cp-back-button">
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="pp-scroll" ref={scrollRef}>

        {/* ── MOMENTO 1: HERO DRAMÁTICO ── */}
        <div className="plan-scroll-section pp-hero-moment">
          <div className="pp-hero-aura" aria-hidden="true" />

          <div className="pp-plan-ready-badge">
            <CheckCircle2 size={12} />
            <span>Plano personalizado pronto</span>
          </div>

          <h1 className="pp-hero-name">
            {displayName}
            <span className="pp-hero-name-accent">,</span>
          </h1>

          <p className="pp-hero-subtitle">você vai parar a pornografia até:</p>

          <div className="pp-hero-date-block">
            <CalendarCheck size={18} className="pp-hero-date-icon" />
            <span className="pp-hero-date-text">{planDate}</span>
          </div>

          <div className="pp-hero-rating">
            <span className="pp-hero-rating-value">4.9</span>
            <div className="pp-hero-stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={11} className="pp-hero-star-icon" aria-hidden="true" />
              ))}
            </div>
            <span className="pp-hero-rating-label">10 mil avaliações</span>
          </div>
        </div>

        <div className="plan-scroll-divider" />

        {/* ── MOMENTO 2: CARTÃO DE IDENTIDADE (hero visual) ── */}
        <div className="plan-scroll-section pp-identity-moment pp-reveal">
          <p className="pp-identity-intro">Seu cartão de progresso pessoal</p>

          <div className="pp-identity-card">
            <div className="pp-identity-card-shine" aria-hidden="true" />

            <div className="pp-identity-card-header">
              <div className="pp-identity-brand">
                <Flame size={14} />
                <span>CORUJA</span>
              </div>
              <div className="pp-identity-card-badge">
                <span>Premium</span>
              </div>
            </div>

            <div className="pp-identity-streak-block">
              <p className="pp-identity-streak-label">Sequência ativa</p>
              <div className="pp-identity-streak-row">
                <span className="pp-identity-streak-number">0</span>
                <span className="pp-identity-streak-unit">dias</span>
              </div>
            </div>

            <div className="pp-identity-card-footer">
              <div className="pp-identity-meta">
                <p className="pp-identity-meta-label">Nome</p>
                <p className="pp-identity-meta-value">{displayName}</p>
              </div>
              <div className="pp-identity-meta pp-identity-meta--right">
                <p className="pp-identity-meta-label">Meta</p>
                <p className="pp-identity-meta-value">{planDateShort}</p>
              </div>
              <div className="pp-identity-meta pp-identity-meta--right">
                <p className="pp-identity-meta-label">Livre desde</p>
                <p className="pp-identity-meta-value">hoje</p>
              </div>
            </div>
          </div>

          <p className="pp-identity-outro">
            Construído em torno de você. Cada dia registrado aqui.
          </p>
        </div>

        <div className="plan-scroll-divider" />

        {/* ── MOMENTO 3: TRANSFORMAÇÃO ── */}
        <div className="plan-scroll-section pp-transform-moment pp-reveal">
          <div className="pp-transform-header">
            <h2 className="pp-transform-title">Sua transformação</h2>
            <p className="pp-transform-sub">Em 30 dias com o plano</p>
          </div>

          <div className="pp-transform-glass-card pp-reveal">
            <div className="pp-transform-illustration">
              <MindfulnessIllustration />
            </div>

            <div className="pp-transform-list">
              {transformations.map(({ before, after, Icon, accent }, i) => (
                <div key={i} className={`pp-transform-row pp-transform-row--${accent} pp-reveal`}>
                  <div className="pp-transform-icon-shell">
                    <Icon size={15} />
                  </div>
                  <div className="pp-transform-text-cols">
                    <span className="pp-transform-before">{before}</span>
                    <span className="pp-transform-arrow" aria-hidden="true">→</span>
                    <span className="pp-transform-after">{after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pp-mockup-wrapper pp-reveal">
            <div className="pp-features-container">
              <p className="pp-features-row-label">Ferramentas incluídas</p>
              
              <div className="pp-features-grid">
                {appFeatures.map((f, i) => (
                  <div key={i} className="pp-feature-card">
                    <div className="pp-feature-icon-wrapper" style={{ backgroundColor: `color-mix(in srgb, ${f.color} 15%, transparent)`, color: f.color }}>
                      <f.Icon size={20} />
                    </div>
                    <div className="pp-feature-info">
                      <h3 className="pp-feature-title">{f.title}</h3>
                      <p className="pp-feature-desc">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pp-mockup-frame pp-reveal pp-reveal--slow">
              <MultiPhoneMockup
                leftImage="/images/mockup-analytics.png"
                rightImage="/images/mockup-blocker.png"
                centerImage="/images/mockup-home.png"
                centerScreen={null}
              />
            </div>
          </div>
        </div>

        <div className="plan-scroll-divider" />

        {/* ── MOMENTO 4: CTA ── */}
        <div className="plan-scroll-section pp-cta-section pp-reveal">
          <blockquote className="pp-testimonial">
            <p className="pp-testimonial-text">
              &quot;A pornografia estava destruindo minha capacidade de amar de verdade.
              O Foco Mode me deu estrutura quando eu mais precisava.&quot;
            </p>
            <footer className="pp-testimonial-author">— Rafael, 28 anos</footer>
          </blockquote>

          <div className="pp-cta-guarantee">
            <CheckCircle2 size={13} />
            <span>Cancele quando quiser · Sem compromisso</span>
          </div>
          <button className="button button-ember-brand pp-cta" onClick={onContinue}>
            Ativar Foco Mode
          </button>
          <p className="pp-cta-disclaimer">A compra aparece discretamente</p>
        </div>

      </div>
    </section>
  )
}
