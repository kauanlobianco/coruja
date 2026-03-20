import { motion } from 'framer-motion'

interface RelapseEntry {
  id: string
  createdAt: string
  previousStreak: number
  cause?: string | null
}

interface RelapseListProps {
  relapses: RelapseEntry[]
  motionDelay: number
}

export function RelapseList({ relapses, motionDelay }: RelapseListProps) {
  return (
    <motion.section
      className="analytics-block"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: motionDelay }}
    >
      <div className="analytics-block-label">Recaidas</div>
      <article className="analytics-surface">
        <div className="analytics-surface-head">
          <h2 className="analytics-surface-title">Ultimos registros de recaida</h2>
          <span className="analytics-surface-meta">{relapses.length} no periodo</span>
        </div>
        {relapses.length === 0 ? (
          <div className="empty-state analytics-empty-state analytics-inline-empty">
            <p>Nenhuma recaida registrada no periodo selecionado.</p>
          </div>
        ) : (
          <div className="analytics-relapse-list">
            {relapses
              .slice()
              .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
              .slice(0, 4)
              .map((entry) => (
                <article key={entry.id} className="analytics-relapse-item">
                  <div className="analytics-relapse-head">
                    <strong>
                      {new Intl.DateTimeFormat('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      }).format(new Date(entry.createdAt))}
                    </strong>
                    <span>streak anterior: {entry.previousStreak} dias</span>
                  </div>
                  <p>{entry.cause || 'Sem causa registrada.'}</p>
                </article>
              ))}
          </div>
        )}
      </article>
    </motion.section>
  )
}
