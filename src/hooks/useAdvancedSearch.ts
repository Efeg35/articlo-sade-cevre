import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    searchItems,
    SearchableItem,
    SearchFilter,
    SearchOptions,
    SearchResult,
    SearchHistory,
    templateToSearchableItem
} from '@/lib/search';
import { DocumentTemplate } from '@/types/templates';
import { useDebounce } from './useDebounce';

export interface UseAdvancedSearchProps {
    items: DocumentTemplate[];
    initialQuery?: string;
    defaultFilters?: SearchFilter;
    defaultOptions?: SearchOptions;
}

export interface UseAdvancedSearchReturn {
    // Search state
    query: string;
    setQuery: (query: string) => void;
    filters: SearchFilter;
    setFilters: (filters: SearchFilter) => void;
    options: SearchOptions;
    setOptions: (options: SearchOptions) => void;

    // Results
    results: SearchResult[];
    totalResults: number;
    isSearching: boolean;

    // Search history
    searchHistory: string[];
    addToHistory: (query: string) => void;
    clearHistory: () => void;

    // Suggestions
    suggestions: string[];

    // Actions
    search: (newQuery?: string) => void;
    clearSearch: () => void;
    resetFilters: () => void;
}

export const useAdvancedSearch = ({
    items,
    initialQuery = '',
    defaultFilters = {},
    defaultOptions = {}
}: UseAdvancedSearchProps): UseAdvancedSearchReturn => {

    const [query, setQuery] = useState(initialQuery);
    const [filters, setFilters] = useState<SearchFilter>(defaultFilters);
    const [options, setOptions] = useState<SearchOptions>({
        fuzzy: true,
        caseSensitive: false,
        wholeWord: false,
        limit: 50,
        offset: 0,
        sortBy: 'relevance',
        sortOrder: 'desc',
        highlightMatches: true,
        ...defaultOptions
    });

    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Debounced query for performance
    const debouncedQuery = useDebounce(query, 300);

    // Convert templates to searchable items
    const searchableItems = useMemo(() => {
        return items.map(templateToSearchableItem);
    }, [items]);

    // Load search history on mount
    useEffect(() => {
        setSearchHistory(SearchHistory.getHistory());
    }, []);

    // Perform search
    const performSearch = useCallback((searchQuery: string, searchFilters: SearchFilter, searchOptions: SearchOptions) => {
        setIsSearching(true);

        try {
            const results = searchItems(searchableItems, searchQuery, searchFilters, searchOptions);
            return results;
        } catch (error) {
            console.error('Search error:', error);
            return [];
        } finally {
            setIsSearching(false);
        }
    }, [searchableItems]);

    // Search results
    const results = useMemo(() => {
        return performSearch(debouncedQuery, filters, options);
    }, [debouncedQuery, filters, options, performSearch]);

    // Generate suggestions based on current query
    const suggestions = useMemo(() => {
        if (!query || query.length < 2) return [];

        const suggestions = new Set<string>();
        const queryLower = query.toLowerCase();

        // Add from search history
        searchHistory
            .filter(item => item.toLowerCase().includes(queryLower))
            .slice(0, 3)
            .forEach(item => suggestions.add(item));

        // Add from template titles
        items
            .filter(item => item.title.toLowerCase().includes(queryLower))
            .map(item => item.title)
            .slice(0, 3)
            .forEach(title => suggestions.add(title));

        // Add from template tags
        items
            .flatMap(item => item.tags)
            .filter(tag => tag.toLowerCase().includes(queryLower))
            .slice(0, 3)
            .forEach(tag => suggestions.add(tag));

        return Array.from(suggestions).slice(0, 5);
    }, [query, searchHistory, items]);

    // Actions
    const addToHistory = useCallback((searchQuery: string) => {
        SearchHistory.addToHistory(searchQuery);
        setSearchHistory(SearchHistory.getHistory());
    }, []);

    const clearHistory = useCallback(() => {
        SearchHistory.clearHistory();
        setSearchHistory([]);
    }, []);

    const search = useCallback((newQuery?: string) => {
        const searchQuery = newQuery ?? query;
        if (searchQuery.trim()) {
            addToHistory(searchQuery);
        }
        // Force re-search by updating query if it's the same
        if (newQuery !== undefined) {
            setQuery(newQuery);
        }
    }, [query, addToHistory]);

    const clearSearch = useCallback(() => {
        setQuery('');
        setFilters(defaultFilters);
    }, [defaultFilters]);

    const resetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, [defaultFilters]);

    return {
        // Search state
        query,
        setQuery,
        filters,
        setFilters,
        options,
        setOptions,

        // Results
        results,
        totalResults: results.length,
        isSearching,

        // Search history
        searchHistory,
        addToHistory,
        clearHistory,

        // Suggestions
        suggestions,

        // Actions
        search,
        clearSearch,
        resetFilters
    };
};