/**
 * 🎯 Dynamic Wizard Component - LawDepot-Level Conditional Forms
 * 
 * Bu component, LawDepot'un gerçek gücünü sağlayan dinamik form sistemidir.
 * Kullanıcı cevaplarına göre real-time soru görünürlüğü ve validasyon.
 * 
 * Örnek: "Evcil hayvan var mı?" → "Evet" → "Depozito ne kadar?" görünür
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, HelpCircle, ArrowLeft, ArrowRight, Plus, Minus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type {
    DynamicTemplate,
    DynamicQuestion,
    DynamicWizardState,
    UserAnswer,
    QuestionValue
} from '../../types/wizard/WizardTypes';

import { DynamicQuestionEngine } from '../../services/dynamicQuestionEngine';
import { LegalReferencePanel } from './LegalReferencePanel';

interface DynamicWizardProps {
    template: DynamicTemplate;
    documentId?: string;
    onComplete: (answers: Record<string, UserAnswer>) => void;
    onSave?: (answers: Record<string, UserAnswer>) => void;
    className?: string;
}

interface QuestionInputProps {
    question: DynamicQuestion;
    value: QuestionValue;
    onChange: (value: QuestionValue) => void;
    error?: string[];
    disabled?: boolean;
}

/**
 * Dinamik soru input component'i - Her soru tipine göre uygun UI
 */
const QuestionInput: React.FC<QuestionInputProps> = ({
    question,
    value,
    onChange,
    error,
    disabled = false
}) => {
    const hasError = error && error.length > 0;

    // Boolean/Yes-No questions
    if (question.question_type === 'boolean') {
        return (
            <RadioGroup
                value={value === true ? 'true' : value === false ? 'false' : ''}
                onValueChange={(val) => onChange(val === 'true')}
                disabled={disabled}
                className="flex flex-row space-x-6"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id={`${question.question_id}-true`} />
                    <Label htmlFor={`${question.question_id}-true`}>Evet</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={`${question.question_id}-false`} />
                    <Label htmlFor={`${question.question_id}-false`}>Hayır</Label>
                </div>
            </RadioGroup>
        );
    }

    // Multiple choice questions
    if (question.question_type === 'multiple_choice' && question.options) {
        return (
            <RadioGroup
                value={value as string || ''}
                onValueChange={onChange}
                disabled={disabled}
                className="space-y-2"
            >
                {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem
                            value={option.value}
                            id={`${question.question_id}-${option.value}`}
                        />
                        <Label
                            htmlFor={`${question.question_id}-${option.value}`}
                            className="flex-1 cursor-pointer"
                        >
                            <div>
                                <div>{option.label}</div>
                                {option.description && (
                                    <div className="text-sm text-gray-500 mt-1">
                                        {option.description}
                                    </div>
                                )}
                            </div>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        );
    }

    // Text input with multiline support
    if (question.question_type === 'text') {
        const isMultiline = question.ui_config?.allow_multiline || false;
        const showCharCount = question.ui_config?.show_character_count || false;
        const maxLength = question.validation?.max_length;

        if (isMultiline) {
            return (
                <div className="space-y-2">
                    <Textarea
                        value={value as string || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={question.placeholder}
                        disabled={disabled}
                        className={hasError ? 'border-red-500' : ''}
                        maxLength={maxLength}
                        rows={4}
                    />
                    {showCharCount && maxLength && (
                        <div className="text-sm text-gray-500 text-right">
                            {(value as string || '').length}/{maxLength}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Input
                type="text"
                value={value as string || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={question.placeholder}
                disabled={disabled}
                className={hasError ? 'border-red-500' : ''}
                maxLength={maxLength}
            />
        );
    }

    // Numeric inputs
    if (['number', 'currency', 'percentage'].includes(question.question_type)) {
        const currencySymbol = question.ui_config?.currency_symbol || '₺';

        return (
            <div className="relative">
                {question.question_type === 'currency' && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {currencySymbol}
                    </span>
                )}
                <Input
                    type="number"
                    value={value as number || ''}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    placeholder={question.placeholder}
                    disabled={disabled}
                    className={`${hasError ? 'border-red-500' : ''} ${question.question_type === 'currency' ? 'pl-8' : ''
                        }`}
                    min={question.validation?.min_value}
                    max={question.validation?.max_value}
                    step={question.question_type === 'currency' ? '0.01' : '1'}
                />
                {question.question_type === 'percentage' && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        %
                    </span>
                )}
            </div>
        );
    }

    // Date input
    if (question.question_type === 'date') {
        return (
            <Input
                type="date"
                value={value as string || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={hasError ? 'border-red-500' : ''}
            />
        );
    }

    // Fallback to text input
    return (
        <Input
            type="text"
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            disabled={disabled}
            className={hasError ? 'border-red-500' : ''}
        />
    );
};

/**
 * Tekrarlanabilir grup component'i
 */
const RepeatableGroupInput: React.FC<{
    question: DynamicQuestion;
    engine: DynamicQuestionEngine;
    wizardState: DynamicWizardState;
    onAddInstance: (groupId: string) => void;
    onRemoveInstance: (groupId: string) => void;
}> = ({ question, engine, wizardState, onAddInstance, onRemoveInstance }) => {
    if (!question.repeatable_group) return null;

    const groupInfo = engine.getGroupManagementInfo(question.repeatable_group.group_id);
    const groupQuestions = engine.getGroupQuestions(question.repeatable_group.group_id);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">{question.repeatable_group.group_title}</h4>
                <div className="flex space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveInstance(question.repeatable_group!.group_id)}
                        disabled={!groupInfo.can_remove}
                    >
                        <Minus className="w-4 h-4 mr-1" />
                        {question.repeatable_group.remove_button_text || 'Çıkar'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onAddInstance(question.repeatable_group!.group_id)}
                        disabled={!groupInfo.can_add}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        {question.repeatable_group.add_button_text || 'Ekle'}
                    </Button>
                </div>
            </div>

            {groupInfo.current_count === 0 && (
                <div className="text-gray-500 text-center p-4 border border-dashed rounded-md">
                    Henüz {question.repeatable_group.group_title.toLowerCase()} eklenmedi.
                </div>
            )}

            <div className="text-sm text-gray-600">
                {groupInfo.current_count} / {groupInfo.max_instances} (En az: {groupInfo.min_instances})
            </div>
        </div>
    );
};

/**
 * Ana Dynamic Wizard Component
 */
export const DynamicWizard: React.FC<DynamicWizardProps> = ({
    template,
    documentId,
    onComplete,
    onSave,
    className = ''
}) => {
    // Question Engine instance
    const [engine] = useState(() => new DynamicQuestionEngine(template, true)); // Debug mode enabled

    // Wizard state
    const [wizardState, setWizardState] = useState<DynamicWizardState>(() =>
        engine.getCurrentState()
    );

    // UI state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProcessingNext, setIsProcessingNext] = useState(false);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

    // Memoized visible questions
    const visibleQuestions = useMemo(() => {
        const mappedQuestions = wizardState.visible_questions
            .map(qId => {
                const found = template.questions.find(q => q.question_id === qId);
                if (!found) {
                    console.warn('[UI] Question not found in template:', qId);
                }
                return found;
            })
            .filter(Boolean) as DynamicQuestion[];

        return mappedQuestions;
    }, [wizardState.visible_questions, template.questions]);

    // Current question
    const currentQuestion = visibleQuestions[currentQuestionIndex];

    // Auto-save functionality
    useEffect(() => {
        if (autoSaveEnabled && onSave) {
            const timer = setTimeout(() => {
                onSave(wizardState.answers);
            }, 2000); // 2 second debounce

            return () => clearTimeout(timer);
        }
    }, [wizardState.answers, autoSaveEnabled, onSave]);

    /**
     * Navigation and completion handlers
     */
    const handleComplete = useCallback(async () => {
        if (!wizardState.is_complete) {
            console.warn("Attempted to complete wizard when not in a complete state.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onComplete(wizardState.answers);
        } catch (error) {
            console.error('Error completing wizard:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [wizardState.is_complete, wizardState.answers, onComplete]);

    const handlePrevious = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    }, [currentQuestionIndex]);

    /**
     * Answer handler - processes answer and updates wizard state
     */
    const handleAnswer = useCallback((questionId: string, value: QuestionValue) => {
        try {
            const newState = engine.processAnswer(questionId, value, true);
            setWizardState(newState);
        } catch (error) {
            console.error('Error processing answer:', error);
        }
    }, [engine]);

    /**
     * Grup instance handlers
     */
    const handleAddGroupInstance = useCallback((groupId: string) => {
        try {
            engine.addGroupInstance(groupId);
            setWizardState(engine.getCurrentState());
        } catch (error) {
            console.error('Error adding group instance:', error);
        }
    }, [engine]);

    const handleRemoveGroupInstance = useCallback((groupId: string) => {
        try {
            engine.removeGroupInstance(groupId);
            setWizardState(engine.getCurrentState());
        } catch (error) {
            console.error('Error removing group instance:', error);
        }
    }, [engine]);

    // Get current answer for the displayed question
    const currentAnswer = currentQuestion
        ? wizardState.answers[currentQuestion.question_id]?.value
        : undefined;

    // Check if current question has validation errors
    const currentErrors = currentQuestion
        ? wizardState.validation_errors[currentQuestion.question_id]
        : undefined;

    // ✅ İYİLEŞTİRİLMİŞ canProceed - Boolean ve diğer tipler için güvenli kontrol
    const canProceed = useMemo(() => {
        if (!currentQuestion) return false;

        if (!currentQuestion.is_required) return true;

        // Boolean sorular için özel durum: false da bir cevaptır.
        if (currentQuestion.question_type === 'boolean') {
            return currentAnswer === true || currentAnswer === false;
        }

        // Diğer tipler için: null, undefined ve boş string'i kontrol eder. 0'ı geçerli sayar.
        return currentAnswer !== null &&
            currentAnswer !== undefined &&
            String(currentAnswer).trim() !== '';

    }, [currentQuestion, currentAnswer]);

    // ✅ YENİ VE DÜZELTİLMİŞ handleNext FONKSİYONU
    const handleNext = useCallback(async () => {
        // 1. Gereksiz tekrarları ve hatalı durumları engelle
        if (isProcessingNext || !currentQuestion) return;
        setIsProcessingNext(true);

        try {
            // 2. Mevcut sorunun cevabını al ve motorla son kez işle (final validation).
            // Bu işlem, yeni soruların görünürlüğünü de güncelleyecektir.
            const finalState = engine.processAnswer(currentQuestion.question_id, currentAnswer, false);
            setWizardState(finalState); // State'i yeni ve en güncel haliyle set et.

            // 3. Final validasyon sonrası hata oluştu mu kontrol et.
            const finalErrors = finalState.validation_errors[currentQuestion.question_id];
            if (finalErrors && finalErrors.length > 0) {
                // Hata varsa, kullanıcıya göstermek için işlemi burada durdur.
                return;
            }

            // 4. Navigasyon kararını VERİLEN CEVAPTAN SONRA oluşan GÜNCEL duruma göre ver.
            // `visibleQuestions` yerine `finalState.visible_questions`'a bakmak kritiktir.
            const isLastQuestionInUpdatedList = currentQuestionIndex === finalState.visible_questions.length - 1;

            if (!isLastQuestionInUpdatedList) {
                // Güncel soru listesinin sonunda değilsek, bir sonraki soruya geç.
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                // Artık görünürdeki son sorudayız. Formun tamamlanıp tamamlanmadığını kontrol et.
                if (finalState.is_complete) {
                    await handleComplete();
                }
            }
        } catch (error) {
            console.error('HandleNext error:', error);
        } finally {
            // İşlem başarılı da olsa, hata da olsa, processing state'ini sıfırla.
            setIsProcessingNext(false);
        }
    }, [
        isProcessingNext,
        currentQuestion,
        currentQuestionIndex,
        currentAnswer,
        engine,
        handleComplete
    ]);

    if (!currentQuestion) {
        return (
            <Card className={`w-full max-w-4xl mx-auto ${className}`}>
                <CardContent className="p-8 text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Wizard Tamamlandı!</h2>
                    <p className="text-gray-600 mb-6">
                        Tüm sorular yanıtlandı. Belgeniz oluşturulmaya hazır.
                    </p>
                    <Button
                        onClick={handleComplete}
                        disabled={isSubmitting || !wizardState.is_complete}
                        size="lg"
                    >
                        {isSubmitting ? 'İşleniyor...' : 'Belgeyi Oluştur'}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className={`w-full max-w-7xl mx-auto ${className}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Wizard Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress Bar */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                    İlerleme: {currentQuestionIndex + 1} / {visibleQuestions.length}
                                </span>
                                <span className="text-sm text-gray-600">
                                    %{wizardState.completion_percentage.toFixed(0)} tamamlandı
                                </span>
                            </div>
                            <Progress value={wizardState.completion_percentage} className="w-full" />
                        </CardContent>
                    </Card>

                    {/* Question Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg mb-2">
                                        {currentQuestion.question_text}
                                        {currentQuestion.is_required && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                    </CardTitle>

                                    {currentQuestion.help_text && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            {currentQuestion.help_text}
                                        </p>
                                    )}
                                </div>

                                {/* Tooltip for additional info */}
                                {currentQuestion.tooltip && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <HelpCircle className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{currentQuestion.tooltip}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Question Input */}
                            <div className="space-y-2">
                                {currentQuestion.question_type === 'repeatable_group' ? (
                                    <RepeatableGroupInput
                                        question={currentQuestion}
                                        engine={engine}
                                        wizardState={wizardState}
                                        onAddInstance={handleAddGroupInstance}
                                        onRemoveInstance={handleRemoveGroupInstance}
                                    />
                                ) : (
                                    <QuestionInput
                                        question={currentQuestion}
                                        value={currentAnswer ?? ''} // Ensure value is not undefined
                                        onChange={(value) => handleAnswer(currentQuestion.question_id, value)}
                                        error={currentErrors}
                                    />
                                )}

                                {/* Validation Errors */}
                                {currentErrors && currentErrors.length > 0 && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            <ul className="list-disc list-inside space-y-1">
                                                {currentErrors.map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-4">
                                <Button
                                    variant="outline"
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Önceki
                                </Button>

                                <div className="flex space-x-2">
                                    <Button
                                        onClick={handleNext}
                                        disabled={isSubmitting || isProcessingNext || !canProceed}
                                        variant="default"
                                    >
                                        {currentQuestionIndex === visibleQuestions.length - 1 && wizardState.is_complete ? (
                                            'Tamamla'
                                        ) : (
                                            'Sonraki'
                                        )}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Debug Panel (only in development) */}
                    {process.env.NODE_ENV === 'development' && (
                        <Card className="border-dashed">
                            <CardHeader>
                                <CardTitle className="text-sm">🔧 Debug Panel</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
                                        {JSON.stringify(engine.getDebugInfo(), null, 2)}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Legal Reference Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <LegalReferencePanel
                        template={template}
                        answers={wizardState.answers}
                        className="sticky top-4"
                    />

                    {/* Wizard Summary Card */}
                    <Card className="sticky top-80">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center space-x-2">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Wizard Durumu</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span>Tamamlanan:</span>
                                <span className="font-medium">{wizardState.completed_questions.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Toplam Görünür:</span>
                                <span className="font-medium">{wizardState.visible_questions.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>İlerleme:</span>
                                <span className="font-medium">%{wizardState.completion_percentage.toFixed(0)}</span>
                            </div>
                            {wizardState.is_complete && (
                                <div className="pt-2 border-t">
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={handleComplete}
                                        disabled={isSubmitting}
                                    >
                                        Belgeyi Oluştur
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DynamicWizard;