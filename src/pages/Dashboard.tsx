import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, FileText, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [originalText, setOriginalText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [summary, setSummary] = useState("");
  const [actionPlan, setActionPlan] = useState("");
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
        originalTextForDb = `[Files: ${selectedFiles.map(f => f.name).join(", ")}]`;
      } else {
        body = { text: originalText };
      }

      const { data, error } = await supabase.functions.invoke('simplify-text', { body });

      if (error) {
        const errorMsg = typeof error === 'string' ? error : (error?.message || 'Bilinmeyen bir hata oluştu.');
        throw new Error(errorMsg);
      }

      setSummary(data.summary);
      setSimplifiedText(data.simplifiedText);
      setActionPlan(data.actionPlan);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/20">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Hukuki Belgeni Sadeleştir
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Karmaşık hukuki metni sol tarafa yapıştırın ve "Sadeleştir" butonuna tıklayarak 
            anlaşılır hale getirin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Column */}
          <Card className="lg:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Orijinal Metin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Karmaşık hukuki belgenizi buraya yapıştırın..."
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                className="min-h-[400px] resize-none"
                disabled={loading}
              />
              {/* Fotoğraf Yükleme Bileşeni */}
              <div className="mt-4">
                <label htmlFor="file-upload" className="block w-full">
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
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
                    className="w-full flex justify-center items-center gap-2"
                  >
                    <span>
                      Veya Bir Fotoğraf Yükle
                    </span>
                  </Button>
                </label>
                {selectedFiles.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {selectedFiles.map((file, idx) => (
                      <li key={file.name + file.size + file.lastModified} className="flex items-center bg-muted px-3 py-1 rounded text-sm">
                        <span className="truncate max-w-[180px]">{file.name}</span>
                        <button
                          type="button"
                          className="ml-2 text-muted-foreground hover:text-destructive"
                          onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                          aria-label="Dosya seçimini kaldır"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Center Button Column */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <Button
              onClick={handleSimplify}
              disabled={loading || (!originalText.trim() && selectedFiles.length === 0)}
              variant="success"
              size="lg"
              className="px-8 py-4 text-lg h-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sadeleştiriliyor...
                </>
              ) : (
                "Sadeleştir"
              )}
            </Button>
          </div>

          {/* Output Column */}
          <Card className="lg:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Sadeleştirilmiş Metin
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summary && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-semibold text-blue-900 mb-2">Belge Özeti</h3>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              )}
              {simplifiedText ? (
                <div className="min-h-[400px] p-4 bg-accent/50 rounded-md border">
                  <h3 className="font-semibold text-primary mb-2">Anlaşılması Kolaylaştırılmış Versiyon</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {simplifiedText}
                  </p>
                </div>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-muted rounded-md">
                  <p className="text-muted-foreground text-center">
                    Sadeleştirilmiş metin burada görünecek
                  </p>
                </div>
              )}
              {actionPlan && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="font-semibold text-yellow-900 mb-2">Şimdi Ne Yapmalıyım?</h3>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{actionPlan}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>ÖNEMLİ UYARI:</strong> Artiklo tarafından sunulan bilgiler hukuki danışmanlık yerine geçmez. 
            Yasal bir işlem yapmadan önce mutlaka yetkin bir avukata danışmanız gerekmektedir.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;