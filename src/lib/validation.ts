import { z } from 'zod';

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
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'İsim sadece harf içerebilir');

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

// Enhanced file security validation
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
        'application/x-msdos-program'
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
        /\.js$/i
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
    fullName: nameSchema.optional()
});

// Document analysis input schema
export const documentAnalysisSchema = z.object({
    text: textInputSchema,
    files: z.array(fileSchema).optional()
});

// Sanitize HTML content
export const sanitizeHtml = (html: string): string => {
    // Basic HTML sanitization for now
    // In production, you can use DOMPurify if available
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
        .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
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
