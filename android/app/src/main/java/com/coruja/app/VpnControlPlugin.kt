package com.coruja.app

import android.content.Intent
import android.os.Build
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "VpnControl")
class VpnControlPlugin : Plugin() {

    @PluginMethod
    fun startVpn(call: PluginCall) {
        try {
            val domainsArray = call.getArray("domains") ?: JSArray()
            val domains = ArrayList<String>()
            for (i in 0 until domainsArray.length()) {
                domains.add(domainsArray.getString(i))
            }

            val intent = Intent(context, CorujaVpnService::class.java).apply {
                action = CorujaVpnService.ACTION_START
                putStringArrayListExtra(CorujaVpnService.EXTRA_BLOCKED_DOMAINS, domains)
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }

            val result = JSObject()
            result.put("started", true)
            call.resolve(result)
        } catch (e: Exception) {
            call.reject("Erro ao iniciar VPN: ${e.message}")
        }
    }

    @PluginMethod
    fun stopVpn(call: PluginCall) {
        try {
            val intent = Intent(context, CorujaVpnService::class.java).apply {
                action = CorujaVpnService.ACTION_STOP
            }
            context.startService(intent)

            val result = JSObject()
            result.put("stopped", true)
            call.resolve(result)
        } catch (e: Exception) {
            call.reject("Erro ao parar VPN: ${e.message}")
        }
    }

    @PluginMethod
    fun isVpnRunning(call: PluginCall) {
        val result = JSObject()
        result.put("running", CorujaVpnService.isRunning)
        call.resolve(result)
    }
}
