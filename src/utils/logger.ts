/**
 * 🔒 Production-Safe Logger Utility
 * Sensitive data'yı production'da gizler, development'da güvenli logging sağlar
 */

const isDevelopment = import.meta.env.MODE === 'development';
const isTest = import.meta.env.MODE === 'test';

export class Logger {
    private static sensitiveKeys = [
        'password', 'email', 'session', 'user', 'credentials', 'token',
        'auth', 'key', 'secret', 'api', 'jwt', 'bearer', 'authorization',
        'credit', 'payment', 'billing'
    ];

    /**
     * Sensitive data'yı temizler ve güvenli hale getirir
     */
    private static sanitizeData(data: unknown): unknown {
        if (typeof data !== 'object' || data === null) {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map(item => this.sanitizeData(item));
        }

        const sanitized = { ...data as Record<string, unknown> };

        for (const key in sanitized) {
            const keyLower = key.toLowerCase();
            const isSensitive = this.sensitiveKeys.some(sensitive =>
                keyLower.includes(sensitive)
            );

            if (isSensitive) {
                sanitized[key] = '***REDACTED***';
            } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
                sanitized[key] = this.sanitizeData(sanitized[key]);
            }
        }

        return sanitized;
    }

    /**
     * Development logging - Production'da hiçbir şey log etmez
     */
    static log(component: string, message: string, data?: unknown) {
        if (!isDevelopment && !isTest) return; // 🔒 Production'da hiç log yok

        const timestamp = new Date().toISOString();
        const sanitizedData = data ? this.sanitizeData(data) : undefined;

        if (sanitizedData !== undefined) {
            console.log(`[${timestamp}] [${component}] ${message}`, sanitizedData);
        } else {
            console.log(`[${timestamp}] [${component}] ${message}`);
        }
    }

    /**
     * Error logging - Production'da sadece error tracking service'e gönderir
     */
    static error(component: string, message: string, error?: unknown) {
        const timestamp = new Date().toISOString();

        if (!isDevelopment && !isTest) {
            // 🔒 Production'da sadece error tracking service'e gönder
            // TODO: Sentry/LogRocket integration burada olacak
            try {
                // Future: Sentry.captureException(error);
                console.error(`[${timestamp}] [${component}] ❌ ${message}`);
            } catch (e) {
                // Silent fail - logging hatası uygulamayı durdurmamalı
            }
            return;
        }

        // Development'da detaylı error logging
        const sanitizedError = error ? this.sanitizeData(error) : undefined;
        console.error(`[${timestamp}] [${component}] ❌ ${message}`, sanitizedError);
    }

    /**
     * Warning logging - Production'da hiç log etmez
     */
    static warn(component: string, message: string, data?: unknown) {
        if (!isDevelopment && !isTest) return; // 🔒 Production'da hiç log yok

        const timestamp = new Date().toISOString();
        const sanitizedData = data ? this.sanitizeData(data) : undefined;

        if (sanitizedData !== undefined) {
            console.warn(`[${timestamp}] [${component}] ⚠️ ${message}`, sanitizedData);
        } else {
            console.warn(`[${timestamp}] [${component}] ⚠️ ${message}`);
        }
    }

    /**
     * Debug logging - Sadece development'da çalışır
     */
    static debug(component: string, message: string, data?: unknown) {
        if (!isDevelopment) return; // 🔒 Test ve Production'da hiç log yok

        const timestamp = new Date().toISOString();
        const sanitizedData = data ? this.sanitizeData(data) : undefined;

        if (sanitizedData !== undefined) {
            console.debug(`[${timestamp}] [${component}] 🐛 ${message}`, sanitizedData);
        } else {
            console.debug(`[${timestamp}] [${component}] 🐛 ${message}`);
        }
    }

    /**
     * Performance logging - Execution time tracking
     */
    static time(component: string, label: string) {
        if (!isDevelopment && !isTest) return;
        console.time(`[${component}] ${label}`);
    }

    static timeEnd(component: string, label: string) {
        if (!isDevelopment && !isTest) return;
        console.timeEnd(`[${component}] ${label}`);
    }
}

// 🔒 KONTROL NOKTASI: Logger utility oluşturuldu
// Test için kullanım:
// Logger.log('Test', 'Logger created successfully');