import React from 'react';
import { Check } from 'lucide-react';
import { ProgressBarProps } from '@/types/wizard';
import { cn } from '@/lib/utils';

export const ProgressBar: React.FC<ProgressBarProps> = ({
    current,
    total,
    showLabels = true,
    className = ""
}) => {
    const progress = Math.round((current / total) * 100);

    return (
        <div className={cn("w-full", className)}>
            {/* Progress text */}
            {showLabels && (
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                        Adım {current} / {total}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                        %{progress} tamamlandı
                    </span>
                </div>
            )}

            {/* Progress bar container */}
            <div className="relative">
                {/* Background bar */}
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    {/* Progress fill */}
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Step indicators */}
                <div className="absolute top-0 w-full flex justify-between items-center">
                    {Array.from({ length: total }, (_, index) => {
                        const stepIndex = index + 1;
                        const isCompleted = stepIndex < current;
                        const isCurrent = stepIndex === current;
                        const isUpcoming = stepIndex > current;

                        return (
                            <div
                                key={stepIndex}
                                className={cn(
                                    "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300",
                                    "bg-background relative -translate-y-2",
                                    {
                                        // Completed step
                                        "border-green-500 bg-green-500 text-white": isCompleted,

                                        // Current step  
                                        "border-purple-500 bg-purple-500 text-white shadow-lg scale-110": isCurrent,

                                        // Upcoming step
                                        "border-muted-foreground/30 text-muted-foreground": isUpcoming,
                                    }
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-3 w-3" />
                                ) : (
                                    <span className="text-xs font-semibold">{stepIndex}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step labels (optional, for smaller number of steps) */}
            {showLabels && total <= 5 && (
                <div className="flex justify-between mt-8 px-3">
                    {Array.from({ length: total }, (_, index) => {
                        const stepIndex = index + 1;
                        const isCompleted = stepIndex < current;
                        const isCurrent = stepIndex === current;

                        return (
                            <div
                                key={stepIndex}
                                className={cn(
                                    "text-xs text-center transition-colors duration-300",
                                    "max-w-16 truncate",
                                    {
                                        "text-green-600 font-medium": isCompleted,
                                        "text-purple-600 font-semibold": isCurrent,
                                        "text-muted-foreground": !isCompleted && !isCurrent,
                                    }
                                )}
                            >
                                {isCurrent ? "Devam ediyor" : isCompleted ? "Tamamlandı" : "Beklemede"}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// Compact version for mobile/small spaces
export const CompactProgressBar: React.FC<ProgressBarProps> = ({
    current,
    total,
    className = ""
}) => {
    const progress = Math.round((current / total) * 100);

    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-center gap-3">
                {/* Compact progress text */}
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {current}/{total}
                </span>

                {/* Compact progress bar */}
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Compact percentage */}
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    %{progress}
                </span>
            </div>
        </div>
    );
};

export default ProgressBar;