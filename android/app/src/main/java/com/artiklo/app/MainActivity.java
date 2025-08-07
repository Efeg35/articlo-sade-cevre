package com.artiklo.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Capacitor splash screen'i tamamen devre dışı bırak - sadece native splash screen kullan
        getWindow().setBackgroundDrawableResource(android.R.color.white);
        
        // Capacitor'ın varsayılan loading ekranını engelle
        getWindow().setFlags(android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN,
                           android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }
}
