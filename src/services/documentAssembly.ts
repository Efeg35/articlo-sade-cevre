/**
 * LawDepot "Akıllı Lego Seti" - Document Assembly Engine
 * Clause'ları birleştirerek final belgeyi oluşturur
 */

import { clauseDB } from '@/services/clauseDatabase';
import { ruleEngine } from '@/services/ruleEngine';
import {
    LegalClause,
    RuleSet,
    UsageContext,
    ClauseResponse
} from '@/types/clause';
import { DocumentAnswers } from '@/services/ruleEngine';

export interface AssemblyResult {
    success: boolean;
    document_text: string;
    document_metadata: DocumentMetadata;
    assembly_log: AssemblyLog[];
    error?: string;
}

export interface DocumentMetadata {
    document_type: string;
    generated_at: string;
    clause_count: number;
    total_characters: number;
    legal_references: string[];
    required_variables: string[];
    missing_variables: string[];
    assembly_version: string;
}

export interface AssemblyLog {
    step: string;
    clause_id?: string;
    status: 'success' | 'warning' | 'error';
    message: string;
    execution_time: number;
}

export interface PlaceholderMap {
    [key: string]: string | number;
}

export class DocumentAssemblyEngine {
    private readonly ASSEMBLY_VERSION = "1.0.0";

    /**
     * Ana document assembly fonksiyonu
     */
    async assembleDocument(
        answers: DocumentAnswers,
        ruleSet: RuleSet,
        usageContext: UsageContext = UsageContext.KIRA_ITIRAZ_DILEKCE
    ): Promise<AssemblyResult> {
        const startTime = Date.now();
        const assemblyLog: AssemblyLog[] = [];

        try {
            this.logStep(assemblyLog, 'initialization', 'success', 'Document assembly started', startTime);

            // 1. Rule Engine ile clause'ları seç
            const ruleProcessingStart = Date.now();
            const ruleResult = await ruleEngine.processRules(answers, ruleSet);

            if (!ruleResult.success) {
                this.logStep(assemblyLog, 'rule_processing', 'error', `Rule processing failed: ${ruleResult.error}`, ruleProcessingStart);
                return this.createErrorResult(assemblyLog, ruleResult.error || 'Rule processing failed');
            }

            this.logStep(assemblyLog, 'rule_processing', 'success', `Selected ${ruleResult.selected_clauses.length} clauses`, ruleProcessingStart);

            // 2. Clause'ları sırala (logical order)
            const sortingStart = Date.now();
            const orderedClauseIds = await ruleEngine.orderClauses(ruleResult.selected_clauses);
            this.logStep(assemblyLog, 'clause_ordering', 'success', 'Clauses ordered successfully', sortingStart);

            // 3. Database'den clause'ları çek
            const fetchingStart = Date.now();
            const clausesResult = await this.fetchClauses(orderedClauseIds);

            if (!clausesResult.success) {
                this.logStep(assemblyLog, 'clause_fetching', 'error', `Clause fetching failed: ${clausesResult.error}`, fetchingStart);
                return this.createErrorResult(assemblyLog, clausesResult.error || 'Clause fetching failed');
            }

            this.logStep(assemblyLog, 'clause_fetching', 'success', `Fetched ${clausesResult.clauses.length} clauses`, fetchingStart);

            // 4. Placeholder map oluştur
            const placeholderStart = Date.now();
            const placeholderMap = this.createPlaceholderMap(answers);
            const { requiredVars, missingVars } = this.analyzePlaceholders(clausesResult.clauses, placeholderMap);

            if (missingVars.length > 0) {
                this.logStep(assemblyLog, 'placeholder_analysis', 'warning', `Missing ${missingVars.length} variables: ${missingVars.join(', ')}`, placeholderStart);
            } else {
                this.logStep(assemblyLog, 'placeholder_analysis', 'success', 'All required variables available', placeholderStart);
            }

            // 5. Clause'ları işleyip birleştir
            const assemblyStart = Date.now();
            const processedClauses = await this.processClauses(clausesResult.clauses, placeholderMap, assemblyLog);
            const documentText = this.assembleFinalDocument(processedClauses);
            this.logStep(assemblyLog, 'document_assembly', 'success', `Document assembled (${documentText.length} chars)`, assemblyStart);

            // 6. Metadata oluştur
            const metadata = this.createDocumentMetadata(
                ruleSet.document_type,
                clausesResult.clauses,
                documentText,
                requiredVars,
                missingVars
            );

            const totalTime = Date.now() - startTime;
            this.logStep(assemblyLog, 'completion', 'success', `Assembly completed in ${totalTime}ms`, startTime);

            return {
                success: true,
                document_text: documentText,
                document_metadata: metadata,
                assembly_log: assemblyLog
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown assembly error';
            this.logStep(assemblyLog, 'error', 'error', errorMessage, startTime);

            return this.createErrorResult(assemblyLog, errorMessage);
        }
    }

    /**
     * Database'den clause'ları çek
     */
    private async fetchClauses(clauseIds: string[]): Promise<{
        success: boolean;
        clauses: LegalClause[];
        error?: string;
    }> {
        try {
            const clauses: LegalClause[] = [];

            for (const clauseId of clauseIds) {
                const result = await clauseDB.getClauseById(clauseId);

                if (result.success && result.data) {
                    // Type guard: getClauseById should return single clause, but type allows array
                    const clause = Array.isArray(result.data) ? result.data[0] : result.data;
                    if (clause) {
                        clauses.push(clause);
                    }
                } else {
                    console.warn(`⚠️ Clause not found: ${clauseId}`);
                    // Missing clause - continue with warning
                }
            }

            return {
                success: true,
                clauses
            };
        } catch (error) {
            return {
                success: false,
                clauses: [],
                error: error instanceof Error ? error.message : 'Clause fetching error'
            };
        }
    }

    /**
     * Answers'dan placeholder map oluştur
     */
    private createPlaceholderMap(answers: DocumentAnswers): PlaceholderMap {
        const map: PlaceholderMap = {};

        // Wizard answers'ı placeholder formatına dönüştür
        Object.entries(answers).forEach(([key, value]) => {
            // snake_case -> UPPER_SNAKE_CASE
            const placeholder = key.toUpperCase();

            if (typeof value === 'string' || typeof value === 'number') {
                map[placeholder] = value;
            } else if (Array.isArray(value)) {
                map[placeholder] = value.join(', ');
            } else {
                map[placeholder] = String(value);
            }
        });

        // Sistem değişkenleri ekle
        map['DILEKCE_TARIHI'] = new Date().toLocaleDateString('tr-TR');
        map['SISTEM_VERSIYONU'] = this.ASSEMBLY_VERSION;

        return map;
    }

    /**
     * Placeholder analizi - hangi değişkenler gerekli, hangisi eksik
     */
    private analyzePlaceholders(clauses: LegalClause[], placeholderMap: PlaceholderMap): {
        requiredVars: string[];
        missingVars: string[];
    } {
        const allRequiredVars = new Set<string>();

        // Tüm clause'lardan required variables topla
        clauses.forEach(clause => {
            clause.required_variables.forEach(varName => {
                allRequiredVars.add(varName);
            });
        });

        const requiredVars = Array.from(allRequiredVars);
        const missingVars = requiredVars.filter(varName => !placeholderMap[varName]);

        return { requiredVars, missingVars };
    }

    /**
     * Clause'ları işle - placeholder değiştir
     */
    private async processClauses(
        clauses: LegalClause[],
        placeholderMap: PlaceholderMap,
        assemblyLog: AssemblyLog[]
    ): Promise<string[]> {
        const processedTexts: string[] = [];

        for (const clause of clauses) {
            const processingStart = Date.now();

            try {
                let processedText = clause.clause_text;

                // Placeholder'ları değiştir
                Object.entries(placeholderMap).forEach(([placeholder, value]) => {
                    const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
                    processedText = processedText.replace(regex, String(value));
                });

                // Eksik placeholder'ları kontrol et
                const remainingPlaceholders = processedText.match(/\{[^}]+\}/g);
                if (remainingPlaceholders) {
                    this.logStep(
                        assemblyLog,
                        'clause_processing',
                        'warning',
                        `Clause ${clause.clause_id}: ${remainingPlaceholders.length} unresolved placeholders`,
                        processingStart
                    );
                }

                processedTexts.push(processedText);

                this.logStep(
                    assemblyLog,
                    'clause_processing',
                    'success',
                    `Processed clause: ${clause.clause_id}`,
                    processingStart
                );

            } catch (error) {
                const errorMsg = `Error processing clause ${clause.clause_id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
                this.logStep(assemblyLog, 'clause_processing', 'error', errorMsg, processingStart);

                // Hata durumunda orijinal metni kullan
                processedTexts.push(clause.clause_text);
            }
        }

        return processedTexts;
    }

    /**
     * Final document'i birleştir
     */
    private assembleFinalDocument(processedTexts: string[]): string {
        return processedTexts
            .filter(text => text.trim().length > 0) // Boş satırları filtrele
            .join('\n\n') // Double newline ile birleştir
            .trim();
    }

    /**
     * Document metadata oluştur
     */
    private createDocumentMetadata(
        documentType: string,
        clauses: LegalClause[],
        documentText: string,
        requiredVars: string[],
        missingVars: string[]
    ): DocumentMetadata {
        // Tüm legal references topla
        const allLegalRefs = new Set<string>();
        clauses.forEach(clause => {
            clause.legal_basis.forEach(ref => allLegalRefs.add(ref));
            if (clause.legal_references) {
                clause.legal_references.forEach(ref => allLegalRefs.add(ref));
            }
        });

        return {
            document_type: documentType,
            generated_at: new Date().toISOString(),
            clause_count: clauses.length,
            total_characters: documentText.length,
            legal_references: Array.from(allLegalRefs),
            required_variables: requiredVars,
            missing_variables: missingVars,
            assembly_version: this.ASSEMBLY_VERSION
        };
    }

    /**
     * Assembly log helper
     */
    private logStep(
        log: AssemblyLog[],
        step: string,
        status: 'success' | 'warning' | 'error',
        message: string,
        startTime: number,
        clauseId?: string
    ): void {
        log.push({
            step,
            clause_id: clauseId,
            status,
            message,
            execution_time: Date.now() - startTime
        });
    }

    /**
     * Error result helper
     */
    private createErrorResult(assemblyLog: AssemblyLog[], error: string): AssemblyResult {
        return {
            success: false,
            document_text: '',
            document_metadata: {
                document_type: 'error',
                generated_at: new Date().toISOString(),
                clause_count: 0,
                total_characters: 0,
                legal_references: [],
                required_variables: [],
                missing_variables: [],
                assembly_version: this.ASSEMBLY_VERSION
            },
            assembly_log: assemblyLog,
            error
        };
    }

    /**
     * Document preview oluştur (ilk 500 karakter)
     */
    generatePreview(documentText: string, maxLength: number = 500): string {
        if (documentText.length <= maxLength) {
            return documentText;
        }

        const preview = documentText.substring(0, maxLength);
        const lastSpaceIndex = preview.lastIndexOf(' ');

        return lastSpaceIndex > maxLength * 0.8
            ? preview.substring(0, lastSpaceIndex) + '...'
            : preview + '...';
    }

    /**
     * Document statistics
     */
    getDocumentStats(documentText: string): {
        characters: number;
        words: number;
        lines: number;
        paragraphs: number;
    } {
        const characters = documentText.length;
        const words = documentText.split(/\s+/).filter(word => word.length > 0).length;
        const lines = documentText.split('\n').length;
        const paragraphs = documentText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

        return {
            characters,
            words,
            lines,
            paragraphs
        };
    }
}

// Singleton instance
export const documentAssembler = new DocumentAssemblyEngine();