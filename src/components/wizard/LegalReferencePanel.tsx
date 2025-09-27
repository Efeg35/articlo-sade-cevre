/**
 * 🏛️ Enhanced Interactive Legal Reference Panel Component
 *
 * FAZ B: Wizard sırasında interaktif hukuki referanslar ve uyarılar
 * Search, filter, one-click insertion özelikleri ile Yargi-MCP entegrasyonu
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Scale,
    AlertTriangle,
    Lightbulb,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    BookOpen,
    Shield,
    Search,
    Filter,
    Copy,
    Plus,
    Star,
    Clock,
    Bookmark,
    Eye,
    Download
} from 'lucide-react';

import {
    legalReferenceService,
    LegalReferenceUtils,
    type LegalReference,
    type LegalValidationResult
} from '../../services/legalReferenceService';

import type {
    DynamicTemplate,
    UserAnswer
} from '../../types/wizard/WizardTypes';

interface LegalReferencePanelProps {
    template: DynamicTemplate;
    answers: Record<string, UserAnswer>;
    className?: string;
    compact?: boolean;
    onReferenceInsert?: (reference: LegalReference) => void;
    onReferenceBookmark?: (reference: LegalReference) => void;
}

interface FilterState {
    searchTerm: string;
    sourceFilter: 'all' | 'yargitay' | 'danistay' | 'law' | 'kvkk';
    relevanceFilter: 'all' | 'high' | 'medium';
    sortBy: 'relevance' | 'date' | 'alphabetical';
}

interface TabState {
    activeTab: 'references' | 'warnings' | 'suggestions' | 'bookmarks';
}

export const LegalReferencePanel: React.FC<LegalReferencePanelProps> = ({
    template,
    answers,
    className = '',
    compact = false,
    onReferenceInsert,
    onReferenceBookmark
}) => {
    const [references, setReferences] = useState<LegalReference[]>([]);
    const [validation, setValidation] = useState<LegalValidationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(!compact);
    const [error, setError] = useState<string | null>(null);

    // FAZ B: Interactive state management
    const [filterState, setFilterState] = useState<FilterState>({
        searchTerm: '',
        sourceFilter: 'all',
        relevanceFilter: 'all',
        sortBy: 'relevance'
    });

    const [tabState, setTabState] = useState<TabState>({
        activeTab: 'references'
    });

    const [bookmarkedReferences, setBookmarkedReferences] = useState<Set<string>>(new Set());
    const [expandedReferences, setExpandedReferences] = useState<Set<string>>(new Set());

    // Hukuki referansları yükle
    useEffect(() => {
        const loadLegalReferences = async () => {
            try {
                setLoading(true);
                setError(null);

                const [templateReferences, validationResult] = await Promise.all([
                    legalReferenceService.getLegalReferencesForTemplate(template),
                    legalReferenceService.validateLegalCompliance(template, answers)
                ]);

                setReferences(templateReferences);
                setValidation(validationResult);
            } catch (err) {
                console.error('Legal references loading failed:', err);
                setError('Hukuki referanslar yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        loadLegalReferences();
    }, [template, answers]);

    // FAZ B: Filtered and sorted references
    const filteredReferences = useMemo(() => {
        let filtered = references;

        // Search filter
        if (filterState.searchTerm) {
            const searchLower = filterState.searchTerm.toLowerCase();
            filtered = filtered.filter(ref =>
                ref.title.toLowerCase().includes(searchLower) ||
                ref.description.toLowerCase().includes(searchLower) ||
                ref.code.toLowerCase().includes(searchLower)
            );
        }

        // Source filter
        if (filterState.sourceFilter !== 'all') {
            filtered = filtered.filter(ref => {
                // Map source types
                const sourceMap: Record<string, string[]> = {
                    'yargitay': ['yargitay', 'court'],
                    'danistay': ['danistay', 'administrative'],
                    'law': ['law', 'legislation'],
                    'kvkk': ['kvkk', 'data_protection']
                };
                const allowedSources = sourceMap[filterState.sourceFilter] || [];
                return allowedSources.some(source => ref.code.toLowerCase().includes(source));
            });
        }

        // Relevance filter
        if (filterState.relevanceFilter !== 'all') {
            const relevanceThreshold = filterState.relevanceFilter === 'high' ? 85 : 70;
            filtered = filtered.filter(ref => ref.relevance_score >= relevanceThreshold);
        }

        // Sort
        filtered = [...filtered].sort((a, b) => {
            switch (filterState.sortBy) {
                case 'relevance':
                    return b.relevance_score - a.relevance_score;
                case 'alphabetical':
                    return a.title.localeCompare(b.title, 'tr');
                case 'date':
                default:
                    return b.relevance_score - a.relevance_score; // Fallback to relevance
            }
        });

        return filtered;
    }, [references, filterState]);

    const getConfidenceColor = (score: number): string => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getConfidenceLabel = (score: number): string => {
        if (score >= 80) return 'Yüksek Güven';
        if (score >= 60) return 'Orta Güven';
        return 'Düşük Güven';
    };

    // FAZ B: Interactive handlers
    const handleReferenceInsert = (reference: LegalReference) => {
        console.log('📝 Inserting reference:', reference.title);
        if (onReferenceInsert) {
            onReferenceInsert(reference);
        }
    };

    const handleReferenceBookmark = (reference: LegalReference) => {
        const newBookmarks = new Set(bookmarkedReferences);
        if (newBookmarks.has(reference.code)) {
            newBookmarks.delete(reference.code);
        } else {
            newBookmarks.add(reference.code);
        }
        setBookmarkedReferences(newBookmarks);

        if (onReferenceBookmark) {
            onReferenceBookmark(reference);
        }
    };

    const toggleReferenceExpanded = (referenceCode: string) => {
        const newExpanded = new Set(expandedReferences);
        if (newExpanded.has(referenceCode)) {
            newExpanded.delete(referenceCode);
        } else {
            newExpanded.add(referenceCode);
        }
        setExpandedReferences(newExpanded);
    };

    const copyReferenceText = async (reference: LegalReference) => {
        try {
            await navigator.clipboard.writeText(`${reference.title} - ${reference.description}`);
            console.log('📋 Reference copied to clipboard');
        } catch (error) {
            console.warn('📋 Failed to copy reference');
        }
    };

    if (loading) {
        return (
            <Card className={`${className} border-blue-200`}>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                        <Scale className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">Hukuki referanslar yükleniyor...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert className={className}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    const hasContent = references.length > 0 || (validation && (validation.warnings.length > 0 || validation.suggestions.length > 0));

    if (!hasContent) {
        return null;
    }

    return (
        <Card className={`${className} border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/30`}>
            <Collapsible open={expanded} onOpenChange={setExpanded}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-blue-100/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Scale className="h-5 w-5 text-blue-600" />
                                <CardTitle className={compact ? "text-base" : "text-lg"}>
                                    Hukuki Referanslar
                                </CardTitle>
                                {validation && (
                                    <Badge
                                        variant="outline"
                                        className={`${getConfidenceColor(validation.confidence_score)} border-current text-xs`}
                                    >
                                        {getConfidenceLabel(validation.confidence_score)} ({validation.confidence_score}%)
                                    </Badge>
                                )}
                                {filteredReferences.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {filteredReferences.length}
                                    </Badge>
                                )}
                            </div>
                            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className="pt-0">
                        {/* FAZ B: Interactive Search and Filter Controls */}
                        {!compact && filteredReferences.length > 0 && (
                            <div className="space-y-3 mb-4 p-3 bg-white/70 rounded-lg border border-blue-100">
                                {/* Search Bar */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Referansları ara..."
                                        value={filterState.searchTerm}
                                        onChange={(e) => setFilterState(prev => ({
                                            ...prev,
                                            searchTerm: e.target.value
                                        }))}
                                        className="pl-10 h-8 text-sm"
                                    />
                                </div>

                                {/* Filter Controls */}
                                <div className="grid grid-cols-2 gap-2">
                                    <Select
                                        value={filterState.sourceFilter}
                                        onValueChange={(value) => setFilterState(prev => ({
                                            ...prev,
                                            sourceFilter: value as FilterState['sourceFilter']
                                        }))}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="Kaynak" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tüm Kaynaklar</SelectItem>
                                            <SelectItem value="yargitay">Yargıtay</SelectItem>
                                            <SelectItem value="danistay">Danıştay</SelectItem>
                                            <SelectItem value="law">Kanunlar</SelectItem>
                                            <SelectItem value="kvkk">KVKK</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={filterState.relevanceFilter}
                                        onValueChange={(value) => setFilterState(prev => ({
                                            ...prev,
                                            relevanceFilter: value as FilterState['relevanceFilter']
                                        }))}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="İlgili" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tümü</SelectItem>
                                            <SelectItem value="high">Çok İlgili (%85+)</SelectItem>
                                            <SelectItem value="medium">İlgili (%70+)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* FAZ B: Enhanced Tabbed Content */}
                        <Tabs value={tabState.activeTab} onValueChange={(value) => setTabState(prev => ({
                            ...prev,
                            activeTab: value as TabState['activeTab']
                        }))}>
                            <TabsList className="grid w-full grid-cols-4 h-8">
                                <TabsTrigger value="references" className="text-xs">
                                    Referanslar ({filteredReferences.length})
                                </TabsTrigger>
                                <TabsTrigger value="warnings" className="text-xs">
                                    Uyarılar ({validation?.warnings.length || 0})
                                </TabsTrigger>
                                <TabsTrigger value="suggestions" className="text-xs">
                                    Öneriler ({validation?.suggestions.length || 0})
                                </TabsTrigger>
                                <TabsTrigger value="bookmarks" className="text-xs">
                                    <Bookmark className="h-3 w-3 mr-1" />
                                    ({bookmarkedReferences.size})
                                </TabsTrigger>
                            </TabsList>

                            {/* References Tab */}
                            <TabsContent value="references" className="mt-4 space-y-3">

                                {/* Uyarılar */}
                                {validation && validation.warnings.length > 0 && (
                                    <Alert className="border-orange-200 bg-orange-50">
                                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                                        <AlertDescription>
                                            <div className="font-medium mb-2 text-orange-800">Hukuki Uyarılar:</div>
                                            <ul className="space-y-1 text-sm text-orange-700">
                                                {validation.warnings.map((warning, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        <span>{warning}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Öneriler */}
                                {validation && validation.suggestions.length > 0 && (
                                    <Alert className="border-blue-200 bg-blue-50">
                                        <Lightbulb className="h-4 w-4 text-blue-600" />
                                        <AlertDescription>
                                            <div className="font-medium mb-2 text-blue-800">Hukuki Öneriler:</div>
                                            <ul className="space-y-1 text-sm text-blue-700">
                                                {validation.suggestions.map((suggestion, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="mr-2">💡</span>
                                                        <span>{suggestion}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {filteredReferences.length > 0 ? (
                                    <div className="space-y-2">
                                        {filteredReferences
                                            .slice(0, compact ? 3 : 8)
                                            .map((ref, index) => {
                                                const isExpanded = expandedReferences.has(ref.code);
                                                const isBookmarked = bookmarkedReferences.has(ref.code);

                                                return (
                                                    <div key={index} className="group relative bg-white/80 rounded-lg border border-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-sm">
                                                        {/* Main Reference Content */}
                                                        <div className="p-3">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1 space-y-2">
                                                                    {/* Header */}
                                                                    <div className="flex items-center space-x-2">
                                                                        <Badge variant="secondary" className="text-xs font-medium">
                                                                            {ref.code}
                                                                        </Badge>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`text-xs ${ref.relevance_score >= 85 ? 'text-green-600 border-green-300 bg-green-50' :
                                                                                ref.relevance_score >= 70 ? 'text-yellow-600 border-yellow-300 bg-yellow-50' :
                                                                                    'text-gray-600 border-gray-300 bg-gray-50'
                                                                                }`}
                                                                        >
                                                                            <Star className="h-3 w-3 mr-1" />
                                                                            {ref.relevance_score}%
                                                                        </Badge>

                                                                        {isBookmarked && (
                                                                            <Bookmark className="h-3 w-3 text-blue-600 fill-current" />
                                                                        )}
                                                                    </div>

                                                                    {/* Title & Description */}
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-800 leading-tight">
                                                                            {ref.title}
                                                                        </p>
                                                                        <p className={`text-xs text-gray-600 mt-1 ${!isExpanded && 'line-clamp-2'}`}>
                                                                            {ref.description}
                                                                        </p>
                                                                    </div>

                                                                    {/* Expanded Content */}
                                                                    {isExpanded && (
                                                                        <div className="pt-2 border-t border-gray-100 space-y-2">
                                                                            {ref.url && (
                                                                                <div className="flex items-center gap-2 text-xs text-blue-600">
                                                                                    <ExternalLink className="h-3 w-3" />
                                                                                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                                                        Kaynak Belgeye Git
                                                                                    </a>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Action Buttons */}
                                                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0"
                                                                        onClick={() => toggleReferenceExpanded(ref.code)}
                                                                        title={isExpanded ? "Daralt" : "Genişlet"}
                                                                    >
                                                                        <Eye className="h-3 w-3" />
                                                                    </Button>

                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0"
                                                                        onClick={() => handleReferenceBookmark(ref)}
                                                                        title="Kaydet"
                                                                    >
                                                                        <Bookmark className={`h-3 w-3 ${isBookmarked ? 'fill-current text-blue-600' : ''}`} />
                                                                    </Button>

                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0"
                                                                        onClick={() => copyReferenceText(ref)}
                                                                        title="Kopyala"
                                                                    >
                                                                        <Copy className="h-3 w-3" />
                                                                    </Button>

                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0"
                                                                        onClick={() => handleReferenceInsert(ref)}
                                                                        title="Belgeye Ekle"
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                        {filteredReferences.length > (compact ? 3 : 8) && (
                                            <div className="text-center py-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-xs text-blue-600"
                                                    onClick={() => setFilterState(prev => ({ ...prev, searchTerm: '' }))}
                                                >
                                                    +{filteredReferences.length - (compact ? 3 : 8)} diğer referans
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">
                                            {filterState.searchTerm ? 'Arama kriterlerine uygun referans bulunamadı' : 'Bu template için hukuki referans bulunamadı'}
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Warnings Tab */}
                            <TabsContent value="warnings" className="mt-4">
                                {validation && validation.warnings.length > 0 ? (
                                    <div className="space-y-2">
                                        {validation.warnings.map((warning, index) => (
                                            <Alert key={index} className="border-orange-200 bg-orange-50/50">
                                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                                <AlertDescription className="text-sm text-orange-800">
                                                    {warning}
                                                </AlertDescription>
                                            </Alert>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">Şu an için uyarı bulunmuyor</p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Suggestions Tab */}
                            <TabsContent value="suggestions" className="mt-4">
                                {validation && validation.suggestions.length > 0 ? (
                                    <div className="space-y-2">
                                        {validation.suggestions.map((suggestion, index) => (
                                            <Alert key={index} className="border-blue-200 bg-blue-50/50">
                                                <Lightbulb className="h-4 w-4 text-blue-600" />
                                                <AlertDescription className="text-sm text-blue-800">
                                                    {suggestion}
                                                </AlertDescription>
                                            </Alert>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">Şu an için öneri bulunmuyor</p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Bookmarks Tab */}
                            <TabsContent value="bookmarks" className="mt-4">
                                {bookmarkedReferences.size > 0 ? (
                                    <div className="space-y-2">
                                        {references
                                            .filter(ref => bookmarkedReferences.has(ref.code))
                                            .map((ref, index) => (
                                                <div key={index} className="p-2 bg-blue-50/50 rounded border border-blue-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium">{ref.title}</p>
                                                            <p className="text-xs text-gray-600">{ref.code}</p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0"
                                                            onClick={() => handleReferenceBookmark(ref)}
                                                        >
                                                            <Bookmark className="h-3 w-3 fill-current text-blue-600" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">Henüz kaydedilmiş referans yok</p>
                                        <p className="text-xs text-gray-400 mt-1">Referansları kaydetmek için ⭐ işaretine tıklayın</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>

                        {/* FAZ B: Enhanced Footer */}
                        <div className="mt-4 space-y-3">
                            <Separator />

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-2 bg-blue-50/50 rounded">
                                    <div className="text-xs font-medium text-blue-700">{filteredReferences.length}</div>
                                    <div className="text-xs text-blue-600">Referans</div>
                                </div>
                                <div className="p-2 bg-green-50/50 rounded">
                                    <div className="text-xs font-medium text-green-700">{bookmarkedReferences.size}</div>
                                    <div className="text-xs text-green-600">Kaydedilen</div>
                                </div>
                                <div className="p-2 bg-purple-50/50 rounded">
                                    <div className="text-xs font-medium text-purple-700">
                                        {validation ? validation.confidence_score : 0}%
                                    </div>
                                    <div className="text-xs text-purple-600">Güven</div>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <Alert className="border-gray-200 bg-gray-50/50">
                                <Shield className="h-4 w-4 text-gray-600" />
                                <AlertDescription className="text-xs text-gray-600">
                                    <strong>Önemli Uyarı:</strong> Bu hukuki referanslar bilgilendirme amaçlıdır ve hukuki tavsiye niteliği taşımaz.
                                    Kesin hukuki bilgi için mutlaka bir avukata danışınız.
                                </AlertDescription>
                            </Alert>

                            {/* Last Update Info */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    MCP Aktif
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};

// Compact version for sidebar/summary use
export const LegalReferenceSummary: React.FC<{
    template: DynamicTemplate;
    answers: Record<string, UserAnswer>;
    className?: string;
}> = ({ template, answers, className }) => {
    return (
        <LegalReferencePanel
            template={template}
            answers={answers}
            className={className}
            compact={true}
        />
    );
};

export default LegalReferencePanel;