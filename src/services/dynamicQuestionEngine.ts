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
} from '../types/wizard/WizardTypes';

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
            group_instances: {}, // Tekrarlanabilir grup örnekleri
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
    public processAnswer(questionId: string, value: QuestionValue, isRealTime: boolean = true): DynamicWizardState {
        const question = this.template.questions.find(q => q.question_id === questionId);
        if (!question) {
            throw new Error(`Question not found: ${questionId}`);
        }

        if (this.debugMode) {
            console.log('🔍 Processing answer:', { questionId, value, isRealTime, questionType: question.question_type });
        }

        // Validation kontrolü - Real-time typing için esnek
        const validationResult = this.validateAnswer(question, value, isRealTime);

        // Real-time typing sırasında validation hatası olsa bile cevabı kaydet (UI feedback için)
        // Final validation'da gerçek kontrol yapılacak
        if (!validationResult.isValid && !isRealTime) {
            this.state.validation_errors[questionId] = validationResult.errors;
            if (this.debugMode) {
                console.log('❌ Final validation failed:', validationResult.errors);
            }
            return { ...this.state };
        } else if (!validationResult.isValid && isRealTime) {
            // Real-time typing'de sadece hataları göster ama cevabı kaydet
            this.state.validation_errors[questionId] = validationResult.errors;
            if (this.debugMode) {
                console.log('⚠️ Real-time validation warning:', validationResult.errors);
            }
        } else {
            // Validation başarılı, hataları temizle
            delete this.state.validation_errors[questionId];
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

        // ✅ FIX: Completed questions güncelle - React state mutation fix
        if (!this.state.completed_questions.includes(questionId)) {
            this.state.completed_questions = [...this.state.completed_questions, questionId];
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
    private validateAnswer(question: DynamicQuestion, value: QuestionValue, isRealTime: boolean = true): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        // T.C. kimlik alanı tespiti
        const isTcField = question.validation?.regex_pattern === '^[0-9]{11}$';

        // Required check - Real-time typing sırasında empty check yapma
        if (!isRealTime && question.is_required && this.isEmpty(value)) {
            errors.push('Bu alan zorunludur');
            return { isValid: false, errors };
        }

        // Type-specific validation
        switch (question.question_type) {
            case 'text':
                if (typeof value === 'string') {
                    const validation = question.validation;
                    // Real-time typing sırasında min_length kontrolü yapma
                    if (!isRealTime && validation?.min_length && value.length < validation.min_length) {
                        errors.push(`Minimum ${validation.min_length} karakter olmalıdır`);
                    }
                    if (validation?.max_length && value.length > validation.max_length) {
                        errors.push(`Maximum ${validation.max_length} karakter olabilir`);
                    }
                    // T.C. kimlik için özel real-time kontrol
                    if (validation?.regex_pattern && value.length > 0) {
                        if (isTcField) {
                            // T.C. kimlik: Real-time'da sadece rakam kontrolü
                            if (isRealTime) {
                                // Sadece rakam kontrolü (yazmaya engel olmasın)
                                if (!/^[0-9]*$/.test(value)) {
                                    errors.push('Sadece rakam girebilirsiniz');
                                }
                                // Uzunluk uyarısı (engellemez ama bilgilendirir)
                                if (value.length > 11) {
                                    errors.push('T.C. Kimlik Numarası en fazla 11 haneli olmalıdır');
                                }
                            } else {
                                // Final validation: Tam 11 hane kontrolü
                                if (!new RegExp(validation.regex_pattern).test(value)) {
                                    errors.push(validation.custom_message || 'T.C. Kimlik Numarası 11 haneli olmalıdır');
                                }
                            }
                        } else {
                            // Diğer alanlar: Sadece final validation'da regex kontrolü
                            if (!isRealTime) {
                                if (!new RegExp(validation.regex_pattern).test(value)) {
                                    errors.push(validation.custom_message || 'Geçersiz format');
                                }
                            }
                        }
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

            case 'date':
                if (typeof value === 'string' && value.length > 0) {
                    // Basic date format validation (YYYY-MM-DD)
                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                    if (!dateRegex.test(value)) {
                        errors.push('Geçersiz tarih formatı');
                    } else {
                        // Check if it's a valid date
                        const dateObj = new Date(value);
                        if (isNaN(dateObj.getTime()) || dateObj.toISOString().split('T')[0] !== value) {
                            errors.push('Geçerli bir tarih giriniz');
                        }
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
            if (this.debugMode) {
                console.log(`🔍 No rules for question: ${questionId}`);
            }
            return [];
        }

        if (this.debugMode) {
            console.log(`🔍 Evaluating ${question.conditional_rules.length} rules for question: ${questionId}`, {
                value,
                rules: question.conditional_rules.map(r => ({
                    rule_id: r.rule_id,
                    operator: r.operator,
                    trigger_value: r.trigger_value,
                    target_id: r.target_id
                }))
            });
        }

        const results = question.conditional_rules
            .sort((a, b) => a.priority - b.priority) // Öncelik sırasına göre
            .map(rule => this.evaluateRule(rule, questionId, value))
            .filter(result => result.triggered);

        if (this.debugMode) {
            console.log(`🎯 Rule evaluation results for ${questionId}:`, {
                totalRules: question.conditional_rules.length,
                triggeredRules: results.length,
                results: results.map(r => ({
                    rule_id: r.rule_id,
                    action: r.action_taken,
                    target_id: r.target_id
                }))
            });
        }

        return results;
    }

    /**
     * Tek bir rule'u değerlendirir - NEGATE desteği ile güncellenmiş
     */
    private evaluateRule(rule: ConditionalRule, questionId: string, value: QuestionValue): RuleEvaluationResult {
        // Adım 1: Koşulu normal şekilde kontrol et
        let triggered = this.checkCondition(rule.operator, value, rule.trigger_value);

        // Adım 2: Eğer kuralda "negate: true" varsa, sonucun TERSİNİ AL
        if (rule.negate === true) {
            triggered = !triggered;
            if (this.debugMode) {
                console.log(`🔄 Rule ${rule.rule_id} negated: ${!triggered} -> ${triggered}`);
            }
        }

        const result: RuleEvaluationResult = {
            rule_id: rule.rule_id,
            triggered, // Artık doğru sonucu içeriyor
            action_taken: rule.action,
            target_id: rule.target_id,
            timestamp: new Date().toISOString()
        };

        if (this.debugMode) {
            result.debug_info = {
                trigger_value: value,
                expected_value: rule.trigger_value,
                operator: rule.operator,
                negated: rule.negate, // Debug için eklendi
                final_trigger_result: triggered // Debug için eklendi
            };
        }

        return result;
    }

    /**
     * Koşul operatörlerine göre karşılaştırma yapar - Tarih desteği ile güncellenmiş
     */
    private checkCondition(
        operator: ConditionalOperator,
        actualValue: QuestionValue,
        expectedValue: string | number | boolean | string[]
    ): boolean {
        // Tarih ile ilgili olmayan mevcut operatörler
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
        }

        // --- YENİ EKLENEN TARİH MANTIĞI ---

        // Eğer operatör tarihle ilgili değilse veya gelen cevap bir tarih değilse, devam etme.
        if (typeof actualValue !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(actualValue)) {
            if (this.debugMode) {
                console.warn(`Date operator used but actualValue is not a valid date: ${actualValue}`);
            }
            return false;
        }

        try {
            const inputDate = new Date(actualValue);
            // Geçersiz bir tarihse (örn: 2023-02-30), hata vermemesi için kontrol et
            if (isNaN(inputDate.getTime())) {
                if (this.debugMode) {
                    console.warn(`Invalid date provided: ${actualValue}`);
                }
                return false;
            }

            const now = new Date();

            switch (operator) {
                case 'DATE_IS_BEFORE': {
                    // Beklenen değer 'YYYY-MM-DD' formatında bir tarih string'i olmalı
                    const beforeDate = new Date(expectedValue as string);
                    if (isNaN(beforeDate.getTime())) {
                        if (this.debugMode) {
                            console.warn(`Invalid expected date for DATE_IS_BEFORE: ${expectedValue}`);
                        }
                        return false;
                    }
                    return inputDate < beforeDate;
                }

                case 'DATE_IS_AFTER': {
                    // Beklenen değer 'YYYY-MM-DD' formatında bir tarih string'i olmalı
                    const afterDate = new Date(expectedValue as string);
                    if (isNaN(afterDate.getTime())) {
                        if (this.debugMode) {
                            console.warn(`Invalid expected date for DATE_IS_AFTER: ${expectedValue}`);
                        }
                        return false;
                    }
                    return inputDate > afterDate;
                }

                case 'DATE_IS_WITHIN_LAST_DAYS': {
                    // Beklenen değer gün sayısı (number) olmalı
                    if (typeof expectedValue !== 'number') {
                        if (this.debugMode) {
                            console.warn(`DATE_IS_WITHIN_LAST_DAYS requires numeric expectedValue, got: ${expectedValue}`);
                        }
                        return false;
                    }
                    const daysAgo = new Date();
                    daysAgo.setDate(now.getDate() - expectedValue);
                    return inputDate >= daysAgo;
                }

                case 'DATE_IS_OLDER_THAN_YEARS': {
                    // Anlaşmalı boşanma için gereken "1 yıldan eski mi?" kuralı
                    // Beklenen değer yıl sayısı (number) olmalı
                    if (typeof expectedValue !== 'number') {
                        if (this.debugMode) {
                            console.warn(`DATE_IS_OLDER_THAN_YEARS requires numeric expectedValue, got: ${expectedValue}`);
                        }
                        return false;
                    }
                    const yearsAgo = new Date();
                    yearsAgo.setFullYear(now.getFullYear() - expectedValue);
                    const result = inputDate < yearsAgo;

                    if (this.debugMode) {
                        console.log(`🔍 DATE_IS_OLDER_THAN_YEARS evaluation:`, {
                            inputDate: inputDate.toISOString().split('T')[0],
                            yearsAgo: yearsAgo.toISOString().split('T')[0],
                            expectedYears: expectedValue,
                            result
                        });
                    }
                    return result;
                }

                default:
                    if (this.debugMode) {
                        console.warn(`Unknown or unhandled operator: ${operator}`);
                    }
                    return false;
            }
        } catch (error) {
            if (this.debugMode) {
                console.error("Error in date condition check:", error);
            }
            return false;
        }
    }

    /**
     * Rule sonuçlarını state'e uygular
     */
    private applyRuleResults(results: RuleEvaluationResult[]): void {
        if (this.debugMode && results.length > 0) {
            console.log(`🔧 Applying ${results.length} rule results:`, results);
        }

        for (const result of results) {
            this.applyAction(result.action_taken, result.target_id);
        }
    }

    /**
     * Conditional action'ı uygular
     */
    private applyAction(action: ConditionalAction, targetId: string): void {
        if (this.debugMode) {
            console.log(`🔧 Applying action: ${action} to target: ${targetId}`);
        }

        switch (action) {
            case 'SHOW_QUESTION':
                if (!this.state.visible_questions.includes(targetId)) {
                    // ✅ FIX: React state mutation fix - yeni array oluştur
                    this.state.visible_questions = [...this.state.visible_questions, targetId];
                    const targetQuestion = this.template.questions.find(q => q.question_id === targetId);
                    if (targetQuestion?.is_required && !this.state.required_questions.includes(targetId)) {
                        // ✅ FIX: React state mutation fix - yeni array oluştur
                        this.state.required_questions = [...this.state.required_questions, targetId];
                    }
                    if (this.debugMode) {
                        console.log(`✅ Question ${targetId} added to visible list. New visible count: ${this.state.visible_questions.length}`);
                    }
                } else {
                    if (this.debugMode) {
                        console.log(`ℹ️ Question ${targetId} already visible`);
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
                    // ✅ FIX: React state mutation fix - yeni array oluştur
                    this.state.required_questions = [...this.state.required_questions, targetId];
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

            case 'ADD_GROUP_INSTANCE':
                this.addGroupInstance(targetId);
                break;

            case 'REMOVE_GROUP_INSTANCE':
                this.removeGroupInstance(targetId);
                break;
        }
    }

    /**
     * Tekrarlanabilir grup örneği ekler
     */
    public addGroupInstance(groupId: string): void {
        const groupQuestion = this.template.questions.find(q =>
            q.question_type === 'repeatable_group' && q.repeatable_group?.group_id === groupId
        );

        if (!groupQuestion || !groupQuestion.repeatable_group) {
            if (this.debugMode) {
                console.warn(`Group not found: ${groupId}`);
            }
            return;
        }

        const currentCount = this.state.group_instances[groupId] || 0;
        const maxInstances = groupQuestion.repeatable_group.max_instances;

        if (currentCount >= maxInstances) {
            if (this.debugMode) {
                console.warn(`Maximum instances reached for group: ${groupId}`);
            }
            return;
        }

        const newCount = currentCount + 1;
        this.state.group_instances[groupId] = newCount;

        // Grup içindeki soruları yeni instance için oluştur
        const groupQuestions = groupQuestion.repeatable_group.group_questions;
        for (const groupSubQuestion of groupQuestions) {
            const instanceQuestionId = `${groupSubQuestion.question_id}_${newCount}`;

            // ✅ FIX: Grup instance sorusunu visible_questions'a ekle - React state mutation fix
            if (!this.state.visible_questions.includes(instanceQuestionId)) {
                this.state.visible_questions = [...this.state.visible_questions, instanceQuestionId];

                if (groupSubQuestion.is_required && !this.state.required_questions.includes(instanceQuestionId)) {
                    this.state.required_questions = [...this.state.required_questions, instanceQuestionId];
                }
            }
        }

        if (this.debugMode) {
            console.log(`Added group instance: ${groupId}, count: ${newCount}`);
        }
    }

    /**
     * Tekrarlanabilir grup örneği çıkarır
     */
    public removeGroupInstance(groupId: string): void {
        const groupQuestion = this.template.questions.find(q =>
            q.question_type === 'repeatable_group' && q.repeatable_group?.group_id === groupId
        );

        if (!groupQuestion || !groupQuestion.repeatable_group) {
            return;
        }

        const currentCount = this.state.group_instances[groupId] || 0;
        const minInstances = groupQuestion.repeatable_group.min_instances;

        if (currentCount <= minInstances) {
            if (this.debugMode) {
                console.warn(`Minimum instances reached for group: ${groupId}`);
            }
            return;
        }

        // Son instance'ı kaldır
        const instanceToRemove = currentCount;
        const groupQuestions = groupQuestion.repeatable_group.group_questions;

        for (const groupSubQuestion of groupQuestions) {
            const instanceQuestionId = `${groupSubQuestion.question_id}_${instanceToRemove}`;

            // Soruları state'den temizle
            this.state.visible_questions = this.state.visible_questions.filter(id => id !== instanceQuestionId);
            this.state.required_questions = this.state.required_questions.filter(id => id !== instanceQuestionId);
            this.state.completed_questions = this.state.completed_questions.filter(id => id !== instanceQuestionId);
            delete this.state.answers[instanceQuestionId];
            delete this.state.validation_errors[instanceQuestionId];
        }

        this.state.group_instances[groupId] = currentCount - 1;

        if (this.debugMode) {
            console.log(`Removed group instance: ${groupId}, count: ${currentCount - 1}`);
        }
    }

    /**
     * Grup için dinamik sorular oluşturur
     */
    public getGroupQuestions(groupId: string): DynamicQuestion[] {
        const groupQuestion = this.template.questions.find(q =>
            q.question_type === 'repeatable_group' && q.repeatable_group?.group_id === groupId
        );

        if (!groupQuestion || !groupQuestion.repeatable_group) {
            return [];
        }

        const instanceCount = this.state.group_instances[groupId] || 0;
        const dynamicQuestions: DynamicQuestion[] = [];

        for (let i = 1; i <= instanceCount; i++) {
            for (const subQuestion of groupQuestion.repeatable_group.group_questions) {
                const instanceQuestion: DynamicQuestion = {
                    ...subQuestion,
                    question_id: `${subQuestion.question_id}_${i}`,
                    question_text: subQuestion.question_text.replace('{{instance}}', i.toString()),
                    group_instance: {
                        group_id: groupId,
                        instance_index: i,
                        parent_question_id: groupQuestion.question_id
                    }
                };
                dynamicQuestions.push(instanceQuestion);
            }
        }

        return dynamicQuestions;
    }

    /**
     * Belirli bir grubun yönetim durumunu döndürür
     */
    public getGroupManagementInfo(groupId: string): {
        current_count: number;
        min_instances: number;
        max_instances: number;
        can_add: boolean;
        can_remove: boolean;
    } {
        const groupQuestion = this.template.questions.find(q =>
            q.question_type === 'repeatable_group' && q.repeatable_group?.group_id === groupId
        );

        if (!groupQuestion || !groupQuestion.repeatable_group) {
            return {
                current_count: 0,
                min_instances: 0,
                max_instances: 0,
                can_add: false,
                can_remove: false
            };
        }

        const currentCount = this.state.group_instances[groupId] || 0;
        const minInstances = groupQuestion.repeatable_group.min_instances;
        const maxInstances = groupQuestion.repeatable_group.max_instances;

        return {
            current_count: currentCount,
            min_instances: minInstances,
            max_instances: maxInstances,
            can_add: currentCount < maxInstances,
            can_remove: currentCount > minInstances
        };
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

        // Is complete check - sadece tüm zorunlu sorular cevaplanmış VE görünür soru kalmamışsa
        const allRequiredAnswered = this.state.completion_percentage === 100;
        const noUnansweredVisibleQuestions = this.state.visible_questions.every(qId =>
            this.state.completed_questions.includes(qId)
        );

        this.state.is_complete = allRequiredAnswered && noUnansweredVisibleQuestions;

        // 🚨 DEBUG: Completion logic detailed logging
        if (this.debugMode) {
            console.log('🎯 COMPLETION CHECK DETAILS:', {
                allRequiredAnswered,
                noUnansweredVisibleQuestions,
                completion_percentage: this.state.completion_percentage,
                is_complete: this.state.is_complete,
                visible_questions: this.state.visible_questions,
                completed_questions: this.state.completed_questions,
                unanswered_visible: this.state.visible_questions.filter(qId =>
                    !this.state.completed_questions.includes(qId)
                )
            });
        }

        this.state.last_updated_at = new Date().toISOString();

        if (this.debugMode) {
            console.log('🔄 Wizard State Updated:', {
                visible_questions: this.state.visible_questions.length,
                completed_questions: this.state.completed_questions.length,
                required_questions: this.state.required_questions.length,
                completion_percentage: this.state.completion_percentage,
                is_complete: this.state.is_complete,
                allRequiredAnswered,
                noUnansweredVisibleQuestions
            });
        }
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