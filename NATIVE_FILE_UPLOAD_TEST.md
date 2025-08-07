# Native Dosya Yükleme Sistemi Test Rehberi

## 🎯 Artiklo Native Dosya Yükleme Sistemi

Bu rehber, Artiklo mobil uygulamasında implement edilen native dosya yükleme sisteminin test edilmesi için hazırlanmıştır.

## 📱 Implementasyon Özeti

### ✅ Tamamlanan Özellikler:

#### **1. Native Camera Implementation**
- ✅ `@capacitor/camera` plugin entegrasyonu
- ✅ Fotoğraf çekme (CameraSource.Camera)
- ✅ Galeri erişimi (CameraSource.Photos)
- ✅ Yüksek kalite (quality: 90)
- ✅ Düzenleme izni (allowEditing: true)
- ✅ Base64 formatında veri alma

#### **2. Platform-Aware Implementation**
- ✅ `Capacitor.isNativePlatform()` kontrolü
- ✅ Native platform için özel UI
- ✅ Web platform için fallback
- ✅ Progressive enhancement

#### **3. Mobil-Optimized UI**
- ✅ 3 ayrı buton: Fotoğraf Çek, Galeriden Seç, Dosya Seç
- ✅ Loading states
- ✅ Error handling
- ✅ File validation
- ✅ Security checks

#### **4. File Processing**
- ✅ Dosya boyutu kontrolü (5MB limit)
- ✅ MIME type validation
- ✅ Base64 conversion
- ✅ Supabase entegrasyonu

## 🧪 Test Senaryoları

### **Test 1: Native Platform Detection**

```typescript
// Dashboard.tsx'te test edin:
console.log('Is Native Platform:', Capacitor.isNativePlatform());

// Beklenen sonuç:
// - iOS/Android: true
// - Web: false
```

### **Test 2: Camera Functionality**

```typescript
// Native platformda test edin:
const takePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    console.log('Photo taken:', image);
  } catch (error) {
    console.error('Camera error:', error);
  }
};
```

### **Test 3: Gallery Selection**

```typescript
// Native platformda test edin:
const selectFromGallery = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    console.log('Gallery image selected:', image);
  } catch (error) {
    console.error('Gallery error:', error);
  }
};
```

### **Test 4: File Validation**

```typescript
// Dosya validasyonu test edin:
const validateFile = (fileData: FileData) => {
  // Boyut kontrolü
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (fileData.size > maxSize) {
    console.log('File too large');
    return false;
  }
  
  // MIME type kontrolü
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'application/rtf'
  ];
  
  if (!allowedTypes.includes(fileData.type)) {
    console.log('Unsupported file type');
    return false;
  }
  
  return true;
};
```

## 📱 Mobil Test Komutları

### **iOS Test:**
```bash
# iOS simülatörde test
npm run cap:ios

# Fiziksel cihazda test
npm run cap:open:ios
# Xcode'da Product > Run
```

### **Android Test:**
```bash
# Android emülatörde test
npm run cap:android

# Fiziksel cihazda test
npm run cap:open:android
# Android Studio'da Run
```

## 🔧 Test Adımları

### **1. Platform Detection Test**
1. Web'de açın: `npm run dev`
2. iOS simülatörde açın: `npm run cap:ios`
3. Android emülatörde açın: `npm run cap:android`
4. Her platformda farklı UI görmelisiniz

### **2. Camera Test**
1. Mobil uygulamayı açın
2. Dashboard'a gidin
3. "📸 Fotoğraf Çek" butonuna tıklayın
4. Kamera izni verin
5. Fotoğraf çekin
6. Düzenleme ekranında onaylayın
7. Dosya listesinde görünmeli

### **3. Gallery Test**
1. "🖼️ Galeriden Seç" butonuna tıklayın
2. Galeri izni verin
3. Bir resim seçin
4. Düzenleme ekranında onaylayın
5. Dosya listesinde görünmeli

### **4. File Processing Test**
1. Birkaç dosya ekleyin
2. "Sadeleştir" butonuna tıklayın
3. Supabase'e gönderildiğini kontrol edin
4. Sonuçları görüntüleyin

## 🐛 Hata Ayıklama

### **Yaygın Hatalar:**

#### **1. Permission Denied**
```typescript
// Info.plist (iOS) ve AndroidManifest.xml'de izinler ekleyin
// iOS: NSCameraUsageDescription, NSPhotoLibraryUsageDescription
// Android: CAMERA, READ_EXTERNAL_STORAGE
```

#### **2. Plugin Not Found**
```bash
# Plugin'leri yeniden sync edin
npx cap sync

# iOS için pod install
cd ios/App && pod install
```

#### **3. Base64 Conversion Error**
```typescript
// Base64 string'i kontrol edin
if (image.base64String) {
  console.log('Base64 length:', image.base64String.length);
  // Minimum 1000 karakter olmalı
}
```

## 📊 Performance Metrics

### **Beklenen Performans:**
- **Fotoğraf çekme**: < 2 saniye
- **Galeri seçimi**: < 1 saniye
- **Dosya validasyonu**: < 100ms
- **Base64 conversion**: < 500ms
- **Supabase upload**: < 5 saniye

### **Memory Usage:**
- **5MB dosya**: ~7.5MB memory
- **10 dosya**: ~75MB memory
- **Maksimum**: 100MB memory

## 🔒 Güvenlik Kontrolleri

### **File Security:**
- ✅ Dosya boyutu kontrolü
- ✅ MIME type kontrolü
- ✅ Base64 injection koruması
- ✅ Malicious file detection

### **Permission Security:**
- ✅ Camera permission request
- ✅ Gallery permission request
- ✅ Graceful permission handling
- ✅ Fallback mechanisms

## 📝 Test Sonuçları

### **iOS Test Sonuçları:**
- [ ] Platform detection çalışıyor
- [ ] Camera permission çalışıyor
- [ ] Gallery permission çalışıyor
- [ ] Photo capture çalışıyor
- [ ] Photo editing çalışıyor
- [ ] File validation çalışıyor
- [ ] Supabase upload çalışıyor

### **Android Test Sonuçları:**
- [ ] Platform detection çalışıyor
- [ ] Camera permission çalışıyor
- [ ] Gallery permission çalışıyor
- [ ] Photo capture çalışıyor
- [ ] Photo editing çalışıyor
- [ ] File validation çalışıyor
- [ ] Supabase upload çalışıyor

### **Web Fallback Test Sonuçları:**
- [ ] HTML5 file input çalışıyor
- [ ] File validation çalışıyor
- [ ] Progressive enhancement çalışıyor

## 🚀 Production Deployment

### **iOS App Store:**
1. Camera usage description ekleyin
2. Photo library usage description ekleyin
3. Privacy policy güncelleyin
4. TestFlight'da test edin

### **Google Play Store:**
1. Camera permission ekleyin
2. Storage permission ekleyin
3. Privacy policy güncelleyin
4. Internal testing'de test edin

---

**Not**: Bu test rehberi, native dosya yükleme sisteminin tam olarak çalıştığını doğrulamak için kullanılmalıdır. Tüm testler başarılı olduktan sonra production'a deploy edebilirsiniz.
