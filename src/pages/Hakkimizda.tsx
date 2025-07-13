const Hakkimizda = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Hakkımızda & Vizyon</h1>
    <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
      Artiklo, hukuki ve bürokratik belgeleri herkesin anlayabileceği sade Türkçeye çevirerek bilgiye erişimi demokratikleştirir. Amacımız, vatandaşların haklarını ve yükümlülüklerini kolayca anlamasını sağlamak, toplumsal güçlenmeye katkıda bulunmaktır.
    </p>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto text-left">
      <li className="flex flex-col items-center gap-3">
        <span className="text-2xl">🌍</span>
        <span>
          <span className="font-semibold">Sosyal Etki:</span> Bilgiye erişimi kolaylaştırarak toplumsal fayda yaratıyoruz.
        </span>
      </li>
      <li className="flex flex-col items-center gap-3">
        <span className="text-2xl">🚀</span>
        <span>
          <span className="font-semibold">Yenilikçi Teknoloji:</span> En güncel yapay zeka modelleriyle sürekli gelişiyoruz.
        </span>
      </li>
    </ul>
  </div>
);

export default Hakkimizda; 