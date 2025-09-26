import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, Sparkles, Download, FileText, Scale, Calendar, User } from 'lucide-react';
import { WizardInterface, TemplateSelector } from '@/components/wizard';
import { WizardTemplate, WizardState } from '@/types/wizard';
import { availableTemplates } from '@/templates/kira-itiraz-template';
import { DocumentWarning } from '@/components/DocumentWarning';
import { ProfessionalDocumentGenerator, ProfessionalDocumentResult, DocumentMetadata } from '@/utils/wizard/professionalDocumentGenerator';

type WizardPageState = 'template-selection' | 'wizard-active' | 'wizard-completed';

export default function WizardPage() {
    const [pageState, setPageState] = useState<WizardPageState>('template-selection');
    const [selectedTemplate, setSelectedTemplate] = useState<WizardTemplate | null>(null);
    const [completedWizardState, setCompletedWizardState] = useState<WizardState | null>(null);
    const [generatedDocument, setGeneratedDocument] = useState<ProfessionalDocumentResult | null>(null);

    // Handle template selection
    const handleTemplateSelect = (template: WizardTemplate) => {
        setSelectedTemplate(template);
        setPageState('wizard-active');
    };

    // Handle wizard completion
    const handleWizardComplete = (state: WizardState) => {
        setCompletedWizardState(state);

        // Generate professional document
        if (selectedTemplate) {
            const result = ProfessionalDocumentGenerator.generateDocument(selectedTemplate, state);
            if (result.success) {
                setGeneratedDocument(result);
            } else {
                console.error('Document generation failed:', result.error);
                // Still set a basic result so user sees something
                setGeneratedDocument({
                    success: false,
                    error: result.error || 'Belge oluşturulurken hata oluştu'
                });
            }
        }

        setPageState('wizard-completed');
    };

    // Handle going back to template selection
    const handleBackToTemplates = () => {
        setSelectedTemplate(null);
        setCompletedWizardState(null);
        setGeneratedDocument(null);
        setPageState('template-selection');
    };

    // Handle starting a new wizard
    const handleStartNew = () => {
        setCompletedWizardState(null);
        setGeneratedDocument(null);
        setPageState('template-selection');
    };

    // Handle document download
    const handleDownloadDocument = () => {
        if (generatedDocument?.success && generatedDocument.content && generatedDocument.filename) {
            ProfessionalDocumentGenerator.downloadDocument(generatedDocument.content, generatedDocument.filename);
        }
    };

    // Handle document preview
    const handlePreviewDocument = () => {
        if (generatedDocument?.success && generatedDocument.content) {
            const blob = new Blob([generatedDocument.content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
            <div className="container mx-auto max-w-7xl">
                {/* Beta warning */}
                <Alert className="mb-6 border-purple-200 bg-purple-50">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-700">
                        <strong>🧪 Beta Sürümü:</strong> Belge Sihirbazı henüz test aşamasındadır.
                        Oluşturulan belgeler için mutlaka hukuki danışmanlık alınız.
                    </AlertDescription>
                </Alert>

                {/* Template Selection State */}
                {pageState === 'template-selection' && (
                    <div>
                        <TemplateSelector
                            templates={availableTemplates}
                            onSelectTemplate={handleTemplateSelect}
                        />
                    </div>
                )}

                {/* Active Wizard State */}
                {pageState === 'wizard-active' && selectedTemplate && (
                    <div>
                        {/* Back button */}
                        <div className="mb-6">
                            <Button
                                variant="ghost"
                                onClick={handleBackToTemplates}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Template Seçimine Dön
                            </Button>
                        </div>

                        {/* Wizard Interface */}
                        <WizardInterface
                            template={selectedTemplate}
                            onComplete={handleWizardComplete}
                            onCancel={handleBackToTemplates}
                        />
                    </div>
                )}

                {/* Completed State */}
                {pageState === 'wizard-completed' && completedWizardState && selectedTemplate && (
                    <div className="space-y-6">
                        {/* Success message */}
                        <Card className="border-green-200 bg-green-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-green-800">
                                    <CheckCircle className="h-6 w-6" />
                                    Wizard Tamamlandı! 🎉
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-green-700">
                                        <strong>{selectedTemplate.name}</strong> başarıyla tamamlandı.
                                    </p>

                                    {/* Completion stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="bg-white rounded-lg p-3 text-center">
                                            <div className="font-bold text-green-600">
                                                {selectedTemplate.steps.length}
                                            </div>
                                            <div className="text-muted-foreground">Adım Tamamlandı</div>
                                        </div>

                                        <div className="bg-white rounded-lg p-3 text-center">
                                            <div className="font-bold text-blue-600">
                                                {Math.round((Date.now() - completedWizardState.startedAt.getTime()) / 60000)}
                                            </div>
                                            <div className="text-muted-foreground">Dakika Sürdü</div>
                                        </div>

                                        <div className="bg-white rounded-lg p-3 text-center">
                                            <div className="font-bold text-purple-600">
                                                {Object.keys(completedWizardState.answers).length}
                                            </div>
                                            <div className="text-muted-foreground">Bölüm Dolduruldu</div>
                                        </div>

                                        <div className="bg-white rounded-lg p-3 text-center">
                                            <div className="font-bold text-orange-600">
                                                100%
                                            </div>
                                            <div className="text-muted-foreground">Tamamlandı</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Document Display */}
                        {generatedDocument?.success && generatedDocument.content ? (
                            <>
                                {/* Action buttons - moved to top */}
                                <div className="flex flex-wrap gap-3 mb-6 justify-center">
                                    <Button
                                        size="lg"
                                        onClick={handleDownloadDocument}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Belgeyi İndir
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handlePreviewDocument}
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        Yeni Sekmede Aç
                                    </Button>
                                    <Button variant="outline" onClick={handleStartNew}>
                                        🧙‍♂️ Yeni Wizard Başlat
                                    </Button>
                                </div>

                                {/* Professional Document View - Full Screen */}
                                <div className="bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden">
                                    {/* Document Header */}
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold flex items-center gap-2">
                                                    <Scale className="h-6 w-6" />
                                                    {selectedTemplate.name}
                                                </h2>
                                                <p className="text-blue-100 text-sm mt-1">
                                                    Dosya: {generatedDocument.filename} | {generatedDocument.metadata?.createdDate}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                    ✓ PROFESYONEL KALİTE
                                                </div>
                                                <p className="text-blue-100 text-xs mt-1">
                                                    {Math.round((generatedDocument.content?.length || 0) / 1000)}KB • {(generatedDocument.content?.split('\n').length || 0)} satır
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Content - Word-like styling */}
                                    <div className="p-8 bg-white min-h-[800px]" style={{
                                        fontFamily: 'Times New Roman, serif',
                                        lineHeight: '1.6',
                                        color: '#000000'
                                    }}>
                                        <pre className="whitespace-pre-wrap text-[14px] leading-7 font-serif text-black">
                                            {generatedDocument.content}
                                        </pre>
                                    </div>

                                    {/* Document Footer */}
                                    <div className="bg-gray-50 border-t p-4 text-center text-sm text-gray-600">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Scale className="h-4 w-4 text-blue-600" />
                                                <span>Artiklo Profesyonel Belge Sistemi</span>
                                            </div>
                                            <div>
                                                Belge No: {generatedDocument.metadata?.caseNumber} | {generatedDocument.metadata?.createdDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <DocumentWarning
                                    documentType={selectedTemplate.name}
                                    riskLevel="medium"
                                    variant="inline"
                                />
                            </>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    {generatedDocument?.error ? (
                                        <div className="text-red-600">
                                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p className="font-semibold">Belge Oluşturma Hatası</p>
                                            <p className="text-sm mt-2">{generatedDocument.error}</p>
                                            <Button
                                                variant="outline"
                                                className="mt-4"
                                                onClick={handleStartNew}
                                            >
                                                Tekrar Dene
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-muted-foreground">
                                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>Belge henüz oluşturulmadı. Lütfen wizard'ı tamamlayın.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Debug info for development */}
                        {process.env.NODE_ENV === 'development' && (
                            <Card className="border-dashed border-muted">
                                <CardHeader>
                                    <CardTitle className="text-sm">Debug: Wizard State</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <details className="text-xs">
                                        <summary className="cursor-pointer">Show Raw Data</summary>
                                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                                            {JSON.stringify(completedWizardState, null, 2)}
                                        </pre>
                                    </details>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}