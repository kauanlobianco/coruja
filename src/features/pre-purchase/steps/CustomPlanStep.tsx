import { CheckCircle2, Shield, X } from 'lucide-react'
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

const timelineItems = [
  { day: 'Dia 0', title: 'Prepare seu espaço', body: 'Organize seu ambiente físico, digital e social para facilitar a mudança.', emoji: '🗓️', color: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.5)' },
  { day: 'Dia 1', title: 'Vença a abstinência', body: 'Use técnicas mentais e físicas rápidas para atravessar os desejos e redefinir o foco.', emoji: '🧠', color: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.5)', highlight: 'No Dia 2, seu cérebro começa a se reiniciar. Os níveis de dopamina começam a se estabilizar. Os desejos podem surgir, mas é um sinal de que a cura começou.' },
  { day: 'Dia 3', title: 'Fortaleça seu Porquê', body: 'Transforme seu motivo para parar em motivação diária e foco.', emoji: '🎯', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.5)' },
  { day: 'Dia 4', title: 'Elimine os Sintomas', body: 'Lide com baixa energia, problemas de sono ou irritabilidade com resets simples.', emoji: '🔧', color: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.5)', highlight: 'Seu foco começa a voltar. A névoa levanta e a motivação retorna lentamente. Melhor sono, energia e clareza estão ao virar da esquina.' },
  { day: 'Dia 5', title: 'Sinta-se Melhor no Corpo', body: 'Mova-se, coma limpo e recarregue — sua energia e clareza retornam rápido.', emoji: '💪', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.5)' },
  { day: 'Dia 6', title: 'Você Não Está Sozinho', body: 'Conecte-se com outros no mesmo caminho. Compartilhe vitórias, receba apoio.', emoji: '🌐', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.5)' },
  { day: 'Dia 7', title: 'Retome o Seu Tempo', body: 'Substitua velhos hábitos por metas reais e ação significativa.', emoji: '⏱️', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.5)' },
  { day: 'Fim da Semana 1', title: 'Estatísticas e Momentum', body: 'Seus impulsos ainda existem, mas são mais fáceis de controlar. Energia, confiança e motivação real estão chegando.', emoji: '📈', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.5)' },
] as const

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
      <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <div className="quiz-custom-header">
          <button onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <div style={{ flex: 1 }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 16px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(168,85,247,0.2)', borderRadius: '8px', padding: '6px 10px' }}>
                <span style={{ color: '#a855f7', fontWeight: '700', fontSize: '0.75rem' }}>✓ Sem compromisso, cancele quando quiser</span>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Coruja</p>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '900', lineHeight: '1.2', marginBottom: '8px' }}>Não é sobre força de vontade.</h2>
            <p style={{ color: '#a855f7', fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>É sobre um sistema que realmente funciona</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '20px' }}>O Coruja te guia por um reinício de 30 dias, fornecendo estrutura e ferramentas que apoiam seu crescimento mesmo além desse período.</p>
            <p style={{ color: '#fff', fontWeight: '700', marginBottom: '16px', fontSize: '0.9rem' }}>Veja como são seus primeiros 7 dias:</p>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: '16px' }}>
            <div style={{ position: 'absolute', left: '28px', top: '24px', bottom: '24px', width: '2px', background: 'linear-gradient(180deg, #a855f7, #6366f1, #3b82f6)', opacity: 0.4 }} />
            {timelineItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', position: 'relative' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: item.color, border: `2px solid ${item.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, fontSize: '0.8rem' }}>
                  {item.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  {'highlight' in item && item.highlight && (
                    <div style={{ background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', lineHeight: '1.5' }}>
                      {item.highlight}
                    </div>
                  )}
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${item.border}`, borderRadius: '12px', padding: '14px', boxShadow: `0 0 15px ${item.border}30` }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', marginBottom: '4px', fontWeight: '600' }}>{item.day}</p>
                    <p style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem', marginBottom: '6px' }}>{item.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: '1.5' }}>{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flexShrink: 0, padding: '16px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
            <CheckCircle2 size={14} color="#10b981" />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Sem compromisso, cancele quando quiser</span>
          </div>
          <button
            style={{ width: '100%', padding: '16px', borderRadius: '60px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,0.5)' }}
            onClick={onOpenPaywall}
          >
            COMEÇAR MINHA JORNADA HOJE 🙌
          </button>
        </div>
      </section>

      {/* Paywall bottom sheet */}
      {showPaywallSheet && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          onClick={onClosePaywall}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
          <div
            style={{ position: 'relative', background: 'linear-gradient(180deg, #13102a 0%, #0d0b1f 100%)', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', boxShadow: '0 -20px 60px rgba(0,0,0,0.8)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)', margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(245,158,11,0.2)', borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>⚡</span>
                  <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '0.72rem' }}>60% Off Sale</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>9 vagas restantes</span>
              </div>
              <button onClick={onClosePaywall} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
                <X size={20} />
              </button>
            </div>

            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', textAlign: 'center' }}>Escolha Seu Plano</h3>

            {/* Annual */}
            <button
              style={{ width: '100%', background: selectedPlan === 'annual' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', border: selectedPlan === 'annual' ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', marginBottom: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
              onClick={() => onSelectPlan('annual')}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selectedPlan === 'annual' ? '#6366f1' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selectedPlan === 'annual' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem' }}>Anual</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textDecoration: 'line-through' }}>R$149,90</div>
                    <div style={{ color: '#fff', fontWeight: '800', fontSize: '0.95rem' }}>R$ 12,49</div>
                  </div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>por mês</span>
              </div>
            </button>

            {/* Lifetime */}
            <button
              style={{ width: '100%', background: selectedPlan === 'lifetime' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', border: selectedPlan === 'lifetime' ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', marginBottom: '20px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
              onClick={() => onSelectPlan('lifetime')}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selectedPlan === 'lifetime' ? '#6366f1' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selectedPlan === 'lifetime' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem' }}>Vitalício</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textDecoration: 'line-through' }}>R$449,90</div>
                    <div style={{ color: '#fff', fontWeight: '800', fontSize: '0.95rem' }}>R$ 299,90</div>
                  </div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>pague uma vez</span>
              </div>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
              <Shield size={14} color="rgba(255,255,255,0.4)" />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Sem compromisso, cancele quando quiser</span>
            </div>

            <button
              style={{ width: '100%', padding: '16px', borderRadius: '60px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,0.5)' }}
              onClick={onContinueToOnboarding}
            >
              Começar minha jornada
            </button>
          </div>
        </div>
      )}
    </>
  )
}
