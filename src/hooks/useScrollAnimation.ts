import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { trackOnboardingEvent } from '@/stores/onboardingStoreZustand';

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    trackEvent?: boolean;
    eventName?: string;
    delay?: number;
}

interface ScrollAnimationResult {
    ref: (node?: Element | null) => void;
    inView: boolean;
    entry: IntersectionObserverEntry | undefined;
    isVisible: boolean;
    hasBeenVisible: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}): ScrollAnimationResult => {
    const {
        threshold = 0.1,
        rootMargin = '0px 0px -10% 0px',
        triggerOnce = true,
        trackEvent = false,
        eventName = 'scroll_animation_triggered',
        delay = 0
    } = options;

    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { ref, inView, entry } = useInView({
        threshold,
        rootMargin,
        triggerOnce
    });

    useEffect(() => {
        if (inView && !hasBeenVisible) {
            if (delay > 0) {
                timeoutRef.current = setTimeout(() => {
                    setIsVisible(true);
                    setHasBeenVisible(true);

                    // Track scroll animation event
                    if (trackEvent) {
                        trackOnboardingEvent(eventName, {
                            threshold,
                            rootMargin,
                            delay,
                            timestamp: new Date().toISOString()
                        });
                    }
                }, delay);
            } else {
                setIsVisible(true);
                setHasBeenVisible(true);

                if (trackEvent) {
                    trackOnboardingEvent(eventName, {
                        threshold,
                        rootMargin,
                        delay: 0,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        } else if (!triggerOnce && !inView) {
            setIsVisible(false);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [inView, hasBeenVisible, delay, triggerOnce, trackEvent, eventName, threshold, rootMargin]);

    return {
        ref,
        inView,
        entry,
        isVisible,
        hasBeenVisible
    };
};

// Staggered animations for multiple elements
export const useStaggeredScrollAnimation = (
    itemCount: number,
    options: UseScrollAnimationOptions = {}
) => {
    const baseDelay = options.delay || 0;
    const staggerDelay = 80; // Reduced to 80ms for more professional feel

    // Use a single intersection observer for the container
    const [visibleItems, setVisibleItems] = useState<boolean[]>(
        Array(itemCount).fill(false)
    );
    const [hasTriggered, setHasTriggered] = useState(false);

    const { ref, inView } = useInView({
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -10% 0px',
        triggerOnce: options.triggerOnce !== false
    });

    useEffect(() => {
        if (inView && !hasTriggered) {
            setHasTriggered(true);

            // Track event for the group
            if (options.trackEvent) {
                trackOnboardingEvent(
                    `${options.eventName || 'staggered_scroll_animation'}_group`,
                    {
                        itemCount,
                        baseDelay,
                        staggerDelay,
                        timestamp: new Date().toISOString()
                    }
                );
            }

            // Trigger each item with staggered delay
            Array.from({ length: itemCount }, (_, index) => {
                setTimeout(() => {
                    setVisibleItems(prev => {
                        const newState = [...prev];
                        newState[index] = true;
                        return newState;
                    });
                }, baseDelay + (index * staggerDelay));
            });
        }
    }, [inView, hasTriggered, itemCount, baseDelay, staggerDelay, options.trackEvent, options.eventName]);

    return {
        ref,
        inView,
        visibleItems,
        hasTriggered
    };
};

// Professional preset configurations for B2B software
export const scrollPresets = {
    // Subtle fade in from bottom - professional timing
    fadeInUp: {
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px',
        triggerOnce: true
    },

    // Gentle slide in from side - reduced movement
    slideInFromLeft: {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
        triggerOnce: true
    },

    // Minimal scale up - professional subtlety
    scaleIn: {
        threshold: 0.25,
        rootMargin: '0px 0px -12% 0px',
        triggerOnce: true
    },

    // Mobile optimized - performance focused
    mobileOptimized: {
        threshold: 0.1,
        rootMargin: '0px 0px -5% 0px',
        triggerOnce: true
    },

    // Professional continuous - less aggressive
    continuous: {
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px',
        triggerOnce: false
    },

    // Professional B2B specific
    professional: {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
        triggerOnce: true,
        delay: 0
    }
};

// Hook for scroll-based counters and progress indicators
export const useScrollProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const { ref, inView, entry } = useInView({
        threshold: Array.from({ length: 11 }, (_, i) => i * 0.1), // 0, 0.1, 0.2, ..., 1
        rootMargin: '0px'
    });

    useEffect(() => {
        if (entry && inView) {
            const progress = entry.intersectionRatio;
            setScrollProgress(progress);
        }
    }, [entry, inView]);

    return { ref, scrollProgress, inView };
};

export default useScrollAnimation;