export type FunnelStep =
  | 'landing'
  | 'quiz'
  | 'loading'
  | 'identity'
  | 'symptoms'
  | 'diagnosis'
  | 'pain-carousel'
  | 'solution-carousel'
  | 'social-proof'
  | 'plan-preview'
  | 'custom-plan'
  | 'paywall'

export interface QuizQuestion {
  id: number
  prompt: string
  answers: Array<{
    label: string
    points: number
  }>
}

export interface Testimonial {
  name: string
  role: string
  quote: string
}

export interface PlanOption {
  id: 'annual' | 'lifetime'
  title: string
  price: string
  description: string
}

export interface PrePurchaseState {
  step: FunnelStep
  quizIndex: number
  quizAnswers: number[]
  score: number
  name: string
  age: string
  symptoms: string[]
  selectedPlan: PlanOption['id']
  painSlide: number
  solutionSlide: number
}
