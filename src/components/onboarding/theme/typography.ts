/**
 * Typography Sistemi - Inter Font
 * 
 * Yeni onboarding tasarımı için Inter font ailesi 
 * ile oluşturulan typography sistemi
 */

// Font Families
export const fontFamily = {
    primary: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'source-code-pro', 'monospace'],
} as const;

// Font Weights
export const fontWeight = {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
} as const;

// Font Sizes (rem based)
export const fontSize = {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
} as const;

// Line Heights
export const lineHeight = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
} as const;

// Letter Spacing
export const letterSpacing = {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
} as const;

// Typography Presets
export const typography = {
    // Headings
    heading: {
        h1: {
            fontFamily: fontFamily.primary.join(', '),
            fontSize: fontSize['4xl'],
            fontWeight: fontWeight.bold,
            lineHeight: lineHeight.tight,
            letterSpacing: letterSpacing.tight,
        },
        h2: {
            fontFamily: fontFamily.primary.join(', '),
            fontSize: fontSize['3xl'],
            fontWeight: fontWeight.bold,
            lineHeight: lineHeight.tight,
            letterSpacing: letterSpacing.tight,
        },
        h3: {
            fontFamily: fontFamily.primary.join(', '),
            fontSize: fontSize['2xl'],
            fontWeight: fontWeight.semibold,
            lineHeight: lineHeight.tight,
            letterSpacing: letterSpacing.normal,
        },
        h4: {
            fontFamily: fontFamily.primary.join(', '),
            fontSize: fontSize.xl,
            fontWeight: fontWeight.semibold,
            lineHeight: lineHeight.normal,
            letterSpacing: letterSpacing.normal,
        }
    },

    // Body Text
    body: {
        large: {
            fontFamily: fontFamily.primary.join(', '),
            fontSize: fontSize.lg,
            fontWeight: fontWeight.regular,
            lineHeight: lineHeight.relaxed,
            letterSpacing: letterSpacing.normal,
        },
        medium: {
            fontFamily: fontFamily.primary.join(', '),
            fontSize: fontSize.base,
            fontWeight: fontWeight.regular,
            lineHeight: lineHeight.normal,
            letterSpacing: letterSpacing.normal,
        },
        small: {
            fontFamily: fontFamily.primary.join(', '),
            fontSize: fontSize.sm,
            fontWeight: fontWeight.regular,
            lineHeight: lineHeight.normal,
            letterSpacing: letterSpacing.normal,
        },
        xs: {
            fontFamily: fontFamily.primary.join(', '),
            fontSize: fontSize.xs,
            fontWeight: fontWeight.regular,
            lineHeight: lineHeight.normal,
            letterSpacing: letterSpacing.wide,
        }
    },

    // Button Text
    button: {
        large: {
            fontFamily: fontFamily.primary.join(', '),
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            lineHeight: lineHeight.tight,
            letterSpacing: letterSpacing.wide,
        },
        medium: {
            fontFamily: fontFamily.primary.join(', '),
            fontSize: fontSize.sm,
            fontWeight: fontWeight.semibold,
            lineHeight: lineHeight.tight,
            letterSpacing: letterSpacing.wide,
        },
        small: {
            fontFamily: fontFamily.primary.join(', '),
            fontSize: fontSize.xs,
            fontWeight: fontWeight.semibold,
            lineHeight: lineHeight.tight,
            letterSpacing: letterSpacing.wider,
        }
    },

    // Caption ve Labels
    caption: {
        fontFamily: fontFamily.primary.join(', '),
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.wide,
    },

    label: {
        fontFamily: fontFamily.primary.join(', '),
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.normal,
    },

    // Special Typography
    quote: {
        fontFamily: fontFamily.primary.join(', '),
        fontSize: fontSize.lg,
        fontWeight: fontWeight.regular,
        lineHeight: lineHeight.relaxed,
        letterSpacing: letterSpacing.normal,
        fontStyle: 'italic',
    },

    code: {
        fontFamily: fontFamily.mono.join(', '),
        fontSize: fontSize.sm,
        fontWeight: fontWeight.regular,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.normal,
    }
} as const;

// Helper Functions
export const getTypographyStyles = (variant: keyof typeof typography) => {
    if (variant === 'heading') {
        return typography.heading.h1; // Default to h1
    }
    if (variant === 'body') {
        return typography.body.medium; // Default to medium
    }
    if (variant === 'button') {
        return typography.button.medium; // Default to medium
    }
    return typography[variant];
};

export const getHeadingStyles = (level: 'h1' | 'h2' | 'h3' | 'h4') => {
    return typography.heading[level];
};

export const getBodyStyles = (size: 'large' | 'medium' | 'small' | 'xs' = 'medium') => {
    return typography.body[size];
};

export const getButtonStyles = (size: 'large' | 'medium' | 'small' = 'medium') => {
    return typography.button[size];
};

// CSS Class Names (Tailwind-like)
export const typographyClasses = {
    // Headings
    'text-h1': 'text-4xl font-bold leading-tight tracking-tight',
    'text-h2': 'text-3xl font-bold leading-tight tracking-tight',
    'text-h3': 'text-2xl font-semibold leading-tight',
    'text-h4': 'text-xl font-semibold leading-normal',

    // Body
    'text-body-lg': 'text-lg font-normal leading-relaxed',
    'text-body': 'text-base font-normal leading-normal',
    'text-body-sm': 'text-sm font-normal leading-normal',
    'text-body-xs': 'text-xs font-normal leading-normal tracking-wide',

    // Button
    'text-button-lg': 'text-base font-semibold leading-tight tracking-wide',
    'text-button': 'text-sm font-semibold leading-tight tracking-wide',
    'text-button-sm': 'text-xs font-semibold leading-tight tracking-wider',

    // Special
    'text-caption': 'text-xs font-medium leading-tight tracking-wide',
    'text-label': 'text-sm font-medium leading-tight',
} as const;