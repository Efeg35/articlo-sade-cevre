// Document Template System Types
export interface TemplateField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'date' | 'select' | 'number';
    placeholder?: string;
    required?: boolean;
    options?: string[]; // for select type
    validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
    };
}

export interface DocumentTemplate {
    id: string;
    title: string;
    description: string;
    category: TemplateCategory;
    icon: string;
    estimatedTime: string; // "5-10 dakika"
    complexity: 'Kolay' | 'Orta' | 'Zor';
    fields: TemplateField[];
    template: string; // Template string with placeholders like {{field_id}}
    legalNote?: string;
    tags: string[];
    popular?: boolean;
}

export type TemplateCategory =
    | 'mahkeme'
    | 'icra'
    | 'is_hukuku'
    | 'kira'
    | 'aile_hukuku'
    | 'borçlar_hukuku'
    | 'ceza_hukuku'
    | 'idare_hukuku'
    | 'ticaret_hukuku';

export interface TemplateData {
    [fieldId: string]: string | number | Date;
}

export interface GeneratedDocument {
    templateId: string;
    title: string;
    content: string;
    generatedAt: Date;
    templateData: TemplateData;
}