const NedenArtiklo = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Neden Artiklo?</h1>
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl mx-auto text-left">
      <li className="flex flex-col items-center gap-3">
        <span className="text-2xl">🏆</span>
        <span>
          <span className="font-semibold">Türkiye’de İlk ve Tek:</span> Hukuki belge sadeleştirmede öncü platform.
        </span>
      </li>
      <li className="flex flex-col items-center gap-3">
        <span className="text-2xl">🤖</span>
        <span>
          <span className="font-semibold">Yapay Zeka Destekli:</span> En güncel AI teknolojisiyle hızlı ve doğru sonuçlar.
        </span>
      </li>
      <li className="flex flex-col items-center gap-3">
        <span className="text-2xl">👥</span>
        <span>
          <span className="font-semibold">Kullanıcı Odaklı:</span> Sade, anlaşılır ve herkesin kullanabileceği arayüz.
        </span>
      </li>
    </ul>
  </div>
);

export default NedenArtiklo; 