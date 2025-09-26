/**
 * 🎯 Dynamic Templates Registry
 * 
 * Yeni template'ler buraya eklenecek.
 * Template generation için başka chat kullanılacak.
 */

import type {
    DynamicTemplate,
} from '../types/wizard/dynamicWizard';

/**
 * Tüm dinamik template'leri export et - ŞU ANDA BOŞ
 */
export const DYNAMIC_TEMPLATES: DynamicTemplate[] = [];

/**
 * Template ID'ye göre template bul
 */
export const getDynamicTemplate = (templateId: string): DynamicTemplate | undefined => {
    return DYNAMIC_TEMPLATES.find(template => template.template_id === templateId);
};

/**
 * Template validation utility
 */
export const validateDynamicTemplate = (template: DynamicTemplate): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    // Basic checks
    if (!template.questions.length) {
        errors.push('Template must have at least one question');
    }

    if (!template.initial_questions.length) {
        errors.push('Template must have at least one initial question');
    }

    // Check if initial questions exist in questions array
    for (const initialQ of template.initial_questions) {
        if (!template.questions.find(q => q.question_id === initialQ)) {
            errors.push(`Initial question '${initialQ}' not found in questions array`);
        }
    }

    // Check rule targets
    for (const question of template.questions) {
        for (const rule of question.conditional_rules) {
            const targetExists = template.questions.some(q => q.question_id === rule.target_id);
            if (!targetExists) {
                errors.push(`Rule target '${rule.target_id}' not found in questions`);
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};