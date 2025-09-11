import React from 'react';
import { Capacitor } from "@capacitor/core";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Camera, Image, FileUp, ChevronDown, Plus, X, Loader2, Sparkles, BrainCircuit } from "lucide-react";
import { LoadingState, NativeFile } from '../types';

interface AnalysisInputProps {
    // Text input
    originalText: string;
    onTextChange: (text: string) => void;

    // Native files (from Capacitor)
    nativeFiles: NativeFile[];
    isNativeUploading: boolean;
    onTakePhoto: () => Promise<void>;
    onSelectFromGallery: () => Promise<void>;
    onSelectDocument: () => Promise<void>;
    onRemoveNativeFile: (index: number) => void;

    // Web files (fallback)
    selectedFiles: File[];
    onFilesChange: (files: File[]) => void;
    onRemoveFile: (index: number) => void;

    // State
    loading: LoadingState;

    // Actions
    onSimplify: (model: 'flash' | 'pro') => void;
    onShowProModal: () => void;

    // Fallback indicators
    apiFallbackMode?: boolean;
    nativeFeatureFallback?: boolean;

    // Haptic feedback
    onHapticFeedback?: (type: 'light' | 'medium' | 'heavy' | 'selection') => void;
}

export const AnalysisInput: React.FC<AnalysisInputProps> = ({
    originalText,
    onTextChange,
    nativeFiles,
    isNativeUploading,
    onTakePhoto,
    onSelectFromGallery,
    onSelectDocument,
    onRemoveNativeFile,
    selectedFiles,
    onFilesChange,
    onRemoveFile,
    loading,
    onSimplify,
    onShowProModal,
    apiFallbackMode = false,
    nativeFeatureFallback = false,
    onHapticFeedback = () => { }
}) => {
    const handleWebFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            onFilesChange(files);
        }
    };

    return (
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

            <Card className="w-full max-w-4xl border shadow-sm">
                <CardContent className="p-4 md:p-6 max-h-[70vh] overflow-y-auto">
                    <Textarea
                        placeholder="Karmaşık hukuki belgenizi buraya yapıştırın..."
                        value={originalText}
                        onChange={(e) => onTextChange(e.target.value)}
                        className="min-h-[200px] md:min-h-[300px] resize-none text-sm md:text-base"
                        disabled={loading !== null}
                    />
                    <div className="my-4 text-center text-xs uppercase text-muted-foreground">Veya</div>

                    {/* Native Platform için Dosya Yükleme Dropdown */}
                    {Capacitor.isNativePlatform() ? (
                        <div className="space-y-3 flex-shrink-0">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        disabled={loading !== null || isNativeUploading}
                                        variant="outline"
                                        className="w-full flex items-center justify-center gap-2 h-12"
                                    >
                                        {isNativeUploading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                        <span className="text-sm font-medium">
                                            {isNativeUploading ? 'Dosya Yükleniyor...' : '📁 Dosya Ekle'}
                                        </span>
                                        {!isNativeUploading && <ChevronDown className="h-4 w-4 ml-1" />}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center" className="w-56">
                                    <DropdownMenuItem
                                        onSelect={(event) => {
                                            event.preventDefault();
                                            onTakePhoto();
                                        }}
                                        disabled={loading !== null || isNativeUploading}
                                        className="cursor-pointer flex items-center gap-2 py-3"
                                    >
                                        <Camera className="h-4 w-4" />
                                        <span>📸 Fotoğraf Çek</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={(event) => {
                                            event.preventDefault();
                                            onSelectFromGallery();
                                        }}
                                        disabled={loading !== null || isNativeUploading}
                                        className="cursor-pointer flex items-center gap-2 py-3"
                                    >
                                        <Image className="h-4 w-4" />
                                        <span>🖼️ Galeriden Seç</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={(event) => {
                                            event.preventDefault();
                                            onSelectDocument();
                                        }}
                                        disabled={loading !== null || isNativeUploading}
                                        className="cursor-pointer flex items-center gap-2 py-3"
                                    >
                                        <FileUp className="h-4 w-4" />
                                        <span>📄 Dosya Seç</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Native Dosyalar Listesi */}
                            {nativeFiles.length > 0 && (
                                <div className="mt-4 flex-shrink-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Seçilen Dosyalar ({nativeFiles.length})
                                        </span>
                                        {nativeFiles.length > 2 && (
                                            <span className="text-xs text-muted-foreground">
                                                Kaydır ↕
                                            </span>
                                        )}
                                    </div>
                                    <ul className="space-y-2 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                                        {nativeFiles.map((file, idx) => (
                                            <li key={`native-${file.name}-${idx}`} className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm">
                                                <span className="truncate font-medium pr-2">{file.name}</span>
                                                <button
                                                    type="button"
                                                    className="ml-2 text-muted-foreground hover:text-destructive disabled:opacity-50 flex-shrink-0"
                                                    onClick={() => onRemoveNativeFile(idx)}
                                                    aria-label="Dosyayı kaldır"
                                                    disabled={loading !== null}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
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
                                onChange={handleWebFileChange}
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
                        <div className="mt-4 flex-shrink-0">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Seçilen Dosyalar ({selectedFiles.length})
                                </span>
                                {selectedFiles.length > 2 && (
                                    <span className="text-xs text-muted-foreground">
                                        Kaydır ↕
                                    </span>
                                )}
                            </div>
                            <ul className="space-y-2 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                                {selectedFiles.map((file, idx) => (
                                    <li key={`web-${file.name}-${idx}`} className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm">
                                        <span className="truncate font-medium pr-2">{file.name}</span>
                                        <button
                                            type="button"
                                            className="ml-2 text-muted-foreground hover:text-destructive disabled:opacity-50 flex-shrink-0"
                                            onClick={() => onRemoveFile(idx)}
                                            aria-label="Dosyayı kaldır"
                                            disabled={loading !== null}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Button
                onClick={() => {
                    onHapticFeedback('medium');
                    onSimplify('flash');
                }}
                disabled={loading !== null}
                size="lg"
                className="mt-6 w-full max-w-4xl text-sm md:text-base"
            >
                {loading === 'flash' ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
                {loading === 'flash' ? 'Sadeleştiriliyor...' : 'Sadeleştir (1 Kredi)'}
            </Button>

            <Button
                onClick={() => {
                    onHapticFeedback('light');
                    onShowProModal();
                }}
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
};