/**
 * 🧪 MCP Connection Test Service
 * 
 * MCP Proxy function'ının çalışıp çalışmadığını test eder
 * Frontend <-> Supabase Function <-> Mock MCP data akışını doğrular
 */

import { wizardMcpIntegration, WizardMCPTestUtils } from './wizardMcpIntegration';

export interface MCPTestResult {
    test_name: string;
    success: boolean;
    data?: unknown;
    error?: string;
    duration_ms: number;
}

export interface MCPTestSuite {
    suite_name: string;
    total_tests: number;
    passed_tests: number;
    failed_tests: number;
    results: MCPTestResult[];
    total_duration_ms: number;
}

export class MCPConnectionTestService {
    private static instance: MCPConnectionTestService;

    private constructor() { }

    public static getInstance(): MCPConnectionTestService {
        if (!MCPConnectionTestService.instance) {
            MCPConnectionTestService.instance = new MCPConnectionTestService();
        }
        return MCPConnectionTestService.instance;
    }

    /**
     * Tam MCP test suite'ini çalıştırır
     */
    public async runFullTestSuite(): Promise<MCPTestSuite> {
        console.log('🧪 Starting MCP Connection Test Suite...');
        const startTime = Date.now();

        const results: MCPTestResult[] = [];

        // Test 1: Supabase Function Connectivity
        results.push(await this.testSupabaseFunctionConnectivity());

        // Test 2: Basic MCP Proxy Call
        results.push(await this.testBasicMCPProxyCall());

        // Test 3: Yargıtay Search
        results.push(await this.testYargitaySearch());

        // Test 4: KVKK Search  
        results.push(await this.testKVKKSearch());

        // Test 5: Template Enrichment
        results.push(await this.testTemplateEnrichment());

        // Test 6: Live Context Generation
        results.push(await this.testLiveContext());

        const totalDuration = Date.now() - startTime;
        const passedTests = results.filter(r => r.success).length;
        const failedTests = results.length - passedTests;

        const testSuite: MCPTestSuite = {
            suite_name: 'MCP Connection Test Suite',
            total_tests: results.length,
            passed_tests: passedTests,
            failed_tests: failedTests,
            results,
            total_duration_ms: totalDuration
        };

        console.log('📊 MCP Test Suite Results:', testSuite);
        return testSuite;
    }

    /**
     * Test 1: Supabase function connectivity
     */
    private async testSupabaseFunctionConnectivity(): Promise<MCPTestResult> {
        const startTime = Date.now();

        try {
            console.log('🔗 Testing Supabase Function connectivity...');

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseAnonKey) {
                throw new Error('Supabase environment variables missing');
            }

            const response = await fetch(`${supabaseUrl}/functions/v1/mcp-proxy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAnonKey}`,
                    'apikey': supabaseAnonKey
                },
                body: JSON.stringify({
                    server_name: 'yargi-mcp',
                    tool_name: 'search_bedesten_unified',
                    arguments: {
                        phrase: 'test connectivity'
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }

            const data = await response.json();

            return {
                test_name: 'Supabase Function Connectivity',
                success: true,
                data,
                duration_ms: Date.now() - startTime
            };

        } catch (error) {
            return {
                test_name: 'Supabase Function Connectivity',
                success: false,
                error: error.message,
                duration_ms: Date.now() - startTime
            };
        }
    }

    /**
     * Test 2: Basic MCP proxy call
     */
    private async testBasicMCPProxyCall(): Promise<MCPTestResult> {
        const startTime = Date.now();

        try {
            console.log('🔗 Testing basic MCP proxy call...');

            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext({
                template_id: 'test-template',
                template_name: 'Test Template',
                template_description: 'Test açıklaması',
                category: 'Konut Hukuku',
                initial_questions: ['test'],
                questions: [],
                metadata: {
                    version: '1.0.0',
                    complexity_level: 'BASIC',
                    estimated_completion_time: 5,
                    legal_references: ['TBK m.299'],
                    created_date: new Date().toISOString(),
                    updated_date: new Date().toISOString()
                },
                output_config: {
                    default_format: 'PDF',
                    supported_formats: ['PDF']
                }
            }, { test_input: 'kira sözleşmesi' });

            return {
                test_name: 'Basic MCP Proxy Call',
                success: !!result.legalContext,
                data: {
                    decisionsCount: result.legalContext?.relevantDecisions?.length || 0,
                    lawsCount: result.legalContext?.lawReferences?.length || 0,
                    riskFactorsCount: result.legalContext?.riskFactors?.length || 0
                },
                duration_ms: Date.now() - startTime
            };

        } catch (error) {
            return {
                test_name: 'Basic MCP Proxy Call',
                success: false,
                error: error.message,
                duration_ms: Date.now() - startTime
            };
        }
    }

    /**
     * Test 3: Yargıtay search
     */
    private async testYargitaySearch(): Promise<MCPTestResult> {
        const startTime = Date.now();

        try {
            console.log('🏛️ Testing Yargıtay search...');

            const liveContext = await wizardMcpIntegration.getLiveContextForStep(
                'kira-sozlesmesi',
                2,
                { monthly_rent: 3000, property_type: 'apartment' }
            );

            return {
                test_name: 'Yargıtay Search',
                success: liveContext.legalReferences.length > 0,
                data: {
                    referencesFound: liveContext.legalReferences.length,
                    suggestionsCount: liveContext.suggestions.length,
                    warningsCount: liveContext.warnings.length
                },
                duration_ms: Date.now() - startTime
            };

        } catch (error) {
            return {
                test_name: 'Yargıtay Search',
                success: false,
                error: error.message,
                duration_ms: Date.now() - startTime
            };
        }
    }

    /**
     * Test 4: KVKK search  
     */
    private async testKVKKSearch(): Promise<MCPTestResult> {
        const startTime = Date.now();

        try {
            console.log('🛡️ Testing KVKK search...');

            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext({
                template_id: 'veri-koruma',
                template_name: 'Veri Koruma Sözleşmesi',
                template_description: 'KVKK uyumlu sözleşme',
                category: 'Veri Koruma',
                initial_questions: ['veri türü'],
                questions: [],
                metadata: {
                    version: '1.0.0',
                    complexity_level: 'INTERMEDIATE',
                    estimated_completion_time: 8,
                    legal_references: ['KVKK m.6'],
                    created_date: new Date().toISOString(),
                    updated_date: new Date().toISOString()
                },
                output_config: {
                    default_format: 'PDF',
                    supported_formats: ['PDF']
                }
            }, { data_type: 'kişisel veri işleme' });

            const kvkkDecisions = result.legalContext?.relevantDecisions?.filter(
                d => d.source === 'kvkk'
            ) || [];

            return {
                test_name: 'KVKK Search',
                success: kvkkDecisions.length > 0,
                data: {
                    kvkkDecisionsFound: kvkkDecisions.length,
                    totalDecisions: result.legalContext?.relevantDecisions?.length || 0
                },
                duration_ms: Date.now() - startTime
            };

        } catch (error) {
            return {
                test_name: 'KVKK Search',
                success: false,
                error: error.message,
                duration_ms: Date.now() - startTime
            };
        }
    }

    /**
     * Test 5: Template enrichment
     */
    private async testTemplateEnrichment(): Promise<MCPTestResult> {
        const startTime = Date.now();

        try {
            console.log('✨ Testing template enrichment...');

            const enriched = await WizardMCPTestUtils.testEnrichment('test-rental-contract');

            return {
                test_name: 'Template Enrichment',
                success: !!(enriched.legalContext &&
                    enriched.legalContext.relevantDecisions.length > 0),
                data: {
                    templateName: enriched.template_name,
                    decisionsCount: enriched.legalContext?.relevantDecisions?.length || 0,
                    lawsCount: enriched.legalContext?.lawReferences?.length || 0,
                    riskFactorsCount: enriched.legalContext?.riskFactors?.length || 0,
                    suggestedClausesCount: enriched.legalContext?.suggestedClauses?.length || 0
                },
                duration_ms: Date.now() - startTime
            };

        } catch (error) {
            return {
                test_name: 'Template Enrichment',
                success: false,
                error: error.message,
                duration_ms: Date.now() - startTime
            };
        }
    }

    /**
     * Test 6: Live context generation
     */
    private async testLiveContext(): Promise<MCPTestResult> {
        const startTime = Date.now();

        try {
            console.log('🔍 Testing live context generation...');

            const liveContext = await WizardMCPTestUtils.testLiveContext('employment-contract', 4);

            return {
                test_name: 'Live Context Generation',
                success: !!(liveContext.suggestions.length > 0 ||
                    liveContext.legalReferences.length > 0),
                data: liveContext,
                duration_ms: Date.now() - startTime
            };

        } catch (error) {
            return {
                test_name: 'Live Context Generation',
                success: false,
                error: error.message,
                duration_ms: Date.now() - startTime
            };
        }
    }

    /**
     * Quick smoke test - sadece connectivity
     */
    public async quickSmokeTest(): Promise<boolean> {
        try {
            console.log('💨 Running MCP quick smoke test...');

            const result = await this.testSupabaseFunctionConnectivity();
            const success = result.success;

            console.log(success ? '✅ MCP Smoke test passed' : '❌ MCP Smoke test failed');
            return success;

        } catch (error) {
            console.error('❌ MCP Smoke test error:', error);
            return false;
        }
    }
}

// Export singleton
export const mcpConnectionTest = MCPConnectionTestService.getInstance();

// Console utilities for development
export const MCPTestConsoleUtils = {
    /**
     * Console'da hızlı test çalıştır
     */
    async runQuickTest() {
        console.log('🏃‍♂️ Running MCP quick test...');
        const result = await mcpConnectionTest.quickSmokeTest();
        return result;
    },

    /**
     * Console'da full test suite çalıştır
     */
    async runFullTest() {
        console.log('🏃‍♂️ Running MCP full test suite...');
        const results = await mcpConnectionTest.runFullTestSuite();

        console.table(results.results.map(r => ({
            'Test Name': r.test_name,
            'Status': r.success ? '✅ PASS' : '❌ FAIL',
            'Duration (ms)': r.duration_ms,
            'Error': r.error || '-'
        })));

        return results;
    }
};

// Global access for console testing
if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).MCPTest = MCPTestConsoleUtils;
    console.log('🧪 MCP Test utilities available at window.MCPTest');
    console.log('Usage: MCPTest.runQuickTest() or MCPTest.runFullTest()');
}