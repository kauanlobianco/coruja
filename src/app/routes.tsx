import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppState } from './state/use-app-state'
import { HomePage } from '../features/home/HomePage'
import { IntroPage } from '../features/intro/IntroPage'
import { OnboardingPage } from '../features/onboarding/OnboardingPage'
import { PrePurchasePage } from '../features/pre-purchase/PrePurchasePage'
import { PaywallPage } from '../features/paywall/PaywallPage'
import { SettingsPage } from '../features/settings/SettingsPage'

function RootRedirect() {
  const { ready, state } = useAppState()

  if (!ready) {
    return <IntroPage />
  }

  if (!state.hasCompletedOnboarding) {
    return <Navigate to="/pre-purchase" replace />
  }

  return <Navigate to="/app" replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/pre-purchase" element={<PrePurchasePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/paywall" element={<PaywallPage />} />
      <Route path="/app" element={<HomePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
