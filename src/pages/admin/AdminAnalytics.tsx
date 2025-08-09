import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

const AdminAnalytics = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground">Platform kullanım istatistikleri ve performans metrikleri</p>
                </div>
            </div>

            {/* Analytics Dashboard Content */}
            <div className="bg-background rounded-lg">
                <AnalyticsDashboard />
            </div>
        </div>
    );
};

export default AdminAnalytics;