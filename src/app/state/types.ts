export interface AppProfile {
  name: string
  goalDays: number
  motivations: string[]
  triggers: string[]
}

export interface AppStateShape {
  hasCompletedOnboarding: boolean
  hasProAccess: boolean
  blockerEnabled: boolean
  lastSyncAt: string | null
  profile: AppProfile
}
