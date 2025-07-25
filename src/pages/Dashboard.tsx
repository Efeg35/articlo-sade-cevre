import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Sparkles, ArrowRight, BrainCircuit, ListChecks, FileJson, Redo, Copy } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Capacitor } from "@capacitor/core";
import OnboardingTour from "@/components/OnboardingTour";
// import TabBar from "@/components/TabBar";

type View = 'input' | 'result';
type Entity = {
  tip: string;
  değer: string;
  rol?: string;
  açıklama?: string;
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [originalText, setOriginalText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [loading, setLoading] = useState<null | 'flash' | 'pro'>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [summary, setSummary] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [view, setView] = useState<View>('input');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      // Sadece mobilde onboarding kontrolü
      if (Capacitor.isNativePlatform()) {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, has_completed_onboarding")
          .eq("id", session.user.id)
          .single();
        if (!error && data && data.has_completed_onboarding === false) {
          setShowOnboarding(true);
          setProfileId(data.id);
        }
      }
    };

    checkAuthAndOnboarding();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      const seen = localStorage.getItem("artiklo_dashboard_tip_seen");
      setShowTip(!seen);
    }
  }, []);
  const handleCloseTip = () => {
    localStorage.setItem("artiklo_dashboard_tip_seen", "1");
    setShowTip(false);
  };

  // handleSignOut artık Navbar içinde, burada gereksiz
  
  const handleReset = () => {
    setOriginalText("");
    setSelectedFiles([]);
    setSimplifiedText("");
    setSummary("");
    setActionPlan("");
    setEntities([]);
    setView('input');
  };

  const handleSimplify = async (model: 'flash' | 'pro') => {
    if (!originalText.trim() && selectedFiles.length === 0) {
      toast({
        title: "Giriş Eksik",
        description: "Lütfen sadeleştirmek için bir metin girin veya dosya yükleyin.",
        variant: "destructive",
      });
      return;
    }
    setLoading(model);
    setSummary("");
    setActionPlan("");
    setEntities([]);
    setSimplifiedText("");
    try {
      let body: FormData | { text: string; model: string };
      let originalTextForDb = originalText;
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append('files', file));
        formData.append('model', model);
        if (originalText.trim()) formData.append('text', originalText);
        body = formData;
        originalTextForDb = `[Files: ${selectedFiles.map(f => f.name).join(", ")}] ${originalText}`;
      } else {
        body = { text: originalText, model };
      }
      const { data, error } = await supabase.functions.invoke('simplify-text', { body });
      if (error) throw new Error(error.message || 'Bilinmeyen bir fonksiyon hatası oluştu.');
      setView('result');
      setSummary(data.summary || "");
      setSimplifiedText(data.simplifiedText || "");
      setActionPlan(data.actionPlan || "");
      setEntities(Array.isArray(data.entities) ? data.entities : []);
      if (user) {
        const { error: insertError } = await supabase.from('documents').insert({
          user_id: user.id,
          original_text: originalTextForDb,
          simplified_text: data.simplifiedText || "Sadeleştirilmiş metin yok.",
          summary: data.summary || "",
          action_plan: data.actionPlan || "",
          entities: data.entities || null,
        });
        if (insertError) {
          toast({
            title: "Kayıt Hatası",
            description: insertError.message || "Belge Supabase'a kaydedilemedi.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Başarılı!",
            description: "Belgeniz başarıyla sadeleştirildi ve kaydedildi.",
          });
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Bir hata oluştu. Lütfen tekrar deneyin.";
      toast({
        title: "Sadeleştirme Hatası",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast({ title: "Kopyalandı!", description: "Özet panoya başarıyla kopyalandı." });
    } catch (err) {
      toast({ title: "Kopyalama Hatası", description: "Özet kopyalanırken bir hata oluştu.", variant: "destructive" });
    }
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(simplifiedText);
      toast({ title: "Kopyalandı!", description: "Metin panoya başarıyla kopyalandı." });
    } catch (err) {
      toast({ title: "Kopyalama Hatası", description: "Metin kopyalanırken bir hata oluştu.", variant: "destructive" });
    }
  };
  const handleCopyActionPlan = async () => {
    try {
      await navigator.clipboard.writeText(actionPlan);
      toast({ title: "Kopyalandı!", description: "Eylem planı panoya başarıyla kopyalandı." });
    } catch (err) {
      toast({ title: "Kopyalama Hatası", description: "Eylem planı kopyalanırken bir hata oluştu.", variant: "destructive" });
    }
  };

  // Onboarding bitince Supabase Edge Function çağır
  const handleOnboardingFinish = async () => {
    setShowOnboarding(false);
    if (profileId) {
      try {
        await supabase.functions.invoke('complete-onboarding', { body: {} });
      } catch (e) {
        // Hata yönetimi
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20 md:pt-16 pt-[env(safe-area-inset-top)]">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  const renderInputView = () => (
    <div className="flex flex-col items-center pt-4 md:pt-0 pt-[env(safe-area-inset-top)]">
      {showTip && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-fade-in">
          <span>Belgelerinizi yükleyin veya yapıştırın, saniyeler içinde sadeleştirin!</span>
          <button onClick={handleCloseTip} className="ml-2 text-lg font-bold">×</button>
        </div>
      )}
      <Card className="w-full max-w-2xl border shadow-sm">
        <CardContent className="p-6">
          <Textarea
            placeholder="Karmaşık hukuki belgenizi buraya yapıştırın..."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="min-h-[300px] resize-none"
            disabled={loading !== null}
          />
          <div className="my-4 text-center text-xs uppercase text-muted-foreground">Veya</div>
            <label htmlFor="file-upload" className="block w-full">
              <input
                id="file-upload"
                type="file"
                accept="image/*,application/pdf,.doc,.docx,.txt,.rtf"
                multiple
                className="hidden"
                disabled={loading !== null}
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files);
                    const supportedTypes = [
                      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
                      'application/pdf',
                      'application/msword',
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      'text/plain',
                      'application/rtf'
                    ];
                    
                    const validFiles = files.filter(file => 
                      supportedTypes.includes(file.type) || 
                      file.name.toLowerCase().endsWith('.doc') ||
                      file.name.toLowerCase().endsWith('.docx') ||
                      file.name.toLowerCase().endsWith('.pdf') ||
                      file.name.toLowerCase().endsWith('.txt') ||
                      file.name.toLowerCase().endsWith('.rtf')
                    );
                    
                    if (validFiles.length !== files.length) {
                      toast({
                        title: "Desteklenmeyen Dosya Türü",
                        description: "Sadece PDF, DOC, DOCX, TXT, RTF ve görüntü dosyaları desteklenmektedir.",
                        variant: "destructive",
                      });
                    }
                    
                    setSelectedFiles(validFiles);
                  }
                }}
              />
              <Button
                asChild
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                disabled={loading !== null}
              >
                <span>📄 Dosya Seç (PDF, DOC, DOCX, TXT, Görüntü)</span>
              </Button>
            </label>
            {selectedFiles.length > 0 && (
              <ul className="mt-4 space-y-2">
                {selectedFiles.map((file, idx) => (
                  <li key={`${file.name}-${idx}`} className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm">
                    <span className="truncate font-medium">{file.name}</span>
                    <button
                      type="button"
                      className="ml-2 text-muted-foreground hover:text-destructive disabled:opacity-50"
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                      aria-label="Dosyayı kaldır"
                      disabled={loading !== null}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
        </CardContent>
      </Card>
      <Button
        onClick={() => handleSimplify('flash')}
        disabled={loading !== null}
        size="lg"
        className="mt-6 w-full max-w-2xl"
      >
        {loading === 'flash' ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
        {loading === 'flash' ? 'Sadeleştiriliyor...' : 'Sadeleştir'}
      </Button>
      <Button
        onClick={() => setIsProModalOpen(true)}
        disabled={loading !== null}
        size="lg"
        variant="outline"
        className="mt-3 w-full max-w-2xl"
      >
        <BrainCircuit className="h-5 w-5 mr-2" />
        PRO ile Detaylı İncele
      </Button>
    </div>
  );

  const renderResultView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-foreground">Sadeleştirme Sonuçları</h2>
        <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
            <Redo className="h-4 w-4" />
            Yeni Belge Sadeleştir
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <BrainCircuit className="h-6 w-6 text-foreground" />
                  Belge Özeti
                </CardTitle>
                {summary && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={handleCopySummary}
                    aria-label="Kopyala Özeti"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </Card>
        </div>

        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <ArrowRight className="h-6 w-6 text-foreground" />
                Anlaşılır Versiyon
              </CardTitle>
              {simplifiedText && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={handleCopy}
                  aria-label="Kopyala"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap">{simplifiedText}</CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <ListChecks className="h-6 w-6 text-foreground" />
                Eylem Planı
              </CardTitle>
              {actionPlan && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={handleCopyActionPlan}
                  aria-label="Kopyala Eylem Planı"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap">{actionPlan}</CardContent>
        </Card>
      </div>
      
      {entities.length > 0 && (
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <FileJson className="h-6 w-6 text-foreground" />
                Kilit Varlıklar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entities.map((entity, index) => (
                  <li key={index} className="p-3 bg-muted/50 rounded-lg text-sm">
                    <span className="font-semibold text-foreground">{entity.tip}: </span>
                    <span>{entity.değer}</span>
                    {entity.rol && <span className="text-xs text-muted-foreground ml-2">({entity.rol})</span>}
                    {entity.açıklama && <p className="text-xs text-muted-foreground mt-1">{entity.açıklama}</p>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
      )}
      {/*
      <Card className="border-2 border-primary/40 bg-primary/5 mt-8">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Profesyonel Destek Mi Arıyorsunuz?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Bu analiz hukuki bir danışmanlık yerine geçmez. Dilerseniz, şehrinizdeki Artiklo Onaylı Hukuk Büroları Rehberi'ne göz atarak uzman avukatlarla iletişime geçebilirsiniz.
          </p>
          <Button asChild size="lg" className="w-full md:w-auto">
            <Link to="/rehber">Rehbere Git</Link>
          </Button>
        </CardContent>
      </Card>
      */}
    </div>
  );

  return (
    <>
      <OnboardingTour open={showOnboarding} onFinish={handleOnboardingFinish} />
      <div className="min-h-screen bg-background flex flex-col items-center pt-16 px-2">
        <div className="w-full max-w-2xl flex flex-col items-center mt-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">Hukuki Belgeni Sadeleştir</h2>
          <p className="text-muted-foreground text-center max-w-xl mb-6">
            Karmaşık hukuki metninizi aşağıdaki alana yapıştırın veya dosya olarak yükleyin.
          </p>
        </div>
        <div className="w-full max-w-2xl">
          {view === 'input' ? renderInputView() : renderResultView()}
        </div>
      </div>
    {/* PRO Coming Soon Modal */}
      <Dialog open={isProModalOpen} onOpenChange={setIsProModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Artiklo PRO Çok Yakında!</DialogTitle>
            <DialogDescription>
              'PRO ile Detaylı İncele' gibi gelişmiş özellikler, yakında sunulacak olan Artiklo PRO abonelerine özeldir. PRO özellikleri kullanıma sunulduğunda ilk siz haberdar olmak ve özel lansman indirimlerinden faydalanmak ister misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProModalOpen(false)}>Kapat</Button>
            <Button
              onClick={async () => {
                try {
                  const { data, error } = await supabase.functions.invoke('add-to-waitlist');
                  setIsProModalOpen(false);
                  if (error) {
                    toast({ title: "Bir hata oluştu", description: error.message || "Bekleme listesine eklenirken hata oluştu.", variant: "destructive" });
                  } else if (data?.message) {
                    toast({ title: data.message });
                  } else {
                    toast({ title: "Harika! Listeye eklendiniz." });
                  }
                } catch (err) {
                  setIsProModalOpen(false);
                  toast({ title: "Bir hata oluştu", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
                }
              }}
            >
              Evet, Beni Listeye Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;