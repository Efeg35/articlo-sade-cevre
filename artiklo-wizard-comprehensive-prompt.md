# 🧙‍♂️ Artiklo Belge Sihirbazı - Kapsamlı Development Prompt

## 📋 PROJE ÖZET

**Platform:** Artiklo - Hukuki belge analizi ve sadeleştirme platformu  
**Yeni Özellik:** Belge Sihirbazı (Wizard-based belge oluşturma sistemi)  
**Teknoloji:** React + TypeScript + Tailwind CSS  
**Durum:** Stratejik planlama tamamlandı, kod implementasyonu başlayacak

---

## 🎯 TEMEL KONSEPT

### Mevcut Durum:
- ✅ Hukuki belge analizi ve sadeleştirme yapan platform
- ✅ Analiz sonrası belge önerileri sunuyor
- ✅ Hazır şablonlar mevcut

### Yeni Özellik - Belge Sihirbazı:
- 🧙‍♂️ **Template tabanlı** adım adım belge oluşturma
- 📋 **Form-based** yaklaşım (Chat DEĞİL!)
- ✅ **Wizard interface** ile rehberli deneyim
- 🔒 **Pro-only** özellik (₺99/ay)

---

## 🔑 ÖNEMLİ KARARLAR

### 1. **MODEL SEÇİMİ: WIZARD (Chat Değil!)**
**Kullanıcı araştırması net olarak destekliyor:**
- ✅ Yapılandırılmış süreç istiyor
- ✅ Adım adım rehberlik tercih ediyor  
- ✅ Net sorular ile ilerlemek istiyor
- ✅ Öngörülebilir sonuç bekliyor

**Teknik avantajlar:**
- ✅ **Hukuki güvenlik**: Template tabanlı, minimal halüsinasyon
- ✅ **Kalite kontrolü**: Önceden test edilmiş sorular
- ✅ **Development hızı**: Form-based, hızlı geliştirme
- ✅ **Maintenance**: Template güncelleme kolay

### 2. **DASHBOARD YAPISI**
```
Giriş sonrası iki seçenek:
┌─────────────────────────────┐
│   📄 Belge Analizi          │
│   [Dosya Yükle] - Free     │
└─────────────────────────────┘

┌─────────────────────────────┐
│   🧙‍♂️ Belge Sihirbazı       │
│   [Sihirbazı Başlat] - PRO │
└─────────────────────────────┘
```

---

## 🛠️ TEKNİK MİMARİ

### Frontend Stack:
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Validation**: Zod schemas
- **State**: Context API (wizard state için)
- **Icons**: Lucide icons (Wand2 for wizard)

### Wizard Components:
```typescript
interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<WizardStepProps>;
  validation: ZodSchema;
}

interface WizardTemplate {
  id: string;
  name: string;
  category: string;
  steps: WizardStep[];
  estimatedTime: string;
  description: string;
}
```

### Backend Integration:
- **Template Engine**: Handlebars.js
- **Document Generation**: Puppeteer + jsPDF
- **API**: RESTful endpoints (wizard-specific)

---

## 🎨 UX/UI TASARIM

### Wizard Interface:
```jsx
<WizardInterface>
  <WizardHeader>
    <ProgressBar current={3} total={12} />
    <h2>İş Sözleşmesi - Adım 3/12</h2>
  </WizardHeader>
  
  <WizardContent>
    <Question>
      <h3>Çalışanın tam adı nedir?</h3>
      <Input placeholder="Örn: Ahmet Yılmaz" />
      <HelpText>Bu bilgi sözleşmede kullanılacak</HelpText>
    </Question>
  </WizardContent>
  
  <WizardFooter>
    <Button variant="outline">← Önceki</Button>
    <Button>Sonraki →</Button>
  </WizardFooter>
</WizardInterface>
```

### İkon Değişimi:
- **Eski**: Edit3 (dilekçe oluşturma)
- **Yeni**: Wand2 (sihirbaz ikonu)

---

## 📄 TEMPLATE YAPISI

### Örnek: İş Sözleşmesi Wizard (12 adım)
```
1. Şirket Bilgileri (Ad, adres, vergi no)
2. Pozisyon Detayları (Unvan, departman)
3. Çalışan Bilgileri (Ad, TC, adres)
4. Maaş Bilgileri (Brüt, net, ödemeler)
5. Çalışma Saatleri (Haftalık, mesai)
6. İzin Hakları (Yıllık, mazeret)
7. Yan Haklar (SGK, yemek, ulaşım)
8. Sorumluluklar (Görev tanımı)
9. Gizlilik (NDA gerekli mi?)
10. Rekabet Yasağı (Var mı, süresi)
11. Fesih Koşulları (İhbar, tazminat)
12. Son Kontrol ve İmza
```

### Template Kategorileri:
- **İş Hukuku**: İş sözleşmesi, Fesih dilekçesi
- **Kira Hukuku**: İtiraz dilekçesi, Kira sözleşmesi  
- **Tüketici**: Şikayet dilekçesi, İade talebi
- **Aile Hukuku**: Velayet, Nafaka

---

## 🛡️ HUKUKİ KORUMA SİSTEMİ

### Zorunlu Disclaimer:
```
⚠️ ÖNEMLİ HUKUKİ UYARI ⚠️
Bu belge Artiklo Belge Sihirbazı tarafından oluşturulmuştur ve 
hukuki tavsiye niteliği taşımaz. Kullanmadan önce mutlaka 
bir avukata danışınız.
```

### Güvenlik Kontrolleri:
- ✅ Her belge çıktısında zorunlu uyarı
- ✅ İndirme öncesi 3'lü onay sistemi
- ✅ Belge içi watermark
- ✅ Risk seviyesi tespiti
- ✅ Audit trail logging

---

## 🚀 UYGULAMA AŞAMALARI

### Aşama 1: Mevcut Sayfa Düzeltmeleri (1-2 gün)
**Acil düzeltmeler:**

#### Ana Sayfa (src/pages/Index.tsx):
```typescript
// DÜZELT:
title: "Belge Sihirbazı" (eski: "Dilekçe Oluşturma")
icon: Wand2 (eski: Edit3)
description: "Adım adım profesyonel belgeler oluşturun"

// Hero text:
"Belge Sihirbazı ile adım adım profesyonel belgeler oluşturun"

// İstatistik:
"20+ Wizard Template" (eski: "5K+ Oluşturulan Dilekçe")

// Testimonial:
"Sihirbaz ile adım adım kira itiraz dilekçemi hazırladım"
```

#### Diğer Sayfalar:
- **NasilCalisir.tsx**: "Belge Sihirbazı" tab'ı + "Yakında" badge
- **Hakkimizda.tsx**: Mission'da wizard teknolojisi
- **NedenArtiklo.tsx**: Adım adım rehberlik özelliği
- **Yorumlar.tsx**: Wizard deneyimi testimonial'ları

### Aşama 2: Wizard Tanıtım Bölümleri (3-5 gün)
- 🧙‍♂️ Wizard Roadmap section
- Beta kayıt formu
- Feature comparison table
- "Yakında" badge'leri

### Aşama 3: Wizard Development (8-12 hafta)
- Wizard framework
- Template engine
- 15+ wizard template
- Multi-format export

---

## 💼 İŞ MODELİ

### Pricing:
```
🆓 FREE PLAN
- 5 belge sadeleştirme/ay
- Temel analiz
- 5 hazır şablon

💎 PRO PLAN - ₺99/ay
- Sınırsız sadeleştirme  
- Detaylı analiz
- 🧙‍♂️ Belge Sihirbazı (20+ template)
- Adım adım rehberlik
- Premium şablonlar
- Multi-format export
```

---

## 📊 BAŞARI METRİKLERİ

### Teknik KPI:
- **Wizard Completion Rate**: >85%
- **Average Completion Time**: <10 dakika
- **Template Accuracy**: >95%
- **User Satisfaction**: >4.5/5

### İş KPI:
- **Free to Pro Conversion**: >15%
- **Wizard Feature Usage**: >70% PRO users
- **Template Download Rate**: >90%

---

## 🔧 GELİŞTİRME TALİMATLARI

### Hemen Yapılacaklar:
1. **Terminology Update**: Tüm "Chat" → "Wizard" değişimi
2. **Icon Updates**: Edit3 → Wand2
3. **Content Updates**: Adım adım vurgusu
4. **SEO Updates**: Wizard keywords

### Component Geliştirme:
```typescript
// Gerekli yeni komponentler:
- WizardInterface
- WizardStep  
- ProgressBar
- StepNavigation
- TemplateSelector
- WizardPreview
```

### State Management:
```typescript
interface WizardState {
  templateId: string;
  currentStep: number;
  answers: Record<string, any>;
  progress: number;
  isComplete: boolean;
}
```

---

## 📝 DEV NOTES

### Kritik Noktalar:
- ❌ **Chat interface YAPMAYACAĞIZ** 
- ✅ **Form-based wizard yapacağız**
- ✅ **Template tabanlı güvenli yaklaşım**
- ✅ **Disclaimer sistemi zorunlu**

### Dosya Yapısı:
```
src/
├── components/
│   ├── wizard/
│   │   ├── WizardInterface.tsx
│   │   ├── WizardStep.tsx
│   │   ├── ProgressBar.tsx
│   │   └── TemplateSelector.tsx
├── templates/
│   ├── employment-contract.json
│   ├── rental-dispute.json
│   └── ...
└── utils/
    ├── wizardUtils.ts
    └── templateEngine.ts
```

---

## 🎯 DEV TASKLERİ

### İlk Sprint (1-2 hafta):
- [ ] Ana sayfa wizard düzeltmeleri
- [ ] Terminology güncellemeleri  
- [ ] "Yakında" bölümü ekleme
- [ ] Beta kayıt formu

### İkinci Sprint (2-4 hafta):
- [ ] Wizard component library
- [ ] İlk template (basit dilekçe)
- [ ] Form validation sistemi
- [ ] Progress tracking

### Üçüncü Sprint (4-6 hafta):
- [ ] 5 wizard template
- [ ] Document generation
- [ ] Disclaimer sistemi
- [ ] Mobile optimization

---

## 📚 KAYNAK DOSYALAR

### Mevcut Planlama Dosyaları:
- `yeni-ozellik-analizi-wizard.md` - Detaylı özellik analizi
- `oncelik-action-plan-wizard.md` - Aşamalı uygulama planı  
- `wizard-vs-chat-analizi.md` - Model karşılaştırması
- `hukuki-koruma-stratejisi.md` - Güvenlik stratejisi
- `mevcut-sayfa-durum-raporu.md` - Düzeltilecek sayfalar

### Önemli Kararlar:
1. **Wizard Model Seçildi** (Chat değil)
2. **Template-based Approach** (AI chat değil)
3. **Pro-only Feature** (₺99/ay)
4. **Form-based Interface** (Conversational değil)

---

## 💡 DEVELOPMENT TİPS

### Do's:
- ✅ Template tabanlı güvenli yaklaşım
- ✅ Step-by-step user guidance
- ✅ Form validation her adımda
- ✅ Progress tracking visible
- ✅ Mobile-first responsive
- ✅ Disclaimer zorunlu

### Don'ts:
- ❌ Chat interface yapma
- ❌ AI conversation simüle etme
- ❌ Unpredictable outputs
- ❌ Disclaimer'siz belge
- ❌ Free plan'da wizard

---

## 🎬 BAŞLANGIC PROMPT

**"Artiklo platformuna Belge Sihirbazı özelliği ekliyoruz. Bu, kullanıcıların adım adım rehberlikle template-based belgeler oluşturabileceği bir wizard sistemi. Chat DEĞİL, form-based wizard interface. İlk olarak mevcut sayfalardaki yanlış 'dilekçe oluşturma' tanıtımlarını 'Belge Sihirbazı' olarak güncelle. Icon: Edit3 → Wand2. Hero text'te 'adım adım' vurgusu yap. Yukarıdaki markdown dosyalarından detaylı bilgileri al."**

---

**HAZIR DURUM:** Tüm stratejik planlar tamamlandı. Kod implementasyonu için hazır! 🧙‍♂️✨