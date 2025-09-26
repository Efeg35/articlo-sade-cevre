/**
 * 🧪 Global Test Setup Configuration
 * 
 * Vitest global setup with jest-dom matchers and testing utilities
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Auto cleanup after each test
afterEach(() => {
    cleanup();
});

// Global mocks for testing environment
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock IntersectionObserver
// Mock IntersectionObserver
interface GlobalWithIntersectionObserver extends Global {
    IntersectionObserver: typeof IntersectionObserver;
}

(global as GlobalWithIntersectionObserver).IntersectionObserver = class IntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];

    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
    takeRecords() { return []; }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
    }),
});

// Mock localStorage
const localStorageMock = {
    getItem: (key: string) => null,
    setItem: (key: string, value: string) => { },
    removeItem: (key: string) => { },
    clear: () => { },
    length: 0,
    key: (index: number) => null,
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock scrollTo
window.scrollTo = () => { };

console.log('🧪 Test environment setup completed');