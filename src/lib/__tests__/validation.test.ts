import { describe, it, expect } from 'vitest'
import {
    emailSchema,
    passwordSchema,
    nameSchema,
    textInputSchema,
    sanitizeHtml,
    validateAndSanitizeInput,
    validateFileSecurity,
    RateLimiter
} from '../validation'

describe('Validation Schemas', () => {
    describe('emailSchema', () => {
        it('should validate correct email', () => {
            const result = emailSchema.safeParse('test@example.com')
            expect(result.success).toBe(true)
        })

        it('should reject invalid email', () => {
            const result = emailSchema.safeParse('invalid-email')
            expect(result.success).toBe(false)
        })

        it('should reject empty email', () => {
            const result = emailSchema.safeParse('')
            expect(result.success).toBe(false)
        })
    })

    describe('passwordSchema', () => {
        it('should validate correct password', () => {
            const result = passwordSchema.safeParse('Password123')
            expect(result.success).toBe(true)
        })

        it('should reject weak password', () => {
            const result = passwordSchema.safeParse('weak')
            expect(result.success).toBe(false)
        })

        it('should reject password without uppercase', () => {
            const result = passwordSchema.safeParse('password123')
            expect(result.success).toBe(false)
        })

        it('should reject password without lowercase', () => {
            const result = passwordSchema.safeParse('PASSWORD123')
            expect(result.success).toBe(false)
        })

        it('should reject password without number', () => {
            const result = passwordSchema.safeParse('Password')
            expect(result.success).toBe(false)
        })
    })

    describe('nameSchema', () => {
        it('should validate correct name', () => {
            const result = nameSchema.safeParse('Ahmet Yılmaz')
            expect(result.success).toBe(true)
        })

        it('should validate name with Turkish characters', () => {
            const result = nameSchema.safeParse('Şükrü Özçelik')
            expect(result.success).toBe(true)
        })

        it('should reject name with numbers', () => {
            const result = nameSchema.safeParse('Ahmet123')
            expect(result.success).toBe(false)
        })

        it('should reject name with special characters', () => {
            const result = nameSchema.safeParse('Ahmet@Yılmaz')
            expect(result.success).toBe(false)
        })
    })

    describe('textInputSchema', () => {
        it('should validate correct text', () => {
            const result = textInputSchema.safeParse('Bu bir test metnidir.')
            expect(result.success).toBe(true)
        })

        it('should reject empty text', () => {
            const result = textInputSchema.safeParse('')
            expect(result.success).toBe(false)
        })

        it('should reject very long text', () => {
            const longText = 'a'.repeat(10001)
            const result = textInputSchema.safeParse(longText)
            expect(result.success).toBe(false)
        })
    })
})

describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
        const input = '<p>Hello</p><script>alert("xss")</script>'
        const result = sanitizeHtml(input)
        expect(result).toBe('<p>Hello</p>')
    })

    it('should remove iframe tags', () => {
        const input = '<p>Hello</p><iframe src="malicious.com"></iframe>'
        const result = sanitizeHtml(input)
        expect(result).toBe('<p>Hello</p>')
    })

    it('should remove javascript: protocol', () => {
        const input = '<a href="javascript:alert(1)">Click me</a>'
        const result = sanitizeHtml(input)
        expect(result).toBe('<a href="alert(1)">Click me</a>')
    })

    it('should remove event handlers', () => {
        const input = '<button onclick="alert(1)">Click</button>'
        const result = sanitizeHtml(input)
        expect(result).toBe('<button "alert(1)">Click</button>')
    })
})

describe('validateAndSanitizeInput', () => {
    it('should sanitize and trim input', () => {
        const input = '  <script>alert("xss")</script>Hello World  '
        const result = validateAndSanitizeInput(input)
        expect(result).toBe('Hello World')
    })
})

describe('validateFileSecurity', () => {
    it('should accept valid file', () => {
        const file = new File(['content'], 'document.pdf', { type: 'application/pdf' })
        const result = validateFileSecurity(file)
        expect(result.isValid).toBe(true)
    })

    it('should reject executable file', () => {
        const file = new File(['content'], 'malicious.exe', { type: 'application/x-executable' })
        const result = validateFileSecurity(file)
        expect(result.isValid).toBe(false)
        expect(result.error).toBe('Desteklenmeyen dosya uzantısı')
    })

    it('should reject large file', () => {
        const file = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' })
        const result = validateFileSecurity(file)
        expect(result.isValid).toBe(false)
        expect(result.error).toBe('Dosya boyutu 10MB\'dan büyük olamaz')
    })

    it('should reject suspicious file extension', () => {
        const file = new File(['content'], 'malicious.bat', { type: 'text/plain' })
        const result = validateFileSecurity(file)
        expect(result.isValid).toBe(false)
        expect(result.error).toBe('Desteklenmeyen dosya uzantısı')
    })
})

describe('RateLimiter', () => {
    it('should allow requests within limit', () => {
        const limiter = new RateLimiter()
        const identifier = 'test@example.com'

        expect(limiter.isAllowed(identifier)).toBe(true)
        expect(limiter.isAllowed(identifier)).toBe(true)
        expect(limiter.isAllowed(identifier)).toBe(true)
        expect(limiter.isAllowed(identifier)).toBe(true)
        expect(limiter.isAllowed(identifier)).toBe(true)
    })

    it('should block requests over limit', () => {
        const limiter = new RateLimiter()
        const identifier = 'test@example.com'

        // Make 5 allowed requests
        for (let i = 0; i < 5; i++) {
            expect(limiter.isAllowed(identifier)).toBe(true)
        }

        // 6th request should be blocked
        expect(limiter.isAllowed(identifier)).toBe(false)
    })

    it('should reset after timeout', () => {
        const limiter = new RateLimiter()
        const identifier = 'test@example.com'

        // Make 5 requests
        for (let i = 0; i < 5; i++) {
            limiter.isAllowed(identifier)
        }

        // Mock time to be after timeout
        const originalDate = Date.now
        Date.now = () => originalDate() + 16 * 60 * 1000 // 16 minutes later

        expect(limiter.isAllowed(identifier)).toBe(true)

        // Restore original Date.now
        Date.now = originalDate
    })

    it('should reset specific identifier', () => {
        const limiter = new RateLimiter()
        const identifier = 'test@example.com'

        // Make 5 requests
        for (let i = 0; i < 5; i++) {
            limiter.isAllowed(identifier)
        }

        // Reset the identifier
        limiter.reset(identifier)

        // Should be allowed again
        expect(limiter.isAllowed(identifier)).toBe(true)
    })
})
