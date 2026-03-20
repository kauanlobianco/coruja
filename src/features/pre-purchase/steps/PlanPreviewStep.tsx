import { CheckCircle2, Star, Activity, BarChart2, Shield, BookOpen, Target, Brain, Trophy } from 'lucide-react'

function getPlanDate() {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
}

interface PlanPreviewStepProps {
  name: string
  onBack: () => void
  onContinue: () => void
}

export function PlanPreviewStep({ name, onBack, onContinue }: PlanPreviewStepProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div className="quiz-custom-header" style={{ flexShrink: 0 }}>
        <button onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div style={{ flex: 1 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 2px 8px' }}>

        {/* Section 1: Personalised plan header */}
        <div className="plan-scroll-section" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: '600' }}>Plano criado</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.65rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
            {name ? `${name}, criamos um plano personalizado para você.` : 'Criamos um plano personalizado para você.'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: '16px' }}>Você vai parar a pornografia até:</p>
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px 18px', marginBottom: '20px', display: 'inline-block' }}>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '1rem' }}>{getPlanDate()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '16px' }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginLeft: '4px' }}>4.9 · 10 mil avaliações</span>
          </div>
          <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700' }}>Torne-se a melhor versão de si mesmo com Coruja</p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', marginTop: '4px' }}>Mais forte. Mais saudável. Mais feliz.</p>
        </div>

        <div className="plan-scroll-divider" />

        {/* Section 2: Domine a si mesmo */}
        <div className="plan-scroll-section" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Trophy size={26} color="#fff" />
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '800' }}>Domine a si mesmo</h2>
          </div>
          {[
            { icon: <CheckCircle2 size={16} color="#10b981" />, text: 'Construa um autocontrole inabalável' },
            { icon: <CheckCircle2 size={16} color="#a855f7" />, text: 'Torne-se mais atraente e confiante' },
            { icon: <CheckCircle2 size={16} color="#f59e0b" />, text: 'Experimente intimidade real e conexão' },
            { icon: <CheckCircle2 size={16} color="#10b981" />, text: 'Preencha cada dia com orgulho e felicidade' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px' }}>
              {item.icon}
              <span style={{ color: '#fff', fontSize: '0.9rem' }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="plan-scroll-divider" />

        {/* Section 3: Profile card */}
        <div className="plan-scroll-section" style={{ marginBottom: '28px' }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', textAlign: 'center', marginBottom: '14px' }}>Bem-vindo ao Coruja. Este é o cartão do seu perfil para acompanhar o progresso.</p>
          <div style={{ background: 'linear-gradient(135deg, #f97316, #9333ea, #2563eb)', borderRadius: '18px', padding: '20px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '5px 10px' }}>
                <span style={{ color: '#fff', fontWeight: '800', fontSize: '0.8rem' }}>CORUJA</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', opacity: 0.8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', marginBottom: '2px' }}>Sequência ativa</p>
            <p style={{ color: '#fff', fontSize: '2.2rem', fontWeight: '900', marginBottom: '16px' }}>0 days</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.67rem' }}>Nome</p>
                <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.82rem' }}>{name || 'Usuário'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.67rem' }}>Livre desde</p>
                <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.82rem' }}>11/25</p>
              </div>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textAlign: 'center', marginTop: '14px' }}>Agora, vamos construir o aplicativo em torno de você.</p>
        </div>

        <div className="plan-scroll-divider" />

        {/* Section 4: All in one place */}
        <div className="plan-scroll-section" style={{ marginBottom: '28px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>Tudo em um só lugar</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { icon: <BarChart2 size={20} color="#a855f7" />, label: 'Dashboard', color: 'rgba(168,85,247,0.15)' },
              { icon: <Shield size={20} color="#3b82f6" />, label: 'Bloqueador', color: 'rgba(59,130,246,0.15)' },
              { icon: <Activity size={20} color="#10b981" />, label: 'Check-in', color: 'rgba(16,185,129,0.15)' },
              { icon: <BookOpen size={20} color="#f59e0b" />, label: 'Jornal', color: 'rgba(245,158,11,0.15)' },
              { icon: <Target size={20} color="#ef4444" />, label: 'Metas', color: 'rgba(239,68,68,0.15)' },
              { icon: <Brain size={20} color="#8b5cf6" />, label: 'SOS', color: 'rgba(139,92,246,0.15)' },
            ].map((item, i) => (
              <div key={i} style={{ background: item.color, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {item.icon}
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.82rem' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="plan-scroll-divider" />

        {/* Section 5: Relacionamentos reais */}
        <div className="plan-scroll-section" style={{ marginBottom: '28px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>Construa relacionamentos reais</h2>
          {[
            { icon: <CheckCircle2 size={16} color="#a855f7" />, text: 'Fortaleça sua inteligência emocional' },
            { icon: <CheckCircle2 size={16} color="#3b82f6" />, text: 'Seja mais confiável e responsável' },
            { icon: <CheckCircle2 size={16} color="#10b981" />, text: 'Experimente intimidade real e conexão' },
            { icon: <CheckCircle2 size={16} color="#f59e0b" />, text: 'Torne-se a pessoa que eles merecem' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px' }}>
              {item.icon}
              <span style={{ color: '#fff', fontSize: '0.9rem' }}>{item.text}</span>
            </div>
          ))}
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', textAlign: 'center', marginTop: '10px', fontStyle: 'italic', padding: '0 8px' }}>
            &quot;A pornografia estava prejudicando minha capacidade de amar e de me relacionar. Ainda bem que consegui virar o jogo a tempo.&quot;
          </p>
        </div>

        {/* Section 6: CTA */}
        <div className="plan-scroll-section" style={{ paddingBottom: '8px' }}>
          <button className="button-white-pill" onClick={onContinue}>Torne-se um Coruja</button>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', marginTop: '10px' }}>A compra aparece discretamente · Cancele quando quiser</p>
        </div>

      </div>
    </section>
  )
}
