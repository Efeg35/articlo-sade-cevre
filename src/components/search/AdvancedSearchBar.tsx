import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import {
    Search,
    Filter,
    X,
    Clock,
    Settings,
    History,
    Sparkles,
    ChevronDown,
    SlidersHorizontal
} from 'lucide-react';
import { SearchFilter, SearchOptions } from '@/lib/search';

// Category labels mapping
const CATEGORY_LABELS: Record<string, string> = {
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

interface AdvancedSearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    filters: SearchFilter;
    onFiltersChange: (filters: SearchFilter) => void;
    options: SearchOptions;
    onOptionsChange: (options: SearchOptions) => void;
    suggestions: string[];
    searchHistory: string[];
    onSearch: (query?: string) => void;
    onClearHistory: () => void;
    totalResults: number;
    isSearching: boolean;
    placeholder?: string;
}

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
    query,
    onQueryChange,
    filters,
    onFiltersChange,
    options,
    onOptionsChange,
    suggestions,
    searchHistory,
    onSearch,
    onClearHistory,
    totalResults,
    isSearching,
    placeholder = "Şablon ara..."
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (value: string) => {
        onQueryChange(value);
        setShowSuggestions(value.length > 0);
    };

    const handleSuggestionSelect = (suggestion: string) => {
        onQueryChange(suggestion);
        setShowSuggestions(false);
        onSearch(suggestion);
        inputRef.current?.blur();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch(query);
            setShowSuggestions(false);
            inputRef.current?.blur();
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            inputRef.current?.blur();
        }
    };

    const clearQuery = () => {
        onQueryChange('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    // Count active filters
    const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
        if (!value) return count;
        if (Array.isArray(value) && value.length === 0) return count;
        if (key === 'dateRange' && (!value.start && !value.end)) return count;
        return count + 1;
    }, 0);

    const hasActiveSorting = options.sortBy !== 'relevance' || options.sortOrder !== 'desc';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full space-y-3">
            {/* Main Search Bar */}
            <div className="relative">
                <div className={`relative flex items-center border rounded-lg transition-all duration-200 ${isFocused ? 'ring-2 ring-primary/20 border-primary' : 'border-gray-300'
                    }`}>
                    <Search className="h-4 w-4 text-gray-400 ml-3" />

                    <Input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            setIsFocused(true);
                            if (query.length > 0) setShowSuggestions(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className="border-0 focus-visible:ring-0 pl-2 pr-20"
                    />

                    <div className="flex items-center gap-1 pr-3">
                        {query && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearQuery}
                                className="h-6 w-6 p-0 hover:bg-gray-100"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}

                        {isSearching && (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                        )}

                        <Button
                            onClick={() => onSearch(query)}
                            size="sm"
                            className="h-8"
                        >
                            Ara
                        </Button>
                    </div>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (isFocused || query.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                        {/* Current suggestions */}
                        {suggestions.length > 0 && (
                            <div className="p-2">
                                <div className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" />
                                    Öneriler
                                </div>
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionSelect(suggestion)}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Search history */}
                        {searchHistory.length > 0 && (
                            <>
                                <Separator />
                                <div className="p-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                            <History className="h-3 w-3" />
                                            Son Aramalar
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={onClearHistory}
                                            className="h-6 text-xs"
                                        >
                                            Temizle
                                        </Button>
                                    </div>
                                    {searchHistory.slice(0, 5).map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSuggestionSelect(item)}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-600"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {suggestions.length === 0 && searchHistory.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                Öneri bulunamadı
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    {/* Filters Button */}
                    <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Filtreler
                                {activeFiltersCount > 0 && (
                                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                                        {activeFiltersCount}
                                    </Badge>
                                )}
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="start">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Kategori</h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {[
                                            { value: 'mahkeme', label: 'Mahkeme' },
                                            { value: 'icra', label: 'İcra ve İflas' },
                                            { value: 'is_hukuku', label: 'İş Hukuku' },
                                            { value: 'kira', label: 'Kira ve Gayrimenkul' },
                                            { value: 'aile_hukuku', label: 'Aile Hukuku' },
                                            { value: 'borçlar_hukuku', label: 'Borçlar Hukuku' },
                                            { value: 'ceza_hukuku', label: 'Ceza Hukuku' },
                                            { value: 'idare_hukuku', label: 'İdare Hukuku' },
                                            { value: 'ticaret_hukuku', label: 'Ticaret Hukuku' }
                                        ].map(category => (
                                            <label key={category.value} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.categories?.includes(category.value) || false}
                                                    onChange={(e) => {
                                                        const newCategories = filters.categories || [];
                                                        if (e.target.checked) {
                                                            onFiltersChange({
                                                                ...filters,
                                                                categories: [...newCategories, category.value]
                                                            });
                                                        } else {
                                                            onFiltersChange({
                                                                ...filters,
                                                                categories: newCategories.filter(c => c !== category.value)
                                                            });
                                                        }
                                                    }}
                                                    className="rounded"
                                                />
                                                <span className="text-sm">{category.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium text-sm mb-2">Zorluk</h4>
                                    <div className="space-y-2">
                                        {['Kolay', 'Orta', 'Zor'].map(complexity => (
                                            <label key={complexity} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.complexity?.includes(complexity as 'Kolay' | 'Orta' | 'Zor') || false}
                                                    onChange={(e) => {
                                                        const newComplexity = filters.complexity || [];
                                                        if (e.target.checked) {
                                                            onFiltersChange({
                                                                ...filters,
                                                                complexity: [...newComplexity, complexity as 'Kolay' | 'Orta' | 'Zor']
                                                            });
                                                        } else {
                                                            onFiltersChange({
                                                                ...filters,
                                                                complexity: newComplexity.filter(c => c !== complexity)
                                                            });
                                                        }
                                                    }}
                                                    className="rounded"
                                                />
                                                <span className="text-sm">{complexity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Sort Options */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                Sıralama
                                {hasActiveSorting && (
                                    <Badge variant="secondary" className="ml-1 h-5 w-5 text-xs p-0">
                                        !
                                    </Badge>
                                )}
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-4" align="start">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Sıralama Kriteri</h4>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'relevance', label: 'İlgi Düzeyi' },
                                            { value: 'title', label: 'Başlık' },
                                            { value: 'popularity', label: 'Popülerlik' },
                                            { value: 'date', label: 'Tarih' }
                                        ].map(sort => (
                                            <label key={sort.value} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="sortBy"
                                                    checked={options.sortBy === sort.value}
                                                    onChange={() => onOptionsChange({
                                                        ...options,
                                                        sortBy: sort.value as 'relevance' | 'date' | 'title' | 'popularity'
                                                    })}
                                                    className="rounded"
                                                />
                                                <span className="text-sm">{sort.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium text-sm mb-2">Sıralama Yönü</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="sortOrder"
                                                checked={options.sortOrder === 'desc'}
                                                onChange={() => onOptionsChange({
                                                    ...options,
                                                    sortOrder: 'desc'
                                                })}
                                                className="rounded"
                                            />
                                            <span className="text-sm">Azalan</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="sortOrder"
                                                checked={options.sortOrder === 'asc'}
                                                onChange={() => onOptionsChange({
                                                    ...options,
                                                    sortOrder: 'asc'
                                                })}
                                                className="rounded"
                                            />
                                            <span className="text-sm">Artan</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                    {query ? (
                        <>
                            <span className="font-medium">{totalResults}</span> sonuç bulundu
                            {isSearching && <span className="ml-1">...</span>}
                        </>
                    ) : (
                        'Arama yapmak için bir terim girin'
                    )}
                </div>
            </div>

            {/* Active Filters Display */}
            {(activeFiltersCount > 0 || hasActiveSorting) && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500">Aktif filtreler:</span>

                    {filters.categories?.map(category => (
                        <Badge key={category} variant="secondary" className="text-xs">
                            Kategori: {CATEGORY_LABELS[category] || category}
                            <button
                                onClick={() => onFiltersChange({
                                    ...filters,
                                    categories: filters.categories?.filter(c => c !== category)
                                })}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}

                    {filters.complexity?.map(complexity => (
                        <Badge key={complexity} variant="secondary" className="text-xs">
                            Zorluk: {complexity}
                            <button
                                onClick={() => onFiltersChange({
                                    ...filters,
                                    complexity: filters.complexity?.filter(c => c !== complexity)
                                })}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}

                    {hasActiveSorting && (
                        <Badge variant="secondary" className="text-xs">
                            Sıralama: {options.sortBy} ({options.sortOrder})
                            <button
                                onClick={() => onOptionsChange({
                                    ...options,
                                    sortBy: 'relevance',
                                    sortOrder: 'desc'
                                })}
                                className="ml-1 hover:text-red-600"
                            >
                                ×
                            </button>
                        </Badge>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            onFiltersChange({});
                            onOptionsChange({
                                ...options,
                                sortBy: 'relevance',
                                sortOrder: 'desc'
                            });
                        }}
                        className="h-6 text-xs text-red-600 hover:text-red-700"
                    >
                        Tümünü Temizle
                    </Button>
                </div>
            )}
        </div>
    );
};