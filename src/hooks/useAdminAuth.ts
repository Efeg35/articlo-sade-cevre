import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

// Admin email listesi
const ADMIN_EMAILS = ['info@artiklo.legal'];

export const useAdminAuth = () => {
    const session = useSession();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = () => {
            setIsLoading(true);

            if (!session?.user?.email) {
                setIsAdmin(false);
                setIsLoading(false);
                return;
            }

            const userEmail = session.user.email.toLowerCase();
            const hasAdminAccess = ADMIN_EMAILS.includes(userEmail);

            console.log('[Admin Auth] Checking admin status:', {
                userEmail,
                hasAdminAccess,
                adminEmails: ADMIN_EMAILS
            });

            setIsAdmin(hasAdminAccess);
            setIsLoading(false);
        };

        checkAdminStatus();
    }, [session?.user?.email]);

    return {
        isAdmin,
        isLoading,
        userEmail: session?.user?.email || null,
        session
    };
};

// Admin route guard hook
export const useAdminRouteGuard = () => {
    const { isAdmin, isLoading } = useAdminAuth();

    return {
        isAdmin,
        isLoading,
        canAccessAdmin: isAdmin,
        shouldRedirect: !isLoading && !isAdmin
    };
};