import React from 'react';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { useSession } from '@supabase/auth-helpers-react';
import { Navigate } from 'react-router-dom';

const NotificationSettingsPage: React.FC = () => {
    const session = useSession();

    if (!session) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Bildirim Ayarları</h1>
                    <p className="text-muted-foreground mt-2">
                        Push bildirimlerinizi yönetin ve tercihlerinizi ayarlayın
                    </p>
                </div>
                <NotificationSettings />
            </div>
        </div>
    );
};

export default NotificationSettingsPage;