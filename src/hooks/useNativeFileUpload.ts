import { useState, useCallback, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import { validateFileSecurity } from '@/lib/validation';

// Plugin import'larını güvenli şekilde yap
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';

interface FileData {
    name: string;
    type: string;
    size: number;
    data: string; // base64 data
    uri?: string;
}

interface UseNativeFileUploadReturn {
    selectedFiles: FileData[];
    isUploading: boolean;
    isNativePlatform: boolean;
    takePhoto: () => Promise<void>;
    selectFromGallery: () => Promise<void>;
    selectDocument: () => Promise<void>;
    removeFile: (index: number) => void;
    clearFiles: () => void;
}

export const useNativeFileUpload = (): UseNativeFileUploadReturn => {
    const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isNativePlatform, setIsNativePlatform] = useState(false);
    const { toast } = useToast();

    // Platform detection'ı daha güvenli yap
    useEffect(() => {
        try {
            const isNative = Capacitor.isNativePlatform();
            setIsNativePlatform(isNative);
            console.log('[useNativeFileUpload] Platform detected:', isNative ? 'Native' : 'Web');

            // Plugin availability kontrolü
            if (isNative) {
                console.log('[useNativeFileUpload] Native platform - Pluginler kontrol ediliyor...');
                console.log('[useNativeFileUpload] Camera plugin:', typeof Camera);
                console.log('[useNativeFileUpload] Filesystem plugin:', typeof Filesystem);
                console.log('[useNativeFileUpload] FilePicker plugin:', typeof FilePicker);
            }
        } catch (error) {
            console.error('[useNativeFileUpload] Platform detection hatasi:', error);
            setIsNativePlatform(false);
        }
    }, []);

    // Base64 size hesaplamasını düzelt
    const calculateBase64Size = useCallback((base64String: string): number => {
        try {
            // Base64'te her 4 karakter 3 byte'a karşılık gelir
            const padding = (base64String.match(/=/g) || []).length;
            return Math.ceil((base64String.length * 3) / 4) - padding;
        } catch (error) {
            console.error('[useNativeFileUpload] Base64 size hesaplama hatasi:', error);
            return 0;
        }
    }, []);

    const validateAndAddFile = useCallback((fileData: FileData) => {
        try {
            console.log('[useNativeFileUpload] Dosya validasyonu baslatiliyor:', fileData.name);

            // Dosya boyutu kontrolü (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (fileData.size > maxSize) {
                console.log('[useNativeFileUpload] Dosya cok buyuk:', fileData.size);
                toast({
                    title: "Dosya Çok Büyük",
                    description: "Dosya boyutu 5MB'dan küçük olmalıdır.",
                    variant: "destructive",
                });
                return false;
            }

            // MIME type kontrolü
            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
                'application/rtf'
            ];

            if (!allowedTypes.includes(fileData.type)) {
                console.log('[useNativeFileUpload] Desteklenmeyen dosya turu:', fileData.type);
                toast({
                    title: "Desteklenmeyen Dosya Türü",
                    description: "Sadece resim, PDF, DOC, DOCX, TXT ve RTF dosyaları desteklenir.",
                    variant: "destructive",
                });
                return false;
            }

            console.log('[useNativeFileUpload] Dosya validasyonu basarili');
            return true;
        } catch (error) {
            console.error('[useNativeFileUpload] File validation hatasi:', error);
            toast({
                title: "Dosya Doğrulama Hatası",
                description: "Dosya doğrulanırken bir hata oluştu.",
                variant: "destructive",
            });
            return false;
        }
    }, [toast]);

    // takePhoto fonksiyonunu güçlendir
    const takePhoto = useCallback(async () => {
        console.log('[useNativeFileUpload] takePhoto cagrildi');

        if (!isNativePlatform) {
            console.log('[useNativeFileUpload] Web platformda kamera kullanilamaz');
            toast({
                title: "Özellik Mevcut Değil",
                description: "Bu özellik sadece mobil uygulamada kullanılabilir.",
                variant: "destructive",
            });
            return;
        }

        // Plugin kontrolü basitleştir
        if (typeof Camera === 'undefined') {
            console.error('[useNativeFileUpload] Camera plugin tanimli degil');
            toast({
                title: "Kamera Erişimi Yok",
                description: "Kamera plugin'i yüklenemedi. Lütfen uygulamayı yeniden başlatın.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsUploading(true);
            console.log('[useNativeFileUpload] Kamera aciliyor...');

            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Base64,
                source: CameraSource.Camera,
            });

            if (image.base64String) {
                const fileData: FileData = {
                    name: `photo_${Date.now()}.jpg`,
                    type: 'image/jpeg',
                    size: calculateBase64Size(image.base64String),
                    data: image.base64String,
                    uri: image.webPath,
                };

                if (validateAndAddFile(fileData)) {
                    setSelectedFiles(prev => [...prev, fileData]);
                    toast({
                        title: "Fotoğraf Eklendi",
                        description: "Fotoğraf başarıyla eklendi.",
                    });
                    console.log('[useNativeFileUpload] Fotograf basariyla eklendi');
                }
            }
        } catch (error) {
            console.error('[useNativeFileUpload] Camera error:', error);
            if (error instanceof Error && error.message.includes('User cancelled')) {
                console.log('[useNativeFileUpload] Kullanici fotograf cekmeyi iptal etti');
                return;
            }
            toast({
                title: "Kamera Hatası",
                description: "Fotoğraf çekilirken bir hata oluştu.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    }, [isNativePlatform, validateAndAddFile, toast, calculateBase64Size]);

    const selectFromGallery = useCallback(async () => {
        console.log('[useNativeFileUpload] selectFromGallery cagrildi');

        if (!isNativePlatform) {
            console.log('[useNativeFileUpload] Web platformda galeri kullanilamaz');
            toast({
                title: "Özellik Mevcut Değil",
                description: "Bu özellik sadece mobil uygulamada kullanılabilir.",
                variant: "destructive",
            });
            return;
        }

        if (typeof Camera === 'undefined') {
            console.error('[useNativeFileUpload] Camera plugin tanimli degil');
            toast({
                title: "Galeri Erişimi Yok",
                description: "Kamera plugin'i yüklenemedi. Lütfen uygulamayı yeniden başlatın.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsUploading(true);
            console.log('[useNativeFileUpload] Galeri aciliyor...');

            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Base64,
                source: CameraSource.Photos,
            });

            if (image.base64String) {
                const fileName = image.path ? image.path.split('/').pop() || `gallery_${Date.now()}.jpg` : `gallery_${Date.now()}.jpg`;
                const fileData: FileData = {
                    name: fileName,
                    type: 'image/jpeg',
                    size: calculateBase64Size(image.base64String),
                    data: image.base64String,
                    uri: image.webPath,
                };

                if (validateAndAddFile(fileData)) {
                    setSelectedFiles(prev => [...prev, fileData]);
                    toast({
                        title: "Resim Eklendi",
                        description: "Galeriden seçilen resim başarıyla eklendi.",
                    });
                    console.log('[useNativeFileUpload] Galeri resmi basariyla eklendi');
                }
            }
        } catch (error) {
            console.error('[useNativeFileUpload] Gallery error:', error);
            if (error instanceof Error && error.message.includes('User cancelled')) {
                console.log('[useNativeFileUpload] Kullanici galeri secimini iptal etti');
                return;
            }
            toast({
                title: "Galeri Hatası",
                description: "Resim seçilirken bir hata oluştu.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
            // Galeri kapandıktan sonra kapsamlı UI reset
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

                console.log('[useNativeFileUpload] Kapsamlı UI reset tamamlandı');
            }, 100);
        }
    }, [isNativePlatform, validateAndAddFile, toast, calculateBase64Size]);

    // Gelişmiş selectDocument implementasyonu
    const selectDocument = useCallback(async () => {
        console.log('[useNativeFileUpload] selectDocument cagrildi');

        try {
            setIsUploading(true);

            if (isNativePlatform) {
                // Native platform için FilePicker plugin kullan
                console.log('[useNativeFileUpload] Native FilePicker kullaniliyor...');

                const result = await FilePicker.pickFiles({
                    types: [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'text/plain',
                        'application/rtf'
                    ],
                    readData: true, // Base64 data almak için
                });

                if (result.files.length > 0) {
                    const file = result.files[0];
                    console.log('[useNativeFileUpload] Dosya secildi:', file.name);

                    const fileData: FileData = {
                        name: file.name,
                        type: file.mimeType || 'application/octet-stream',
                        size: file.size || 0,
                        data: file.data || '', // Base64 data
                        uri: file.path,
                    };

                    if (validateAndAddFile(fileData)) {
                        setSelectedFiles(prev => [...prev, fileData]);
                        toast({
                            title: "Dosya Eklendi",
                            description: `${file.name} başarıyla eklendi.`,
                        });
                        console.log('[useNativeFileUpload] Native dosya basariyla eklendi');
                    }
                }
            } else {
                // Web fallback implementasyonu
                console.log('[useNativeFileUpload] Web dosya secici aciliyor...');

                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*,application/pdf,.doc,.docx,.txt,.rtf';
                input.multiple = false;

                input.onchange = async (event) => {
                    try {
                        const files = (event.target as HTMLInputElement).files;
                        if (!files || files.length === 0) {
                            setIsUploading(false);
                            return;
                        }

                        const file = files[0];
                        console.log('[useNativeFileUpload] Web dosya secildi:', file.name);

                        // Security validation
                        const securityCheck = validateFileSecurity(file);
                        if (!securityCheck.isValid) {
                            toast({
                                title: "Güvenlik Uyarısı",
                                description: securityCheck.error || "Dosya güvenlik kontrolünden geçemedi.",
                                variant: "destructive",
                            });
                            setIsUploading(false);
                            return;
                        }

                        const reader = new FileReader();
                        reader.onload = (e) => {
                            try {
                                const result = e.target?.result as string;
                                const base64Data = result.split(',')[1]; // Remove data URL prefix

                                const fileData: FileData = {
                                    name: file.name,
                                    type: file.type,
                                    size: file.size,
                                    data: base64Data,
                                };

                                if (validateAndAddFile(fileData)) {
                                    setSelectedFiles(prev => [...prev, fileData]);
                                    toast({
                                        title: "Dosya Eklendi",
                                        description: "Dosya başarıyla eklendi.",
                                    });
                                    console.log('[useNativeFileUpload] Web dosya basariyla eklendi');
                                }
                            } catch (error) {
                                console.error('[useNativeFileUpload] Web file processing error:', error);
                                toast({
                                    title: "Dosya İşleme Hatası",
                                    description: "Dosya işlenirken bir hata oluştu.",
                                    variant: "destructive",
                                });
                            } finally {
                                setIsUploading(false);
                            }
                        };

                        reader.readAsDataURL(file);
                    } catch (error) {
                        console.error('[useNativeFileUpload] Web file processing error:', error);
                        setIsUploading(false);
                    }
                };

                input.click();
                return;
            }

        } catch (error: unknown) {
            console.error('[useNativeFileUpload] File picker error:', error);

            if (error instanceof Error && error.message.includes('User cancelled')) {
                console.log('[useNativeFileUpload] Kullanici dosya secimini iptal etti');
                return;
            }

            toast({
                title: "Dosya Seçimi Hatası",
                description: `Dosya seçilirken hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    }, [isNativePlatform, validateAndAddFile, toast]);

    const removeFile = useCallback((index: number) => {
        try {
            console.log('[useNativeFileUpload] Dosya siliniyor, index:', index);
            setSelectedFiles(prev => {
                const newFiles = prev.filter((_, i) => i !== index);
                console.log('[useNativeFileUpload] Dosya silindi, kalan:', newFiles.length);
                return newFiles;
            });
        } catch (error) {
            console.error('[useNativeFileUpload] Dosya kaldirma hatasi:', error);
        }
    }, []);

    const clearFiles = useCallback(() => {
        try {
            console.log('[useNativeFileUpload] Tum dosyalar temizleniyor...');
            setSelectedFiles([]);
            console.log('[useNativeFileUpload] Tum dosyalar temizlendi');
        } catch (error) {
            console.error('[useNativeFileUpload] Dosya temizleme hatasi:', error);
        }
    }, []);

    // Hook durumu logla
    useEffect(() => {
        console.log('[useNativeFileUpload] Hook durumu guncellendi:', {
            selectedFilesCount: selectedFiles.length,
            isUploading,
            isNativePlatform,
            takePhoto: typeof takePhoto,
            selectFromGallery: typeof selectFromGallery,
            selectDocument: typeof selectDocument
        });
    }, [selectedFiles, isUploading, isNativePlatform, takePhoto, selectFromGallery, selectDocument]);

    return {
        selectedFiles,
        isUploading,
        isNativePlatform,
        takePhoto,
        selectFromGallery,
        selectDocument,
        removeFile,
        clearFiles,
    };
};
