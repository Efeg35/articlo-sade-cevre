/**
 * LawDepot "Akıllı Lego Seti" - Rule Engine
 * Deterministik kural motoru - aynı input için her zaman aynı output
 */

import {
    RuleSet,
    ConditionalRule,
    ClauseCondition,
    UsageContext
} from '@/types/clause';
import { clauseDB } from '@/services/clauseDatabase';

export interface RuleProcessingResult {
    success: boolean;
    selected_clauses: string[];        // Seçilen clause_id'ler
    execution_log: RuleExecutionLog[];
    error?: string;
}

export interface RuleExecutionLog {
    rule_id: string;
    condition_result: boolean;
    selected_clauses: string[];
    execution_time: number;
    notes?: string;
}

export interface DocumentAnswers {
    [key: string]: string | number | boolean | string[] | number[];
}

export class RuleEngineService {
    /**
     * Ana rule processing fonksiyonu - Deterministik çalışır
     */
    async processRules(
        answers: DocumentAnswers,
        ruleSet: RuleSet
    ): Promise<RuleProcessingResult> {
        const startTime = Date.now();
        const executionLog: RuleExecutionLog[] = [];
        const selectedClauses: Set<string> = new Set();

        try {
            console.log(`🔧 Rule Engine: Processing ${ruleSet.rules.length} rules for ${ruleSet.document_type}`);

            // Kuralları priority sırasına göre işle (deterministik order)
            const sortedRules = [...ruleSet.rules].sort((a, b) => a.priority - b.priority);

            for (const rule of sortedRules) {
                const ruleStartTime = Date.now();

                try {
                    const conditionResult = this.evaluateConditions(rule.condition, answers);
                    const ruleExecutionTime = Date.now() - ruleStartTime;

                    let ruleClauses: string[] = [];

                    if (conditionResult) {
                        // Condition true ise then_clauses'ları ekle
                        ruleClauses = rule.then_clauses || [];
                    } else if (rule.else_clauses) {
                        // Condition false ise else_clauses'ları ekle
                        ruleClauses = rule.else_clauses;
                    }

                    // Seçilen clause'ları ana sete ekle
                    ruleClauses.forEach(clauseId => selectedClauses.add(clauseId));

                    // Execution log kaydet
                    executionLog.push({
                        rule_id: rule.rule_id,
                        condition_result: conditionResult,
                        selected_clauses: ruleClauses,
                        execution_time: ruleExecutionTime,
                        notes: `Evaluated ${rule.condition.length} conditions`
                    });

                    console.log(`  ✓ Rule ${rule.rule_id}: ${conditionResult ? 'TRUE' : 'FALSE'} -> Selected ${ruleClauses.length} clauses`);

                } catch (ruleError) {
                    console.error(`  ❌ Error in rule ${rule.rule_id}:`, ruleError);
                    executionLog.push({
                        rule_id: rule.rule_id,
                        condition_result: false,
                        selected_clauses: [],
                        execution_time: Date.now() - ruleStartTime,
                        notes: `Error: ${ruleError instanceof Error ? ruleError.message : 'Unknown error'}`
                    });
                }
            }

            const totalExecutionTime = Date.now() - startTime;
            const finalClauses = Array.from(selectedClauses);

            console.log(`🎯 Rule Engine: Completed in ${totalExecutionTime}ms - Selected ${finalClauses.length} clauses`);

            return {
                success: true,
                selected_clauses: finalClauses,
                execution_log: executionLog
            };

        } catch (error) {
            console.error('❌ Rule Engine Error:', error);
            return {
                success: false,
                selected_clauses: [],
                execution_log: executionLog,
                error: error instanceof Error ? error.message : 'Unknown rule processing error'
            };
        }
    }

    /**
     * Condition evaluation - Deterministik boolean logic
     */
    private evaluateConditions(conditions: ClauseCondition[], answers: DocumentAnswers): boolean {
        // Tüm condition'lar AND logic ile değerlendirilir (LawDepot model)
        for (const condition of conditions) {
            if (!this.evaluateCondition(condition, answers)) {
                return false; // Herhangi biri false ise tümü false
            }
        }
        return true; // Tümü true ise sonuç true
    }

    /**
     * Tek condition evaluation
     */
    private evaluateCondition(condition: ClauseCondition, answers: DocumentAnswers): boolean {
        const fieldValue = answers[condition.field];
        const conditionValue = condition.value;

        // Değer yoksa false dön
        if (fieldValue === undefined || fieldValue === null) {
            return false;
        }

        switch (condition.operator) {
            case '>':
                return Number(fieldValue) > Number(conditionValue);

            case '<':
                return Number(fieldValue) < Number(conditionValue);

            case '==':
                return fieldValue === conditionValue;

            case '!=':
                return fieldValue !== conditionValue;

            case 'includes':
                if (Array.isArray(fieldValue)) {
                    const arrayField = fieldValue as (string | number)[];
                    if (Array.isArray(conditionValue)) {
                        // Array.includes(array) - herhangi birini içeriyorsa true
                        const arrayCondition = conditionValue as (string | number)[];
                        return arrayCondition.some(val => arrayField.includes(val));
                    } else {
                        // Array.includes(value)
                        return arrayField.includes(conditionValue as string | number);
                    }
                } else {
                    // String.includes
                    return String(fieldValue).includes(String(conditionValue));
                }

            case 'excludes':
                if (Array.isArray(fieldValue)) {
                    const arrayField = fieldValue as (string | number)[];
                    if (Array.isArray(conditionValue)) {
                        // Array hiçbirini içermiyorsa true
                        const arrayCondition = conditionValue as (string | number)[];
                        return !arrayCondition.some(val => arrayField.includes(val));
                    } else {
                        // Array value'yu içermiyorsa true
                        return !arrayField.includes(conditionValue as string | number);
                    }
                } else {
                    // String içermiyorsa true
                    return !String(fieldValue).includes(String(conditionValue));
                }

            default:
                console.warn(`Unknown operator: ${condition.operator}`);
                return false;
        }
    }

    /**
     * Clause'ları öncelik sırasına göre sırala
     */
    async orderClauses(clauseIds: string[]): Promise<string[]> {
        try {
            // Clause'ları category ve logical order'a göre sırala
            const clauseOrder = [
                'HEADER_',           // Başlık önce
                'PLAINTIFF_INFO_',   // Davacı bilgileri
                'DEFENDANT_INFO_',   // Davalı bilgileri  
                'PROPERTY_DETAILS_', // Mülk bilgileri
                'CONTRACT_INFO_',    // Sözleşme bilgileri
                'RENT_INCREASE_',    // Artırım detayları
                '_OBJECTION_',       // İtiraz gerekçeleri
                'COUNTER_OFFER_',    // Karşı öneri
                'REQUEST_',          // Talepler
                'SIGNATURE_'         // İmza en son
            ];

            return clauseIds.sort((a, b) => {
                const aIndex = clauseOrder.findIndex(prefix => a.includes(prefix));
                const bIndex = clauseOrder.findIndex(prefix => b.includes(prefix));

                if (aIndex === -1 && bIndex === -1) return 0;
                if (aIndex === -1) return 1;
                if (bIndex === -1) return -1;

                return aIndex - bIndex;
            });
        } catch (error) {
            console.error('Error ordering clauses:', error);
            return clauseIds; // Hata durumunda orijinal sırayı döndür
        }
    }

    /**
     * Rule set validation
     */
    validateRuleSet(ruleSet: RuleSet): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!ruleSet.document_type) {
            errors.push('Document type is required');
        }

        if (!ruleSet.rules || ruleSet.rules.length === 0) {
            errors.push('At least one rule is required');
        }

        ruleSet.rules.forEach((rule, index) => {
            if (!rule.rule_id) {
                errors.push(`Rule ${index}: rule_id is required`);
            }

            if (!rule.condition || rule.condition.length === 0) {
                errors.push(`Rule ${rule.rule_id}: At least one condition is required`);
            }

            if (!rule.then_clauses || rule.then_clauses.length === 0) {
                errors.push(`Rule ${rule.rule_id}: then_clauses cannot be empty`);
            }

            rule.condition.forEach((condition, condIndex) => {
                if (!condition.field) {
                    errors.push(`Rule ${rule.rule_id}, Condition ${condIndex}: field is required`);
                }

                if (!['>', '<', '==', '!=', 'includes', 'excludes'].includes(condition.operator)) {
                    errors.push(`Rule ${rule.rule_id}, Condition ${condIndex}: Invalid operator ${condition.operator}`);
                }

                if (condition.value === undefined || condition.value === null) {
                    errors.push(`Rule ${rule.rule_id}, Condition ${condIndex}: value is required`);
                }
            });
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Rule test - Development için
     */
    async testRule(
        rule: ConditionalRule,
        testAnswers: DocumentAnswers
    ): Promise<{
        conditionResult: boolean;
        selectedClauses: string[];
        details: string;
    }> {
        try {
            const conditionResult = this.evaluateConditions(rule.condition, testAnswers);
            const selectedClauses = conditionResult ? rule.then_clauses : (rule.else_clauses || []);

            const details = rule.condition.map(cond => {
                const result = this.evaluateCondition(cond, testAnswers);
                return `${cond.field} ${cond.operator} ${cond.value} = ${result}`;
            }).join(', ');

            return {
                conditionResult,
                selectedClauses,
                details
            };
        } catch (error) {
            return {
                conditionResult: false,
                selectedClauses: [],
                details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}

// Singleton instance
export const ruleEngine = new RuleEngineService();