const Senaryolar = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Gerçek Hayat Senaryoları</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
      <div className="bg-muted/50 border rounded-lg p-6 flex flex-col items-center">
        <span className="text-3xl mb-2">👴</span>
        <span className="font-semibold mb-1">Emekli Ahmet Bey</span>
        <span className="text-sm text-muted-foreground text-center">Veraset ilamındaki terimleri anlamadığı için endişeleniyordu. Artiklo ile haklarını ve sonraki adımları kolayca öğrendi.</span>
      </div>
      <div className="bg-muted/50 border rounded-lg p-6 flex flex-col items-center">
        <span className="text-3xl mb-2">🎓</span>
        <span className="font-semibold mb-1">Öğrenci Ayşe</span>
        <span className="text-sm text-muted-foreground text-center">Kira kontratındaki teknik maddeleri Artiklo sayesinde sade Türkçe ile anladı, güvenle imzaladı.</span>
      </div>
      <div className="bg-muted/50 border rounded-lg p-6 flex flex-col items-center">
        <span className="text-3xl mb-2">💼</span>
        <span className="font-semibold mb-1">KOBİ Sahibi Murat</span>
        <span className="text-sm text-muted-foreground text-center">Vergi dairesinden gelen ödeme emrinin aciliyetini Artiklo ile kavradı, süreci zamanında yönetti.</span>
      </div>
    </div>
  </div>
);

export default Senaryolar; 