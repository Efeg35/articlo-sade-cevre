/**
 * 🎯 Aile Hukuku Template'leri
 * 
 * Tüm aile hukuku ile ilgili dinamik template'leri bu dosyadan export ediyoruz
 */

import { CEKISMELI_BOSANMA_TEMPLATE } from './cekismeli-bosanma-template';
import { ANLASMALI_BOSANMA_TEMPLATE } from './anlasmali-bosanma-template';
import type { DynamicTemplate } from '../../../types/wizard/WizardTypes';

/**
 * Tüm Aile Hukuku template'leri
 */
export const AILE_HUKUKU_TEMPLATES: DynamicTemplate[] = [
    CEKISMELI_BOSANMA_TEMPLATE,
    ANLASMALI_BOSANMA_TEMPLATE
];

/**
 * Template ID'leri - kolay erişim için
 */
export const AILE_HUKUKU_TEMPLATE_IDS = {
    CEKISMELI_BOSANMA: 'cekismeli-bosanma-dava-dilekcesi',
    ANLASMALI_BOSANMA: 'anlasmali-bosanma-protokol-dilekcesi'
} as const;

// Individual exports
export { CEKISMELI_BOSANMA_TEMPLATE, ANLASMALI_BOSANMA_TEMPLATE };