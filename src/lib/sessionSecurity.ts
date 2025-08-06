import { useSession } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';

// Session timeout configuration (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

// Session security utilities
export const useSessionSecurity = () => {
    const session = useSession();

    useEffect(() => {
        if (!session) return;

        // Set up session timeout
        const timeoutId = setTimeout(() => {
            console.log('Session timeout - user will be logged out');
            // This will trigger a re-authentication flow
            window.location.href = '/auth?timeout=true';
        }, SESSION_TIMEOUT);

        // Reset timeout on user activity
        const resetTimeout = () => {
            clearTimeout(timeoutId);
            setTimeout(() => {
                console.log('Session timeout - user will be logged out');
                window.location.href = '/auth?timeout=true';
            }, SESSION_TIMEOUT);
        };

        // Listen for user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, resetTimeout, true);
        });

        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => {
                document.removeEventListener(event, resetTimeout, true);
            });
        };
    }, [session]);

    return session;
};

// Check if session is valid
export const isSessionValid = (session: any): boolean => {
    if (!session) return false;

    // Check if session has expired
    const now = Date.now();
    const sessionExpiry = session.expires_at * 1000; // Convert to milliseconds

    return now < sessionExpiry;
};

// Secure logout function
export const secureLogout = async (supabase: any) => {
    try {
        // Clear all local storage
        localStorage.clear();
        sessionStorage.clear();

        // Sign out from Supabase
        await supabase.auth.signOut();

        // Redirect to auth page
        window.location.href = '/auth';
    } catch (error) {
        console.error('Logout error:', error);
        // Force redirect even if logout fails
        window.location.href = '/auth';
    }
};

// Session activity tracker
export class SessionActivityTracker {
    private lastActivity: number = Date.now();
    private timeoutId: NodeJS.Timeout | null = null;

    constructor(private onTimeout: () => void, private timeoutMs: number = SESSION_TIMEOUT) {
        this.setupActivityListeners();
    }

    private setupActivityListeners() {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        events.forEach(event => {
            document.addEventListener(event, () => this.updateActivity(), true);
        });
    }

    private updateActivity() {
        this.lastActivity = Date.now();
        this.resetTimeout();
    }

    private resetTimeout() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
            const timeSinceLastActivity = Date.now() - this.lastActivity;
            if (timeSinceLastActivity >= this.timeoutMs) {
                this.onTimeout();
            }
        }, this.timeoutMs);
    }

    public destroy() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
}
