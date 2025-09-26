/**
 * 🧪 Test Setup Configuration
 * 
 * Vitest setup for wizard tests with jest-dom matchers
 */

import { expect, beforeAll, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Global test setup
beforeAll(() => {
    // Mock console methods to avoid noise in test output
    global.console = {
        ...console,
        log: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    };
});

// Auto cleanup after each test
afterEach(() => {
    cleanup();
});