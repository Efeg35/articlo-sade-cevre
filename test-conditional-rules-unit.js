/**
 * Test conditional rules işleyişini
 */

import { DynamicQuestionEngine } from './src/services/dynamicQuestionEngine.js';
import { ANLASMALI_BOSANMA_TEMPLATE } from './src/data/templates/aile-hukuku/anlasmali-bosanma-template.js';

console.log('🧪 Testing Conditional Rules...\n');

// Engine instance oluştur
const engine = new DynamicQuestionEngine(ANLASMALI_BOSANMA_TEMPLATE, true);

console.log('📊 Initial State:');
const initialState = engine.getCurrentState();
console.log('Visible Questions:', initialState.visible_questions);
console.log('Total visible:', initialState.visible_questions.length);

// Önceki soruları cevapla
console.log('\n🔄 Answering previous questions...');
engine.processAnswer('davaci_ad_soyad', 'Ali Yılmaz', false);
engine.processAnswer('davaci_tc', '12345678901', false);
engine.processAnswer('davaci_adres', 'İstanbul, Türkiye', false);
engine.processAnswer('davali_ad_soyad', 'Ayşe Yılmaz', false);
engine.processAnswer('davali_tc', '10987654321', false);
engine.processAnswer('davali_adres', 'Ankara, Türkiye', false);
engine.processAnswer('dava_sehri', 'İstanbul', false);

const beforeMarriageState = engine.getCurrentState();
console.log('Before marriage date - Visible Questions:', beforeMarriageState.visible_questions);
console.log('Before marriage date - Total visible:', beforeMarriageState.visible_questions.length);

// KRITIK: Evlilik tarihi cevapla
console.log('\n🎯 CRITICAL: Answering marriage date...');
const afterMarriageState = engine.processAnswer('evlilik_tarihi', '2020-05-15', false);

console.log('\n📈 After Marriage Date:');
console.log('Visible Questions:', afterMarriageState.visible_questions);
console.log('Total visible:', afterMarriageState.visible_questions.length);
console.log('Should include cocuk_var_mi:', afterMarriageState.visible_questions.includes('cocuk_var_mi'));

// Rule evaluation sonuçlarını kontrol et
console.log('\n🔍 Checking rules manually...');
const marriageQuestion = ANLASMALI_BOSANMA_TEMPLATE.questions.find(q => q.question_id === 'evlilik_tarihi');
console.log('Marriage question rules:', marriageQuestion.conditional_rules);

// Çocuk sorusu template'da var mı?
const childQuestion = ANLASMALI_BOSANMA_TEMPLATE.questions.find(q => q.question_id === 'cocuk_var_mi');
console.log('Child question exists:', !!childQuestion);
console.log('Child question default_visible:', childQuestion?.default_visible);