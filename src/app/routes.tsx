import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppState } from './state/use-app-state'
import { HomePage } from '../features/home/HomePage'
import { IntroPage } from '../features/intro/IntroPage'
import { OnboardingPage } from '../features/onboarding/OnboardingPage'
import { PrePurchasePage } from '../features/pre-purchase/PrePurchasePage'
import { PaywallPage } from '../features/paywall/PaywallPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { CheckInPage } from '../features/check-in/CheckInPage'
import { SosPage } from '../features/sos/SosPage'
import { JournalPage } from '../features/journal/JournalPage'
import { RelapsePage } from '../features/relapse/RelapsePage'
import { AnalyticsPage } from '../features/analytics/AnalyticsPage'
import { AccountRequiredPage } from '../features/account/AccountRequiredPage'
import { AccountAuthPage } from '../features/account/AccountAuthPage'
import { BlockerPage } from '../features/blocker/BlockerPage'
import { BlockedPage } from '../features/blocker/BlockedPage'

function RootRedirect() {
  const { ready, state } = useAppState()

  if (!ready) {
    return <IntroPage />
  }

  if (!state.account) {
    if (!state.hasCompletedOnboarding) {
      return <Navigate to="/pre-purchase" replace />
    }

    return <Navigate to="/account/required" replace />
  }

  if (!state.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return <Navigate to="/app" replace />
}

function RequireOnboarding({ children }: { children: ReactNode }) {
  const { ready, state } = useAppState()

  if (!ready) {
    return <IntroPage />
  }

  if (!state.account) {
    return <Navigate to="/pre-purchase" replace />
  }

  if (state.hasCompletedOnboarding) {
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}

function RequireMissingAccount({ children }: { children: ReactNode }) {
  const { ready, state } = useAppState()

  if (!ready) {
    return <IntroPage />
  }

  if (state.account) {
    if (state.hasCompletedOnboarding) {
      return <Navigate to="/app" replace />
    }

    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

function RequireAppAccess({ children }: { children: ReactNode }) {
  const { ready, state } = useAppState()

  if (!ready) {
    return <IntroPage />
  }

  if (!state.account) {
    return <Navigate to="/account/required" replace />
  }

  if (!state.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/pre-purchase" element={<PrePurchasePage />} />
      <Route
        path="/onboarding"
        element={
          <RequireOnboarding>
            <OnboardingPage />
          </RequireOnboarding>
        }
      />
      <Route path="/paywall" element={<PaywallPage />} />
      <Route
        path="/account/required"
        element={
          <RequireMissingAccount>
            <AccountRequiredPage />
          </RequireMissingAccount>
        }
      />
      <Route path="/account/auth" element={<AccountAuthPage />} />
      <Route
        path="/app"
        element={
          <RequireAppAccess>
            <HomePage />
          </RequireAppAccess>
        }
      />
      <Route
        path="/check-in"
        element={
          <RequireAppAccess>
            <CheckInPage />
          </RequireAppAccess>
        }
      />
      <Route
        path="/sos"
        element={
          <RequireAppAccess>
            <SosPage />
          </RequireAppAccess>
        }
      />
      <Route
        path="/journal"
        element={
          <RequireAppAccess>
            <JournalPage />
          </RequireAppAccess>
        }
      />
      <Route
        path="/relapse"
        element={
          <RequireAppAccess>
            <RelapsePage />
          </RequireAppAccess>
        }
      />
      <Route
        path="/analytics"
        element={
          <RequireAppAccess>
            <AnalyticsPage />
          </RequireAppAccess>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAppAccess>
            <SettingsPage />
          </RequireAppAccess>
        }
      />
      <Route
        path="/blocker"
        element={
          <RequireAppAccess>
            <BlockerPage />
          </RequireAppAccess>
        }
      />
      <Route
        path="/blocked"
        element={
          <RequireAppAccess>
            <BlockedPage />
          </RequireAppAccess>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
