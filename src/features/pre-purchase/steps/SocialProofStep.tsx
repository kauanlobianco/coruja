import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'
import { testimonials } from '../data'

interface SocialProofStepProps {
  onBack: () => void
  onContinue: () => void
}

const sectionTransition = {
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1] as const,
}

// Laranja: variações acentuadas com picos para cima mas sempre caindo de volta
const BAD_LINE =
  'M 20 148 C 40 148, 52 118, 72 116 C 92 114, 104 158, 124 164 C 144 168, 156 140, 176 144 C 196 148, 208 164, 230 162 C 252 160, 266 126, 284 130 C 302 134, 318 164, 342 165 C 356 166, 368 160, 380 160'
const BAD_FILL =
  'M 20 148 C 40 148, 52 118, 72 116 C 92 114, 104 158, 124 164 C 144 168, 156 140, 176 144 C 196 148, 208 164, 230 162 C 252 160, 266 126, 284 130 C 302 134, 318 164, 342 165 C 356 166, 368 160, 380 160 L 380 176 L 20 176 Z'

// Ciano: crescimento constante e suave, sem subir tanto
const GOOD_LINE =
  'M 20 148 C 46 146, 70 136, 94 126 C 118 116, 140 109, 164 102 C 188 95, 210 89, 234 84 C 258 79, 280 75, 304 71 C 326 68, 350 66, 380 64'
const GOOD_FILL =
  'M 20 148 C 46 146, 70 136, 94 126 C 118 116, 140 109, 164 102 C 188 95, 210 89, 234 84 C 258 79, 280 75, 304 71 C 326 68, 350 66, 380 64 L 380 176 L 20 176 Z'

const ORANGE_DURATION = 2.8

type GraphPhase = 'drawing' | 'blurred' | 'activating' | 'done'

export function SocialProofStep({ onBack, onContinue }: SocialProofStepProps) {
  const [phase, setPhase] = useState<GraphPhase>('drawing')

  const handleOrangeDone = () => {
    setPhase(p => (p === 'drawing' ? 'blurred' : p))
  }

  const handleActivate = () => {
    if (phase !== 'blurred') return
    setPhase('activating')
  }

  // Apos a animacao do toggle, transicionar para done
  useEffect(() => {
    if (phase !== 'activating') return
    const t = setTimeout(() => setPhase('done'), 820)
    return () => clearTimeout(t)
  }, [phase])

  const isToggleOn = phase === 'activating' || phase === 'done'
  const overlayVisible = phase === 'blurred' || phase === 'activating'

  return (
    <section className="social-proof-screen">
      <div className="quiz-custom-header">
        <button onClick={onBack} aria-label="Voltar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="title social-proof-header-title">Resultados reais</div>
        <div style={{ flex: 1 }} />
      </div>

      <div className="social-proof-scroll">
        <motion.div
          className="social-proof-intro"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={sectionTransition}
        >
          <h2 className="social-proof-title">
            Seu resultado acelera quando o <span className="social-proof-title-accent">método certo</span> entra no jogo.
          </h2>
        </motion.div>

        <motion.div
          className={`social-proof-graph-container ${phase === 'done' ? 'is-foco-active' : 'is-foco-inactive'}`}
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...sectionTransition, delay: 0.08 }}
        >
          {/* Header: visivel apenas em done */}

          <AnimatePresence>
            {phase === 'done' && (
              <motion.div
                className="social-proof-graph-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <strong className="social-proof-graph-title">Progresso mensal</strong>
                <p className="social-proof-insight-text">
                  Com o <strong>Foco Mode</strong> você alcança seu objetivo com consistência, evitando recaídas.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage */}
          <div className={`social-proof-graph-stage ${phase === 'blurred' ? 'is-blurred' : ''}`}>
            <svg
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
              className="social-proof-graph-svg"
              aria-label="Gráfico comparativo de recuperação"
            >
              <line x1="18" y1="176" x2="382" y2="176" stroke="rgba(255,255,255,0.11)" strokeWidth="1.2" />
              <line x1="18" y1="128" x2="382" y2="128" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 8" />
              <line x1="18" y1="80"  x2="382" y2="80"  stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 8" />

              {/* Linha laranja — sempre presente, anima so em drawing */}
              <motion.path
                d={BAD_LINE}
                fill="none"
                stroke="url(#spEmberStroke)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: ORANGE_DURATION, ease: 'linear' }}
                onAnimationComplete={handleOrangeDone}
              />

              {/* Fill laranja: aparece quando nao esta em drawing */}
              <motion.path
                d={BAD_FILL}
                fill="url(#spEmberGrad)"
                animate={{ opacity: phase !== 'drawing' ? 0.09 : 0 }}
                transition={{ duration: 0.7 }}
              />

              {/* Bolinha fim laranja */}
              <AnimatePresence>
                {phase !== 'drawing' && (
                  <motion.ellipse
                    cx="380" cy="160" rx="5.8" ry="4.9" fill="#d77432"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                  />
                )}
              </AnimatePresence>

              {/* Linha ciano: so em done */}
              <AnimatePresence>
                {phase === 'done' && (
                  <motion.g
                    key="cyan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                  >
                    <motion.path
                      d={GOOD_LINE}
                      fill="none"
                      stroke="url(#spCyanStroke)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2.8, ease: 'easeInOut', delay: 0.2 }}
                    />
                    <motion.path
                      d={GOOD_FILL}
                      fill="url(#spCyanGrad)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.07 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    />
                    {/* Bolinha fim ciano — aparece quando a linha termina */}
                    <motion.ellipse
                      cx="380" cy="64" rx="6.8" ry="5.7" fill="#58d0e4"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 3.0 }}
                    />
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Bolinha inicio — renderizada por cima de tudo */}
              <motion.ellipse
                cx="20" cy="148" rx="5.2" ry="4.4" fill="#fff"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, delay: 0.1 }}
              />

              <text x="84"  y="194" fill="rgba(255,255,255,0.32)" fontSize="11" textAnchor="middle">Mês 1</text>
              <text x="202" y="194" fill="rgba(255,255,255,0.32)" fontSize="11" textAnchor="middle">Mês 2</text>
              <text x="320" y="194" fill="rgba(255,255,255,0.32)" fontSize="11" textAnchor="middle">Mês 3</text>

              <defs>
                <linearGradient id="spEmberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d77432" stopOpacity="0.78" />
                  <stop offset="100%" stopColor="#d77432" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="spEmberStroke" x1="20" y1="100" x2="380" y2="170" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#e79244" />
                  <stop offset="100%" stopColor="#d77432" />
                </linearGradient>
                <linearGradient id="spCyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#58d0e4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#58d0e4" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="spCyanStroke" x1="20" y1="140" x2="372" y2="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#63d8eb" />
                  <stop offset="100%" stopColor="#58d0e4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Overlay: visivel em blurred e activating */}
            <AnimatePresence>
              {overlayVisible && (
                <motion.div
                  className="social-proof-activate-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  onClick={handleActivate}
                  role="button"
                  aria-label="Ativar Foco Mode"
                  style={{ cursor: phase === 'activating' ? 'default' : 'pointer' }}
                >
                  {/* Logo com toggle animado */}
                  <div className="sp-activate-logo">
                    <div className="foco-brand-top">FOCO</div>
                    <div className="sp-logo-bottom">
                      <span>M</span>

                      {/* Toggle container — anima de laranja para ciano */}
                      <motion.div
                        className="sp-toggle-track"
                        animate={isToggleOn ? {
                          background: 'linear-gradient(135deg, #2BB5C4 0%, #1ECFC4 100%)',
                          boxShadow: '0 4px 18px rgba(43,181,196,0.65), 0 0 32px rgba(43,181,196,0.38)',
                        } : {
                          background: 'linear-gradient(135deg, #ec9731 0%, #e35b2e 100%)',
                          boxShadow: '0 4px 16px rgba(227,91,46,0.55), 0 0 28px rgba(227,91,46,0.3)',
                        }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                      >
                        {/* Knob desliza da esquerda para a direita */}
                        <motion.div
                          className="sp-toggle-knob"
                          animate={{ x: isToggleOn ? '0.82em' : '0em' }}
                          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </motion.div>

                      <span>E</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {phase === 'blurred' && (
                      <motion.p
                        className="sp-activate-label"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                      >
                        Toque para ativar
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Legenda */}
          <motion.div
            className="social-proof-graph-legend"
            aria-hidden="true"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sectionTransition, delay: 0.26 }}
          >
            <span className="social-proof-legend-pill is-foco-off">Sem Foco Mode</span>
            <AnimatePresence>
              {phase === 'done' && (
                <motion.span
                  className="social-proof-legend-pill is-foco-on"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.38, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  Com Foco Mode
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

        </motion.div>

        <motion.div
          className="social-proof-feedback-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sectionTransition, delay: 0.22 }}
        >
          <div className="social-proof-feedback-head">
            <p className="social-proof-eyebrow">Referências</p>
          </div>
          <div className="testimonials-scroller social-proof-testimonials">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                className="testimonial-card-horizontal"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.46, delay: 0.3 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="testimonial-card-header">
                  <div className="testimonial-avatar">{item.name.charAt(0)}</div>
                  <div className="testimonial-name-wrap">
                    <span className="testimonial-name">{item.name}</span>
                    <BadgeCheck size={16} fill="#10b981" color="#fff" />
                  </div>
                </div>
                <h4 className="testimonial-title">{item.role}</h4>
                <p className="testimonial-quote">{item.quote}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="social-proof-cta"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sectionTransition, delay: 0.38 }}
        >
          <p className="social-proof-cta-text">
            O Foco Mode ajuda você a parar a pornografia sem depender apenas da força de vontade.
          </p>
          <button className="button-primary social-proof-cta-button" onClick={onContinue}>
            Continuar
          </button>
        </motion.div>
      </div>
    </section>
  )
}
