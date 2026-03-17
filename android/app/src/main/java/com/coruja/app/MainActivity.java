package com.coruja.app;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(VpnPermissionPlugin.class);
        registerPlugin(VpnControlPlugin.class);
        super.onCreate(savedInstanceState);
        handleBlockedSiteIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleBlockedSiteIntent(intent);
    }

    private void handleBlockedSiteIntent(Intent intent) {
        if (intent == null) return;

        String site = intent.getStringExtra("blocked_site");
        if (site == null || site.isEmpty()) return;

        String safeSite = site.replaceAll("[^a-zA-Z0-9.\\-]", "");
        if (safeSite.isEmpty()) return;

        final String route = "/blocked?site=" + safeSite;
        if (getBridge() != null) {
            getBridge().getWebView().post(
                () -> getBridge().getWebView().evaluateJavascript(
                    "window.location.href='" + route + "'",
                    null
                )
            );
        }
    }
}
