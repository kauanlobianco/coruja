package com.coruja.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return

        val prefs = context.getSharedPreferences("coruja_vpn_prefs", Context.MODE_PRIVATE)
        val wasActive = prefs.getBoolean("vpn_was_active", false)
        if (!wasActive) {
            Log.d("CorujaVPN", "BootReceiver: VPN was not active before reboot, skipping")
            return
        }

        val domains = prefs.getStringSet("blocked_domains", emptySet()) ?: emptySet()
        val serviceIntent = Intent(context, CorujaVpnService::class.java).apply {
            action = CorujaVpnService.ACTION_START
            putStringArrayListExtra(CorujaVpnService.EXTRA_BLOCKED_DOMAINS, ArrayList(domains))
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent)
        } else {
            context.startService(serviceIntent)
        }
    }
}
