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
    // Check authentication and set up auth listener
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
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/auth");
        } else if (session) {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Çıkış yapıldı",
        description: "Başarıyla çıkış yaptınız.",
      });
    } catch (error) {
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
        title: "Metin veya dosya gerekli",
        description: "Lütfen sadeleştirilecek metni girin veya bir fotoğraf yükleyin.",
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
      let body: FormData | { text: string };
      let originalTextForDb = originalText;
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });
        if (originalText.trim()) {
          formData.append('text', originalText);
        }
        body = formData;
        originalTextForDb = `[Files: ${selectedFiles.map(f => f.name).join(", ")}] ${originalText}`;
      } else {
        body = { text: originalText };
      }

      const { data, error } = await supabase.functions.invoke('simplify-text', { body });

      if (error) {
        const errorMsg = typeof error === 'string' ? error : (error?.message || 'Bilinmeyen bir hata oluştu.');
        throw new Error(errorMsg);
      }
      
      setView('result');
      setSummary(data.summary);
      setSimplifiedText(data.simplifiedText);
      setActionPlan(data.actionPlan);
      setEntities(Array.isArray(data.entities) ? data.entities : []);

      // Save to database
      if (user && data.simplifiedText) {
        const { error: dbError } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            original_text: originalTextForDb,
            simplified_text: data.simplifiedText,
          });
        if (dbError) {
          console.error('Database error:', dbError);
        }
      }

      toast({
        title: "Başarılı!",
        description: "Metin başarıyla sadeleştirildi.",
      });
    } catch (error: unknown) {
      console.error('Simplification error:', error);
      const errorMsg = error instanceof Error ? error.message : "Metin sadeleştirilemedi. Lütfen tekrar deneyin.";
      toast({
        title: "Hata",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const renderInputView = () => (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Hukuki Belgeni Sadeleştir
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Karmaşık hukuki metninizi aşağıdaki alana yapıştırın veya dosya olarak yükleyin.
        </p>
      </div>
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-6">
          <Textarea
            placeholder="Karmaşık hukuki belgenizi buraya yapıştırın..."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="min-h-[300px] resize-none"
            disabled={loading}
          />
          <div className="my-4 text-center text-muted-foreground">VEYA</div>
            <label htmlFor="file-upload" className="block w-full">
              <input
                id="file-upload"
                type="file"
                accept="image/*,application/pdf,.doc,.docx"
                multiple
                className="hidden"
                disabled={loading}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedFiles((prev) => [
                      ...prev,
                      ...Array.from(e.target.files).filter(
                        (file) => !prev.some((f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)
                      )
                    ]);
                  }
                }}
              />
              <Button
                asChild
                type="button"
                variant="outline"
                className="w-full flex justify-center items-center gap-2 cursor-pointer"
                disabled={loading}
              >
                <span>
                  Dosya Yükle
                </span>
              </Button>
            </label>
            {selectedFiles.length > 0 && (
              <ul className="mt-4 space-y-2">
                {selectedFiles.map((file, idx) => (
                  <li key={`${file.name}-${idx}`} className="flex items-center justify-between bg-muted px-3 py-2 rounded text-sm">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      className="ml-2 text-muted-foreground hover:text-destructive disabled:opacity-50"
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                      aria-label="Dosya seçimini kaldır"
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
        className="mt-6 w-full max-w-2xl text-lg py-6"
      >
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
        ) : (
          <Sparkles className="h-6 w-6 mr-2" />
        )}
        Sadeleştir
      </Button>
    </div>
  );

  const renderResultView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">Sadeleştirme Sonuçları</h2>
        <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
            <Redo className="h-4 w-4" />
            Yeni Belge Sadeleştir
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BrainCircuit className="h-6 w-6 text-primary" />
            Belge Özeti
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ArrowRight className="h-6 w-6 text-primary" />
            Anlaşılması Kolaylaştırılmış Versiyon
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-blue max-w-none">{simplifiedText}</CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ListChecks className="h-6 w-6 text-primary" />
            Şimdi Ne Yapmalıyım?
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-blue max-w-none">{actionPlan}</CardContent>
      </Card>
      
      {entities.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileJson className="h-6 w-6 text-primary" />
                Kilit Varlık Tespiti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entities.map((entity, index) => (
                  <li key={index} className="p-3 bg-muted rounded-md text-sm">
                    <span className="font-semibold text-primary">{entity.tip}: </span>
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/20">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-primary">Artiklo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Hoş geldiniz, {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {view === 'input' ? renderInputView() : renderResultView()}
      </main>
    </div>
  );
};

export default Dashboard;