import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Sparkles, ArrowRight, BrainCircuit, ListChecks, FileJson, Redo, Copy, FileText, CheckCircle, Download, BookMarked } from "lucide-react";
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
import ReactMarkdown from 'react-markdown';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useCredits } from "@/hooks/useCredits";
// import TabBar from "@/components/TabBar";

type View = 'input' | 'result';

// Type definitions from smart-analysis function
interface ExtractedEntity {
  entity: string; // e.g., "File Number", "Plaintiff Name", "Amount"
  value: string | number;
}

interface ActionableStep {
  description: string; // e.g., "You can object to this decision within 7 days."
  actionType: 'CREATE_DOCUMENT' | 'INFO_ONLY';
  documentToCreate?: string; // If actionType is CREATE_DOCUMENT. e.g., 'EXECUTION_OBJECTION_PETITION'
}

interface AnalysisResponse {
  simplifiedText: string;
  documentType: string; // e.g., "Payment Order", "Warning Notice", "Unknown"
  summary: string;
  extractedEntities: ExtractedEntity[];
  actionableSteps: ActionableStep[];
  generatedDocument?: {
    addressee: string;
    caseReference: string;
    parties: Array<{ role: string; details: string }>;
    subject: string;
    explanations: string[];
    legalGrounds: string;
    conclusionAndRequest: string;
    attachments?: string[];
    signatureBlock: string;
  };
}

// Legacy entity type for backwards compatibility
type Entity = {
  tip: string;
  değer: string;
  rol?: string;
  açıklama?: string;
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [originalText, setOriginalText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<null | 'flash' | 'pro'>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Legacy states for backwards compatibility
  const [simplifiedText, setSimplifiedText] = useState("");
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
  
  // Document drafting states
  const [draftedText, setDraftedText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Kredi yönetimi
  const { credits, refetch: refetchCredits, setCredits } = useCredits(user?.id);

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
  
  const handleReset = () => {
    setOriginalText("");
    setSelectedFiles([]);
    setAnalysisResult(null);
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

    // Kredi kontrolü
    if (user && credits !== null) {
      if (credits <= 0) {
        toast({
          title: "Kredi Yetersiz",
          description: "Krediniz kalmadı. Lütfen daha sonra tekrar deneyin.",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(model);
    setAnalysisResult(null);
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
      
      // Debug: Log the API response
      console.log('API Response:', data);
      
      // Check if we received structured response
      if (data.simplifiedText && data.documentType && data.extractedEntities && data.actionableSteps) {
        // New structured response
        console.log('Using structured response');
        setAnalysisResult(data as AnalysisResponse);
      } else {
        // Legacy response format - maintain backwards compatibility
        console.log('Using legacy response format');
      setSummary(data.summary || "");
      setSimplifiedText(data.simplifiedText || "");
      setActionPlan(data.actionPlan || "");
      setEntities(Array.isArray(data.entities) ? data.entities : []);
        
        // Legacy entities'i AnalysisResponse formatına dönüştür
        const legacyEntities = Array.isArray(data.entities) ? data.entities : [];
        const convertedEntities = legacyEntities.map((entity: unknown) => {
          const entityObj = entity as { tip?: string; entity?: string; değer?: string; value?: string };
          return {
            entity: entityObj.tip || entityObj.entity || 'Bilinmeyen',
            value: entityObj.değer || entityObj.value || ''
          };
        });
        
        // Legacy response'u AnalysisResponse formatına dönüştür
        setAnalysisResult({
          simplifiedText: data.simplifiedText || "",
          documentType: data.documentType || "Bilinmeyen",
          summary: data.summary || "",
          extractedEntities: convertedEntities,
          actionableSteps: []
        });
      }
      
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
          // Kredi azaltma işlemi
          if (user) {
            const { error: creditError } = await supabase.rpc('decrement_credit', {
              user_id_param: user.id
            });

            if (creditError) {
              console.error('Kredi azaltma hatası:', creditError);
              toast({
                title: "Kredi Azaltma Hatası",
                description: "Krediniz azaltılamadı ama işlem tamamlandı.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Başarılı!",
                description: "Belgeniz başarıyla sadeleştirildi ve kaydedildi. 1 kredi düşüldü.",
              });
            }
          } else {
            toast({
              title: "Başarılı!",
              description: "Belgeniz başarıyla sadeleştirildi ve kaydedildi.",
            });
          }
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
      const textToCopy = analysisResult?.simplifiedText || simplifiedText;
      await navigator.clipboard.writeText(textToCopy);
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

  const handleDownload = async () => {
    try {
      // Metni paragraflara böl
      const paragraphs = draftedText.split('\n').filter(line => line.trim() !== '');
      
      // Word dokümanı oluştur
      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs.map(paragraph => 
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph,
                  size: 24, // 12pt
                  font: 'Calibri',
                }),
              ],
              spacing: {
                after: 200, // Paragraf sonrası boşluk
              },
            })
          ),
        }],
      });

      // Dokümanı blob olarak oluştur
      const blob = await Packer.toBlob(doc);
      
      // İndirme linki oluştur
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = "artiklo-belge.docx";
      document.body.appendChild(element);
      element.click();
      element.remove();
      
      // URL'yi temizle
      URL.revokeObjectURL(element.href);
      
      toast({ title: "Başarılı!", description: "Word belgesi indiriliyor." });
    } catch (error) {
      console.error('Word belgesi oluşturma hatası:', error);
      toast({ 
        title: "Hata", 
        description: "Word belgesi oluşturulurken bir hata oluştu.", 
        variant: "destructive" 
      });
    }
  };

  const handleShowDraft = () => {
    if (analysisResult && analysisResult.generatedDocument) {
      // Dilekçeyi yapısal JSON'dan okunabilir metne dönüştür
      const doc = analysisResult.generatedDocument;
      const partyDetails = doc.parties.map(p => `${p.role}:\n${p.details}`).join('\n\n');
      const explanationsText = doc.explanations.map((p, i) => `${i + 1}. ${p}`).join('\n\n');
      const attachmentsText = doc.attachments ? `EKLER:\n${doc.attachments.join('\n')}` : "";

      const formattedText = [
        doc.addressee.toUpperCase(),
        `\n${doc.caseReference}`,
        `\n${partyDetails}`,
        `\nKONU: ${doc.subject}`,
        `\nAÇIKLAMALAR:\n\n${explanationsText}`,
        `\nHUKUKİ NEDENLER: ${doc.legalGrounds}`,
        `\nSONUÇ VE İSTEM: ${doc.conclusionAndRequest}`,
        `\n${attachmentsText}`,
        `\n${doc.signatureBlock}`
      ].join('\n\n');

      setDraftedText(formattedText);
      setIsModalOpen(true);
      setEditMode(false);
    } else {
      toast({ variant: "destructive", title: "Hata", description: "Gösterilecek bir belge taslağı bulunamadı." });
    }
  };

  // Handle copying to clipboard
  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draftedText);
      toast({
        title: "Kopyalandı!",
        description: "Belge metni panoya başarıyla kopyalandı.",
      });
    } catch (err) {
      toast({
        title: "Kopyalama Hatası",
        description: "Metin kopyalanırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  // Handle downloading as .txt file
  const handleDownloadDraft = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([draftedText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "belge_taslagi.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast({
        title: "İndiriliyor",
        description: "Belge dosyası indirilmeye başlandı.",
      });
    } catch (err) {
      toast({
        title: "İndirme Hatası",
        description: "Dosya indirilirken bir hata oluştu.",
        variant: "destructive",
      });
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
    <div className="flex flex-col items-center pt-4 md:pt-0 pt-[env(safe-area-inset-top)] px-4 md:px-0">
      {showTip && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] bg-primary text-primary-foreground px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-fade-in max-w-[90vw]">
          <span className="text-sm md:text-base">Belgelerinizi yükleyin veya yapıştırın, saniyeler içinde sadeleştirin!</span>
          <button onClick={handleCloseTip} className="ml-2 text-lg font-bold">×</button>
        </div>
      )}
      <Card className="w-full max-w-4xl border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <Textarea
            placeholder="Karmaşık hukuki belgenizi buraya yapıştırın..."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="min-h-[200px] md:min-h-[300px] resize-none text-sm md:text-base"
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
                className="w-full cursor-pointer text-sm md:text-base"
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
        className="mt-6 w-full max-w-4xl text-sm md:text-base"
      >
        {loading === 'flash' ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
        {loading === 'flash' ? 'Sadeleştiriliyor...' : 'Sadeleştir'}
      </Button>
      <Button
        onClick={() => setIsProModalOpen(true)}
        disabled={loading !== null}
        size="lg"
        variant="outline"
        className="mt-3 w-full max-w-4xl"
      >
        <BrainCircuit className="h-5 w-5 mr-2" />
        PRO ile Detaylı İncele
      </Button>
    </div>
  );

  const renderResultView = () => {
    // Render new structured response if available, otherwise fall back to legacy
    if (analysisResult) {
      return (
        <div className="space-y-6 px-4 md:px-0">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Analiz Sonuçları</h2>
            <Button onClick={handleReset} variant="outline" className="flex items-center gap-2 text-sm md:text-base">
              <Redo className="h-4 w-4" />
              Yeni Belge Analiz Et
            </Button>
          </div>
          
          {/* Document Type Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-sm md:text-lg px-3 md:px-4 py-2 text-center">
              <FileText className="h-4 w-4 mr-2" />
              BELGE TÜRÜ: {analysisResult.documentType.toUpperCase()}
            </Badge>
          </div>

                    {/* Belge Özeti - Full Width */}
          {analysisResult.summary && (
            <Card className="border shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <BrainCircuit className="h-6 w-6 text-foreground" />
                  Belge Özeti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p 
                  className="text-base leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: analysisResult.summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                  }} 
                />
              </CardContent>
            </Card>
          )}

          {/* Grid for Side-by-Side Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Simplified Version */}
            <Card className="border shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <ArrowRight className="h-6 w-6 text-foreground" />
                    Anlaşılır Versiyon
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={handleCopy}
                    aria-label="Kopyala"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="whitespace-pre-wrap text-base leading-relaxed">
                {analysisResult.simplifiedText}
              </CardContent>
            </Card>

            {/* Action Plan */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <ListChecks className="h-6 w-6 text-foreground" />
                  Ne Yapmalıyım?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.actionableSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-base leading-relaxed">{step.description}</p>
                        {step.actionType === 'CREATE_DOCUMENT' && (
                          <Button 
                            onClick={handleShowDraft} 
                            className="mt-2"
                          >
                            Gerekli Belgeyi Oluştur
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 'Belgedeki Kilit Bilgiler' Tablosu (Akordiyon İçinde) */}
          {analysisResult && (
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <BookMarked className="h-5 w-5 text-foreground" />
                        Belgedeki Kilit Bilgiler (Detaylar için Tıklayın)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {analysisResult.extractedEntities && analysisResult.extractedEntities.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Bilgi Türü</TableHead>
                              <TableHead>Değer</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {analysisResult.extractedEntities.map((entity, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{entity.entity}</TableCell>
                                <TableCell>{String(entity.value)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookMarked className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Bu belgeden henüz kilit bilgiler çıkarılmadı.</p>
                          <p className="text-sm mt-2">API yanıtında extractedEntities alanı bulunamadı.</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    // Legacy render for backwards compatibility
    return (
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
    </div>
  );
  };

  return (
    <>
      <OnboardingTour open={showOnboarding} onFinish={handleOnboardingFinish} />
      <div className="min-h-screen bg-background flex flex-col items-center pt-20 md:pt-16 px-2 dashboard-container">
        <div className="w-full max-w-5xl flex flex-col items-center mt-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">Hukuki Belgeni Sadeleştir</h2>
          <p className="text-muted-foreground text-center max-w-xl mb-6">
            Karmaşık hukuki metninizi aşağıdaki alana yapıştırın veya dosya olarak yükleyin.
          </p>
        </div>
        <div className="w-full max-w-5xl">
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

      {/* Document Draft Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] md:h-[90vh] h-[95vh] flex flex-col p-4 md:p-6">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-semibold">Belge Taslağınız Hazır</DialogTitle>
            <DialogDescription>
              Aşağıdaki metni inceleyebilir, düzenleyebilir, kopyalayabilir veya indirebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-3 md:p-6 bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
            {editMode ? (
              <div className="flex-1 bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">Düzenleme Modu</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Times New Roman, 12pt</span>
                  </div>
                </div>
                <Textarea 
                  value={draftedText}
                  onChange={(e) => setDraftedText(e.target.value)}
                  className="flex-1 resize-none border-0 focus:ring-0 focus:outline-none p-3 md:p-6 bg-white"
                  style={{ 
                    minHeight: 'calc(60vh - 40px)',
                    fontFamily: 'Times New Roman, serif',
                    fontSize: 'clamp(10pt, 2.5vw, 12pt)',
                    lineHeight: '1.5',
                    color: '#1f2937'
                  }}
                  placeholder="Belge içeriğinizi buraya yazın..."
                />
              </div>
            ) : (
              <div 
                className="flex-1 overflow-y-auto p-3 md:p-6 bg-white leading-relaxed text-gray-800 whitespace-pre-wrap border border-gray-200 rounded-md" 
                style={{ 
                  maxHeight: 'calc(60vh - 40px)',
                  fontFamily: 'Times New Roman, serif', 
                  fontSize: 'clamp(10pt, 2.5vw, 12pt)',
                  lineHeight: '1.5',
                  color: '#1f2937'
                }}
              >
                {draftedText}
              </div>
            )}
          </div>
          
          <div className="flex-shrink-0 space-y-4">
            <p className="text-xs text-muted-foreground px-2">
              *** Yasal Uyarı: Bu belge, Artiklo yazılımı tarafından kullanıcı tarafından sağlanan bilgilere göre oluşturulmuş bir taslaktır. Hukuki bir tavsiye niteliği taşımaz. Bu belgeyi kullanmadan önce mutlaka bir avukata danışmanız önerilir.
            </p>
            
            <DialogFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t gap-3">
              <div>
                {editMode ? (
                  <Button onClick={() => setEditMode(false)} size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                    ✓ Görünümü Kaydet
                  </Button>
                ) : (
                  <Button onClick={() => setEditMode(true)} size="sm" variant="outline" className="w-full sm:w-auto">
                    ✏️ Düzenle
                  </Button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(draftedText);
                    toast({ title: "Başarılı!", description: "Metin panoya kopyalandı." });
                }} className="w-full sm:w-auto">📋 Panoya Kopyala</Button>
                <Button variant="secondary" size="sm" onClick={handleDownload} className="w-full sm:w-auto">📥 İndir (.docx)</Button>
                <Button onClick={() => setIsModalOpen(false)} size="sm" className="w-full sm:w-auto">Kapat</Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;