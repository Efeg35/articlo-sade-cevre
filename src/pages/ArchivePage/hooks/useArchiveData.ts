import { useState, useEffect, useMemo } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/hooks/use-toast";
import { Document, ArchiveStats, Entity } from '../types';

export function useArchiveData() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const user = session?.user;
    const { toast } = useToast();

    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    // Stats'ları memoize edelim
    const stats: ArchiveStats = useMemo(() => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthDocs = documents.filter(doc =>
            new Date(doc.created_at) >= firstDayOfMonth
        ).length;

        // Her belge için ortalama 30 dakika okuma süresi tasarrufu
        const totalTimeSaved = documents.length * 30;

        return {
            thisMonth: thisMonthDocs,
            timeSaved: totalTimeSaved,
            creditsUsed: documents.length,
            totalDocs: documents.length
        };
    }, [documents]);

    // Mantıklı başlık üretici
    const getDocumentTitle = (doc: Document): string => {
        const generateTitle = (text: string | null | undefined, maxLength = 50): string | null => {
            if (!text || !text.trim()) return null;
            const firstLine = text.split('\n')[0];
            if (firstLine.length <= maxLength) return firstLine;
            // Cümle sonu veya boşluktan kes
            let shortTitle = firstLine.slice(0, maxLength);
            const lastSpace = shortTitle.lastIndexOf(' ');
            if (lastSpace > 0) {
                shortTitle = shortTitle.slice(0, lastSpace);
            }
            return shortTitle + '...';
        };

        let title = generateTitle(doc.summary);
        if (!title) {
            title = generateTitle(doc.simplified_text);
        }
        if (!title && doc.original_text && doc.original_text.startsWith("[Files:")) {
            const match = doc.original_text.match(/\[Files: (.*?)\]/);
            if (match && match[1]) {
                title = match[1].replace(/\.(docx?|pdf|txt|jpg|jpeg|png)$/i, ''); // Dosya uzantısını kaldır
            }
        }
        return title || "Başlıksız Belge";
    };

    // Belge silme fonksiyonu
    const deleteDocument = async (id: string): Promise<boolean> => {
        try {
            const { error } = await supabase.from("documents").delete().eq("id", id);

            if (error) {
                toast({
                    title: "Silme Hatası",
                    description: error.message,
                    variant: "destructive"
                });
                return false;
            } else {
                setDocuments((docs) => docs.filter((d) => d.id !== id));
                toast({
                    title: "Belge Silindi",
                    description: "Belge başarıyla silindi."
                });
                return true;
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast({
                title: "Silme Hatası",
                description: "Beklenmedik bir hata oluştu.",
                variant: "destructive"
            });
            return false;
        }
    };

    // Belgeleri yükleme
    useEffect(() => {
        const fetchDocuments = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching documents for user:', user.id);

                const { data, error } = await supabase
                    .from("documents")
                    .select("id, user_id, original_text, simplified_text, created_at, summary, action_plan, entities, drafted_document")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                console.log('Documents fetch result:', { data, error, count: data?.length });

                if (!error && Array.isArray(data)) {
                    // entities alanını güvenli şekilde Entity[]'ye dönüştür
                    const parsedDocs = data.map((doc) => ({
                        ...doc,
                        entities: Array.isArray(doc.entities) ? (doc.entities as unknown as Entity[]) : [],
                    }));
                    setDocuments(parsedDocs);
                } else if (error) {
                    console.error('Error fetching documents:', error);
                    toast({
                        title: "Hata",
                        description: "Belgeler yüklenirken bir hata oluştu.",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error('Fetch error:', error);
                toast({
                    title: "Hata",
                    description: "Belgeler yüklenirken beklenmedik bir hata oluştu.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [user, supabase, toast]);

    return {
        documents,
        loading,
        stats,
        getDocumentTitle,
        deleteDocument
    };
}