import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Download, Copy, FileText } from 'lucide-react';
import { DocumentTemplate, TemplateData, GeneratedDocument } from '@/types/templates';
import { useToast } from '@/hooks/use-toast';
import { validateSecureInput } from '@/lib/validation';

interface TemplateFormProps {
    template: DocumentTemplate | null;
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (document: GeneratedDocument) => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
    template,
    isOpen,
    onClose,
    onGenerate
}) => {
    const [formData, setFormData] = useState<TemplateData>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleInputChange = (fieldId: string, value: string | number | Date) => {
        // Security validation for text inputs
        if (typeof value === 'string') {
            const securityCheck = validateSecureInput(value);
            if (!securityCheck.isValid) {
                setErrors(prev => ({
                    ...prev,
                    [fieldId]: securityCheck.error || 'Geçersiz girdi'
                }));
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));

        // Clear error when user starts typing
        if (errors[fieldId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldId];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        if (!template) return false;

        const newErrors: Record<string, string> = {};

        template.fields.forEach(field => {
            const value = formData[field.id];

            // Required field validation
            if (field.required && (!value || value.toString().trim() === '')) {
                newErrors[field.id] = `${field.label} gereklidir`;
                return;
            }

            // Skip validation if field is empty and not required
            if (!value || value.toString().trim() === '') return;

            // Length validation
            if (field.validation) {
                const stringValue = value.toString();

                if (field.validation.minLength && stringValue.length < field.validation.minLength) {
                    newErrors[field.id] = `${field.label} en az ${field.validation.minLength} karakter olmalıdır`;
                }

                if (field.validation.maxLength && stringValue.length > field.validation.maxLength) {
                    newErrors[field.id] = `${field.label} en fazla ${field.validation.maxLength} karakter olabilir`;
                }

                if (field.validation.pattern && !new RegExp(field.validation.pattern).test(stringValue)) {
                    newErrors[field.id] = `${field.label} formatı geçersiz`;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const processTemplate = (templateString: string, data: TemplateData): string => {
        let processed = templateString;

        // Replace field placeholders
        Object.entries(data).forEach(([key, value]) => {
            const placeholder = new RegExp(`{{${key}}}`, 'g');
            processed = processed.replace(placeholder, value.toString());
        });

        // Add current date if {{tarih}} placeholder exists
        const today = new Date().toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        processed = processed.replace(/{{tarih}}/g, today);

        return processed;
    };

    const handleGenerate = async () => {
        if (!template || !validateForm()) {
            return;
        }

        setIsGenerating(true);

        try {
            const generatedContent = processTemplate(template.template, formData);

            const generatedDocument: GeneratedDocument = {
                templateId: template.id,
                title: template.title,
                content: generatedContent,
                generatedAt: new Date(),
                templateData: formData
            };

            onGenerate(generatedDocument);

            toast({
                title: "Belge Oluşturuldu!",
                description: "Şablonunuz başarıyla dolduruldu.",
            });

            // Reset form
            setFormData({});
            setErrors({});
            onClose();

        } catch (error) {
            console.error('Template generation error:', error);
            toast({
                title: "Hata",
                description: "Belge oluşturulurken bir hata oluştu.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const renderField = (field: typeof template.fields[0]) => {
        const value = formData[field.id] || '';
        const error = errors[field.id];

        switch (field.type) {
            case 'text':
            case 'number':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={value.toString()}
                            onChange={(e) => handleInputChange(field.id,
                                field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                            )}
                            className={error ? 'border-red-500' : ''}
                        />
                        {error && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {error}
                            </p>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Textarea
                            id={field.id}
                            placeholder={field.placeholder}
                            value={value.toString()}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className={`min-h-[100px] ${error ? 'border-red-500' : ''}`}
                        />
                        {error && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {error}
                            </p>
                        )}
                    </div>
                );

            case 'select':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Select
                            value={value.toString()}
                            onValueChange={(value) => handleInputChange(field.id, value)}
                        >
                            <SelectTrigger className={error ? 'border-red-500' : ''}>
                                <SelectValue placeholder={field.placeholder || "Seçiniz"} />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {error && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {error}
                            </p>
                        )}
                    </div>
                );

            case 'date':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Input
                            id={field.id}
                            type="date"
                            value={value.toString()}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className={error ? 'border-red-500' : ''}
                        />
                        {error && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {error}
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (!template) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto mt-8 mb-8">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="text-xl">{template.icon}</span>
                        {template.title}
                    </DialogTitle>
                    <DialogDescription>
                        {template.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Legal Notice */}
                    {template.legalNote && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-yellow-800">Yasal Uyarı</h4>
                                    <p className="text-sm text-yellow-700 mt-1">{template.legalNote}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {template.fields.map(renderField)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            İptal
                        </Button>
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="flex items-center gap-2"
                        >
                            {isGenerating ? (
                                <>Oluşturuluyor...</>
                            ) : (
                                <>
                                    <FileText className="h-4 w-4" />
                                    Belgeyi Oluştur
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};