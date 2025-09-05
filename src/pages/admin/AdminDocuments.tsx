import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Download, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Document {
    id: string;
    created_at: string;
    original_text: string;
    result_text: string;
    user_id: string;
    profiles: {
        email: string;
        full_name?: string;
    }[] | null;
}

interface DocumentStats {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
}

const AdminDocuments = () => {
    const supabase = useSupabaseClient();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [stats, setStats] = useState<DocumentStats>({
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);

    useEffect(() => {
        fetchDocuments();
        fetchStats();
    }, [fetchDocuments, fetchStats]);

    useEffect(() => {
        // Belgeleri filtrele
        if (!searchTerm) {
            setFilteredDocuments(documents);
        } else {
            const filtered = documents.filter(
                (doc) =>
                    doc.original_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    doc.profiles?.[0]?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (doc.profiles?.[0]?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDocuments(filtered);
        }
    }, [documents, searchTerm]);

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('documents')
                .select(`
                    id,
                    created_at,
                    original_text,
                    result_text,
                    user_id,
                    profiles:user_id (
                        email,
                        full_name
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) {
                console.error('Belgeler getirilirken hata:', error);
                return;
            }

            setDocuments(data || []);
        } catch (error) {
            console.error('Belgeler alınırken hata:', error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    const fetchStats = useCallback(async () => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);

            // Toplam belgeler
            const { count: totalCount } = await supabase
                .from('documents')
                .select('*', { count: 'exact', head: true });

            // Bugünkü belgeler
            const { count: todayCount } = await supabase
                .from('documents')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today.toISOString());

            // Bu haftaki belgeler
            const { count: weekCount } = await supabase
                .from('documents')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', weekAgo.toISOString());

            // Bu ayki belgeler
            const { count: monthCount } = await supabase
                .from('documents')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', monthAgo.toISOString());

            setStats({
                total: totalCount || 0,
                today: todayCount || 0,
                thisWeek: weekCount || 0,
                thisMonth: monthCount || 0
            });
        } catch (error) {
            console.error('İstatistikler alınırken hata:', error);
        }
    }, [supabase]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleDeleteDocument = async (documentId: string) => {
        if (!confirm('Bu belgeyi silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', documentId);

            if (error) {
                console.error('Belge silinirken hata:', error);
                alert('Belge silinirken bir hata oluştu.');
                return;
            }

            // Belgeleri yeniden yükle
            await fetchDocuments();
            await fetchStats();
            alert('Belge başarıyla silindi.');
        } catch (error) {
            console.error('Belge silme hatası:', error);
            alert('Belge silinirken bir hata oluştu.');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Belge Yönetimi</h1>
                        <p className="text-muted-foreground">Sistemdeki tüm belgeleri yönetin</p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Belgeler yükleniyor...</p>
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
                    <h1 className="text-3xl font-bold">Belge Yönetimi</h1>
                    <p className="text-muted-foreground">Sistemdeki tüm belgeleri görüntüleyin ve yönetin</p>
                </div>
                <Button onClick={fetchDocuments} disabled={loading}>
                    <FileText className="h-4 w-4 mr-2" />
                    Yenile
                </Button>
            </div>

            {/* İstatistikler */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Belge</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bugün</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.today}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bu Hafta</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.thisWeek}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.thisMonth}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Belge Listesi */}
            <Card>
                <CardHeader>
                    <CardTitle>Belge Listesi</CardTitle>
                    <CardDescription>
                        Tüm belgeleri görüntüleyin ve yönetin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Belge ara (içerik, kullanıcı email veya ad)..."
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
                                    <TableHead>Orijinal Metin</TableHead>
                                    <TableHead>Sonuç Metni</TableHead>
                                    <TableHead>Oluşturma Tarihi</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDocuments.map((document) => (
                                    <TableRow key={document.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {document.profiles?.[0]?.full_name || 'İsimsiz Kullanıcı'}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {document.profiles?.[0]?.email || 'Email yok'}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs">
                                                <p className="text-sm">{truncateText(document.original_text)}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs">
                                                <p className="text-sm">{truncateText(document.result_text || 'Sonuç yok')}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(document.created_at)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Detay Görüntüle
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Download className="h-4 w-4 mr-2" />
                                                        İndir
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDeleteDocument(document.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Sil
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredDocuments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="text-muted-foreground">
                                                {searchTerm ? 'Arama kriterlerine uygun belge bulunamadı.' : 'Henüz belge bulunamadı.'}
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

export default AdminDocuments;