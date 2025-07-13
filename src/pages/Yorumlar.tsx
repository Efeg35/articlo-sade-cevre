const Yorumlar = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Kullanıcı Yorumları</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
      <div className="bg-white border rounded-lg p-6 flex flex-col items-center shadow-sm">
        <span className="text-lg font-semibold mb-2">“Gerçekten hayat kurtarıcı!”</span>
        <span className="text-sm text-muted-foreground mb-2">Kira sözleşmemi 2 dakikada anladım.</span>
        <span className="text-xs text-muted-foreground">- Ayşe, İstanbul</span>
      </div>
      <div className="bg-white border rounded-lg p-6 flex flex-col items-center shadow-sm">
        <span className="text-lg font-semibold mb-2">“Çok pratik ve güvenli.”</span>
        <span className="text-sm text-muted-foreground mb-2">Belgelerim asla kaydedilmedi, içim rahat.</span>
        <span className="text-xs text-muted-foreground">- Mehmet, Ankara</span>
      </div>
      <div className="bg-white border rounded-lg p-6 flex flex-col items-center shadow-sm">
        <span className="text-lg font-semibold mb-2">“Herkese tavsiye ederim.”</span>
        <span className="text-sm text-muted-foreground mb-2">Resmi yazıları artık korkmadan okuyorum.</span>
        <span className="text-xs text-muted-foreground">- Zeynep, İzmir</span>
      </div>
    </div>
  </div>
);

export default Yorumlar; 