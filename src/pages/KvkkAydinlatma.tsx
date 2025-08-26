const KvkkAydinlatma = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-white p-8 border rounded-lg shadow-sm">
      <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-900">Kişisel Verilerin Korunması Hakkında Aydınlatma Metni</h1>
      <p className="text-sm text-gray-500 text-center mb-8">Son Güncelleme: 25 Temmuz 2024</p>

      <div className="space-y-6 text-gray-700">
        <p>Artiklo olarak, kişisel verilerinizin güvenliğine büyük önem veriyoruz. Bu kapsamda, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca sizleri bilgilendirmek isteriz.</p>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">1. Veri Sorumlusu</h2>
          <p>
            KVKK uyarınca, kişisel verileriniz; veri sorumlusu olarak Artiklo tarafından aşağıda açıklanan kapsamda işlenebilecektir.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">2. Kişisel Verilerin İşlenme Amaçları</h2>
          <p>Toplanan kişisel verileriniz, aşağıdaki amaçlar doğrultusunda işlenmektedir:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Hizmetlerimizi sunabilmek ve platforma erişiminizi sağlamak (hesap oluşturma, giriş yapma).</li>
            <li>Yüklediğiniz belgeleri yapay zeka ile analiz ederek sadeleştirme hizmetini gerçekleştirmek.</li>
            <li>Platformun performansını ve güvenliğini sağlamak, iyileştirmek.</li>
            <li>Gerekli durumlarda sizinle iletişim kurmak (hesap doğrulama vb.).</li>
            <li>Yasal yükümlülüklerimizi yerine getirmek.</li>
            <li><strong>Mobil Uygulama Özel:</strong> Cihaz kamerası ve dosya sistemi erişimi (yalnızca belge yükleme için).</li>
            <li><strong>Mobil Uygulama Özel:</strong> Push notification gönderebilmek (opsiyonel, kullanıcı onayı ile).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">2.1. Mobil Uygulama Veri İşleme Politikası</h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📱 iOS/Android Uygulama Özel Koşulları:</h3>
            <ul className="list-disc list-inside space-y-2 text-blue-700">
              <li><strong>Cihaz İzinleri:</strong> Kamera ve dosya erişimi izinleri yalnızca belge yükleme işlemi için kullanılır.</li>
              <li><strong>Veri Yerelliği:</strong> Hiçbir kişisel veri cihazda kalıcı olarak saklanmaz.</li>
              <li><strong>Anlık İşleme:</strong> Yüklenen belgeler anlık olarak işlenir ve hemen silinir.</li>
              <li><strong>Ağ Güvenliği:</strong> Tüm veri transferleri HTTPS ile şifrelenir.</li>
              <li><strong>Üçüncü Taraf Entegrasyonu:</strong> Apple/Google hizmetleri dışında veri paylaşımı yapılmaz.</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">3. İşlenen Kişisel Veri Türleri</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Kimlik ve İletişim Bilgileri:</strong> E-posta adresiniz, şifreniz (şifrelenmiş olarak).</li>
            <li><strong>İçerik Verileri:</strong> Hizmetin sağlanması amacıyla platforma yüklediğiniz metin, dosya veya görseller. <strong>Bu veriler, işleme anı dışında KESİNLİKLE sunucularımızda saklanmaz, kaydedilmez ve işlem bittikten sonra derhal ve kalıcı olarak silinir.</strong></li>
            <li><strong>İşlem Güvenliği Bilgileri:</strong> IP adresi, tarayıcı bilgileri, çerezler.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
          <p>
            Kişisel verileriniz, platforma kayıt olmanız, form doldurmanız veya belge yüklemeniz gibi otomatik yöntemlerle toplanır. Bu verilerin işlenmesinin hukuki sebebi, KVKK Madde 5 uyarınca “bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması” ve “veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi”dir.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">5. Kişisel Verilerin Aktarılması</h2>
          <p>
            Kişisel verileriniz, yasal zorunluluklar dışında hiçbir şekilde üçüncü kişi veya kurumlarla paylaşılmaz. Yüklediğiniz belgeler, analiz edilmesi için yalnızca altyapı sağlayıcımızın (Google Gemini API) yapay zeka sistemine güvenli bir bağlantı üzerinden gönderilir.
          </p>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-semibold text-green-800 mb-2">🔒 Veri Güvenliği Taahhütlerimiz:</h3>
            <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
              <li>Google Gemini API ile veri paylaşımı yalnızca analiz için geçicidir</li>
              <li>API sağlayıcısı verilerinizi saklamaz (Google taahhüdü)</li>
              <li>Veri transferi AES-256 şifreleme ile korunur</li>
              <li>AB GDPR ve Türkiye KVKK standartlarına uygunluk</li>
              <li>Sıfır veri saklama politikası (Zero data retention)</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">6. Veri Sahibinin Hakları (KVKK Madde 11)</h2>
          <p>Veri sahibi olarak, KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme,</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>KVKK'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
            <li>Verilerinizin aktarıldığı üçüncü kişilere yukarıda belirtilen düzeltme, silme veya yok etme işlemlerinin bildirilmesini isteme,</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
            <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
          </ul>
          <p className="mt-2">
            Bu haklarınızı kullanmak için <a href="mailto:destek@artiklo.legal" className="text-blue-600 hover:underline">destek@artiklo.legal</a> adresinden bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">7. Çerez Politikası</h2>
          <p>
            Platformumuz, kullanıcı deneyimini iyileştirmek ve hizmetin temel işlevlerini (oturum yönetimi gibi) sağlamak amacıyla çerezler kullanmaktadır. Bu çerezler, kişisel veri toplamaz. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default KvkkAydinlatma; 