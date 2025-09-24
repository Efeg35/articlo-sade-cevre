import { z } from 'zod';
import { WizardTemplate, WizardStep, WizardField, WIZARD_CATEGORIES } from '@/types/wizard';

// Validation schemas for common field types
export const wizardSchemas = {
    // Text fields
    requiredText: z.string().min(1, 'Bu alan zorunludur'),
    optionalText: z.string().optional(),
    email: z.string().email('Geçerli bir e-posta adresi girin'),
    phone: z.string().regex(/^[+]?[0-9\s-()]{10,}$/, 'Geçerli bir telefon numarası girin'),

    // Numbers
    positiveNumber: z.number().positive('Pozitif bir sayı girin'),
    currency: z.number().positive('Geçerli bir tutar girin'),

    // Selections
    requiredSelect: z.string().min(1, 'Lütfen bir seçenek seçin'),
    multiSelect: z.array(z.string()).min(1, 'En az bir seçenek seçin'),

    // Dates
    requiredDate: z.date({ required_error: 'Tarih seçin' }),
    futureDate: z.date().refine(date => date > new Date(), 'Gelecek bir tarih seçin'),

    // Boolean
    requiredCheckbox: z.boolean().refine(val => val === true, 'Bu alanı işaretlemeniz gerekiyor'),
};

// Helper function to create a wizard field
export function createWizardField(
    id: string,
    type: WizardField['type'],
    label: string,
    config: Partial<WizardField> = {}
): WizardField {
    return {
        id,
        type,
        label,
        required: false,
        ...config
    };
}

// Helper function to create a wizard step
export function createWizardStep(
    id: string,
    title: string,
    fields: WizardField[],
    validationSchema: z.ZodSchema<Record<string, unknown>>,
    config: Partial<WizardStep> = {}
): WizardStep {
    return {
        id,
        title,
        fields,
        validation: validationSchema,
        ...config
    };
}

// Helper function to create wizard template
export function createWizardTemplate(
    id: string,
    name: string,
    category: string,
    steps: WizardStep[],
    config: Partial<WizardTemplate> = {}
): WizardTemplate {
    return {
        id,
        name,
        category,
        steps,
        description: '',
        estimatedTime: '~5 dakika',
        difficulty: 'kolay',
        tags: [],
        premium: false,
        ...config
    };
}

// Template validation helper
export function validateTemplate(template: WizardTemplate): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!template.id.trim()) {
        errors.push('Template ID boş olamaz');
    }

    if (!template.name.trim()) {
        errors.push('Template adı boş olamaz');
    }

    if (template.steps.length === 0) {
        errors.push('En az bir step gerekli');
    }

    // Validate each step
    template.steps.forEach((step, index) => {
        if (!step.id.trim()) {
            errors.push(`Step ${index + 1}: ID boş olamaz`);
        }

        if (!step.title.trim()) {
            errors.push(`Step ${index + 1}: Başlık boş olamaz`);
        }

        if (step.fields.length === 0) {
            errors.push(`Step ${index + 1}: En az bir field gerekli`);
        }

        // Validate fields
        step.fields.forEach((field, fieldIndex) => {
            if (!field.id.trim()) {
                errors.push(`Step ${index + 1}, Field ${fieldIndex + 1}: ID boş olamaz`);
            }

            if (!field.label.trim()) {
                errors.push(`Step ${index + 1}, Field ${fieldIndex + 1}: Label boş olamaz`);
            }

            // Check if field type has options when needed
            if (['select', 'radio'].includes(field.type) && (!field.options || field.options.length === 0)) {
                errors.push(`Step ${index + 1}, Field ${fieldIndex + 1}: ${field.type} için options gerekli`);
            }
        });
    });

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Get all field IDs from template (for form handling)
export function getTemplateFieldIds(template: WizardTemplate): string[] {
    return template.steps.flatMap(step =>
        step.fields.map(field => field.id)
    );
}

// Check if template has conditional steps
export function hasConditionalSteps(template: WizardTemplate): boolean {
    return template.steps.some(step => step.conditional !== undefined);
}

// Get estimated completion time in minutes
export function getEstimatedTimeInMinutes(template: WizardTemplate): number {
    const timeStr = template.estimatedTime.toLowerCase();
    const matches = timeStr.match(/(\d+)/);

    if (!matches) return 5; // default fallback

    const number = parseInt(matches[1], 10);

    if (timeStr.includes('saat') || timeStr.includes('hour')) {
        return number * 60;
    }

    return number; // assume minutes
}

// Calculate completion percentage based on answered fields
export function calculateCompletionPercentage(
    template: WizardTemplate,
    answers: Record<string, Record<string, unknown>>
): number {
    const allFieldIds = getTemplateFieldIds(template);
    const answeredFields = allFieldIds.filter(fieldId => {
        // Find which step this field belongs to
        const step = template.steps.find(s => s.fields.some(f => f.id === fieldId));
        if (!step) return false;

        const stepAnswers = answers[step.id] || {};
        const answer = stepAnswers[fieldId];

        // Check if field has a meaningful answer
        if (answer === undefined || answer === null || answer === '') {
            return false;
        }

        if (Array.isArray(answer) && answer.length === 0) {
            return false;
        }

        return true;
    });

    return Math.round((answeredFields.length / allFieldIds.length) * 100);
}