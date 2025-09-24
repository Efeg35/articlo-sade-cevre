import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Clock,
    Search,
    Sparkles,
    FileText,
    Home,
    Gavel,
    ShoppingCart,
    Heart,
    Star,
    ArrowRight
} from 'lucide-react';
import { WizardTemplate, WIZARD_CATEGORIES, WizardCategory } from '@/types/wizard';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
    templates: WizardTemplate[];
    onSelectTemplate: (template: WizardTemplate) => void;
    className?: string;
}

const categoryIcons = {
    [WIZARD_CATEGORIES.EMPLOYMENT]: FileText,
    [WIZARD_CATEGORIES.RENTAL]: Home,
    [WIZARD_CATEGORIES.LEGAL]: Gavel,
    [WIZARD_CATEGORIES.CONSUMER]: ShoppingCart,
    [WIZARD_CATEGORIES.FAMILY]: Heart,
};

const categoryNames = {
    [WIZARD_CATEGORIES.EMPLOYMENT]: 'İş Hukuku',
    [WIZARD_CATEGORIES.RENTAL]: 'Kira Hukuku',
    [WIZARD_CATEGORIES.LEGAL]: 'Hukuki Belgeler',
    [WIZARD_CATEGORIES.CONSUMER]: 'Tüketici Hakları',
    [WIZARD_CATEGORIES.FAMILY]: 'Aile Hukuku',
};

const difficultyColors = {
    kolay: 'bg-green-100 text-green-700 border-green-200',
    orta: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    zor: 'bg-red-100 text-red-700 border-red-200',
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    templates,
    onSelectTemplate,
    className
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<WizardCategory | 'all'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'time'>('name');

    // Filter templates
    const filteredTemplates = templates
        .filter(template => {
            const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'difficulty': {
                    const difficultyOrder = { kolay: 1, orta: 2, zor: 3 };
                    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
                }
                case 'time':
                    return a.estimatedTime.localeCompare(b.estimatedTime);
                default:
                    return 0;
            }
        });

    // Group templates by category
    const groupedTemplates = filteredTemplates.reduce((groups, template) => {
        const category = template.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(template);
        return groups;
    }, {} as Record<string, WizardTemplate[]>);

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                    <h1 className="text-3xl font-bold text-foreground">Belge Sihirbazı</h1>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Adım adım rehberlikle profesyonel belgelerinizi oluşturun.
                    Her wizard template'i size uygun belgeyi hazırlamanıza yardımcı olur.
                </p>
            </div>

            {/* Filters */}
            <Card className="bg-muted/30">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Template ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Category filter */}
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => setSelectedCategory(value as WizardCategory | 'all')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Kategori seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                                {Object.entries(WIZARD_CATEGORIES).map(([key, value]) => (
                                    <SelectItem key={value} value={value}>
                                        {categoryNames[value]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select
                            value={sortBy}
                            onValueChange={(value) => setSortBy(value as 'name' | 'difficulty' | 'time')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sıralama" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">İsme Göre</SelectItem>
                                <SelectItem value="difficulty">Zorluk Seviyesi</SelectItem>
                                <SelectItem value="time">Süre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Results count */}
                    <div className="mt-4 text-sm text-muted-foreground">
                        {filteredTemplates.length} template bulundu
                    </div>
                </CardContent>
            </Card>

            {/* Templates Grid */}
            {Object.keys(groupedTemplates).length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                            Template Bulunamadı
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Arama kriterlerinizi değiştirerek tekrar deneyin.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                Object.entries(groupedTemplates).map(([category, categoryTemplates]) => {
                    const IconComponent = categoryIcons[category as WizardCategory];

                    return (
                        <div key={category} className="space-y-4">
                            {/* Category header */}
                            <div className="flex items-center gap-2">
                                {IconComponent && <IconComponent className="h-5 w-5 text-muted-foreground" />}
                                <h2 className="text-xl font-semibold text-foreground">
                                    {categoryNames[category as WizardCategory] || category}
                                </h2>
                                <Badge variant="secondary" className="ml-auto">
                                    {categoryTemplates.length} template
                                </Badge>
                            </div>

                            {/* Templates in this category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categoryTemplates.map((template) => (
                                    <Card
                                        key={template.id}
                                        className={cn(
                                            "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                                            "group relative overflow-hidden",
                                            template.premium && "ring-2 ring-purple-200"
                                        )}
                                        onClick={() => onSelectTemplate(template)}
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-lg font-semibold group-hover:text-purple-600 transition-colors">
                                                    {template.name}
                                                </CardTitle>
                                                {template.premium && (
                                                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                                        PRO
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription className="text-sm line-clamp-2">
                                                {template.description}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="space-y-3">
                                            {/* Template info */}
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {template.estimatedTime}
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={difficultyColors[template.difficulty]}
                                                >
                                                    {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                                                </Badge>
                                            </div>

                                            {/* Tags */}
                                            {template.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {template.tags.slice(0, 3).map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {template.tags.length > 3 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{template.tags.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {/* Steps count */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">
                                                    {template.steps.length} adım
                                                </span>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    <span>Popüler</span>
                                                </div>
                                            </div>

                                            {/* Hover action */}
                                            <Button
                                                size="sm"
                                                className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Başlat
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </CardContent>

                                        {/* Premium gradient overlay */}
                                        {template.premium && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default TemplateSelector;