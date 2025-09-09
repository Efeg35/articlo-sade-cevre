import { useEffect, useCallback } from 'react';
import { Logger } from '@/utils/logger';

interface PerformanceMetrics {
    navigationTiming: PerformanceNavigationTiming | null;
    paintTiming: PerformancePaintTiming[];
    resourceTiming: PerformanceResourceTiming[];
    memoryUsage: any;
}

interface VitalMetrics {
    FCP: number | null; // First Contentful Paint
    LCP: number | null; // Largest Contentful Paint
    FID: number | null; // First Input Delay
    CLS: number | null; // Cumulative Layout Shift
    TTFB: number | null; // Time to First Byte
}

export const usePerformanceMonitoring = (enabled: boolean = true) => {
    const measureVitals = useCallback((): VitalMetrics => {
        const vitals: VitalMetrics = {
            FCP: null,
            LCP: null,
            FID: null,
            CLS: null,
            TTFB: null
        };

        try {
            // First Contentful Paint
            const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformancePaintTiming;
            if (fcpEntry) {
                vitals.FCP = fcpEntry.startTime;
            }

            // Time to First Byte
            const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (navigationEntry) {
                vitals.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
            }

            // Largest Contentful Paint (requires observer)
            if ('PerformanceObserver' in window) {
                try {
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1] as any;
                        if (lastEntry) {
                            vitals.LCP = lastEntry.startTime;
                        }
                    });
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                } catch (error) {
                    Logger.warn('PerformanceMonitoring', 'LCP observer error', error);
                }
            }

        } catch (error) {
            Logger.error('PerformanceMonitoring', 'Error measuring vitals', error);
        }

        return vitals;
    }, []);

    const getMemoryUsage = useCallback(() => {
        try {
            // @ts-ignore - memory API is experimental
            if ('memory' in performance) {
                // @ts-ignore
                return performance.memory;
            }
            return null;
        } catch (error) {
            Logger.warn('PerformanceMonitoring', 'Memory usage not available', error);
            return null;
        }
    }, []);

    const measureResourceTiming = useCallback(() => {
        try {
            const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

            // Analyze slow resources
            const slowResources = resources.filter(resource =>
                resource.duration > 1000 // Resources taking more than 1 second
            );

            if (slowResources.length > 0) {
                Logger.warn('PerformanceMonitoring', 'Slow resources detected', {
                    count: slowResources.length,
                    resources: slowResources.map(r => ({
                        name: r.name,
                        duration: r.duration,
                        size: r.transferSize
                    }))
                });
            }

            return resources;
        } catch (error) {
            Logger.error('PerformanceMonitoring', 'Error measuring resource timing', error);
            return [];
        }
    }, []);

    const reportPerformanceMetrics = useCallback(() => {
        if (!enabled) return;

        try {
            const vitals = measureVitals();
            const memoryUsage = getMemoryUsage();
            const resourceTiming = measureResourceTiming();

            const metrics = {
                vitals,
                memoryUsage,
                resourceCount: resourceTiming.length,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            };

            Logger.log('PerformanceMonitoring', 'Performance metrics', metrics);

            // Future: Send to analytics service
            // analytics.track('performance_metrics', metrics);

            return metrics;
        } catch (error) {
            Logger.error('PerformanceMonitoring', 'Error reporting metrics', error);
            return null;
        }
    }, [enabled, measureVitals, getMemoryUsage, measureResourceTiming]);

    // Monitor long tasks
    useEffect(() => {
        if (!enabled || !('PerformanceObserver' in window)) return;

        try {
            const longTaskObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.duration > 50) { // Tasks longer than 50ms
                        Logger.warn('PerformanceMonitoring', 'Long task detected', {
                            duration: entry.duration,
                            startTime: entry.startTime,
                            name: entry.name
                        });
                    }
                });
            });

            longTaskObserver.observe({ entryTypes: ['longtask'] });

            return () => {
                longTaskObserver.disconnect();
            };
        } catch (error) {
            Logger.warn('PerformanceMonitoring', 'Long task observer not supported', error);
        }
    }, [enabled]);

    // Monitor layout shifts
    useEffect(() => {
        if (!enabled || !('PerformanceObserver' in window)) return;

        try {
            let clsValue = 0;

            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });

                if (clsValue > 0.1) { // CLS threshold
                    Logger.warn('PerformanceMonitoring', 'High Cumulative Layout Shift', {
                        cls: clsValue
                    });
                }
            });

            clsObserver.observe({ entryTypes: ['layout-shift'] });

            return () => {
                clsObserver.disconnect();
            };
        } catch (error) {
            Logger.warn('PerformanceMonitoring', 'Layout shift observer not supported', error);
        }
    }, [enabled]);

    // Report metrics on page load
    useEffect(() => {
        if (!enabled) return;

        const reportOnLoad = () => {
            // Wait for page to be fully loaded
            setTimeout(() => {
                reportPerformanceMetrics();
            }, 2000);
        };

        if (document.readyState === 'complete') {
            reportOnLoad();
        } else {
            window.addEventListener('load', reportOnLoad);
            return () => window.removeEventListener('load', reportOnLoad);
        }
    }, [enabled, reportPerformanceMetrics]);

    return {
        measureVitals,
        getMemoryUsage,
        measureResourceTiming,
        reportPerformanceMetrics
    };
};