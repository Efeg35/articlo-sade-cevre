const KullaniciSozlesmesi = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="bg-white p-8 border rounded-lg shadow-sm">
      <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-900">Kullanıcı Sözleşmesi</h1>
      <p className="text-sm text-gray-500 text-center mb-8">Son Güncelleme: 25 Temmuz 2024</p>

      <div className="space-y-6 text-gray-700">
        <p>Lütfen platformumuzu kullanmadan önce bu kullanıcı sözleşmesini dikkatlice okuyunuz. Bu platformu kullanarak, aşağıda belirtilen şartları kabul etmiş sayılırsınız.</p>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">1. Taraflar ve Tanımlar</h2>
          <p>
            Bu sözleşme, "Artiklo" (bundan sonra "Hizmet Sağlayıcı" veya "Platform" olarak anılacaktır) ile Artiklo platformunu kullanan "Kullanıcı" arasında akdedilmiştir.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">2. Hizmetin Tanımı ve Kapsamı</h2>
          <p>
            Artiklo, kullanıcılar tarafından yüklenen hukuki ve bürokratik metinleri yapay zeka teknolojisi kullanarak analiz eden ve bu metinleri daha anlaşılır, sadeleştirilmiş bir dilde özetleyen bir platformdur. Hizmet, metinlerin içeriğini basitleştirmeyi ve ana noktaları vurgulamayı amaçlar.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">3. Sorumluluğun Reddi ve Hukuki Uyarı</h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="font-bold text-red-800 text-lg">
              ⚠️ ÖNEMLİ: Bu uygulama hiçbir şekilde hukuki danışmanlık hizmeti sağlamaz.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-red-700">
              <li><strong>Yapay Zeka Sınırlamaları:</strong> Bu platform AI teknolojisi kullanır ve hata yapabilir, yanlış veya eksik bilgi üretebilir.</li>
              <li><strong>Hukuki Geçerlik Yok:</strong> Üretilen içerikler hiçbir şekilde yasal belge niteliği taşımaz.</li>
              <li><strong>Profesyonel Destek Gerekli:</strong> Herhangi bir yasal işlem yapmadan önce MUTLAKA avukata danışın.</li>
              <li><strong>Resmi İşlemler:</strong> Mahkeme, icra, vergi dairesi gibi resmi işlemlerde kullanmayın.</li>
              <li><strong>Tam Sorumluluk Reddi:</strong> Bu uygulamanın kullanımından doğacak tüm riskler kullanıcıya aittir.</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">3.1. Mobil Uygulama Özel Koşulları</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Yaş Sınırı:</strong> Bu uygulama 18 yaş ve üzeri kullanıcılar içindir.</li>
            <li><strong>Cihaz İzinleri:</strong> Kamera, dosya erişimi gibi izinler yalnızca belge yükleme için kullanılır.</li>
            <li><strong>İnternets Bağlantısı:</strong> Uygulama internet bağlantısı gerektirir, çevrimdışı çalışmaz.</li>
            <li><strong>App Store Uyumluluğu:</strong> Apple App Store kurallarına uygun olarak geliştirilmiştir.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">4. Kullanıcı Yükümlülükleri</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Kullanıcı, platforma yüklediği belgelerin içeriğinden ve bu belgeleri işleme hakkına sahip olduğundan tek başına sorumludur.</li>
            <li>Kullanıcı, platformu yasa dışı, ahlaka aykırı veya üçüncü şahısların haklarını (telif hakkı, mahremiyet vb.) ihlal edecek şekilde kullanamaz.</li>
            <li>Kullanıcı, hesap bilgilerinin (e-posta, şifre) güvenliğinden kendisi sorumludur.</li>
            <li>Kullanıcı, 18 yaşından büyük olduğunu veya yasal vasisinin onayını aldığını beyan eder.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">5. Gizlilik ve Veri Güvenliği</h2>
          <p>
            Kullanıcı gizliliği bizim için esastır. Yüklenen belgeler, yalnızca yapay zeka tarafından işlenmek amacıyla geçici olarak kullanılır ve işlem tamamlandıktan sonra sistemlerimizden kalıcı olarak silinir. Belgeleriniz hiçbir şekilde saklanmaz, depolanmaz veya üçüncü taraflarla paylaşılmaz. Detaylı bilgi için lütfen <a href="/kvkk-aydinlatma" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">KVKK Aydınlatma Metni</a>'mizi inceleyiniz.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">6. Fikri Mülkiyet</h2>
          <p>
            Artiklo platformunun kendisi, tasarımı, metinleri, logoları ve kodları dahil ancak bunlarla sınırlı olmamak üzere tüm unsurları Hizmet Sağlayıcı'ya aittir ve fikri mülkiyet yasalarıyla korunmaktadır. Kullanıcılar, yükledikleri belgelere ilişkin tüm fikri mülkiyet haklarını saklı tutar.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">7. Hizmetin Askıya Alınması ve Fesih</h2>
          <p>
            Hizmet Sağlayıcı, bu sözleşmeye aykırı hareket eden veya platformun güvenliğini tehlikeye atan kullanıcıların hizmete erişimini önceden bildirimde bulunmaksızın askıya alma veya tamamen sonlandırma hakkını saklı tutar.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">8. Sözleşme Değişiklikleri</h2>
          <p>
            Hizmet Sağlayıcı, bu sözleşmeyi herhangi bir zamanda tek taraflı olarak değiştirme hakkını saklı tutar. Değişiklikler platformda yayınlandığı anda yürürlüğe girer. Platformu kullanmaya devam ederek güncel sözleşmeyi kabul etmiş sayılırsınız.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">9. Uygulanacak Hukuk ve Yetkili Mahkeme</h2>
          <p>
            Bu sözleşmenin yorumlanmasında ve uygulanmasında Türkiye Cumhuriyeti yasaları geçerlidir. Bu sözleşmeden doğabilecek her türlü uyuşmazlığın çözümünde İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default KullaniciSozlesmesi; 