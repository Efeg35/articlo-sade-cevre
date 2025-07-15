import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle, DialogFooter as ConfirmDialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Entity {
  tip: string;
  değer: string;
  rol?: string;
  açıklama?: string;
}

interface Document {
  id: string;
  user_id: string;
  original_text: string;
  simplified_text: string;
  created_at: string;
  summary?: string | null;
  action_plan?: string | null;
  entities?: Entity[] | null;
}

const ArchivePage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mantıklı başlık üretici
  function getDocumentTitle(doc: Document): string {
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
  }

  async function handleDelete(id: string) {
    setIsDeleting(true);
    const { error } = await supabase.from("documents").delete().eq("id", id);
    setIsDeleting(false);
    setDeleteId(null);
    if (error) {
      toast({ title: "Silme Hatası", description: error.message, variant: "destructive" });
    } else {
      setDocuments((docs) => docs.filter((d) => d.id !== id));
      toast({ title: "Belge Silindi", description: "Belge başarıyla silindi." });
    }
  }

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(data)) {
        // entities alanını güvenli şekilde Entity[]'ye dönüştür
        const parsedDocs = data.map((doc) => ({
          ...doc,
          entities: Array.isArray(doc.entities) ? (doc.entities as unknown as Entity[]) : [],
        }));
        setDocuments(parsedDocs);
      }
      setLoading(false);
    };
    fetchDocuments();
  }, []);

  return (
    <main className="container mx-auto px-4 pt-24 pb-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Belge Arşivim
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Sadeleştirdiğiniz tüm dokümanlar burada. Kolayca erişin, görüntüleyin ve yönetin.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">Henüz sadeleştirilmiş bir belgeniz bulunmuyor.</div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="relative cursor-pointer group"
                onClick={(e) => {
                  // Silme ikonuna tıklanırsa modal aç, kartı açma
                  if ((e.target as HTMLElement).closest('.delete-btn')) return;
                  setSelectedDocument(doc);
                  setIsModalOpen(true);
                }}
              >
                {/* Çöp kutusu ikonu */}
                <button
                  className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition delete-btn bg-background rounded-full p-1 shadow hover:bg-destructive/10"
                  title="Belgeyi Sil"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(doc.id);
                  }}
                >
                  <Trash2 className="w-5 h-5 text-destructive" />
                </button>
                <Card className="border shadow-sm hover:ring-2 hover:ring-primary/40 transition">
                  <CardContent className="py-6">
                    <div className="text-base text-foreground mb-2 font-semibold">
                      {getDocumentTitle(doc)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {doc.created_at && new Date(doc.created_at).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for document details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full flex flex-col h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Belge Detayları</DialogTitle>
            {selectedDocument?.created_at && (
              <DialogDescription>
                Oluşturulma Tarihi: {new Date(selectedDocument.created_at).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedDocument && (
            <div className="overflow-y-auto flex-1 pr-6 -mr-6 mt-4 space-y-8">
              {/* Belge Özeti */}
              {selectedDocument.summary && (
                <section>
                  <h3 className="text-lg font-semibold flex items-center gap-3 mb-3 text-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2">
                    <span className="text-xl">🧠</span> Belge Özeti
                  </h3>
                  <div className="p-4 bg-muted/50 rounded-md text-base whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: selectedDocument.summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </section>
              )}
              {/* Anlaşılır Versiyon */}
              <section>
                <h3 className="text-lg font-semibold flex items-center gap-3 mb-3 text-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2">
                  <span className="text-xl">→</span> Anlaşılır Versiyon
                </h3>
                <div className="p-4 bg-muted/50 rounded-md text-base whitespace-pre-wrap">
                  {selectedDocument.simplified_text}
                </div>
              </section>
              {/* Eylem Planı */}
              {selectedDocument.action_plan && selectedDocument.action_plan.trim() && (
                <section>
                  <h3 className="text-lg font-semibold flex items-center gap-3 mb-3 text-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2">
                    <span className="text-xl">✔️</span> Eylem Planı
                  </h3>
                  <div className="p-4 bg-muted/50 rounded-md text-base whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: selectedDocument.action_plan.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </section>
              )}
              {/* Kilit Varlıklar */}
              {selectedDocument.entities && Array.isArray(selectedDocument.entities) && selectedDocument.entities.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold flex items-center gap-3 mb-3 text-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2">
                    <span className="text-xl">🔑</span> Kilit Varlıklar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {selectedDocument.entities.map((entity: Entity, idx: number) => (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg text-sm">
                        <span className="font-semibold text-foreground block mb-1">{entity.tip}</span>
                        <span>{entity.değer}</span>
                        {entity.rol && <span className="text-xs text-muted-foreground ml-2">({entity.rol})</span>}
                        {entity.açıklama && <p className="text-xs text-muted-foreground mt-1">{entity.açıklama}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Silme onay modalı */}
      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>Belgeyi Silmek İstiyor musunuz?</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <p>Bu işlem geri alınamaz. Seçili belge kalıcı olarak silinecek.</p>
          <ConfirmDialogFooter>
            <button
              className="px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Vazgeç
            </button>
            <button
              className="px-4 py-2 rounded bg-destructive text-white hover:bg-destructive/80"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
            >
              {isDeleting ? "Siliniyor..." : "Evet, Sil"}
            </button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </main>
  );
};

export default ArchivePage; 