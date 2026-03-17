package com.coruja.app

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.VpnService
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

private const val VPN_REQUEST_CODE = 7001

@CapacitorPlugin(name = "VpnPermission")
class VpnPermissionPlugin : Plugin() {

    private var savedCall: PluginCall? = null

    @PluginMethod
    fun checkPermission(call: PluginCall) {
        try {
            val intent = VpnService.prepare(context)
            val result = JSObject()
            result.put("granted", intent == null)
            call.resolve(result)
        } catch (e: Exception) {
            call.reject("Erro ao verificar permissao VPN: ${e.message}")
        }
    }

    @PluginMethod
    fun requestPermission(call: PluginCall) {
        try {
            val intent = VpnService.prepare(context)
            if (intent == null) {
                val result = JSObject()
                result.put("granted", true)
                call.resolve(result)
                return
            }

            savedCall = call
            activity.startActivityForResult(intent, VPN_REQUEST_CODE)
        } catch (e: Exception) {
            call.reject("Erro ao solicitar permissao VPN: ${e.message}")
        }
    }

    override fun handleOnActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.handleOnActivityResult(requestCode, resultCode, data)
        if (requestCode != VPN_REQUEST_CODE) return

        val call = savedCall ?: return
        savedCall = null

        val result = JSObject()
        result.put("granted", resultCode == Activity.RESULT_OK)
        call.resolve(result)
    }

    @PluginMethod
    fun getVpnStatus(call: PluginCall) {
        try {
            val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            var vpnActive = false
            for (network in cm.allNetworks) {
                val caps = cm.getNetworkCapabilities(network) ?: continue
                if (caps.hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
                    vpnActive = true
                    break
                }
            }
            val result = JSObject()
            result.put("active", vpnActive)
            call.resolve(result)
        } catch (e: Exception) {
            call.reject("Erro ao verificar status VPN: ${e.message}")
        }
    }
}
