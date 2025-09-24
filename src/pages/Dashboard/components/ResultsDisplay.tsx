import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Redo, Copy, FileText, CheckCircle, BookMarked, Shield,
    BrainCircuit, ArrowRight, ListChecks, FileJson, Loader2
} from "lucide-react";
import { AnalysisResponse, Entity, LoadingState } from '../types';
import { DocumentWarning } from '@/components/DocumentWarning';
import { RiskDetectionService } from '@/services/riskDetection';

interface ResultsDisplayProps {
    // Analysis data
    analysisResult: AnalysisResponse | null;

    // Legacy data (for backwards compatibility)
    summary: string;
    simplifiedText: string;
    actionPlan: string;
    entities: Entity[];

    // State
    loading: LoadingState;

    // Actions
    onReset: () => void;
    onCopy: (text: string) => Promise<void>;
    onCopyActionPlan: () => Promise<void>;
    onCopySummary: () => Promise<void>;
    onShowDraft: () => Promise<void>;

    // Haptic feedback
    onHapticFeedback?: (type: 'light' | 'medium' | 'heavy' | 'selection') => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
    analysisResult,
    summary,
    simplifiedText,
    actionPlan,
    entities,
    loading,
    onReset,
    onCopy,
    onCopyActionPlan,
    onCopySummary,
    onShowDraft,
    onHapticFeedback = () => { }
}) => {
    const handleCopy = async () => {
        const textToCopy = analysisResult?.simplifiedText || simplifiedText;
        await onCopy(textToCopy);
    };

    // Risk değerlendirmesi yap (yeni analiz sistemi için)
    const documentContent = analysisResult?.simplifiedText || simplifiedText || '';
    const riskAssessment = documentContent ? RiskDetectionService.assessRisk(documentContent, analysisResult?.documentType) : null;

    if (analysisResult) {
        return (
            <div className="space-y-6 px-4 md:px-0">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">Analiz Sonuçları</h2>
                    <Button
                        onClick={() => {
                            onHapticFeedback('selection');
                            onReset();
                        }}
                        variant="outline"
                        className="flex items-center gap-2 text-sm md:text-base"
                    >
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
                            {(() => {
                                const seenDocKeys = new Set<string>();
                                const uniqueSteps = analysisResult.actionableSteps.filter((s) => {
                                    if (s.actionType !== 'CREATE_DOCUMENT') return true;
                                    const d = (s.description || '').toLowerCase();
                                    let key = 'generic';
                                    if (d.includes('istinaf')) key = 'istinaf';
                                    else if (d.includes('itiraz')) key = 'itiraz';
                                    else if (d.includes('cevap')) key = 'cevap';
                                    else if (d.includes('başvuru')) key = 'basvuru';
                                    if (seenDocKeys.has(key)) return false;
                                    seenDocKeys.add(key);
                                    return true;
                                });
                                return uniqueSteps;
                            })().map((step, index) => (
                                <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-base leading-relaxed">{step.description}</p>
                                        {step.actionType === 'CREATE_DOCUMENT' && (
                                            <Button onClick={async () => {
                                                onHapticFeedback('medium');
                                                await onShowDraft();
                                            }} className="mt-2" disabled={loading !== null}>
                                                {loading !== null ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Size özel belgeniz oluşturuluyor...
                                                    </>
                                                ) : (
                                                    'Gerekli Belgeyi Oluştur (1 Kredi)'
                                                )}
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
                                        {/* Kritik Bilgiler */}
                                        {analysisResult.criticalFacts && analysisResult.criticalFacts.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-base font-semibold mb-2">Kritik Bilgiler</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    {analysisResult.criticalFacts.map((f, i) => (
                                                        <li key={i} className="text-base">
                                                            <span className="text-muted-foreground mr-1">{f.type}:</span>
                                                            <strong>{f.value}</strong>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
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

                {/* Entegre Hukuki Uyarı Sistemi */}
                <DocumentWarning
                    documentType={analysisResult?.documentType}
                    content={documentContent}
                    riskLevel={riskAssessment?.level}
                    riskAssessment={riskAssessment}
                    variant="inline"
                />
            </div>
        );
    }

    // Legacy render for backwards compatibility
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h2 className="text-3xl font-bold text-foreground">Sadeleştirme Sonuçları</h2>
                <Button onClick={onReset} variant="outline" className="flex items-center gap-2">
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
                                        onClick={onCopySummary}
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
                                    onClick={onCopyActionPlan}
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