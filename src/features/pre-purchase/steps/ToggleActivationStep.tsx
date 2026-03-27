import { useEffect, useState } from 'react'

interface ToggleActivationStepProps {
  onActivate: () => void
  onComplete: () => void
}

export function ToggleActivationStep({ onActivate, onComplete }: ToggleActivationStepProps) {
  const [phase, setPhase] = useState<'grow' | 'activate' | 'glow' | 'done'>('grow')

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('activate')
      onActivate()
    }, 700)
    const t2 = setTimeout(() => setPhase('glow'), 1400)
    const t3 = setTimeout(() => setPhase('done'), 2600)
    const t4 = setTimeout(() => onComplete(), 3600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onActivate, onComplete])

  const isToggleOn = phase !== 'grow'

  return (
    <section className={`toggle-activation-screen ${phase === 'done' ? 'is-fading' : ''}`}>
      {/* Partículas flutuantes */}
      <div className="foco-landing-particles" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="foco-particle" />
        ))}
      </div>

      <div className={`toggle-activation-logo ${phase}`}>
        <div className="foco-brand-top">FOCO</div>
        <div className="foco-brand-bottom">
          <span>M</span>
          <div className={`foco-brand-toggle toggle-activation-toggle ${isToggleOn ? '' : 'is-off'}`}>
            <div className="foco-brand-toggle-knob"></div>
          </div>
          <span>E</span>
        </div>
      </div>
    </section>
  )
}
