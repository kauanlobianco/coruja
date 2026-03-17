import { Capacitor, registerPlugin } from '@capacitor/core'

interface VpnPermissionPlugin {
  checkPermission(): Promise<{ granted: boolean }>
  requestPermission(): Promise<{ granted: boolean }>
  getVpnStatus(): Promise<{ active: boolean }>
}

interface VpnControlPlugin {
  startVpn(options: { domains: string[] }): Promise<{ started: boolean }>
  stopVpn(): Promise<{ stopped: boolean }>
  isVpnRunning(): Promise<{ running: boolean }>
}

const VpnPermission = registerPlugin<VpnPermissionPlugin>('VpnPermission')
const VpnControl = registerPlugin<VpnControlPlugin>('VpnControl')

export async function checkBlockerPermission() {
  if (!Capacitor.isNativePlatform()) {
    return { granted: true }
  }

  return VpnPermission.checkPermission()
}

export async function requestBlockerPermission() {
  if (!Capacitor.isNativePlatform()) {
    return { granted: true }
  }

  return VpnPermission.requestPermission()
}

export async function getBlockerVpnStatus() {
  if (!Capacitor.isNativePlatform()) {
    return { active: false }
  }

  return VpnPermission.getVpnStatus()
}

export async function startBlockerVpn(domains: string[]) {
  if (!Capacitor.isNativePlatform()) {
    return { started: true }
  }

  return VpnControl.startVpn({ domains })
}

export async function stopBlockerVpn() {
  if (!Capacitor.isNativePlatform()) {
    return { stopped: true }
  }

  return VpnControl.stopVpn()
}

export async function isBlockerVpnRunning() {
  if (!Capacitor.isNativePlatform()) {
    return { running: false }
  }

  return VpnControl.isVpnRunning()
}
