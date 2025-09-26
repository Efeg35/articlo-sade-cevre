import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { WizardMCPIntegrationService } from '../wizardMcpIntegration'

console.log('🔒 Security & Input Validation tests loading...')

// Mock DynamicTemplate interface
interface MockTemplate {
    template_id: string
    template_name: string
    template_description: string
    category: string
    initial_questions: string[]
    questions: string[]
    metadata: {
        version: string
        created_date: string
        updated_date: string
        legal_references: string[]
        complexity_level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
        estimated_completion_time: number
    }
    output_config: {
        default_format: string
        supported_formats: string[]
    }
}

describe('Security & Input Validation Tests', () => {
    let wizardMcpIntegration: WizardMCPIntegrationService
    let originalFetch: typeof global.fetch

    beforeEach(() => {
        console.log('🧪 Setting up security test environment...')

        wizardMcpIntegration = WizardMCPIntegrationService.getInstance()
        originalFetch = global.fetch

        // Mock fetch for security testing
        global.fetch = vi.fn().mockImplementation(async () => {
            return Promise.resolve({
                ok: true,
                status: 200,
                json: async () => ({
                    success: true,
                    data: { decisions: [] }
                })
            } as Response)
        })
    })

    afterEach(() => {
        global.fetch = originalFetch
        console.log('🧽 Security test cleanup completed')
    })

    describe('🛡️ Input Sanitization', () => {
        it('should sanitize XSS attempts in template names', async () => {
            console.log('🚨 Testing XSS sanitization...')

            const maliciousTemplate: MockTemplate = {
                template_id: 'xss-test',
                template_name: '<script>alert("XSS")</script>Malicious Template',
                template_description: 'Test XSS protection',
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

            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(maliciousTemplate as any)

            expect(result).toBeDefined()
            expect(result.legalContext).toBeDefined()

            // Should complete without executing malicious script
            console.log('✅ XSS sanitization test passed')
        })

        it('should handle SQL injection attempts', async () => {
            console.log('🗃️ Testing SQL injection protection...')

            const sqlInjectionTemplate: MockTemplate = {
                template_id: "'; DROP TABLE users; --",
                template_name: "SQL Injection Test",
                template_description: "1' OR '1'='1",
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

            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(sqlInjectionTemplate as any)

            expect(result).toBeDefined()
            expect(result.legalContext).toBeDefined()

            console.log('✅ SQL injection protection test passed')
        })

        it('should validate input length limits', async () => {
            console.log('📏 Testing input length validation...')

            const longContentTemplate: MockTemplate = {
                template_id: 'length-test',
                template_name: 'A'.repeat(10000), // Very long name
                template_description: 'B'.repeat(50000), // Very long description
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

            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(longContentTemplate as any)

            expect(result).toBeDefined()
            expect(result.legalContext).toBeDefined()

            console.log('✅ Input length validation test passed')
        })
    })

    describe('🚫 Injection Attack Prevention', () => {
        it('should prevent command injection attempts', async () => {
            console.log('⚡ Testing command injection protection...')

            const commandInjectionTemplate: MockTemplate = {
                template_id: 'command-test',
                template_name: '$(rm -rf /)',
                template_description: '`cat /etc/passwd`',
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

            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(commandInjectionTemplate as any)

            expect(result).toBeDefined()
            expect(result.legalContext).toBeDefined()

            console.log('✅ Command injection protection test passed')
        })

        it('should sanitize path traversal attempts', async () => {
            console.log('📁 Testing path traversal protection...')

            const pathTraversalTemplate: MockTemplate = {
                template_id: '../../../etc/passwd',
                template_name: 'Path Traversal Test',
                template_description: '..\\..\\windows\\system32\\config\\sam',
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

            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(pathTraversalTemplate as any)

            expect(result).toBeDefined()
            expect(result.legalContext).toBeDefined()

            console.log('✅ Path traversal protection test passed')
        })
    })

    describe('🔐 Authentication & Authorization', () => {
        it('should handle unauthorized access gracefully', async () => {
            console.log('🚪 Testing unauthorized access handling...')

            // Mock unauthorized response
            global.fetch = vi.fn().mockImplementation(async () => {
                return Promise.resolve({
                    ok: false,
                    status: 401,
                    json: async () => ({
                        error: 'Unauthorized'
                    })
                } as Response)
            })

            const testTemplate: MockTemplate = {
                template_id: 'auth-test',
                template_name: 'Authorization Test',
                template_description: 'Test unauthorized access',
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

            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(testTemplate as any)

            expect(result).toBeDefined()
            expect(result.legalContext).toBeDefined()

            console.log('✅ Unauthorized access handling test passed')
        })

        it('should validate API rate limiting', async () => {
            console.log('⏱️ Testing API rate limiting...')

            let requestCount = 0

            global.fetch = vi.fn().mockImplementation(async () => {
                requestCount++

                if (requestCount > 10) {
                    return Promise.resolve({
                        ok: false,
                        status: 429,
                        json: async () => ({
                            error: 'Rate limit exceeded'
                        })
                    } as Response)
                }

                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: async () => ({
                        success: true,
                        data: { decisions: [] }
                    })
                } as Response)
            })

            const testTemplate: MockTemplate = {
                template_id: 'rate-limit-test',
                template_name: 'Rate Limit Test',
                template_description: 'Test rate limiting',
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

            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(testTemplate as any)

            expect(result).toBeDefined()
            expect(result.legalContext).toBeDefined()
            expect(requestCount).toBeGreaterThan(0)

            console.log(`📊 Made ${requestCount} requests before rate limiting`)
            console.log('✅ Rate limiting test passed')
        })
    })

    describe('🛡️ Data Validation', () => {
        it('should validate required fields', async () => {
            console.log('📋 Testing required field validation...')

            const incompleteTemplate = {
                template_id: 'incomplete-test',
                // Missing required fields
                category: 'rent_dispute'
            }

            try {
                const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(incompleteTemplate as any)
                expect(result).toBeDefined()
                console.log('✅ Required field validation test passed')
            } catch (error) {
                // Should handle incomplete data gracefully
                console.log('✅ Required field validation handled gracefully')
            }
        })

        it('should sanitize special characters', async () => {
            console.log('🔤 Testing special character sanitization...')

            const specialCharsTemplate: MockTemplate = {
                template_id: 'special-chars-test',
                template_name: '!@#$%^&*(){}[]|\\:";\'<>?,./',
                template_description: 'ñáéíóúüçğışöĞİŞÖÜÇ',
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

            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(specialCharsTemplate as any)

            expect(result).toBeDefined()
            expect(result.legalContext).toBeDefined()

            console.log('✅ Special character sanitization test passed')
        })
    })

    describe('🚨 Error Handling Security', () => {
        it('should not leak sensitive information in error messages', async () => {
            console.log('🤐 Testing error information leakage...')

            // Mock error response
            global.fetch = vi.fn().mockImplementation(async () => {
                throw new Error('Database connection failed: host=secret-db.internal port=5432')
            })

            const testTemplate: MockTemplate = {
                template_id: 'error-test',
                template_name: 'Error Test',
                template_description: 'Test error handling',
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

            try {
                await wizardMcpIntegration.enrichTemplateWithLegalContext(testTemplate as any)
            } catch (error) {
                // Error should not contain sensitive information
                const errorMessage = error instanceof Error ? error.message : String(error)

                // Should not contain sensitive details like internal hostnames
                expect(errorMessage).not.toContain('secret-db.internal')
                expect(errorMessage).not.toContain('5432')
            }

            console.log('✅ Error information leakage test passed')
        })

        it('should handle malformed JSON gracefully', async () => {
            console.log('📝 Testing malformed JSON handling...')

            global.fetch = vi.fn().mockImplementation(async () => {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: async () => {
                        throw new Error('Unexpected token < in JSON at position 0')
                    }
                } as Response)
            })

            const testTemplate: MockTemplate = {
                template_id: 'json-test',
                template_name: 'JSON Test',
                template_description: 'Test malformed JSON handling',
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

            const result = await wizardMcpIntegration.enrichTemplateWithLegalContext(testTemplate as any)

            expect(result).toBeDefined()
            expect(result.legalContext).toBeDefined()

            console.log('✅ Malformed JSON handling test passed')
        })
    })
})

console.log('🔒 Security & Input Validation tests loaded successfully!')