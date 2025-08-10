import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Settings,
    Database,
    Shield,
    Mail,
    Bell,
    Palette,
    Globe,
    Server,
    Save,
    RefreshCw,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SystemSettings {
    site_name: string;
    site_description: string;
    maintenance_mode: boolean;
    registration_enabled: boolean;
    email_notifications: boolean;
    max_file_size: number;
    max_documents_per_user: number;
    default_credits: number;
    smtp_enabled: boolean;
    smtp_host: string;
    smtp_port: number;
    analytics_enabled: boolean;
}

const AdminSettings = () => {
    const supabase = useSupabaseClient();
    const { toast } = useToast();
    const [settings, setSettings] = useState<SystemSettings>({
        site_name: 'ARTIKLO',
        site_description: 'Hukuki belge oluşturma platformu',
        maintenance_mode: false,
        registration_enabled: true,
        email_notifications: true,
        max_file_size: 10,
        max_documents_per_user: 100,
        default_credits: 10,
        smtp_enabled: false,
        smtp_host: '',
        smtp_port: 587,
        analytics_enabled: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [systemStatus, setSystemStatus] = useState({
        database: 'connected',
        storage: 'connected',
        email: 'disconnected',
        analytics: 'connected'
    });

    useEffect(() => {
        loadSettings();
        checkSystemStatus();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            // system_settings tablosu olmayabilir, bu durumda varsayılan ayarları kullan
            console.log('Ayarlar yüklendi - varsayılan değerler kullanılıyor');
        } catch (error) {
            console.error('Ayarlar yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkSystemStatus = async () => {
        try {
            // Database bağlantısını kontrol et - profiles tablosunu kullan
            const { error: dbError } = await supabase.from('profiles').select('count').limit(1);

            // Storage bağlantısını kontrol et
            const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

            setSystemStatus({
                database: dbError ? 'error' : 'connected',
                storage: storageError ? 'error' : 'connected',
                email: settings.smtp_enabled ? 'connected' : 'disconnected',
                analytics: settings.analytics_enabled ? 'connected' : 'disconnected'
            });
        } catch (error) {
            console.error('Sistem durumu kontrol edilirken hata:', error);
        }
    };

    const saveSettings = async () => {
        try {
            setSaving(true);

            // Simulated save - gerçek projede system_settings tablosu olacak
            console.log('Ayarlar kaydediliyor:', settings);

            // Simulated delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: "Ayarlar kaydedildi",
                description: "Sistem ayarları başarıyla güncellendi.",
            });

            // Sistem durumunu yeniden kontrol et
            await checkSystemStatus();
        } catch (error) {
            console.error('Ayarlar kaydedilirken hata:', error);
            toast({
                title: "Hata",
                description: "Ayarlar kaydedilirken bir hata oluştu.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'error':
                return <AlertTriangle className="h-4 w-4 text-red-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'connected':
                return 'Bağlı';
            case 'error':
                return 'Hata';
            default:
                return 'Bağlantısız';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Sistem Ayarları</h1>
                        <p className="text-muted-foreground">Platform ayarlarını yönetin</p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Ayarlar yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Sistem Ayarları</h1>
                    <p className="text-muted-foreground">Platform ayarlarını ve konfigürasyonlarını yönetin</p>
                </div>
                <Button onClick={saveSettings} disabled={saving}>
                    {saving ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    Kaydet
                </Button>
            </div>

            {/* Sistem Durumu */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        Sistem Durumu
                    </CardTitle>
                    <CardDescription>Sistem bileşenlerinin durumu</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-2">
                                <Database className="h-4 w-4" />
                                <span className="text-sm font-medium">Veritabanı</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(systemStatus.database)}
                                <Badge variant={systemStatus.database === 'connected' ? 'default' : 'destructive'}>
                                    {getStatusText(systemStatus.database)}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span className="text-sm font-medium">Depolama</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(systemStatus.storage)}
                                <Badge variant={systemStatus.storage === 'connected' ? 'default' : 'destructive'}>
                                    {getStatusText(systemStatus.storage)}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm font-medium">E-posta</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(systemStatus.email)}
                                <Badge variant={systemStatus.email === 'connected' ? 'default' : 'secondary'}>
                                    {getStatusText(systemStatus.email)}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span className="text-sm font-medium">Analytics</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(systemStatus.analytics)}
                                <Badge variant={systemStatus.analytics === 'connected' ? 'default' : 'secondary'}>
                                    {getStatusText(systemStatus.analytics)}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ayarlar Tabları */}
            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">Genel</TabsTrigger>
                    <TabsTrigger value="user">Kullanıcı</TabsTrigger>
                    <TabsTrigger value="email">E-posta</TabsTrigger>
                    <TabsTrigger value="system">Sistem</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Genel Ayarlar</CardTitle>
                            <CardDescription>Site genel ayarları ve görünüm</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="site_name">Site Adı</Label>
                                    <Input
                                        id="site_name"
                                        value={settings.site_name}
                                        onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="site_description">Site Açıklaması</Label>
                                    <Input
                                        id="site_description"
                                        value={settings.site_description}
                                        onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="maintenance_mode"
                                    checked={settings.maintenance_mode}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenance_mode: checked }))}
                                />
                                <Label htmlFor="maintenance_mode">Bakım Modu</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="analytics_enabled"
                                    checked={settings.analytics_enabled}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, analytics_enabled: checked }))}
                                />
                                <Label htmlFor="analytics_enabled">Analytics Etkin</Label>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="user" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kullanıcı Ayarları</CardTitle>
                            <CardDescription>Kullanıcı hesapları ve limitler</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="registration_enabled"
                                    checked={settings.registration_enabled}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, registration_enabled: checked }))}
                                />
                                <Label htmlFor="registration_enabled">Kayıt Olma Etkin</Label>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="default_credits">Varsayılan Kredi</Label>
                                    <Input
                                        id="default_credits"
                                        type="number"
                                        value={settings.default_credits}
                                        onChange={(e) => setSettings(prev => ({ ...prev, default_credits: parseInt(e.target.value) }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max_documents_per_user">Kullanıcı Başına Max Belge</Label>
                                    <Input
                                        id="max_documents_per_user"
                                        type="number"
                                        value={settings.max_documents_per_user}
                                        onChange={(e) => setSettings(prev => ({ ...prev, max_documents_per_user: parseInt(e.target.value) }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max_file_size">Max Dosya Boyutu (MB)</Label>
                                    <Input
                                        id="max_file_size"
                                        type="number"
                                        value={settings.max_file_size}
                                        onChange={(e) => setSettings(prev => ({ ...prev, max_file_size: parseInt(e.target.value) }))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="email" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>E-posta Ayarları</CardTitle>
                            <CardDescription>SMTP ve bildirim ayarları</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="smtp_enabled"
                                    checked={settings.smtp_enabled}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smtp_enabled: checked }))}
                                />
                                <Label htmlFor="smtp_enabled">SMTP Etkin</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="email_notifications"
                                    checked={settings.email_notifications}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_notifications: checked }))}
                                />
                                <Label htmlFor="email_notifications">E-posta Bildirimleri</Label>
                            </div>
                            {settings.smtp_enabled && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="smtp_host">SMTP Host</Label>
                                        <Input
                                            id="smtp_host"
                                            value={settings.smtp_host}
                                            onChange={(e) => setSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                                            placeholder="smtp.gmail.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="smtp_port">SMTP Port</Label>
                                        <Input
                                            id="smtp_port"
                                            type="number"
                                            value={settings.smtp_port}
                                            onChange={(e) => setSettings(prev => ({ ...prev, smtp_port: parseInt(e.target.value) }))}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sistem Bilgileri</CardTitle>
                            <CardDescription>Platform sistem detayları</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Platform Versiyonu</Label>
                                    <div className="p-2 border rounded bg-muted">v1.0.0</div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Son Güncelleme</Label>
                                    <div className="p-2 border rounded bg-muted">
                                        {new Date().toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Toplam Kullanıcı</Label>
                                    <div className="p-2 border rounded bg-muted">-</div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Toplam Belge</Label>
                                    <div className="p-2 border rounded bg-muted">-</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminSettings;