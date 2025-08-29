import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Newsletter from "./Newsletter";
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Scale,
    Shield,
    FileText,
    ArrowRight
} from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const productLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/templates", label: "Şablonlar" },
        { href: "/fiyatlandirma", label: "Fiyatlandırma" },
        { href: "/nasil-calisir", label: "Nasıl Çalışır?" }
    ];

    const supportLinks = [
        { href: "/sss", label: "Sık Sorulan Sorular" },
        { href: "/iletisim", label: "İletişim" },
        { href: "/blog", label: "Blog" },
        { href: "/rehber", label: "Rehberler" }
    ];

    const legalLinks = [
        { href: "/kvkk-aydinlatma", label: "KVKK Aydınlatma Metni" },
        { href: "/kullanici-sozlesmesi", label: "Kullanıcı Sözleşmesi" },
        { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" }
    ];

    const companyLinks = [
        { href: "/hakkimizda", label: "Hakkımızda" },
        { href: "/neden-artiklo", label: "Neden Artiklo?" },
        { href: "/yorumlar", label: "Kullanıcı Yorumları" },
        { href: "/senaryolar", label: "Kullanım Senaryoları" }
    ];

    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Scale className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold text-white">ARTIKLO</span>
                        </div>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Karmaşık hukuki belgeleri yapay zeka teknolojisi ile anında sadeleştiren,
                            Türkiye'nin önde gelen legal tech platformu. Hukuki metinleri herkes için
                            anlaşılır hale getiriyoruz.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">50K+</div>
                                <div className="text-xs text-slate-500">Analiz Edilen Belge</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">10K+</div>
                                <div className="text-xs text-slate-500">Mutlu Kullanıcı</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">%99.9</div>
                                <div className="text-xs text-slate-500">Doğruluk Oranı</div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-primary" />
                                <a href="mailto:info@artiklo.com" className="hover:text-white transition-colors">
                                    info@artiklo.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>+90 (xxx) xxx xx xx</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>İstanbul, Türkiye</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Ürün</h3>
                        <ul className="space-y-2">
                            {productLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.href}
                                        className="text-sm hover:text-white transition-colors flex items-center gap-1 group"
                                    >
                                        {link.label}
                                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Destek</h3>
                        <ul className="space-y-2">
                            {supportLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.href}
                                        className="text-sm hover:text-white transition-colors flex items-center gap-1 group"
                                    >
                                        {link.label}
                                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Şirket</h3>
                        <ul className="space-y-2 mb-6">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.href}
                                        className="text-sm hover:text-white transition-colors flex items-center gap-1 group"
                                    >
                                        {link.label}
                                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Legal Links */}
                        <h3 className="text-white font-semibold mb-4">Yasal</h3>
                        <ul className="space-y-2">
                            {legalLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.href}
                                        className="text-sm hover:text-white transition-colors flex items-center gap-1 group"
                                    >
                                        {link.label}
                                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-t border-slate-800">
                <div className="container mx-auto px-4 py-8">
                    <Newsletter variant="footer" />
                </div>
            </div>

            {/* Social Media & Trust Badges */}
            <div className="border-t border-slate-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Trust Badges */}
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <span>KVKK Uyumlu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span>SSL Güvenlik</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Scale className="h-4 w-4 text-primary" />
                                <span>%100 Güvenilir</span>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400">Bizi takip edin:</span>
                            <div className="flex gap-2">
                                <a
                                    href="https://linkedin.com/company/artiklo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://twitter.com/artiklo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <Twitter className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://instagram.com/artiklo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <Instagram className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://facebook.com/artiklo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-slate-800 bg-slate-950">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-slate-500">
                        <div>
                            © {currentYear} Artiklo. Tüm hakları saklıdır.
                        </div>
                        <div className="flex items-center gap-4">
                            <span>Türkiye'de tasarlanmış ve geliştirilmiştir.</span>
                            <span className="text-red-500">♥</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="bg-slate-950 border-t border-slate-800">
                <div className="container mx-auto px-4 py-3">
                    <p className="text-xs text-slate-600 text-center leading-relaxed">
                        <strong>Yasal Uyarı:</strong> Artiklo hiçbir şekilde hukuki tavsiye, danışmanlık veya görüş vermez.
                        Platformumuz yapay zeka teknolojisi kullanır ve hata yapabilir.
                        Herhangi bir yasal karar almadan önce mutlaka kvalifiye bir hukuk uzmanına danışınız.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;