package com.coruja.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.content.pm.ServiceInfo
import android.net.VpnService
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import java.io.FileInputStream
import java.io.FileOutputStream
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

private const val VPN_ADDRESS = "10.111.222.1"
private const val DNS_VIRTUAL = "10.111.222.2"
private const val REAL_DNS = "8.8.8.8"
private const val DNS_PORT = 53
private const val NOTIFICATION_ID = 1001
private const val CHANNEL_ID = "coruja_vpn"
private const val BLOCK_CHANNEL_ID = "coruja_block"
private const val TAG = "CorujaVPN"
private const val BLOCK_NOTIF_COOLDOWN_MS = 60_000L

class CorujaVpnService : VpnService() {

    companion object {
        var isRunning = false
        const val ACTION_START = "com.coruja.vpn.START"
        const val ACTION_STOP = "com.coruja.vpn.STOP"
        const val EXTRA_BLOCKED_DOMAINS = "blocked_domains"
    }

    private var vpnInterface: android.os.ParcelFileDescriptor? = null
    private var workerThread: Thread? = null
    private var forwardExecutor: ExecutorService? = null
    private var blockedDomains: Set<String> = emptySet()
    private val lastBlockNotifTime = mutableMapOf<String, Long>()

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when {
            intent == null -> {
                val prefs = getSharedPreferences("coruja_vpn_prefs", MODE_PRIVATE)
                if (prefs.getBoolean("vpn_was_active", false)) {
                    blockedDomains = prefs.getStringSet("blocked_domains", emptySet()) ?: emptySet()
                    startVpn()
                } else {
                    stopSelf()
                }
            }
            intent.action == ACTION_START -> {
                val domains = intent.getStringArrayListExtra(EXTRA_BLOCKED_DOMAINS) ?: emptyList()
                blockedDomains = domains.map { it.lowercase().trim() }.filter { it.isNotEmpty() }.toSet()
                startVpn()
            }
            intent.action == ACTION_STOP -> stopVpn()
        }

        return START_STICKY
    }

    private fun startVpn() {
        if (isRunning) {
            stopVpn()
        }

        createNotificationChannel()

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Coruja - Protecao ativa")
            .setContentText("Sites protegidos estao bloqueados")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setOngoing(true)
            .build()

        if (Build.VERSION.SDK_INT >= 34) {
            startForeground(
                NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        val builder = Builder()
            .setMtu(1500)
            .addAddress(VPN_ADDRESS, 32)
            .addRoute(DNS_VIRTUAL, 32)
            .addDnsServer(DNS_VIRTUAL)
            .setSession("Coruja Blocker")
            .setBlocking(true)

        vpnInterface = builder.establish() ?: run {
            Log.e(TAG, "establish() returned null")
            stopSelf()
            return
        }

        isRunning = true
        forwardExecutor = Executors.newCachedThreadPool()
        saveVpnState(active = true)

        workerThread = Thread { processPackets() }.apply {
            name = "CorujaVpnWorker"
            isDaemon = true
            start()
        }
    }

    private fun stopVpn() {
        isRunning = false
        workerThread?.interrupt()
        workerThread = null
        forwardExecutor?.shutdownNow()
        forwardExecutor = null
        try {
            vpnInterface?.close()
        } catch (_: Exception) {
        }
        vpnInterface = null
        saveVpnState(active = false)
        stopForeground(true)
        stopSelf()
    }

    private fun saveVpnState(active: Boolean) {
        getSharedPreferences("coruja_vpn_prefs", MODE_PRIVATE).edit()
            .putBoolean("vpn_was_active", active)
            .putStringSet("blocked_domains", if (active) blockedDomains else emptySet())
            .apply()
    }

    private fun processPackets() {
        val tun = vpnInterface ?: return
        val input = FileInputStream(tun.fileDescriptor)
        val output = FileOutputStream(tun.fileDescriptor)
        val buffer = ByteArray(32767)

        while (isRunning && !Thread.currentThread().isInterrupted) {
            try {
                val len = input.read(buffer)
                if (len <= 0) {
                    continue
                }

                val packet = buffer.copyOf(len)
                if (isDnsPacket(packet, len)) {
                    handleDnsPacket(packet, len, output)
                }
            } catch (_: InterruptedException) {
                break
            } catch (e: Exception) {
                Log.e(TAG, "processPackets error: ${e.message}")
            }
        }
    }

    private fun isDnsPacket(packet: ByteArray, length: Int): Boolean {
        if (length < 28) return false
        if (packet[0].toInt() and 0xF0 != 0x40) return false
        if (packet[9].toInt() and 0xFF != 17) return false
        val dstPort = ((packet[22].toInt() and 0xFF) shl 8) or (packet[23].toInt() and 0xFF)
        return dstPort == DNS_PORT
    }

    private fun handleDnsPacket(packet: ByteArray, length: Int, output: FileOutputStream) {
        val dnsOffset = 28
        if (length <= dnsOffset) return
        val dnsPayload = packet.copyOfRange(dnsOffset, length)
        val domain = parseDnsDomain(dnsPayload)
        val blocked = domain != null && isBlocked(domain)

        if (blocked) {
            val dnsResponse = buildNxdomainResponse(dnsPayload)
            val response = buildResponsePacket(packet, dnsOffset, dnsResponse)
            writeTun(output, response)
            if (domain != null) {
                sendBlockNotification(domain)
            }
        } else {
            val packetSnapshot = packet.copyOf()
            val dnsPayloadSnapshot = dnsPayload.copyOf()
            forwardExecutor?.execute {
                val dnsResponse = forwardDns(dnsPayloadSnapshot)
                if (dnsResponse != null) {
                    val response = buildResponsePacket(packetSnapshot, dnsOffset, dnsResponse)
                    writeTun(output, response)
                }
            }
        }
    }

    @Synchronized
    private fun writeTun(output: FileOutputStream, data: ByteArray) {
        try {
            output.write(data)
        } catch (e: Exception) {
            Log.e(TAG, "writeTun error: ${e.message}")
        }
    }

    private fun parseDnsDomain(dns: ByteArray): String? {
        return try {
            val sb = StringBuilder()
            var pos = 12
            while (pos < dns.size) {
                val labelLen = dns[pos].toInt() and 0xFF
                if (labelLen == 0) break
                if (sb.isNotEmpty()) sb.append('.')
                pos++
                if (pos + labelLen > dns.size) break
                sb.append(String(dns, pos, labelLen, Charsets.UTF_8))
                pos += labelLen
            }
            sb.toString().lowercase()
        } catch (_: Exception) {
            null
        }
    }

    private fun isBlocked(domain: String): Boolean =
        blockedDomains.any { blocked -> domain == blocked || domain.endsWith(".$blocked") }

    private fun buildNxdomainResponse(dnsQuery: ByteArray): ByteArray {
        val response = dnsQuery.copyOf()
        response[2] = 0x81.toByte()
        response[3] = 0x83.toByte()
        response[6] = 0
        response[7] = 0
        response[8] = 0
        response[9] = 0
        response[10] = 0
        response[11] = 0
        return response
    }

    private fun forwardDns(dnsQuery: ByteArray): ByteArray? {
        val socket = DatagramSocket()
        return try {
            if (!protect(socket)) {
                return null
            }
            socket.soTimeout = 5000
            val dnsAddr = InetAddress.getByName(REAL_DNS)
            socket.send(DatagramPacket(dnsQuery, dnsQuery.size, dnsAddr, DNS_PORT))
            val buf = ByteArray(4096)
            val recv = DatagramPacket(buf, buf.size)
            socket.receive(recv)
            buf.copyOf(recv.length)
        } catch (e: Exception) {
            Log.e(TAG, "forwardDns failed: ${e.message}")
            null
        } finally {
            try {
                socket.close()
            } catch (_: Exception) {
            }
        }
    }

    private fun buildResponsePacket(
        originalPacket: ByteArray,
        dnsOffset: Int,
        dnsResponse: ByteArray
    ): ByteArray {
        val totalLen = dnsOffset + dnsResponse.size
        val resp = ByteArray(totalLen)

        resp[0] = 0x45.toByte()
        resp[1] = 0x00
        resp[2] = (totalLen shr 8).toByte()
        resp[3] = (totalLen and 0xFF).toByte()
        resp[4] = 0
        resp[5] = 0
        resp[6] = 0x40.toByte()
        resp[7] = 0x00
        resp[8] = 0x40.toByte()
        resp[9] = 0x11.toByte()
        resp[10] = 0
        resp[11] = 0
        originalPacket.copyInto(resp, 12, 16, 20)
        originalPacket.copyInto(resp, 16, 12, 16)

        val ipCsum = ipChecksum(resp, 0, 20)
        resp[10] = (ipCsum shr 8).toByte()
        resp[11] = (ipCsum and 0xFF).toByte()

        resp[20] = originalPacket[22]
        resp[21] = originalPacket[23]
        resp[22] = originalPacket[20]
        resp[23] = originalPacket[21]

        val udpLen = 8 + dnsResponse.size
        resp[24] = (udpLen shr 8).toByte()
        resp[25] = (udpLen and 0xFF).toByte()
        resp[26] = 0
        resp[27] = 0

        dnsResponse.copyInto(resp, dnsOffset)
        return resp
    }

    private fun ipChecksum(data: ByteArray, offset: Int, length: Int): Int {
        var sum = 0L
        var i = offset
        while (i < offset + length - 1) {
            sum += ((data[i].toInt() and 0xFF) shl 8) or (data[i + 1].toInt() and 0xFF)
            i += 2
        }
        while (sum shr 16 != 0L) {
            sum = (sum and 0xFFFF) + (sum shr 16)
        }
        return (sum.inv() and 0xFFFF).toInt()
    }

    private fun sendBlockNotification(domain: String) {
        val now = System.currentTimeMillis()
        val last = lastBlockNotifTime[domain] ?: 0L
        if (now - last < BLOCK_NOTIF_COOLDOWN_MS) return
        lastBlockNotifTime[domain] = now

        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("blocked_site", domain)
        }
        val pendingIntent = PendingIntent.getActivity(
            this,
            domain.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, BLOCK_CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("$domain bloqueado")
            .setContentText("Toque para voltar ao app e manter seu foco.")
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .build()

        val nm = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        nm.notify(domain.hashCode() and 0x7FFFFFFF, notification)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = getSystemService(NotificationManager::class.java)

            val vpnChannel = NotificationChannel(
                CHANNEL_ID,
                "Coruja VPN",
                NotificationManager.IMPORTANCE_LOW
            )
            vpnChannel.description = "Notificacao do bloqueador Coruja"
            nm.createNotificationChannel(vpnChannel)

            val blockChannel = NotificationChannel(
                BLOCK_CHANNEL_ID,
                "Coruja - Sites bloqueados",
                NotificationManager.IMPORTANCE_HIGH
            )
            blockChannel.description = "Aviso quando um dominio e bloqueado"
            nm.createNotificationChannel(blockChannel)
        }
    }

    override fun onDestroy() {
        stopVpn()
        super.onDestroy()
    }
}
