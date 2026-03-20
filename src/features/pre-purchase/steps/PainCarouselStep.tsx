import { Brain, HeartCrack, Unplug, Frown } from 'lucide-react'
import { painSlides } from '../data'

interface PainCarouselStepProps {
  slideIndex: number
  onNext: () => void
}

function renderPainIcon(iconName: string) {
  if (iconName === 'Brain') return <Brain color="#fff" fill="#fbb6ce" size={100} strokeWidth={1} />
  if (iconName === 'HeartCrack') return <HeartCrack color="#fff" fill="#e2e8f0" size={100} strokeWidth={1} />
  if (iconName === 'Unplug') return <Unplug color="#fff" size={100} strokeWidth={1} />
  if (iconName === 'Frown') return <Frown color="#fff" fill="#60a5fa" size={100} strokeWidth={1} />
  return null
}

export function PainCarouselStep({ slideIndex, onNext }: PainCarouselStepProps) {
  const slide = painSlides[slideIndex]

  return (
    <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: '0', background: 'transparent' }}>
      <div className="pain-carousel-logo">Coruja</div>

      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            {renderPainIcon(slide.icon)}
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', marginBottom: '16px', lineHeight: '1.2' }}>
            {slide.title}
          </h2>
          <p style={{ color: '#fff', fontSize: '1.05rem', lineHeight: '1.5' }}>
            {slide.body}
          </p>
        </div>

        <div style={{ paddingBottom: '24px', paddingTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="pain-carousel-dots">
            {painSlides.map((item, index) => (
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
