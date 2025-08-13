import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Sparkles } from 'lucide-react';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { TemplateForm } from '@/components/templates/TemplateForm';
import { DocumentViewer } from '@/components/templates/DocumentViewer';
import { AdvancedSearchBar } from '@/components/search/AdvancedSearchBar';
import { DocumentTemplate, TemplateCategory, GeneratedDocument } from '@/types/templates';
import { allDocumentTemplates } from '@/data/templates';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
    mahkeme: 'Mahkeme',
    icra: 'İcra ve İflas',
    is_hukuku: 'İş Hukuku',
    kira: 'Kira ve Gayrimenkul',
    aile_hukuku: 'Aile Hukuku',
    borçlar_hukuku: 'Borçlar Hukuku',
    ceza_hukuku: 'Ceza Hukuku',
    idare_hukuku: 'İdare Hukuku',
    ticaret_hukuku: 'Ticaret Hukuku'
};

export const TemplatesPage: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const { toast } = useToast();

    // Advanced search hook
    const {
        query,
        setQuery,
        filters,
        setFilters,
        options,
        setOptions,
        results,
        totalResults,
        isSearching,
        searchHistory,
        addToHistory,
        clearHistory,
        suggestions,
        search,
        clearSearch,
        resetFilters
    } = useAdvancedSearch({
        items: allDocumentTemplates,
        defaultOptions: {
            fuzzy: true,
            caseSensitive: false,
            wholeWord: false,
            limit: 50,
            offset: 0,
            sortBy: 'relevance',
            sortOrder: 'desc',
            highlightMatches: true
        }
    });

    // Get templates from search results or show all if no query
    const displayTemplates = query.trim()
        ? results.map(result => allDocumentTemplates.find(t => t.id === result.item.id)).filter(Boolean) as DocumentTemplate[]
        : allDocumentTemplates;

    const handleTemplateSelect = (template: DocumentTemplate) => {
        setSelectedTemplate(template);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedTemplate(null);
    };

    const handleDocumentGenerate = (document: GeneratedDocument) => {
        setGeneratedDocument(document);
        setIsViewerOpen(true);

        // Optionally save to local storage for persistence
        try {
            const savedDocuments = JSON.parse(localStorage.getItem('artiklo_generated_documents') || '[]');
            savedDocuments.unshift({
                ...document,
                id: Date.now().toString(),
                generatedAt: document.generatedAt.toISOString()
            });

            // Keep only last 50 documents
            if (savedDocuments.length > 50) {
                savedDocuments.splice(50);
            }

            localStorage.setItem('artiklo_generated_documents', JSON.stringify(savedDocuments));
        } catch (error) {
            console.error('Error saving document:', error);
        }
    };

    const handleViewerClose = () => {
        setIsViewerOpen(false);
        setGeneratedDocument(null);
    };

    const clearFilters = () => {
        clearSearch();
        resetFilters();
    };

    return (
        <div className={`min-h-screen bg-gray-50 pt-16 ${Capacitor.isNativePlatform() ? 'mobile-scroll-fix ios-scroll-container overflow-auto' : ''}`}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FileText className="h-8 w-8 text-blue-600" />
                                Belge Şablonları
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Hukuki belgelerinizi hızlıca oluşturun. Hazır şablonlarımızı kullanarak dakikalar içinde profesyonel belgeler hazırlayın.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm text-gray-600">
                                {allDocumentTemplates.length} şablon mevcut
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Search */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <AdvancedSearchBar
                        query={query}
                        onQueryChange={setQuery}
                        filters={filters}
                        onFiltersChange={setFilters}
                        options={options}
                        onOptionsChange={setOptions}
                        suggestions={suggestions}
                        searchHistory={searchHistory}
                        onSearch={search}
                        onClearHistory={clearHistory}
                        totalResults={totalResults}
                        isSearching={isSearching}
                        placeholder="Şablon ara (başlık, açıklama, etiket, kategori)..."
                    />
                </div>
            </div>

            {/* Templates Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {displayTemplates.length > 0 ? (
                    <>
                        <div className="mb-6">
                            <p className="text-gray-600">
                                {query.trim() ? (
                                    <>
                                        <span className="font-medium">{totalResults}</span> şablon bulundu
                                        {query && ` "${query}" araması için`}
                                        {isSearching && <span className="ml-1">...</span>}
                                    </>
                                ) : (
                                    <>
                                        <span className="font-medium">{allDocumentTemplates.length}</span> şablon mevcut
                                    </>
                                )}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayTemplates.map(template => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    onSelect={handleTemplateSelect}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {query.trim() ? 'Şablon bulunamadı' : 'Şablon yok'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {query.trim()
                                ? 'Arama kriterlerinize uygun şablon bulunamadı.'
                                : 'Henüz hiç şablon eklenmemiş.'
                            }
                        </p>
                        {query.trim() && (
                            <Button onClick={clearFilters} variant="outline">
                                Filtreleri Temizle
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Template Form Modal */}
            <TemplateForm
                template={selectedTemplate}
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onGenerate={handleDocumentGenerate}
            />

            {/* Document Viewer Modal */}
            <DocumentViewer
                document={generatedDocument}
                isOpen={isViewerOpen}
                onClose={handleViewerClose}
            />
        </div>
    );
};