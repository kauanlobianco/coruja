import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppState } from './state/use-app-state'
import { appRoutes } from '../core/config/routes'
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
import { LibraryPage } from '../features/library/LibraryPage'

function resolveFlowDestination(state: ReturnType<typeof useAppState>['state']) {
  if (!state.account) {
    return state.hasCompletedOnboarding ? appRoutes.accountRequired : appRoutes.prePurchase
  }

  if (!state.hasCompletedOnboarding) {
    return appRoutes.onboarding
  }

  return appRoutes.home
}

function RootRedirect() {
  const { ready, state } = useAppState()

  if (!ready) {
    return <IntroPage />
  }

  return <Navigate to={resolveFlowDestination(state)} replace />
}

function RequireEntryFlow({ children }: { children: ReactNode }) {
  const { ready, state } = useAppState()

  if (!ready) {
    return <IntroPage />
  }

  if (state.account || state.hasCompletedOnboarding) {
    return <Navigate to={resolveFlowDestination(state)} replace />
  }

  return <>{children}</>
}

function RequireAccountLink({ children }: { children: ReactNode }) {
  const { ready, state } = useAppState()

  if (!ready) {
    return <IntroPage />
  }

  if (!state.account && !state.hasCompletedOnboarding) {
    return <Navigate to={appRoutes.prePurchase} replace />
  }

  if (state.account && state.hasCompletedOnboarding) {
    return <Navigate to={appRoutes.home} replace />
  }

  if (state.account) {
    return <Navigate to={appRoutes.home} replace />
  }

  return <>{children}</>
}

function RequireOnboarding({ children }: { children: ReactNode }) {
  const { ready, state } = useAppState()

  if (!ready) {
    return <IntroPage />
  }

  if (!state.account) {
    return <Navigate to={resolveFlowDestination(state)} replace />
  }

  return <>{children}</>
}

function RequireAccountAuthEntry({ children }: { children: ReactNode }) {
  const { ready, state } = useAppState()

  if (!ready) {
    return <IntroPage />
  }

  if (state.account) {
    return <Navigate to={resolveFlowDestination(state)} replace />
  }

  return <>{children}</>
}

function RequireAppAccess({ children }: { children: ReactNode }) {
  const { ready, state } = useAppState()

  if (!ready) {
    return <IntroPage />
  }

  if (!state.account || !state.hasCompletedOnboarding) {
    return <Navigate to={resolveFlowDestination(state)} replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={appRoutes.root} element={<RootRedirect />} />
      <Route
        path={appRoutes.prePurchase}
        element={
          <RequireEntryFlow>
            <PrePurchasePage />
          </RequireEntryFlow>
        }
      />
      <Route
        path={appRoutes.paywall}
        element={
          <RequireEntryFlow>
            <PaywallPage />
          </RequireEntryFlow>
        }
      />
      <Route
        path={appRoutes.accountRequired}
        element={
          <RequireAccountLink>
            <AccountRequiredPage />
          </RequireAccountLink>
        }
      />
      <Route
        path={appRoutes.accountAuth}
        element={
          <RequireAccountAuthEntry>
            <AccountAuthPage />
          </RequireAccountAuthEntry>
        }
      />
      <Route
        path={appRoutes.onboarding}
        element={
          <RequireOnboarding>
            <OnboardingPage />
          </RequireOnboarding>
        }
      />
      <Route
        path={appRoutes.home}
        element={
          <RequireAppAccess>
            <HomePage />
          </RequireAppAccess>
        }
      />
      <Route
        path={appRoutes.analytics}
        element={
          <RequireAppAccess>
            <AnalyticsPage />
          </RequireAppAccess>
        }
      />
      <Route
        path={appRoutes.sos}
        element={
          <RequireAppAccess>
            <SosPage />
          </RequireAppAccess>
        }
      />
      <Route
        path={appRoutes.library}
        element={
          <RequireAppAccess>
            <LibraryPage />
          </RequireAppAccess>
        }
      />
      <Route
        path={appRoutes.settings}
        element={
          <RequireAppAccess>
            <SettingsPage />
          </RequireAppAccess>
        }
      />
      <Route
        path={appRoutes.checkIn}
        element={
          <RequireAppAccess>
            <CheckInPage />
          </RequireAppAccess>
        }
      />
      <Route
        path={appRoutes.journal}
        element={
          <RequireAppAccess>
            <JournalPage />
          </RequireAppAccess>
        }
      />
      <Route
        path={appRoutes.relapse}
        element={
          <RequireAppAccess>
            <RelapsePage />
          </RequireAppAccess>
        }
      />
      <Route
        path={appRoutes.blocker}
        element={
          <RequireAppAccess>
            <BlockerPage />
          </RequireAppAccess>
        }
      />
      <Route
        path={appRoutes.blocked}
        element={
          <RequireAppAccess>
            <BlockedPage />
          </RequireAppAccess>
        }
      />
      <Route path="*" element={<Navigate to={appRoutes.root} replace />} />
    </Routes>
  )
}
