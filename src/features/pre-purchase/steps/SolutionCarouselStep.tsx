import { Rocket, Brain, Flame, ShieldCheck, Trophy, Sprout, Activity } from 'lucide-react'
import { solutionSlides } from '../data'

interface SolutionCarouselStepProps {
  slideIndex: number
  onNext: () => void
}

function renderSolutionIcon(iconName: string) {
  if (iconName === 'Rocket') return <Rocket color="#fff" fill="#facc15" size={120} strokeWidth={1} />
  if (iconName === 'Brain') return <Brain color="#fff" fill="#cbd5e1" size={120} strokeWidth={1} />
  if (iconName === 'Flame') return <Flame color="#fff" fill="#f97316" size={120} strokeWidth={1} />
  if (iconName === 'ShieldCheck') return <ShieldCheck color="#fff" fill="#ef4444" size={120} strokeWidth={1} />
  if (iconName === 'Trophy') return <Trophy color="#fff" fill="#facc15" size={120} strokeWidth={1} />
  if (iconName === 'Sprout') return <Sprout color="#fff" fill="#22c55e" size={120} strokeWidth={1} />
  if (iconName === 'Activity') return <Activity color="#fff" size={120} strokeWidth={1.5} />
  return null
}

export function SolutionCarouselStep({ slideIndex, onNext }: SolutionCarouselStepProps) {
  const slide = solutionSlides[slideIndex]

  return (
    <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: '0', background: 'transparent' }}>
      <div className="pain-carousel-logo">Coruja</div>

      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            {renderSolutionIcon(slide.icon)}
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', marginBottom: '16px', lineHeight: '1.2' }}>
            {slide.title}
          </h2>
          <p style={{ color: '#fff', fontSize: '1.05rem', lineHeight: '1.5' }}>
            {slide.body}
          </p>
        </div>

        <div style={{ paddingBottom: '24px', paddingTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="press-logos">
            <span className="press-logo-text">Forbes</span>
            <span className="press-logo-divider">|</span>
            <span className="press-logo-text sans">TECH<br/>TIMES</span>
            <span className="press-logo-divider">|</span>
            <span className="press-logo-text">LA WEEKLY</span>
          </div>

          <div className="pain-carousel-dots">
            {solutionSlides.map((item, index) => (
              <span
                key={item.title}
                className={`pain-carousel-dot ${index === slideIndex ? 'active' : ''}`}
              />
            ))}
          </div>
          <button className="button-white-pill" style={{ width: 'fit-content', padding: '12px 32px' }} onClick={onNext}>
            Próximo &gt;
          </button>
        </div>
      </div>
    </section>
  )
}
