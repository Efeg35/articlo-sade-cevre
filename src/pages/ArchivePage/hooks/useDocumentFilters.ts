import { useState, useMemo } from 'react';
import { Document, FilterState } from '../types';

export function useDocumentFilters(documents: Document[], getDocumentTitle: (doc: Document) => string) {
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

    // Belgeleri filtrele ve sırala
    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
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
    }, [documents, searchTerm, filters, getDocumentTitle]);

    // Aktif filtre sayısını hesapla
    const activeFilterCount = useMemo(() => {
        return [
            filters.dateRange.from || filters.dateRange.to,
            filters.hasSummary,
            filters.hasActionPlan,
            filters.sortBy !== "date-desc"
        ].filter(Boolean).length;
    }, [filters]);

    // Filtreleri sıfırla
    const resetFilters = () => {
        setFilters({
            dateRange: { from: undefined, to: undefined },
            hasSummary: false,
            hasActionPlan: false,
            sortBy: "date-desc"
        });
        setSearchTerm("");
    };

    // Belirli bir filtreyi kaldır
    const removeFilter = (filterType: keyof FilterState | 'dateFrom' | 'dateTo' | 'search') => {
        switch (filterType) {
            case 'dateFrom':
                setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, from: undefined }
                }));
                break;
            case 'dateTo':
                setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, to: undefined }
                }));
                break;
            case 'hasSummary':
                setFilters(prev => ({ ...prev, hasSummary: false }));
                break;
            case 'hasActionPlan':
                setFilters(prev => ({ ...prev, hasActionPlan: false }));
                break;
            case 'sortBy':
                setFilters(prev => ({ ...prev, sortBy: "date-desc" }));
                break;
            case 'search':
                setSearchTerm("");
                break;
        }
    };

    return {
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        filteredDocuments,
        activeFilterCount,
        resetFilters,
        removeFilter
    };
}