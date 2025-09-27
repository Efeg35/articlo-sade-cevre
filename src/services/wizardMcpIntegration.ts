/**
 * 🧙‍♂️ Wizard MCP Integration Service
 * 
 * Belge Sihirbazı için MCP serverlarından gerçek hukuki veri çeker
 * Mock data yerine gerçek Yargıtay kararları, kanun metinleri vs. kullanır
 */

import type { DynamicTemplate, DynamicQuestion } from '../types/wizard/WizardTypes';

// MCP import'ları
interface MCPSearchResult {
    results: Record<string, unknown>[];
    total: number;
}

interface MCPDocumentResult {
    content: string;
    metadata: Record<string, unknown>;
}

declare global {
    interface Window {
        mcpService?: {
            search: (query: string) => Promise<MCPSearchResult>;
            fetch: (id: string) => Promise<MCPDocumentResult>;
        };
    }
}

export interface WizardLegalReference {
    id: string;
    title: string;
    content: string;
    source: 'yargitay' | 'danistay' | 'kvkk' | 'rekabet' | 'law';
    relevance: number;
    legalReference?: string; // Kanun maddesi referansı
    date?: string;
    court?: string;
    caseNumber?: string;
}

export interface EnrichedWizardTemplate extends DynamicTemplate {
    legalContext?: {
        relevantDecisions: WizardLegalReference[];
        lawReferences: WizardLegalReference[];
        riskFactors: string[];
        suggestedClauses: string[];
    };
}

export class WizardMCPIntegrationService {
    private static instance: WizardMCPIntegrationService;

    private constructor() { }

    public static getInstance(): WizardMCPIntegrationService {
        if (!WizardMCPIntegrationService.instance) {
            WizardMCPIntegrationService.instance = new WizardMCPIntegrationService();
        }
        return WizardMCPIntegrationService.instance;
    }

    /**
     * Wizard template'i için hukuki kontekst toplar
     */
    public async enrichTemplateWithLegalContext(
        template: DynamicTemplate,
        userAnswers: Record<string, unknown> = {}
    ): Promise<EnrichedWizardTemplate> {
        try {
            console.log('🧙‍♂️ Enriching wizard template with MCP data:', template.template_name);

            // Template kategorisine göre arama terimleri belirle
            const searchTerms = this.generateSearchTerms(template, userAnswers);

            // Paralel olarak farklı kaynaklardan veri topla
            const [decisions, laws, riskFactors] = await Promise.all([
                this.fetchRelevantDecisions(searchTerms),
                this.fetchRelevantLaws(searchTerms),
                this.assessRiskFactors(template, userAnswers)
            ]);

            const enrichedTemplate: EnrichedWizardTemplate = {
                ...template,
                legalContext: {
                    relevantDecisions: decisions,
                    lawReferences: laws,
                    riskFactors,
                    suggestedClauses: this.generateSuggestedClauses(template, decisions, laws)
                }
            };

            console.log('✅ Template enriched with legal context:', {
                decisions: decisions.length,
                laws: laws.length,
                riskFactors: riskFactors.length
            });

            return enrichedTemplate;

        } catch (error) {
            console.error('❌ Failed to enrich template with legal context:', error);

            // Fallback: template'i olduğu gibi döndür
            return {
                ...template,
                legalContext: {
                    relevantDecisions: [],
                    lawReferences: [],
                    riskFactors: [],
                    suggestedClauses: []
                }
            };
        }
    }

    /**
     * Template kategorisine göre arama terimlerini oluşturur
     */
    private generateSearchTerms(template: DynamicTemplate, userAnswers: Record<string, unknown>): string[] {
        const baseTerms: string[] = [];

        // Template kategorisine göre temel terimler
        switch (template.category) {
            case 'Konut Hukuku':
                baseTerms.push('kira sözleşmesi', 'kiracı hakları', 'kira artırımı', 'tahliye');
                break;
            case 'İş Hukuku':
                baseTerms.push('iş sözleşmesi', 'çalışan hakları', 'fesih', 'kıdem tazminatı');
                break;
            case 'Tüketici Hukuku':
                baseTerms.push('tüketici hakları', 'cayma hakkı', 'ayıplı mal', 'garanti');
                break;
            case 'Aile Hukuku':
                baseTerms.push('velayet', 'nafaka', 'boşanma', 'mal rejimi');
                break;
            default:
                baseTerms.push(template.template_name.toLowerCase());
        }

        // User answers'tan specific terimler çıkar
        Object.values(userAnswers).forEach(answer => {
            if (typeof answer === 'string' && answer.length > 5) {
                // Potansiyel hukuki terim olabilir
                baseTerms.push(answer.toLowerCase());
            }
        });

        return [...new Set(baseTerms)]; // Duplicate'ları kaldır
    }

    /**
     * İlgili mahkeme kararlarını çeker (MCP üzerinden)
     */
    private async fetchRelevantDecisions(searchTerms: string[]): Promise<WizardLegalReference[]> {
        const decisions: WizardLegalReference[] = [];

        try {
            // Her arama terimi için Yargıtay kararları
            for (const term of searchTerms.slice(0, 3)) { // İlk 3 terim ile sınırla
                try {
                    // Gerçek MCP çağrısı burada olacak
                    // Şimdilik example data ile gösterelim
                    const yargitayResults = await this.searchYargitayDecisions(term);
                    decisions.push(...yargitayResults);
                } catch (error) {
                    console.warn(`⚠️ Failed to fetch Yargıtay decisions for term: ${term}`);
                }
            }

            // KVKK kararları da ekle (veri koruma içeren template'ler için)
            if (searchTerms.some(term => term.includes('veri') || term.includes('kişisel'))) {
                try {
                    const kvkkResults = await this.searchKVKKDecisions(searchTerms[0]);
                    decisions.push(...kvkkResults);
                } catch (error) {
                    console.warn('⚠️ Failed to fetch KVKK decisions');
                }
            }

        } catch (error) {
            console.error('❌ Error fetching relevant decisions:', error);
        }

        // Relevance'a göre sırala ve en iyi 10'unu al
        return decisions
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 10);
    }

    /**
     * Yargıtay kararları arar - Gerçek MCP çağrısı
     */
    private async searchYargitayDecisions(searchTerm: string): Promise<WizardLegalReference[]> {
        try {
            console.log('🏛️ Searching Yargıtay decisions via MCP for:', searchTerm);

            // Gerçek MCP çağrısı - Bedesten unified search kullanıyoruz
            const bedestenResponse = await this.callMCPDirectly('yargi-mcp', 'search_bedesten_unified', {
                phrase: searchTerm,
                court_types: ['YARGITAYKARARI'],
                pageNumber: 1
            });

            const references: WizardLegalReference[] = [];

            if (bedestenResponse?.decisions && Array.isArray(bedestenResponse.decisions)) {
                for (const decision of bedestenResponse.decisions.slice(0, 5)) {
                    const decisionData = decision as {
                        documentId?: string;
                        birimAdi?: string;
                        kararTarihiStr?: string;
                        kararNo?: string;
                        esasNo?: string;
                        itemType?: { description?: string };
                    };

                    references.push({
                        id: decisionData.documentId || `yargitay-${Date.now()}`,
                        title: `${decisionData.birimAdi} - ${decisionData.kararNo} - ${searchTerm}`,
                        content: `${searchTerm} konusunda ${decisionData.birimAdi} kararı. E.${decisionData.esasNo} K.${decisionData.kararNo}`,
                        source: 'yargitay',
                        relevance: 0.9,
                        legalReference: 'Yargıtay İçtihadı',
                        date: decisionData.kararTarihiStr || new Date().toISOString(),
                        court: decisionData.birimAdi || 'Yargıtay',
                        caseNumber: `E.${decisionData.esasNo} K.${decisionData.kararNo}`
                    });
                }
            }

            console.log(`✅ Found ${references.length} Yargıtay decisions via MCP`);
            return references;

        } catch (error) {
            console.error('❌ MCP Yargıtay search failed:', error);

            // Fallback response
            return [{
                id: 'yargitay-fallback',
                title: `Yargıtay Kararı - ${searchTerm} (MCP Fallback)`,
                content: `${searchTerm} konusunda Yargıtay kararı. Gerçek MCP bağlantısı başarısız, fallback data kullanılıyor.`,
                source: 'yargitay',
                relevance: 0.7,
                legalReference: 'TBK ilgili hükümler',
                date: new Date().toISOString(),
                court: 'Yargıtay (Fallback)',
                caseNumber: 'MCP-FALLBACK'
            }];
        }
    }

    /**
     * KVKK kararları arar - Gerçek MCP çağrısı
     */
    private async searchKVKKDecisions(searchTerm: string): Promise<WizardLegalReference[]> {
        try {
            console.log('🛡️ Searching KVKK decisions via MCP for:', searchTerm);

            // Gerçek MCP çağrısı - KVKK decisions search
            const kvkkResponse = await this.callMCPDirectly('yargi-mcp', 'search_kvkk_decisions', {
                keywords: searchTerm,
                page: 1
            });

            const references: WizardLegalReference[] = [];

            if (kvkkResponse?.decisions && Array.isArray(kvkkResponse.decisions)) {
                for (const decision of kvkkResponse.decisions.slice(0, 3)) {
                    const decisionData = decision as {
                        decision_id?: string;
                        title?: string;
                        description?: string;
                        publication_date?: string;
                        decision_number?: string;
                        url?: string;
                    };

                    references.push({
                        id: decisionData.decision_id || `kvkk-${Date.now()}`,
                        title: decisionData.title || `KVKK Kararı - ${searchTerm}`,
                        content: decisionData.description || `${searchTerm} konusunda KVKK kararı`,
                        source: 'kvkk',
                        relevance: 0.8,
                        legalReference: 'KVKK İlgili Hükümler',
                        date: decisionData.publication_date || new Date().toISOString(),
                        court: 'Kişisel Verileri Koruma Kurulu'
                    });
                }
            }

            console.log(`✅ Found ${references.length} KVKK decisions via MCP`);
            return references;

        } catch (error) {
            console.error('❌ MCP KVKK search failed:', error);

            // Fallback response
            return [{
                id: 'kvkk-fallback',
                title: `KVKK Kararı - ${searchTerm} (MCP Fallback)`,
                content: `${searchTerm} konusunda KVKK kararı. Gerçek MCP bağlantısı başarısız.`,
                source: 'kvkk',
                relevance: 0.7,
                legalReference: 'KVKK m.6',
                date: new Date().toISOString(),
                court: 'KVKK (Fallback)'
            }];
        }
    }

    /**
     * İlgili kanun metinlerini çeker - GERÇEK MEVZUAT-MCP İLE GÜÇLENDİRİLMİŞ
     */
    private async fetchRelevantLaws(searchTerms: string[]): Promise<WizardLegalReference[]> {
        const laws: WizardLegalReference[] = [];

        try {
            console.log('📚 Fetching laws from Mevzuat-MCP for terms:', searchTerms);

            // Her search term için mevzuat-mcp'den gerçek kanun metinleri çek
            for (const term of searchTerms.slice(0, 2)) { // İlk 2 terim ile sınırla
                try {
                    const mevzuatResults = await this.searchMevzuatLaws(term);
                    laws.push(...mevzuatResults);
                } catch (error) {
                    console.warn(`⚠️ Failed to fetch laws for term: ${term}`);
                }
            }

            // Fallback: Template kategorisine göre ilgili kanunları da ekle
            const fallbackLaws = this.getRelevantLawsByTerms(searchTerms);
            for (const law of fallbackLaws) {
                laws.push({
                    id: law.code,
                    title: law.name,
                    content: law.content,
                    source: 'law',
                    relevance: law.relevance,
                    legalReference: law.reference
                });
            }

        } catch (error) {
            console.error('❌ Error fetching relevant laws:', error);
        }

        // Relevance'a göre sırala ve en iyi 8'ini al
        return laws
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 8);
    }

    /**
     * 📚 GERÇEK MEVZUAT-MCP ILE KANUN ARAMA
     */
    private async searchMevzuatLaws(searchTerm: string): Promise<WizardLegalReference[]> {
        try {
            console.log('📚 Searching Turkish laws via Mevzuat-MCP for:', searchTerm);

            // Gerçek MCP çağrısı - Mevzuat search
            const mevzuatResponse = await this.callMCPDirectly('mevzuat-mcp', 'search_mevzuat', {
                phrase: searchTerm,
                page_number: 1,
                page_size: 5
            });

            const references: WizardLegalReference[] = [];

            if (mevzuatResponse?.documents && Array.isArray(mevzuatResponse.documents)) {
                for (const document of mevzuatResponse.documents) {
                    const docData = document as {
                        mevzuatId?: string;
                        mevzuatAdi?: string;
                        mevzuatNo?: string;
                        resmiGazeteTarihi?: string;
                        resmiGazeteSayi?: string;
                        mevzuatTur?: string;
                        yururlukteMi?: boolean;
                    };

                    // Detaylı içerik almak için article content çağrısı
                    let detailedContent = `${searchTerm} konusunda ${docData.mevzuatTur} hükümleri`;
                    try {
                        if (docData.mevzuatId) {
                            const contentResponse = await this.callMCPDirectly('mevzuat-mcp', 'get_mevzuat_article_content', {
                                mevzuat_id: docData.mevzuatId,
                                madde_id: docData.mevzuatId // Full document için aynı ID
                            });

                            if (contentResponse?.markdown_content) {
                                detailedContent = (contentResponse.markdown_content as string).substring(0, 500) + '...';
                            }
                        }
                    } catch (contentError) {
                        console.warn('⚠️ Could not fetch detailed content for law');
                    }

                    references.push({
                        id: docData.mevzuatId || `law-${Date.now()}`,
                        title: docData.mevzuatAdi || `Kanun - ${searchTerm}`,
                        content: detailedContent,
                        source: 'law',
                        relevance: docData.yururlukteMi ? 0.95 : 0.85, // Yürürlükteki kanunlar daha yüksek relevance
                        legalReference: `${docData.mevzuatTur} ${docData.mevzuatNo}`,
                        date: docData.resmiGazeteTarihi || new Date().toISOString(),
                        court: `Resmi Gazete ${docData.resmiGazeteSayi || ''}`
                    });
                }
            }

            console.log(`✅ Found ${references.length} laws via Mevzuat-MCP`);
            return references;

        } catch (error) {
            console.error('❌ Mevzuat-MCP search failed:', error);

            // Fallback response
            return [{
                id: 'law-fallback',
                title: `Kanun Metni - ${searchTerm} (MCP Fallback)`,
                content: `${searchTerm} konusunda kanun hükümleri. Gerçek MCP bağlantısı başarısız.`,
                source: 'law',
                relevance: 0.7,
                legalReference: 'İlgili Mevzuat',
                date: new Date().toISOString(),
                court: 'Mevzuat (Fallback)'
            }];
        }
    }

    /**
     * Arama terimlerine göre ilgili kanunları belirler
     */
    private getRelevantLawsByTerms(searchTerms: string[]) {
        const lawMapping = [
            {
                keywords: ['kira', 'kiracı', 'ev sahibi', 'tahliye'],
                code: 'TBK-299',
                name: 'Türk Borçlar Kanunu Madde 299 - Kira Sözleşmesi',
                content: 'Kira sözleşmesi, kiraya verenin bir şeyin kullanılmasını kiracıya bırakmayı...',
                reference: 'TBK m.299',
                relevance: 0.95
            },
            {
                keywords: ['iş', 'çalışan', 'işçi', 'işveren'],
                code: 'İŞK-17',
                name: 'İş Kanunu Madde 17 - İş Sözleşmesi',
                content: 'İş sözleşmesi işçi ile işveren arasında kurulan sözleşmedir...',
                reference: 'İŞK m.17',
                relevance: 0.90
            },
            {
                keywords: ['tüketici', 'satış', 'alım', 'garanti'],
                code: 'TKHK-4',
                name: 'Tüketicinin Korunması Hakkında Kanun',
                content: 'Tüketicinin korunmasına ilişkin temel hükümler...',
                reference: 'TKHK m.4',
                relevance: 0.85
            }
        ];

        return lawMapping.filter(law =>
            law.keywords.some(keyword =>
                searchTerms.some(term => term.includes(keyword))
            )
        );
    }

    /**
     * Risk faktörlerini değerlendirir
     */
    private async assessRiskFactors(
        template: DynamicTemplate,
        userAnswers: Record<string, unknown>
    ): Promise<string[]> {
        const riskFactors: string[] = [];

        // Template tipine göre ortak risk faktörleri
        switch (template.category) {
            case 'Konut Hukuku':
                riskFactors.push(
                    'Kira artırım oranları yasal sınırları aşmamalı',
                    'Depozito tutarı 3 aylık kiradan fazla olamaz',
                    'Tahliye için yasal prosedürler takip edilmeli'
                );
                break;

            case 'İş Hukuku':
                riskFactors.push(
                    'Fesih bildirimleri yazılı olmalı',
                    'Kıdem tazminatı hesaplaması doğru yapılmalı',
                    'İş sözleşmesi maddeleri İş Kanunu ile uyumlu olmalı'
                );
                break;

            case 'Tüketici Hukuku':
                riskFactors.push(
                    'Cayma hakkı sürelerine dikkat edilmeli',
                    'Garanti şartları açık belirtilmeli',
                    'Tüketici hakları tam olarak korunmalı'
                );
                break;
        }

        // User answers'a göre specific riskler
        Object.entries(userAnswers).forEach(([key, value]) => {
            if (key.includes('amount') && typeof value === 'number' && value > 50000) {
                riskFactors.push('Yüksek tutarlar için ek güvence önlemleri düşünülmelidir');
            }
            if (key.includes('date') && value) {
                riskFactors.push('Tarih bazlı yükümlülükler için takvim hatırlatıcısı kurulmalıdır');
            }
        });

        return [...new Set(riskFactors)];
    }

    /**
     * Önerilen madde metinleri oluşturur
     */
    private generateSuggestedClauses(
        template: DynamicTemplate,
        decisions: WizardLegalReference[],
        laws: WizardLegalReference[]
    ): string[] {
        const clauses: string[] = [];

        // Template tipine göre standart maddeler
        if (template.category === 'Konut Hukuku') {
            clauses.push(
                'Bu sözleşme TBK m.299 ve ilgili mevzuat hükümlerine tabidir.',
                'Kira bedeli her yıl TÜFE oranında artırılabilir.',
                'Taraflar arasında çıkabilecek anlaşmazlıklar önce dostane yollarla çözülmeye çalışılacaktır.'
            );
        }

        // Decisions'tan çıkarılan pratik maddeler
        decisions.forEach(decision => {
            if (decision.source === 'yargitay' && decision.relevance > 0.8) {
                clauses.push(
                    `${decision.court} emsal kararı uyarınca ilgili hükümler uygulanacaktır.`
                );
            }
        });

        // Laws'tan çıkarılan referans maddeler
        laws.forEach(law => {
            if (law.legalReference) {
                clauses.push(
                    `${law.legalReference} hükümlerine uygun olarak işlem yapılacaktır.`
                );
            }
        });

        return [...new Set(clauses)].slice(0, 5); // En fazla 5 madde
    }

    /**
     * Wizard adımı için gerçek zamanlı hukuki öneriler getirir
     */
    public async getLiveContextForStep(
        templateId: string,
        currentStep: number,
        currentAnswers: Record<string, unknown>
    ): Promise<{
        suggestions: string[];
        warnings: string[];
        legalReferences: WizardLegalReference[];
    }> {
        try {
            console.log('🔍 Getting live context for wizard step:', { templateId, currentStep });

            const suggestions: string[] = [];
            const warnings: string[] = [];
            const legalReferences: WizardLegalReference[] = [];

            // Current step'e göre contextual öneriler
            if (Object.keys(currentAnswers).length > 0) {
                const lastAnswerKey = Object.keys(currentAnswers).pop()!;
                const lastAnswer = currentAnswers[lastAnswerKey];

                // Tutar bazlı uyarılar
                if (typeof lastAnswer === 'number' && lastAnswer > 100000) {
                    warnings.push('Yüksek tutarlar için ek güvence önlemleri değerlendirilebilir.');
                }

                // İlgili hukuki referansları çek
                const searchTerm = `${templateId} ${lastAnswerKey}`;
                const relatedDecisions = await this.searchYargitayDecisions(searchTerm);
                legalReferences.push(...relatedDecisions.slice(0, 3));
            }

            return { suggestions, warnings, legalReferences };

        } catch (error) {
            console.error('❌ Error getting live context for step:', error);
            return { suggestions: [], warnings: [], legalReferences: [] };
        }
    }

    /**
     * Gerçek MCP call'larını yapar - Claude MCP integration üzerinden
     */
    private async callMCPDirectly(
        serverName: string,
        toolName: string,
        arguments_: Record<string, unknown>
    ): Promise<Record<string, unknown> | null> {
        try {
            console.log(`🔗 Calling MCP directly: ${serverName}.${toolName}`, arguments_);

            // Frontend'den doğrudan MCP çağrısı yapamayız,
            // bunun yerine Supabase function üzerinden yapacağız
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseAnonKey) {
                throw new Error('Supabase environment variables not found');
            }

            const response = await fetch(`${supabaseUrl}/functions/v1/mcp-proxy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAnonKey}`,
                    'apikey': supabaseAnonKey
                },
                body: JSON.stringify({
                    server_name: serverName,
                    tool_name: toolName,
                    arguments: arguments_
                })
            });

            if (!response.ok) {
                throw new Error(`MCP proxy call failed: ${response.status}`);
            }

            const data = await response.json();
            console.log(`✅ MCP response for ${serverName}.${toolName}:`, data);

            return data;

        } catch (error) {
            console.error(`❌ MCP call failed for ${serverName}.${toolName}:`, error);
            return null;
        }
    }
}

// Export singleton
export const wizardMcpIntegration = WizardMCPIntegrationService.getInstance();

// Console test utilities
export const WizardMCPTestUtils = {
    /**
     * Template enrichment test
     */
    async testEnrichment(templateId: string) {
        console.log('🧙‍♂️ Testing wizard MCP enrichment...');

        // Example template for testing
        const mockTemplate: DynamicTemplate = {
            template_id: templateId,
            template_name: 'Test Kira Sözleşmesi',
            template_description: 'Test template',
            category: 'Konut Hukuku',
            initial_questions: ['test'],
            questions: [],
            metadata: {
                version: '1.0.0',
                complexity_level: 'BASIC',
                estimated_completion_time: 10,
                legal_references: ['TBK m.299'],
                created_date: new Date().toISOString(),
                updated_date: new Date().toISOString()
            },
            output_config: {
                default_format: 'PDF',
                supported_formats: ['PDF', 'DOCX']
            }
        };

        const mockAnswers = {
            monthly_rent: 5000,
            property_type: 'apartment',
            tenant_name: 'Test Kiracı'
        };

        const enrichedTemplate = await wizardMcpIntegration.enrichTemplateWithLegalContext(
            mockTemplate,
            mockAnswers
        );

        console.log('📊 Enrichment Result:', {
            templateName: enrichedTemplate.template_name,
            decisionsCount: enrichedTemplate.legalContext?.relevantDecisions.length,
            lawsCount: enrichedTemplate.legalContext?.lawReferences.length,
            riskFactorsCount: enrichedTemplate.legalContext?.riskFactors.length,
            suggestedClausesCount: enrichedTemplate.legalContext?.suggestedClauses.length
        });

        return enrichedTemplate;
    },

    /**
     * Live context test
     */
    async testLiveContext(templateId: string = 'kira-sozlesmesi', step: number = 3) {
        console.log('🔍 Testing live context for wizard step...');

        const mockAnswers = {
            property_type: 'apartment',
            monthly_rent: 7500,
            tenant_count: 2
        };

        const liveContext = await wizardMcpIntegration.getLiveContextForStep(
            templateId,
            step,
            mockAnswers
        );

        console.log('📋 Live Context Result:', liveContext);
        return liveContext;
    }
};