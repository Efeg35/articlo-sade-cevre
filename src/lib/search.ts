// Advanced Search & Filter System
import { DocumentTemplate } from '@/types/templates';

export interface SearchableItem {
    id: string;
    title: string;
    content: string;
    tags: string[];
    category: string;
    type: 'template' | 'document' | 'archive';
    metadata?: Record<string, string | number | boolean>;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SearchFilter {
    categories?: string[];
    types?: string[];
    tags?: string[];
    dateRange?: {
        start?: Date;
        end?: Date;
    };
    complexity?: ('Kolay' | 'Orta' | 'Zor')[];
}

export interface SearchOptions {
    fuzzy?: boolean;
    caseSensitive?: boolean;
    wholeWord?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: 'relevance' | 'date' | 'title' | 'popularity';
    sortOrder?: 'asc' | 'desc';
    highlightMatches?: boolean;
}

export interface SearchResult {
    item: SearchableItem;
    score: number;
    matches: SearchMatch[];
    highlighted?: {
        title?: string;
        content?: string;
        tags?: string[];
    };
}

export interface SearchMatch {
    field: string;
    value: string;
    start: number;
    end: number;
    context: string;
}

// Text normalization for Turkish language support
export const normalizeText = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u')
        .trim();
};

// Create searchable text from item
export const createSearchableText = (item: SearchableItem): string => {
    const parts = [
        item.title,
        item.content,
        ...item.tags,
        item.category,
        item.type
    ];

    if (item.metadata) {
        Object.values(item.metadata).forEach(value => {
            if (typeof value === 'string') {
                parts.push(value);
            }
        });
    }

    return parts.join(' ').toLowerCase();
};

// Calculate search score based on relevance
export const calculateSearchScore = (
    query: string,
    item: SearchableItem,
    matches: SearchMatch[]
): number => {
    let score = 0;
    const normalizedQuery = normalizeText(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);

    // Title matches have higher weight
    const titleMatches = matches.filter(m => m.field === 'title').length;
    score += titleMatches * 3;

    // Tag matches have medium weight
    const tagMatches = matches.filter(m => m.field === 'tags').length;
    score += tagMatches * 2;

    // Content matches have base weight
    const contentMatches = matches.filter(m => m.field === 'content').length;
    score += contentMatches * 1;

    // Exact phrase match bonus
    const searchableText = createSearchableText(item);
    if (searchableText.includes(normalizedQuery)) {
        score += 5;
    }

    // All words present bonus
    const allWordsPresent = queryWords.every(word =>
        searchableText.includes(word)
    );
    if (allWordsPresent && queryWords.length > 1) {
        score += 2;
    }

    // Boost score for popular items
    if (item.metadata?.popular) {
        score *= 1.2;
    }

    // Recent items boost
    if (item.updatedAt) {
        const daysSinceUpdate = (Date.now() - item.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 7) {
            score *= 1.1;
        }
    }

    return score;
};

// Find matches in text
export const findMatches = (
    query: string,
    text: string,
    field: string,
    options: SearchOptions = {}
): SearchMatch[] => {
    const matches: SearchMatch[] = [];
    const normalizedQuery = normalizeText(query);
    const normalizedText = normalizeText(text);

    if (!normalizedQuery || !normalizedText) return matches;

    let searchText = normalizedText;
    let originalText = text;

    if (!options.caseSensitive) {
        searchText = normalizedText;
        originalText = text.toLowerCase();
    }

    const words = normalizedQuery.split(/\s+/).filter(w => w.length > 0);

    // Find individual word matches
    words.forEach(word => {
        let startIndex = 0;
        while (startIndex < searchText.length) {
            const index = searchText.indexOf(word, startIndex);
            if (index === -1) break;

            // Check for whole word match if required
            if (options.wholeWord) {
                const beforeChar = index > 0 ? searchText[index - 1] : ' ';
                const afterChar = index + word.length < searchText.length ?
                    searchText[index + word.length] : ' ';

                if (!/\s/.test(beforeChar) || !/\s/.test(afterChar)) {
                    startIndex = index + 1;
                    continue;
                }
            }

            // Create context (50 characters before and after)
            const contextStart = Math.max(0, index - 50);
            const contextEnd = Math.min(originalText.length, index + word.length + 50);
            const context = originalText.substring(contextStart, contextEnd);

            matches.push({
                field,
                value: originalText.substring(index, index + word.length),
                start: index,
                end: index + word.length,
                context: contextStart > 0 ? '...' + context : context
            });

            startIndex = index + word.length;
        }
    });

    // Find exact phrase matches
    if (words.length > 1) {
        let startIndex = 0;
        while (startIndex < searchText.length) {
            const index = searchText.indexOf(normalizedQuery, startIndex);
            if (index === -1) break;

            const contextStart = Math.max(0, index - 50);
            const contextEnd = Math.min(originalText.length, index + normalizedQuery.length + 50);
            const context = originalText.substring(contextStart, contextEnd);

            matches.push({
                field,
                value: originalText.substring(index, index + normalizedQuery.length),
                start: index,
                end: index + normalizedQuery.length,
                context: contextStart > 0 ? '...' + context : context
            });

            startIndex = index + normalizedQuery.length;
        }
    }

    return matches;
};

// Highlight search terms in text
export const highlightText = (
    text: string,
    query: string,
    options: SearchOptions = {}
): string => {
    if (!query || !text) return text;

    const matches = findMatches(query, text, 'content', options);
    if (matches.length === 0) return text;

    // Sort matches by position (desc) to avoid index shifting
    const sortedMatches = matches.sort((a, b) => b.start - a.start);

    let highlightedText = text;

    sortedMatches.forEach(match => {
        const before = highlightedText.substring(0, match.start);
        const matched = highlightedText.substring(match.start, match.end);
        const after = highlightedText.substring(match.end);

        highlightedText = before + `<mark class="bg-yellow-200 dark:bg-yellow-800">${matched}</mark>` + after;
    });

    return highlightedText;
};

// Apply filters to items
export const applyFilters = (
    items: SearchableItem[],
    filters: SearchFilter
): SearchableItem[] => {
    return items.filter(item => {
        // Category filter
        if (filters.categories && filters.categories.length > 0) {
            if (!filters.categories.includes(item.category)) {
                return false;
            }
        }

        // Type filter
        if (filters.types && filters.types.length > 0) {
            if (!filters.types.includes(item.type)) {
                return false;
            }
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
            const hasMatchingTag = filters.tags.some(tag =>
                item.tags.some(itemTag =>
                    normalizeText(itemTag).includes(normalizeText(tag))
                )
            );
            if (!hasMatchingTag) {
                return false;
            }
        }

        // Date range filter
        if (filters.dateRange) {
            const itemDate = item.updatedAt || item.createdAt;
            if (itemDate) {
                if (filters.dateRange.start && itemDate < filters.dateRange.start) {
                    return false;
                }
                if (filters.dateRange.end && itemDate > filters.dateRange.end) {
                    return false;
                }
            }
        }

        // Complexity filter (for templates)
        if (filters.complexity && filters.complexity.length > 0) {
            if (item.metadata?.complexity &&
                typeof item.metadata.complexity === 'string' &&
                !filters.complexity.includes(item.metadata.complexity as 'Kolay' | 'Orta' | 'Zor')) {
                return false;
            }
        }

        return true;
    });
};

// Main search function
export const searchItems = (
    items: SearchableItem[],
    query: string,
    filters: SearchFilter = {},
    options: SearchOptions = {}
): SearchResult[] => {
    // Apply filters first
    const filteredItems = applyFilters(items, filters);

    // If no query, return filtered items with basic relevance
    if (!query.trim()) {
        return filteredItems.map(item => ({
            item,
            score: item.metadata?.popular ? 2 : 1,
            matches: [],
            highlighted: options.highlightMatches ? {
                title: item.title,
                content: item.content,
                tags: item.tags
            } : undefined
        }));
    }

    const results: SearchResult[] = [];

    filteredItems.forEach(item => {
        const allMatches: SearchMatch[] = [];

        // Search in title
        const titleMatches = findMatches(query, item.title, 'title', options);
        allMatches.push(...titleMatches);

        // Search in content
        const contentMatches = findMatches(query, item.content, 'content', options);
        allMatches.push(...contentMatches);

        // Search in tags
        item.tags.forEach(tag => {
            const tagMatches = findMatches(query, tag, 'tags', options);
            allMatches.push(...tagMatches);
        });

        // Search in category
        const categoryMatches = findMatches(query, item.category, 'category', options);
        allMatches.push(...categoryMatches);

        // Only include items with matches
        if (allMatches.length > 0) {
            const score = calculateSearchScore(query, item, allMatches);

            const result: SearchResult = {
                item,
                score,
                matches: allMatches
            };

            // Add highlighting if requested
            if (options.highlightMatches) {
                result.highlighted = {
                    title: highlightText(item.title, query, options),
                    content: highlightText(item.content, query, options),
                    tags: item.tags.map(tag => highlightText(tag, query, options))
                };
            }

            results.push(result);
        }
    });

    // Sort results
    const sortedResults = results.sort((a, b) => {
        switch (options.sortBy) {
            case 'date': {
                const aDate = a.item.updatedAt || a.item.createdAt || new Date(0);
                const bDate = b.item.updatedAt || b.item.createdAt || new Date(0);
                return options.sortOrder === 'asc' ?
                    aDate.getTime() - bDate.getTime() :
                    bDate.getTime() - aDate.getTime();
            }

            case 'title':
                return options.sortOrder === 'asc' ?
                    a.item.title.localeCompare(b.item.title, 'tr') :
                    b.item.title.localeCompare(a.item.title, 'tr');

            case 'popularity': {
                const aPopular = a.item.metadata?.popular ? 1 : 0;
                const bPopular = b.item.metadata?.popular ? 1 : 0;
                return options.sortOrder === 'asc' ?
                    aPopular - bPopular :
                    bPopular - aPopular;
            }

            case 'relevance':
            default:
                return options.sortOrder === 'asc' ?
                    a.score - b.score :
                    b.score - a.score;
        }
    });

    // Apply pagination
    const start = options.offset || 0;
    const end = options.limit ? start + options.limit : sortedResults.length;

    return sortedResults.slice(start, end);
};

// Convert template to searchable item
export const templateToSearchableItem = (template: DocumentTemplate): SearchableItem => ({
    id: template.id,
    title: template.title,
    content: template.description + ' ' + template.template,
    tags: template.tags,
    category: template.category,
    type: 'template',
    metadata: {
        complexity: template.complexity,
        estimatedTime: template.estimatedTime,
        popular: template.popular,
        icon: template.icon,
        legalNote: template.legalNote
    }
});

// Search history management
export class SearchHistory {
    private static readonly STORAGE_KEY = 'artiklo_search_history';
    private static readonly MAX_ITEMS = 20;

    static getHistory(): string[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    static addToHistory(query: string): void {
        if (!query.trim()) return;

        try {
            const history = this.getHistory();
            const filtered = history.filter(item => item !== query);
            filtered.unshift(query);

            const trimmed = filtered.slice(0, this.MAX_ITEMS);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
        } catch (error) {
            console.error('Search history save error:', error);
        }
    }

    static clearHistory(): void {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.error('Search history clear error:', error);
        }
    }
}