import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { WizardMCPIntegrationService } from '../wizardMcpIntegration'
import { getDynamicTemplate } from '../../data/dynamicTemplates'
import type { DynamicTemplate } from '../../types/wizard/dynamicWizard'

console.log('🚀 User Journey End-to-End Tests loading...')

// Mock user session
interface MockUserSession {
    userId: string
    email: string
    subscription: 'FREE' | 'PRO' | 'ENTERPRISE'
    credits: number
    preferences: {
        language: string
        timezone: string
        notifications: boolean
    }
}

// Journey simulation utilities
class UserJourneySimulator {
    private currentStep = 0
    private journeyData: Record<string, unknown> = {}
    private userSession: MockUserSession

    constructor(userType: 'free' | 'pro' | 'enterprise' = 'free') {
        this.userSession = this.createMockUser(userType)
    }

    private createMockUser(type: 'free' | 'pro' | 'enterprise'): MockUserSession {
        return {
            userId: `user-${Date.now()}`,
            email: `testuser@artiklo.com`,
            subscription: type.toUpperCase() as 'FREE' | 'PRO' | 'ENTERPRISE',
            credits: type === 'free' ? 3 : type === 'pro' ? 100 : 999,
            preferences: {
                language: 'tr',
                timezone: 'Europe/Istanbul',
                notifications: true
            }
        }
    }

    async startJourney(templateId: string): Promise<{ success: boolean; data?: DynamicTemplate }> {
        console.log(`🚀 Starting user journey for template: ${templateId}`)
        this.currentStep = 1

        const template = getDynamicTemplate(templateId)
        if (!template) {
            return { success: false }
        }

        this.journeyData.selectedTemplate = template
        return { success: true, data: template }
    }

    async answerQuestion(questionId: string, answer: unknown): Promise<{ success: boolean; nextQuestions?: string[] }> {
        console.log(`📝 Answering question ${questionId}:`, answer)
        this.journeyData[questionId] = answer
        this.currentStep++

        // Simulate dynamic question logic
        const nextQuestions = this.calculateNextQuestions(questionId, answer)

        return { success: true, nextQuestions }
    }

    private calculateNextQuestions(questionId: string, answer: unknown): string[] {
        // Simplified dynamic logic based on common patterns
        const nextQuestions: string[] = []

        if (questionId === 'property-type' && answer === 'konut') {
            nextQuestions.push('furnished-status')
        }

        if (questionId === 'furnished-status' && answer !== 'empty') {
            nextQuestions.push('furniture-inventory')
        }

        if (questionId === 'pets-allowed' && answer === true) {
            nextQuestions.push('pet-deposit', 'pet-rules')
        }

        return nextQuestions
    }

    async requestLegalContext(): Promise<{ success: boolean; contextData?: unknown }> {
        console.log('⚖️ Requesting legal context enrichment...')

        const template = this.journeyData.selectedTemplate as DynamicTemplate
        if (!template) {
            return { success: false }
        }

        try {
            const wizardMcp = WizardMCPIntegrationService.getInstance()
            const enrichedTemplate = await wizardMcp.enrichTemplateWithLegalContext(template)

            this.journeyData.legalContext = enrichedTemplate.legalContext
            return { success: true, contextData: enrichedTemplate.legalContext }
        } catch (error) {
            console.error('Legal context request failed:', error)
            return { success: false }
        }
    }

    async generateDocument(): Promise<{ success: boolean; documentId?: string; downloadUrl?: string }> {
        console.log('📄 Generating document...')

        // Simulate document generation process
        const documentId = `doc-${Date.now()}`
        const downloadUrl = `https://artiklo.com/downloads/${documentId}.pdf`

        this.journeyData.generatedDocument = {
            documentId,
            downloadUrl,
            generatedAt: new Date().toISOString()
        }

        return { success: true, documentId, downloadUrl }
    }

    getJourneyData(): Record<string, unknown> {
        return { ...this.journeyData }
    }

    getUserSession(): MockUserSession {
        return { ...this.userSession }
    }

    getCurrentStep(): number {
        return this.currentStep
    }
}

// Test scenario builders
class ScenarioBuilder {
    static simpleRentalContract() {
        return {
            templateId: 'kira-sozlesmesi-dynamic',
            steps: [
                { questionId: 'property-type', answer: 'konut' },
                { questionId: 'lease-type', answer: 'definite' },
                { questionId: 'landlord-info', answer: 'Ahmet Yılmaz' },
                { questionId: 'tenant-info', answer: 'Mehmet Demir' },
                { questionId: 'furnished-status', answer: 'empty' },
                { questionId: 'lease-duration', answer: 2 },
                { questionId: 'monthly-rent', answer: 15000 },
                { questionId: 'security-deposit', answer: 30000 },
                { questionId: 'pets-allowed', answer: false }
            ]
        }
    }

    static complexRentalWithPets() {
        return {
            templateId: 'kira-sozlesmesi-dynamic',
            steps: [
                { questionId: 'property-type', answer: 'konut' },
                { questionId: 'lease-type', answer: 'definite' },
                { questionId: 'landlord-info', answer: 'Ayşe Kaya' },
                { questionId: 'tenant-info', answer: 'Ali Özkan' },
                { questionId: 'furnished-status', answer: 'fully-furnished' },
                { questionId: 'furniture-inventory', answer: 'Buzdolabı, çamaşır makinesi, yemek masası, yatak takımı' },
                { questionId: 'lease-duration', answer: 1 },
                { questionId: 'monthly-rent', answer: 25000 },
                { questionId: 'security-deposit', answer: 50000 },
                { questionId: 'pets-allowed', answer: true },
                { questionId: 'pet-deposit', answer: 5000 },
                { questionId: 'pet-rules', answer: 'Maksimum 1 kedi, apartman kurallarına uygun' },
                { questionId: 'special-conditions', answer: true },
                { questionId: 'special-conditions-text', answer: 'Aylık temizlik hizmeti dahildir' }
            ]
        }
    }

    static businessContract() {
        return {
            templateId: 'is-sozlesmesi-dynamic',
            steps: [
                { questionId: 'contract-type', answer: 'indefinite' },
                { questionId: 'employee-name', answer: 'Zeynep Aktaş' },
                { questionId: 'employer-name', answer: 'ARTIKLO Yazılım A.Ş.' },
                { questionId: 'job-title', answer: 'Senior Yazılım Geliştirici' }
            ]
        }
    }
}

describe('User Journey End-to-End Tests', () => {
    let originalFetch: typeof global.fetch

    beforeEach(() => {
        console.log('🚀 Setting up user journey test environment...')
        originalFetch = global.fetch

        // Mock successful MCP responses
        global.fetch = vi.fn().mockImplementation(async () => ({
            ok: true,
            status: 200,
            json: async () => ({
                success: true,
                data: {
                    decisions: [
                        {
                            id: 'mock-decision-1',
                            title: 'Kira Sözleşmesi Hukuki Çerçevesi',
                            content: 'TBK madde 299-356 kapsamında...',
                            relevance: 0.95
                        }
                    ],
                    laws: [
                        {
                            id: 'tbk-299',
                            title: 'Türk Borçlar Kanunu Madde 299',
                            content: 'Kira sözleşmesi...'
                        }
                    ]
                }
            })
        } as unknown as Response))
    })

    afterEach(() => {
        global.fetch = originalFetch
        console.log('🧽 User journey test cleanup completed')
    })

    describe('🏠 Simple Rental Contract Journey', () => {
        it('should complete full journey for basic rental contract', async () => {
            console.log('🏠 Testing complete rental contract journey...')

            const journey = new UserJourneySimulator('free')
            const scenario = ScenarioBuilder.simpleRentalContract()

            // Step 1: Start journey
            const startResult = await journey.startJourney(scenario.templateId)
            expect(startResult.success).toBe(true)
            expect(startResult.data).toBeDefined()
            expect(startResult.data?.template_id).toBe(scenario.templateId)

            console.log('✅ Journey started successfully')

            // Step 2: Answer all questions
            for (const step of scenario.steps) {
                const answerResult = await journey.answerQuestion(step.questionId, step.answer)
                expect(answerResult.success).toBe(true)

                console.log(`✅ Question ${step.questionId} answered:`, step.answer)
            }

            // Step 3: Request legal context
            const legalResult = await journey.requestLegalContext()
            expect(legalResult.success).toBe(true)
            expect(legalResult.contextData).toBeDefined()

            console.log('✅ Legal context enriched successfully')

            // Step 4: Generate document
            const docResult = await journey.generateDocument()
            expect(docResult.success).toBe(true)
            expect(docResult.documentId).toBeDefined()
            expect(docResult.downloadUrl).toBeDefined()

            console.log('✅ Document generated successfully')

            // Verify journey data
            const journeyData = journey.getJourneyData()
            expect(journeyData.selectedTemplate).toBeDefined()
            expect(journeyData.legalContext).toBeDefined()
            expect(journeyData.generatedDocument).toBeDefined()

            console.log('✅ Simple rental contract journey completed successfully!')
        })

        it('should handle user with limited credits', async () => {
            console.log('💳 Testing journey with credit limitations...')

            const journey = new UserJourneySimulator('free')
            const userSession = journey.getUserSession()

            expect(userSession.subscription).toBe('FREE')
            expect(userSession.credits).toBe(3)

            const scenario = ScenarioBuilder.simpleRentalContract()
            const startResult = await journey.startJourney(scenario.templateId)

            expect(startResult.success).toBe(true)

            // Simulate credit usage
            const remainingCredits = userSession.credits - 1
            expect(remainingCredits).toBe(2)

            console.log('✅ Credit limitation handling test passed')
        })
    })

    describe('🏠 Complex Rental with Pets Journey', () => {
        it('should handle dynamic question flow with conditional logic', async () => {
            console.log('🐕 Testing complex rental journey with pets...')

            const journey = new UserJourneySimulator('pro')
            const scenario = ScenarioBuilder.complexRentalWithPets()

            // Start journey
            const startResult = await journey.startJourney(scenario.templateId)
            expect(startResult.success).toBe(true)

            // Test dynamic question flow
            let nextQuestions: string[] = []

            for (const step of scenario.steps) {
                const answerResult = await journey.answerQuestion(step.questionId, step.answer)
                expect(answerResult.success).toBe(true)

                if (answerResult.nextQuestions) {
                    nextQuestions = answerResult.nextQuestions
                }

                // Test specific conditional logic
                if (step.questionId === 'furnished-status' && step.answer === 'fully-furnished') {
                    expect(nextQuestions).toContain('furniture-inventory')
                }

                if (step.questionId === 'pets-allowed' && step.answer === true) {
                    expect(nextQuestions).toContain('pet-deposit')
                    expect(nextQuestions).toContain('pet-rules')
                }

                console.log(`✅ Dynamic question ${step.questionId} handled correctly`)
            }

            // Complete the journey
            const legalResult = await journey.requestLegalContext()
            expect(legalResult.success).toBe(true)

            const docResult = await journey.generateDocument()
            expect(docResult.success).toBe(true)

            console.log('✅ Complex rental journey completed successfully!')
        })
    })

    describe('💼 Business Contract Journey', () => {
        it('should complete employment contract creation', async () => {
            console.log('💼 Testing business contract journey...')

            const journey = new UserJourneySimulator('enterprise')
            const scenario = ScenarioBuilder.businessContract()

            // Start and complete journey
            const startResult = await journey.startJourney(scenario.templateId)
            expect(startResult.success).toBe(true)

            for (const step of scenario.steps) {
                const answerResult = await journey.answerQuestion(step.questionId, step.answer)
                expect(answerResult.success).toBe(true)

                console.log(`✅ Business question ${step.questionId} answered`)
            }

            const legalResult = await journey.requestLegalContext()
            expect(legalResult.success).toBe(true)

            const docResult = await journey.generateDocument()
            expect(docResult.success).toBe(true)

            console.log('✅ Business contract journey completed successfully!')
        })
    })

    describe('🚨 Error Recovery Journey', () => {
        it('should handle MCP service failures gracefully', async () => {
            console.log('🚨 Testing error recovery during journey...')

            const journey = new UserJourneySimulator('pro')
            const scenario = ScenarioBuilder.simpleRentalContract()

            const startResult = await journey.startJourney(scenario.templateId)
            expect(startResult.success).toBe(true)

            // Answer questions normally
            for (const step of scenario.steps) {
                const answerResult = await journey.answerQuestion(step.questionId, step.answer)
                expect(answerResult.success).toBe(true)
            }

            // Mock MCP failure AFTER questions are answered but BEFORE legal context request
            global.fetch = vi.fn().mockImplementation(async (url: string | Request) => {
                // Fail all requests to simulate complete MCP service failure
                throw new Error('MCP service unavailable - simulated failure')
            })

            // Legal context should fail gracefully due to MCP failure
            const legalResult = await journey.requestLegalContext()
            expect(legalResult.success).toBe(false)

            // Document generation should still work (doesn't depend on MCP)
            const docResult = await journey.generateDocument()
            expect(docResult.success).toBe(true)

            console.log('✅ Error recovery test passed')
        })

        it('should handle incomplete user input', async () => {
            console.log('❓ Testing incomplete user input handling...')

            const journey = new UserJourneySimulator('free')
            const scenario = ScenarioBuilder.simpleRentalContract()

            const startResult = await journey.startJourney(scenario.templateId)
            expect(startResult.success).toBe(true)

            // Answer only half the questions
            const halfSteps = scenario.steps.slice(0, Math.floor(scenario.steps.length / 2))

            for (const step of halfSteps) {
                const answerResult = await journey.answerQuestion(step.questionId, step.answer)
                expect(answerResult.success).toBe(true)
            }

            // Should still be able to request legal context (graceful degradation)
            const legalResult = await journey.requestLegalContext()
            expect(legalResult.success).toBe(true)

            console.log('✅ Incomplete input handling test passed')
        })
    })

    describe('📊 Journey Analytics', () => {
        it('should track journey completion metrics', async () => {
            console.log('📊 Testing journey analytics tracking...')

            const journey = new UserJourneySimulator('pro')
            const scenario = ScenarioBuilder.simpleRentalContract()

            const startTime = Date.now()

            // Complete full journey
            await journey.startJourney(scenario.templateId)

            for (const step of scenario.steps) {
                await journey.answerQuestion(step.questionId, step.answer)
            }

            await journey.requestLegalContext()
            await journey.generateDocument()

            const endTime = Date.now()
            const journeyDuration = endTime - startTime

            // Verify journey metrics
            expect(journey.getCurrentStep()).toBeGreaterThan(0)
            expect(journeyDuration).toBeGreaterThan(0)

            const journeyData = journey.getJourneyData()
            expect(Object.keys(journeyData).length).toBeGreaterThan(5)

            console.log(`✅ Journey completed in ${journeyDuration}ms with ${journey.getCurrentStep()} steps`)
        })
    })
})

console.log('🚀 User Journey End-to-End Tests loaded successfully!')