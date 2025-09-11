import React, { useState, useEffect, useCallback } from "react";
import { Keyboard } from '@capacitor/keyboard';
import { useNavigate } from "react-router-dom";
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { Logger } from "@/utils/logger";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import SimpleOnboardingTour from "@/components/SimpleOnboardingTour";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { validateFileSecurity, validateFileSecurityAsync } from "@/lib/validation";
import { useSessionSecurity } from "@/lib/sessionSecurity";
import { useNativeFileUpload } from "@/hooks/useNativeFileUpload";
import ErrorBoundary from "@/components/ErrorBoundary";

// Import our refactored components and hooks
import { useDashboardState } from './Dashboard/hooks/useDashboardState';
import { useErrorHandling } from './Dashboard/hooks/useErrorHandling';
import { useDocumentAnalysis } from './Dashboard/hooks/useDocumentAnalysis';
import { AnalysisInput } from './Dashboard/components/AnalysisInput';
import { ResultsDisplay } from './Dashboard/components/ResultsDisplay';
import { ProModal } from './Dashboard/components/ProModal';
import { DocumentModal } from './Dashboard/components/DocumentModal';
import { RestoreButton } from './Dashboard/components/RestoreButton';

// Import types
import { NativeFile } from './Dashboard/types';

const Dashboard = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = session?.user || null;
  const navigate = useNavigate();
  const { toast, successToast, errorToast } = useToast();
  const hapticFeedback = useHapticFeedback();

  // Dashboard state hook
  const dashboardState = useDashboardState();

  // Error handling hook
  const errorHandling = useErrorHandling();

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

  // Document analysis hook
  const documentAnalysis = useDocumentAnalysis({
    onAnalysisStart: dashboardState.setLoading,
    onAnalysisComplete: (result) => {
      dashboardState.setAnalysisResult(result);
      dashboardState.setLoading(null); // ✅ Loading'i temizle
    },
    onAnalysisError: () => dashboardState.setLoading(null),
    onShowView: dashboardState.setView,
    onLegacyUpdate: ({ summary, simplifiedText, actionPlan, entities }) => {
      dashboardState.setSummary(summary);
      dashboardState.setSimplifiedText(simplifiedText);
      dashboardState.setActionPlan(actionPlan);
      dashboardState.setEntities(entities);
    }
  });

  // 🔒 KONTROL NOKTASI: Production-safe logging
  useEffect(() => {
    Logger.log('Dashboard', 'Component mounted');
    Logger.log('Dashboard', 'Initial state', {
      user: user?.email,
      session: !!session,
      platform: Capacitor.getPlatform(),
      isNative: Capacitor.isNativePlatform()
    });

    return () => {
      Logger.log('Dashboard', 'Component unmounted');
    };
  }, [session, user?.email]);

  // iOS Keyboard Event Listener - UI Reset için
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Status bar'ı güvenli şekilde ayarla
      const setStatusBarSafe = async () => {
        try {
          // Dinamik import ile StatusBar'ı yükle
          const { StatusBar, Style } = await import('@capacitor/status-bar');
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#ffffff' });
          Logger.log('Dashboard', 'Status bar set to dark style');
        } catch (error) {
          Logger.error('Dashboard', 'Status bar ayarlama hatası (normal)', error);
          // StatusBar mevcut değilse devam et
        }
      };

      setStatusBarSafe();

      const handleKeyboardDidHide = () => {
        Logger.log('Dashboard', 'Keyboard hidden, resetting UI...');

        // Kapsamlı UI reset
        setTimeout(() => {
          // Viewport reset
          window.scrollTo(0, 0);

          // Document body style reset
          document.body.style.position = 'fixed';
          document.body.style.overflow = 'hidden';
          document.body.style.height = '100vh';
          document.body.style.width = '100vw';
          document.body.style.top = '0';
          document.body.style.left = '0';

          // Force reflow trick
          void document.body.offsetHeight;

          // HTML element reset
          document.documentElement.style.position = 'fixed';
          document.documentElement.style.overflow = 'hidden';
          document.documentElement.style.height = '100vh';
          document.documentElement.style.width = '100vw';

          // GPU acceleration için transform reset
          document.body.style.transform = 'translateZ(0)';
          document.body.style.willChange = 'transform';
          document.documentElement.style.transform = 'translateZ(0)';
          document.documentElement.style.willChange = 'transform';

          Logger.log('Dashboard', 'Keyboard UI reset tamamlandı');
        }, 100);
      };

      // Keyboard event listener ekle
      Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

      // Cleanup
      return () => {
        Keyboard.removeAllListeners();
      };
    }
  }, []);

  // Session security hook
  useSessionSecurity();

  // Sayfa yüklendiğinde scroll pozisyonunu sıfırla
  useEffect(() => {
    Logger.log('Dashboard', 'Resetting scroll position');
    window.scrollTo(0, 0);
  }, []);

  // Auth check and onboarding
  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      if (!session || !user) {
        Logger.log('Dashboard', 'No session or user, skipping auth check');
        return;
      }

      Logger.log('Dashboard', 'Dashboard mounted', { userEmail: user.email });

      try {
        let isNative = false;
        try {
          isNative = Capacitor.isNativePlatform();
          Logger.log('Dashboard', 'Platform check', { platform: isNative ? 'Native' : 'Web' });
        } catch (err) {
          Logger.error('Dashboard', 'Capacitor platform check error', err);
          isNative = false;
        }

        if (isNative) {
          Logger.log('Dashboard', 'Checking onboarding status', { userId: user.id });
          const { data, error } = await supabase
            .from("profiles")
            .select("id, has_completed_onboarding")
            .eq("id", user.id)
            .single();

          Logger.log('Dashboard', 'Profile query result', { hasData: !!data, hasError: !!error });

          if (!error && data && data.has_completed_onboarding === false) {
            Logger.log('Dashboard', 'User has not completed onboarding, showing onboarding');
            dashboardState.setShowOnboarding(true);
            dashboardState.setProfileId(data.id);
          } else if (error) {
            Logger.error('Dashboard', 'Error fetching profile', error);
          }
        }
      } catch (err) {
        Logger.error('Dashboard', 'Error in checkAuthAndOnboarding', err);
      }
    };

    checkAuthAndOnboarding();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          Logger.log('Dashboard', 'Auth state change', {
            event: _event,
            hasSession: !!session,
            userEmail: session?.user?.email || 'no session'
          });
          if (!session) {
            Logger.log('Dashboard', 'No session, navigating to auth');
            navigate("/auth");
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (err) {
      Logger.error('Dashboard', 'Error setting up auth state listener', err);
    }
  }, [navigate, supabase, session, user, dashboardState]);

  useEffect(() => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      const seen = localStorage.getItem("artiklo_dashboard_tip_seen");
      Logger.log('Dashboard', 'Mobile tip check', { showTip: !seen });
      dashboardState.setShowTip(!seen);
    }
  }, [dashboardState]);

  // File upload handlers - cleaned up for production
  const handleTakePhoto = async () => {
    try {
      await takePhoto();
      successToast({
        title: 'Başarılı!',
        description: 'Fotoğraf çekme işlemi tamamlandı.'
      });
    } catch (err) {
      Logger.error('Dashboard', 'Photo capture error', err);
      errorToast({
        title: 'Fotoğraf Hatası',
        description: `Fotoğraf çekilirken hata: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`
      });
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      await selectFromGallery();
      successToast({
        title: 'Başarılı!',
        description: 'Galeriden dosya seçimi tamamlandı.'
      });
    } catch (err) {
      Logger.error('Dashboard', 'Gallery selection error', err);
      errorToast({
        title: 'Galeri Hatası',
        description: `Galeriden dosya seçilirken hata: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`
      });
    }
  };

  const handleSelectDocument = async () => {
    try {
      await selectDocument();
      successToast({
        title: 'Başarılı!',
        description: 'Doküman seçimi tamamlandı.'
      });
    } catch (err) {
      Logger.error('Dashboard', 'Document selection error', err);
      errorToast({
        title: 'Doküman Hatası',
        description: `Doküman seçilirken hata: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`
      });
    }
  };

  const handleCloseTip = () => {
    Logger.log('Dashboard', 'Closing tip');
    localStorage.setItem("artiklo_dashboard_tip_seen", "1");
    dashboardState.setShowTip(false);
  };

  const handleReset = () => {
    Logger.log('Dashboard', 'Resetting form state');
    dashboardState.resetForm();
    clearNativeFiles();
  };

  // Modified handleSimplify with fallback mechanisms
  const handleSimplify = async (model: 'flash' | 'pro') => {
    const allFiles = [...dashboardState.selectedFiles, ...nativeFiles];
    await documentAnalysis.analyzeDocument(dashboardState.originalText, allFiles, model);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      successToast({ title: "Kopyalandı!", description: "Metin panoya başarıyla kopyalandı." });
    } catch (err) {
      errorToast({ title: "Kopyalama Hatası", description: "Metin kopyalanırken bir hata oluştu." });
    }
  };

  const handleCopySummary = async () => {
    await handleCopy(dashboardState.summary);
  };

  const handleCopyActionPlan = async () => {
    await handleCopy(dashboardState.actionPlan);
  };

  const handleOnboardingFinish = async () => {
    Logger.log('Dashboard', 'Finishing onboarding');
    dashboardState.setShowOnboarding(false);
    if (dashboardState.profileId) {
      try {
        Logger.log('Dashboard', 'Calling complete-onboarding function');
        await supabase.functions.invoke('complete-onboarding', { body: {} });
        Logger.log('Dashboard', 'Onboarding completed successfully');
      } catch (e) {
        Logger.error('Dashboard', 'Onboarding completion error', e);
      }
    }

    // Redirect to auth for login/signup
    Logger.log('Dashboard', 'Redirecting to auth');
    navigate('/auth');
  };

  const handleShowDraft = async () => {
    if (!dashboardState.analysisResult) {
      errorToast({ title: 'Hata', description: 'Gösterilecek bir belge taslağı bulunamadı.' });
      return;
    }

    // Kredi düşürme işlemi
    if (user) {
      Logger.log('Dashboard', 'Decrementing credits for document creation');
      const { error: creditError } = await supabase.rpc('decrement_credit', {
        user_id_param: user.id
      });

      if (creditError) {
        Logger.error('Dashboard', 'Credit decrement error for document creation', creditError);
        errorToast({
          title: "Kredi Azaltma Hatası",
          description: "Krediniz azaltılamadı. Belge oluşturulamıyor.",
        });
        return;
      }
    }

    // Boş modal ile başla; kaliteli taslağı ürettikten sonra göster
    dashboardState.setDraftedText('');
    dashboardState.setIsModalOpen(true);
    dashboardState.setEditMode(false);

    try {
      const draftText = await documentAnalysis.createDocumentDraft(
        dashboardState.analysisResult,
        dashboardState.originalText
      );
      dashboardState.setDraftedText(draftText);

      // ✅ Oluşturulan belgeyi veritabanına kaydet
      if (user) {
        Logger.log('Dashboard', 'Saving drafted document to database');

        // İlk önce en son document'i bulalım
        const { data: latestDoc, error: fetchError } = await supabase
          .from('documents')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (fetchError || !latestDoc) {
          Logger.error('Dashboard', 'Error finding latest document', fetchError);
          toast({
            title: "Kayıt Uyarısı",
            description: "Belge oluşturuldu ama kaydedilemedi. Lütfen el ile kaydedin.",
            variant: "destructive",
          });
        } else {
          // Şimdi o document'i güncelleyelim
          const { error: saveError } = await supabase
            .from('documents')
            .update({
              drafted_document: draftText,
              updated_at: new Date().toISOString()
            })
            .eq('id', latestDoc.id);

          if (saveError) {
            Logger.error('Dashboard', 'Error saving drafted document', saveError);
            toast({
              title: "Kayıt Uyarısı",
              description: "Belge oluşturuldu ama kaydedilemedi. Lütfen el ile kaydedin.",
              variant: "destructive",
            });
          } else {
            Logger.log('Dashboard', 'Drafted document saved successfully');
          }
        }
      }

      successToast({ title: "Belge Oluşturuldu!", description: "Belge taslağınız hazır ve kaydedildi." });
    } catch (error) {
      Logger.error('Dashboard', 'Draft creation error', error);
      errorToast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Belge taslağı oluşturulamadı.'
      });
    }
  };

  const handleJoinWaitlist = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('add-to-waitlist');
      if (error) {
        errorToast({ title: "Bir hata oluştu", description: error.message || "Bekleme listesine eklenirken hata oluştu." });
      } else if (data?.message) {
        successToast({ title: data.message });
      } else {
        successToast({ title: "Harika! Listeye eklendiniz." });
      }
    } catch (err) {
      errorToast({ title: "Bir hata oluştu", description: err instanceof Error ? err.message : String(err) });
    }
  };

  const handleWebFilesChange = async (files: File[]) => {
    // Use sync validation for immediate feedback, async for deeper checks
    const validFiles: File[] = [];
    for (const file of files) {
      try {
        // First, quick sync validation
        const syncCheck = validateFileSecurity(file);
        if (!syncCheck.isValid) {
          toast({
            title: "Güvenlik Uyarısı",
            description: syncCheck.error || "Dosya güvenlik kontrolünden geçemedi.",
            variant: "destructive",
          });
          continue;
        }

        // Then async deep validation
        const deepCheck = await validateFileSecurityAsync(file);
        if (!deepCheck.isValid) {
          toast({
            title: "Güvenlik Uyarısı",
            description: deepCheck.error || "Dosya içeriği güvenlik kontrolünden geçemedi.",
            variant: "destructive",
          });
          continue;
        }

        validFiles.push(file);
      } catch (error) {
        Logger.error('Dashboard', 'File validation error', error);
        toast({
          title: "Güvenlik Hatası",
          description: "Dosya doğrulama sırasında hata oluştu.",
          variant: "destructive",
        });
      }
    }

    if (validFiles.length !== files.length) {
      toast({
        title: "Güvenlik Kontrolü",
        description: "Bazı dosyalar güvenlik nedeniyle reddedildi.",
        variant: "destructive",
      });
    }

    dashboardState.setSelectedFiles(validFiles);
  };

  const handleErrorRecovery = useCallback(async () => {
    Logger.log('Dashboard', 'Attempting error recovery');
    errorHandling.setIsRecovering(true);
    errorHandling.clearErrors();

    try {
      dashboardState.resetAll();
      clearNativeFiles();
      Logger.log('Dashboard', 'Error recovery completed');
    } catch (error) {
      Logger.error('Dashboard', 'Error recovery failed', error);
      errorHandling.setCriticalError('Kurtarma işlemi başarısız oldu. Lütfen sayfayı yenileyin.');
    } finally {
      errorHandling.setIsRecovering(false);
    }
  }, [errorHandling, dashboardState, clearNativeFiles]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20 md:pt-16 pt-[env(safe-area-inset-top)]">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  // Critical error fallback UI
  if (errorHandling.criticalError) {
    return (
      <RestoreButton
        criticalError={errorHandling.criticalError}
        isRecovering={errorHandling.isRecovering}
        onErrorRecovery={handleErrorRecovery}
        onPageReload={() => window.location.reload()}
      />
    );
  }

  // Dashboard render
  return (
    <ErrorBoundary componentName="Dashboard">
      <SimpleOnboardingTour
        open={dashboardState.showOnboarding}
        onFinish={handleOnboardingFinish}
      />

      <div className={`${dashboardState.view === 'result' ? 'min-h-screen' : 'h-screen'} bg-background flex flex-col items-center pt-8 md:pt-16 px-2 dashboard-container ${dashboardState.view === 'result' ? 'mobile-scroll-fix overflow-auto' : 'overflow-hidden'} ${Capacitor.isNativePlatform() && dashboardState.view === 'result' ? 'ios-scroll-container' : ''}`}>

        <div className={`w-full max-w-5xl flex flex-col items-center ${Capacitor.isNativePlatform() ? 'mt-12' : 'mt-4'} ${Capacitor.isNativePlatform() ? 'mb-2' : 'mb-6'}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">Hukuki Belgeni Sadeleştir</h2>
          <p className={`text-muted-foreground text-center max-w-xl text-sm ${Capacitor.isNativePlatform() ? 'mb-1' : 'mb-4'}`}>
            Karmaşık hukuki metninizi aşağıdaki alana yapıştırın veya dosya olarak yükleyin.
          </p>
        </div>

        <div className="w-full max-w-5xl">
          {dashboardState.view === 'input' ? (
            <>
              {/* Show tip */}
              {dashboardState.showTip && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] bg-primary text-primary-foreground px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-fade-in max-w-[90vw]">
                  <span className="text-sm md:text-base">Belgelerinizi yükleyin veya yapıştırın, saniyeler içinde sadeleştirin!</span>
                  <button onClick={handleCloseTip} className="ml-2 text-lg font-bold">×</button>
                </div>
              )}

              <AnalysisInput
                originalText={dashboardState.originalText}
                onTextChange={dashboardState.setOriginalText}
                nativeFiles={nativeFiles}
                isNativeUploading={isNativeUploading}
                onTakePhoto={handleTakePhoto}
                onSelectFromGallery={handleSelectFromGallery}
                onSelectDocument={handleSelectDocument}
                onRemoveNativeFile={removeNativeFile}
                selectedFiles={dashboardState.selectedFiles}
                onFilesChange={handleWebFilesChange}
                onRemoveFile={dashboardState.removeSelectedFile}
                loading={dashboardState.loading}
                onSimplify={handleSimplify}
                onShowProModal={() => dashboardState.setIsProModalOpen(true)}
                apiFallbackMode={errorHandling.apiFallbackMode}
                nativeFeatureFallback={errorHandling.nativeFeatureFallback}
                onHapticFeedback={(type) => {
                  if (type === 'light') hapticFeedback.light();
                  else if (type === 'medium') hapticFeedback.medium();
                  else if (type === 'heavy') hapticFeedback.heavy();
                  else if (type === 'selection') hapticFeedback.selection();
                }}
              />
            </>
          ) : (
            <ResultsDisplay
              analysisResult={dashboardState.analysisResult}
              summary={dashboardState.summary}
              simplifiedText={dashboardState.simplifiedText}
              actionPlan={dashboardState.actionPlan}
              entities={dashboardState.entities}
              loading={dashboardState.loading}
              onReset={handleReset}
              onCopy={handleCopy}
              onCopyActionPlan={handleCopyActionPlan}
              onCopySummary={handleCopySummary}
              onShowDraft={handleShowDraft}
              onHapticFeedback={(type) => {
                if (type === 'light') hapticFeedback.light();
                else if (type === 'medium') hapticFeedback.medium();
                else if (type === 'heavy') hapticFeedback.heavy();
                else if (type === 'selection') hapticFeedback.selection();
              }}
            />
          )}
        </div>
      </div>

      {/* PRO Coming Soon Modal */}
      <ProModal
        isOpen={dashboardState.isProModalOpen}
        onClose={() => dashboardState.setIsProModalOpen(false)}
        onJoinWaitlist={handleJoinWaitlist}
      />

      {/* Document Draft Modal */}
      <DocumentModal
        isOpen={dashboardState.isModalOpen}
        onClose={() => dashboardState.setIsModalOpen(false)}
        draftedText={dashboardState.draftedText}
        onDraftedTextChange={dashboardState.setDraftedText}
        editMode={dashboardState.editMode}
        onToggleEditMode={() => dashboardState.setEditMode(!dashboardState.editMode)}
      />
    </ErrorBoundary>
  );
};

export default Dashboard;
