import { motion } from 'framer-motion'

interface EvolutionScoreProps {
  evolutionScore: number
  evolutionTone: string
  evolutionBody: string
  motionDelay: number
}

export function EvolutionScore({ evolutionScore, evolutionTone, evolutionBody, motionDelay }: EvolutionScoreProps) {
  return (
    <motion.section
      className="analytics-block"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: motionDelay }}
    >
      <div className="analytics-block-label">Score de evolucao</div>
      <article className="analytics-surface analytics-score-card">
        <div className="analytics-score-head">
          <div>
            <h2 className="analytics-surface-title">Seu score hoje</h2>
            <p className="analytics-surface-description">
              Leitura simples baseada em streak, consistencia, recaidas e media de vontade.
            </p>
          </div>
          <div className="analytics-score-value">
            <strong>{evolutionScore}</strong>
            <span>/100</span>
          </div>
        </div>
        <div className="analytics-score-bar">
          <div className="analytics-score-fill" style={{ width: `${evolutionScore}%` }} />
        </div>
        <div className="analytics-score-copy">
          <strong>{evolutionTone}</strong>
          <p>{evolutionBody}</p>
        </div>
      </article>
    </motion.section>
  )
}
