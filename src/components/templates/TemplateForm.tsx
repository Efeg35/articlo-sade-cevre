import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Download, Copy, FileText } from 'lucide-react';
import { DocumentTemplate, TemplateData, GeneratedDocument } from '@/types/templates';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/useCredits';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
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
    const supabase = useSupabaseClient();
    const session = useSession();
    const user = session?.user || null;
    const { credits } = useCredits(user?.id);

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

        // Kredi kontrolü
        if (!credits || credits <= 0) {
            toast({
                title: "Yetersiz Kredi",
                description: "Belge oluşturmak için kredi gerekiyor. Lütfen kredi satın alın.",
                variant: "destructive"
            });
            return;
        }

        setIsGenerating(true);

        try {
            // Kredi düşürme işlemi
            if (user) {
                const { error: creditError } = await supabase.rpc('decrement_credit', {
                    user_id_param: user.id
                });

                if (creditError) {
                    console.error('Credit decrement error for template generation:', creditError);
                    toast({
                        title: "Kredi Azaltma Hatası",
                        description: "Krediniz azaltılamadı. Belge oluşturulamıyor.",
                        variant: "destructive"
                    });
                    return;
                }
            }

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
                description: "Şablonunuz başarıyla oluşturuldu. 1 kredi düşüldü.",
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
        <div className={Capacitor.isNativePlatform() ? 'mobile-template-form' : ''}>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent
                    className={`${Capacitor.isNativePlatform()
                        ? "mobile-template-form w-[100vw] h-[100vh] max-w-none max-h-none fixed inset-0 m-0 rounded-none border-0 overflow-y-auto"
                        : "max-w-2xl max-h-[90vh] w-[95vw] overflow-y-auto"
                        } p-3 md:p-6`}
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className="text-xl">{template.icon}</span>
                            {template.title}
                        </DialogTitle>
                        <DialogDescription>
                            {template.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className={`space-y-4 ${Capacitor.isNativePlatform() ? 'py-2' : 'py-4'}`}>
                        {/* Legal Notice */}
                        {template.legalNote && (
                            <div className={`${Capacitor.isNativePlatform() ? 'p-2' : 'p-4'} bg-yellow-50 border border-yellow-200 rounded-lg`}>
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className={`${Capacitor.isNativePlatform() ? 'h-4 w-4' : 'h-5 w-5'} text-yellow-600 mt-0.5`} />
                                    <div>
                                        <h4 className={`font-medium text-red-800 ${Capacitor.isNativePlatform() ? 'text-sm' : ''}`}>⚠️ Önemli Yasal Uyarı</h4>
                                        <p className={`${Capacitor.isNativePlatform() ? 'text-xs' : 'text-sm'} text-red-700 mt-1`}>
                                            <strong>Bu şablon hiçbir şekilde hukuki tavsiye değildir.</strong> Yalnızca bilgilendirme amaçlıdır.
                                            Bu belgeyi kullanmadan, imzalamadan veya göndermeden önce MUTLAKA kalifiye bir avukata danışın.
                                            {template.legalNote && ` ${template.legalNote}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {template.fields.map(renderField)}
                        </div>

                        {/* Action Buttons */}
                        <div className={`${Capacitor.isNativePlatform()
                            ? 'flex flex-col gap-2 pt-2 border-t'
                            : 'flex justify-between pt-4 border-t'
                            }`}>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className={Capacitor.isNativePlatform() ? 'w-full' : ''}
                            >
                                İptal
                            </Button>
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !credits || credits <= 0}
                                className={`flex items-center gap-2 ${Capacitor.isNativePlatform() ? 'w-full' : ''}`}
                            >
                                {isGenerating ? (
                                    <>Oluşturuluyor...</>
                                ) : (
                                    <>
                                        <FileText className="h-4 w-4" />
                                        {Capacitor.isNativePlatform() ? 'Belgeyi Oluştur (1 Kredi)' : 'Belgeyi Oluştur (1 Kredi)'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};