import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Bell,
    BellOff,
    Settings,
    TestTube,
    CheckCircle,
    XCircle,
    AlertCircle,
    Shield,
    Smartphone,
    Mail,
    Clock
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAnalytics } from '@/hooks/useAnalytics';
import { createClient } from '@supabase/supabase-js';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface NotificationPreferences {
    welcome_notifications: boolean;
    template_recommendations: boolean;
    document_ready: boolean;
    system_updates: boolean;
    marketing_notifications: boolean;
    daily_digest: boolean;
    weekly_summary: boolean;
    push_notifications: boolean;
    email_notifications: boolean;
}

export const NotificationSettings: React.FC = () => {
    const session = useSession();
    const analytics = useAnalytics();
    const {
        isSupported,
        permission,
        isSubscribed,
        loading,
        error,
        requestPermission,
        subscribe,
        unsubscribe,
        sendTestNotification
    } = useNotifications();

    const [preferences, setPreferences] = useState<NotificationPreferences>({
        welcome_notifications: true,
        template_recommendations: true,
        document_ready: true,
        system_updates: true,
        marketing_notifications: false,
        daily_digest: false,
        weekly_summary: true,
        push_notifications: false,
        email_notifications: true
    });

    const [savingPreferences, setSavingPreferences] = useState(false);
    const [testingNotification, setTestingNotification] = useState(false);

    const loadUserPreferences = useCallback(async () => {
        try {
            const { data } = await supabase
                .from('user_notification_preferences')
                .select('*')
                .eq('user_id', session?.user?.id)
                .single();

            if (data) {
                setPreferences({
                    welcome_notifications: data.welcome_notifications,
                    template_recommendations: data.template_recommendations,
                    document_ready: data.document_ready,
                    system_updates: data.system_updates,
                    marketing_notifications: data.marketing_notifications,
                    daily_digest: data.daily_digest,
                    weekly_summary: data.weekly_summary,
                    push_notifications: data.push_notifications,
                    email_notifications: data.email_notifications
                });
            }
        } catch (error) {
            console.error('Failed to load preferences:', error);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        if (session?.user?.id) {
            loadUserPreferences();
        }
    }, [session?.user?.id, loadUserPreferences]);

    const savePreferences = async (updatedPreferences: Partial<NotificationPreferences>) => {
        setSavingPreferences(true);

        try {
            const { error } = await supabase
                .from('user_notification_preferences')
                .upsert({
                    user_id: session?.user?.id,
                    ...preferences,
                    ...updatedPreferences,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            setPreferences(prev => ({ ...prev, ...updatedPreferences }));

            // Track preference change
            analytics.trackFeatureUsage('Notifications', 'Preferences Updated', {
                preferences: updatedPreferences
            });

            toast.success('Bildirim tercihleri güncellendi');
        } catch (error) {
            console.error('Failed to save preferences:', error);
            toast.error('Tercihler kaydedilemedi');
        } finally {
            setSavingPreferences(false);
        }
    };

    const handleSubscriptionToggle = async () => {
        if (isSubscribed) {
            const success = await unsubscribe();
            if (success) {
                await savePreferences({ push_notifications: false });
                analytics.trackFeatureUsage('Notifications', 'Unsubscribed', {});
            }
        } else {
            const success = await subscribe();
            if (success) {
                await savePreferences({ push_notifications: true });
                analytics.trackFeatureUsage('Notifications', 'Subscribed', {});
            }
        }
    };

    const handleTestNotification = async () => {
        setTestingNotification(true);
        try {
            const success = await sendTestNotification();
            if (success) {
                analytics.trackFeatureUsage('Notifications', 'Test Sent', {});
            }
        } finally {
            setTestingNotification(false);
        }
    };

    const PreferenceSwitch: React.FC<{
        title: string;
        description: string;
        checked: boolean;
        onChange: (checked: boolean) => void;
        disabled?: boolean;
    }> = ({ title, description, checked, onChange, disabled = false }) => (
        <div className="flex items-center justify-between py-3">
            <div className="space-y-1">
                <div className="font-medium">{title}</div>
                <div className="text-sm text-muted-foreground">{description}</div>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onChange}
                disabled={disabled || savingPreferences}
            />
        </div>
    );

    const getPermissionStatus = () => {
        switch (permission) {
            case 'granted':
                return { icon: CheckCircle, text: 'İzin Verildi', color: 'text-green-600' };
            case 'denied':
                return { icon: XCircle, text: 'İzin Reddedildi', color: 'text-red-600' };
            default:
                return { icon: AlertCircle, text: 'İzin Bekleniyor', color: 'text-yellow-600' };
        }
    };

    const status = getPermissionStatus();
    const StatusIcon = status.icon;

    if (!isSupported) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BellOff className="h-5 w-5" />
                        Bildirim Ayarları
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Tarayıcınız push notification'ları desteklemiyor. Güncel bir tarayıcı kullanmayı deneyin.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Push Notification Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Push Bildirimler
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Status Display */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <StatusIcon className={`h-5 w-5 ${status.color}`} />
                            <div>
                                <div className="font-medium">Bildirim Durumu</div>
                                <div className="text-sm text-muted-foreground">{status.text}</div>
                            </div>
                        </div>
                        <Badge variant={isSubscribed ? 'default' : 'outline'}>
                            {isSubscribed ? 'Aktif' : 'Pasif'}
                        </Badge>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Control Buttons */}
                    <div className="flex gap-2">
                        {permission !== 'granted' && (
                            <Button
                                onClick={requestPermission}
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                <Shield className="h-4 w-4" />
                                {loading ? 'İzin İsteniyor...' : 'İzin İste'}
                            </Button>
                        )}

                        {permission === 'granted' && (
                            <Button
                                onClick={handleSubscriptionToggle}
                                disabled={loading}
                                variant={isSubscribed ? 'outline' : 'default'}
                                className="flex items-center gap-2"
                            >
                                {isSubscribed ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                                {loading ? 'İşleniyor...' : (isSubscribed ? 'Bildirimleri Kapat' : 'Bildirimleri Aç')}
                            </Button>
                        )}

                        {isSubscribed && (
                            <Button
                                onClick={handleTestNotification}
                                disabled={testingNotification}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <TestTube className="h-4 w-4" />
                                {testingNotification ? 'Gönderiliyor...' : 'Test Gönder'}
                            </Button>
                        )}
                    </div>

                    {/* Info */}
                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                            <Smartphone className="h-3 w-3" />
                            <span className="font-medium">Bilgi:</span>
                        </div>
                        Push bildirimler size önemli güncellemeler, belge hazır bildirimleri ve kişiselleştirilmiş öneriler gönderir.
                        İstediğiniz zaman kapatabilirsiniz.
                    </div>
                </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Bildirim Tercihleri
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        <PreferenceSwitch
                            title="Hoş Geldin Bildirimleri"
                            description="Yeni kullanıcılar için karşılama mesajları"
                            checked={preferences.welcome_notifications}
                            onChange={(checked) => savePreferences({ welcome_notifications: checked })}
                        />

                        <PreferenceSwitch
                            title="Şablon Önerileri"
                            description="Size uygun şablon önerileri alın"
                            checked={preferences.template_recommendations}
                            onChange={(checked) => savePreferences({ template_recommendations: checked })}
                        />

                        <PreferenceSwitch
                            title="Belge Hazır Bildirimleri"
                            description="Belgeleriniz hazır olduğunda bildirim alın"
                            checked={preferences.document_ready}
                            onChange={(checked) => savePreferences({ document_ready: checked })}
                        />

                        <PreferenceSwitch
                            title="Sistem Güncellemeleri"
                            description="Önemli sistem duyuruları ve güncellemeler"
                            checked={preferences.system_updates}
                            onChange={(checked) => savePreferences({ system_updates: checked })}
                        />

                        <PreferenceSwitch
                            title="Pazarlama Bildirimleri"
                            description="Kampanyalar ve özel teklifler hakkında bilgi"
                            checked={preferences.marketing_notifications}
                            onChange={(checked) => savePreferences({ marketing_notifications: checked })}
                        />

                        <div className="border-t pt-4 mt-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Düzenli Özetler
                            </h4>

                            <PreferenceSwitch
                                title="Günlük Özet"
                                description="Günlük aktivite özetinizi alın"
                                checked={preferences.daily_digest}
                                onChange={(checked) => savePreferences({ daily_digest: checked })}
                            />

                            <PreferenceSwitch
                                title="Haftalık Özet"
                                description="Haftalık kullanım raporunuzu alın"
                                checked={preferences.weekly_summary}
                                onChange={(checked) => savePreferences({ weekly_summary: checked })}
                            />
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Bildirim Kanalları
                            </h4>

                            <PreferenceSwitch
                                title="E-posta Bildirimleri"
                                description="E-posta ile bildirim almayı tercih edin"
                                checked={preferences.email_notifications}
                                onChange={(checked) => savePreferences({ email_notifications: checked })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card>
                <CardContent className="pt-6">
                    <div className="text-xs text-muted-foreground">
                        <div className="flex items-start gap-2">
                            <Shield className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="font-medium">Gizlilik Bildirimi:</span> Bildirim tercihleriniz güvenli bir şekilde saklanır.
                                Kişisel verileriniz üçüncü taraflarla paylaşılmaz. İstediğiniz zaman tüm bildirimleri kapatabilir
                                veya hesabınızı silebilirsiniz.
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};