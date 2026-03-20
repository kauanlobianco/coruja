import { Star } from 'lucide-react'

interface PaywallStepProps {
  // This step is a minimal redirect/loader shown while navigating to custom-plan
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PaywallStep(_props: PaywallStepProps) {
  return (
    <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <Star size={40} color="#f59e0b" fill="#f59e0b" style={{ marginBottom: '16px' }} />
        <p style={{ color: '#fff', fontWeight: '700', fontSize: '1rem' }}>Carregando seu plano...</p>
      </div>
    </section>
  )
}
