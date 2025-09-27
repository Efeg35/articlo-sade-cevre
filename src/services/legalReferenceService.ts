/**
 * 🏛️ Legal Reference Database Service
 * 
 * Yargi-MCP server ile entegre olarak Turkish legal codes ve
 * precedent decisions'lara erişim sağlar.
 * 
 * Wizard template'lere dinamik hukuki referanslar ekler.
 */

import type {
    DynamicTemplate,
    DynamicQuestion,
    UserAnswer
} from '../types/wizard/WizardTypes';

export interface LegalReference {
    code: string;
    title: string;
    article?: string;
    description: string;
    source: 'law' | 'regulation' | 'precedent' | 'constitution';
    url?: string;
    relevance_score: number; // 0-100 arası
    last_updated: string;
}

export interface LegalValidationResult {
    isValid: boolean;
    references: LegalReference[];
    warnings: string[];
    suggestions: string[];
    confidence_score: number; // 0-100 arası
}

export interface LegalQueryRequest {
    keywords: string[];
    legal_domain: 'civil' | 'commercial' | 'labor' | 'criminal' | 'administrative';
    document_type: 'contract' | 'petition' | 'agreement' | 'application';
    max_results?: number;
}

export class LegalReferenceService {
    private static instance: LegalReferenceService;
    private cache: Map<string, LegalReference[]> = new Map();
    private cacheExpiry: Map<string, number> = new Map();
    private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 saat

    private constructor() {
        // Singleton pattern
    }

    public static getInstance(): LegalReferenceService {
        if (!LegalReferenceService.instance) {
            LegalReferenceService.instance = new LegalReferenceService();
        }
        return LegalReferenceService.instance;
    }

    /**
     * Template için ilgili hukuki referansları getirir
     */
    public async getLegalReferencesForTemplate(template: DynamicTemplate): Promise<LegalReference[]> {
        const cacheKey = `template_${template.template_id}`;

        // Cache kontrolü
        if (this.isValidCache(cacheKey)) {
            const cachedResult = this.cache.get(cacheKey);
            if (cachedResult) {
                return cachedResult;
            }
        }

        try {
            const queryRequest = this.buildQueryFromTemplate(template);
            const references = await this.queryLegalDatabase(queryRequest);

            // Cache'e kaydet
            this.cache.set(cacheKey, references);
            this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);

            return references;
        } catch (error) {
            console.error('Legal reference query failed:', error);
            return this.getFallbackReferences(template);
        }
    }

    /**
     * Belge türüne göre hukuki validasyon yapar
     */
    public async validateLegalCompliance(
        template: DynamicTemplate,
        answers: Record<string, UserAnswer>
    ): Promise<LegalValidationResult> {
        try {
            const references = await this.getLegalReferencesForTemplate(template);
            const validationResult = await this.performLegalValidation(template, answers, references);

            return validationResult;
        } catch (error) {
            console.error('Legal validation failed:', error);
            return {
                isValid: true, // Failsafe - hata durumunda engellemeyiz
                references: [],
                warnings: ['Hukuki kontrol yapılamadı. Manuel inceleme önerilir.'],
                suggestions: [],
                confidence_score: 0
            };
        }
    }

    /**
     * Yargi-MCP server ile sorgu yapar
     */
    private async queryLegalDatabase(request: LegalQueryRequest): Promise<LegalReference[]> {
        const results: LegalReference[] = [];

        try {
            // Dual MCP strategy: Hem emsal kararlar hem kanun metinleri
            const searchPhrase = request.keywords.join(' AND ');

            // Parallel queries to both MCP servers
            const [jurisprudenceResults, legislationResults] = await Promise.all([
                this.queryYargiMcp([searchPhrase]),      // Emsal kararlar
                this.queryMevzuatMcp([searchPhrase])     // Kanun metinleri
            ]);

            // Process Yargi-MCP results (Emsal kararlar)
            if (jurisprudenceResults.results && Array.isArray(jurisprudenceResults.results)) {
                for (const result of jurisprudenceResults.results) {
                    if (typeof result === 'object' && result !== null) {
                        const item = result as {
                            title?: string;
                            name?: string;
                            summary?: string;
                            content?: string;
                            date?: string;
                            url?: string;
                        };

                        const legalRef: LegalReference = {
                            code: this.extractCaseNumber(item.title || item.name || ''),
                            title: item.title || item.name || 'Bilinmeyen Emsal Karar',
                            description: this.truncateDescription(item.summary || item.content || ''),
                            source: 'precedent',
                            relevance_score: this.calculateRelevanceScore(item.title || '', request.keywords),
                            last_updated: item.date || new Date().toISOString(),
                            url: item.url || undefined
                        };

                        results.push(legalRef);
                    }
                }
            }

            // Process Mevzuat-MCP results (Kanun metinleri)
            if (legislationResults.results && Array.isArray(legislationResults.results)) {
                for (const result of legislationResults.results) {
                    if (typeof result === 'object' && result !== null) {
                        const item = result as {
                            title?: string;
                            name?: string;
                            article?: string;
                            content?: string;
                            summary?: string;
                            law_name?: string;
                            law_number?: string;
                            url?: string;
                        };

                        const legalRef: LegalReference = {
                            code: this.extractLawCode(item),
                            title: item.title || item.name || item.law_name || 'Bilinmeyen Kanun',
                            article: item.article,
                            description: this.truncateDescription(item.content || item.summary || ''),
                            source: 'law',
                            relevance_score: this.calculateRelevanceScore(item.title || item.law_name || '', request.keywords),
                            last_updated: new Date().toISOString(),
                            url: item.url || undefined
                        };

                        results.push(legalRef);
                    }
                }
            }

            // Fallback: Eğer MCP'den sonuç gelmezse mock data
            if (results.length === 0) {
                if (request.legal_domain === 'civil' && request.document_type === 'contract') {
                    results.push({
                        code: 'TBK_299',
                        title: 'Türk Borçlar Kanunu Madde 299',
                        article: '299',
                        description: 'Kira sözleşmesi tanımı ve temel unsurları',
                        source: 'law',
                        relevance_score: 95,
                        last_updated: new Date().toISOString()
                    });
                }

                if (request.legal_domain === 'labor' && request.document_type === 'contract') {
                    results.push({
                        code: 'IK_8',
                        title: 'İş Kanunu Madde 8',
                        article: '8',
                        description: 'İş sözleşmesinin türleri',
                        source: 'law',
                        relevance_score: 92,
                        last_updated: new Date().toISOString()
                    });
                }
            }

        } catch (error) {
            console.error('Legal database query failed:', error);

            // Error durumunda minimal fallback
            results.push({
                code: 'FALLBACK',
                title: 'Hukuki Referans Bulunamadı',
                description: 'Hukuki referans sorgusu başarısız oldu. Manuel araştırma önerilir.',
                source: 'law',
                relevance_score: 50,
                last_updated: new Date().toISOString()
            });
        }

        return results.slice(0, request.max_results || 10);
    }

    /**
     * Template'ten sorgu parametrelerini oluşturur
     */
    private buildQueryFromTemplate(template: DynamicTemplate): LegalQueryRequest {
        // Template kategori ve içeriğinden hukuki alan çıkarımı
        const keywords: string[] = [];
        let legal_domain: LegalQueryRequest['legal_domain'] = 'civil';
        let document_type: LegalQueryRequest['document_type'] = 'contract';

        // Template name'den keywords çıkar
        if (template.template_name.toLowerCase().includes('kira')) {
            keywords.push('kira', 'sözleşme', 'emlak');
            legal_domain = 'civil';
            document_type = 'contract';
        }

        if (template.template_name.toLowerCase().includes('iş') ||
            template.template_name.toLowerCase().includes('çalışma')) {
            keywords.push('iş', 'çalışma', 'istihdam');
            legal_domain = 'labor';
            document_type = 'contract';
        }

        // Category'den domain çıkarımı
        if (template.category.includes('İş')) {
            legal_domain = 'labor';
        } else if (template.category.includes('Konut') || template.category.includes('Emlak')) {
            legal_domain = 'civil';
        }

        // Question text'lerden de keywords çıkar
        for (const question of template.questions) {
            const questionWords = this.extractLegalKeywords(question.question_text);
            keywords.push(...questionWords);
        }

        return {
            keywords: [...new Set(keywords)], // Duplicate'leri temizle
            legal_domain,
            document_type,
            max_results: 8
        };
    }

    /**
     * Sorudan hukuki anahtar kelimeleri çıkarır
     */
    private extractLegalKeywords(text: string): string[] {
        const legalTerms = [
            'sözleşme', 'depozito', 'kira', 'maaş', 'çalışma', 'süre',
            'fesih', 'tazminat', 'yükümlülük', 'hak', 'görev', 'sorumluluk',
            'bedel', 'ödeme', 'teslim', 'garanti', 'sigorta'
        ];

        const words = text.toLowerCase().split(/\s+/);
        return words.filter(word => legalTerms.some(term => word.includes(term)));
    }

    /**
     * Hukuki uyumluluk kontrolü yapar
     */
    private async performLegalValidation(
        template: DynamicTemplate,
        answers: Record<string, UserAnswer>,
        references: LegalReference[]
    ): Promise<LegalValidationResult> {
        const warnings: string[] = [];
        const suggestions: string[] = [];
        let confidenceScore = 85; // Başlangıç güven skoru

        // Temel kontroller
        if (template.template_id.includes('kira')) {
            // Kira sözleşmesi özel kontrolleri
            if (answers['monthly-rent'] && typeof answers['monthly-rent'].value === 'number') {
                const rent = answers['monthly-rent'].value;
                if (rent < 1000) {
                    warnings.push('Kira bedeli piyasa ortalamasının altında görünüyor.');
                    confidenceScore -= 5;
                }
                if (rent > 50000) {
                    suggestions.push('Yüksek kira bedeli için ek güvence önlemleri değerlendirilmelidir.');
                }
            }

            if (answers['security-deposit'] && answers['monthly-rent']) {
                const deposit = answers['security-deposit'].value as number;
                const rent = answers['monthly-rent'].value as number;
                const ratio = deposit / rent;

                if (ratio > 3) {
                    warnings.push('Depozito tutarı yasal sınırları aşabilir. TBK m.301 kontrol edilmelidir.');
                    confidenceScore -= 10;
                }
            }
        }

        if (template.template_id.includes('is-sozlesmesi')) {
            // İş sözleşmesi özel kontrolleri
            if (answers['weekly-hours'] && typeof answers['weekly-hours'].value === 'number') {
                const hours = answers['weekly-hours'].value;
                if (hours > 45) {
                    warnings.push('Haftalık çalışma süresi yasal sınırı aşıyor. İş Kanunu m.63 kontrol edilmelidir.');
                    confidenceScore -= 15;
                }
            }

            if (answers['contract-type']?.value === 'definite' &&
                answers['contract-duration'] &&
                typeof answers['contract-duration'].value === 'number') {
                const duration = answers['contract-duration'].value;
                if (duration > 12) {
                    suggestions.push('1 yıldan uzun belirli süreli sözleşmeler için özel koşullar değerlendirilmelidir.');
                }
            }
        }

        return {
            isValid: warnings.length === 0,
            references,
            warnings,
            suggestions,
            confidence_score: Math.max(0, Math.min(100, confidenceScore))
        };
    }

    /**
     * Cache kontrolü
     */
    private isValidCache(key: string): boolean {
        const expiry = this.cacheExpiry.get(key);
        return expiry ? Date.now() < expiry : false;
    }

    /**
     * Fallback referansları döndürür
     */
    private getFallbackReferences(template: DynamicTemplate): LegalReference[] {
        if (template.metadata.legal_references) {
            return template.metadata.legal_references.map(ref => ({
                code: ref.split(' ')[0] || 'UNKNOWN',
                title: ref,
                description: 'Statik hukuki referans',
                source: 'law' as const,
                relevance_score: 70,
                last_updated: template.metadata.updated_date
            }));
        }

        return [];
    }

    /**
     * Yargi-MCP server ile sorgu (Emsal kararlar)
     */
    private async queryYargiMcp(keywords: string[]): Promise<{
        results: unknown[];
        total: number;
    }> {
        try {
            // Ana arama phrase'i oluştur
            const mainPhrase = keywords.join(' ');

            // Bedesten unified search - Yargıtay ve Danıştay kararları
            const bedestenResponse = await this.performMCPSearch('bedesten', {
                phrase: mainPhrase,
                court_types: ['YARGITAYKARARI', 'DANISTAYKARAR']
            });

            let allResults: unknown[] = [];
            let totalCount = 0;

            if (bedestenResponse?.results) {
                allResults = [...bedestenResponse.results];
                totalCount += bedestenResponse.total || bedestenResponse.results.length;
            }

            // Emsal kararlar - daha detaylı arama
            try {
                const emsalResponse = await this.performMCPSearch('emsal', {
                    keyword: mainPhrase,
                    page_number: 1
                });

                if (emsalResponse?.results) {
                    allResults = [...allResults, ...emsalResponse.results];
                    totalCount += emsalResponse.total || emsalResponse.results.length;
                }
            } catch (emsalError) {
                console.warn('Emsal search failed, continuing with other sources:', emsalError);
            }

            return {
                results: allResults.slice(0, 15), // Max 15 sonuç
                total: totalCount
            };

        } catch (error) {
            console.error('Yargi-MCP query failed:', error);
            return {
                results: [],
                total: 0
            };
        }
    }

    /**
     * Mevzuat-MCP server ile sorgu (Kanun metinleri)
     */
    private async queryMevzuatMcp(keywords: string[]): Promise<{
        results: unknown[];
        total: number;
    }> {
        try {
            // Ana arama phrase'i oluştur
            const mainPhrase = keywords.join(' ');

            // Mevzuat search strategies
            const [lawSearch, regulationSearch] = await Promise.all([
                this.performMCPSearch('law', {
                    query: mainPhrase,
                    search_type: 'kanun'
                }),
                this.performMCPSearch('regulation', {
                    query: mainPhrase,
                    search_type: 'yonetmelik'
                })
            ]);

            let allResults: unknown[] = [];
            let totalCount = 0;

            // Combine results from both searches
            if (lawSearch?.results) {
                allResults = [...allResults, ...lawSearch.results];
                totalCount += lawSearch.total || lawSearch.results.length;
            }

            if (regulationSearch?.results) {
                allResults = [...allResults, ...regulationSearch.results];
                totalCount += regulationSearch.total || regulationSearch.results.length;
            }

            return {
                results: allResults.slice(0, 10), // Max 10 mevzuat sonucu
                total: totalCount
            };

        } catch (error) {
            console.error('Mevzuat-MCP query failed:', error);
            return {
                results: [],
                total: 0
            };
        }
    }

    /**
     * Gerçek Supabase Function MCP endpoint'ini çağırır (MOCK DEĞİL!)
     */
    private async performMCPSearch(searchType: 'bedesten' | 'emsal' | 'law' | 'regulation', params: Record<string, unknown>): Promise<{
        results?: unknown[];
        total?: number;
    }> {
        try {
            // Supabase function endpoint'ini çağır
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseAnonKey) {
                throw new Error('Supabase environment variables not configured');
            }

            const functionUrl = `${supabaseUrl}/functions/v1/legal-reference-mcp`;

            console.log(`🔗 Calling real MCP function for ${searchType}:`, functionUrl);

            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAnonKey}`,
                    'apikey': supabaseAnonKey
                },
                body: JSON.stringify({
                    query: {
                        keywords: [searchType === 'bedesten' || searchType === 'emsal' ?
                            Object.values(params).join(' ') :
                            params.query || Object.values(params).join(' ')
                        ],
                        legal_domain: this.inferLegalDomain(params),
                        document_type: this.inferDocumentType(params),
                        max_results: 8
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`MCP Function call failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            if (data.success && data.references) {
                console.log(`✅ Real MCP function returned ${data.references.length} references`);
                return {
                    results: data.references,
                    total: data.total || data.references.length
                };
            }

            throw new Error(`Invalid response format from MCP function`);

        } catch (error) {
            console.error(`❌ Real MCP search failed for ${searchType}:`, error);

            // Fallback: Enhanced mock responses for different search types
            if (searchType === 'bedesten') {
                return {
                    results: [
                        {
                            title: 'Yargıtay 13. Hukuk Dairesi 2023/1234 Kira Sözleşmesi (Fallback)',
                            content: 'Kira sözleşmesinde depozito tutarının belirlenmesi. Gerçek MCP bağlantısı başarısız.',
                            date: '2023-05-15',
                            court: 'Yargıtay 13. HD'
                        }
                    ],
                    total: 1
                };
            }

            if (searchType === 'law') {
                return {
                    results: [
                        {
                            title: 'Türk Borçlar Kanunu Madde 299 (Fallback)',
                            law_name: 'Türk Borçlar Kanunu',
                            law_number: '6098',
                            article: '299',
                            content: 'Kira sözleşmesi tanımı. Gerçek MCP bağlantısı başarısız.',
                            url: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6098'
                        }
                    ],
                    total: 1
                };
            }

            if (searchType === 'regulation') {
                return {
                    results: [
                        {
                            title: 'Kira Sözleşmeleri Yönetmeliği (Fallback)',
                            name: 'Kira Sözleşmeleri Hakkında Yönetmelik',
                            content: 'Kira sözleşmelerinin düzenlenmesi. Gerçek MCP bağlantısı başarısız.',
                            url: 'https://www.mevzuat.gov.tr/yonetmelik'
                        }
                    ],
                    total: 1
                };
            }

            return { results: [], total: 0 };
        }
    }

    /**
     * Params'dan legal domain çıkarımı yapar
     */
    private inferLegalDomain(params: Record<string, unknown>): 'civil' | 'commercial' | 'labor' | 'criminal' | 'administrative' {
        const searchText = JSON.stringify(params).toLowerCase();

        if (searchText.includes('iş') || searchText.includes('çalışma') || searchText.includes('maaş')) {
            return 'labor';
        }
        if (searchText.includes('ticaret') || searchText.includes('şirket') || searchText.includes('sözleşme')) {
            return 'commercial';
        }
        if (searchText.includes('ceza') || searchText.includes('suç')) {
            return 'criminal';
        }
        if (searchText.includes('idari') || searchText.includes('kamu')) {
            return 'administrative';
        }

        return 'civil'; // Default
    }

    /**
     * Params'dan document type çıkarımı yapar
     */
    private inferDocumentType(params: Record<string, unknown>): 'contract' | 'petition' | 'agreement' | 'application' {
        const searchText = JSON.stringify(params).toLowerCase();

        if (searchText.includes('sözleşme') || searchText.includes('contract')) {
            return 'contract';
        }
        if (searchText.includes('dilekçe') || searchText.includes('petition')) {
            return 'petition';
        }
        if (searchText.includes('başvuru') || searchText.includes('application')) {
            return 'application';
        }

        return 'agreement'; // Default
    }

    /**
     * Enhanced utility methods
     */
    private extractCaseNumber(title: string): string {
        // "Yargıtay 13. HD 2023/1234" -> "2023/1234"
        const match = title.match(/(\d{4}\/\d+)/);
        return match ? match[1] : title.substring(0, 15);
    }

    private extractLawCode(item: {
        law_number?: string;
        article?: string;
        title?: string;
        name?: string;
    }): string {
        // Law code extraction priority: law_number + article > title
        if (item.law_number && item.article) {
            return `${item.law_number}/m.${item.article}`;
        }
        if (item.law_number) {
            return item.law_number;
        }
        if (item.article) {
            return `m.${item.article}`;
        }
        return this.extractCaseNumber(item.title || item.name || '');
    }

    private truncateDescription(text: string): string {
        const maxLength = 150;
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    private calculateRelevanceScore(title: string, keywords: string[]): number {
        let score = 70; // Base score

        for (const keyword of keywords) {
            if (title.toLowerCase().includes(keyword.toLowerCase())) {
                score += 10;
            }
        }

        return Math.min(100, score);
    }

    /**
     * Cache temizleme
     */
    public clearCache(): void {
        this.cache.clear();
        this.cacheExpiry.clear();
    }
}

// Export singleton instance
export const legalReferenceService = LegalReferenceService.getInstance();

// Utility functions
export const LegalReferenceUtils = {
    /**
     * Hukuki referansları formatlı string'e çevirir
     */
    formatLegalReferences(references: LegalReference[]): string {
        return references
            .sort((a, b) => b.relevance_score - a.relevance_score)
            .map(ref => `• ${ref.title}${ref.article ? ` (m.${ref.article})` : ''}`)
            .join('\n');
    },

    /**
     * Hukuki uyarıları kullanıcı dostu mesaja çevirir
     */
    formatLegalWarnings(warnings: string[]): string {
        if (warnings.length === 0) return '';

        return `⚠️ Hukuki Uyarılar:\n${warnings.map(w => `• ${w}`).join('\n')}`;
    },

    /**
     * Hukuki önerileri formatlı mesaja çevirir  
     */
    formatLegalSuggestions(suggestions: string[]): string {
        if (suggestions.length === 0) return '';

        return `💡 Hukuki Öneriler:\n${suggestions.map(s => `• ${s}`).join('\n')}`;
    }
};