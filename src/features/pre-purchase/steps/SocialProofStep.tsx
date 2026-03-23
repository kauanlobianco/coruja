import { useRef } from 'react'
import { motion } from 'framer-motion'
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

export function SocialProofStep({ onBack, onContinue }: SocialProofStepProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="social-proof-screen">
      <div className="quiz-custom-header">
        <button onClick={onBack} aria-label="Voltar">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
          <p className="social-proof-eyebrow">Prova social</p>
          <h2 className="social-proof-title">
            Seu resultado acelera quando o <span className="social-proof-title-accent">metodo certo</span> entra no jogo.
          </h2>
          <p className="social-proof-subtitle">
            A diferenca entre o esforco aleatorio e a evolucao cientifica em uma unica visao.
          </p>
        </motion.div>

        <motion.div
          className="social-proof-graph-container"
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...sectionTransition, delay: 0.08 }}
        >
          <div className="social-proof-graph-header">
            <div className="social-proof-graph-copy">
              <strong>Progresso mensal</strong>
              <span className="social-proof-graph-kicker">Performance baseada em consistencia</span>
            </div>
            <div className="social-proof-graph-boost">
              <strong>+240%</strong>
            </div>
          </div>

          <div className="social-proof-graph-stage">
            <svg
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
              className="social-proof-graph-svg"
              aria-label="Grafico comparativo de recuperacao"
            >
              <line x1="18" y1="176" x2="382" y2="176" stroke="rgba(255,255,255,0.11)" strokeWidth="1.2" />
              <line x1="18" y1="128" x2="382" y2="128" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 8" />

              <motion.path
                d="M 20 154 C 54 154, 74 160, 96 160 C 122 160, 138 148, 160 148 C 182 148, 198 170, 220 170 C 242 170, 262 118, 286 118 C 310 118, 326 166, 352 166 C 366 166, 374 160, 380 158"
                fill="none"
                stroke="url(#socialProofEmberStroke)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0.9 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.42, ease: 'easeInOut' }}
              />
              <motion.path
                d="M 20 154 C 54 154, 74 160, 96 160 C 122 160, 138 148, 160 148 C 182 148, 198 170, 220 170 C 242 170, 262 118, 286 118 C 310 118, 326 166, 352 166 C 366 166, 374 160, 380 158 L 380 176 L 20 176 Z"
                fill="url(#socialProofEmberGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.08 }}
                transition={{ duration: 0.7, delay: 1.02, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="20"
                cy="154"
                r="5"
                fill="#fff"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.32, delay: 0.34, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="380"
                cy="158"
                r="5.5"
                fill="#d77432"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.32, delay: 1.42, ease: 'easeInOut' }}
              />

              <motion.path
                d="M 20 148 C 46 146, 62 126, 84 110 C 106 94, 128 86, 154 78 C 176 72, 198 66, 224 62 C 248 58, 276 52, 304 46 C 332 40, 354 36, 380 34"
                fill="none"
                stroke="url(#socialProofCyanStroke)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0.9 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.35, delay: 0.18, ease: 'easeInOut' }}
              />
              <motion.path
                d="M 20 148 C 46 146, 62 126, 84 110 C 106 94, 128 86, 154 78 C 176 72, 198 66, 224 62 C 248 58, 276 52, 304 46 C 332 40, 354 36, 380 34 L 380 176 L 20 176 Z"
                fill="url(#socialProofCyanGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.05 }}
                transition={{ duration: 0.72, delay: 0.86, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="20"
                cy="148"
                r="5"
                fill="#fff"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.32, delay: 0.12, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="380"
                cy="34"
                r="6.5"
                fill="#58d0e4"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.32, delay: 1.28, ease: 'easeInOut' }}
              />

              <text x="84" y="194" fill="rgba(255,255,255,0.32)" fontSize="11" textAnchor="middle">
                Semana 1
              </text>
              <text x="202" y="194" fill="rgba(255,255,255,0.32)" fontSize="11" textAnchor="middle">
                Semana 2
              </text>
              <text x="320" y="194" fill="rgba(255,255,255,0.32)" fontSize="11" textAnchor="middle">
                Semana 3
              </text>

              <defs>
                <linearGradient id="socialProofEmberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d77432" stopOpacity="0.78" />
                  <stop offset="100%" stopColor="#d77432" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="socialProofEmberStroke" x1="20" y1="106" x2="380" y2="160" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#e79244" />
                  <stop offset="100%" stopColor="#d77432" />
                </linearGradient>
                <linearGradient id="socialProofCyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#58d0e4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#58d0e4" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="socialProofCyanStroke" x1="20" y1="136" x2="372" y2="10" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#63d8eb" />
                  <stop offset="100%" stopColor="#58d0e4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <motion.div
            className="social-proof-graph-legend"
            aria-hidden="true"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sectionTransition, delay: 0.26 }}
          >
            <span className="social-proof-legend-pill is-coruja">Com Coruja</span>
            <span className="social-proof-legend-pill is-willpower">So na forca de vontade</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="social-proof-feedback-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sectionTransition, delay: 0.22 }}
        >
          <div className="social-proof-feedback-head">
            <div>
              <p className="social-proof-eyebrow">Feedbacks</p>
            </div>
          </div>

          <div className="testimonials-scroller social-proof-testimonials" ref={scrollerRef}>
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                className="testimonial-card-horizontal"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.46,
                  delay: 0.3 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
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
            O Coruja ajuda voce a parar a pornografia
            <br />
            76% mais rapido do que depender so da forca de vontade.
          </p>
          <button className="button-primary social-proof-cta-button" onClick={onContinue}>
            Continuar
          </button>
        </motion.div>
      </div>
    </section>
  )
}
