import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { WizardMCPIntegrationService } from '../wizardMcpIntegration'

console.log('⚡ Performance Benchmarks loading...')

interface TestTemplate {
    template_id: string
    template_name: string
    template_description: string
    category: string
    initial_questions: any[]
    questions: any[]
    metadata: {
        version: string
        created_date: string
        updated_date: string
        legal_references: any[]
        complexity_level: string
        estimated_completion_time: number
    }
    output_config: {
        default_format: string
        supported_formats: string[]
    }
}

describe('Performance Benchmarks', () => {
    let wizardMcpIntegration: WizardMCPIntegrationService
    let originalFetch: typeof global.fetch

    const testTemplate: TestTemplate = {
        template_id: 'perf-benchmark',
        template_name: 'Performance Benchmark',
        template_description: 'Template for performance benchmarking',
        category: 'rent_dispute',
        initial_questions: [],
        questions: [],
        metadata: {
            version: '1.0.0',
            created_date: '2025-01-01',
            updated_date: '2025-01-01',
            legal_references: [],
            complexity_level: 'BASIC',
            estimated_completion_time: 5
        },
        output_config: {
            default_format: 'PDF',
            supported_formats: ['PDF']
        }
    }

    beforeEach(() => {
        console.log('🧪 Setting up performance benchmark environment...')

        wizardMcpIntegration = WizardMCPIntegrationService.getInstance()
        originalFetch = global.fetch

        // Fast mock responses
        global.fetch = vi.fn().mockImplementation(async (url: string | Request) => {
            const urlString = typeof url === 'string' ? url : url.url

            if (urlString.includes('enhanced-mcp-proxy')) {
                // Fast response (10ms)
                await new Promise(resolve => setTimeout(resolve, 10))

                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: async () => ({
                        success: true,
                        data: { decisions: [] }
                    })
                } as Response)
            }

            return Promise.resolve({
                ok: true,
                status: 200,
                json: async () => ({ success: true, data: {} })
            } as Response)
        })
    })

    afterEach(() => {
        global.fetch = originalFetch
        console.log('🧽 Benchmark cleanup completed')
    })

    describe('⚡ Basic Performance Tests', () => {
        it('should complete template enrichment within reasonable time', async () => {
            console.log('⏱️ Testing basic performance...')

            const startTime = Date.now()
            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(testTemplate)
            const responseTime = Date.now() - startTime

            console.log(`📊 Template enrichment completed in ${responseTime}ms`)

            expect(result).toBeDefined()
            expect(result.legalContext).toBeDefined()
            expect(responseTime).toBeLessThan(5000) // Should complete within 5 seconds
        })

        it('should handle multiple sequential requests efficiently', async () => {
            console.log('🔄 Testing sequential request performance...')

            const iterations = 3
            const responseTimes: number[] = []

            for (let i = 0; i < iterations; i++) {
                const startTime = Date.now()

                const template = {
                    ...testTemplate,
                    template_id: `sequential-${i}`
                }

                const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(template)
                const responseTime = Date.now() - startTime

                responseTimes.push(responseTime)
                expect(result).toBeDefined()
            }

            const avgTime = responseTimes.reduce((a, b) => a + b) / responseTimes.length
            console.log(`📈 Average response time: ${avgTime.toFixed(2)}ms`)

            expect(avgTime).toBeLessThan(3000) // Average should be under 3 seconds
            responseTimes.forEach(time => {
                expect(time).toBeLessThan(8000) // Each request under 8 seconds
            })
        })

        it('should maintain performance under concurrent load', async () => {
            console.log('🚀 Testing concurrent performance...')

            const concurrency = 3
            const promises = Array.from({ length: concurrency }, (_, i) => {
                const template = {
                    ...testTemplate,
                    template_id: `concurrent-${i}`
                }
                return wizardMcpIntegration.enrichTemplateWithLegalContext(template)
            })

            const startTime = Date.now()
            const results = await Promise.all(promises)
            const totalTime = Date.now() - startTime

            console.log(`⚡ ${concurrency} concurrent requests completed in ${totalTime}ms`)

            expect(results.length).toBe(concurrency)
            results.forEach(result => {
                expect(result).toBeDefined()
                expect(result.legalContext).toBeDefined()
            })

            expect(totalTime).toBeLessThan(10000) // Should complete within 10 seconds
        })
    })

    describe('🧠 Memory Usage Tests', () => {
        it('should not leak memory during repeated operations', async () => {
            console.log('🔍 Testing memory usage...')

            const initialMemory = process.memoryUsage().heapUsed
            const iterations = 5

            for (let i = 0; i < iterations; i++) {
                await wizardMcpIntegration.enrichTemplateWithLegalContext({
                    ...testTemplate,
                    template_id: `memory-test-${i}`
                })

                // Force garbage collection if available
                if (global.gc) {
                    global.gc()
                }
            }

            const finalMemory = process.memoryUsage().heapUsed
            const memoryGrowth = Math.round((finalMemory - initialMemory) / 1024 / 1024)

            console.log(`🧠 Memory growth: ${memoryGrowth}MB`)

            expect(memoryGrowth).toBeLessThan(50) // Should not grow more than 50MB
        })
    })
})

console.log('⚡ Performance Benchmarks loaded successfully!')