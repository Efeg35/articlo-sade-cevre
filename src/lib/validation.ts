import { z } from 'zod';
import DOMPurify from 'dompurify';

// Email validation schema
export const emailSchema = z
    .string()
    .email('Geçerli bir e-posta adresi giriniz')
    .min(1, 'E-posta adresi gereklidir')
    .max(255, 'E-posta adresi çok uzun');

// Password validation schema
export const passwordSchema = z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .max(128, 'Şifre çok uzun')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir');

// Name validation schema
export const nameSchema = z
    .string()
    .min(2, 'İsim en az 2 karakter olmalıdır')
    .max(100, 'İsim çok uzun')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s0-9]+$/, 'İsim sadece harf, sayı ve boşluk içerebilir');

// Phone number validation schema (Turkish format)
export const phoneSchema = z
    .string()
    .min(10, 'Telefon numarası en az 10 haneli olmalıdır')
    .max(15, 'Telefon numarası çok uzun')
    .regex(/^(\+90|0)?[5][0-9]{2}[0-9]{3}[0-9]{2}[0-9]{2}$/, 'Geçerli bir Türkiye telefon numarası giriniz (örn: 5xx xxx xx xx)');

// Birth date validation schema
export const birthDateSchema = z
    .string()
    .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age >= 18;
        }
        return age >= 18;
    }, 'En az 18 yaşında olmalısınız')
    .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        return birthDate <= today;
    }, 'Doğum tarihi bugünden ileri olamaz');

// Reference code validation schema
export const referenceCodeSchema = z
    .string()
    .min(3, 'Referans kodu en az 3 karakter olmalıdır')
    .max(20, 'Referans kodu çok uzun')
    .regex(/^[a-zA-Z0-9]+$/, 'Referans kodu sadece harf ve rakam içerebilir')
    .optional();

// Text input validation schema
export const textInputSchema = z
    .string()
    .min(1, 'Metin gereklidir')
    .max(10000, 'Metin çok uzun (maksimum 10,000 karakter)');

// File validation schema
export const fileSchema = z.object({
    name: z.string().min(1),
    size: z.number().max(10 * 1024 * 1024, 'Dosya boyutu 10MB\'dan büyük olamaz'), // 10MB limit
    type: z.string().refine((type) => {
        const allowedTypes = [
            'text/plain',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/gif'
        ];
        return allowedTypes.includes(type);
    }, 'Desteklenmeyen dosya türü')
});

// File magic number signatures for validation
const FILE_SIGNATURES = {
    pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
    jpg: [0xFF, 0xD8, 0xFF],       // JPEG
    png: [0x89, 0x50, 0x4E, 0x47], // PNG
    gif: [0x47, 0x49, 0x46, 0x38], // GIF8
    docx: [0x50, 0x4B, 0x03, 0x04], // DOCX (ZIP signature)
    doc: [0xD0, 0xCF, 0x11, 0xE0]  // DOC (OLE signature)
};

// Check file magic number
const checkFileMagicNumber = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const buffer = e.target?.result as ArrayBuffer;
            if (!buffer) {
                resolve(false);
                return;
            }

            const bytes = new Uint8Array(buffer.slice(0, 8));
            const fileType = file.type.toLowerCase();

            // Check against known signatures
            if (fileType.includes('pdf')) {
                resolve(bytes.slice(0, 4).every((byte, i) => byte === FILE_SIGNATURES.pdf[i]));
            } else if (fileType.includes('jpeg') || fileType.includes('jpg')) {
                resolve(bytes.slice(0, 3).every((byte, i) => byte === FILE_SIGNATURES.jpg[i]));
            } else if (fileType.includes('png')) {
                resolve(bytes.slice(0, 4).every((byte, i) => byte === FILE_SIGNATURES.png[i]));
            } else if (fileType.includes('gif')) {
                resolve(bytes.slice(0, 4).every((byte, i) => byte === FILE_SIGNATURES.gif[i]));
            } else if (fileType.includes('wordprocessingml') || fileType.includes('openxmlformats')) {
                resolve(bytes.slice(0, 4).every((byte, i) => byte === FILE_SIGNATURES.docx[i]));
            } else if (fileType.includes('msword')) {
                resolve(bytes.slice(0, 4).every((byte, i) => byte === FILE_SIGNATURES.doc[i]));
            } else if (fileType.includes('text/plain')) {
                // Text files don't have magic numbers, allow them
                resolve(true);
            } else {
                resolve(false);
            }
        };
        reader.onerror = () => resolve(false);
        reader.readAsArrayBuffer(file.slice(0, 8));
    });
};

// Enhanced file security validation
// Async deep validation (kept but renamed for backward compatibility)
export const validateFileSecurityAsync = async (file: File): Promise<{ isValid: boolean; error?: string }> => {
    // Check file extension
    const fileName = file.name.toLowerCase();
    const allowedExtensions = ['.txt', '.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'];
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
        return { isValid: false, error: 'Desteklenmeyen dosya uzantısı' };
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        return { isValid: false, error: 'Dosya boyutu 10MB\'dan büyük olamaz' };
    }

    // Check for potentially dangerous file types
    const dangerousTypes = [
        'application/x-executable',
        'application/x-msdownload',
        'application/x-msi',
        'application/x-msdos-program',
        'application/javascript',
        'text/javascript',
        'application/x-shellscript'
    ];

    if (dangerousTypes.includes(file.type)) {
        return { isValid: false, error: 'Güvenlik nedeniyle bu dosya türü desteklenmiyor' };
    }

    // Check file name for suspicious patterns
    const suspiciousPatterns = [
        /\.exe$/i,
        /\.bat$/i,
        /\.cmd$/i,
        /\.com$/i,
        /\.scr$/i,
        /\.pif$/i,
        /\.vbs$/i,
        /\.js$/i,
        /\.sh$/i,
        /\.ps1$/i,
        /\.jar$/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(fileName))) {
        return { isValid: false, error: 'Güvenlik nedeniyle bu dosya türü desteklenmiyor' };
    }

    // Check file magic number (deep validation)
    try {
        const isValidMagicNumber = await checkFileMagicNumber(file);
        if (!isValidMagicNumber) {
            return { isValid: false, error: 'Dosya içeriği belirtilen türle uyuşmuyor' };
        }
    } catch (error) {
        console.error('Magic number validation error:', error);
        return { isValid: false, error: 'Dosya doğrulama hatası' };
    }

    return { isValid: true };
};

// Synchronous version for backward compatibility
export const validateFileSecurity = (file: File): { isValid: boolean; error?: string } => {
    // Check file extension
    const fileName = file.name.toLowerCase();
    const allowedExtensions = ['.txt', '.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'];
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
        return { isValid: false, error: 'Desteklenmeyen dosya uzantısı' };
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        return { isValid: false, error: 'Dosya boyutu 10MB\'dan büyük olamaz' };
    }

    // Check for potentially dangerous file types
    const dangerousTypes = [
        'application/x-executable',
        'application/x-msdownload',
        'application/x-msi',
        'application/x-msdos-program',
        'application/javascript',
        'text/javascript',
        'application/x-shellscript'
    ];

    if (dangerousTypes.includes(file.type)) {
        return { isValid: false, error: 'Güvenlik nedeniyle bu dosya türü desteklenmiyor' };
    }

    // Check file name for suspicious patterns
    const suspiciousPatterns = [
        /\.exe$/i,
        /\.bat$/i,
        /\.cmd$/i,
        /\.com$/i,
        /\.scr$/i,
        /\.pif$/i,
        /\.vbs$/i,
        /\.js$/i,
        /\.sh$/i,
        /\.ps1$/i,
        /\.jar$/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(fileName))) {
        return { isValid: false, error: 'Güvenlik nedeniyle bu dosya türü desteklenmiyor' };
    }

    return { isValid: true };
};

// Auth form validation schema
export const authFormSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().optional(),
    fullName: nameSchema.optional(),
    phone: phoneSchema.optional(),
    birthDate: birthDateSchema.optional(),
    referenceCode: referenceCodeSchema.optional(),
    marketingConsent: z.boolean().optional(),
    emailConsent: z.boolean().optional(),
    smsConsent: z.boolean().optional()
}).refine((data) => {
    // Şifre tekrarı kontrolü (sadece kayıt için)
    if (data.confirmPassword !== undefined) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword']
});

// Document analysis input schema
export const documentAnalysisSchema = z.object({
    text: textInputSchema.optional(), // Metin opsiyonel olsun
    files: z.array(fileSchema).optional()
}).refine((data) => {
    // En az bir tanesi (metin veya dosya) olmalı
    return (data.text && data.text.trim().length > 0) || (data.files && data.files.length > 0);
}, {
    message: "En az bir metin girin veya dosya yükleyin"
});

// Enhanced HTML sanitization with DOMPurify
export const sanitizeHtml = (html: string): string => {
    try {
        // Use DOMPurify for comprehensive XSS protection
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'],
            ALLOWED_ATTR: ['class'],
            FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
            FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
            RETURN_DOM_FRAGMENT: false,
            RETURN_DOM: false
        });
    } catch (error) {
        console.error('HTML sanitization error:', error);
        // Fallback to basic sanitization
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
            .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
    }
};

// Validate and sanitize user input
export const validateAndSanitizeInput = (input: string): string => {
    const sanitized = sanitizeHtml(input);
    return sanitized.trim();
};

// Rate limiting helper (basic implementation)
export class RateLimiter {
    private attempts: Map<string, { count: number; resetTime: number }> = new Map();
    private maxAttempts = 5;
    private windowMs = 15 * 60 * 1000; // 15 minutes

    isAllowed(identifier: string): boolean {
        const now = Date.now();
        const attempt = this.attempts.get(identifier);

        if (!attempt || now > attempt.resetTime) {
            this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
            return true;
        }

        if (attempt.count >= this.maxAttempts) {
            return false;
        }

        attempt.count++;
        return true;
    }

    reset(identifier: string): void {
        this.attempts.delete(identifier);
    }
}

// Export rate limiter instance
export const rateLimiter = new RateLimiter();

// CSRF Protection utility
export const generateCSRFToken = (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate CSRF token
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
    if (!token || !storedToken) return false;
    return token === storedToken;
};

// Input length validation for DoS protection
export const validateInputLength = (input: string, maxLength: number = 50000): boolean => {
    return input.length <= maxLength;
};

// SQL injection pattern detection
export const detectSQLInjection = (input: string): boolean => {
    const sqlPatterns = [
        /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bDROP\b|\bUPDATE\b)/i,
        /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i,
        /['";][\s]*(\bOR\b|\bAND\b)/i,
        /\b(exec|execute|sp_)\b/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
};

// Enhanced input validation with multiple security checks
export const validateSecureInput = (input: string): { isValid: boolean; error?: string } => {
    // Check input length
    if (!validateInputLength(input)) {
        return { isValid: false, error: 'Girdi çok uzun' };
    }

    // Check for SQL injection patterns
    if (detectSQLInjection(input)) {
        return { isValid: false, error: 'Güvenlik ihlali tespit edildi' };
    }

    // Check for excessive special characters (potential attack)
    const specialCharCount = (input.match(/[<>'"&;]/g) || []).length;
    if (specialCharCount > input.length * 0.1) { // More than 10% special chars
        return { isValid: false, error: 'Geçersiz karakter kullanımı' };
    }

    return { isValid: true };
};
// Enhanced security validation utilities
class SecurityValidator {
    // XSS prevention patterns
    private static readonly XSS_PATTERNS = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
        /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
        /data:text\/html/gi,
        /vbscript:/gi,
        /expression\s*\(/gi,
    ];

    // SQL injection patterns
    private static readonly SQL_PATTERNS = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
        /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
        /(--|\/\*|\*\/)/gi,
        /(\bUNION\s+SELECT\b)/gi,
        /(\b(SCRIPT|JAVASCRIPT|VBSCRIPT)\b)/gi,
    ];

    // Path traversal patterns
    private static readonly PATH_TRAVERSAL_PATTERNS = [
        /\.\.\//gi,
        /\.\.\\/gi,
        /%2e%2e%2f/gi,
        /%2e%2e%5c/gi,
        /\.\.%2f/gi,
        /\.\.%5c/gi,
    ];

    // Command injection patterns
    private static readonly COMMAND_INJECTION_PATTERNS = [
        /[;&|`$(){}[\]]/gi,
        /\b(cat|ls|pwd|whoami|id|uname|ps|netstat|ifconfig|ping|wget|curl|nc|telnet|ssh|ftp)\b/gi,
    ];

    /**
     * Comprehensive input sanitization
     */
    static sanitizeInput(input: string): string {
        if (!input || typeof input !== 'string') {
            return '';
        }

        // Remove null bytes
        let sanitized = input.replace(/\0/g, '');

        // HTML encode dangerous characters
        sanitized = DOMPurify.sanitize(sanitized, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
            KEEP_CONTENT: true,
        });

        // Additional encoding for special characters
        sanitized = sanitized
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');

        return sanitized.trim();
    }

    /**
     * Check for malicious patterns
     */
    static containsMaliciousContent(input: string): boolean {
        if (!input || typeof input !== 'string') {
            return false;
        }

        const allPatterns = [
            ...this.XSS_PATTERNS,
            ...this.SQL_PATTERNS,
            ...this.PATH_TRAVERSAL_PATTERNS,
            ...this.COMMAND_INJECTION_PATTERNS,
        ];

        return allPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Validate file upload security
     */
    static validateFileUpload(file: File): { isValid: boolean; error?: string } {
        // Check file size (10MB limit)
        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return { isValid: false, error: 'Dosya boyutu 10MB\'dan büyük olamaz' };
        }

        // Allowed file types
        const ALLOWED_TYPES = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
        ];

        if (!ALLOWED_TYPES.includes(file.type)) {
            return { isValid: false, error: 'Desteklenmeyen dosya türü' };
        }

        // Check file name for malicious patterns
        if (this.containsMaliciousContent(file.name)) {
            return { isValid: false, error: 'Dosya adı güvenli değil' };
        }

        // Check for double extensions
        const nameParts = file.name.split('.');
        if (nameParts.length > 2) {
            return { isValid: false, error: 'Çoklu uzantılı dosyalar kabul edilmez' };
        }

        return { isValid: true };
    }

    /**
     * Rate limiting helper
     */
    static createRateLimiter(maxRequests: number, windowMs: number) {
        const requests = new Map<string, number[]>();

        return {
            isAllowed: (identifier: string): boolean => {
                const now = Date.now();
                const userRequests = requests.get(identifier) || [];

                // Remove old requests outside the window
                const validRequests = userRequests.filter(time => now - time < windowMs);

                if (validRequests.length >= maxRequests) {
                    return false;
                }

                // Add current request
                validRequests.push(now);
                requests.set(identifier, validRequests);

                return true;
            },

            getRemainingRequests: (identifier: string): number => {
                const now = Date.now();
                const userRequests = requests.get(identifier) || [];
                const validRequests = userRequests.filter(time => now - time < windowMs);
                return Math.max(0, maxRequests - validRequests.length);
            },

            getResetTime: (identifier: string): number => {
                const userRequests = requests.get(identifier) || [];
                if (userRequests.length === 0) return 0;

                const oldestRequest = Math.min(...userRequests);
                return oldestRequest + windowMs;
            }
        };
    }
}

// Enhanced document analysis schema with security validation
export const secureDocumentAnalysisSchema = z.object({
    text: z.string()
        .min(1, 'Metin boş olamaz')
        .max(50000, 'Metin çok uzun (maksimum 50,000 karakter)')
        .refine(
            (text) => !SecurityValidator.containsMaliciousContent(text),
            'Güvenli olmayan içerik tespit edildi'
        )
        .transform((text) => SecurityValidator.sanitizeInput(text))
        .optional(),

    files: z.array(z.instanceof(File))
        .max(5, 'Maksimum 5 dosya yükleyebilirsiniz')
        .refine(
            (files) => files.every(file => SecurityValidator.validateFileUpload(file).isValid),
            'Bir veya daha fazla dosya güvenlik kontrolünden geçemedi'
        )
        .optional(),

    model: z.enum(['flash', 'pro'], {
        errorMap: () => ({ message: 'Geçersiz model seçimi' })
    }).optional(),
});

// Export SecurityValidator for external use
export { SecurityValidator };

// Enhanced validation utilities using SecurityValidator
export const sanitizeInputSecure = SecurityValidator.sanitizeInput;
export const validateFileSecurityEnhanced = SecurityValidator.validateFileUpload;
export const createAdvancedRateLimiter = SecurityValidator.createRateLimiter;

// Create enhanced rate limiter instance
export const enhancedRateLimiter = createAdvancedRateLimiter(15, 15 * 60 * 1000);