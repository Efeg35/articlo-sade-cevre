import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, FileText, X, Sparkles, ArrowRight, BrainCircuit, ListChecks, FileJson, Redo } from "lucide-react";
import type { User } from "@supabase/supabase-js";

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
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [summary, setSummary] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [view, setView] = useState<View>('input');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Hata",
        description: "Çıkış yaparken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };
  
  const handleReset = () => {
    setOriginalText("");
    setSelectedFiles([]);
    setSimplifiedText("");
    setSummary("");
    setActionPlan("");
    setEntities([]);
    setView('input');
  };

  const handleSimplify = async () => {
    if (!originalText.trim() && selectedFiles.length === 0) {
      toast({
        title: "Giriş Eksik",
        description: "Lütfen sadeleştirmek için bir metin girin veya dosya yükleyin.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSummary("");
    setActionPlan("");
    setEntities([]);
    setSimplifiedText("");
    try {
      let body: FormData | { text: string; model: string };
      let originalTextForDb = originalText;
      const model = 'gemini-1.5-pro-latest'; 

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
        await supabase.from('documents').insert({
          user_id: user.id,
          original_text: originalTextForDb,
          simplified_text: data.simplifiedText || "Sadeleştirilmiş metin yok.",
        });
      }

      toast({
        title: "Başarılı!",
        description: "Belgeniz başarıyla sadeleştirildi.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Bir hata oluştu. Lütfen tekrar deneyin.";
      toast({
        title: "Sadeleştirme Hatası",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  const renderInputView = () => (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Hukuki Belgeni Sadeleştir
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Karmaşık hukuki metninizi aşağıdaki alana yapıştırın veya dosya olarak yükleyin.
        </p>
      </div>
      <Card className="w-full max-w-2xl border shadow-sm">
        <CardContent className="p-6">
          <Textarea
            placeholder="Karmaşık hukuki belgenizi buraya yapıştırın..."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="min-h-[300px] resize-none"
            disabled={loading}
          />
          <div className="my-4 text-center text-xs uppercase text-muted-foreground">Veya</div>
            <label htmlFor="file-upload" className="block w-full">
              <input
                id="file-upload"
                type="file"
                accept="image/*,application/pdf,.doc,.docx"
                multiple
                className="hidden"
                disabled={loading}
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedFiles(Array.from(e.target.files));
                  }
                }}
              />
              <Button
                asChild
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                <span>Dosya Seç</span>
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
                      disabled={loading}
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
        onClick={handleSimplify}
        disabled={loading}
        size="lg"
        className="mt-6 w-full max-w-2xl"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
        Sadeleştir
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
              <CardTitle className="flex items-center gap-3 text-xl">
                <BrainCircuit className="h-6 w-6 text-foreground" />
                Belge Özeti
              </CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </Card>
        </div>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <ArrowRight className="h-6 w-6 text-foreground" />
              Anlaşılır Versiyon
            </CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap">{simplifiedText}</CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <ListChecks className="h-6 w-6 text-foreground" />
              Eylem Planı
            </CardTitle>
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
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <FileText className="h-7 w-7 text-foreground" />
              <h1 className="text-2xl font-bold text-foreground">Artiklo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Çıkış</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {view === 'input' ? renderInputView() : renderResultView()}
      </main>
    </div>
  );
};

export default Dashboard;