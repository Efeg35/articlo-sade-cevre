import { useState, useCallback } from 'react';
import { DashboardError } from '../types';

export interface ErrorHandlingState {
    criticalError: string | null;
    apiFallbackMode: boolean;
    nativeFeatureFallback: boolean;
    isRecovering: boolean;
}

export interface ErrorHandlingActions {
    setCriticalError: (error: string | null) => void;
    setApiFallbackMode: (enabled: boolean) => void;
    setNativeFeatureFallback: (enabled: boolean) => void;
    setIsRecovering: (recovering: boolean) => void;
    handleError: (error: DashboardError) => void;
    clearErrors: () => void;
    attemptRecovery: () => void;
}

export function useErrorHandling(): ErrorHandlingState & ErrorHandlingActions {
    const [criticalError, setCriticalError] = useState<string | null>(null);
    const [apiFallbackMode, setApiFallbackMode] = useState(false);
    const [nativeFeatureFallback, setNativeFeatureFallback] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);

    const handleError = useCallback((error: DashboardError) => {
        console.error('Dashboard Error:', error);

        switch (error.type) {
            case 'critical':
                setCriticalError(error.message);
                break;

            case 'api':
                // Enable API fallback mode for API errors
                setApiFallbackMode(true);
                console.warn('API fallback mode enabled due to error:', error.message);
                break;

            case 'fallback':
                // Enable native feature fallback
                setNativeFeatureFallback(true);
                console.warn('Native feature fallback enabled:', error.message);
                break;

            case 'validation':
                // Validation errors are handled by form validation
                console.warn('Validation error:', error.message);
                break;

            default:
                console.warn('Unknown error type:', error);
                break;
        }
    }, []);

    const clearErrors = useCallback(() => {
        setCriticalError(null);
        setApiFallbackMode(false);
        setNativeFeatureFallback(false);
        setIsRecovering(false);
    }, []);

    const attemptRecovery = useCallback(async () => {
        setIsRecovering(true);

        try {
            // Simulate recovery attempt
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Clear all error states on successful recovery
            clearErrors();
        } catch (recoveryError) {
            console.error('Recovery attempt failed:', recoveryError);
            setCriticalError('Kurtarma girişimi başarısız oldu');
        } finally {
            setIsRecovering(false);
        }
    }, [clearErrors]);

    return {
        // State
        criticalError,
        apiFallbackMode,
        nativeFeatureFallback,
        isRecovering,

        // Actions
        setCriticalError,
        setApiFallbackMode,
        setNativeFeatureFallback,
        setIsRecovering,
        handleError,
        clearErrors,
        attemptRecovery,
    };
}