import {
  Activity,
  ArrowLeft,
  BarChart2,
  BookOpen,
  Brain,
  CheckCircle2,
  Flame,
  Shield,
  Star,
  Target,
  Trophy,
} from 'lucide-react'

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

const selfMasteryBenefits = [
  { text: 'Construa um autocontrole inabalável', accent: 'cyan' },
  { text: 'Torne-se mais atraente e confiante', accent: 'amber' },
  { text: 'Experimente intimidade real e conexão', accent: 'success' },
  { text: 'Preencha cada dia com orgulho e felicidade', accent: 'cyan' },
] as const

const relationshipBenefits = [
  { text: 'Fortaleça sua inteligência emocional', accent: 'purple' },
  { text: 'Seja mais confiável e responsável', accent: 'cyan' },
  { text: 'Experimente intimidade real e conexão', accent: 'success' },
  { text: 'Torne-se a pessoa que eles merecem', accent: 'amber' },
] as const

const features = [
  { Icon: BarChart2, label: 'Dashboard', accent: 'purple' },
  { Icon: Shield, label: 'Bloqueador', accent: 'cyan' },
  { Icon: Activity, label: 'Check-in', accent: 'success' },
  { Icon: BookOpen, label: 'Jornal', accent: 'amber' },
  { Icon: Target, label: 'Metas', accent: 'danger' },
  { Icon: Brain, label: 'SOS', accent: 'purple' },
] as const

export function PlanPreviewStep({ name, demoNow, onBack, onContinue }: PlanPreviewStepProps) {
  const planDate = getPlanDate(demoNow)

  return (
    <section className="pp-page">
      <div className="quiz-custom-header">
        <button onClick={onBack} aria-label="Voltar" className="cp-back-button">
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="pp-scroll">

        {/* ── Section 1: Hero ── */}
        <div className="plan-scroll-section pp-section">
          <div className="pp-created-badge">
            <CheckCircle2 size={13} />
            <span>Plano criado</span>
          </div>

          <h1 className="pp-headline">
            {name
              ? `${name}, criamos um plano personalizado para você.`
              : 'Criamos um plano personalizado para você.'}
          </h1>

          <p className="pp-body-muted">Você vai parar a pornografia até:</p>

          <div className="pp-plan-date-chip">
            <span>{planDate}</span>
          </div>

          <div className="pp-rating-row">
            <span className="pp-rating-value">4.9</span>
            <div className="pp-stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={11} className="pp-star-icon" aria-hidden="true" />
              ))}
            </div>
            <span className="pp-stars-label">10 mil avaliações</span>
          </div>

          <p className="pp-tagline">Torne-se a melhor versão de si mesmo com Coruja</p>
          <p className="pp-tagline-sub">Mais forte. Mais saudável. Mais feliz.</p>
        </div>

        <div className="plan-scroll-divider" />

        {/* ── Section 2: Domine a si mesmo ── */}
        <div className="plan-scroll-section pp-section">
          <div className="pp-section-header">
            <div className="pp-section-icon pp-section-icon--ember">
              <Trophy size={20} />
            </div>
            <h2 className="pp-section-title">Domine a si mesmo</h2>
          </div>
          {selfMasteryBenefits.map((item, i) => (
            <div key={i} className={`pp-benefit-row pp-benefit-row--${item.accent}`}>
              <div className="pp-benefit-icon-shell">
                <CheckCircle2 size={13} />
              </div>
              <span className="pp-benefit-text">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="plan-scroll-divider" />

        {/* ── Section 3: Profile card ── */}
        <div className="plan-scroll-section pp-section">
          <p className="pp-card-intro">
            Bem-vindo ao Coruja. Este é o cartão do seu perfil para acompanhar o progresso.
          </p>
          <div className="pp-profile-card">
            <div className="pp-profile-card-top">
              <div className="pp-profile-brand">CORUJA</div>
              <div className="pp-profile-streak-icon">
                <Flame size={15} />
              </div>
            </div>
            <p className="pp-profile-streak-label">Sequência ativa</p>
            <p className="pp-profile-streak-value">0 dias</p>
            <div className="pp-profile-footer">
              <div>
                <p className="pp-profile-meta-label">Nome</p>
                <p className="pp-profile-meta-value">{name || 'Usuário'}</p>
              </div>
              <div className="pp-profile-footer-right">
                <p className="pp-profile-meta-label">Livre desde</p>
                <p className="pp-profile-meta-value">hoje</p>
              </div>
            </div>
          </div>
          <p className="pp-card-outro">Agora, vamos construir o aplicativo em torno de você.</p>
        </div>

        <div className="plan-scroll-divider" />

        {/* ── Section 4: Tudo em um lugar ── */}
        <div className="plan-scroll-section pp-section">
          <h2 className="pp-section-title pp-section-title--spaced">Tudo em um só lugar</h2>
          <div className="pp-features-grid">
            {features.map(({ Icon, label, accent }, i) => (
              <div key={i} className={`pp-feature-card pp-feature-card--${accent}`}>
                <div className="pp-feature-icon-shell">
                  <Icon size={17} />
                </div>
                <span className="pp-feature-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="plan-scroll-divider" />

        {/* ── Section 5: Relacionamentos reais ── */}
        <div className="plan-scroll-section pp-section">
          <h2 className="pp-section-title pp-section-title--spaced">Construa relacionamentos reais</h2>
          {relationshipBenefits.map((item, i) => (
            <div key={i} className={`pp-benefit-row pp-benefit-row--${item.accent}`}>
              <div className="pp-benefit-icon-shell">
                <CheckCircle2 size={13} />
              </div>
              <span className="pp-benefit-text">{item.text}</span>
            </div>
          ))}
          <blockquote className="pp-quote">
            &quot;A pornografia estava prejudicando minha capacidade de amar e de me relacionar.
            Ainda bem que consegui virar o jogo a tempo.&quot;
          </blockquote>
        </div>

        {/* ── Section 6: CTA ── */}
        <div className="plan-scroll-section pp-section pp-cta-section">
          <div className="pp-cta-guarantee">
            <CheckCircle2 size={13} />
            <span>Cancele quando quiser · Sem compromisso</span>
          </div>
          <button className="button button-ember-brand pp-cta" onClick={onContinue}>
            Torne-se um Coruja
          </button>
          <p className="pp-cta-disclaimer">A compra aparece discretamente</p>
        </div>

      </div>
    </section>
  )
}
