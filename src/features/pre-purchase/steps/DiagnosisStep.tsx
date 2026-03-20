import type { QuizAnswer } from '../types'
import { markerRules } from '../data'

interface DiagnosisReport {
  band: { label: string; short: string }
  markers: Array<{ id: string; title: string; copy: string }>
}

function getRiskBand(score: number) {
  if (score >= 78) {
    return {
      label: 'Nivel em que esse padrao ja esta pesando em partes importantes da sua rotina',
      short: 'O que voce respondeu mostra um ciclo mais entranhado, com impacto real e dificuldade de interromper em alguns momentos.',
    }
  }

  if (score >= 56) {
    return {
      label: 'Nivel em que esse padrao ja comeca a tomar espaco demais no seu dia',
      short: 'Suas respostas mostram dificuldade crescente de controle, desgaste e tentativas que nao se sustentaram.',
    }
  }

  if (score >= 16) {
    return {
      label: 'Nivel que merece atencao antes que esse padrao ganhe mais forca',
      short: 'Ja existem sinais de repeticao automatica e impacto emocional, mesmo que isso ainda pareca administravel em alguns dias.',
    }
  }

  return {
    label: 'Nivel com poucos sinais de peso agora, mas que ainda merece cuidado',
    short: 'Seu resultado nao mostra um padrao dominante neste momento, mas vale proteger sua rotina para isso nao ganhar espaco.',
  }
}

export function buildDiagnosisReport(
  score: number,
  quizAnswers: QuizAnswer[],
): DiagnosisReport {
  const band = getRiskBand(score)
  const answersByQuestion = new Map<number, number>(
    quizAnswers.map((answer) => [answer.questionId, answer.answerIndex]),
  )
  const markers = markerRules.filter((rule) => rule.matches(answersByQuestion)).slice(0, 3)

  return { band, markers }
}

interface DiagnosisStepProps {
  score: number
  diagnosis: DiagnosisReport
  onBack: () => void
  onContinue: () => void
}

export function DiagnosisStep({ score, diagnosis, onBack, onContinue }: DiagnosisStepProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: '0', background: 'transparent' }}>
      <div className="quiz-custom-header">
        <button onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div style={{ flex: 1 }}></div>
        <div className="lang-badge">🇺🇸 EN</div>
      </div>

      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', textAlign: 'center', marginTop: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          Análise Concluída{' '}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1fa24e" stroke="#1fa24e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" stroke="none"></circle><polyline points="8 12 11 15 16 9" stroke="#fff"></polyline></svg>
        </h2>
        <p style={{ color: '#e0e0e0', textAlign: 'center', fontSize: '1.05rem', marginBottom: '32px' }}>
          Temos algumas notícias para dar a você...<br/><br/>
          {diagnosis.band.short}*
        </p>

        <div className="diagnosis-bar-chart">
          <div className="bar-wrapper">
            <div className="bar-fill bar-fill-red" style={{ height: `${Math.min(Math.max(score, 20), 100)}%` }}>
              {score > 20 ? `${Math.round(score)}%` : ''}
            </div>
            <div className="bar-label">sua pontuação</div>
          </div>
          <div className="bar-wrapper">
            <div className="bar-fill bar-fill-green" style={{ height: '40%' }}>
              40%
            </div>
            <div className="bar-label">Média</div>
          </div>
        </div>

        <p style={{ color: '#d7191d', textAlign: 'center', fontSize: '1rem', fontWeight: '600', marginBottom: '24px' }}>
          {Math.round(score)}% maior dependência de pornografia 📈
        </p>

        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: '0.8rem', marginBottom: '32px' }}>
          * este resultado é apenas uma indicação, não um diagnóstico médico.
        </p>

        <div style={{ paddingBottom: '24px', marginTop: 'auto' }}>
          <button className="button-blue-pill" onClick={onContinue}>
            Verificar seus sintomas
          </button>
        </div>
      </div>
    </section>
  )
}
