import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { WizardStepProps, WizardField, WizardStepAnswers } from '@/types/wizard';
import { RealTimeRiskWarning } from './RealTimeRiskWarning';

export const WizardStep: React.FC<WizardStepProps> = ({
    step,
    answers,
    onUpdateAnswers,
    errors = {}
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors: formErrors, isValid },
        watch
    } = useForm<WizardStepAnswers>({
        resolver: zodResolver(step.validation),
        defaultValues: answers,
        mode: 'onChange'
    });

    // Watch all form values and update parent - FIXED infinite loop
    const watchedValues = watch();
    React.useEffect(() => {
        onUpdateAnswers(watchedValues);
    }, [JSON.stringify(watchedValues), onUpdateAnswers]); // Use JSON.stringify to compare values

    // Render different field types
    const renderField = (field: WizardField) => {
        const hasError = formErrors[field.id] || errors[field.id];
        const errorMessage = formErrors[field.id]?.message || errors[field.id];

        return (
            <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-base font-medium">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>

                <Controller
                    name={field.id}
                    control={control}
                    render={({ field: controllerField }) => {
                        switch (field.type) {
                            case 'text':
                            case 'email':
                            case 'tel':
                                return (
                                    <Input
                                        {...controllerField}
                                        value={controllerField.value as string || ''}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        className={cn(hasError && "border-destructive")}
                                    />
                                );

                            case 'textarea':
                                return (
                                    <Textarea
                                        {...controllerField}
                                        value={controllerField.value as string || ''}
                                        placeholder={field.placeholder}
                                        rows={4}
                                        className={cn(hasError && "border-destructive")}
                                    />
                                );

                            case 'number':
                                return (
                                    <Input
                                        {...controllerField}
                                        value={controllerField.value as number || ''}
                                        type="number"
                                        placeholder={field.placeholder}
                                        onChange={(e) => controllerField.onChange(e.target.valueAsNumber)}
                                        className={cn(hasError && "border-destructive")}
                                    />
                                );

                            case 'select':
                                return (
                                    <Select
                                        onValueChange={controllerField.onChange}
                                        defaultValue={controllerField.value as string}
                                    >
                                        <SelectTrigger className={cn(hasError && "border-destructive")}>
                                            <SelectValue placeholder={field.placeholder || "Seçiniz..."} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {field.options?.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                );

                            case 'radio':
                                return (
                                    <RadioGroup
                                        onValueChange={controllerField.onChange}
                                        defaultValue={controllerField.value as string}
                                        className="space-y-3"
                                    >
                                        {field.options?.map((option) => (
                                            <div key={option.value} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                                                <Label htmlFor={`${field.id}-${option.value}`} className="font-normal">
                                                    {option.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                );

                            case 'checkbox':
                                if (field.options && field.options.length > 1) {
                                    // Multiple checkboxes
                                    return (
                                        <div className="space-y-3">
                                            {field.options.map((option) => (
                                                <div key={option.value} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`${field.id}-${option.value}`}
                                                        checked={(controllerField.value as string[])?.includes(option.value)}
                                                        onCheckedChange={(checked) => {
                                                            const currentValues = controllerField.value as string[] || [];
                                                            if (checked) {
                                                                controllerField.onChange([...currentValues, option.value]);
                                                            } else {
                                                                controllerField.onChange(
                                                                    currentValues.filter(v => v !== option.value)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor={`${field.id}-${option.value}`} className="font-normal">
                                                        {option.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                } else {
                                    // Single checkbox
                                    return (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={field.id}
                                                checked={controllerField.value as boolean}
                                                onCheckedChange={controllerField.onChange}
                                            />
                                            <Label htmlFor={field.id} className="font-normal">
                                                {field.options?.[0]?.label || field.placeholder}
                                            </Label>
                                        </div>
                                    );
                                }

                            case 'date':
                                return (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !controllerField.value && "text-muted-foreground",
                                                    hasError && "border-destructive"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {controllerField.value ? (
                                                    format(controllerField.value as Date, "dd MMMM yyyy", { locale: tr })
                                                ) : (
                                                    field.placeholder || "Tarih seçiniz"
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={controllerField.value as Date}
                                                onSelect={controllerField.onChange}
                                                locale={tr}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                );

                            default:
                                return (
                                    <Input
                                        {...controllerField}
                                        value={controllerField.value as string || ''}
                                        placeholder={field.placeholder}
                                        className={cn(hasError && "border-destructive")}
                                    />
                                );
                        }
                    }}
                />

                {/* Help text */}
                {field.helpText && (
                    <div className="flex items-start gap-2 mt-1">
                        <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{field.helpText}</p>
                    </div>
                )}

                {/* Error message */}
                {errorMessage && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertDescription className="text-sm">
                            {errorMessage.toString()}
                        </AlertDescription>
                    </Alert>
                )}

                {/* ⚠️ FAZ 2: Gerçek Zamanlı Risk Uyarısı */}
                <RealTimeRiskWarning
                    inputValue={watchedValues[field.id]}
                    fieldName={field.id}
                    templateCategory={deriveTemplateCategory(step.id)}
                    allAnswers={watchedValues}
                />
            </div>
        );
    };

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
                    {step.title}
                </CardTitle>
                {step.description && (
                    <CardDescription className="text-base text-muted-foreground mt-2">
                        {step.description}
                    </CardDescription>
                )}
            </CardHeader>

            <CardContent className="space-y-6">
                <form className="space-y-6">
                    {step.fields.map(renderField)}
                </form>

                {/* Form validation status */}
                {Object.keys(formErrors).length > 0 && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            Lütfen tüm gerekli alanları doğru şekilde doldurun.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
};

/**
 * Step ID'sinden template kategorisini türet
 */
function deriveTemplateCategory(stepId: string): string {
    if (stepId.includes('kira') || stepId.includes('rent')) {
        return 'Konut Hukuku';
    }
    if (stepId.includes('is') || stepId.includes('work') || stepId.includes('employment')) {
        return 'İş Hukuku';
    }
    if (stepId.includes('tuketici') || stepId.includes('consumer')) {
        return 'Tüketici Hukuku';
    }
    if (stepId.includes('aile') || stepId.includes('family')) {
        return 'Aile Hukuku';
    }
    return 'general';
}

export default WizardStep;