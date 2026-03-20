import { motion } from 'framer-motion'
import { AlertCircle, TrendingUp } from 'lucide-react'

interface Insight {
  tone: 'trend' | 'alert'
  text: string
}

interface InsightsListProps {
  insights: Insight[]
  motionDelay: number
}

export function InsightsList({ insights, motionDelay }: InsightsListProps) {
  if (insights.length === 0) return null

  return (
    <motion.section
      className="analytics-block"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: motionDelay }}
    >
      <div className="analytics-block-label">Insights</div>
      <div className="analytics-insights">
        {insights.slice(0, 3).map((insight, index) => {
          const Icon = insight.tone === 'alert' ? AlertCircle : TrendingUp
          return (
            <article key={`${insight.text}-${index}`} className="insight-card">
              <Icon size={18} />
              <p>{insight.text}</p>
            </article>
          )
        })}
      </div>
    </motion.section>
  )
}
