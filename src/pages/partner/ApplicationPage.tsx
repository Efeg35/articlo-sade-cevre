import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const advantages = [
  {
    icon: "✅",
    title: "İhtiyaç Anındaki Müvekkile Doğrudan Ulaşın",
    desc: "Reklamlarla veya genel arama motorlarıyla değil, tam olarak o an hukuki bir sorun yaşayan ve çözüm arayan potansiyel müvekkillerle buluşun. Artiklo'da belgesini analiz eden ve bir uzmana danışması gerektiğini öğrenen kullanıcılar, doğrudan onaylı partner listemize yönlendirilir."
  },
  {
    icon: "📈",
    title: "Marka Bilinirliği ve Dijital Ayak İzinizi Güçlendirin",
    desc: "Türkiye'nin en hızlı büyüyen teknoloji platformlarından birinde yer alarak dijital görünürlüğünüzü artırın. Markanızın 'yenilikçi', 'teknolojiye açık' ve 'erişilebilir' olarak konumlanmasını sağlayın."
  },
  {
    icon: "🤝",
    title: "Türkiye'nin Öncü LegalTech Ekosistemine Dahil Olun",
    desc: "Geleceği şekillendiren avukatların ve hukuk bürolarının yer aldığı seçkin bir ağın parçası olun. Sektördeki son gelişmelerden haberdar olun ve mesleğin dijital dönüşümüne öncülük edin."
  },
  {
    icon: "🏅",
    title: "Güven ve Prestij Sağlayan 'Artiklo Onaylı Partner' Rozeti",
    desc: "Profilinizde ve kendi web sitenizde kullanabileceğiniz bu rozet, müvekkillerinize teknolojiye hakim, şeffaf ve güvenilir bir büro olduğunuzu gösteren bir kalite mührüdür."
  }
];

const ApplicationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] flex items-start justify-center py-12 px-2">
      <div className="w-full max-w-5xl bg-white/90 rounded-2xl shadow-xl p-8 md:p-16 border border-gray-100 mt-8 md:mt-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight text-left">
          Dijital Çağın Hukuk Bürosu Olun:<br className="hidden md:block" /> Artiklo Partner Programı
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8 text-left max-w-3xl">
          Her gün binlerce kullanıcı, hukuki bir sorunla ilk karşılaştığı anda Artiklo'yu kullanıyor. İkinci adımda ise bir uzmana, yani size ihtiyaç duyuyorlar.<br /><br />
          Artiklo, vatandaşlar için bir ilk yardım çantasıdır. Ancak pek çok hukuki mesele, profesyonel danışmanlık ve temsil gerektirir.<br /><br />
          <span className="font-semibold text-gray-800">"Artiklo Onaylı Partner Programı"</span>, Türkiye'nin dört bir yanından hukuki desteğe en çok ihtiyaç duyulan anda potansiyel müvekkillerle, alanında uzman, yenilikçi hukuk bürolarını bir araya getiren köprüdür.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left mt-10">Artiklo Partneri Olmanın Stratejik Avantajları</h2>
        <p className="text-gray-500 mb-8 text-left max-w-2xl text-base">
          Bu program, sadece bir rehberde listelenmekten çok daha fazlasıdır. Bu, büronuz için bir büyüme ve prestij stratejisidir.
        </p>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-10">
          {advantages.map((adv, i) => (
            <div key={i} className="flex items-start gap-4 bg-[#f6f8fa] border border-gray-200 rounded-xl p-5 shadow-sm">
              <span className="text-3xl mt-1 select-none">{adv.icon}</span>
              <div>
                <div className="font-semibold text-gray-900 mb-1 text-base md:text-lg">{adv.title}</div>
                <div className="text-gray-600 text-sm md:text-base leading-relaxed">{adv.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 mb-8 text-left text-xl font-semibold text-gray-800">
          Geleceğin Hukuk Anlayışında Yerinizi Alın<br />
          <span className="font-normal text-base text-gray-600">Müvekkillerin sizi bulma şeklini değiştirin ve büronuzu bir sonraki seviyeye taşıyın.</span>
        </div>
        <div className="flex justify-start">
          <Link to="/partner/kayit-ol">
            <Button size="lg" className="text-lg px-8 py-4">
              Başvurunuzu Başlatın
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage; 