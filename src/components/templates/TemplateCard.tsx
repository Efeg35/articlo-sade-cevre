import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, FileText } from 'lucide-react';
import { DocumentTemplate } from '@/types/templates';
import { templateCategories } from '@/data/templates';

interface TemplateCardProps {
    template: DocumentTemplate;
    onSelect: (template: DocumentTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
    template,
    onSelect
}) => {
    const categoryInfo = templateCategories[template.category];

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/40 cursor-pointer h-full">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">{template.icon}</div>
                        <div className="flex-1">
                            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {template.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge
                                    variant="secondary"
                                    className={`text-xs ${categoryInfo.color} text-white`}
                                >
                                    {categoryInfo.icon} {categoryInfo.label}
                                </Badge>
                                {template.popular && (
                                    <Badge variant="outline" className="text-xs">
                                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                        Popüler
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {template.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {template.complexity}
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 3}
                        </Badge>
                    )}
                </div>

                <Button
                    onClick={() => onSelect(template)}
                    className="w-full text-sm"
                    variant="outline"
                >
                    Bu Şablonu Kullan
                </Button>
            </CardContent>
        </Card>
    );
};