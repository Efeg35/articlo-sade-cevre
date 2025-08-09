import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { analytics } from '../services/analytics';

export const useAnalytics = () => {
    const location = useLocation();
    const session = useSession();
    const prevLocationRef = useRef(location.pathname);

    // Set user ID when session changes
    useEffect(() => {
        if (session?.user?.id) {
            analytics.setUserId(session.user.id);
        }
    }, [session?.user?.id]);

    // Track page views
    useEffect(() => {
        if (prevLocationRef.current !== location.pathname) {
            analytics.trackPageView(location.pathname, document.title);
            prevLocationRef.current = location.pathname;
        }
    }, [location.pathname]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            analytics.endSession();
        };
    }, []);

    return {
        trackTemplateView: analytics.trackTemplateView.bind(analytics),
        trackTemplateGenerate: analytics.trackTemplateGenerate.bind(analytics),
        trackDocumentDownload: analytics.trackDocumentDownload.bind(analytics),
        trackSearch: analytics.trackSearch.bind(analytics),
        trackUserAction: analytics.trackUserAction.bind(analytics),
        trackError: analytics.trackError.bind(analytics),
        trackPerformance: analytics.trackPerformance.bind(analytics),
        trackConversion: analytics.trackConversion.bind(analytics),
        trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    };
};