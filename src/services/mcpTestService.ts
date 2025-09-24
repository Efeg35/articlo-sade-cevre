/**
 * 🧪 MCP Integration Test Service
 * 
 * Gerçek MCP entegrasyonunu test etmek için özel service
 */

import { legalReferenceService, type LegalReference } from './legalReferenceService';
import type { DynamicTemplate } from '../types/wizard/dynamicWizard';

interface MCPTestResult {
    success: boolean;
    message: string;
    references?: LegalReference[];
    error?: string;
    responseTime?: number;
    source: 'real-mcp' | 'fallback';
}

interface MCPServerTestResult {
    success: boolean;
    count?: number;
    message: string;
}

interface DualMCPTestResult {
    yargi_mcp: MCPServerTestResult | null;
    mevzuat_mcp: MCPServerTestResult | null;
    overall_success: boolean;
}

interface IntegrationTestResult {
    step1_law_search: MCPServerTestResult | null;
    step2_precedent_search: MCPServerTestResult | null;
    integration_success: boolean;
}

export class MCPTestService {
    private static instance: MCPTestService;

    private constructor() {
        // Singleton pattern
    }

    public static getInstance(): MCPTestService {
        if (!MCPTestService.instance) {
            MCPTestService.instance = new MCPTestService();
        }
        return MCPTestService.instance;
    }

    /**
     * MCP entegrasyonunu test eder
     */
    public async testMCPConnection(): Promise<MCPTestResult> {
        const startTime = Date.now();

        try {
            console.log('🧪 Testing MCP Integration...');

            // Test template oluştur
            const testTemplate: DynamicTemplate = {
                template_id: 'test-kira-sozlesmesi',
                template_name: 'Kira Sözleşmesi Test',
                template_description: 'MCP test için örnek template',
                category: 'Konut Hukuku',
                initial_questions: ['test-monthly-rent'],
                questions: [
                    {
                        question_id: 'test-monthly-rent',
                        template_id: 'test-kira-sozlesmesi',
                        question_text: 'Aylık kira bedeli nedir?',
                        question_type: 'number',
                        display_order: 1,
                        is_required: true,
                        default_visible: true,
                        conditional_rules: []
                    }
                ],
                metadata: {
                    version: '1.0.0',
                    complexity_level: 'BASIC' as const,
                    estimated_completion_time: 5,
                    legal_references: ['TBK m.299'],
                    created_date: new Date().toISOString(),
                    updated_date: new Date().toISOString()
                },
                output_config: {
                    default_format: 'PDF',
                    supported_formats: ['PDF', 'DOCX', 'HTML']
                }
            };

            // Legal references'ı çek
            const references = await legalReferenceService.getLegalReferencesForTemplate(testTemplate);
            const responseTime = Date.now() - startTime;

            // Sonucu analiz et
            if (references.length === 0) {
                return {
                    success: false,
                    message: 'MCP server bağlantısı kurulamadı, hiç referans bulunamadı.',
                    responseTime,
                    source: 'fallback'
                };
            }

            // Gerçek MCP'den mi fallback'ten mi geldi?
            const isRealMCP = references.some(ref =>
                !ref.title.includes('Fallback') &&
                !ref.description.includes('Gerçek MCP bağlantısı başarısız')
            );

            if (isRealMCP) {
                return {
                    success: true,
                    message: `✅ MCP entegrasyonu çalışıyor! ${references.length} referans bulundu.`,
                    references,
                    responseTime,
                    source: 'real-mcp'
                };
            } else {
                return {
                    success: false,
                    message: `⚠️ MCP server erişilemiyor, fallback data kullanıldı. ${references.length} fallback referans.`,
                    references,
                    responseTime,
                    source: 'fallback'
                };
            }

        } catch (error) {
            const responseTime = Date.now() - startTime;
            return {
                success: false,
                message: '❌ MCP test başarısız oldu.',
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime,
                source: 'fallback'
            };
        }
    }

    /**
     * Specific keyword ile MCP test yapar
     */
    public async testMCPWithKeywords(keywords: string[]): Promise<MCPTestResult> {
        const startTime = Date.now();

        try {
            console.log('🔍 Testing MCP with keywords:', keywords);

            // Test template oluştur
            const testTemplate: DynamicTemplate = {
                template_id: 'test-custom',
                template_name: keywords.join(' ') + ' Test',
                template_description: 'Custom keyword test',
                category: 'Test',
                initial_questions: ['test-custom'],
                questions: [
                    {
                        question_id: 'test-custom',
                        template_id: 'test-custom',
                        question_text: keywords.join(' ') + ' ile ilgili test',
                        question_type: 'text',
                        display_order: 1,
                        is_required: true,
                        default_visible: true,
                        conditional_rules: []
                    }
                ],
                metadata: {
                    version: '1.0.0',
                    complexity_level: 'BASIC' as const,
                    estimated_completion_time: 1,
                    legal_references: [],
                    created_date: new Date().toISOString(),
                    updated_date: new Date().toISOString()
                },
                output_config: {
                    default_format: 'PDF',
                    supported_formats: ['PDF', 'DOCX', 'HTML']
                }
            };

            const references = await legalReferenceService.getLegalReferencesForTemplate(testTemplate);
            const responseTime = Date.now() - startTime;

            const isRealMCP = references.some(ref =>
                !ref.title.includes('Fallback') &&
                !ref.description.includes('Gerçek MCP bağlantısı başarısız')
            );

            return {
                success: isRealMCP,
                message: isRealMCP ?
                    `✅ Keyword araması başarılı! ${references.length} sonuç.` :
                    `⚠️ Keyword araması fallback kullandı. ${references.length} sonuç.`,
                references,
                responseTime,
                source: isRealMCP ? 'real-mcp' : 'fallback'
            };

        } catch (error) {
            const responseTime = Date.now() - startTime;
            return {
                success: false,
                message: '❌ Keyword test başarısız.',
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime,
                source: 'fallback'
            };
        }
    }

    /**
     * MCP server health check
     */
    public async healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'down';
        message: string;
        responseTime: number;
    }> {
        const startTime = Date.now();

        try {
            // Basit bir test yap
            const result = await this.testMCPConnection();
            const responseTime = Date.now() - startTime;

            if (result.success && result.source === 'real-mcp') {
                return {
                    status: 'healthy',
                    message: '✅ MCP server tam performans ile çalışıyor',
                    responseTime
                };
            } else if (result.source === 'fallback') {
                return {
                    status: 'degraded',
                    message: '⚠️ MCP server erişilemiyor, fallback aktif',
                    responseTime
                };
            } else {
                return {
                    status: 'down',
                    message: '❌ MCP server ve fallback sistem çalışmıyor',
                    responseTime
                };
            }

        } catch (error) {
            const responseTime = Date.now() - startTime;
            return {
                status: 'down',
                message: '❌ Health check başarısız: ' + (error instanceof Error ? error.message : 'Unknown error'),
                responseTime
            };
        }
    }
}

// Export singleton instance
export const mcpTestService = MCPTestService.getInstance();

// Utility functions for console testing
export const MCPTestUtils = {
    /**
     * Console'dan hızlıca test etmek için
     */
    async quickTest() {
        console.log('🧪 MCP Quick Test Starting...');
        const result = await mcpTestService.testMCPConnection();
        console.log('📊 Test Result:', result);
        return result;
    },

    /**
     * Health check console utility
     */
    async checkHealth() {
        console.log('🏥 MCP Health Check Starting...');
        const health = await mcpTestService.healthCheck();
        console.log('💓 Health Status:', health);
        return health;
    },

    /**
     * Custom keyword test
     */
    async testKeywords(keywords: string[]) {
        console.log('🔍 MCP Keyword Test Starting for:', keywords);
        const result = await mcpTestService.testMCPWithKeywords(keywords);
        console.log('📋 Keyword Test Result:', result);
        return result;
    },

    /**
     * 🎯 DUAL MCP TEST - Hem Yargi-MCP hem Mevzuat-MCP
     */
    async testDualMCP() {
        console.log('🎯 === DUAL MCP COMPREHENSIVE TEST ===');

        const results: DualMCPTestResult = {
            yargi_mcp: null,
            mevzuat_mcp: null,
            overall_success: false
        };

        // Test 1: Yargıtay Kararları (Yargi-MCP)
        console.log('⚖️ Testing Yargi-MCP (Yargıtay Decisions)...');
        try {
            const yargiResult = await fetch('/api/mcp-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    server: 'yargi-mcp',
                    tool: 'search_bedesten_unified',
                    args: {
                        phrase: 'kira sözleşmesi',
                        court_types: ['YARGITAYKARARI'],
                        pageNumber: 1
                    }
                })
            });

            if (yargiResult.ok) {
                const data = await yargiResult.json();
                results.yargi_mcp = {
                    success: true,
                    count: data.results?.length || 0,
                    message: `✅ Yargi-MCP çalışıyor! ${data.results?.length || 0} karar bulundu`
                };
                console.log('✅ Yargi-MCP Success:', results.yargi_mcp);
            } else {
                results.yargi_mcp = {
                    success: false,
                    message: `❌ Yargi-MCP Failed: ${yargiResult.status}`
                };
            }
        } catch (error) {
            results.yargi_mcp = {
                success: false,
                message: `❌ Yargi-MCP Error: ${error.message}`
            };
        }

        // Test 2: Mevzuat Arama (Mevzuat-MCP)
        console.log('📚 Testing Mevzuat-MCP (Turkish Laws)...');
        try {
            const mevzuatResult = await fetch('/api/mcp-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    server: 'mevzuat-mcp',
                    tool: 'search_mevzuat',
                    args: {
                        phrase: 'borçlar kanunu',
                        page_number: 1,
                        page_size: 3
                    }
                })
            });

            if (mevzuatResult.ok) {
                const data = await mevzuatResult.json();
                results.mevzuat_mcp = {
                    success: true,
                    count: data.documents?.length || 0,
                    message: `✅ Mevzuat-MCP çalışıyor! ${data.documents?.length || 0} kanun bulundu`
                };
                console.log('✅ Mevzuat-MCP Success:', results.mevzuat_mcp);
            } else {
                results.mevzuat_mcp = {
                    success: false,
                    message: `❌ Mevzuat-MCP Failed: ${mevzuatResult.status}`
                };
            }
        } catch (error) {
            results.mevzuat_mcp = {
                success: false,
                message: `❌ Mevzuat-MCP Error: ${error.message}`
            };
        }

        // Overall Assessment
        results.overall_success = results.yargi_mcp?.success && results.mevzuat_mcp?.success;

        console.log('🎯 === DUAL MCP TEST COMPLETE ===');
        console.log('📊 Final Results:', results);

        if (results.overall_success) {
            console.log('🎉 SUCCESS! Hem Yargi-MCP hem Mevzuat-MCP çalışıyor!');
        } else {
            console.log('⚠️ PARTIAL/FAILED: En az bir MCP server problemi var');
        }

        return results;
    },

    /**
     * 📋 INTEGRATION SCENARIO TEST
     * Real-world scenario: Kira sözleşmesi hazırlarken hem mahkeme kararları hem kanun metinleri
     */
    async testIntegrationScenario() {
        console.log('📋 === INTEGRATION SCENARIO TEST ===');
        console.log('🏠 Senaryo: Kira Sözleşmesi Hazırlama');

        const scenario: IntegrationTestResult = {
            step1_law_search: null,
            step2_precedent_search: null,
            integration_success: false
        };

        // Step 1: İlgili kanunları bul
        console.log('📚 Step 1: Türk Borçlar Kanunu arama...');
        try {
            const lawResult = await fetch('/api/mcp-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    server: 'mevzuat-mcp',
                    tool: 'search_mevzuat',
                    args: {
                        phrase: 'kira TBK',
                        page_number: 1,
                        page_size: 2
                    }
                })
            });

            if (lawResult.ok) {
                const data = await lawResult.json();
                scenario.step1_law_search = {
                    success: true,
                    count: data.documents?.length || 0,
                    message: `📚 ${data.documents?.length || 0} kanun metni bulundu`
                };
            } else {
                scenario.step1_law_search = { success: false, message: 'Kanun arama başarısız' };
            }
        } catch (error) {
            scenario.step1_law_search = { success: false, message: error.message };
        }

        // Step 2: İlgili içtihatları bul
        console.log('⚖️ Step 2: Kira uyuşmazlıkları içtihat arama...');
        try {
            const precedentResult = await fetch('/api/mcp-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    server: 'yargi-mcp',
                    tool: 'search_bedesten_unified',
                    args: {
                        phrase: 'kira uyuşmazlığı',
                        court_types: ['YARGITAYKARARI'],
                        pageNumber: 1
                    }
                })
            });

            if (precedentResult.ok) {
                const data = await precedentResult.json();
                scenario.step2_precedent_search = {
                    success: true,
                    count: data.results?.length || 0,
                    message: `⚖️ ${data.results?.length || 0} mahkeme kararı bulundu`
                };
            } else {
                scenario.step2_precedent_search = { success: false, message: 'İçtihat arama başarısız' };
            }
        } catch (error) {
            scenario.step2_precedent_search = { success: false, message: error.message };
        }

        scenario.integration_success = scenario.step1_law_search?.success && scenario.step2_precedent_search?.success;

        console.log('📋 === INTEGRATION TEST COMPLETE ===');
        console.log('🎯 Scenario Results:', scenario);

        if (scenario.integration_success) {
            console.log('🎉 INTEGRATION SUCCESS! Kira sözleşmesi için hem kanun hem içtihat verisi hazır!');
        } else {
            console.log('⚠️ INTEGRATION PARTIAL/FAILED: Tam veri seti hazırlanamadı');
        }

        return scenario;
    },

    /**
     * 🚀 FULL SYSTEM TEST - Tüm testleri çalıştır
     */
    async runAllTests() {
        console.log('🚀 === FULL MCP SYSTEM TEST ===');

        const fullResults = {
            health_check: await this.checkHealth(),
            quick_test: await this.quickTest(),
            dual_mcp_test: await this.testDualMCP(),
            integration_test: await this.testIntegrationScenario(),
            timestamp: new Date().toISOString()
        };

        console.log('🚀 === ALL TESTS COMPLETE ===');
        console.log('📊 Complete Results:', fullResults);

        // Summary
        const allSuccess = fullResults.health_check.status === 'healthy' &&
            fullResults.dual_mcp_test.overall_success &&
            fullResults.integration_test.integration_success;

        if (allSuccess) {
            console.log('🎉 FULL SYSTEM SUCCESS! ARTIKLO MCP entegrasyonu hazır!');
        } else {
            console.log('⚠️ SYSTEM ISSUES DETECTED - Review individual test results');
        }

        return fullResults;
    }
};

/**
 * 🌐 BROWSER TEST INTERFACE
 * Global window object'e test utilities ekle
 */
declare global {
    interface Window {
        MCPTest: typeof MCPTestUtils;
        runMCPTests: () => Promise<unknown>;
        testDualMCP: () => Promise<DualMCPTestResult>;
        testIntegration: () => Promise<IntegrationTestResult>;
    }
}

// Browser console'dan erişilebilir test utilities
if (typeof window !== 'undefined') {
    window.MCPTest = MCPTestUtils;

    // Shortcut functions
    window.runMCPTests = async () => {
        console.log('🚀 Starting comprehensive MCP tests...');
        return await MCPTestUtils.runAllTests();
    };

    window.testDualMCP = async () => {
        console.log('🎯 Testing both Yargi-MCP and Mevzuat-MCP...');
        return await MCPTestUtils.testDualMCP();
    };

    window.testIntegration = async () => {
        console.log('📋 Testing real-world integration scenario...');
        return await MCPTestUtils.testIntegrationScenario();
    };

    // Helpful console message
    console.log(`
    🧪 === MCP TEST UTILITIES LOADED ===
    
    Available console commands:
    • runMCPTests()      - Full system test
    • testDualMCP()      - Test both MCP servers
    • testIntegration()  - Integration scenario test
    • MCPTest.quickTest()     - Quick health check
    • MCPTest.checkHealth()   - Detailed health check
    
    Example usage:
    > runMCPTests()
    > testDualMCP()
    > MCPTest.testKeywords(['kira', 'sözleşme'])
    `);
}