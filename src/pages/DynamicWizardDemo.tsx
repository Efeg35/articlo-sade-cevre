/**
 * 🎯 Dynamic Wizard Demo Page - LawDepot-Level System Test
 * 
 * Bu sayfa yeni LawDepot-level dynamic wizard sistemini test etmek için oluşturuldu.
 * Gerçek LawDepot mantığı: Kullanıcı cevaplarına göre dinamik soru akışı.
 * 
 * Test senaryoları:
 * 1. "Evcil hayvan var mı?" → "Evet" → "Depozito ne kadar?" görünür
 * 2. Konut vs İşyeri seçimi → Farklı soru setleri
 * 3. Real-time validation ve conditional logic
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    Rocket,
    Zap,
    CheckCircle2,
    AlertTriangle,
    FileText,
    Settings,
    BarChart3,
    Code2
} from 'lucide-react';

import { DynamicWizard } from '../components/wizard/DynamicWizard';
import {
    DYNAMIC_TEMPLATES,
    getDynamicTemplate,
    validateDynamicTemplate
} from '../data/dynamicTemplates';
import type {
    DynamicTemplate,
    UserAnswer
} from '../types/wizard/WizardTypes';

const DynamicWizardDemo: React.FC = () => {
    // State management
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [currentTemplate, setCurrentTemplate] = useState<DynamicTemplate | null>(null);
    const [isWizardActive, setIsWizardActive] = useState(false);
    const [completedAnswers, setCompletedAnswers] = useState<Record<string, UserAnswer> | null>(null);
    const [showResults, setShowResults] = useState(false);

    /**
     * Template seçimi handler
     */
    const handleTemplateSelect = useCallback((templateId: string) => {
        setSelectedTemplateId(templateId);
        const template = getDynamicTemplate(templateId);
        setCurrentTemplate(template || null);
        setIsWizardActive(false);
        setCompletedAnswers(null);
        setShowResults(false);
    }, []);

    /**
     * Wizard başlatma
     */
    const handleStartWizard = useCallback(() => {
        if (currentTemplate) {
            setIsWizardActive(true);
            setShowResults(false);
        }
    }, [currentTemplate]);

    /**
     * Wizard tamamlanma handler
     */
    const handleWizardComplete = useCallback((answers: Record<string, UserAnswer>) => {
        console.log('🎉 Wizard completed with answers:', answers);
        setCompletedAnswers(answers);
        setIsWizardActive(false);
        setShowResults(true);
    }, []);

    /**
     * Wizard kaydetme handler (auto-save)
     */
    const handleWizardSave = useCallback((answers: Record<string, UserAnswer>) => {
        console.log('💾 Auto-save triggered:', answers);
        // Burada normalde backend'e kaydederiz
    }, []);

    /**
     * Yeni wizard başlatma
     */
    const handleRestartWizard = useCallback(() => {
        setIsWizardActive(false);
        setCompletedAnswers(null);
        setShowResults(false);
        // Küçük delay ile tekrar başlatma
        setTimeout(() => {
            setIsWizardActive(true);
        }, 100);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Rocket className="h-12 w-12 text-blue-600 mr-3" />
                        <h1 className="text-4xl font-bold text-gray-900">
                            Dynamic Wizard Demo
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 mb-2">
                        LawDepot-Level Conditional Logic System Test Environment
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                        <Badge variant="secondary" className="flex items-center">
                            <Zap className="h-4 w-4 mr-1" />
                            Real-time Conditional Logic
                        </Badge>
                        <Badge variant="secondary" className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Dynamic Question Flow
                        </Badge>
                        <Badge variant="secondary" className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            Professional Document Generation
                        </Badge>
                    </div>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="demo" className="space-y-6">
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
                        <TabsTrigger value="demo">
                            <Rocket className="h-4 w-4 mr-2" />
                            Demo
                        </TabsTrigger>
                        <TabsTrigger value="templates">
                            <FileText className="h-4 w-4 mr-2" />
                            Templates
                        </TabsTrigger>
                        <TabsTrigger value="analytics">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="debug">
                            <Code2 className="h-4 w-4 mr-2" />
                            Debug
                        </TabsTrigger>
                    </TabsList>

                    {/* Demo Tab */}
                    <TabsContent value="demo" className="space-y-6">

                        {/* Template Selection */}
                        {!isWizardActive && !showResults && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Settings className="h-5 w-5 mr-2" />
                                        Template Seçimi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Test etmek istediğiniz template'i seçin:
                                        </label>
                                        <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Template seçiniz..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DYNAMIC_TEMPLATES.map(template => (
                                                    <SelectItem key={template.template_id} value={template.template_id}>
                                                        <div className="flex flex-col">
                                                            <span>{template.template_name}</span>
                                                            <span className="text-xs text-gray-500">
                                                                {template.category} • {template.metadata.complexity_level} •
                                                                ~{template.metadata.estimated_completion_time} dk
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {currentTemplate && (
                                        <div className="space-y-4">
                                            {/* Template Preview */}
                                            <Alert>
                                                <FileText className="h-4 w-4" />
                                                <AlertDescription>
                                                    <div className="space-y-2">
                                                        <p><strong>{currentTemplate.template_name}</strong></p>
                                                        <p className="text-sm">{currentTemplate.template_description}</p>
                                                        <div className="flex flex-wrap gap-2 text-xs">
                                                            <Badge variant="outline">
                                                                {currentTemplate.questions.length} soru
                                                            </Badge>
                                                            <Badge variant="outline">
                                                                {currentTemplate.initial_questions.length} başlangıç sorusu
                                                            </Badge>
                                                            <Badge variant="outline">
                                                                {currentTemplate.questions.reduce((sum, q) => sum + q.conditional_rules.length, 0)} conditional rule
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </AlertDescription>
                                            </Alert>

                                            {/* Validation Results */}
                                            <div>
                                                {(() => {
                                                    const validation = validateDynamicTemplate(currentTemplate);
                                                    return validation.isValid ? (
                                                        <Alert>
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            <AlertDescription>
                                                                ✅ Template validation başarılı - Test edilmeye hazır!
                                                            </AlertDescription>
                                                        </Alert>
                                                    ) : (
                                                        <Alert variant="destructive">
                                                            <AlertTriangle className="h-4 w-4" />
                                                            <AlertDescription>
                                                                <div>
                                                                    <p>❌ Template validation hataları:</p>
                                                                    <ul className="list-disc list-inside text-sm mt-2">
                                                                        {validation.errors.map((error, index) => (
                                                                            <li key={index}>{error}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </AlertDescription>
                                                        </Alert>
                                                    );
                                                })()}
                                            </div>

                                            {/* Start Button */}
                                            <Button
                                                onClick={handleStartWizard}
                                                size="lg"
                                                className="w-full"
                                                disabled={!validateDynamicTemplate(currentTemplate).isValid}
                                            >
                                                <Rocket className="h-4 w-4 mr-2" />
                                                Dynamic Wizard'ı Başlat
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Active Wizard */}
                        {isWizardActive && currentTemplate && (
                            <div className="space-y-4">
                                {/* Wizard Controls */}
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="secondary">Aktif Test</Badge>
                                                <span className="text-sm text-gray-600">
                                                    {currentTemplate.template_name}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleRestartWizard}
                                                >
                                                    Yeniden Başlat
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsWizardActive(false)}
                                                >
                                                    İptal
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Dynamic Wizard Component */}
                                <DynamicWizard
                                    template={currentTemplate}
                                    onComplete={handleWizardComplete}
                                    onSave={handleWizardSave}
                                    className="transition-all duration-300"
                                />
                            </div>
                        )}

                        {/* Results Display */}
                        {showResults && completedAnswers && currentTemplate && (
                            <div className="space-y-6">
                                {/* Success Message */}
                                <Card className="border-green-200 bg-green-50">
                                    <CardContent className="p-6 text-center">
                                        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-green-900 mb-2">
                                            🎉 Dynamic Wizard Tamamlandı!
                                        </h3>
                                        <p className="text-green-700">
                                            {currentTemplate.template_name} için tüm sorular yanıtlandı.
                                            Sistem dinamik olarak toplam {Object.keys(completedAnswers).length} soru gösterdi.
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Collected Answers */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Toplanan Cevaplar</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {Object.entries(completedAnswers).map(([questionId, answer]) => {
                                                const question = currentTemplate.questions.find(q => q.question_id === questionId);
                                                return (
                                                    <div key={questionId} className="border rounded-lg p-4">
                                                        <div className="font-medium text-sm text-gray-700 mb-1">
                                                            {question?.question_text || questionId}
                                                        </div>
                                                        <div className="text-lg">
                                                            {typeof answer.value === 'boolean'
                                                                ? (answer.value ? '✅ Evet' : '❌ Hayır')
                                                                : String(answer.value)
                                                            }
                                                        </div>
                                                        {answer.is_auto_calculated && (
                                                            <Badge variant="secondary" className="mt-2">
                                                                Otomatik hesaplandı
                                                            </Badge>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex space-x-2 mt-6">
                                            <Button onClick={() => setIsWizardActive(true)}>
                                                Tekrar Test Et
                                            </Button>
                                            <Button variant="outline" onClick={() => setShowResults(false)}>
                                                Yeni Template Seç
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                    </TabsContent>

                    {/* Templates Tab */}
                    <TabsContent value="templates" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {DYNAMIC_TEMPLATES.map(template => (
                                <Card key={template.template_id}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{template.template_name}</span>
                                            <Badge variant={template.metadata.complexity_level === 'ADVANCED' ? 'destructive' :
                                                template.metadata.complexity_level === 'INTERMEDIATE' ? 'default' : 'secondary'}>
                                                {template.metadata.complexity_level}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-4">{template.template_description}</p>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium">Kategori:</span>
                                                <br />{template.category}
                                            </div>
                                            <div>
                                                <span className="font-medium">Süre:</span>
                                                <br />~{template.metadata.estimated_completion_time} dakika
                                            </div>
                                            <div>
                                                <span className="font-medium">Sorular:</span>
                                                <br />{template.questions.length} total, {template.initial_questions.length} başlangıç
                                            </div>
                                            <div>
                                                <span className="font-medium">Kurallar:</span>
                                                <br />{template.questions.reduce((sum, q) => sum + q.conditional_rules.length, 0)} conditional
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full mt-4"
                                            onClick={() => {
                                                handleTemplateSelect(template.template_id);
                                                // Switch to demo tab
                                                const demoTab = document.querySelector('[value="demo"]') as HTMLElement;
                                                demoTab?.click();
                                            }}
                                        >
                                            Bu Template'i Test Et
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BarChart3 className="h-5 w-5 mr-2" />
                                    Template Analytics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {DYNAMIC_TEMPLATES.length}
                                        </div>
                                        <div className="text-sm text-gray-600">Toplam Template</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">
                                            {DYNAMIC_TEMPLATES.reduce((sum, t) => sum + t.questions.length, 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Toplam Soru</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600">
                                            {DYNAMIC_TEMPLATES.reduce((sum, t) =>
                                                sum + t.questions.reduce((qSum, q) => qSum + q.conditional_rules.length, 0), 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Conditional Rules</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Debug Tab */}
                    <TabsContent value="debug" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Code2 className="h-5 w-5 mr-2" />
                                    System Debug Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Alert>
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>
                                            <strong>Debug Mode Aktif:</strong> Bu sayfa development modunda çalışıyor.
                                            Tüm wizard component'ları debug bilgileri gösterecektir.
                                        </AlertDescription>
                                    </Alert>

                                    {currentTemplate && (
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <h4 className="font-medium mb-2">Selected Template Debug:</h4>
                                            <pre className="text-xs overflow-auto">
                                                {JSON.stringify(currentTemplate, null, 2)}
                                            </pre>
                                        </div>
                                    )}

                                    {completedAnswers && (
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <h4 className="font-medium mb-2">Completed Answers Debug:</h4>
                                            <pre className="text-xs overflow-auto">
                                                {JSON.stringify(completedAnswers, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>

            </div>
        </div>
    );
};

export default DynamicWizardDemo;