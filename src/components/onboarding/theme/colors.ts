/**
 * Monokrom Renk Paleti - Yeni Onboarding Tasarımı
 * 
 * Bu dosya yeni monokrom (siyah-beyaz-gri) tema için
 * tüm renk tanımlarını içerir.
 */

export const monochromeTheme = {
    // Ana Renkler
    primary: '#0A0A0A',        // Siyah - Ana metin ve vurgular
    background: '#FFFFFF',      // Beyaz - Ana background

    // Gri Tonları
    gray: {
        100: '#A1A1A1',         // Gri-1 - İkincil metin
        200: '#E5E5E5',         // Gri-2 - Border ve separator  
        300: '#F9F9F9',         // Gri-3 - Subtle background
    },

    // Metin Renkleri
    text: {
        primary: '#0A0A0A',      // Ana metin
        secondary: '#A1A1A1',    // İkincil metin
        tertiary: '#A1A1A1',     // Üçüncül metin
        disabled: '#E5E5E5',     // Devre dışı metin
    },

    // Background Varyasyonları
    surface: {
        primary: '#FFFFFF',       // Ana surface
        secondary: '#F9F9F9',     // İkincil surface
        elevated: '#FFFFFF',      // Yükseltilmiş surface (cards, modals)
        overlay: 'rgba(10, 10, 10, 0.05)', // Overlay background
    },

    // Border ve Separator
    border: {
        primary: '#E5E5E5',       // Ana border
        secondary: '#F9F9F9',     // İkincil border
        focus: '#0A0A0A',         // Focus border
        hover: '#A1A1A1',         // Hover border
    },

    // Interactive States
    interactive: {
        default: '#0A0A0A',       // Default state
        hover: '#A1A1A1',         // Hover state
        active: '#0A0A0A',        // Active state
        disabled: '#E5E5E5',      // Disabled state
    },

    // Button Varyasyonları
    button: {
        primary: {
            background: '#0A0A0A',
            text: '#FFFFFF',
            border: '#0A0A0A',
            hover: {
                background: '#A1A1A1',
                text: '#FFFFFF',
                border: '#A1A1A1',
            }
        },
        secondary: {
            background: '#F9F9F9',
            text: '#0A0A0A',
            border: '#E5E5E5',
            hover: {
                background: '#E5E5E5',
                text: '#0A0A0A',
                border: '#A1A1A1',
            }
        },
        outline: {
            background: 'transparent',
            text: '#0A0A0A',
            border: '#0A0A0A',
            hover: {
                background: '#0A0A0A',
                text: '#FFFFFF',
                border: '#0A0A0A',
            }
        },
        ghost: {
            background: 'transparent',
            text: '#0A0A0A',
            border: 'transparent',
            hover: {
                background: '#F9F9F9',
                text: '#0A0A0A',
                border: 'transparent',
            }
        }
    },

    // Progress ve Success States
    progress: {
        background: '#F9F9F9',
        fill: '#0A0A0A',
        completed: '#0A0A0A',
    },

    // Shadow Definitions (subtle için)
    shadow: {
        sm: '0 1px 2px 0 rgba(10, 10, 10, 0.05)',
        md: '0 4px 6px -1px rgba(10, 10, 10, 0.1), 0 2px 4px -2px rgba(10, 10, 10, 0.1)',
        lg: '0 10px 15px -3px rgba(10, 10, 10, 0.1), 0 4px 6px -4px rgba(10, 10, 10, 0.1)',
        xl: '0 20px 25px -5px rgba(10, 10, 10, 0.1), 0 8px 10px -6px rgba(10, 10, 10, 0.1)',
    }
} as const;

// CSS Custom Properties Export (CSS Variables için)
export const monochromeThemeCSSVars = {
    '--color-primary': monochromeTheme.primary,
    '--color-background': monochromeTheme.background,
    '--color-text-primary': monochromeTheme.text.primary,
    '--color-text-secondary': monochromeTheme.text.secondary,
    '--color-gray-100': monochromeTheme.gray[100],
    '--color-gray-200': monochromeTheme.gray[200],
    '--color-gray-300': monochromeTheme.gray[300],
    '--color-surface-primary': monochromeTheme.surface.primary,
    '--color-surface-secondary': monochromeTheme.surface.secondary,
    '--color-border-primary': monochromeTheme.border.primary,
    '--color-border-secondary': monochromeTheme.border.secondary,
} as const;

// Helper functions
export const getTextColor = (variant: 'primary' | 'secondary' | 'tertiary' | 'disabled' = 'primary') => {
    return monochromeTheme.text[variant];
};

export const getSurfaceColor = (variant: 'primary' | 'secondary' | 'elevated' = 'primary') => {
    return monochromeTheme.surface[variant];
};

export const getBorderColor = (variant: 'primary' | 'secondary' | 'focus' | 'hover' = 'primary') => {
    return monochromeTheme.border[variant];
};

export const getButtonColors = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary') => {
    return monochromeTheme.button[variant];
};