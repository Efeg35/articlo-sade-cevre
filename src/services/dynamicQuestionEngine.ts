/**
 * 🚀 Dynamic Question Flow Engine
 * 
 * LawDepot'un temelindeki dinamik soru akışı motoru.
 * Kullanıcı cevaplarına göre real-time soru görünürlüğünü yönetir.
 * 
 * Örnek: "Evcil hayvan var mı?" → "Evet" → "Depozito ne kadar?" görünür
 */

import type {
    DynamicTemplate,
    DynamicQuestion,
    ConditionalRule,
    UserAnswer,
    DynamicWizardState,
    RuleEvaluationResult,
    ConditionalOperator,
    ConditionalAction,
    QuestionValue
} from '../types/wizard/dynamicWizard';

export class DynamicQuestionEngine {
    private template: DynamicTemplate;
    private state: DynamicWizardState;
    private debugMode: boolean = false;

    constructor(template: DynamicTemplate, debugMode: boolean = false) {
        this.template = template;
        this.debugMode = debugMode;
        this.state = this.initializeState(template);
    }

    /**
     * Wizard state'ini başlatır
     */
    private initializeState(template: DynamicTemplate): DynamicWizardState {
        return {
            template_id: template.template_id,
            current_step: 0,
            total_steps: template.initial_questions.length, // Başlangıçta sadece initial questions
            visible_questions: [...template.initial_questions],
            completed_questions: [],
            required_questions: template.initial_questions.filter(qId => {
                const question = template.questions.find(q => q.question_id === qId);
                return question?.is_required ?? false;
            }),
            answers: {},
            is_complete: false,
            completion_percentage: 0,
            validation_errors: {},
            started_at: new Date().toISOString(),
            last_updated_at: new Date().toISOString()
        };
    }

    /**
     * Kullanıcı cevabını işler ve state'i günceller
     */
    public processAnswer(questionId: string, value: QuestionValue): DynamicWizardState {
        const question = this.template.questions.find(q => q.question_id === questionId);
        if (!question) {
            throw new Error(`Question not found: ${questionId}`);
        }

        // Validation kontrolü
        const validationResult = this.validateAnswer(question, value);
        if (!validationResult.isValid) {
            this.state.validation_errors[questionId] = validationResult.errors;
            return { ...this.state };
        }

        // Cevabı kaydet
        const userAnswer: UserAnswer = {
            question_id: questionId,
            template_id: this.template.template_id,
            value,
            answered_at: new Date().toISOString(),
            is_auto_calculated: false,
            is_valid: true
        };

        this.state.answers[questionId] = userAnswer;

        // Completed questions güncelle
        if (!this.state.completed_questions.includes(questionId)) {
            this.state.completed_questions.push(questionId);
        }

        // Validation errors temizle
        delete this.state.validation_errors[questionId];

        // Conditional rules'ları değerlendir
        const ruleResults = this.evaluateRules(questionId, value);
        this.applyRuleResults(ruleResults);

        // State güncelle
        this.updateWizardState();

        if (this.debugMode) {
            console.log('🎯 Dynamic Question Engine - Answer Processed:', {
                questionId,
                value,
                visibleQuestions: this.state.visible_questions,
                ruleResults
            });
        }

        return { ...this.state };
    }

    /**
     * Cevap validasyonu
     */
    private validateAnswer(question: DynamicQuestion, value: QuestionValue): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        // Required check
        if (question.is_required && this.isEmpty(value)) {
            errors.push('Bu alan zorunludur');
            return { isValid: false, errors };
        }

        // Type-specific validation
        switch (question.question_type) {
            case 'text':
                if (typeof value === 'string') {
                    const validation = question.validation;
                    if (validation?.min_length && value.length < validation.min_length) {
                        errors.push(`Minimum ${validation.min_length} karakter olmalıdır`);
                    }
                    if (validation?.max_length && value.length > validation.max_length) {
                        errors.push(`Maximum ${validation.max_length} karakter olabilir`);
                    }
                    if (validation?.regex_pattern && !new RegExp(validation.regex_pattern).test(value)) {
                        errors.push(validation.custom_message || 'Geçersiz format');
                    }
                }
                break;

            case 'number':
            case 'currency':
            case 'percentage':
                if (typeof value === 'number') {
                    const validation = question.validation;
                    if (validation?.min_value !== undefined && value < validation.min_value) {
                        errors.push(`Minimum değer: ${validation.min_value}`);
                    }
                    if (validation?.max_value !== undefined && value > validation.max_value) {
                        errors.push(`Maximum değer: ${validation.max_value}`);
                    }
                } else if (value !== null && value !== undefined) {
                    errors.push('Geçerli bir sayı giriniz');
                }
                break;

            case 'multiple_choice':
                if (question.options && typeof value === 'string') {
                    const validOptions = question.options.map(opt => opt.value);
                    if (!validOptions.includes(value)) {
                        errors.push('Geçersiz seçenek');
                    }
                }
                break;
        }

        return { isValid: errors.length === 0, errors };
    }

    /**
     * Değerin boş olup olmadığını kontrol eder
     */
    private isEmpty(value: QuestionValue): boolean {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (Array.isArray(value)) return value.length === 0;
        return false;
    }

    /**
     * Belirli bir sorunun conditional rules'larını değerlendirir
     */
    private evaluateRules(questionId: string, value: QuestionValue): RuleEvaluationResult[] {
        const question = this.template.questions.find(q => q.question_id === questionId);
        if (!question || !question.conditional_rules.length) {
            return [];
        }

        return question.conditional_rules
            .sort((a, b) => a.priority - b.priority) // Öncelik sırasına göre
            .map(rule => this.evaluateRule(rule, questionId, value))
            .filter(result => result.triggered);
    }

    /**
     * Tek bir rule'u değerlendirir
     */
    private evaluateRule(rule: ConditionalRule, questionId: string, value: QuestionValue): RuleEvaluationResult {
        const triggered = this.checkCondition(rule.operator, value, rule.trigger_value);

        const result: RuleEvaluationResult = {
            rule_id: rule.rule_id,
            triggered,
            action_taken: rule.action,
            target_id: rule.target_id,
            timestamp: new Date().toISOString()
        };

        if (this.debugMode) {
            result.debug_info = {
                trigger_value: value,
                expected_value: rule.trigger_value,
                operator: rule.operator
            };
        }

        return result;
    }

    /**
     * Koşul operatörlerine göre karşılaştırma yapar
     */
    private checkCondition(
        operator: ConditionalOperator,
        actualValue: QuestionValue,
        expectedValue: string | number | boolean | string[]
    ): boolean {
        switch (operator) {
            case 'EQUALS':
                return actualValue === expectedValue;

            case 'NOT_EQUALS':
                return actualValue !== expectedValue;

            case 'GREATER_THAN':
                return typeof actualValue === 'number' &&
                    typeof expectedValue === 'number' &&
                    actualValue > expectedValue;

            case 'LESS_THAN':
                return typeof actualValue === 'number' &&
                    typeof expectedValue === 'number' &&
                    actualValue < expectedValue;

            case 'CONTAINS':
                return typeof actualValue === 'string' &&
                    typeof expectedValue === 'string' &&
                    actualValue.includes(expectedValue);

            case 'NOT_CONTAINS':
                return typeof actualValue === 'string' &&
                    typeof expectedValue === 'string' &&
                    !actualValue.includes(expectedValue);

            case 'IS_EMPTY':
                return this.isEmpty(actualValue);

            case 'IS_NOT_EMPTY':
                return !this.isEmpty(actualValue);

            default:
                if (this.debugMode) {
                    console.warn(`Unknown operator: ${operator}`);
                }
                return false;
        }
    }

    /**
     * Rule sonuçlarını state'e uygular
     */
    private applyRuleResults(results: RuleEvaluationResult[]): void {
        for (const result of results) {
            this.applyAction(result.action_taken, result.target_id);
        }
    }

    /**
     * Conditional action'ı uygular
     */
    private applyAction(action: ConditionalAction, targetId: string): void {
        switch (action) {
            case 'SHOW_QUESTION':
                if (!this.state.visible_questions.includes(targetId)) {
                    this.state.visible_questions.push(targetId);
                    const targetQuestion = this.template.questions.find(q => q.question_id === targetId);
                    if (targetQuestion?.is_required && !this.state.required_questions.includes(targetId)) {
                        this.state.required_questions.push(targetId);
                    }
                }
                break;

            case 'HIDE_QUESTION':
                this.state.visible_questions = this.state.visible_questions.filter(id => id !== targetId);
                this.state.required_questions = this.state.required_questions.filter(id => id !== targetId);
                this.state.completed_questions = this.state.completed_questions.filter(id => id !== targetId);
                delete this.state.answers[targetId];
                delete this.state.validation_errors[targetId];
                break;

            case 'REQUIRE_QUESTION':
                if (!this.state.required_questions.includes(targetId)) {
                    this.state.required_questions.push(targetId);
                }
                break;

            case 'OPTIONAL_QUESTION':
                this.state.required_questions = this.state.required_questions.filter(id => id !== targetId);
                break;

            case 'SET_VALUE':
                // Bu action için calculation_formula kullanılacak
                // Şimdilik basit implementation
                break;

            case 'CALCULATE_VALUE':
                // Gelişmiş hesaplama mantığı burada olacak
                break;
        }
    }

    /**
     * Wizard state'ini günceller
     */
    private updateWizardState(): void {
        this.state.total_steps = this.state.visible_questions.length;
        this.state.current_step = this.state.completed_questions.length;

        // Completion percentage hesaplama
        const requiredAnswered = this.state.required_questions.filter(qId =>
            this.state.completed_questions.includes(qId)
        ).length;

        this.state.completion_percentage = this.state.required_questions.length > 0
            ? Math.round((requiredAnswered / this.state.required_questions.length) * 100)
            : 0;

        // Is complete check
        this.state.is_complete = this.state.completion_percentage === 100;

        this.state.last_updated_at = new Date().toISOString();
    }

    /**
     * Mevcut state'i döndürür
     */
    public getCurrentState(): DynamicWizardState {
        return { ...this.state };
    }

    /**
     * Belirli bir sorunun görünür olup olmadığını kontrol eder
     */
    public isQuestionVisible(questionId: string): boolean {
        return this.state.visible_questions.includes(questionId);
    }

    /**
     * Belirli bir sorunun zorunlu olup olmadığını kontrol eder
     */
    public isQuestionRequired(questionId: string): boolean {
        return this.state.required_questions.includes(questionId);
    }

    /**
     * Sonraki soruyu döndürür
     */
    public getNextQuestion(): DynamicQuestion | null {
        const unansweredQuestions = this.state.visible_questions.filter(qId =>
            !this.state.completed_questions.includes(qId)
        );

        if (unansweredQuestions.length === 0) {
            return null;
        }

        const nextQuestionId = unansweredQuestions[0];
        return this.template.questions.find(q => q.question_id === nextQuestionId) || null;
    }

    /**
     * Wizard'ı reset eder
     */
    public reset(): DynamicWizardState {
        this.state = this.initializeState(this.template);
        return { ...this.state };
    }

    /**
     * Debug bilgilerini döndürür
     */
    public getDebugInfo(): {
        templateId: string;
        totalQuestions: number;
        visibleQuestions: number;
        completedQuestions: number;
        state: DynamicWizardState;
    } {
        return {
            templateId: this.template.template_id,
            totalQuestions: this.template.questions.length,
            visibleQuestions: this.state.visible_questions.length,
            completedQuestions: this.state.completed_questions.length,
            state: this.state
        };
    }
}

/**
 * Utility fonksiyonlar
 */
export const DynamicQuestionUtils = {
    /**
     * Template'deki soru sırasını optimize eder
     */
    optimizeQuestionOrder(template: DynamicTemplate): DynamicTemplate {
        // Dependency graph oluştur ve optimize et
        // Bu gelişmiş bir feature, şimdilik basit implementation
        return template;
    },

    /**
     * Circular dependencies kontrolü
     */
    validateTemplate(template: DynamicTemplate): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        // Basic validation
        if (!template.questions.length) {
            errors.push('Template must have at least one question');
        }

        if (!template.initial_questions.length) {
            errors.push('Template must have at least one initial question');
        }

        // Rule validation
        for (const question of template.questions) {
            for (const rule of question.conditional_rules) {
                const targetExists = template.questions.some(q =>
                    q.question_id === rule.target_id
                );
                if (!targetExists) {
                    errors.push(`Rule target not found: ${rule.target_id}`);
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Template performans analizi
     */
    analyzeComplexity(template: DynamicTemplate): {
        totalQuestions: number;
        totalRules: number;
        maxDepth: number;
        averageRulesPerQuestion: number;
    } {
        const totalQuestions = template.questions.length;
        const totalRules = template.questions.reduce((sum, q) => sum + q.conditional_rules.length, 0);

        return {
            totalQuestions,
            totalRules,
            maxDepth: Math.ceil(totalRules / totalQuestions) || 0,
            averageRulesPerQuestion: totalQuestions > 0 ? totalRules / totalQuestions : 0
        };
    }
};