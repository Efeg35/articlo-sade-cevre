import { useEffect, useState } from "react";
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Trash2, FileText, Clock, Sparkles, Zap, Search, SlidersHorizontal, CalendarRange, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle, DialogFooter as ConfirmDialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/useCredits";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Capacitor } from "@capacitor/core";

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

interface FilterState {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  hasSummary: boolean;
  hasActionPlan: boolean;
  sortBy: "date-desc" | "date-asc";
}

const ArchivePage = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = session?.user;

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      from: undefined,
      to: undefined
    },
    hasSummary: false,
    hasActionPlan: false,
    sortBy: "date-desc"
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { credits } = useCredits();

  // İstatistikler
  const [stats, setStats] = useState({
    thisMonth: 0,
    timeSaved: 0,
    creditsUsed: 0,
    totalDocs: 0
  });

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

  // Skeleton component for loading state
  const DocumentSkeleton = () => (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );

  // Stats Skeleton
  const StatsSkeleton = () => (
    <Card className="group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );

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
      if (!user) {
        setLoading(false);
        return;
      }

      console.log('Fetching documents for user:', user.id);

      const { data, error } = await supabase
        .from("documents")
        .select("*")
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

        // İstatistikleri hesapla
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthDocs = parsedDocs.filter(doc =>
          new Date(doc.created_at) >= firstDayOfMonth
        ).length;

        // Her belge için ortalama 30 dakika okuma süresi tasarrufu varsayalım
        const totalTimeSaved = parsedDocs.length * 30;

        setStats({
          thisMonth: thisMonthDocs,
          timeSaved: totalTimeSaved,
          creditsUsed: parsedDocs.length,
          totalDocs: parsedDocs.length
        });
      } else if (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Hata",
          description: "Belgeler yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
      setLoading(false);
    };
    fetchDocuments();
  }, [user, supabase, toast]);

  // Belgeleri filtrele
  const filteredDocuments = documents.filter(doc => {
    const title = getDocumentTitle(doc).toLowerCase();
    const summary = (doc.summary || "").toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = title.includes(searchLower) || summary.includes(searchLower);

    // Tarih filtresi
    const docDate = new Date(doc.created_at);
    const matchesDateRange = (!filters.dateRange.from || docDate >= filters.dateRange.from) &&
      (!filters.dateRange.to || docDate <= filters.dateRange.to);

    // Özellik filtreleri
    const matchesSummary = !filters.hasSummary || !!doc.summary;
    const matchesActionPlan = !filters.hasActionPlan || !!doc.action_plan;

    return matchesSearch && matchesDateRange && matchesSummary && matchesActionPlan;
  }).sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return filters.sortBy === "date-desc" ? dateB - dateA : dateA - dateB;
  });

  // Aktif filtre sayısını hesapla
  const activeFilterCount = [
    filters.dateRange.from || filters.dateRange.to,
    filters.hasSummary,
    filters.hasActionPlan,
    filters.sortBy !== "date-desc"
  ].filter(Boolean).length;

  return (
    <div className={`min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24 ${Capacitor.isNativePlatform() ? 'mobile-scroll-fix ios-scroll-container overflow-auto' : ''}`}>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Belge Arşivim
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sadeleştirdiğiniz tüm dokümanlar burada. Kolayca erişin, görüntüleyin ve yönetin.
          </p>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            <>
              <StatsSkeleton />
              <StatsSkeleton />
              <StatsSkeleton />
              <StatsSkeleton />
            </>
          ) : (
            <>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-primary transition-colors">
                  <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold group-hover:text-primary transition-colors">{stats.thisMonth}</div>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-muted-foreground">
                      Sadeleştirilen Belge
                    </p>
                    {stats.thisMonth > 0 && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Aktif
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-primary transition-colors">
                  <CardTitle className="text-sm font-medium">Tasarruf Edilen Süre</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold group-hover:text-primary transition-colors">{stats.timeSaved} dk</div>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-muted-foreground">
                      Yaklaşık {Math.round(stats.timeSaved / 60)} saat
                    </p>
                    {stats.timeSaved > 60 && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {Math.round(stats.timeSaved / 60)}+ saat
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-primary transition-colors">
                  <CardTitle className="text-sm font-medium">Kullanılan Kredi</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold group-hover:text-primary transition-colors">{stats.creditsUsed}</div>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-muted-foreground">
                      Kalan: {credits} kredi
                    </p>
                    {credits > 0 && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {credits} kredi kaldı
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-primary transition-colors">
                  <CardTitle className="text-sm font-medium">Toplam Belge</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold group-hover:text-primary transition-colors">{stats.totalDocs}</div>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-muted-foreground">
                      Tüm zamanlar
                    </p>
                    {stats.totalDocs > 10 && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        10+ belge
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Arama ve Filtreler */}
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Belgelerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtrele
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-6 w-6 p-0 flex items-center justify-center">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Tarih Aralığı</h4>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className={`text-left font-normal justify-start ${!filters.dateRange.from && "text-muted-foreground"}`}
                          onClick={() => setIsFilterOpen(true)}
                        >
                          <CalendarRange className="mr-2 h-4 w-4" />
                          {filters.dateRange.from ? (
                            format(filters.dateRange.from, "d MMMM yyyy", { locale: tr })
                          ) : (
                            "Başlangıç tarihi"
                          )}
                        </Button>
                      </div>
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) => setFilters(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, from: date }
                        }))}
                        className="rounded-md border"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className={`text-left font-normal justify-start ${!filters.dateRange.to && "text-muted-foreground"}`}
                          onClick={() => setIsFilterOpen(true)}
                        >
                          <CalendarRange className="mr-2 h-4 w-4" />
                          {filters.dateRange.to ? (
                            format(filters.dateRange.to, "d MMMM yyyy", { locale: tr })
                          ) : (
                            "Bitiş tarihi"
                          )}
                        </Button>
                      </div>
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) => setFilters(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, to: date }
                        }))}
                        className="rounded-md border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Özellikler</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasSummary"
                          checked={filters.hasSummary}
                          onCheckedChange={(checked) =>
                            setFilters(prev => ({ ...prev, hasSummary: checked as boolean }))
                          }
                        />
                        <label
                          htmlFor="hasSummary"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Özeti olanlar
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasActionPlan"
                          checked={filters.hasActionPlan}
                          onCheckedChange={(checked) =>
                            setFilters(prev => ({ ...prev, hasActionPlan: checked as boolean }))
                          }
                        />
                        <label
                          htmlFor="hasActionPlan"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Eylem planı olanlar
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Sıralama</h4>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value: "date-desc" | "date-asc") =>
                        setFilters(prev => ({ ...prev, sortBy: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date-desc">En yeni</SelectItem>
                        <SelectItem value="date-asc">En eski</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilters({
                          dateRange: { from: undefined, to: undefined },
                          hasSummary: false,
                          hasActionPlan: false,
                          sortBy: "date-desc"
                        });
                        setIsFilterOpen(false);
                      }}
                    >
                      Sıfırla
                    </Button>
                    <Button onClick={() => setIsFilterOpen(false)}>
                      Uygula
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Select
              value={filters.sortBy}
              onValueChange={(value: "date-desc" | "date-asc") =>
                setFilters(prev => ({ ...prev, sortBy: value }))
              }
            >
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">En yeni</SelectItem>
                <SelectItem value="date-asc">En eski</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Aktif Filtreler */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.dateRange.from && (
                <Badge variant="secondary" className="h-6">
                  {format(filters.dateRange.from, "d MMM yyyy", { locale: tr })} sonrası
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, from: undefined }
                    }))}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.dateRange.to && (
                <Badge variant="secondary" className="h-6">
                  {format(filters.dateRange.to, "d MMM yyyy", { locale: tr })} öncesi
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, to: undefined }
                    }))}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.hasSummary && (
                <Badge variant="secondary" className="h-6">
                  Özeti olanlar
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => setFilters(prev => ({ ...prev, hasSummary: false }))}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.hasActionPlan && (
                <Badge variant="secondary" className="h-6">
                  Eylem planı olanlar
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => setFilters(prev => ({ ...prev, hasActionPlan: false }))}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.sortBy !== "date-desc" && (
                <Badge variant="secondary" className="h-6">
                  En eski
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => setFilters(prev => ({ ...prev, sortBy: "date-desc" }))}
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({
                  dateRange: { from: undefined, to: undefined },
                  hasSummary: false,
                  hasActionPlan: false,
                  sortBy: "date-desc"
                })}
              >
                Tümünü Temizle
              </Button>
            </div>
          )}

          {loading ? (
            <div className="grid gap-4">
              <DocumentSkeleton />
              <DocumentSkeleton />
              <DocumentSkeleton />
              <DocumentSkeleton />
              <DocumentSkeleton />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground">
                  {searchTerm ? "Arama kriterlerine uygun belge bulunamadı." : "Henüz sadeleştirilmiş bir belgeniz bulunmuyor."}
                </div>
                {searchTerm && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchTerm("")}
                  >
                    Tüm Belgeleri Göster
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="relative cursor-pointer group"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('.delete-btn')) return;
                    setSelectedDocument(doc);
                    setIsModalOpen(true);
                  }}
                >
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
                  <Card className="border shadow-sm hover:shadow-md hover:border-primary/40 transition duration-300">
                    <CardContent className="p-6">
                      <div className="text-base text-foreground mb-2 font-semibold">
                        {getDocumentTitle(doc)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {doc.created_at && new Date(doc.created_at).toLocaleDateString("tr-TR", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

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
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Vazgeç
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
            >
              {isDeleting ? "Siliniyor..." : "Evet, Sil"}
            </Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </div>
  );
};

export default ArchivePage; 