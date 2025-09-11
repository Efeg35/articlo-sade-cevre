import { useCallback } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/hooks/use-toast";
import { Logger } from "@/utils/logger";
import { documentAnalysisSchema, validateAndSanitizeInput, rateLimiter, validateSecureInput } from "@/lib/validation";
import { AnalysisResponse, Entity, LoadingState, DraftRequest, AnalysisLite, NativeFile } from '../types';

interface UseDocumentAnalysisProps {
    onAnalysisStart: (model: LoadingState) => void;
    onAnalysisComplete: (result: AnalysisResponse) => void;
    onAnalysisError: () => void;
    onShowView: (view: 'result') => void;
    onLegacyUpdate: (data: {
        summary: string;
        simplifiedText: string;
        actionPlan: string;
        entities: Entity[];
    }) => void;
}

interface UseDocumentAnalysisReturn {
    analyzeDocument: (text: string, files: (File | NativeFile)[], model: 'flash' | 'pro') => Promise<void>;
    createDocumentDraft: (analysisResult: AnalysisResponse | null, originalText: string) => Promise<string>;
    isAnalyzing: boolean;
}

export function useDocumentAnalysis({
    onAnalysisStart,
    onAnalysisComplete,
    onAnalysisError,
    onShowView,
    onLegacyUpdate
}: UseDocumentAnalysisProps): UseDocumentAnalysisReturn {
    const session = useSession();
    const supabase = useSupabaseClient();
    const user = session?.user || null;
    const { toast } = useToast();

    const analyzeDocument = useCallback(async (
        text: string,
        files: (File | NativeFile)[],
        model: 'flash' | 'pro'
    ) => {
        Logger.log('useDocumentAnalysis', 'Starting document analysis', { model });

        const userIdentifier = user?.id || 'anonymous';
        Logger.log('useDocumentAnalysis', 'Rate limiting check', { userIdentifier });

        if (!rateLimiter.isAllowed(userIdentifier)) {
            Logger.warn('useDocumentAnalysis', 'Rate limit exceeded', { userIdentifier });
            toast({
                title: "Çok Fazla İstek",
                description: "Çok fazla istek gönderdiniz. Lütfen 15 dakika bekleyin.",
                variant: "destructive",
            });
            return;
        }

        Logger.log('useDocumentAnalysis', 'Validating input');

        // Enhanced input validation
        const secureInputCheck = validateSecureInput(text);
        if (!secureInputCheck.isValid) {
            Logger.warn('useDocumentAnalysis', 'Secure input validation failed', { error: secureInputCheck.error });
            toast({
                title: "Güvenlik Hatası",
                description: secureInputCheck.error || 'Geçersiz girdi tespit edildi',
                variant: "destructive",
            });
            return;
        }

        const sanitizedText = validateAndSanitizeInput(text);

        if (!sanitizedText.trim() && files.length === 0) {
            Logger.warn('useDocumentAnalysis', 'No input provided');
            toast({
                title: "Giriş Eksik",
                description: "Lütfen sadeleştirmek için bir metin girin veya dosya yükleyin.",
                variant: "destructive",
            });
            return;
        }

        const validationResult = documentAnalysisSchema.safeParse({
            text: sanitizedText || undefined,
            files: files
        });

        if (!validationResult.success) {
            Logger.warn('useDocumentAnalysis', 'Validation failed', {
                errorCount: validationResult.error.errors.length
            });
            toast({
                title: "Giriş Hatası",
                description: "Lütfen giriş bilgilerinizi kontrol edin.",
                variant: "destructive",
            });
            return;
        }

        Logger.log('useDocumentAnalysis', 'Starting API call');
        onAnalysisStart(model);

        try {
            let body: FormData | { text: string; model: string };
            let originalTextForDb = sanitizedText;

            Logger.log('useDocumentAnalysis', 'Total files to process', { count: files.length });

            if (files.length > 0) {
                Logger.log('useDocumentAnalysis', 'Processing files');
                const formData = new FormData();

                // Process regular files and native files
                for (const file of files) {
                    if (file instanceof File) {
                        // Regular File object
                        formData.append('files', file);
                    } else {
                        // Native file (from NativeFileUpload)
                        try {
                            Logger.log('useDocumentAnalysis', 'Processing native file', {
                                name: file.name,
                                type: file.type
                            });

                            // Base64 data kontrolü
                            if (!file.data || file.data.length === 0) {
                                throw new Error('Dosya verisi boş veya eksik');
                            }

                            // Base64 string'i binary data'ya çevir
                            const binaryString = atob(file.data);
                            const bytes = new Uint8Array(binaryString.length);
                            for (let j = 0; j < binaryString.length; j++) {
                                bytes[j] = binaryString.charCodeAt(j);
                            }

                            const blob = new Blob([bytes], { type: file.type });
                            const fileObject = new File([blob], file.name, { type: file.type });

                            formData.append('files', fileObject);

                            Logger.log('useDocumentAnalysis', 'Successfully processed native file', { name: file.name });
                        } catch (error) {
                            Logger.error('useDocumentAnalysis', 'Error processing native file', error);
                            toast({
                                title: "Dosya İşleme Hatası",
                                description: `Dosya işlenirken hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
                                variant: "destructive",
                            });
                            onAnalysisError();
                            return;
                        }
                    }
                }

                formData.append('model', model);
                if (sanitizedText.trim()) formData.append('text', sanitizedText);
                body = formData;
                originalTextForDb = `[Files: ${files.map(f => f.name).join(", ")}] ${sanitizedText}`;
            } else {
                const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);
                body = { text: sanitizedText, model, ...(isLocalhost ? { noCache: true } : {}) };
            }

            Logger.log('useDocumentAnalysis', 'Calling simplify-text function');
            const { data, error } = await supabase.functions.invoke('simplify-text', { body });

            if (error) {
                Logger.error('useDocumentAnalysis', 'API error', error);
                throw new Error(error.message || 'API fonksiyon hatası');
            }

            Logger.log('useDocumentAnalysis', 'API response received');
            onShowView('result');

            if (data.simplifiedText && data.documentType && data.extractedEntities && data.actionableSteps) {
                Logger.log('useDocumentAnalysis', 'Using structured response');
                onAnalysisComplete(data as AnalysisResponse);
            } else {
                Logger.log('useDocumentAnalysis', 'Using legacy response format');

                // Update legacy state
                onLegacyUpdate({
                    summary: data.summary || "",
                    simplifiedText: data.simplifiedText || "",
                    actionPlan: data.actionPlan || "",
                    entities: Array.isArray(data.entities) ? data.entities : []
                });

                const legacyEntities = Array.isArray(data.entities) ? data.entities : [];
                const convertedEntities = legacyEntities.map((entity: unknown) => {
                    const entityObj = entity as { tip?: string; entity?: string; değer?: string; value?: string };
                    return {
                        entity: entityObj.tip || entityObj.entity || 'Bilinmeyen',
                        value: entityObj.değer || entityObj.value || ''
                    };
                });

                onAnalysisComplete({
                    simplifiedText: data.simplifiedText || "",
                    documentType: data.documentType || "Bilinmeyen",
                    summary: data.summary || "",
                    extractedEntities: convertedEntities,
                    actionableSteps: [],
                    generatedDocument: null
                });
            }

            if (user) {
                Logger.log('useDocumentAnalysis', 'Saving document to database');

                // Prepare action_plan with structured data if available
                let actionPlanToSave = data.actionPlan || "";

                if (data.simplifiedText && data.documentType && data.extractedEntities && data.actionableSteps) {
                    // New format with structured data - embed in action_plan as JSON
                    const structuredData = {
                        __structured: true,
                        actionable_steps: data.actionableSteps || [],
                        extracted_entities: data.extractedEntities || [],
                        risk_items: data.riskItems || [],
                        legacy_action_plan: data.actionPlan || ""
                    };
                    actionPlanToSave = JSON.stringify(structuredData);
                }

                const { error: insertError } = await supabase.from('documents').insert({
                    user_id: user.id,
                    original_text: originalTextForDb,
                    simplified_text: data.simplifiedText || "Sadeleştirilmiş metin yok.",
                    summary: data.summary || "",
                    action_plan: actionPlanToSave,
                    entities: data.entities || null,
                });

                if (insertError) {
                    Logger.error('useDocumentAnalysis', 'Database insert error', insertError);
                    toast({
                        title: "Kayıt Hatası",
                        description: insertError.message || "Belge Supabase'a kaydedilemedi.",
                        variant: "destructive",
                    });
                } else {
                    Logger.log('useDocumentAnalysis', 'Document saved successfully');
                    if (user) {
                        Logger.log('useDocumentAnalysis', 'Decrementing credits');
                        const { error: creditError } = await supabase.rpc('decrement_credit', {
                            user_id_param: user.id
                        });

                        if (creditError) {
                            Logger.error('useDocumentAnalysis', 'Credit decrement error', creditError);
                            toast({
                                title: "Kredi Azaltma Hatası",
                                description: "Krediniz azaltılamadı ama işlem tamamlandı.",
                                variant: "destructive",
                            });
                        } else {
                            Logger.log('useDocumentAnalysis', 'Credits decremented successfully');
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
            Logger.error('useDocumentAnalysis', 'Analysis error', error);
            const message = error instanceof Error ? error.message : "Bir hata oluştu. Lütfen tekrar deneyin.";
            toast({
                title: "Sadeleştirme Hatası",
                description: message,
                variant: "destructive",
            });
            onAnalysisError();
        }
    }, [user, supabase, toast, onAnalysisStart, onAnalysisComplete, onAnalysisError, onShowView, onLegacyUpdate]);

    const createDocumentDraft = useCallback(async (
        analysisResult: AnalysisResponse | null,
        originalText: string
    ): Promise<string> => {
        if (!analysisResult) {
            throw new Error('Analiz sonucu bulunamadı');
        }

        try {
            let payload: DraftRequest;

            if (analysisResult.generatedDocument) {
                // Backend taslak göndermiş
                const doc = analysisResult.generatedDocument;
                const guessBelgeTuru = analysisResult.documentType || 'Dilekçe';
                const makam = doc.addressee?.replace(/'NE|'NE|\s*NE$/i, '').trim() || '[Yetkili Makam]';
                const dosya = doc.caseReference?.replace(/^(ESAS NO:|DOSYA NO:|TAKİP NO:)\s*/i, '') || undefined;
                const itirazNedenleri = doc.explanations?.slice(0, 5).map((p, i) => ({ tip: `Gerekçe ${i + 1}`, aciklama: p })) || [];

                payload = {
                    belge_turu: guessBelgeTuru,
                    kullanici_girdileri: {
                        makam_adi: makam,
                        dosya_no: dosya,
                        itiraz_eden_kisi: { ad_soyad: '[Ad Soyad]', tc_kimlik: undefined, adres: undefined },
                        itiraz_nedenleri: itirazNedenleri,
                        talep_sonucu: doc.conclusionAndRequest,
                        ekler: doc.attachments || []
                    },
                    analysis: {
                        summary: analysisResult.summary,
                        simplifiedText: analysisResult.simplifiedText,
                        documentType: analysisResult.documentType,
                        criticalFacts: analysisResult.criticalFacts,
                        extractedEntities: analysisResult.extractedEntities,
                        actionableSteps: analysisResult.actionableSteps,
                        riskItems: analysisResult.riskItems,
                        originalText
                    }
                };
            } else {
                // Backend taslak göndermediyse, analiz verileriyle taslağı üret
                const guessBelgeTuru = analysisResult.documentType || 'Dilekçe';

                const addresseeEntity = analysisResult.extractedEntities?.find(e =>
                    String(e.entity).toLowerCase().includes('mahkeme') ||
                    String(e.entity).toLowerCase().includes('daire') ||
                    String(e.entity).toLowerCase().includes('kurum') ||
                    String(e.entity).toLowerCase().includes('müdürlüğü')
                );
                const fileEntity = analysisResult.extractedEntities?.find(e =>
                    String(e.entity).toLowerCase().includes('dosya') ||
                    String(e.entity).toLowerCase().includes('esas') ||
                    String(e.entity).toLowerCase().includes('takip')
                );

                const makam = (addresseeEntity?.value as string) || '[Yetkili Makam]';
                const dosya = (fileEntity?.value as string) || undefined;
                const itirazNedenleri = (analysisResult.riskItems || []).map((r, i) => ({
                    tip: `${r.riskType || 'Gerekçe'} ${i + 1}`,
                    aciklama: r.description
                })).slice(0, 7);
                const talep = analysisResult.actionableSteps?.[0]?.description || 'Talebimizin kabulü';

                payload = {
                    belge_turu: guessBelgeTuru,
                    kullanici_girdileri: {
                        makam_adi: makam,
                        dosya_no: dosya,
                        itiraz_eden_kisi: { ad_soyad: '[Ad Soyad]' },
                        itiraz_nedenleri: itirazNedenleri,
                        talep_sonucu: talep,
                        ekler: []
                    },
                    analysis: {
                        summary: analysisResult.summary,
                        simplifiedText: analysisResult.simplifiedText,
                        documentType: analysisResult.documentType,
                        criticalFacts: analysisResult.criticalFacts,
                        extractedEntities: analysisResult.extractedEntities,
                        actionableSteps: analysisResult.actionableSteps,
                        riskItems: analysisResult.riskItems,
                        originalText
                    }
                };
            }

            const { data, error } = await supabase.functions.invoke('draft-document', { body: payload });

            if (error || !data?.draftedDocument) {
                throw new Error(error?.message || 'Taslak üretilemedi.');
            }

            return String(data.draftedDocument);
        } catch (error) {
            Logger.error('useDocumentAnalysis', 'Draft creation error', error);
            throw error;
        }
    }, [supabase]);

    return {
        analyzeDocument,
        createDocumentDraft,
        isAnalyzing: false // This will be managed by the loading state
    };
}