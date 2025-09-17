# Lottie Animasyon Dosyaları

Bu klasör Artiklo onboarding flow'u için kullanılan Lottie animasyon dosyalarını içerir.

## Animasyon Dosyaları

### 1. `welcome-transformation.json`
- **Kullanım**: WelcomeScreen - Ana karşılama animasyonu
- **Açıklama**: Dokümandan anlaşılır içeriğe dönüşüm animasyonu
- **Durumu**: Prosedürel oluşturulmuş

### 2. `personalization-loading.json`
- **Kullanım**: PersonalizationScreen - Kişiselleştirme yükleme animasyonu
- **Açıklama**: AI analiz süreci ve kullanıcı profilinin oluşturulması
- **Durumu**: Prosedürel oluşturulmuş

### 3. `feature-simplification.json`
- **Kullanım**: FeatureSimplificationScreen
- **Açıklama**: Karmaşık belgenin basitleştirilmesi süreci
- **Durumu**: Prosedürel oluşturulmuş

### 4. `feature-risk-detection.json`
- **Kullanım**: FeatureRiskDetectionScreen
- **Açıklama**: Risk tespiti ve analiz süreci animasyonu
- **Durumu**: Prosedürel oluşturulmuş

### 5. `feature-action-plan.json`
- **Kullanım**: FeatureActionPlanScreen
- **Açıklama**: Eylem planı oluşturma süreci
- **Durumu**: Prosedürel oluşturulmuş

### 6. `success-celebration.json`
- **Kullanım**: Başarı durumları için genel animasyon
- **Açıklama**: Quiz tamamlama, plan seçimi gibi başarı anları
- **Durumu**: Prosedürel oluşturulmuş

## Animasyon Özellikleri

- **Format**: JSON (Lottie)
- **Boyut**: Optimize edilmiş, <50KB
- **Renk Paleti**: Artiklo brand renkler (#D4A056, #121826, #F0F4F8)
- **Animasyon Süresi**: 2-4 saniye arası loop'lar
- **FPS**: 30fps smooth animasyonlar

## Kullanım

```typescript
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import welcomeAnimation from '@/assets/lottie/welcome-transformation.json';

<DotLottieReact
    data={welcomeAnimation}
    loop={true}
    autoplay={true}
    className="w-64 h-64"
/>