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
import { AlertCircle, CheckCircle2, HelpCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type {
    DynamicTemplate,
    DynamicQuestion,
    DynamicWizardState,
    UserAnswer,
    QuestionValue
} from '../../types/wizard/dynamicWizard';

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
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

    // Memoized visible questions
    const visibleQuestions = useMemo(() => {
        return wizardState.visible_questions
            .map(qId => template.questions.find(q => q.question_id === qId))
            .filter(Boolean) as DynamicQuestion[];
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
     * Navigation and completion handlers - defined in order to avoid circular dependencies
     */
    const handleComplete = useCallback(async () => {
        if (!wizardState.is_complete) {
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

    const handleNext = useCallback(() => {
        if (currentQuestionIndex < visibleQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else if (wizardState.is_complete) {
            handleComplete();
        }
    }, [currentQuestionIndex, visibleQuestions.length, wizardState.is_complete, handleComplete]);

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
            const newState = engine.processAnswer(questionId, value);
            setWizardState(newState);

            // If this was the current question and it's now complete, move to next
            const question = template.questions.find(q => q.question_id === questionId);
            if (question && currentQuestion?.question_id === questionId) {
                // Small delay to allow user to see their answer
                setTimeout(() => {
                    handleNext();
                }, 500);
            }
        } catch (error) {
            console.error('Error processing answer:', error);
        }
    }, [engine, template.questions, currentQuestion?.question_id, handleNext]);

    // Get current answer for the displayed question
    const currentAnswer = currentQuestion
        ? wizardState.answers[currentQuestion.question_id]?.value
        : undefined;

    // Check if current question has validation errors
    const currentErrors = currentQuestion
        ? wizardState.validation_errors[currentQuestion.question_id]
        : undefined;

    // Check if we can proceed (current question answered if required)
    const canProceed = currentQuestion
        ? !currentQuestion.is_required ||
        (currentQuestion.question_id in wizardState.answers &&
            wizardState.answers[currentQuestion.question_id].is_valid)
        : false;

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
                                    %{wizardState.completion_percentage} tamamlandı
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
                                <QuestionInput
                                    question={currentQuestion}
                                    value={currentAnswer}
                                    onChange={(value) => handleAnswer(currentQuestion.question_id, value)}
                                    error={currentErrors}
                                />

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
                                    {/* Auto-save indicator */}
                                    {autoSaveEnabled && (
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            Otomatik kaydediliyor
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleNext}
                                        disabled={currentQuestion.is_required && !canProceed}
                                    >
                                        {currentQuestionIndex === visibleQuestions.length - 1 ? (
                                            wizardState.is_complete ? 'Tamamla' : 'Bitir'
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
                                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                                    {JSON.stringify(engine.getDebugInfo(), null, 2)}
                                </pre>
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
                                <span className="font-medium">%{wizardState.completion_percentage}</span>
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