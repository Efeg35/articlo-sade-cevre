/**
 * LawDepot "Akıllı Lego Seti" - Main Document Generator
 * Tüm sistemi entegre eden ana service
 */

import { clauseDB } from '@/services/clauseDatabase';
import { ruleEngine } from '@/services/ruleEngine';
import { documentAssembler } from '@/services/documentAssembly';
import { RENT_DISPUTE_RULE_SET, validateRentDisputeAnswers } from '@/data/rentDisputeRules';
import { seedRentDisputeClauses } from '@/data/clauseSeedData';
import {
    UsageContext,
    RuleSet
} from '@/types/clause';
import { AssemblyResult } from '@/services/documentAssembly';
import { DocumentAnswers } from '@/services/ruleEngine';

export interface LawDepotGenerationRequest {
    document_type: 'kira_itiraz' | 'is_sozlesme' | 'genel_dilekce';
    wizard_answers: Record<string, string | number | boolean | string[]>;
    user_id?: string;
    session_id?: string;
}

export interface LawDepotGenerationResult {
    success: boolean;
    document: {
        title: string;
        content: string;
        preview: string;
        metadata: {
            document_type: string;
            generated_at: string;
            clause_count: number;
            legal_references: string[];
            word_count: number;
            character_count: number;
            estimated_pages: number;
            lawdepot_quality_score: number;
        };
    };
    generation_log: GenerationStep[];
    validation_results?: {
        isValid: boolean;
        missingFields: string[];
        warnings: string[];
    };
    error?: string;
    performance_stats?: {
        total_time_ms: number;
        clause_selection_time_ms: number;
        assembly_time_ms: number;
        post_processing_time_ms: number;
    };
}

export interface GenerationStep {
    step: string;
    status: 'success' | 'warning' | 'error';
    message: string;
    timestamp: string;
    duration_ms: number;
}

export class LawDepotDocumentGenerator {
    private readonly VERSION = "1.0.0";

    /**
     * Ana document generation fonksiyonu - LawDepot kalitesinde
     */
    async generateDocument(request: LawDepotGenerationRequest): Promise<LawDepotGenerationResult> {
        const startTime = Date.now();
        const generationLog: GenerationStep[] = [];

        try {
            this.logStep(generationLog, 'initialization', 'success', 'LawDepot Document Generation started', startTime);

            // 1. Input validation
            const validationStart = Date.now();
            const validationResult = this.validateRequest(request);
            this.logStep(generationLog, 'validation', validationResult.isValid ? 'success' : 'warning',
                `Validation completed - ${validationResult.missingFields.length} missing fields`, validationStart);

            // 2. Document type'a göre rule set seç
            const ruleSetStart = Date.now();
            const ruleSet = this.getRuleSetForDocumentType(request.document_type);
            const usageContext = this.getUsageContext(request.document_type);
            this.logStep(generationLog, 'rule_set_selection', 'success',
                `Rule set loaded - ${ruleSet.rules.length} rules`, ruleSetStart);

            // 3. Database'in hazır olduğundan emin ol
            await this.ensureDatabaseReady();
            this.logStep(generationLog, 'database_check', 'success', 'Clause database ready', Date.now());

            // 4. Document assembly
            const assemblyStart = Date.now();
            const assemblyResult = await documentAssembler.assembleDocument(
                request.wizard_answers as DocumentAnswers,
                ruleSet,
                usageContext
            );

            if (!assemblyResult.success) {
                this.logStep(generationLog, 'assembly', 'error', assemblyResult.error || 'Assembly failed', assemblyStart);
                return this.createErrorResult(generationLog, assemblyResult.error || 'Document assembly failed');
            }

            const assemblyTime = Date.now() - assemblyStart;
            this.logStep(generationLog, 'assembly', 'success',
                `Document assembled - ${assemblyResult.document_metadata.clause_count} clauses`, assemblyStart);

            // 5. Post-processing ve quality analysis
            const postProcessingStart = Date.now();
            const processedDocument = this.postProcessDocument(assemblyResult.document_text);
            const qualityScore = this.calculateQualityScore(assemblyResult);
            const documentStats = documentAssembler.getDocumentStats(processedDocument);
            const preview = documentAssembler.generatePreview(processedDocument, 400);

            this.logStep(generationLog, 'post_processing', 'success',
                `Post-processing completed - Quality score: ${qualityScore}/100`, postProcessingStart);

            // 6. Final result creation
            const totalTime = Date.now() - startTime;
            this.logStep(generationLog, 'completion', 'success',
                `Generation completed in ${totalTime}ms`, startTime);

            return {
                success: true,
                document: {
                    title: this.generateDocumentTitle(request.document_type, request.wizard_answers),
                    content: processedDocument,
                    preview: preview,
                    metadata: {
                        document_type: request.document_type,
                        generated_at: new Date().toISOString(),
                        clause_count: assemblyResult.document_metadata.clause_count,
                        legal_references: assemblyResult.document_metadata.legal_references,
                        word_count: documentStats.words,
                        character_count: documentStats.characters,
                        estimated_pages: Math.ceil(documentStats.words / 250), // ~250 words per page
                        lawdepot_quality_score: qualityScore
                    }
                },
                generation_log: generationLog,
                validation_results: validationResult,
                performance_stats: {
                    total_time_ms: totalTime,
                    clause_selection_time_ms: assemblyTime * 0.3, // Estimated
                    assembly_time_ms: assemblyTime * 0.6,
                    post_processing_time_ms: Date.now() - postProcessingStart
                }
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown generation error';
            this.logStep(generationLog, 'error', 'error', errorMessage, startTime);
            return this.createErrorResult(generationLog, errorMessage);
        }
    }

    /**
     * Request validation - LawDepot standardında
     */
    private validateRequest(request: LawDepotGenerationRequest): {
        isValid: boolean;
        missingFields: string[];
        warnings: string[];
    } {
        // Document type'a göre özel validation
        switch (request.document_type) {
            case 'kira_itiraz':
                return validateRentDisputeAnswers(request.wizard_answers as Record<string, string | number | boolean>);

            default:
                // Genel validation
                return {
                    isValid: Object.keys(request.wizard_answers).length > 0,
                    missingFields: Object.keys(request.wizard_answers).length === 0 ? ['wizard_answers'] : [],
                    warnings: []
                };
        }
    }

    /**
     * Document type'a göre rule set seç
     */
    private getRuleSetForDocumentType(documentType: string): RuleSet {
        switch (documentType) {
            case 'kira_itiraz':
                return RENT_DISPUTE_RULE_SET;

            default:
                throw new Error(`Unsupported document type: ${documentType}`);
        }
    }

    /**
     * Usage context belirle
     */
    private getUsageContext(documentType: string): UsageContext {
        switch (documentType) {
            case 'kira_itiraz':
                return UsageContext.KIRA_ITIRAZ_DILEKCE;
            case 'is_sozlesme':
                return UsageContext.IS_SOZLESME;
            default:
                return UsageContext.GENEL_DILEKCE;
        }
    }

    /**
     * Database hazırlık kontrolü - seed data varsa yükle
     */
    private async ensureDatabaseReady(): Promise<void> {
        try {
            // Check if clauses exist
            const existingClauses = await clauseDB.getClausesByUsageContext(UsageContext.KIRA_ITIRAZ_DILEKCE);

            const clauseData = existingClauses.data;
            if (!existingClauses.success || !clauseData || (Array.isArray(clauseData) ? clauseData.length === 0 : false)) {
                console.log('📦 Seeding clause database...');
                await seedRentDisputeClauses();
            }
        } catch (error) {
            console.warn('⚠️ Database seeding warning:', error);
            // Continue without seeding - production may already have data
        }
    }

    /**
     * Post-processing - format düzenleme, temizlik
     */
    private postProcessDocument(documentText: string): string {
        return documentText
            // Fazla boşlukları temizle
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            // Satır başı boşluklarını düzenle
            .replace(/^\s+/gm, '')
            // Son düzenleme
            .trim();
    }

    /**
     * LawDepot kalite skoru hesaplama
     */
    private calculateQualityScore(assemblyResult: AssemblyResult): number {
        let score = 100;

        // Missing variables penalty
        const missingVarCount = assemblyResult.document_metadata.missing_variables.length;
        score -= missingVarCount * 5; // Her eksik değişken -5 puan

        // Clause count bonus/penalty
        const clauseCount = assemblyResult.document_metadata.clause_count;
        if (clauseCount < 5) score -= 10; // Çok az clause
        if (clauseCount > 15) score -= 5;  // Çok fazla clause

        // Legal references bonus
        const legalRefCount = assemblyResult.document_metadata.legal_references.length;
        if (legalRefCount > 3) score += 5; // Yeterli yasal dayanak

        // Character count check
        const charCount = assemblyResult.document_metadata.total_characters;
        if (charCount < 1000) score -= 15; // Çok kısa belge
        if (charCount > 10000) score -= 10; // Çok uzun belge

        // Assembly log errors
        assemblyResult.assembly_log.forEach(log => {
            if (log.status === 'error') score -= 10;
            if (log.status === 'warning') score -= 2;
        });

        return Math.max(0, Math.min(100, score)); // 0-100 aralığında
    }

    /**
     * Document title generator
     */
    private generateDocumentTitle(documentType: string, answers: Record<string, string | number | boolean | string[]>): string {
        switch (documentType) {
            case 'kira_itiraz': {
                const plaintiff = answers.kiraci_ad_soyad || 'Kiracı';
                const property = answers.mulk_il_ilce || 'Taşınmaz';
                return `${plaintiff} - Kira Artırım İtirazı (${property})`;
            }

            default:
                return `Hukuki Belge - ${documentType}`;
        }
    }

    /**
     * Generation log helper
     */
    private logStep(
        log: GenerationStep[],
        step: string,
        status: 'success' | 'warning' | 'error',
        message: string,
        startTime: number
    ): void {
        log.push({
            step,
            status,
            message,
            timestamp: new Date().toISOString(),
            duration_ms: Date.now() - startTime
        });
    }

    /**
     * Error result helper
     */
    private createErrorResult(generationLog: GenerationStep[], error: string): LawDepotGenerationResult {
        return {
            success: false,
            document: {
                title: 'Hata',
                content: '',
                preview: '',
                metadata: {
                    document_type: 'error',
                    generated_at: new Date().toISOString(),
                    clause_count: 0,
                    legal_references: [],
                    word_count: 0,
                    character_count: 0,
                    estimated_pages: 0,
                    lawdepot_quality_score: 0
                }
            },
            generation_log: generationLog,
            error
        };
    }

    /**
     * Development için quick test
     */
    async quickTest(): Promise<void> {
        console.log('🧪 LawDepot Generator Quick Test');

        const testRequest: LawDepotGenerationRequest = {
            document_type: 'kira_itiraz',
            wizard_answers: {
                kiraci_ad_soyad: 'Ahmet Yılmaz',
                kiraci_tc: '12345678901',
                kiraci_adres: 'Kadıköy, İstanbul',
                ev_sahibi_ad_soyad: 'Mehmet Demir',
                ev_sahibi_adres: 'Beşiktaş, İstanbul',
                mulk_adres: 'Kadıköy Mah. Test Sk. No:5 D:3',
                mulk_il_ilce: 'İstanbul/Kadıköy',
                sozlesme_tarihi: '15.01.2023',
                ilk_kira_bedeli: 3000,
                mevcut_kira_bedeli: 3000,
                artirim_talep_tarihi: '15.01.2024',
                eski_kira_bedeli: 3000,
                yeni_kira_talebi: 4200,
                artirim_orani: 40,
                itiraz_turu: 'karsi_oneri',
                karsi_oneri_var: true,
                onerilen_kira_bedeli: 3500
            }
        };

        const result = await this.generateDocument(testRequest);

        console.log('✅ Test Result:', {
            success: result.success,
            title: result.document.title,
            quality_score: result.document.metadata.lawdepot_quality_score,
            clause_count: result.document.metadata.clause_count,
            word_count: result.document.metadata.word_count,
            preview: result.document.preview.substring(0, 200) + '...'
        });

        if (result.error) {
            console.error('❌ Test Error:', result.error);
        }
    }
}

// Singleton instance
export const lawdepotGenerator = new LawDepotDocumentGenerator();