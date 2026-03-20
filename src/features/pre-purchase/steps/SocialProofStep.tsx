import { useRef } from 'react'
import { BadgeCheck } from 'lucide-react'
import { testimonials } from '../data'

interface SocialProofStepProps {
  onBack: () => void
  onContinue: () => void
}

export function SocialProofStep({ onBack, onContinue }: SocialProofStepProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  return (
    <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, minWidth: 0, width: '100%', padding: '0', background: 'transparent' }}>
      <div className="quiz-custom-header">
        <button onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div className="title" style={{ fontSize: '0.9rem', color: '#fff' }}>O Coruja ajuda você a parar a porn...</div>
        <div style={{ flex: 1 }}></div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', width: '100%', minWidth: 0, maxWidth: '100vw' }}>
        {/* Custom Graph */}
        <div className="social-proof-graph-container" style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
            <div style={{ color: '#fff' }}>
              <div style={{ fontWeight: '700', fontSize: '1rem', lineHeight: '1.2' }}>Porn Recovery</div>
              <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: '0' }}>×</span> relapse
              </div>
            </div>
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '1.2rem', letterSpacing: '0.05em' }}>Coruja</span>
          </div>

          <div style={{ width: '100%', position: 'relative', height: '160px' }}>
            <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}>
              <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <path d="M 0 160 C 40 165, 60 145, 80 155 S 120 175, 140 160 S 180 135, 220 155 S 260 175, 290 140 S 330 110, 350 145 S 380 160, 390 165" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              <path d="M 0 160 C 40 165, 60 145, 80 155 S 120 175, 140 160 S 180 135, 220 155 S 260 175, 290 140 S 330 110, 350 145 S 380 160, 390 165 L 390 180 L 0 180 Z" fill="url(#redGrad)" opacity="0.3" />
              <circle cx="0" cy="160" r="5" fill="#fff" />
              <circle cx="390" cy="165" r="5" fill="#ef4444" />
              <path d="M 0 140 C 60 140, 120 90, 180 85 S 280 40, 360 30" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              <circle cx="0" cy="140" r="5" fill="#fff" />
              <circle cx="360" cy="30" r="6" fill="#10b981" />
              <g transform="translate(320, 45)">
                <rect x="0" y="0" width="65" height="22" rx="11" fill="rgba(16, 185, 129, 0.15)" />
                <text x="32" y="15" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">Recovery</text>
              </g>
              <g transform="translate(280, 115)">
                <rect x="0" y="0" width="85" height="22" rx="11" fill="rgba(239, 68, 68, 0.1)" />
                <text x="42" y="15" fill="#ef4444" fontSize="11" fontWeight="600" textAnchor="middle">Conventional</text>
              </g>
              <text x="60" y="198" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">Week 1</text>
              <text x="200" y="198" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">Week 2</text>
              <text x="340" y="198" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">Week 3</text>
              <defs>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Testimonials */}
        <div className="testimonials-scroller" ref={scrollerRef} style={{ flexShrink: 0, width: '100%', minWidth: 0 }}>
          {testimonials.map((item) => (
            <div key={item.name} className="testimonial-card-horizontal">
              <div className="testimonial-card-header">
                <div className="testimonial-avatar">{item.name.charAt(0)}</div>
                <div className="testimonial-name-wrap">
                  <span className="testimonial-name">{item.name}</span>
                  <BadgeCheck size={16} fill="#10b981" color="#fff" />
                </div>
              </div>
              <h4 className="testimonial-title">{item.role}</h4>
              <p className="testimonial-quote">{item.quote}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '16px 20px 24px', background: 'transparent', width: '100%', minWidth: 0, maxWidth: '100vw', boxSizing: 'border-box' }}>
        <p style={{ color: '#fff', textAlign: 'center', fontSize: '0.90rem', lineHeight: '1.4', marginBottom: '16px' }}>
          O Coruja ajuda você a parar a pornografia 76% mais rápido do que apenas força de vontade. 📈
        </p>
        <button className="button-white-pill" onClick={onContinue}>
          Continuar
        </button>
      </div>
    </section>
  )
}
