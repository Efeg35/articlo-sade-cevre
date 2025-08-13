# 📱 iOS Build ve Test Süreci - Artiklo

## 🎯 HEDEF
App Store Connect'te Save ettik. Şimdi mobilde test edip son kontrolleri yapalım, sonra "Add for Review" diyelim.

## 📋 ADIM ADIM SÜREÇ

### 1️⃣ **Xcode'da Proje Açma**
```bash
cd /Users/efegokce/ARTIKLO/ios
open App.xcworkspace
```

### 2️⃣ **Code Signing Kontrolü**
- **Target:** App
- **Team:** Apple Developer Account'unuz seçili olmalı (WWLU3429MD)
- **Bundle Identifier:** com.artiklo.app
- **Provisioning Profile:** "Artiklo Distribution" seçili olmalı

### 3️⃣ **Build Konfigürasyonu**
- **Scheme:** App
- **Device:** Any iOS Device (arm64)
- **Build Configuration:** Release

### 4️⃣ **Archive Oluşturma**
1. Xcode menü: **Product → Archive**
2. Build sürecini bekleyin (3-5 dakika)
3. Archive başarılı olursa **Organizer** açılır

### 5️⃣ **TestFlight'a Upload**
1. Organizer'da **Distribute App** tıklayın
2. **App Store Connect** seçin
3. **Upload** seçin
4. Distribution certificate kontrolü
5. **Upload** başlasın (5-10 dakika)

### 6️⃣ **TestFlight'ta İşleme**
1. Upload bitince App Store Connect'e gidin
2. **TestFlight** sekmesini açın
3. **Processing** durumunu bekleyin (10-30 dakika)
4. İşlem bitince **Internal Testing** için hazır olur

### 7️⃣ **iPhone'da Test**
1. App Store'dan **TestFlight** uygulamasını indirin
2. TestFlight'ta **Artiklo** uygulamasını bulun
3. **Install** edin
4. Aşağıdaki testleri yapın:

## ✅ **MOBIL TEST LİSTESİ**

### **Temel Fonksiyonlar**
- [ ] Uygulama açılıyor mu?
- [ ] Onboarding akışı çalışıyor mu?
- [ ] Giriş/kayıt sistemi çalışıyor mu?
- [ ] Dashboard yükleniyor mu?

### **Belge Analizi Testleri**
- [ ] Metin yapıştırma çalışıyor mu?
- [ ] Fotoğraf çekme çalışıyor mu?
- [ ] Galeriden dosya seçme çalışıyor mu?
- [ ] Doküman seçme çalışıyor mu?
- [ ] Analiz sonuçları görünüyor mu?

### **UI/UX Kontrolleri**
- [ ] Keyboard açılıp kapanıyor mu düzgün?
- [ ] Scroll işlemleri pürüzsüz mü?
- [ ] Butonlar dokunmatik olarak çalışıyor mu?
- [ ] Loading durumları görünüyor mu?
- [ ] Error mesajları anlaşılır mı?

### **Native Özellikler**
- [ ] Kamera izinleri çalışıyor mu?
- [ ] Status bar doğru renkte mi?
- [ ] Safe area'lar doğru mu?
- [ ] Orientation değişikliği sorun çıkarıyor mu?

### **Disclaimer ve Uyarılar**
- [ ] Mevcut disclaimer metni yeterli mi?
- [ ] Apple Review için eksik uyarılar var mı?
- [ ] Hukuki metinler net mi?

## 🚨 **YAYGIN SORUNLAR VE ÇÖZÜMLERİ**

### Archive Hataları
```
Error: No profiles for 'com.artiklo.app' were found
Çözüm: Provisioning Profile'ı yeniden indirin
```

### Upload Hataları
```
Error: Invalid Bundle ID
Çözüm: Bundle ID'nin Apple Developer'da kayıtlı olduğunu kontrol edin
```

### TestFlight Hataları
```
Missing Compliance Info
Çözüm: App Store Connect'te Export Compliance "No" seçin
```

## 📱 **MOBIL TEST SONRADAKİ ADIMLAR**

### ✅ Test Başarılı ise:
1. App Store Connect'e dönün
2. **App Store** sekmesine gidin
3. **Add for Review** butonuna tıklayın
4. Review süreci başlar (1-7 gün)

### ❌ Sorun Bulunursa:
1. Sorunu kaydedin
2. Code'da düzeltme yapın
3. Yeni archive oluşturun
4. TestFlight'a tekrar upload edin
5. Testi tekrarlayın

## 🎯 **BAŞARI KRİTERLERİ**

### ✅ Bu testler geçerse Apple Review'a hazırsınız:
- Uygulama crash yapmıyor
- Temel fonksiyonlar çalışıyor
- UI/UX kullanılabilir durumda
- Native özellikler sorunsuz
- Disclaimer'lar mevcut
- Loading durumları görünüyor
- Error handling çalışıyor

### 🔧 **SONRAKİ ADIMLAR**
Test başarılı olunca:
- [ ] App Store review submission
- [ ] Review süreci takibi
- [ ] Apple'dan gelen feedback'lere cevap
- [ ] Final approval ve yayınlama

## 📞 **DESTEK**
Sorun yaşarsanız:
- Xcode console log'larını kontrol edin
- Device logs'unu inceleyin  
- Apple Developer support'a başvurun