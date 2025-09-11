import React, { useState } from 'react';
import { Search, SlidersHorizontal, CalendarRange, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { FilterState } from '../types';

interface DocumentFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    activeFilterCount: number;
    resetFilters: () => void;
    removeFilter: (filterType: keyof FilterState | 'dateFrom' | 'dateTo' | 'search') => void;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    activeFilterCount,
    resetFilters,
    removeFilter
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Arama ve Filtreler */}
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
                                        resetFilters();
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
                                onClick={() => removeFilter('dateFrom')}
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
                                onClick={() => removeFilter('dateTo')}
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
                                onClick={() => removeFilter('hasSummary')}
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
                                onClick={() => removeFilter('hasActionPlan')}
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
                                onClick={() => removeFilter('sortBy')}
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                    >
                        Tümünü Temizle
                    </Button>
                </div>
            )}
        </div>
    );
};