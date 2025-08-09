import React from 'react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useSession } from '@supabase/auth-helpers-react';
import { Navigate } from 'react-router-dom';

const AnalyticsPage: React.FC = () => {
    const session = useSession();

    // Admin check - bu kısmı ihtiyaca göre özelleştirebilirsin
    // Şu an için tüm giriş yapmış kullanıcılar görebilir
    if (!session) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto">
                <AnalyticsDashboard />
            </div>
        </div>
    );
};

export default AnalyticsPage;