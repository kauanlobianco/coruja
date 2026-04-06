import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  Brain,
  ChevronDown,
  Flame,
  LockOpen,
  ShieldCheck,
  Target,
  Trophy,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { MultiPhoneMockup } from '../../../shared/components/MultiPhoneMockup'
import { MindfulnessIllustration } from '../../../components/illustrations/MindfulnessIllustration'
import { getTransformations } from '../data'
import type { Transformation } from '../data'

const ICON_MAP: Record<Transformation['iconName'], React.ComponentType<{ size?: number }>> = {
  Zap, TrendingUp, Trophy, Target, Brain, ShieldCheck, Flame,
}

interface PlanPreviewStepProps {
  symptoms: string[]
  onBack: () => void
  onContinue: () => void
}

const appFeatures = [
  { title: 'Monitoramento de Progresso', desc: 'Acompanhe seus dias limpos e marcos de recuperação com precisão.',           Icon: Flame,      accent: 'amber'  },
  { title: 'Análise de Gatilhos',        desc: 'Identifique padrões emocionais e situações de risco para evitar recaídas.', Icon: BarChart2,  accent: 'purple' },
  { title: 'Bloqueador Inteligente',     desc: 'Proteção em tempo real para manter você focado no que importa.',            Icon: ShieldCheck, accent: 'cyan'   },
  { title: 'Diário de Jornada',          desc: 'Registre seus pensamentos e sentimentos para fortalecer sua mentalidade.',  Icon: BookOpen,   accent: 'warning'},
  { title: 'Modo SOS',                   desc: 'Ferramentas de emergência para momentos críticos de urgência.',             Icon: Brain,      accent: 'danger' },
  { title: 'Metas Personalizadas',       desc: 'Defina objetivos claros e celebre cada pequena vitória no seu ritmo.',      Icon: Target,     accent: 'success'},
] as const

const feedbacks = [
  {
    quote: 'Depois de 3 semanas sem pornô, minha energia voltou. Consigo focar no trabalho de um jeito que não sentia há anos.',
    author: 'Rafael, 28 anos',
  },
  {
    quote: 'Minha namorada notou a diferença antes de mim. Fiquei mais presente, mais atento, mais eu mesmo.',
    author: 'Lucas, 24 anos',
  },
  {
    quote: 'Tentei parar sozinho várias vezes e falhei. Com o acompanhamento diário do app, chegando ao dia 60 agora.',
    author: 'Mateus, 31 anos',
  },
  {
    quote: 'O modo SOS salvou muitas noites difíceis. Ter algo concreto para fazer quando a vontade bate faz toda a diferença.',
    author: 'Gabriel, 22 anos',
  },
  {
    quote: 'Não esperava que parar fosse mudar minha autoconfiança assim. Me sinto mais homem, mais inteiro.',
    author: 'Thiago, 27 anos',
  },
  {
    quote: 'O diário me ajudou a entender meus gatilhos. Estresse no trabalho era o principal. Agora sei reconhecer e agir.',
    author: 'André, 35 anos',
  },
] as const

export function PlanPreviewStep({ symptoms, onBack, onContinue }: PlanPreviewStepProps) {
  const transformations = getTransformations(symptoms)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null)

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
      <div className="pp-scroll" ref={scrollRef}>

        {/* ── HERO ── */}
        <div className="pp-hero-banner">
          <div className="pp-hero-banner-aura" aria-hidden="true" />
          <button type="button" onClick={onBack} aria-label="Voltar" className="cp-back-button pp-hero-banner-back">
            <ArrowLeft size={18} />
          </button>
          <div className="pp-hero-banner-text">
            <h1 className="pp-hero-banner-title">Sua<br />Transformação</h1>
            <p className="pp-hero-banner-sub">Em 90 dias com o plano</p>
          </div>
          <div className="pp-hero-banner-illustration">
            <MindfulnessIllustration />
          </div>
        </div>

        {/* ── MOMENTO 3: TRANSFORMAÇÃO ── */}
        <div className="plan-scroll-section pp-transform-moment pp-reveal">
          <div className="pp-transform-list">
            {transformations.map(({ before, after, iconName, accent }, i) => {
              const Icon = ICON_MAP[iconName]
              return (
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
              )
            })}
          </div>

          <div className="pp-mockup-wrapper pp-reveal">
            <p className="pp-features-row-label">Ferramentas incluídas</p>

            <div className="pp-mockup-frame pp-reveal pp-reveal--slow">
              <MultiPhoneMockup
                leftImage="/images/mockup-analytics.png"
                rightImage="/images/mockup-blocker.png"
                centerImage="/images/mockup-home.png"
                centerScreen={null}
              />
            </div>

            <div className="pp-features-container">

              <div className="pp-features-grid">
                {appFeatures.map((f, i) => {
                  const isOpen = expandedFeature === i
                  return (
                    <div
                      key={i}
                      className={`pp-feature-card${isOpen ? ' pp-feature-card--open' : ''}`}
                      onClick={() => setExpandedFeature(isOpen ? null : i)}
                    >
                      <div className="pp-feature-card-row">
                        <div className={`pp-feature-icon-wrapper pp-feature-icon-wrapper--${f.accent}`}>
                          <f.Icon size={18} />
                        </div>
                        <h3 className="pp-feature-title">{f.title}</h3>
                        <ChevronDown size={14} className="pp-feature-chevron" />
                      </div>
                      {isOpen && (
                        <p className="pp-feature-desc">{f.desc}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="plan-scroll-divider" />

        {/* ── MOMENTO 4: CTA ── */}
        <div className="plan-scroll-section pp-cta-section pp-reveal">
          <p className="pp-section-label">O que dizem nossos usuários</p>

          <div className="pp-testimonials-wrapper">
            <div className="pp-testimonials-track">
              {[...feedbacks, ...feedbacks].map((t, i) => (
                <div key={i} className="pp-testimonial-card">
                  <p className="pp-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="pp-testimonial-author">— {t.author}</footer>
                </div>
              ))}
            </div>
          </div>

          <button type="button" className="button button-ember-brand pp-cta" onClick={onContinue}>
            <LockOpen size={16} />
            Desbloquear Plano Personalizado
          </button>
        </div>

      </div>
    </section>
  )
}
