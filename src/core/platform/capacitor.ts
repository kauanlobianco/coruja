import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'

export const isNativePlatform = Capacitor.isNativePlatform()
export const platform = Capacitor.getPlatform()

export async function bootstrapNativeShell() {
  if (!isNativePlatform) {
    return
  }

  document.documentElement.dataset.platform = platform
  document.body.dataset.platform = platform

  try {
    await StatusBar.setStyle({ style: Style.Dark })
    await SplashScreen.hide()
  } catch {
    // Safe no-op. Native shell setup should never block app boot.
  }

  CapacitorApp.addListener('appStateChange', ({ isActive }) => {
    document.body.dataset.appActive = isActive ? 'true' : 'false'
  })
}
