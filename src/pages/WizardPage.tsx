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

                        {/* Generated document preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Scale className="h-5 w-5 text-blue-600" />
                                    Profesyonel Hukuki Belge
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {generatedDocument?.success && generatedDocument.content ? (
                                    <>
                                        {/* Document metadata */}
                                        {generatedDocument.metadata && (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <FileText className="h-4 w-4 text-blue-600" />
                                                        <span className="font-semibold text-blue-900">Belge Türü</span>
                                                    </div>
                                                    <p className="text-sm text-blue-700">{generatedDocument.metadata.documentType}</p>
                                                </div>

                                                <div className="bg-purple-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <User className="h-4 w-4 text-purple-600" />
                                                        <span className="font-semibold text-purple-900">Taraflar</span>
                                                    </div>
                                                    <p className="text-xs text-purple-700">
                                                        {generatedDocument.metadata.parties.applicant || 'Başvurucu'} vs {generatedDocument.metadata.parties.defendant || 'Karşı Taraf'}
                                                    </p>
                                                </div>

                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Calendar className="h-4 w-4 text-green-600" />
                                                        <span className="font-semibold text-green-900">Oluşturma</span>
                                                    </div>
                                                    <p className="text-sm text-green-700">{generatedDocument.metadata.createdDate}</p>
                                                    <p className="text-xs text-green-600">No: {generatedDocument.metadata.caseNumber}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-muted/30 border rounded-lg mb-4">
                                            {/* Document header */}
                                            <div className="border-b border-muted/50 p-4 bg-muted/50 rounded-t-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                                            <Scale className="h-5 w-5 text-blue-600" />
                                                            {selectedTemplate.name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Dosya: {generatedDocument.filename}
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm text-muted-foreground">
                                                        <div className="font-semibold text-green-600">✅ PROFESYONEL KALİTE</div>
                                                        <div>{Math.round((generatedDocument.content?.length || 0) / 1000)}KB • {(generatedDocument.content?.split('\n').length || 0)} satır</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Legal basis section */}
                                            {generatedDocument.metadata?.legalBasis && generatedDocument.metadata.legalBasis.length > 0 && (
                                                <div className="p-4 bg-blue-50 border-b">
                                                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                                        <Scale className="h-4 w-4" />
                                                        Yasal Dayanaklar
                                                    </h4>
                                                    <ul className="text-sm text-blue-700 space-y-1">
                                                        {generatedDocument.metadata.legalBasis.slice(0, 3).map((basis, index) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <span className="text-blue-500 mt-1">•</span>
                                                                <span>{basis}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Document preview */}
                                            <div className="p-4">
                                                <div className="bg-white p-6 rounded border shadow-sm max-h-96 overflow-y-auto">
                                                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-serif">
                                                        {generatedDocument.content.substring(0, 2000)}
                                                        {(generatedDocument.content?.length || 0) > 2000 && (
                                                            <div className="text-muted-foreground mt-4 italic">
                                                                ... (kalan {(generatedDocument.content?.length || 0) - 2000} karakter)
                                                                <br />
                                                                <span className="text-blue-600">Tam belgeyi görüntülemek için "Tam Boyut Görüntüle" butonunu kullanın</span>
                                                            </div>
                                                        )}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>

                                        <DocumentWarning
                                            documentType={selectedTemplate.name}
                                            riskLevel="medium"
                                            variant="inline"
                                        />

                                        {/* Action buttons */}
                                        <div className="flex flex-wrap gap-3 mt-6">
                                            <Button
                                                size="lg"
                                                onClick={handleDownloadDocument}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                Profesyonel Belgeyi İndir
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={handlePreviewDocument}
                                            >
                                                <FileText className="mr-2 h-4 w-4" />
                                                Tam Boyut Görüntüle
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                disabled
                                                className="opacity-50"
                                            >
                                                📧 E-posta Gönder (Yakında)
                                            </Button>
                                            <Button variant="outline" onClick={handleStartNew}>
                                                🧙‍♂️ Yeni Wizard Başlat
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
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
                                    </div>
                                )}
                            </CardContent>
                        </Card>

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