import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Mail, Calendar, FileText, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { User } from '@supabase/supabase-js';

interface UserStats {
    total_documents: number;
    credits_used: number;
    last_activity: string | null;
}

const AdminUsers = () => {
    const supabase = useSupabaseClient();
    const [users, setUsers] = useState<User[]>([]);
    const [userStats, setUserStats] = useState<Record<string, UserStats>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Kullanıcıları filtrele
        if (!searchTerm) {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(
                (user) =>
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (user.user_metadata?.full_name || '')
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [users, searchTerm]);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            // Supabase Admin API kullanarak kullanıcıları getir
            const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

            if (authError) {
                console.error('Kullanıcılar getirilirken hata:', authError);
                return;
            }

            setUsers(authUsers.users || []);

            // Her kullanıcı için istatistikleri getir
            if (authUsers.users) {
                const statsPromises = authUsers.users.map(async (user) => {
                    const stats = await fetchUserStats(user.id);
                    return { userId: user.id, stats };
                });

                const allStats = await Promise.all(statsPromises);
                const statsMap = allStats.reduce((acc, { userId, stats }) => {
                    acc[userId] = stats;
                    return acc;
                }, {} as Record<string, UserStats>);

                setUserStats(statsMap);
            }
        } catch (error) {
            console.error('Kullanıcılar alınırken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async (userId: string): Promise<UserStats> => {
        try {
            // Kullanıcının belgelerini say
            const { count: documentCount } = await supabase
                .from('documents')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            // Kullanıcının kredi kullanımını getir
            const { data: creditData } = await supabase
                .from('user_credits')
                .select('credits_used')
                .eq('user_id', userId)
                .single();

            // Son aktiviteyi getir (son belge oluşturma tarihi)
            const { data: lastActivity } = await supabase
                .from('documents')
                .select('created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            return {
                total_documents: documentCount || 0,
                credits_used: creditData?.credits_used || 0,
                last_activity: lastActivity?.created_at || null,
            };
        } catch (error) {
            console.error(`Kullanıcı ${userId} istatistikleri alınırken hata:`, error);
            return {
                total_documents: 0,
                credits_used: 0,
                last_activity: null,
            };
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Hiç';
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getUserStatus = (user: User) => {
        if (!user.email_confirmed_at) return 'pending';
        if (user.last_sign_in_at) return 'active';
        return 'inactive';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default" className="bg-green-100 text-green-800">Aktif</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Pasif</Badge>;
            case 'pending':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Beklemede</Badge>;
            default:
                return <Badge variant="secondary">Bilinmeyen</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
                        <p className="text-muted-foreground">Sistemdeki tüm kullanıcıları yönetin</p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Kullanıcılar yükleniyor...</p>
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
                    <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
                    <p className="text-muted-foreground">Sistemdeki tüm kullanıcıları yönetin</p>
                </div>
                <Button onClick={fetchUsers} disabled={loading}>
                    <Users className="h-4 w-4 mr-2" />
                    Yenile
                </Button>
            </div>

            {/* İstatistikler */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aktif Kullanıcı</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(user => getUserStatus(user) === 'active').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Onay Bekleyen</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(user => getUserStatus(user) === 'pending').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Belge</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Object.values(userStats).reduce((total, stats) => total + stats.total_documents, 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Arama */}
            <Card>
                <CardHeader>
                    <CardTitle>Kullanıcı Listesi</CardTitle>
                    <CardDescription>
                        Tüm kullanıcıları görüntüleyin ve yönetin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Kullanıcı ara (email veya ad)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kullanıcı</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead>Kayıt Tarihi</TableHead>
                                    <TableHead>Son Giriş</TableHead>
                                    <TableHead>Belgeler</TableHead>
                                    <TableHead>Kullanılan Kredi</TableHead>
                                    <TableHead>Son Aktivite</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => {
                                    const stats = userStats[user.id] || { total_documents: 0, credits_used: 0, last_activity: null };
                                    const status = getUserStatus(user);

                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {user.user_metadata?.full_name || 'İsimsiz Kullanıcı'}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(status)}</TableCell>
                                            <TableCell>{formatDate(user.created_at)}</TableCell>
                                            <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{stats.total_documents}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{stats.credits_used}</Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(stats.last_activity)}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Mail className="h-4 w-4 mr-2" />
                                                            E-posta Gönder
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            Belgeleri Görüntüle
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filteredUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8">
                                            <div className="text-muted-foreground">
                                                {searchTerm ? 'Arama kriterlerine uygun kullanıcı bulunamadı.' : 'Henüz kullanıcı bulunamadı.'}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUsers;