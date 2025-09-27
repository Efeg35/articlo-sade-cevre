/**
 * 🎯 Template Index - Yeni Template Sistemi
 * 
 * Tüm kategori template'lerini buradan import edip topla
 * Yeni template'ler kategori bazlı klasörlerde organize edilecek
 */

import type { DynamicTemplate } from '../../types/wizard/WizardTypes';

// Kategori bazlı import'lar
// import { KONUT_TEMPLATES } from './konut';
// import { IS_HUKUKU_TEMPLATES } from './is-hukuku';
import { AILE_HUKUKU_TEMPLATES } from './aile-hukuku';
// import { ICRA_IFLAS_TEMPLATES } from './icra-iflas';

/**
 * Tüm template'leri topla
 */
export const ALL_TEMPLATES: DynamicTemplate[] = [
    ...AILE_HUKUKU_TEMPLATES
];

/**
 * Kategori bazlı template listeleri
 */
export const TEMPLATE_CATEGORIES = {
    'Konut ve Emlak Hukuku': [],
    'İş ve Çalışma Hukuku': [],
    'Aile Hukuku': AILE_HUKUKU_TEMPLATES,
    'Borçlar Hukuku': [],
    'İcra İflas Hukuku': [],
    'Tüketici Hukuku': [],
    'Ceza Hukuku': [],
    'İdari Hukuk': [],
    'Ticaret Hukuku': [],
    'Vergi Hukuku': []
} as const;

/**
 * Template ID'ye göre template bul
 */
export const findTemplateById = (templateId: string): DynamicTemplate | undefined => {
    return ALL_TEMPLATES.find(template => template.template_id === templateId);
};

/**
 * Kategori'ye göre template'leri getir
 */
export const getTemplatesByCategory = (category: string): DynamicTemplate[] => {
    return ALL_TEMPLATES.filter(template => template.category === category);
};

/**
 * Tüm template'lerin listesi (dinamik sistem için)
 */
export const DYNAMIC_TEMPLATES = ALL_TEMPLATES;

// Backward compatibility için
export { ALL_TEMPLATES as DYNAMIC_TEMPLATES_NEW };