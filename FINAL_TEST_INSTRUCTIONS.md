# 🧪 **FINAL ARTIKLO MCP ENTEGRASYONİ TEST REHBERİ**

## ✅ **HAZİRLIK DURUMU**
- ✅ Infinite loop problemleri çözüldü
- ✅ MCP-Proxy deployed
- ✅ Dual MCP sistemi aktif
- ✅ Tüm UI componentler entegre

## 🎯 **TEST SIRASI**

### **TEST 1: CONSOLE MCP TESTLERİ**

Browser'da `http://localhost:3000` aç, F12 → Console:

```javascript
// 1. MCP Test utilities yüklendi mi?
console.log("MCP utilities:", !!window.testDualMCP, !!window.testIntegration);

// 2. Dual MCP Test (En kritik test)
await testDualMCP()

// 3. Integration Scenario Test  
await testIntegration()

// 4. Full system test
await runMCPTests()
```

**BEKLENİLEN SONUÇLAR:**
```
🎯 === DUAL MCP TEST COMPLETE ===
✅ Yargi-MCP çalışıyor! X karar bulundu
✅ Mevzuat-MCP çalışıyor! X kanun bulundu  
🎉 SUCCESS! Hem Yargi-MCP hem Mevzuat-MCP çalışıyor!

📋 === INTEGRATION TEST COMPLETE ===
📚 X kanun metni bulundu
⚖️ X mahkeme kararı bulundu
🎉 INTEGRATION SUCCESS!
```

---

### **TEST 2: WIZARD UI TESTLERİ**

1. **Wizard Page'e git:**
   ```
   http://localhost:3000/wizard
   ```

2. **Template Seç:**
   - "Kira Artışı İtirazı" template'ini seç
   - Legal references sidebar'ının göründüğünü kontrol et

3. **Form Doldurma Testi:**
   - Form field'larına veri gir
   - **CRITICAL**: Infinite loop warning'leri OLMASINI kontrol et
   - Risk warning'lerin normal şekilde gösterilmesini kontrol et
   - Legal reference popup'larının çalışmasını kontrol et

4. **Court Analysis Modal Test:**
   - "Mahkemeler Ne Diyor?" butonuna tıkla
   - Modal'ın açıldığını kontrol et
   - Tabs'ların çalıştığını kontrol et

---

### **TEST 3: MCP DATA FLOW TESTLERİ**

Console'da manual API testleri:

```javascript
// Mevzuat-MCP Test
await fetch('https://okztpvlipwlgciwspdnl.supabase.co/functions/v1/mcp-proxy', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY'
    },
    body: JSON.stringify({
        server_name: 'mevzuat-mcp',
        tool_name: 'search_mevzuat', 
        arguments: {
            phrase: 'borçlar kanunu',
            page_number: 1,
            page_size: 3
        }
    })
}).then(r => r.json()).then(console.log)
```

```javascript
// Yargi-MCP Test
await fetch('https://okztpvlipwlgciwspdnl.supabase.co/functions/v1/mcp-proxy', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY'
    },
    body: JSON.stringify({
        server_name: 'yargi-mcp',
        tool_name: 'search_bedesten_unified',
        arguments: {
            phrase: 'kira sözleşmesi',
            court_types: ['YARGITAYKARARI'],
            pageNumber: 1
        }
    })
}).then(r => r.json()).then(console.log)
```

---

## 🎯 **BAŞARI KRİTERLERİ**

### ✅ **CONSOLE TESTLER**
- [ ] `testDualMCP()` SUCCESS
- [ ] `testIntegration()` SUCCESS  
- [ ] Her iki MCP server'dan data alınıyor

### ✅ **UI TESTLER**
- [ ] Infinite loop warnings YOK
- [ ] Legal references sidebar çalışıyor
- [ ] Risk warnings gösteriliyor
- [ ] Court analysis modal açılıyor
- [ ] Form validasyonu çalışıyor

### ✅ **DATA FLOW TESTLER**
- [ ] Mevzuat-MCP 200 response
- [ ] Yargi-MCP 200 response
- [ ] Real data received (not fallback)

---

## 🚨 **PROBLEM REPORTING**

Herhangi bir test başarısız olursa:

1. **Console error'larını not al**
2. **Network tab'ında failed request'leri kontrol et** 
3. **Exact error message'ları paylaş**

## 🎉 **FINAL VALIDATION**

Tüm testler başarılı olursa:

**🎯 ARTIKLO MCP ENTEGRASYONİ %100 PRODUCTION READY!**

Kullanıcılar artık:
- Gerçek Yargıtay kararlarından faydalanabilir
- Güncel kanun metinlerini görebilir  
- Anlık risk değerlendirmesi alabilir
- Profesyonel hukuki belgeler oluşturabilir

---

**🚀 HADİ BAŞLA! Test sonuçlarını paylaş!**