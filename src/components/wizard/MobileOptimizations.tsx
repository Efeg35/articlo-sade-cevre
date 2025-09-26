/**
 * 📱 Mobile Optimization Utilities
 * 
 * FAZ B: Mobile responsive enhancements for wizard components
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Touch-friendly button wrapper
 */
export const TouchButton: React.FC<{
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}> = ({ children, className, onClick, disabled }) => (
    <button
        className={cn(
            // Base mobile-optimized touch target
            "min-h-[44px] min-w-[44px] p-3",
            // Touch feedback
            "active:scale-95 transition-transform duration-150",
            // Visual feedback
            "hover:bg-accent/10 active:bg-accent/20",
            // Disabled state
            disabled && "opacity-50 pointer-events-none",
            className
        )}
        onClick={onClick}
        disabled={disabled}
        type="button"
    >
        {children}
    </button>
);

/**
 * Mobile-optimized card spacing
 */
export const MobileCard: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => (
    <div className={cn(
        // Responsive padding
        "p-3 sm:p-4 md:p-6",
        // Responsive margins
        "mb-3 sm:mb-4 md:mb-6",
        // Border radius
        "rounded-lg sm:rounded-xl",
        className
    )}>
        {children}
    </div>
);

/**
 * Responsive text utilities
 */
export const ResponsiveText = {
    title: "text-lg sm:text-xl md:text-2xl font-bold",
    subtitle: "text-sm sm:text-base md:text-lg text-muted-foreground",
    body: "text-sm sm:text-base leading-relaxed",
    caption: "text-xs sm:text-sm text-muted-foreground",
    button: "text-sm sm:text-base font-medium"
};

/**
 * Mobile-optimized spacing utilities
 */
export const MobileSpacing = {
    section: "space-y-3 sm:space-y-4 md:space-y-6",
    card: "p-3 sm:p-4 md:p-6",
    gap: "gap-2 sm:gap-3 md:gap-4",
    margin: "mb-3 sm:mb-4 md:mb-6"
};

/**
 * Responsive grid layouts
 */
export const ResponsiveGrid = {
    auto: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6",
    cards: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",
    stats: "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4",
    sidebar: "grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6"
};

/**
 * Mobile-optimized modal wrapper
 */
export const MobileModal: React.FC<{
    children: React.ReactNode;
    isFullHeight?: boolean;
    className?: string;
}> = ({ children, isFullHeight = false, className }) => (
    <div className={cn(
        // Base mobile modal styling
        "w-full mx-auto",
        // Responsive max-width
        "max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl",
        // Mobile-first height
        isFullHeight ? "h-[95vh] sm:h-[90vh] md:h-[85vh]" : "max-h-[90vh]",
        // Responsive padding
        "p-2 sm:p-4 md:p-6",
        // Scrolling
        "overflow-hidden",
        className
    )}>
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {children}
        </div>
    </div>
);

/**
 * Mobile navigation helpers
 */
export const MobileNavigation = {
    buttonSize: "h-10 sm:h-11 px-4 sm:px-6",
    iconSize: "h-4 w-4 sm:h-5 sm:w-5",
    spacing: "gap-2 sm:gap-3",
    container: "flex items-center justify-between p-3 sm:p-4"
};

/**
 * Touch-optimized input wrapper
 */
export const TouchInput: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => (
    <div className={cn(
        // Touch-friendly sizing
        "min-h-[44px]",
        // Responsive padding
        "p-2 sm:p-3",
        // Visual styling
        "border rounded-md",
        "focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent",
        className
    )}>
        {children}
    </div>
);

/**
 * Responsive tabs optimization
 */
export const MobileTabs = {
    list: "grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 w-full",
    trigger: "text-xs sm:text-sm p-2 sm:p-3 min-h-[44px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
    content: "mt-3 sm:mt-4"
};

/**
 * Mobile-optimized progress indicators
 */
export const MobileProgress: React.FC<{
    current: number;
    total: number;
    compact?: boolean;
    className?: string;
}> = ({ current, total, compact = false, className }) => (
    <div className={cn(
        "w-full",
        compact ? "space-y-1" : "space-y-2 sm:space-y-3",
        className
    )}>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div
                className="bg-purple-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(current / total) * 100}%` }}
            />
        </div>

        {/* Progress text */}
        <div className={cn(
            "flex justify-between items-center",
            compact ? "text-xs" : "text-xs sm:text-sm",
            "text-muted-foreground"
        )}>
            <span>Adım {current} / {total}</span>
            <span>{Math.round((current / total) * 100)}%</span>
        </div>
    </div>
);

/**
 * Mobile breakpoint utilities
 */
export const useMobileBreakpoint = () => {
    const [isMobile, setIsMobile] = React.useState(false);
    const [isTablet, setIsTablet] = React.useState(false);

    React.useEffect(() => {
        const checkBreakpoint = () => {
            setIsMobile(window.innerWidth < 640); // sm breakpoint
            setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024); // between sm and lg
        };

        checkBreakpoint();
        window.addEventListener('resize', checkBreakpoint);
        return () => window.removeEventListener('resize', checkBreakpoint);
    }, []);

    return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

/**
 * Mobile-optimized alert/notification
 */
export const MobileAlert: React.FC<{
    title?: string;
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    className?: string;
}> = ({ title, message, type = 'info', className }) => {
    const typeStyles = {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        error: "bg-red-50 border-red-200 text-red-800",
        success: "bg-green-50 border-green-200 text-green-800"
    };

    return (
        <div className={cn(
            "border-l-4 p-3 sm:p-4 rounded-md",
            typeStyles[type],
            className
        )}>
            {title && (
                <h4 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">
                    {title}
                </h4>
            )}
            <p className="text-xs sm:text-sm leading-relaxed">
                {message}
            </p>
        </div>
    );
};

/**
 * Performance optimized list for mobile
 */
export const MobileList: React.FC<{
    items: Array<{
        id: string;
        title: string;
        subtitle?: string;
        badge?: string;
        action?: () => void;
    }>;
    className?: string;
}> = ({ items, className }) => (
    <div className={cn("space-y-2 sm:space-y-3", className)}>
        {items.map((item) => (
            <div
                key={item.id}
                className={cn(
                    // Touch-friendly sizing
                    "min-h-[44px] p-3 sm:p-4",
                    // Interactive styling
                    "border rounded-lg hover:bg-accent/50 transition-colors",
                    // Touch feedback
                    item.action && "cursor-pointer active:scale-[0.98]"
                )}
                onClick={item.action}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium truncate">
                            {item.title}
                        </h4>
                        {item.subtitle && (
                            <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">
                                {item.subtitle}
                            </p>
                        )}
                    </div>
                    {item.badge && (
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full ml-2">
                            {item.badge}
                        </span>
                    )}
                </div>
            </div>
        ))}
    </div>
);