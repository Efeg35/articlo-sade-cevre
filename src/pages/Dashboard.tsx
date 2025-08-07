import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
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
import { Loader2, X, Sparkles, ArrowRight, BrainCircuit, ListChecks, FileJson, Redo, Copy, FileText, CheckCircle, Download, BookMarked, Shield, Camera, Image, FileUp } from "lucide-react";
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
import { documentAnalysisSchema, validateAndSanitizeInput, rateLimiter, validateFileSecurity } from "@/lib/validation";
import { useSessionSecurity } from "@/lib/sessionSecurity";
import { useNativeFileUpload } from "@/hooks/useNativeFileUpload";
import ErrorBoundary from "@/components/ErrorBoundary";

type View = 'input' | 'result';

// Type definitions from smart-analysis function
interface ExtractedEntity {
  entity: string;
  value: string | number;
}

interface ActionableStep {
  description: string;
  actionType: 'CREATE_DOCUMENT' | 'INFO_ONLY';
  documentToCreate?: string;
}

interface RiskItem {
  riskType: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  article?: string;
  legalReference?: string;
  recommendation?: string;
}

interface AnalysisResponse {
  simplifiedText: string;
  documentType: string;
  summary: string;
  extractedEntities: ExtractedEntity[];
  actionableSteps: ActionableStep[];
  riskItems?: RiskItem[];
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
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = session?.user || null;

  // Comprehensive logging sistemi
  useEffect(() => {
    console.log('[Dashboard] Component mounted');
    console.log('[Dashboard] Initial state:', {
      user: user?.email,
      session: !!session,
      platform: Capacitor.getPlatform(),
      isNative: Capacitor.isNativePlatform()
    });

    return () => {
      console.log('[Dashboard] Component unmounted');
    };
  }, [session, user?.email]);

  // Session security hook
  useSessionSecurity();

  const [originalText, setOriginalText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<null | 'flash' | 'pro'>(null);

  // Native file upload hook
  const {
    selectedFiles: nativeFiles,
    isUploading: isNativeUploading,
    takePhoto,
    selectFromGallery,
    selectDocument,
    removeFile: removeNativeFile,
    clearFiles: clearNativeFiles,
  } = useNativeFileUpload();

  // Legacy file state for web fallback
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Legacy states for backwards compatibility
  const [simplifiedText, setSimplifiedText] = useState("");
  const [summary, setSummary] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [entities, setEntities] = useState<Entity[]>([]);

  const [view, setView] = useState<View>('input');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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

  // Credits management
  const [credits, setCredits] = useState<number | null>(999);

  // Fallback UI for critical error
  const [criticalError, setCriticalError] = useState<string | null>(null);
  const [apiFallbackMode, setApiFallbackMode] = useState(false);
  const [nativeFeatureFallback, setNativeFeatureFallback] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  // 🔧 BUTON ÇALIŞMA TESTİ İÇİN DEBUG FONKSIYONLARI
  const safeTakePhoto = async () => {
    console.log('🔥 safeTakePhoto ÇAĞRILDI!');
    console.log('[Dashboard] takePhoto fonksiyon tipi:', typeof takePhoto);

    try {
      if (typeof takePhoto !== 'function') {
        throw new Error('takePhoto fonksiyonu tanımlanmamış');
      }

      console.log('[Dashboard] takePhoto çağrılıyor...');
      await takePhoto();
      console.log('[Dashboard] ✅ Fotoğraf çekildi başarılı');
      toast({
        title: 'Başarılı!',
        description: 'Fotoğraf çekme işlemi tamamlandı.'
      });
    } catch (err) {
      console.error('[Dashboard] ❌ Fotoğraf çekme hatası:', err);
      toast({
        title: 'Fotoğraf Hatası',
        description: `Fotoğraf çekilirken hata: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`,
        variant: 'destructive'
      });
    }
  };

  const safeSelectFromGallery = async () => {
    console.log('🔥 safeSelectFromGallery ÇAĞRILDI!');
    console.log('[Dashboard] selectFromGallery fonksiyon tipi:', typeof selectFromGallery);

    try {
      if (typeof selectFromGallery !== 'function') {
        throw new Error('selectFromGallery fonksiyonu tanımlanmamış');
      }

      console.log('[Dashboard] selectFromGallery çağrılıyor...');
      await selectFromGallery();
      console.log('[Dashboard] ✅ Galeriden seçim başarılı');
      toast({
        title: 'Başarılı!',
        description: 'Galeriden dosya seçimi tamamlandı.'
      });
    } catch (err) {
      console.error('[Dashboard] ❌ Galeri seçme hatası:', err);
      toast({
        title: 'Galeri Hatası',
        description: `Galeriden dosya seçilirken hata: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`,
        variant: 'destructive'
      });
    }
  };

  const safeSelectDocument = async () => {
    console.log('🔥 safeSelectDocument ÇAĞRILDI!');
    console.log('[Dashboard] selectDocument fonksiyon tipi:', typeof selectDocument);

    try {
      if (typeof selectDocument !== 'function') {
        throw new Error('selectDocument fonksiyonu tanımlanmamış');
      }

      console.log('[Dashboard] selectDocument çağrılıyor...');
      await selectDocument();
      console.log('[Dashboard] ✅ Doküman seçimi başarılı');
      toast({
        title: 'Başarılı!',
        description: 'Doküman seçimi tamamlandı.'
      });
    } catch (err) {
      console.error('[Dashboard] ❌ Doküman seçme hatası:', err);
      toast({
        title: 'Doküman Hatası',
        description: `Doküman seçilirken hata: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`,
        variant: 'destructive'
      });
    }
  };

  // Hook durumu debug
  useEffect(() => {
    console.log('🔍 Hook durumu kontrol:', {
      nativeFiles: nativeFiles?.length || 0,
      isNativeUploading,
      takePhoto: typeof takePhoto,
      selectFromGallery: typeof selectFromGallery,
      selectDocument: typeof selectDocument
    });
  }, [nativeFiles, isNativeUploading, takePhoto, selectFromGallery, selectDocument]);

  // Error recovery mechanism
  const handleErrorRecovery = useCallback(async () => {
    console.log('[Dashboard] Attempting error recovery');
    setIsRecovering(true);
    setCriticalError(null);
    setApiFallbackMode(false);
    setNativeFeatureFallback(false);

    try {
      setOriginalText("");
      setSelectedFiles([]);
      setAnalysisResult(null);
      setSimplifiedText("");
      setSummary("");
      setActionPlan("");
      setEntities([]);
      clearNativeFiles();
      setView('input');
      console.log('[Dashboard] Error recovery completed');
    } catch (error) {
      console.error('[Dashboard] Error recovery failed:', error);
      setCriticalError('Kurtarma işlemi başarısız oldu. Lütfen sayfayı yenileyin.');
    } finally {
      setIsRecovering(false);
    }
  }, [clearNativeFiles]);

  // API fallback mechanism
  const handleApiFallback = useCallback(async (text: string) => {
    console.log('[Dashboard] Using API fallback mode');
    setApiFallbackMode(true);

    try {
      const simplifiedText = `Sadeleştirilmiş metin: ${text.substring(0, 500)}...`;
      const summary = `Özet: Bu belge ${text.length} karakter içermektedir.`;

      setSimplifiedText(simplifiedText);
      setSummary(summary);
      setView('result');

      toast({
        title: "Fallback Modu",
        description: "Gelişmiş analiz kullanılamıyor, basit sadeleştirme yapıldı.",
      });
    } catch (error) {
      console.error('[Dashboard] API fallback error:', error);
      toast({
        title: "Fallback Hatası",
        description: "Basit sadeleştirme de başarısız oldu.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Native feature fallback
  const handleNativeFeatureFallback = useCallback(() => {
    console.log('[Dashboard] Using native feature fallback');
    setNativeFeatureFallback(true);
    toast({
      title: "Web Modu",
      description: "Native özellikler kullanılamıyor, web fallback kullanılıyor.",
    });
  }, [toast]);

  // Sayfa yüklendiğinde scroll pozisyonunu sıfırla
  useEffect(() => {
    console.log('[Dashboard] Resetting scroll position');
    window.scrollTo(0, 0);
  }, []);

  // Auth check and onboarding
  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      if (!session || !user) {
        console.log('[Dashboard] No session or user, skipping auth check');
        return;
      }

      console.log('[Dashboard] Dashboard mounted, user:', user.email);

      try {
        let isNative = false;
        try {
          isNative = Capacitor.isNativePlatform();
          console.log('[Dashboard] Platform check:', isNative ? 'Native' : 'Web');
        } catch (err) {
          console.error('[Dashboard] Capacitor.isNativePlatform() kontrolünde hata:', err);
          isNative = false;
        }

        if (isNative) {
          console.log('[Dashboard] Checking onboarding status for user:', user.id);
          const { data, error } = await supabase
            .from("profiles")
            .select("id, has_completed_onboarding")
            .eq("id", user.id)
            .single();

          console.log('[Dashboard] Profile query result:', { data, error });

          if (!error && data && data.has_completed_onboarding === false) {
            console.log('[Dashboard] User has not completed onboarding, showing onboarding');
            setShowOnboarding(true);
            setProfileId(data.id);
          } else if (error) {
            console.error('[Dashboard] Error fetching profile:', error);
          }
        }
      } catch (err) {
        console.error('[Dashboard] Error in checkAuthAndOnboarding:', err);
      }
    };

    checkAuthAndOnboarding();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          console.log('[Dashboard] Auth state change:', _event, session?.user?.email || 'no session');
          if (!session) {
            console.log('[Dashboard] No session, navigating to auth');
            navigate("/auth");
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (err) {
      console.error('[Dashboard] Error setting up auth state listener:', err);
    }
  }, [navigate, supabase, session, user]);

  useEffect(() => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      const seen = localStorage.getItem("artiklo_dashboard_tip_seen");
      console.log('[Dashboard] Mobile tip check:', !seen);
      setShowTip(!seen);
    }
  }, []);

  const handleCloseTip = () => {
    console.log('[Dashboard] Closing tip');
    localStorage.setItem("artiklo_dashboard_tip_seen", "1");
    setShowTip(false);
  };

  const handleReset = () => {
    console.log('[Dashboard] Resetting form state');
    setOriginalText("");
    setSelectedFiles([]);
    setAnalysisResult(null);
    setSimplifiedText("");
    setSummary("");
    setActionPlan("");
    setEntities([]);
    clearNativeFiles();
    setView('input');
  };

  // Modified handleSimplify with fallback mechanisms
  const handleSimplify = async (model: 'flash' | 'pro') => {
    console.log('[Dashboard] Starting simplification with model:', model);

    setValidationErrors({});

    const userIdentifier = user?.id || 'anonymous';
    console.log('[Dashboard] Rate limiting check for user:', userIdentifier);

    if (!rateLimiter.isAllowed(userIdentifier)) {
      console.log('[Dashboard] Rate limit exceeded');
      toast({
        title: "Çok Fazla İstek",
        description: "Çok fazla istek gönderdiniz. Lütfen 15 dakika bekleyin.",
        variant: "destructive",
      });
      return;
    }

    console.log('[Dashboard] Validating input');
    const sanitizedText = validateAndSanitizeInput(originalText);

    if (!sanitizedText.trim() && selectedFiles.length === 0) {
      console.log('[Dashboard] No input provided');
      toast({
        title: "Giriş Eksik",
        description: "Lütfen sadeleştirmek için bir metin girin veya dosya yükleyin.",
        variant: "destructive",
      });
      return;
    }

    const validationResult = documentAnalysisSchema.safeParse({
      text: sanitizedText || undefined,
      files: selectedFiles
    });

    if (!validationResult.success) {
      console.log('[Dashboard] Validation failed:', validationResult.error.errors);
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });
      setValidationErrors(errors);
      toast({
        title: "Giriş Hatası",
        description: "Lütfen giriş bilgilerinizi kontrol edin.",
        variant: "destructive",
      });
      return;
    }

    console.log('[Dashboard] Starting API call');
    setLoading(model);
    setAnalysisResult(null);
    setSummary("");
    setActionPlan("");
    setEntities([]);
    setSimplifiedText("");

    try {
      let body: FormData | { text: string; model: string };
      let originalTextForDb = sanitizedText;

      const allFiles = [...selectedFiles, ...nativeFiles];
      console.log('[Dashboard] Total files to process:', allFiles.length);

      if (allFiles.length > 0) {
        console.log('[Dashboard] Processing files');
        const formData = new FormData();

        selectedFiles.forEach((file) => formData.append('files', file));

        nativeFiles.forEach((fileData) => {
          const blob = new Blob([fileData.data], { type: fileData.type });
          const file = new File([blob], fileData.name, { type: fileData.type });
          formData.append('files', file);
        });

        formData.append('model', model);
        if (sanitizedText.trim()) formData.append('text', sanitizedText);
        body = formData;
        originalTextForDb = `[Files: ${allFiles.map(f => f.name).join(", ")}] ${sanitizedText}`;
      } else {
        body = { text: sanitizedText, model };
      }

      console.log('[Dashboard] Calling simplify-text function');
      const { data, error } = await supabase.functions.invoke('simplify-text', { body });

      if (error) {
        console.error('[Dashboard] API error:', error);

        if (sanitizedText.trim()) {
          await handleApiFallback(sanitizedText);
          return;
        } else {
          throw new Error(error.message || 'Bilinmeyen bir fonksiyon hatası oluştu.');
        }
      }

      console.log('[Dashboard] API response received');
      setView('result');

      console.log('[Dashboard] API Response:', data);

      if (data.simplifiedText && data.documentType && data.extractedEntities && data.actionableSteps) {
        console.log('[Dashboard] Using structured response');
        setAnalysisResult(data as AnalysisResponse);
      } else {
        console.log('[Dashboard] Using legacy response format');
        setSummary(data.summary || "");
        setSimplifiedText(data.simplifiedText || "");
        setActionPlan(data.actionPlan || "");
        setEntities(Array.isArray(data.entities) ? data.entities : []);

        const legacyEntities = Array.isArray(data.entities) ? data.entities : [];
        const convertedEntities = legacyEntities.map((entity: unknown) => {
          const entityObj = entity as { tip?: string; entity?: string; değer?: string; value?: string };
          return {
            entity: entityObj.tip || entityObj.entity || 'Bilinmeyen',
            value: entityObj.değer || entityObj.value || ''
          };
        });

        setAnalysisResult({
          simplifiedText: data.simplifiedText || "",
          documentType: data.documentType || "Bilinmeyen",
          summary: data.summary || "",
          extractedEntities: convertedEntities,
          actionableSteps: []
        });
      }

      if (user) {
        console.log('[Dashboard] Saving document to database');
        const { error: insertError } = await supabase.from('documents').insert({
          user_id: user.id,
          original_text: originalTextForDb,
          simplified_text: data.simplifiedText || "Sadeleştirilmiş metin yok.",
          summary: data.summary || "",
          action_plan: data.actionPlan || "",
          entities: data.entities || null,
        });

        if (insertError) {
          console.error('[Dashboard] Database insert error:', insertError);
          toast({
            title: "Kayıt Hatası",
            description: insertError.message || "Belge Supabase'a kaydedilemedi.",
            variant: "destructive",
          });
        } else {
          console.log('[Dashboard] Document saved successfully');
          if (user) {
            console.log('[Dashboard] Decrementing credits');
            const { error: creditError } = await supabase.rpc('decrement_credit', {
              user_id_param: user.id
            });

            if (creditError) {
              console.error('[Dashboard] Credit decrement error:', creditError);
              toast({
                title: "Kredi Azaltma Hatası",
                description: "Krediniz azaltılamadı ama işlem tamamlandı.",
                variant: "destructive",
              });
            } else {
              console.log('[Dashboard] Credits decremented successfully');
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
      console.error('[Dashboard] Simplification error:', error);

      if (sanitizedText.trim()) {
        await handleApiFallback(sanitizedText);
      } else {
        const message = error instanceof Error ? error.message : "Bir hata oluştu. Lütfen tekrar deneyin.";
        toast({
          title: "Sadeleştirme Hatası",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      console.log('[Dashboard] Simplification completed');
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

  const handleOnboardingFinish = async () => {
    console.log('[Dashboard] Finishing onboarding');
    setShowOnboarding(false);
    if (profileId) {
      try {
        console.log('[Dashboard] Calling complete-onboarding function');
        await supabase.functions.invoke('complete-onboarding', { body: {} });
        console.log('[Dashboard] Onboarding completed successfully');
      } catch (e) {
        console.error('[Dashboard] Onboarding completion error:', e);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const paragraphs = draftedText.split('\n').filter(line => line.trim() !== '');

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs.map(paragraph =>
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph,
                  size: 24,
                  font: 'Calibri',
                }),
              ],
              spacing: {
                after: 200,
              },
            })
          ),
        }],
      });

      const blob = await Packer.toBlob(doc);

      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = "artiklo-belge.docx";
      document.body.appendChild(element);
      element.click();
      element.remove();

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

  // State change logging
  useEffect(() => {
    console.log('[Dashboard] View changed to:', view);
  }, [view]);

  useEffect(() => {
    console.log('[Dashboard] Loading state changed to:', loading);
  }, [loading]);

  useEffect(() => {
    console.log('[Dashboard] Analysis result updated:', !!analysisResult);
  }, [analysisResult]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20 md:pt-16 pt-[env(safe-area-inset-top)]">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  // Critical error fallback UI
  if (criticalError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Dashboard Yüklenemedi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-destructive">{criticalError}</p>
            <div className="flex gap-2">
              <Button onClick={handleErrorRecovery} disabled={isRecovering}>
                {isRecovering ? 'Kurtarılıyor...' : 'Kurtarmayı Dene'}
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline">
                Sayfayı Yenile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Modified renderInputView with fallback indicators
  const renderInputView = () => (
    <div className="flex flex-col items-center pt-4 md:pt-0 pt-[env(safe-area-inset-top)] px-4 md:px-0">
      {/* Fallback mode indicators */}
      {apiFallbackMode && (
        <div className="w-full max-w-4xl mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ Fallback modu aktif: Gelişmiş analiz kullanılamıyor
          </p>
        </div>
      )}

      {nativeFeatureFallback && (
        <div className="w-full max-w-4xl mb-4 p-3 bg-blue-100 border border-blue-400 rounded-lg">
          <p className="text-blue-800 text-sm">
            ℹ️ Web modu: Native özellikler kullanılamıyor
          </p>
        </div>
      )}

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

          {/* Native Platform için Dosya Yükleme Butonları */}
          {Capacitor.isNativePlatform() ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  onClick={safeTakePhoto}
                  disabled={loading !== null || isNativeUploading}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-12"
                >
                  {isNativeUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">📸 Fotoğraf Çek</span>
                </Button>

                <Button
                  onClick={safeSelectFromGallery}
                  disabled={loading !== null || isNativeUploading}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-12"
                >
                  {isNativeUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Image className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">🖼️ Galeriden Seç</span>
                </Button>

                <Button
                  onClick={safeSelectDocument}
                  disabled={loading !== null || isNativeUploading}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-12"
                >
                  {isNativeUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileUp className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">📄 Dosya Seç</span>
                </Button>
              </div>

              {/* 🧪 DEBUG TEST BUTONU - GEÇİCİ */}
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 mb-2">🧪 Debug Test (Geçici)</p>
                <Button
                  onClick={() => {
                    console.log('🔥 TEST BUTONU ÇALIŞIYOR!');
                    toast({
                      title: 'Test Başarılı!',
                      description: 'Buton event handling çalışıyor.'
                    });
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm"
                  size="sm"
                >
                  🧪 EVENT TEST BUTONU
                </Button>
              </div>

              {/* Native Dosyalar Listesi */}
              {nativeFiles.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {nativeFiles.map((file, idx) => (
                    <li key={`native-${file.name}-${idx}`} className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm">
                      <span className="truncate font-medium">{file.name}</span>
                      <button
                        type="button"
                        className="ml-2 text-muted-foreground hover:text-destructive disabled:opacity-50"
                        onClick={() => removeNativeFile(idx)}
                        aria-label="Dosyayı kaldır"
                        disabled={loading !== null}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            /* Web Platform için Fallback */
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

                    const validFiles = files.filter(file => {
                      const securityCheck = validateFileSecurity(file);
                      if (!securityCheck.isValid) {
                        toast({
                          title: "Güvenlik Uyarısı",
                          description: securityCheck.error || "Dosya güvenlik kontrolünden geçemedi.",
                          variant: "destructive",
                        });
                        return false;
                      }
                      return true;
                    });

                    if (validFiles.length !== files.length) {
                      toast({
                        title: "Güvenlik Kontrolü",
                        description: "Bazı dosyalar güvenlik nedeniyle reddedildi.",
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
          )}

          {/* Web Dosyalar Listesi */}
          {selectedFiles.length > 0 && (
            <ul className="mt-4 space-y-2">
              {selectedFiles.map((file, idx) => (
                <li key={`web-${file.name}-${idx}`} className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm">
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

          {/* Anlaşılır Versiyon - Full Width */}
          <Card className="border shadow-sm mb-6">
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

          {/* Risk Analysis Section */}
          {analysisResult.riskItems && analysisResult.riskItems.length > 0 && (
            <Card className="border shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Shield className="h-6 w-6 text-destructive" />
                  Riskli Maddeler/Durumlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.riskItems
                    .sort((a, b) => {
                      const severityOrder = { high: 0, medium: 1, low: 2 };
                      return severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder];
                    })
                    .map((risk, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${risk.severity === 'high' ? 'bg-destructive/10 border-destructive' :
                        risk.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                          'bg-orange-500/10 border-orange-500'
                        }`}>
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${risk.severity === 'high' ? 'bg-destructive' :
                            risk.severity === 'medium' ? 'bg-yellow-500' :
                              'bg-orange-500'
                            }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h4 className="font-semibold text-sm">{risk.riskType}</h4>
                              {risk.article && (
                                <Badge variant="outline" className="text-xs">
                                  {risk.article}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed mb-2">{risk.description}</p>
                            {risk.legalReference && (
                              <p className="text-xs text-muted-foreground mb-1.5">
                                <strong>Yasal Referans:</strong> {risk.legalReference}
                              </p>
                            )}
                            {risk.recommendation && (
                              <div className="bg-muted/30 p-2 rounded-lg">
                                <p className="text-xs font-medium mb-1">Önerimiz:</p>
                                <p className="text-xs">{risk.recommendation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ne Yapmalıyım? - Full Width */}
          <Card className="border shadow-sm mb-6">
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

  // Dashboard render
  return (
    <ErrorBoundary componentName="Dashboard">
      <OnboardingTour open={showOnboarding} onFinish={handleOnboardingFinish} />
      <div className={`${view === 'result' ? 'min-h-screen' : 'h-screen'} bg-background flex flex-col items-center pt-8 md:pt-16 px-2 dashboard-container ${view === 'result' ? 'overflow-auto' : 'overflow-hidden'}`}>
        <div className="w-full max-w-5xl flex flex-col items-center mt-4 mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">Hukuki Belgeni Sadeleştir</h2>
          <p className="text-muted-foreground text-center max-w-xl mb-4">
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
    </ErrorBoundary>
  );
};

export default Dashboard;
