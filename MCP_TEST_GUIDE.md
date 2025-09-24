# 🧪 **ARTIKLO MCP ENTEGRASYON TEST REHBERİ**

## **1. BROWSER CONSOLE HAZIRLIKLARI**

**1.1 Site Açma:**
```bash
# Dev server zaten çalışıyor
http://localhost:3000 adresini aç
```

**1.2 Console Açma:**
- `F12` → Console tab
- Ya da `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)

## **2. 🎯 DUAL MCP SERVER TESTLERİ**

**2.1 Comprehensive System Test:**
```javascript
// Tüm sistem testlerini çalıştır
await runMCPTests()
```

**2.2 Dual MCP Test (Yargi + Mevzuat):**
```javascript
// İkili MCP test - En önemli test
await testDualMCP()
```

**2.3 Integration Scenario Test:**
```javascript
// Gerçek senaryo testi (kira sözleşmesi)
await testIntegration()
```

## **3. 🔍 HEALTH CHECK TESTLERİ**

**3.1 Quick Health Check:**
```javascript
await MCPTest.quickTest()
```

**3.2 Detailed Health Check:**
```javascript
await MCPTest.checkHealth()
```

## **4. 📋 UI COMPONENT TESTLERİ**

**4.1 Wizard Page'e Git:**
```
http://localhost:3000/wizard-beta
```

**4.2 Template Seçimi:**
- "Kira Artışı İtirazı" template'ini seç
- Legal References sidebar'ının gelip gelmediğini kontrol et

**4.3 Wizard Step Testleri:**
- Form field'larına veri gir
- Real-time risk warning'lerin göründüğünü kontrol et
- Legal reference popup'larının çalıştığını kontrol et

**4.4 Court Analysis Modal Test:**
- "Mahkemeler Ne Diyor?" butonuna tıkla
- Modal'ın açıldığını ve tabs'ların çalıştığını kontrol et

## **5. 🔬 MANUEL DATA VALIDATION**

**5.1 Mevzuat-MCP Test:**
```javascript
await fetch('/api/mcp-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        server: 'mevzuat-mcp',
        tool: 'search_mevzuat',
        args: {
            phrase: 'borçlar kanunu',
            page_number: 1,
            page_size: 3
        }
    })
}).then(r => r.json()).then(console.log)
```

**5.2 Yargi-MCP Test:**
```javascript
await fetch('/api/mcp-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        server: 'yargi-mcp',
        tool: 'search_bedesten_unified',
        args: {
            phrase: 'kira sözleşmesi',
            court_types: ['YARGITAYKARARI'],
            pageNumber: 1
        }
    })
}).then(r => r.json()).then(console.log)
```

## **6. ✅ BAŞARI KRİTERLERİ**

**BEKLENENEN SONUÇLAR:**

1. **Dual MCP Test:**
   ```
   ✅ Yargi-MCP çalışıyor! X karar bulundu
   ✅ Mevzuat-MCP çalışıyor! X kanun bulundu
   🎉 SUCCESS! Hem Yargi-MCP hem Mevzuat-MCP çalışıyor!
   ```

2. **Integration Test:**
   ```
   📚 X kanun metni bulundu
   ⚖️ X mahkeme kararı bulundu
   🎉 INTEGRATION SUCCESS!
   ```

3. **UI Components:**
   - Legal references sidebar görünüyor
   - Risk warnings real-time çalışıyor
   - Court analysis modal açılıyor
   - Legal reference popup'lar çalışıyor

## **7. 🚨 HATA AYIKLAMA**

**Eğer testler başarısız olursa:**

1. **Network tab'ını kontrol et:**
   - `/api/mcp-proxy` endpoint'i çalışıyor mu?
   - 500/404 hataları var mı?

2. **Console error'larını kontrol et:**
   - JavaScript hataları var mı?
   - Component render hataları var mı?

3. **Supabase Functions:**
   ```bash
   # Supabase edge functions çalışıyor mu kontrol et
   supabase functions list
   ```

## **8. 📊 RAPOR HAZIRLA**

Test sonuçlarını not al:
- ✅/❌ Dual MCP Test
- ✅/❌ Integration Test  
- ✅/❌ UI Components
- ✅/❌ Manual API Tests

**Test tamamlandıktan sonra sonuçları paylaş!**

Bu testler ARTIKLO MCP entegrasyonunun tam olarak çalıştığını doğrulayacak. Herhangi bir sorun olursa detayları paylaş, hemen çözelim!

## **9. 🔄 TESTLERİN SIRASI**

**Önce API testleri, sonra UI testleri:**

1. `await testDualMCP()` - En kritik test
2. `await testIntegration()` - Senaryo testi  
3. UI Component testleri - Wizard sayfasında
4. Manuel validation testleri - Specific API calls

**Bu sırayı takip et ki sorunları hızla tespit edebilirsin!**