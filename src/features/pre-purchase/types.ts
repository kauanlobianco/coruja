export interface MarkerRule {
  id: string
  title: string
  matches: (answers: Map<number, number>) => boolean
  copy: string
}

export type FunnelStep =
  | 'landing'
  | 'quiz'
  | 'loading'
  | 'identity'
  | 'symptoms'
  | 'diagnosis'
  | 'pain-carousel'
  | 'toggle-activation'
  | 'solution-carousel'
  | 'social-proof'
  | 'plan-preview'
  | 'plan-reveal'
  | 'custom-plan'
  | 'paywall'

export type SymptomCategory = 'Mental' | 'Físico' | 'Social' | 'Fé'

export interface QuizQuestion {
  id: number
  prompt: string
  factor: string
  answers: Array<{
    label: string
    points: number
  }>
}

export interface QuizAnswer {
  questionId: number
  answerIndex: number
  points: number
}

export interface SymptomOption {
  category: SymptomCategory
  label: string
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
  pendingQuizAnswerIndex: number | null
  quizAnswers: QuizAnswer[]
  score: number
  name: string
  age: string
  symptoms: string[]
  selectedPlan: PlanOption['id']
  painSlide: number
  solutionSlide: number
  darkMode: boolean
}
