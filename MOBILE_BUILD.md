# Artiklo Mobil Uygulama Build Rehberi

## 🚀 Production-Ready Capacitor Konfigürasyonu

Bu rehber, Artiklo mobil uygulamasını iOS App Store ve Google Play Store'a yayınlamak için gerekli adımları içerir.

## 📱 Mevcut Konfigürasyon

### Temel Ayarlar
- **App ID**: `com.artiklo.app`
- **App Name**: `Artiklo`
- **Web Directory**: `dist`
- **Bundled Web Runtime**: Disabled (performans için)

### Plugin Konfigürasyonları
- **SplashScreen**: 2 saniye, mavi arka plan (#1a73e8)
- **StatusBar**: Koyu stil, beyaz arka plan
- **Keyboard**: Native resize modu
- **Camera**: Yüksek kalite (90%), düzenleme izni
- **PushNotifications**: Badge, ses, alert desteği
- **LocalNotifications**: Yerel bildirim desteği
- **Haptics**: Titreşim desteği

### iOS Özel Ayarları
- Content inset: Automatic
- Link preview: Devre dışı (güvenlik)
- Scroll: Etkin
- Background: Beyaz
- Scheme: HTTPS (güvenlik)
- App-bound domains: Etkin

### Android Özel Ayarları
- Mixed content: Devre dışı (güvenlik)
- Capture input: Etkin
- Web debugging: Devre dışı (production)
- User agent: Artiklo-Mobile
- Background: Beyaz
- Min WebView: 55

## 🛠️ Build Komutları

### Temel Komutlar
```bash
# Capacitor sync (web assets'i native'e kopyala)
npm run cap:sync

# iOS build ve run
npm run cap:ios

# Android build ve run
npm run cap:android

# Production build + sync
npm run build:mobile
```

### Gelişmiş Komutlar
```bash
# iOS build (Xcode açmadan)
npm run cap:build:ios

# Android build (Android Studio açmadan)
npm run cap:build:android

# Xcode'u aç
npm run cap:open:ios

# Android Studio'yu aç
npm run cap:open:android
```

## 📦 Store Submission Hazırlığı

### iOS App Store
1. **Xcode'da Archive oluştur**
   ```bash
   npm run cap:open:ios
   # Xcode'da Product > Archive
   ```

2. **App Store Connect'e yükle**
   - Xcode'da "Distribute App" seç
   - "App Store Connect" seç
   - Upload

3. **Gerekli Metadata**
   - App Store screenshots
   - App description
   - Privacy policy
   - App Store review bilgileri

### Google Play Store
1. **Android App Bundle oluştur**
   ```bash
   npm run cap:open:android
   # Android Studio'da Build > Generate Signed Bundle/APK
   ```

2. **Google Play Console'a yükle**
   - AAB dosyasını yükle
   - Release notes ekle
   - Store listing bilgileri

3. **Gerekli Metadata**
   - Play Store screenshots
   - App description
   - Privacy policy
   - Content rating

## 🔒 Güvenlik Ayarları

### Production Konfigürasyonu
- **Logging**: Production'da devre dışı
- **Debugging**: Production'da devre dışı
- **Mixed Content**: Devre dışı
- **HTTPS**: Zorunlu
- **App-bound domains**: Etkin

### Network Security
- Cleartext traffic: Devre dışı
- Mixed content: Devre dışı
- Domain restrictions: Etkin

## 📊 Performance Optimizasyonları

### Web Assets
- Lazy loading desteği
- Cache optimizasyonu
- Memory management
- Bundle splitting

### Native Performance
- Min WebView version: 55
- Optimized plugin loading
- Background processing
- Memory efficient

## 🐛 Debugging

### Development
```bash
# Development server
npm run dev

# iOS debug
npm run cap:ios

# Android debug
npm run cap:android
```

### Production Testing
```bash
# Production build
npm run build:mobile

# Test flight (iOS)
# App Store Connect > TestFlight

# Internal testing (Android)
# Google Play Console > Testing
```

## 📱 Plugin Kullanımı

### SplashScreen
```typescript
import { SplashScreen } from '@capacitor/splash-screen';

// Splash screen'i gizle
await SplashScreen.hide();
```

### StatusBar
```typescript
import { StatusBar } from '@capacitor/status-bar';

// Status bar stilini ayarla
await StatusBar.setStyle({ style: 'DARK' });
```

### Camera
```typescript
import { Camera } from '@capacitor/camera';

// Fotoğraf çek
const image = await Camera.getPhoto({
  quality: 90,
  allowEditing: true
});
```

### Haptics
```typescript
import { Haptics } from '@capacitor/haptics';

// Titreşim
await Haptics.impact({ style: 'medium' });
```

## 🔄 Güncelleme Süreci

1. **Kod değişiklikleri**
2. **Test et**
3. **Build al**
4. **Store'a yükle**
5. **Review süreci**
6. **Yayınla**

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- Capacitor dokümantasyonu
- iOS/Android native dokümantasyonu
- Store submission guidelines

---

**Not**: Bu konfigürasyon production-ready olarak hazırlanmıştır. Store submission öncesi tüm testleri yapmayı unutmayın.
