export interface UserProfile {
  name: string
  age: number | null
  goalDays: number
  motivations: string[]
  triggers: string[]
  startDate: string | null
  joinedAt: string | null
  avatarId: number
}

export interface StreakSnapshot {
  current: number
  best: number
  lastRelapseAt: string | null
}

export interface CheckInEntry {
  id: string
  createdAt: string
  craving: number
  mentalState: string
  triggers: string[]
  notes: string
  strategy: string | null
  escalatedToSos: boolean
}

export interface JournalEntry {
  id: string
  createdAt: string
  title: string
  content: string
  type: 'freeform' | 'relapse'
}

export interface RelapseEntry {
  id: string
  createdAt: string
  previousStreak: number
  previousGoalDays: number
  nextGoalDays: number
  cause: string
  journalEntryId: string | null
  viewed: boolean
}

export interface BlockedAttempt {
  id: string
  url: string
  createdAt: string
}

export interface BlockerConfig {
  isEnabled: boolean
  blockedDomains: string[]
  blockedAttempts: BlockedAttempt[]
}

export interface AnalyticsSnapshot {
  lastComputedAt: string | null
  selectedRangeDays: number
}

export interface LinkedAccount {
  userId: string
  email: string
  lastBackupAt: string | null
  lastRestoreAt: string | null
  lastLeaseRefreshAt: string | null
}

export interface BackupMetadata {
  status: 'idle' | 'uploading' | 'restoring' | 'conflict' | 'error'
  lastError: string | null
  hasRemoteBackup: boolean
}

export interface SosSnapshot {
  lastOpenedAt: string | null
  totalSessions: number
}

export interface AppModel {
  hasCompletedOnboarding: boolean
  hasProAccess: boolean
  profile: UserProfile
  streak: StreakSnapshot
  checkIns: CheckInEntry[]
  journalEntries: JournalEntry[]
  relapses: RelapseEntry[]
  blocker: BlockerConfig
  analytics: AnalyticsSnapshot
  account: LinkedAccount | null
  backup: BackupMetadata
  sos: SosSnapshot
}

export const defaultAppModel: AppModel = {
  hasCompletedOnboarding: false,
  hasProAccess: false,
  profile: {
    name: '',
    age: null,
    goalDays: 14,
    motivations: [],
    triggers: [],
    startDate: null,
    joinedAt: null,
    avatarId: 1,
  },
  streak: {
    current: 0,
    best: 0,
    lastRelapseAt: null,
  },
  checkIns: [],
  journalEntries: [],
  relapses: [],
  blocker: {
    isEnabled: false,
    blockedDomains: [],
    blockedAttempts: [],
  },
  analytics: {
    lastComputedAt: null,
    selectedRangeDays: 14,
  },
  account: null,
  backup: {
    status: 'idle',
    lastError: null,
    hasRemoteBackup: false,
  },
  sos: {
    lastOpenedAt: null,
    totalSessions: 0,
  },
}
